import React from "react";

export default function ResponseView({ entry }) {
  const paragraphs = entry.response
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div style={styles.wrapper}>

      {/* What the user typed — in a bubble */}
      <div style={styles.bubble}>
        <p style={styles.bubbleText}>{entry.raw_text}</p>
      </div>

      {/* LLM response — plain paragraphs, no bubble */}
      {paragraphs.map((p, i) => (
        <p key={i} style={styles.bodyText}>{p}</p>
      ))}

    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    maxWidth: "580px",
    margin: "0 auto",
    padding: "0 24px 40px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    overflowY: "auto",
    maxHeight: "calc(100vh - 100px)",
  },
  bubble: {
    background: "var(--bg-card)",
    borderRadius: "var(--radius)",
    padding: "20px 24px",
    border: "1px solid var(--border)",
  },
  bubbleText: {
    color: "var(--text-primary)",
    lineHeight: 1.75,
  },
  bodyText: {
    color: "var(--text-secondary)",
    lineHeight: 1.75,
  },
};