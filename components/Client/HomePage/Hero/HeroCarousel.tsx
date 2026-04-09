"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css";
import Image from "next/image";
import { Slide } from "@/types/type";
import { GET_ALL_SLIDES } from "@/graphql/queries";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";

type SlidesResponse = {
  allSlides: Slide[];
};

const HeroCarousal = () => {
  const { data: slideData } = useQuery<SlidesResponse>(GET_ALL_SLIDES);
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {slideData?.allSlides.map((item) => (
        <>
          <SwiperSlide key={item.id}>
            <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
              <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
                <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
                  <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                    30%
                  </span>
                  <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                    Sale
                    <br />
                    Off
                  </span>
                </div>

                <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
                  <a href="#">{item.title}</a>
                </h1>

                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                  at ipsum at risus euismod lobortis in
                </p>

                <Link
                  href="/shop"
                  className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
                >
                  Shop Now
                </Link>
              </div>

              <div>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={351}
                  height={350}
                  priority
                />
              </div>
            </div>
          </SwiperSlide>
        </>
      ))}
    </Swiper>
  );
};

export default HeroCarousal;
