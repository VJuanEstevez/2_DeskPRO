(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`deskpro:v1:`,t=new Map;function n(t,n=null){try{let r=window.localStorage.getItem(e+t);return r===null?n:JSON.parse(r)}catch{return n}}function r(t,n){try{window.localStorage.setItem(e+t,JSON.stringify(n))}catch{}a(t,n)}function i(e,n){return t.has(e)||t.set(e,new Set),t.get(e).add(n),()=>{let r=t.get(e);r&&(r.delete(n),r.size===0&&t.delete(e))}}function a(e,n){let r=t.get(e);if(r)for(let e of Array.from(r))try{e(n)}catch(e){console.error(`DeskPRO store listener failed`,e)}}var o=3e3,s=240,c=null,l=null;function u(e){let t=document.getElementById(`toast-region`);t&&(window.clearTimeout(c),window.clearTimeout(l),t.classList.remove(`is-leaving`),t.textContent=``,c=window.setTimeout(()=>{t.textContent=e,l=window.setTimeout(()=>{t.classList.add(`is-leaving`),l=window.setTimeout(()=>{t.classList.remove(`is-leaving`),t.textContent=``},s)},o)},40))}var d=[{id:`calendar`,label:`Calendario`,icon:`icon-calendar`},{id:`pomodoro`,label:`Pomodoro`,icon:`icon-timer`},{id:`weather`,label:`Clima`,icon:`icon-weather`},{id:`todo`,label:`To do List`,icon:`icon-check`},{id:`notebook`,label:`Notebook`,icon:`icon-book`},{id:`player`,label:`Reproductor`,icon:`icon-play`},{id:`favorites`,label:`Favoritos`,icon:`icon-star`},{id:`password`,label:`Contraseñas`,icon:`icon-key`},{id:`typography`,label:`Tipografía`,icon:`icon-type`},{id:`color`,label:`Color`,icon:`icon-palette`},{id:`textgen`,label:`Texto`,icon:`icon-text`}],f=[{name:`Madrid`,country:`España`,latitude:40.4168,longitude:-3.7038},{name:`Barcelona`,country:`España`,latitude:41.3874,longitude:2.1686},{name:`Buenos Aires`,country:`Argentina`,latitude:-34.6037,longitude:-58.3816},{name:`Ciudad de México`,country:`México`,latitude:19.4326,longitude:-99.1332},{name:`Bogotá`,country:`Colombia`,latitude:4.711,longitude:-74.0721},{name:`Santiago`,country:`Chile`,latitude:-33.4489,longitude:-70.6693},{name:`São Paulo`,country:`Brasil`,latitude:-23.5505,longitude:-46.6333},{name:`Londres`,country:`Reino Unido`,latitude:51.5072,longitude:-.1276},{name:`París`,country:`Francia`,latitude:48.8566,longitude:2.3522},{name:`Berlín`,country:`Alemania`,latitude:52.52,longitude:13.405},{name:`Roma`,country:`Italia`,latitude:41.9028,longitude:12.4964},{name:`Lisboa`,country:`Portugal`,latitude:38.7223,longitude:-9.1393},{name:`Nueva York`,country:`EE. UU.`,latitude:40.7128,longitude:-74.006},{name:`Los Ángeles`,country:`EE. UU.`,latitude:34.0522,longitude:-118.2437},{name:`Toronto`,country:`Canadá`,latitude:43.6532,longitude:-79.3832},{name:`Tokio`,country:`Japón`,latitude:35.6762,longitude:139.6503},{name:`Pekín`,country:`China`,latitude:39.9042,longitude:116.4074},{name:`Seúl`,country:`Corea del Sur`,latitude:37.5665,longitude:126.978},{name:`Sídney`,country:`Australia`,latitude:-33.8688,longitude:151.2093},{name:`Dubái`,country:`EAU`,latitude:25.2048,longitude:55.2708},{name:`Ciudad del Cabo`,country:`Sudáfrica`,latitude:-33.9249,longitude:18.4241},{name:`Reikiavik`,country:`Islandia`,latitude:64.1466,longitude:-21.9426}],p=`settings`,m={name:``,theme:`system`,defaultCity:`Madrid`,gridColumns:3,hiddenApps:[],appOrder:[]},h=!1;function g(){let e=n(p,{}),t=e&&typeof e==`object`?e:{},r=Math.round(Number(t.gridColumns));return{...m,...t,gridColumns:Number.isFinite(r)?Math.min(4,Math.max(2,r)):m.gridColumns}}function _(e){let t={...g(),...e};return r(p,t),v(t.theme),t}function v(e){let t=window.matchMedia(`(prefers-color-scheme: light)`),n=(e=>e===`system`?t.matches?`light`:`dark`:e)(e);document.documentElement.dataset.theme=n,document.documentElement.style.colorScheme=n,h||(h=!0,t.addEventListener(`change`,()=>{g().theme===`system`&&v(`system`)}))}function y(e){return i(p,()=>e(g()))}function b(){let e=g(),t=new Set(e.hiddenApps),n=d.filter(e=>!t.has(e.id)),r=e.appOrder.filter(e=>n.some(t=>t.id===e)),i=n.filter(e=>!r.includes(e.id)),a=r.map(e=>n.find(t=>t.id===e)).concat(i);return a.length>0?a:d}function x(){let e=document.getElementById(`settings-dialog`),t=document.getElementById(`settings-form`),n=document.getElementById(`settings-toggle`),r=document.getElementById(`settings-apps`),a=document.getElementById(`city-options`),o=document.getElementById(`setting-columns`),s=document.getElementById(`setting-columns-value`);if(!e||!t||!n||!r||!a)return;let c=e=>{let t=Math.round(Number(e));return Number.isFinite(t)?Math.min(4,Math.max(2,t)):g().gridColumns},l=e=>{let t=document.querySelector(`.dashboard__grid`);t&&t.style.setProperty(`--dashboard-columns`,String(e))},h=()=>{let e=g().gridColumns;o&&(o.min=`2`,o.max=`4`,o.value=String(e)),s&&(s.textContent=`${e} × ${e}`),l(e)};a.innerHTML=f.map(e=>`<option value="${S(e.name)}"></option>`).join(``),n.addEventListener(`click`,()=>{y(),x(),e.returnValue=``,typeof e.showModal==`function`?e.showModal():e.setAttribute(`open`,``)});let v=()=>{typeof e.close==`function`?e.close(`cancel`):e.removeAttribute(`open`)};document.getElementById(`settings-close`).addEventListener(`click`,v),document.getElementById(`settings-cancel`).addEventListener(`click`,v),e.addEventListener(`close`,()=>{if(e.returnValue!==`save`){h();return}let n=new FormData(t),r=String(n.get(`theme`)||`system`),i=String(n.get(`name`)||``).trim(),a=String(n.get(`city`)||``).trim()||m.defaultCity,s=g().gridColumns,l=o?c(o.value):s;_({name:i,theme:r,defaultCity:a,gridColumns:l}),h(),l!==s&&u(`Panel en ${l} × ${l}`),x()});let y=()=>{let e=g();t.elements.namedItem(`name`).value=e.name,t.elements.namedItem(`theme`).value=e.theme,t.elements.namedItem(`city`).value=e.defaultCity,h()};o&&o.addEventListener(`input`,()=>{let e=c(o.value);s&&(s.textContent=`${e} × ${e}`),l(e)});let x=()=>{let e=g(),t=new Set(e.hiddenApps),n=b().map(e=>e.id),i=d.filter(e=>!n.includes(e.id)),a=n.concat(i.map(e=>e.id));r.innerHTML=a.map((e,n)=>{let r=d.find(t=>t.id===e),i=!t.has(e);return`
          <li class="settings__app" data-app="${r.id}">
            <label class="settings__app-check">
              <input type="checkbox" name="visible-app" value="${r.id}" ${i?`checked`:``} />
              <span>${S(r.label)}</span>
            </label>
            <span class="settings__app-actions">
              <button class="icon-button icon-button--small" type="button" data-move="up" data-app="${r.id}" ${n===0?`disabled`:``} aria-label="Subir ${S(r.label)}">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#icon-arrow-up"></use></svg>
              </button>
              <button class="icon-button icon-button--small" type="button" data-move="down" data-app="${r.id}" ${n===a.length-1?`disabled`:``} aria-label="Bajar ${S(r.label)}">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#icon-arrow-down"></use></svg>
              </button>
            </span>
          </li>`}).join(``)};r.addEventListener(`click`,e=>{let t=e.target.closest(`button[data-move]`);if(!t)return;let n=t.closest(`.settings__app`),i=t.dataset.move===`up`?-1:1,a=i===-1?n.previousElementSibling:n.nextElementSibling;a&&(i===-1?r.insertBefore(n,a):r.insertBefore(a,n))}),t.addEventListener(`submit`,e=>{if(e.submitter&&e.submitter.value!==`save`)return;let t=[...r.querySelectorAll(`.settings__app`)].map(e=>e.dataset.app),n=[...r.querySelectorAll(`input[name="visible-app"]:checked`)].map(e=>e.value);_({appOrder:t,hiddenApps:t.filter(e=>!n.includes(e))})}),i(p,()=>{e.open&&x()})}function S(e){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`)}var ee=`https://nominatim.openstreetmap.org/reverse`,te=`https://geocoding-api.open-meteo.com/v1/search`,C=null,ne=new Map,re=new Map;function ie(){return C||(C=new Promise(e=>{let t=()=>{let t=g().defaultCity;w(t).then(e)};`geolocation`in navigator?navigator.geolocation.getCurrentPosition(t=>{let{latitude:n,longitude:r}=t.coords;se(n,r).then(t=>e({name:t,latitude:n,longitude:r,source:`gps`})).catch(()=>e({name:`${n.toFixed(2)}, ${r.toFixed(2)}`,latitude:n,longitude:r,source:`gps`}))},t,{enableHighAccuracy:!1,timeout:1e4,maximumAge:6e5}):t()}),C)}function ae(){C=null}function oe(e){return C=w(e),C}function w(e){let t=String(e||``).trim(),n=t.toLowerCase();return ne.has(n)?Promise.resolve(ne.get(n)):fetch(`${te}?name=${encodeURIComponent(t)}&count=1&language=es&format=json`).then(e=>{if(!e.ok)throw Error(`Geocoding failed: ${e.status}`);return e.json()}).then(e=>{let r=e.results&&e.results[0];if(!r)throw Error(`Place not found`);let i={name:r.name||t,latitude:r.latitude,longitude:r.longitude,source:`city`};return ne.set(n,i),i}).catch(()=>{let e={name:t,latitude:null,longitude:null,source:`city`};return ne.set(n,e),e})}function se(e,t){let n=`${e.toFixed(3)},${t.toFixed(3)}`;if(re.has(n))return Promise.resolve(re.get(n));let r=`${ee}?format=jsonv2&zoom=10&lat=${e}&lon=${t}&accept-language=es`;return fetch(r).then(e=>{if(!e.ok)throw Error(`Nominatim failed: ${e.status}`);return e.json()}).then(r=>{let i=r&&r.address||{},a=[i.city||i.town||i.village||i.municipality||i.county||i.state||r&&r.name||``,i.country||``].filter(Boolean).join(`, `)||`${e.toFixed(2)}, ${t.toFixed(2)}`;return re.set(n,a),a}).catch(()=>{let r=`${e.toFixed(2)}, ${t.toFixed(2)}`;return re.set(n,r),r})}var ce=new Intl.DateTimeFormat(`es-ES`,{hour:`2-digit`,minute:`2-digit`,second:`2-digit`}),le=new Intl.DateTimeFormat(`es-ES`,{weekday:`long`,day:`numeric`,month:`long`,year:`numeric`});function ue(){let e=document.getElementById(`header-time`),t=document.getElementById(`header-date`),n=document.getElementById(`header-place`),r=document.getElementById(`header-greeting`);if(!e||!t||!n||!r)return;let i=()=>{let n=new Date;e.textContent=ce.format(n),e.dateTime=n.toISOString(),t.textContent=pe(le.format(n)),r.textContent=fe(g().name,n)};i(),window.setInterval(i,1e3),y(e=>{i(),n.textContent=`Buscando ubicación…`,oe(e.defaultCity),de(n)}),de(n)}function de(e){ie().then(t=>{e.textContent=t.name}).catch(()=>{e.textContent=`Ubicación no disponible`})}function fe(e,t){let n=t.getHours(),r=n<6?`Buenas noches`:n<13?`Buenos días`:n<20?`Buenas tardes`:`Buenas noches`,i=e.trim();return i?`${r}, ${i}`:r}function pe(e){return e.charAt(0).toUpperCase()+e.slice(1)}var me=8,he=8,ge=window.matchMedia(`(max-width: 47.99rem)`),T=null;function _e(){return T||(T=document.createElement(`div`),T.className=`nav-tooltip`,T.setAttribute(`aria-hidden`,`true`),T.hidden=!0,document.body.appendChild(T),T)}function ve(e){if(ge.matches)return;let t=e.querySelector(`.side-nav__label`);if(!t||!t.textContent.trim())return;let n=_e();n.textContent=t.textContent.trim(),n.hidden=!1;let r=e.getBoundingClientRect(),i=n.getBoundingClientRect(),a=r.right+me;a+i.width>window.innerWidth-he&&(a=Math.max(he,r.left-me-i.width));let o=Math.min(Math.max(r.top+r.height/2,i.height/2+he),window.innerHeight-i.height/2-he);n.style.left=`${Math.round(a)}px`,n.style.top=`${Math.round(o)}px`}function ye(){T&&(T.hidden=!0)}function be(e){e.querySelectorAll(`.side-nav__link`).forEach(e=>{e.addEventListener(`pointerenter`,()=>ve(e)),e.addEventListener(`pointerleave`,ye),e.addEventListener(`focus`,()=>ve(e)),e.addEventListener(`blur`,ye)})}function xe(){let e=document.getElementById(`nav-apps`);if(!e)return;document.addEventListener(`keydown`,e=>{e.key===`Escape`&&ye()}),window.addEventListener(`scroll`,ye,!0),window.addEventListener(`resize`,ye);let t=document.querySelector(`.side-nav__list--footer`);t&&be(t);let n=()=>{let t=Se();e.innerHTML=b().map(e=>`
        <li class="side-nav__item">
          <a class="side-nav__link" href="#/${e.id}" data-app="${e.id}" ${t===e.id?`aria-current="page"`:``}>
            <svg class="icon side-nav__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <use href="#${e.icon}"></use>
            </svg>
            <span class="side-nav__label">${e.label}</span>
          </a>
        </li>`).join(``),be(e)};n(),window.addEventListener(`hashchange`,n),i(`settings`,n)}function Se(){return window.location.hash.replace(/^#\/?/,``).split(`?`)[0].replace(/\/$/,``)}function E(e,t={}){let n=t.size||18;return`<svg class="icon${t.className?` ${t.className}`:``}" viewBox="0 0 24 24" width="${n}" height="${n}" style="width:${n}px;height:${n}px" aria-hidden="true" focusable="false"><use href="#${e}"></use></svg>`}function D(e){return`<span class="input-with-clear">${e}<button class="input-clear" type="button" aria-label="Limpiar campo" hidden>${E(`icon-close`,{size:14})}</button></span>`}var Ce=8,we=8,O=null,Te=null,Ee=!1;function De(){return O||(O=document.createElement(`div`),O.className=`app-tooltip`,O.setAttribute(`aria-hidden`,`true`),O.hidden=!0,document.body.appendChild(O),O)}function Oe(){Ee||(Ee=!0,document.addEventListener(`pointerdown`,e=>{O&&!O.hidden&&(Te&&e.target instanceof Node&&Te.contains(e.target)||k())}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&k()}),window.addEventListener(`scroll`,k,!0),window.addEventListener(`resize`,k))}function ke(e,t){if(!e||!t)return;let n=De();Oe(),n.textContent=e,Te=t,n.hidden=!1;let r=t.getBoundingClientRect(),i=n.getBoundingClientRect(),a=Math.min(Math.max(we,r.left+r.width/2-i.width/2),Math.max(we,window.innerWidth-i.width-we)),o=r.top-i.height-Ce;o<we&&(o=r.bottom+Ce),n.style.left=`${Math.round(a)}px`,n.style.top=`${Math.round(o)}px`}function k(){O&&(O.hidden=!0),Te=null}function A(e){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function j(){return window.crypto&&typeof window.crypto.randomUUID==`function`?window.crypto.randomUUID():`id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function Ae(e){let t=Math.max(0,Math.round(e)),n=Math.floor(t/60),r=t%60;return`${n}:${String(r).padStart(2,`0`)}`}function je(e,t){let n=t.timeout||3e3,r=null,i=()=>{window.clearTimeout(r),e.dataset.armed=`false`,e.setAttribute(`aria-label`,t.label)};e.addEventListener(`click`,()=>{e.dataset.armed===`true`?(i(),t.onConfirm()):(e.dataset.armed=`true`,e.setAttribute(`aria-label`,t.confirmLabel),r=window.setTimeout(i,n))})}async function M(e){if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(e);return}let t=document.createElement(`textarea`);t.value=e,t.setAttribute(`readonly`,``),t.style.position=`fixed`,t.style.opacity=`0`,document.body.appendChild(t),t.select(),document.execCommand(`copy`),t.remove()}function Me(e){let t=Date.now()-e,n=Math.floor(t/6e4);if(n<1)return`ahora mismo`;if(n<60)return`hace ${n} min`;let r=Math.floor(n/60);if(r<24)return`hace ${r} h`;let i=Math.floor(r/24);return i<30?`hace ${i} d`:new Intl.DateTimeFormat(`es-ES`,{day:`numeric`,month:`short`}).format(new Date(e))}function Ne(e){let[t,n,r]=e.split(`-`).map(Number);return new Date(t,n-1,r)}function N(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}var Pe=`data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2032%2032%22%3E%3Crect%20width%3D%2232%22%20height%3D%2232%22%20rx%3D%228%22%20fill%3D%22%232b3646%22%2F%3E%3Cpath%20d%3D%22M13.5%2018.5a4.5%204.5%200%200%200%206.83.53l2.5-2.5a4.5%204.5%200%200%200-6.36-6.36l-1.4%201.41%22%20fill%3D%22none%22%20stroke%3D%22%239db0c4%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M18.5%2013.5a4.5%204.5%200%200%200-6.83-.53l-2.5%202.5a4.5%204.5%200%201%200%206.36%206.36l1.4-1.41%22%20fill%3D%22none%22%20stroke%3D%22%239db0c4%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E`,Fe=`pomodoro`,Ie=`DeskPRO · Dashboard de productividad`,Le=[{id:`focus`,label:`Foco`,minutes:25,next:`short`},{id:`short`,label:`Descanso corto`,minutes:5,next:`focus`},{id:`long`,label:`Descanso largo`,minutes:15,next:`focus`}],Re=54,ze=2*Math.PI*Re,Be=new Set,Ve=null,He=null,P=null,Ue=new Set,F={phase:`focus`,remaining:Le[0].minutes*60,running:!1,endsAt:0,alarm:!1,completed:n(Fe,{completed:0}).completed||0};function We(e){return Le.find(t=>t.id===e)||Le[0]}function Ge(){return We(F.phase).minutes*60}function I(e=!1){let t=Math.ceil(F.remaining);if(e||F.lastNotifiedSecond!==t){F.lastNotifiedSecond=t,Ke();for(let e of Array.from(Be))try{e({...F})}catch(e){console.error(`DeskPRO pomodoro listener failed`,e)}}}function Ke(){let e=We(F.phase);document.title=F.running?`${Ae(F.remaining)} · ${e.label} · DeskPRO`:Ie}function qe(){r(Fe,{completed:F.completed})}function Je(){if(!F.running)return;let e=Math.max(0,(F.endsAt-Date.now())/1e3);F.remaining=e,e<=0?Ye():I()}function Ye(e=!0){let t=We(F.phase),n=t.id===`focus`;n&&e&&(F.completed+=1),qe(),F.running=!1,F.phase=t.next,F.remaining=Ge(),F.endsAt=0,Ze(),et(),I(!0);let r=We(F.phase).label;u(e?`${n?`Foco completado`:`Descanso terminado`}. Sigue: ${r}`:`Fase saltada. Sigue: ${r}`),document.title=Ie}function Xe(){Ve===null&&(Ve=window.setInterval(Je,250))}function Ze(){Ve!==null&&(window.clearInterval(Ve),Ve=null)}function Qe(e,t){let n=e.createOscillator(),r=e.createGain();n.type=`sine`,n.frequency.value=880,r.gain.setValueAtTime(1e-4,t),r.gain.exponentialRampToValueAtTime(.2,t+.02),r.gain.exponentialRampToValueAtTime(1e-4,t+.3),n.connect(r),r.connect(e.destination),n.onended=()=>Ue.delete(n),Ue.add(n),n.start(t),n.stop(t+.35)}function $e(){if(!F.alarm||!P)return;if(P.state===`suspended`){let e=P.resume();e&&typeof e.catch==`function`&&e.catch(()=>{})}let e=P.currentTime;Qe(P,e),Qe(P,e+.32)}function et(){if(F.alarm)return;let e=window.AudioContext||window.webkitAudioContext;if(e)try{P||=new e}catch{P=null}F.alarm=!0,$e(),He=window.setInterval($e,1600),I(!0)}function tt(){if(F.alarm){F.alarm=!1,He!==null&&(window.clearInterval(He),He=null);for(let e of Ue)try{e.stop()}catch{}if(Ue.clear(),P&&P.state!==`closed`){let e=P.close();e&&typeof e.catch==`function`&&e.catch(()=>{})}P=null,I(!0)}}function nt(e){return Be.add(e),()=>Be.delete(e)}function rt(){return{...F}}function it(){F.running||(F.remaining<=0&&(F.remaining=Ge()),F.endsAt=Date.now()+F.remaining*1e3,F.running=!0,Xe(),I(!0))}function at(){F.running&&(F.running=!1,F.endsAt=0,Ze(),document.title=Ie,I(!0))}function ot(){F.running=!1,F.endsAt=0,F.remaining=Ge(),Ze(),document.title=Ie,I(!0)}function st(e){F.phase=e,F.running=!1,F.endsAt=0,F.remaining=Ge(),Ze(),document.title=Ie,I(!0)}function ct(){Ye(!1)}function lt(e){let t=Math.max(0,Math.round(e));return`PT${Math.floor(t/60)}M${t%60}S`}function ut(){let e=document.getElementById(`pomodoro-app`);if(!e)return;let t=We(F.phase),n=Ge(),r=ze*(1-(n>0?F.remaining/n:0)),i=e.querySelector(`#pomodoro-time`),a=e.querySelector(`#pomodoro-ring`),o=e.querySelector(`#pomodoro-toggle`),s=e.querySelector(`#pomodoro-status`),c=e.querySelector(`#pomodoro-completed`),l=e.querySelector(`#pomodoro-next`),u=e.querySelector(`#pomodoro-stop-alarm`);i&&(i.textContent=Ae(F.remaining),i.dateTime=lt(F.remaining));let d=e.querySelector(`#pomodoro-phase-label`);if(d&&(d.textContent=t.label),a&&(a.style.strokeDashoffset=String(r)),o&&(o.innerHTML=F.running?`${E(`icon-pause`)}<span>Pausar</span>`:`${E(`icon-play`)}<span>Iniciar</span>`),s&&(s.textContent=F.running?`En curso`:`En pausa`),c&&(c.textContent=String(F.completed)),l){let e=We(t.next);l.textContent=`Siguiente: ${e.label.toLowerCase()} (${e.minutes} min)`}u&&(u.hidden=!F.alarm),e.querySelectorAll(`input[name="pomodoro-phase"]`).forEach(e=>{e.checked=e.value===F.phase})}var dt={meta:{title:`Pomodoro`},render(e){e.innerHTML=`
      <section class="app app--pomodoro" id="pomodoro-app">
        <header class="app__header">
          <div>
            <h1 class="app__title">Pomodoro</h1>
          </div>
          <p class="pomodoro__status" id="pomodoro-status"></p>
        </header>

        <div class="pomodoro__layout">
          <fieldset class="segmented pomodoro__phases">
            <legend class="sr-only">Fase del temporizador</legend>
            ${Le.map(e=>`
              <input class="segmented__input" type="radio" name="pomodoro-phase" id="pomodoro-phase-${e.id}" value="${e.id}" ${e.id===F.phase?`checked`:``} />
              <label class="segmented__label" for="pomodoro-phase-${e.id}">${e.label}</label>`).join(``)}
          </fieldset>

          <div class="pomodoro__timer card">
            <div class="pomodoro__ring">
              <svg viewBox="0 0 120 120" role="img" aria-label="Progreso de la fase actual">
                <circle class="pomodoro__track" cx="60" cy="60" r="${Re}" />
                <circle
                  class="pomodoro__progress"
                  id="pomodoro-ring"
                  cx="60"
                  cy="60"
                  r="${Re}"
                  stroke-dasharray="${ze.toFixed(2)}"
                  stroke-dashoffset="0"
                />
              </svg>
              <div class="pomodoro__readout">
                <time class="pomodoro__time" id="pomodoro-time" datetime="PT25M">25:00</time>
                <span class="pomodoro__phase" id="pomodoro-phase-label">${A(We(F.phase).label)}</span>
              </div>
            </div>

            <div class="pomodoro__controls">
              <button class="button button--primary" id="pomodoro-toggle" type="button">${E(`icon-play`)}<span>Iniciar</span></button>
              <button class="button button--ghost" id="pomodoro-reset" type="button">${E(`icon-refresh`)}<span>Reiniciar</span></button>
              <button class="button button--ghost" id="pomodoro-skip" type="button">${E(`icon-chevron-right`)}<span>Saltar</span></button>
              <button class="button button--ghost pomodoro__stop-alarm" id="pomodoro-stop-alarm" type="button" hidden>
                ${E(`icon-stop`)}<span>Detener alarma</span>
              </button>
            </div>
          </div>

          <div class="pomodoro__stats">
            <div class="stat">
              <span class="stat__value" id="pomodoro-completed">0</span>
              <span class="stat__label">Focos completados</span>
            </div>
            <div class="stat">
              <span class="stat__value" id="pomodoro-next"></span>
              <span class="stat__label">Próxima fase</span>
            </div>
          </div>
        </div>
      </section>`;let t=i(Fe,e=>{F.completed=e&&e.completed||0,ut()});e.querySelector(`#pomodoro-toggle`).addEventListener(`click`,()=>{F.running?at():it()}),e.querySelector(`#pomodoro-reset`).addEventListener(`click`,()=>{ot(),u(`Temporizador reiniciado`)}),e.querySelector(`#pomodoro-skip`).addEventListener(`click`,()=>{ct()}),e.querySelector(`#pomodoro-stop-alarm`).addEventListener(`click`,()=>{tt(),u(`Alarma detenida`)}),e.querySelectorAll(`input[name="pomodoro-phase"]`).forEach(e=>{e.addEventListener(`change`,()=>st(e.value))});let n=nt(ut);return ut(),()=>{n(),t()}}},ft=`https://api.open-meteo.com/v1/forecast`,pt=6e5,mt=new Map,ht=new Map,gt=[{max:0,label:`Despejado`,icon:`wmo-clear`},{max:1,label:`Mayormente despejado`,icon:`wmo-partly`},{max:2,label:`Parcialmente nublado`,icon:`wmo-partly`},{max:3,label:`Nublado`,icon:`wmo-cloud`},{max:48,label:`Niebla`,icon:`wmo-fog`},{max:57,label:`Llovizna`,icon:`wmo-rain`},{max:67,label:`Lluvia`,icon:`wmo-rain`},{max:77,label:`Nieve`,icon:`wmo-snow`},{max:82,label:`Chubascos`,icon:`wmo-rain`},{max:86,label:`Nieve`,icon:`wmo-snow`},{max:99,label:`Tormenta`,icon:`wmo-storm`}];function _t(e){let t=Number(e),n=gt.find(e=>t<=e.max)||gt[gt.length-1];return{label:n.label,icon:n.icon}}function vt(e,t){let n=`${e.toFixed(3)},${t.toFixed(3)}`,r=mt.get(n);if(r&&Date.now()-r.at<pt)return Promise.resolve(r.data);let i=new URLSearchParams({latitude:String(e),longitude:String(t),current:`temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,precipitation`,hourly:`temperature_2m,precipitation_probability,weather_code,wind_speed_10m`,daily:`weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max`,timezone:`auto`,forecast_days:`7`});return fetch(`${ft}?${i}`).then(e=>{if(!e.ok)throw Error(`Open-Meteo failed: ${e.status}`);return e.json()}).then(e=>(mt.set(n,{data:e,at:Date.now()}),e))}function yt(e){let t=e.map(e=>e.name).join(`|`),n=ht.get(t);if(n&&Date.now()-n.at<pt)return Promise.resolve(n.data);let r=new URLSearchParams({latitude:e.map(e=>e.latitude).join(`,`),longitude:e.map(e=>e.longitude).join(`,`),current:`temperature_2m,weather_code,is_day`,timezone:`auto`});return fetch(`${ft}?${r}`).then(e=>{if(!e.ok)throw Error(`Open-Meteo failed: ${e.status}`);return e.json()}).then(n=>{let r=Array.isArray(n)?n:[n],i=e.map((e,t)=>{let n=(r[t]||{}).current||{};return{name:e.name,temperature:n.temperature_2m??null,weatherCode:n.weather_code??0,isDay:n.is_day===1}});return ht.set(t,{data:i,at:Date.now()}),i})}function bt(e,t){return vt(e,t).then(e=>{let t=e.current||{};return{temperature:t.temperature_2m??null,apparent:t.apparent_temperature??null,humidity:t.relative_humidity_2m??null,wind:t.wind_speed_10m??null,precipitation:t.precipitation??null,weatherCode:t.weather_code??0,isDay:t.is_day===1,time:t.time||``}})}var xt=null;function St(){return window.YT&&window.YT.Player?Promise.resolve(window.YT):xt||(xt=new Promise((e,t)=>{let n=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{typeof n==`function`&&n(),e(window.YT)};let r=document.createElement(`script`);r.src=`https://www.youtube.com/iframe_api`,r.async=!0,r.onerror=()=>{xt=null,t(Error(`No se pudo cargar la API de YouTube`))},document.head.appendChild(r),window.setTimeout(()=>{window.YT&&window.YT.Player?e(window.YT):(xt=null,t(Error(`La API de YouTube tardó demasiado en responder`)))},15e3)}),xt)}function Ct(e){let t=String(e||``).trim();if(!t)return null;if(/^[a-zA-Z0-9_-]{11}$/.test(t))return t;let n;try{n=new URL(t.startsWith(`http`)?t:`https://${t}`)}catch{return null}let r=n.hostname.replace(/^www\./,``);if(r===`youtu.be`)return Tt(n.pathname.slice(1));if(r===`youtube.com`||r===`m.youtube.com`||r===`music.youtube.com`){let e=n.searchParams.get(`v`);if(e)return Tt(e);let t=n.pathname.split(`/`).filter(Boolean),r=t.findIndex(e=>[`embed`,`shorts`,`live`,`v`].includes(e));if(r>=0&&t[r+1])return Tt(t[r+1])}return null}function wt(e){let t=`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${e}`)}&format=json`;return fetch(t).then(e=>e.ok?e.json():null).then(e=>e&&typeof e.title==`string`?e.title:null).catch(()=>null)}function Tt(e){let t=String(e).split(/[?&#]/)[0];return/^[a-zA-Z0-9_-]{11}$/.test(t)?t:null}var Et=`password-meta`,Dt={lower:{label:`Minúsculas`,chars:`abcdefghijklmnopqrstuvwxyz`},upper:{label:`Mayúsculas`,chars:`ABCDEFGHIJKLMNOPQRSTUVWXYZ`},digits:{label:`Números`,chars:`0123456789`},symbols:{label:`Símbolos`,chars:`!@#$%^&*()-_=+[]{};:,.?/`}},Ot=`0OoIl1|\`'"{}[]()/\\`,kt=[{min:0,label:`Débil`,tone:`weak`},{min:40,label:`Aceptable`,tone:`fair`},{min:60,label:`Fuerte`,tone:`strong`},{min:80,label:`Muy fuerte`,tone:`excellent`}];function At(e){let t=Math.floor(4294967296/e)*e,n=new Uint32Array(1),r=0;do window.crypto.getRandomValues(n),r=n[0];while(r>=t);return r%e}function jt(e){return e.charAt(At(e.length))}function Mt(e){let t=[...e];for(let e=t.length-1;e>0;--e){let n=At(e+1);[t[e],t[n]]=[t[n],t[e]]}return t}function Nt(e){let t=Object.keys(Dt).filter(t=>e[t]).map(e=>Dt[e].chars).map(t=>e.avoidAmbiguous?[...t].filter(e=>!Ot.includes(e)).join(``):t).filter(e=>e.length>0);if(t.length===0||e.length<t.length)return null;let n=t.join(``),r=t.map(e=>jt(e));for(;r.length<e.length;)r.push(jt(n));let i=Mt(r).join(``),a=Math.round(e.length*Math.log2(n.length));return{password:i,pool:n.length,entropy:a}}function Pt(e){return[...kt].reverse().find(t=>e>=t.min)||kt[0]}var Ft={meta:{title:`Contraseñas`},render(e){e.innerHTML=`
      <section class="app app--password">
        <header class="app__header">
          <div>
            <h1 class="app__title">Generador de contraseñas</h1>
          </div>
        </header>

        <div class="password__layout">
          <div class="password__result card">
            <label class="field__label" for="password-output">Contraseña generada</label>
            <div class="password__row">
              <output class="password__value" id="password-output" for="password-length">Pulsa «Generar»</output>
              <button class="icon-button" id="password-copy" type="button" aria-label="Copiar contraseña al portapapeles">
                ${E(`icon-copy`)}
              </button>
            </div>
            <div class="password__meter" id="password-meter" aria-hidden="true">
              <span class="password__meter-bar" data-level="0"></span>
              <span class="password__meter-bar" data-level="1"></span>
              <span class="password__meter-bar" data-level="2"></span>
              <span class="password__meter-bar" data-level="3"></span>
            </div>
            <p class="password__strength" id="password-strength">Aún sin generar</p>
          </div>

          <form class="password__options card" id="password-form">
            <div class="field">
              <div class="field__inline">
                <label class="field__label" for="password-length">Longitud</label>
                <output class="field__value" id="password-length-output" for="password-length">20</output>
              </div>
              <input class="field__control" id="password-length" name="length" type="range" min="8" max="64" value="20" step="1" />
            </div>

            <fieldset class="password__toggles">
              <legend class="field__label">Caracteres</legend>
              ${Object.entries(Dt).map(([e,t])=>`
                <label class="check">
                  <input class="check__input" type="checkbox" name="${e}" checked />
                  <span class="check__box" aria-hidden="true">${E(`icon-check-circle`,{size:14})}</span>
                  <span class="check__label">${t.label}</span>
                </label>`).join(``)}
              <label class="check">
                <input class="check__input" type="checkbox" name="avoidAmbiguous" />
                <span class="check__box" aria-hidden="true">${E(`icon-check-circle`,{size:14})}</span>
                <span class="check__label">Evitar ambiguos (0, O, l, 1)</span>
              </label>
            </fieldset>

            <div class="password__actions">
              <button class="button button--primary" type="submit">${E(`icon-refresh`)}<span>Generar</span></button>
            </div>
          </form>
        </div>
      </section>`;let t=e.querySelector(`#password-form`),i=e.querySelector(`#password-output`),a=e.querySelector(`#password-strength`),o=e.querySelector(`#password-length`),s=e.querySelector(`#password-length-output`),c=[...e.querySelectorAll(`.password__meter-bar`)],l=e.querySelector(`#password-copy`),d=``,f=null,p=()=>{let e=new FormData(t);return{length:Number(e.get(`length`)),lower:e.has(`lower`),upper:e.has(`upper`),digits:e.has(`digits`),symbols:e.has(`symbols`),avoidAmbiguous:e.has(`avoidAmbiguous`)}},m=e=>{d=e.password,i.textContent=e.password;let t=Pt(e.entropy),n=kt.findIndex(e=>e.tone===t.tone);c.forEach((e,t)=>{e.dataset.filled=t<=n?`true`:`false`}),a.dataset.tone=t.tone,a.textContent=`${t.label} · ${e.entropy} bits de entropía · ${e.pool} caracteres posibles`,r(Et,{entropy:e.entropy,length:e.password.length,level:t.label,at:Date.now()})};t.addEventListener(`submit`,e=>{e.preventDefault();let t=Nt(p());t?(m(t),u(`Contraseña generada`)):u(`Selecciona al menos un tipo de carácter y una longitud suficiente.`)}),o.addEventListener(`input`,()=>{s.textContent=o.value}),l.addEventListener(`click`,async()=>{if(!d)u(`Genera una contraseña primero`);else try{await M(d),u(`Contraseña copiada al portapapeles`),window.clearTimeout(f),l.setAttribute(`aria-label`,`Contraseña copiada`),f=window.setTimeout(()=>l.setAttribute(`aria-label`,`Copiar contraseña al portapapeles`),2500)}catch{u(`No se pudo copiar la contraseña`)}});let h=n(Et,null);return h&&typeof h.entropy==`number`&&(a.textContent=`Última generación: ${h.level} · ${h.entropy} bits`),()=>window.clearTimeout(f)}},It=`color-studio`,Lt={hue:214,saturation:76,lightness:56,harmony:`analogous`,scheme:`dark`},Rt=[{id:`complementary`,label:`Complementaria`,description:`Dos tonos opuestos en la rueda. Máximo contraste cromático.`,offsets:[0,180],names:[`Base`,`Complementario`]},{id:`analogous`,label:`Análoga`,description:`Tonos vecinos en la rueda. Una paleta serena y cohesionada.`,offsets:[-30,0,30],names:[`Análogo frío`,`Base`,`Análogo cálido`]},{id:`triadic`,label:`Triádica`,description:`Tres tonos equidistantes. Vitalidad sin perder el equilibrio.`,offsets:[0,120,240],names:[`Base`,`Tríada +120°`,`Tríada +240°`]},{id:`tetradic`,label:`Tetrádica`,description:`Cuatro tonos en dos parejas complementarias. Rica y versátil.`,offsets:[0,90,180,270],names:[`Base`,`Tetra +90°`,`Oposición`,`Tetra +270°`]},{id:`monochromatic`,label:`Monocromática`,description:`Un solo matiz con distintas luminosidades. Orden y profundidad.`,offsets:[0],names:[`Sombra`,`Sombra suave`,`Base`,`Luz suave`,`Luz`]}],zt={dark:{background:7,surface:11,surface2:16,border:28,text:95,muted:72,tint:16,direction:1},light:{background:97,surface:100,surface2:94,border:85,text:12,muted:42,tint:14,direction:-1}};function L(e,t,n){return Math.min(n,Math.max(t,e))}function Bt(e){return(e%360+360)%360}function Vt(e,t,n){let r=Bt(e)/360,i=L(t,0,100)/100,a=L(n,0,100)/100;if(i===0){let e=Math.round(a*255);return{r:e,g:e,b:e}}let o=a<.5?a*(1+i):a+i-a*i,s=2*a-o,c=e=>{let t=e;return t<0&&(t+=1),t>1&&--t,t<1/6?s+(o-s)*6*t:t<1/2?o:t<2/3?s+(o-s)*(2/3-t)*6:s};return{r:Math.round(c(r+1/3)*255),g:Math.round(c(r)*255),b:Math.round(c(r-1/3)*255)}}function Ht(e){return`#${[e.r,e.g,e.b].map(e=>L(Math.round(e),0,255).toString(16).padStart(2,`0`)).join(``)}`}function Ut(e){let t=String(e).replace(`#`,``),n=t.length===3?t.split(``).map(e=>e+e).join(``):t,r=Number.parseInt(n,16);return Number.isFinite(r)?{r:r>>16&255,g:r>>8&255,b:r&255}:{r:0,g:0,b:0}}function Wt(e){let{r:t,g:n,b:r}=Ut(e),i=t/255,a=n/255,o=r/255,s=Math.max(i,a,o),c=Math.min(i,a,o),l=s-c,u=(s+c)/2,d=0,f=0;return l!==0&&(f=u>.5?l/(2-s-c):l/(s+c),d=s===i?(a-o)/l+(a<o?6:0):s===a?(o-i)/l+2:(i-a)/l+4,d*=60),{h:Math.round(d),s:Math.round(f*100),l:Math.round(u*100)}}function Gt(e,t,n){return Ht(Vt(e,t,n))}function Kt(e){let{r:t,g:n,b:r}=Ut(e),i=e=>{let t=e/255;return t<=.03928?t/12.92:((t+.055)/1.055)**2.4};return .2126*i(t)+.7152*i(n)+.0722*i(r)}function R(e,t){let n=Kt(e),r=Kt(t),i=Math.max(n,r),a=Math.min(n,r);return(i+.05)/(a+.05)}function qt(e){return R(`#000000`,e)>=R(`#ffffff`,e)?`#000000`:`#ffffff`}function z(e,t,n){let r=Math.round(Bt(e)),i=Math.round(L(t,0,100)),a=Math.round(L(n,0,100)),o=Gt(r,i,a);return{h:r,s:i,l:a,hex:o,ink:qt(o)}}function Jt(e){return Rt.find(t=>t.id===e)||Rt[0]}function Yt(e,t){let n=Number(e);return Number.isFinite(n)?n:t}function Xt(){let e=n(It,{}),t=e&&typeof e==`object`?e:{};return{hue:Math.round(L(Yt(t.hue,Lt.hue),0,360)),saturation:Math.round(L(Yt(t.saturation,Lt.saturation),0,100)),lightness:Math.round(L(Yt(t.lightness,Lt.lightness),0,100)),harmony:Jt(t.harmony).id,scheme:t.scheme===`light`?`light`:`dark`}}function Zt(e){let t=Jt(e.harmony);return t.id===`monochromatic`?[-28,-14,0,14,28].map((n,r)=>({...z(e.hue,e.saturation,e.lightness+n),name:t.names[r]})):t.offsets.map((n,r)=>({...z(e.hue+n,e.saturation,e.lightness),name:t.names[r]}))}function Qt(e,t,n,r){let i=e.l,a=Gt(e.h,e.s,i),o=0;for(;R(a,t)<n&&o<100&&(i=L(i+r,0,100),a=Gt(e.h,e.s,i),o+=1,i!==0&&i!==100););return{...e,l:Math.round(i),hex:a,ink:qt(a)}}function $t(e,t){return e>=7?{level:`aaa`,label:`AAA`,pass:!0}:e>=4.5?{level:`aa`,label:`AA`,pass:!0}:e>=3&&t<=3?{level:`aa`,label:`AA · 3:1`,pass:!0}:{level:`fail`,label:`No cumple`,pass:!1}}function en(e){let t=zt[e.scheme]||zt.dark,n=e.hue,r=t.tint,i=t.direction,a=z(n,r,t.background),o=z(n,r,t.surface),s=z(n,Math.max(8,r-2),t.surface2),c=s.hex,l=Qt(z(n,Math.max(6,r-3),t.border),c,3,i),u=Qt(z(n,Math.max(8,r-4),t.text),c,4.5,i),d=Qt(z(n,Math.max(8,r-6),t.muted),c,4.5,i),f=Qt(z(n,e.saturation,e.lightness),c,4.5,i);return{background:a,surface:o,surface2:s,border:l,text:u,muted:d,accent:f,onAccent:f.ink,checks:{text:{ratio:R(u.hex,c),target:4.5,...$t(R(u.hex,c),4.5)},muted:{ratio:R(d.hex,c),target:4.5,...$t(R(d.hex,c),4.5)},border:{ratio:R(l.hex,c),target:3,...$t(R(l.hex,c),3)},accent:{ratio:R(f.hex,c),target:4.5,...$t(R(f.hex,c),4.5)}}}}function tn(e){return[{id:`background`,name:`Fondo`,color:e.background},{id:`surface`,name:`Superficie`,color:e.surface},{id:`surface-2`,name:`Superficie 2`,color:e.surface2},{id:`border`,name:`Borde`,color:e.border,check:e.checks.border},{id:`text`,name:`Texto`,color:e.text,check:e.checks.text},{id:`muted`,name:`Texto secundario`,color:e.muted,check:e.checks.muted},{id:`accent`,name:`Acento`,color:e.accent,check:e.checks.accent}]}var nn={meta:{title:`Color`},render(e){let t=Xt(),n=null,i=()=>{window.clearTimeout(n),n=window.setTimeout(()=>{n=null,r(It,t)},200)},a=Rt.map(e=>`
        <input class="segmented__input" type="radio" name="color-harmony" id="color-harmony-${e.id}" value="${e.id}" ${e.id===t.harmony?`checked`:``} />
        <label class="segmented__label" for="color-harmony-${e.id}">${A(e.label)}</label>`).join(``);e.innerHTML=`
      <section class="app app--color">
        <header class="app__header">
          <div>
            <h1 class="app__title">Laboratorio de color</h1>
            <p class="app__count">Elige un color base, explora armonías y genera neutros con contraste WCAG AA.</p>
          </div>
          <button class="button button--ghost" id="color-reset" type="button">
            ${E(`icon-refresh`)}<span>Restablecer</span>
          </button>
        </header>

        <div class="color__layout">
          <section class="color__panel color__picker card" aria-labelledby="color-picker-title">
            <header class="color__panel-head">
              <h2 class="color__panel-title" id="color-picker-title">Color base</h2>
              <output class="color__base-hex" id="color-base-hex" for="color-base-input"></output>
            </header>

            <div class="color__wheel-wrap">
              <div class="color__wheel" id="color-wheel" aria-hidden="true">
                <span class="color__wheel-handle" id="color-wheel-handle"></span>
              </div>

              <label class="color__native-control">
                <span class="field__label">Selector preciso</span>
                <input class="color__native" id="color-base-input" type="color" value="${Gt(t.hue,t.saturation,t.lightness)}" />
              </label>
            </div>

            <p class="field__hint">Arrastra sobre la rueda o usa los deslizadores. El selector y los controles de rango funcionan con teclado.</p>

            <details class="color__sliders-panel">
              <summary class="color__sliders-summary">Matiz, saturación y luminosidad</summary>

              <div class="color__sliders">
                <div class="field">
                  <div class="field__inline">
                    <label class="field__label" for="color-hue">Matiz</label>
                    <output class="field__value" id="color-hue-output" for="color-hue"></output>
                  </div>
                  <input class="field__control" id="color-hue" type="range" min="0" max="360" step="1" value="${t.hue}" />
                </div>

                <div class="field">
                  <div class="field__inline">
                    <label class="field__label" for="color-saturation">Saturación</label>
                    <output class="field__value" id="color-saturation-output" for="color-saturation"></output>
                  </div>
                  <input class="field__control" id="color-saturation" type="range" min="0" max="100" step="1" value="${t.saturation}" />
                </div>

                <div class="field">
                  <div class="field__inline">
                    <label class="field__label" for="color-lightness">Luminosidad</label>
                    <output class="field__value" id="color-lightness-output" for="color-lightness"></output>
                  </div>
                  <input class="field__control" id="color-lightness" type="range" min="0" max="100" step="1" value="${t.lightness}" />
                </div>
              </div>
            </details>
          </section>

          <section class="color__panel card" aria-labelledby="color-harmony-title">
            <header class="color__panel-head">
              <div>
                <h2 class="color__panel-title" id="color-harmony-title">Armonía</h2>
                <p class="field__hint" id="color-harmony-note"></p>
              </div>
              <div class="color__harmony-actions">
                <output class="color__harmony-name" id="color-harmony-name"></output>
                <button class="button button--ghost" id="color-copy-harmony" type="button">
                  ${E(`icon-copy`,{size:16})}<span>Copiar armonía</span>
                </button>
              </div>
            </header>

            <fieldset class="segmented color__rules" id="color-rules">
              <legend class="sr-only">Regla de armonía</legend>
              ${a}
            </fieldset>

            <ul class="color__swatches" id="color-swatches"></ul>
            <p class="field__hint">Selecciona una muestra para copiar su valor HEX.</p>
          </section>

          <section class="color__panel color__neutrals card" aria-labelledby="color-neutral-title">
            <header class="color__panel-head">
              <div>
                <h2 class="color__panel-title" id="color-neutral-title">Neutros de interfaz</h2>
                <p class="field__hint">Tonos de baja saturación derivados del color base, con pares ajustados a WCAG 2.1 AA.</p>
              </div>

              <button class="button button--ghost" id="color-copy-neutrals" type="button">
                ${E(`icon-copy`,{size:16})}<span>Seleccionar paleta</span>
              </button>

              <fieldset class="segmented color__scheme" id="color-scheme">
                <legend class="sr-only">Esquema de la interfaz</legend>
                <input class="segmented__input" type="radio" name="color-scheme" id="color-scheme-dark" value="dark" ${t.scheme===`dark`?`checked`:``} />
                <label class="segmented__label" for="color-scheme-dark">Oscuro</label>
                <input class="segmented__input" type="radio" name="color-scheme" id="color-scheme-light" value="light" ${t.scheme===`light`?`checked`:``} />
                <label class="segmented__label" for="color-scheme-light">Claro</label>
              </fieldset>
            </header>

            <div class="color__neutral-layout">
              <ul class="color__tokens" id="color-tokens"></ul>

              <div class="color__preview" id="color-preview">
                <p class="color__preview-eyebrow">Vista previa</p>
                <div class="color__preview-card">
                  <h3 class="color__preview-title">Interfaz con contraste AA</h3>
                  <p class="color__preview-body">
                    Los colores neutros mantienen la jerarquía visual y garantizan la lectura incluso en
                    pantallas con poca luz.
                  </p>
                  <p class="color__preview-actions">
                    <span class="color__preview-button">Acción principal</span>
                    <span class="color__preview-muted">Texto secundario</span>
                  </p>
                </div>
                <p class="color__preview-caption" id="color-contrast-summary"></p>
              </div>
            </div>
          </section>
        </div>
      </section>`;let o=e.querySelector(`#color-wheel`),s=e.querySelector(`#color-wheel-handle`),c=e.querySelector(`#color-base-input`),l=e.querySelector(`#color-base-hex`),d=e.querySelector(`#color-harmony-name`),f=e.querySelector(`#color-harmony-note`),p=e.querySelector(`#color-swatches`),m=e.querySelector(`#color-rules`),h=e.querySelector(`#color-scheme`),g=e.querySelector(`#color-tokens`),_=e.querySelector(`#color-preview`),v=e.querySelector(`#color-contrast-summary`),y=e.querySelector(`.app--color`),b=e.querySelector(`#color-hue`),x=e.querySelector(`#color-saturation`),S=e.querySelector(`#color-lightness`),ee=e.querySelector(`#color-hue-output`),te=e.querySelector(`#color-saturation-output`),C=e.querySelector(`#color-lightness-output`),ne=(e,t)=>{e.querySelectorAll(`input[type="radio"]`).forEach(e=>{e.checked=e.value===t})},re=()=>{let e=Gt(t.hue,t.saturation,t.lightness),n=t.hue*Math.PI/180,r=t.saturation*.46;s.style.left=`${50+Math.cos(n)*r}%`,s.style.top=`${50+Math.sin(n)*r}%`,s.style.setProperty(`--wheel-color`,e),o.style.setProperty(`--wheel-color`,e),c.value=e,l.textContent=e.toUpperCase(),b.value=String(t.hue),x.value=String(t.saturation),S.value=String(t.lightness),ee.textContent=`${t.hue}°`,te.textContent=`${t.saturation}%`,C.textContent=`${t.lightness}%`},ie=()=>{let e=Jt(t.harmony),n=Zt(t);d.textContent=e.label,f.textContent=e.description,p.classList.toggle(`color__swatches--five`,e.id===`monochromatic`),p.innerHTML=n.map(e=>`
          <li class="color__swatch-item">
            <button
              class="color__swatch"
              type="button"
              data-copy="${e.hex}"
              aria-label="Copiar ${e.hex.toUpperCase()} (${A(e.name)})"
              style="--swatch-color:${e.hex};--swatch-ink:${e.ink}"
            >
              <span class="color__swatch-name">${A(e.name)}</span>
              <span class="color__swatch-hex">${e.hex.toUpperCase()}</span>
              <span class="color__swatch-hsl">H ${e.h}° · S ${e.s}% · L ${e.l}%</span>
            </button>
          </li>`).join(``)},ae=()=>{let e=en(t),n=tn(e);g.innerHTML=n.map(e=>`
          <li class="color__token">
            <button
              class="color__token-button"
              type="button"
              data-copy="${e.color.hex}"
              aria-label="Copiar ${e.color.hex.toUpperCase()} (${A(e.name)})"
            >
              <span class="color__token-chip" style="--token-color:${e.color.hex}" aria-hidden="true"></span>
              <span class="color__token-body">
                <span class="color__token-name">${A(e.name)}</span>
                <span class="color__token-hex">${e.color.hex.toUpperCase()}</span>
              </span>
              ${e.check?`<span class="color__token-badge" data-level="${e.check.level}">${e.check.ratio.toFixed(2)}:1 · ${e.check.label}</span>`:`<span class="color__token-badge" data-level="base">Neutro</span>`}
            </button>
          </li>`).join(``),_.style.setProperty(`--preview-bg`,e.background.hex),_.style.setProperty(`--preview-surface`,e.surface.hex),_.style.setProperty(`--preview-surface-2`,e.surface2.hex),_.style.setProperty(`--preview-border`,e.border.hex),_.style.setProperty(`--preview-text`,e.text.hex),_.style.setProperty(`--preview-muted`,e.muted.hex),_.style.setProperty(`--preview-accent`,e.accent.hex),_.style.setProperty(`--preview-on-accent`,e.onAccent);let r=Object.values(e.checks).filter(e=>!e.pass);v.textContent=r.length===0?`Todos los pares de texto y componentes cumplen AA en fondo y superficies.`:`Ajusta el color base: algún par no alcanza el mínimo AA.`},oe=()=>{ne(m,t.harmony),ne(h,t.scheme),re(),ie(),ae()},w=e=>{t={...t,...e},i(),oe()},se=null,ce=e=>{let t=o.getBoundingClientRect(),n=t.left+t.width/2,r=t.top+t.height/2,i=e.clientX-n,a=e.clientY-r,s=Math.max(1,t.width/2),c=Math.min(s,Math.hypot(i,a)),l=Math.round((Math.atan2(a,i)*180/Math.PI+360)%360),u=Math.round(c/s*100);w({hue:l,saturation:u})};o.addEventListener(`pointerdown`,e=>{(e.pointerType!==`mouse`||e.button===0)&&(se=e.pointerId,o.setPointerCapture(e.pointerId),ce(e),e.preventDefault())}),o.addEventListener(`pointermove`,e=>{se===e.pointerId&&ce(e)});let le=e=>{se===e.pointerId&&(se=null,o.hasPointerCapture(e.pointerId)&&o.releasePointerCapture(e.pointerId))};return o.addEventListener(`pointerup`,le),o.addEventListener(`pointercancel`,le),c.addEventListener(`input`,()=>{let e=Wt(c.value);w({hue:e.h,saturation:e.s,lightness:e.l})}),b.addEventListener(`input`,()=>w({hue:Number(b.value)})),x.addEventListener(`input`,()=>w({saturation:Number(x.value)})),S.addEventListener(`input`,()=>w({lightness:Number(S.value)})),m.addEventListener(`change`,e=>{e.target.name===`color-harmony`&&w({harmony:e.target.value})}),h.addEventListener(`change`,e=>{e.target.name===`color-scheme`&&w({scheme:e.target.value})}),y.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-copy]`);if(t)try{await M(t.dataset.copy),u(`Color ${t.dataset.copy.toUpperCase()} copiado`)}catch{u(`No se pudo copiar el color`)}}),e.querySelector(`#color-copy-harmony`).addEventListener(`click`,async()=>{let e=Jt(t.harmony),n=Zt(t).map(e=>e.hex.toUpperCase());try{await M(n.join(`, `)),u(`Armonía ${e.label} copiada`)}catch{u(`No se pudo copiar la armonía`)}}),e.querySelector(`#color-copy-neutrals`).addEventListener(`click`,async()=>{let e=tn(en(t)).map(e=>`${e.name}: ${e.color.hex.toUpperCase()}`).join(`
`);try{await M(e),u(`Paleta de neutros copiada`)}catch{u(`No se pudo copiar la paleta`)}}),e.querySelector(`#color-reset`).addEventListener(`click`,()=>{t={...Lt},r(It,t),oe(),u(`Laboratorio de color restablecido`)}),oe(),()=>{n!==null&&(window.clearTimeout(n),n=null,r(It,t))}}},rn=[{id:`sci-fi`,label:`Ciencia ficción`,tagline:`Futuros posibles, tecnología y preguntas incómodas`,characters:[`Mara Voss`,`Elián Ríos`,`Nadia Kovács`,`Tomás Vela`],places:[`la estación orbital Ámbar`,`la colonia de Nuevo Cádiz`,`el cinturón de Kepler`,`la ciudad sumergida de Lerna`],objects:[`un archivo prohibido`,`un núcleo de memoria`,`una señal sin origen`,`un prototipo de conciencia artificial`],openers:[`En {place}, {character} encuentra {object} y decide guardar el secreto.`,`La rutina de {character} se rompe cuando {object} empieza a emitir una frecuencia imposible.`,`Nadie en {place} parece recordar la noche en que {character} llegó con {object} entre las manos.`,`Cuando el sistema de {place} falla, {character} descubre que {object} no era parte del diseño.`],beats:[`Las autoridades aseguran que todo está bajo control, pero {character} detecta mensajes que solo {object} puede descifrar.`,`Una vieja aliada ofrece ayuda a cambio de algo que {character} juró no volver a usar.`,`Cada respuesta abre una pregunta peor: si la señal viene del futuro, alguien tuvo que enviarla.`,`El tiempo se agota y la única forma de detener la falla es desconectar aquello que mantiene con vida a la colonia.`,`En los registros aparece un nombre borrado, el mismo que {character} lleva tatuado desde la infancia.`,`La tripulación se divide entre revelar la verdad o conservar la calma hasta que llegue el relevo.`],closers:[`Con la cuenta atrás en marcha, {character} deberá elegir entre la verdad y la última posibilidad de volver a casa.`,`Lo que empezó como una anomalía se convierte en la primera prueba de que nadie está solo.`,`Al final, la señal no pedía rescate: pedía permiso para quedarse.`,`Y cuando la puerta se abre, {character} comprende que el futuro ya estaba allí, esperando.`],titles:[`La última señal`,`Órbita de cristal`,`El archivo Ámbar`,`Nadie está solo`,`Memoria cero`,`El futuro ya estaba allí`]},{id:`noir`,label:`Cine negro`,tagline:`Ciudades húmedas, secretos a media voz y deudas pendientes`,characters:[`Vera Salgado`,`Julián Corso`,`Lola Mendieta`,`Bruno Cifuentes`],places:[`el puerto de la ciudad`,`un club de jazz en la calle Mayor`,`la comisaría del distrito 7`,`un hotel de carretera`],objects:[`una fotografía quemada`,`un maletín sin dueño`,`una grabación de voz`,`una llave de habitación`],openers:[`La noche en que {character} aceptó el caso, {place} olía a lluvia y a gasolina.`,`En {place}, {character} encuentra {object} y comprende que alguien ha estado borrando sus pasos.`,`Todo empieza con una llamada anónima y con {object} sobre la mesa de {character}.`,`Cuando {character} llega a {place}, la persona con la que había quedado ya no respira.`],beats:[`La versión oficial no encaja: los testigos cambian de historia cada vez que {character} vuelve a preguntar.`,`Una deuda antigua vuelve a la superficie y arrastra consigo a la persona equivocada.`,`La grabación revela una conversación que nadie debería haber oído, y ahora {character} también la ha oído.`,`Cada pista conduce a {place}, pero allí nadie admite haber visto {object}.`,`La policía quiere cerrar el caso; {character} solo necesita una noche más para demostrar que se equivocan.`,`El silencio de la ciudad se rompe con un disparo que nadie quiere denunciar.`],closers:[`Cuando amanece, {character} sabe que la verdad no le devolverá lo que perdió, pero al menos le dará un nombre.`,`La ciudad sigue girando, indiferente, mientras {character} guarda {object} en el bolsillo y se aleja.`,`No hay héroes en esta historia, solo personas que decidieron no mirar hacia otro lado.`,`Y en {place}, alguien apaga la última luz sabiendo que la cuenta sigue abierta.`],titles:[`Noche en el distrito 7`,`La llave de la habitación 9`,`Lluvia sobre el puerto`,`El caso Salgado`,`Nadie lo vio`,`La última luz`]},{id:`adventure`,label:`Aventura`,tagline:`Mapas incompletos, rutas imposibles y tesoros que no son de oro`,characters:[`Alba Ferrer`,`Mateo Quinn`,`Sira Ndiaye`,`Hugo Ballester`],places:[`una isla sin nombre`,`el desfiladero de las Ánimas`,`un templo cubierto por la selva`,`el puerto de San Telmo`],objects:[`un mapa incompleto`,`una brújula que no apunta al norte`,`una llave de piedra`,`un diario de viaje`],openers:[`El mapa que {character} heredó de su abuelo señalaba {place}, pero no aparecía en ningún atlas.`,`Cuando la tormenta arrastra a {character} hasta {place}, la expedición ya no tiene vuelta atrás.`,`En {place}, {character} encuentra {object} y una advertencia escrita en una lengua que nadie reconoce.`,`La leyenda decía que {place} concedía un deseo; {character} solo quería encontrar a quien desapareció allí.`],beats:[`La ruta se bifurca y cada camino exige un precio distinto: agua, tiempo o confianza.`,`Un miembro de la expedición guarda silencio sobre {object}, y {character} empieza a sospechar.`,`El terreno cede bajo sus pies y el grupo queda separado justo cuando la marea empieza a subir.`,`En las paredes de {place} aparecen marcas frescas: alguien estuvo allí antes y dejó un mensaje.`,`La brújula gira sin sentido y {character} comprende que el camino correcto es el que nadie quiere tomar.`,`Un pacto con los habitantes de la zona obliga a {character} a elegir entre el tesoro y la promesa.`],closers:[`Con el sol cayendo sobre {place}, {character} entiende que algunas riquezas solo valen si se comparten.`,`La expedición vuelve sin {object}, pero con una historia que nadie creerá.`,`Y en el mapa, el lugar que antes era una mancha ahora tiene un nombre: el de quien se atrevió a buscarlo.`,`Al final, {character} no encuentra lo que buscaba, sino lo que necesitaba.`],titles:[`El mapa incompleto`,`La isla sin nombre`,`La brújula del sur`,`Bajo el templo`,`La promesa del desfiladero`,`Lo que queda del tesoro`]},{id:`drama`,label:`Drama`,tagline:`Regresos, silencios familiares y verdades que pesan`,characters:[`Irene Alvarado`,`Samuel Rueda`,`Clara Ortiz`,`Daniel Sarmiento`],places:[`la casa familiar junto al río`,`un pueblo que se vacía`,`el hospital de la capital`,`un teatro cerrado`],objects:[`una carta sin abrir`,`un vestido heredado`,`una cinta de cassette`,`un cuaderno de cuentas`],openers:[`Cuando {character} vuelve a {place} después de veinte años, nadie le pregunta por qué se fue.`,`En {place}, {character} encuentra {object} y recuerda una conversación que creía olvidada.`,`La familia se reúne en {place} para decidir qué hacer con la casa, pero {character} se niega a firmar.`,`Una llamada desde {place} obliga a {character} a enfrentarse a la persona que juró no volver a ver.`],beats:[`Las viejas heridas se reabren durante la cena y cada silencio dice más que una acusación.`,`La carta revela una verdad que cambia el lugar de todos en la familia.`,`Mientras el pueblo se prepara para la fiesta, {character} busca {object} en habitaciones que ya no reconoce.`,`Una decisión tomada hace años vuelve a estar sobre la mesa, y esta vez nadie puede evitarla.`,`{character} descubre que {object} no era un recuerdo, sino una promesa pendiente.`,`La enfermedad de un ser querido obliga a todos a hablar de lo que llevaban tiempo callando.`],closers:[`Al amanecer, {character} comprende que volver no arregla el pasado, pero puede cambiar lo que viene.`,`La casa queda en silencio, y por primera vez en años ese silencio no duele.`,`Nadie dice «te perdono», pero alguien deja la puerta abierta.`,`Y {character} se queda un rato más, solo para ver cómo entra la luz por la ventana.`],titles:[`La casa junto al río`,`La carta sin abrir`,`Veinte años después`,`El silencio de los Alvarado`,`La puerta abierta`,`Lo que no dijimos`]},{id:`comedy`,label:`Comedia`,tagline:`Planes absurdos, malentendidos y finales que nadie ensayó`,characters:[`Rita Peláez`,`Nico Sanabria`,`Marisol K.`,`Fer Alcaraz`],places:[`una boda en el campo`,`la oficina del tercer piso`,`un mercado de barrio`,`una residencia de estudiantes`],objects:[`un bizcocho demasiado grande`,`una maleta equivocada`,`un disfraz de dinosaurio`,`un contrato sin leer`],openers:[`Todo lo que podía salir mal en {place} empieza a salir mal cuando {character} llega con {object}.`,`{character} solo quería resolver un trámite rápido, pero terminó en {place} con {object} en las manos.`,`La boda era perfecta hasta que {object} apareció flotando en la piscina.`,`Nadie sabe cómo, pero {character} ha reservado {place} para una celebración que no existe.`],beats:[`Para disimular, {character} inventa una coartada que crece hasta incluir a media ciudad.`,`La persona equivocada recibe el mensaje equivocado y decide tomarse la revancha con entusiasmo.`,`Cada intento de arreglarlo provoca una cadena de malentendidos más difícil de desmontar.`,`Un invitado inesperado confunde a {character} con alguien importante y nadie se atreve a corregirlo.`,`El grupo improvisa un plan que funciona solo porque nadie tiene tiempo de leerlo entero.`,`Cuando parece que todo está perdido, {object} se convierte en la solución más absurda posible.`],closers:[`Al final, la fiesta termina con todos bailando y nadie recuerda exactamente qué se celebraba.`,`{character} sale de {place} con una multa, dos amigos nuevos y una historia para no contar en la cena.`,`La verdad sale a la luz, pero para entonces ya nadie está dispuesto a renunciar al pastel.`,`Y en el grupo de mensajes queda la prueba de que, a veces, el caos también sabe organizarse.`],titles:[`Una boda muy imperfecta`,`El bizcocho de la discordia`,`Reserva para nadie`,`Maleta equivocada`,`La oficina del tercer piso`,`Todo bajo control (más o menos)`]},{id:`horror`,label:`Terror`,tagline:`Casas que recuerdan, pueblos que callan y puertas que no estaban`,characters:[`Elena Ríos`,`Marcos Vale`,`la señora Durán`,`Iván Sotelo`],places:[`una casa rural aislada`,`el ala cerrada del sanatorio`,`un bosque sin pájaros`,`un pueblo junto al embalse`],objects:[`una muñeca sin ojos`,`una grabadora encendida`,`una puerta que no estaba allí`,`un espejo cubierto`],openers:[`La primera noche en {place}, {character} escucha pasos en el piso de arriba.`,`El pueblo entero evita hablar de {place}, y {character} comprende por qué cuando encuentra {object}.`,`Cuando {character} llega a {place}, la puerta está abierta y dentro no hay nadie.`,`La grabadora se enciende sola y reproduce una conversación que aún no ha ocurrido.`],beats:[`Las marcas en la pared cambian de sitio cada vez que {character} aparta la mirada.`,`Alguien ha dejado {object} en la habitación, aunque la habitación llevaba años cerrada.`,`Los vecinos sonríen demasiado y repiten la misma frase cuando se les pregunta por los desaparecidos.`,`Cada noche, la misma voz susurra un nombre distinto; la última vez pronunció el de {character}.`,`La única salida del pueblo aparece cortada por la niebla, y el teléfono solo emite una respiración.`,`{character} descubre que {object} esconde un registro de todos los que intentaron irse antes.`],closers:[`Cuando la mañana llega, {character} ya no está seguro de haber salido de {place}.`,`La casa queda vacía, pero la grabadora sigue encendida.`,`Nadie vuelve a mencionar a {character}, y eso, en {place}, significa que algo ha terminado.`,`Y en el espejo, por un instante, aparece alguien que no debería estar allí.`],titles:[`La casa que respira`,`No mires al espejo`,`El pueblo sin pájaros`,`La grabadora`,`La última habitación`,`Alguien llamó a la puerta`]}];function an(e){return rn.find(t=>t.id===e)||rn[0]}var on=`text-generator`,sn={theme:`sci-fi`,paragraphs:3,sentences:4,includeTitle:!0,output:{title:``,paragraphs:[]}};function cn(e,t,n,r){let i=Number(e);return Number.isFinite(i)?Math.min(n,Math.max(t,Math.round(i))):r}function ln(e){let t=[...e];for(let e=t.length-1;e>0;--e){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t}function B(e){let t=[];return()=>(t.length===0&&(t=ln(e)),t.pop())}function un(e,t,n){let r=e(),i=0;for(;t.has(r)&&i<n;)r=e(),i+=1;return t.add(r),r}function dn(e,t){return e.replace(/\{(\w+)\}/g,(e,n)=>t[n]||e)}function fn(e,t,n){let r=B(e.characters),i=B(e.places),a=B(e.objects),o=B(e.openers),s=B(e.beats),c=B(e.closers),l=B(e.titles),u=[];for(let l=0;l<t;l+=1){let t={character:r(),place:i(),object:a()},l=[dn(o(),t)],d=new Set;for(;l.length<n-1;){let n=un(s,d,e.beats.length*2);l.push(dn(n,t))}n>1&&l.push(dn(c(),t)),u.push(l.join(` `))}return{title:l(),paragraphs:u}}function pn(){let e=n(on,{}),t=e&&typeof e==`object`?e:{},r=t.output&&typeof t.output==`object`?t.output:{},i=Array.isArray(r.paragraphs)?r.paragraphs.filter(e=>typeof e==`string`&&e.trim()):[];return{theme:an(t.theme).id,paragraphs:cn(t.paragraphs,1,8,sn.paragraphs),sentences:cn(t.sentences,2,6,sn.sentences),includeTitle:t.includeTitle!==!1,output:{title:typeof r.title==`string`?r.title:``,paragraphs:i}}}var mn={meta:{title:`Generador de textos`},render(e){let t=pn(),n=an(t.theme);e.innerHTML=`
      <section class="app app--textgen">
        <header class="app__header">
          <div>
            <h1 class="app__title">Generador de textos</h1>
            <p class="app__count">Sinopsis de película por temática, con control de párrafos y frases.</p>
          </div>
          <button class="button button--ghost" id="textgen-copy" type="button">
            ${E(`icon-copy`)}<span>Copiar texto</span>
          </button>
        </header>

        <div class="textgen__layout">
          <form class="textgen__controls card" id="textgen-form">
            <div class="field">
              <label class="field__label" for="textgen-theme">Temática</label>
              <select class="field__control" id="textgen-theme" name="theme">
                ${rn.map(e=>`<option value="${e.id}" ${e.id===t.theme?`selected`:``}>${A(e.label)}</option>`).join(``)}
              </select>
              <p class="field__hint" id="textgen-theme-note">${A(n.tagline)}</p>
            </div>

            <div class="field">
              <div class="field__inline">
                <label class="field__label" for="textgen-paragraphs">Párrafos</label>
                <output class="field__value" id="textgen-paragraphs-output" for="textgen-paragraphs">${t.paragraphs}</output>
              </div>
              <input
                class="field__control"
                id="textgen-paragraphs"
                name="paragraphs"
                type="range"
                min="1"
                max="8"
                step="1"
                value="${t.paragraphs}"
              />
            </div>

            <div class="field">
              <div class="field__inline">
                <label class="field__label" for="textgen-sentences">Frases por párrafo</label>
                <output class="field__value" id="textgen-sentences-output" for="textgen-sentences">${t.sentences}</output>
              </div>
              <input
                class="field__control"
                id="textgen-sentences"
                name="sentences"
                type="range"
                min="2"
                max="6"
                step="1"
                value="${t.sentences}"
              />
            </div>

            <label class="check">
              <input class="check__input" id="textgen-title-toggle" type="checkbox" ${t.includeTitle?`checked`:``} />
              <span class="check__box" aria-hidden="true">${E(`icon-check-circle`,{size:14})}</span>
              <span class="check__label">Incluir título de película</span>
            </label>

            <div class="textgen__actions">
              <button class="button button--primary" type="submit">
                ${E(`icon-refresh`)}<span>Generar de nuevo</span>
              </button>
            </div>

            <p class="field__hint">Los cambios de temática, párrafos o frases generan una nueva versión automáticamente.</p>
          </form>

          <article class="textgen__preview card" aria-labelledby="textgen-preview-title">
            <header class="textgen__preview-head">
              <div>
                <h2 class="textgen__preview-title" id="textgen-preview-title">Sinopsis generada</h2>
                <p class="textgen__meta" id="textgen-meta"></p>
              </div>
              <p class="textgen__theme" id="textgen-theme-label"></p>
            </header>

            <div class="textgen__output">
              <h3 class="textgen__title" id="textgen-title"></h3>
              <div class="textgen__body" id="textgen-output"></div>
            </div>
          </article>
        </div>
      </section>`;let i=e.querySelector(`#textgen-form`),a=e.querySelector(`#textgen-theme`),o=e.querySelector(`#textgen-theme-note`),s=e.querySelector(`#textgen-theme-label`),c=e.querySelector(`#textgen-paragraphs`),l=e.querySelector(`#textgen-paragraphs-output`),d=e.querySelector(`#textgen-sentences`),f=e.querySelector(`#textgen-sentences-output`),p=e.querySelector(`#textgen-title-toggle`),m=e.querySelector(`#textgen-title`),h=e.querySelector(`#textgen-output`),g=e.querySelector(`#textgen-meta`),_=e.querySelector(`#textgen-copy`),v=()=>{if(t.output.paragraphs.length===0)return``;let e=[];return t.includeTitle&&t.output.title&&e.push(t.output.title),e.push(...t.output.paragraphs),e.join(`

`)},y=()=>{let e=an(t.theme);if(o.textContent=e.tagline,s.textContent=e.label,!(t.output.paragraphs.length>0)){m.hidden=!0,h.innerHTML=`<p class="textgen__placeholder">Pulsa «Generar de nuevo» para crear una sinopsis.</p>`,g.textContent=``;return}m.hidden=!t.includeTitle||!t.output.title,m.textContent=t.output.title,h.innerHTML=t.output.paragraphs.map(e=>`<p>${A(e)}</p>`).join(``);let n=t.output.paragraphs.join(` `).split(/\s+/).filter(Boolean).length,r=Math.max(1,Math.ceil(n/200));g.textContent=`${t.output.paragraphs.length} párrafo${t.output.paragraphs.length===1?``:`s`} · ${n} palabras · ${r} min de lectura`},b=(e=!1)=>{let n=an(t.theme);t={...t,output:fn(n,t.paragraphs,t.sentences)},r(on,t),y(),e&&u(`Texto generado`)};a.addEventListener(`change`,()=>{t={...t,theme:a.value},b()}),c.addEventListener(`input`,()=>{l.textContent=c.value}),c.addEventListener(`change`,()=>{t={...t,paragraphs:Number(c.value)},b()}),d.addEventListener(`input`,()=>{f.textContent=d.value}),d.addEventListener(`change`,()=>{t={...t,sentences:Number(d.value)},b()}),p.addEventListener(`change`,()=>{t={...t,includeTitle:p.checked},r(on,t),y()}),i.addEventListener(`submit`,e=>{e.preventDefault(),b(!0)}),_.addEventListener(`click`,async()=>{let e=v();if(!e)u(`Genera una sinopsis primero`);else try{await M(e),u(`Texto copiado al portapapeles`)}catch{u(`No se pudo copiar el texto`)}}),t.output.paragraphs.length===0?b():y()}},hn=[{id:`playfair-display`,label:`Playfair Display`,stack:`'Playfair Display', Georgia, 'Times New Roman', serif`,description:`Serif editorial de alto contraste. Elegante y con personalidad.`,bodyFonts:[`source-sans-3`,`lato`,`montserrat-body`,`open-sans`,`raleway-body`]},{id:`montserrat`,label:`Montserrat`,stack:`'Montserrat', 'Avenir Next', 'Segoe UI', sans-serif`,description:`Sans geométrica urbana. Moderna, firme y muy versátil.`,bodyFonts:[`merriweather-body`,`open-sans`,`roboto`,`lora-body`,`hind`]},{id:`poppins`,label:`Poppins`,stack:`'Poppins', 'Avenir Next', 'Segoe UI', sans-serif`,description:`Sans geométrica de trazos circulares. Alegre y contemporánea.`,bodyFonts:[`inter`,`open-sans`,`roboto`,`lora-body`,`source-sans-3`]},{id:`oswald`,label:`Oswald`,stack:`'Oswald', 'Arial Narrow', 'Helvetica Neue', sans-serif`,description:`Sans condensada de fuerte presencia. Ideal para titulares breves.`,bodyFonts:[`open-sans`,`roboto`,`lato`,`merriweather-body`,`source-sans-3`]},{id:`raleway`,label:`Raleway`,stack:`'Raleway', 'Avenir Next', 'Segoe UI', sans-serif`,description:`Sans fina y elegante. Muy legible en tamaños grandes.`,bodyFonts:[`open-sans`,`lato`,`merriweather-body`,`roboto`,`libre-baskerville`]},{id:`merriweather`,label:`Merriweather`,stack:`'Merriweather', Georgia, 'Times New Roman', serif`,description:`Serif robusta y cálida. Transmite cercanía y autoridad.`,bodyFonts:[`open-sans`,`montserrat-body`,`lato`,`roboto`,`source-sans-3`]},{id:`anton`,label:`Anton`,stack:`'Anton', 'Arial Narrow', Impact, sans-serif`,description:`Sans impactante y condensada. Titulares que no pasan desapercibidos.`,bodyFonts:[`roboto`,`open-sans`,`montserrat-body`,`lato`,`work-sans`]},{id:`lora`,label:`Lora`,stack:`'Lora', Georgia, 'Times New Roman', serif`,description:`Serif de transición con un toque caligográfico. Muy legible.`,bodyFonts:[`open-sans`,`lato`,`roboto`,`montserrat-body`,`source-sans-3`]},{id:`futura`,label:`Futura`,stack:`'Futura', 'Avenir Next', 'Century Gothic', sans-serif`,description:`Sans geométrica clásica. Formas puras y aire atemporal.`,bodyFonts:[`garamond`,`bodoni`,`baskerville`,`source-sans-3`,`open-sans`]},{id:`proxima-nova`,label:`Proxima Nova`,stack:`'Proxima Nova', 'Avenir Next', 'Segoe UI', sans-serif`,description:`Sans humanista equilibrada. Neutral y muy cómoda de leer.`,bodyFonts:[`georgia`,`merriweather-body`,`garamond`,`inter`,`source-serif-4`]}],gn=[{id:`source-sans-3`,label:`Source Sans 3`,stack:`'Source Sans 3', 'Segoe UI', system-ui, sans-serif`,description:`Sans humanista abierta. Excelente para lectura prolongada.`},{id:`lato`,label:`Lato`,stack:`'Lato', 'Segoe UI', system-ui, sans-serif`,description:`Sans cálida y sobria. Muy equilibrada en bloques de texto.`},{id:`montserrat-body`,label:`Montserrat`,stack:`'Montserrat', 'Avenir Next', 'Segoe UI', sans-serif`,description:`Sans geométrica. Aporta ritmo y presencia a los párrafos.`},{id:`open-sans`,label:`Open Sans`,stack:`'Open Sans', 'Segoe UI', system-ui, sans-serif`,description:`Sans neutra y legible. Un comodín para cualquier pareja.`},{id:`raleway-body`,label:`Raleway`,stack:`'Raleway', 'Segoe UI', system-ui, sans-serif`,description:`Sans ligera y elegante. Ideal con titulares editoriales.`},{id:`merriweather-body`,label:`Merriweather`,stack:`'Merriweather', Georgia, serif`,description:`Serif robusta. Da carácter a la lectura sin fatigar.`},{id:`roboto`,label:`Roboto`,stack:`'Roboto', 'Helvetica Neue', Arial, sans-serif`,description:`Sans funcional y compacta. Muy presente en pantalla.`},{id:`lora-body`,label:`Lora`,stack:`'Lora', Georgia, serif`,description:`Serif con detalle caligográfico. Cálida y fluida.`},{id:`hind`,label:`Hind`,stack:`'Hind', 'Segoe UI', system-ui, sans-serif`,description:`Sans de trazos suaves. Cómoda y discreta.`},{id:`inter`,label:`Inter`,stack:`'Inter', 'Segoe UI', system-ui, sans-serif`,description:`Sans optimizada para interfaces. Muy clara a cualquier tamaño.`},{id:`libre-baskerville`,label:`Libre Baskerville`,stack:`'Libre Baskerville', Georgia, serif`,description:`Serif clásica de gran altura de x. Pausada y elegante.`},{id:`work-sans`,label:`Work Sans`,stack:`'Work Sans', 'Segoe UI', system-ui, sans-serif`,description:`Sans de diseño gráfico. Directa con un punto cálido.`},{id:`garamond`,label:`Garamond`,stack:`'Garamond', 'Iowan Old Style', Georgia, serif`,description:`Serif renacentista. Ligera, literaria y muy legible.`},{id:`bodoni`,label:`Bodoni`,stack:`'Bodoni', 'Bodoni MT', Didot, Georgia, serif`,description:`Serif didona de alto contraste. Sofisticada y delicada.`},{id:`baskerville`,label:`Baskerville`,stack:`'Baskerville', 'Iowan Old Style', Georgia, serif`,description:`Serif de transición. Equilibrio entre clasicismo y lectura.`},{id:`georgia`,label:`Georgia`,stack:`Georgia, 'Iowan Old Style', 'Times New Roman', serif`,description:`Serif familiar y robusta. Muy confiable en pantalla.`},{id:`source-serif-4`,label:`Source Serif 4`,stack:`'Source Serif 4', Georgia, serif`,description:`Serif contemporánea. Nítida y pensada para leer en digital.`}],V={headingFont:`playfair-display`,bodyFont:`source-sans-3`,headingSize:48,bodySize:17,lineHeight:1.6};function _n(e){return hn.find(t=>t.id===e)||hn[0]}function vn(e){return gn.find(t=>t.id===e)||gn[0]}function H(e){let t=_n(e),n=gn.filter(e=>t.bodyFonts.includes(e.id));return n.length>0?n:gn}var yn=[`lun`,`mar`,`mié`,`jue`,`vie`,`sáb`,`dom`],bn=new Intl.DateTimeFormat(`es-ES`,{month:`long`,year:`numeric`}),xn=54,Sn=2*Math.PI*xn,Cn=1,wn=`typography`,Tn=`color-studio`;function En(){let e=n(wn,{}),t=e&&typeof e==`object`?e:{},r=_n(t.headingFont),i=H(r.id),a=i.find(e=>e.id===t.bodyFont)||i[0],o=(e,t)=>Number.isFinite(Number(e))?Number(e):t;return{headingFont:r.id,bodyFont:a.id,headingSize:o(t.headingSize,V.headingSize),bodySize:o(t.bodySize,V.bodySize),lineHeight:o(t.lineHeight,V.lineHeight)}}function Dn(e,t){return H(e).map(e=>`<option value="${e.id}" ${e.id===t?`selected`:``}>${A(e.label)}</option>`).join(``)}function On(e){let t=_n(e.headingFont),n=vn(e.bodyFont);return`:root {
  --font-heading: ${t.stack};
  --font-body: ${n.stack};
  --font-size-heading: ${e.headingSize}px;
  --font-size-body: ${e.bodySize}px;
  --line-height-body: ${e.lineHeight.toFixed(2)};
}`}function kn(e){let t=en(e);return`:root {
  --color-background: ${t.background.hex};
  --color-surface: ${t.surface.hex};
  --color-surface-2: ${t.surface2.hex};
  --color-border: ${t.border.hex};
  --color-text: ${t.text.hex};
  --color-text-muted: ${t.muted.hex};
  --color-accent: ${t.accent.hex};
  --color-on-accent: ${t.onAccent};
}`}var An={calendar(e){let t=new Date,r=()=>{let i=new Date,a=t.getFullYear(),o=t.getMonth(),s=n(`calendar`,{}),c=s&&typeof s==`object`?s:{},l=(new Date(a,o,1).getDay()+6)%7,u=new Date(a,o+1,0).getDate(),d=N(i),f=[];for(let e=0;e<l;e+=1)f.push(`<li class="widget-calendar__day widget-calendar__day--outside" aria-hidden="true"></li>`);let p=0,m=0;for(let e=1;e<=u;e+=1){let n=N(new Date(a,o,e)),r=Array.isArray(c[n])?c[n]:[];p+=r.length,r.length>0&&(m+=1);let i=[`widget-calendar__day`];n===d&&i.push(`is-today`),r.length>0&&i.push(`has-events`);let s=r.map(e=>`${e.time?`${e.time} · `:``}${e.title}`).join(` | `),l=`${e} de ${jn(bn.format(t))}: ${s}`,u=r.length>0?`<button class="widget-calendar__day-button" type="button" data-events="${A(s)}" aria-label="${A(l)}">${e}</button>`:String(e);f.push(`<li class="${i.join(` `)}">${u}</li>`)}let h=p===0?`Sin citas este mes`:`${p} cita${p===1?``:`s`} en ${m} día${m===1?``:`s`}`;e.innerHTML=`
        <div class="widget-calendar">
          <div class="widget-calendar__head">
            <button class="icon-button icon-button--small" type="button" data-month-prev aria-label="Mes anterior">
              ${E(`icon-chevron-left`,{size:16})}
            </button>
            <p class="widget-calendar__month">${A(jn(bn.format(t)))}</p>
            <button class="icon-button icon-button--small" type="button" data-month-next aria-label="Mes siguiente">
              ${E(`icon-chevron-right`,{size:16})}
            </button>
          </div>
          <ol class="widget-calendar__weekdays" aria-hidden="true">
            ${yn.map(e=>`<li>${e}</li>`).join(``)}
          </ol>
          <ol class="widget-calendar__grid">${f.join(``)}</ol>
          <p class="widget-calendar__summary">${A(h)}</p>
        </div>`,e.querySelector(`[data-month-prev]`).addEventListener(`click`,()=>{t=new Date(t.getFullYear(),t.getMonth()-1,1),r()}),e.querySelector(`[data-month-next]`).addEventListener(`click`,()=>{t=new Date(t.getFullYear(),t.getMonth()+1,1),r()}),e.querySelectorAll(`[data-events]`).forEach(e=>{let t=()=>ke(e.dataset.events,e);e.addEventListener(`pointerenter`,t),e.addEventListener(`focus`,t),e.addEventListener(`click`,t),e.addEventListener(`pointerleave`,k),e.addEventListener(`blur`,k)})};return r(),i(`calendar`,r)},pomodoro(e){e.innerHTML=`
      <div class="widget-pomodoro">
        <div class="widget-pomodoro__ring">
          <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
            <circle class="widget-pomodoro__track" cx="60" cy="60" r="${xn}" />
            <circle
              class="widget-pomodoro__progress"
              data-ring
              cx="60"
              cy="60"
              r="${xn}"
              stroke-dasharray="${Sn.toFixed(2)}"
              stroke-dashoffset="0"
            />
          </svg>
          <div class="widget-pomodoro__readout">
            <time class="widget-pomodoro__time" data-time datetime="PT25M">25:00</time>
            <span class="widget-pomodoro__phase" data-phase>Foco</span>
          </div>
        </div>
        <div class="widget-pomodoro__actions">
          <button class="button button--primary" type="button" data-toggle>
            ${E(`icon-play`,{size:16})}<span>Iniciar</span>
          </button>
          <button class="button button--ghost" type="button" data-reset>
            ${E(`icon-refresh`,{size:16})}<span>Reiniciar</span>
          </button>
          <button class="button button--ghost widget-pomodoro__alarm" type="button" data-stop-alarm hidden>
            ${E(`icon-stop`,{size:16})}<span>Detener alarma</span>
          </button>
        </div>
      </div>`;let t=e.querySelector(`[data-ring]`),n=e.querySelector(`[data-time]`),r=e.querySelector(`[data-phase]`),i=e.querySelector(`[data-toggle]`),a=e.querySelector(`[data-stop-alarm]`),o=e=>{let o=e||rt(),s=Le.find(e=>e.id===o.phase)||Le[0],c=s.minutes*60,l=c>0?Math.min(1,Math.max(0,o.remaining/c)):0,u=Math.max(0,Math.round(o.remaining));if(t.style.strokeDashoffset=String(Sn*(1-l)),n.textContent=Ae(o.remaining),n.dateTime=`PT${Math.floor(u/60)}M${u%60}S`,r.textContent=s.label,i.dataset.running!==String(o.running)){i.dataset.running=String(o.running);let e=o.running?`Pausar`:`Iniciar`;i.innerHTML=`${o.running?E(`icon-pause`,{size:16}):E(`icon-play`,{size:16})}<span>${e}</span>`}a.hidden=!o.alarm};return i.addEventListener(`click`,()=>{rt().running?at():it()}),e.querySelector(`[data-reset]`).addEventListener(`click`,()=>{ot(),u(`Temporizador reiniciado`)}),a.addEventListener(`click`,()=>{tt(),u(`Alarma detenida`)}),o(),nt(o)},weather(e){let t=!1;return e.innerHTML=`<p class="widget-status" role="status">Cargando el tiempo…</p>`,ie().then(n=>{if(!t)return n.latitude===null||!Number.isFinite(n.latitude)?(e.innerHTML=`<p class="widget-status">Sin ubicación. Activa la ubicación o elige una ciudad.</p>`,null):bt(n.latitude,n.longitude).then(r=>{if(t)return;let i=_t(r.weatherCode);e.innerHTML=`
            <div class="widget-weather">
              <svg class="icon widget-weather__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <use href="#${i.icon===`wmo-clear`&&!r.isDay?`icon-moon`:i.icon}"></use>
              </svg>
              <div class="widget-weather__body">
                <p class="widget-weather__temp">${Number.isFinite(r.temperature)?`${Math.round(r.temperature)}°`:`—`}</p>
                <p class="widget-weather__condition">${A(i.label)}</p>
                <p class="widget-weather__place">${A(n.name)}</p>
              </div>
            </div>`})}).catch(()=>{t||(e.innerHTML=`<p class="widget-status">No se pudo cargar el tiempo.</p>`)}),()=>{t=!0}},todo(e){let t=null,a=null,o=!1,s=null,c=null;e.innerHTML=`
      <form class="widget-form" data-todo-form>
        <label class="sr-only" for="widget-todo-input">Nueva tarea</label>
        ${D(`
        <input
          class="field__control"
          id="widget-todo-input"
          name="text"
          type="text"
          maxlength="140"
          placeholder="Nueva tarea…"
          autocomplete="off"
          required
        />`)}
        <button class="button button--primary" type="submit">${E(`icon-plus`,{size:16})}<span>Añadir</span></button>
      </form>
      <ul class="widget-list" data-todo-list></ul>`;let l=e.querySelector(`[data-todo-form]`),d=e.querySelector(`#widget-todo-input`),f=e.querySelector(`[data-todo-list]`),p=()=>{let e=n(`todo`,[]);return Array.isArray(e)?e:[]},m=(e,t)=>{let n=String(t).trim();if(!n)return;let i=p(),a=i.find(t=>t.id===e);a&&a.text!==n&&(o=!0,r(`todo`,i.map(t=>t.id===e?{...t,text:n}:t)),o=!1)},h=()=>{s!==null&&(window.clearTimeout(s),s=null),c=null},g=()=>{c&&(m(c.id,c.text),h())},_=()=>{if(o)return;let e=document.activeElement,n=e instanceof HTMLInputElement&&e.dataset.edit?{id:e.dataset.edit,start:e.selectionStart,end:e.selectionEnd}:null,i=f.contains(e),s=e instanceof HTMLInputElement&&e.dataset.id?e.dataset.id:null,c=p().filter(e=>!e.done);if(c.length===0){t=null,a=null,f.innerHTML=`<li class="widget-empty">Sin tareas pendientes</li>`;return}if(f.innerHTML=c.map(e=>`
            <li class="widget-list__item">
              ${e.id===t?D(`<input class="widget-list__edit" data-edit="${A(e.id)}" type="text" maxlength="140" value="${A(e.text)}" aria-label="Editar tarea ${A(e.text)}" />`):`<label class="widget-list__label">
                  <input type="checkbox" data-id="${A(e.id)}" />
                  <span>${A(e.text)}</span>
                </label>`}
              <span class="widget-list__actions">
                <button class="icon-button icon-button--small" type="button" data-edit-action="${A(e.id)}" aria-label="Editar ${A(e.text)}">
                  ${E(`icon-edit`,{size:16})}
                </button>
                <button class="icon-button icon-button--small" type="button" data-delete="${A(e.id)}" aria-label="Eliminar ${A(e.text)}">
                  ${E(`icon-trash`,{size:16})}
                </button>
              </span>
            </li>`).join(``),f.querySelectorAll(`[data-delete]`).forEach(e=>{je(e,{label:e.getAttribute(`aria-label`),confirmLabel:`Confirmar eliminación`,onConfirm:()=>{let n=e.dataset.delete;t===n&&(t=null,a=null),r(`todo`,p().filter(e=>e.id!==n)),u(`Tarea eliminada`)}})}),!i)return;let l=n?f.querySelector(`input[data-edit="${n.id}"]`):null;l?(l.focus(),l.setSelectionRange(n.start,n.end)):(!n&&s&&f.querySelector(`input[data-id="${s}"]`)||f.querySelector(`input[type="checkbox"]`)||d).focus()};l.addEventListener(`submit`,e=>{e.preventDefault();let t=d.value.trim();t&&(r(`todo`,[{id:j(),text:t,done:!1,createdAt:Date.now()},...p()]),d.value=``,d.focus(),u(`Tarea añadida`))}),f.addEventListener(`change`,e=>{let t=e.target.closest(`input[type="checkbox"]`);t&&r(`todo`,p().map(e=>e.id===t.dataset.id?{...e,done:t.checked}:e))}),f.addEventListener(`click`,e=>{let n=e.target.closest(`[data-edit-action]`);if(!n)return;let r=n.dataset.editAction;g();let i=p().find(e=>e.id===r);if(!i)return;t=r,a=i.text,_();let o=f.querySelector(`input[data-edit="${r}"]`);o&&(o.focus(),o.setSelectionRange(o.value.length,o.value.length))}),f.addEventListener(`input`,e=>{let t=e.target.closest(`[data-edit]`);t&&(c={id:t.dataset.edit,text:t.value},s!==null&&window.clearTimeout(s),s=window.setTimeout(()=>{s=null;let e=c;c=null,e&&m(e.id,e.text)},300))}),f.addEventListener(`keydown`,e=>{let n=e.target.closest(`[data-edit]`);n&&(e.key===`Enter`?(e.preventDefault(),g(),t=null,a=null,_(),u(`Tarea actualizada`)):e.key===`Escape`&&(e.preventDefault(),h(),a!==null&&m(n.dataset.edit,a),t=null,a=null,_()))}),f.addEventListener(`focusout`,e=>{let n=e.target.closest(`[data-edit]`);if(!n)return;let r=n.dataset.edit;c?g():m(r,n.value);let i=e.relatedTarget;i instanceof Element&&i.matches(`[data-edit-action], [data-delete]`)||t===r&&(t=null,a=null,_())}),_();let v=i(`todo`,_);return()=>{v(),g()}},notebook(e){let t=null,a=null,o=null,s=null,c=()=>{let e=n(`notebook`,[]);return Array.isArray(e)?e:[]},l=e=>c().find(t=>t.id===e)||null,d=()=>{o!==null&&(window.clearTimeout(o),o=null);let e=s;s=null,e&&r(`notebook`,c().map(t=>t.id===e.id?{...t,body:e.body,updatedAt:e.updatedAt}:t))},f=(t,n)=>{s={id:t.id,body:n,updatedAt:Date.now()},o!==null&&window.clearTimeout(o),o=window.setTimeout(d,300);let r=e.querySelector(`[data-note-meta]`);r&&(r.textContent=`Editada ahora mismo`)},p=t=>{let n=e.querySelector(`[data-note-list]`);if(!n)return;let r=t.slice().sort((e,t)=>t.updatedAt-e.updatedAt).slice(0,20);n.innerHTML=r.length===0?`<li class="widget-empty">Sin notas todavía</li>`:r.map(e=>`
          <li class="widget-list__item">
            <button class="widget-list__button" type="button" data-note="${e.id}">
              <span class="widget-list__title">${A(e.title||`Sin título`)}</span>
              <span class="widget-list__meta">${A(Me(e.updatedAt))}</span>
            </button>
          </li>`).join(``)},m=t=>{e.querySelector(`[data-note-list]`)||(e.innerHTML=`
          <form class="widget-form" data-note-form>
            <label class="sr-only" for="widget-note-input">Nueva nota</label>
            ${D(`
            <input
              class="field__control"
              id="widget-note-input"
              name="title"
              type="text"
              maxlength="80"
              placeholder="Título de la nota…"
              autocomplete="off"
              required
            />`)}
            <button class="button button--primary" type="submit">${E(`icon-plus`,{size:16})}<span>Añadir</span></button>
          </form>
          <ul class="widget-list" data-note-list></ul>`),p(t)},h=t=>{a=t.id,e.innerHTML=`
        <div class="widget-note" data-note-editor>
          <div class="widget-note__head">
            <p class="widget-note__title">${A(t.title||`Sin título`)}</p>
            <button class="icon-button icon-button--small" type="button" data-note-close aria-label="Cerrar nota">
              ${E(`icon-close`,{size:16})}
            </button>
          </div>
          <label class="sr-only" for="widget-note-body">Contenido de la nota</label>
          <textarea class="field__control widget-note__body" id="widget-note-body" data-note-body placeholder="Escribe aquí…">${A(t.body)}</textarea>
          <p class="widget-note__meta" data-note-meta>Editada ${A(Me(t.updatedAt))}</p>
        </div>`;let n=e.querySelector(`[data-note-body]`);n.focus(),n.setSelectionRange(n.value.length,n.value.length)},g=()=>{d(),t=null,a=null,m(c())},_=()=>{if(t){let n=l(t);if(!n)t=null,a=null;else if(a===t&&e.querySelector(`[data-note-body]`))return;else{h(n);return}}m(c())};e.addEventListener(`submit`,e=>{let t=e.target.closest(`[data-note-form]`);if(!t)return;e.preventDefault();let n=t.querySelector(`#widget-note-input`),i=n.value.trim();i&&(r(`notebook`,[{id:j(),title:i,body:``,updatedAt:Date.now()},...c()]),n.value=``,n.focus(),u(`Nota creada`))}),e.addEventListener(`click`,e=>{if(e.target.closest(`[data-note-close]`)){g();return}let n=e.target.closest(`[data-note]`);if(!n)return;d(),t=n.dataset.note;let r=l(t);r?h(r):t=null}),e.addEventListener(`input`,e=>{let n=e.target.closest(`[data-note-body]`);if(!n||!t)return;let r=l(t);r&&f(r,n.value)}),_();let v=i(`notebook`,_);return()=>{v(),d()}},player(e){e.innerHTML=`
      <div class="widget-player">
        <div class="widget-player__frame" data-frame></div>
        <div class="widget-player__controls">
          <button class="icon-button widget-player__toggle" type="button" data-toggle aria-label="Reproducir" disabled>
            ${E(`icon-play`)}
          </button>
          <span class="widget-player__title" data-title>Sin vídeos en la cola</span>
        </div>
      </div>`;let t=e.querySelector(`[data-frame]`),r=e.querySelector(`[data-toggle]`),a=e.querySelector(`[data-title]`),o=null,s=!1,c=-1,l=null,u=!1,d=!1,f=!1,p=0,m=e=>{t.innerHTML=`<p class="widget-player__placeholder">${A(e)}</p>`},h=e=>{t.innerHTML=`<iframe
        class="widget-player__iframe"
        src="https://www.youtube.com/embed/${encodeURIComponent(e)}?rel=0"
        title="Vídeo de YouTube"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>`},g=()=>{let e=c===Cn;r.innerHTML=E(e?`icon-pause`:`icon-play`),r.setAttribute(`aria-label`,e?`Pausar el vídeo`:`Reproducir el vídeo`)},_=()=>{if(p+=1,f=!1,o&&typeof o.destroy==`function`)try{o.destroy()}catch{}o=null,s=!1,c=-1,l=null,u=!1},v=e=>{if(d)return;if(o&&s&&typeof o.cueVideoById==`function`){e!==l&&(l=e,c=-1,g(),o.cueVideoById(e));return}if(o||f)return;if(u){e!==l&&(l=e,h(e));return}f=!0,l=e;let n=++p;t.innerHTML=`<div data-player-target></div>`,St().then(r=>{if(d||n!==p)return;f=!1;let i=t.querySelector(`[data-player-target]`);i&&(o=new r.Player(i,{width:`100%`,height:`100%`,videoId:e,playerVars:{controls:0,rel:0,modestbranding:1,playsinline:1,origin:window.location.origin},events:{onReady:()=>{s=!0,g()},onStateChange:e=>{c=e.data,g()}}}))}).catch(()=>{d||n!==p||(f=!1,u=!0,h(e),r.disabled=!0,r.setAttribute(`aria-label`,`Controles del reproductor embebido`))})},y=()=>{let e=n(`player`,null),t=e&&Array.isArray(e.queue)?e.queue:[],i=e&&e.currentId?e.currentId:null,o=t.find(e=>e.id===i)||t[0]||null;o?(a.textContent=o.title||o.videoId,r.disabled=u,v(o.videoId)):(_(),m(`Sin vídeos en la cola`),a.textContent=`Añade un vídeo desde la app Reproductor`,r.disabled=!0)};r.addEventListener(`click`,()=>{o&&s&&(c===Cn?o.pauseVideo():o.playVideo())});let b=i(`player`,y);return y(),()=>{b(),d=!0,_()}},favorites(e){let t=()=>{let t=n(`favorites`,[]),r=Array.isArray(t)?t:[];e.innerHTML=r.length===0?`<p class="widget-empty">Sin favoritos guardados</p>`:`
        <div class="widget-favorites">
          ${r.slice(0,10).map(e=>`
              <a class="widget-favorite-card" href="${A(e.url)}" target="_blank" rel="noopener noreferrer">
                <span class="widget-favorite-card__top">
                  <img
                    class="widget-favorite-card__logo"
                    src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(e.host)}&sz=64"
                    alt=""
                    width="32"
                    height="32"
                    loading="lazy"
                    data-fallback="${Pe}"
                  />
                  ${E(`icon-external`,{size:14,className:`widget-favorite-card__external`})}
                </span>
                ${e.name&&e.name!==e.host?`<span class="widget-favorite-card__name">${A(e.name)}</span>`:``}
                <span class="widget-favorite-card__host">${A(e.host||e.url)}</span>
              </a>`).join(``)}
        </div>`},r=e=>{let t=e.target;t instanceof HTMLImageElement&&!t.dataset.fallbackUsed&&(t.dataset.fallbackUsed=`true`,t.src=t.dataset.fallback)};e.addEventListener(`error`,r,!0);let a=i(`favorites`,t);return t(),()=>{a(),e.removeEventListener(`error`,r,!0)}},password(e){e.innerHTML=`
      <form class="widget-password" data-password-form>
        <fieldset class="widget-password__toggles">
          <legend class="sr-only">Caracteres de la contraseña</legend>
          ${Object.entries(Dt).map(([e,t])=>`
              <label class="check">
                <input class="check__input" type="checkbox" name="${e}" checked />
                <span class="check__box" aria-hidden="true">${E(`icon-check-circle`,{size:14})}</span>
                <span class="check__label">${t.label}</span>
              </label>`).join(``)}
        </fieldset>
        <button class="button button--primary" type="submit">${E(`icon-refresh`,{size:16})}<span>Generar</span></button>
      </form>
      <output class="widget-password__result" data-password-result>
        <span class="widget-password__value" data-password-value>Pulsa «Generar»</span>
        <span class="widget-password__meta" data-password-meta></span>
        <span class="password__meter widget-password__meter" aria-hidden="true">
          <span class="password__meter-bar widget-password__meter-bar" data-level="0"></span>
          <span class="password__meter-bar widget-password__meter-bar" data-level="1"></span>
          <span class="password__meter-bar widget-password__meter-bar" data-level="2"></span>
          <span class="password__meter-bar widget-password__meter-bar" data-level="3"></span>
        </span>
        <span class="widget-password__strength" data-password-strength>Aún sin generar</span>
      </output>`;let t=e.querySelector(`[data-password-form]`),i=e.querySelector(`[data-password-value]`),a=e.querySelector(`[data-password-meta]`),o=e.querySelector(`[data-password-strength]`),s=[...e.querySelectorAll(`.widget-password__meter-bar`)],c=n(`password-meta`,null);return c&&typeof c.entropy==`number`&&(a.textContent=`Última generación: ${c.level} · ${c.entropy} bits`,o.textContent=`Última generación: ${c.level} · ${c.entropy} bits`),t.addEventListener(`submit`,e=>{e.preventDefault();let n=new FormData(t),c=Nt({length:20,lower:n.has(`lower`),upper:n.has(`upper`),digits:n.has(`digits`),symbols:n.has(`symbols`),avoidAmbiguous:!1});if(!c){u(`Selecciona al menos un tipo de carácter.`);return}let l=Pt(c.entropy),d=[`weak`,`fair`,`strong`,`excellent`].indexOf(l.tone);i.textContent=c.password,a.textContent=`${l.label} · ${c.entropy} bits · ${c.pool} caracteres posibles`,s.forEach((e,t)=>{e.dataset.filled=t<=d?`true`:`false`}),o.dataset.tone=l.tone,o.textContent=`${l.label} · ${c.entropy} bits de entropía`,r(`password-meta`,{entropy:c.entropy,length:c.password.length,level:l.label,at:Date.now()}),u(`Contraseña generada`)}),()=>{}},typography(e){let t=En();e.innerHTML=`
      <div class="widget-type">
        <div class="widget-type__preview">
          <p class="widget-type__meta" data-type-meta></p>
          <p class="widget-type__sample" data-type-sample aria-hidden="true">Aa</p>
          <p class="widget-type__body" data-type-example>El titular marca el tono; el texto hace que la lectura fluya.</p>
        </div>
        <div class="widget-type__controls">
          <label class="field">
            <span class="field__label">Tipografía de titulares</span>
            <select class="field__control" data-type-heading>
              ${hn.map(e=>`<option value="${e.id}" ${e.id===t.headingFont?`selected`:``}>${A(e.label)}</option>`).join(``)}
            </select>
          </label>
          <label class="field">
            <span class="field__label">Tipografía de textos</span>
            <select class="field__control" data-type-body data-heading="${t.headingFont}">
              ${Dn(t.headingFont,t.bodyFont)}
            </select>
          </label>
          <button class="button button--ghost widget-type__export" type="button" data-type-export>
            ${E(`icon-copy`,{size:16})}<span>Exportar CSS</span>
          </button>
        </div>
      </div>`;let n=e.querySelector(`[data-type-meta]`),a=e.querySelector(`[data-type-sample]`),o=e.querySelector(`[data-type-example]`),s=e.querySelector(`[data-type-heading]`),c=e.querySelector(`[data-type-body]`),l=e.querySelector(`[data-type-export]`),d=()=>{let e=En(),t=_n(e.headingFont),r=vn(e.bodyFont);n.textContent=`${t.label} + ${r.label}`,a.style.fontFamily=t.stack,o.style.fontFamily=r.stack,s.value!==e.headingFont&&(s.value=e.headingFont),c.dataset.heading!==e.headingFont&&(c.innerHTML=Dn(e.headingFont,e.bodyFont),c.dataset.heading=e.headingFont),c.value=e.bodyFont},f=e=>{r(wn,{...En(),...e})};return s.addEventListener(`change`,()=>{let e=En(),t=H(s.value),n=t.some(t=>t.id===e.bodyFont)?e.bodyFont:t[0].id;f({headingFont:s.value,bodyFont:n}),n!==e.bodyFont&&u(`Tipografía de textos ajustada a ${vn(n).label}`)}),c.addEventListener(`change`,()=>{f({bodyFont:c.value})}),l.addEventListener(`click`,async()=>{try{await M(On(En())),u(`CSS de tipografía copiado`)}catch{u(`No se pudo copiar el CSS`)}}),d(),i(wn,d)},color(e){e.innerHTML=`
      <div class="widget-color">
        <div class="widget-color__row" data-color-swatches aria-hidden="true"></div>
        <p class="widget-color__meta" data-color-meta></p>
        <fieldset class="segmented widget-color__rules" data-color-rules>
          <legend class="sr-only">Armonía de color</legend>
          ${Rt.map(e=>`
            <input
              class="segmented__input"
              type="radio"
              name="widget-color-harmony"
              id="widget-color-harmony-${e.id}"
              value="${e.id}"
            />
            <label class="segmented__label" for="widget-color-harmony-${e.id}">${A(e.label)}</label>`).join(``)}
        </fieldset>
        <button class="button button--ghost widget-color__export" type="button" data-color-export>
          ${E(`icon-copy`,{size:16})}<span>Exportar CSS</span>
        </button>
      </div>`;let t=e.querySelector(`[data-color-swatches]`),n=e.querySelector(`[data-color-meta]`),a=e.querySelector(`[data-color-rules]`),o=()=>{let e=Xt(),r=Zt(e),i=r.find(e=>e.name===`Base`)||r[0],o=Jt(e.harmony);t.innerHTML=r.slice(0,5).map(e=>`<span class="widget-color__swatch" style="--widget-swatch:${e.hex}"></span>`).join(``),n.innerHTML=`${A(o.label)} · <span class="widget-color__base">${i.hex.toUpperCase()}</span>`,a.querySelectorAll(`input[type="radio"]`).forEach(t=>{t.checked=t.value===e.harmony})};return a.addEventListener(`change`,e=>{let t=e.target.closest(`input[name="widget-color-harmony"]`);t&&r(Tn,{...Xt(),harmony:t.value})}),e.querySelector(`[data-color-export]`).addEventListener(`click`,async()=>{try{await M(kn(Xt())),u(`CSS de color copiado`)}catch{u(`No se pudo copiar el CSS`)}}),o(),i(Tn,o)},textgen(e){let t=()=>{let t=pn(),n=an(t.theme),r=t.output.paragraphs[0]||``,i=t.includeTitle?t.output.title:``;r?(e.innerHTML=`
        <div class="widget-textgen">
          <p class="widget-textgen__meta">${A(n.label)} · ${t.output.paragraphs.length} párrafo${t.output.paragraphs.length===1?``:`s`}</p>
          ${i?`<p class="widget-textgen__title">${A(i)}</p>`:``}
          <p class="widget-textgen__excerpt">${A(r)}</p>
          <button class="button button--ghost widget-textgen__copy" type="button" data-copy-text>
            ${E(`icon-copy`,{size:16})}<span>Copiar texto</span>
          </button>
        </div>`,e.querySelector(`[data-copy-text]`).addEventListener(`click`,async()=>{let e=pn(),t=[];e.includeTitle&&e.output.title&&t.push(e.output.title),t.push(...e.output.paragraphs);let n=t.join(`

`);if(!n)u(`Genera una sinopsis primero`);else try{await M(n),u(`Texto copiado al portapapeles`)}catch{u(`No se pudo copiar el texto`)}})):e.innerHTML=`<p class="widget-empty">Genera tu primera sinopsis desde la app de texto.</p>`};return t(),i(`text-generator`,t)}};function jn(e){return e.charAt(0).toUpperCase()+e.slice(1)}var Mn={meta:{title:`Panel`},render(e){let t=[],n=null,r=()=>{for(let e of t)e();t=[]},a=e=>e.map(e=>e.id).join(`|`),o=()=>{let t=e.querySelector(`.dashboard__grid`);if(!t)return;let n=g().gridColumns;t.style.setProperty(`--dashboard-columns`,String(n))},s=()=>{r();let i=b();n=a(i),i.length===0?(e.innerHTML=`
          <section class="app app--dashboard">
            <div class="empty-state">
              ${E(`icon-grid`,{size:30,className:`empty-state__icon`})}
              <p class="empty-state__title">No hay aplicaciones visibles</p>
              <p class="empty-state__text">Activa al menos una desde el botón de ajustes.</p>
              <button class="button button--primary" type="button" id="dashboard-open-settings">
                ${E(`icon-settings`)}<span>Abrir ajustes</span>
              </button>
            </div>
          </section>`,e.querySelector(`#dashboard-open-settings`).addEventListener(`click`,()=>{document.getElementById(`settings-toggle`).click()})):(e.innerHTML=`
        <section class="app app--dashboard">
          <div class="dashboard__grid">
            ${i.map(e=>`
              <article class="card dashboard__card">
                <h2 class="dashboard__title">
                  <a class="dashboard__link" href="#/${e.id}">${A(e.label)}</a>
                </h2>
                <div class="dashboard__widget scrollable-y" data-widget="${e.id}">
                  <span class="skeleton" aria-hidden="true"></span>
                </div>
              </article>`).join(``)}
          </div>
        </section>`,o(),t=[...e.querySelectorAll(`[data-widget]`)].map(e=>{let t=An[e.dataset.widget];return t?t(e):(e.textContent=``,null)}).filter(e=>typeof e==`function`))};s();let c=i(`settings`,()=>{let e=b();a(e)===n?o():s()});return()=>{c(),r()}}},Nn=`calendar`,Pn=[`lun`,`mar`,`mié`,`jue`,`vie`,`sáb`,`dom`],Fn=new Intl.DateTimeFormat(`es-ES`,{month:`long`,year:`numeric`}),In=new Intl.DateTimeFormat(`es-ES`,{weekday:`long`,day:`numeric`,month:`long`}),U=new Date,W=N(new Date);function Ln(){let e=n(Nn,{});return e&&typeof e==`object`?e:{}}function Rn(e){r(Nn,e)}function zn(e){let t=Ln()[e];return Array.isArray(t)?t:[]}function Bn(){let e=document.getElementById(`calendar-panel`);if(!e)return;let t=Ne(W),n=zn(W);e.innerHTML=`
    <h2 class="calendar__panel-title">${Gn(In.format(t))}</h2>

    <form class="event-form" id="event-form">
      <div class="field">
        <label class="field__label" for="event-title">Nuevo evento</label>
        ${D(`<input class="field__control" id="event-title" name="title" type="text" maxlength="80" placeholder="Ej. Reunión de equipo" autocomplete="off" required />`)}
      </div>
      <div class="field event-form__row">
        <label class="field__label" for="event-time">Hora</label>
        <input class="field__control" id="event-time" name="time" type="time" />
        <button class="button button--primary" type="submit">${E(`icon-plus`)}<span>Añadir</span></button>
      </div>
    </form>

    ${n.length===0?`<p class="empty-state empty-state--compact">${E(`icon-calendar`,{size:22})}<span>Sin eventos este día.</span></p>`:`<ul class="event-list">
            ${n.map(e=>`
              <li class="event-list__item" data-id="${e.id}">
                <span class="event-list__time">${e.time?A(e.time):`Todo el día`}</span>
                <span class="event-list__title">${A(e.title)}</span>
                <button class="icon-button icon-button--small" type="button" aria-label="Eliminar evento ${A(e.title)}">
                  ${E(`icon-trash`,{size:16})}
                </button>
              </li>`).join(``)}
          </ul>`}`;let r=e.querySelector(`#event-form`);r.addEventListener(`submit`,t=>{t.preventDefault();let n=new FormData(r),i=String(n.get(`title`)||``).trim();if(!i)return;let a=Ln(),o=Array.isArray(a[W])?a[W]:[];a[W]=[...o,{id:j(),title:i,time:String(n.get(`time`)||``)}].sort((e,t)=>(e.time||`99:99`).localeCompare(t.time||`99:99`)),Rn(a),u(`Evento añadido`);let s=e.querySelector(`#event-title`);s&&s.focus()}),e.querySelectorAll(`.event-list__item`).forEach(e=>{let t=e.querySelector(`button`);je(t,{label:t.getAttribute(`aria-label`),confirmLabel:`Confirmar eliminación`,onConfirm:()=>{let t=Ln();t[W]=(t[W]||[]).filter(t=>t.id!==e.dataset.id),Rn(t),u(`Evento eliminado`)}})})}function Vn(){let e=document.getElementById(`calendar-table`),t=document.getElementById(`calendar-month`);if(!e||!t)return;k();let n=U.getFullYear(),r=U.getMonth();t.textContent=Gn(Fn.format(U));let i=(new Date(n,r,1).getDay()+6)%7,a=new Date(n,r+1,0).getDate(),o=Ln(),s=N(new Date),c=[];for(let e=0;e<i;e+=1)c.push(`<td class="calendar__cell calendar__cell--outside"></td>`);for(let e=1;e<=a;e+=1){let t=N(new Date(n,r,e)),i=Array.isArray(o[t])?o[t]:[],a=t===W,l=t===s,u=Gn(In.format(Ne(t))),d=i.map(e=>`${e.time?`${e.time} · `:``}${e.title}`).join(` | `),f=`${u}${i.length>0?`, ${i.length} evento${i.length===1?``:`s`}: ${d}`:``}`;c.push(`
      <td class="calendar__cell${a?` is-selected`:``}${l?` is-today`:``}">
        <button
          class="calendar__day"
          type="button"
          data-date="${t}"
          ${i.length>0?`data-events="${A(d)}"`:``}
          tabindex="${a?`0`:`-1`}"
          aria-label="${A(f)}"
        >
          <span class="calendar__day-number">${e}</span>
          ${i.length>0?`<span class="calendar__badge">${i.length}</span>`:``}
        </button>
      </td>`)}for(;c.length%7!=0;)c.push(`<td class="calendar__cell calendar__cell--outside"></td>`);let l=[];for(let e=0;e<c.length;e+=7)l.push(`<tr>${c.slice(e,e+7).join(``)}</tr>`);if(e.querySelector(`tbody`).innerHTML=l.join(``),e.querySelectorAll(`[data-events]`).forEach(e=>{let t=()=>ke(e.dataset.events,e);e.addEventListener(`pointerenter`,t),e.addEventListener(`focus`,t),e.addEventListener(`click`,t),e.addEventListener(`pointerleave`,k),e.addEventListener(`blur`,k)}),!e.querySelector(`.calendar__day[tabindex="0"]`)){let t=e.querySelector(`.calendar__day`);t&&(t.tabIndex=0)}}function Hn(){Vn(),Bn()}function Un(e){let t=Ne(e);(t.getMonth()!==U.getMonth()||t.getFullYear()!==U.getFullYear())&&(U=new Date(t.getFullYear(),t.getMonth(),1)),W=e,Hn()}var Wn={meta:{title:`Calendario`},render(e){e.innerHTML=`
      <section class="app app--calendar">
        <header class="app__header">
          <div>
            <h1 class="app__title">Calendario</h1>
          </div>
          <div class="calendar__controls">
            <button class="button button--ghost" id="calendar-today" type="button">Hoy</button>
          </div>
        </header>

        <div class="calendar__layout">
          <div class="calendar__main">
            <div class="calendar__month-nav">
              <button class="icon-button" id="calendar-prev" type="button" aria-label="Mes anterior">
                ${E(`icon-chevron-left`)}
              </button>
              <h2 class="calendar__month" id="calendar-month"></h2>
              <button class="icon-button" id="calendar-next" type="button" aria-label="Mes siguiente">
                ${E(`icon-chevron-right`)}
              </button>
            </div>
            <table class="calendar__table" id="calendar-table">
              <caption class="sr-only">Vista mensual del calendario</caption>
              <thead>
                <tr>
                  ${Pn.map(e=>`<th scope="col">${e}</th>`).join(``)}
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <aside class="calendar__panel card" id="calendar-panel"></aside>
        </div>
      </section>`;let t=e.querySelector(`#calendar-table`);e.querySelector(`#calendar-prev`).addEventListener(`click`,()=>{U=new Date(U.getFullYear(),U.getMonth()-1,1),Vn()}),e.querySelector(`#calendar-next`).addEventListener(`click`,()=>{U=new Date(U.getFullYear(),U.getMonth()+1,1),Vn()}),e.querySelector(`#calendar-today`).addEventListener(`click`,()=>{Un(N(new Date))}),t.addEventListener(`click`,e=>{let t=e.target.closest(`.calendar__day`);t&&Un(t.dataset.date)}),t.addEventListener(`keydown`,t=>{let n=t.target.closest(`.calendar__day`);if(!n)return;let r={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7},i=null;if(t.key in r){let e=Ne(n.dataset.date);e.setDate(e.getDate()+r[t.key]),i=N(e)}else if(t.key===`Home`){let e=Ne(n.dataset.date);e.setDate(e.getDate()-(e.getDay()+6)%7),i=N(e)}else if(t.key===`End`){let e=Ne(n.dataset.date);e.setDate(e.getDate()+(6-(e.getDay()+6)%7)),i=N(e)}else return;t.preventDefault(),Un(i);let a=e.querySelector(`.calendar__day[data-date="${i}"]`);a&&a.focus()}),Hn();let n=i(Nn,Hn);return()=>n()}};function Gn(e){return e.charAt(0).toUpperCase()+e.slice(1)}var Kn=[{id:`summary`,label:`Resumen`},{id:`daily`,label:`7 días`},{id:`cities`,label:`Ciudades`}],G=null,qn=`summary`,K=0,Jn=null,Yn=null;function Xn(e,t){let n=_t(e);return n.icon===`wmo-clear`&&!t?{iconName:`icon-moon`,label:n.label}:{iconName:n.icon,label:n.label}}function q(e,t=``,n=0){return e==null||Number.isNaN(Number(e))?`—`:`${Number(e).toFixed(n)}${t}`}function Zn(e){return`<p class="status-line" role="status">${E(`icon-refresh`,{size:16})}<span>${A(e)}</span></p>`}function Qn(e,t={}){let n=t.retry!==!1;return`<div class="alert" role="alert">
    ${E(`icon-alert`,{size:18})}
    <span>${A(e)}</span>
    ${n?`<button class="button button--ghost" type="button" data-retry>Reintentar</button>`:``}
  </div>`}function $n(){let e=document.getElementById(`weather-panel`);if(!e||!G)return;let t=++K;e.innerHTML=Zn(`Cargando el tiempo de ${G.name}…`),vt(G.latitude,G.longitude).then(e=>{t===K&&(Jn=e,er(e,t))}).catch(()=>{t===K&&(e.innerHTML=Qn(`No se pudo cargar el tiempo de ${G.name}. Comprueba tu conexión.`))})}function er(e,t){let n=document.getElementById(`weather-panel`);n&&(qn===`cities`?ir(t):n.innerHTML=qn===`summary`?tr(e):rr(e))}function tr(e){let t=e.current||{},n=e.daily||{},r=Xn(t.weather_code??0,t.is_day===1),i=n.sunrise&&n.sunrise[0]||``,a=n.sunset&&n.sunset[0]||``;return`
    <div class="weather__hero card">
      <div class="weather__hero-main">
        <svg class="icon weather__hero-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#${r.iconName}"></use></svg>
        <div>
          <p class="weather__place">${A(G.name)}</p>
          <p class="weather__temperature">${q(t.temperature_2m,`°`,1)}</p>
          <p class="weather__condition">${r.label}</p>
        </div>
      </div>
      <dl class="weather__metrics">
        <div class="weather__metric"><dt>Sensación</dt><dd>${q(t.apparent_temperature,`°`,1)}</dd></div>
        <div class="weather__metric"><dt>Humedad</dt><dd>${q(t.relative_humidity_2m,`%`)}</dd></div>
        <div class="weather__metric"><dt>Viento</dt><dd>${q(t.wind_speed_10m,` km/h`)}</dd></div>
        <div class="weather__metric"><dt>Precipitación</dt><dd>${q(t.precipitation,` mm`,1)}</dd></div>
        <div class="weather__metric"><dt>Amanece</dt><dd>${i?A(i.slice(11,16)):`—`}</dd></div>
        <div class="weather__metric"><dt>Anochece</dt><dd>${a?A(a.slice(11,16)):`—`}</dd></div>
      </dl>
    </div>

    <h2 class="weather__section-title">Hoy y mañana</h2>
    <ul class="weather__outlook">
      ${(n.time||[]).slice(0,2).map((e,t)=>{let r=Xn(n.weather_code[t],!0),i=new Date(`${e}T12:00:00`);return`<li class="weather__outlook-item">
            <span class="weather__outlook-day">${sr(new Intl.DateTimeFormat(`es-ES`,{weekday:`long`}).format(i))}</span>
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#${r.iconName}"></use></svg>
            <span class="weather__outlook-range">${q(n.temperature_2m_min[t],`°`)} / ${q(n.temperature_2m_max[t],`°`)}</span>
            <span class="weather__outlook-note">${r.label} · ${q(n.precipitation_probability_max[t],`%`)} lluvia</span>
          </li>`}).join(``)}
    </ul>`}function nr(e,t){let n=e.hourly||{},r=(Array.isArray(n.time)?n.time:[]).map((e,t)=>({time:e,index:t})).filter(({time:e})=>e.slice(0,10)===t);return r.length===0?`<p class="weather__day-empty">Sin previsión por horas para este día.</p>`:`<ol class="weather__day-hours">
    ${r.map(({time:e,index:t})=>{let r=Number(e.slice(11,13)),i=Xn(n.weather_code[t],r>=6&&r<19);return`<li class="weather__day-hour">
          <span class="weather__day-hour-time">${A(e.slice(11,16))}</span>
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#${i.iconName}"></use></svg>
          <span class="weather__day-hour-temp">${q(n.temperature_2m[t],`°`)}</span>
          <span class="weather__day-hour-rain">${q(n.precipitation_probability[t],`%`)}</span>
        </li>`}).join(``)}
  </ol>`}function rr(e){let t=e.daily||{},n=t.time||[];return n.length===0?Qn(`No hay previsión de 7 días disponible.`):`
    <ul class="weather__days">
      ${n.map((n,r)=>{let i=new Date(`${n}T12:00:00`),a=new Intl.DateTimeFormat(`es-ES`,{weekday:`long`}).format(i),o=Xn(t.weather_code[r],!0),s=Yn===n;return`<li class="weather__day-card${s?` is-expanded`:``}">
            <button class="weather__day" type="button" data-day="${A(n)}" aria-expanded="${s}">
              <span class="weather__day-name">${sr(a)}</span>
              <span class="weather__day-date">${new Intl.DateTimeFormat(`es-ES`,{day:`numeric`,month:`short`}).format(i)}</span>
              <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#${o.iconName}"></use></svg>
              <span class="weather__day-condition">${o.label}</span>
              <span class="weather__day-min">${q(t.temperature_2m_min[r],`°`)}</span>
              <span class="weather__day-max">${q(t.temperature_2m_max[r],`°`)}</span>
              <span class="weather__day-rain">${q(t.precipitation_probability_max[r],`%`)}<span class="sr-only"> de lluvia</span></span>
            </button>
            ${s?nr(e,n):``}
          </li>`}).join(``)}
    </ul>`}function ir(e){let t=document.getElementById(`weather-panel`);if(!t)return;let n=cr(f,10);t.innerHTML=Zn(`Cargando ciudades del mundo…`),yt(n).then(t=>{let r=document.getElementById(`weather-panel`);r&&e===K&&(r.innerHTML=`
        <ul class="weather__cities">
          ${t.map((e,t)=>{let r=n[t];if(!r)return``;let i=Xn(e.weatherCode,e.isDay);return`<li>
                <button class="weather__city" type="button" data-city="${A(r.name)}" data-lat="${r.latitude}" data-lon="${r.longitude}">
                  <span class="weather__city-name">${A(r.name)}</span>
                  <span class="weather__city-temp">${q(e.temperature,`°`)}</span>
                  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#${i.iconName}"></use></svg>
                  <span class="weather__city-condition">${i.label}</span>
                </button>
              </li>`}).join(``)}
        </ul>`,r.querySelectorAll(`[data-city]`).forEach(e=>{e.addEventListener(`click`,()=>ar(e.dataset.city,Number(e.dataset.lat),Number(e.dataset.lon)))}))}).catch(()=>{let t=document.getElementById(`weather-panel`);t&&e===K&&(t.innerHTML=Qn(`No se pudieron cargar las ciudades del mundo.`))})}function ar(e,t,n){if(!Number.isFinite(t)||!Number.isFinite(n))return;G={name:e,latitude:t,longitude:n},Jn=null,Yn=null,qn=`summary`;let r=document.getElementById(`weather-tab-summary`);r&&(r.checked=!0),$n()}var or={meta:{title:`Clima`},render(e){e.innerHTML=`
      <section class="app app--weather">
        <header class="app__header">
          <div>
            <h1 class="app__title">Clima</h1>
          </div>
          <form class="weather__search" id="weather-search">
            <label class="field__label sr-only" for="weather-query">Buscar ciudad</label>
            ${D(`
            <span class="input-with-icon">
              ${E(`icon-search`,{size:16})}
              <input class="field__control" id="weather-query" name="query" type="search" placeholder="Buscar ciudad…" autocomplete="off" list="weather-city-options" />
            </span>`)}
            <datalist id="weather-city-options">
              ${f.map(e=>`<option value="${A(e.name)}"></option>`).join(``)}
            </datalist>
            <button class="button button--primary" type="submit">Buscar</button>
            <button class="button button--ghost" type="button" id="weather-locate">${E(`icon-pin`)}<span>Mi ubicación</span></button>
          </form>
        </header>

        <fieldset class="segmented" id="weather-tabs">
          <legend class="sr-only">Sección del clima</legend>
          ${Kn.map(e=>`
            <input class="segmented__input" type="radio" name="weather-tab" id="weather-tab-${e.id}" value="${e.id}" ${e.id===qn?`checked`:``} />
            <label class="segmented__label" for="weather-tab-${e.id}">${e.label}</label>`).join(``)}
        </fieldset>

        <div id="weather-panel"></div>
      </section>`;let t=e.querySelector(`#weather-search`),n=e.querySelector(`#weather-tabs`),r=e.querySelector(`#weather-locate`),i=e.querySelector(`#weather-panel`);return i.addEventListener(`click`,e=>{if(e.target.closest(`[data-retry]`)){$n();return}let t=e.target.closest(`[data-day]`);if(!t)return;let n=t.dataset.day;Yn=Yn===n?null:n,Jn&&er(Jn,K);let r=i.querySelector(`[data-day="${n}"]`);r&&r.focus()}),t.addEventListener(`submit`,e=>{e.preventDefault();let n=String(new FormData(t).get(`query`)||``).trim();if(!n)return;let r=document.getElementById(`weather-panel`);r&&(r.innerHTML=Zn(`Buscando ${n}…`)),w(n).then(e=>{!e.latitude||!e.longitude?r&&(r.innerHTML=Qn(`No encontré «${n}». Prueba con otra grafía.`,{retry:!1})):ar(e.name,e.latitude,e.longitude)})}),r.addEventListener(`click`,()=>{let e=document.getElementById(`weather-panel`);e&&(e.innerHTML=Zn(`Usando tu ubicación…`)),ae(),ie().then(t=>{t.latitude===null||!Number.isFinite(t.latitude)?e&&(e.innerHTML=Qn(`No pude obtener tu ubicación. Busca una ciudad por nombre.`,{retry:!1})):ar(t.name,t.latitude,t.longitude)})}),n.addEventListener(`change`,e=>{e.target.name===`weather-tab`&&(qn=e.target.value,K+=1,qn===`cities`?ir(K):Jn?er(Jn,K):$n())}),G?$n():ie().then(e=>{if(e.latitude===null||!Number.isFinite(e.latitude)){let e=document.getElementById(`weather-panel`);e&&(e.innerHTML=Qn(`Activa la ubicación o elige una ciudad para ver el tiempo.`,{retry:!1}))}else G={name:e.name,latitude:e.latitude,longitude:e.longitude},$n()}),()=>{K+=1}}};function sr(e){return e.charAt(0).toUpperCase()+e.slice(1)}function cr(e,t){let n=[...e];for(let e=n.length-1;e>0;--e){let t=Math.floor(Math.random()*(e+1));[n[e],n[t]]=[n[t],n[e]]}return n.slice(0,t)}var lr=`todo`,ur={all:`Todas`,pending:`Pendientes`,done:`Hechas`},dr=`all`;function fr(){let e=n(lr,[]);return Array.isArray(e)?e:[]}function pr(e){r(lr,e)}function mr(){let e=document.getElementById(`todo-list`),t=document.getElementById(`todo-count`);if(!e||!t)return;let n=fr(),r=n.filter(e=>!e.done).length,i=n.filter(e=>dr===`pending`?!e.done:dr!==`done`||e.done);t.textContent=`${r} pendiente${r===1?``:`s`} de ${n.length}`,i.length===0?e.innerHTML=`<li class="empty-state">
      ${E(`icon-inbox`,{size:28,className:`empty-state__icon`})}
      <p class="empty-state__title">${n.length===0?`Sin tareas todavía`:`Nada por aquí`}</p>
      <p class="empty-state__text">${n.length===0?`Añade la primera con el campo de arriba.`:`Prueba con otro filtro.`}</p>
    </li>`:(e.innerHTML=i.map(e=>`
      <li class="todo__item${e.done?` is-done`:``}" data-id="${e.id}">
        <label class="todo__check">
          <input type="checkbox" class="todo__checkbox" data-id="${e.id}" ${e.done?`checked`:``} />
          <span class="todo__text">${A(e.text)}</span>
        </label>
        <button class="icon-button icon-button--small todo__remove" type="button" data-remove="${e.id}" aria-label="Eliminar tarea ${A(e.text)}">
          ${E(`icon-trash`,{size:16})}
        </button>
      </li>`).join(``),e.querySelectorAll(`[data-remove]`).forEach(e=>{je(e,{label:e.getAttribute(`aria-label`),confirmLabel:`Confirmar eliminación`,onConfirm:()=>{pr(fr().filter(t=>t.id!==e.dataset.remove)),u(`Tarea eliminada`)}})}))}var hr={meta:{title:`To do List`},render(e){e.innerHTML=`
      <section class="app app--todo">
        <header class="app__header">
          <div>
            <h1 class="app__title">To do List</h1>
          </div>
          <p class="todo__count" id="todo-count"></p>
        </header>

        <form class="todo__form" id="todo-form">
          <label class="field__label" for="todo-input">Nueva tarea</label>
          <div class="todo__row">
            ${D(`<input class="field__control" id="todo-input" name="text" type="text" maxlength="140" placeholder="Ej. Revisar el informe trimestral" autocomplete="off" required />`)}
            <button class="button button--primary" type="submit">${E(`icon-plus`)}<span>Añadir</span></button>
          </div>
        </form>

        <fieldset class="segmented" id="todo-filters">
          <legend class="sr-only">Filtrar tareas</legend>
          ${Object.entries(ur).map(([e,t])=>`
            <input class="segmented__input" type="radio" name="todo-filter" id="todo-filter-${e}" value="${e}" ${e===dr?`checked`:``} />
            <label class="segmented__label" for="todo-filter-${e}">${t}</label>`).join(``)}
        </fieldset>

        <ul class="todo__list" id="todo-list"></ul>
      </section>`;let t=e.querySelector(`#todo-form`),n=e.querySelector(`#todo-input`),r=e.querySelector(`#todo-filters`);mr(),t.addEventListener(`submit`,e=>{e.preventDefault();let t=n.value.trim();if(!t)return;let r=fr();r.unshift({id:j(),text:t,done:!1,createdAt:Date.now()}),pr(r),n.value=``,n.focus(),u(`Tarea añadida`)}),r.addEventListener(`change`,e=>{e.target.name===`todo-filter`&&(dr=e.target.value,mr())}),e.querySelector(`#todo-list`).addEventListener(`change`,e=>{let t=e.target.closest(`.todo__checkbox`);t&&pr(fr().map(e=>e.id===t.dataset.id?{...e,done:t.checked}:e))});let a=i(lr,mr);return()=>{a()}}},gr=`notebook`,_r=500,J=null,vr=``,yr=null,Y=null;function br(){let e=n(gr,[]);return Array.isArray(e)?e:[]}function xr(e){r(gr,e)}function Sr(e){return br().find(t=>t.id===e)||null}function Cr(){let e=document.getElementById(`notebook-list`),t=document.getElementById(`notebook-count`);if(!e||!t)return;let n=br().sort((e,t)=>t.updatedAt-e.updatedAt),r=n.filter(e=>!vr||`${e.title} ${e.body}`.toLowerCase().includes(vr.toLowerCase()));t.textContent=vr?`${r.length} de ${n.length} nota${n.length===1?``:`s`}`:`${n.length} nota${n.length===1?``:`s`}`,e.innerHTML=r.length===0?`<li class="empty-state empty-state--compact">
      ${E(`icon-note`,{size:24})}
      <p class="empty-state__title">${n.length===0?`Sin notas`:`Sin coincidencias`}</p>
      <p class="empty-state__text">${n.length===0?`Crea la primera con «Nueva nota».`:`Prueba con otra búsqueda.`}</p>
    </li>`:r.map(e=>{let t=e.body.trim().split(`
`)[0]||`Sin contenido`;return`
      <li class="notebook__item${e.id===J?` is-active`:``}">
        <button class="notebook__item-button" type="button" data-id="${e.id}">
          <span class="notebook__item-title">${A(e.title||`Sin título`)}</span>
          <span class="notebook__item-preview">${A(t)}</span>
          <span class="notebook__item-date">${Me(e.updatedAt)}</span>
        </button>
      </li>`}).join(``)}function wr(){let e=document.getElementById(`notebook-editor`);if(!e)return;let t=J?Sr(J):null;if(!t){e.innerHTML=`<div class="empty-state">
      ${E(`icon-note`,{size:28,className:`empty-state__icon`})}
      <p class="empty-state__title">Ninguna nota abierta</p>
      <p class="empty-state__text">Elige una de la lista o crea una nueva.</p>
    </div>`;return}e.innerHTML=`
    <div class="notebook__editor-head">
      <label class="sr-only" for="notebook-title">Título de la nota</label>
      ${D(`<input class="notebook__title-input" id="notebook-title" type="text" maxlength="80" placeholder="Título de la nota" value="${A(t.title)}" />`)}
      <button class="icon-button" id="notebook-delete" type="button" aria-label="Eliminar nota ${A(t.title||`sin título`)}">
        ${E(`icon-trash`)}
      </button>
    </div>
    <label class="sr-only" for="notebook-body">Contenido de la nota</label>
    <textarea class="notebook__body" id="notebook-body" placeholder="Escribe aquí…">${A(t.body)}</textarea>
    <p class="notebook__meta" id="notebook-meta">Editada ${Me(t.updatedAt)}</p>`;let n=e.querySelector(`#notebook-title`),r=e.querySelector(`#notebook-body`),i=e.querySelector(`#notebook-delete`),a=()=>{window.clearTimeout(yr),Y={...t,title:n.value,body:r.value,updatedAt:Date.now()},yr=window.setTimeout(()=>{let e=Y;Y=null,e&&xr(br().map(t=>t.id===e.id?e:t))},_r)};n.addEventListener(`input`,a),r.addEventListener(`input`,a),je(i,{label:i.getAttribute(`aria-label`),confirmLabel:`Confirmar eliminación`,onConfirm:()=>{window.clearTimeout(yr),Y=null,xr(br().filter(e=>e.id!==t.id)),J=null,Cr(),wr(),u(`Nota eliminada`)}})}function Tr(){if(window.clearTimeout(yr),!Y)return;let e=Y;Y=null,xr(br().map(t=>t.id===e.id?e:t))}function Er(e){Tr(),J=e,Cr(),wr()}var Dr={meta:{title:`Notebook`},render(e){e.innerHTML=`
      <section class="app app--notebook">
        <header class="app__header">
          <div>
            <h1 class="app__title">Notebook</h1>
          </div>
          <div class="notebook__toolbar">
            <label class="field__label sr-only" for="notebook-search">Buscar notas</label>
            ${D(`
            <span class="input-with-icon">
              ${E(`icon-search`,{size:16})}
              <input class="field__control" id="notebook-search" type="search" placeholder="Buscar…" autocomplete="off" />
            </span>`)}
            <button class="button button--primary" id="notebook-new" type="button">${E(`icon-plus`)}<span>Nueva nota</span></button>
          </div>
        </header>

        <div class="notebook__layout">
          <aside class="notebook__list-pane">
            <p class="notebook__count" id="notebook-count"></p>
            <ul class="notebook__list" id="notebook-list"></ul>
          </aside>
          <section class="notebook__editor card" id="notebook-editor"></section>
        </div>
      </section>`,Cr(),wr(),e.querySelector(`#notebook-search`).addEventListener(`input`,e=>{vr=e.target.value,Cr()}),e.querySelector(`#notebook-new`).addEventListener(`click`,()=>{Tr();let t={id:j(),title:``,body:``,updatedAt:Date.now()};xr([t,...br()]),J=t.id,Cr(),wr();let n=e.querySelector(`#notebook-title`);n&&n.focus(),u(`Nota creada`)}),e.querySelector(`#notebook-list`).addEventListener(`click`,e=>{let t=e.target.closest(`[data-id]`);t&&Er(t.dataset.id)});let t=i(gr,()=>{Cr();let e=document.getElementById(`notebook-meta`);if(e&&J){let t=Sr(J);t&&(e.textContent=`Editada ${Me(t.updatedAt)}`)}});return()=>{Tr(),t()}}},Or=`player`,kr=1,Ar=0,jr={queue:[],currentId:null},X=null,Z=!1,Q=null,Mr=null,Nr=-1,Pr=null,Fr=!1;function $(){let e=n(Or,jr);return{queue:Array.isArray(e.queue)?e.queue:[],currentId:e.currentId||null}}function Ir(e){r(Or,{...$(),...e})}function Lr(){let e=$();return e.queue.find(t=>t.id===e.currentId)||null}function Rr(){let e=document.getElementById(`player-queue`),t=document.getElementById(`player-queue-count`);if(!e||!t)return;let n=$();t.textContent=`${n.queue.length} en cola`,n.queue.length===0?e.innerHTML=`<li class="empty-state empty-state--compact">
      ${E(`icon-play`,{size:24})}
      <p class="empty-state__title">Cola vacía</p>
      <p class="empty-state__text">Añade enlaces con «Reproducir» o «Añadir a la cola».</p>
    </li>`:(e.innerHTML=n.queue.map(e=>`
      <li class="queue__item${e.id===n.currentId?` is-current`:``}" data-id="${e.id}">
        <button class="queue__play" type="button" data-play="${e.id}">
          ${E(`icon-play`,{size:14})}
          <span class="queue__title">${A(e.title)}</span>
        </button>
        <button class="icon-button icon-button--small" type="button" data-remove="${e.id}" aria-label="Quitar de la cola ${A(e.title)}">
          ${E(`icon-close`,{size:16})}
        </button>
      </li>`).join(``),e.querySelectorAll(`[data-remove]`).forEach(e=>{je(e,{label:e.getAttribute(`aria-label`),confirmLabel:`Confirmar quitar`,onConfirm:()=>{let t=$(),n=t.queue.filter(t=>t.id!==e.dataset.remove),r=t.currentId===e.dataset.remove?null:t.currentId;Ir({queue:n,currentId:r}),r||Hr(),u(`Vídeo quitado de la cola`)}})}),e.querySelectorAll(`[data-play]`).forEach(e=>{e.addEventListener(`click`,()=>Xr(e.dataset.play))}))}function zr(){let e=document.getElementById(`player-toggle`),t=document.getElementById(`player-time`),n=document.getElementById(`player-progress`);if(!e)return;let r=Nr===kr;if(Pr!==r&&(Pr=r,e.innerHTML=E(r?`icon-pause`:`icon-play`),e.setAttribute(`aria-label`,r?`Pausar`:`Reproducir`)),!X||!Z||typeof X.getCurrentTime!=`function`)return;let i=X.getCurrentTime()||0,a=X.getDuration()||0;t&&(t.textContent=`${Ae(i)} / ${Ae(a)}`),n&&document.activeElement!==n&&(n.max=String(Math.max(1,Math.round(a))),n.value=String(Math.round(i)),n.setAttribute(`aria-valuetext`,`${Ae(i)} de ${Ae(a)}`))}function Br(){Mr===null&&(Mr=window.setInterval(zr,500))}function Vr(){Mr!==null&&(window.clearInterval(Mr),Mr=null)}function Hr(){Vr(),Nr=-1;let e=document.getElementById(`player-frame`);if(e&&(e.innerHTML=Ur()),X&&typeof X.destroy==`function`)try{X.destroy()}catch{X=null}X=null,Z=!1}function Ur(){return`<div class="player__placeholder">
    ${E(`icon-play`,{size:32,className:`player__placeholder-icon`})}
    <p class="player__placeholder-title">Sin reproduciendo</p>
    <p class="player__placeholder-text">Pega un enlace de YouTube en el campo de arriba para empezar.</p>
  </div>`}function Wr(e){return`<iframe
    class="player__iframe"
    src="https://www.youtube.com/embed/${encodeURIComponent(e)}?rel=0"
    title="Reproductor de YouTube"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>`}function Gr(e,t={}){let n=document.getElementById(`player-frame`);n&&(X&&Z&&typeof X.loadVideoById==`function`?t.autoplay===!1?X.cueVideoById(e):X.loadVideoById(e):(Q=e,X||(Fr?n.innerHTML=Wr(e):(n.innerHTML=`<div class="player__target" id="player-target"></div>`,St().then(e=>{X||Fr||document.getElementById(`player-target`)&&(X=new e.Player(`player-target`,{width:`100%`,height:`100%`,videoId:Q,playerVars:{controls:0,rel:0,modestbranding:1,playsinline:1,origin:window.location.origin},events:{onReady:Kr,onStateChange:qr,onError:Jr}}))}).catch(()=>{let e=document.getElementById(`player-frame`);e&&(Fr=!0,e.innerHTML=Wr(Q),u(`Sin controles propios: se usa el reproductor embebido de YouTube`))})))))}function Kr(e){Z=!0,e.target&&typeof e.target.setVolume==`function`&&e.target.setVolume(80);let t=e.target.getVideoData?e.target.getVideoData().video_id:Q;Yr(t,e.target.getVideoData?e.target.getVideoData().title:``),Br(),zr(),Q&&t!==Q&&e.target.loadVideoById(Q),Q=null}function qr(e){if(Nr=e.data,zr(),e.data===kr){Br();let t=e.target.getVideoData?e.target.getVideoData():null;t&&Yr(t.video_id,t.title)}e.data===Ar&&Zr()}function Jr(){let e=document.getElementById(`player-frame`);e&&(e.innerHTML=`<div class="player__placeholder" role="alert">
      ${E(`icon-alert`,{size:28,className:`player__placeholder-icon`})}
      <p class="player__placeholder-title">No se pudo reproducir</p>
      <p class="player__placeholder-text">El vídeo no está disponible o su autor ha bloqueado la reproducción incrustada.</p>
    </div>`),Vr()}function Yr(e,t){let n=$();n.queue.some(t=>t.videoId===e)&&t&&Ir({queue:n.queue.map(n=>n.videoId===e?{...n,title:t}:n)})}function Xr(e){let t=$().queue.find(t=>t.id===e);t&&(Ir({currentId:t.id}),Gr(t.videoId),Rr())}function Zr(){let e=$(),t=e.queue.findIndex(t=>t.id===e.currentId),n=e.queue[t+1];n?Xr(n.id):u(`Fin de la cola`)}async function Qr(e,t={}){let n=$(),r=n.queue.find(t=>t.videoId===e);if(r)return t.enqueueOnly?(u(`Ese vídeo ya está en la cola`),r):(Ir({currentId:r.id}),Gr(r.videoId),Rr(),r);let i={id:j(),videoId:e,title:`Vídeo ${e}`},a={queue:[...n.queue,i]};return t.enqueueOnly||(a.currentId=i.id),Ir(a),Rr(),t.enqueueOnly&&u(`Añadido a la cola`),wt(e).then(t=>{t&&Yr(e,t)}),t.enqueueOnly||Gr(e),i}var $r={meta:{title:`Reproductor`},render(e){e.innerHTML=`
      <section class="app app--player">
        <header class="app__header">
          <div>
            <h1 class="app__title">Reproductor</h1>
          </div>
        </header>

        <form class="player__form" id="player-form">
          <div class="field">
            <label class="field__label" for="player-url">Enlace de YouTube</label>
            <div class="player__row">
              ${D(`
              <input
                class="field__control"
                id="player-url"
                name="url"
                type="text"
                inputmode="url"
                placeholder="https://www.youtube.com/watch?v=…"
                autocomplete="off"
              />`)}
              <button class="button button--primary" type="submit">${E(`icon-play`)}<span>Reproducir</span></button>
              <button class="button button--ghost" type="button" id="player-enqueue">${E(`icon-plus`)}<span>Añadir a la cola</span></button>
            </div>
          </div>
        </form>

        <div class="player__layout">
          <div class="player__stage card scrollable-y">
            <div class="player__frame" id="player-frame">${Ur()}</div>

            <div class="player__controls">
              <button class="icon-button player__toggle" id="player-toggle" type="button" aria-label="Reproducir">
                ${E(`icon-play`)}
              </button>
              <span class="player__time" id="player-time">0:00 / 0:00</span>
              <label class="sr-only" for="player-progress">Progreso de reproducción</label>
              <input class="player__progress" id="player-progress" type="range" min="0" max="100" value="0" step="1" />
              <button class="icon-button" id="player-mute" type="button" aria-label="Silenciar">
                ${E(`icon-volume`)}
              </button>
              <label class="sr-only" for="player-volume">Volumen</label>
              <input class="player__volume" id="player-volume" type="range" min="0" max="100" value="80" step="1" />
            </div>
          </div>

          <aside class="player__queue card">
            <div class="player__queue-head">
              <h2 class="player__queue-title">Cola</h2>
              <p class="player__queue-count" id="player-queue-count"></p>
            </div>
            <ol class="queue scrollable-y" id="player-queue"></ol>
          </aside>
        </div>
      </section>`;let t=e.querySelector(`#player-form`),n=e.querySelector(`#player-url`),r=e.querySelector(`#player-progress`),a=e.querySelector(`#player-volume`),o=e.querySelector(`#player-mute`);Rr();let s=()=>Ct(String(new FormData(t).get(`url`)||``).trim())||(u(`Ese enlace no parece un vídeo de YouTube válido.`),null);t.addEventListener(`submit`,async e=>{e.preventDefault();let t=s();t&&(await Qr(t),n.value=``,n.focus())}),e.querySelector(`#player-enqueue`).addEventListener(`click`,async()=>{let e=s();e&&(await Qr(e,{enqueueOnly:!0}),n.value=``)}),e.querySelector(`#player-toggle`).addEventListener(`click`,()=>{X&&Z&&(Nr===kr?X.pauseVideo():X.playVideo())}),r.addEventListener(`change`,()=>{X&&Z&&X.seekTo(Number(r.value),!0)}),a.addEventListener(`input`,()=>{X&&Z&&(X.setVolume(Number(a.value)),Number(a.value)>0&&o.dataset.muted===`true`&&(o.dataset.muted=`false`,o.innerHTML=E(`icon-volume`),o.setAttribute(`aria-label`,`Silenciar`)))}),o.addEventListener(`click`,()=>{if(!X||!Z)return;let e=o.dataset.muted===`true`;e?X.unMute():X.mute(),o.dataset.muted=String(!e),o.innerHTML=E(e?`icon-volume`:`icon-mute`),o.setAttribute(`aria-label`,e?`Silenciar`:`Activar sonido`)});let c=i(Or,Rr);if($().currentId){let e=Lr();e&&Gr(e.videoId,{autoplay:!1})}return()=>{if(c(),Vr(),X&&typeof X.destroy==`function`)try{X.destroy()}catch{X=null}X=null,Z=!1,Q=null,Nr=-1,Pr=null,Fr=!1}}},ei=`favorites`;function ti(){let e=n(ei,[]);return Array.isArray(e)?e:[]}function ni(e){r(ei,e)}function ri(e){let t=String(e||``).trim();if(!t)return null;let n;try{n=new URL(t.includes(`://`)?t:`https://${t}`)}catch{return null}return![`http:`,`https:`].includes(n.protocol)||!n.hostname.includes(`.`)?null:{url:n.href,host:n.hostname.replace(/^www\./,``)}}function ii(){let e=document.getElementById(`favorites-list`),t=document.getElementById(`favorites-count`);if(!e||!t)return;let n=ti();t.textContent=`${n.length} enlace${n.length===1?``:`s`}`,n.length===0?e.innerHTML=`<li class="empty-state">
      ${E(`icon-star`,{size:28,className:`empty-state__icon`})}
      <p class="empty-state__title">Sin favoritos</p>
      <p class="empty-state__text">Guarda tu primer enlace con el formulario de arriba.</p>
    </li>`:(e.innerHTML=n.map(e=>`
      <li class="favorite" data-id="${e.id}">
        <a class="favorite__link" href="${A(e.url)}" target="_blank" rel="noopener noreferrer">
          <img
            class="favorite__logo"
            src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(e.host)}&sz=64"
            alt=""
            width="36"
            height="36"
            loading="lazy"
            data-fallback="${Pe}"
          />
          <span class="favorite__body">
            ${e.name&&e.name!==e.host?`<span class="favorite__name">${A(e.name)}</span>`:``}
            <span class="favorite__host">${A(e.host)}</span>
          </span>
          ${E(`icon-external`,{size:16,className:`favorite__external`})}
        </a>
        <button class="icon-button icon-button--small favorite__remove" type="button" aria-label="Eliminar favorito ${A(e.name)}">
          ${E(`icon-trash`,{size:16})}
        </button>
      </li>`).join(``),e.querySelectorAll(`.favorite__remove`).forEach(e=>{let t=e.closest(`.favorite`).dataset.id;je(e,{label:e.getAttribute(`aria-label`),confirmLabel:`Confirmar eliminación`,onConfirm:()=>{ni(ti().filter(e=>e.id!==t)),u(`Favorito eliminado`)}})}))}var ai={meta:{title:`Favoritos`},render(e){e.innerHTML=`
      <section class="app app--favorites">
        <header class="app__header">
          <div>
            <h1 class="app__title">Favoritos</h1>
          </div>
          <p class="app__count" id="favorites-count"></p>
        </header>

        <form class="favorites__form" id="favorites-form">
          <div class="field">
            <label class="field__label" for="favorite-url">URL</label>
            ${D(`<input class="field__control" id="favorite-url" name="url" type="text" inputmode="url" placeholder="https://ejemplo.com" autocomplete="off" required />`)}
          </div>
          <button class="button button--primary" type="submit">${E(`icon-plus`)}<span>Guardar</span></button>
        </form>

        <ul class="favorites__grid" id="favorites-list"></ul>
      </section>`;let t=e.querySelector(`#favorites-form`),n=e.querySelector(`#favorites-list`);ii(),t.addEventListener(`submit`,e=>{e.preventDefault();let n=new FormData(t),r=ri(String(n.get(`url`)||``));if(!r){u(`Esa URL no parece válida. Incluye un dominio, por ejemplo https://ejemplo.com`);return}let i=ti();i.some(e=>e.url===r.url)?u(`Ese enlace ya está guardado.`):(i.unshift({id:j(),name:r.host,url:r.url,host:r.host,createdAt:Date.now()}),ni(i),t.reset(),u(`Favorito guardado`))}),n.addEventListener(`error`,e=>{let t=e.target;t instanceof HTMLImageElement&&!t.dataset.fallbackUsed&&(t.dataset.fallbackUsed=`true`,t.src=t.dataset.fallback)},!0);let r=i(ei,ii);return()=>r()}},oi=`typography`,si={min:28,max:80,fallback:V.headingSize},ci={min:14,max:24,fallback:V.bodySize},li={min:1.2,max:2,fallback:V.lineHeight};function ui(e,t){let n=Number(e);return Number.isFinite(n)?Math.min(t.max,Math.max(t.min,n)):t.fallback}function di(){let e=n(oi,{}),t=e&&typeof e==`object`?e:{},r=_n(t.headingFont),i=H(r.id).map(e=>e.id);return{headingFont:r.id,bodyFont:i.includes(t.bodyFont)?t.bodyFont:i[0],headingSize:ui(t.headingSize,si),bodySize:ui(t.bodySize,ci),lineHeight:Math.round(ui(t.lineHeight,li)*100)/100}}function fi(e){r(oi,{...di(),...e})}var pi={"":Mn,calendar:Wn,pomodoro:dt,weather:or,todo:hr,notebook:Dr,player:$r,favorites:ai,password:Ft,typography:{meta:{title:`Tipografía`},render(e){let t=di(),n=hn.map(e=>`<option value="${e.id}" ${e.id===t.headingFont?`selected`:``}>${A(e.label)}</option>`).join(``);e.innerHTML=`
      <section class="app app--typography">
        <header class="app__header">
          <div>
            <h1 class="app__title">Tipografía</h1>
            <p class="app__count">Encuentra una pareja para titulares y textos, y ajusta la escala en vivo.</p>
          </div>
          <button class="button button--ghost" id="type-reset" type="button">
            ${E(`icon-refresh`)}<span>Restablecer</span>
          </button>
        </header>

        <div class="type__layout">
          <div class="type__controls card">
            <div class="field">
              <label class="field__label" for="type-heading-font">Tipografía para titulares</label>
              <select class="field__control" id="type-heading-font" name="headingFont">
                ${n}
              </select>
              <p class="field__hint" id="type-heading-note"></p>
            </div>

            <div class="field">
              <label class="field__label" for="type-body-font">Tipografía para textos</label>
              <select class="field__control" id="type-body-font" name="bodyFont"></select>
              <p class="field__hint" id="type-body-note"></p>
            </div>

            <div class="type__pairings">
              <p class="field__label">Combinaciones sugeridas</p>
              <ul class="type__pair-list" id="type-pairings"></ul>
            </div>

            <fieldset class="type__sizes">
              <legend class="field__label">Escala de la muestra</legend>

              <div class="field">
                <div class="field__inline">
                  <label class="field__label" for="type-heading-size">Tamaño del titular</label>
                  <output class="field__value" id="type-heading-size-output" for="type-heading-size"></output>
                </div>
                <input
                  class="field__control"
                  id="type-heading-size"
                  name="headingSize"
                  type="range"
                  min="${si.min}"
                  max="${si.max}"
                  step="1"
                  value="${t.headingSize}"
                />
              </div>

              <div class="field">
                <div class="field__inline">
                  <label class="field__label" for="type-body-size">Tamaño del texto</label>
                  <output class="field__value" id="type-body-size-output" for="type-body-size"></output>
                </div>
                <input
                  class="field__control"
                  id="type-body-size"
                  name="bodySize"
                  type="range"
                  min="${ci.min}"
                  max="${ci.max}"
                  step="1"
                  value="${t.bodySize}"
                />
              </div>

              <div class="field">
                <div class="field__inline">
                  <label class="field__label" for="type-line-height">Interlineado</label>
                  <output class="field__value" id="type-line-height-output" for="type-line-height"></output>
                </div>
                <input
                  class="field__control"
                  id="type-line-height"
                  name="lineHeight"
                  type="range"
                  min="${li.min}"
                  max="${li.max}"
                  step="0.05"
                  value="${t.lineHeight}"
                />
              </div>
            </fieldset>

            <p class="field__hint">Los ajustes se guardan y se aplican solo a esta muestra tipográfica.</p>
          </div>

          <section class="type__preview card" aria-labelledby="type-preview-title">
            <header class="type__preview-head">
              <div>
                <h2 class="type__preview-title" id="type-preview-title">Muestra en vivo</h2>
                <p class="type__preview-subtitle" id="type-pair-label"></p>
              </div>
              <p class="type__scale" id="type-scale-readout"></p>
            </header>

            <div class="type__specimen" id="type-specimen">
              <p class="type__eyebrow">Muestra tipográfica</p>
              <h3 class="type__headline">Historias que se leen solas</h3>
              <p class="type__lead">
                Una buena pareja tipográfica no se nota: se siente. El titular marca el tono y el texto
                hace que la lectura fluya sin esfuerzo, incluso después de varios párrafos.
              </p>
              <blockquote class="type__quote">
                «El titular marca el tono; el texto hace que la lectura fluya.»
              </blockquote>
              <p class="type__caption" id="type-caption"></p>
            </div>
          </section>
        </div>
      </section>`;let i=e.querySelector(`#type-heading-font`),a=e.querySelector(`#type-body-font`),o=e.querySelector(`#type-heading-note`),s=e.querySelector(`#type-body-note`),c=e.querySelector(`#type-pairings`),l=e.querySelector(`#type-pair-label`),d=e.querySelector(`#type-scale-readout`),f=e.querySelector(`#type-specimen`),p=e.querySelector(`#type-caption`),m=e.querySelector(`#type-heading-size`),h=e.querySelector(`#type-body-size`),g=e.querySelector(`#type-line-height`),_=e.querySelector(`#type-heading-size-output`),v=e.querySelector(`#type-body-size-output`),y=e.querySelector(`#type-line-height-output`),b=e=>{let t=H(i.value);return a.innerHTML=t.map(t=>`<option value="${t.id}" ${t.id===e?`selected`:``}>${A(t.label)}</option>`).join(``),t.some(t=>t.id===e)?e:t[0].id},x=()=>{let e=H(i.value);c.innerHTML=e.map(e=>`<li class="type__pair-chip${e.id===a.value?` is-active`:``}">${A(e.label)}</li>`).join(``)},S=()=>{let e=di(),t=_n(e.headingFont),n=vn(e.bodyFont),r=(e.headingSize/16).toFixed(3).replace(/0+$/,``).replace(/\.$/,``),i=(e.bodySize/16).toFixed(3).replace(/0+$/,``).replace(/\.$/,``);f.style.setProperty(`--specimen-heading-font`,t.stack),f.style.setProperty(`--specimen-body-font`,n.stack),f.style.setProperty(`--specimen-heading-size`,`${r}rem`),f.style.setProperty(`--specimen-body-size`,`${i}rem`),f.style.setProperty(`--specimen-line-height`,String(e.lineHeight)),_.textContent=`${e.headingSize} px`,v.textContent=`${e.bodySize} px`,y.textContent=e.lineHeight.toFixed(2),d.textContent=`${e.headingSize} / ${e.bodySize} px · ${e.lineHeight.toFixed(2)}`,p.textContent=`Titular: ${t.label} · Texto: ${n.label}`,l.textContent=`${t.label} + ${n.label}`,o.textContent=t.description,s.textContent=n.description},ee=()=>{let e=di(),t=b(e.bodyFont);t!==e.bodyFont&&fi({bodyFont:t}),x(),S()};i.addEventListener(`change`,()=>{let e=di(),t=H(i.value),n=t.some(t=>t.id===e.bodyFont)?e.bodyFont:t[0].id;fi({headingFont:i.value,bodyFont:n}),ee(),n!==e.bodyFont&&u(`Tipografía de textos ajustada a ${vn(n).label}`)}),a.addEventListener(`change`,()=>{fi({bodyFont:a.value}),x(),S()}),m.addEventListener(`input`,()=>{fi({headingSize:Number(m.value)}),S()}),h.addEventListener(`input`,()=>{fi({bodySize:Number(h.value)}),S()}),g.addEventListener(`input`,()=>{fi({lineHeight:Number(g.value)}),S()}),e.querySelector(`#type-reset`).addEventListener(`click`,()=>{r(oi,{...V});let e=di();i.value=e.headingFont,a.value=b(e.bodyFont),m.value=String(e.headingSize),h.value=String(e.bodySize),g.value=String(e.lineHeight),x(),S(),u(`Tipografía restablecida`)}),ee()}},color:nn,textgen:mn},mi=`Dashboard`,hi=null,gi=!0;function _i(e){let t=()=>{let t=Se(),n=pi[t]||Mn,r=n.meta||{};typeof hi==`function`&&hi(),hi=null,e.innerHTML=``,document.title=`${t&&pi[t]&&r.title||mi} · DeskPRO`;let i=n.render(e);hi=typeof i==`function`?i:null,gi?gi=!1:vi(e)};window.addEventListener(`hashchange`,t),t()}function vi(e){let t=e.querySelector(`h1`);t&&(t.setAttribute(`tabindex`,`-1`),t.focus({preventScroll:!1}))}function yi(e=document){e.querySelectorAll(`.input-with-clear`).forEach(e=>{let t=e.querySelector(`input`),n=e.querySelector(`.input-clear`);t&&n&&(n.hidden=t.value.length===0)})}document.addEventListener(`input`,e=>{let t=e.target;if(!(t instanceof HTMLInputElement))return;let n=t.closest(`.input-with-clear`);n&&yi(n)}),document.addEventListener(`focusin`,e=>{let t=e.target;if(!(t instanceof HTMLInputElement))return;let n=t.closest(`.input-with-clear`);n&&yi(n)}),document.addEventListener(`click`,e=>{let t=e.target;if(!(t instanceof Element))return;let n=t.closest(`.input-clear`);if(!n)return;let r=n.closest(`.input-with-clear`),i=r&&r.querySelector(`input`);i&&(i.value=``,i.dispatchEvent(new Event(`input`,{bubbles:!0})),i.dispatchEvent(new Event(`change`,{bubbles:!0})),yi(r),i.focus())}),document.addEventListener(`reset`,e=>{if(!(e.target instanceof HTMLFormElement))return;let t=e.target;window.requestAnimationFrame(()=>yi(t))}),new MutationObserver(e=>{e.some(e=>e.addedNodes.length>0)&&yi()}).observe(document.body,{childList:!0,subtree:!0}),yi(),v(g().theme),ue(),xe(),x(),_i(document.getElementById(`view`)),bi(),xi();function bi(){if(!(`serviceWorker`in navigator))return;let e=new URL(`./sw.js`,document.baseURI),t=new URL(`./`,e).href;window.addEventListener(`load`,()=>{navigator.serviceWorker.register(e.href,{scope:t}).catch(e=>{console.error(`DeskPRO service worker registration failed`,e)})})}function xi(){let e=document.getElementById(`app-install`);if(!e)return;let t=null,n=()=>{e.hidden=!0};(window.matchMedia(`(display-mode: standalone)`).matches||window.navigator.standalone)&&n(),window.addEventListener(`beforeinstallprompt`,n=>{n.preventDefault(),t=n,e.hidden=!1}),e.addEventListener(`click`,async()=>{if(!t)return;let e=t;e.prompt();let r=await e.userChoice;t=null,n(),u(r.outcome===`accepted`?`App instalada`:`Instalación cancelada`)}),window.addEventListener(`appinstalled`,()=>{t=null,n(),u(`App instalada`)})}