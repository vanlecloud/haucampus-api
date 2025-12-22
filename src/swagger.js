const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HAUCampus API",
      version: "1.0.0",
      description: "API cung cấp dữ liệu từ website tinchi.hau.edu.vn cho ứng dụng mobile"
    },
    servers: [
      {
        url: "https://haucampus-api.onrender.com",
        description: "Production server"
      },
      {
        url: "http://localhost:3000",
        description: "Local server"
      }
    ],
    omponents: {
      securitySchemes: {
        SessionCookie: {
          type: "apiKey",
          in: "header",
          name: "Cookie",
          description:
            "Nhập cookie dạng: ASP.NET_SessionId=xxxxxx",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"] 
};

module.exports = swaggerJsdoc(options);
