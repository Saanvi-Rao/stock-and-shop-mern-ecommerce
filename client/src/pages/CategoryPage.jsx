import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import EditCategory from '../components/EditCategory'
import ConfirmBox from '../components/ConfirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const CategoryPage = () => {
    const [openUploadCategory, setOpenUploadCategory] = useState(false)
    const [loading, setLoading] = useState(false)
    const [categoryData, setCategoryData] = useState([])
    const [openEdit, setOpenEdit] = useState(false)
    const [editData, setEditData] = useState({
        name: "",
        image: "",
    })
    const [openConfimBoxDelete, setOpenConfirmBoxDelete] = useState(false)
    const [deleteCategory, setDeleteCategory] = useState({
        _id: ""
    })

    const fetchCategory = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getCategory
            })
            const { data: responseData } = response

            if (responseData.success) {
                setCategoryData(responseData.data)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])

    const handleDeleteCategory = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data: deleteCategory
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                fetchCategory()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className="">
            <div className="relative bg-white shadow-md p-3 mb-5 flex items-center justify-center">
                
                {/* UPDATED — Heading smaller on mobile */}
                <h2 className="text-center text-xl sm:text-2xl font-semibold text-green-800 uppercase tracking-widest -ml-9 sm:ml-0">
                    Category
                </h2>

                {/* UPDATED — Button slightly smaller on mobile */}
                <button
                    onClick={() => setOpenUploadCategory(true)}
                    className="font-semibold text-xs sm:text-sm min-w-16 sm:min-w-20 
                    border border-green-600 text-green-800 hover:text-white hover:bg-green-700 
                    px-2 py-1 sm:px-3 sm:py-1 rounded-full absolute right-4"
                >
                    Add Category
                </button>
            </div>

            {!categoryData[0] && !loading && <NoData />}

            {/* -------- GRID START -------- */}
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {categoryData.map((category) => {
                    return (
                        <div
                            key={category._id}
                            className=" bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center justify-between hover:shadow-xl transition-all h-auto min-h-[0px]"
                        >
                            <div className="w-full flex-1 flex flex-col items-center">
                                <img
                                    alt={category.name}
                                    src={category.image}
                                    className="w-full h-42 object-cover rounded-lg bg-gray-50 p-2"
                                />

                                <h3 className="text-center text-md font-semibold text-gray-800 mt-2 uppercase">
                                    {category.name}
                                </h3>
                            </div>

                            <div className="flex w-full justify-center items-center gap-2 mt-3">
                                <button
                                    onClick={() => {
                                        setOpenEdit(true)
                                        setEditData(category)
                                    }}
                                    className="shrink-0 w-[60px] h-[42px] flex items-center justify-center bg-green-200 hover:bg-green-300 text-green-800 font-semibold rounded-xl"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => {
                                        setOpenConfirmBoxDelete(true)
                                        setDeleteCategory(category)
                                    }}
                                    className="shrink-0 w-[60px] h-[42px] flex items-center justify-center bg-red-200 hover:bg-red-300 text-red-800 font-semibold rounded-xl"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* -------- GRID END -------- */}

            {loading && <Loading />}

            {openUploadCategory && (
                <UploadCategoryModel
                    fetchData={fetchCategory}
                    close={() => setOpenUploadCategory(false)}
                />
            )}

            {openEdit && (
                <EditCategory
                    data={editData}
                    close={() => setOpenEdit(false)}
                    fetchData={fetchCategory}
                />
            )}

            {openConfimBoxDelete && (
                <ConfirmBox
                    close={() => setOpenConfirmBoxDelete(false)}
                    cancel={() => setOpenConfirmBoxDelete(false)}
                    confirm={handleDeleteCategory}
                />
            )}
        </section>
    )
}

export default CategoryPage
