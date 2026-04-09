import Link from "next/link";

type BreadcrumbProps = {
  title: string;
  pages: string[];
  detail?: string;
};

const Breadcrumb = ({ title, pages, detail }: BreadcrumbProps) => {
  return (
    <div className="overflow-hidden shadow-breadcrumb pt-52.25 sm:pt-38.75 lg:pt-23.75 xl:pt-41.25">
      <div className="border-t border-gray-3">
        <div className="max-w-292.5 w-full mx-auto px-4 sm:px-8 xl:px-0 py-5 xl:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="font-semibold text-dark text-xl sm:text-2xl xl:text-custom-2">
              {title}
            </h1>

            <ul className="flex items-center gap-2">
              <li className="text-custom-sm hover:text-blue">
                <Link href="/">Home /</Link>
              </li>
              {pages?.map((page, index) => {
                const href = `/${pages.slice(0, index + 1).join("/")}`;
                const isLastPage = !detail && index === pages.length - 1;

                return (
                  <li
                    key={index}
                    className={`text-custom-sm capitalize ${
                      isLastPage ? "text-blue" : "hover:text-blue"
                    }`}
                  >
                    {isLastPage ? page : <Link href={href}>{page} /</Link>}
                  </li>
                );
              })}

              {detail && (
                <li className="text-custom-sm text-blue capitalize">
                  {detail}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
