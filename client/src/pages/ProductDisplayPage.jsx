import React, { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'

const ProductDisplayPage = () => {

  const params = useParams()
  const productId = params.product?.split("-").pop() || ""
  const [data, setData] = useState({ name: "", image: [] })
  const [imageIndex, setImageIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchProductDetails = async () => {
    setLoading(true)
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: { productId }
      })
      if (response.data.success) setData(response.data.data)
    } catch (error) {
      AxiosToastError(error)
    }
    setLoading(false)
  }

  useEffect(() => { fetchProductDetails() }, [params])

  const discountedPrice = useMemo(
    () => pricewithDiscount(data.price, data.discount),
    [data.price, data.discount]
  )

  if (loading) return <div className='text-center my-10'>Loading...</div>

  return (
    <section className="bg-[#f7f7f7] min-h-screen">

      <div className='container mx-auto p-4 max-w-4xl'>

        {/* IMAGE SECTION */}
        <div className='flex flex-col items-center space-y-6'>

          {/* MAIN IMAGE */}
          <div className="bg-white rounded-3xl shadow-md p-6 flex items-center justify-center
                          min-h-[260px] max-w-[260px] mx-auto border border-black">
            {data.image[imageIndex] && (
              <img
                src={data.image[imageIndex]}
                alt={data.name}
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* IMAGE DOTS */}
          <div className="flex items-center justify-center gap-2">
            {data.image.map((_, index) => (
              <button
                key={index}
                onClick={() => setImageIndex(index)}
                className={`w-3 h-3 rounded-full ${imageIndex === index ? "bg-green-600" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="space-y-6 mt-10">

          {/* Delivery Time */}
          <p className='text-sm bg-green-300 text-green-800 px-3 py-1 rounded-full font-semibold w-fit'>
            30 MINS
          </p>

          {/* Name + Unit */}
          <div>
            <h1 className='text-2xl font-bold'>{data.name}</h1>
            <p className=' text-gray-600 text-lg'>{data.unit}</p>
          </div>

          {/* PRICE CARD */}
          <div className='bg-white rounded-3xl shadow-md p-5 border border-black'>
            <p className='font-semibold text-gray-500 mb-2'>Price</p>

            <div className='flex items-center gap-3'>
              <h2 className='text-3xl font-bold text-green-600'>
                {DisplayPriceInRupees(discountedPrice)}
              </h2>

              {data.discount > 0 && (
                <>
                  <p className='line-through text-gray-400 text-lg'>
                    {DisplayPriceInRupees(data.price)}
                  </p>
                  <p className='text-green-700 font-bold text-xl'>
                    {data.discount}% OFF
                  </p>
                </>
              )}
            </div>
          </div>

          {/* ADD TO CART BUTTON */}
          {data.stock === 0 ? (
            <p className='text-red-500 font-semibold text-lg'>Out of Stock</p>
          ) : (
            <AddToCartButton data={data} />
          )}

          {/* DESCRIPTION CARD */}
          <div className='bg-white rounded-3xl shadow-md p-6 border border-black'>
            <h2 className='font-semibold text-xl mb-3'>Description</h2>

            <p className='text-gray-700 leading-relaxed'>
              {data.description}
            </p>

            {data.more_details && (
              <ul className='mt-4 space-y-1'>
                {Object.entries(data.more_details).map(([k, v]) => (
                  <li key={k}>
                    <strong>{k}:</strong> {v}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* WHY SHOP SECTION */}
          <div className='bg-white rounded-3xl shadow-md p-6 space-y-6 border border-black'>
            <h2 className='font-semibold text-xl'>Why shop from Stock And Shop?</h2>

            {[
              { img: image1, title: 'Superfast Delivery', desc: 'Get your order delivered from nearby dark stores.' },
              { img: image2, title: 'Best Prices & Offers', desc: 'Best price destination with manufacturer deals.' },
              { img: image3, title: 'Wide Assortment', desc: 'Choose from 5000+ products across categories.' }
            ].map((item, i) => (
              <div key={i} className='flex gap-4 items-center'>
                <img src={item.img} className='w-14 h-14' />
                <div>
                  <p className='font-semibold text-lg'>{item.title}</p>
                  <p className='text-gray-600 text-sm'>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </section>
  )
}

export default ProductDisplayPage
