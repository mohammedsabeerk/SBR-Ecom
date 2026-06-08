import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

function Login() {
  const { login } = useAppContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
   
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

  
    if (!form.email || !form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

   
    if (!form.password) {
      newErrors.password = "Password is required";
    }

    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please check your credentials");
      return;
    }

    try {
      setLoading(true);

      const role = await login(form.email, form.password);

 
      if (role === "blocked") {
        toast.error("Your account has been blocked")
      
        return;
      }

      if (!role) {
        setErrors({ login: "Invalid email or password" });
        toast.error("Invalid email or password");
        return;
      }

    
      toast.success("Login successful");

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Server error";
      setErrors({ login: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521335629791-ce4aec67dd53')",
      }}
    >
      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-xl w-96 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {errors.login && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            ⚠ {errors.login}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
        
          <div>
            <input
              name="email"
              type="email"
              value={form.email}
              placeholder="Email"
              onChange={handleChange}
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
              placeholder="Password"
              onChange={handleChange}
              className={`w-full p-2 rounded border focus:outline-none focus:ring-2 transition ${
                errors.password
                  ? "border-red-500 bg-red-50 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">⚠ {errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don&apos;t have an account?
          <Link to="/register" className="text-blue-600 ml-1 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
