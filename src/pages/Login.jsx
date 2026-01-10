import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function Login() {
  const { login } = useAppContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter email & password");
      return;
    }

    try {
      setLoading(true);

      const role = await login(form.email, form.password);

 
      if (role === "blocked") {
        toast.error("you are blocked")
      
        return;
      }

      if (!role) {
        toast.error("Invalid email or password");
        return;
      }

    
      toast.success("Login successful");

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch {
      toast.error("Server error");
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
      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-xl w-80 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            name="email"
            type="email"
            value={form.email}
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 rounded border"
          />

          <input
            name="password"
            type="password"
            value={form.password}
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 rounded border"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded text-white bg-black"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don&apos;t have an account?
          <Link to="/register" className="text-blue-600 ml-1">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
