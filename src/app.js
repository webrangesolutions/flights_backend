import express from "express";
import dotenv from "dotenv";
import router from "./routes/main.routes.js";
import http from "http";
import cors from "cors";

export class App {
  constructor() {
    dotenv.config();
    this.app = express();
    this.app.use(express.json());
    this.http = new http.Server(this.app);
    this.PORT = process.env.PORT || 8000;
    this.initMiddleware();
    this.initRoutes();
  }

  initMiddleware() {
    this.app.use(
      cors({
        origin: [
          "http://localhost:3000",
          "http://localhost:8000",
          "https://go2-travel.vercel.app",
        ],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
      })
    );
    this.app.use(express.json());
  }

  initRoutes() {
    this.app.use("/", router);
  }

  createServer() {
    this.http.listen(this.PORT, () => {
      console.log(`Server started at ${this.PORT}`);
    });
  }
}
