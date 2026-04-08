import React from "react";

const VALENCE_COLOR = {
  positive: "var(--green)",
  negative: "var(--red)",
  neutral:  "var(--grey)",
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Sidebar({ entries, activeId, onSelect, onNewEntry }) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.list}>
        {entries.length === 0 && (
          <p style={styles.empty}>No entries yet</p>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => onSelect(entry)}
            style={{
              ...styles.card,
              ...(activeId === entry.id ? styles.cardActive : {}),
            }}
          >
            <p style={styles.cardTitle}>{entry.title}</p>
            <div style={styles.cardMeta}>
              <span style={styles.emotionRow}>
                <span
                  style={{
                    ...styles.dot,
                    background: VALENCE_COLOR[entry.valence] || "var(--grey)",
                  }}
                />
                <span style={styles.emotionText}>{entry.emotion}</span>
              </span>
              <span style={styles.dateText}>{formatDate(entry.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Floating add button inside sidebar */}
      <button onClick={onNewEntry} style={styles.fab}>
        +
      </button>
    </aside>
  );
}

const styles = {
  sidebar: {
    position: "relative",   
    width: "var(--sidebar-w)",
    minWidth: "var(--sidebar-w)",
    height: "100%",
    background: "var(--bg-sidebar)",
    borderRight: "1.5px solid var(--accent)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  fab: {
    position: "absolute",
    bottom: "28px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  empty: {
    color: "var(--text-muted)",
    fontSize: "13px",
    textAlign: "center",
    marginTop: "24px",
  },
  card: {
    background: "var(--bg-card)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 12px",
    cursor: "pointer",
    transition: "background 0.15s",
    border: "1px solid transparent",
  },
  cardActive: {
    background: "var(--bg-card-hover)",
    border: "1px solid var(--accent)",
  },
  cardTitle: {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: "13px",
    color: "var(--text-primary)",
    marginBottom: "6px",
    lineHeight: 1.3,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emotionRow: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  emotionText: {
    fontSize: "11px",
    color: "var(--text-secondary)",
  },
  dateText: {
    fontSize: "11px",
    color: "var(--text-muted)",
  },
};