/* ===== EDIT THIS SECTION ===== */
const CONFIG = {
  storeName: "Paoh Official Store",
  whatsapp: "5511999999999",   // your number: country code + digits, no + or spaces
  currency: "R$",
  locale: "pt-BR"
};

// Prices are EXAMPLES. Set each to your Smile One cost + your margin.
const PACKS = [
  { d: 86,   price: 9.90 },
  { d: 172,  price: 19.50 },
  { d: 257,  price: 29.00 },
  { d: 344,  price: 38.50 },
  { d: 514,  price: 57.00 },
  { d: 706,  price: 77.00 },
  { d: 1412, price: 152.00 },
  { d: 2195, price: 235.00 },
  { d: 0, name: "Weekly Pass", note: "Daily diamonds for 7 days", price: 14.90 }
];
/* ============================= */

const $ = id => document.getElementById(id);
const fmt = n => CONFIG.currency + " " + n.toLocaleString(CONFIG.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
let selected = null;

$("supportLink").href = "https://wa.me/" + CONFIG.whatsapp;

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

function update() {
  const u = $("uid").value.trim(), z = $("zid").value.trim();
  const idMsg = $("idMsg");

  if (!u && !z) { idMsg.textContent = ""; idMsg.className = "msg"; }
  else if (validIds()) { idMsg.textContent = "Format looks good. Double-check your IDs."; idMsg.className = "msg ok"; }
  else { idMsg.textContent = "User ID is 5–12 digits and Zone ID is 3–6 digits."; idMsg.className = "msg err"; }

  const ready = validIds() && selected;
  const btn = $("orderBtn");

  if (selected) {
    const label = selected.d ? selected.d.toLocaleString() + " diamonds" : selected.name;
    $("sumText").textContent = label;
    $("sumPrice").textContent = fmt(selected.price);
    const text = [
      "New order – " + CONFIG.storeName,
      "Item: " + label,
      "Price: " + fmt(selected.price),
      "User ID: " + u,
      "Zone ID: " + z,
      $("contact").value.trim() ? "Contact: " + $("contact").value.trim() : ""
    ].filter(Boolean).join("\n");
    btn.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text);
  }

  btn.setAttribute("aria-disabled", ready ? "false" : "true");
  if (!ready) btn.removeAttribute("href");
  $("orderMsg").textContent = ready ? "" : (selected ? "Enter a valid User ID and Zone ID." : "");
}

["uid", "zid", "contact"].forEach(id => $(id).addEventListener("input", update));
