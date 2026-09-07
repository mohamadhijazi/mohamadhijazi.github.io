"use strict";
const $=s=>document.querySelector(s),canvas=$("#canvas"),ctx=canvas.getContext("2d",{alpha:false});
let data=null,playing=false,narrationOn=true,startStamp=0,pausedAt=0,raf=0,spoken=new Set(),recorder=null,chunks=[];
const renderers={title:renderTitle,equation:renderEquation,groups:renderGroups,array:renderArray,numberLine:renderNumberLine,summary:renderSummary};
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=t=>1-Math.pow(1-clamp(t),3),wave=(t,s=1)=>Math.sin(t*Math.PI*2*s);
function theme(){return data.theme||{primary:"#38BDF8",secondary:"#FBBF24",accent:"#A78BFA",text:"#fff",muted:"#aaa",panel:"#123",font:"Segoe UI",iconFont:"Segoe UI Symbol",emojiFont:"Segoe UI Emoji"}}
function fit(){canvas.width=data.video.width||1920;canvas.height=data.video.height||1080}
function text(v,x,y,size,color,weight="600",align="center",font=theme().font){ctx.globalAlpha=1;ctx.fillStyle=color;ctx.font=`${weight} ${size}px "${font}"`;ctx.textAlign=align;ctx.textBaseline="middle";ctx.fillText(String(v),x,y)}
function rounded(x,y,w,h,r,fill,alpha=1){ctx.globalAlpha=alpha;ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();ctx.globalAlpha=1}
function wrap(v,x,y,max,size,color,line=1.25){ctx.font=`600 ${size}px "${theme().font}"`;let words=String(v).split(/\s+/),row="",rows=[];for(const w of words){let z=row?row+" "+w:w;if(ctx.measureText(z).width>max&&row){rows.push(row);row=w}else row=z}if(row)rows.push(row);rows.forEach((r,i)=>text(r,x,y+i*size*line,size,color))}
function transition(s,p){let q=ease(clamp(p/.18)),k=s.transition||"fade";ctx.globalAlpha=q;if(k==="slideUp")ctx.translate(0,(1-q)*90);if(k==="slideLeft")ctx.translate((1-q)*130,0);if(k==="fadeZoom"){let z=.9+.1*q;ctx.translate(canvas.width/2,canvas.height/2);ctx.scale(z,z);ctx.translate(-canvas.width/2,-canvas.height/2)}}
function background(){let g=ctx.createLinearGradient(0,0,canvas.width,canvas.height);g.addColorStop(0,data.video.background||"#061426");g.addColorStop(1,"#10243f");ctx.fillStyle=g;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.globalAlpha=.1;ctx.strokeStyle=theme().primary;for(let x=0;x<canvas.width;x+=80){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke()}for(let y=0;y<canvas.height;y+=80){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke()}ctx.globalAlpha=1}
function heading(s){text(s.title||"",canvas.width/2,120,62,theme().text,"700")}
function asset(name){return data.assets?.[name]}
function parseViewBox(v){let a=String(v||"0 0 100 100").trim().split(/\s+/).map(Number);return {x:a[0],y:a[1],w:a[2],h:a[3]}}
function svgObject(o,p){let a=asset(o.asset);if(!a)return;let vb=parseViewBox(a.viewBox),w=o.width||120,h=o.height||120,x=o.x||0,y=o.y||0;ctx.save();animateTransform(o,p,x,y,w,h);ctx.translate(x-w/2,y-h/2);ctx.scale(w/vb.w,h/vb.h);ctx.translate(-vb.x,-vb.y);for(const part of a.paths||[]){let path=new Path2D(part.d);ctx.globalAlpha=part.opacity??1;ctx.lineWidth=part.strokeWidth||1;ctx.lineCap=part.lineCap||"butt";ctx.lineJoin=part.lineJoin||"miter";if(part.fill&&part.fill!=="none"){ctx.fillStyle=part.fill;ctx.fill(path)}if(part.stroke){ctx.strokeStyle=part.stroke;ctx.stroke(path)}}ctx.restore();ctx.globalAlpha=1}
function animateTransform(o,p,x,y,w=0,h=0){let d=o.delay||0,q=ease(clamp((p-d)/(1-d))),anim=o.animation||"fade";ctx.globalAlpha=q;ctx.translate(x,y);if(anim==="pulse"){let z=1+.1*wave(p,1.4);ctx.scale(z,z)}else if(anim==="bounce"||anim==="hop")ctx.translate(0,-Math.abs(wave(p,1.5))*45);else if(anim==="float")ctx.translate(0,wave(p,.7)*22);else if(anim==="pop"){let z=.2+.8*q;ctx.scale(z,z)}else if(anim==="spinIn"){ctx.rotate((1-q)*-Math.PI);ctx.scale(q,q)}else if(anim==="slideLoop")ctx.translate(wave(p,.75)*45,0);else if(anim==="draw")ctx.rotate((o.spin||0)*p*Math.PI*2);ctx.translate(-x,-y)}
function visual(o,p,defaults={}){o={...defaults,...o};if(!o)return;let x=o.x||0,y=o.y||0;if(o.kind==="svg")return svgObject(o,p);ctx.save();animateTransform(o,p,x,y);let font=o.kind==="emoji"?theme().emojiFont:theme().iconFont;text(o.value||"",x,y,o.size||70,o.color||theme().text,"700","center",font);ctx.restore()}
function decorations(s,p){for(const d of s.decorations||[])visual(d,p)}
function renderTitle(s,p){text(s.title||"",960,465,118,theme().primary,"800");wrap(s.subtitle||"",960,600,1450,48,theme().text);rounded(790,710,340,8,4,theme().secondary);decorations(s,p)}
function renderEquation(s,p){heading(s);rounded(330,320,1260,310,28,theme().panel,.94);let z=.88+.12*ease(p);ctx.save();ctx.translate(960,475);ctx.scale(z,z);text(s.equation||"",0,0,105,theme().secondary,"800");ctx.restore();wrap(s.caption||"",960,735,1500,42,theme().muted);decorations(s,p)}
function renderGroups(s,p){heading(s);let groups=+s.groups||1,count=+s.itemsPerGroup||1,shown=Math.ceil(ease(p)*groups*count),gap=canvas.width/(groups+1);for(let g=0;g<groups;g++){rounded(gap*(g+1)-190,285,380,420,26,theme().panel,.92);for(let i=0;i<count;i++){let idx=g*count+i,x=gap*(g+1)-105+(i%2)*140,y=390+Math.floor(i/2)*145,item={kind:"fontIcon",value:"●",size:70,color:i%2?theme().secondary:theme().primary,...s.item,x,y,animation:idx<shown?(s.item?.animation||"pop"):"fade",delay:idx/(groups*count)*.5};visual(item,p)}}text(s.label||"",960,825,70,theme().text,"800");decorations(s,p)}
function renderArray(s,p){heading(s);let rows=+s.rows||1,cols=+s.columns||1,cell=Math.min(125,670/Math.max(rows,cols)),ox=960-cols*cell/2,oy=480-rows*cell/2;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){let i=r*cols+c,x=ox+c*cell+cell/2,y=oy+r*cell+cell/2,o={kind:"fontIcon",value:"●",size:78,color:i%2?(s.cell?.alternateColor||theme().accent):(s.cell?.color||theme().primary),...s.cell,x,y,delay:i/(rows*cols)*.4};visual(o,p)}text(s.label||"",960,825,62,theme().text,"800");decorations(s,p)}
function renderNumberLine(s,p){heading(s);let from=+s.from||0,step=+s.step||1,jumps=+s.jumps||1,x0=300,x1=1620,y=610;ctx.strokeStyle=theme().text;ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();for(let i=0;i<=jumps;i++){let x=x0+(x1-x0)*i/jumps;ctx.fillStyle=theme().secondary;ctx.fillRect(x-5,y-22,10,44);text(from+i*step,x,y+70,35,theme().text,"700")}let done=ease(p)*jumps;for(let i=0;i<Math.ceil(done);i++){let partial=clamp(done-i),a=x0+(x1-x0)*i/jumps,b=x0+(x1-x0)*(i+partial)/jumps;ctx.strokeStyle=theme().primary;ctx.lineWidth=15;ctx.beginPath();ctx.arc((a+b)/2,y-70,(b-a)/2,Math.PI,0);ctx.stroke()}let pos=clamp(done/jumps),jx=x0+(x1-x0)*pos;visual({...s.jumper,x:jx,y:y-125},p);text(s.label||"",960,835,60,theme().text,"700");decorations(s,p)}
function renderSummary(s,p){heading(s);let arr=Array.isArray(s.bullets)?s.bullets:[];arr.forEach((item,i)=>{let obj=typeof item==="string"?{text:item}:item,a=clamp((p-i*.12)/.25),y=312+i*145;rounded(350,y-52,1220,105,18,theme().panel,a);visual({kind:"fontIcon",value:"✓",color:theme().primary,size:48,...obj.icon,x:415,y,delay:i*.1},p);ctx.globalAlpha=a;text(obj.text||"",490,y,42,theme().text,"600","left")});ctx.globalAlpha=1;text(s.highlight||"",960,830,88,theme().secondary,"900");decorations(s,p)}
function activeScene(t){return data.scenes.find(s=>t>=s.start&&t<s.start+s.duration)||data.scenes.at(-1)}
function render(t){background();let s=activeScene(t);if(!s)return;let p=clamp((t-s.start)/s.duration);ctx.save();transition(s,p);(renderers[s.type]||renderTitle)(s,p);ctx.restore();ctx.globalAlpha=1}
function narrate(t){if(!narrationOn||!data)return;if(speechSynthesis.paused)speechSynthesis.resume();for(const s of data.scenes)if(t>=s.start&&!spoken.has(s.id)&&s.narration){spoken.add(s.id);let u=new SpeechSynthesisUtterance(s.narration);u.lang=data.video.language||"en-US";let v=speechSynthesis.getVoices().find(v=>v.name===$("#voice").value);if(v)u.voice=v;u.rate=.95;speechSynthesis.speak(u)}}
function tick(ts){if(!playing)return;let t=(ts-startStamp)/1000,d=+data.video.duration;if(t>=d){t=d;playing=false;if(recorder?.state==="recording")setTimeout(()=>{if(recorder?.state==="recording")recorder.stop()},800)}pausedAt=t;render(t);narrate(t);clock(t);if(playing)raf=requestAnimationFrame(tick)}
function play(){if(!data)return;playing=true;startStamp=performance.now()-pausedAt*1000;cancelAnimationFrame(raf);raf=requestAnimationFrame(tick)}
function pause(){playing=false;cancelAnimationFrame(raf);speechSynthesis.pause()}
function restart(auto=true){playing=false;cancelAnimationFrame(raf);speechSynthesis.cancel();spoken.clear();pausedAt=0;render(0);clock(0);if(auto)play()}
function clock(t){let f=n=>String(n).padStart(2,"0"),d=+data.video.duration;$("#clock").textContent=`${f(Math.floor(t/60))}:${f(Math.floor(t%60))} / ${f(Math.floor(d/60))}:${f(Math.floor(d%60))}`}
function voices(){let list=speechSynthesis.getVoices(),sel=$("#voice");sel.innerHTML=list.map(v=>`<option>${v.name}</option>`).join("");let pre=list.find(v=>v.lang.startsWith((data?.video?.language||"en").split("-")[0]));if(pre)sel.value=pre.name}
function validate(o){if(!o?.video||!Array.isArray(o.scenes)||!o.scenes.length)throw Error("JSON requires video and scenes");for(const s of o.scenes)if(!renderers[s.type])throw Error(`Unsupported scene type: ${s.type}`)}
async function load(o){validate(o);data=o;fit();restart(false);voices();$("#status").textContent=`Ready: ${data.video.title}`}
async function autoLoad(){try{let r=await fetch("storyboard.json",{cache:"no-store"});if(!r.ok)throw Error();await load(await r.json())}catch{$("#status").textContent="Select storyboard.json using Load JSON"}}
$("#jsonFile").onchange=async e=>{try{await load(JSON.parse(await e.target.files[0].text()))}catch(x){alert(x.message)}};
$("#play").onclick=()=>{speechSynthesis.resume();play()};$("#pause").onclick=pause;$("#restart").onclick=()=>restart(true);
$("#narration").onclick=e=>{narrationOn=!narrationOn;e.target.textContent=`Narration: ${narrationOn?"On":"Off"}`;if(!narrationOn)speechSynthesis.cancel()};

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

    // Stop the screen video track immediately so only the 1080p canvas track is recorded
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
speechSynthesis.onvoiceschanged=voices;autoLoad();

