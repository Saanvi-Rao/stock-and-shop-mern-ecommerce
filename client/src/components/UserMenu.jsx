import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from '../utils/isAdmin'

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      })

      if (response.data.success) {
        close && close()
        dispatch(logout())
        localStorage.clear()
        toast.success(response.data.message)
        navigate("/")
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleClose = () => {
    close && close()
  }

  return (
    <div className="font-inter text-gray-900">

      {/* Header */}
      <div className="font-semibold text-lg mb-1">My Account</div>

      {/* User Name + Link */}
      <div className="text-sm flex items-center gap-2 mb-3">
        <span className="max-w-52 text-ellipsis line-clamp-1 font-medium">
          {user.name || user.mobile}
          <span className="text-red-600 font-semibold ml-1">
            {user.role === "ADMIN" ? "(Admin)" : ""}
          </span>
        </span>

        <Link 
          onClick={handleClose} 
          to={"/dashboard/profile"} 
          className="hover:text-green-700 transition"
        >
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>

      <Divider />

      {/* Menu Items */}
      <div className="text-sm grid gap-1 pt-2">

        {isAdmin(user.role) && (
          <Link 
            onClick={handleClose} 
            to={"/dashboard/category"} 
            className="px-2 py-1 rounded hover:bg-green-100 transition"
          >
            Category
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link 
            onClick={handleClose} 
            to={"/dashboard/subcategory"} 
            className="px-2 py-1 rounded hover:bg-green-100 transition"
          >
            Sub Category
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link 
            onClick={handleClose} 
            to={"/dashboard/upload-product"} 
            className="px-2 py-1 rounded hover:bg-green-100 transition"
          >
            Upload Product
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link 
            onClick={handleClose} 
            to={"/dashboard/product"} 
            className="px-2 py-1 rounded hover:bg-green-100 transition"
          >
            Product
          </Link>
        )}

        <Link 
          onClick={handleClose} 
          to={"/dashboard/myorders"} 
          className="px-2 py-1 rounded hover:bg-green-100 transition"
        >
          My Orders
        </Link>

        <Link 
          onClick={handleClose} 
          to={"/dashboard/address"} 
          className="px-2 py-1 rounded hover:bg-green-100 transition"
        >
          Save Address
        </Link>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="text-left px-2 py-1 rounded hover:bg-red-100 font-semibold text-red-600 transition"
        >
          Log Out
        </button>

      </div>
    </div>
  )
}

export default UserMenu
