"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold">
          Проектируем будущее
        </h1>
        <p className="text-lg text-gray-400 mt-4 max-w-2xl">
          Разработка и проектирование зданий, метро и инфраструктурных объектов.
          Высокотехнологичные решения, точные расчёты и индивидуальный подход к каждому проекту.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/projects"
            className="mt-6 inline-block bg-blue-600 px-6 py-3 text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Смотреть проекты
          </Link>
        </motion.div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="bg-gray-800 p-6 rounded-xl shadow-lg text-center cursor-pointer"
          >
            <div className="w-12 h-12 text-blue-500 mx-auto mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-gray-400 mt-2">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}

const features: Feature[] = [
  {
    title: "Передовые технологии",
    description: "Используем BIM-моделирование, AI и автоматизированные системы для точного проектирования.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l1.5 3M6.8 9.6l2.4-2.4M21 12h-3M16.2 18.4l-2.4-2.4M12 22l-1.5-3M6.8 14.4l2.4 2.4M3 12h3M7.8 5.6l2.4 2.4" />
      </svg>
    ),
  },
  {
    title: "Точность и надёжность",
    description: "Проектирование с минимальными допусками и строгим контролем качества на всех этапах.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m-7.5-7.5h15" />
      </svg>
    ),
  },
  {
    title: "Индивидуальный подход",
    description: "Разрабатываем проекты под ваши требования с учётом современных стандартов и инноваций.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h.01M8 3h8M3 21h18M3 21a9 9 0 019-9m0 0a9 9 0 019 9M21 21a9 9 0 01-9-9" />
      </svg>
    ),
  },
];
