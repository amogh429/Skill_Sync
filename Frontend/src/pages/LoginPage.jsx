import { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
// import axios_api from '@/api/axios';


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";



const LoginPage = () => {

  const [formData,setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setLoading(true);
    setError(null);
    
    try{
      const res = await fetch('/api/auth/login',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json();
      console.log("Login response:", data);
      if(!res.ok){
        throw new Error(data.message || "Something went wrong");
      }

      login(data);
      navigate('/matches');
    }catch(error) {
      setError(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }
  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">

    <Card className="w-full max-w-md">

      <CardHeader>
        <CardTitle>
          Welcome back
        </CardTitle>

        <CardDescription>
          Login to find your study matches
        </CardDescription>
      </CardHeader>

      <CardContent>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label>Email</label>

            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label>Password</label>

            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </Button>

          {/* Bottom Link */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-blue-600 hover:underline"
            >
              Sign up
            </Link>
          </p>

        </form>

      </CardContent>

    </Card>

  </div>
);
}

export default LoginPage