"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories, Category } from "@/data/categoriesData";

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showPortfolio, setShowPortfolio] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-6">Выберите категорию</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, transform: "scale(0.9)" }}
                animate={{ opacity: 1, transform: "scale(1)" }}
                exit={{ opacity: 0, transform: "scale(0.9)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                onClick={() => setSelectedCategory(category)}
                className="cursor-pointer p-6 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition"
                style={{ willChange: "transform, opacity" }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h2 className="text-xl font-semibold mt-4">{category.name}</h2>
                <p className="text-gray-400 mt-2">{category.description}</p>
              </motion.div>
            ))
          ) : (
            <motion.div
              key={selectedCategory.id}
              initial={{ opacity: 0, transform: "scale(0.9)" }}
              animate={{ opacity: 1, transform: "scale(1)" }}
              exit={{ opacity: 0, transform: "scale(0.9)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg"
              style={{ willChange: "transform, opacity" }}
            >
              <h2 className="text-3xl font-bold">{selectedCategory.name}</h2>
              <p className="text-gray-400 mt-4">{selectedCategory.description}</p>
              <motion.div className="mt-6 flex gap-4">
                <motion.button
                  onClick={() => setShowPortfolio(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
                  className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                  style={{ willChange: "opacity" }}
                >
                  Посмотреть портфолио
                </motion.button>
                <motion.button
                  onClick={() => alert("Перейти к заказу")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
                  className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 transition"
                  style={{ willChange: "opacity" }}
                >
                  Перейти к заказу
                </motion.button>
              </motion.div>

              <motion.button
                onClick={() => {
                  setShowPortfolio(false);
                  setSelectedCategory(null);
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3, ease: "easeOut" }}
                className="mt-4 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                style={{ willChange: "opacity" }}
              >
                Назад
              </motion.button>

              {showPortfolio && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mt-8 text-gray-400"
                  style={{ willChange: "opacity" }}
                >
                  <h3 className="text-xl font-semibold">Портфолио</h3>
                  <p>Здесь будут проекты для этой категории.</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}