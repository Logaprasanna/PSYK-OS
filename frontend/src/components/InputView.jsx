import React, { useState } from "react";

export default function InputView({ onSubmit, loading }) {
  const [text, setText] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (text.trim() && !loading) {
        onSubmit(text.trim());
        setText("");
      }
    }
  };

  const handleClick = () => {
    if (text.trim() && !loading) {
      onSubmit(text.trim());
      setText("");
    }
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.heading}>Dump your thoughts</h1>
      <div style={styles.inputBox}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={loading ? "Processing..." : "Write anything..."}
          disabled={loading}
          style={styles.textarea}
        />
        <button
          onClick={handleClick}
          disabled={!text.trim() || loading}
          style={styles.sendBtn}
        >
          ➤
        </button>
      </div>
      <p style={styles.hint}>Enter to send · Shift+Enter for new line</p>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    width: "100%",
    maxWidth: "580px",
    margin: "0 auto",
    padding: "0 24px",
  },
  heading: {
    fontFamily: "var(--font-display)",
    fontSize: "32px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  inputBox: {
    position: "relative",
    width: "100%",
    background: "var(--bg-input)",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    padding: "16px 52px 16px 18px",
  },
  textarea: {
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "var(--text-primary)",
    fontFamily: "var(--font-body)",
    fontSize: "15px",
    lineHeight: 1.7,
    resize: "none",
    minHeight: "90px",
  },
  sendBtn: {
    position: "absolute",
    bottom: "14px",
    right: "14px",
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontSize: "16px",
  },
  hint: {
    fontSize: "12px",
    color: "var(--text-muted)",
  },
};