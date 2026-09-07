const GRAPH_API_VERSION = process.env.WHATSAPP_GRAPH_API_VERSION || "v22.0";
const REQUEST_TIMEOUT_MS = 10000;

const getConfig = () => ({
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
  adminPhoneNumber: process.env.WHATSAPP_ADMIN_PHONE_NUMBER,
  languageCode: process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en_US",
});

const normalizePhoneNumber = (value) => {
  if (!value) return "";

  const cleaned = String(value).trim().replace(/[\s().-]/g, "");
  if (cleaned.startsWith("+")) return cleaned.slice(1);
  if (cleaned.startsWith("00")) return cleaned.slice(2);
  if (cleaned.startsWith("0")) {
    return `${process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || "91"}${cleaned.slice(1)}`;
  }
  if (/^\d{10}$/.test(cleaned)) {
    return `${process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || "91"}${cleaned}`;
  }

  return cleaned;
};

const getTemplateName = (key) => process.env[key];

export const sendWhatsAppMessage = async ({
  to,
  templateName,
  bodyVariables = [],
}) => {
  const config = getConfig();
  const recipient = normalizePhoneNumber(to);

  if (!config.accessToken || !config.phoneNumberId) {
    console.warn("WhatsApp is not configured; notification skipped.");
    return false;
  }

  if (!recipient || !templateName) {
    console.warn("WhatsApp recipient or template is missing; notification skipped.");
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${config.phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: recipient,
          type: "template",
          template: {
            name: templateName,
            language: { code: config.languageCode },
            ...(bodyVariables.length > 0
              ? {
                  components: [
                    {
                      type: "body",
                      parameters: bodyVariables.map((text) => ({
                        type: "text",
                        text: String(text),
                      })),
                    },
                  ],
                }
              : {}),
          },
        }),
        signal: controller.signal,
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("WhatsApp API error:", {
        status: response.status,
        error: result.error?.message || result,
      });
      return false;
    }

    console.log("WhatsApp notification sent:", {
      recipient,
      messageId: result.messages?.[0]?.id,
    });
    return true;
  } catch (error) {
    console.error("WhatsApp notification failed:", error.name === "AbortError" ? "Request timed out" : error.message);
    return false;
  } finally {
    clearTimeout(timeout);
  }
};

const getPaymentLabel = (order) =>
  order.paymentMethod === "RAZORPAY" ? "Online payment" : "Cash on delivery";

const getOrderReference = (order) => String(order._id || order.id).slice(-8);

export const sendOrderPlacedMessage = async (order) => {
  if (!order.whatsappOptIn) return false;

  return sendWhatsAppMessage({
    to: order.customer.phone,
    templateName: getTemplateName("WHATSAPP_ORDER_CONFIRMATION_TEMPLATE"),
    bodyVariables: [
      getOrderReference(order),
      `₹${Number(order.totalAmount).toFixed(2)}`,
      getPaymentLabel(order),
    ],
  });
};

export const sendAdminNewOrderMessage = async (order) => {
  const config = getConfig();

  return sendWhatsAppMessage({
    to: config.adminPhoneNumber,
    templateName: getTemplateName("WHATSAPP_ADMIN_ORDER_TEMPLATE"),
    bodyVariables: [
      getOrderReference(order),
      order.customer.name,
      order.customer.phone,
      `₹${Number(order.totalAmount).toFixed(2)}`,
      getPaymentLabel(order),
    ],
  });
};

export const sendOrderStatusMessage = async (order) => {
  if (!order.whatsappOptIn) return false;

  const statusLabel = order.status.toUpperCase();

  return sendWhatsAppMessage({
    to: order.customer.phone,
    templateName: getTemplateName("WHATSAPP_ORDER_STATUS_TEMPLATE"),
    bodyVariables: [getOrderReference(order), statusLabel],
  });
};

export const getWhatsAppTestConfig = () => {
  const config = getConfig();
  return {
    ...config,
    testRecipient: process.env.WHATSAPP_TEST_RECIPIENT,
    testTemplateName:
      process.env.WHATSAPP_TEST_TEMPLATE_NAME ||
      process.env.WHATSAPP_ORDER_CONFIRMATION_TEMPLATE,
  };
};
