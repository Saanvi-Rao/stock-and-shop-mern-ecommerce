import React, { useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validValue = Object.values(data).every(el => el)

  useEffect(() => {
    if (!(location?.state?.data?.success)) {
      navigate("/")
    }

    if (location?.state?.email) {
      setData(prev => ({
        ...prev,
        email: location.state.email
      }))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and confirm password must match.")
      return
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data
      })

      if (response.data.error) {
        toast.error(response.data.message)
      }

      if (response.data.success) {
        toast.success(response.data.message)
        navigate("/login")

        setData({
          email: "",
          newPassword: "",
          confirmPassword: ""
        })
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className="w-full container mx-auto px-2">
      <div className="w-full max-w-lg mx-auto my-8 p-8 bg-white rounded-2xl shadow-2xl border-2 border-neutral-900">

        {/* HEADING  */}
        <p className="text-center text-2xl font-semibold mb-5 text-green-800 uppercase tracking-widest">
            Forgot Password
        </p>

        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>

          {/* NEW PASSWORD */}
          <div className="grid gap-2">
            <label htmlFor="newPassword" className="font-semibold text-neutral-800">
              New Password :
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={data.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="bg-blue-50 p-3 border rounded-lg outline-none w-full 
                           focus:border-green-600 transition pr-12"
              />

              <span
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="grid gap-2">
            <label htmlFor="confirmPassword" className="font-semibold text-neutral-800">
              Confirm Password :
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="bg-blue-50 p-3 border rounded-lg outline-none w-full 
                           focus:border-green-600 transition pr-12"
              />

              <span
                onClick={() => setShowConfirmPassword(prev => !prev)}
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>
          </div>

          {/* BUTTON */}
          <button
            disabled={!validValue}
            className={`${
              validValue
                ? "bg-green-800 hover:bg-green-700"
                : "bg-gray-500 cursor-not-allowed"
            } text-white py-2 rounded font-semibold my-3 tracking-wide transition`}
          >
            Change Password
          </button>
        </form>

        <p className="font-semibold text-neutral-800 text-center">
          Already have an account?{" "}
          <Link to={"/login"} className="font-semibold text-green-700 hover:text-green-800">
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}

export default ResetPassword
