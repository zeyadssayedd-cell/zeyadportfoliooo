const preloader=document.getElementById("preloader");
const preloaderBar=document.getElementById("preloaderBar");
const preloaderPercent=document.getElementById("preloaderPercent");

function runPreloader(){
  if(!preloader || !preloaderBar || !preloaderPercent){
    document.body.classList.remove('preloading');
    return;
  }

  window.scrollTo(0,0);
  const duration=3600;
  const start=performance.now();

  function frame(now){
    const progress=Math.min((now-start)/duration,1);
    const eased=1-Math.pow(1-progress,3);
    const percent=Math.min(100, Math.round(eased*100));
    preloaderBar.style.width=percent+'%';
    preloaderPercent.textContent=percent+'%';

    if(progress<1){
      requestAnimationFrame(frame);
    }else{
      preloaderPercent.textContent='100%';
      preloaderBar.style.width='100%';
      setTimeout(()=>{
        preloader.classList.add('is-done');
        document.body.classList.remove('preloading');
        setTimeout(()=>{
          if(preloader && preloader.parentNode){
            preloader.parentNode.removeChild(preloader);
          }
        },760);
      },420);
    }
  }

  requestAnimationFrame(frame);
}

if(document.readyState === 'complete'){
  runPreloader();
}else{
  window.addEventListener('load', runPreloader, {once:true});
}

const cursor=document.getElementById('penCursor');
const statsSection=document.querySelector('.stats');
const statCards=document.querySelectorAll('.stat');
const countEls=document.querySelectorAll('.stat h2');
const heroTitle=document.querySelector('.hero-left h1');
const heroRight=document.querySelector('.hero-right');
const viewWork=document.querySelector('.view-work');
const navLinks=document.querySelectorAll('.fixed-nav nav a[data-section]');
const sections=document.querySelectorAll('.page-section[data-section-name]');
const aboutPage=document.getElementById('about');
const aboutWrap=document.getElementById('aboutWrap');
const aboutStage=document.getElementById('aboutStage');

let mx=window.innerWidth/2;
let my=window.innerHeight/2;
let cursorRaf=null;

if(cursor){
  cursor.style.setProperty('--cursor-x', mx+'px');
  cursor.style.setProperty('--cursor-y', my+'px');
  cursor.style.setProperty('--cursor-scale', '1');
}

function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }

function moveCursor(){
  if(cursor){
    cursor.style.setProperty('--cursor-x', mx+'px');
    cursor.style.setProperty('--cursor-y', my+'px');
  }
  cursorRaf=null;
}

window.addEventListener('mousemove',(e)=>{
  mx=e.clientX;
  my=e.clientY;
  if(!cursorRaf) cursorRaf=requestAnimationFrame(moveCursor);

  if(heroRight){
    const rx=(window.innerWidth/2-e.clientX)/140;
    const ry=(window.innerHeight/2-e.clientY)/140;
    const main=document.querySelector('.main-image');
    const note=document.querySelector('.note');
    const logo=document.querySelector('.bottom-logo');
    if(main) main.style.transform=`translate(${rx*0.7}px, ${ry*0.7}px)`;
    if(note) note.style.transform=`translate(${rx*0.5}px, ${ry*0.5}px)`;
    if(logo) logo.style.transform=`translate(${rx*0.35}px, ${ry*0.35}px)`;
  }

  if(statsSection){
    const rect=statsSection.getBoundingClientRect();
    const inside=e.clientX>=rect.left && e.clientX<=rect.right && e.clientY>=rect.top && e.clientY<=rect.bottom;
    if(inside){
      statCards.forEach((card)=>{
        const cr=card.getBoundingClientRect();
        const cx=cr.left+cr.width/2;
        const cy=cr.top+cr.height/2;
        const dx=(e.clientX-cx)/18;
        const dy=(e.clientY-cy)/18;
        const moveX=clamp(dx,-16,16);
        const moveY=clamp(dy,-16,16);
        const dist=Math.sqrt(dx*dx+dy*dy);
        const scale=dist<10?1.09:1.03;
        card.style.transform=`translate3d(${moveX}px, ${moveY}px, 0) scale(${scale})`;
      });
    }else{
      statCards.forEach((card)=>{ card.style.transform='translate3d(0,0,0) scale(1)'; });
    }
  }
},{passive:true});

document.querySelectorAll('a,button,.collage-card,.about-title,.quote-collage,.tool-grid img,.service-card,.services-collage,.contact-method,.contact-footer-note,.contact-social-link,.contact-intro,.download-cv-btn').forEach((el)=>{
  el.addEventListener('mouseenter',()=>{
    if(!cursor) return;
    cursor.style.setProperty('--cursor-scale', el.classList.contains('tool-grid') ? '1.25' : '1.42');
    cursor.style.boxShadow='0 0 0 10px rgba(70,189,213,.08)';
    if(el.classList.contains('collage-card') || el.classList.contains('about-title') || el.classList.contains('quote-collage')) cursor.style.borderColor='#111';
  }, {passive:true});
  el.addEventListener('mouseleave',()=>{
    if(!cursor) return;
    cursor.style.setProperty('--cursor-scale','1');
    cursor.style.boxShadow='0 0 0 6px rgba(70,189,213,.08)';
    cursor.style.borderColor='#46bdd5';
  }, {passive:true});
});

function animateCount(el, end){
  const duration=1100;
  const t0=performance.now();
  function step(now){
    const p=Math.min((now-t0)/duration,1);
    const eased=1-Math.pow(1-p,3);
    el.textContent=Math.round(end*eased) + '+';
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
countEls.forEach((el)=>{
  const end=Number(el.textContent.replace(/\D/g,'')||0);
  el.textContent='0+';
  animateCount(el,end);
});

if(heroTitle){
  heroTitle.addEventListener('mousemove',(e)=>{
    const rect=heroTitle.getBoundingClientRect();
    const x=(e.clientX-rect.left)/rect.width - .5;
    const y=(e.clientY-rect.top)/rect.height - .5;
    heroTitle.style.transform=`translateY(${y*2}px) rotateX(${x*-3}deg) rotateY(${x*4}deg)`;
  }, {passive:true});
  heroTitle.addEventListener('mouseleave',()=>{ heroTitle.style.transform='translateY(0) rotateX(0) rotateY(0)'; });
}

if(viewWork){
  viewWork.addEventListener('mousemove',(e)=>{
    const rect=viewWork.getBoundingClientRect();
    const x=(e.clientX-rect.left)/rect.width - .5;
    const y=(e.clientY-rect.top)/rect.height - .5;
    viewWork.style.transform=`translate(${x*4}px, ${y*2}px)`;
  }, {passive:true});
  viewWork.addEventListener('mouseleave',()=>{ viewWork.style.transform='translate(0,0)'; });
}

// Fit the about canvas exactly to screen width without changing body transform.
function fitAbout(){
  if(!aboutWrap || !aboutStage) return;
  const baseW=1458;
  const baseH=2048;
  const scale=Math.min(window.innerWidth/baseW, 1);
  document.documentElement.style.setProperty('--about-scale', scale.toFixed(4));
  aboutWrap.style.height=(baseH*scale)+'px';
}
fitAbout();
window.addEventListener('resize', fitAbout, {passive:true});

const workPage=document.getElementById('work');
const workWrap=document.getElementById('workWrap');
const workStage=document.getElementById('workStage');

function fitWork(){
  if(!workWrap || !workStage) return;
  const baseW=1164;
  const baseH=2120;
  const scale=Math.min(window.innerWidth/baseW, 1);
  document.documentElement.style.setProperty('--work-scale', scale.toFixed(4));
  workWrap.style.height=(baseH*scale)+'px';
}
fitWork();
window.addEventListener('resize', fitWork, {passive:true});

// Smooth scroll nav + active section
function setActiveNav(id){
  navLinks.forEach(link=>{
    link.classList.toggle('active', link.dataset.section===id);
  });
}

document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',(e)=>{
    const href=link.getAttribute('href');
    if(!href || href==='#') return;
    const target=document.querySelector(href);
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior:'smooth', block:'start'});
    history.replaceState(null,'',href);
  });
});

if('IntersectionObserver' in window){
  const navObserver=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        setActiveNav(entry.target.dataset.sectionName);
        if(entry.target.id==='about' || entry.target.id==='services' || entry.target.id==='contact') entry.target.classList.add('in-view');
      }else if(entry.target.id==='about' || entry.target.id==='services' || entry.target.id==='contact'){
        entry.target.classList.remove('in-view');
      }
    });
  }, {threshold:.32, rootMargin:'-18% 0px -55% 0px'});
  sections.forEach(section=>navObserver.observe(section));
}else{
  window.addEventListener('scroll',()=>{
    const aboutTop=aboutPage ? aboutPage.getBoundingClientRect().top : 9999;
    setActiveNav(aboutTop < window.innerHeight*.5 ? 'about' : 'home');
  }, {passive:true});
}

// Scroll reveal for every about object.
const revealItems=document.querySelectorAll('.about-stage .scroll-reveal');
const workRevealItems=document.querySelectorAll('.work-stage .work-reveal');
const serviceRevealItems=document.querySelectorAll('.services-page .service-reveal, .services-page .services-copy, .services-page .services-collage');
const contactRevealItems=document.querySelectorAll('.contact-page .contact-reveal');
if('IntersectionObserver' in window){
  const revealObserver=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add('seen');
    });
  }, {threshold:.18, rootMargin:'0px 0px -8% 0px'});
  revealItems.forEach(el=>revealObserver.observe(el));
  workRevealItems.forEach(el=>revealObserver.observe(el));
  serviceRevealItems.forEach(el=>revealObserver.observe(el));
  contactRevealItems.forEach(el=>revealObserver.observe(el));
}else{
  revealItems.forEach(el=>el.classList.add('seen'));
  workRevealItems.forEach(el=>el.classList.add('seen'));
  serviceRevealItems.forEach(el=>el.classList.add('seen'));
  contactRevealItems.forEach(el=>el.classList.add('seen'));
}

// Gentle hover tilt on cards only. Quote collage gets scroll movement instead.
document.querySelectorAll('[data-tilt]:not(.quote-collage)').forEach((el)=>{
  let frame=null;
  el.addEventListener('mousemove',(e)=>{
    if(frame) return;
    frame=requestAnimationFrame(()=>{
      const r=el.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      const base=el.classList.contains('photo-card') ? 3 : 0;
      el.style.transform=`translate3d(${x*6}px, ${y*5}px, 0) rotate(${base + x*1.1}deg)`;
      frame=null;
    });
  }, {passive:true});
  el.addEventListener('mouseleave',()=>{
    if(frame){ cancelAnimationFrame(frame); frame=null; }
    const base=el.classList.contains('photo-card') ? 3 : 0;
    el.style.transform=base ? `rotate(${base}deg)` : '';
  });
});

// Strong scroll animation for About quote collage + small scroll drift on cards.
const quote=document.querySelector('.quote-collage');
const quotePaper=document.querySelector('.quote-paper');
const quoteGrid=document.querySelector('.quote-grid');
const quoteX=document.querySelector('.quote-x');
const logoPaper=document.querySelector('.logo-paper');
const parallaxCards=document.querySelectorAll('.about-stage .collage-card');
let scrollTick=false;

function animateAboutScroll(){
  scrollTick=false;
  const vh=window.innerHeight || 1;
  const activeLine=Math.min(vh*.35, 260);
  let currentSection='home';
  sections.forEach((section)=>{
    const sr=section.getBoundingClientRect();
    if(sr.top <= activeLine && sr.bottom > activeLine){
      currentSection=section.dataset.sectionName || currentSection;
    }
  });
  setActiveNav(currentSection);
  if(!aboutPage) return;
  const ar=aboutPage.getBoundingClientRect();
  const pageProgress=clamp((vh - ar.top) / (vh + ar.height), 0, 1);

  if(quote){
    const qr=quote.getBoundingClientRect();
    const qProgress=clamp((vh - qr.top) / (vh + qr.height), 0, 1);
    const c=(qProgress-.5)*2;
    if(quotePaper) quotePaper.style.transform=`translate3d(${c*34}px, ${c*-52}px, 0) rotate(${c*2.2}deg)`;
    if(quoteGrid) quoteGrid.style.transform=`translate3d(${c*-58}px, ${c*34}px, 0) rotate(${c*-3.2}deg)`;
    if(quoteX) quoteX.style.transform=`translate3d(${c*50}px, ${c*-38}px, 0) rotate(${5 + c*4.5}deg)`;
    if(logoPaper) logoPaper.style.transform=`translate3d(${c*42}px, ${c*-36}px, 0) rotate(${c*-2.8}deg)`;
  }

  parallaxCards.forEach((card, index)=>{
    if(!card.classList.contains('seen')) return;
    if(card.matches(':hover')) return;
    const r=card.getBoundingClientRect();
    const p=clamp((vh-r.top)/(vh+r.height),0,1)-.5;
    const amount=(index%2===0 ? 10 : -10);
    const base=card.classList.contains('photo-card') ? 3 : 0;
    card.style.transform=`translate3d(0, ${p*amount}px, 0) rotate(${base + p*.7}deg)`;
  });

  if(aboutPage){
    aboutPage.classList.toggle('in-view', pageProgress>.15 && pageProgress<.95);
  }
  if(workPage){
    const wr=workPage.getBoundingClientRect();
    const wp=clamp((vh - wr.top) / (vh + wr.height), 0, 1);
    workPage.classList.toggle('in-view', wp>.08 && wp<.98);
  }
}
function onScroll(){
  if(!scrollTick){
    scrollTick=true;
    requestAnimationFrame(animateAboutScroll);
  }
}
animateAboutScroll();
window.addEventListener('scroll', onScroll, {passive:true});
window.addEventListener('resize', onScroll, {passive:true});


// Work section micro interactions without cursor lag
document.querySelectorAll('[data-work-tilt]').forEach((el)=>{
  let frame=null;
  el.addEventListener('mousemove',(e)=>{
    if(frame) return;
    frame=requestAnimationFrame(()=>{
      const r=el.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      if(el.classList.contains('project-row')){
        el.style.transform=`translate3d(${x*5}px, ${y*4}px, 0)`;
      }else{
        el.style.transform=`translate3d(${x*8}px, ${y*6}px, 0) rotate(${x*.7}deg)`;
      }
      frame=null;
    });
  }, {passive:true});
  el.addEventListener('mouseleave',()=>{
    if(frame){ cancelAnimationFrame(frame); frame=null; }
    el.style.transform='';
  });
});

document.querySelectorAll('.work-filter button').forEach((btn)=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.work-filter button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});


// V15: creative micro animations only, no 3D experiment
const workFilter = document.querySelector('.work-filter');
const workFilterButtons = document.querySelectorAll('.work-filter button');

function updateFilterMarker(btn){
  if(!workFilter || !btn) return;
  const parentRect = workFilter.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  const x = btnRect.left - parentRect.left + (btnRect.width / 2) - 36;
  workFilter.style.setProperty('--filter-x', `${x}px`);
}

workFilterButtons.forEach((btn)=>{
  btn.addEventListener('mouseenter',()=>updateFilterMarker(btn));
  btn.addEventListener('click',()=>{
    updateFilterMarker(btn);
    btn.classList.remove('micro-clicked');
    void btn.offsetWidth;
    btn.classList.add('micro-clicked');
  });
});

window.addEventListener('resize',()=>{
  const activeFilter = document.querySelector('.work-filter button.active');
  updateFilterMarker(activeFilter);
}, {passive:true});

setTimeout(()=>{
  updateFilterMarker(document.querySelector('.work-filter button.active'));
}, 250);

document.querySelectorAll('.project-row, .project-info a, .work-purpose-note, .work-side-piece').forEach((el)=>{
  el.addEventListener('click',()=>{
    el.classList.remove('micro-clicked');
    void el.offsetWidth;
    el.classList.add('micro-clicked');
  });
});


// V16: micro animations on all pages
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

function updateScrollProgress(){
  const doc = document.documentElement;
  const total = Math.max(1, doc.scrollHeight - window.innerHeight);
  const progress = (window.scrollY / total) * 100;
  document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
}
updateScrollProgress();
window.addEventListener('scroll', updateScrollProgress, {passive:true});
window.addEventListener('resize', updateScrollProgress, {passive:true});

document.querySelectorAll('a, button, .stat, .collage-card, .project-row, .tool-grid img, .beyond-icons img, .download-cv-btn').forEach((el)=>{
  el.addEventListener('click',()=>{
    el.classList.remove('click-pulse');
    void el.offsetWidth;
    el.classList.add('click-pulse');
  });
});










// V23: WORK filter switches content inside same page
const workStageForFilter = document.getElementById('workStage');
const workWrapForFilter = document.getElementById('workWrap');
const workPageForFilter = document.getElementById('work');

function setWorkFilter(filter){
  if(!workStageForFilter) return;

  const isBranding = filter === 'branding';
  const isUiux = filter === 'uiux';
  const isPrint = filter === 'print';
  const isSocial = filter === 'social';
  const isIllustration = filter === 'illustration';

  workStageForFilter.classList.toggle('branding-mode', isBranding);
  workStageForFilter.classList.toggle('uiux-mode', isUiux);
  workStageForFilter.classList.toggle('print-mode', isPrint);
  workStageForFilter.classList.toggle('social-mode', isSocial);
  workStageForFilter.classList.toggle('illustration-mode', isIllustration);

  if(workPageForFilter){
    workPageForFilter.classList.toggle('branding-active', isBranding);
    workPageForFilter.classList.toggle('uiux-active', isUiux);
    workPageForFilter.classList.toggle('print-active', isPrint);
    workPageForFilter.classList.toggle('social-active', isSocial);
    workPageForFilter.classList.toggle('illustration-active', isIllustration);
  }

  document.querySelectorAll('.work-filter button').forEach((button)=>{
    button.classList.toggle('active', button.dataset.filter === filter);
  });

  if(isBranding){
    document.querySelectorAll('.branding-project').forEach((row)=>row.classList.add('seen'));
  }
  if(isUiux){
    document.querySelectorAll('.uiux-project').forEach((row)=>row.classList.add('seen'));
  }
  if(isPrint){
    document.querySelectorAll('.print-project').forEach((row)=>row.classList.add('seen'));
  }
  if(isSocial){
    document.querySelectorAll('.social-project').forEach((row)=>row.classList.add('seen'));
  }
  if(isIllustration){
    document.querySelectorAll('.illustration-project').forEach((row)=>row.classList.add('seen'));
  }

  workStageForFilter.classList.remove('filter-switching');
  void workStageForFilter.offsetWidth;
  workStageForFilter.classList.add('filter-switching');
  setTimeout(()=>workStageForFilter.classList.remove('filter-switching'), 650);

  if(workWrapForFilter){
    const baseW = 1164;
    const baseH = isIllustration ? 1765 : (isSocial ? 2120 : (isPrint ? 1765 : (isUiux ? 1440 : (isBranding ? 1765 : 2120))));
    const scale = Math.min(window.innerWidth / baseW, 1);
    workWrapForFilter.style.height = (baseH * scale) + 'px';
  }

  const activeFilter = document.querySelector(`.work-filter button[data-filter="${filter}"]`);
  if(typeof updateFilterMarker === 'function') updateFilterMarker(activeFilter);
}

document.querySelectorAll('.work-filter button[data-filter]').forEach((button)=>{
  button.addEventListener('click',()=>{
    const filter = button.dataset.filter || 'all';
    if(filter === 'branding') {
      setWorkFilter('branding');
    } else if(filter === 'uiux') {
      setWorkFilter('uiux');
    } else if(filter === 'print') {
      setWorkFilter('print');
    } else if(filter === 'social') {
      setWorkFilter('social');
    } else if(filter === 'illustration') {
      setWorkFilter('illustration');
    } else {
      setWorkFilter('all');
    }
  });
});

window.addEventListener('resize',()=>{
  if(workStageForFilter){
    if(workStageForFilter.classList.contains('branding-mode')) setWorkFilter('branding');
    else if(workStageForFilter.classList.contains('uiux-mode')) setWorkFilter('uiux');
    else if(workStageForFilter.classList.contains('print-mode')) setWorkFilter('print');
    else if(workStageForFilter.classList.contains('social-mode')) setWorkFilter('social');
    else if(workStageForFilter.classList.contains('illustration-mode')) setWorkFilter('illustration');
  }
}, {passive:true});

