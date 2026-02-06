import { useState } from "react";
import API from "../api/axios";
import MusicPicker from "../components/MusicPicker";
import "./create.css";

export default function Create() {
  const [form, setForm] = useState({
    senderName: "",
    receiverName: "",
    message: "",
    theme: "rose",
    music: "love.mp3",
    noButtonMode: "move",
  });

  const [links, setLinks] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Basic form validation
    if (!form.senderName.trim() || !form.receiverName.trim() || !form.message.trim()) {
      alert("Please fill in all required fields: Your name, Their name, and Custom message");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/valentine/create", form);
      console.log("API response:", res.data);
      
      // Backend returns { publicLink, dashboardLink }
      setLinks({
        publicLink: res.data.publicLink,
        dashboardLink: res.data.dashboardLink
      });
      
      // Scroll to links section
      setTimeout(() => {
        const linksSection = document.querySelector('.create-links');
        if (linksSection) {
          linksSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error("Error creating valentine:", err);
      alert(err.response?.data?.error || "Failed to create Valentine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccessMessage(`✅ ${type} link copied to clipboard!`);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setSuccessMessage("❌ Failed to copy. Please try again.");
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="create-container">
      <div className="create-card">
        <h1 className="create-title">
          Create Valentine 💌
        </h1>
        <p className="create-info">
          <i>Send a special Valentine message to someone you like! Fill in your name, their name, and a custom message, choose music if you like, then generate a unique link. Share the link with your crush and see their response on your private dashboard.</i>
        </p>

        <input
          placeholder="Your name *"
          className="create-input"
          value={form.senderName}
          onChange={(e) => setForm({ ...form, senderName: e.target.value })}
          required
          disabled={loading}
        />

        <input
          placeholder="Their name *"
          className="create-input"
          value={form.receiverName}
          onChange={(e) => setForm({ ...form, receiverName: e.target.value })}
          required
          disabled={loading}
        />

        <textarea
          placeholder="Custom message *"
          className="create-textarea"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
          maxLength="500"
          disabled={loading}
        />
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          {form.message.length}/500 characters
        </div>

        <MusicPicker
          value={form.music}
          onChange={(music) => setForm({ ...form, music })}
          disabled={loading}
        />

        <button
          onClick={handleSubmit}
          className="create-button"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Link 💖"}
        </button>

        {links && (
          <div className="create-links">
            {/* Valentine Link */}
            <div className="create-link">
              <div className="link-header">
                <span>💌</span>
                Send this to your crush:
              </div>
              <div className="link-container">
                <div className="link-text">
                  {links.publicLink}
                </div>
                <div className="link-actions">
                  <button
                    onClick={() => copyToClipboard(links.publicLink, "Valentine")}
                    className="link-button link-button-copy"
                    disabled={loading}
                  >
                    <span className="link-button-icon">📋</span>
                    Copy Link
                  </button>
                  <button
                    onClick={() => openLink(links.publicLink)}
                    className="link-button link-button-view"
                    disabled={loading}
                  >
                    <span className="link-button-icon">👁️</span>
                    View Page
                  </button>
                </div>
              </div>
            </div>

            {/* Dashboard Link */}
            <div className="create-link">
              <div className="link-header">
                <span>🔒</span>
                Your private dashboard (save this!):
              </div>
              <div className="link-container">
                <div className="link-text">
                  {links.dashboardLink}
                </div>
                <div className="link-actions">
                  <button
                    onClick={() => copyToClipboard(links.dashboardLink, "Dashboard")}
                    className="link-button link-button-copy"
                    disabled={loading}
                  >
                    <span className="link-button-icon">📋</span>
                    Copy Link
                  </button>
                  <button
                    onClick={() => openLink(links.dashboardLink)}
                    className="link-button link-button-view"
                    disabled={loading}
                  >
                    <span className="link-button-icon">📊</span>
                    View Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#fef3c7',
              borderRadius: '10px',
              fontSize: '14px',
              color: '#92400e',
              borderLeft: '4px solid #f59e0b'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>💡 Tips:</div>
              <ul style={{ margin: '0', paddingLeft: '20px' }}>
                <li>Share the Valentine link with your crush</li>
                <li>Save your dashboard link to track their response</li>
                <li>Your dashboard is private - only you can see it</li>
              </ul>
            </div>
          </div>
        )}

        {/* Success notification */}
        {showSuccess && (
          <div className="copy-success">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}