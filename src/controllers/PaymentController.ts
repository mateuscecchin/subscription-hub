import { Response } from "express";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { v4 as uuidv4 } from "uuid";
import { Request } from "../@types/Request";
import { db } from "../configs/prisma";
import { UserRepository } from "../repositories/UserRepository";

const VERCEL_URL = process.env.VERCEL_URL;

export class PaymentController {
  private client: MercadoPagoConfig;

  constructor(private readonly userRepository: UserRepository) {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
      options: {
        timeout: 5000,
      },
    });
  }

  async handleWebhook(req: Request, res: Response) {
    try {
      const body = await req.body;
      console.log("body",body)
      // const paymentId = body.data.id;

      // if (body.type === "payment") {
      //   await db.planHistory.updateMany({
      //     where: {
      //       paymentId: paymentId,
      //     },
      //     data: {
      //       status: "paid",
      //     },
      //   });
      // }

      // return res.status(200).json({ status: "Pagamento realizado" });
    } catch (error) {
      console.error("Erro no webhook:", error);
      return res.status(500).json({ error: "Webhook error" });
    }
  }

  async createPayment(req: Request, res: Response) {
    try {
      const body = req.body!;

      const payment = new Payment(this.client);

        const responsePayment = {
          transaction_amount: body.transaction_amount,
          description: body.description,
          payment_method_id: "pix",
          payer: {
            email: body.email,
          },
          notification_url: "https://subscription-hub-dusky.vercel.app/webhook",
        };

      const requestOptions = { idempotencyKey: uuidv4() };

      const response = await payment.create({
        body: responsePayment,
        requestOptions,
      });

      const user = await this.userRepository.findByEmail(body.email);

      if (!user)
        return res.status(404).json({ message: "Usuario nao encontrado" });

      await db.planHistory.create({
        data: {
          paymentId: response.id!.toString(), 
          userId: user.id, 
          planId: body.planId,
          status: "pending", 
        },
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