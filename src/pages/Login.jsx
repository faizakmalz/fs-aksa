import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Login = () => {
  const { login, user } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset error
    const result = await login(form.username, form.password);
    if (!result.success) {
      setError(result.message || "Username atau password salah");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 flex-col">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white font-light mb-8">
        Aplikasi Pegawai<br /><b className="font-bold">Gedangan</b>
      </h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Login
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Username</label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-black dark:text-white"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-black dark:text-white"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer"
          >
            Login 
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
