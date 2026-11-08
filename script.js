// Generate Dynamic Star Field
const starLayer = document.getElementById('stars');
for(let i = 0; i < 190; i++){
  const s = document.createElement('span');
  s.className = 'star';
  s.style.left = Math.random() * 100 + '%';
  s.style.top = Math.random() * 78 + '%';
  s.style.animationDelay = Math.random() * 4 + 's';
  s.style.opacity = .2 + Math.random() * .8;
  starLayer.appendChild(s);
}

// Generate Skyline Silhouettes
const city = document.getElementById('city');
for(let i = 0; i < 34; i++){
  const b = document.createElement('div');
  b.className = 'building';
  b.style.width = (1.5 + Math.random() * 2.8) + '%';
  b.style.height = (20 + Math.random() * 80) + '%';
  city.appendChild(b);
}

// Canvas & Particle Engine Setup
const rc = document.getElementById('rocketCanvas'), rctx = rc.getContext('2d');
const fc = document.getElementById('fireworkCanvas'), fctx = fc.getContext('2d');
let W = innerWidth, H = innerHeight, D = Math.min(devicePixelRatio || 1, 2);

function resize(){
  W = innerWidth; H = innerHeight; D = Math.min(devicePixelRatio || 1, 2);
  [rc, fc].forEach(c => { c.width = W * D; c.height = H * D; c.style.width = W + 'px'; c.style.height = H + 'px'; });
  rctx.setTransform(D, 0, 0, D, 0, 0);
  fctx.setTransform(D, 0, 0, D, 0, 0);
}
resize();
window.addEventListener('resize', resize);

const palette = ['#ffe7ad', '#ffb84d', '#fff5d5', '#ff7c9b', '#d6c2ff', '#ffdf91', '#8ee7ff'];
let sparks = [], rockets = [], cinema = false;

function firework(x, y){
  const count = 150, hue = palette[Math.floor(Math.random() * palette.length)];
  for(let i = 0; i < count; i++){
    let a = Math.random() * Math.PI * 2, speed = Math.random() * 4.8 + 0.5;
    sparks.push({
      x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
      life: 65 + Math.random() * 45, max: 110,
      color: Math.random() < .65 ? hue : palette[Math.floor(Math.random() * palette.length)],
      r: .7 + Math.random() * 1.8, twinkle: Math.random()
    });
  }
}

function launchRocket(customX){
  const x = customX !== undefined ? customX : W * (.08 + Math.random() * .84);
  const startY = H + 20, targetY = H * (.16 + Math.random() * .42);
  rockets.push({ x, y: startY, tx: x + (Math.random() - .5) * 70, ty: targetY, v: 5 + Math.random() * 3, trail: [] });
}

function draw(){
  rctx.clearRect(0, 0, W, H);
  fctx.clearRect(0, 0, W, H);

  // Render Rockets
  for(let i = rockets.length - 1; i >= 0; i--){
    let r = rockets[i];
    r.trail.push({ x: r.x, y: r.y });
    if(r.trail.length > 14) r.trail.shift();
    r.y -= r.v;
    r.x += (r.tx - r.x) * .015;
    
    rctx.beginPath();
    rctx.moveTo(r.x, r.y);
    for(let t = r.trail.length - 1; t >= 0; t--) rctx.lineTo(r.trail[t].x, r.trail[t].y);
    rctx.strokeStyle = '#ffc66b'; rctx.lineWidth = 2; rctx.shadowBlur = 18; rctx.shadowColor = '#ff9d37'; rctx.stroke();
    rctx.fillStyle = '#fff9df'; rctx.beginPath(); rctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2); rctx.fill();
    
    if(r.y <= r.ty){
      firework(r.x, r.y);
      rockets.splice(i, 1);
    }
  }

  // Render Fireworks Sparks
  for(let i = sparks.length - 1; i >= 0; i--){
    let p = sparks[i];
    p.x += p.vx; p.y += p.vy;
    p.vx *= .985; p.vy = p.vy * .985 + .035;
    p.life--;
    let alpha = Math.max(0, p.life / p.max);
    if(p.twinkle > .7 && Math.random() < .15) alpha *= .25;
    
    fctx.globalAlpha = alpha;
    fctx.fillStyle = p.color;
    fctx.shadowBlur = 14;
    fctx.shadowColor = p.color;
    fctx.beginPath();
    fctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    fctx.fill();
    
    if(p.life <= 0) sparks.splice(i, 1);
  }
  fctx.globalAlpha = 1; rctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}
draw();

// Cinema Trigger & Timelines
function startCinema(){
  document.getElementById('intro').classList.add('hide');
  cinema = true;

  setTimeout(() => launchRocket(), 500);
  setTimeout(() => launchRocket(), 1700);
  setTimeout(() => launchRocket(), 2800);
  setTimeout(() => document.getElementById('letter').classList.add('show'), 3900);
  setTimeout(() => firework(W * .18, H * .22), 4500);
  setTimeout(() => firework(W * .82, H * .24), 5200);
  setTimeout(() => firework(W * .5, H * .13), 6500);

  setInterval(() => { if(cinema) launchRocket(); }, 1700);
  setInterval(() => { if(cinema && Math.random() < .65) firework(W * (.12 + Math.random() * .76), H * (.12 + Math.random() * .38)); }, 3000);
}

function showSecret(){
  document.getElementById('secret').style.display = 'block';
  firework(W * .5, H * .25);
  document.getElementById('secretBtn').textContent = 'A little wish from my heart ❤️';
}

// Interactive Touch/Click Handler for Custom Fireworks
window.addEventListener('pointerdown', (e) => {
  if(!cinema) return;
  if(e.target.tagName === 'BUTTON') return;
  launchRocket(e.clientX);
});