import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import  axios_api  from "../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from "@/components/ui/card";


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

    // 4️⃣ destructure response
    const { user, token } = response.data;

    // 5️⃣ save auth state
    login(user, token);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Find your perfect study partner.</CardDescription>
        </CardHeader>

        {/* Content */}
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>

              {/* Error Message */}
              {error && <p className="text-sm text-red-500">{error}</p>}

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Register"}
              </Button>

              {/* Login Redirect */}
              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
