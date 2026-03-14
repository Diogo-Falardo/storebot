import express, { NextFunction, Router, Request, Response } from "express";
import { userService } from "../service/user.service.js";
import { valid_uuid } from "../../lib/field.valid";
import { storeService } from "../service/store.service.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_PRIVATE!);
console.log("Stripe key:", process.env.STRIPE_PRIVATE);

const router = Router();

function getPriceIdForPeriod(period: string): string | null {
  const PRICE_IDS: Record<string, string> = {
    "1d": "price_1TAZbiIKvU6EuN3sqjK7FKBx",
    "1w": "price_1TAZcOIKvU6EuN3szZeuqQgj",
    "1m": "price_1TAZciIKvU6EuN3sH5km3yaP",
    "3m": "price_1TAZczIKvU6EuN3sBsCv6zhC",
    "1y": "price_1TAZdLIKvU6EuN3s9G3EWDpS",
  };
  return PRICE_IDS[period] ?? null;
}

// creates a payment link associated to a user
router.post(
  "/create-link",
  async (req: Request, res: Response, next: NextFunction) => {
    const { period, telegramId } = req.body;

    console.log(period, telegramId);

    const priceId = getPriceIdForPeriod(period);
    if (!priceId) {
      return res.status(400).json({ error: "Invalid period" });
    }

    const info = await userService.getUserInfo(telegramId);

    console.log("User info:", info);
    try {
      if (info === "no stores") {
        return res
          .status(400)
          .json({ error: "You dont have a shop to activate, create one!" });
      }

      const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { userId: info.userId, storeId: info.storeId, period },
      });

      res.json({ url: paymentLink.url });
    } catch (err: any) {
      console.error("Error creating payment link:", err);
      return res
        .status(500)
        .json({ error: err.message || "Internal server error" });
    }
  },
);

// Stripe webhook to validate payment
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Check for successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const shopId = session.metadata?.shopId;
      const period = session.metadata?.period;

      if (!userId || !shopId || !period) {
        console.error("Missing metadata in Stripe session:", session.metadata);
        return res.status(400).json({ error: "Missing payment metadata" });
      }

      await storeService.updateStoreExpireDate(userId, shopId, period);

      console.log(`Payment completed for user ${userId} for period ${period}`);
    }

    res.json({ received: true });
  },
);

export default router;
