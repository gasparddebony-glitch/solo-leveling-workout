import { useState, useEffect } from "react";

const RANKS = ["E", "D", "C", "B", "A", "S"];
const RANK_COLORS = {
  E: "#8888aa",
  D: "#44bb77",
  C: "#4499ff",
  B: "#aa44ff",
  A: "#ff9900",
  S: "#ff3333",
};

const RANK_THRESHOLDS = [0, 2, 4, 6, 8, 10, 12]; // semaines

const PROGRAMS = {
  E: {
    label: "Rang E — Éveil",
    description: "Tu viens de débloquer le Système. Le commencement.",
    circuit: [
      { name: "Pompes (genoux OK)", sets: 3, reps: "10", icon: "🔥" },
      { name: "Squats", sets: 3, reps: "15", icon: "⚡" },
      { name: "Tractions assistées élastique", sets: 3, reps: "5", icon: "🗡️" },
      { name: "Gainage planche", sets: 3, reps: "30s", icon: "🛡️" },
      { name: "Fentes alternées", sets: 3, reps: "10/jambe", icon: "💨" },
      { name: "Curl haltères 2-3kg", sets: 3, reps: "12", icon: "💪" },
    ],
    cardio: "10 min course / 100 jumping jacks",
  },
  D: {
    label: "Rang D — Initié",
    description: "Ton corps commence à changer. Continue.",
    circuit: [
      { name: "Pompes normales", sets: 4, reps: "12", icon: "🔥" },
      { name: "Squats sautés", sets: 4, reps: "12", icon: "⚡" },
      { name: "Tractions assistées élastique", sets: 4, reps: "7", icon: "🗡️" },
      { name: "Gainage + élévation jambe", sets: 4, reps: "40s", icon: "🛡️" },
      { name: "Fentes avec haltères", sets: 4, reps: "10/jambe", icon: "💨" },
      { name: "Rowing élastique", sets: 4, reps: "12", icon: "💪" },
    ],
    cardio: "15 min course ou HIIT 20/40s x8",
  },
  C: {
    label: "Rang C — Chasseur",
    description: "Tu n'es plus le plus faible. Loin de là.",
    circuit: [
      { name: "Pompes diamant", sets: 4, reps: "12", icon: "🔥" },
      { name: "Pistol squat assisté", sets: 4, reps: "8/jambe", icon: "⚡" },
      { name: "Tractions prise large", sets: 4, reps: "6", icon: "🗡️" },
      { name: "Planche latérale", sets: 4, reps: "30s/côté", icon: "🛡️" },
      { name: "Burpees", sets: 4, reps: "10", icon: "💨" },
      { name: "Curl + Press haltères", sets: 4, reps: "10", icon: "💪" },
    ],
    cardio: "20 min course ou tabata 4 min x3",
  },
  B: {
    label: "Rang B — Élite",
    description: "Les autres chasseurs commencent à te remarquer.",
    circuit: [
      { name: "Pompes déclinées", sets: 5, reps: "12", icon: "🔥" },
      { name: "Pistol squat complet", sets: 5, reps: "6/jambe", icon: "⚡" },
      { name: "Tractions lestées élastique", sets: 5, reps: "8", icon: "🗡️" },
      { name: "Dragon flag (négatif)", sets: 5, reps: "5", icon: "🛡️" },
      { name: "Burpees avec traction", sets: 5, reps: "8", icon: "💨" },
      { name: "Rowing élastique + curl", sets: 5, reps: "10", icon: "💪" },
    ],
    cardio: "25 min run + sprint finaux 6x30s",
  },
  A: {
    label: "Rang A — Ombre",
    description: "Tu ressens le pouvoir grandir en toi.",
    circuit: [
      { name: "Pompes claquées", sets: 5, reps: "10", icon: "🔥" },
      { name: "Squat jump + isométrique", sets: 5, reps: "12", icon: "⚡" },
      { name: "Muscle-up (assisté)", sets: 5, reps: "4", icon: "🗡️" },
      { name: "L-sit (barres parallèles ou sol)", sets: 5, reps: "20s", icon: "🛡️" },
      { name: "Burpees explosifs", sets: 5, reps: "10", icon: "💨" },
      { name: "Complex haltères 5 mouvements", sets: 5, reps: "8", icon: "💪" },
    ],
    cardio: "30 min run tempo ou 5x1min sprint",
  },
  S: {
    label: "Rang S — Monarque des Ombres",
    description: "Tu es devenu quelque chose que les humains ne peuvent comprendre.",
    circuit: [
      { name: "Pompes à 1 bras (assisté)", sets: 5, reps: "8/bras", icon: "🔥" },
      { name: "Pistol squat lesté", sets: 5, reps: "8/jambe", icon: "⚡" },
      { name: "Muscle-up strict", sets: 5, reps: "5", icon: "🗡️" },
      { name: "Front lever (progression)", sets: 5, reps: "10s", icon: "🛡️" },
      { name: "Circuit explosion 3 exos", sets: 5, reps: "10", icon: "💨" },
      { name: "Full body élastique max résistance", sets: 5, reps: "12", icon: "💪" },
    ],
    cardio: "35 min run + 10x100m sprint",
  },
};

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function getRank(week) {
  if (week >= 10) return "S";
  if (week >= 8) return "A";
  if (week >= 6) return "B";
  if (week >= 4) return "C";
  if (week >= 2) return "D";
  return "E";
}

function getXPPercent(week) {
  const rankStart = [0, 0, 2, 4, 6, 8, 10];
  const rankEnd = [2, 2, 4, 6, 8, 10, 12];
  const rankIdx = RANKS.indexOf(getRank(week));
  const start = rankStart[rankIdx];
  const end = rankEnd[rankIdx];
  return Math.min(100, Math.round(((week - start) / (end - start)) * 100));
}

// 78.5kg × 35ml = 2747ml ≈ 11 verres de 250ml
const WATER_GLASSES = 11;
const WATER_TOTAL_L = "2.75L";

const DAILY_HABITS = [
  { key: "lecture", icon: "📖", label: "Lecture", detail: "15 min — nourris ton esprit", color: "#4499ff" },
  { key: "relaxation", icon: "🧘", label: "Relaxation / Méditation", detail: "15 min — récupération mentale", color: "#aa44ff" },
];

export default function App() {
  const [week, setWeek] = useState(() => parseInt(localStorage.getItem("sl_week") || "0"));
  const [completedDays, setCompletedDays] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sl_completed") || "{}"); } catch { return {}; }
  });
  const [checkedExos, setCheckedExos] = useState({});
  const [activeTab, setActiveTab] = useState("today");
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [habitsDone, setHabitsDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sl_habits") || "{}"); } catch { return {}; }
  });
  const [waterCount, setWaterCount] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sl_water") || "{}");
      const today = new Date().toISOString().slice(0, 10);
      return saved[today] || 0;
    } catch { return 0; }
  });

  const rank = getRank(week);
  const color = RANK_COLORS[rank];
  const program = PROGRAMS[rank];
  const xp = getXPPercent(week);
  const todayKey = new Date().toISOString().slice(0, 10);

  useEffect(() => { localStorage.setItem("sl_week", week); }, [week]);
  useEffect(() => { localStorage.setItem("sl_completed", JSON.stringify(completedDays)); }, [completedDays]);
  useEffect(() => { localStorage.setItem("sl_habits", JSON.stringify(habitsDone)); }, [habitsDone]);
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sl_water") || "{}");
    saved[todayKey] = waterCount;
    localStorage.setItem("sl_water", JSON.stringify(saved));
  }, [waterCount]);

  const todayDone = completedDays[todayKey];

  function toggleHabit(key) {
    const fullKey = `${todayKey}_${key}`;
    setHabitsDone(prev => ({ ...prev, [fullKey]: !prev[fullKey] }));
  }

  function isHabitDone(key) {
    return !!habitsDone[`${todayKey}_${key}`];
  }

  function markDayDone() {
    const newCompleted = { ...completedDays, [todayKey]: true };
    setCompletedDays(newCompleted);
    const total = Object.keys(newCompleted).length;
    const newWeek = Math.floor(total / 3);
    const oldRank = getRank(week);
    const newRank = getRank(newWeek);
    if (newRank !== oldRank) setShowLevelUp(true);
    setWeek(newWeek);
  }

  function toggleExo(key) {
    setCheckedExos(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const totalSessions = Object.keys(completedDays).length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a12",
      color: "#e8e8ff",
      fontFamily: "'Courier New', monospace",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background particles */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {[...Array(18)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: i % 3 === 0 ? "2px" : "1px",
            height: i % 3 === 0 ? "2px" : "1px",
            background: color,
            borderRadius: "50%",
            left: `${(i * 37 + 11) % 100}%`,
            top: `${(i * 53 + 7) % 100}%`,
            opacity: 0.15 + (i % 4) * 0.08,
            animation: `pulse ${2 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:.15;transform:scale(1)} 50%{opacity:.6;transform:scale(2)} }
        @keyframes levelup { 0%{opacity:0;transform:scale(.5) translateY(30px)} 60%{transform:scale(1.1) translateY(-10px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 10px ${color}44} 50%{box-shadow:0 0 30px ${color}88, 0 0 60px ${color}33} }
        @keyframes slidein { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .tab-btn { background:none; border:1px solid #333; color:#888; padding:8px 18px; cursor:pointer; font-family:inherit; font-size:13px; transition:all .2s; letter-spacing:1px; }
        .tab-btn.active { border-color:${color}; color:${color}; background:${color}18; }
        .tab-btn:hover { border-color:${color}88; color:${color}; }
        .exo-card { background:#11111e; border:1px solid #222; padding:14px 16px; display:flex; align-items:center; gap:12px; cursor:pointer; transition:all .2s; border-radius:4px; margin-bottom:8px; }
        .exo-card:hover { border-color:${color}66; background:#15152a; }
        .exo-card.done { border-color:${color}; background:${color}11; }
        .check-box { width:20px; height:20px; border:2px solid #444; border-radius:3px; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all .2s; font-size:12px; }
        .exo-card.done .check-box { background:${color}; border-color:${color}; }
        .complete-btn { width:100%; padding:16px; border:1px solid ${color}; background:${color}22; color:${color}; font-family:inherit; font-size:15px; letter-spacing:3px; cursor:pointer; transition:all .3s; text-transform:uppercase; }
        .complete-btn:hover { background:${color}44; box-shadow:0 0 20px ${color}44; }
        .complete-btn:disabled { opacity:.4; cursor:not-allowed; }
        .week-cell { width:36px; height:36px; display:flex; align-items:center; justify-content:center; font-size:11px; border-radius:3px; font-family:inherit; }
      `}</style>

      {/* Level Up Modal */}
      {showLevelUp && (
        <div style={{
          position: "fixed", inset: 0, background: "#000000cc", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setShowLevelUp(false)}>
          <div style={{
            background: "#0d0d1a", border: `2px solid ${color}`,
            padding: "48px 56px", textAlign: "center",
            animation: "levelup .6s ease-out",
            boxShadow: `0 0 60px ${color}66`,
          }}>
            <div style={{ fontSize: "52px", marginBottom: "12px" }}>⬆️</div>
            <div style={{ color, fontSize: "28px", letterSpacing: "6px", marginBottom: "8px" }}>RANG {rank}</div>
            <div style={{ color: "#666", fontSize: "13px", letterSpacing: "2px" }}>DÉBLOQUÉ</div>
            <div style={{ color: "#444", fontSize: "12px", marginTop: "24px" }}>Appuie pour continuer</div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px 16px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px", animation: "slidein .5s ease-out" }}>
          <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#555", marginBottom: "8px" }}>SYSTÈME D'ÉVEIL</div>
          <div style={{ fontSize: "26px", letterSpacing: "2px", fontWeight: "bold", marginBottom: "4px" }}>SOLO LEVELING</div>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#555" }}>SUNG JIN-WOO PROTOCOL</div>
        </div>

        {/* Rank Card */}
        <div style={{
          background: "#0d0d1a", border: `1px solid ${color}44`,
          padding: "24px", marginBottom: "20px",
          animation: "glow 3s ease-in-out infinite, slidein .6s ease-out",
          borderRadius: "4px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <div style={{ fontSize: "11px", color: "#555", letterSpacing: "3px", marginBottom: "4px" }}>CHASSEUR</div>
              <div style={{ fontSize: "13px", color: "#aaa" }}>1m85 · 78.5kg · 21 ans</div>
            </div>
            <div style={{
              background: color + "22", border: `1px solid ${color}`,
              padding: "8px 20px", borderRadius: "3px",
            }}>
              <div style={{ fontSize: "11px", color: color, letterSpacing: "2px", textAlign: "center" }}>RANG</div>
              <div style={{ fontSize: "36px", color, fontWeight: "bold", lineHeight: 1 }}>{rank}</div>
            </div>
          </div>

          <div style={{ fontSize: "12px", color: "#555", marginBottom: "8px", letterSpacing: "2px" }}>
            {program.label.toUpperCase()} · SEMAINE {week + 1}
          </div>

          {/* XP Bar */}
          <div style={{ background: "#1a1a2e", height: "6px", borderRadius: "3px", overflow: "hidden", marginBottom: "6px" }}>
            <div style={{
              width: `${xp}%`, height: "100%", background: color,
              transition: "width 1s ease", borderRadius: "3px",
              boxShadow: `0 0 8px ${color}`,
            }} />
          </div>
          <div style={{ fontSize: "11px", color: "#444", letterSpacing: "1px" }}>
            XP {xp}% · {totalSessions} séances complétées
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", marginBottom: "20px" }}>
          {["today", "program", "history"].map(t => (
            <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`}
              style={{ flex: 1 }}
              onClick={() => setActiveTab(t)}>
              {t === "today" ? "QUÊTE DU JOUR" : t === "program" ? "PROGRAMME" : "HISTORIQUE"}
            </button>
          ))}
        </div>

        {/* TODAY TAB */}
        {activeTab === "today" && (
          <div style={{ animation: "slidein .3s ease-out" }}>
            {todayDone ? (
              <div style={{
                background: "#0d1a0d", border: `1px solid ${color}`,
                padding: "32px", textAlign: "center", borderRadius: "4px",
              }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚔️</div>
                <div style={{ color, fontSize: "16px", letterSpacing: "3px" }}>QUÊTE COMPLÉTÉE</div>
                <div style={{ color: "#555", fontSize: "12px", marginTop: "8px" }}>Reviens demain, chasseur.</div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", color: "#555", letterSpacing: "3px", marginBottom: "12px" }}>
                    ▸ CIRCUIT {program.circuit[0].sets}x TOURS
                  </div>
                  {program.circuit.map((exo, i) => {
                    const key = `exo_${i}`;
                    const done = checkedExos[key];
                    return (
                      <div key={i} className={`exo-card ${done ? "done" : ""}`}
                        onClick={() => toggleExo(key)}>
                        <div className="check-box">{done ? "✓" : ""}</div>
                        <div style={{ fontSize: "16px" }}>{exo.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "13px", color: done ? color : "#ccc" }}>{exo.name}</div>
                          <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>
                            {exo.sets} séries × {exo.reps}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{
                  background: "#11111e", border: "1px solid #222",
                  padding: "14px 16px", borderRadius: "4px", marginBottom: "20px",
                  display: "flex", alignItems: "center", gap: "12px",
                }}>
                  <div style={{ fontSize: "16px" }}>🏃</div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#555", letterSpacing: "2px" }}>QUÊTE SECONDAIRE</div>
                    <div style={{ fontSize: "13px", color: "#aaa", marginTop: "2px" }}>{program.cardio}</div>
                  </div>
                </div>

                {/* QUÊTES QUOTIDIENNES */}
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", color: "#555", letterSpacing: "3px", marginBottom: "12px" }}>
                    ▸ RITUELS QUOTIDIENS
                  </div>
                  {DAILY_HABITS.map(habit => {
                    const done = isHabitDone(habit.key);
                    return (
                      <div key={habit.key} className={`exo-card ${done ? "done" : ""}`}
                        onClick={() => toggleHabit(habit.key)}
                        style={{ borderColor: done ? habit.color : undefined }}>
                        <div className="check-box" style={{ borderColor: done ? habit.color : undefined, background: done ? habit.color : undefined }}>{done ? "✓" : ""}</div>
                        <div style={{ fontSize: "16px" }}>{habit.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "13px", color: done ? habit.color : "#ccc" }}>{habit.label}</div>
                          <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{habit.detail}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* WATER TRACKER */}
                <div style={{
                  background: "#0d0d1a", border: "1px solid #1a2a3a",
                  padding: "16px", borderRadius: "4px", marginBottom: "20px",
                }}>
                  <div style={{ fontSize: "11px", color: "#555", letterSpacing: "3px", marginBottom: "10px" }}>
                    💧 HYDRATATION — {WATER_TOTAL_L} / JOUR (78.5kg × 35ml)
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                    {[...Array(WATER_GLASSES)].map((_, i) => (
                      <div key={i}
                        onClick={() => setWaterCount(i < waterCount ? i : i + 1)}
                        style={{
                          width: "36px", height: "36px", borderRadius: "4px",
                          border: `1px solid ${i < waterCount ? "#4499ff" : "#1a2a3a"}`,
                          background: i < waterCount ? "#4499ff22" : "#0a0a12",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "16px", cursor: "pointer", transition: "all .2s",
                        }}>
                        {i < waterCount ? "💧" : "○"}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "12px", color: "#4499ff" }}>
                      {waterCount}/{WATER_GLASSES} verres · {(waterCount * 0.25).toFixed(2)}L bus
                    </div>
                    {waterCount > 0 && (
                      <div style={{ fontSize: "11px", color: "#333", cursor: "pointer" }}
                        onClick={() => setWaterCount(0)}>reset</div>
                    )}
                  </div>
                  {/* Progress bar */}
                  <div style={{ background: "#1a1a2e", height: "4px", borderRadius: "2px", marginTop: "10px", overflow: "hidden" }}>
                    <div style={{
                      width: `${Math.min(100, (waterCount / WATER_GLASSES) * 100)}%`,
                      height: "100%", background: "#4499ff",
                      transition: "width .4s ease", borderRadius: "2px",
                    }} />
                  </div>
                </div>

                <button className="complete-btn" onClick={markDayDone}>
                  ▸ MARQUER COMME COMPLÉTÉ
                </button>
              </>
            )}
          </div>
        )}

        {/* PROGRAM TAB */}
        {activeTab === "program" && (
          <div style={{ animation: "slidein .3s ease-out" }}>
            <div style={{
              background: "#0d0d1a", border: `1px solid ${color}22`,
              padding: "16px", marginBottom: "16px", borderRadius: "4px",
            }}>
              <div style={{ color, fontSize: "13px", letterSpacing: "2px", marginBottom: "6px" }}>{program.label}</div>
              <div style={{ color: "#666", fontSize: "12px" }}>{program.description}</div>
            </div>

            {RANKS.map(r => {
              const p = PROGRAMS[r];
              const c = RANK_COLORS[r];
              const isActive = r === rank;
              const isPast = RANKS.indexOf(r) < RANKS.indexOf(rank);
              return (
                <div key={r} style={{
                  background: isActive ? "#0d0d1a" : "#0a0a12",
                  border: `1px solid ${isActive ? c + "88" : "#1a1a1a"}`,
                  padding: "14px 16px", marginBottom: "8px", borderRadius: "4px",
                  opacity: isPast ? 0.5 : 1,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ color: c, fontSize: "13px", letterSpacing: "2px" }}>RANG {r}</span>
                      <span style={{ color: "#444", fontSize: "11px", marginLeft: "12px" }}>
                        {isPast ? "✓ DÉPASSÉ" : isActive ? "◉ EN COURS" : `Sem. ${RANK_THRESHOLDS[RANKS.indexOf(r) + 1] * 1 + 1}+`}
                      </span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#555" }}>{p.circuit.length} exos</div>
                  </div>
                  {isActive && (
                    <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {p.circuit.map((e, i) => (
                        <span key={i} style={{
                          background: "#1a1a2e", border: `1px solid ${c}33`,
                          padding: "4px 8px", fontSize: "11px", color: "#888", borderRadius: "3px",
                        }}>{e.icon} {e.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div style={{ animation: "slidein .3s ease-out" }}>
            <div style={{
              background: "#0d0d1a", border: "1px solid #1a1a2e",
              padding: "20px", borderRadius: "4px", marginBottom: "16px",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", textAlign: "center" }}>
                <div>
                  <div style={{ color, fontSize: "24px", fontWeight: "bold" }}>{totalSessions}</div>
                  <div style={{ color: "#555", fontSize: "11px", letterSpacing: "1px" }}>SÉANCES</div>
                </div>
                <div>
                  <div style={{ color, fontSize: "24px", fontWeight: "bold" }}>{week}</div>
                  <div style={{ color: "#555", fontSize: "11px", letterSpacing: "1px" }}>SEMAINES</div>
                </div>
                <div>
                  <div style={{ color, fontSize: "24px", fontWeight: "bold" }}>
                    {RANKS.indexOf(rank)}
                  </div>
                  <div style={{ color: "#555", fontSize: "11px", letterSpacing: "1px" }}>RANGS ↑</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: "11px", color: "#555", letterSpacing: "3px", marginBottom: "12px" }}>
              ▸ DERNIÈRES SÉANCES
            </div>

            {Object.keys(completedDays).length === 0 ? (
              <div style={{ color: "#444", fontSize: "13px", textAlign: "center", padding: "32px" }}>
                Aucune séance enregistrée.<br />
                <span style={{ color: "#333" }}>Ta légende commence maintenant.</span>
              </div>
            ) : (
              Object.keys(completedDays).slice(-10).reverse().map((date, i) => (
                <div key={date} style={{
                  background: "#0d0d1a", border: "1px solid #1a1a2e",
                  padding: "12px 16px", marginBottom: "6px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  borderRadius: "4px", animation: `slidein ${.1 + i * .05}s ease-out`,
                }}>
                  <div style={{ fontSize: "13px", color: "#888" }}>
                    {new Date(date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" })}
                  </div>
                  <div style={{ color, fontSize: "11px", letterSpacing: "2px" }}>✓ COMPLÉTÉ</div>
                </div>
              ))
            )}

            {totalSessions > 0 && (
              <button
                onClick={() => {
                  if (confirm("Réinitialiser toute la progression ?")) {
                    setCompletedDays({});
                    setWeek(0);
                    localStorage.clear();
                  }
                }}
                style={{
                  marginTop: "16px", width: "100%", padding: "10px",
                  background: "none", border: "1px solid #2a2a2a", color: "#444",
                  fontFamily: "inherit", fontSize: "11px", letterSpacing: "2px",
                  cursor: "pointer",
                }}>
                RÉINITIALISER LA PROGRESSION
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "32px", color: "#333", fontSize: "11px", letterSpacing: "2px" }}>
          "JE SUIS LE SEUL À POUVOIR MONTER EN NIVEAU."
        </div>
      </div>
    </div>
  );
}
