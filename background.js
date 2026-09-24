const MIN_SECONDS = 30; // Chrome's minimum alarm period

async function stop() {
  await chrome.storage.local.set({ running: false });
  await chrome.alarms.clear("cycle");
  chrome.action.setBadgeText({ text: "" });
}

async function start(seconds, windowId) {
  const interval = Math.max(MIN_SECONDS, Number(seconds) || 60);
  await chrome.storage.local.set({
    running: true,
    index: 0,
    seconds: interval,
    windowId: windowId || null,
  });
  await chrome.alarms.clear("cycle");
  chrome.alarms.create("cycle", { periodInMinutes: interval / 60 });
  chrome.action.setBadgeText({ text: "ON" });
  cycle();
}

async function cycle() {
  const { running, index = 0, windowId = null } =
    await chrome.storage.local.get(["running", "index", "windowId"]);
  if (!running) return;

  let tabs = [];
  try {
    tabs = windowId
      ? await chrome.tabs.query({ windowId })
      : await chrome.tabs.query({ lastFocusedWindow: true });
  } catch (e) {
    tabs = [];
  }

  // Chosen window was closed: stop instead of silently doing nothing
  if (windowId && tabs.length === 0) {
    await stop();
    return;
  }
  if (tabs.length === 0) return;

  const i = index % tabs.length;
  const tab = tabs[i];
  console.log("Cycling to tab", i, tab.url);

  try {
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.tabs.reload(tab.id);
  } catch (e) {
    console.error("Failed on tab", tab.id, e);
  }
  await chrome.storage.local.set({ index: i + 1 });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "cycle") cycle();
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "start") start(msg.seconds, msg.windowId);
  if (msg.type === "stop") stop();
});
