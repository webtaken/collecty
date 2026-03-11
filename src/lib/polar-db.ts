import { db } from "@/db";
import {
  polarCustomers,
  users,
  polarSubscriptions,
  polarOrders,
  polarCheckouts,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { polar } from "./polar";

export async function getCustomerByUserId(userId: string) {
  const [customer] = await db
    .select()
    .from(polarCustomers)
    .where(eq(polarCustomers.userId, userId))
    .limit(1);

  return customer;
}

export async function getCustomerByPolarId(polarCustomerId: string) {
  const [customer] = await db
    .select()
    .from(polarCustomers)
    .where(eq(polarCustomers.polarCustomerId, polarCustomerId))
    .limit(1);

  return customer;
}

export async function getCustomerByExternalId(externalId: string) {
  const [customer] = await db
    .select()
    .from(polarCustomers)
    .where(eq(polarCustomers.polarCustomerExternalId, externalId))
    .limit(1);

  return customer;
}

export async function getCustomerByEmail(email: string) {
  const [customer] = await db
    .select()
    .from(polarCustomers)
    .where(eq(polarCustomers.email, email))
    .limit(1);

  return customer;
}

export async function getCustomerState(externalId: string) {
  return await polar.customers.getStateExternal({
    externalId,
  });
}

export async function createCustomer(
  userId: string,
  polarCustomerId: string,
  polarCustomerExternalId: string | null,
  email: string,
) {
  const [customer] = await db
    .insert(polarCustomers)
    .values({
      userId,
      polarCustomerId,
      polarCustomerExternalId: polarCustomerExternalId ?? undefined,
      email,
    })
    .returning();

  return customer;
}

export async function updateCustomer(
  polarCustomerId: string,
  updates: Partial<{
    email: string;
    polarCustomerExternalId: string | null;
  }>,
) {
  const [customer] = await db
    .update(polarCustomers)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(polarCustomers.polarCustomerId, polarCustomerId))
    .returning();

  return customer;
}

export async function createSubscription(data: {
  userId: string;
  polarCustomerId: string;
  polarSubscriptionId: string;
  polarProductId: string;
  status: "active" | "canceled" | "past_due" | "revoked";
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  metadata?: Record<string, unknown>;
}) {
  const [subscription] = await db
    .insert(polarSubscriptions)
    .values(data)
    .returning();
  return subscription;
}

export async function updateSubscription(
  polarSubscriptionId: string,
  updates: Partial<{
    status: "active" | "canceled" | "past_due" | "revoked";
    currentPeriodStart: Date | null;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
    metadata: Record<string, unknown>;
  }>,
) {
  const [subscription] = await db
    .update(polarSubscriptions)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(polarSubscriptions.polarSubscriptionId, polarSubscriptionId))
    .returning();

  return subscription;
}

export async function getSubscriptionByPolarId(polarSubscriptionId: string) {
  const [subscription] = await db
    .select()
    .from(polarSubscriptions)
    .where(eq(polarSubscriptions.polarSubscriptionId, polarSubscriptionId))
    .limit(1);

  return subscription;
}

export async function getActiveSubscriptions(userId: string) {
  return await db
    .select()
    .from(polarSubscriptions)
    .where(
      and(
        eq(polarSubscriptions.userId, userId),
        eq(polarSubscriptions.status, "active"),
      ),
    );
}

export async function createOrder(data: {
  userId: string | null;
  polarCustomerId: string;
  polarOrderId: string;
  polarSubscriptionId: string | null;
  status: "pending" | "paid" | "refunded";
  amount: number;
  currency: string;
  billingReason:
    | "purchase"
    | "subscription_create"
    | "subscription_cycle"
    | "subscription_update"
    | null;
  metadata?: Record<string, unknown>;
}) {
  const [order] = await db.insert(polarOrders).values(data).returning();

  return order;
}

export async function updateOrder(
  polarOrderId: string,
  updates: Partial<{
    status: "pending" | "paid" | "refunded";
    metadata: Record<string, unknown>;
  }>,
) {
  const [order] = await db
    .update(polarOrders)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(polarOrders.polarOrderId, polarOrderId))
    .returning();

  return order;
}

export async function getOrderById(polarOrderId: string) {
  const [order] = await db
    .select()
    .from(polarOrders)
    .where(eq(polarOrders.polarOrderId, polarOrderId))
    .limit(1);

  return order;
}

export async function createCheckout(data: {
  userId: string | null;
  polarCustomerId: string | null;
  polarCheckoutId: string;
  status: "created" | "succeeded" | "failed" | "canceled";
  successUrl: string | null;
  metadata?: Record<string, unknown>;
}) {
  const [checkout] = await db.insert(polarCheckouts).values(data).returning();

  return checkout;
}

export async function updateCheckout(
  polarCheckoutId: string,
  updates: Partial<{
    status: "created" | "succeeded" | "failed" | "canceled";
    polarCustomerId: string;
    metadata: Record<string, unknown>;
  }>,
) {
  const [checkout] = await db
    .update(polarCheckouts)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(polarCheckouts.polarCheckoutId, polarCheckoutId))
    .returning();

  return checkout;
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  return user;
}

export async function getUserByExternalId(externalId: string) {
  const customer = await getCustomerByExternalId(externalId);
  if (!customer || !customer.userId) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, customer.userId))
    .limit(1);

  return user;
}
