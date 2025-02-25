"use client";
import { useRouter } from 'next/navigation';

export default function ErrorPage() {
  const router = useRouter();
  const error = "Произошла ошибка при авторизации";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6 text-center">Ошибка</h2>
        <p className="text-red-500 text-center mb-4">{error}</p>
        <button
          onClick={() => router.push('/api/auth/login')}
          className="w-full p-3 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-semibold"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
