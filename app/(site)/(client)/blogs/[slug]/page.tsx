import BlogDetails from "@/components/Client/BlogsPage/BlockDetail";

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const { slug } = await params;
  return {
    title: `Blogs Page - ${slug}`,
    description: `This is Blogs Page for ${slug}`,
  };
};
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  return <BlogDetails slug={slug} />;
}
