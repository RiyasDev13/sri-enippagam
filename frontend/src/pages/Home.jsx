import { Link } from "react-router-dom";
import "./home.css";
import sriEnippagamFrame from "../assets/sri-inipagam-frame.png";
import sriEnipagamHome from  "../assets/sri-inipagam-home.jpg";
const categories = [
  {
    name: "All Products",
    slug: "all",
    desc: "Browse every sweet, snack, chat and namkeen in one place.",
    img: "https://www.srienippagam.in/assets/img/home/sweets.webp",
    icon: "bi bi-shop",
  },
  {
    name: "Sweets",
    slug: "sweets",
    desc: "Traditional North & South Indian sweets made by our skilled chefs.",
    img: "https://www.srienippagam.in/assets/img/home/sweets.webp",
    icon: "bi bi-cookie",
  },
  {
    name: "Snacks",
    slug: "snacks",
    desc: "Crunchy savouries perfect for tea-time and festivals.",
    img: "https://www.srienippagam.in/assets/img/home/snacks.webp",
    icon: "bi bi-fire",
  },
  {
    name: "Namkeens",
    slug: "namkeens",
    desc: "Traditional jaggery and millet based delicacies.",
    img: "https://www.srienippagam.in/assets/img/home/namkeens.webp",
    icon: "bi bi-flower1",
  },
  {
    name: "Chats",
    slug: "chats",
    desc: "Tangy, spicy street-style chats made fresh.",
    img: "https://www.srienippagam.in/assets/img/home/chats.webp",
    icon: "bi bi-cup-straw",
  },
];
const whyUs = [
  {
    img: "https://www.srienippagam.in/assets/img/home/delicious.webp",
    label: "Delicious Savouries",
    icon: "bi bi-egg-fried",
  },
  {
    img: "https://www.srienippagam.in/assets/img/home/indulge.webp",
    label: "Indulge In Sweetness",
    icon: "bi bi-heart-fill",
  },
  {
    img: "https://www.srienippagam.in/assets/img/home/traditional.webp",
    label: "Traditional",
    icon: "bi bi-award-fill",
  },
];

const trustPoints = [
  { icon: "bi bi-stars", text: "Made Fresh Daily" },
  { icon: "bi bi-flower1", text: "Quality Ingredients" },
  { icon: "bi bi-gift", text: "Gift-Ready Packaging" },
  { icon: "bi bi-geo-alt", text: "Trusted In Pollachi" },
];

const testimonials = [
  {
    name: "Nanda Kumar",
    text: "It's the best sweet stall in Pollachi. They have lots of variety of sweets including the traditional jaggery and millet options — there's always something new to try.",
  },
  {
    name: "Priya S",
    text: "The sweets are fresh, delicious, and have a great variety. A wonderful place to find traditional favourites.",
  },
  {
    name: "Markiv S",
    text: "One of the most happening places in Pollachi to buy sweets. They have a wide variety of sweets and karam, and their halwas are the best sellers here.",
  },
  {
    name: "Swathi Hari",
    text: "Sri Enippagam sweets and karam are excellent, both in quality and taste.",
  },
];

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function WaveDivider({ fill }) {
  return (
    <svg
      className="section-wave"
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="section-wave-path"
        d="M0,32 C200,60 400,0 600,20 C800,40 1000,10 1200,30 L1200,60 L0,60 Z"
        style={{ "--wave-fill": fill }}
      />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <section className="hero-slider">
        <div className="hero-blob hero-blob--one" />
        <div className="hero-blob hero-blob--two" />

        <div className="container hero-slide">
          <div className="hero-content">
            <h1>Something Delicious For Every Occasion</h1>
            <p>
              Traditional Indian sweets, snacks and chats, made fresh every
              day.
            </p>
            <Link to="/products/sweets" className="btn btn-primary">
              Shop Now
            </Link>
          </div>

          <div className="hero-media">
            <div className="hero-media-frame">
              <img
              src={sriEnipagamHome}
              alt="Sri Enippagam Home"
            />
            </div>
            <div className="hero-badge">
              <span className="hero-badge-icon">
                <i className="fa-solid fa-star" />
              </span>
              100% Fresh, Every Day
            </div>
          </div>
        </div>

        <WaveDivider fill="#fff" />
      </section>

      <div className="trust-strip">
        <div className="container trust-strip-grid">
          {trustPoints.map((t) => (
            <div className="trust-item" key={t.text}>
              <span className="trust-item-icon">
                <i className={t.icon} />
              </span>
              <span className="trust-item-text">{t.text}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="section welcome-section">
        <div className="container welcome-grid">
          <div className="welcome-copy">
            <h4 className="eyebrow">Welcome to Sri Enippagam</h4>

            <p>
              Our company is a leading supplier, manufacturer and retailer of
              Indian mix sweets, offering products to our valuable customers at
              a cost-effective rate. Our sweets come in various colors,
              textures and designs and are packaged beautifully in attractive
              boxes.
            </p>

            <p>
              High quality raw materials, including dry fruits, are used to
              manufacture our products, and our skillful sweet makers follow
              stringent quality control policies to maintain quality
              throughout.
            </p>

            <Link to="/about-us" className="btn btn-primary">
              Read Our Story
            </Link>
          </div>

          <img
            src={sriEnippagamFrame}
            alt="Sri Enippagam"
          />
        </div>
      </section>

      <section className="section why-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-lead">
            Everything we make follows recipes passed down through
            generations, prepared fresh in small batches every day.
          </p>

          <div className="why-grid">
            {whyUs.map((item) => (
              <div className="why-card" key={item.label}>
                <span className="why-icon-badge">
                  <i className={item.icon} />
                </span>
                <img src={item.img} alt={item.label} />
                <div className="why-overlay">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <WaveDivider fill="#F1F7FD" />
      </section>

      <section
        className="section products-section"
        style={{ background: "#F1F7FD" }}
      >
        <div className="container">
          <h2 className="section-title">Our Traditional Products</h2>
          <p className="section-lead">
            Browse our full range, from festival sweets to everyday snacks.
          </p>

          <div className="category-grid">
            {categories.map((cat) => (
              <div className="category-card" key={cat.slug}>
                <span className="category-icon-badge">
                  <i className={cat.icon} />
                </span>
                <h4>{cat.name}</h4>

                <img src={cat.img} alt={cat.name} />

                <p>{cat.desc}</p>

                <Link
                  to={`/products/${cat.slug}`}
                  className="btn btn-primary btn-sm"
                >
                  Explore More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

<section className="section testimonials-section">
  <div className="container">
    <h2 className="section-title">Our Happy Customers Are Saying</h2>

    <div className="testimonial-grid">
      {testimonials.map((t) => (
        <div className="testimonial-card" key={t.name}>
          <p className="testimonial-text">
            "{t.text}"
          </p>

          <p className="testimonial-name">
            @{t.name}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
    </>
  );
}