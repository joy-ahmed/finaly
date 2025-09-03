import { useState } from "react";
import { register } from "../api/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register({ email, username, password });
      navigate("/login"); // Redirect to login after successful registration
    } catch (err) {
      setError("Registration failed. Please check your details.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-gray-800 rounded-lg p-8 shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
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
          Register
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-400">
          Login
        </a>
      </div>
    </div>
  );
};

export default Register;