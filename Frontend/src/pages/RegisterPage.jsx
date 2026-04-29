import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputField } from "../components/ui/InputField";
import { ButtonOutline } from "../components/ui/button";

import api from "../api/axios"; // your axios instance
import { useAuth } from "../context/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ✅ Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ✅ UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔄 Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🚀 Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // ❗ prevents page reload

    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // ✅ Extract data
      const { user, token } = res.data;

      // ✅ Save to context + localStorage
      login(user, token);

      // ✅ Redirect to setup page
      navigate("/setup");
    } catch (err) {
      // ❌ Handle error
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false); // 🔥 always runs
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 space-y-4 border rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold text-center">
          Register
        </h2>

        {/* ❌ Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        {/* Name */}
        <InputField
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        {/* Email */}
        <InputField
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        {/* Password */}
        <InputField
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        {/* Submit */}
        <ButtonOutline type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </ButtonOutline>
      </form>
    </div>
  );
}