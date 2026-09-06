// ---------- Tabs ----------
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabPanels.forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    if (btn.dataset.tab !== "scan") stopCamera();
    if (btn.dataset.tab === "history") renderHistory();
  });
});

// ---------- Generate: type field switching ----------
const typeSelect = document.getElementById("qr-type");
const typeFieldGroups = {
  text: document.getElementById("fields-text"),
  wifi: document.getElementById("fields-wifi"),
  vcard: document.getElementById("fields-vcard"),
  tel: document.getElementById("fields-tel"),
  email: document.getElementById("fields-email"),
};

typeSelect.addEventListener("change", () => {
  Object.entries(typeFieldGroups).forEach(([key, el]) => {
    el.classList.toggle("hidden", key !== typeSelect.value);
  });
});

// ---------- Generate: options ----------
const sizeInput = document.getElementById("opt-size");
const sizeLabel = document.getElementById("opt-size-val");
sizeInput.addEventListener("input", () => (sizeLabel.textContent = sizeInput.value));

// Escapes reserved characters per the Wi-Fi / vCard QR payload spec (RFC-like colon/semicolon escaping).
function escapePayload(value) {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

function buildPayload() {
  const type = typeSelect.value;

  if (type === "text") {
    const text = document.getElementById("f-text").value.trim();
    if (!text) throw new Error("Matn yoki havolani kiriting.");
    return text;
  }

  if (type === "wifi") {
    const ssid = document.getElementById("f-wifi-ssid").value.trim();
    const pass = document.getElementById("f-wifi-pass").value;
    const enc = document.getElementById("f-wifi-enc").value;
    const hidden = document.getElementById("f-wifi-hidden").checked;
    if (!ssid) throw new Error("Tarmoq nomini (SSID) kiriting.");
    const passPart = enc === "nopass" ? "" : `P:${escapePayload(pass)};`;
    return `WIFI:T:${enc};S:${escapePayload(ssid)};${passPart}H:${hidden};;`;
  }

  if (type === "vcard") {
    const name = document.getElementById("f-vc-name").value.trim();
    const org = document.getElementById("f-vc-org").value.trim();
    const tel = document.getElementById("f-vc-tel").value.trim();
    const email = document.getElementById("f-vc-email").value.trim();
    if (!name) throw new Error("Ism familiyani kiriting.");
    const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${name}`];
    if (org) lines.push(`ORG:${org}`);
    if (tel) lines.push(`TEL:${tel}`);
    if (email) lines.push(`EMAIL:${email}`);
    lines.push("END:VCARD");
    return lines.join("\n");
  }

  if (type === "tel") {
    const tel = document.getElementById("f-tel").value.trim();
    if (!tel) throw new Error("Telefon raqamini kiriting.");
    return `tel:${tel}`;
  }

  if (type === "email") {
    const addr = document.getElementById("f-email-addr").value.trim();
    const subj = document.getElementById("f-email-subj").value.trim();
    const body = document.getElementById("f-email-body").value.trim();
    if (!addr) throw new Error("Email manzilini kiriting.");
    const params = new URLSearchParams();
    if (subj) params.set("subject", subj);
    if (body) params.set("body", body);
    const query = params.toString();
    return `mailto:${addr}${query ? "?" + query : ""}`;
  }

  throw new Error("Noma'lum QR turi.");
}

// ---------- Generate: render QR ----------
const qrBox = document.getElementById("qrcode-canvas");
const errorText = document.getElementById("generate-error");
const downloadBtn = document.getElementById("btn-download");
let currentQR = null;
let lastPayload = "";

function showError(message) {
  errorText.textContent = message;
  errorText.classList.remove("hidden");
}

function clearError() {
  errorText.textContent = "";
  errorText.classList.add("hidden");
}

document.getElementById("btn-generate").addEventListener("click", () => {
  clearError();
  let payload;
  try {
    payload = buildPayload();
  } catch (err) {
    showError(err.message);
    return;
  }

  qrBox.innerHTML = "";
  const size = parseInt(sizeInput.value, 10);
  const colorDark = document.getElementById("opt-color-dark").value;
  const colorLight = document.getElementById("opt-color-light").value;
  const ecl = document.getElementById("opt-ecl").value;

  currentQR = new QRCode(qrBox, {
    text: payload,
    width: size,
    height: size,
    colorDark,
    colorLight,
    correctLevel: QRCode.CorrectLevel[ecl],
  });

  lastPayload = payload;
  downloadBtn.classList.remove("hidden");
  addHistoryEntry("generated", typeSelect.value, payload);
});

document.getElementById("btn-clear").addEventListener("click", () => {
  document.querySelectorAll("#tab-generate input, #tab-generate textarea").forEach((el) => {
    if (el.type === "checkbox") el.checked = false;
    else if (el.type !== "range" && el.type !== "color") el.value = "";
  });
  qrBox.innerHTML = "";
  downloadBtn.classList.add("hidden");
  clearError();
});

downloadBtn.addEventListener("click", () => {
  const canvas = qrBox.querySelector("canvas");
  const link = document.createElement("a");
  link.download = "qrcode.png";
  if (canvas) {
    link.href = canvas.toDataURL("image/png");
  } else {
    const img = qrBox.querySelector("img");
    link.href = img.src;
  }
  link.click();
});

// ---------- Scan: camera ----------
const video = document.getElementById("scan-video");
const hiddenCanvas = document.getElementById("hidden-canvas");
const hiddenCtx = hiddenCanvas.getContext("2d", { willReadFrequently: true });
const camStartBtn = document.getElementById("btn-cam-start");
const camStopBtn = document.getElementById("btn-cam-stop");
const scanStatus = document.getElementById("scan-status");
let mediaStream = null;
let scanRAF = null;

async function startCamera() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
  } catch (err) {
    scanStatus.textContent = "Kameraga ruxsat berilmadi yoki kamera topilmadi.";
    return;
  }
  video.srcObject = mediaStream;
  video.classList.remove("hidden");
  await video.play();
  camStartBtn.classList.add("hidden");
  camStopBtn.classList.remove("hidden");
  scanStatus.textContent = "QR kodni kameraga yaqinlashtiring...";
  scanLoop();
}

function stopCamera() {
  if (scanRAF) cancelAnimationFrame(scanRAF);
  if (mediaStream) {
    mediaStream.getTracks().forEach((t) => t.stop());
    mediaStream = null;
  }
  video.classList.add("hidden");
  camStartBtn.classList.remove("hidden");
  camStopBtn.classList.add("hidden");
}

function scanLoop() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    hiddenCanvas.width = video.videoWidth;
    hiddenCanvas.height = video.videoHeight;
    hiddenCtx.drawImage(video, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
    const imageData = hiddenCtx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code && code.data) {
      showScanResult(code.data);
      stopCamera();
      return;
    }
  }
  scanRAF = requestAnimationFrame(scanLoop);
}

camStartBtn.addEventListener("click", startCamera);
camStopBtn.addEventListener("click", stopCamera);

// ---------- Scan: file upload ----------
document.getElementById("file-upload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    hiddenCanvas.width = img.width;
    hiddenCanvas.height = img.height;
    hiddenCtx.drawImage(img, 0, 0);
    const imageData = hiddenCtx.getImageData(0, 0, img.width, img.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code && code.data) {
      showScanResult(code.data);
    } else {
      scanStatus.textContent = "Rasmda QR kod topilmadi.";
    }
    URL.revokeObjectURL(img.src);
  };
  img.src = URL.createObjectURL(file);
});

// ---------- Scan: result display ----------
const scanResultBox = document.getElementById("scan-result-box");
const scanResultText = document.getElementById("scan-result-text");
const scanEmpty = document.getElementById("scan-empty");
const linkOpenResult = document.getElementById("link-open-result");

function showScanResult(text) {
  scanResultText.textContent = text;
  scanResultBox.classList.remove("hidden");
  scanEmpty.classList.add("hidden");
  scanStatus.textContent = "";

  if (/^https?:\/\//i.test(text)) {
    linkOpenResult.href = text;
    linkOpenResult.classList.remove("hidden");
  } else {
    linkOpenResult.classList.add("hidden");
  }

  addHistoryEntry("scanned", "qr", text);
}

document.getElementById("btn-copy-result").addEventListener("click", () => {
  navigator.clipboard.writeText(scanResultText.textContent);
});

// ---------- History ----------
const HISTORY_KEY = "qrstudio_history";
const HISTORY_LIMIT = 20;

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function addHistoryEntry(action, type, content) {
  const history = getHistory();
  history.unshift({ action, type, content, time: new Date().toISOString() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, HISTORY_LIMIT)));
}

function renderHistory() {
  const history = getHistory();
  const list = document.getElementById("history-list");
  const empty = document.getElementById("history-empty");
  list.innerHTML = "";

  if (history.length === 0) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  history.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "history-item";
    const actionLabel = entry.action === "generated" ? "Yaratildi" : "Skaner qilindi";
    const date = new Date(entry.time).toLocaleString("uz-UZ");
    li.innerHTML = `
      <div>
        <div class="content">${escapeHtml(entry.content)}</div>
        <div class="meta">${actionLabel} · ${entry.type} · ${date}</div>
      </div>
    `;
    list.appendChild(li);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

document.getElementById("btn-clear-history").addEventListener("click", () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
});
