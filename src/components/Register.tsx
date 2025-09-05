"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoaderCircle } from "lucide-react";
import { register, checkUserExists } from "../api/axios";

// Zod schema
const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    register: formRegister,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    setLoading(true);

    try {
      const userExists = await checkUserExists(data.username, data.email);
      if (userExists) {
        setFormError("username", { type: "manual", message: "Username or email already exists" });
        setLoading(false);
        return;
      }

      await register(data);
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please check your details.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-gray-800 rounded-lg p-8 shadow-lg">
      <img src="/finaly.png" alt="Logo" className="mx-auto mb-6 h-12" />
      <h2 className="text-2xl font-semibold mb-6 text-center">Create an Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-gray-700 text-white"
          {...formRegister("email")}
          required
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 rounded bg-gray-700 text-white"
          {...formRegister("username")}
          required
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-gray-700 text-white"
          {...formRegister("password")}
          required
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded font-semibold flex items-center justify-center gap-2 ${
            loading ? "bg-blue-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading && <LoaderCircle className="animate-spin w-5 h-5 text-white" />}
          {loading ? "Registering..." : "Register"}
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
