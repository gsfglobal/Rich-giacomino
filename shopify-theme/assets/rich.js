/* Rich World theme */
(function(){
const $=s=>document.querySelector(s);
const heroEl=$("#hero");
/* header */
const topBar=$("#top");
const guide=$("#guide");
function onScroll(){
  if(topBar&&!topBar.dataset.solid)topBar.classList.toggle("solid",scrollY>40);
  if(guide)guide.classList.toggle("inhero",!!heroEl&&scrollY<innerHeight*.9);
}
addEventListener("scroll",onScroll,{passive:true});onScroll();
/* drawer */
const drawer=$("#drawer"),burger=$("#burger");
if(drawer&&burger){
  burger.addEventListener("click",()=>{drawer.classList.add("open");burger.setAttribute("aria-expanded","true");});
  $("#drawerX").addEventListener("click",()=>{drawer.classList.remove("open");burger.setAttribute("aria-expanded","false");});
  addEventListener("keydown",e=>{if(e.key==="Escape")drawer.classList.remove("open");});
}
/* reveal */
const els=document.querySelectorAll(".reveal");
if("IntersectionObserver" in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
  els.forEach(el=>io.observe(el));
}else els.forEach(el=>el.classList.add("in"));
/* guide */
if(guide){
  const R=window.RICH||{};const t=R.template||"";
  const msg=t==="index"?R.guideHome:t==="collection"?R.guideCollection:t==="product"?R.guideProduct:guide.dataset.default;
  let gT;
  const say=m=>{if(!m)return;$("#guideTxt").innerHTML=m;guide.classList.remove("hide","mini");clearTimeout(gT);gT=setTimeout(()=>guide.classList.add("mini"),6000);};
  $("#guideX").addEventListener("click",()=>{clearTimeout(gT);guide.classList.add("mini");});
  $("#guideFace").addEventListener("click",()=>{guide.classList.toggle("mini");clearTimeout(gT);});
  if(innerWidth<700){$("#guideTxt").innerHTML=msg||"";guide.classList.remove("hide");guide.classList.add("mini");}
  else setTimeout(()=>say(msg),900);
}
/* filters auto-submit */
document.querySelectorAll("[data-autosubmit]").forEach(el=>el.addEventListener("change",()=>{
  const f=el.form;[...f.elements].forEach(x=>{if(x.name&&!x.value)x.disabled=true;});f.submit();
}));
/* product gallery */
const main=$("#pMainImg");
document.querySelectorAll(".gal-thumbs button").forEach(b=>b.addEventListener("click",()=>{
  if(!main)return;main.removeAttribute("srcset");main.src=b.dataset.src;
  document.querySelectorAll(".gal-thumbs button").forEach(x=>x.classList.remove("on"));b.classList.add("on");
}));
/* hero character placement */
function placeChar(){const c=$("#hero .copy"),ch=$("#char");if(!c||!ch)return;const free=innerHeight-c.offsetHeight-innerHeight*.09-70;const w=Math.max(150,Math.min(380,innerWidth*.86,free*.8+40));ch.style.width=w+"px";ch.style.bottom=(c.offsetHeight+innerHeight*.09-34)+"px";}
if(heroEl){placeChar();addEventListener("resize",placeChar);addEventListener("load",placeChar);}
/* ===================== THREE.JS HERO ===================== */
function initHero(){
  const canvas=$("#scene");
  if(!canvas)return;
  if(!window.THREE){canvas.remove();return;}
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile=innerWidth<760;
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,antialias:!mobile,alpha:false,powerPreference:"high-performance"});}catch(e){canvas.remove();return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:2));
  renderer.outputEncoding=THREE.sRGBEncoding;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x07070c);
  scene.fog=new THREE.FogExp2(0x0a0718,mobile?.045:.038);
  const cam=new THREE.PerspectiveCamera(mobile?62:50,1,.1,200);

  // env map semplice per riflessi metallici
  const pm=new THREE.PMREMGenerator(renderer);
  const envScene=new THREE.Scene();
  const envGeo=new THREE.SphereGeometry(20,24,16);
  const ec=document.createElement("canvas");ec.width=256;ec.height=128;const ex=ec.getContext("2d");
  const eg=ex.createLinearGradient(0,0,0,128);eg.addColorStop(0,"#1b1240");eg.addColorStop(.45,"#7437FF");eg.addColorStop(.55,"#f3dca5");eg.addColorStop(.7,"#39D8FF");eg.addColorStop(1,"#05050a");ex.fillStyle=eg;ex.fillRect(0,0,256,128);
  for(let i=0;i<40;i++){ex.fillStyle=`rgba(255,255,255,${Math.random()*.9})`;ex.fillRect(Math.random()*256,40+Math.random()*40,Math.random()*14,2);}
  const et=new THREE.CanvasTexture(ec);
  envScene.add(new THREE.Mesh(envGeo,new THREE.MeshBasicMaterial({map:et,side:THREE.BackSide})));
  scene.environment=pm.fromScene(envScene,.04).texture;

  // luci
  scene.add(new THREE.AmbientLight(0x3a2a6a,.6));
  const gold=new THREE.PointLight(0xD4AF65,2.4,30);gold.position.set(3,4,4);scene.add(gold);
  const vio=new THREE.PointLight(0x7437FF,3,40);vio.position.set(-8,5,-4);scene.add(vio);
  const blu=new THREE.PointLight(0x39D8FF,2.4,40);blu.position.set(8,3,-6);scene.add(blu);

  // strada
  const road=new THREE.Mesh(new THREE.PlaneGeometry(14,140),new THREE.MeshStandardMaterial({color:0x0b0b12,metalness:.6,roughness:.35}));
  road.rotation.x=-Math.PI/2;road.position.z=-50;scene.add(road);
  const side=new THREE.MeshStandardMaterial({color:0x14141d,roughness:.8});
  [-10,10].forEach(x=>{const s=new THREE.Mesh(new THREE.PlaneGeometry(8,140),side);s.rotation.x=-Math.PI/2;s.position.set(x,.02,-50);scene.add(s);});
  // linee neon della strada
  const lineMat=new THREE.MeshBasicMaterial({color:0xD4AF65});
  for(let i=0;i<24;i++){const l=new THREE.Mesh(new THREE.PlaneGeometry(.16,2.2),lineMat);l.rotation.x=-Math.PI/2;l.position.set(0,.03,4-i*5.5);scene.add(l);}
  [[-6.9,0x7437FF],[6.9,0x39D8FF]].forEach(([x,c])=>{const l=new THREE.Mesh(new THREE.PlaneGeometry(.08,140),new THREE.MeshBasicMaterial({color:c}));l.rotation.x=-Math.PI/2;l.position.set(x,.04,-50);scene.add(l);});

  // finestre palazzi (texture canvas)
  function winTex(c1){const c=document.createElement("canvas");c.width=128;c.height=256;const x=c.getContext("2d");x.fillStyle="#0d0e16";x.fillRect(0,0,128,256);
    for(let r=0;r<20;r++)for(let k=0;k<6;k++){const on=Math.random();x.fillStyle=on>.6?c1:on>.45?"#f3dca5":"#151724";x.globalAlpha=on>.45?.55+Math.random()*.45:1;x.fillRect(8+k*20,8+r*12,12,7);}
    const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;}
  const texs=[winTex("#7437FF"),winTex("#39D8FF"),winTex("#D4AF65")];
  for(let i=0;i<22;i++){
    const h=6+Math.random()*16,w=3+Math.random()*3,d=3+Math.random()*3;
    const m=new THREE.MeshStandardMaterial({map:texs[i%3],emissiveMap:texs[i%3],emissive:0xffffff,emissiveIntensity:.9,roughness:.7});
    const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
    const sideSign=i%2?1:-1;b.position.set(sideSign*(10+Math.random()*4),h/2,-6-Math.floor(i/2)*7-Math.random()*2);scene.add(b);
  }

  // boutique RICH WORLD in fondo
  const sc=document.createElement("canvas");sc.width=1024;sc.height=256;const sx=sc.getContext("2d");
  sx.fillStyle="#08090D";sx.fillRect(0,0,1024,256);sx.font="800 150px Syne, sans-serif";sx.textAlign="center";sx.textBaseline="middle";
  sx.shadowColor="#D4AF65";sx.shadowBlur=40;sx.fillStyle="#f3dca5";sx.fillText((heroEl.dataset.sign||"RICH WORLD").toUpperCase(),512,138);sx.shadowBlur=0;sx.strokeStyle="#7437FF";sx.lineWidth=6;sx.strokeRect(16,16,992,224);
  const signTex=new THREE.CanvasTexture(sc);signTex.encoding=THREE.sRGBEncoding;
  const shop=new THREE.Group();
  const body=new THREE.Mesh(new THREE.BoxGeometry(14,10,3),new THREE.MeshStandardMaterial({color:0x101018,metalness:.5,roughness:.4}));body.position.y=5;shop.add(body);
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(10,2.5),new THREE.MeshBasicMaterial({map:signTex}));sign.position.set(0,8.2,1.52);shop.add(sign);
  const glass=new THREE.Mesh(new THREE.PlaneGeometry(10,5),new THREE.MeshStandardMaterial({color:0xf3dca5,emissive:0xD4AF65,emissiveIntensity:.55,metalness:.2,roughness:.2,transparent:true,opacity:.85}));glass.position.set(0,3,1.52);shop.add(glass);
  shop.position.set(0,0,-38);scene.add(shop);
  const shopLight=new THREE.PointLight(0xD4AF65,4,22);shopLight.position.set(0,4,-34);scene.add(shopLight);

  // oggetti fluttuanti (forme generiche, nessun modello reale)
  const goldM=new THREE.MeshStandardMaterial({color:0xD4AF65,metalness:1,roughness:.18});
  const steelM=new THREE.MeshStandardMaterial({color:0xdfe3ee,metalness:1,roughness:.12});
  const iceM=new THREE.MeshPhysicalMaterial({color:0xcff7ff,metalness:.1,roughness:0,transmission:.6,clearcoat:1,flatShading:true,emissive:0x39D8FF,emissiveIntensity:.18});
  const darkM=new THREE.MeshStandardMaterial({color:0x111320,metalness:.4,roughness:.3});
  const floats=[];
  function add(obj,pos,spin){obj.position.set(...pos);obj.userData={base:pos[1],spin,ph:Math.random()*6};scene.add(obj);floats.push(obj);return obj;}

  // diamante gigante (lathe)
  const diaTex=new THREE.TextureLoader().load(heroEl.dataset.diamond);diaTex.encoding=THREE.sRGBEncoding;
  const dia=new THREE.Mesh(new THREE.PlaneGeometry(4.6,4.6),new THREE.MeshBasicMaterial({map:diaTex,transparent:true,depthWrite:false,fog:false,toneMapped:false}));
  const gc=document.createElement("canvas");gc.width=gc.height=128;const gx=gc.getContext("2d");const gg=gx.createRadialGradient(64,64,0,64,64,64);gg.addColorStop(0,"rgba(255,236,190,.9)");gg.addColorStop(.35,"rgba(212,175,101,.35)");gg.addColorStop(1,"rgba(116,55,255,0)");gx.fillStyle=gg;gx.fillRect(0,0,128,128);
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(gc),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));glow.scale.set(10,10,1);glow.position.set(0,5.6,-22.3);scene.add(glow);
  add(dia,[0,5.6,-22],0);

  // orologio generico
  function watch(m){const g=new THREE.Group();const c=new THREE.Mesh(new THREE.TorusGeometry(.7,.16,16,48),m);g.add(c);
    const f=new THREE.Mesh(new THREE.CylinderGeometry(.68,.68,.1,48),darkM);f.rotation.x=Math.PI/2;g.add(f);
    const h1=new THREE.Mesh(new THREE.BoxGeometry(.06,.45,.04),goldM);h1.position.set(0,.2,.08);g.add(h1);
    const h2=new THREE.Mesh(new THREE.BoxGeometry(.05,.32,.04),goldM);h2.position.set(.13,-.06,.09);h2.rotation.z=-1.1;g.add(h2);
    [1,-1].forEach(s=>{const st=new THREE.Mesh(new THREE.BoxGeometry(.7,1,.12),m);st.position.y=s*1.25;g.add(st);});
    const cr=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.18,16),m);cr.rotation.z=Math.PI/2;cr.position.x=.92;g.add(cr);return g;}
  add(watch(goldM),[-2.6,3.8,-3.5],.8);
  add(watch(steelM),[2.7,4.2,-4.2],-.7);

  // catena
  const chain=new THREE.Group();
  for(let i=0;i<14;i++){const l=new THREE.Mesh(new THREE.TorusGeometry(.22,.07,10,24),goldM);const a=i/13*Math.PI;l.position.set(Math.cos(a)*1.4,-Math.sin(a)*1.4,0);l.rotation.y=i%2?Math.PI/2:0;l.rotation.z=a;chain.add(l);}
  const pend=new THREE.Mesh(new THREE.OctahedronGeometry(.32),iceM);pend.position.y=-1.75;chain.add(pend);
  add(chain,[-3.6,6.2,-7],.4);

  // borsa generica
  const bag=new THREE.Group();
  const bb=new THREE.Mesh(new THREE.BoxGeometry(1.4,1,.55),new THREE.MeshStandardMaterial({color:0x5a3a24,roughness:.5,metalness:.1}));bag.add(bb);
  const hd=new THREE.Mesh(new THREE.TorusGeometry(.42,.05,10,32,Math.PI),goldM);hd.position.y=.5;bag.add(hd);
  const lk=new THREE.Mesh(new THREE.BoxGeometry(.24,.16,.05),goldM);lk.position.set(0,.18,.3);bag.add(lk);
  add(bag,[3.8,6,-8],.6);

  // anello
  const ring=new THREE.Group();ring.add(new THREE.Mesh(new THREE.TorusGeometry(.45,.09,16,48),steelM));const rs=new THREE.Mesh(new THREE.OctahedronGeometry(.22),iceM);rs.position.y=.55;ring.add(rs);
  add(ring,[1.6,2.4,-2.2],1.1);

  // scintille
  const N=mobile?260:520,sg=new THREE.BufferGeometry(),sp=new Float32Array(N*3);
  for(let i=0;i<N;i++){sp[i*3]=(Math.random()-.5)*26;sp[i*3+1]=Math.random()*14;sp[i*3+2]=-Math.random()*45+4;}
  sg.setAttribute("position",new THREE.BufferAttribute(sp,3));
  const sparks=new THREE.Points(sg,new THREE.PointsMaterial({color:0xf3dca5,size:mobile?.07:.05,transparent:true,opacity:.85}));scene.add(sparks);

  function size(){const w=canvas.clientWidth||innerWidth,h=canvas.clientHeight||innerHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}
  addEventListener("resize",size);size();

  let mx=0,my=0;addEventListener("pointermove",e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;},{passive:true});
  const hero=$("#hero"),charEl=$("#char");
  let running=true,t0=performance.now();
  const vis=new IntersectionObserver(([e])=>{const was=running;running=e.isIntersecting;if(running&&!was){size();loop();}},{threshold:0});running=false;vis.observe(hero);
  function prog(){const r=hero.getBoundingClientRect();return Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));}
  function loop(){
    if(!running)return;
    const t=(performance.now()-t0)/1000,p=prog();
    // camera: avanza lungo la strada verso la boutique e sale leggermente
    cam.position.set(mx*1.2,2.4+p*1.6-my*.6,9-p*20);
    cam.lookAt(0,3.6+p*.8,-12-p*20);
    floats.forEach((o,i)=>{o.rotation.y+=reduce?0:o.userData.spin*.012;o.position.y=o.userData.base+Math.sin(t*1.1+o.userData.ph)*.18;});
    dia.rotation.y=reduce?0:Math.sin(t*.7)*.3;dia.rotation.z=Math.sin(t*.5)*.04;const ds=1+Math.sin(t*1.6)*.025;dia.scale.set(ds,ds,1);glow.material.opacity=.75+Math.sin(t*2.2)*.25;
    sparks.rotation.y=Math.sin(t*.05)*.05;
    charEl.style.opacity=String(1-p*1.8);charEl.style.transform=`translateX(-50%) scale(${1-p*.3})`;
    renderer.render(scene,cam);
    requestAnimationFrame(loop);
  }
  loop();
}

if(heroEl){
  const go=()=>{if(window.THREE){initHero();return;}const sc=document.createElement("script");sc.src=heroEl.dataset.three;sc.onload=initHero;sc.onerror=()=>{const c=$("#scene");c&&c.remove();};document.head.appendChild(sc);};
  if(document.readyState==="complete")go();else addEventListener("load",go);
}
})();
