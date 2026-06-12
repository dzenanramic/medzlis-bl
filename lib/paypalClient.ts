const PAYPAL_API_BASE =
  process.env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com"; // sandbox default

interface PayPalAccessTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

/**
 * Get a PayPal OAuth 2.0 access token using client credentials.
 */
export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "PayPal Client ID or Secret is missing. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env.local",
    );
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal auth failed (${response.status}): ${errorText}`);
  }

  const data: PayPalAccessTokenResponse = await response.json();
  return data.access_token;
}

/**
 * Create a PayPal order.
 */
export async function createPayPalOrder(amount: number, currency = "EUR") {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          description: "Članarina - Džemat Landsberg am Lech",
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `PayPal create order failed (${response.status}): ${errorText}`,
    );
  }

  return response.json();
}

/**
 * Capture (finalize) a PayPal order.
 */
export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `PayPal capture order failed (${response.status}): ${errorText}`,
    );
  }

  return response.json();
}

/**
 * Verify a PayPal webhook signature.
 */
export async function verifyPayPalWebhook(
  headers: Record<string, string>,
  body: string,
): Promise<boolean> {
  const accessToken = await getPayPalAccessToken();
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId) {
    throw new Error("PAYPAL_WEBHOOK_ID is not set in .env.local");
  }

  const verificationData = {
    auth_algo: headers["paypal-auth-algo"],
    cert_url: headers["paypal-cert-url"],
    transmission_id: headers["paypal-transmission-id"],
    transmission_sig: headers["paypal-transmission-sig"],
    transmission_time: headers["paypal-transmission-time"],
    webhook_id: webhookId,
    webhook_event: JSON.parse(body),
  };

  const response = await fetch(
    `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verificationData),
    },
  );

  if (!response.ok) {
    return false;
  }

  const result = await response.json();
  return result.verification_status === "SUCCESS";
}
