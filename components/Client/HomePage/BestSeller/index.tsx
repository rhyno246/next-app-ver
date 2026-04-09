import LoadingComponent from "@/components/Common/LoadingComponent";
import { GET_BEST_SELLER } from "@/graphql/queries";
import { Products } from "@/types/type";
import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";
type ProductBestSeller = {
  productBestSeller: Products[];
};
const BestSeller = () => {
  const { data, loading } = useQuery<ProductBestSeller>(GET_BEST_SELLER);
  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <Image
                src="/images/icons/icon-07.svg"
                alt="icon"
                width={17}
                height={17}
              />
              This Month
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              Best Sellers
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
          {data?.productBestSeller.map((item) => (
            <ProductItem item={item} key={item.id} />
          ))}
        </div>

        <div className="text-center mt-12.5">
          <Link
            href="/shop"
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
