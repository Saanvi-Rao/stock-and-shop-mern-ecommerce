import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async(e)=>{
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                localStorage.setItem('accesstoken',response.data.data.accesstoken)
                localStorage.setItem('refreshToken',response.data.data.refreshToken)

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                setData({ email : "", password : "" })
                navigate("/")
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='w-full max-w-lg mx-auto my-8 p-8 bg-white rounded-2xl shadow-2xl border-2 border-neutral-900'>

                {/* Heading */}
                <p className="text-center text-2xl font-semibold mb-5 text-green-800 uppercase tracking-widest">
                    LOGIN
                </p>

                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>

                    {/* EMAIL SECTION UPDATED */}
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

                    {/* PASSWORD SECTION */}
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

                        <div className="flex justify-end mt-1">
                            <Link 
                                to="/forgot-password" 
                                className='font-semibold text-neutral-800 hover:text-green-800 text-sm'
                            >
                                Forgot password ?
                            </Link>
                        </div>
                    </div>

                    {/* LOGIN BUTTON */}
                    <button 
                        disabled={!valideValue} 
                        className={`${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} 
                        text-white py-2 rounded font-semibold my-3 tracking-wide`}
                    >
                        Login
                    </button>
                </form>

                <p className="font-semibold text-neutral-800">
                    Don't have an account? 
                    <Link to="/register" className='font-semibold text-green-700 hover:text-green-800'> Register</Link>
                </p>
            </div>
        </section>
    )
}

export default Login
