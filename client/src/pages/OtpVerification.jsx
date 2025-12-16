import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OtpVerification = () => {

    const [data, setData] = useState(["", "", "", "", "", ""])
    const inputRef = useRef([])
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!location?.state?.email) {
            navigate("/forgot-password")
        }
    }, [])

    const valideValue = data.every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data: {
                    otp: data.join(""),
                    email: location?.state?.email
                }
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setData(["", "", "", "", "", ""])

                navigate("/reset-password", {
                    state: {
                        data: response.data,
                        email: location?.state?.email
                    }
                })
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className="w-full container mx-auto px-2">
            <div className="w-full max-w-lg mx-auto my-8 p-8 bg-white rounded-2xl shadow-2xl border-2 border-neutral-900">

                {/* NEW HEADING (matches login & forgot password) */}
                <p className="text-center text-2xl font-semibold mb-5 text-green-800 uppercase tracking-widest">
                    OTP VERIFICATION
                </p>

                <form className="grid gap-4 py-4" onSubmit={handleSubmit}>

                    <div className="grid gap-2">
                        <label className="font-semibold text-neutral-800">Enter OTP :</label>

                        <div className="flex items-center gap-3 justify-between mt-2">
                            {data.map((value, index) => (
                                <input
                                    key={"otp" + index}
                                    type="text"
                                    maxLength={1}
                                    value={value}
                                    ref={(ref) => (inputRef.current[index] = ref)}
                                    onChange={(e) => {
                                        const val = e.target.value
                                        const newData = [...data]
                                        newData[index] = val
                                        setData(newData)

                                        if (val && index < 5) {
                                            inputRef.current[index + 1].focus()
                                        }
                                    }}
                                    className="bg-blue-50 p-3 w-14 border rounded-lg outline-none text-center font-semibold 
                                               focus:border-green-600 transition"
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        disabled={!valideValue}
                        className={`${valideValue
                                ? "bg-green-800 hover:bg-green-700"
                                : "bg-gray-500"
                            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
                    >
                        Verify OTP
                    </button>
                </form>

                <p className="font-semibold text-neutral-800">
                    Already have an account?{" "}
                    <Link to="/login" className="text-green-700 hover:text-green-800 font-semibold">
                        Login
                    </Link>
                </p>

            </div>
        </section>
    )
}

export default OtpVerification
