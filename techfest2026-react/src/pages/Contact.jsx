
import { useState } from "react";

function Contact() {
  const [feedback, setFeedback] = useState("");
  const [submittedFeedback, setSubmittedFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!feedback.trim()) {
      return;
    }

    setSubmittedFeedback(feedback);
    setFeedback("");
  };

  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="small-heading">TECHFEST 2026</p>

        <h1>Contact</h1>

        <p>
          Have a question? Get in touch with the TechFest organizers.
        </p>
      </div>

      <div className="contact-grid">
        <div className="contact-box">
          <h3>Organizing Committee</h3>
          <p>TechFest 2026 Organizing Committee</p>
        </div>

        <div className="contact-box">
          <h3>Email</h3>
          <p>techfest2026@example.com</p>
        </div>

        <div className="contact-box">
          <h3>Phone</h3>
          <p>+91 98765 43210</p>
        </div>

        <div className="contact-box">
          <h3>Venue</h3>
          <p>College Campus</p>
        </div>
      </div>

      <div className="contact-box">
        <h3>Share Your Feedback</h3>

        <form onSubmit={handleSubmit}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback"
            rows="4"
            required
          />

          <button type="submit">Submit Feedback</button>
        </form>

        {submittedFeedback && (
          <div>
            <h3>Your Submitted Feedback</h3>
            <p>{submittedFeedback}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Contact;
