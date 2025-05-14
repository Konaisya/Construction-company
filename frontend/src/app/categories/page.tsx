"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";  // Импортируем toast

interface Category {
  id: number;
  name: string;
  image: string;
  description?: string;
}

interface Project {
  id: number;
  name: string;
  description?: string;
  main_image: string;
  id_category: number;
  id_city: number;
  category: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
  };
  attributes: {
    attribute: {
      id: number;
      name: string;
    };
    value: string;
    unit: {
      id: number;
      name: string;
    } | null;
  }[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/categories/");
        setCategories(response.data);
      } catch (err) {
        setError("Не удалось загрузить категории. Пожалуйста, попробуйте позже.");
        console.log("Error fetching categories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchProjects = async (categoryId: number) => {
    setIsLoadingProjects(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/products/", {
        params: {
          id_category: categoryId
        }
      });
      setProjects(response.data);
    } catch (err) {
      console.log("Error fetching projects:", err);
      setProjects([]);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedProject(null);
    fetchProjects(category.id);
  };

  const handleOrderProject = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Вы должны войти в систему, чтобы сделать заказ.");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/orders/",
        { id_project: selectedProject?.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Проект успешно заказан!");  // Показ уведомления при успешном заказе
    } catch (err: any) {
      console.error("Ошибка при заказе проекта:", err);
      toast.error(
        err.response?.data?.detail ||
        "Не удалось оформить заказ. Пожалуйста, попробуйте позже."
      );  // Показ уведомления при ошибке
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6">Ошибка</h1>
          <p className="text-xl text-gray-300 mb-8">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="text-white hover:bg-gray-800"
          >
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12"
        >
          {selectedProject ? selectedProject.name : 
           selectedCategory ? selectedCategory.name : 
           "Наши направления работы"}
        </motion.h1>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <Skeleton className="h-40 w-full rounded-md" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : selectedProject ? (
            <motion.div
              key="project-detail"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-lg shadow-xl overflow-hidden"
            >
              <div className="relative aspect-video w-full">
                <img
                  src={`http://127.0.0.1:8000/${selectedProject.main_image}`}
                  alt={selectedProject.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">{selectedProject.name}</h2>
                    <div className="flex space-x-4 mt-2 text-gray-300">
                      <span>Категория: {selectedProject.category?.name}</span>
                      <span>Город: {selectedProject.city?.name}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setSelectedProject(null)}
                    variant="ghost"
                    className="text-gray-300 hover:bg-gray-700"
                  >
                    Назад
                  </Button>
                </div>

                {selectedProject.description && (
                  <div className="prose prose-invert max-w-none mb-8">
                    <p className="whitespace-pre-line">{selectedProject.description}</p>
                  </div>
                )}

                {selectedProject.attributes && selectedProject.attributes.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Характеристики</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedProject.attributes.map((attr, index) => (
                        <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                          <h4 className="font-medium">{attr.attribute.name}</h4>
                          <p className="text-gray-400">
                            {attr.value} {attr.unit?.name || ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={handleOrderProject} // Обработчик заказа
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Заказать проект
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : !selectedCategory ? (
            <motion.div
              key="categories-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    onClick={() => handleCategorySelect(category)}
                    className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer h-full"
                  >
                    <CardHeader>
                      <div className="relative aspect-video overflow-hidden rounded-md">
                        <img
                          src={`http://127.0.0.1:8000/${category.image}`|| "/placeholder.jpg"}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-xl text-white">{category.name}</CardTitle>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="projects-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Проекты в категории "{selectedCategory.name}"</h2>
                <Button 
                  onClick={() => setSelectedCategory(null)}
                  variant="ghost"
                  className="text-gray-300 hover:bg-gray-700"
                >
                  Назад к категориям
                </Button>
              </div>

              {isLoadingProjects ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, index) => (
                    <Card key={index} className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <Skeleton className="h-40 w-full rounded-md" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card 
                        onClick={() => setSelectedProject(project)}
                        className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer h-full"
                      >
                        <CardHeader className="p-0">
                          <div className="relative aspect-video overflow-hidden rounded-t-md">
                            {project.main_image ? (
                              <img
                                src={`http://127.0.0.1:8000/${project.main_image}`}
                                alt={project.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-400">Нет изображения</span>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <CardTitle className="text-xl text-white">{project.name}</CardTitle>
                          <div className="mt-2 text-sm text-gray-400">
                            {project.city?.name || "Город не указан"}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p>В этой категории пока нет проектов</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
