import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { MdDelete, MdEdit } from "react-icons/md";
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress, setOpenAddress] = useState(false)
  const [OpenEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const { fetchAddress } = useGlobalContext()

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: { _id: id }
      })
      if (response.data.success) {
        toast.success("Address Removed")
        if (fetchAddress) fetchAddress()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div className=''>
      {/* Header */}
      <div className='relative bg-white shadow-md p-3 mb-5 flex items-center justify-center'>
        <h2 className='text-center text-2xl font-semibold text-green-800 uppercase tracking-widest'>Address</h2>
      </div>

      {/* Address Cards Grid */}
      <div className='p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {addressList.map((address) => (
          <div
            key={address._id}
            className={`bg-white rounded-2xl shadow-lg p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-xl ${!address.status && 'hidden'}`}
          >
            <div className='flex-1 space-y-1'>
              <p className='font-semibold text-neutral-800'>{address.address_line}</p>
              <p className='font-semibold text-neutral-800'>{address.city}</p>
              <p className='font-semibold text-neutral-800'>{address.state}</p>
              <p className='font-semibold text-neutral-800'>{address.country} - {address.pincode}</p>
              <p className='font-semibold text-neutral-800'>{address.mobile}</p>
            </div>

            <div className='flex justify-center items-center gap-2 mt-4'>
              <button
                onClick={() => {
                  setOpenEdit(true)
                  setEditData(address)
                }}
                className='shrink-0 w-[60px] h-[42px] flex items-center justify-center bg-green-200 hover:bg-green-300 text-green-800 font-semibold rounded-xl transition'
              >
                Edit
              </button>

              <button
                onClick={() => handleDisableAddress(address._id)}
                className='shrink-0 w-[60px] h-[42px] flex items-center justify-center bg-red-200 hover:bg-red-300 text-red-800 font-semibold rounded-xl transition'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Card Below */}
      <div className='flex justify-center mt-6'>
        <div
          onClick={() => setOpenAddress(true)}
          className='h-20 w-full max-w-md bg-green-300 border-1 border-dashed border-green-600 flex justify-center items-center cursor-pointer rounded-2xl text-green-800 font-semibold text-lg hover:text-white hover:bg-green-700 hover:shadow-lg transition-all duration-200'
        >
          Add Address
        </div>
      </div>

      {/* Modals */}
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
      {OpenEdit && <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />}
    </div>
  )
}

export default Address
