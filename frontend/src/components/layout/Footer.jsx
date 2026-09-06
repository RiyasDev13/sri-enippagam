import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer id="footer" className="site-footer">
      <div className="footer-top">
        <div className="container footer-grid">
          <div className="footer-contact">
            <h3>Sri Enippagam</h3>
            <p className="footer-intro">Traditional sweets, snacks and chats, made fresh in Pollachi.</p>
            <div className="footer-contact-list">
              <a href="tel:+919442571648"><i className="bi bi-telephone-fill"></i> +91 94425 71648</a>
              <a href="tel:+918870054456"><i className="bi bi-telephone-fill"></i> +91 88700 54456</a>
              <a href="mailto:srienippagam@gmail.com"><i className="bi bi-envelope-fill"></i> srienippagam@gmail.com</a>
            </div>
          </div>

          <div className="footer-locations">
            <h4>Visit Us</h4>
            <p>
              <span className="footer-label">Branch 1</span>
              <span className="footer-address">No.36, Rathina Vinayagar Koil Street, Venkatesa Colony, Near Ayyappan Koil, Pollachi - 642001, Tamil Nadu.</span>
            </p>
            <p>
              <span className="footer-label">Branch 2</span>
              <span className="footer-address">New Scheme Rd, BMR Complex, Opp Reliance Trends, Mahalingapuram, Pollachi - 642002, Tamil Nadu.</span>
            </p>
            <a className="footer-branch-phone" href="tel:+918870144490"><i className="bi bi-telephone-fill"></i> +91 88701 44490</a>
          </div>

          <div className="footer-links">
            <h4>Explore</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about-us">About us</Link>
              </li>
              <li>
                <Link to="/products/all">All products</Link>
              </li>
              <li>
                <Link to="/contact-us">Contact us</Link>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Shop</h4>
            <ul>
              <li>
                <Link to="/products/all">All products</Link>
              </li>
              <li>
                <Link to="/products/sweets">Sweets</Link>
              </li>
              <li>
                <Link to="/products/snacks">Snacks</Link>
              </li>
              <li>
                <Link to="/products/chats">Chats</Link>
              </li>
              <li>
                <Link to="/products/namkeens">Namkeens</Link>
              </li>
              <li>
                <Link to="/products/other">Other</Link>
              </li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Connect</h4>
            <p>Follow our latest treats.</p>
            <div className="social-links">
              <a href="#" aria-label="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/in/mohamadu-riyas/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          © Copyright <strong>Sri Enippagam</strong>. All Rights Reserved.
        </p>
        <p className="footer-developer-credit">
          Website designed and developed by{" "}
          <strong>
            <a href="https://mohamaduriyas.github.io/portfolio-website/" target="_blank" rel="noreferrer">
              MOHAMADU RIYAS S
            </a>
          </strong>
          <span aria-hidden="true"> | </span>
          <a href="mailto:riyasmd1368@gmail.com">riyasmd1368@gmail.com</a>
          <span aria-hidden="true"> | </span>
          <a href="https://www.linkedin.com/in/mohamadu-riyas/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </p>
      </div>
    </footer>
  );
}
