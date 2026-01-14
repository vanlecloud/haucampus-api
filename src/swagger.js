const path = require("path");
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
        url: "https://haucampus-api.onrender.com",
      },
    ],
  },


  apis: [
    path.join(__dirname, "app.js"),          
    path.join(__dirname, "routes/*.js"),     
  ],
};

module.exports = swaggerJSDoc(options);
