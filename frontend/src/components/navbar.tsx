"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full p-4 z-50 transition-all ${
        scrolled ? "bg-gray-900 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center text-white">
        <div className="text-xl font-bold">
          <Link href="/">АО "БСК-СПб"</Link>
        </div>
        <ul className="flex space-x-6">
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
            <li>
              <Link href="/profile" className="hover:text-blue-400 transition">
                Профиль
              </Link>
            </li>
          ) : (
            <li>
              <Link href="/register" className="hover:text-blue-400 transition">
                Регистрация
              </Link>
            </li>
          )}
        </ul>
      </div>
    </motion.nav>
  );
}
