import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.png'
import toast from 'react-hot-toast'

const DisplayCartItem = ({ close }) => {

    const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const redirectToCheckoutPage = () => {
        if (user?._id) {
            navigate("/checkout")
            if (close) close()
            return
        }
        toast("Please Login")
    }

    return (
        <section className='bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-70 z-50'>
            <div className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto'>

                {/* Header */}
                <div className="bg-white shadow-md p-3 text-center text-2xl font-semibold mb-5 text-green-800 uppercase tracking-widest relative">
                    <h1>MY CART</h1>

                    <button onClick={close} className="absolute right-4 top-4 hidden lg:block">
                        <IoClose size={26} className="text-green-800" />
                    </button>

                    <Link to={"/"} className='absolute right-4 top-4 lg:hidden'>
                        <IoClose size={26} className="text-green-800" />
                    </Link>
                </div>

                {/* BODY */}
                <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-white-50 p-2 flex flex-col gap-1'>
                    
                    {cartItem[0] ? (
                        <>
                            <div className='flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full'>
                                <p>Your total savings</p>
                                <p>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</p>
                            </div>

                            {/* Cart item list */}
                            <div className='bg-white rounded-lg p-4 grid gap-5 overflow-auto'>
                                {cartItem.map((item, index) => (
                                    <div key={item?._id + "cartItemDisplay"} className='flex w-full gap-4'>
                                        <div className='w-16 h-16 min-h-16 min-w-16 bg-gray-200 border rounded'>
                                            <img
                                                src={item?.productId?.image[0]}
                                                className='object-scale-down'
                                            />
                                        </div>

                                        <div className='w-full max-w-sm text-xs'>
                                            <p className='text-xs text-ellipsis line-clamp-2'>{item?.productId?.name}</p>
                                            <p className='text-neutral-400'>{item?.productId?.unit}</p>
                                            <p className='font-semibold'>{DisplayPriceInRupees(pricewithDiscount(item?.productId?.price, item?.productId?.discount))}</p>
                                        </div>

                                        <div>
                                            <AddToCartButton data={item?.productId} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Bill */}
                            <div className='bg-white p-4'>
                                <h3 className='font-semibold text-center text-lg mb-3'>
                                    Bill Details
                                </h3>

                                <div className='flex gap-3 justify-between ml-1'>
                                    <p>Items total</p>
                                    <p className='flex items-center gap-2'>
                                        <span className='line-through text-neutral-400'>
                                            {DisplayPriceInRupees(notDiscountTotalPrice)}
                                        </span>
                                        <span>{DisplayPriceInRupees(totalPrice)}</span>
                                    </p>
                                </div>

                                <div className='flex gap-4 justify-between ml-1'>
                                    <p>Quantity total</p>
                                    <p className='flex items-center gap-2'>{totalQty} item</p>
                                </div>

                                <div className='flex gap-4 justify-between ml-1'>
                                    <p>Delivery Charge</p>
                                    <p className='flex items-center gap-2'>Free</p>
                                </div>

                                <div className='font-semibold flex items-center justify-between ml-1'>
                                    <p>Grand total</p>
                                    <p>{DisplayPriceInRupees(totalPrice)}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='bg-white flex flex-col justify-center items-center p-6 
                            border border-black rounded-2xl 
                            shadow-md hover:shadow-xl hover:scale-[1.02] 
                            transition-all duration-200 cursor-pointer'
                        >
                            <img src={imageEmpty} className='w-64 h-64 object-contain mb-4' />

                            <Link 
                                onClick={close}
                                to={"/"}
                                className='bg-green-700 px-6 py-2 text-white rounded-lg text-lg font-semibold 
                                    hover:bg-green-800 transition-all duration-200'
                            >
                                Shop Now
                            </Link>
                        </div>
                    )}
                </div>

                {/* Checkout Button */}
                {cartItem[0] && (
                    <div className='p-6 relative'>  {/* <-- Added margin bottom */}
                        <div className='bg-green-700 text-neutral-100 px-4 font-bold text-base py-3 rounded 
            flex items-center gap-4 justify-between
            absolute bottom-4 left-0 right-0 mx-2 shadow-lg'>
                            <div>
                                {DisplayPriceInRupees(totalPrice)}
                            </div>
                            <button onClick={redirectToCheckoutPage} className='flex items-center gap-1'>
                                Proceed
                                <span><FaCaretRight /></span>
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </section>
    )
}

export default DisplayCartItem
