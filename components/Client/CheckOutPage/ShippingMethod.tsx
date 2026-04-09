import React, { useState } from "react";
import Image from "next/image";
type ShippingOption = {
  id: string;
  label: string;
  price: number;
  description: string;
};

const shippingOptions: ShippingOption[] = [
  { id: "free", label: "Free Shipping", price: 0, description: "Free" },
  {
    id: "fedex",
    label: "FedEx",
    price: 10.99,
    description: "Standard Shipping",
  },
  { id: "dhl", label: "DHL", price: 12.5, description: "Standard Shipping" },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};
const ShippingMethod = ({ value, onChange }: Props) => {
  return (
    <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
      <h3 className="font-medium text-xl text-dark mb-5">Shipping Method</h3>
      <div className="flex flex-col gap-3">
        {shippingOptions.map((option) => (
          <label
            key={option.id}
            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer ease-out duration-200 ${
              value === option.id ? "border-blue" : "border-gray-3"
            }`}
          >
            <input
              type="radio"
              name="shipping"
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="accent-blue"
            />
            <span className="font-medium text-dark">{option.label}</span>
            <span className="ml-auto text-dark">
              {option.price === 0 ? "Free" : `$${option.price.toFixed(2)}`}
            </span>
            <span className="text-dark-4 text-sm">{option.description}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ShippingMethod;
