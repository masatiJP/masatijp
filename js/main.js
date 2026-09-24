const CONFIG = {
  username: "masatiJP",
  email: "alexandr.masati@gmail.com",
  linkedin: "https://linkedin.com/",
  telegram: "https://t.me/masati_a",
  heroTitle: null,
  heroLede: null,
  maxProjects: 24
};

const LANG_COLORS = {
  JavaScript:"#f1e05a",TypeScript:"#3178c6",Python:"#3572A5",HTML:"#e34c26",CSS:"#563d7c",
  Java:"#b07219",Go:"#00ADD8",Rust:"#dea584","C++":"#f34b7d",C:"#555555","C#":"#178600",
  Shell:"#89e051",Ruby:"#701516",PHP:"#4F5D95",Swift:"#F05138",Kotlin:"#A97BFF",Vue:"#41b883",
  Dart:"#00B4AB",Lua:"#000080",Elixir:"#6e4a7e",Scala:"#c22d40",Jupyter:"#DA5B0B"
};
function langColor(l){ return LANG_COLORS[l] || '#8a8a8a'; }

document.getElementById('magnetBtn').href = "mailto:" + CONFIG.email;
document.getElementById('magnetBtn').lastChild.textContent = " " + CONFIG.email;
document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('socialRow').innerHTML = `
  <a href="https://github.com/${CONFIG.username}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> GitHub</a>
  <a href="${CONFIG.linkedin}" target="_blank" rel="noopener"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>
  <a href="${CONFIG.telegram}" target="_blank" rel="noopener"><i class="fa-brands fa-telegram"></i> Telegram</a>
  <a href="mailto:${CONFIG.email}"><i class="fa-solid fa-envelope"></i> Email</a>
`;

/* ---------- Тема с View Transitions API ---------- */
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
const icon = document.getElementById('themeIcon');
function paintTheme(theme){
  root.setAttribute('data-theme', theme);
  icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  localStorage.setItem('theme', theme);
}
toggle.addEventListener('click', ()=>{
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.startViewTransition(()=>paintTheme(next));
  } else paintTheme(next);
});
paintTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

/* ---------- Reveal ---------- */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ---------- Canvas: сеть узлов ---------- */
(function(){
  const canvas = document.getElementById('net');
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w,h,nodes=[],mouse={x:-9999,y:-9999};
  function resize(){
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    const count = Math.max(18, Math.min(46, Math.floor((canvas.offsetWidth*canvas.offsetHeight)/26000)));
    nodes = Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.35*devicePixelRatio,vy:(Math.random()-.5)*.35*devicePixelRatio}));
  }
  function accent(){ return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2451FF'; }
  function step(){
    ctx.clearRect(0,0,w,h);
    const col = accent();
    nodes.forEach(n=>{
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<0||n.x>w) n.vx*=-1;
      if(n.y<0||n.y>h) n.vy*=-1;
      const dx=mouse.x-n.x, dy=mouse.y-n.y, dist=Math.hypot(dx,dy);
      if(dist<140*devicePixelRatio){ n.x-=dx*0.0025; n.y-=dy*0.0025; }
    });
    for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i], b=nodes[j], d=Math.hypot(a.x-b.x,a.y-b.y), maxD=150*devicePixelRatio;
      if(d<maxD){ ctx.strokeStyle=col; ctx.globalAlpha=(1-d/maxD)*0.35; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
    }
    ctx.globalAlpha=1;
    nodes.forEach(n=>{ ctx.fillStyle=col; ctx.beginPath(); ctx.arc(n.x,n.y,2*devicePixelRatio,0,Math.PI*2); ctx.fill(); });
    if(!reduced) requestAnimationFrame(step);
  }
  window.addEventListener('resize', resize);
  canvas.addEventListener('pointermove', e=>{ const r=canvas.getBoundingClientRect(); mouse.x=(e.clientX-r.left)*devicePixelRatio; mouse.y=(e.clientY-r.top)*devicePixelRatio; });
  canvas.addEventListener('pointerleave', ()=>{ mouse.x=-9999; mouse.y=-9999; });
  document.addEventListener('visibilitychange', ()=>{ if(!document.hidden && !reduced) requestAnimationFrame(step); });
  resize(); step();
})();

/* ---------- Magnetic hover ---------- */
(function(){
  const btn = document.getElementById('magnetBtn');
  if(!window.matchMedia('(pointer:fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  btn.addEventListener('mousemove', e=>{
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX-r.left-r.width/2)*0.18}px, ${(e.clientY-r.top-r.height/2)*0.35}px)`;
  });
  btn.addEventListener('mouseleave', ()=>{ btn.style.transform='translate(0,0)'; });
})();

/* ---------- Галерея: кнопки + drag ---------- */
const gallery = document.getElementById('gallery');
function pageStep(){
  const first = gallery.querySelector('.page');
  return first ? first.getBoundingClientRect().width + 32 : 400;
}
function refreshCenter(){
  gallery.classList.toggle('gallery--center', gallery.scrollWidth <= gallery.clientWidth + 2);
}
document.getElementById('galNext').addEventListener('click',()=>gallery.scrollBy({left:pageStep(),behavior:'smooth'}));
document.getElementById('galPrev').addEventListener('click',()=>gallery.scrollBy({left:-pageStep(),behavior:'smooth'}));
let resizeTimer;
window.addEventListener('resize', ()=>{ clearTimeout(resizeTimer); resizeTimer=setTimeout(()=>{ renderGallery(); refreshCenter(); },150); });
gallery.addEventListener('keydown', e=>{
  if(e.key==='ArrowRight') gallery.scrollBy({left:200,behavior:'smooth'});
  if(e.key==='ArrowLeft') gallery.scrollBy({left:-200,behavior:'smooth'});
});
(function dragScroll(){
  let isDown=false,startX,scrollLeft;
  gallery.addEventListener('pointerdown', e=>{ isDown=true; startX=e.pageX; scrollLeft=gallery.scrollLeft; gallery.style.cursor='grabbing'; });
  window.addEventListener('pointerup', ()=>{ isDown=false; gallery.style.cursor='auto'; });
  gallery.addEventListener('pointermove', e=>{ if(!isDown) return; gallery.scrollLeft = scrollLeft - (e.pageX-startX); });
})();

/* ================== (uk / ru / en) ================== */
const TRANSLATIONS = {
  en: {
    brand: { default: "Portfolio" },
    nav: { projects:"Projects", stats:"GitHub", contact:"Contact" },
    hero: {
      fallbackTitle: "Turning code into things people actually use.",
      fallbackLede: "Developer. These are projects pulled straight from my GitHub - the list updates itself the moment I push something new.",
      greeting: name => `Hi, I'm ${name}.<br>Turning code into things people actually use.`
    },
    projects: { heading:"Repositories", sub:"Pulled straight from the GitHub API - sorted by stars, languages are real, links go to the live project sites." },
    gallery: {
      loading:"Loading repositories…", empty:"No public repositories yet.",
      site:"Site", repo:"Repository", descFallback:"No description added to this repo's About section yet.",
      today:"today", daysAgo:n=>`${n}d ago`, monthsAgo:n=>`${n}mo ago`, yearsAgo:n=>`${n}y ago`,
      errProfile: status=>`GitHub profile not found (${status}). Check CONFIG.username.`,
      errRepos: status=>`Couldn't fetch the repository list (${status}).`,
      errPrefix:"Couldn't load data from GitHub: "
    },
    stats: {
      heading:"GitHub by the numbers", sub:"Computed on the fly from the same API data - no third-party services, so it always loads.",
      publicRepos:"Public repositories", totalStars:"Total stars", totalForks:"Total forks", since:"On GitHub since",
      langHeading:"Languages across repos", calculating:"Calculating…", noLangData:"No language data."
    },
    contact: { heading:"Got a project or an idea?", text:"Open to interesting work and collaboration - feel free to just write." },
    footer: { suffix:"· this page is alive, data comes from the GitHub API" },
    meta: { line:(name,repos,followers)=>`<strong>${name}</strong> · ${repos} repositories · ${followers} followers`, titleSuffix:" - portfolio" },
    a11y: { themeToggle:"Toggle theme", langSwitcher:"Choose language", prevProjects:"Previous projects", nextProjects:"Next projects", galleryLabel:"Project list, 3 rows, scroll horizontally" }
  },
  ru: {
    brand: { default: "Портфолио" },
    nav: { projects:"Проекты", stats:"GitHub", contact:"Контакты" },
    hero: {
      fallbackTitle: "Собираю код в вещи, которыми пользуются.",
      fallbackLede: "Разработчик. Здесь - проекты прямо из моего GitHub: список обновляется сам, как только я что-то туда пушу.",
      greeting: name => `Привет, я ${name}.<br>Собираю код в вещи, которыми пользуются.`
    },
    projects: { heading:"Репозитории", sub:"Подгружено напрямую из GitHub API - сортировка по звёздам, языки настоящие, ссылки ведут на живые сайты проектов." },
    gallery: {
      loading:"Загружаю репозитории…", empty:"Публичных репозиториев пока нет.",
      site:"Сайт", repo:"Репозиторий", descFallback:"Описание пока не добавлено в about репозитория.",
      today:"сегодня", daysAgo:n=>`${n} дн. назад`, monthsAgo:n=>`${n} мес. назад`, yearsAgo:n=>`${n} г. назад`,
      errProfile: status=>`Профиль GitHub не найден (${status}). Проверь CONFIG.username.`,
      errRepos: status=>`Не удалось получить список репозиториев (${status}).`,
      errPrefix:"Не удалось загрузить данные с GitHub: "
    },
    stats: {
      heading:"GitHub в цифрах", sub:"Собственный расчёт статистики - по тем же данным, что уже пришли из API. Без сторонних сервисов, чтобы точно всегда открывалось.",
      publicRepos:"Публичных репозиториев", totalStars:"Звёзд суммарно", totalForks:"Форков суммарно", since:"На GitHub с",
      langHeading:"Языки в репозиториях", calculating:"Считаю…", noLangData:"Нет данных о языках."
    },
    contact: { heading:"Есть проект или идея?", text:"Открыт к интересным задачам и совместной работе - можно просто написать." },
    footer: { suffix:"· страница живая, данные - из GitHub API" },
    meta: { line:(name,repos,followers)=>`<strong>${name}</strong> · ${repos} репозиториев · ${followers} подписчиков`, titleSuffix:" - портфолио" },
    a11y: { themeToggle:"Переключить тему", langSwitcher:"Выбрать язык", prevProjects:"Предыдущие проекты", nextProjects:"Следующие проекты", galleryLabel:"Список проектов, 3 ряда, прокрутка по горизонтали" }
  },
  uk: {
    brand: { default: "Портфоліо" },
    nav: { projects:"Проєкти", stats:"GitHub", contact:"Контакти" },
    hero: {
      fallbackTitle: "Перетворюю код на речі, якими користуються.",
      fallbackLede: "Розробник. Тут - проєкти прямо з мого GitHub: список оновлюється сам, щойно я щось туди запушу.",
      greeting: name => `Привіт, я ${name}.<br>Перетворюю код на речі, якими користуються.`
    },
    projects: { heading:"Репозиторії", sub:"Завантажено напряму з GitHub API - сортування за зірками, мови справжні, посилання ведуть на живі сайти проєктів." },
    gallery: {
      loading:"Завантажую репозиторії…", empty:"Публічних репозиторіїв поки немає.",
      site:"Сайт", repo:"Репозиторій", descFallback:"Опис поки не додано в about репозиторію.",
      today:"сьогодні", daysAgo:n=>`${n} дн. тому`, monthsAgo:n=>`${n} міс. тому`, yearsAgo:n=>`${n} р. тому`,
      errProfile: status=>`Профіль GitHub не знайдено (${status}). Перевір CONFIG.username.`,
      errRepos: status=>`Не вдалося отримати список репозиторіїв (${status}).`,
      errPrefix:"Не вдалося завантажити дані з GitHub: "
    },
    stats: {
      heading:"GitHub у цифрах", sub:"Власний розрахунок статистики - за тими самими даними, що вже прийшли з API. Без сторонніх сервісів, щоб точно завжди відкривалося.",
      publicRepos:"Публічних репозиторіїв", totalStars:"Зірок загалом", totalForks:"Форків загалом", since:"На GitHub з",
      langHeading:"Мови в репозиторіях", calculating:"Рахую…", noLangData:"Немає даних про мови."
    },
    contact: { heading:"Є проєкт чи ідея?", text:"Відкритий до цікавих задач і співпраці - можна просто написати." },
    footer: { suffix:"· сторінка жива, дані - з GitHub API" },
    meta: { line:(name,repos,followers)=>`<strong>${name}</strong> · ${repos} репозиторіїв · ${followers} підписників`, titleSuffix:" - портфоліо" },
    a11y: { themeToggle:"Перемкнути тему", langSwitcher:"Обрати мову", prevProjects:"Попередні проєкти", nextProjects:"Наступні проєкти", galleryLabel:"Список проєктів, 3 ряди, прокручування по горизонталі" }
  }
};

function detectLang(){
  const saved = localStorage.getItem('lang');
  if(saved && TRANSLATIONS[saved]) return saved;
  const candidates = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en'];
  for(const c of candidates){
    const code = c.toLowerCase().split('-')[0];
    if(TRANSLATIONS[code]) return code;
  }
  return 'en';
}
let currentLang = detectLang();
function T(path){
  const walk = (obj) => path.split('.').reduce((o,k)=> (o && o[k]!==undefined) ? o[k] : undefined, obj);
  return walk(TRANSLATIONS[currentLang]) ?? walk(TRANSLATIONS.en) ?? path;
}

function applyStaticTranslations(){
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{ el.textContent = T(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el=>{ el.setAttribute('aria-label', T(el.dataset.i18nAria)); });
  if(!ghUser){
    document.getElementById('navName').textContent = T('brand.default');
    document.getElementById('heroTitle').innerHTML = T('hero.fallbackTitle');
    document.getElementById('heroLede').textContent = T('hero.fallbackLede');
    document.title = T('brand.default');
  }
  updateLangSwitchUI();
}

function updateLangSwitchUI(){
  document.getElementById('langCode').textContent = currentLang.toUpperCase();
  document.querySelectorAll('#langMenu li').forEach(li=>{
    const isActive = li.dataset.lang === currentLang;
    li.classList.toggle('active', isActive);
    li.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

function setLang(lang){
  if(!TRANSLATIONS[lang] || lang === currentLang){ closeLangMenu(); return; }
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyStaticTranslations();
  renderAll();
  closeLangMenu();
}

/* ---------- Меню переключателя языков ---------- */
const langBtn = document.getElementById('langBtn');
const langMenu = document.getElementById('langMenu');
function openLangMenu(){ langMenu.hidden = false; langBtn.setAttribute('aria-expanded','true'); }
function closeLangMenu(){ langMenu.hidden = true; langBtn.setAttribute('aria-expanded','false'); }
langBtn.addEventListener('click', (e)=>{ e.stopPropagation(); langMenu.hidden ? openLangMenu() : closeLangMenu(); });
langMenu.addEventListener('click', (e)=>{
  const li = e.target.closest('li[data-lang]');
  if(li) setLang(li.dataset.lang);
});
document.addEventListener('click', (e)=>{ if(!document.getElementById('langSwitch').contains(e.target)) closeLangMenu(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeLangMenu(); });

/* Кэш данных GitHub - чтобы при смене языка не дёргать API повторно */
let ghUser = null, ghOwnRepos = null, lastErrorInfo = null;
function renderAll(){
  if(ghUser){
    renderHero(ghUser);
    renderGallery();
    renderStats(ghUser, ghOwnRepos);
  } else if(lastErrorInfo){
    showError(lastErrorInfo);
  }
}

function timeAgo(dateStr){
  const days = Math.floor((Date.now()-new Date(dateStr).getTime())/86400000);
  if(days<1) return T('gallery.today');
  if(days<30) return T('gallery.daysAgo')(days);
  const months = Math.floor(days/30);
  if(months<12) return T('gallery.monthsAgo')(months);
  return T('gallery.yearsAgo')(Math.floor(months/12));
}

let sortedRepos = [];

function cardHTML(r, username){
  const demo = resolveDemo(r, username);
  return `
  <article class="card">
    <div class="card-top"><h3>${r.name}</h3></div>
    <p class="desc">${r.description ? r.description : T('gallery.descFallback')}</p>
    <div class="stats-row">
      ${r.language ? `<span class="lang"><span class="lang-dot" style="background:${langColor(r.language)}"></span>${r.language}</span>` : ''}
      <span><i class="fa-regular fa-star"></i> ${r.stargazers_count}</span>
      <span><i class="fa-solid fa-code-fork"></i> ${r.forks_count}</span>
      <span>${timeAgo(r.pushed_at)}</span>
    </div>
    <div class="card-links">
      ${demo ? `<a href="${demo}" target="_blank" rel="noopener"><i class="fa-solid fa-globe"></i> ${T('gallery.site')}</a>` : ''}
      <a href="${r.html_url}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> ${T('gallery.repo')}</a>
    </div>
  </article>`;
}


function renderGallery(){
  if(!sortedRepos.length){
    gallery.innerHTML = `<div class="state-msg">${T('gallery.empty')}</div>`;
    return;
  }
  const wide = window.matchMedia('(min-width:760px)').matches;
  const chunkSize = wide ? 9 : 3;
  const pages = [];
  for(let i=0;i<sortedRepos.length;i+=chunkSize) pages.push(sortedRepos.slice(i,i+chunkSize));

  gallery.innerHTML = pages.map(chunk => `
    <div class="page">${chunk.map(r=>cardHTML(r, CONFIG.username)).join('')}</div>
  `).join('');

  refreshCenter();
}


function resolveDemo(r, username){
  if(r.homepage && r.homepage.trim()){
    let url = r.homepage.trim();
    if(!/^https?:\/\//i.test(url)) url = 'https://' + url;
    return url;
  }
  if(r.has_pages){
    const isRootPages = r.name.toLowerCase() === `${username}.github.io`.toLowerCase();
    return isRootPages ? `https://${username}.github.io` : `https://${username.toLowerCase()}.github.io/${r.name}`;
  }
  return null;
}

function renderHero(user){
  document.getElementById('navName').textContent = user.name || user.login;
  document.title = (user.name || user.login) + T('meta.titleSuffix');
  document.getElementById('avatarImg').src = user.avatar_url;
  document.getElementById('metaLine').innerHTML = T('meta.line')(user.name || user.login, user.public_repos, user.followers);
  document.getElementById('avatarRow').style.display = 'flex';

  document.getElementById('heroTitle').innerHTML = CONFIG.heroTitle || T('hero.greeting')((user.name||user.login).split(' ')[0]);
  document.getElementById('heroLede').textContent = CONFIG.heroLede || user.bio || T('hero.fallbackLede');
}

function renderStats(user, ownRepos){
  const statsTop = document.getElementById('statsTop');
  if(!statsTop) return;

  const totalStars = ownRepos.reduce((s,r)=>s+r.stargazers_count,0);
  const totalForks = ownRepos.reduce((s,r)=>s+r.forks_count,0);
  const sinceYear = new Date(user.created_at).getFullYear();

  document.getElementById('statsTop').innerHTML = `
    <div class="stat-box"><div class="num">${user.public_repos}</div><div class="label">${T('stats.publicRepos')}</div></div>
    <div class="stat-box"><div class="num">${totalStars}</div><div class="label">${T('stats.totalStars')}</div></div>
    <div class="stat-box"><div class="num">${totalForks}</div><div class="label">${T('stats.totalForks')}</div></div>
    <div class="stat-box"><div class="num">${sinceYear}</div><div class="label">${T('stats.since')}</div></div>
  `;

  const langCount = {};
  ownRepos.forEach(r=>{ if(r.language) langCount[r.language] = (langCount[r.language]||0) + 1; });
  const langEntries = Object.entries(langCount).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxCount = langEntries.length ? langEntries[0][1] : 1;

  document.getElementById('langBars').innerHTML = langEntries.length ? langEntries.map(([lang,count])=>`
    <div class="lang-bar-row">
      <span class="name"><span class="lang-dot" style="background:${langColor(lang)}"></span><span>${lang}</span></span>
      <span class="track"><span class="fill" style="width:${(count/maxCount*100).toFixed(0)}%;background:${langColor(lang)}"></span></span>
      <span class="pct">${count}</span>
    </div>
  `).join('') : `<div class="state-msg" style="padding:0">${T('stats.noLangData')}</div>`;
}

function showError(info){
  let msg;
  if(info.type === 'profile') msg = T('gallery.errProfile')(info.status);
  else if(info.type === 'repos') msg = T('gallery.errRepos')(info.status);
  else msg = T('gallery.errPrefix') + info.message;
  gallery.innerHTML = `<div class="state-msg">${msg}</div>`;
  document.getElementById('statsTop').innerHTML = `<div class="state-msg">${msg}</div>`;
  document.getElementById('langBars').innerHTML = '';
}

async function loadGitHub(){
  const username = CONFIG.username;
  try{
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
    ]);
    if(!userRes.ok){ lastErrorInfo = { type:'profile', status:userRes.status }; showError(lastErrorInfo); return; }
    if(!reposRes.ok){ lastErrorInfo = { type:'repos', status:reposRes.status }; showError(lastErrorInfo); return; }
    const user = await userRes.json();
    const allRepos = await reposRes.json();
    const ownRepos = allRepos.filter(r=>!r.fork);

    ghUser = user;
    ghOwnRepos = ownRepos;
    lastErrorInfo = null;

    sortedRepos = [...ownRepos].sort((a,b)=> b.stargazers_count - a.stargazers_count || new Date(b.pushed_at)-new Date(a.pushed_at)).slice(0, CONFIG.maxProjects);

    renderHero(user);
    renderGallery();
    renderStats(user, ownRepos);

  }catch(err){
    lastErrorInfo = { type:'generic', message: err.message };
    showError(lastErrorInfo);
    console.error(err);
  }
}
applyStaticTranslations();
loadGitHub();
