const canvas = document.getElementById('c'),
      ctx    = canvas.getContext('2d'),
      dpr    = window.devicePixelRatio || 1;

let W, H;
function resize(){
  W = canvas.width  = innerWidth * dpr;
  H = canvas.height = innerHeight * dpr;
  canvas.style.width  = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.scale(dpr, dpr);
}
window.addEventListener('resize', resize);
resize();

const ctl = {
  sym:       document.getElementById('sym'),
  symVal:    document.getElementById('symVal'),
  size:      document.getElementById('size'),
  sizeVal:   document.getElementById('sizeVal'),
  fade:      document.getElementById('fade'),
  fadeVal:   document.getElementById('fadeVal'),
  brushType: document.getElementById('brushType'),
  colStart:  document.getElementById('colStart'),
  colEnd:    document.getElementById('colEnd'),
  randPalette: document.getElementById('randPalette'),
  undo:      document.getElementById('undo'),
  clear:     document.getElementById('clear'),
  save:      document.getElementById('save'),
};
function updateLabels(){
  ctl.symVal.textContent  = ctl.sym.value;
  ctl.sizeVal.textContent = ctl.size.value;
  ctl.fadeVal.textContent = ctl.fade.value;
}
Object.values(ctl).forEach(el=>{
  if(el.tagName==='INPUT') el.addEventListener('input', updateLabels);
});
updateLabels();

ctl.randPalette.addEventListener('click', ()=>{
  const rnd = ()=>Math.floor(Math.random()*0xFFFFFF).toString(16).padStart(6,'0');
  ctl.colStart.value = `#${rnd()}`;
  ctl.colEnd.value   = `#${rnd()}`;
});

const history = [];
ctl.clear.addEventListener('click', ()=>{
  history.length = 0;
  ctx.fillStyle='#111'; ctx.fillRect(0,0,innerWidth,innerHeight);
});
ctl.undo.addEventListener('click', ()=>{
  if(history.length) ctx.putImageData(history.pop(),0,0);
});
ctl.save.addEventListener('click', ()=>{
  const a = document.createElement('a');
  a.download = 'silk-pro-brushes.png';
  a.href = canvas.toDataURL();
  a.click();
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
  const x = (e.clientX||e.touches[0].clientX),
        y = (e.clientY||e.touches[0].clientY);
  pts.push({x,y});
  if(pts.length>60) pts.shift();
}
['mousedown','touchstart'].forEach(ev=>canvas.addEventListener(ev,down));
['mouseup','mouseleave','touchend'].forEach(ev=>canvas.addEventListener(ev,up));
['mousemove','touchmove'].forEach(ev=>{
  canvas.addEventListener(ev,e=>{ e.preventDefault(); move(e); });
});

function lerpColor(a,b,t){
  const A=parseInt(a.slice(1),16), B=parseInt(b.slice(1),16);
  const [ar,ag,ab] = [A>>16, (A>>8)&0xff, A&0xff];
  const [br,bg,bb] = [B>>16, (B>>8)&0xff, B&0xff];
  const rr = Math.round(ar + (br-ar)*t),
        gg = Math.round(ag + (bg-ag)*t),
        bb2= Math.round(ab + (bb-ab)*t);
  return `rgb(${rr},${gg},${bb2})`;
}

function draw(){
  ctx.fillStyle = `rgba(17,17,17,${parseFloat(ctl.fade.value)})`;
  ctx.fillRect(0,0,innerWidth,innerHeight);

  if(pts.length>1){
    const s    = +ctl.sym.value,
          bw   = +ctl.size.value,
          start= ctl.colStart.value,
          end  = ctl.colEnd.value,
          brush= ctl.brushType.value;

    for(let i=1; i<pts.length; i++){
      const p0 = pts[i-1], p1 = pts[i];
      const t  = i/(pts.length-1);
      const col= lerpColor(start,end,t);
      
      for(let k=0; k<s; k++){
        const ang = (Math.PI*2/s)*k;
        ctx.save();
        ctx.translate(innerWidth/2, innerHeight/2);
        ctx.rotate(ang);

        switch(brush){
          case 'circle':
            ctx.fillStyle = col;
            ctx.beginPath();
            ctx.arc(p1.x - innerWidth/2, p1.y - innerHeight/2, bw*1.5, 0, 2*Math.PI);
            ctx.fill();
            break;

          case 'square':
            ctx.fillStyle = col;
            const size = bw*2;
            ctx.save();
            ctx.translate(p1.x - innerWidth/2, p1.y - innerHeight/2);
            ctx.rotate(Math.PI/4);
            ctx.fillRect(-size/2, -size/2, size, size);
            ctx.restore();
            break;

          case 'spray':
            for(let j=0; j< bw*5; j++){
              const angle = Math.random()*2*Math.PI;
              const radius= Math.random()*bw*4;
              const sx = p1.x - innerWidth/2 + Math.cos(angle)*radius;
              const sy = p1.y - innerHeight/2 + Math.sin(angle)*radius;
              ctx.fillStyle = col;
              ctx.fillRect(sx, sy, 1, 1);
            }
            break;

          default: // 'line'
            ctx.strokeStyle = col;
            ctx.lineCap     = 'round';
            ctx.lineWidth   = bw;
            ctx.beginPath();
            ctx.moveTo(p0.x - innerWidth/2, p0.y - innerHeight/2);
            ctx.lineTo(p1.x - innerWidth/2, p1.y - innerHeight/2);
            ctx.stroke();
        }

        ctx.scale(-1,1);
        switch(brush){
          case 'circle':
            ctx.fillStyle = col;
            ctx.beginPath();
            ctx.arc(p1.x - innerWidth/2, p1.y - innerHeight/2, bw*1.5, 0, 2*Math.PI);
            ctx.fill();
            break;
          case 'square':
            ctx.fillStyle = col;
            const sz = bw*2;
            ctx.save();
            ctx.translate(p1.x - innerWidth/2, p1.y - innerHeight/2);
            ctx.rotate(Math.PI/4);
            ctx.fillRect(-sz/2, -sz/2, sz, sz);
            ctx.restore();
            break;
          case 'spray':
            for(let j=0; j< bw*5; j++){
              const angle = Math.random()*2*Math.PI;
              const radius= Math.random()*bw*4;
              const sx = p1.x - innerWidth/2 + Math.cos(angle)*radius;
              const sy = p1.y - innerHeight/2 + Math.sin(angle)*radius;
              ctx.fillStyle = col;
              ctx.fillRect(sx, sy, 1, 1);
            }
            break;
          default:
            ctx.strokeStyle = col;
            ctx.lineCap     = 'round';
            ctx.lineWidth   = bw;
            ctx.beginPath();
            ctx.moveTo(p0.x - innerWidth/2, p0.y - innerHeight/2);
            ctx.lineTo(p1.x - innerWidth/2, p1.y - innerHeight/2);
            ctx.stroke();
        }

        ctx.restore();
      }
    }
  }

  requestAnimationFrame(draw);
}

ctx.fillStyle = '#111'; ctx.fillRect(0,0,innerWidth,innerHeight);
draw();
