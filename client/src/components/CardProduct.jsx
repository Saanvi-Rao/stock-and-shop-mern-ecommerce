import React from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { Link } from "react-router-dom";
import { validURLConvert } from "../utils/validURLConvert";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "./AddToCartButton";

const CardProduct = ({ data }) => {
  const url = `/product/${validURLConvert(data.name)}-${data._id}`;

  const discounted = pricewithDiscount(data.price, data.discount);

  return (
    <Link
      to={url}
      className="bg-white rounded-3xl border border-black shadow-md p-4 w-44 flex flex-col gap-3 transition-all hover:shadow-lg hover:scale-[1.02]"
    >
      {/* IMAGE WRAPPER */}
      <div className="bg-white rounded-3xl border border-black shadow-sm p-4 h-40 flex items-center justify-center">
        <img
          src={data.image?.[0]}
          alt={data.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* DELIVERY + DISCOUNT */}
      <div className="flex items-center gap-2">
        <span className="bg-green-200 text-green-700 text-xs px-2 py-[2px] rounded-full font-semibold">
          10 MIN
        </span>

        {data.discount > 0 && (
          <span className="bg-green-100 text-green-700 text-xs px-2 py-[2px] rounded-full font-semibold">
            {data.discount}% OFF
          </span>
        )}
      </div>

      {/* NAME */}
      <h3 className="font-semibold text-sm line-clamp-2 text-gray-800">
        {data.name}
      </h3>

      {/* UNIT */}
      <p className="text-xs text-gray-500">{data.unit}</p>

      {/* PRICE + BUTTON */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex flex-col leading-tight">
          <span className="text-green-700 font-bold text-lg">
            {DisplayPriceInRupees(discounted)}
          </span>

          {data.discount > 0 && (
            <span className="line-through text-gray-400 text-xs">
              {DisplayPriceInRupees(data.price)}
            </span>
          )}
        </div>

        <div>
          {data.stock === 0 ? (
            <span className="text-red-500 text-xs font-semibold">
              Out of Stock
            </span>
          ) : (
            <AddToCartButton data={data} />
          )}
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
