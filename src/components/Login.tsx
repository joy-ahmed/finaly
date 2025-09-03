import { useState } from "react";
import { login } from "../api/axios";
import { useAuthStore } from "../stores/authStore";
// import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);
  // const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login({ username, password });
      setUser(user);
      // navigate("/dashboard");
      window.location.href = "/dashboard"; // Full reload to reset state
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-gray-800 rounded-lg p-8 shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 rounded bg-gray-700 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 py-3 rounded hover:bg-blue-500 font-semibold"
        >
          Login
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-400">
          Register
        </a>
      </div>
    </div>
  );
};

export default Login;