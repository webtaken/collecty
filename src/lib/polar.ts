import { Polar } from "@polar-sh/sdk";

const accessToken = process.env.POLAR_ACCESS_TOKEN;
const server = (process.env.POLAR_SERVER as "sandbox" | "production" | undefined) || "sandbox";

if (!accessToken) {
  throw new Error("POLAR_ACCESS_TOKEN is not defined");
}

export const polar = new Polar({
  accessToken,
  server,
});

export type PolarServer = typeof server;
