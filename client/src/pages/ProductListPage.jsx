import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { Link, useParams } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "../components/Loading";
import CardProduct from "../components/CardProduct";
import { useSelector } from "react-redux";
import { validURLConvert } from "../utils/validURLConvert";

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const AllSubCategory = useSelector((state) => state.product.allSubCategory);
  const [DisplaySubCatory, setDisplaySubCategory] = useState([]);

  const subCategory = params?.subCategory?.split("-");
  const subCategoryName = subCategory
    ?.slice(0, subCategory?.length - 1)
    ?.join(" ");

  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory.split("-").slice(-1)[0];

  // Fetch products
  const fetchProductdata = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId,
          subCategoryId,
          page: 1,
          limit: 1000,
        },
      });

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductdata();
  }, [params]);

  // Filter subcategories
  useEffect(() => {
    const sub = AllSubCategory.filter((s) =>
      s.category.some((el) => el._id === categoryId)
    );
    setDisplaySubCategory(sub);
  }, [params, AllSubCategory]);

  return (
    <section className="pt-3 pb-10">
      <div className="container mx-auto">

        {/* Horizontal scroll subcategories on mobile */}
        <div className="block md:hidden mb-3 overflow-x-auto whitespace-nowrap scrollbarCustom">
          {DisplaySubCatory.map((s) => {
            const link = `/${validURLConvert(s?.category[0]?.name)}-${
              s?.category[0]?._id
            }/${validURLConvert(s.name)}-${s._id}`;
            const isActive = subCategoryId === s._id;
            return (
              <Link
                key={s._id}
                to={link}
                className={`inline-block px-4 py-2 mr-3 rounded-xl border cursor-pointer select-none whitespace-normal ${
                  isActive
                    ? "bg-green-200 border-green-600"
                    : "bg-white border-gray-300 hover:bg-green-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={s.image}
                    alt="subcategory"
                    className="w-8 h-8 object-contain rounded-md shadow-sm"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    {s.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Main grid */}
        <div className="grid md:grid-cols-[220px,1fr] gap-4">
          {/* Sidebar on desktop */}
          <div className="hidden md:block bg-white shadow-md rounded-xl py-3 h-[88vh] overflow-y-auto scrollbarCustom">
            {DisplaySubCatory.map((s) => {
              const link = `/${validURLConvert(s?.category[0]?.name)}-${
                s?.category[0]?._id
              }/${validURLConvert(s.name)}-${s._id}`;
              const isActive = subCategoryId === s._id;
              return (
                <Link
                  key={s._id}
                  to={link}
                  className={`flex items-center gap-4 px-3 py-3 mb-2 rounded-xl mx-2 border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
                    isActive
                      ? "bg-green-200 border-green-600"
                      : "bg-white hover:bg-green-50"
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded-md overflow-hidden shadow-sm">
                    <img
                      src={s.image}
                      alt="subcategory"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{s.name}</p>
                </Link>
              );
            })}
          </div>

          {/* Products Section */}
          <div>
            <div className="bg-white p-4 rounded-xl shadow-md flex justify-center">
              <h3 className="font-semibold text-xl text-gray-800 tracking-wide">
                {subCategoryName}
              </h3>
            </div>

            <div className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
                {data.map((p, index) => (
                  <div
                    key={p._id + "_product_" + index}
                    className="transition-transform duration-200 hover:scale-105"
                  >
                    <CardProduct data={p} />
                  </div>
                ))}
              </div>
            </div>

            {loading && <Loading />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;
