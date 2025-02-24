export interface Category {
    id: number;
    name: string;
    description: string;
    image: string;
  }
  
  export const categories: Category[] = [
    {
      id: 1,
      name: "Метро",
      description: "Проектирование и строительство подземного транспорта.",
      image: "metro.jpg",
    },
    {
      id: 2,
      name: "Мосты",
      description: "Инженерные решения для мостов и путепроводов.",
      image: "/images/bridge.jpg",
    },
    {
      id: 3,
      name: "Жилые комплексы",
      description: "Архитектура и дизайн жилых зданий.",
      image: "/images/residential.jpg",
    },
  ];