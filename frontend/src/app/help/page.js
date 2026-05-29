"use client";
import { useState } from "react";
import Card from "../components/Card";

export default function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqItems = [
    {
      q: "How do I upload receipts?",
      a: "You can upload receipts by going to the Upload page and either dragging files or clicking to browse. We support PNG, JPG, and WEBP formats up to 10MB each."
    },
    {
      q: "What information is extracted from receipts?",
      a: "Our AI extracts merchant name, date, total amount, tax, items, category, location, and payment method with 98%+ accuracy."
    },
    {
      q: "Can I edit extracted data?",
      a: "Yes, you can review and correct any extracted data on the result page before saving. This helps improve our AI model."
    },
    {
      q: "How is my data secured?",
      a: "All your data is encrypted end-to-end and stored securely. We never sell your data to third parties. You can delete your account anytime."
    },
    {
      q: "Do you support multiple currencies?",
      a: "Yes! You can set your preferred currency in Settings. We support USD, EUR, GBP, CAD, and AUD."
    },
    {
      q: "How often are receipts processed?",
      a: "Receipts are processed instantly upon upload. Our AI analyzes them and extracts data within seconds."
    },
    {
      q: "Can I export my receipt data?",
      a: "Yes, you can export individual receipts as JSON or print them. Bulk export features are coming soon."
    },
    {
      q: "What happens to my data when I delete my account?",
      a: "All your receipts and personal data are permanently deleted within 30 days. You cannot recover them after deletion."
    },
  ];

  const FaqItem = ({ item, index }) => {
    const isOpen = expandedFaq === index;
    return (
      <div
        onClick={() => setExpandedFaq(isOpen ? null : index)}
        style={{
          padding: "16px 20px",
          borderBottom: index < faqItems.length - 1 ? "1px solid var(--border)" : "none",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.02)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, justifyContent: "space-between" }}>
          <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--text)", flex: 1 }}>
            {item.q}
          </h4>
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            background: "rgba(124, 58, 237, 0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>
        {isOpen && (
          <p style={{
            margin: "12px 0 0",
            fontSize: 13,
            color: "var(--text2)",
            lineHeight: 1.6,
          }}>
            {item.a}
          </p>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px", color: "var(--text)" }}>
          Help & Support
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: "var(--text2)" }}>
          Find answers to common questions or get in touch with our support team
        </p>
      </div>

      {/* Support Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <Card style={{ padding: "20px 24px", textAlign: "center", cursor: "pointer" }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={{ fontSize: 28, marginBottom: 12 }}>📖</div>
          <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
            Documentation
          </h3>
          <p style={{ margin: 0, fontSize: 12, color: "var(--text2)" }}>
            Read our comprehensive guides
          </p>
        </Card>

        <Card style={{ padding: "20px 24px", textAlign: "center", cursor: "pointer" }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={{ fontSize: 28, marginBottom: 12 }}>💬</div>
          <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
            Live Chat
          </h3>
          <p style={{ margin: 0, fontSize: 12, color: "var(--text2)" }}>
            Chat with our support team
          </p>
        </Card>

        <Card style={{ padding: "20px 24px", textAlign: "center", cursor: "pointer" }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={{ fontSize: 28, marginBottom: 12 }}>✉️</div>
          <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
            Email Support
          </h3>
          <p style={{ margin: 0, fontSize: 12, color: "var(--text2)" }}>
            support@finsight.io
          </p>
        </Card>

        <Card style={{ padding: "20px 24px", textAlign: "center", cursor: "pointer" }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={{ fontSize: 28, marginBottom: 12 }}>🐛</div>
          <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
            Report a Bug
          </h3>
          <p style={{ margin: 0, fontSize: 12, color: "var(--text2)" }}>
            Help us improve FinSight
          </p>
        </Card>
      </div>

      {/* Contact Form */}
      <Card style={{ padding: "28px" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 20px", color: "var(--text)" }}>
          Get in Touch
        </h2>
        <form style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3)", marginBottom: 8 }}>
                Name
              </label>
              <input placeholder="Your name" style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--border)",
                borderRadius: 6,
                fontSize: 13,
                fontFamily: "var(--font-sans)",
                color: "var(--text)",
              }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3)", marginBottom: 8 }}>
                Email
              </label>
              <input placeholder="your@email.com" type="email" style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--border)",
                borderRadius: 6,
                fontSize: 13,
                fontFamily: "var(--font-sans)",
                color: "var(--text)",
              }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3)", marginBottom: 8 }}>
              Subject
            </label>
            <input placeholder="How can we help?" style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid var(--border)",
              borderRadius: 6,
              fontSize: 13,
              fontFamily: "var(--font-sans)",
              color: "var(--text)",
            }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3)", marginBottom: 8 }}>
              Message
            </label>
            <textarea placeholder="Tell us what you need..." style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid var(--border)",
              borderRadius: 6,
              fontSize: 13,
              fontFamily: "var(--font-sans)",
              color: "var(--text)",
              minHeight: 120,
              fontFamily: "var(--font-sans)",
            }} />
          </div>

          <button type="submit" style={{
            padding: "12px 32px",
            background: "linear-gradient(135deg, var(--purple), var(--blue))",
            border: "none",
            color: "#fff",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            width: "fit-content",
          }}>
            Send Message
          </button>
        </form>
      </Card>

      {/* FAQ */}
      <Card style={{ padding: "24px" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 20px", color: "var(--text)" }}>
          Frequently Asked Questions
        </h2>
        <div>
          {faqItems.map((item, idx) => (
            <FaqItem key={idx} item={item} index={idx} />
          ))}
        </div>
      </Card>

      {/* Status */}
      <Card style={{ padding: "20px 24px", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 12, height: 12, borderRadius: "50%",
            background: "#10b981", animation: "pulse 2s infinite",
          }} />
          <div>
            <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
              All Systems Operational
            </h4>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text2)" }}>
              No ongoing incidents. Check <a href="#" style={{ color: "#10b981", textDecoration: "none" }}>status page</a> for more.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
