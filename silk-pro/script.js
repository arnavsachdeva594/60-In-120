const canvas = document.getElementById('c'),
      ctx    = canvas.getContext('2d'),
      dpr    = window.devicePixelRatio || 1;
let W,H;
function resize(){
  W = canvas.width  = innerWidth * dpr;
  H = canvas.height = innerHeight * dpr;
  canvas.style.width  = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.scale(dpr,dpr);
}
window.addEventListener('resize', resize);
resize();

const CTL = {
  sym:       document.getElementById('sym'),
  size:      document.getElementById('size'),
  fade:      document.getElementById('fade'),
  brush:     document.getElementById('brushType'),
  start:     document.getElementById('colStart'),
  end:       document.getElementById('colEnd'),
  rand:      document.getElementById('randPalette'),
  undo:      document.getElementById('undo'),
  clear:     document.getElementById('clear'),
  save:      document.getElementById('save'),
  toggle:    document.getElementById('toggleBtn'),
  sidebar:   document.getElementById('sidebar'),
  sliders:   document.querySelectorAll('input[type=range]')
};

CTL.toggle.addEventListener('click', () => {
  CTL.sidebar.classList.toggle('collapsed');
});

CTL.rand.addEventListener('click', () => {
  const rnd = () => Math.floor(Math.random()*0xFFFFFF)
                       .toString(16).padStart(6,'0');
  CTL.start.value = `#${rnd()}`;
  CTL.end.value   = `#${rnd()}`;
});

const history = [];
CTL.clear.addEventListener('click', () => {
  history.length = 0;
  const bg = getComputedStyle(document.body).getPropertyValue('--bg')?.trim();
  ctx.fillStyle = bg || '#111111';
  ctx.fillRect(0, 0, innerWidth, innerHeight);
});
CTL.undo.addEventListener('click', () => {
  if (history.length) ctx.putImageData(history.pop(),0,0);
});
CTL.save.addEventListener('click', () => {
  const a = document.createElement('a');
  a.download = 'silk-pro-vibe.png';
  a.href     = canvas.toDataURL();
  a.click();
});

function styleFill(slider){
  const pct = (slider.value - slider.min)/(slider.max - slider.min)*100;
  slider.style.background = 
    `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, rgba(255,255,255,0.2) ${pct}%, rgba(255,255,255,0.2) 100%)`;
}
CTL.sliders.forEach(s => {
  styleFill(s);
  s.addEventListener('input', () => styleFill(s));
});

let drawing=false, pts=[];
function down(e){
  drawing=true; pts=[];
  history.push(ctx.getImageData(0,0,innerWidth,innerHeight));
  if(history.length>20) history.shift();
}
function up(){ drawing=false; pts=[]; }
function move(e){
  if(!drawing) return;
  const x = e.clientX || e.touches[0].clientX,
        y = e.clientY || e.touches[0].clientY;
  pts.push({x,y});
  if(pts.length>60) pts.shift();
}
['mousedown','touchstart'].forEach(ev=>canvas.addEventListener(ev,down));
['mouseup','mouseleave','touchend'].forEach(ev=>canvas.addEventListener(ev,up));
['mousemove','touchmove'].forEach(ev=>{
  canvas.addEventListener(ev, e=>{e.preventDefault(); move(e);});
});

function lerp(a,b,t){
  const A=parseInt(a.slice(1),16), B=parseInt(b.slice(1),16);
  const [ar,ag,ab]=[A>>16,(A>>8)&0xff,A&0xff],
        [br,bg,bb]=[B>>16,(B>>8)&0xff,B&0xff];
  const rr=ar+(br-ar)*t, gg=ag+(bg-ag)*t, bb2=ab+(bb-ab)*t;
  return `rgb(${rr|0},${gg|0},${bb2|0})`;
}

function drawBrush(type, dx, dy, size, col, p0x, p0y){
  switch(type){
    case 'circle':
      ctx.fillStyle=col; ctx.beginPath();
      ctx.arc(dx,dy,size*1.5,0,2*Math.PI); ctx.fill();
      break;
    case 'square':
      ctx.fillStyle=col; ctx.save();
      ctx.translate(dx,dy); ctx.rotate(Math.PI/4);
      ctx.fillRect(-size,-size,size*2,size*2); ctx.restore();
      break;
    case 'spray':
      ctx.fillStyle=col;
      for(let i=0;i<size*5;i++){
        const a=Math.random()*2*Math.PI, r=Math.random()*size*4;
        ctx.fillRect(dx+Math.cos(a)*r, dy+Math.sin(a)*r,1,1);
      }
      break;
    default:
      ctx.strokeStyle=col; ctx.lineWidth=size; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(p0x,p0y); ctx.lineTo(dx,dy); ctx.stroke();
  }
}

function draw(){
  ctx.fillStyle=`rgba(17,17,17,${parseFloat(CTL.fade.value)})`;
  ctx.fillRect(0,0,innerWidth,innerHeight);

  if(pts.length>1){
    const sym=+CTL.sym.value, sz=+CTL.size.value,
          type=CTL.brush.value, c0=CTL.start.value, c1=CTL.end.value;

    for(let i=1;i<pts.length;i++){
      const p0=pts[i-1], p1=pts[i], t=i/(pts.length-1),
            col=lerp(c0,c1,t),
            dx1=p1.x-innerWidth/2, dy1=p1.y-innerHeight/2,
            dx0=p0.x-innerWidth/2, dy0=p0.y-innerHeight/2;

      for(let s=0;s<sym;s++){
        const ang=(2*Math.PI/sym)*s;
        ctx.save(); ctx.translate(innerWidth/2,innerHeight/2); ctx.rotate(ang);
          drawBrush(type,dx1,dy1,sz,col,dx0,dy0);
          ctx.scale(-1,1);
          drawBrush(type,dx1,dy1,sz,col,dx0,dy0);
        ctx.restore();
      }
    }
  }

  requestAnimationFrame(draw);
}

const initBG = getComputedStyle(document.body).getPropertyValue('--bg')?.trim();
ctx.fillStyle = initBG || '#111111';
ctx.fillRect(0,0,innerWidth,innerHeight);
draw();
