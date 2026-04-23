import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend Assignment 5 API",
      version: "1.0.0",
      description:
        "API documentation for Assignment 5 with OpenAPI, Joi validation, Helmet, and CORS configuration.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
  },
  apis: [
  "./src/api/v1/routes/*.ts",
  "./src/api/v1/validation/*.ts",
  "./src/app.ts",
],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);