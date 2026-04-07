"use client";

import { useState, useEffect } from "react";
import {
  Film, Code2, Wifi, Car, Smartphone, Globe,
  Github, Mail, ExternalLink, ChevronRight,
  Layers, Zap, Monitor, Coffee, Camera, Network,
  Radio, Cpu, Eye, BrainCircuit, Server, MessageCircle
} from "lucide-react";

// ── SKILLS DATA ───────────────────────────────────────────────────────────────

const SKILL_GROUPS = [
  {
    label: "Streaming & Distribution",
    icon: Radio,
    color: "cyan",
    items: ["HLS", "SRT", "WebRTC", "NDI Access Manager", "NDI Bridge", "Tailscale VPN", "ngrok", "Port Forwarding"],
  },
  {
    label: "Broadcast Software",
    icon: Monitor,
    color: "orange",
    items: ["vMix", "OBS Studio", "Wirecast", "Adobe Premiere Pro", "Resolume Arena"],
  },
  {
    label: "Étalonnage & Scopes",
    icon: Eye,
    color: "purple",
    items: ["DaVinci Resolve", "Waveform", "Vectorscope", "Parade Scope", "Étalonnage professionnel"],
  },
  {
    label: "Caméras & Systèmes",
    icon: Camera,
    color: "orange",
    items: ["Sony Alpha", "Sony XD Cameras", "Caméras PTZ", "NDI Camera Control"],
  },
  {
    label: "Réseau & Infrastructure",
    icon: Network,
    color: "cyan",
    items: ["IP statique", "Passerelle / Masque", "DNS public", "Câblage réseau", "Régie informatique", "Maintenance"],
  },
  {
    label: "Développement",
    icon: Code2,
    color: "purple",
    items: ["Flutter / Dart", "NDI SDK (iOS/Android/PC)", "Next.js", "TypeScript", "Firebase", "C++ NDK", "OBD-II KWP2000"],
  },
  {
    label: "IA & Outils Créatifs",
    icon: BrainCircuit,
    color: "cyan",
    items: ["Claude AI", "VS Code", "Prompt Engineering", "Génération photo/vidéo", "Veo 3", "LLM Workflows"],
  },
];

// ── PROJECTS DATA ─────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: "mimo-ndi-ios",
    title: "MIMO NDI — iOS App",
    subtitle: "Source NDI Broadcast Professionnelle",
    description:
      "Application iOS transformant un iPhone en source NDI pour OBS, vMix et Wirecast. Intègre le NDI SDK natif pour streaming zéro-latence vers toute régie broadcast. Déployée en conditions réelles à Echorouk TV.",
    tech: ["Flutter", "NDI SDK", "iOS", "Swift", "C++ NDK"],
    badge: "Broadcast",
    badgeColor: "orange" as const,
    icon: Monitor,
    gradient: "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(251,191,36,0.08))",
    border: "rgba(255,107,53,0.3)",
    files: ["Capture NDI", "Latency control", "Remote monitor", "Rec/Streaming"],
    videos: [
      { src: "/videos/ios-1.mp4", filter: "none" },
    ],
    localRoute: "/code/mimo-ndi-ios",
  },
  {
    id: "ptz-dashboard",
    title: "PTZ Remote Dashboard",
    subtitle: "Contrôle PTZ via Tailscale Tunnel",
    description:
      "Dashboard iPhone complet pour réception et pilotage d'une caméra PTZ à distance. Flux NDI → HLS avec segmentation (~3s latence fluide) ou WebRTC quasi-temps-réel. Les opérateurs accèdent via un lien Tailscale Funnel sans être sur le réseau. Contrôles directionnels (gauche/droite/haut/bas) intégrés dans le même dashboard.",
    tech: ["Flutter", "HLS", "WebRTC", "NDI", "Tailscale", "HLS Segmentation"],
    badge: "Remote Control",
    badgeColor: "cyan" as const,
    icon: Camera,
    gradient: "linear-gradient(135deg, rgba(0,229,255,0.12), rgba(0,145,234,0.06))",
    border: "rgba(0,229,255,0.3)",
    files: ["PTZ Controls (↑↓←→)", "HLS Player", "WebRTC Stream", "Tailscale Funnel"],
    image: "/images/stm32-board.png", // Use board as fallback for now
    github: "https://github.com/djenadimohamedamine-code",
  },
  {
    id: "ndi-vision",
    title: "NDI Vision — PC App",
    subtitle: "Tracking IA & Surveillance Flou",
    description:
      "Surveillance multi-caméras NDI avec analyse temps réel. Détection automatique du flou (mise au point), de la surexposition et tracking de mouvement. Indispensable pour maintenir une qualité broadcast constante en régie.",
    tech: ["NDI SDK", "OpenCV", "AI Tracking", "Python/C++"],
    badge: "IA Vision",
    badgeColor: "purple" as const,
    icon: Eye,
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.06))",
    border: "rgba(139,92,246,0.3)",
    files: ["AI Blur Detection", "Overexposure Alert", "NDI Monitor"],
    video: "/videos/ndi-vision.mp4",
    github: "https://github.com/djenadimohamedamine-code",
  },
  {
    id: "mimo-spark",
    title: "Mimo OBD-II Dashboard",
    subtitle: "Diagnostic Automobile Android",
    description:
      "Application Android universelle de diagnostic OBD-II. Dashboard temps réel : RPM, vitesse, température, carburant. Scanner DTC avancé, calcul de vitesse par rapport de boîte, intégration GPS et historique des pannes.",
    tech: ["Flutter", "OBD-II", "KWP2000", "ELM327", "GPS", "Firebase"],
    badge: "Automotive",
    badgeColor: "orange" as const,
    icon: Car,
    gradient: "linear-gradient(135deg, rgba(255,107,53,0.1), rgba(251,191,36,0.06))",
    border: "rgba(255,107,53,0.25)",
    files: ["obd_service.dart", "dtc_scanner.dart", "dashboard.dart", "diagnostic.dart", "map_page.dart"],
    localRoute: "/code/mimo-spark",
    videos: [
      { src: "/videos/obd-spark-1.mp4", filter: "none" },
    ],
  },
  {
    id: "booking-system",
    title: "Site Web & Réservation en Ligne",
    subtitle: "Création de Site Web & Système de Réservation",
    description:
      "Création complète d'un site web haut de gamme avec système de réservation à créneaux en temps réel. Les clients réservent en ligne en quelques clics et reçoivent une confirmation instantanée. L'équipe reçoit une notification WhatsApp automatique avec les détails du rendez-vous — une expérience premium qui attire et fidélise les clients.",
    tech: ["Next.js", "Firebase", "TypeScript", "PWA", "WhatsApp API", "Vercel"],
    badge: "Web App",
    badgeColor: "purple" as const,
    icon: Globe,
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.04))",
    border: "rgba(139,92,246,0.25)",
    files: ["bookings.ts", "admin/page.tsx", "notifications-func.js"],
    localRoute: "/code/booking-system",
  },
  {
    id: "stm32-robot",
    title: "STM32 Robot 4WD",
    subtitle: "Robotique Embarquée & Contrôle Moteur",
    description:
      "Conception et programmation d'un robot autonome 4 roues motrices sur châssis mécanique. Contrôle de deux moteurs DC via le driver L298N avec gestion PWM (vitesse) et logique de direction. Programmation embarquée en C++ sur microcontrôleur STM32 via Arduino IDE. Intégration du contrôle LED et architecture modulaire des fonctions de déplacement (avancer, reculer, tourner, arrêt d'urgence).",
    tech: ["STM32", "L298N", "C++", "Arduino IDE", "PWM", "Embedded"],
    badge: "Robotique",
    badgeColor: "orange" as const,
    icon: Cpu,
    gradient: "linear-gradient(135deg, rgba(255,107,53,0.12), rgba(251,191,36,0.08))",
    border: "rgba(255,107,53,0.3)",
    files: ["robot_move.cpp", "motor_control.h", "led_control.cpp", "main.cpp"],
    github: "https://github.com/djenadimohamedamine-code",
    videos: [
      { src: "/videos/FINAL_REEL_ARDUINO.mp4", filter: "none" },
    ],
  },
  {
    id: "veo-project",
    title: "Veo 3 AI Video Generation",
    subtitle: "Génération de séquences génératives photoréalistes",
    description:
      "Production experte de vidéos cinématographiques assistée par l'Intelligence Artificielle Veo 3. Maîtrise des workflows de prompt engineering appliqués au mouvement, à la cohérence temporelle et à l'intégration dans des flux broadcast.",
    tech: ["AI Video", "Veo3", "Prompt Engineering"],
    badge: "AI Video",
    badgeColor: "cyan" as const,
    icon: Film,
    gradient: "linear-gradient(135deg, rgba(0,242,255,0.08), rgba(236,72,153,0.04))",
    border: "rgba(0,242,255,0.3)",
    files: ["Directing Prompt", "Camera Motion", "Video Render"],
    videos: [
      { src: "/videos/veo-1.mp4", filter: "none" },
      { src: "/videos/veo-2.mp4", filter: "none" },
      { src: "/videos/veo-3.mp4", filter: "none" },
    ],
  },
  {
    id: "nano-banana",
    title: "Nano Banana Photo IA",
    subtitle: "Génération & Traitement d'Image 4K",
    description:
      "Création visuelle assistée par Intelligence Artificielle. Architecture de prompts avancés et techniques d'upscaling haute fidélité. Création de milliers de rendus 4K exploitables pour la production télévisuelle.",
    tech: ["AI Image", "Upscaling 4K", "Midjourney"],
    badge: "AI Art",
    badgeColor: "purple" as const,
    icon: BrainCircuit,
    gradient: "linear-gradient(135deg, rgba(167,139,250,0.1), rgba(236,72,153,0.06))",
    border: "rgba(167,139,250,0.3)",
    files: ["Prompt design", "Upscale config", "4K Render"],
    image: "/images/nano-banana.jpg",
    gallery: [
      "/gallery/f7c27adf-20ec-4825-a9c2-5483b165c78d.png",
      "/gallery/1770829759726-019c4da9-425a-7de9-b041-1dfab2b5b693.png",
      "/gallery/1770494942991-019c39b8-66c3-7d59-87f2-a8e255e64f6a.png",
      "/gallery/1770494602576-019c39b3-4975-7cbc-9875-a98641bc8378.png",
      "/gallery/1770494329604-019c39af-20ef-7026-82fe-d99ee27b3800.jpeg",
      "/gallery/1770404915113-019c3459-eda0-745f-97e0-bfa68ff97ff6.png",
      "/gallery/1770395400252-019c33c9-1a5c-795c-a937-357c07505eb1.jpeg",
      "/gallery/1770233731520-019c2a25-e82f-7980-a4a3-4edeb89bbb28.png",
      "/gallery/1770232087866-019c2a0c-d577-7bf1-8e4f-1c24ae306866.png",
      "/gallery/1770232052294-019c2a0c-d577-774f-a989-2b411ce99229.png",
      "/gallery/1770209441695-019c28b3-9c3d-7ec2-a767-f53d1e912844.png",
      "/gallery/1770208693846-019c28a8-df39-7d80-8aa4-08f3dd7eed1c.png",
      "/gallery/1770208593958-019c28a7-2d34-7cb3-98eb-3b7de8ede7ab.png",
      "/gallery/1770208584914-019c28a7-2d35-75a1-842f-54e58e484af8.png",
      "/gallery/1770208055577-019c289f-35fc-7660-97bb-26943eb529da.jpeg",
    ],
  },
  {
    id: "antigravity-ai",
    title: "AI-Driven Development (Antigravity)",
    subtitle: "Programmation assistée par Agent IA",
    description:
      "Expertise en développement 'AI-Native'. Utilisation d'Antigravity pour accélérer le prototypage, sécuriser le code et concevoir des architectures complexes en un temps record. Une symbiose entre ingénierie humaine et intelligence artificielle.",
    tech: ["Antigravity AI", "System Prompts", "Code Orchestration", "Next.js"],
    badge: "AI Coding",
    badgeColor: "cyan" as const,
    icon: MessageCircle,
    gradient: "linear-gradient(135deg, rgba(0,242,255,0.08), rgba(167,139,250,0.04))",
    border: "rgba(0,242,255,0.25)",
    files: ["Workflow.md", "AgentConfig.json", "SystemPrompt.txt"],
    image: "/images/antigravity.png",
  },
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [typed, setTyped] = useState("");
  const [currentVideoIndices, setCurrentVideoIndices] = useState<Record<string, number>>(
    Object.fromEntries(PROJECTS.map((p) => [p.id, 0]))
  );
  const fullText = "Broadcast Engineer & Developer";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setTyped(fullText.slice(0, i + 1));
        i++;
        if (i >= fullText.length) clearInterval(interval);
      }, 55);
      return () => clearInterval(interval);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const colorMap: Record<string, string> = {
    cyan: "var(--accent-cyan)",
    orange: "var(--accent-orange)",
    purple: "var(--accent-purple)",
  };

  return (
    <>
      <div className="glow glow-1" />
      <div className="glow glow-2" />
      <div className="glow glow-3" />

      {/* ── SYSTEM STATUS BAR ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '28px',
        background: 'rgba(3,5,10,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.25rem', fontSize: '0.6rem', fontFamily: 'monospace',
        color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.03)', padding: '0.15rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="heartbeat-dot" />
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>LIVE_SYSTEM_ACTIVE</span>
          </div>
          <span>Uptime: 99.9%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span className="hide-mobile">MIMO-NDI // BROADCAST_ENGINE_v4.5</span>
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`} style={{ top: '28px' }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.01em" }}>
            <span style={{ color: "var(--accent-cyan)" }}>MIMO</span>
            <span style={{ color: "var(--text-secondary)" }}>-</span>
            <span>NDI</span>
          </span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[
              { label: "Compétences", href: "#competences" },
              { label: "Projets", href: "#projets" },
              { label: "Contact", href: "#contact" },
            ].map((link) => (
              <a key={link.label} href={link.href}
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)", transition: "color 0.2s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: "6rem", position: "relative" }}>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>

          {/* Company badge */}
          <div className="animate-up" style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "2rem" }}>
            <span className="badge badge-cyan" style={{ border: '1px solid var(--accent-cyan)', background: 'rgba(0,242,255,0.05)' }}>
              <Zap size={12} fill="currentColor" />
              Available for Production
            </span>
            <span className="badge badge-orange" style={{ opacity: 0.8 }}>
              Echorouk TV
            </span>
          </div>

          {/* Name */}
          <h1 className="animate-up-2" style={{ fontSize: "clamp(2.2rem, 7vw, 4rem)", marginBottom: "0.75rem", letterSpacing: "-0.025em" }}>
            Djenadi{" "}
            <span style={{ background: "var(--gradient-cyan)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Mohamed Amine
            </span>
          </h1>

          {/* Typewriter */}
          <p className="animate-up-3" style={{
            fontSize: "clamp(0.95rem, 2.5vw, 1.25rem)",
            color: "var(--text-secondary)",
            fontFamily: "'Space Grotesk', sans-serif",
            marginBottom: "1.5rem",
            minHeight: "2rem",
          }}>
            &gt; {typed}<span className="cursor" style={{ color: "var(--accent-cyan)" }}>_</span>
          </p>

          {/* Description */}
          <p className="animate-up-4" style={{
            maxWidth: "580px", color: "var(--text-secondary)",
            fontSize: "0.925rem", lineHeight: "1.85", marginBottom: "2.5rem",
          }}>
            Ingénieur broadcast à <span style={{ color: "var(--accent-orange)", fontWeight: 600 }}>Echorouk TV</span>.
            Je maîtrise la chaîne complète du signal vidéo : de la caméra PTZ au flux&nbsp;
            <span style={{ color: "var(--accent-cyan)" }}>NDI/HLS/SRT/WebRTC</span>,
            en passant par l'étalonnage, le câblage réseau, et le développement d'applications mobiles sur mesure.
          </p>

          {/* CTA */}
          <div className="animate-up-4" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3.5rem" }}>
            <a href="#projets" className="btn btn-primary" id="cta-projects">
              Voir mes projets <ChevronRight size={16} />
            </a>
            <a href="#contact" className="btn btn-outline" id="cta-contact">
              Me contacter
            </a>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            {[
              { value: "NDI", label: "SDK maîtrisé" },
              { value: "HLS·SRT", label: "Streaming" },
              { value: "5+", label: "Apps déployées" },
              { value: "PTZ", label: "Remote control" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", background: "var(--gradient-cyan)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "0.73rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="competences" style={{ padding: "var(--section-gap) 0", position: "relative", zIndex: 1 }}>
        <div className="container">
          <h2 className="section-title">Compétences</h2>
          <div className="divider divider-cyan" />
          <p className="section-subtitle">Maîtrise complète de la chaîne broadcast & développement</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {SKILL_GROUPS.map((group, idx) => {
              const Icon = group.icon;
              const col = colorMap[group.color];
              return (
                <div key={group.label} className="card animate-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.25rem" }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${col}15`, border: `1px solid ${col}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={18} color={col} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{group.label}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {group.items.map((item) => (
                        <span key={item} className="skill-pill" style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projets" style={{ padding: "var(--section-gap) 0", position: "relative", zIndex: 1 }}>
        <div className="container">
          <h2 className="section-title">Projets & Réalisations</h2>
          <div className="divider divider-cyan" />
          <p className="section-subtitle">Applications déployées et systèmes opérationnels</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {PROJECTS.map((project) => {
              const Icon = project.icon;
              return (
                <div key={project.id} id={`project-${project.id}`} className="card"
                  style={{
                    borderColor: project.border,
                    background: project.gradient,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: project.id === 'mimo-spark' ? '0 0 40px -20px var(--accent-orange)' : 'none'
                  }}
                >
                  <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1 }}>
                    {/* Media Section */}
                    {/* 1. Sequential Videos (Standard Loop) */}
                    {(project as any).videos && project.id !== "veo-project" && (
                      <div style={{ position: "relative", width: "100%", borderRadius: 12, overflow: "hidden", aspectRatio: "16/9", marginBottom: "1.25rem", background: "#000", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <video
                          key={(project as any).videos[currentVideoIndices[project.id] || 0].src}
                          autoPlay
                          muted
                          playsInline
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: (project as any).videos[currentVideoIndices[project.id] || 0].filter || "none"
                          }}
                          onEnded={() => {
                            const videos = (project as any).videos;
                            setCurrentVideoIndices(prev => ({
                              ...prev,
                              [project.id]: (prev[project.id] + 1) % videos.length
                            }));
                          }}
                        >
                          <source src={(project as any).videos[currentVideoIndices[project.id] || 0].src} type="video/mp4" />
                        </video>
                        <div style={{ position: "absolute", bottom: "0.5rem", right: "0.5rem", display: "flex", gap: "0.25rem" }}>
                          {(project as any).videos.map((_: any, idx: number) => (
                            <div key={idx} style={{
                              width: 4, height: 4, borderRadius: "50%",
                              background: (currentVideoIndices[project.id] || 0) === idx ? "var(--accent-cyan)" : "rgba(255,255,255,0.3)"
                            }} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 1b. Swipeable Diaporama Videos (Veo Project) */}
                    {(project as any).videos && project.id === "veo-project" && (
                      <div style={{ marginBottom: "1.25rem" }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
                          <ChevronRight size={14} />
                          Balayez (Swipe) pour voir les autres vidéos
                        </div>
                        <div className="media-slideshow" style={{
                          display: "flex", overflowX: "auto", overflowY: "hidden",
                          scrollSnapType: "x mandatory", gap: "0.75rem"
                        }}>
                          {(project as any).videos.map((vid: any, idx: number) => (
                            <div key={idx} style={{
                              flex: "0 0 90%", scrollSnapAlign: "center",
                              position: "relative", borderRadius: 12, overflow: "hidden",
                              aspectRatio: "16/9", background: "#000", border: "1px solid rgba(255,255,255,0.05)"
                            }}>
                              <video
                                autoPlay loop muted playsInline
                                style={{ width: "100%", height: "100%", objectFit: "cover", filter: vid.filter || "none" }}
                              >
                                <source src={vid.src} type="video/mp4" />
                              </video>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. Image Gallery (Diaporama AI Showcase) */}
                    {(project as any).gallery && (
                      <div style={{ marginBottom: "1.25rem" }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
                          <ChevronRight size={14} />
                          Balayez (Swipe) pour voir les rendus 4K
                        </div>
                        <div className="media-slideshow" style={{
                          display: "flex", overflowX: "auto", overflowY: "hidden",
                          scrollSnapType: "x mandatory", gap: "0.75rem"
                        }}>
                          {(project as any).gallery.map((imgTag: string, idx: number) => (
                            <div key={idx} style={{
                              flex: "0 0 85%", scrollSnapAlign: "center",
                              aspectRatio: "16/9", borderRadius: 8, overflow: "hidden",
                              border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)",
                              position: "relative"
                            }} className="card-hover">
                              <img src={imgTag} alt="Render" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3. Single Image Fallback */}
                    {project.image && !(project as any).videos && !(project as any).gallery && (
                      <div style={{ position: "relative", width: "100%", borderRadius: 12, overflow: "hidden", aspectRatio: "16/9", marginBottom: "1.25rem", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <img src={project.image} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}

                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={19} color="var(--text-secondary)" />
                        </div>
                        <div>
                          <h3 style={{ fontSize: "1rem", color: "var(--text-primary)", fontWeight: 700 }}>{project.title}</h3>
                          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{project.subtitle}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                        <span className="status-dot" />
                        <span className={`badge badge-${project.badgeColor}`}>{project.badge}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: "1.8", marginBottom: "1rem" }}>
                      {project.description}
                    </p>

                    {/* Files (technical depth) */}
                    <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 8, padding: "0.6rem 0.8rem", marginBottom: "0.85rem", fontFamily: "monospace", fontSize: "0.73rem" }}>
                      <div style={{ color: "var(--text-muted)", marginBottom: "0.3rem", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Modules</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                        {project.files.map((f) => (
                          <span key={f} style={{ color: "var(--accent-cyan)", background: "rgba(0,229,255,0.07)", padding: "0.15rem 0.5rem", borderRadius: 4 }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tech tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1rem" }}>
                      {project.tech.map((t) => (
                        <span key={t} className="badge badge-gray">{t}</span>
                      ))}
                    </div>

                    {/* GitHub / Local Code Link */}
                    {(project.localRoute || project.github) && (
                      <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
                        <a href={(project as any).localRoute || project.github} target={(project as any).localRoute ? "_self" : "_blank"} rel="noopener noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500, transition: "color 0.2s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}>
                          {(project as any).localRoute ? <Code2 size={14} /> : <Github size={14} />}
                          {(project as any).localRoute ? "Explorer le code source" : "Voir sur GitHub"}
                          <ExternalLink size={10} style={{ opacity: 0.5 }} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "var(--section-gap) 0 6rem", position: "relative", zIndex: 1 }}>
        <div className="container">
          <h2 className="section-title">Contact</h2>
          <div className="divider divider-purple" />
          <p className="section-subtitle">Collaborations broadcast, développement ou consulting réseau</p>

          <div className="contact-dashboard card-hover" style={{ maxWidth: 800, margin: "0 auto" }}>
            <div className="contact-grid" style={{ position: "relative", zIndex: 1 }}>
              <div>
                <h3 style={{ fontSize: "1.5rem", color: "var(--text-primary)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Zap size={24} color="var(--accent-cyan)" />
                  Prêt pour le prochain défi
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem", lineHeight: "1.85" }}>
                  Disponible pour des projets de streaming broadcast, développement NDI natif (iOS/Android/PC), ou consulting infrastructure réseau.
                  Expertise technique validée en environnement de production nationale (<span style={{ color: "var(--accent-orange)", fontWeight: 600 }}>Echorouk TV</span>).
                </p>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ padding: "0.75rem 1rem", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.25rem" }}>Localisation</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 500 }}>Alger, Algérie (Remote possible)</div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <a href="https://wa.me/213770945042?text=Bonjour%20Mohamed%20Amine,%20je%20viens%20depuis%20ton%20portfolio" id="contact-whatsapp"
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-primary" style={{ height: "auto", minHeight: "3.5rem", padding: "0.5rem 1.5rem", background: "var(--gradient-cyan)", color: "#000", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <MessageCircle size={18} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.3" }}>
                    <span style={{ fontSize: "0.75rem", opacity: 0.7, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>WhatsApp Business</span>
                    <span style={{ fontSize: "1rem", fontWeight: 700 }}>+213 77 09 45 042</span>
                  </div>
                  <ChevronRight size={16} style={{ marginLeft: "auto", opacity: 0.5 }} />
                </a>

                <a href="mailto:djenadimohamedamine@gmail.com" id="contact-email"
                  className="btn btn-outline" style={{ height: "auto", minHeight: "3.5rem", padding: "0.5rem 1.5rem", borderColor: "rgba(167,139,250,0.3)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Mail size={18} color="var(--accent-purple)" />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.3", overflow: "hidden" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email Professionnel</span>
                    <span className="email-text" style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 500 }}>djenadimohamedamine@gmail.com</span>
                  </div>
                </a>

                <a href="https://github.com/djenadimohamedamine-code" id="contact-github"
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-outline" style={{ height: "3.5rem", padding: "0 1.5rem" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Github size={18} />
                  </div>
                  GitHub Studio
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "1.25rem 0", textAlign: "center", color: "var(--text-muted)", fontSize: "0.78rem", position: "relative", zIndex: 1 }}>
        <div className="container">
          <Coffee size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
          MIMO-NDI · Djenadi Mohamed Amine · Echorouk TV · {new Date().getFullYear()}
        </div>
      </footer>
    </>
  );
}