const TOTAL=20;
const $=s=>document.querySelector(s);
const home=$('#home'),viewer=$('#viewer'),list=$('#listScreen');
const img=$('#questionImage'),counter=$('#counter'),bar=$('#progressBar');
let current=Number(localStorage.getItem('cfc-last')||1);
let favorites=new Set(JSON.parse(localStorage.getItem('cfc-favs')||'[]'));
let studied=new Set(JSON.parse(localStorage.getItem('cfc-studied')||'[]'));
let touchX=0;
function file(n){return `imagens/${String(n).padStart(2,'0')}.png`}
function save(){localStorage.setItem('cfc-last',current);localStorage.setItem('cfc-favs',JSON.stringify([...favorites]));localStorage.setItem('cfc-studied',JSON.stringify([...studied]));}
function show(section){[home,viewer,list].forEach(x=>x.classList.add('hidden'));section.classList.remove('hidden');window.scrollTo(0,0)}
function render(){current=Math.max(1,Math.min(TOTAL,current));img.src=file(current);img.alt=`Questão ${current}`;counter.textContent=`Questão ${current} de ${TOTAL}`;bar.style.width=`${current/TOTAL*100}%`;$('#prevBtn').disabled=current===1;$('#nextBtn').disabled=current===TOTAL;$('#favBtn').textContent=favorites.has(current)?'★':'☆';studied.add(current);save();updateHome();window.scrollTo(0,0)}
function go(n){current=n;show(viewer);render()}
function updateHome(){$('#totalHome').textContent=TOTAL;$('#doneHome').textContent=studied.size;$('#continueBtn').style.display=localStorage.getItem('cfc-last')?'block':'none'}
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1700)}
function drawer(open){$('#drawer').classList.toggle('open',open);$('#overlay').classList.toggle('show',open);$('#drawer').setAttribute('aria-hidden',String(!open))}
function buildGrid(mode='all'){const grid=$('#questionGrid');grid.innerHTML='';let nums=[...Array(TOTAL)].map((_,i)=>i+1);if(mode==='favorites')nums=nums.filter(n=>favorites.has(n));$('#listTitle').textContent=mode==='favorites'?'Questões favoritas':'Todas as questões';if(!nums.length)grid.innerHTML='<p>Nenhuma questão favorita ainda.</p>';nums.forEach(n=>{const b=document.createElement('button');b.className=`q-card ${studied.has(n)?'done':''} ${favorites.has(n)?'fav':''}`;b.innerHTML=`<img src="${file(n)}" loading="lazy" alt="Questão ${n}"><b>Questão ${n}</b>`;b.onclick=()=>go(n);grid.appendChild(b)});show(list)}
$('#startBtn').onclick=()=>go(1);$('#continueBtn').onclick=()=>go(Number(localStorage.getItem('cfc-last')||1));
$('#prevBtn').onclick=()=>go(current-1);$('#nextBtn').onclick=()=>go(current+1);$('#gridBtn').onclick=()=>buildGrid();$('#backViewer').onclick=()=>go(current);
$('#favBtn').onclick=()=>{favorites.has(current)?favorites.delete(current):favorites.add(current);save();render();toast(favorites.has(current)?'Adicionada às favoritas':'Removida das favoritas')};
$('#zoomBtn').onclick=()=>{$('#zoomImage').src=file(current);$('#zoomModal').classList.add('show');$('#zoomModal').setAttribute('aria-hidden','false')};$('#closeZoom').onclick=()=>{$('#zoomModal').classList.remove('show');$('#zoomModal').setAttribute('aria-hidden','true')};
$('#menuBtn').onclick=()=>drawer(true);$('#closeDrawer').onclick=()=>drawer(false);$('#overlay').onclick=()=>drawer(false);
$('#imageStage').addEventListener('touchstart',e=>touchX=e.changedTouches[0].screenX,{passive:true});$('#imageStage').addEventListener('touchend',e=>{const d=e.changedTouches[0].screenX-touchX;if(Math.abs(d)>70){d<0&&current<TOTAL?go(current+1):d>0&&current>1&&go(current-1)}},{passive:true});
$('#drawer').addEventListener('click',e=>{const a=e.target.dataset.action;if(!a)return;drawer(false);if(a==='home')show(home);if(a==='goto'){const n=Number(prompt(`Digite uma questão de 1 a ${TOTAL}:`));if(n>=1&&n<=TOTAL)go(n)}if(a==='favorites')buildGrid('favorites');if(a==='resume')go(Number(localStorage.getItem('cfc-last')||1));if(a==='reset'&&confirm('Deseja apagar o progresso e as favoritas?')){localStorage.removeItem('cfc-last');localStorage.removeItem('cfc-favs');localStorage.removeItem('cfc-studied');favorites=new Set();studied=new Set();current=1;updateHome();show(home);toast('Progresso reiniciado')}if(a==='about')alert('QUESTÕES DO CFC\nCurso de Contabilidade Professor Moreira\nPWA de estudo com questões comentadas em imagens.')});
window.addEventListener('keydown',e=>{if(viewer.classList.contains('hidden'))return;if(e.key==='ArrowLeft'&&current>1)go(current-1);if(e.key==='ArrowRight'&&current<TOTAL)go(current+1)});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js'));
updateHome();
