const API_URL = process.env.API_URL!;
const BOT_SECRET = process.env.BOT_SECRET!;

const urlPayment = "/payment";
// creates a stripe payment link
export async function createPaymentLink(telegramId: number, period: string) {
  const res = await fetch(`${API_URL}${urlPayment}/create-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ period, telegramId }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error(`
        -------------------------
        API FAILED TO RESPOND
        -> ON CREATE PAYMENT LINK
        
        ${res}

        -------------------------
        `);
    return `❌ ${data.error || "Failed to generate payment link. Please try again."}`;
  }

  if (!data.url) {
    return "❌ Failed to generate payment link. Please try again.";
  }

  return data.url;
}
