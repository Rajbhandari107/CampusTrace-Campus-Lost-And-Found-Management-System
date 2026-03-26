
import { useState, useEffect, createContext, useContext } from "react";

// ─── STYLES ───────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0f14;
    --surface: #161920;
    --card: #1e2230;
    --border: #2a2f40;
    --accent: #f0c040;
    --accent2: #4af0a0;
    --danger: #f05060;
    --text: #e8eaf0;
    --muted: #7a8099;
    --radius: 12px;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

  /* ── Layout ── */
  .app { display: flex; min-height: 100vh; }
  .sidebar {
    width: 220px; min-height: 100vh; background: var(--surface);
    border-right: 1px solid var(--border); padding: 24px 16px;
    display: flex; flex-direction: column; gap: 4px; position: sticky; top: 0; height: 100vh;
  }
  .logo { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800;
    color: var(--accent); padding: 8px 12px 24px; letter-spacing: -0.5px; }
  .logo span { color: var(--text); }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;
    color: var(--muted); transition: all 0.15s; border: none; background: none; width: 100%; text-align: left;
  }
  .nav-item:hover { background: var(--card); color: var(--text); }
  .nav-item.active { background: var(--accent); color: #000; }
  .nav-group { font-size: 11px; color: var(--muted); padding: 16px 12px 6px; text-transform: uppercase; letter-spacing: 1px; }
  .nav-spacer { flex: 1; }
  .main { flex: 1; padding: 32px; overflow-y: auto; max-width: calc(100vw - 220px); }

  /* ── Cards ── */
  .card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
  .card-sm { padding: 14px 16px; }
  .section-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 20px; }
  .section-sub { color: var(--muted); font-size: 14px; margin-bottom: 24px; }

  /* ── Grid ── */
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  @media(max-width:900px) { .grid-3,.grid-4 { grid-template-columns: repeat(2,1fr); } }
  @media(max-width:600px) { .grid-2,.grid-3,.grid-4 { grid-template-columns: 1fr; } .sidebar { display:none; } .main { padding:16px; max-width:100vw; } }

  /* ── Stat cards ── */
  .stat { display:flex; flex-direction:column; gap:6px; }
  .stat-num { font-family:'Syne',sans-serif; font-size:32px; font-weight:800; }
  .stat-label { font-size:13px; color:var(--muted); }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 18px; border-radius: 8px; font-size: 14px; font-weight: 500;
    cursor: pointer; border: none; transition: all 0.15s; font-family: inherit;
  }
  .btn-primary { background: var(--accent); color: #000; }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-secondary { background: var(--surface); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger { background: var(--danger); color: #fff; }
  .btn-danger:hover { opacity: 0.85; }
  .btn-success { background: var(--accent2); color: #000; }
  .btn-success:hover { opacity: 0.85; }
  .btn-sm { padding: 6px 12px; font-size: 13px; }
  .btn-full { width: 100%; justify-content: center; }

  /* ── Forms ── */
  .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .form-label { font-size: 13px; font-weight: 500; color: var(--muted); }
  .form-input, .form-select, .form-textarea {
    background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
    color: var(--text); font-family: inherit; font-size: 14px; padding: 10px 14px;
    transition: border-color 0.15s; outline: none; width: 100%;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--accent); }
  .form-textarea { resize: vertical; min-height: 90px; }
  .form-select option { background: var(--card); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  /* ── Badges ── */
  .badge {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .badge-lost { background: #f0506020; color: var(--danger); border: 1px solid #f0506040; }
  .badge-found { background: #4af0a020; color: var(--accent2); border: 1px solid #4af0a040; }
  .badge-claimed { background: #f0c04020; color: var(--accent); border: 1px solid #f0c04040; }
  .badge-pending { background: #a080f020; color: #c0a0ff; border: 1px solid #a080f040; }
  .badge-approved { background: #4af0a020; color: var(--accent2); border: 1px solid #4af0a040; }
  .badge-rejected { background: #f0506020; color: var(--danger); border: 1px solid #f0506040; }
  .badge-admin { background: var(--accent); color: #000; }
  .badge-user { background: var(--surface); color: var(--muted); border: 1px solid var(--border); }

  /* ── Item cards ── */
  .item-card { border-radius: var(--radius); background: var(--card); border: 1px solid var(--border); overflow: hidden; transition: border-color 0.15s, transform 0.15s; }
  .item-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .item-img { width: 100%; height: 140px; object-fit: cover; background: var(--surface); display:flex; align-items:center; justify-content:center; font-size:36px; }
  .item-body { padding: 14px; }
  .item-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; margin-bottom:6px; }
  .item-meta { font-size:12px; color:var(--muted); display:flex; gap:12px; flex-wrap:wrap; margin-bottom:10px; }
  .item-meta span { display:flex; align-items:center; gap:3px; }
  .item-actions { display:flex; gap:8px; margin-top:12px; }

  /* ── Table ── */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th { text-align:left; padding:10px 14px; font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid var(--border); font-weight:600; }
  td { padding:12px 14px; border-bottom:1px solid var(--border)20; vertical-align:middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--surface)60; }

  /* ── Auth ── */
  .auth-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; background: var(--bg); }
  .auth-card { width: 100%; max-width: 420px; background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 36px; }
  .auth-logo { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; color:var(--accent); text-align:center; margin-bottom:4px; }
  .auth-sub { text-align:center; color:var(--muted); font-size:14px; margin-bottom:28px; }
  .auth-switch { text-align:center; margin-top:20px; font-size:14px; color:var(--muted); }
  .auth-switch button { background:none; border:none; color:var(--accent); cursor:pointer; font-size:14px; font-weight:500; }

  /* ── Modal ── */
  .modal-overlay { position:fixed; inset:0; background:#00000080; z-index:1000; display:flex; align-items:center; justify-content:center; padding:16px; }
  .modal { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:28px; max-width:560px; width:100%; max-height:90vh; overflow-y:auto; }
  .modal-title { font-family:'Syne',sans-serif; font-size:18px; font-weight:800; margin-bottom:20px; }
  .modal-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:20px; }

  /* ── Match card ── */
  .match-card { border:1px solid var(--accent)40; border-radius:var(--radius); padding:14px; background:var(--accent)08; }
  .match-score { font-size:12px; color:var(--accent); font-weight:600; margin-bottom:6px; }

  /* ── Search bar ── */
  .search-bar { display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
  .search-bar .form-input { max-width:300px; }

  /* ── Toast ── */
  .toast { position:fixed; bottom:24px; right:24px; background:var(--card); border:1px solid var(--border); border-radius:10px; padding:14px 18px; font-size:14px; z-index:9999; box-shadow:0 8px 32px #00000060; animation:slideUp 0.2s ease; max-width:320px; }
  .toast.success { border-color:var(--accent2); }
  .toast.error { border-color:var(--danger); }
  @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

  /* ── Misc ── */
  .flex { display:flex; align-items:center; }
  .flex-between { display:flex; align-items:center; justify-content:space-between; }
  .gap-8 { gap:8px; }
  .gap-12 { gap:12px; }
  .mb-8 { margin-bottom:8px; }
  .mb-16 { margin-bottom:16px; }
  .mb-24 { margin-bottom:24px; }
  .text-muted { color:var(--muted); font-size:14px; }
  .text-accent { color:var(--accent); }
  .empty-state { text-align:center; padding:48px; color:var(--muted); }
  .empty-state .icon { font-size:48px; margin-bottom:12px; }
  .divider { height:1px; background:var(--border); margin:20px 0; }
  .tag { display:inline-block; background:var(--surface); border:1px solid var(--border); border-radius:6px; padding:2px 8px; font-size:12px; color:var(--muted); }
`;

// ─── DATA LAYER (localStorage) ────────────────────────────────────────────────
const DB = {
  get: (k) => JSON.parse(localStorage.getItem("ct_" + k) || "null"),
  set: (k, v) => localStorage.setItem("ct_" + k, JSON.stringify(v)),
  id: () => Math.random().toString(36).slice(2) + Date.now().toString(36),
};

const seed = () => {
  if (DB.get("seeded")) return;
  const users = [
    { id: "admin1", name: "Admin", email: "admin@campus.edu", password: "admin123", role: "admin" },
    { id: "u1", name: "Arjun Kumar", email: "arjun@campus.edu", password: "pass123", role: "user" },
    { id: "u2", name: "Priya Singh", email: "priya@campus.edu", password: "pass123", role: "user" },
  ];
  const items = [
    { id: "i1", title: "Blue Backpack", description: "Navy blue Wildcraft backpack with laptop sleeve", category: "Bags", location: "Library Block B", date: "2025-03-20", image: "", type: "lost", status: "lost", userId: "u1", userName: "Arjun Kumar" },
    { id: "i2", title: "iPhone 14 Black", description: "Black iPhone 14, cracked screen protector, sticker on back", category: "Electronics", location: "Cafeteria", date: "2025-03-21", image: "", type: "lost", status: "lost", userId: "u2", userName: "Priya Singh" },
    { id: "i3", title: "Water Bottle Green", description: "Milton green thermos with name written in marker", category: "Accessories", location: "Sports Ground", date: "2025-03-22", image: "", type: "found", status: "found", userId: "u2", userName: "Priya Singh" },
    { id: "i4", title: "Student ID Card", description: "ID card found near main gate, belongs to a 3rd year student", category: "Documents", location: "Main Gate", date: "2025-03-23", image: "", type: "found", status: "found", userId: "u1", userName: "Arjun Kumar" },
    { id: "i5", title: "Calculator Casio FX", description: "Casio scientific calculator, has initials RK scratched on it", category: "Electronics", location: "Exam Hall 3", date: "2025-03-19", image: "", type: "lost", status: "claimed", userId: "u2", userName: "Priya Singh" },
  ];
  const claims = [
    { id: "c1", userId: "u1", itemId: "i5", status: "approved", message: "This is my calculator, I can describe every scratch on it", createdAt: "2025-03-24" },
  ];
  DB.set("users", users);
  DB.set("items", items);
  DB.set("claims", claims);
  DB.set("seeded", true);
};

// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

const ToastCtx = createContext(null);
const useToast = () => useContext(ToastCtx);

// ─── TOAST ────────────────────────────────────────────────────────────────────
function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const show = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </ToastCtx.Provider>
  );
}

// ─── ICONS (emoji-based for zero deps) ───────────────────────────────────────
const icons = {
  home: "🏠", lost: "🔍", found: "📦", report: "📝", claims: "📋",
  users: "👥", admin: "⚙️", logout: "🚪", search: "🔎", match: "🤝",
  location: "📍", date: "📅", category: "🏷️", user: "👤",
};

// ─── CATEGORY EMOJI ───────────────────────────────────────────────────────────
const catEmoji = { Electronics: "📱", Bags: "🎒", Documents: "📄", Accessories: "⌚", Clothing: "👕", Keys: "🔑", Other: "📦" };

// ─── MATCHING LOGIC ───────────────────────────────────────────────────────────
function scoreMatch(lost, found) {
  let score = 0;
  const tl = lost.title.toLowerCase(), tf = found.title.toLowerCase();
  const words = tl.split(" ").filter(w => w.length > 3);
  words.forEach(w => { if (tf.includes(w)) score += 30; });
  if (lost.category === found.category) score += 25;
  if (lost.location.toLowerCase() === found.location.toLowerCase()) score += 20;
  if (Math.abs(new Date(lost.date) - new Date(found.date)) < 7 * 86400000) score += 10;
  return Math.min(score, 99);
}

function getMatches(items) {
  const lost = items.filter(i => i.type === "lost" && i.status === "lost");
  const found = items.filter(i => i.type === "found" && i.status === "found");
  const matches = [];
  lost.forEach(l => {
    found.forEach(f => {
      const score = scoreMatch(l, f);
      if (score >= 25) matches.push({ lost: l, found: f, score });
    });
  });
  return matches.sort((a, b) => b.score - a.score).slice(0, 6);
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function ItemCard({ item, onView, onClaim, currentUser }) {
  const emoji = catEmoji[item.category] || "📦";
  const canClaim = currentUser?.role === "user" && item.status !== "claimed" && item.userId !== currentUser.id;
  return (
    <div className="item-card">
      <div className="item-img">{emoji}</div>
      <div className="item-body">
        <div className="flex-between mb-8">
          <span className={`badge badge-${item.type}`}>{item.type.toUpperCase()}</span>
          <span className={`badge badge-${item.status}`}>{item.status}</span>
        </div>
        <div className="item-title">{item.title}</div>
        <div className="item-meta">
          <span>{icons.location} {item.location}</span>
          <span>{icons.category} {item.category}</span>
          <span>{icons.date} {item.date}</span>
        </div>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 10 }}>{item.description.slice(0, 80)}{item.description.length > 80 ? "…" : ""}</p>
        <div className="item-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => onView(item)}>View</button>
          {canClaim && <button className="btn btn-primary btn-sm" onClick={() => onClaim(item)}>Claim</button>}
        </div>
      </div>
    </div>
  );
}

function ItemModal({ item, onClose, onClaim, currentUser }) {
  if (!item) return null;
  const emoji = catEmoji[item.category] || "📦";
  const canClaim = currentUser?.role === "user" && item.status !== "claimed" && item.userId !== currentUser.id;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ textAlign: "center", fontSize: 64, marginBottom: 12 }}>{emoji}</div>
        <div className="flex-between mb-16">
          <span className={`badge badge-${item.type}`}>{item.type.toUpperCase()}</span>
          <span className={`badge badge-${item.status}`}>{item.status}</span>
        </div>
        <div className="modal-title">{item.title}</div>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 16 }}>{item.description}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {[["Location", item.location, icons.location], ["Category", item.category, icons.category], ["Date", item.date, icons.date], ["Reported by", item.userName, icons.user]].map(([l, v, ic]) => (
            <div key={l} className="flex gap-8" style={{ fontSize: 14 }}>
              <span style={{ width: 100, color: "var(--muted)" }}>{ic} {l}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          {canClaim && <button className="btn btn-primary" onClick={() => { onClaim(item); onClose(); }}>Submit Claim</button>}
        </div>
      </div>
    </div>
  );
}

function ClaimModal({ item, onClose, onSubmit }) {
  const [msg, setMsg] = useState("");
  if (!item) return null;
  const handle = () => {
    if (!msg.trim()) return;
    onSubmit(item, msg);
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Submit Claim</div>
        <p className="text-muted mb-16">Claiming: <strong style={{ color: "var(--text)" }}>{item.title}</strong></p>
        <div className="form-group">
          <label className="form-label">Why is this yours? Describe identifying features.</label>
          <textarea className="form-textarea" value={msg} onChange={e => setMsg(e.target.value)} placeholder="E.g. My name is on the inside, it has a specific sticker..." />
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handle} disabled={!msg.trim()}>Submit Claim</button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function Dashboard({ setPage }) {
  const { user } = useAuth();
  const items = DB.get("items") || [];
  const claims = DB.get("claims") || [];
  const lost = items.filter(i => i.type === "lost" && i.status === "lost").length;
  const found = items.filter(i => i.type === "found" && i.status === "found").length;
  const claimed = items.filter(i => i.status === "claimed").length;
  const pending = claims.filter(c => c.status === "pending").length;
  const matches = getMatches(items);

  return (
    <div>
      <div className="section-title">Dashboard</div>
      <p className="section-sub">Welcome back, {user.name} 👋</p>
      <div className="grid-4 mb-24">
        {[["Lost Items", lost, "var(--danger)"], ["Found Items", found, "var(--accent2)"], ["Claimed", claimed, "var(--accent)"], ["Pending Claims", pending, "#c0a0ff"]].map(([l, v, c]) => (
          <div className="card" key={l}>
            <div className="stat">
              <div className="stat-num" style={{ color: c }}>{v}</div>
              <div className="stat-label">{l}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-between mb-16">
        <div style={{ fontFamily: "Syne", fontSize: 16, fontWeight: 700 }}>🤝 Possible Matches</div>
        <button className="btn btn-secondary btn-sm" onClick={() => setPage("items")}>View All Items</button>
      </div>

      {matches.length === 0
        ? <div className="card"><p className="text-muted">No matches found yet.</p></div>
        : <div className="grid-2">
            {matches.map((m, i) => (
              <div className="card match-card" key={i}>
                <div className="match-score">🎯 {m.score}% match confidence</div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div className="badge badge-lost" style={{ marginBottom: 6 }}>LOST</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{m.lost.title}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{m.lost.location} · {m.lost.category}</div>
                  </div>
                  <div style={{ color: "var(--accent)", fontSize: 20 }}>⟷</div>
                  <div style={{ flex: 1 }}>
                    <div className="badge badge-found" style={{ marginBottom: 6 }}>FOUND</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{m.found.title}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{m.found.location} · {m.found.category}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      }

      <div className="divider" />
      <div style={{ fontFamily: "Syne", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent Items</div>
      <div className="grid-3">
        {items.slice(-3).reverse().map(item => (
          <div className="card card-sm" key={item.id}>
            <div className="flex-between mb-8">
              <span className={`badge badge-${item.type}`}>{item.type}</span>
              <span style={{ fontSize: 20 }}>{catEmoji[item.category] || "📦"}</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{item.location} · {item.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ItemsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState(DB.get("items") || []);
  const [q, setQ] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [viewItem, setViewItem] = useState(null);
  const [claimItem, setClaimItem] = useState(null);

  const filtered = items.filter(i => {
    const matchQ = !q || i.title.toLowerCase().includes(q.toLowerCase()) || i.category.toLowerCase().includes(q.toLowerCase()) || i.location.toLowerCase().includes(q.toLowerCase());
    const matchT = filterType === "all" || i.type === filterType;
    const matchC = filterCat === "all" || i.category === filterCat;
    return matchQ && matchT && matchC;
  });

  const handleClaim = (item, msg) => {
    const claims = DB.get("claims") || [];
    const already = claims.find(c => c.userId === user.id && c.itemId === item.id);
    if (already) { toast("You already submitted a claim for this item.", "error"); return; }
    const newClaim = { id: DB.id(), userId: user.id, itemId: item.id, status: "pending", message: msg, createdAt: new Date().toISOString().slice(0, 10) };
    DB.set("claims", [...claims, newClaim]);
    toast("Claim submitted! Admin will review it.", "success");
  };

  return (
    <div>
      <div className="section-title">Browse Items</div>
      <div className="search-bar">
        <input className="form-input" placeholder="🔎 Search by name, category, location…" value={q} onChange={e => setQ(e.target.value)} />
        <select className="form-select" style={{ width: 130 }} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <select className="form-select" style={{ width: 150 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="all">All Categories</option>
          {Object.keys(catEmoji).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <p className="text-muted mb-16">{filtered.length} item{filtered.length !== 1 ? "s" : ""} found</p>
      {filtered.length === 0
        ? <div className="empty-state"><div className="icon">🔍</div><p>No items match your search.</p></div>
        : <div className="grid-3">
            {filtered.map(item => (
              <ItemCard key={item.id} item={item} currentUser={user} onView={setViewItem} onClaim={setClaimItem} />
            ))}
          </div>
      }
      <ItemModal item={viewItem} onClose={() => setViewItem(null)} onClaim={setClaimItem} currentUser={user} />
      <ClaimModal item={claimItem} onClose={() => setClaimItem(null)} onSubmit={handleClaim} />
    </div>
  );
}

function ReportPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ title: "", description: "", category: "Electronics", location: "", date: new Date().toISOString().slice(0, 10), type: "lost", image: "" });
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.title || !form.description || !form.location) { toast("Please fill all required fields.", "error"); return; }
    const items = DB.get("items") || [];
    const newItem = { ...form, id: DB.id(), status: form.type, userId: user.id, userName: user.name };
    DB.set("items", [...items, newItem]);
    toast("Item reported successfully! 🎉");
    setSubmitted(true);
    setForm({ title: "", description: "", category: "Electronics", location: "", date: new Date().toISOString().slice(0, 10), type: "lost", image: "" });
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="section-title">Report an Item</div>
      <p className="section-sub">Fill in details about the lost or found item.</p>

      {submitted && (
        <div className="card mb-16" style={{ borderColor: "var(--accent2)", background: "var(--accent2)10" }}>
          ✅ Item reported! Head to Browse Items to see it listed.
        </div>
      )}

      <div className="card">
        <div className="form-group">
          <label className="form-label">Type *</label>
          <div className="flex gap-8">
            {["lost", "found"].map(t => (
              <button key={t} className={`btn ${form.type === t ? "btn-primary" : "btn-secondary"}`} onClick={() => set("type", t)} style={{ flex: 1 }}>
                {t === "lost" ? "🔍 I Lost Something" : "📦 I Found Something"}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" placeholder="e.g. Blue Backpack" value={form.title} onChange={e => set("title", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea className="form-textarea" placeholder="Describe the item with identifying features..." value={form.description} onChange={e => set("description", e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={e => set("category", e.target.value)}>
              {Object.keys(catEmoji).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date *</label>
            <input className="form-input" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Location *</label>
          <input className="form-input" placeholder="e.g. Library Block B, Ground Floor" value={form.location} onChange={e => set("location", e.target.value)} />
        </div>
        <button className="btn btn-primary btn-full" onClick={handleSubmit}>Submit Report</button>
      </div>
    </div>
  );
}

function MyClaims() {
  const { user } = useAuth();
  const claims = (DB.get("claims") || []).filter(c => c.userId === user.id);
  const items = DB.get("items") || [];
  const getItem = id => items.find(i => i.id === id);

  return (
    <div>
      <div className="section-title">My Claims</div>
      <p className="section-sub">Track the status of your submitted claim requests.</p>
      {claims.length === 0
        ? <div className="empty-state"><div className="icon">📋</div><p>No claims submitted yet.</p></div>
        : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {claims.map(c => {
              const item = getItem(c.itemId);
              return (
                <div className="card" key={c.id}>
                  <div className="flex-between mb-8">
                    <div style={{ fontWeight: 600 }}>{item?.title || "Unknown Item"}</div>
                    <span className={`badge badge-${c.status}`}>{c.status}</span>
                  </div>
                  <p className="text-muted" style={{ fontSize: 13 }}>{c.message}</p>
                  <div className="text-muted" style={{ fontSize: 12, marginTop: 8 }}>Submitted: {c.createdAt}</div>
                </div>
              );
            })}
          </div>
      }
    </div>
  );
}

function AdminDashboard() {
  const toast = useToast();
  const [tab, setTab] = useState("claims");
  const [items, setItems] = useState(DB.get("items") || []);
  const [claims, setClaims] = useState(DB.get("claims") || []);
  const [users] = useState(DB.get("users") || []);

  const handleClaim = (id, action) => {
    const updated = claims.map(c => {
      if (c.id !== id) return c;
      const updatedClaim = { ...c, status: action };
      if (action === "approved") {
        const updatedItems = items.map(i => i.id === c.itemId ? { ...i, status: "claimed" } : i);
        DB.set("items", updatedItems);
        setItems(updatedItems);
      }
      return updatedClaim;
    });
    DB.set("claims", updated);
    setClaims(updated);
    toast(action === "approved" ? "Claim approved! Item marked as claimed." : "Claim rejected.");
  };

  const handleDeleteItem = (id) => {
    const updated = items.filter(i => i.id !== id);
    DB.set("items", updated);
    setItems(updated);
    toast("Item deleted.");
  };

  const getItem = id => items.find(i => i.id === id);
  const getUser = id => users.find(u => u.id === id);

  return (
    <div>
      <div className="section-title">⚙️ Admin Dashboard</div>
      <div className="grid-4 mb-24">
        {[["Users", users.length, "#c0a0ff"], ["Items", items.length, "var(--accent)"], ["Claims", claims.length, "var(--accent2)"], ["Pending", claims.filter(c => c.status === "pending").length, "var(--danger)"]].map(([l, v, c]) => (
          <div className="card" key={l}><div className="stat"><div className="stat-num" style={{ color: c }}>{v}</div><div className="stat-label">{l}</div></div></div>
        ))}
      </div>

      <div className="flex gap-8 mb-16">
        {["claims", "items", "users"].map(t => (
          <button key={t} className={`btn ${tab === t ? "btn-primary" : "btn-secondary"} btn-sm`} onClick={() => setTab(t)}>
            {t === "claims" ? "📋 Claims" : t === "items" ? "📦 Items" : "👥 Users"}
          </button>
        ))}
      </div>

      {tab === "claims" && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Item</th><th>Claimed By</th><th>Message</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {claims.map(c => {
                  const item = getItem(c.itemId);
                  const claimUser = getUser(c.userId);
                  return (
                    <tr key={c.id}>
                      <td><strong>{item?.title || "—"}</strong><br /><span className="text-muted" style={{ fontSize: 12 }}>{item?.category}</span></td>
                      <td>{claimUser?.name || "—"}<br /><span className="text-muted" style={{ fontSize: 12 }}>{claimUser?.email}</span></td>
                      <td style={{ maxWidth: 200, fontSize: 13 }}>{c.message}</td>
                      <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                      <td>
                        {c.status === "pending" && (
                          <div className="flex gap-8">
                            <button className="btn btn-success btn-sm" onClick={() => handleClaim(c.id, "approved")}>Approve</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleClaim(c.id, "rejected")}>Reject</button>
                          </div>
                        )}
                        {c.status !== "pending" && <span className="text-muted" style={{ fontSize: 13 }}>—</span>}
                      </td>
                    </tr>
                  );
                })}
                {claims.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: 24 }}>No claims yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "items" && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Title</th><th>Type</th><th>Category</th><th>Location</th><th>Status</th><th>Reported By</th><th>Action</th></tr>
              </thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.id}>
                    <td><strong>{i.title}</strong></td>
                    <td><span className={`badge badge-${i.type}`}>{i.type}</span></td>
                    <td><span className="tag">{i.category}</span></td>
                    <td style={{ fontSize: 13 }}>{i.location}</td>
                    <td><span className={`badge badge-${i.status}`}>{i.status}</span></td>
                    <td style={{ fontSize: 13 }}>{i.userName}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(i.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Items Reported</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td style={{ fontSize: 13 }}>{u.email}</td>
                    <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                    <td>{items.filter(i => i.userId === u.id).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AUTH PAGES ───────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const toast = useToast();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleLogin = () => {
    const users = DB.get("users") || [];
    const u = users.find(u => u.email === form.email && u.password === form.password);
    if (!u) { toast("Invalid email or password.", "error"); return; }
    onLogin(u);
  };

  const handleRegister = () => {
    if (!form.name || !form.email || !form.password) { toast("All fields required.", "error"); return; }
    const users = DB.get("users") || [];
    if (users.find(u => u.email === form.email)) { toast("Email already registered.", "error"); return; }
    const newUser = { id: DB.id(), name: form.name, email: form.email, password: form.password, role: form.role };
    DB.set("users", [...users, newUser]);
    toast("Registered! Please login.");
    setMode("login");
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">Campus<span>Trace</span></div>
        <div className="auth-sub">Lost & Found Management System</div>

        {mode === "login" ? (
          <>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@campus.edu" value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => set("password", e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
            <button className="btn btn-primary btn-full" onClick={handleLogin}>Login</button>
            <div className="card" style={{ marginTop: 16, fontSize: 12, color: "var(--muted)" }}>
              <strong style={{ color: "var(--accent)" }}>Demo accounts:</strong><br />
              Admin: admin@campus.edu / admin123<br />
              User: arjun@campus.edu / pass123
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Your Name" value={form.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@campus.edu" value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => set("password", e.target.value)} />
            </div>
            <button className="btn btn-primary btn-full" onClick={handleRegister}>Create Account</button>
          </>
        )}
        <div className="auth-switch">
          {mode === "login" ? <>Don't have an account? <button onClick={() => setMode("register")}>Register</button></> : <>Already registered? <button onClick={() => setMode("login")}>Login</button></>}
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR NAV ─────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, user, onLogout }) {
  const navUser = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "items", label: "Browse Items", icon: "🔎" },
    { id: "report", label: "Report Item", icon: "📝" },
    { id: "claims", label: "My Claims", icon: "📋" },
  ];
  const navAdmin = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "items", label: "Browse Items", icon: "🔎" },
    { id: "admin", label: "Admin Panel", icon: "⚙️" },
  ];
  const nav = user.role === "admin" ? navAdmin : navUser;
  return (
    <div className="sidebar">
      <div className="logo">Campus<span>Trace</span></div>
      {nav.map(n => (
        <button key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
          <span>{n.icon}</span> {n.label}
        </button>
      ))}
      <div className="nav-spacer" />
      <div className="card card-sm" style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{user.email}</div>
        <span className={`badge badge-${user.role}`} style={{ marginTop: 6, display: "inline-block" }}>{user.role}</span>
      </div>
      <button className="nav-item" onClick={onLogout}>🚪 Logout</button>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function CampusTrace() {
  seed();
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("ct_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [page, setPage] = useState("dashboard");

  const login = (u) => { setUser(u); sessionStorage.setItem("ct_user", JSON.stringify(u)); };
  const logout = () => { setUser(null); sessionStorage.removeItem("ct_user"); };

  const renderPage = () => {
    if (page === "dashboard") return <Dashboard setPage={setPage} />;
    if (page === "items") return <ItemsPage />;
    if (page === "report") return <ReportPage />;
    if (page === "claims") return <MyClaims />;
    if (page === "admin" && user?.role === "admin") return <AdminDashboard />;
    return <Dashboard setPage={setPage} />;
  };

  return (
    <AuthCtx.Provider value={{ user }}>
      <ToastProvider>
        <style>{CSS}</style>
        {!user
          ? <AuthPage onLogin={login} />
          : (
            <div className="app">
              <Sidebar page={page} setPage={setPage} user={user} onLogout={logout} />
              <div className="main">{renderPage()}</div>
            </div>
          )
        }
      </ToastProvider>
    </AuthCtx.Provider>
  );
}
