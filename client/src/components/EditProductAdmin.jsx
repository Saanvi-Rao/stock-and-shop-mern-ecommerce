/* FULL UPDATED CODE BELOW — ONLY UI CHANGES, NO LOGIC CHANGED */

import React, { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {

  const [data, setData] = useState({
    _id: propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {},
  })

  const [imageLoading, setImageLoading] = useState(false)
  const [ViewImageURL, setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const allSubCategory = useSelector(state => state.product.allSubCategory)
  const [selectCategory, setSelectCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("")

  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImageLoading(true)
    const response = await uploadImage(file)
    const { data: ImageResponse } = response

    setData(prev => ({
      ...prev,
      image: [...prev.image, ImageResponse.data.url]
    }))
    setImageLoading(false)
  }

  const handleDeleteImage = (index) => {
    data.image.splice(index, 1)
    setData(prev => ({ ...prev }))
  }

  const handleRemoveCategory = (index) => {
    data.category.splice(index, 1)
    setData(prev => ({ ...prev }))
  }

  const handleRemoveSubCategory = (index) => {
    data.subCategory.splice(index, 1)
    setData(prev => ({ ...prev }))
  }

  const handleAddField = () => {
    setData(prev => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: ""
      }
    }))
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: data
      })

      const { data: responseData } = response

      if (responseData.success) {
        successAlert(responseData.message)
        close?.()
        fetchProductData()
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className='fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white w-full max-w-3xl p-6 rounded-2xl shadow-xl relative overflow-y-auto max-h-[95vh]'>

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-gray-700 mx-auto">
            Edit Product
          </h2>

          <button
            onClick={close}
            className="absolute right-5 top-5 text-gray-500 hover:text-red-500"
          >
            <IoClose size={26} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-6 grid gap-6">

          {/* Name */}
          <div>
            <label className="font-semibold text-neutral-800">Name</label>
            <input
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="bg-blue-50 p-3 border rounded-xl outline-none w-full focus:border-green-600 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-neutral-800">Description</label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter product description"
              className="bg-blue-50 p-3 border rounded-xl outline-none w-full focus:border-green-600 transition resize-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className="font-semibold text-neutral-800">Images</label>

            {/* Upload Button */}
            <label
              htmlFor="productImage"
              className="bg-blue-50 h-32 border rounded-xl flex flex-col justify-center items-center cursor-pointer hover:border-green-600 transition mt-2"
            >
              {imageLoading ? (
                <Loading />
              ) : (
                <>
                  <FaCloudUploadAlt size={35} />
                  <p>Upload Image</p>
                </>
              )}
              <input
                type="file"
                id="productImage"
                className="hidden"
                onChange={handleUploadImage}
              />
            </label>

            {/* Thumbnails */}
            <div className='flex flex-wrap gap-4 mt-3'>
              {data.image.map((img, index) => (
                <div key={img + index} className='h-20 w-20 bg-blue-50 border relative group rounded-lg overflow-hidden'>
                  <img
                    src={img}
                    className='w-full h-full object-contain cursor-pointer'
                    onClick={() => setViewImageURL(img)}
                  />
                  <div
                    onClick={() => handleDeleteImage(index)}
                    className='absolute bottom-0 right-0 p-1 bg-red-600 text-white rounded hidden group-hover:block cursor-pointer'
                  >
                    <MdDelete />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="font-semibold text-neutral-800">Category</label>

            <select
              className="w-full p-3 bg-blue-50 border rounded-xl outline-none focus:border-green-600 mt-2"
              value={selectCategory}
              onChange={(e) => {
                const value = e.target.value
                const cat = allCategory.find(el => el._id === value)
                if (!cat) return

                setData(prev => ({
                  ...prev,
                  category: [...prev.category, cat]
                }))

                setSelectCategory("")
              }}
            >
              <option value="">Select Category</option>
              {allCategory.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            {/* Category Chips */}
            <div className='flex flex-wrap gap-2 mt-3'>
              {data.category.map((c, index) => (
                <div key={c._id} className="bg-white shadow px-3 py-1 rounded-full flex items-center gap-2 border">
                  {c.name}
                  <IoClose
                    size={20}
                    className="cursor-pointer hover:text-red-600"
                    onClick={() => handleRemoveCategory(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SubCategory */}
          <div>
            <label className="font-semibold text-neutral-800">Sub Category</label>

            <select
              className="w-full p-3 bg-blue-50 border rounded-xl outline-none focus:border-green-600 mt-2"
              value={selectSubCategory}
              onChange={(e) => {
                const value = e.target.value
                const sc = allSubCategory.find(el => el._id === value)
                if (!sc) return

                setData(prev => ({
                  ...prev,
                  subCategory: [...prev.subCategory, sc]
                }))

                setSelectSubCategory("")
              }}
            >
              <option value="">Select Sub Category</option>
              {allSubCategory.map(sc => (
                <option key={sc._id} value={sc._id}>{sc.name}</option>
              ))}
            </select>

            <div className='flex flex-wrap gap-2 mt-3'>
              {data.subCategory.map((c, index) => (
                <div key={c._id} className="bg-white shadow px-3 py-1 rounded-full flex items-center gap-2 border">
                  {c.name}
                  <IoClose
                    size={20}
                    className="cursor-pointer hover:text-red-600"
                    onClick={() => handleRemoveSubCategory(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Other Inputs */}
          {[
            ["unit", "Unit"],
            ["stock", "Stock"],
            ["price", "Price"],
            ["discount", "Discount"]
          ].map(([key, label]) => (
            <div key={key}>
              <label className="font-semibold text-neutral-800">{label}</label>
              <input
                name={key}
                value={data[key]}
                onChange={handleChange}
                className="bg-blue-50 p-3 border rounded-xl outline-none w-full focus:border-green-600 transition mt-1"
              />
            </div>
          ))}

          {/* More Fields */}
          {Object.keys(data.more_details).map((k) => (
            <div key={k}>
              <label className="font-semibold text-neutral-800">{k}</label>
              <input
                value={data.more_details[k]}
                onChange={(e) =>
                  setData(prev => ({
                    ...prev,
                    more_details: {
                      ...prev.more_details,
                      [k]: e.target.value
                    }
                  }))
                }
                className="bg-blue-50 p-3 border rounded-xl outline-none w-full focus:border-green-600 transition mt-1"
              />
            </div>
          ))}

          <div
            onClick={() => setOpenAddField(true)}
            className="px-5 py-2 border border-green-600 text-green-800 rounded-xl cursor-pointer w-max hover:bg-green-700 hover:text-white"
          >
            Add Field
          </div>

          {/* Submit Button */}
          <button className="py-3 rounded-full font-semibold bg-green-700 text-white hover:bg-green-800 transition">
            Update Product
          </button>
        </form>

        {/* Image Viewer */}
        {ViewImageURL && (
          <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />
        )}

        {/* Add Field Popup */}
        {openAddField && (
          <AddFieldComponent
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            submit={handleAddField}
            close={() => setOpenAddField(false)}
          />
        )}
      </div>
    </section>
  )
}

export default EditProductAdmin
