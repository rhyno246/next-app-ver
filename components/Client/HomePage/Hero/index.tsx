import Image from "next/image";
import HeroCarousal from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import { GET_SALE_PRODUCT } from "@/graphql/queries";
import { Products } from "@/types/type";
import { useQuery } from "@apollo/client/react";
import LoadingComponent from "@/components/Common/LoadingComponent";
import Link from "next/link";

type SaleProduct = {
  saleProducts: Products[];
};

const Hero = () => {
  const { data: productData, loading } =
    useQuery<SaleProduct>(GET_SALE_PRODUCT);
  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              {/* <!-- bg shapes --> */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />

              <HeroCarousal />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              {productData?.saleProducts.map((item) => (
                <div
                  key={item.id}
                  className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5"
                >
                  <div className="flex items-center gap-14">
                    <div>
                      <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-20">
                        <Link href={`/shop/${item.id}`}>{item.title}</Link>
                      </h2>

                      <div>
                        {item.categories &&
                          item.categories.map((item) => (
                            <span
                              key={item.category.name}
                              className="font-medium text-dark-4 text-custom-sm mb-1.5"
                            >
                              {item.category.name}
                            </span>
                          ))}

                        <span className="flex items-center gap-3">
                          <span className="font-medium text-heading-5 text-red">
                            $
                            {item.sale > 0
                              ? (
                                  item.price -
                                  (item.price * item.sale) / 100
                                ).toFixed(0)
                              : item.price}
                          </span>
                          {item.sale > 0 && (
                            <span className="font-medium text-2xl text-dark-4 line-through">
                              ${item.price}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div>
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={128}
                          height={161}
                          className="w-full h-full"
                          objectFit="cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}
      <HeroFeature />
    </section>
  );
};

export default Hero;
