const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HAUCampus API",
      version: "1.0.0",
      description: "API cho ứng dụng HAUCampus",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
      {
        url: "https://your-render-name.onrender.com",
        description: "Render server",
      },
    ],
  },

  // 🔥 BẮT BUỘC PHẢI CÓ routes
  apis: [
    "./index.js",
    "./routes/*.js",
  ],
};

module.exports = swaggerJSDoc(options);
