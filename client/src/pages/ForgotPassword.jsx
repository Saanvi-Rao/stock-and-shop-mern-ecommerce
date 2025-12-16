import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    })
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((prev) => ({ ...prev, [name]: value }))
    }

    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data: data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                navigate("/verification-otp", {
                    state: data
                })
                setData({
                    email: "",
                })
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className="w-full container mx-auto px-2">
            <div className="w-full max-w-lg mx-auto my-8 p-8 bg-white rounded-2xl shadow-2xl border-2 border-neutral-900">

                {/* Heading */}
                <p className="text-center text-2xl font-semibold mb-5 text-green-800 uppercase tracking-widest">
                    Forgot Password
                </p>

                <form className="grid gap-4" onSubmit={handleSubmit}>

                    {/* Email Field */}
                    <div className="grid gap-2">
                        <label
                            htmlFor="email"
                            className="font-semibold text-neutral-800"
                        >
                            Email :
                        </label>

                        <input
                            type="email"
                            id="email"
                            className="bg-blue-50 p-3 border rounded-lg outline-none focus:border-green-600 transition"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            placeholder="Enter your registered email to receive an OTP"
                        />
                    </div>

                    {/* Button */}
                    <button
                        disabled={!valideValue}
                        className={`${valideValue
                            ? "bg-green-700 hover:bg-green-800"
                            : "bg-gray-400 cursor-not-allowed"
                            } text-white py-3 rounded-lg font-semibold my-2 tracking-wide transition`}
                    >
                        Send OTP
                    </button>
                </form>

                {/* Footer Link */}
                <p className="font-semibold text-neutral-800 mt-5">
                    Already have account?{" "}
                    <Link
                        to="/login"
                        className="text-green-700 hover:text-green-800 underline-offset-2 hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </section>
    )
}

export default ForgotPassword
