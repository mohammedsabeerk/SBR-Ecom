import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import p8 from "../../assets/p8.jpg";
import { useAppContext } from "../../context/AppContext";

function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAppContext();


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const validatePassword = (password) => {
    const errors = [];


    if (password.length < 8) {
      errors.push("At least 8 characters");
    }


    if (!/[A-Z]/.test(password)) {
      errors.push("One uppercase letter (A-Z)");
    }


    if (!/[a-z]/.test(password)) {
      errors.push("One lowercase letter (a-z)");
    }


    if (!/[0-9]/.test(password)) {
      errors.push("One number (0-9)");
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push("One special character (!@#$%^&*, etc)");
    }


    const weakPasswords = ["12345678", "password", "abc123", "qwerty", "111111", "123456", "admin123"];
    if (weakPasswords.includes(password.toLowerCase())) {
      errors.push("This password is too common - use a stronger password");
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};


    if (!form.username || !form.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!form.email || !form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email (e.g., user@example.com)";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordErrors = validatePassword(form.password);
      if (passwordErrors.length > 0) {
        newErrors.password = `Password must include: ${passwordErrors.join(", ")}`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors below");
      return;
    }

    try {
      setLoading(true);

      await register(form.username, form.email, form.password);

      toast.success("Registered successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Server error or email already exists";
      setErrors({ server: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${p8})` }}
    >
      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-xl w-[380px] shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {errors.server && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.server}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
   
          <div>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className={`w-full p-2 rounded border focus:outline-none focus:ring-2 transition ${
                errors.username
                  ? "border-red-500 bg-red-50 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.username && (
              <p className="text-red-600 text-xs mt-1">⚠ {errors.username}</p>
            )}
          </div>

    
          <div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email (user@example.com)"
              className={`w-full p-2 rounded border focus:outline-none focus:ring-2 transition ${
                errors.email
                  ? "border-red-500 bg-red-50 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">⚠ {errors.email}</p>
            )}
          </div>

   
          <div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className={`w-full p-2 rounded border focus:outline-none focus:ring-2 transition ${
                errors.password
                  ? "border-red-500 bg-red-50 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.password && (
              <div className="text-red-600 text-xs mt-1 bg-red-50 p-2 rounded border border-red-200">
                <p className="font-semibold mb-1">⚠ Password requirements:</p>
                <p>{errors.password}</p>
              </div>
            )}

        
            {form.password && !errors.password && (
              <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                <p className="text-green-700 text-xs font-semibold">✓ Password is strong</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?
          <Link to="/login" className="text-blue-600 ml-1 hover:underline font-semibold">
            Login here
          </Link>
        </p>


        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200 text-xs text-blue-800">
          <p className="font-semibold mb-2">Password Requirements:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Minimum 8 characters</li>
            <li>At least 1 uppercase letter (A-Z)</li>
            <li>At least 1 lowercase letter (a-z)</li>
            <li>At least 1 number (0-9)</li>
            <li>At least 1 special character (!@#$%^&*, etc)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Register;
