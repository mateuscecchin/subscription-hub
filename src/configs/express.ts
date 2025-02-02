import express from "express";
import cors from "cors";
import { routes } from "../routes";

export const app = express();

app.set("trust proxy", true);
app.use(cors());
app.use(express.json());
app.use("/", routes);
