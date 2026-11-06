const EVENTS = [
  {id:1,name:"CodeSprint Hackathon",cat:"Tech",date:"2026-12-12T09:00",venue:"KIIT Campus, Bhubaneswar",emoji:"💻",c:["#5B3DF5","#9b7bff"],desc:"24 hours to build something useful. Teams of up to four, mentors on call, and prizes for the top three projects."},
  {id:2,name:"Odissi & Beyond Night",cat:"Culture",date:"2026-12-20T18:30",venue:"Rabindra Mandap, Bhubaneswar",emoji:"💃",c:["#d4380d","#ff9a62"],desc:"An evening of classical Odissi paired with live fusion music from regional artists."},
  {id:3,name:"Sunrise 10K Run",cat:"Sports",date:"2027-01-10T05:30",venue:"Marine Drive, Puri",emoji:"🏃",c:["#0a8f6a","#5fd6a4"],desc:"A flat, scenic 10K along the coast. Finisher medals, hydration points and a post-run breakfast."},
  {id:4,name:"AI for Everyone Workshop",cat:"Tech",date:"2027-01-18T10:00",venue:"Online (Zoom)",emoji:"🤖",c:["#1456d9","#58a6ff"],desc:"A hands-on beginner session on using AI tools for study, work and side projects. No coding needed."},
  {id:5,name:"Indie Music Fest",cat:"Music",date:"2027-02-06T16:00",venue:"Janata Maidan, Bhubaneswar",emoji:"🎸",c:["#c2255c","#ff7aa8"],desc:"Twelve independent bands, three food courts and one very long evening under the stars."},
  {id:6,name:"Startup Pitch Day",cat:"Business",date:"2027-02-14T11:00",venue:"Startup Odisha Hub, Bhubaneswar",emoji:"🚀",c:["#b8860b","#ffd166"],desc:"Ten early-stage founders pitch to a panel of investors. Audience members vote for their favourite."},
  {id:7,name:"Watercolour Weekend",cat:"Art",date:"2027-02-27T10:00",venue:"Odisha Art Gallery, Cuttack",emoji:"🎨",c:["#7048e8","#74c0fc"],desc:"Two relaxed days of guided painting. Materials provided, all skill levels welcome."},
  {id:8,name:"Web Design Bootcamp",cat:"Tech",date:"2027-03-08T09:30",venue:"Utkal University, Bhubaneswar",emoji:"🖌️",c:["#087f8c","#5bc0be"],desc:"Build a responsive site from scratch in one day, covering HTML, CSS and a little JavaScript."},
  {id:9,name:"Street Food Carnival",cat:"Culture",date:"2027-03-20T12:00",venue:"Ekamra Haat, Bhubaneswar",emoji:"🍢",c:["#e8590c","#ffa94d"],desc:"Forty stalls, regional specialities and live cooking demos. Bring an appetite."}
];
const $ = s => document.querySelector(s);
const KEY = "eventora_regs";
let cat = "All", query = "", current = null;
const grad = e => `linear-gradient(135deg,${e.c[0]},${e.c[1]})`;
const fmt = (d, o) => new Date(d).toLocaleDateString("en-IN", o);
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const save = r => { try { localStorage.setItem(KEY, JSON.stringify(r)); } catch {} };

// Theme
const root = document.documentElement;
try { root.dataset.theme = localStorage.getItem("theme") || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light"); } catch {}
const syncTheme = () => $("#themeBtn").textContent = root.dataset.theme === "dark" ? "☀️" : "🌙";
$("#themeBtn").onclick = () => { root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark"; try { localStorage.setItem("theme", root.dataset.theme); } catch {} syncTheme(); };
syncTheme();

// Chips
const cats = ["All", ...new Set(EVENTS.map(e => e.cat))];
$("#chips").innerHTML = cats.map(c => `<button class="chip" aria-pressed="${c === "All"}" data-c="${c}">${c}</button>`).join("");
$("#chips").onclick = e => {
  if (!e.target.dataset.c) return;
  cat = e.target.dataset.c;
  document.querySelectorAll(".chip").forEach(b => b.setAttribute("aria-pressed", b.dataset.c === cat));
  render();
};
$("#search").oninput = e => { query = e.target.value.trim().toLowerCase(); render(); };

// Cards
function render() {
  const list = EVENTS.filter(e => (cat === "All" || e.cat === cat) && (e.name + e.venue + e.desc + e.cat).toLowerCase().includes(query));
  $("#grid").innerHTML = list.map((e, i) => `
    <article class="card" style="animation-delay:${i * 50}ms" data-id="${e.id}" tabindex="0" aria-label="${e.name}">
      <div class="art" style="background:${grad(e)}"><div class="date"><small>${fmt(e.date, {month:"short"})}</small>${fmt(e.date, {day:"numeric"})}</div>${e.emoji}</div>
      <div class="card-body"><span class="tag">${e.cat}</span><h3>${e.name}</h3>
      <p class="meta">📍 ${e.venue}</p><p>${e.desc.slice(0, 85)}…</p><span class="btn">View & register</span></div>
    </article>`).join("");
  $("#empty").hidden = list.length > 0;
}
$("#grid").onclick = e => { const c = e.target.closest(".card"); if (c) openModal(+c.dataset.id); };
$("#grid").onkeydown = e => { if (e.key === "Enter") e.target.click?.(), e.target.closest(".card") && openModal(+e.target.dataset.id); };

// Countdown
function parts(d) {
  const ms = Math.max(0, new Date(d) - Date.now());
  return [Math.floor(ms / 864e5), Math.floor(ms / 36e5) % 24, Math.floor(ms / 6e4) % 60, Math.floor(ms / 1e3) % 60];
}
const next = EVENTS.filter(e => new Date(e.date) > Date.now())[0] || EVENTS[0];
function tick() {
  const [d, h, m, s] = parts(next.date);
  $("#nextEvent").innerHTML = `<div class="emoji">${next.emoji}</div><span class="tag" style="background:#fff;color:#14173A">Next up</span>
    <h3>${next.name}</h3><div class="timer">${[["days",d],["hrs",h],["min",m],["sec",s]].map(([l,v]) => `<span>${v}<small>${l}</small></span>`).join("")}</div>`;
  $("#nextEvent").style.background = grad(next);
  if ($("#modal").open && current) { const [a,b,c] = parts(current.date); $("#mCount").textContent = `Starts in ${a}d ${b}h ${c}m`; }
}
$("#nextEvent").onclick = () => openModal(next.id);
setInterval(tick, 1000); tick();

// Modal
const modal = $("#modal"), form = $("#form");
$("#form select").innerHTML = EVENTS.map(e => `<option value="${e.id}">${e.name}</option>`).join("");
function openModal(id) {
  current = EVENTS.find(e => e.id === id);
  $("#mBanner").style.background = grad(current); $("#mBanner").textContent = current.emoji;
  $("#mTitle").textContent = current.name;
  $("#mMeta").textContent = `${fmt(current.date, {weekday:"long", day:"numeric", month:"long", year:"numeric"})} · ${new Date(current.date).toLocaleTimeString("en-IN", {hour:"numeric", minute:"2-digit"})} · ${current.venue}`;
  $("#mDesc").textContent = current.desc;
  form.event.value = id; form.hidden = false; $("#done").hidden = true; form.reset(); form.event.value = id;
  form.querySelectorAll(".err").forEach(x => x.textContent = "");
  modal.showModal(); tick();
}
$("#closeBtn").onclick = () => modal.close();
modal.onclick = e => { if (e.target === modal) modal.close(); };

// Validation
const rules = {
  name: v => /^[A-Za-z][A-Za-z .'-]{1,48}$/.test(v) ? "" : "Enter your full name (letters only, at least 2 characters).",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Enter a valid email, like name@example.com.",
  phone: v => /^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "")) ? "" : "Enter a 10-digit mobile number starting with 6, 7, 8 or 9."
};
function check(input) {
  const msg = rules[input.name](input.value.trim());
  input.classList.toggle("bad", !!msg);
  input.parentElement.querySelector(".err").textContent = msg;
  return !msg;
}
["name", "email", "phone"].forEach(n => form[n].addEventListener("blur", () => check(form[n])));
form.onsubmit = e => {
  e.preventDefault();
  const ok = ["name", "email", "phone"].map(n => check(form[n])).every(Boolean);
  if (!ok) return;
  const ev = EVENTS.find(x => x.id == form.event.value);
  const regs = load();
  const email = form.email.value.trim().toLowerCase();
  if (regs.some(r => r.eventId === ev.id && r.email === email)) {
    form.email.parentElement.querySelector(".err").textContent = "This email is already registered for this event."; return;
  }
  regs.push({ eventId: ev.id, name: form.name.value.trim(), email, phone: form.phone.value.trim(), at: Date.now() });
  save(regs); renderTickets();
  form.hidden = true;
  const d = $("#done"); d.hidden = false;
  d.innerHTML = `<div class="tick">🎉</div><h4>You're in, ${form.name.value.trim().split(" ")[0]}!</h4><p>Your seat for <b>${ev.name}</b> is confirmed. We've saved it under My tickets.</p><button class="btn" style="margin-top:1rem" onclick="modal.close()">Done</button>`;
};

// My tickets
function renderTickets() {
  const regs = load();
  $("#ticketCount").textContent = regs.length;
  $("#tickets").innerHTML = regs.length ? regs.map((r, i) => {
    const e = EVENTS.find(x => x.id === r.eventId);
    return `<li><span><b>${e.emoji} ${e.name}</b><br><small class="meta">${r.name} · ${fmt(e.date, {day:"numeric", month:"short", year:"numeric"})}</small></span><button data-i="${i}">Cancel</button></li>`;
  }).join("") : `<li style="border-left-color:var(--line)">No tickets yet. Pick an event above and reserve a seat.</li>`;
}
$("#tickets").onclick = e => { if (e.target.dataset.i) { const r = load(); r.splice(+e.target.dataset.i, 1); save(r); renderTickets(); } };

render(); renderTickets();
