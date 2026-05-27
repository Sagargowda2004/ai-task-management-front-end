import { useState } from "react";

import api from "../api/axios";

import { useNavigate } from "react-router-dom";

function ResetPassword() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        email: "",
        newPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value,
        });
    };

    const handleResetPassword = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await api.post(

                "/api/auth/reset-password",

                formData
            );

            alert(response.data);

            navigate("/");

        } catch (error) {

            console.error(error);

            alert("Password reset failed");
        }

        finally {

            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">

            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

                <h1 className="text-3xl font-bold text-center mb-2">

                    Reset Password

                </h1>

                <p className="text-gray-500 text-center mb-6">

                    Enter your email and new password

                </p>

                <form
                    onSubmit={handleResetPassword}
                    className="space-y-4"
                >

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />

                    <input
                        type="password"
                        name="newPassword"
                        placeholder="Enter New Password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800"
                    >

                        {loading
                            ? "Resetting..."
                            : "Reset Password"}

                    </button>

                </form>

            </div>

        </div>
    );
}

export default ResetPassword;