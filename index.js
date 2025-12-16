import express from "express";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import loadRoutes from "./config/routes.js";
import path from "path";
import SwaggerParser from "@apidevtools/swagger-parser";
import models from "./config/database/index.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

loadRoutes(app);

app.use(express.static("public/uploads"));

const openapiPath = path.resolve("./docs/openapi.yaml"); 
const bundledSpec = await SwaggerParser.bundle(openapiPath);

app.use("/api", swaggerUI.serve, swaggerUI.setup(bundledSpec));

await models.sequelize.sync({ alter: true });

app.listen(4002, () => console.log("Server started on http://localhost:4002"));
