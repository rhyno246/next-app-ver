import ProductDetail from "@/components/Client/ShopPage/ProductDetail";

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const { slug } = await params;
  return {
    title: `Products - ${slug}`,
    description: `This is Products Page for ${slug}`,
  };
};
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  console.log(slug);
  return <ProductDetail slug={slug} />;
}
