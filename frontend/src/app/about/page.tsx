"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const features = [
  {
    title: "Опыт и профессионализм",
    description: "Более 10 лет проектирования сложных конструкций — от зданий до подземных тоннелей.",
    icon: "🛠️",
  },
  {
    title: "Индивидуальный подход",
    description: "Каждый проект разрабатывается с учетом пожеланий клиента и инновационных технологий.",
    icon: "🎯",
  },
  {
    title: "Современные технологии",
    description: "Используем передовые решения BIM и 3D-моделирования для точных расчетов.",
    icon: "💡",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold mb-4">О нас</h1>
        <p className="text-gray-400 text-lg">
          Мы — команда профессионалов, создающая уникальные архитектурные проекты и инфраструктурные решения.
          Наша миссия — объединить эстетику, функциональность и надежность в каждом проекте.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative h-80 w-full"
        >
            <Image
                src="/images/about.jpg"
                alt="О нас"
                fill 
                className="rounded-lg shadow-lg object-cover"
                priority
            />
        </motion.div>
        <div className="space-y-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 "
            >
              <span className="text-4xl">{feature.icon}</span>
              <div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
        className="text-center mt-16 text-gray-500"
      >
        <p>© {new Date().getFullYear()} Все права защищены | АО "БСК-СПб" </p>
      </motion.div>
    </div>
  );
}
