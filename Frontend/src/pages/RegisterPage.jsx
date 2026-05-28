import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import  axios_api  from "../api/axios";


// import React from 'react'



const RegisterPage = () => {
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
});

const [loading, setLoading] = useState(false);

const [error, setError] = useState(null);

const navigate = useNavigate();

// ✅ Auth context
const { login } = useAuth();

const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev, // keep existing fields
    [name]: value, // update only the changed field
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault(); // 1️⃣ stop page refresh

  // console.log(formData);

  setLoading(true); // 2️⃣ start loading
  setError(null); // clear previous errors

  try {

    await new Promise((resolve) => setTimeout(resolve, 2000));
    // 3️⃣ API call
    const response = await axios_api.post("/api/auth/register", formData);

    login(response.data);

    // 6️⃣ redirect
    navigate("/setup");
  } catch (err) {
    // ❌ handle error
    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    // 🔁 always stop loading
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">S</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight leading-none text-slate-800">
            Skill<span className="text-indigo-600">Sync</span>
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Create your account
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Find your perfect study partner
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                disabled={loading}
                required
                className="w-full h-11 px-4 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={loading}
                required
                className="w-full h-11 px-4 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                disabled={loading}
                required
                className="w-full h-11 px-4 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="border-t border-slate-100 my-6" />

          {/* Bottom link */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline transition-colors"
            >
              Login
            </Link>
          </p>

        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-slate-400 mt-6">
          SkillSync — Find your perfect study partner
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;
