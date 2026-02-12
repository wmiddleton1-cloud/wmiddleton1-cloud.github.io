let currentSide = "front";

function syncText(){
  const txt = document.getElementById("hoodieText").value.trim();
  document.getElementById("hoodieTextPreview").innerText = txt || " ";
}

function setView(side){
  currentSide = side;
  const img = document.getElementById("hoodieImg");
  img.src = (side === "front") ? "hoodie-front.PNG" : "hoodie-back.PNG";
}

/* drag tilt */
(function addTilt(){
  const viewer = document.getElementById("hoodieViewer");
  const img = document.getElementById("hoodieImg");

  let dragging = false;
  let lastX = 0;
  let rot = 0;

  viewer.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
    viewer.setPointerCapture(e.pointerId);
  });

  viewer.addEventListener("pointermove", (e) => {
    if(!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;

    rot += dx * 0.18;
    rot = Math.max(-18, Math.min(18, rot));
    img.style.transform = `perspective(900px) rotateY(${rot}deg)`;
  });

  viewer.addEventListener("pointerup", () => {
    dragging = false;
    rot = 0;
    img.style.transform = `perspective(900px) rotateY(0deg)`;
  });

  viewer.addEventListener("pointercancel", () => {
    dragging = false;
    rot = 0;
    img.style.transform = `perspective(900px) rotateY(0deg)`;
  });
})();

function checkout(){
  const price = parseFloat(document.getElementById("hoodiePrint").value);
  const shipping = 12.99;
  const total = price + shipping;

  alert(
    "Total: $" + total.toFixed(2) +
    "\nShipping: $12.99 (USA Only)" +
    "\n\nNext step: connect Stripe Payment Links (Apple Pay + Cash App Pay) + PayPal (Venmo)."
  );
}
