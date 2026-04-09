import CategoryPage from "@/components/Client/CategoryPage";

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const { slug } = await params;
  return {
    title: `Products - Category ${slug}`,
    description: `This is Products Page for ${slug}`,
  };
};
export default async function Category({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  return <CategoryPage slug={slug} />;
}
