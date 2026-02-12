let side="front";
let rot=0;
let dragging=false;
let lastX=0;

function setSide(s){
  side=s;
  document.getElementById("hoodieImg").src =
    (s==="front")
      ? "hoodie-blank-front.PNG"
      : "hoodie-blank-back.PNG";
}

function updateText(){
  const input=document.getElementById("textInput").value;
  const overlay=document.getElementById("textOverlay");
  overlay.textContent=input||" ";
  autoFit();
}

function autoFit(){
  const overlay=document.getElementById("textOverlay");
  let size=34;
  overlay.style.fontSize=size+"px";
  while(overlay.scrollWidth>overlay.clientWidth && size>12){
    size--;
    overlay.style.fontSize=size+"px";
  }
}

/* Smooth tilt */
(function(){
  const viewer=document.getElementById("viewer");
  const img=document.getElementById("hoodieImg");

  viewer.addEventListener("pointerdown",e=>{
    dragging=true;
    lastX=e.clientX;
    viewer.setPointerCapture(e.pointerId);
  });

  viewer.addEventListener("pointermove",e=>{
    if(!dragging) return;
    const dx=e.clientX-lastX;
    lastX=e.clientX;
    rot+=dx*0.4;
    img.style.transform=`perspective(900px) rotateY(${rot}deg)`;
  });

  viewer.addEventListener("pointerup",()=>dragging=false);
  viewer.addEventListener("pointercancel",()=>dragging=false);
})();

function checkout(){
  const price=document.getElementById("price").value;
  const shipping=12.99;
  const total=parseFloat(price)+shipping;
  alert("Total: $"+total.toFixed(2)+" (Apple Pay setup next)");
}

window.onload=updateText;
