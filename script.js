const $=s=>document.querySelector(s),app=$('#app');
const order=['splash','home','learn','act','result','progress','profile','about','welcome'];
let cur='splash';
function go(id,fwd){
  if(id===cur)return;
  const a=$('#'+cur),b=$('#'+id);
  app.classList.toggle('back',!fwd&&order.indexOf(id)<order.indexOf(cur)&&id!=='splash');
  a.classList.remove('active');a.classList.add('left');
  requestAnimationFrame(()=>{b.classList.remove('left');b.classList.add('active')});
  setTimeout(()=>a.classList.remove('left'),500);
  cur=id;
  if(id==='progress')setTimeout(drawProgress,250);
}
document.addEventListener('click',e=>{
  if(e.target.closest('[data-about]'))return openAbout();
  if(e.target.closest('[data-rename]'))return showWelcome();
  const g=e.target.closest('[data-go]');if(g)return go(g.dataset.go);
  const m=e.target.closest('[data-act]');if(m)start(m.dataset.act);
});
/* name */
let userName='';try{userName=localStorage.getItem('sf-name')||''}catch(e){}
const setName=n=>document.querySelectorAll('.pname').forEach(x=>x.textContent=n);
if(userName)setName(userName);
const nIn=$('#nameIn'),nGo=$('#nameGo'),nCancel=$('#nameCancel');
function showWelcome(){nIn.value=userName;nGo.disabled=!userName;nCancel.hidden=!userName;go('welcome',true);setTimeout(()=>nIn.focus({preventScroll:true}),600)}
function saveName(){const v=nIn.value.trim().replace(/\s+/g,' ');if(!v)return;userName=v;setName(v);try{localStorage.setItem('sf-name',v)}catch(e){}nIn.blur();go('home',true)}
nIn.oninput=()=>{nGo.disabled=!nIn.value.trim()};
nIn.onkeydown=e=>{if(e.key==='Enter')saveName()};
nGo.onclick=saveName;
nCancel.onclick=()=>go('profile');
setTimeout(()=>userName?go('home'):showWelcome(),2400);
function openAbout(){
  const sp=$('#splash');sp.innerHTML=sp.innerHTML; /* restarts the logo animation */
  go('splash');
  setTimeout(()=>{if(cur==='splash')go('about')},2600);
}

/* learn slides */
let sl=0;
$('#learnNext').onclick=()=>{
  const s=document.querySelectorAll('.slide');
  if(sl<s.length-1){s[sl].classList.remove('on');s[++sl].classList.add('on');
    document.querySelectorAll('.dots i').forEach((d,i)=>d.classList.toggle('on',i===sl));
    if(sl===s.length-1)$('#learnNext').textContent='Start practising';}
  else{sl=0;s.forEach((x,i)=>x.classList.toggle('on',i===0));document.querySelectorAll('.dots i').forEach((d,i)=>d.classList.toggle('on',i===0));$('#learnNext').textContent='Next';start('arrange')}
};

/* activities */
const D={
 arrange:{t:'Arrange It',cls:'h',tip:'In English, the basic sentence order is Subject + Verb + Object. Extra phrases can go at the end.',
  q:[
  {w:['the students','stayed inside','during recess','because it was raining'],a:'The students stayed inside during recess because it was raining.',e:'The main clause comes first. The clause "because it was raining" explains the reason, so it follows.'},
  {w:['the teacher','talked to the parents','in the faculty room','after the meeting'],a:'The teacher talked to the parents in the faculty room after the meeting.',e:'Subject + verb phrase come first. Then the place ("in the faculty room"), then the time ("after the meeting").'},
  {w:['although he was tired','Mark','continued studying','for the examination'],a:'Although he was tired, Mark continued studying for the examination.',e:'A clause beginning with "although" can open the sentence. Put a comma after it, then the main clause.'},
  {w:['when the bell rang','the students','left the classroom','immediately'],a:'When the bell rang, the students left the classroom immediately.',e:'"When the bell rang" sets the time, so it goes first with a comma. The main clause follows.'},
  {w:['the student','who won the competition','received a certificate','from the principal'],a:'The student who won the competition received a certificate from the principal.',e:'"Who won the competition" describes "the student", so it must come right after it.'}]},
 fix:{t:'Fix the Order',cls:'',tip:'Check the basic sentence pattern. Ask yourself: Who? Does what? What/whom? Then check where the additional information belongs.',
  q:[
  {g:['school','to','goes','Anna','every day'],w:['Anna','goes','to','school','every day'],a:'Anna goes to school every day.'},
  {g:['English','studying','are','students','the'],w:['the','students','are','studying','English'],a:'The students are studying English.'},
  {g:['a','bought','new','she','bag'],w:['she','bought','a','new','bag'],a:'She bought a new bag.'},
  {g:['beautiful','flowers','the','are'],w:['the','flowers','are','beautiful'],a:'The flowers are beautiful.'},
  {g:['delicious','cooked','father','my','meal','a'],w:['my','father','cooked','a','delicious','meal'],a:'My father cooked a delicious meal.'}]},
 build:{t:'Build a Sentence',cls:'l',tip:'A complete sentence has a subject, a verb and a clear meaning. Start with a capital letter and end with a full stop.',
  q:[
  {el:['wrote','a short story','the young writer','about her dog'],a:'The young writer wrote a short story about her dog.'},
  {el:['after school','at the park','played soccer','the children'],a:'The children played soccer at the park after school.',alt:'After school, the children played soccer at the park.'},
  {el:['because it rained','stayed inside','the students','during recess'],a:'The students stayed inside during recess because it rained.',alt:'Because it rained, the students stayed inside during recess.'},
  {el:['a fresh salad','for lunch','prepared','the chef'],a:'The chef prepared a fresh salad for lunch.'},
  {el:['before the test','reviewed','their lessons','the classmates'],a:'The classmates reviewed their lessons before the test.'}]}
};
const stat={arrange:80,fix:75,build:85};
let mode,i,ans;
const fmt=a=>{const s=a.join(' ');return s[0].toUpperCase()+s.slice(1)+'.'};
const shuffle=a=>{let b;do{b=[...a].sort(()=>Math.random()-.5)}while(b.join()===a.join()&&a.length>1);return b};
function start(m){mode=m;i=0;render();go('act')}
function render(){
  const d=D[mode],q=d.q[i],body=$('#actBody');
  $('#actTitle').textContent=d.t;$('#actCount').textContent=(i+1)+'/'+d.q.length;
  $('#actBar').className='bar '+d.cls;ans=[];
  if(mode==='build'){
    body.innerHTML=`<p class="q">Use the given words or sentence elements to create a complete and grammatically correct sentence. Make sure that your sentence has a clear meaning and follows an appropriate sentence structure. Type your final sentence into the answer box, then tap Submit when you are finished.</p><p class="q" style="font-weight:800;color:var(--lav)">Arrange the words and type your final sentence into the answer box.</p><div class="chips">${q.el.map(w=>`<span class="chip" style="background:var(--lav2);cursor:default;pointer-events:none">${w}</span>`).join('')}</div><textarea id="ta" placeholder="Type your sentence here…"></textarea><div class="msg" id="msg"></div><button class="btn" id="chk" style="background:var(--lav)">Submit</button>`;
    const norm=t=>t.toLowerCase().replace(/[^a-z\s]/g,'').replace(/\s+/g,' ').trim();
    $('#chk').onclick=()=>{
      const t=norm($('#ta').value);
      [q.a,q.alt].filter(Boolean).some(x=>norm(x)===t)?finish(true,q.a+(q.alt?'\nAlso correct: '+q.alt:'')):wrong();
    };return;
  }
  const words=q.g||shuffle(q.w);
  body.innerHTML=`${q.g?`<p class="q">Each item contains words that are not in the appropriate order. Rearrange the words to form a grammatically appropriate English sentence. Tap Check when you are finished.</p><p class="q" style="font-weight:800;color:var(--blue)">Re-arrange the words:</p><div class="wrong">${i+1}. ${q.g.join(' / ')}</div>`:`<p class="q">Read the sentence elements carefully. Drag or select the phrases and clauses to arrange them in the most logical order. Then tap Check.</p><p class="q" style="font-weight:800;color:var(--blue)">Arrange the sentence elements correctly:</p>`}
  <div class="chips" id="pool">${words.map((w,k)=>`<button class="chip" draggable="true" data-k="${k}">${w}</button>`).join('')}</div>
  <div class="drop" id="drop"><span class="hint">Tap the words here</span></div><div class="msg" id="msg"></div>
  <button class="btn" id="chk" disabled>Check</button>`;
  const pool=$('#pool'),drop=$('#drop');
  const paint=()=>{drop.classList.toggle('has',ans.length>0);
    drop.innerHTML=ans.length?ans.map((a,n)=>`<button class="chip" draggable="true" data-n="${n}">${a.w}</button>`).join(''):'<span class="hint">Tap the words here</span>';
    pool.querySelectorAll('.chip').forEach(c=>c.classList.toggle('used',ans.some(a=>a.k==c.dataset.k)));
    $('#chk').disabled=ans.length!==words.length;$('#msg').textContent=''};
  pool.onclick=e=>{const c=e.target.closest('.chip');if(!c)return;ans.push({k:c.dataset.k,w:words[c.dataset.k]});paint()};
  drop.onclick=e=>{const c=e.target.closest('.chip');if(!c)return;ans.splice(c.dataset.n,1);paint()};
  let dragSrc=null;
  document.querySelector('#actBody').ondragstart=e=>{const c=e.target.closest('.chip');if(!c)return;dragSrc={k:c.dataset.k,n:c.dataset.n};e.dataTransfer.setData('text/plain','x');e.dataTransfer.effectAllowed='move'};
  drop.ondragover=e=>{e.preventDefault();drop.classList.add('has')};
  drop.ondrop=e=>{e.preventDefault();if(!dragSrc)return;
    const t=e.target.closest('.chip[data-n]');let at=t?+t.dataset.n:ans.length;
    if(dragSrc.n!==undefined){const [it]=ans.splice(+dragSrc.n,1);if(at>+dragSrc.n)at--;ans.splice(at,0,it)}
    else if(!ans.some(a=>a.k==dragSrc.k))ans.splice(at,0,{k:dragSrc.k,w:words[dragSrc.k]});
    dragSrc=null;paint()};
  pool.ondragover=e=>e.preventDefault();
  pool.ondrop=e=>{e.preventDefault();if(dragSrc&&dragSrc.n!==undefined){ans.splice(+dragSrc.n,1);paint()}dragSrc=null};
  $('#chk').onclick=()=>ans.map(a=>a.w).join()===q.w.join()?finish(true,q.a||fmt(q.w)):wrong();
}
function wrong(){
  stat[mode]=Math.max(30,stat[mode]-3);
  const m=$('#msg');m.textContent=({build:'Check whether your sentence has a complete thought and whether its elements are arranged correctly.',arrange:'Not quite! Check how the phrases and clauses connect to the main idea and try again.',fix:'Check the basic sentence pattern. Ask yourself: Who? Does what? What/whom? Then check where the additional information belongs.'})[mode]||'Almost! Check the order and try again.';
  const t=$('#drop')||$('#ta');t.classList.remove('shake');void t.offsetWidth;t.classList.add('shake');
}
function finish(ok,sent){
  stat[mode]=Math.min(100,stat[mode]+4);
  $('#rTitle').textContent=({arrange:'Correct!',fix:'Excellent!',build:'Excellent!'})[mode]||'Well done!';
  $('#rSub').textContent=({arrange:'Great job! You arranged the sentence elements logically.',fix:'The words are arranged in an appropriate order.',build:'You constructed a complete and grammatically correct sentence.'})[mode]||'The correct sentence is:';
  $('#rSent').textContent=sent;$('#rTip').textContent=D[mode].q[i].e||D[mode].tip;
  const last=i===D[mode].q.length-1;
  $('#rNext').textContent=last?'Back to home':'Next question';
  go('result');
}
$('#rNext').onclick=()=>{if(i<D[mode].q.length-1){i++;render();go('act')}else go('home')};
$('#rAgain').onclick=()=>{i=(i+1)%D[mode].q.length;render();go('act')};

/* progress */
function drawProgress(){
  const v=[stat.arrange,stat.fix,stat.build],avg=Math.round(v.reduce((a,b)=>a+b)/3);
  $('#ring').style.setProperty('--p',avg);$('#ringN').textContent=avg+'%';
  v.forEach((x,k)=>{$('#s'+k).style.width=x+'%';$('#s'+k+'n').textContent=x+'%'});
}
/* theme */
function applyTheme(dark,save){
  const r=document.documentElement;r.classList.add('fade');r.dataset.theme=dark?'dark':'light';
  const t=$('#theme');t.classList.toggle('on',dark);t.setAttribute('aria-checked',dark);
  $('#thIcon').textContent=dark?'☀️':'🌙';$('#thLabel').textContent=dark?'Light mode':'Dark mode';
  if(save){try{localStorage.setItem('sf-theme',dark?'dark':'light')}catch(e){}}
  setTimeout(()=>r.classList.remove('fade'),500);
}
(()=>{let v=null;try{v=localStorage.getItem('sf-theme')}catch(e){}
  applyTheme(v?v==='dark':matchMedia('(prefers-color-scheme: dark)').matches,false)})();
$('#theme').onclick=()=>applyTheme(document.documentElement.dataset.theme!=='dark',true);
