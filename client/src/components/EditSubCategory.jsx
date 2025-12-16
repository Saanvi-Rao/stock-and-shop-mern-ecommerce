import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import uploadImage from "../utils/UploadImage";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

const EditSubCategory = ({ close, data, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    _id: data._id,
    name: data.name,
    image: data.image,
    category: data.category || [],
  });

  const allCategory = useSelector((state) => state.product.allCategory);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const response = await uploadImage(file);
    const { data: ImageResponse } = response;

    setSubCategoryData((prev) => ({
      ...prev,
      image: ImageResponse.data.url,
    }));
  };

  const handleRemoveCategorySelected = (id) => {
    setSubCategoryData((prev) => ({
      ...prev,
      category: prev.category.filter((item) => item._id !== id),
    }));
  };

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.updateSubCategory,
        data: subCategoryData,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        close?.();
        fetchData?.();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-xl relative">

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-gray-700 mx-auto">
            Edit Sub Category
          </h2>

          <button
            onClick={close}
            className="absolute right-5 top-5 text-gray-500 hover:text-red-500"
          >
            <IoClose size={26} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmitSubCategory} className="mt-6 grid gap-6">

          {/* Name */}
          <div>
            <label className="font-semibold text-neutral-800">Name</label>
            <input
              name="name"
              value={subCategoryData.name}
              onChange={handleChange}
              placeholder="Enter sub category name"
              className="bg-blue-50 p-3 border rounded-xl outline-none w-full focus:border-green-600 transition"
            />
          </div>

          {/* Image */}
          <div>
            <label className="font-semibold text-neutral-800">Image</label>

            <div className="flex items-center gap-4 mt-2">
              {/* Preview */}
              <div className="border bg-blue-50 h-32 w-32 flex items-center justify-center rounded-xl overflow-hidden">
                {subCategoryData.image ? (
                  <img
                    src={subCategoryData.image}
                    alt="subCategory"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">No Image</p>
                )}
              </div>

              {/* Upload Button */}
              <label htmlFor="uploadSubCategoryImage">
                <div className="px-5 py-2 rounded-xl cursor-pointer border border-green-600 text-green-800 hover:bg-green-700 hover:text-white transition font-medium">
                  Upload Image
                </div>

                <input
                  type="file"
                  id="uploadSubCategoryImage"
                  onChange={handleUploadSubCategoryImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Category Select */}
          <div>
            <label className="font-semibold text-neutral-800">
              Assign Category
            </label>

            <div className="mt-2 border rounded-xl p-3">

              {/* selected chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                {subCategoryData.category.map((cat) => (
                  <div
                    key={cat._id + "selectedValue"}
                    className="bg-white shadow px-3 py-1 rounded-full flex items-center gap-2 border"
                  >
                    {cat.name}

                    <div
                      className="cursor-pointer hover:text-red-600"
                      onClick={() => handleRemoveCategorySelected(cat._id)}
                    >
                      <IoClose size={20} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Dropdown */}
              <select
                className="w-full p-3 bg-blue-50 border rounded-lg outline-none focus:border-green-600"
                onChange={(e) => {
                  const value = e.target.value;
                  const details = allCategory.find((el) => el._id === value);
                  if (!details) return;

                  setSubCategoryData((prev) => ({
                    ...prev,
                    category: [...prev.category, details],
                  }));
                }}
              >
                <option value="">Select Category</option>

                {allCategory.map((category) => (
                  <option value={category._id} key={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            className={`py-3 rounded-full font-semibold text-sm
              ${
                subCategoryData.name &&
                subCategoryData.image &&
                subCategoryData.category.length > 0
                  ? "border border-green-600 text-green-800 hover:bg-green-700 hover:text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }
            `}
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditSubCategory;
