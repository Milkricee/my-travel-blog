/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/(.*)", // CORS-Header auf alle API-Routen anwenden
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:3000", // Nur Anfragen von localhost erlauben
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true", // Cookies senden
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS", // Erlaubte Methoden
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
