// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import axios from "axios";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email", placeholder: "your@example.com" },
//         password: { label: "Пароль", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials) throw new Error("Данные авторизации отсутствуют");
      
//         try {
//           const apiUrl = `http://127.0.0.1:8000/api/auth/login`;
      
//           const { data } = await axios.post(apiUrl, {
//             email: credentials.email,
//             password: credentials.password, 
//           }, {
//             headers: {
//               'Content-Type': 'application/json', 
//             }
//           });
      
//           console.log("API response:", data); // Добавьте это для логирования ответа от API
      
//           if (!data || !data.id || !data.access_token) {
//             throw new Error("Ошибка входа");
//           }
      
//           return {
//             id: data.id,
//             email: data.email,
//             token: data.access_token,
//           };
//         } catch (error: any) {
//           console.error("Login error:", error.response?.data || error.message);
//           throw new Error(error.response?.data?.detail || "Ошибка входа. Проверьте данные.");
//         }
//       }
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//         token.accessToken = user.token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user = { id: token.id, email: token.email };
//       session.accessToken = token.accessToken;
//       return session;
//     },
//   },
//   pages: { signIn: "/auth/login" },  
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as POST };