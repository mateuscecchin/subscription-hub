import { User } from "@prisma/client";
import { Request as RequestExpress } from "express";

export type Request = Partial<{
  user: User;
}> &
  RequestExpress;
