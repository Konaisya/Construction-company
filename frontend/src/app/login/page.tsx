"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";


export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setOrgName("");
    setPhone("");
    setError("");
    setSuccess("");
  };

  function getUserRoleFromToken(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.role || null;
  } catch (e) {
    console.error("Ошибка при декодировании токена", e);
    return null;
  }
}


  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append("email", email);
        formData.append("password", password);

        const { data } = await axios.post(
          "http://127.0.0.1:8000/api/auth/login",
          formData,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

       if (!data?.access_token) throw new Error("Ошибка входа");
          localStorage.setItem("accessToken", data.access_token);
          const role = getUserRoleFromToken(data.access_token);
          setSuccess("Успешный вход! Перенаправляем...");

          setTimeout(() => {
            if (role === "ADMIN") {
              window.location.href = "/admin";
            } else {
              window.location.href = "/profile";
            }
          }, 1000);
      } else {
        const { data } = await axios.post(
          "http://127.0.0.1:8000/api/auth/signup",
          {
            name,
            org_name: orgName,
            role: "USER",
            phone,
            email,
            password,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        setSuccess("Регистрация успешна! Теперь вы можете войти.");
        setIsLogin(true);
        resetForm();
      }
    } catch (error: any) {
      console.error("Ошибка:", error);
      setError(
        error.response?.data?.message ||
          "Произошла ошибка. Пожалуйста, попробуйте снова."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <motion.div
        key={isLogin ? "login" : "register"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? "Вход" : "Регистрация"}
        </h2>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-500 text-center mb-4 p-2 bg-red-500/10 rounded"
            >
              {error}
            </motion.p>
          )}
          {success && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-green-500 text-center mb-4 p-2 bg-green-500/10 rounded"
            >
              {success}
            </motion.p>
          )}
        </AnimatePresence>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <input
                  type="text"
                  placeholder="Имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <input
                  type="text"
                  placeholder="Название организации"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <input
                  type="tel"
                  placeholder="Телефон"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </motion.div>
            </>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: isLogin ? 0.1 : 0.3 }}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: isLogin ? 0.15 : 0.35 }}
          >
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold"
          >
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </motion.button>
        </form>

        <motion.div
          className="mt-6 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
          <button
            onClick={() => {
              resetForm();
              setIsLogin(!isLogin);
            }}
            className="text-blue-400 hover:text-blue-500 focus:outline-none"
          >
            {isLogin ? "Зарегистрируйтесь" : "Войти"}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
