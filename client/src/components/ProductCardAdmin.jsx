import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import ConfirmBox from './ConfirmBox'
import { IoClose } from 'react-icons/io5'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const handleDeleteCancel = () => setOpenDelete(false)

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: { _id: data._id }
      })
      const { data: responseData } = response
      if (responseData.success) {
        toast.success(responseData.message)
        fetchProductData && fetchProductData()
        setOpenDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center justify-between hover:shadow-xl transition-all h-auto min-h-[0px]">
      {/* Image & Info */}
      <div className="w-full flex-1 flex flex-col items-center">
        <img
          src={data?.image[0]}
          alt={data?.name}
          className="w-full h-42 object-cover rounded-lg bg-gray-50 p-2"
        />
        <h3 className="text-center text-md font-semibold text-gray-800 mt-2 line-clamp-2">
          {data?.name}
        </h3>
        <p className="text-center text-gray-400">{data?.unit}</p>
      </div>

      {/* Edit/Delete Buttons */}
      <div className="flex w-full justify-center items-center gap-2 mt-3">
        <button
          onClick={() => setEditOpen(true)}
          className="shrink-0 w-[60px] h-[42px] flex items-center justify-center bg-green-200 hover:bg-green-300 text-green-800 font-semibold rounded-xl"
        >
          Edit
        </button>
        <button
          onClick={() => setOpenDelete(true)}
          className="shrink-0 w-[60px] h-[42px] flex items-center justify-center bg-red-200 hover:bg-red-300 text-red-800 font-semibold rounded-xl"
        >
          Delete
        </button>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <EditProductAdmin
          data={data}
          fetchProductData={fetchProductData}
          close={() => setEditOpen(false)}
        />
      )}

      {/* Delete Confirmation */}
      {openDelete && (
        <section className="fixed top-0 left-0 right-0 bottom-0 bg-neutral-600 z-50 bg-opacity-70 p-4 flex justify-center items-center">
          <div className="bg-white p-4 w-full max-w-md rounded-md">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-semibold">Permanent Delete</h3>
              <button onClick={() => setOpenDelete(false)}>
                <IoClose size={25} />
              </button>
            </div>
            <p className="my-2">Are you sure you want to delete permanently?</p>
            <div className="flex justify-end gap-5 py-4">
              <button
                onClick={handleDeleteCancel}
                className="border px-3 py-1 rounded bg-red-100 border-red-500 text-red-500 hover:bg-red-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="border px-3 py-1 rounded bg-green-100 border-green-500 text-green-500 hover:bg-green-200"
              >
                Delete
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default ProductCardAdmin
