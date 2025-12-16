import React from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.png'
import { useSelector } from 'react-redux'
import { validURLConvert } from '../utils/validURLConvert'
import { useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => c._id === id)
      return filterData ? true : null
    })

    const url = `/${validURLConvert(cat)}-${id}/${validURLConvert(subcategory.name)}-${subcategory._id}`
    navigate(url)
  }

  return (
    <section className="bg-white">
      {/* BANNER */}
      <div className="container mx-auto">
        <div className="w-full rounded overflow-hidden">
          <img
            src={banner}
            className="hidden lg:block w-full h-90 md:h-80 lg:h-[450px] object-fill"
            alt="banner"
          />
          <img
            src={bannerMobile}
            className="lg:hidden w-full object-cover rounded-md"
            alt="banner"
          />
        </div>
      </div>

      {/* CATEGORY GRID */}
      <div className="container mx-auto px-4 my-4 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-4">
        {loadingCategory ? (
          new Array(12).fill(null).map((_, index) => (
            <div
              key={index + "loadingcategory"}
              className="bg-white rounded-xl p-4 h-36 grid gap-3 shadow animate-pulse"
            >
              <div className="bg-blue-100 h-20 rounded-lg"></div>
              <div className="bg-blue-100 h-6 rounded-lg"></div>
            </div>
          ))
        ) : (
          categoryData.map(cat => (
            <div
              key={cat._id + "displayCategory"}
              onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
              className="bg-white p-3 rounded-xl shadow border border-black hover:shadow-xl cursor-pointer transition-all duration-200 transform hover:-translate-y-1 flex flex-col items-center text-center"
            >
              <div className="w-full h-24 flex items-center justify-center bg-gray-50 rounded-lg">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-20 object-contain"
                />
              </div>

              <p className="mt-3 font-semibold text-sm md:text-base text-gray-700 uppercase leading-tight">
                {cat.name}
              </p>
            </div>
          ))
        )}
      </div>

      {/* DISPLAY CATEGORY-WISE PRODUCTS */}
      {categoryData?.map(c => (
        <CategoryWiseProductDisplay
          key={c?._id + "CategorywiseProduct"}
          id={c?._id}
          name={c?.name}
        />
      ))}
    </section>
  )
}

export default Home
