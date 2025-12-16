import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (data.password !== data.confirmPassword) {
            toast.error("Password and Confirm Password must be same")
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data: data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                })
                navigate("/login")
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className="w-full max-w-lg mx-auto my-8 p-8 bg-white rounded-2xl shadow-2xl border-2 border-neutral-900">

                {/* THIS HEADING */}
                <p className="text-center text-4xl font-playfair font-extrabold text-green-700 mb-6">
                    Welcome to Stock And Shop
                </p>

                <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>

                    {/* NAME */}
                    <div className='grid gap-2'>
                        <label htmlFor='name' className="font-semibold text-neutral-800">Name :</label>
                        <input
                            type='text'
                            id='name'
                            autoFocus
                            className='bg-blue-50 p-3 border rounded-lg outline-none w-full focus:border-green-600 transition'
                            name='name'
                            value={data.name}
                            onChange={handleChange}
                            placeholder='Enter your name'
                        />
                    </div>

                    {/* EMAIL */}
                    <div className='grid gap-2'>
                        <label htmlFor='email' className="font-semibold text-neutral-800">Email :</label>
                        <input
                            type='email'
                            id='email'
                            className='bg-blue-50 p-3 border rounded-lg outline-none w-full focus:border-green-600 transition'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className='grid gap-2'>
                        <label htmlFor='password' className="font-semibold text-neutral-800">Password :</label>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='bg-blue-50 p-3 border rounded-lg outline-none w-full focus:border-green-600 transition pr-12'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter your password'
                            />
                            <span
                                className="absolute right-3 top-3 cursor-pointer text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </span>
                        </div>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className='grid gap-2'>
                        <label htmlFor='confirmPassword' className="font-semibold text-neutral-800">Confirm Password :</label>
                        <div className='relative'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='confirmPassword'
                                className='bg-blue-50 p-3 border rounded-lg outline-none w-full focus:border-green-600 transition pr-12'
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Confirm your password'
                            />
                            <span
                                className="absolute right-3 top-3 cursor-pointer text-gray-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </span>
                        </div>
                    </div>

                    {/* BUTTON */}
                    <button
                        disabled={!valideValue}
                        className={`${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} 
                        text-white py-2 rounded font-semibold my-3 tracking-wide`}>
                        Register
                    </button>
                </form>

                {/* LOGIN LINK */}
                <p className="font-semibold text-neutral-800">
                    Already have account? 
                    <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-800'> Login</Link>
                </p>

            </div>
        </section>
    )
}

export default Register
