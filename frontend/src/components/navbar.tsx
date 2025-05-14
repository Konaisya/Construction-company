"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function decodeToken(token: string): { role?: string } {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return {};
  }
}

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decoded = decodeToken(token);
      setRole(decoded.role || null);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }
  }, []);

  useEffect(() => {
    const target = document.getElementById("page-theme-detector");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsDark(!entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
        isDark
          ? "bg-gray-900/90 shadow-md backdrop-blur-md"
          : "bg-white/90 text-gray-900 shadow-lg backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className={`text-xl font-bold tracking-wide ${isDark ? "text-white" : "text-black"}`}>
          <Link href="/">АО "БСК-СПб"</Link>
        </div>
        <ul className={`flex space-x-6 font-medium ${isDark ? "text-white" : "text-gray-800"}`}>
          <li>
            <Link href="/" className="hover:text-blue-400 transition">
              Главная
            </Link>
          </li>
          <li>
            <Link href="/categories" className="hover:text-blue-400 transition">
              Категории
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-blue-400 transition">
              О нас
            </Link>
          </li>
          {isAuthenticated ? (
            role === "ADMIN" ? (
              <li>
                <Link href="/admin" className="hover:text-blue-400 transition">
                  Админ-панель
                </Link>
              </li>
            ) : (
              <li>
                <Link href="/profile" className="hover:text-blue-400 transition">
                  Профиль
                </Link>
              </li>
            )
          ) : (
            <li>
              <Link href="/login" className="hover:text-blue-400 transition">
                Войти
              </Link>
            </li>
          )}
        </ul>
      </div>
    </motion.nav>
  );
}
