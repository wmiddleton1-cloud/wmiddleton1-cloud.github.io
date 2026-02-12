let side = "front";
let rot = 0;
let dragging = false;
let lastX = 0;

function setSide(which){
  side = which;

  // Blank images (you must upload these)
  const front = "hoodie-blank-front.PNG";
  const back  = "hoodie-blank-back.PNG";

  const img = document.getElementById("mockImg");
  img.src = (which === "front") ? front : back;
}

function updateText(){
  const input = document.getElementById("customText").value.trim();
  const overlay = document.getElementById("textOverlay");

  overlay.textContent = input || " ";
  autoFitText();
}

function autoFitText(){
  const overlay = document.getElementById("textOverlay");

  // Start big, shrink until it fits inside its own width
  let size = 34;                 // max font size
  const min = 12;                // min font size
  overlay.style.fontSize = size + "px";

  // shrink loop
  while (overlay.scrollWidth > overlay.clientWidth && size > min){
    size -= 1;
    overlay.style.fontSize = size + "px";
  }
}

// Better “turn/tilt”
(function enableTilt(){
  const viewer = document.getElementById("viewer");
  const img = document.getElementById("mockImg");

  // iPhone: prevent page scroll while dragging on viewer
  viewer.addEventListener("touchmove", (e) => e.preventDefault(), { passive:false });

  viewer.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
    viewer.setPointerCapture(e.pointerId);
  });

  viewer.addEventListener("pointermove", (e) => {
    if(!dragging) return;

    const dx = e.clientX - lastX;
    lastX = e.clientX;

    // allow more “turn”
    rot += dx * 0.35;

    // wrap 360 (still a single-image fake “turn”, but feels better)
    if(rot > 180) rot -= 360;
    if(rot < -180) rot += 360;

    img.style.transform = `perspective(900px) rotateY(${rot}deg)`;
  });

  viewer.addEventListener("pointerup", () => {
    dragging = false;
    // settle back slightly (optional). comment out if you want it to stay rotated.
    rot *= 0.35;
    img.style.transform = `perspective(900px) rotateY(${rot}deg)`;
  });

  viewer.addEventListener("pointercancel", () => {
    dragging = false;
  });
})();

function checkout(){
  const price = parseFloat(document.getElementById("printType").value);
  const shipping = 12.99;
  const total = price + shipping;

  alert(
    "Total: $" + total.toFixed(2) +
    "\nShipping: $12.99 (USA Only)" +
    "\n\nNext step: connect Stripe Payment Links (Apple Pay + Cash App Pay) + PayPal (Venmo)."
  );
}

// Initialize overlay sizing
window.addEventListener("load", () => {
  updateText();
});
