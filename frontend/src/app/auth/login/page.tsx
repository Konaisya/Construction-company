"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }

    try {
      const { data } = await axios.post("http://127.0.0.1:8000/api/auth/login", 
        JSON.stringify({
          email: email,     
          password: password, 
        }),
        {
          headers: {
            "Content-Type": "application/json", 
          },
        }
      );

      console.log("API response:", data);

      if (!data || !data.access_token) {
        throw new Error("Ошибка входа");
      }
      localStorage.setItem("accessToken", JSON.stringify(data.access_token));

      console.log("Logged in successfully");
      // window.location.href = "/dashboard"; 
    } catch (error: any) {
      console.error("Ошибка запроса: ", error);
      setError("Ошибка входа. Проверьте данные.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center bg-gray-900 text-white"
    >
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6 text-center">Вход</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-semibold"
          >
            Войти
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Нет аккаунта?{" "}
          <a href="/auth/register" className="text-blue-400 hover:text-blue-500">
            Зарегистрируйтесь
          </a>
        </p>
      </div>
    </motion.div>
  );
}
