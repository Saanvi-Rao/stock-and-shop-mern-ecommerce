import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchOutline } from "react-icons/io5";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [search, setSearch] = useState("")

  const fetchProductData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: { page, limit: 12, search }
      })
      const { data: responseData } = response
      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage)
        setProductData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [page])

  useEffect(() => {
    const delay = setTimeout(() => fetchProductData(), 300)
    return () => clearTimeout(delay)
  }, [search])

  const handleNext = () => { if (page < totalPageCount) setPage(prev => prev + 1) }
  const handlePrevious = () => { if (page > 1) setPage(prev => prev - 1) }
  const handleOnChange = (e) => { setSearch(e.target.value); setPage(1) }

  return (
    <section>

      {/* HEADER → Responsive title + search */}
      <div className="bg-white shadow-md p-3 mb-5 flex flex-col sm:flex-row items-center justify-between relative">

        {/* Title - slightly left on desktop, centered on mobile */}
        <div className="flex-1 flex justify-center sm:translate-x-20">
          <h2 className="text-2xl font-semibold text-green-800 uppercase tracking-widest">
            Product
          </h2>
        </div>

        {/* Search Bar */}
        <div className="mt-3 sm:mt-0 w-full sm:w-64 bg-blue-50 px-4 flex items-center gap-3 py-2 rounded border focus-within:border-green-600">
          <IoSearchOutline size={20} />
          <input
            type='text'
            placeholder='Search product here ...'
            className='w-full outline-none bg-transparent'
            value={search}
            onChange={handleOnChange}
          />
        </div>

      </div>

      {/* PRODUCT GRID */}
      <div className='p-4 bg-blue-50 min-h-[55vh]'>

        {loading && <Loading />}

        {!loading && productData.length === 0 && (
          <p className='text-center text-gray-500 mt-10'>No Products Found</p>
        )}

        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
          {productData.map(p => (
            <ProductCardAdmin key={p._id} data={p} fetchProductData={fetchProductData} />
          ))}
        </div>

        {/* Pagination */}
        <div className='flex justify-between my-4'>
          <button
            onClick={handlePrevious}
            className="border border-green-600 text-green-800 hover:text-white hover:bg-green-700 py-1 px-3 font-semibold rounded"
          >
            Previous
          </button>

          <button className='w-20 text-center border border-gray-300 px-4 py-1 rounded'>
            {page}/{totalPageCount}
          </button>

          <button
            onClick={handleNext}
            className="border border-green-600 text-green-800 hover:text-white hover:bg-green-700 py-1 px-3 font-semibold rounded"
          >
            Next
          </button>
        </div>

      </div>
    </section>
  )
}

export default ProductAdmin
