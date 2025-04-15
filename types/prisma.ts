import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export type GlobalPrisma = typeof global.prisma;

export interface Store {
  id: string;
  shop: string;
  accessToken: string;
  scope: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  shop: string;
  state: string;
  scope: string;
  expires: Date;
  isOnline: boolean;
  accessToken?: string;
  onlineAccessInfo?: any;
  createdAt: Date;
  updatedAt: Date;
}
