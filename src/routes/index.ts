import { Router } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "../services/UserService";
import { AuthService } from "../services/AuthService";
import { AuthController } from "../controllers/AuthController";
import { UserController } from "../controllers/UserController";
import { PlanRepository } from "../repositories/PlanRepository";
import { PlanService } from "../services/PlanService";
import { PlanController } from "../controllers/PlanController";
import { authenticate } from "../middlewares/authentication";
import { VersionRepository } from "../repositories/VersionRepository";
import { VersionService } from "../services/VersionService";
import { VersionController } from "../controllers/VersionController";
import { PaymentController } from "../controllers/PaymentController";

const userRepository = new UserRepository();
const planRepository = new PlanRepository();
const versionRepository = new VersionRepository();

const userService = new UserService(userRepository);
const authService = new AuthService(userRepository);
const planService = new PlanService(planRepository);
const versionSerivce = new VersionService(versionRepository);

const authController = new AuthController(authService);
const userController = new UserController(userService, planService);
const planController = new PlanController(planService);
const versionController = new VersionController(versionSerivce);
const paymentController = new PaymentController(userRepository);

export const routes = Router();

routes.post("/user", (req, res) => userController.create(req, res));
routes.post("/login", (req, res) => authController.logIn(req, res));
routes.get("/plan", (req, res) => planController.findAll(req, res));
routes.get("/version", (req, res) =>
  versionController.findLastVersion(req, res)
);

routes.use("/", authenticate);

routes.get("/plan/check", (req, res) => planController.check(req, res));
routes.post("/plan", (req, res) => planController.create(req, res));
routes.get("/user/me", (req, res) => userController.me(req, res));
routes.get("/user", (req, res) => userController.findAll(req, res));
routes.delete("/user", (req, res) => userController.delete(req, res));
routes.post("/user/plan", (req, res) => userController.plan(req, res));

routes.post("/plan/renew", (req, res) => planController.renew(req, res));

routes.post("/payment", (req, res) => paymentController.createPayment(req, res));
routes.post("/webhook", (req, res) => paymentController.handleWebhook(req, res));