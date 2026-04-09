"use client";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import Breadcrumb from "@/components/Common/Breadcrumb";
import CustomInput from "@/components/Common/CustomInput";
import LoadingComponent from "@/components/Common/LoadingComponent";
import { CREATE_COMMENT } from "@/graphql/mutations";
import { GET_COMMENTS, GET_ME, GET_PRODUCT_DETAIL } from "@/graphql/queries";
import { commentSchema, CommentSchema } from "@/schema/commentSchema";
import { useCartStore } from "@/store/cart-store";
import { CommentsResponse, MeResponse, Products } from "@/types/type";
import { Toast } from "@/utils/toast";
import { useMutation, useQuery } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CommentsSection from "./CommentsSection";
type Props = {
  slug: string;
};

type ProductsResponse = {
  productDetail: Products;
};

const ProductDetail = ({ slug }: Props) => {
  const { data } = useQuery<MeResponse>(GET_ME, {
    fetchPolicy: "network-only",
  });
  const user = data?.me;
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const searchParams = useSearchParams();
  const tab = searchParams.get("rating") ?? "";
  const shippingEmail = searchParams.get("shipingEmail") ?? "";
  const shippngName = searchParams.get("shippingName") ?? "";
  const [activeTab, setActiveTab] = useState(`${tab ? "tabThree" : "tabOne"}`);
  const { openPreviewModal } = usePreviewSlider();
  const tabs = [
    {
      id: "tabOne",
      title: "Description",
    },
    {
      id: "tabThree",
      title: "Reviews",
    },
  ];
  const { data: productData, loading: loadingProduct } =
    useQuery<ProductsResponse>(GET_PRODUCT_DETAIL, {
      variables: { slug: slug },
    });
  const [previewImg, setPreviewImg] = useState(0);
  const allImages = [
    productData?.productDetail.image,
    ...(productData?.productDetail.images?.map((i) => i.url) ?? []),
  ].filter(Boolean) as string[];
  const currentImage = allImages[previewImg];

  const handlePreviewSlider = () => {
    openPreviewModal(allImages, previewImg);
  };

  const [quantiTy, setQuantity] = useState(1);

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (productData?.productDetail) {
      addToCart({
        ...productData.productDetail,
        quantity: quantiTy,
      });
    }
  };

  const refetchQueries = [
    {
      query: GET_COMMENTS,
      variables: { productId: productData?.productDetail.id },
    },
    {
      query: GET_PRODUCT_DETAIL,
      variables: { slug: slug },
    },
  ];

  const { control, handleSubmit, reset } = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      name: "",
      email: "",
      text: "",
    },
  });

  const [createComments, { loading: loadingComment }] = useMutation(
    CREATE_COMMENT,
    {
      refetchQueries,
      onCompleted: () => Toast.success("Comment created successfully"),
      onError: (error) => Toast.error(error.message),
    },
  );

  const onSubmit: SubmitHandler<CommentSchema> = (data) => {
    if (rating === 0) {
      Toast.error("Please select a rating");
      return;
    }
    createComments({
      variables: {
        data: {
          productId: productData?.productDetail.id,
          content: data.text,
          rating,
          email: shippingEmail || data.email,
          name: shippngName || data.name,
          authorId: user?.id || null,
        },
      },
    });
    reset();
    setRating(0);
  };

  const { data: commentData } = useQuery<CommentsResponse>(GET_COMMENTS, {
    variables: {
      productId: productData?.productDetail.id,
    },
  });

  const comments = commentData?.getComments ?? [];
  const resetRef = useRef(reset);

  useEffect(() => {
    if (user) {
      resetRef.current({
        email: user.shippingAddress?.email || shippingEmail || "",
        name: user.shippingAddress?.name || shippngName || "",
        text: "",
      });
    } else if (shippngName || shippngName) {
      resetRef.current({
        email: shippingEmail || "",
        name: shippngName || "",
        text: "",
      });
    }
  }, [user, shippingEmail, shippngName]);

  if (!productData?.productDetail || loadingProduct) {
    return <LoadingComponent />;
  }

  return (
    <>
      <Breadcrumb title={"Shop Details"} pages={[`shop`]} detail={slug} />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
            <div className="lg:max-w-[570px] w-full">
              <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative flex items-center justify-center">
                <div>
                  <button
                    onClick={handlePreviewSlider}
                    aria-label="button for zoom"
                    className="gallery__Image w-11 h-11 rounded-[5px] bg-gray-1 shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-blue absolute top-4 lg:top-6 right-4 lg:right-6 z-50"
                  >
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.11493 1.14581L9.16665 1.14581C9.54634 1.14581 9.85415 1.45362 9.85415 1.83331C9.85415 2.21301 9.54634 2.52081 9.16665 2.52081C7.41873 2.52081 6.17695 2.52227 5.23492 2.64893C4.31268 2.77292 3.78133 3.00545 3.39339 3.39339C3.00545 3.78133 2.77292 4.31268 2.64893 5.23492C2.52227 6.17695 2.52081 7.41873 2.52081 9.16665C2.52081 9.54634 2.21301 9.85415 1.83331 9.85415C1.45362 9.85415 1.14581 9.54634 1.14581 9.16665L1.14581 9.11493C1.1458 7.43032 1.14579 6.09599 1.28619 5.05171C1.43068 3.97699 1.73512 3.10712 2.42112 2.42112C3.10712 1.73512 3.97699 1.43068 5.05171 1.28619C6.09599 1.14579 7.43032 1.1458 9.11493 1.14581ZM16.765 2.64893C15.823 2.52227 14.5812 2.52081 12.8333 2.52081C12.4536 2.52081 12.1458 2.21301 12.1458 1.83331C12.1458 1.45362 12.4536 1.14581 12.8333 1.14581L12.885 1.14581C14.5696 1.1458 15.904 1.14579 16.9483 1.28619C18.023 1.43068 18.8928 1.73512 19.5788 2.42112C20.2648 3.10712 20.5693 3.97699 20.7138 5.05171C20.8542 6.09599 20.8542 7.43032 20.8541 9.11494V9.16665C20.8541 9.54634 20.5463 9.85415 20.1666 9.85415C19.787 9.85415 19.4791 9.54634 19.4791 9.16665C19.4791 7.41873 19.4777 6.17695 19.351 5.23492C19.227 4.31268 18.9945 3.78133 18.6066 3.39339C18.2186 3.00545 17.6873 2.77292 16.765 2.64893ZM1.83331 12.1458C2.21301 12.1458 2.52081 12.4536 2.52081 12.8333C2.52081 14.5812 2.52227 15.823 2.64893 16.765C2.77292 17.6873 3.00545 18.2186 3.39339 18.6066C3.78133 18.9945 4.31268 19.227 5.23492 19.351C6.17695 19.4777 7.41873 19.4791 9.16665 19.4791C9.54634 19.4791 9.85415 19.787 9.85415 20.1666C9.85415 20.5463 9.54634 20.8541 9.16665 20.8541H9.11494C7.43032 20.8542 6.09599 20.8542 5.05171 20.7138C3.97699 20.5693 3.10712 20.2648 2.42112 19.5788C1.73512 18.8928 1.43068 18.023 1.28619 16.9483C1.14579 15.904 1.1458 14.5696 1.14581 12.885L1.14581 12.8333C1.14581 12.4536 1.45362 12.1458 1.83331 12.1458ZM20.1666 12.1458C20.5463 12.1458 20.8541 12.4536 20.8541 12.8333V12.885C20.8542 14.5696 20.8542 15.904 20.7138 16.9483C20.5693 18.023 20.2648 18.8928 19.5788 19.5788C18.8928 20.2648 18.023 20.5693 16.9483 20.7138C15.904 20.8542 14.5696 20.8542 12.885 20.8541H12.8333C12.4536 20.8541 12.1458 20.5463 12.1458 20.1666C12.1458 19.787 12.4536 19.4791 12.8333 19.4791C14.5812 19.4791 15.823 19.4777 16.765 19.351C17.6873 19.227 18.2186 18.9945 18.6066 18.6066C18.9945 18.2186 19.227 17.6873 19.351 16.765C19.4777 15.823 19.4791 14.5812 19.4791 12.8333C19.4791 12.4536 19.787 12.1458 20.1666 12.1458Z"
                        fill=""
                      />
                    </svg>
                  </button>

                  {currentImage && (
                    <Image
                      src={currentImage}
                      alt="products-details"
                      width={400}
                      height={400}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                {allImages &&
                  allImages.map((url, key) => (
                    <button
                      onClick={() => setPreviewImg(key)}
                      key={key}
                      className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-blue ${
                        key === previewImg
                          ? "border-blue"
                          : "border-transparent"
                      }`}
                    >
                      <Image width={50} height={50} src={url} alt="thumbnail" />
                    </button>
                  ))}
              </div>
            </div>
            <div className="max-w-[539px] w-full">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-xl sm:text-2xl xl:text-custom-3 text-dark">
                  {productData?.productDetail.title}
                </h2>

                {productData?.productDetail.sale > 0 && (
                  <div className="inline-flex font-medium text-custom-sm text-white bg-blue rounded py-0.5 px-2.5">
                    {productData?.productDetail.sale}%
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-5.5 mb-4.5">
                <div className="flex items-center gap-2.5">
                  {/* <!-- stars --> */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`fill-current ${star <= productData.productDetail.rating ? "text-[#FFA645]" : "text-gray-3"}`}
                        width="15"
                        height="15"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_375_9172)">
                          <path
                            d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    ))}
                  </div>

                  <span> ({comments.length} customer reviews) </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {productData?.productDetail.stock > 0 ? (
                    <>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_375_9221)">
                          <path
                            d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.78125 19.4688 10 19.4688C15.2188 19.4688 19.4688 15.2188 19.4688 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.59375 18.0625 10.0312C18.0625 14.4375 14.4375 18.0625 10 18.0625Z"
                            fill="#22AD5C"
                          />
                          <path
                            d="M12.6875 7.09374L8.9688 10.7187L7.2813 9.06249C7.00005 8.78124 6.56255 8.81249 6.2813 9.06249C6.00005 9.34374 6.0313 9.78124 6.2813 10.0625L8.2813 12C8.4688 12.1875 8.7188 12.2812 8.9688 12.2812C9.2188 12.2812 9.4688 12.1875 9.6563 12L13.6875 8.12499C13.9688 7.84374 13.9688 7.40624 13.6875 7.12499C13.4063 6.84374 12.9688 6.84374 12.6875 7.09374Z"
                            fill="#22AD5C"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_375_9221">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span className="text-green">
                        {productData?.productDetail.stock} In Stock{" "}
                      </span>
                    </>
                  ) : (
                    <span className="text-red"> Sold Out </span>
                  )}
                </div>
              </div>
              <h3 className="font-medium text-custom-1 mb-4.5">
                <span className="text-dark">
                  $
                  {productData?.productDetail.sale > 0
                    ? (
                        productData.productDetail.price -
                        (productData.productDetail.price *
                          productData.productDetail.sale) /
                          100
                      ).toFixed(0)
                    : productData?.productDetail.price}
                </span>
                {productData?.productDetail.sale > 0 && (
                  <span className="text-dark-4 line-through ml-2">
                    ${productData.productDetail.price}
                  </span>
                )}
              </h3>
              <ul className="flex flex-col gap-2">
                <li className="flex items-center gap-2.5">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3589 8.35863C13.603 8.11455 13.603 7.71882 13.3589 7.47475C13.1149 7.23067 12.7191 7.23067 12.4751 7.47475L8.75033 11.1995L7.5256 9.97474C7.28152 9.73067 6.8858 9.73067 6.64172 9.97474C6.39764 10.2188 6.39764 10.6146 6.64172 10.8586L8.30838 12.5253C8.55246 12.7694 8.94819 12.7694 9.19227 12.5253L13.3589 8.35863Z"
                      fill="#3C50E0"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.0003 1.04169C5.05277 1.04169 1.04199 5.05247 1.04199 10C1.04199 14.9476 5.05277 18.9584 10.0003 18.9584C14.9479 18.9584 18.9587 14.9476 18.9587 10C18.9587 5.05247 14.9479 1.04169 10.0003 1.04169ZM2.29199 10C2.29199 5.74283 5.74313 2.29169 10.0003 2.29169C14.2575 2.29169 17.7087 5.74283 17.7087 10C17.7087 14.2572 14.2575 17.7084 10.0003 17.7084C5.74313 17.7084 2.29199 14.2572 2.29199 10Z"
                      fill="#3C50E0"
                    />
                  </svg>
                  Free delivery available
                </li>

                <li className="flex items-center gap-2.5">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3589 8.35863C13.603 8.11455 13.603 7.71882 13.3589 7.47475C13.1149 7.23067 12.7191 7.23067 12.4751 7.47475L8.75033 11.1995L7.5256 9.97474C7.28152 9.73067 6.8858 9.73067 6.64172 9.97474C6.39764 10.2188 6.39764 10.6146 6.64172 10.8586L8.30838 12.5253C8.55246 12.7694 8.94819 12.7694 9.19227 12.5253L13.3589 8.35863Z"
                      fill="#3C50E0"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.0003 1.04169C5.05277 1.04169 1.04199 5.05247 1.04199 10C1.04199 14.9476 5.05277 18.9584 10.0003 18.9584C14.9479 18.9584 18.9587 14.9476 18.9587 10C18.9587 5.05247 14.9479 1.04169 10.0003 1.04169ZM2.29199 10C2.29199 5.74283 5.74313 2.29169 10.0003 2.29169C14.2575 2.29169 17.7087 5.74283 17.7087 10C17.7087 14.2572 14.2575 17.7084 10.0003 17.7084C5.74313 17.7084 2.29199 14.2572 2.29199 10Z"
                      fill="#3C50E0"
                    />
                  </svg>
                  Sales 30% Off Use Code: PROMO30
                </li>
              </ul>
              <div className="flex flex-row gap-4.5 border-y border-gray-3 mt-7.5 mb-9 py-9">
                {productData?.productDetail.categories?.map((item) => (
                  <div key={item.category.id}>
                    <Link href={`/${item.category.slug}`}>
                      {item.category.name}
                    </Link>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4.5">
                <div className="flex items-center rounded-md border border-gray-3">
                  <button
                    aria-label="button for remove product"
                    className="flex items-center justify-center w-12 h-12 ease-out duration-200 hover:text-blue"
                    onClick={handleDecreaseQuantity}
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.33301 10.0001C3.33301 9.53984 3.7061 9.16675 4.16634 9.16675H15.833C16.2932 9.16675 16.6663 9.53984 16.6663 10.0001C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10.0001Z"
                        fill=""
                      />
                    </svg>
                  </button>

                  <span className="flex items-center justify-center w-16 h-12 border-x border-gray-4">
                    {quantiTy}
                  </span>

                  <button
                    aria-label="button for add product"
                    className="flex items-center justify-center w-12 h-12 ease-out duration-200 hover:text-blue"
                    onClick={handleIncreaseQuantity}
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.33301 10C3.33301 9.5398 3.7061 9.16671 4.16634 9.16671H15.833C16.2932 9.16671 16.6663 9.5398 16.6663 10C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10Z"
                        fill=""
                      />
                      <path
                        d="M9.99967 16.6667C9.53944 16.6667 9.16634 16.2936 9.16634 15.8334L9.16634 4.16671C9.16634 3.70647 9.53944 3.33337 9.99967 3.33337C10.4599 3.33337 10.833 3.70647 10.833 4.16671L10.833 15.8334C10.833 16.2936 10.4599 16.6667 9.99967 16.6667Z"
                        fill=""
                      />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={productData.productDetail.stock === 0}
                  className={`inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark ${productData.productDetail.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Purchase Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-gray-2 py-20">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center bg-white rounded-[10px] shadow-1 gap-5 xl:gap-12.5 py-4.5 px-4 sm:px-6">
            {tabs.map((item, key) => (
              <button
                key={key}
                onClick={() => setActiveTab(item.id)}
                className={`font-medium lg:text-lg ease-out duration-200 hover:text-blue relative before:h-0.5 before:bg-blue before:absolute before:left-0 before:bottom-0 before:ease-out before:duration-200 hover:before:w-full ${
                  activeTab === item.id
                    ? "text-blue before:w-full"
                    : "text-dark before:w-0"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
          {/* <!-- tab content one start --> */}
          <div>
            <div
              className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${
                activeTab === "tabOne" ? "flex" : "hidden"
              }`}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: productData.productDetail.description || "",
                }}
              />
            </div>
          </div>
          {/* <!-- tab content one end --> */}

          {/* <!-- tab content three start --> */}
          <div>
            <div
              className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${
                activeTab === "tabThree" ? "flex" : "hidden"
              }`}
            >
              <div className="max-w-[570px] w-full">
                <CommentsSection productId={productData.productDetail.id} />
              </div>
              {shippingEmail && (
                <div className="max-w-[550px] w-full">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="font-medium text-2xl text-dark mb-3.5">
                      Add a Review
                    </h2>

                    <p className="mb-6">
                      Your email address will not be published. Required fields
                      are marked *
                    </p>

                    <div className="flex items-center gap-3 mb-7.5">
                      <span>Your Rating*</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                          >
                            <svg
                              className={`fill-current ${(hoverRating || rating) >= star ? "text-[#FFA645]" : "text-gray-3"}`}
                              width="20"
                              height="20"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_375_9172)">
                                <path
                                  d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z"
                                  fill=""
                                />
                              </g>
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl bg-white shadow-1 p-4 sm:p-6">
                      <div className="mb-5">
                        <div className="w-full">
                          <CustomInput
                            control={control}
                            name="text"
                            label="Comment"
                            placeholder="type your review"
                          />
                        </div>
                        <div className="w-full">
                          <CustomInput
                            control={control}
                            name="email"
                            label="email"
                            placeholder="type email"
                          />
                        </div>
                        <div className="w-full">
                          <CustomInput
                            control={control}
                            name="name"
                            label="Name"
                            placeholder="type your name"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loadingComment}
                        className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-70"
                      >
                        {loadingComment ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
          {/* <!-- tab content three end --> */}
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
