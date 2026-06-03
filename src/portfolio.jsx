import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { GraduationCap, Monitor, Rocket, Leaf } from "lucide-react";

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
        if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), pause);
        else setCharIdx(c => c + 1);
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) { setDeleting(false); setWordIdx(i => (i + 1) % words.length); setCharIdx(0); }
        else setCharIdx(c => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
  return display;
}

function useVisible(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const SKILLS = {
  Frontend: [{ name: "React", level: 60 }, { name: "HTML / CSS", level: 90 }, { name: "JavaScript", level: 70 }],
  Backend:  [{ name: "Python", level: 85 }, { name: "Java", level: 65 }, { name: "Node.js", level: 50 }],
  Tools:    [{ name: "Git / GitHub", level: 85 }, { name: "VS Code", level: 90 }, { name: "MySQL", level: 75 }],
};

const PROJECTS = [
  { title: "Skillify", emoji: "🚀", desc: "A full-stack skill-sharing and learning platform where users can post skills they offer, browse what others teach, and connect for peer-to-peer learning. Built with a Java backend and React frontend.", tech: ["HTML / CSS", "JavaScript", "Node.js", "MySQL", "Netlify"], github: "https://github.com/vrunda-prajapati/Skillify-SkillExchangePlatform.git", live: null, highlight: true },
  { title: "Portfolio Website", emoji: "💻", desc: "A modern, responsive portfolio website showcasing my projects and skills. Built with React and styled-components.", tech: ["React.Js", "EmailJS", "Vercel"], github: "https://github.com/vrunda-prajapati/my-portfolio.git", live: null, highlight: false },
];

const NAV = ["Home", "About", "Skills", "Projects", "Contact"];

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; -webkit-text-size-adjust:100%; }
  body { background:#0A0E1B; overflow-x:hidden; }
  img  { max-width:100%; display:block; }
  ::placeholder { color:rgba(255,255,255,0.25)!important; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:#0A0E1B; }
  ::-webkit-scrollbar-thumb { background:rgba(0,229,190,0.3); border-radius:3px; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }
  @keyframes float    { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-16px);} }
  @keyframes blink    { 0%,100%{opacity:1;} 50%{opacity:0;} }
  @keyframes spinRing { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
  @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.6;transform:scale(1.3);} }

  .desktop-nav { display:flex; }
  .hamburger   { display:none!important; }

  .hero-grid {
    display:grid;
    grid-template-columns:1fr auto;
    gap:60px;
    align-items:center;
    width:100%;
    max-width:1100px;
    z-index:1;
  }
  .photo-circle { position:relative; width:280px; height:280px; flex-shrink:0; }

  .about-inner { display:grid; grid-template-columns:1fr; gap:56px; align-items:center; }
  .about-photo-box { width:200px; height:200px; position:relative; flex-shrink:0; }
  .about-cards { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

  .skills-grid   { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
  .projects-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:24px; }
  .social-row    { display:flex; justify-content:center; gap:16px; flex-wrap:wrap; }

  /* ── TABLET 900px ── */
  @media(max-width:900px){
    .hero-grid  { gap:40px; }
    .photo-circle { width:220px!important; height:220px!important; }
    .skills-grid  { grid-template-columns:repeat(2,1fr); }
    .projects-grid{ grid-template-columns:1fr; }
    .about-inner  { gap:36px; }
  }

  /* ── MOBILE 768px ── */
  @media(max-width:768px){
    .desktop-nav { display:none!important; }
    .hamburger   { display:flex!important; }
    .about-inner { grid-template-columns:1fr!important; }

    .hero-grid {
      grid-template-columns:1fr!important;
      text-align:center;
      gap:32px;
      padding-top:80px;
    }
    .hero-text p, .hero-text h1, .hero-text div { text-align:center; }
    .hero-photo-wrap { order:-1; }
    .photo-circle { width:185px!important; height:185px!important; }
    .hero-btns { justify-content:center!important; }

    .about-inner { grid-template-columns:1fr!important; gap:24px; text-align:center; }
    .about-photo-col { align-items:center!important; }
    .about-photo-box { width:160px!important; height:160px!important; }
    .about-cards { grid-template-columns:1fr 1fr; }

    .skills-grid   { grid-template-columns:1fr; }
    .projects-grid { grid-template-columns:1fr; }
    .social-row    { gap:10px; }
  }

  /* ── SMALL PHONE 480px ── */
  @media(max-width:480px){
    .photo-circle    { width:155px!important; height:155px!important; }
    .about-photo-box { width:130px!important; height:130px!important; }
    .about-cards     { grid-template-columns:1fr!important; }
    .hero-btns       { flex-direction:column!important; align-items:stretch!important; }
    .hero-btns > *   { text-align:center!important; justify-content:center!important; }
    .social-row a    { padding:10px 14px!important; font-size:13px!important; }
  }

  /* ── LARGE 1400px ── */
  @media(min-width:1400px){
    .hero-grid    { max-width:1280px; gap:80px; }
    .photo-circle { width:330px!important; height:330px!important; }
  }
`;

/* ── NavBar ─────────────────────────────────────────────────────────── */
function NavBar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const scrollTo = id => { document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior:"smooth" }); setMenuOpen(false); };

  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:scrolled?"rgba(10,14,27,0.95)":"transparent", backdropFilter:scrolled?"blur(14px)":"none", borderBottom:scrolled?"1px solid rgba(0,229,190,0.12)":"none", transition:"all 0.4s ease", padding:"0 5vw" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, cursor:"pointer" }} onClick={() => scrollTo("Home")}>
          <span style={{ color:"#00E5BE" }}>Vrunda</span><span style={{ color:"#fff" }}>.</span>
        </span>
        <ul className="desktop-nav" style={{ gap:32, listStyle:"none" }}>
          {NAV.map(n => (
            <li key={n}>
              <button onClick={() => scrollTo(n)} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:500, color:active===n.toLowerCase()?"#00E5BE":"rgba(255,255,255,0.7)", letterSpacing:0.5, padding:"4px 0", borderBottom:active===n.toLowerCase()?"2px solid #00E5BE":"2px solid transparent", transition:"all 0.2s" }}>{n}</button>
            </li>
          ))}
        </ul>
        <button onClick={() => setMenuOpen(m => !m)} className="hamburger" style={{ background:"none", border:"none", cursor:"pointer", flexDirection:"column", gap:5 }}>
          {[0,1,2].map(i => <span key={i} style={{ display:"block", width:24, height:2, background:"#00E5BE", borderRadius:2, opacity:menuOpen&&i===1?0:1, transition:"all 0.3s" }} />)}
        </button>
      </div>
      {menuOpen && (
        <div style={{ background:"rgba(10,14,27,0.98)", padding:"12px 5vw 20px", borderTop:"1px solid rgba(0,229,190,0.1)" }}>
          {NAV.map(n => <button key={n} onClick={() => scrollTo(n)} style={{ display:"block", width:"100%", textAlign:"left", background:"none", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:16, color:active===n.toLowerCase()?"#00E5BE":"rgba(255,255,255,0.85)", padding:"13px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>{n}</button>)}
        </div>
      )}
    </nav>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────── */
function Hero() {
  const typed = useTyping(["Computer Engineering Student.", "Full-Stack Developer.", "Problem Solver.", "Builder of Skillify."]);
  return (
    <section id="home" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 5vw", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(circle at 20% 50%,rgba(0,229,190,0.07) 0%,transparent 55%),radial-gradient(circle at 80% 20%,rgba(99,102,241,0.08) 0%,transparent 50%),linear-gradient(rgba(0,229,190,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,190,0.04) 1px,transparent 1px)`, backgroundSize:"auto,auto,60px 60px,60px 60px", zIndex:0 }} />
      <div style={{ position:"absolute", top:"15%", left:"8%", width:"min(300px,35vw)", height:"min(300px,35vw)", borderRadius:"50%", background:"radial-gradient(circle,rgba(0,229,190,0.1) 0%,transparent 70%)", zIndex:0, animation:"float 6s ease-in-out infinite" }} />
      <div style={{ position:"absolute", bottom:"15%", right:"8%", width:"min(240px,28vw)", height:"min(240px,28vw)", borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)", zIndex:0, animation:"float 8s ease-in-out infinite reverse" }} />

      <div className="hero-grid" style={{ animation:"fadeUp 0.9s ease both" }}>
        {/* Text  */}
        <div className="hero-text">
          <p style={{ fontFamily:"'DM Mono',monospace", color:"#00E5BE", fontSize:"clamp(11px,1.5vw,13px)", letterSpacing:3, textTransform:"uppercase", marginBottom:20, opacity:0.9 }}>👋 Hello, I'm</p>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(2rem,5.5vw,4.8rem)", fontWeight:800, color:"#fff", lineHeight:1.1, marginBottom:16, letterSpacing:-1 }}>Vrunda Prajapati</h1>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(1rem,2.5vw,1.4rem)", color:"rgba(255,255,255,0.55)", marginBottom:22, minHeight:40 }}>
            <span style={{ color:"#00E5BE", fontWeight:600 }}>{typed}</span>
            <span style={{ color:"#00E5BE", animation:"blink 1s step-end infinite" }}>|</span>
          </div>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(14px,1.8vw,16px)", color:"rgba(255,255,255,0.6)", lineHeight:1.85, maxWidth:520, marginBottom:34 }}>
            I build clean, functional software — from full-stack web apps to desktop tools. Currently focused on <span style={{ color:"#fff", fontWeight:600 }}>Skillify</span>, a peer-to-peer skill-sharing platform.
          </p>
          <div className="hero-btns" style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior:"smooth" })} style={{ padding:"13px 28px", background:"#00E5BE", color:"#0A0E1B", border:"none", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:15, cursor:"pointer", boxShadow:"0 0 24px rgba(0,229,190,0.35)", transition:"all 0.25s", letterSpacing:0.4 }}
              onMouseEnter={e => { e.target.style.background="#00c9a8"; e.target.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.background="#00E5BE"; e.target.style.transform="translateY(0)"; }}
            >View Projects →</button>
            <a href="/My-Resume.pdf" download="My-Resume.pdf" style={{ padding:"13px 28px", background:"transparent", color:"#00E5BE", border:"2px solid rgba(0,229,190,0.4)", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, textDecoration:"none", display:"inline-block", transition:"all 0.25s", letterSpacing:0.4 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#00E5BE"; e.currentTarget.style.background="rgba(0,229,190,0.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(0,229,190,0.4)"; e.currentTarget.style.background="transparent"; }}
            >↓ Resume</a>
          </div>
        </div>

        {/* Photo */}
        <div className="hero-photo-wrap" style={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
          <div className="photo-circle">
            <div style={{ position:"absolute", inset:-22, borderRadius:"50%", border:"1px solid rgba(0,229,190,0.12)" }} />
            <div style={{ position:"absolute", inset:-14, borderRadius:"50%", border:"1px solid rgba(0,229,190,0.18)" }} />
            <div style={{ position:"absolute", inset:-6, borderRadius:"50%", border:"2px solid transparent", borderTop:"2px solid #00E5BE", borderRight:"2px solid #00E5BE", animation:"spinRing 10s linear infinite", filter:"drop-shadow(0 0 6px #00E5BE)" }} />
            <div style={{ position:"absolute", inset:-3, borderRadius:"50%", background:"conic-gradient(#00E5BE 0deg,#6366f1 120deg,#00E5BE 240deg,#0A0E1B 241deg,#0A0E1B 360deg)", animation:"spinRing 10s linear infinite reverse", padding:3 }}>
              <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:"#0A0E1B" }} />
            </div>
            <div style={{ position:"absolute", inset:0, borderRadius:"50%", boxShadow:"0 0 30px rgba(0,229,190,0.3),0 0 60px rgba(0,229,190,0.1)", zIndex:2, pointerEvents:"none" }} />
            <img src="myPhoto.jpeg" alt="Vrunda Prajapati" style={{ position:"absolute", inset:4, width:"calc(100% - 8px)", height:"calc(100% - 8px)", borderRadius:"50%", objectFit:"cover", objectPosition:"top", zIndex:1 }}
              onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }} />
            <div style={{ position:"absolute", inset:4, width:"calc(100% - 8px)", height:"calc(100% - 8px)", borderRadius:"50%", background:"linear-gradient(135deg,rgba(0,229,190,0.15),rgba(99,102,241,0.15))", zIndex:1, display:"none", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:64, color:"#00E5BE" }}>VP</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── About ──────────────────────────────────────────────────────────── */

function About() {
  const [ref, visible] = useVisible();
  return (
    <section id="about" ref={ref} style={{ padding:"80px 5vw" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionLabel label="About Me" />
        <div style={{
          display:"grid", gridTemplateColumns:"1fr 1fr", gap:"60px", alignItems:"center",
          opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(40px)", transition:"all 0.7s ease",
        }} className="about-inner">

          {/* Left: Text */}
          <div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.8rem,3.5vw,3rem)", fontWeight:800, color:"#fff", marginBottom:24, lineHeight:1.15 }}>
              Building things that <span style={{ color:"#00E5BE" }}>matter.</span>
            </h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(14px,1.6vw,16px)", color:"rgba(255,255,255,0.6)", lineHeight:1.95, marginBottom:16 }}>
              I'm a Computer Engineering student with a passion for building software that solves real problems. I love working across the full stack — designing intuitive UIs and architecting solid backends.
            </p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(14px,1.6vw,16px)", color:"rgba(255,255,255,0.6)", lineHeight:1.95 }}>
              My current focus is <span style={{ color:"#00E5BE", fontWeight:600 }}>Skillify</span> — a platform where people can share and learn skills from each other. I believe technology should connect people and make learning more accessible.
            </p>
          </div>

          {/* Right: 2x2 icon cards */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {[
              { icon: GraduationCap, label:"Student",  desc:"Computer Engineering" },
              { icon: Monitor,       label:"Dev",       desc:"Full-Stack"           },
              { icon: Rocket,        label:"Builder",   desc:"Skillify & more"      },
              { icon: Leaf,          label:"Learning",  desc:"Every single day"     },
            ].map((c, i) => (
              <div key={c.label} style={{
                background:"rgba(255,255,255,0.03)",
                border:"1px solid rgba(255,255,255,0.07)",
                borderRadius:16, padding:"28px 20px",
                display:"flex", flexDirection:"column", alignItems:"center",
                gap:14, textAlign:"center", cursor:"default",
                transition:"all 0.3s",
                opacity:visible?1:0,
                transform:visible?"translateY(0)":"translateY(20px)",
                transitionDelay:`${0.1 + i * 0.1}s`,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor="rgba(0,229,190,0.35)";
                  e.currentTarget.style.background="rgba(0,229,190,0.05)";
                  e.currentTarget.style.transform="translateY(-4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";
                  e.currentTarget.style.background="rgba(255,255,255,0.03)";
                  e.currentTarget.style.transform="translateY(0)";
                }}
              >
                <div style={{
                  width:52, height:52, borderRadius:14,
                  background:"rgba(0,229,190,0.1)",
                  border:"1px solid rgba(0,229,190,0.2)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <c.icon size={24} color="#00E5BE" strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#fff", fontSize:15, marginBottom:4 }}>{c.label}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", color:"rgba(255,255,255,0.45)", fontSize:13 }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ── Skills ─────────────────────────────────────────────────────────── */
function Skills() {
  const [ref, visible] = useVisible();
  return (
    <section id="skills" ref={ref} style={{ padding:"80px 5vw", background:"rgba(255,255,255,0.015)", borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionLabel label="Skills" />
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.5rem,3.5vw,2.6rem)", fontWeight:800, color:"#fff", marginBottom:36, textAlign:"center" }}>My Tech Stack</h2>
        <div className="skills-grid">
          {Object.entries(SKILLS).map(([cat,items],ci) => (
            <div key={cat} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"22px", opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(40px)", transition:`all 0.6s ease ${ci*0.15}s` }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#00E5BE", fontSize:12, textTransform:"uppercase", letterSpacing:2, marginBottom:20 }}>{cat}</h3>
              {items.map((sk,si) => (
                <div key={sk.name} style={{ marginBottom:si<items.length-1?17:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", color:"rgba(255,255,255,0.8)", fontSize:14, fontWeight:500 }}>{sk.name}</span>
                    <span style={{ fontFamily:"'DM Mono',monospace", color:"#00E5BE", fontSize:12 }}>{sk.level}%</span>
                  </div>
                  <div style={{ height:5, background:"rgba(255,255,255,0.08)", borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", borderRadius:3, background:"linear-gradient(90deg,#00E5BE,#6366f1)", width:visible?`${sk.level}%`:"0%", transition:`width 1s ease ${ci*0.15+si*0.1+0.2}s` }} />
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

/* ── Projects ───────────────────────────────────────────────────────── */
function Projects() {
  const [ref, visible] = useVisible();
  return (
    <section id="projects" ref={ref} style={{ padding:"80px 5vw" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionLabel label="Projects" />
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.5rem,3.5vw,2.6rem)", fontWeight:800, color:"#fff", marginBottom:36, textAlign:"center" }}>What I've Built</h2>
        <div className="projects-grid">
          {PROJECTS.map((p,i) => (
            <div key={p.title} style={{ background:p.highlight?"linear-gradient(135deg,rgba(0,229,190,0.06),rgba(99,102,241,0.06))":"rgba(255,255,255,0.03)", border:p.highlight?"1px solid rgba(0,229,190,0.25)":"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"26px", position:"relative", overflow:"hidden", opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(40px)", transition:`all 0.6s ease ${i*0.15}s`, display:"flex", flexDirection:"column" }}>
              {p.highlight && <span style={{ position:"absolute", top:14, right:14, background:"rgba(0,229,190,0.15)", color:"#00E5BE", fontFamily:"'DM Mono',monospace", fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", padding:"4px 10px", borderRadius:20, border:"1px solid rgba(0,229,190,0.25)" }}>Featured</span>}
              <div style={{ fontSize:32, marginBottom:12 }}>{p.emoji}</div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(17px,2vw,22px)", color:"#fff", marginBottom:10 }}>{p.title}</h3>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"rgba(255,255,255,0.55)", lineHeight:1.8, marginBottom:16, flexGrow:1 }}>{p.desc}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:18 }}>
                {p.tech.map(t => <span key={t} style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#00E5BE", background:"rgba(0,229,190,0.08)", border:"1px solid rgba(0,229,190,0.2)", padding:"3px 10px", borderRadius:4, letterSpacing:0.5 }}>{t}</span>)}
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <a href={p.github} target="_blank" rel="noreferrer" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:"#fff", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", padding:"8px 16px", borderRadius:7, textDecoration:"none", transition:"all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.13)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.07)"; }}>⬡ GitHub</a>
                {p.live && <a href={p.live} target="_blank" rel="noreferrer" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:"#0A0E1B", background:"#00E5BE", border:"none", padding:"8px 16px", borderRadius:7, textDecoration:"none" }}>↗ Live Demo</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Contact ───────────────────────────────────────────────────────── */
function Contact() {
  const [ref, visible] = useVisible();
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [status, setStatus] = useState("idle");

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    emailjs.send("service_abta52t","template_q1psh0p",{ from_name:form.name, from_email:form.email, message:form.message },"2zIzI9YhXvsL2lo8W")
      .then(() => { setStatus("success"); setForm({ name:"", email:"", message:"" }); })
      .catch(err => { console.log("EmailJS Error:", err); setStatus("error"); });
  };

  return (
    <section id="contact" ref={ref} style={{ padding:"80px 5vw", background:"rgba(255,255,255,0.015)", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth:660, margin:"0 auto" }}>
        <SectionLabel label="Contact" />
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.5rem,3.5vw,2.6rem)", fontWeight:800, color:"#fff", marginBottom:10, textAlign:"center", opacity:visible?1:0, transition:"all 0.5s ease" }}>Let's Work Together</h2>
        <p style={{ fontFamily:"'DM Sans',sans-serif", color:"rgba(255,255,255,0.5)", fontSize:15, textAlign:"center", marginBottom:36, opacity:visible?1:0, transition:"all 0.5s ease 0.1s" }}>Open to internships, collaborations, and interesting projects.</p>
        <div className="social-row" style={{ marginBottom:36, opacity:visible?1:0, transition:"all 0.5s ease 0.2s" }}>
          {[{icon:"✉️",label:"Email",href:"mailto:vrundaprajapati0204@gmail.com"},{icon:"💼",label:"LinkedIn",href:"https://www.linkedin.com/in/vrunda-prajapati-0b3b4b31b/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BHvjCYELvS2mfjennD56hOA%3D%3D"},{icon:"🐙",label:"GitHub",href:"https://github.com/vrunda-prajapati"}].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:8, fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14, color:"rgba(255,255,255,0.75)", textDecoration:"none", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", padding:"11px 18px", borderRadius:10, transition:"all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(0,229,190,0.35)"; e.currentTarget.style.color="#00E5BE"; e.currentTarget.style.background="rgba(0,229,190,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.09)"; e.currentTarget.style.color="rgba(255,255,255,0.75)"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}>
              <span>{s.icon}</span>{s.label}
            </a>
          ))}
        </div>
        {status === "success" ? (
          <div style={{ textAlign:"center", padding:"34px 24px", background:"rgba(0,229,190,0.07)", border:"1px solid rgba(0,229,190,0.25)", borderRadius:16 }}>
            <div style={{ fontSize:40, marginBottom:10 }}>🎉</div>
            <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"#00E5BE" }}>Message sent!</p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", color:"rgba(255,255,255,0.5)", fontSize:14, marginTop:6 }}>I'll get back to you soon.</p>
            <button onClick={() => setStatus("idle")} style={{ marginTop:16, background:"none", border:"1px solid rgba(0,229,190,0.3)", color:"#00E5BE", borderRadius:8, padding:"8px 20px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:13 }}>Send another</button>
          </div>
        ) : (
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"26px", opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(30px)", transition:"all 0.6s ease 0.3s" }}>
            {[{key:"name",label:"Your Name",type:"text",placeholder:"John Doe"},{key:"email",label:"Email Address",type:"email",placeholder:"john@example.com"}].map(f => (
              <div key={f.key} style={{ marginBottom:16 }}>
                <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(255,255,255,0.5)", display:"block", marginBottom:7, fontWeight:500 }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({...p,[f.key]:e.target.value}))}
                  style={{ width:"100%", padding:"12px 14px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:"none", boxSizing:"border-box", transition:"border 0.2s" }}
                  onFocus={e => e.target.style.borderColor="rgba(0,229,190,0.5)"}
                  onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"} />
              </div>
            ))}
            <div style={{ marginBottom:20 }}>
              <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(255,255,255,0.5)", display:"block", marginBottom:7, fontWeight:500 }}>Message</label>
              <textarea rows={4} placeholder="Hey! I'd love to collaborate on..." value={form.message} onChange={e => setForm(p => ({...p,message:e.target.value}))}
                style={{ width:"100%", padding:"12px 14px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:"none", resize:"vertical", boxSizing:"border-box", transition:"border 0.2s" }}
                onFocus={e => e.target.style.borderColor="rgba(0,229,190,0.5)"}
                onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"} />
            </div>
            {status==="error" && <p style={{ fontFamily:"'DM Sans',sans-serif", color:"#ff6b6b", fontSize:13, marginBottom:14, textAlign:"center" }}>⚠️ Something went wrong. Please try again or email me directly.</p>}
            <button onClick={handleSubmit} disabled={status==="sending"} style={{ width:"100%", padding:"14px", background:status==="sending"?"rgba(0,229,190,0.5)":"#00E5BE", color:"#0A0E1B", border:"none", borderRadius:8, fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, cursor:status==="sending"?"not-allowed":"pointer", transition:"all 0.25s" }}
              onMouseEnter={e => { if(status!=="sending"){ e.target.style.background="#00c9a8"; e.target.style.boxShadow="0 0 24px rgba(0,229,190,0.3)"; }}}
              onMouseLeave={e => { e.target.style.background=status==="sending"?"rgba(0,229,190,0.5)":"#00E5BE"; e.target.style.boxShadow="none"; }}>
              {status==="sending"?"Sending...":"Send Message →"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function SectionLabel({ label }) {
  return <p style={{ fontFamily:"'DM Mono',monospace", color:"#00E5BE", fontSize:11, letterSpacing:4, textTransform:"uppercase", marginBottom:10, textAlign:"center", opacity:0.8 }}>── {label} ──</p>;
}

function Footer() {
  return (
    <footer style={{ padding:"26px 5vw", textAlign:"center", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(255,255,255,0.25)" }}>
        Built with React · <span style={{ color:"#00E5BE" }}>Vrunda Prajapati</span> © {new Date().getFullYear()}
      </p>
    </footer>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  useEffect(() => {
    const sections = NAV.map(n => document.getElementById(n.toLowerCase()));
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold:0.3 });
    sections.forEach(s => s && obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background:"#0A0E1B", minHeight:"100vh", color:"#fff" }}>
      <style>{GLOBAL_CSS}</style>
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
