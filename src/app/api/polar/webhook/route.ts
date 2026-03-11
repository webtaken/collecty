import { Webhooks } from "@polar-sh/nextjs";
import { db, polarCustomers, polarSubscriptions, polarOrders } from "@/db";
import { eq, and } from "drizzle-orm";
import {
  getCustomerByPolarId,
  createCustomer,
  updateCustomer,
  createSubscription,
  updateSubscription,
  createOrder,
  updateOrder,
  getUserByEmail,
  getCustomerByExternalId,
} from "@/lib/polar-db";
import { polar } from "@/lib/polar";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onCustomerStateChanged: async (customerState: any) => {
    const { data: customer } = customerState;

    let dbCustomer = await getCustomerByPolarId(customer.id);

    if (dbCustomer) {
      await updateCustomer(customer.id, {
        email: customer.email,
        polarCustomerExternalId: customer.external_id,
      });
    } else {
      const user = await getUserByEmail(customer.email);
      if (user) {
        dbCustomer = await createCustomer(
          user.id,
          customer.id,
          customer.external_id,
          customer.email,
        );
      }
    }

    for (const subscription of customer.subscriptions ?? []) {
      if (subscription.status === "active") {
        const existingSub = await db
          .select()
          .from(polarSubscriptions)
          .where(eq(polarSubscriptions.polarSubscriptionId, subscription.id))
          .limit(1);

        if (
          existingSub.length === 0 &&
          dbCustomer?.userId &&
          subscription.product_id
        ) {
          await createSubscription({
            userId: dbCustomer.userId,
            polarCustomerId: customer.id,
            polarSubscriptionId: subscription.id,
            polarProductId: subscription.product_id,
            status: "active",
            currentPeriodStart: subscription.current_period_start
              ? new Date(subscription.current_period_start)
              : null,
            currentPeriodEnd: subscription.current_period_end
              ? new Date(subscription.current_period_end)
              : null,
            cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
          });
        } else if (existingSub.length > 0) {
          await updateSubscription(subscription.id, {
            status: "active",
            currentPeriodStart: subscription.current_period_start
              ? new Date(subscription.current_period_start)
              : null,
            currentPeriodEnd: subscription.current_period_end
              ? new Date(subscription.current_period_end)
              : null,
            cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
          });
        }
      }
    }
  },
  onOrderCreated: async (order) => {
    const { data } = order;
    const customer = await getCustomerByPolarId(data.customer.id);
    console.log(customer);
    if (customer) {
      await createOrder({
        userId: customer.userId,
        polarCustomerId: data.customer.id,
        polarOrderId: data.id,
        polarSubscriptionId: data.subscription?.id ?? null,
        status: data.status as "pending" | "paid" | "refunded",
        amount: data.subscription?.amount || 0,
        currency: data.currency,
        billingReason: data.billingReason as
          | "purchase"
          | "subscription_create"
          | "subscription_cycle"
          | "subscription_update"
          | null,
      });
    }
  },
  onOrderPaid: async (order: any) => {
    const { data } = order;
    await updateOrder(data.id, {
      status: "paid",
    });
  },
  onOrderRefunded: async (order: any) => {
    const { data } = order;
    await updateOrder(data.id, {
      status: "refunded",
    });
  },
  onSubscriptionCreated: async (subscription: any) => {
    const { data } = subscription;
    const customer = await getCustomerByPolarId(data.customer.id);

    if (customer && data.product.id && customer.userId) {
      await createSubscription({
        userId: customer.userId,
        polarCustomerId: data.customer.id,
        polarSubscriptionId: data.id,
        polarProductId: data.product.id,
        status: data.status as "active" | "canceled" | "past_due" | "revoked",
        currentPeriodStart: data.current_period_start
          ? new Date(data.current_period_start)
          : null,
        currentPeriodEnd: data.current_period_end
          ? new Date(data.current_period_end)
          : null,
        cancelAtPeriodEnd: data.cancel_at_period_end ?? false,
        metadata: data.product.metadata,
      });
    }
  },
  onSubscriptionUpdated: async (subscription: any) => {
    const { data } = subscription;
    await updateSubscription(data.id, {
      status: data.status as "active" | "canceled" | "past_due" | "revoked",
      currentPeriodStart: data.current_period_start
        ? new Date(data.current_period_start)
        : null,
      currentPeriodEnd: data.current_period_end
        ? new Date(data.current_period_end)
        : null,
      cancelAtPeriodEnd: data.cancel_at_period_end ?? false,
    });
  },
  onSubscriptionCanceled: async (subscription: any) => {
    const { data } = subscription;
    await updateSubscription(data.id, {
      status: "canceled",
      cancelAtPeriodEnd: data.cancel_at_period_end ?? false,
    });
  },
  onSubscriptionRevoked: async (subscription: any) => {
    const { data } = subscription;
    await updateSubscription(data.id, {
      status: "revoked",
    });
  },
  onCustomerCreated: async (customer: any) => {
    const { data } = customer;
    const user = await getUserByEmail(data.email);

    if (user) {
      await createCustomer(user.id, data.id, data.external_id, data.email);
    }
  },
  onCustomerUpdated: async (customer: any) => {
    const { data } = customer;
    await updateCustomer(data.id, {
      email: data.email,
      polarCustomerExternalId: data.external_id,
    });
  },
  onCustomerDeleted: async (customer: any) => {
    const { data } = customer;
    const dbCustomer = await getCustomerByPolarId(data.id);

    if (dbCustomer) {
      await db
        .delete(polarCustomers)
        .where(eq(polarCustomers.polarCustomerId, data.id));
    }
  },
});
