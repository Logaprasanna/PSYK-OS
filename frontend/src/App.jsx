import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import InputView from "./components/InputView";
import ResponseView from "./components/ResponseView";

export default function App() {
  const [entries, setEntries]         = useState([]);
  const [activeEntry, setActiveEntry] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load entries when app first opens
  useEffect(() => {
    fetch("/entries")
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch(console.error);
  }, []);

  // Called when user submits a journal entry
  const handleSubmit = async (text) => {
    setLoading(true);
    try {
      const res = await fetch("/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const entry = await res.json();
      setEntries((prev) => [entry, ...prev]);
      setActiveEntry(entry);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)" }}>

      {/* Sidebar */}
       {sidebarOpen && (
        <Sidebar
          entries={entries}
          activeId={activeEntry?.id}
          onSelect={(entry) => setActiveEntry(entry)}
          onNewEntry={() => setActiveEntry(null)}
        />
      )} 

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <header style={styles.header}>
          <button onClick={() => setSidebarOpen((v) => !v)} style={styles.iconBtn}>
            ☰
          </button>
          <span style={styles.brand}>Psyk OS</span>
          <div style={{ width: 36 }} />
        </header>

        {/* Center content — input or response depending on state */}
        <div style={styles.content}>
          {activeEntry ? (
            <ResponseView entry={activeEntry} />
          ) : (
            <InputView onSubmit={handleSubmit} loading={loading} />
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: "52px",
    flexShrink: 0,
  },
  brand: {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: "16px",
    letterSpacing: "0.04em",
    color: "var(--text-primary)",
  },
  iconBtn: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontSize: "18px",
    width: 36,
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  
};