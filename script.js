/* ===== EDIT THIS SECTION ===== */
const CONFIG = {
  storeName: "Paoh Official Store",
  whatsapp: "918798810245",        // change if your WhatsApp number is different
  upiId: "8798810245@okbizaxis",
  payeeName: "Paoh Official Store",
  currency: "₹",
  locale: "en-IN"
};

// Prices are EXAMPLES in rupees. Set each to your cost + your profit.
const PACKS = [
  { d: 86,   price: 90 },
  { d: 172,  price: 180 },
  { d: 257,  price: 270 },
  { d: 344,  price: 360 },
  { d: 514,  price: 540 },
  { d: 706,  price: 740 },
  { d: 1412, price: 1450 },
  { d: 2195, price: 2250 },
  { d: 0, name: "Weekly Pass", note: "Daily diamonds for 7 days", price: 150 }
];
/* ============================= */

const $ = id => document.getElementById(id);
const fmt = n => CONFIG.currency + n.toLocaleString(CONFIG.locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
let selected = null;
let qr = null;

$("supportLink").href = "https://wa.me/" + CONFIG.whatsapp;
$("upiText").textContent = CONFIG.upiId;

// Build the pack buttons
const grid = $("packs");
PACKS.forEach(p => {
  const b = document.createElement("button");
  b.className = "pack";
  b.type = "button";
  b.setAttribute("aria-pressed", "false");
  b.innerHTML = "<b>" + (p.d ? p.d.toLocaleString() + " 💎" : p.name) + "</b>" +
                "<small>" + (p.note || "Diamonds") + "</small>" +
                "<span class='price'>" + fmt(p.price) + "</span>";
  b.onclick = () => {
    selected = p;
    [...grid.children].forEach(c => c.setAttribute("aria-pressed", "false"));
    b.setAttribute("aria-pressed", "true");
    update();
  };
  grid.appendChild(b);
});

function validIds() {
  const u = $("uid").value.trim(), z = $("zid").value.trim();
  return /^\d{5,12}$/.test(u) && /^\d{3,6}$/.test(z);
}

function showQR(link) {
  const box = $("qr");
  if (typeof QRCode === "undefined") {
    box.textContent = "QR could not load. Use the UPI ID instead.";
    return;
  }
  if (!qr) {
    qr = new QRCode(box, { text: link, width: 200, height: 200, colorDark: "#000000", colorLight: "#ffffff" });
  } else {
    qr.clear();
    qr.makeCode(link);
  }
}

function update() {
  const u = $("uid").value.trim(), z = $("zid").value.trim();
  const idMsg = $("idMsg");

  if (!u && !z) { idMsg.textContent = ""; idMsg.className = "msg"; }
  else if (validIds()) { idMsg.textContent = "Format looks good. Double-check your IDs."; idMsg.className = "msg ok"; }
  else { idMsg.textContent = "User ID is 5–12 digits and Zone ID is 3–6 digits."; idMsg.className = "msg err"; }

  const ready = validIds() && selected;
  $("payWait").hidden = !!ready;
  $("payReady").hidden = !ready;

  const btn = $("orderBtn");
  if (ready) {
    const label = selected.d ? selected.d.toLocaleString() + " diamonds" : selected.name;
    $("sumText").textContent = label;
    $("sumPrice").textContent = fmt(selected.price);

    const upiLink = "upi://pay?pa=" + encodeURIComponent(CONFIG.upiId) +
                    "&pn=" + encodeURIComponent(CONFIG.payeeName) +
                    "&am=" + selected.price.toFixed(2) +
                    "&cu=INR&tn=" + encodeURIComponent("Diamonds " + u);
    $("upiBtn").href = upiLink;
    showQR(upiLink);

    const text = [
      "New order – " + CONFIG.storeName,
      "Item: " + label,
      "Amount paid: " + fmt(selected.price) + " (UPI)",
      "User ID: " + u,
      "Zone ID: " + z,
      $("contact").value.trim() ? "Contact: " + $("contact").value.trim() : "",
      "Payment screenshot attached below."
    ].filter(Boolean).join("\n");
    btn.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text);
  }

  btn.setAttribute("aria-disabled", ready ? "false" : "true");
  if (!ready) btn.removeAttribute("href");
  $("orderMsg").textContent = ready ? "" : (selected ? "Enter a valid User ID and Zone ID." : "");
}

["uid", "zid", "contact"].forEach(id => $(id).addEventListener("input", update));
