import express, { NextFunction, Router, Request, Response } from "express";
import { userService } from "../service/user.service.js";
import { storeService } from "../service/store.service.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_PRIVATE!);

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

    const priceId = getPriceIdForPeriod(period);
    if (!priceId) {
      return res.status(400).json({ error: "Invalid period" });
    }

    const user = await userService.getTelegramUser(telegramId);
    // validate if user exist
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    try {
      const store = await storeService.getStoreByInternalUserId(user.userId);
      // validate if user has stores
      if (!store) {
        return res
          .status(400)
          .json({ error: "You dont have a shop to activate, create one!" });
      }

      // generate a payment link
      const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { userId: user.userId, storeId: store.storeId, period },
      });

      res.json({ url: paymentLink.url });
    } catch (err) {
      console.log(err);
      next(err);
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
      return res
        .status(400)
        .send(`Stripe payment Webhook Error: ${err.message}`);
    }

    // Check for successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const storeId = session.metadata?.storeId;
      const period = session.metadata?.period;

      if (!userId || !storeId || !period) {
        console.error(
          "Missing metadata in Stripe payment session:",
          session.metadata,
        );
        return res.status(400).json({ error: "Missing payment metadata" });
      }

      await storeService.updateStoreExpireDate(userId, storeId, period);
    }

    res.json({ received: true });
  },
);

export default router;
