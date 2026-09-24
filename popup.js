const $ = (id) => document.getElementById(id);
let running = false;

async function loadWindows(selectedId) {
  const wins = await chrome.windows.getAll({ populate: true, windowTypes: ["normal"] });
  const sel = $("window");
  sel.innerHTML = "";
  sel.add(new Option("Currently focused window", ""));
  wins.forEach((w, n) => {
    const active = w.tabs.find((t) => t.active);
    const title = (active?.title || "").slice(0, 28);
    const label = `Window ${n + 1} · ${w.tabs.length} tabs · ${title}`;
    sel.add(new Option(label, String(w.id)));
  });
  sel.value = selectedId ? String(selectedId) : "";
  if (sel.value !== (selectedId ? String(selectedId) : "")) sel.value = "";
}

function render() {
  $("toggle").textContent = running ? "Stop" : "Start";
  $("status").textContent = running ? "Running" : "Stopped";
}

function send() {
  const seconds = Math.max(30, Number($("seconds").value) || 60);
  $("seconds").value = seconds;
  const windowId = $("window").value ? Number($("window").value) : null;
  chrome.runtime.sendMessage({ type: "start", seconds, windowId });
}

async function init() {
  const s = await chrome.storage.local.get(["running", "seconds", "windowId"]);
  running = !!s.running;
  if (s.seconds) $("seconds").value = s.seconds;
  await loadWindows(s.windowId);
  render();
}

$("toggle").addEventListener("click", () => {
  if (running) {
    chrome.runtime.sendMessage({ type: "stop" });
    running = false;
  } else {
    send();
    running = true;
  }
  render();
});

// Changing settings while running restarts the loop with the new values
["seconds", "window"].forEach((id) =>
  $(id).addEventListener("change", () => { if (running) send(); })
);

init();
