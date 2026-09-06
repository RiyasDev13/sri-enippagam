import { useState } from "react";

const quickQuestions = [
  "What products do you sell?",
  "How much is delivery?",
  "Do you accept online payment?",
  "Where are you located?",
];

const replies = [
  {
    keywords: ["product", "sell", "available", "sweet", "snack", "chat", "namkeen"],
    answer:
      "We make fresh sweets, snacks, chats and namkeens. Browse the Products menu to see the current range and prices.",
  },
  {
    keywords: ["delivery", "deliver", "shipping", "charge", "fee"],
    answer:
      "Delivery is currently ₹40 per order. The final delivery charge is shown clearly at checkout.",
  },
  {
    keywords: ["payment", "pay", "razorpay", "upi", "card", "cod", "cash"],
    answer:
      "You can pay online using UPI, card or net banking through Razorpay. Cash on Delivery is also available.",
  },
  {
    keywords: ["location", "located", "address", "branch", "pollachi", "shop", "store"],
    answer:
      "We have two Pollachi branches: Venkatesa Colony and Mahalingapuram. Visit the Contact Us page for full addresses and phone numbers.",
  },
  {
    keywords: ["order", "track", "status", "account"],
    answer:
      "After signing in, open Account to view your orders and their latest status. You can also contact us for help.",
  },
  {
    keywords: ["contact", "help", "support", "talk", "call", "email"],
    answer:
      "We are happy to help. Call +91 94425 71648 or email srienippagam@gmail.com, or send an enquiry from Contact Us.",
  },
];

function getReply(question) {
  const normalizedQuestion = question.toLowerCase();
  const match = replies.find(({ keywords }) =>
    keywords.some((keyword) => normalizedQuestion.includes(keyword))
  );

  return (
    match?.answer ||
    "I can help with products, delivery, payment, orders, store locations and contact details. Please choose a question below or ask in your own words."
  );
}

function CopilotMark() {
  return (
    <svg viewBox="0 0 512 416" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M181.33 266.143c0-11.497 9.32-20.818 20.818-20.818 11.498 0 20.819 9.321 20.819 20.818v38.373c0 11.497-9.321 20.818-20.819 20.818-11.497 0-20.818-9.32-20.818-20.818v-38.373zM308.807 245.325c-11.477 0-20.798 9.321-20.798 20.818v38.373c0 11.497 9.32 20.818 20.798 20.818 11.497 0 20.818-9.321 20.818-20.818v-38.373c0-11.497-9.32-20.818-20.818-20.818z" />
      <path d="M512.002 246.393v57.384c-.02 7.411-3.696 14.638-9.67 19.011C431.767 374.444 344.695 416 256 416c-98.138 0-196.379-56.542-246.33-93.21-5.975-4.374-9.65-11.6-9.671-19.012v-57.384a35.347 35.347 0 016.857-20.922l15.583-21.085c8.336-11.312 20.757-14.31 33.98-14.31 4.988-56.953 16.794-97.604 45.024-127.354C155.194 5.77 226.56 0 256 0c29.441 0 100.807 5.77 154.557 62.722 28.19 29.75 40.036 70.401 45.025 127.354 13.263 0 25.602 2.936 33.958 14.31l15.583 21.127c4.476 6.077 6.878 13.345 6.878 20.88zm-97.666-26.075c-.677-13.058-11.292-18.19-22.338-21.824-11.64 7.309-25.848 10.183-39.46 10.183-14.454 0-41.432-3.47-63.872-25.869-5.667-5.625-9.527-14.454-12.155-24.247a212.902 212.902 0 00-20.469-1.088c-6.098 0-13.099.349-20.551 1.088-2.628 9.793-6.509 18.622-12.155 24.247-22.4 22.4-49.418 25.87-63.872 25.87-13.612 0-27.86-2.855-39.501-10.184-11.005 3.613-21.558 8.828-22.277 21.824-1.17 24.555-1.272 49.11-1.375 73.645-.041 12.318-.082 24.658-.288 36.976.062 7.166 4.374 13.818 10.882 16.774 52.97 24.124 103.045 36.278 149.137 36.278 46.01 0 96.085-12.154 149.014-36.278 6.508-2.956 10.84-9.608 10.881-16.774.637-36.832.124-73.809-1.642-110.62h.041zM107.521 168.97c8.643 8.623 24.966 14.392 42.56 14.392 13.448 0 39.03-2.874 60.156-24.329 9.28-8.951 15.05-31.35 14.413-54.079-.657-18.231-5.769-33.28-13.448-39.665-8.315-7.371-27.203-10.574-48.33-8.644-22.399 2.238-41.267 9.588-50.875 19.833-20.798 22.728-16.323 80.317-4.476 92.492zm130.556-56.008c.637 3.51.965 7.35 1.273 11.517 0 2.875 0 5.77-.308 8.952 6.406-.636 11.847-.636 16.959-.636s10.553 0 16.959.636c-.329-3.182-.329-6.077-.329-8.952.329-4.167.657-8.007 1.294-11.517-6.735-.637-12.812-.965-17.924-.965s-11.21.328-17.924.965zm49.275-8.008c-.637 22.728 5.133 45.128 14.413 54.08 21.105 21.454 46.708 24.328 60.155 24.328 17.596 0 33.918-5.769 42.561-14.392 11.847-12.175 16.322-69.764-4.476-92.492-9.608-10.245-28.476-17.595-50.875-19.833-21.127-1.93-40.015 1.273-48.33 8.644-7.679 6.385-12.791 21.434-13.448 39.665z" />
    </svg>
  );
}

export default function SupportBot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "Hi! I can answer quick questions about Sri Enippagam, orders, delivery and payment.",
    },
  ]);

  const askQuestion = (value) => {
    const trimmedQuestion = value.trim();

    if (!trimmedQuestion) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: `${Date.now()}-question`, from: "customer", text: trimmedQuestion },
      { id: `${Date.now()}-answer`, from: "bot", text: getReply(trimmedQuestion) },
    ]);
    setQuestion("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    askQuestion(question);
  };

  return (
    <div className={`support-bot ${open ? "support-bot-open" : ""}`}>
      {open && (
        <section className="support-bot-panel" aria-label="Customer support chat">
          <header className="support-bot-header">
            <span className="support-bot-avatar"><CopilotMark /></span>
            <span>
              <strong>Sri Enippagam Help</strong>
              <small>Quick answers for customers</small>
            </span>
            <button type="button" className="support-bot-close" onClick={() => setOpen(false)} aria-label="Close support chat">
              <i className="bi bi-x-lg"></i>
            </button>
          </header>

          <div className="support-bot-messages" aria-live="polite">
            {messages.map((message) => (
              <p className={`support-bot-message support-bot-message-${message.from}`} key={message.id}>
                {message.text}
              </p>
            ))}
          </div>

          <div className="support-bot-questions">
            {quickQuestions.map((quickQuestion) => (
              <button type="button" key={quickQuestion} onClick={() => askQuestion(quickQuestion)}>
                {quickQuestion}
              </button>
            ))}
          </div>

          <form className="support-bot-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="support-question">Ask a question</label>
            <input
              id="support-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask a question..."
              autoComplete="off"
            />
            <button type="submit" aria-label="Send question" title="Send question">
              <i className="bi bi-arrow-up"></i>
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="support-bot-launcher"
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        aria-label={open ? "Close customer support chat" : "Open customer support chat"}
        aria-expanded={open}
      >
        {open ? <i className="bi bi-x-lg"></i> : <CopilotMark />}
      </button>
    </div>
  );
}