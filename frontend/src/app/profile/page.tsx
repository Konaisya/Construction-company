"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";

type UserResponse = {
  id: number;
  name: string;
  org_name: string;
  phone: string;
  email: string;
};

type OrderResponse = {
  id: number;
  user: {
    id: number;
    name: string;
    org_name: string;
    phone: string;
    email: string;
  };
  project: {
    id: number;
    name: string;
    main_image: string;
    description: string;
    is_done: boolean;
  };
  status: string;
  created_date: string;
  start_price: number | null;
  final_price: number | null;
  start_date: string | null;
  end_date: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth");
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await axios.get("http://127.0.0.1:8000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        const orderRes = await axios.get("http://127.0.0.1:8000/api/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(orderRes.data || []);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        localStorage.removeItem("accessToken");
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleCancelOrder = async (orderId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `http://127.0.0.1:8000/api/orders/${orderId}`,
        { status: "CANCELLED" }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: "CANCELLED" } : order));
    } catch (err) {
      console.error("Ошибка при отмене заказа:", err);
    }
  };


  const handlePayment = async (orderId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `http://127.0.0.1:8000/api/orders/${orderId}`,
        { status: "PAID" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: "PAID" } : order));
      setShowPaymentForm(false);  
    } catch (err) {
      console.error("Ошибка при оплате заказа:", err);
    }
  };


  const togglePaymentForm = () => setShowPaymentForm(!showPaymentForm);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
        <p className="animate-pulse text-lg">Загрузка...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-12 px-4">
      <div id="page-theme-detector" className="h-1 w-full"></div>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl mb-10"
        >
          <h1 className="text-4xl font-extrabold tracking-wide text-blue-400 mb-6">Профиль пользователя</h1>
          <div className="grid sm:grid-cols-2 gap-4 text-lg text-gray-200">
            <p><span className="text-gray-400">Имя:</span> {user.name}</p>
            <p><span className="text-gray-400">Организация:</span> {user.org_name}</p>
            <p><span className="text-gray-400">Телефон:</span> {user.phone}</p>
            <p><span className="text-gray-400">Email:</span> {user.email}</p>
          </div>
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold mb-6 text-blue-300">Ваши заказы</h2>
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 text-center border border-dashed border-gray-600 p-8 rounded-xl"
            >
              Вы еще ничего не заказали.
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">{order.project.name}</h3>
                  <p className="text-gray-300"><span className="text-gray-400">Организация:</span> {order.user.org_name}</p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Статус:</span>{" "}
                    <span className={`font-semibold ${order.status === "PENDING" ? "text-yellow-400" : "text-green-400"}`}>
                      {order.status === "PENDING" ? "В ожидании" : order.status}
                    </span>
                  </p>
                  <div className="mt-4">
                    <img 
                      src={`http://127.0.0.1:8000/${order.project.main_image}`} 
                      alt={order.project.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-4">Описание: {order.project.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="text-gray-400">Дата создания:</span> {new Date(order.created_date).toLocaleString()}
                  </p>
                  {order.status === "PENDING" && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="mt-4 bg-red-500 text-white p-2 rounded-lg"
                    >
                      Отменить заказ
                    </button>
                  )}
                  {order.status === "AWAITING_PAYMENT" && !showPaymentForm && (
                    <button
                      onClick={togglePaymentForm}
                      className="mt-4 bg-blue-500 text-white p-2 rounded-lg"
                    >
                      Оплатить
                    </button>
                  )}
                  {showPaymentForm && order.status === "AWAITING_PAYMENT" && (
                    <div className="mt-4 p-4 bg-white/10 rounded-lg">
                      <p className="text-gray-300 mb-4">Введите данные карты для оплаты:</p>
                      <input type="text" placeholder="Номер карты" className="p-2 rounded-lg mb-2 w-full" />
                      <input type="text" placeholder="ММ/ГГ" className="p-2 rounded-lg mb-2 w-full" />
                      <input type="text" placeholder="CVC" className="p-2 rounded-lg mb-4 w-full" />
                      <button
                        onClick={() => handlePayment(order.id)}
                        className="mt-4 bg-green-500 text-white p-2 rounded-lg"
                      >
                        Завершить оплату
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
