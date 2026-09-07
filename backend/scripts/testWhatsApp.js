import "dotenv/config";
import {
  getWhatsAppTestConfig,
  sendWhatsAppMessage,
} from "../services/whatsappService.js";

const config = getWhatsAppTestConfig();

if (!config.testRecipient || !config.testTemplateName) {
  console.error(
    "Set WHATSAPP_TEST_RECIPIENT and WHATSAPP_TEST_TEMPLATE_NAME (or WHATSAPP_ORDER_CONFIRMATION_TEMPLATE) in backend/.env first."
  );
  process.exitCode = 1;
} else {
  let bodyVariables = [];

  try {
    bodyVariables = JSON.parse(process.env.WHATSAPP_TEST_VARIABLES || "[]");
    if (!Array.isArray(bodyVariables)) throw new Error("must be an array");
  } catch {
    console.error("WHATSAPP_TEST_VARIABLES must be a JSON array, for example [\"TEST-123\",\"₹100\",\"COD\"]");
    process.exitCode = 1;
  }

  if (process.exitCode !== 1) {
    const sent = await sendWhatsAppMessage({
      to: config.testRecipient,
      templateName: config.testTemplateName,
      bodyVariables,
    });

    if (!sent) process.exitCode = 1;
  }
}
