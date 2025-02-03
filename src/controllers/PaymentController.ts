import { Response } from "express";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { v4 as uuidv4 } from "uuid";
import { Request } from "../@types/Request";
import { db } from "../configs/prisma";
import { UserRepository } from "../repositories/UserRepository";
import { PlanHistoryRepository } from "../repositories/PlanHistoryRepository";
import { PlanService } from "../services/PlanService";

const VERCEL_URL = process.env.VERCEL_URL;

interface MercadoPagoResponse { resource: string, topic: string }

export class PaymentController {
  private client: MercadoPagoConfig;

  constructor(private readonly userRepository: UserRepository, private readonly planHistoryRepository: PlanHistoryRepository, private readonly planService: PlanService  ) {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
      options: {
        timeout: 5000,
      },
    });
  }

  async handleWebhook(req: Request, res: Response) {
    try {
      const body =  req.body as MercadoPagoResponse;

      console.log("body", body)

     const planHistory = await this.planHistoryRepository.findByPaymentId(body.resource)

     if(!planHistory)  return res.status(404).json({ message: "PlanoHistory nao encontrado" }); 

     await this.planService.subcribeUserToPlan(planHistory.userId, planHistory.planId)

      return res.status(200).json({ status: "Pagamento realizado" });
    } catch (error) {
      console.error("Erro no webhook:", error);
      return res.status(500).json({ error: "Webhook error" });
    }
  }

  async createPayment(req: Request, res: Response) {
    try {
      const body = req.body!;
      const user = req.user!

      const payment = new Payment(this.client);

      if (!user)
        return res.status(404).json({ message: "Usuario nao encontrado" });
      
      const plan = await this.planService.findById(body.planId)

      if(!plan)  return res.status(404).json({ message: "Plano nao encontrado" }); 

        const responsePayment = {
          transaction_amount: plan.price,
          description: "Pagamento acesso do bot",
          payment_method_id: "pix",
          payer: {
            email: user.email,
          },
          notification_url: "https://subscription-hub-dusky.vercel.app/webhook",
        };

      const requestOptions = { idempotencyKey: uuidv4() };

      const response = await payment.create({
        body: responsePayment,
        requestOptions,
      });

      await this.planHistoryRepository.create({
          paymentId: response.id!.toString()!, 
          userId: user.id, 
          planId: plan.id,
         status:"pending",
      });

      const pixQrCode =
        response?.point_of_interaction?.transaction_data?.qr_code;
      const pixQrCodeUrl =
        response?.point_of_interaction?.transaction_data?.ticket_url;

      return res.status(200).json({
        qr_code: pixQrCode,
        qr_code_url: pixQrCodeUrl,
        message: "Pagamento Pix criado com sucesso",
      });
    } catch (error: any) {
      console.error("Erro ao processar pagamento:", error.message);
      return res.status(500).json({ error: "Erro ao processar pagamento" });
    }
  }
}