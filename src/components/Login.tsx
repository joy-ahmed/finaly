import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { login } from "../api/axios";
import { useAuthStore } from "../stores/authStore";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login({ username, password });
      setUser(user);
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-gray-800 rounded-lg p-8 shadow-lg">
      <img src="/finaly.png" alt="Logo" className="mx-auto mb-6 h-12" />
      <h2 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h2>
      <div className="mb-4 text-center text-red-400">
        Use username as "joy" and password "aaa" to log in.
      </div>
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
          disabled={loading}
          className={`w-full py-3 rounded font-semibold flex items-center justify-center gap-2 ${
            loading ? "bg-blue-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading && <LoaderCircle className="animate-spin w-5 h-5 text-white" />}
          {loading ? "Logging in..." : "Login"}
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
