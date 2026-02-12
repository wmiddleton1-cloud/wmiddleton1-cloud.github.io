const SHIPPING = 12.99;

// Put your payment links here later:
const PAYMENTS = {
  stripe: {
    hoodie: { dtg:"", puff:"", emb_s:"", emb_l:"" },
    long:   { dtg:"", puff:"", emb_s:"", emb_l:"" }
  },
  paypalVenmo: "" // PayPal checkout URL w/ Venmo enabled (optional)
};

const state = {
  cart: [],
  view: { hoodie:"front", long:"front" }
};

function money(n){ return `$${n.toFixed(2)}`; }

function setYear(){
  const y = document.getElementById("year");
  if(y) y.textContent = new Date().getFullYear();
}

function updatePrice(product){
  const methodSel = document.getElementById(product+"Method");
  const priceEl = document.getElementById(product+"Price");
  const opt = methodSel.selectedOptions[0];
  const price = parseFloat(opt.dataset.price);
  priceEl.textContent = money(price);
}

function syncText(product){
  const ta = document.getElementById(product+"Text");
  const preview = document.getElementById(product+"Txt");
  preview.textContent = ta.value.trim() || " ";
}

function setView(product, side){
  state.view[product] = side;

  if(product === "hoodie"){
    document.getElementById("hoodieImg").src = side === "front" ? "hoodie-front.png" : "hoodie-back.png";
  } else {
    document.getElementById("longImg").src = side === "front" ? "long-hood-front.png" : "long-hood-back.png";
  }
}

function addTilt(stageId, imgId){
  const stage = document.getElementById(stageId);
  const img = document.getElementById(imgId);

  let dragging = false;
  let lastX = 0;
  let rot = 0;

  stage.addEventListener("pointerdown", (e)=>{
    dragging = true;
    lastX = e.clientX;
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener("pointermove", (e)=>{
    if(!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;

    rot += dx * 0.18;
    rot = Math.max(-18, Math.min(18, rot));
    img.style.transform = `perspective(900px) rotateY(${rot}deg)`;
  });

  stage.addEventListener("pointerup", ()=>{
    dragging = false;
    rot = 0;
    img.style.transform = `perspective(900px) rotateY(0deg)`;
  });

  stage.addEventListener("pointercancel", ()=>{
    dragging = false;
    rot = 0;
    img.style.transform = `perspective(900px) rotateY(0deg)`;
  });
}

function addToCart(product){
  const methodSel = document.getElementById(product+"Method");
  const sizeSel = document.getElementById(product+"Size");
  const txt = document.getElementById(product+"Text").value.trim();
  const methodOpt = methodSel.selectedOptions[0];
  const method = methodSel.value;
  const price = parseFloat(methodOpt.dataset.price);

  const name = product === "hoodie" ? "Black Pullover Hoodie" : "Black Hooded Long Sleeve";

  state.cart.push({
    product, name,
    methodLabel: methodOpt.textContent.split("—")[0].trim(),
    method, size: sizeSel.value,
    text: txt,
    price
  });

  openCart();
  renderCart();
}

function cartSubtotal(){
  return state.cart.reduce((s,i)=>s+i.price,0);
}

function cartTotal(){
  if(state.cart.length === 0) return 0;
  return cartSubtotal() + SHIPPING;
}

function renderCart(){
  const body = document.getElementById("cartBody");
  const count = document.getElementById("cartCount");
  const totalEl = document.getElementById("cartTotal");

  count.textContent = state.cart.length;

  if(state.cart.length === 0){
    body.innerHTML = `<p class="small">Your cart is empty.</p>`;
    totalEl.textContent = money(0);
    return;
  }

  body.innerHTML = state.cart.map((item, idx)=>`
    <div class="line"></div>
    <div>
      <div style="font-weight:900; text-transform:uppercase; letter-spacing:1px;">${item.name}</div>
      <div class="small">${item.methodLabel} • Size ${item.size}</div>
      ${item.text ? `<div class="small">Text: "${escapeHtml(item.text)}"</div>` : `<div class="small">Text: (none)</div>`}
      <div class="row spread" style="margin-top:8px;">
        <div class="small">${money(item.price)}</div>
        <button class="btn tiny ghost" onclick="removeItem(${idx})">Remove</button>
      </div>
    </div>
  `).join("");

  totalEl.textContent = money(cartTotal());
}

function removeItem(idx){
  state.cart.splice(idx,1);
  renderCart();
}

function openCart(){
  document.getElementById("drawer").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}
function closeCart(){
  document.getElementById("drawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

function buyNow(product){
  addToCart(product);
  // Could jump straight to checkout links after render, but we keep it clean.
}

function checkoutLinks(){
  alert(
    "Checkout links are not connected yet.\\n\\nNext step:\\n1) Create Stripe Payment Links for each product/method (Apple Pay + Cash App Pay)\\n2) Paste links into script.js (PAYMENTS.stripe...)\\n3) Optional: paste PayPal link for Venmo."
  );
}

function wire(){
  // price updates + live text
  ["hoodie","long"].forEach(p=>{
    document.getElementById(p+"Method").addEventListener("change", ()=>updatePrice(p));
    document.getElementById(p+"Text").addEventListener("input", ()=>syncText(p));
    updatePrice(p);
    syncText(p);
  });

  // viewer buttons
  document.querySelectorAll(".viewer").forEach(viewer=>{
    const p = viewer.dataset.product;
    viewer.querySelectorAll("[data-action]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        setView(p, btn.dataset.action);
      });
    });
  });

  // tilt
  addTilt("hoodieStage","hoodieImg");
  addTilt("longStage","longImg");

  // cart
  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("closeCart").addEventListener("click", closeCart);
  document.getElementById("overlay").addEventListener("click", closeCart);

  // add/buy buttons
  document.querySelectorAll("[data-add]").forEach(btn=>{
    btn.addEventListener("click", ()=>addToCart(btn.dataset.add));
  });
  document.querySelectorAll("[data-buy]").forEach(btn=>{
    btn.addEventListener("click", ()=>buyNow(btn.dataset.buy));
  });

  document.getElementById("checkoutBtn").addEventListener("click", checkoutLinks);

  renderCart();
  setYear();

  // light anti-copy
  document.addEventListener("contextmenu", e=>e.preventDefault());
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g, (m)=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

wire();
