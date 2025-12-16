import React from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider'

const AddAddress = ({ close }) => {

    const { register, handleSubmit, reset } = useForm()
    const { fetchAddress } = useGlobalContext()

    const onSubmit = async (data) => {
        try {
            const response = await Axios({
                ...SummaryApi.createAddress,
                data: {
                    address_line: data.addressline,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    pincode: data.pincode,
                    mobile: data.mobile
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                close()
                reset()
                fetchAddress()
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='bg-black fixed inset-0 z-50 bg-opacity-60 backdrop-blur-sm overflow-auto'>
            <div className='bg-white p-6 w-full max-w-lg mt-20 mx-auto rounded-2xl shadow-xl'>
                
                {/* Header */}
                <div className='flex justify-between items-center pb-3 border-b'>
                    <h2 className='text-xl font-bold text-gray-700 mx-auto'>
                        Add Shipping Details
                    </h2>
                    <button 
                        onClick={close} 
                        className='absolute right-5 top-5 text-gray-500 hover:text-red-500'
                    >
                        <IoClose size={26} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className='mt-6 grid gap-4'>

                    <div>
                        <label className='font-semibold text-neutral-800'>Address Line</label>
                        <input 
                            type="text"
                            className='bg-blue-50 p-2 border rounded-xl outline-none w-full focus:border-green-600 transition'
                            {...register("addressline", { required: true })}
                        />
                    </div>

                    <div>
                        <label className='font-semibold text-neutral-800'>City</label>
                        <input 
                            type="text"
                            className='bg-blue-50 p-2 border rounded-xl outline-none w-full focus:border-green-600 transition'
                            {...register("city", { required: true })}
                        />
                    </div>

                    <div>
                        <label className='font-semibold text-neutral-800'>State</label>
                        <input 
                            type="text"
                            className='bg-blue-50 p-2 border rounded-xl outline-none w-full focus:border-green-600 transition'
                            {...register("state", { required: true })}
                        />
                    </div>

                    <div>
                        <label className='font-semibold text-neutral-800'>Pincode</label>
                        <input 
                            type="text"
                            className='bg-blue-50 p-2 border rounded-xl outline-none w-full focus:border-green-600 transition'
                            {...register("pincode", { required: true })}
                        />
                    </div>

                    <div>
                        <label className='font-semibold text-neutral-800'>Country</label>
                        <input 
                            type="text"
                            className='bg-blue-50 p-2 border rounded-xl outline-none w-full focus:border-green-600 transition'
                            {...register("country", { required: true })}
                        />
                    </div>

                    <div>
                        <label className='font-semibold text-neutral-800'>Mobile No.</label>
                        <input 
                            type="text"
                            className='bg-blue-50 p-2 border rounded-xl outline-none w-full focus:border-green-600 transition'
                            {...register("mobile", { required: true })}
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type='submit' 
                        className='font-semibold text-sm min-w-20 border border-green-600 text-green-800 hover:text-white hover:bg-green-700 px-3 py-2 rounded-full mt-3'
                    >
                        Save Address
                    </button>

                </form>
            </div>
        </section>
    )
}

export default AddAddress
