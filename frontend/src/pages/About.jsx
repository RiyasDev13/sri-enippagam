import SubBanner from "../components/common/SubBanner.jsx";
import { Link } from "react-router-dom";
import sriEnippagamFrame from "../assets/sri-inipagam-frame.png";
import "./about.css";

const features = [
  {
    number: "01",
    title: "Quality ingredients",
    text: "We choose fine ingredients, including generous dry fruits, for a better bite in every batch.",
    img: "https://www.srienippagam.in/assets/img/home/kaju-ghee-sweet.webp",
  },
  {
    number: "02",
    title: "Made with care",
    text: "Our skilled sweet makers balance familiar recipes with the care of food made for family.",
    img: "https://www.srienippagam.in/assets/img/home/laddu.webp",
  },
  {
    number: "03",
    title: "Good value",
    text: "Beautifully packed sweets, snacks and chats at prices that make sharing easy.",
    img: "https://www.srienippagam.in/assets/img/home/snacks.webp",
  },
];

export default function About() {
  return (
    <>
      <SubBanner title="About Us" />

      <section className="about-intro section">
        <div className="container about-intro-grid">
          <div className="about-photo-frame">
            <img
            src={sriEnippagamFrame}
            alt="Sri Enippagam"
          />

            <div className="about-photo-note">
              <strong>Since day one</strong>
              <span>Made fresh in Pollachi</span>
            </div>
          </div>

          <div className="about-copy">
            <p className="eyebrow">A little about us</p>

            <h1>Good food has a way of bringing everyone closer.</h1>

            <p>
              Sri Enippagam is a Pollachi favourite for colourful Indian
              sweets, savouries and chats made for everyday cravings and
              special moments.
            </p>

            <p>
              From carefully selected ingredients to beautifully packed boxes,
              we bring together trusted recipes, skilled makers and honest
              value in every order.
            </p>

            <Link className="about-primary-link" to="/products/sweets">
              Explore our products{" "}
              <i className="bi bi-arrow-up-right"></i>
            </Link>
          </div>
        </div>
      </section>

      <section className="about-proof-strip">
        <div className="container about-proof-grid">
          <div>
            <strong>Freshly made</strong>
            <span>with trusted ingredients</span>
          </div>

          <div>
            <strong>3 favourites</strong>
            <span>sweets, snacks and chats</span>
          </div>

          <div>
            <strong>2 locations</strong>
            <span>serving Pollachi</span>
          </div>
        </div>
      </section>

      <section className="section about-values-section">
        <div className="container">
          <div className="about-section-heading">
            <div>
              <p className="eyebrow">Why Sri Enippagam</p>
              <h2>Simple ingredients. Thoughtful making.</h2>
            </div>

            <p>
              Every detail matters when something is made to be shared.
            </p>
          </div>

          <div className="about-values-grid">
            {features.map((feature) => (
              <article
                className="about-value-card"
                key={feature.number}
              >
                <img
                  src={feature.img}
                  alt={feature.title}
                  loading="lazy"
                />

                <div className="about-value-content">
                  <span className="about-value-number">
                    {feature.number}
                  </span>

                  <h3>{feature.title}</h3>

                  <p>{feature.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}