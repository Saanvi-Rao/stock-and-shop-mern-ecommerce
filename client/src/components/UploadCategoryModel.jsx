import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError';

const UploadCategoryModel = ({ close, fetchData }) => {

    const [data, setData] = useState({
        name: "",
        image: ""
    });

    const [loading, setLoading] = useState(false);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await Axios({
                ...SummaryApi.addCategory,
                data: data
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                close();
                fetchData();
            }

        } catch (error) {
            AxiosToastError(error);

        } finally {
            setLoading(false);
        }
    };

    const handleUploadCategoryImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPG, PNG, and WEBP images are allowed.");
            return;
        }

        setLoading(true);

        try {
            const response = await uploadImage(file);
            const { data: ImageResponse } = response;

            setData(prev => ({
                ...prev,
                image: ImageResponse.data.url
            }));

            toast.success("Image uploaded!");

        } catch (err) {
            toast.error("Image upload failed!");
        }

        setLoading(false);
    };

    return (
        <section className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 w-full max-w-xl rounded-2xl shadow-xl relative">

                {/* Header */}
                <div className="flex justify-between items-center pb-3 border-b">
                    <h2 className="text-xl font-bold text-gray-700 mx-auto">
                        Add Category
                    </h2>
                    <button
                        onClick={close}
                        className="absolute right-5 top-5 text-gray-500 hover:text-red-500"
                    >
                        <IoClose size={26} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 grid gap-5">

                    {/* Category Name */}
                    <div>
                        <label className="font-semibold text-neutral-800">Category Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter category name"
                            value={data.name}
                            onChange={handleOnChange}
                            className="bg-blue-50 text-gray-900 placeholder-gray-400 p-3 border rounded-xl outline-none w-full focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:ring-opacity-50 transition"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="font-semibold text-neutral-800">Image</label>

                        <div className="flex items-center gap-4 mt-2">

                            {/* Preview Box */}
                            <div className="border bg-blue-50 h-32 w-32 flex items-center justify-center rounded-xl overflow-hidden relative">
                                {data.image ? (
                                    <>
                                        <img
                                            src={data.image}
                                            alt="category"
                                            className="max-w-full max-h-full object-cover"
                                        />
                                        {/* Overlay Category Name */}
                                        {data.name && (
                                            <span className="absolute bottom-2 left-2 right-2  text-sm font-semibold text-white text-center bg-black bg-opacity-50 px-1 rounded">
                                                {data.name}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-neutral-500 text-center px-2">No Image</p>
                                )}
                            </div>

                            {/* Upload Button */}
                            <label htmlFor="uploadCategoryImage">
                                <div
                                    className={`
                                        px-5 py-2 rounded-xl cursor-pointer border font-medium
                                        ${!data.name
                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                            : "border-green-600 text-green-800 hover:bg-green-700 hover:text-white"}
                                    `}
                                >
                                    {loading ? "Uploading..." : "Upload Image"}
                                </div>

                                <input
                                    disabled={!data.name}
                                    type="file"
                                    id="uploadCategoryImage"
                                    onChange={handleUploadCategoryImage}
                                    className="hidden"
                                />
                            </label>

                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`
                            font-semibold text-sm py-3 rounded-full
                            ${data.name && data.image
                                ? "border border-green-600 text-green-800 hover:text-white hover:bg-green-700"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"}
                        `}
                    >
                        Add Category
                    </button>

                </form>
            </div>
        </section>
    );
};

export default UploadCategoryModel;
