"use strict";
const $=s=>document.querySelector(s),canvas=$("#canvas"),ctx=canvas.getContext("2d",{alpha:false});
let data=null,playing=false,narrationOn=true,startStamp=0,pausedAt=0,raf=0,spoken=new Set(),recorder=null,chunks=[];
const animeRuntimes=new WeakMap();

const renderers={
  title:renderTitle,
  equation:renderEquation,
  groups:renderGroups,
  array:renderArray,
  numberLine:renderNumberLine,
  summary:renderSummary,
  composition:renderComposition
};

const elementRenderers={
  text:elementText,
  panel:elementPanel,
  visual:elementVisual,
  equation:elementEquation,
  grid:elementGrid,
  groups:elementGroups,
  numberLine:elementNumberLine,
  list:elementList,
  pipeline:elementPipeline,
  gauge:elementGauge,
  column:elementColumn,
  vessel:elementColumn,
  card:elementCard,
  stat:elementCard,
  chart:elementChart,
  barChart:elementChart,
  particles:elementParticles,
  callout:elementCallout,
  connector:elementConnector,
  arrow:elementConnector,
  shape:elementShape,
  path:elementShape,
  badge:elementBadge,
  pill:elementBadge,
  group:elementGroup,
  container:elementGroup
};

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),
  ease=t=>1-Math.pow(1-clamp(t),3),
  wave=(t,s=1)=>Math.sin(t*Math.PI*2*s),
  spring=t=>1-Math.exp(-7*clamp(t))*Math.cos(12*clamp(t));

function theme(){
  return data?.theme||{
    primary:"#38BDF8",
    secondary:"#FBBF24",
    accent:"#A78BFA",
    text:"#fff",
    muted:"#aaa",
    panel:"#10243f",
    font:"Segoe UI",
    iconFont:"Segoe UI Symbol",
    emojiFont:"Segoe UI Emoji"
  };
}

function fit(){
  canvas.width=data.video.width||1920;
  canvas.height=data.video.height||1080;
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality="high";
}

function text(v,x,y,size,color,weight="600",align="center",font=theme().font){
  ctx.fillStyle=color;
  ctx.font=`${weight} ${size}px "${font}"`;
  ctx.textAlign=align;
  ctx.textBaseline="middle";
  ctx.fillText(String(v),x,y);
}

function rounded(x,y,w,h,r,fill,alpha=1,stroke=null){
  let base=ctx.globalAlpha;
  ctx.globalAlpha=base*alpha;
  ctx.fillStyle=fill;
  ctx.beginPath();
  ctx.roundRect(x,y,w,h,r);
  ctx.fill();
  if(stroke){
    ctx.strokeStyle=stroke;
    ctx.lineWidth=2;
    ctx.stroke();
  }
  ctx.globalAlpha=base;
}

function wrap(v,x,y,max,size,color,line=1.25,align="center"){
  ctx.font=`600 ${size}px "${theme().font}"`;
  let words=String(v).split(/\s+/),row="",rows=[];
  for(const w of words){
    let z=row?row+" "+w:w;
    if(ctx.measureText(z).width>max&&row){
      rows.push(row);
      row=w;
    }else row=z;
  }
  if(row)rows.push(row);
  rows.forEach((r,i)=>text(r,x,y+i*size*line,size,color,"600",align));
}

function transition(s,p){
  let q=ease(clamp(p/.18)),k=s.transition||"fade";
  ctx.globalAlpha=q;
  if(k==="slideUp")ctx.translate(0,(1-q)*90);
  if(k==="slideLeft")ctx.translate((1-q)*130,0);
  if(k==="fadeZoom"){
    let z=.9+.1*q;
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.scale(z,z);
    ctx.translate(-canvas.width/2,-canvas.height/2);
  }
}

function background(t=0){
  let w=canvas.width,h=canvas.height,g=ctx.createLinearGradient(0,0,w,h);
  g.addColorStop(0,data.video.background||"#061426");
  g.addColorStop(1,"#10243f");
  ctx.fillStyle=g;
  ctx.fillRect(0,0,w,h);
  [
    [w*.18+wave(t,.04)*80,h*.15,theme().primary],
    [w*.83,h*.8+wave(t,.06)*70,theme().accent]
  ].forEach(([x,y,c])=>{
    let glow=ctx.createRadialGradient(x,y,0,x,y,w*.48);
    glow.addColorStop(0,c);
    glow.addColorStop(1,"transparent");
    ctx.save();
    ctx.globalAlpha=.16;
    ctx.fillStyle=glow;
    ctx.fillRect(0,0,w,h);
    ctx.restore();
  });
  ctx.globalAlpha=.055;
  ctx.strokeStyle=theme().primary;
  for(let x=-h;x<w+h;x+=96){
    ctx.beginPath();
    ctx.moveTo(x,0);
    ctx.lineTo(x+h,h);
    ctx.stroke();
  }
  ctx.globalAlpha=1;
}

function heading(s){
  text(s.title||"",canvas.width/2,120,62,theme().text,"700");
}

function asset(name){
  return data.assets?.[name];
}

function parseViewBox(v){
  let a=String(v||"0 0 100 100").trim().split(/\s+/).map(Number);
  return {x:a[0],y:a[1],w:a[2],h:a[3]};
}

function svgObject(o,p){
  let a=asset(o.asset);
  if(!a)return;
  let vb=parseViewBox(a.viewBox),w=o.width||120,h=o.height||120,x=o.x||0,y=o.y||0;
  ctx.save();
  animateTransform(o,p,x,y,w,h);
  ctx.translate(-w/2,-h/2);
  ctx.scale(w/vb.w,h/vb.h);
  ctx.translate(-vb.x,-vb.y);
  let base=ctx.globalAlpha;
  for(const part of a.paths||[]){
    let path=new Path2D(part.d);
    ctx.globalAlpha=base*(part.opacity??1);
    ctx.lineWidth=part.strokeWidth||1;
    ctx.lineCap=part.lineCap||"butt";
    ctx.lineJoin=part.lineJoin||"miter";
    if(part.fill&&part.fill!=="none"){
      ctx.fillStyle=part.fill;
      ctx.fill(path);
    }
    if(part.stroke){
      ctx.strokeStyle=part.stroke;
      ctx.stroke(path);
    }
  }
  ctx.restore();
  ctx.globalAlpha=1;
}

function animateTransform(o,p,x,y,w=0,h=0){
  let d=o.delay||0,q=ease(clamp((p-d)/(1-d))),anim=o.animation||"fade";
  ctx.globalAlpha=q*(o.opacity??1);
  ctx.translate(x,y);
  if(o.rotate)ctx.rotate(o.rotate*Math.PI/180);
  if(o.scaleX!==undefined||o.scaleY!==undefined){
    ctx.scale(o.scaleX??o.scale??1,o.scaleY??o.scale??1);
  }else if(o.scale!==undefined){
    ctx.scale(o.scale,o.scale);
  }
  if(anim==="pulse"){let z=1+.1*wave(p,1.4);ctx.scale(z,z)}
  else if(anim==="bounce"||anim==="hop")ctx.translate(0,-Math.abs(wave(p,1.5))*45);
  else if(anim==="float")ctx.translate(0,wave(p,.7)*22);
  else if(anim==="wave")ctx.translate(0,wave(p+d,1.2)*16);
  else if(anim==="pop"){let z=.2+.8*q;ctx.scale(z,z)}
  else if(anim==="spinIn"){ctx.rotate((1-q)*-Math.PI);ctx.scale(q,q)}
  else if(anim==="slideLoop")ctx.translate(wave(p,.75)*45,0);
  else if(anim==="draw")ctx.rotate((o.spin||0)*p*Math.PI*2);
}

function visual(o,p,defaults={}){
  o={...defaults,...o};
  if(!o)return;
  let x=o.x||0,y=o.y||0;
  if(o.kind==="svg")return svgObject(o,p);
  ctx.save();
  animateTransform(o,p,x,y);
  ctx.shadowColor=o.color||theme().primary;
  ctx.shadowBlur=18;
  ctx.shadowOffsetY=5;
  let font=o.kind==="emoji"?theme().emojiFont:theme().iconFont;
  text(o.value||"",0,0,o.size||70,o.color||theme().text,"700","center",font);
  ctx.restore();
}

function createAnimeRuntime(s){
  if(!s.animation?.tracks?.length||!window.anime?.animate)return null;
  let state={};
  for(const item of [...(s.elements||[]),...(s.decorations||[])]){
    if(item.id){
      state[item.id]={
        x:item.x||0,
        y:item.y||0,
        scale:item.scale??1,
        scaleX:item.scaleX??1,
        scaleY:item.scaleY??1,
        rotate:item.rotate||0,
        progress:item.progress??0,
        level:item.level??0,
        flow:item.flow??0,
        width:item.width||0,
        height:item.height||0,
        radius:item.radius||0
      };
      if(item.opacity!==undefined)state[item.id].opacity=item.opacity;
    }
  }

  let players=[];
  for(const track of s.animation.tracks){
    let targetIds=Array.isArray(track.targets)?track.targets:(track.target?[track.target]:[]);
    let targetObjs=[];
    for(const tid of targetIds){
      if(!state[tid]){
        state[tid]={x:0,y:0,scale:1,scaleX:1,scaleY:1,rotate:0,progress:0,level:0,flow:0,width:0,height:0,radius:0};
      }
      targetObjs.push(state[tid]);
    }
    if(!targetObjs.length)continue;

    let properties=track.properties||{};
    for(const tobj of targetObjs){
      if(properties.opacity!==undefined)tobj.hasOpacityTrack=true;
      for(const [key,value] of Object.entries(properties)){
        if(Array.isArray(value)&&value.length){
          if(tobj[key]===undefined||!tobj.hasTrack)tobj[key]=value[0];
        }else if(typeof value==="number"&&tobj[key]===undefined){
          tobj[key]=value;
        }
      }
      tobj.hasTrack=true;
    }

    try{
      let animConfig={
        ...properties,
        delay:track.delay||0,
        duration:track.duration||1000,
        ease:track.ease||"out(3)",
        autoplay:false
      };
      if(track.stagger&&window.anime.stagger&&targetObjs.length>1){
        animConfig.delay=window.anime.stagger(track.stagger,{start:track.delay||0});
      }
      if(track.keyframes)animConfig.keyframes=track.keyframes;
      if(track.loop)animConfig.loop=track.loop;
      if(track.alternate)animConfig.alternate=track.alternate;

      players.push(window.anime.animate(targetObjs.length===1?targetObjs[0]:targetObjs,animConfig));
    }catch(error){
      console.warn(`Anime.js track error for ${targetIds.join(",")}`,error);
    }
  }
  return {state,players};
}

function animeState(s,localMs){
  if(!s.animation?.tracks?.length)return null;
  let runtime=animeRuntimes.get(s);
  if(!runtime){
    runtime=createAnimeRuntime(s);
    if(runtime)animeRuntimes.set(s,runtime);
  }
  if(runtime)for(const player of runtime.players)player.seek(localMs);
  return runtime?.state||null;
}

function decorations(s,p,state){
  for(const d of s.decorations||[])visual({...d,...(state?.[d.id]||{})},p);
}

// Composition scene: assemble reusable elements with independent positions, anime transforms, and z-indices.
function renderComposition(s,p,state){
  for(const e of (s.elements||[]).slice().sort((a,b)=>(a.z||0)-(b.z||0)))renderElement(e,p,state,s);
  decorations(s,p,state);
}

function renderElement(e,p,state,s){
  let fn=elementRenderers[e.type];
  if(!fn)return;
  let dur=s?.duration||10;
  let dNorm=(e.delay>=10)?(e.delay/1000)/dur:(e.delay>1?e.delay/dur:(e.delay||0));
  let enterNorm=(e.enterDuration&&e.enterDuration>=10)?(e.enterDuration/1000)/dur:(e.enterDuration||0.35);
  let q=ease(clamp((p-dNorm)/enterNorm)),a=state?.[e.id]||{};
  let alpha=(a.hasOpacityTrack&&a.opacity!==undefined)?a.opacity:q*(a.opacity??e.opacity??1);
  if(alpha<=0.0001)return;

  ctx.save();
  ctx.globalAlpha=clamp(alpha);
  ctx.translate(a.x??e.x??0,a.y??e.y??0);
  if(a.rotate)ctx.rotate(a.rotate*Math.PI/180);
  if(a.scaleX!==undefined||a.scaleY!==undefined){
    ctx.scale(a.scaleX??a.scale??1,a.scaleY??a.scale??1);
  }else if(a.scale!==undefined){
    ctx.scale(a.scale,a.scale);
  }
  if(e.animation==="pop"){let z=.7+.3*spring(q);ctx.scale(z,z)}
  if(e.animation==="float")ctx.translate(0,wave(p,.6)*12);
  if(e.animation==="pulse"){let z=1+wave(p,1.2)*.035;ctx.scale(z,z)}
  if(e.animation==="slideLeft")ctx.translate((1-q)*80,0);
  fn(e,p,q,a);
  ctx.restore();
}

function elementText(e,p,q,a){
  let val=a.value??e.value;
  let content=e.content??e.text;
  if(val!==undefined&&typeof val==="number"){
    let disp=typeof e.precision==="number"?val.toFixed(e.precision):Math.round(val);
    content=`${e.prefix||""}${disp}${e.suffix||""}`;
  }
  if(e.maxWidth)wrap(content,0,0,e.maxWidth,e.size||42,e.color||theme().text,e.lineHeight||1.25,e.align||"center");
  else text(content,0,0,e.size||42,e.color||theme().text,e.weight||"600",e.align||"center");
}

function elementPanel(e,p,q,a){
  let w=a.width||e.width||400,h=a.height||e.height||180,r=a.radius??e.radius??24;
  ctx.shadowColor=e.shadowColor||"#0008";
  ctx.shadowBlur=e.shadowBlur||30;
  ctx.shadowOffsetY=14;
  rounded(-w/2,-h/2,w,h,r,e.color||theme().panel,e.opacity??.94,e.border||theme().primary+"55");
}

function elementVisual(e,p,q,a){
  visual({...e,...a,x:0,y:0},p);
}

function elementEquation(e){
  text(e.content||e.equation||"",0,0,e.size||84,e.color||theme().secondary,e.weight||"800");
}

function elementGrid(e,p){
  let rows=e.rows||3,cols=e.columns||3,cell=e.cellSize||Math.min(120,620/Math.max(rows,cols));
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    let i=r*cols+c;
    visual({
      kind:"fontIcon",
      value:"●",
      size:e.size||cell*.62,
      color:i%2?(e.alternateColor||theme().accent):(e.color||theme().primary),
      animation:e.itemAnimation||"pop",
      delay:(e.delay||0)+i/(rows*cols)*.45,
      x:(c-(cols-1)/2)*cell,
      y:(r-(rows-1)/2)*cell
    },p);
  }
}

function elementGroups(e,p){
  let groups=e.groups||e.count||3,count=e.itemsPerGroup||3,gap=(e.width||1100)/groups;
  for(let g=0;g<groups;g++){
    let gx=(g-(groups-1)/2)*gap;
    rounded(gx-gap*.4,-170,gap*.8,340,26,e.panelColor||theme().panel,.9);
    for(let i=0;i<count;i++)visual({
      kind:"fontIcon",
      value:"●",
      size:56,
      color:i%2?theme().secondary:theme().primary,
      ...e.item,
      x:gx-68+(i%2)*136,
      y:-55+Math.floor(i/2)*112,
      delay:(e.delay||0)+(g*count+i)/(groups*count)*.45
    },p);
  }
}

function elementNumberLine(e,p){
  let jumps=e.jumps||3,from=e.from||0,step=e.step||1,w=e.width||1200,x0=-w/2,x1=w/2;
  ctx.strokeStyle=theme().text;
  ctx.lineWidth=7;
  ctx.beginPath();
  ctx.moveTo(x0,0);
  ctx.lineTo(x1,0);
  ctx.stroke();
  for(let i=0;i<=jumps;i++){
    let x=x0+w*i/jumps;
    ctx.fillStyle=theme().secondary;
    ctx.fillRect(x-5,-20,10,40);
    text(from+i*step,x,62,32,theme().text,"700");
  }
  let done=ease(p)*jumps;
  for(let i=0;i<Math.ceil(done);i++){
    let a=x0+w*i/jumps,b=x0+w*(i+clamp(done-i))/jumps;
    ctx.strokeStyle=theme().primary;
    ctx.lineWidth=13;
    ctx.beginPath();
    ctx.arc((a+b)/2,-60,(b-a)/2,Math.PI,0);
    ctx.stroke();
  }
  visual({...e.jumper,x:x0+w*done/jumps,y:-110},p);
}

function elementList(e,p){
  let items=e.items||[],w=e.width||900;
  items.forEach((v,i)=>{
    let o=typeof v==="string"?{text:v}:v,y=(i-(items.length-1)/2)*(e.gap||100),q=ease(clamp((p-(e.delay||0)-i*.1)/.3));
    rounded(-w/2,y-36,w,72,16,theme().panel,q);
    visual({kind:"fontIcon",value:"✓",color:theme().primary,size:34,...o.icon,x:-w/2+34,y,delay:(e.delay||0)+i*.1},p);
    text(o.text||"",-w/2+72,y,e.size||34,e.color||theme().text,"600","left");
  });
}

// 1. Pipeline Renderer: Multi-point conduit with inner fluid, animated traveling pulses, and joint caps
function elementPipeline(e,p,q,a){
  let pts=e.points||[[-150,0],[150,0]];
  if(pts.length<2)return;
  let w=e.width||e.diameter||20;
  let pipeColor=e.color||"#243b55";
  let fluidColor=e.fluidColor||theme().primary;
  let flowOffset=(a.flow??(p*120*(e.speed||1)));

  // Draw outer pipe casing
  ctx.save();
  ctx.lineCap="round";
  ctx.lineJoin="round";
  ctx.strokeStyle=pipeColor;
  ctx.lineWidth=w;
  ctx.beginPath();
  ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);
  ctx.stroke();

  // Draw inner fluid core
  ctx.strokeStyle=fluidColor;
  ctx.lineWidth=w*0.64;
  ctx.stroke();

  // Animated traveling flow pulses
  if(e.animated!==false){
    ctx.strokeStyle=e.pulseColor||"#ffffff";
    ctx.globalAlpha=ctx.globalAlpha*0.8;
    ctx.lineWidth=w*0.38;
    ctx.setLineDash([16,20]);
    ctx.lineDashOffset=-flowOffset;
    ctx.stroke();
  }

  // Draw joint flanges
  if(e.joints!==false){
    for(const pt of pts){
      ctx.fillStyle=pipeColor;
      ctx.beginPath();
      ctx.arc(pt[0],pt[1],w*0.62,0,Math.PI*2);
      ctx.fill();
      ctx.fillStyle=fluidColor;
      ctx.beginPath();
      ctx.arc(pt[0],pt[1],w*0.32,0,Math.PI*2);
      ctx.fill();
    }
  }

  // Draw end arrowhead if requested
  if(e.arrow){
    let p1=pts[pts.length-2],p2=pts[pts.length-1];
    let angle=Math.atan2(p2[1]-p1[1],p2[0]-p1[0]);
    ctx.save();
    ctx.translate(p2[0],p2[1]);
    ctx.rotate(angle);
    ctx.fillStyle=fluidColor;
    ctx.beginPath();
    ctx.moveTo(0,-w*0.8);
    ctx.lineTo(w*1.2,0);
    ctx.lineTo(0,w*0.8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Optional pipe label
  if(e.label){
    let mid=pts[Math.floor(pts.length/2)];
    let lx=mid[0]+(e.labelOffsetX||0),ly=mid[1]-(w+14)+(e.labelOffsetY||0);
    let lw=Math.max(100,e.label.length*14+24);
    rounded(lx-lw/2,ly-16,lw,32,8,theme().panel,0.92,fluidColor+"88");
    text(e.label,lx,ly,e.labelSize||20,theme().text,"700");
  }
  ctx.restore();
}

// 2. Gauge Renderer: Radial speedometer/meter or linear thermometer with animated live counter
function elementGauge(e,p,q,a){
  let val=a.value??e.value??0;
  let min=e.min??0,max=e.max??100;
  let ratio=clamp((val-min)/(max-min||1));
  let color=e.color||theme().secondary;
  let unit=e.unit||"";

  if(e.style==="linear"){
    let w=e.width||70,h=e.height||260;
    rounded(-w/2,-h/2,w,h,18,theme().panel,0.94,color+"66");
    let innerH=h-36,fillH=innerH*ratio;
    rounded(-w/2+10,h/2-18-fillH,w-20,fillH,10,color,0.9);
    text(`${Math.round(val)}${unit}`,0,-h/2-24,28,color,"800");
    if(e.label||e.title)text(e.label||e.title,0,h/2+24,22,theme().muted,"600");
    return;
  }

  // Radial dial (default)
  let r=e.radius||96;
  rounded(-r-22,-r-22,(r+22)*2,(r+22)*2+40,28,theme().panel,0.92,color+"44");
  let startAngle=0.75*Math.PI,sweep=1.5*Math.PI,currentAngle=startAngle+ratio*sweep;

  ctx.save();
  ctx.translate(0,-8);

  // Background track
  ctx.beginPath();
  ctx.arc(0,0,r,startAngle,startAngle+sweep);
  ctx.lineWidth=e.trackWidth||16;
  ctx.strokeStyle="#17253b";
  ctx.lineCap="round";
  ctx.stroke();

  // Active colored arc
  if(ratio>0.01){
    ctx.beginPath();
    ctx.arc(0,0,r,startAngle,currentAngle);
    ctx.lineWidth=e.trackWidth||16;
    ctx.strokeStyle=color;
    ctx.lineCap="round";
    ctx.stroke();
  }

  // Tick marks
  for(let i=0;i<=4;i++){
    let ang=startAngle+sweep*(i/4);
    let x1=Math.cos(ang)*(r-14),y1=Math.sin(ang)*(r-14);
    let x2=Math.cos(ang)*(r-24),y2=Math.sin(ang)*(r-24);
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.lineWidth=3;
    ctx.strokeStyle=theme().muted+"88";
    ctx.stroke();
  }

  // Needle pointer
  ctx.save();
  ctx.rotate(currentAngle);
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.moveTo(0,-5);
  ctx.lineTo(r-10,0);
  ctx.lineTo(0,5);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0,0,12,0,Math.PI*2);
  ctx.fillStyle=theme().text;
  ctx.fill();
  ctx.restore();

  // Central value readout
  let dispVal=typeof e.precision==="number"?val.toFixed(e.precision):Math.round(val);
  text(`${dispVal}${unit}`,0,22,e.valueSize||38,theme().text,"800");
  ctx.restore();

  // Title / description under dial
  if(e.label||e.title)text(e.label||e.title,0,r+18,e.labelSize||22,color,"700");
}

// 3. Fractionating Column / Industrial Distillation Vessel Renderer
function elementColumn(e,p,q,a){
  let w=a.width||e.width||280,h=a.height||e.height||640;
  let trays=e.trays||(e.trayLabels?e.trayLabels.length:6);
  let activeTray=e.activeTray??-1;
  let rTop=w/2,rBottom=w/2;

  ctx.save();
  // Outer column shell with rounded dome top and bottom
  ctx.beginPath();
  ctx.moveTo(-w/2,-h/2+rTop);
  ctx.arc(0,-h/2+rTop,rTop,Math.PI,0);
  ctx.lineTo(w/2,h/2-rBottom);
  ctx.arc(0,h/2-rBottom,rBottom,0,Math.PI);
  ctx.closePath();

  // Thermal gradient fill (Furnace hot red at base to cooler cyan at top)
  let grad=ctx.createLinearGradient(0,h/2,0,-h/2);
  grad.addColorStop(0,"rgba(239, 68, 68, 0.45)");
  grad.addColorStop(0.35,"rgba(245, 158, 11, 0.35)");
  grad.addColorStop(0.7,"rgba(234, 179, 8, 0.28)");
  grad.addColorStop(1,"rgba(56, 189, 248, 0.35)");
  ctx.fillStyle=theme().panel;
  ctx.fill();
  ctx.fillStyle=grad;
  ctx.fill();

  ctx.strokeStyle=theme().primary+"88";
  ctx.lineWidth=5;
  ctx.stroke();

  // Distillation trays
  let startY=h/2-85,endY=-h/2+85,spanY=startY-endY;
  for(let i=0;i<trays;i++){
    let ty=startY-(i/(trays-1||1))*spanY;
    let isAct=activeTray===i;
    let trayColor=isAct?theme().secondary:(theme().primary+"77");

    // Tray horizontal shelf
    ctx.strokeStyle=trayColor;
    ctx.lineWidth=isAct?6:3;
    ctx.beginPath();
    ctx.moveTo(-w/2+18,ty);
    ctx.lineTo(w/2-18,ty);
    ctx.stroke();

    // Bubble cap notches on tray
    if(e.bubbleCaps!==false){
      ctx.fillStyle=trayColor;
      for(let bx=-w/2+50;bx<=w/2-50;bx+=42){
        ctx.beginPath();
        ctx.arc(bx,ty-6,7,Math.PI,0);
        ctx.fill();
      }
    }

    // Cut label and temperature readout
    if(e.trayLabels&&e.trayLabels[i]){
      let lbl=e.trayLabels[i];
      let lx=w/2+25,ly=ty;
      rounded(lx,ly-16,310,34,8,theme().panel,0.92,trayColor);
      text(lbl,lx+155,ly,20,isAct?theme().secondary:theme().text,"700");
    }
  }

  // Base liquid pool with gentle animated wave
  let lvl=a.level??e.level??0.22;
  let liquidH=(h*0.25)*lvl;
  let poolY=h/2-liquidH-20;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-w/2+15,h/2-25);
  ctx.lineTo(-w/2+15,poolY);
  for(let x=-w/2+15;x<=w/2-15;x+=20){
    ctx.lineTo(x,poolY+wave(p+x*0.01,1.5)*3);
  }
  ctx.lineTo(w/2-15,h/2-25);
  ctx.closePath();
  ctx.fillStyle="rgba(239, 68, 68, 0.75)";
  ctx.fill();
  ctx.restore();

  // Internal rising vapor wisps
  if(e.showVapor!==false){
    for(let v=0;v<10;v++){
      let vLife=((p*0.6+v*0.1)%1);
      let vy=h/2-80-vLife*spanY;
      let vx=Math.sin(v*54+p*4)*40;
      ctx.fillStyle="rgba(255, 255, 255, "+(1-vLife)*0.25+")";
      ctx.beginPath();
      ctx.arc(vx,vy,6+vLife*12,0,Math.PI*2);
      ctx.fill();
    }
  }

  ctx.restore();
}

// 4. Metric / KPI Card Renderer with animated counter and accent border
function elementCard(e,p,q,a){
  let w=a.width||e.width||380,h=a.height||e.height||190;
  let color=e.color||theme().primary;
  rounded(-w/2,-h/2,w,h,e.radius||22,theme().panel,0.94,color+"55");

  // Accent top edge
  rounded(-w/2+18,-h/2,w-36,5,3,color);

  // Badge on top right
  if(e.badge){
    let bw=Math.max(80,e.badge.length*13+20);
    rounded(w/2-bw-16,-h/2+16,bw,26,6,color+"33",1,color);
    text(e.badge,w/2-bw/2-16,-h/2+29,18,color,"700");
  }

  // Title on top left
  text(e.title||"",-w/2+24,-h/2+34,e.titleSize||22,theme().muted,"700","left");

  // Animated value
  let val=a.value??e.value;
  let dispVal="";
  if(typeof val==="number"){
    dispVal=`${e.prefix||""}${typeof e.precision==="number"?val.toFixed(e.precision):Math.round(val)}${e.unit||""}`;
  }else if(val){
    dispVal=`${e.prefix||""}${val}${e.unit||""}`;
  }
  if(dispVal)text(dispVal,-w/2+24,-h/2+90,e.valueSize||52,color,"800","left");

  // Subtitle / footnote
  if(e.subtitle)wrap(e.subtitle,-w/2+24,-h/2+145,w-48,e.subtitleSize||20,theme().text,1.25,"left");
}

// 5. Multi-bar Comparison Chart Renderer
function elementChart(e,p,q,a){
  let dataArr=e.data||[];
  let w=a.width||e.width||640,h=a.height||e.height||330;
  rounded(-w/2,-h/2,w,h,24,theme().panel,0.94,theme().primary+"44");

  let prog=a.progress??q;
  let maxVal=e.maxValue||Math.max(...dataArr.map(d=>d.value||0),1);
  if(e.title)text(e.title,0,-h/2+36,28,theme().text,"800");

  let startY=-h/2+(e.title?74:40);
  let availH=h-(e.title?96:60);
  let rowH=availH/(dataArr.length||1);

  dataArr.forEach((item,idx)=>{
    let y=startY+idx*rowH+rowH/2;
    let catW=180,barX=-w/2+catW+10,maxBarW=w-catW-110;

    // Label
    text(item.label||"",-w/2+20,y,22,theme().text,"600","left");

    // Track background
    rounded(barX,y-11,maxBarW,22,11,"#1a2a40");

    // Filled animated bar
    let curVal=(item.value||0)*prog;
    let barW=Math.max(12,(curVal/maxVal)*maxBarW);
    let barColor=item.color||theme().primary;
    rounded(barX,y-11,barW,22,11,barColor);

    // Value readout
    let valStr=`${Math.round(curVal)}${e.unit||"%"}`;
    text(valStr,barX+maxBarW+18,y,22,barColor,"700","left");
  });
}

// 6. Particle Emitter / Procedural Field Renderer (Vapor, Flame, Bubbles, Sparks, Dots)
function elementParticles(e,p,q,a){
  let w=e.width||220,h=e.height||300;
  let count=e.count||28;
  let type=e.particleType||"vapor";
  let dir=e.direction||"up";
  let speed=(e.speed||1)*(a.speed??1);
  let intensity=a.intensity??a.progress??1;

  ctx.save();
  for(let i=0;i<count;i++){
    let seed=(i*73.19)%1;
    let life=((p*speed*0.7+seed)%1);
    let px=(Math.sin(i*41+life*3)*0.5+0.5)*w-w/2;
    let py=dir==="down"?(-h/2+life*h):(h/2-life*h);
    let alpha=Math.sin(life*Math.PI)*intensity*(e.opacity??0.85);
    if(alpha<=0.01)continue;

    if(type==="flame"){
      let r=(16-life*11)*(e.scale||1);
      ctx.fillStyle=life<0.4?"rgba(254, 240, 138, "+alpha+")":"rgba(239, 68, 68, "+alpha+")";
      ctx.beginPath();
      ctx.arc(px,py,Math.max(2,r),0,Math.PI*2);
      ctx.fill();
    }else if(type==="bubbles"){
      let r=(5+seed*9)*(e.scale||1);
      ctx.save();
      ctx.strokeStyle=e.color||theme().primary;
      ctx.lineWidth=2;
      ctx.globalAlpha=alpha;
      ctx.beginPath();
      ctx.arc(px,py,r,0,Math.PI*2);
      ctx.stroke();
      ctx.restore();
    }else if(type==="dots"||type==="sparks"){
      let r=(2+seed*4)*(e.scale||1);
      ctx.save();
      ctx.globalAlpha=alpha;
      ctx.fillStyle=e.color||theme().primary;
      ctx.beginPath();
      ctx.arc(px,py,r,0,Math.PI*2);
      ctx.fill();
      ctx.restore();
    }else{
      // Vapor / steam (default)
      let r=(8+life*26)*(e.scale||1);
      ctx.save();
      ctx.globalAlpha=alpha*0.4;
      ctx.fillStyle=e.color||"#ffffff";
      ctx.beginPath();
      ctx.arc(px,py,r,0,Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  }
  ctx.restore();
}

// 7. Technical Callout Leader Line Renderer
function elementCallout(e,p,q,a){
  let from=e.from||[-100,0],to=e.to||[100,-60];
  let color=e.color||theme().primary;

  ctx.save();
  // Target anchor point
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.arc(from[0],from[1],7,0,Math.PI*2);
  ctx.fill();

  // Leader line with elbow joint
  let midX=to[0]-(to[0]>from[0]?40:-40);
  ctx.strokeStyle=color;
  ctx.lineWidth=3;
  ctx.beginPath();
  ctx.moveTo(from[0],from[1]);
  ctx.lineTo(midX,to[1]);
  ctx.lineTo(to[0],to[1]);
  ctx.stroke();

  // Callout Card
  let tw=e.width||280,th=e.height||80;
  let cx=to[0]+(to[0]>=from[0]?tw/2:-tw/2);
  rounded(cx-tw/2,to[1]-th/2,tw,th,14,theme().panel,0.92,color);
  text(e.title||"",cx,to[1]-16,22,color,"700");
  if(e.detail||e.text)wrap(e.detail||e.text,cx,to[1]+14,tw-24,18,theme().text,1.25);
  ctx.restore();
}

// 8. Connector / Flow Arrow Renderer
function elementConnector(e,p,q,a){
  let from=e.from||[-120,0],to=e.to||[120,0];
  let color=e.color||theme().secondary;
  let w=e.width||6;
  let prog=a.progress??1;
  if(prog<=0.001)return;

  let endX=from[0]+(to[0]-from[0])*prog;
  let endY=from[1]+(to[1]-from[1])*prog;

  ctx.save();
  ctx.strokeStyle=color;
  ctx.lineWidth=w;
  ctx.lineCap="round";
  ctx.beginPath();
  ctx.moveTo(from[0],from[1]);
  if(e.curve){
    let cx=(from[0]+to[0])/2+(e.curveX||0),cy=(from[1]+to[1])/2+(e.curve);
    let curCx=from[0]+(cx-from[0])*prog,curCy=from[1]+(cy-from[1])*prog;
    ctx.quadraticCurveTo(curCx,curCy,endX,endY);
  }else{
    ctx.lineTo(endX,endY);
  }
  ctx.stroke();

  // Traveling signal pulse
  let pulseT=(p*1.5)%1;
  if(pulseT<=prog){
    let px=from[0]+(to[0]-from[0])*pulseT;
    let py=from[1]+(to[1]-from[1])*pulseT;
    ctx.fillStyle=e.pulseColor||"#fff";
    ctx.beginPath();
    ctx.arc(px,py,w*1.2,0,Math.PI*2);
    ctx.fill();
  }

  // Arrowhead
  if(e.arrow!==false&&prog>=0.85){
    let ang=Math.atan2(to[1]-from[1],to[0]-from[0]);
    ctx.save();
    ctx.translate(endX,endY);
    ctx.rotate(ang);
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.moveTo(0,-w*2);
    ctx.lineTo(w*3,0);
    ctx.lineTo(0,w*2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

// 9. Generic Vector Shape / Path Renderer (Draws any Path2D / SVG 'd' path directly or references assets)
function elementShape(e,p,q,a){
  let pathStr=e.d||e.path;
  if(!pathStr&&e.asset)return elementVisual(e,p,q,a);
  if(!pathStr)return;
  ctx.save();
  let path=new Path2D(pathStr);
  if(e.fill&&e.fill!=="none"){
    ctx.fillStyle=a.color||e.fill;
    ctx.fill(path);
  }
  if(e.stroke){
    ctx.strokeStyle=a.strokeColor||e.stroke;
    ctx.lineWidth=e.strokeWidth||2;
    ctx.lineCap=e.lineCap||"round";
    ctx.lineJoin=e.lineJoin||"round";
    ctx.stroke(path);
  }
  ctx.restore();
}

// 10. Standalone Badge / Pill Tag Renderer
function elementBadge(e,p,q,a){
  let val=e.text||e.content||e.value||"";
  let size=e.size||20;
  ctx.font=`700 ${size}px "${theme().font}"`;
  let tw=ctx.measureText(String(val)).width;
  let w=e.width||(tw+28),h=e.height||(size+16);
  let col=a.color||e.color||theme().primary;
  rounded(-w/2,-h/2,w,h,e.radius||h/2,e.background||col+"22",e.opacity??1,e.border||col);
  text(val,0,0,size,col,"700");
}

// 11. Composite Container / Group Renderer
function elementGroup(e,p,q,a){
  let items=e.elements||e.children||[];
  for(const child of items.slice().sort((c1,c2)=>(c1.z||0)-(c2.z||0))){
    renderElement(child,p,{});
  }
}

function renderTitle(s,p){
  text(s.title||"",960,465,118,theme().primary,"800");
  wrap(s.subtitle||"",960,600,1450,48,theme().text);
  rounded(790,710,340,8,4,theme().secondary);
  decorations(s,p);
}

function renderEquation(s,p){
  heading(s);
  rounded(330,320,1260,310,28,theme().panel,.94);
  let z=.88+.12*ease(p);
  ctx.save();
  ctx.translate(960,475);
  ctx.scale(z,z);
  text(s.equation||"",0,0,105,theme().secondary,"800");
  ctx.restore();
  wrap(s.caption||"",960,735,1500,42,theme().muted);
  decorations(s,p);
}

function renderGroups(s,p){
  heading(s);
  let groups=+s.groups||1,count=+s.itemsPerGroup||1,shown=Math.ceil(ease(p)*groups*count),gap=canvas.width/(groups+1);
  for(let g=0;g<groups;g++){
    rounded(gap*(g+1)-190,285,380,420,26,theme().panel,.92);
    for(let i=0;i<count;i++){
      let idx=g*count+i,x=gap*(g+1)-105+(i%2)*140,y=390+Math.floor(i/2)*145;
      let item={
        kind:"fontIcon",
        value:"●",
        size:70,
        color:i%2?theme().secondary:theme().primary,
        ...s.item,
        x,
        y,
        animation:idx<shown?(s.item?.animation||"pop"):"fade",
        delay:idx/(groups*count)*.5
      };
      visual(item,p);
    }
  }
  text(s.label||"",960,825,70,theme().text,"800");
  decorations(s,p);
}

function renderArray(s,p){
  heading(s);
  let rows=+s.rows||1,cols=+s.columns||1,cell=Math.min(125,670/Math.max(rows,cols)),ox=960-cols*cell/2,oy=480-rows*cell/2;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    let i=r*cols+c,x=ox+c*cell+cell/2,y=oy+r*cell+cell/2;
    let o={
      kind:"fontIcon",
      value:"●",
      size:78,
      color:i%2?(s.cell?.alternateColor||theme().accent):(s.cell?.color||theme().primary),
      ...s.cell,
      x,
      y,
      delay:i/(rows*cols)*.4
    };
    visual(o,p);
  }
  text(s.label||"",960,825,62,theme().text,"800");
  decorations(s,p);
}

function renderNumberLine(s,p){
  heading(s);
  let from=+s.from||0,step=+s.step||1,jumps=+s.jumps||1,x0=300,x1=1620,y=610;
  ctx.strokeStyle=theme().text;
  ctx.lineWidth=8;
  ctx.beginPath();
  ctx.moveTo(x0,y);
  ctx.lineTo(x1,y);
  ctx.stroke();
  for(let i=0;i<=jumps;i++){
    let x=x0+(x1-x0)*i/jumps;
    ctx.fillStyle=theme().secondary;
    ctx.fillRect(x-5,y-22,10,44);
    text(from+i*step,x,y+70,35,theme().text,"700");
  }
  let done=ease(p)*jumps;
  for(let i=0;i<Math.ceil(done);i++){
    let partial=clamp(done-i),a=x0+(x1-x0)*i/jumps,b=x0+(x1-x0)*(i+partial)/jumps;
    ctx.strokeStyle=theme().primary;
    ctx.lineWidth=15;
    ctx.beginPath();
    ctx.arc((a+b)/2,y-70,(b-a)/2,Math.PI,0);
    ctx.stroke();
  }
  let pos=clamp(done/jumps),jx=x0+(x1-x0)*pos;
  visual({...s.jumper,x:jx,y:y-125},p);
  text(s.label||"",960,835,60,theme().text,"700");
  decorations(s,p);
}

function renderSummary(s,p){
  heading(s);
  let arr=Array.isArray(s.bullets)?s.bullets:[];
  arr.forEach((item,i)=>{
    let obj=typeof item==="string"?{text:item}:item,a=clamp((p-i*.12)/.25),y=312+i*145;
    rounded(350,y-52,1220,105,18,theme().panel,a);
    visual({kind:"fontIcon",value:"✓",color:theme().primary,size:48,...obj.icon,x:415,y,delay:i*.1},p);
    ctx.globalAlpha=a;
    text(obj.text||"",490,y,42,theme().text,"600","left");
  });
  ctx.globalAlpha=1;
  text(s.highlight||"",960,830,88,theme().secondary,"900");
  decorations(s,p);
}

function activeScene(t){
  return data.scenes.find(s=>t>=s.start&&t<s.start+s.duration)||data.scenes.at(-1);
}

function render(t){
  background(t);
  let s=activeScene(t);
  if(!s)return;
  let p=clamp((t-s.start)/s.duration),state=animeState(s,p*s.duration*1000);
  ctx.save();
  transition(s,p);
  if(s.type==="composition")renderComposition(s,p,state);
  else(renderers[s.type]||renderTitle)(s,p);
  ctx.restore();
  ctx.globalAlpha=1;
  ctx.shadowColor="transparent";
  ctx.shadowBlur=0;
}

function narrate(t){
  if(!narrationOn||!data)return;
  if(speechSynthesis.paused)speechSynthesis.resume();
  for(const s of data.scenes)if(t>=s.start&&!spoken.has(s.id)&&s.narration){
    spoken.add(s.id);
    let u=new SpeechSynthesisUtterance(s.narration);
    u.lang=data.video.language||"en-US";
    let v=speechSynthesis.getVoices().find(v=>v.name===$("#voice").value);
    if(v)u.voice=v;
    u.rate=.95;
    speechSynthesis.speak(u);
  }
}

function tick(ts){
  if(!playing)return;
  let t=(ts-startStamp)/1000,d=+data.video.duration;
  if(t>=d){
    t=d;
    playing=false;
    if(recorder?.state==="recording")setTimeout(()=>{if(recorder?.state==="recording")recorder.stop()},800);
  }
  pausedAt=t;
  render(t);
  narrate(t);
  clock(t);
  if(playing)raf=requestAnimationFrame(tick);
}

function play(){
  if(!data)return;
  playing=true;
  startStamp=performance.now()-pausedAt*1000;
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(tick);
}

function pause(){
  playing=false;
  cancelAnimationFrame(raf);
  speechSynthesis.pause();
}

function restart(auto=true){
  playing=false;
  cancelAnimationFrame(raf);
  speechSynthesis.cancel();
  spoken.clear();
  pausedAt=0;
  render(0);
  clock(0);
  if(auto)play();
}

function clock(t){
  let f=n=>String(n).padStart(2,"0"),d=+data.video.duration;
  $("#clock").textContent=`${f(Math.floor(t/60))}:${f(Math.floor(t%60))} / ${f(Math.floor(d/60))}:${f(Math.floor(d%60))}`;
}

function voices(){
  let list=speechSynthesis.getVoices(),sel=$("#voice");
  sel.innerHTML=list.map(v=>`<option>${v.name}</option>`).join("");
  let pre=list.find(v=>v.lang.startsWith((data?.video?.language||"en").split("-")[0]));
  if(pre)sel.value=pre.name;
}

function validate(o){
  if(!o?.video||!Array.isArray(o.scenes)||!o.scenes.length)throw Error("JSON requires video and scenes");
  for(const s of o.scenes){
    if(!renderers[s.type])throw Error(`Unsupported scene type: ${s.type}`);
    if(s.type==="composition"&&!Array.isArray(s.elements))throw Error("Composition scenes require an elements array");
    for(const e of s.elements||[])if(!elementRenderers[e.type])throw Error(`Unsupported element type: ${e.type}`);
    for(const track of s.animation?.tracks||[]){
      if((!track.target&&!track.targets)||(!track.properties&&!track.keyframes))throw Error(`Invalid animation track in scene: ${s.id}`);
    }
  }
}

async function load(o){
  validate(o);
  data=o;
  fit();
  restart(false);
  voices();
  $("#status").textContent=`Ready: ${data.video.title}`;
}

async function autoLoad(){
  for(const file of ["sample/cell.json","cell.json","sample.json","storyboard.json","galaxy.json"]){
    try{
      let r=await fetch(file,{cache:"no-store"});
      if(r.ok){
        let json=await r.json();
        if($("#sampleSelect"))$("#sampleSelect").value=file;
        await load(json);
        return;
      }
    }catch{}
  }
  $("#status").textContent="Select storyboard JSON using Load JSON";
}

$("#jsonFile").onchange=async e=>{
  try{await load(JSON.parse(await e.target.files[0].text()))}catch(x){alert(x.message)}
};

if($("#sampleSelect")){
  $("#sampleSelect").onchange=async e=>{
    try{
      let r=await fetch(e.target.value,{cache:"no-store"});
      if(!r.ok)throw Error(`Failed to load ${e.target.value}`);
      await load(await r.json());
    }catch(x){alert(x.message)}
  };
}

$("#play").onclick=()=>{speechSynthesis.resume();play()};
$("#pause").onclick=pause;
$("#restart").onclick=()=>restart(true);
$("#narration").onclick=e=>{
  narrationOn=!narrationOn;
  e.target.textContent=`Narration: ${narrationOn?"On":"Off"}`;
  if(!narrationOn)speechSynthesis.cancel();
};

function getRecorderMimeType(format="mp4"){
  if(format==="mp4"){
    const mp4Types=["video/mp4;codecs=avc1,mp4a.40.2","video/mp4;codecs=avc1","video/mp4"];
    for(const t of mp4Types){
      if(window.MediaRecorder?.isTypeSupported?.(t))return t;
    }
  }
  const webmTypes=["video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"];
  for(const t of webmTypes){
    if(window.MediaRecorder?.isTypeSupported?.(t))return t;
  }
  return "";
}

async function exportWithNarrator(){
  if(!data||recorder?.state==="recording")return;
  if(!navigator.mediaDevices?.getDisplayMedia){
    alert("This browser does not support audio capture. Please use Microsoft Edge or Google Chrome on Windows or Mac.");
    return;
  }
  const chosenFormat=$("#exportFormat")?.value||"mp4";
  let mime=getRecorderMimeType(chosenFormat);
  if(!mime){
    mime=getRecorderMimeType("webm");
    if(!mime){
      alert("No supported video recording MIME type was found in this browser.");
      return;
    }
  }
  const isMp4=mime.includes("mp4");
  const ext=isMp4?"mp4":"webm";

  let sharedStream;
  try{
    $("#status").textContent="Select 'Entire Screen' and enable 'Also share system audio'...";
    sharedStream=await navigator.mediaDevices.getDisplayMedia({
      video:true,
      audio:{
        suppressLocalAudioPlayback:false
      },
      systemAudio:"include",
      preferCurrentTab:false
    });

    const audioTrack=sharedStream.getAudioTracks()[0];
    if(!audioTrack){
      sharedStream.getTracks().forEach(t=>t.stop());
      throw new Error(
        "No audio track was received!\n\n" +
        "To include the narrator voice in the video:\n" +
        "1. In the sharing prompt, choose 'Entire screen' (or Screen 1).\n" +
        "2. Check the box 'Also share system audio' at the bottom-left.\n" +
        "3. Click Share."
      );
    }

    sharedStream.getVideoTracks().forEach(t=>t.stop());

    const canvasStream=canvas.captureStream(data.video.fps||60);
    const mixedStream=new MediaStream([
      ...canvasStream.getVideoTracks(),
      audioTrack
    ]);

    chunks=[];
    recorder=new MediaRecorder(mixedStream,{
      mimeType:mime,
      videoBitsPerSecond:35000000,
      audioBitsPerSecond:192000
    });

    recorder.ondataavailable=e=>{
      if(e.data&&e.data.size>0)chunks.push(e.data);
    };
    recorder.onerror=e=>console.error("Recorder error",e);
    recorder.onstop=()=>{
      sharedStream.getTracks().forEach(t=>t.stop());
      canvasStream.getTracks().forEach(t=>t.stop());
      if(!chunks.length){
        $("#status").textContent="Export finished with no data";
        return;
      }
      const blob=new Blob(chunks,{type:mime});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url;
      const titleSlug=(data.video.title||"video").replace(/[^a-z0-9]+/gi,"-").toLowerCase();
      a.download=`${titleSlug}-with-narration.${ext}`;
      a.click();
      setTimeout(()=>URL.revokeObjectURL(url),4000);
      $("#status").textContent=`Export complete: ${titleSlug}.${ext}`;
    };

    narrationOn=true;
    $("#narration").textContent="Narration: On";
    speechSynthesis.cancel();
    restart(false);
    recorder.start(1000);
    $("#status").textContent=`Recording 1080p ${ext.toUpperCase()} with narrator voice. Keep tab visible...`;
    play();

    setTimeout(()=>{
      if(recorder?.state==="recording")recorder.stop();
    },data.video.duration*1000+1500);
  }catch(error){
    if(sharedStream)sharedStream.getTracks().forEach(t=>t.stop());
    $("#status").textContent="Voice export cancelled or unavailable";
    if(error.message)alert(error.message);
  }
}

$("#export").onclick=exportWithNarrator;
speechSynthesis.onvoiceschanged=voices;
autoLoad();
