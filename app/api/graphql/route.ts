
import { ApolloServer, HeaderMap } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { resolvers } from '../../../graphql/resolvers';
import { typeDefs } from '../../../graphql/schema';
import { createContext } from '@/graphql/context';
import { Context } from '@/types/type';
import { NextRequest, NextResponse } from 'next/server';

// ═══════════════════════════════════════════
// Server Setup
// ═══════════════════════════════════════════
const server = new ApolloServer<Context>({
  resolvers,
  typeDefs,
  introspection: process.env.NODE_ENV !== "production",
  plugins: [
    ...(process.env.NODE_ENV === "development"
      ? [
          (await import("@apollo/server/plugin/landingPage/default")).ApolloServerPluginLandingPageLocalDefault()
        ]
      : []
    ),
  ],
});

await server.start();

// ═══════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════
function buildHeaderMap(req: NextRequest): HeaderMap {
  const map = new HeaderMap();
  req.headers.forEach((value, key) => map.set(key, value));
  return map;
}

function applySetCookies(response: NextResponse, context: Awaited<ReturnType<typeof createContext>>): void {
  for (const { name, value, options } of context.setCookies) {
    response.cookies.set(name, value, options);
  }
}

// ═══════════════════════════════════════════
// GET — Apollo Sandbox UI
// ═══════════════════════════════════════════
export async function GET(req: NextRequest) {
  const result = await server.executeHTTPGraphQLRequest({
    httpGraphQLRequest: {
      method: 'GET',
      headers: buildHeaderMap(req),
      body: null,
      search: new URL(req.url).search,
    },
    context: async () => createContext(req),
  });

  if (result.body.kind !== 'complete') {
    return new NextResponse('Not found', { status: 404 });
  }

  const headers: Record<string, string> = {};
  result.headers.forEach((value, key) => { headers[key] = value; });

  return new NextResponse(result.body.string, {
    status: result.status ?? 200,
    headers,
  });
}

// ═══════════════════════════════════════════
// POST — GraphQL Operations
// ═══════════════════════════════════════════
export async function POST(req: NextRequest) {
  let body: { query?: string; variables?: Record<string, unknown> };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body?.query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  const context = await createContext(req);

  const result = await server.executeOperation(
    { query: body.query, variables: body.variables },
    { contextValue: context }
  );

  const data = result.body.kind === 'single' ? result.body.singleResult : {};
  const response = NextResponse.json(data, { status: 200 });

  applySetCookies(response, context);

  return response;
}