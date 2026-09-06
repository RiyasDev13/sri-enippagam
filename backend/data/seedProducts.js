/**
 * Starter product catalog, seeded into the in-memory store on boot (and usable
 * as a reference if you write a MongoDB seed script later).
 * Swap the "image" values for real photos from your assets folder whenever
 * you connect the original site's images.
 */
const seedProducts = [
  {
    id: "1",
    name: "Kaju Ghee Sweet",
    description: "Rich cashew sweet made with pure ghee, a festive favourite.",
    price: 450,
    category: "sweets",
    image: "https://placehold.co/400x300?text=Kaju+Ghee+Sweet",
    available: true,
  },
  {
    id: "2",
    name: "Mixed Laddu",
    description: "Traditional laddus made with dry fruits and jaggery.",
    price: 380,
    category: "sweets",
    image: "https://placehold.co/400x300?text=Mixed+Laddu",
    available: true,
  },
  {
    id: "3",
    name: "Cashew Cake",
    description: "Soft, melt-in-the-mouth cashew based sweet.",
    price: 500,
    category: "sweets",
    image: "https://placehold.co/400x300?text=Cashew+Cake",
    available: true,
  },
  {
    id: "4",
    name: "Mixture",
    description: "Classic South Indian savoury mixture, crunchy and spiced.",
    price: 220,
    category: "snacks",
    image: "https://placehold.co/400x300?text=Mixture",
    available: true,
  },
  {
    id: "5",
    name: "Karam Boondi",
    description: "Spicy boondi snack, great with evening tea.",
    price: 200,
    category: "snacks",
    image: "https://placehold.co/400x300?text=Karam+Boondi",
    available: true,
  },
  {
    id: "6",
    name: "Ribbon Pakoda",
    description: "Crispy ribbon-shaped savoury snack.",
    price: 240,
    category: "snacks",
    image: "https://placehold.co/400x300?text=Ribbon+Pakoda",
    available: true,
  },
  {
    id: "7",
    name: "Pani Puri",
    description: "Crispy puris with tangy tamarind water and spiced filling.",
    price: 90,
    category: "chats",
    image: "https://placehold.co/400x300?text=Pani+Puri",
    available: true,
  },
  {
    id: "8",
    name: "Bhel Puri",
    description: "Puffed rice tossed with chutneys, onion and sev.",
    price: 100,
    category: "chats",
    image: "https://placehold.co/400x300?text=Bhel+Puri",
    available: true,
  },
  {
    id: "9",
    name: "Ragi Laddu",
    description: "Healthy jaggery millet laddu, a house speciality.",
    price: 320,
    category: "namkeens",
    image: "https://placehold.co/400x300?text=Ragi+Laddu",
    available: true,
  },
  {
    id: "10",
    name: "Granola Bar",
    description: "Crunchy oats and dry fruit bar.",
    price: 150,
    category: "namkeens",
    image: "https://placehold.co/400x300?text=Granola+Bar",
    available: false,
  },
];

export default seedProducts;
