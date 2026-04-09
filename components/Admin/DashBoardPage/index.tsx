"use client";

import dynamic from "next/dynamic";
import PopularProduct from "./PopularProduct";
import TopComments from "./TopComments";
import TopUserOrder from "./TopUserOrder";

const OrderUser = dynamic(() => import("./OrderUser"));
const UserRegister = dynamic(() => import("./UserRegister"));
const UserVisit = dynamic(() => import("./UserVisit"));

export default function DashBoardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <h3 className="mb-3 uppercase font-bold text-xl py-2">
          Order in month
        </h3>
        <OrderUser />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <h3 className="mb-3 uppercase font-bold text-xl py-2">
          Top User order
        </h3>
        <TopUserOrder />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <h3 className="mb-3 uppercase font-bold text-xl py-2">User visit</h3>
        <UserVisit />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <h3 className="mb-3 uppercase font-bold text-xl py-2">
          Popular Product
        </h3>
        <PopularProduct />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <h3 className="mb-3 uppercase font-bold text-xl py-2">
          User register in week
        </h3>
        <UserRegister />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <h3 className="mb-3 uppercase font-bold text-xl py-2">Top Comments</h3>
        <TopComments />
      </div>
    </div>
  );
}
