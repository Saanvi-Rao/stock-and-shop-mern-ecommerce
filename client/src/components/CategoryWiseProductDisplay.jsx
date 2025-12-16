import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6"
import { useSelector } from 'react-redux'
import { validURLConvert } from '../utils/validURLConvert'

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: { id }
            })

            if (response.data.success) {
                setData(response.data.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategoryWiseProduct()
    }, [])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 230
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 230
    }

    const handleRedirectProductListpage = () => {
        const subcategory = subCategoryData.find(sub => {
            return sub.category.some(c => c._id == id)
        })
        return `/${validURLConvert(name)}-${id}/${validURLConvert(subcategory?.name)}-${subcategory?._id}`
    }

    const redirectURL = handleRedirectProductListpage()

    return (
        <div className="my-6">
            
            {/* Category Heading */}
            <div className="w-full px-4 mb-2 flex items-center justify-between max-w-[1600px] mx-auto">
                <h3 className="font-semibold text-xl md:text-2xl text-gray-800 tracking-wide">
                    {name}
                </h3>

                <Link 
                    to={redirectURL} 
                    className="text-green-600 hover:text-green-500 font-medium"
                >
                    See All
                </Link>
            </div>

            {/* Product Scroll Container */}
            <div className="relative">
                <div 
                    ref={containerRef}
                    className="flex gap-4 md:gap-6 lg:gap-8 overflow-x-scroll scrollbar-none scroll-smooth px-4"
                >
                    {loading && loadingCardNumber.map((_, index) => (
                        <CardLoading key={"CategorywiseLoading" + index} />
                    ))}

                    {!loading && data.map((p, index) => (
                        <div className="transition-transform hover:scale-[1.02] duration-200">
                            <CardProduct 
                                data={p}
                                key={p._id + "CategoryProd" + index}
                            />
                        </div>
                    ))}
                </div>

                {/* Scroll Buttons */}
                <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 hidden lg:flex justify-between pointer-events-none">
                    <button 
                        onClick={handleScrollLeft} 
                        className="pointer-events-auto bg-white/80 backdrop-blur-md hover:bg-white shadow-md p-3 rounded-full"
                    >
                        <FaAngleLeft className="text-xl" />
                    </button>

                    <button 
                        onClick={handleScrollRight} 
                        className="pointer-events-auto bg-white/80 backdrop-blur-md hover:bg-white shadow-md p-3 rounded-full"
                    >
                        <FaAngleRight className="text-xl" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CategoryWiseProductDisplay
