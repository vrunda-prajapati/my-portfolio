import { useState, useEffect, useRef } from "react";

// ── Typing effect hook ──────────────────────────────────────────────────
function useTyping(words, speed = 90, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else setCharIdx(c => c + 1);
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx(i => (i + 1) % words.length);
          setCharIdx(0);
        } else setCharIdx(c => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

// ── Intersection observer hook ──────────────────────────────────────────
function useVisible(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Data ────────────────────────────────────────────────────────────────
const SKILLS = {
  Frontend: [
    { name: "React", level: 50 },
    { name: "HTML / CSS", level: 90 },
    { name: "JavaScript", level: 75 },
  ],
  Backend: [
    { name: "Java", level: 65 },
    { name: "Python", level: 85 },
    { name: "c++", level: 70 },
  ],
  Tools: [
    { name: "Git / GitHub", level: 50 },
    { name: "VS Code", level: 90 },
    { name: "MySQL", level: 65 },
  ],
};

const PROJECTS = [
  {
    title: "Skillify",
    emoji: "🚀",
    desc: "A full-stack skill-sharing and learning platform where users can post skills they offer, browse what others teach, and connect for peer-to-peer learning.",
    tech: ["HTML", "CSS", "Javascript", "Node.js", "MySQL"],
    github: "https://github.com/yourusername/skillify",
    live: null,
    highlight: true,
  },
  {
    title: "Portfolio Website",
    emoji: "📦",
    desc: "This website serves as a personal portfolio to showcase my projects, skills, and practical experience in software development. It includes detailed information about the applications I have developed, along with the tools and technologies used in each project.",
    tech: ["React"],
    github: "https://github.com/vrunda-prajapati/my-portfolio.git",
    live: null,
    highlight: true,
  },
];

const NAV = ["Home", "About", "Skills", "Projects", "Contact"];

// ── Components ──────────────────────────────────────────────────────────

function NavBar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(10,14,27,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(0,229,190,0.12)" : "none",
      transition: "all 0.4s ease",
      padding: "0 5vw",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#00E5BE", letterSpacing: 1 }}>
          &lt;Vrunda/&gt;
        </span>
        {/* Desktop */}
        <ul style={{ display: "flex", gap: 32, listStyle: "none", margin: 0, padding: 0 }} className="desktop-nav">
          {NAV.map(n => (
            <li key={n}>
              <button onClick={() => scrollTo(n)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                color: active === n.toLowerCase() ? "#00E5BE" : "rgba(255,255,255,0.7)",
                letterSpacing: 0.5, padding: "4px 0",
                borderBottom: active === n.toLowerCase() ? "2px solid #00E5BE" : "2px solid transparent",
                transition: "all 0.2s",
              }}>{n}</button>
            </li>
          ))}
        </ul>
        {/* Hamburger */}
        <button onClick={() => setMenuOpen(m => !m)} style={{ background: "none", border: "none", cursor: "pointer", display: "none", flexDirection: "column", gap: 5 }} className="hamburger">
          {[0,1,2].map(i => <span key={i} style={{ display: "block", width: 24, height: 2, background: "#00E5BE", borderRadius: 2, transition: "all 0.3s" }} />)}
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "rgba(10,14,27,0.97)", padding: "16px 5vw 24px", borderTop: "1px solid rgba(0,229,190,0.1)" }}>
          {NAV.map(n => (
            <button key={n} onClick={() => scrollTo(n)} style={{
              display: "block", width: "100%", textAlign: "left",
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.85)",
              padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>{n}</button>
          ))}
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        @media(max-width:640px){.desktop-nav{display:none!important}.hamburger{display:flex!important}}
      `}</style>
    </nav>
  );
}

function Hero() {
  const typed = useTyping(["Computer Engineering Student.", "Full-Stack Developer.", "Problem Solver.", "Builder of Skillify."]);
  return (
    <section id="home" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 5vw", position: "relative", overflow: "hidden",
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0,229,190,0.07) 0%, transparent 55%),
          radial-gradient(circle at 80% 20%, rgba(99,102,241,0.08) 0%, transparent 50%),
          linear-gradient(rgba(0,229,190,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,229,190,0.04) 1px, transparent 1px)`,
        backgroundSize: "auto, auto, 60px 60px, 60px 60px",
        zIndex: 0,
      }} />
      {/* Glow blobs */}
      <div style={{ position: "absolute", top: "15%", left: "10%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,229,190,0.1) 0%, transparent 70%)", zIndex: 0, animation: "float 6s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "12%", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", zIndex: 0, animation: "float 8s ease-in-out infinite reverse" }} />

      <div style={{ maxWidth: 750, zIndex: 1, textAlign: "center", animation: "fadeUp 0.9s ease both" }}>
        <p style={{ fontFamily: "'DM Mono', monospace", color: "#00E5BE", fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 24, opacity: 0.9 }}>
          👋 Hello, I'm
        </p>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2.8rem,7vw,5.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 20, letterSpacing: -1 }}>
          Vrunda Prajapati
        </h1>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.1rem,3vw,1.6rem)", color: "rgba(255,255,255,0.55)", marginBottom: 36, minHeight: 42 }}>
          <span style={{ color: "#00E5BE", fontWeight: 600 }}>{typed}</span>
          <span style={{ color: "#00E5BE", animation: "blink 1s step-end infinite" }}>|</span>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: 560, margin: "0 auto 44px" }}>
          I build clean, functional software — from full-stack web apps to desktop tools. Currently focused on <span style={{ color: "#fff", fontWeight: 600 }}>Skillify</span>, a peer-to-peer skill-sharing platform.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} style={{
            padding: "14px 32px", background: "#00E5BE", color: "#0A0E1B", border: "none", borderRadius: 8,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer",
            boxShadow: "0 0 24px rgba(0,229,190,0.35)", transition: "all 0.25s",
            letterSpacing: 0.4,
          }}
            onMouseEnter={e => { e.target.style.background = "#00c9a8"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.background = "#00E5BE"; e.target.style.transform = "translateY(0)"; }}
          >
            View Projects →
          </button>
          <a href="#" download style={{
            padding: "14px 32px", background: "transparent", color: "#00E5BE", border: "2px solid rgba(0,229,190,0.4)", borderRadius: 8,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, cursor: "pointer",
            textDecoration: "none", display: "inline-block", transition: "all 0.25s", letterSpacing: 0.4,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#00E5BE"; e.currentTarget.style.background = "rgba(0,229,190,0.07)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,229,190,0.4)"; e.currentTarget.style.background = "transparent"; }}
          >
            ↓ Resume
          </a>
        </div>
      </div>
    </section>
  );
}
 


function About() {
  const [ref, visible] = useVisible();
  return (
    <section id="about" ref={ref} style={{ padding: "100px 5vw", maxWidth: 1100, margin: "0 auto" }}>
      <SectionLabel label="About Me" />
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "all 0.7s ease",
      }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "#fff", marginBottom: 20, lineHeight: 1.2 }}>
            Building things that <span style={{ color: "#00E5BE" }}>matter.</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, marginBottom: 16 }}>
            I'm a Computer Engineering student with a passion for building software that solves real problems. I love working across the full stack — designing intuitive UIs and architecting solid backends.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.9 }}>
            My current focus is <span style={{ color: "#00E5BE", fontWeight: 600 }}>Skillify</span> — a platform where people can share and learn skills from each other. I believe technology should connect people and make learning more accessible.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { icon: "🎓", label: "Student", desc: "Computer Engineering" },
            { icon: "💻", label: "Dev", desc: "Full-Stack" },
            { icon: "🚀", label: "Builder", desc: "Skillify & more" },
            { icon: "🌱", label: "Learning", desc: "Every single day" },
          ].map(c => (
            <div key={c.label} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12, padding: 24, textAlign: "center",
              transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,229,190,0.3)"; e.currentTarget.style.background = "rgba(0,229,190,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#fff", fontSize: 15 }}>{c.label}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:700px){#about .about-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

function Skills() {
  const [ref, visible] = useVisible();
  return (
    <section id="skills" ref={ref} style={{ padding: "100px 5vw", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel label="Skills" />
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#fff", marginBottom: 48, textAlign: "center" }}>
          My Tech Stack
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
          {Object.entries(SKILLS).map(([cat, items], ci) => (
            <div key={cat} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: 28,
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)",
              transition: `all 0.6s ease ${ci * 0.15}s`,
            }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#00E5BE", fontSize: 13, textTransform: "uppercase", letterSpacing: 2, marginBottom: 24 }}>{cat}</h3>
              {items.map((sk, si) => (
                <div key={sk.name} style={{ marginBottom: si < items.length - 1 ? 20 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500 }}>{sk.name}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", color: "#00E5BE", fontSize: 12 }}>{sk.level}%</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 3,
                      background: "linear-gradient(90deg, #00E5BE, #6366f1)",
                      width: visible ? `${sk.level}%` : "0%",
                      transition: `width 1s ease ${ci * 0.15 + si * 0.1 + 0.2}s`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const [ref, visible] = useVisible();
  return (
    <section id="projects" ref={ref} style={{ padding: "100px 5vw" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionLabel label="Projects" />
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#fff", marginBottom: 48, textAlign: "center" }}>
          What I've Built
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
          {PROJECTS.map((p, i) => (
            <div key={p.title} style={{
              background: p.highlight ? "linear-gradient(135deg, rgba(0,229,190,0.06), rgba(99,102,241,0.06))" : "rgba(255,255,255,0.03)",
              border: p.highlight ? "1px solid rgba(0,229,190,0.25)" : "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20, padding: 32, position: "relative", overflow: "hidden",
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)",
              transition: `all 0.6s ease ${i * 0.15}s`,
              display: "flex", flexDirection: "column",
            }}>
              {p.highlight && (
                <span style={{
                  position: "absolute", top: 16, right: 16,
                  background: "rgba(0,229,190,0.15)", color: "#00E5BE",
                  fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600,
                  letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 10px", borderRadius: 20,
                  border: "1px solid rgba(0,229,190,0.25)",
                }}>Featured</span>
              )}
              <div style={{ fontSize: 36, marginBottom: 16 }}>{p.emoji}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", marginBottom: 12 }}>{p.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: 20, flexGrow: 1 }}>{p.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {p.tech.map(t => (
                  <span key={t} style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#00E5BE",
                    background: "rgba(0,229,190,0.08)", border: "1px solid rgba(0,229,190,0.2)",
                    padding: "3px 10px", borderRadius: 4, letterSpacing: 0.5,
                  }}>{t}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <a href={p.github} target="_blank" rel="noreferrer" style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                  color: "#fff", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  padding: "8px 18px", borderRadius: 7, textDecoration: "none", transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 6,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.13)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                >⬡ GitHub</a>
                {p.live && (
                  <a href={p.live} target="_blank" rel="noreferrer" style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                    color: "#0A0E1B", background: "#00E5BE", border: "none",
                    padding: "8px 18px", borderRadius: 7, textDecoration: "none", transition: "all 0.2s",
                  }}>↗ Live Demo</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [ref, visible] = useVisible();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (form.name && form.email && form.message) setSent(true);
  };

  return (
    <section id="contact" ref={ref} style={{
      padding: "100px 5vw", background: "rgba(255,255,255,0.015)",
      borderTop: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <SectionLabel label="Contact" />
        <h2 style={{
          fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#fff",
          marginBottom: 12, textAlign: "center",
          opacity: visible ? 1 : 0, transition: "all 0.5s ease",
        }}>
          Let's Work Together
        </h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.5)", fontSize: 16, textAlign: "center", marginBottom: 48,
          opacity: visible ? 1 : 0, transition: "all 0.5s ease 0.1s",
        }}>
          Open to internships, collaborations, and interesting projects.
        </p>

        {/* Social links */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 20, marginBottom: 48, flexWrap: "wrap",
          opacity: visible ? 1 : 0, transition: "all 0.5s ease 0.2s",
        }}>
          {[
            { icon: "✉️", label: "Email", href: "mailto:vrundaprajapati0204@gmail.com" },
            { icon: "💼", label: "LinkedIn", href: "https://www.linkedin.com/in/vrunda-prajapati-0b3b4b31b/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B5HLFuftgS1OSbUCf%2FgqMAA%3D%3D" },
            { icon: "🐙", label: "GitHub", href: "https://github.com/vrunda-prajapati" },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{
              display: "flex", alignItems: "center", gap: 10,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14,
              color: "rgba(255,255,255,0.75)", textDecoration: "none",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
              padding: "12px 22px", borderRadius: 10, transition: "all 0.25s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,229,190,0.35)"; e.currentTarget.style.color = "#00E5BE"; e.currentTarget.style.background = "rgba(0,229,190,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            >
              <span>{s.icon}</span> {s.label}
            </a>
          ))}
        </div>

        {/* Contact form */}
        {sent ? (
          <div style={{ textAlign: "center", padding: 40, background: "rgba(0,229,190,0.07)", border: "1px solid rgba(0,229,190,0.25)", borderRadius: 16 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: "#00E5BE" }}>Message sent!</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.5)", fontSize: 14 }}>I'll get back to you soon.</p>
          </div>
        ) : (
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, padding: 32,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.6s ease 0.3s",
          }}>
            {[
              { key: "name", label: "Your Name", type: "text", placeholder: "John Doe" },
              { key: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 8, fontWeight: 500, letterSpacing: 0.3 }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "rgba(0,229,190,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
            ))}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 8, fontWeight: 500 }}>Message</label>
              <textarea rows={4} placeholder="Hey! I'd love to collaborate on..." value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", transition: "border 0.2s" }}
                onFocus={e => e.target.style.borderColor = "rgba(0,229,190,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
            <button onClick={handleSubmit} style={{
              width: "100%", padding: "14px", background: "#00E5BE", color: "#0A0E1B",
              border: "none", borderRadius: 8, fontFamily: "'Syne', sans-serif", fontWeight: 700,
              fontSize: 15, cursor: "pointer", transition: "all 0.25s", letterSpacing: 0.3,
            }}
              onMouseEnter={e => { e.target.style.background = "#00c9a8"; e.target.style.boxShadow = "0 0 24px rgba(0,229,190,0.3)"; }}
              onMouseLeave={e => { e.target.style.background = "#00E5BE"; e.target.style.boxShadow = "none"; }}
            >Send Message →</button>
          </div>
        )}
      </div>
    </section>
  );
}

function SectionLabel({ label }) {
  return (
    <p style={{ fontFamily: "'DM Mono', monospace", color: "#00E5BE", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12, textAlign: "center", opacity: 0.8 }}>
      ── {label} ──
    </p>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "32px 5vw", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.25)" }}>
        Built with React · <span style={{ color: "#00E5BE" }}>Vrunda Prajapati</span> © {new Date().getFullYear()}
      </p>
    </footer>
  );
}

// ── App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = NAV.map(n => document.getElementById(n.toLowerCase()));
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.4 });
    sections.forEach(s => s && obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: "#0A0E1B", minHeight: "100vh", color: "#fff" }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #0A0E1B; }
        ::placeholder { color: rgba(255,255,255,0.25) !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-18px); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0A0E1B; }
        ::-webkit-scrollbar-thumb { background: rgba(0,229,190,0.3); border-radius: 3px; }
      `}</style>
      <NavBar active={activeSection} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}
