import { useState } from "react";
import { createContact } from "../services/api.js";
import SubBanner from "../components/common/SubBanner.jsx";
import "./contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await createContact(form);
    setSent(true);
  } catch (error) {
    console.error("Contact form error:", error);
    alert(
      error.response?.data?.message ||
        "Could not submit your enquiry. Please try again."
    );
  }
};

  return (
    <>
      <SubBanner title="Contact Us" />
      <section className="contact-hero-section">
        <div className="container contact-hero-grid">
          <div className="contact-welcome">
            <p className="contact-eyebrow">We would love to hear from you</p>
            <h2>Let’s make your next celebration a little sweeter.</h2>
            <p className="contact-welcome-text">
              Have a question, need help choosing something, or planning a special order?
              Send us a note and our team will get back to you soon.
            </p>
            <div className="contact-detail-list">
              <a href="tel:+919442571648"><span className="contact-detail-icon"><i className="bi bi-telephone-fill" /></span><span><small>Call us</small><strong>+91 94425 71648</strong></span></a>
              <a href="mailto:srienippagam@gmail.com"><span className="contact-detail-icon"><i className="bi bi-envelope-fill" /></span><span><small>Email us</small><strong>srienippagam@gmail.com</strong></span></a>
            </div>
          </div>

          <div className="contact-form-card">
            <div className="contact-form-heading">
              <p className="contact-eyebrow">Get in touch</p>
              <h3>Enquire Now</h3>
              <p>Tell us what you need and we’ll take care of the rest.</p>
            </div>
            {sent ? (
              <p className="success-state">Thanks for reaching out! We’ll get back to you soon.</p>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div>
                    <label htmlFor="contact-name">Name <span>*</span></label>
                    <input id="contact-name" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <label htmlFor="contact-email">Email Id <span>*</span></label>
                    <input id="contact-email" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div>
                    <label htmlFor="contact-mobile">Mobile Number <span>*</span></label>
                    <input id="contact-mobile" name="mobile" placeholder="Your phone number" value={form.mobile} onChange={handleChange} required />
                  </div>
                  <div>
                    <label htmlFor="contact-subject">Subject <span>*</span></label>
                    <input id="contact-subject" name="subject" placeholder="How can we help?" value={form.subject} onChange={handleChange} required />
                  </div>
                </div>
                <label htmlFor="contact-message">Message <span>*</span></label>
                <textarea id="contact-message" name="message" rows="5" placeholder="Write your message here..." value={form.message} onChange={handleChange} required />
                <button className="contact-submit-button" type="submit">
                  Send Enquiry <i className="bi bi-arrow-up-right"></i>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="contact-locations-section">
        <div className="container">
          <div className="contact-section-heading">
            <div><p className="contact-eyebrow">Come say hello</p><h3>Find us in Pollachi</h3></div>
            <p>Visit either of our branches for fresh sweets, snacks and chats.</p>
          </div>
          <div className="map-grid">
          <div className="map-card">
            <div className="map-card-heading"><span className="map-number">01</span><div><h4>Branch 1</h4><p>Venkatesa Colony</p></div></div>
            <iframe
              title="Branch 1 Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.881210690695!2d77.00379811533378!3d10.66632756413166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8382ba2cd10d5%3A0x1cc635e1378d2eaf!2sSri%20Enippagam%20sweets%20%26%20savories!5e0!3m2!1sen!2sin!4v1660382261870!5m2!1sen!2sin"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="map-card">
            <div className="map-card-heading"><span className="map-number">02</span><div><h4>Branch 2</h4><p>Mahalingapuram</p></div></div>
            <iframe
              title="Branch 2 Location"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7841.865983030765!2d77.0100238!3d10.6623093!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xa15da2f6d6eb343!2zMTDCsDM5JzQzLjUiTiA3N8KwMDAnNDkuNiJF!5e0!3m2!1sen!2sin!4v1668082725875!5m2!1sen!2sin"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          </div>
        </div>
      </section>
    </>
  );
}