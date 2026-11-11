(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`deskpro:v1:`,t=new Map;function n(t,n=null){try{let r=window.localStorage.getItem(e+t);return r===null?n:JSON.parse(r)}catch{return n}}function r(t,n){try{window.localStorage.setItem(e+t,JSON.stringify(n))}catch{}a(t,n)}function i(e,n){return t.has(e)||t.set(e,new Set),t.get(e).add(n),()=>{let r=t.get(e);r&&(r.delete(n),r.size===0&&t.delete(e))}}function a(e,n){let r=t.get(e);if(r)for(let e of[...r])try{e(n)}catch(e){console.error(`DeskPRO store listener failed`,e)}}function o(e){let t=document.getElementById(`toast-region`);t&&(t.textContent=``,window.setTimeout(()=>{t.textContent=e},40))}var s=[{id:`calendar`,label:`Calendario`,icon:`icon-calendar`},{id:`pomodoro`,label:`Pomodoro`,icon:`icon-timer`},{id:`weather`,label:`Clima`,icon:`icon-weather`},{id:`todo`,label:`To do List`,icon:`icon-check`},{id:`notebook`,label:`Notebook`,icon:`icon-book`},{id:`player`,label:`Reproductor`,icon:`icon-play`},{id:`favorites`,label:`Favoritos`,icon:`icon-star`},{id:`password`,label:`Contraseñas`,icon:`icon-key`}],c=[{name:`Madrid`,country:`España`,latitude:40.4168,longitude:-3.7038},{name:`Barcelona`,country:`España`,latitude:41.3874,longitude:2.1686},{name:`Buenos Aires`,country:`Argentina`,latitude:-34.6037,longitude:-58.3816},{name:`Ciudad de México`,country:`México`,latitude:19.4326,longitude:-99.1332},{name:`Bogotá`,country:`Colombia`,latitude:4.711,longitude:-74.0721},{name:`Santiago`,country:`Chile`,latitude:-33.4489,longitude:-70.6693},{name:`São Paulo`,country:`Brasil`,latitude:-23.5505,longitude:-46.6333},{name:`Londres`,country:`Reino Unido`,latitude:51.5072,longitude:-.1276},{name:`París`,country:`Francia`,latitude:48.8566,longitude:2.3522},{name:`Berlín`,country:`Alemania`,latitude:52.52,longitude:13.405},{name:`Roma`,country:`Italia`,latitude:41.9028,longitude:12.4964},{name:`Lisboa`,country:`Portugal`,latitude:38.7223,longitude:-9.1393},{name:`Nueva York`,country:`EE. UU.`,latitude:40.7128,longitude:-74.006},{name:`Los Ángeles`,country:`EE. UU.`,latitude:34.0522,longitude:-118.2437},{name:`Toronto`,country:`Canadá`,latitude:43.6532,longitude:-79.3832},{name:`Tokio`,country:`Japón`,latitude:35.6762,longitude:139.6503},{name:`Pekín`,country:`China`,latitude:39.9042,longitude:116.4074},{name:`Seúl`,country:`Corea del Sur`,latitude:37.5665,longitude:126.978},{name:`Sídney`,country:`Australia`,latitude:-33.8688,longitude:151.2093},{name:`Dubái`,country:`EAU`,latitude:25.2048,longitude:55.2708},{name:`Ciudad del Cabo`,country:`Sudáfrica`,latitude:-33.9249,longitude:18.4241},{name:`Reikiavik`,country:`Islandia`,latitude:64.1466,longitude:-21.9426}],l=`settings`,u={name:``,theme:`system`,defaultCity:`Madrid`,hiddenApps:[],appOrder:[]},d=!1;function f(){let e=n(l,{});return{...u,...e&&typeof e==`object`?e:{}}}function p(e){let t={...f(),...e};return r(l,t),m(t.theme),t}function m(e){let t=window.matchMedia(`(prefers-color-scheme: light)`),n=(e=>e===`system`?t.matches?`light`:`dark`:e)(e);document.documentElement.dataset.theme=n,document.documentElement.style.colorScheme=n,d||(d=!0,t.addEventListener(`change`,()=>{f().theme===`system`&&m(`system`)}))}function h(e){return i(l,()=>e(f()))}function g(){let e=f(),t=new Set(e.hiddenApps),n=s.filter(e=>!t.has(e.id)),r=e.appOrder.filter(e=>n.some(t=>t.id===e)),i=n.filter(e=>!r.includes(e.id)),a=r.map(e=>n.find(t=>t.id===e)).concat(i);return a.length>0?a:s}function ee(){let e=document.getElementById(`settings-dialog`),t=document.getElementById(`settings-form`),n=document.getElementById(`settings-toggle`),r=document.getElementById(`settings-apps`),a=document.getElementById(`city-options`);if(!e||!t||!n||!r||!a)return;a.innerHTML=c.map(e=>`<option value="${_(e.name)}"></option>`).join(``),n.addEventListener(`click`,()=>{d(),m(),e.returnValue=``,typeof e.showModal==`function`?e.showModal():e.setAttribute(`open`,``)});let o=()=>{typeof e.close==`function`?e.close(`cancel`):e.removeAttribute(`open`)};document.getElementById(`settings-close`).addEventListener(`click`,o),document.getElementById(`settings-cancel`).addEventListener(`click`,o),e.addEventListener(`close`,()=>{if(e.returnValue!==`save`)return;let n=new FormData(t),r=String(n.get(`theme`)||`system`);p({name:String(n.get(`name`)||``).trim(),theme:r,defaultCity:String(n.get(`city`)||``).trim()||u.defaultCity}),m()});let d=()=>{let e=f();t.elements.namedItem(`name`).value=e.name,t.elements.namedItem(`theme`).value=e.theme,t.elements.namedItem(`city`).value=e.defaultCity},m=()=>{let e=f(),t=new Set(e.hiddenApps),n=g().map(e=>e.id),i=s.filter(e=>!n.includes(e.id)),a=n.concat(i.map(e=>e.id));r.innerHTML=a.map((e,n)=>{let r=s.find(t=>t.id===e),i=!t.has(e);return`
          <li class="settings__app" data-app="${r.id}">
            <label class="settings__app-check">
              <input type="checkbox" name="visible-app" value="${r.id}" ${i?`checked`:``} />
              <span>${_(r.label)}</span>
            </label>
            <span class="settings__app-actions">
              <button class="icon-button icon-button--small" type="button" data-move="up" data-app="${r.id}" ${n===0?`disabled`:``} aria-label="Subir ${_(r.label)}">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#icon-arrow-up"></use></svg>
              </button>
              <button class="icon-button icon-button--small" type="button" data-move="down" data-app="${r.id}" ${n===a.length-1?`disabled`:``} aria-label="Bajar ${_(r.label)}">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#icon-arrow-down"></use></svg>
              </button>
            </span>
          </li>`}).join(``)};r.addEventListener(`click`,e=>{let t=e.target.closest(`button[data-move]`);if(!t)return;let n=t.closest(`.settings__app`),i=t.dataset.move===`up`?-1:1,a=i===-1?n.previousElementSibling:n.nextElementSibling;a&&(i===-1?r.insertBefore(n,a):r.insertBefore(a,n))}),t.addEventListener(`submit`,e=>{if(e.submitter&&e.submitter.value!==`save`)return;let t=[...r.querySelectorAll(`.settings__app`)].map(e=>e.dataset.app),n=[...r.querySelectorAll(`input[name="visible-app"]:checked`)].map(e=>e.value);p({appOrder:t,hiddenApps:t.filter(e=>!n.includes(e))})}),i(l,()=>{e.open&&m()})}function _(e){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`)}var te=`https://nominatim.openstreetmap.org/reverse`,ne=`https://geocoding-api.open-meteo.com/v1/search`,re=null,ie=new Map,ae=new Map;function oe(){return re||(re=new Promise(e=>{let t=()=>{let t=f().defaultCity;se(t).then(e)};`geolocation`in navigator?navigator.geolocation.getCurrentPosition(t=>{let{latitude:n,longitude:r}=t.coords;ce(n,r).then(t=>e({name:t,latitude:n,longitude:r,source:`gps`})).catch(()=>e({name:`${n.toFixed(2)}, ${r.toFixed(2)}`,latitude:n,longitude:r,source:`gps`}))},t,{enableHighAccuracy:!1,timeout:1e4,maximumAge:6e5}):t()}),re)}function se(e){let t=String(e||``).trim(),n=t.toLowerCase();return ie.has(n)?Promise.resolve(ie.get(n)):fetch(`${ne}?name=${encodeURIComponent(t)}&count=1&language=es&format=json`).then(e=>{if(!e.ok)throw Error(`Geocoding failed: ${e.status}`);return e.json()}).then(e=>{let r=e.results&&e.results[0];if(!r)throw Error(`Place not found`);let i={name:r.name||t,latitude:r.latitude,longitude:r.longitude,source:`city`};return ie.set(n,i),i}).catch(()=>{let e={name:t,latitude:null,longitude:null,source:`city`};return ie.set(n,e),e})}function ce(e,t){let n=`${e.toFixed(3)},${t.toFixed(3)}`;if(ae.has(n))return Promise.resolve(ae.get(n));let r=`${te}?format=jsonv2&zoom=10&lat=${e}&lon=${t}&accept-language=es`;return fetch(r).then(e=>{if(!e.ok)throw Error(`Nominatim failed: ${e.status}`);return e.json()}).then(r=>{let i=r&&r.address||{},a=[i.city||i.town||i.village||i.municipality||i.county||i.state||r&&r.name||``,i.country||``].filter(Boolean).join(`, `)||`${e.toFixed(2)}, ${t.toFixed(2)}`;return ae.set(n,a),a}).catch(()=>{let r=`${e.toFixed(2)}, ${t.toFixed(2)}`;return ae.set(n,r),r})}var le=new Intl.DateTimeFormat(`es-ES`,{hour:`2-digit`,minute:`2-digit`,second:`2-digit`}),ue=new Intl.DateTimeFormat(`es-ES`,{weekday:`long`,day:`numeric`,month:`long`,year:`numeric`});function de(){let e=document.getElementById(`header-time`),t=document.getElementById(`header-date`),n=document.getElementById(`header-place`),r=document.getElementById(`header-greeting`);if(!e||!t||!n||!r)return;let i=()=>{let n=new Date;e.textContent=le.format(n),e.dateTime=n.toISOString(),t.textContent=me(ue.format(n)),r.textContent=pe(f().name,n)};i(),window.setInterval(i,1e3),h(()=>{i(),n.textContent=`Buscando ubicación…`,fe(n)}),fe(n)}function fe(e){oe().then(t=>{e.textContent=t.name}).catch(()=>{e.textContent=`Ubicación no disponible`})}function pe(e,t){let n=t.getHours(),r=n<6?`Buenas noches`:n<13?`Buenos días`:n<20?`Buenas tardes`:`Buenas noches`,i=e.trim();return i?`${r}, ${i}`:r}function me(e){return e.charAt(0).toUpperCase()+e.slice(1)}var he=8,ge=8,_e=window.matchMedia(`(max-width: 47.99rem)`),v=null;function ve(){return v||(v=document.createElement(`div`),v.className=`nav-tooltip`,v.setAttribute(`aria-hidden`,`true`),v.hidden=!0,document.body.appendChild(v),v)}function ye(e){if(_e.matches)return;let t=e.querySelector(`.side-nav__label`);if(!t||!t.textContent.trim())return;let n=ve();n.textContent=t.textContent.trim(),n.hidden=!1;let r=e.getBoundingClientRect(),i=n.getBoundingClientRect(),a=r.right+he;a+i.width>window.innerWidth-ge&&(a=Math.max(ge,r.left-he-i.width));let o=Math.min(Math.max(r.top+r.height/2,i.height/2+ge),window.innerHeight-i.height/2-ge);n.style.left=`${Math.round(a)}px`,n.style.top=`${Math.round(o)}px`}function be(){v&&(v.hidden=!0)}function xe(e){e.querySelectorAll(`.side-nav__link`).forEach(e=>{e.addEventListener(`pointerenter`,()=>ye(e)),e.addEventListener(`pointerleave`,be),e.addEventListener(`focus`,()=>ye(e)),e.addEventListener(`blur`,be)})}function Se(){let e=document.getElementById(`nav-apps`);if(!e)return;document.addEventListener(`keydown`,e=>{e.key===`Escape`&&be()}),window.addEventListener(`scroll`,be,!0),window.addEventListener(`resize`,be);let t=document.querySelector(`.side-nav__list--footer`);t&&xe(t);let n=()=>{let t=Ce();e.innerHTML=`
        <li class="side-nav__item">
          <a class="side-nav__link" href="#/" data-app="home" ${t===``?`aria-current="page"`:``}>
            <svg class="icon side-nav__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <use href="#icon-home"></use>
            </svg>
            <span class="side-nav__label">Home</span>
          </a>
        </li>`.concat(g().map(e=>`
        <li class="side-nav__item">
          <a class="side-nav__link" href="#/${e.id}" data-app="${e.id}" ${t===e.id?`aria-current="page"`:``}>
            <svg class="icon side-nav__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <use href="#${e.icon}"></use>
            </svg>
            <span class="side-nav__label">${e.label}</span>
          </a>
        </li>`).join(``)),xe(e)};n(),window.addEventListener(`hashchange`,n),i(`settings`,n)}function Ce(){return window.location.hash.replace(/^#\/?/,``).split(`?`)[0].replace(/\/$/,``)}function y(e,t={}){let n=t.size||18;return`<svg class="icon${t.className?` ${t.className}`:``}" viewBox="0 0 24 24" width="${n}" height="${n}" style="width:${n}px;height:${n}px" aria-hidden="true" focusable="false"><use href="#${e}"></use></svg>`}function b(e){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function x(){return window.crypto&&typeof window.crypto.randomUUID==`function`?window.crypto.randomUUID():`id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function S(e){let t=Math.max(0,Math.round(e)),n=Math.floor(t/60),r=t%60;return`${n}:${String(r).padStart(2,`0`)}`}function C(e,t){let n=t.timeout||3e3,r=null,i=()=>{window.clearTimeout(r),e.dataset.armed=`false`,e.setAttribute(`aria-label`,t.label)};e.addEventListener(`click`,()=>{e.dataset.armed===`true`?(i(),t.onConfirm()):(e.dataset.armed=`true`,e.setAttribute(`aria-label`,t.confirmLabel),r=window.setTimeout(i,n))})}async function we(e){if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(e);return}let t=document.createElement(`textarea`);t.value=e,t.setAttribute(`readonly`,``),t.style.position=`fixed`,t.style.opacity=`0`,document.body.appendChild(t),t.select(),document.execCommand(`copy`),t.remove()}function Te(e){let t=Date.now()-e,n=Math.floor(t/6e4);if(n<1)return`ahora mismo`;if(n<60)return`hace ${n} min`;let r=Math.floor(n/60);if(r<24)return`hace ${r} h`;let i=Math.floor(r/24);return i<30?`hace ${i} d`:new Intl.DateTimeFormat(`es-ES`,{day:`numeric`,month:`short`}).format(new Date(e))}function w(e){let[t,n,r]=e.split(`-`).map(Number);return new Date(t,n-1,r)}function T(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}var Ee=`data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2032%2032%22%3E%3Crect%20width%3D%2232%22%20height%3D%2232%22%20rx%3D%228%22%20fill%3D%22%232b3646%22%2F%3E%3Cpath%20d%3D%22M13.5%2018.5a4.5%204.5%200%200%200%206.83.53l2.5-2.5a4.5%204.5%200%200%200-6.36-6.36l-1.4%201.41%22%20fill%3D%22none%22%20stroke%3D%22%239db0c4%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M18.5%2013.5a4.5%204.5%200%200%200-6.83-.53l-2.5%202.5a4.5%204.5%200%201%200%206.36%206.36l1.4-1.41%22%20fill%3D%22none%22%20stroke%3D%22%239db0c4%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E`,De=`pomodoro`,E=`DeskPRO · Dashboard de productividad`,D=[{id:`focus`,label:`Foco`,minutes:25,next:`short`},{id:`short`,label:`Descanso corto`,minutes:5,next:`focus`},{id:`long`,label:`Descanso largo`,minutes:15,next:`focus`}],Oe=54,ke=2*Math.PI*Oe,Ae=new Set,O=null,k=null,A={phase:`focus`,remaining:D[0].minutes*60,running:!1,endsAt:0,completed:n(De,{completed:0}).completed||0};function j(e){return D.find(t=>t.id===e)||D[0]}function M(){return j(A.phase).minutes*60}function N(e=!1){let t=Math.ceil(A.remaining);if(e||A.lastNotifiedSecond!==t){A.lastNotifiedSecond=t,je();for(let e of[...Ae])try{e({...A})}catch(e){console.error(`DeskPRO pomodoro listener failed`,e)}}}function je(){let e=j(A.phase);document.title=A.running?`${S(A.remaining)} · ${e.label} · DeskPRO`:E}function Me(){r(De,{completed:A.completed})}function Ne(){if(!A.running)return;let e=Math.max(0,(A.endsAt-Date.now())/1e3);A.remaining=e,e<=0?Pe():N()}function Pe(e=!0){let t=j(A.phase),n=t.id===`focus`;n&&e&&(A.completed+=1),Me(),A.running=!1,A.phase=t.next,A.remaining=M(),A.endsAt=0,Ie(),Le(),N(!0);let r=j(A.phase).label;o(e?`${n?`Foco completado`:`Descanso terminado`}. Sigue: ${r}`:`Fase saltada. Sigue: ${r}`),document.title=E}function Fe(){O===null&&(O=window.setInterval(Ne,250))}function Ie(){O!==null&&(window.clearInterval(O),O=null)}function Le(){try{let e=window.AudioContext||window.webkitAudioContext;if(!e)return;k||=new e;let t=k.currentTime;[0,.28].forEach(e=>{let n=k.createOscillator(),r=k.createGain();n.type=`sine`,n.frequency.value=880,r.gain.setValueAtTime(1e-4,t+e),r.gain.exponentialRampToValueAtTime(.18,t+e+.02),r.gain.exponentialRampToValueAtTime(1e-4,t+e+.3),n.connect(r),r.connect(k.destination),n.start(t+e),n.stop(t+e+.35)}),window.setTimeout(()=>{k&&k.state!==`closed`&&k.close(),k=null},1200)}catch{}}function Re(e){return Ae.add(e),()=>Ae.delete(e)}function ze(){return{...A}}function Be(){A.running||(A.remaining<=0&&(A.remaining=M()),A.endsAt=Date.now()+A.remaining*1e3,A.running=!0,Fe(),N(!0))}function Ve(){A.running&&(A.running=!1,A.endsAt=0,Ie(),document.title=E,N(!0))}function He(){A.running=!1,A.endsAt=0,A.remaining=M(),Ie(),document.title=E,N(!0)}function Ue(e){A.phase=e,A.running=!1,A.endsAt=0,A.remaining=M(),Ie(),document.title=E,N(!0)}function We(){Pe(!1)}function Ge(e){let t=Math.max(0,Math.round(e));return`PT${Math.floor(t/60)}M${t%60}S`}function Ke(){let e=document.getElementById(`pomodoro-app`);if(!e)return;let t=j(A.phase),n=M(),r=ke*(1-(n>0?A.remaining/n:0)),i=e.querySelector(`#pomodoro-time`),a=e.querySelector(`#pomodoro-ring`),o=e.querySelector(`#pomodoro-toggle`),s=e.querySelector(`#pomodoro-status`),c=e.querySelector(`#pomodoro-completed`),l=e.querySelector(`#pomodoro-next`);i&&(i.textContent=S(A.remaining),i.dateTime=Ge(A.remaining));let u=e.querySelector(`#pomodoro-phase-label`);if(u&&(u.textContent=t.label),a&&(a.style.strokeDashoffset=String(r)),o&&(o.innerHTML=A.running?`${y(`icon-pause`)}<span>Pausar</span>`:`${y(`icon-play`)}<span>Iniciar</span>`),s&&(s.textContent=A.running?`En curso`:`En pausa`),c&&(c.textContent=String(A.completed)),l){let e=j(t.next);l.textContent=`Siguiente: ${e.label.toLowerCase()} (${e.minutes} min)`}e.querySelectorAll(`input[name="pomodoro-phase"]`).forEach(e=>{e.checked=e.value===A.phase})}var qe={meta:{title:`Pomodoro`},render(e){e.innerHTML=`
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
            ${D.map(e=>`
              <input class="segmented__input" type="radio" name="pomodoro-phase" id="pomodoro-phase-${e.id}" value="${e.id}" ${e.id===A.phase?`checked`:``} />
              <label class="segmented__label" for="pomodoro-phase-${e.id}">${e.label}</label>`).join(``)}
          </fieldset>

          <div class="pomodoro__timer card">
            <div class="pomodoro__ring">
              <svg viewBox="0 0 120 120" role="img" aria-label="Progreso de la fase actual">
                <circle class="pomodoro__track" cx="60" cy="60" r="${Oe}" />
                <circle
                  class="pomodoro__progress"
                  id="pomodoro-ring"
                  cx="60"
                  cy="60"
                  r="${Oe}"
                  stroke-dasharray="${ke.toFixed(2)}"
                  stroke-dashoffset="0"
                />
              </svg>
              <div class="pomodoro__readout">
                <time class="pomodoro__time" id="pomodoro-time" datetime="PT25M">25:00</time>
                <span class="pomodoro__phase" id="pomodoro-phase-label">${b(j(A.phase).label)}</span>
              </div>
            </div>

            <div class="pomodoro__controls">
              <button class="button button--primary" id="pomodoro-toggle" type="button">${y(`icon-play`)}<span>Iniciar</span></button>
              <button class="button button--ghost" id="pomodoro-reset" type="button">${y(`icon-refresh`)}<span>Reiniciar</span></button>
              <button class="button button--ghost" id="pomodoro-skip" type="button">${y(`icon-chevron-right`)}<span>Saltar</span></button>
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
      </section>`;let t=i(De,e=>{A.completed=e&&e.completed||0,Ke()});e.querySelector(`#pomodoro-toggle`).addEventListener(`click`,()=>{A.running?Ve():Be()}),e.querySelector(`#pomodoro-reset`).addEventListener(`click`,()=>{He(),o(`Temporizador reiniciado`)}),e.querySelector(`#pomodoro-skip`).addEventListener(`click`,()=>{We()}),e.querySelectorAll(`input[name="pomodoro-phase"]`).forEach(e=>{e.addEventListener(`change`,()=>Ue(e.value))});let n=Re(Ke);return Ke(),()=>{n(),t()}}},Je=`https://api.open-meteo.com/v1/forecast`,Ye=6e5,Xe=new Map,Ze=new Map,Qe=[{max:0,label:`Despejado`,icon:`wmo-clear`},{max:1,label:`Mayormente despejado`,icon:`wmo-partly`},{max:2,label:`Parcialmente nublado`,icon:`wmo-partly`},{max:3,label:`Nublado`,icon:`wmo-cloud`},{max:48,label:`Niebla`,icon:`wmo-fog`},{max:57,label:`Llovizna`,icon:`wmo-rain`},{max:67,label:`Lluvia`,icon:`wmo-rain`},{max:77,label:`Nieve`,icon:`wmo-snow`},{max:82,label:`Chubascos`,icon:`wmo-rain`},{max:86,label:`Nieve`,icon:`wmo-snow`},{max:99,label:`Tormenta`,icon:`wmo-storm`}];function $e(e){let t=Number(e),n=Qe.find(e=>t<=e.max)||Qe[Qe.length-1];return{label:n.label,icon:n.icon}}function et(e,t){let n=`${e.toFixed(3)},${t.toFixed(3)}`,r=Xe.get(n);if(r&&Date.now()-r.at<Ye)return Promise.resolve(r.data);let i=new URLSearchParams({latitude:String(e),longitude:String(t),current:`temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,precipitation`,hourly:`temperature_2m,precipitation_probability,weather_code,wind_speed_10m`,daily:`weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max`,timezone:`auto`,forecast_days:`7`});return fetch(`${Je}?${i}`).then(e=>{if(!e.ok)throw Error(`Open-Meteo failed: ${e.status}`);return e.json()}).then(e=>(Xe.set(n,{data:e,at:Date.now()}),e))}function tt(e){let t=e.map(e=>e.name).join(`|`),n=Ze.get(t);if(n&&Date.now()-n.at<Ye)return Promise.resolve(n.data);let r=new URLSearchParams({latitude:e.map(e=>e.latitude).join(`,`),longitude:e.map(e=>e.longitude).join(`,`),current:`temperature_2m,weather_code,is_day`,timezone:`auto`});return fetch(`${Je}?${r}`).then(e=>{if(!e.ok)throw Error(`Open-Meteo failed: ${e.status}`);return e.json()}).then(n=>{let r=Array.isArray(n)?n:[n],i=e.map((e,t)=>{let n=(r[t]||{}).current||{};return{name:e.name,temperature:n.temperature_2m??null,weatherCode:n.weather_code??0,isDay:n.is_day===1}});return Ze.set(t,{data:i,at:Date.now()}),i})}function nt(e,t){return et(e,t).then(e=>{let t=e.current||{};return{temperature:t.temperature_2m??null,apparent:t.apparent_temperature??null,humidity:t.relative_humidity_2m??null,wind:t.wind_speed_10m??null,precipitation:t.precipitation??null,weatherCode:t.weather_code??0,isDay:t.is_day===1,time:t.time||``}})}function rt(e){let t=e.hourly.time,n=String(e.current.time||``).slice(0,13),r=t.findIndex(e=>e.slice(0,13)>=n);return r<0&&(r=0),t.slice(r,r+24).map((t,n)=>{let i=r+n;return{time:t,temperature:e.hourly.temperature_2m[i],precipitation:e.hourly.precipitation_probability[i]??0,weatherCode:e.hourly.weather_code[i],wind:e.hourly.wind_speed_10m[i]}})}var P=null;function it(){return window.YT&&window.YT.Player?Promise.resolve(window.YT):P||(P=new Promise((e,t)=>{let n=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{typeof n==`function`&&n(),e(window.YT)};let r=document.createElement(`script`);r.src=`https://www.youtube.com/iframe_api`,r.async=!0,r.onerror=()=>{P=null,t(Error(`No se pudo cargar la API de YouTube`))},document.head.appendChild(r),window.setTimeout(()=>{window.YT&&window.YT.Player?e(window.YT):(P=null,t(Error(`La API de YouTube tardó demasiado en responder`)))},15e3)}),P)}function at(e){let t=String(e||``).trim();if(!t)return null;if(/^[a-zA-Z0-9_-]{11}$/.test(t))return t;let n;try{n=new URL(t.startsWith(`http`)?t:`https://${t}`)}catch{return null}let r=n.hostname.replace(/^www\./,``);if(r===`youtu.be`)return st(n.pathname.slice(1));if(r===`youtube.com`||r===`m.youtube.com`||r===`music.youtube.com`){let e=n.searchParams.get(`v`);if(e)return st(e);let t=n.pathname.split(`/`).filter(Boolean),r=t.findIndex(e=>[`embed`,`shorts`,`live`,`v`].includes(e));if(r>=0&&t[r+1])return st(t[r+1])}return null}function ot(e){let t=`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${e}`)}&format=json`;return fetch(t).then(e=>e.ok?e.json():null).then(e=>e&&typeof e.title==`string`?e.title:null).catch(()=>null)}function st(e){let t=String(e).split(/[?&#]/)[0];return/^[a-zA-Z0-9_-]{11}$/.test(t)?t:null}var ct=`password-meta`,lt={lower:{label:`Minúsculas`,chars:`abcdefghijklmnopqrstuvwxyz`},upper:{label:`Mayúsculas`,chars:`ABCDEFGHIJKLMNOPQRSTUVWXYZ`},digits:{label:`Números`,chars:`0123456789`},symbols:{label:`Símbolos`,chars:`!@#$%^&*()-_=+[]{};:,.?/`}},ut=`0OoIl1|\`'"{}[]()/\\`,dt=[{min:0,label:`Débil`,tone:`weak`},{min:40,label:`Aceptable`,tone:`fair`},{min:60,label:`Fuerte`,tone:`strong`},{min:80,label:`Muy fuerte`,tone:`excellent`}];function ft(e){let t=Math.floor(4294967296/e)*e,n=new Uint32Array(1),r=0;do window.crypto.getRandomValues(n),r=n[0];while(r>=t);return r%e}function pt(e){return e.charAt(ft(e.length))}function mt(e){let t=[...e];for(let e=t.length-1;e>0;--e){let n=ft(e+1);[t[e],t[n]]=[t[n],t[e]]}return t}function ht(e){let t=Object.keys(lt).filter(t=>e[t]).map(e=>lt[e].chars).map(t=>e.avoidAmbiguous?[...t].filter(e=>!ut.includes(e)).join(``):t).filter(e=>e.length>0);if(t.length===0||e.length<t.length)return null;let n=t.join(``),r=t.map(e=>pt(e));for(;r.length<e.length;)r.push(pt(n));let i=mt(r).join(``),a=Math.round(e.length*Math.log2(n.length));return{password:i,pool:n.length,entropy:a}}function gt(e){return[...dt].reverse().find(t=>e>=t.min)||dt[0]}var _t={meta:{title:`Contraseñas`},render(e){e.innerHTML=`
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
                ${y(`icon-copy`)}
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
              ${Object.entries(lt).map(([e,t])=>`
                <label class="check">
                  <input class="check__input" type="checkbox" name="${e}" checked />
                  <span class="check__box" aria-hidden="true">${y(`icon-check-circle`,{size:14})}</span>
                  <span class="check__label">${t.label}</span>
                </label>`).join(``)}
              <label class="check">
                <input class="check__input" type="checkbox" name="avoidAmbiguous" />
                <span class="check__box" aria-hidden="true">${y(`icon-check-circle`,{size:14})}</span>
                <span class="check__label">Evitar ambiguos (0, O, l, 1)</span>
              </label>
            </fieldset>

            <div class="password__actions">
              <button class="button button--primary" type="submit">${y(`icon-refresh`)}<span>Generar</span></button>
            </div>
          </form>
        </div>
      </section>`;let t=e.querySelector(`#password-form`),i=e.querySelector(`#password-output`),a=e.querySelector(`#password-strength`),s=e.querySelector(`#password-length`),c=e.querySelector(`#password-length-output`),l=[...e.querySelectorAll(`.password__meter-bar`)],u=e.querySelector(`#password-copy`),d=``,f=null,p=()=>{let e=new FormData(t);return{length:Number(e.get(`length`)),lower:e.has(`lower`),upper:e.has(`upper`),digits:e.has(`digits`),symbols:e.has(`symbols`),avoidAmbiguous:e.has(`avoidAmbiguous`)}},m=e=>{d=e.password,i.textContent=e.password;let t=gt(e.entropy),n=dt.findIndex(e=>e.tone===t.tone);l.forEach((e,t)=>{e.dataset.filled=t<=n?`true`:`false`}),a.dataset.tone=t.tone,a.textContent=`${t.label} · ${e.entropy} bits de entropía · ${e.pool} caracteres posibles`,r(ct,{entropy:e.entropy,length:e.password.length,level:t.label,at:Date.now()})};t.addEventListener(`submit`,e=>{e.preventDefault();let t=ht(p());t?(m(t),o(`Contraseña generada`)):o(`Selecciona al menos un tipo de carácter y una longitud suficiente.`)}),s.addEventListener(`input`,()=>{c.textContent=s.value}),u.addEventListener(`click`,async()=>{if(!d)o(`Genera una contraseña primero`);else try{await we(d),o(`Contraseña copiada al portapapeles`),window.clearTimeout(f),u.setAttribute(`aria-label`,`Contraseña copiada`),f=window.setTimeout(()=>u.setAttribute(`aria-label`,`Copiar contraseña al portapapeles`),2500)}catch{o(`No se pudo copiar la contraseña`)}});let h=n(ct,null);return h&&typeof h.entropy==`number`&&(a.textContent=`Última generación: ${h.level} · ${h.entropy} bits`),()=>window.clearTimeout(f)}},vt=[`lun`,`mar`,`mié`,`jue`,`vie`,`sáb`,`dom`],yt=new Intl.DateTimeFormat(`es-ES`,{month:`long`,year:`numeric`}),bt=54,xt=2*Math.PI*bt,St=1,Ct={calendar(e){let t=()=>{let t=new Date,r=t.getFullYear(),i=t.getMonth(),a=n(`calendar`,{}),o=a&&typeof a==`object`?a:{},s=(new Date(r,i,1).getDay()+6)%7,c=new Date(r,i+1,0).getDate(),l=T(t),u=[];for(let e=0;e<s;e+=1)u.push(`<li class="widget-calendar__day widget-calendar__day--outside" aria-hidden="true"></li>`);let d=0,f=0;for(let e=1;e<=c;e+=1){let t=T(new Date(r,i,e)),n=Array.isArray(o[t])?o[t]:[];d+=n.length,n.length>0&&(f+=1);let a=[`widget-calendar__day`];t===l&&a.push(`is-today`),n.length>0&&a.push(`has-events`),u.push(`<li class="${a.join(` `)}" aria-hidden="true">${e}</li>`)}let p=d===0?`Sin citas este mes`:`${d} cita${d===1?``:`s`} en ${f} día${f===1?``:`s`}`;e.innerHTML=`
        <div class="widget-calendar">
          <p class="widget-calendar__month">${b(wt(yt.format(t)))}</p>
          <ol class="widget-calendar__weekdays" aria-hidden="true">
            ${vt.map(e=>`<li>${e}</li>`).join(``)}
          </ol>
          <ol class="widget-calendar__grid" aria-hidden="true">${u.join(``)}</ol>
          <p class="widget-calendar__summary">${b(p)}</p>
        </div>`};return t(),i(`calendar`,t)},pomodoro(e){e.innerHTML=`
      <div class="widget-pomodoro">
        <div class="widget-pomodoro__ring">
          <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
            <circle class="widget-pomodoro__track" cx="60" cy="60" r="${bt}" />
            <circle
              class="widget-pomodoro__progress"
              data-ring
              cx="60"
              cy="60"
              r="${bt}"
              stroke-dasharray="${xt.toFixed(2)}"
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
            ${y(`icon-play`,{size:16})}<span>Iniciar</span>
          </button>
          <button class="button button--ghost" type="button" data-reset>
            ${y(`icon-refresh`,{size:16})}<span>Reiniciar</span>
          </button>
        </div>
      </div>`;let t=e.querySelector(`[data-ring]`),n=e.querySelector(`[data-time]`),r=e.querySelector(`[data-phase]`),i=e.querySelector(`[data-toggle]`),a=e=>{let a=e||ze(),o=D.find(e=>e.id===a.phase)||D[0],s=o.minutes*60,c=s>0?Math.min(1,Math.max(0,a.remaining/s)):0,l=Math.max(0,Math.round(a.remaining));if(t.style.strokeDashoffset=String(xt*(1-c)),n.textContent=S(a.remaining),n.dateTime=`PT${Math.floor(l/60)}M${l%60}S`,r.textContent=o.label,i.dataset.running!==String(a.running)){i.dataset.running=String(a.running);let e=a.running?`Pausar`:`Iniciar`;i.innerHTML=`${a.running?y(`icon-pause`,{size:16}):y(`icon-play`,{size:16})}<span>${e}</span>`}};return i.addEventListener(`click`,()=>{ze().running?Ve():Be()}),e.querySelector(`[data-reset]`).addEventListener(`click`,()=>{He(),o(`Temporizador reiniciado`)}),a(),Re(a)},weather(e){let t=!1;return e.innerHTML=`<p class="widget-status" role="status">Cargando el tiempo…</p>`,oe().then(n=>{if(!t)return n.latitude===null||!Number.isFinite(n.latitude)?(e.innerHTML=`<p class="widget-status">Sin ubicación. Activa la ubicación o elige una ciudad.</p>`,null):nt(n.latitude,n.longitude).then(r=>{if(t)return;let i=$e(r.weatherCode);e.innerHTML=`
            <div class="widget-weather">
              <svg class="icon widget-weather__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <use href="#${i.icon===`wmo-clear`&&!r.isDay?`icon-moon`:i.icon}"></use>
              </svg>
              <div class="widget-weather__body">
                <p class="widget-weather__temp">${Number.isFinite(r.temperature)?`${Math.round(r.temperature)}°`:`—`}</p>
                <p class="widget-weather__condition">${b(i.label)}</p>
                <p class="widget-weather__place">${b(n.name)}</p>
              </div>
            </div>`})}).catch(()=>{t||(e.innerHTML=`<p class="widget-status">No se pudo cargar el tiempo.</p>`)}),()=>{t=!0}},todo(e){e.innerHTML=`
      <form class="widget-form" data-todo-form>
        <label class="sr-only" for="widget-todo-input">Nueva tarea</label>
        <input
          class="field__control"
          id="widget-todo-input"
          name="text"
          type="text"
          maxlength="140"
          placeholder="Nueva tarea…"
          autocomplete="off"
          required
        />
        <button class="button button--primary" type="submit">${y(`icon-plus`,{size:16})}<span>Añadir</span></button>
      </form>
      <ul class="widget-list" data-todo-list></ul>`;let t=e.querySelector(`[data-todo-form]`),a=e.querySelector(`#widget-todo-input`),s=e.querySelector(`[data-todo-list]`),c=()=>{let e=s.contains(document.activeElement),t=document.activeElement&&document.activeElement.dataset?document.activeElement.dataset.id:null,r=n(`todo`,[]),i=(Array.isArray(r)?r:[]).filter(e=>!e.done);i.length===0?s.innerHTML=`<li class="widget-empty">Sin tareas pendientes</li>`:s.innerHTML=i.map(e=>`
            <li class="widget-list__item">
              <label class="widget-list__label">
                <input type="checkbox" data-id="${b(e.id)}" />
                <span>${b(e.text)}</span>
              </label>
            </li>`).join(``),e&&(t&&s.querySelector(`input[data-id="${t}"]`)||s.querySelector(`input[type="checkbox"]`)||a).focus()};return t.addEventListener(`submit`,e=>{e.preventDefault();let t=a.value.trim();if(!t)return;let i=n(`todo`,[]),s=Array.isArray(i)?i:[];s.unshift({id:x(),text:t,done:!1,createdAt:Date.now()}),r(`todo`,s),a.value=``,a.focus(),o(`Tarea añadida`)}),s.addEventListener(`change`,e=>{let t=e.target.closest(`input[type="checkbox"]`);if(!t)return;let i=n(`todo`,[]);r(`todo`,(Array.isArray(i)?i:[]).map(e=>e.id===t.dataset.id?{...e,done:t.checked}:e))}),c(),i(`todo`,c)},notebook(e){e.innerHTML=`
      <form class="widget-form" data-note-form>
        <label class="sr-only" for="widget-note-input">Nueva nota</label>
        <input
          class="field__control"
          id="widget-note-input"
          name="title"
          type="text"
          maxlength="80"
          placeholder="Título de la nota…"
          autocomplete="off"
          required
        />
        <button class="button button--primary" type="submit">${y(`icon-plus`,{size:16})}<span>Añadir</span></button>
      </form>
      <ul class="widget-list" data-note-list></ul>`;let t=e.querySelector(`[data-note-form]`),a=e.querySelector(`#widget-note-input`),s=e.querySelector(`[data-note-list]`),c=()=>{let e=n(`notebook`,[]),t=(Array.isArray(e)?e:[]).slice().sort((e,t)=>t.updatedAt-e.updatedAt).slice(0,20);t.length===0?s.innerHTML=`<li class="widget-empty">Sin notas todavía</li>`:s.innerHTML=t.map(e=>`
          <li class="widget-list__item">
            <button class="widget-list__button" type="button" data-note>
              <span class="widget-list__title">${b(e.title||`Sin título`)}</span>
              <span class="widget-list__meta">${b(Te(e.updatedAt))}</span>
            </button>
          </li>`).join(``)};return t.addEventListener(`submit`,e=>{e.preventDefault();let t=a.value.trim();if(!t)return;let i=n(`notebook`,[]),s=Array.isArray(i)?i:[];s.unshift({id:x(),title:t,body:``,updatedAt:Date.now()}),r(`notebook`,s),a.value=``,a.focus(),o(`Nota creada`)}),s.addEventListener(`click`,e=>{e.target.closest(`[data-note]`)&&(window.location.hash=`#/notebook`)}),c(),i(`notebook`,c)},player(e){e.innerHTML=`
      <div class="widget-player">
        <div class="widget-player__frame" data-frame></div>
        <div class="widget-player__controls">
          <button class="icon-button widget-player__toggle" type="button" data-toggle aria-label="Reproducir" disabled>
            ${y(`icon-play`)}
          </button>
          <span class="widget-player__title" data-title>Sin vídeos en la cola</span>
          <a class="button button--ghost" href="#/player">Abrir</a>
        </div>
      </div>`;let t=e.querySelector(`[data-frame]`),r=e.querySelector(`[data-toggle]`),a=e.querySelector(`[data-title]`),o=null,s=!1,c=-1,l=null,u=!1,d=!1,f=!1,p=0,m=e=>{t.innerHTML=`<p class="widget-player__placeholder">${b(e)}</p>`},h=e=>{t.innerHTML=`<iframe
        class="widget-player__iframe"
        src="https://www.youtube.com/embed/${encodeURIComponent(e)}?rel=0"
        title="Vídeo de YouTube"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>`},g=()=>{let e=c===St;r.innerHTML=y(e?`icon-pause`:`icon-play`),r.setAttribute(`aria-label`,e?`Pausar el vídeo`:`Reproducir el vídeo`)},ee=()=>{if(p+=1,f=!1,o&&typeof o.destroy==`function`)try{o.destroy()}catch{}o=null,s=!1,c=-1,l=null,u=!1},_=e=>{if(d)return;if(o&&s&&typeof o.cueVideoById==`function`){e!==l&&(l=e,c=-1,g(),o.cueVideoById(e));return}if(o||f)return;if(u){e!==l&&(l=e,h(e));return}f=!0,l=e;let n=++p;t.innerHTML=`<div data-player-target></div>`,it().then(r=>{if(d||n!==p)return;f=!1;let i=t.querySelector(`[data-player-target]`);i&&(o=new r.Player(i,{width:`100%`,height:`100%`,videoId:e,playerVars:{controls:0,rel:0,modestbranding:1,playsinline:1,origin:window.location.origin},events:{onReady:()=>{s=!0,g()},onStateChange:e=>{c=e.data,g()}}}))}).catch(()=>{d||n!==p||(f=!1,u=!0,h(e),r.disabled=!0,r.setAttribute(`aria-label`,`Controles del reproductor embebido`))})},te=()=>{let e=n(`player`,null),t=e&&Array.isArray(e.queue)?e.queue:[],i=e&&e.currentId?e.currentId:null,o=t.find(e=>e.id===i)||t[0]||null;o?(a.textContent=o.title||o.videoId,r.disabled=u,_(o.videoId)):(ee(),m(`Sin vídeos en la cola`),a.textContent=`Añade un vídeo desde la app Reproductor`,r.disabled=!0)};r.addEventListener(`click`,()=>{o&&s&&(c===St?o.pauseVideo():o.playVideo())});let ne=i(`player`,te);return te(),()=>{ne(),d=!0,ee()}},favorites(e){let t=()=>{let t=n(`favorites`,[]),r=Array.isArray(t)?t:[];e.innerHTML=r.length===0?`<p class="widget-empty">Sin favoritos guardados</p>`:`
        <ul class="widget-list">
          ${r.slice(0,10).map(e=>`
              <li class="widget-list__item">
                <a class="widget-favorite" href="${b(e.url)}" target="_blank" rel="noopener noreferrer">
                  <img
                    class="widget-favorite__logo"
                    src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(e.host)}&sz=64"
                    alt=""
                    width="24"
                    height="24"
                    loading="lazy"
                    data-fallback="${Ee}"
                  />
                  <span class="widget-favorite__name">${b(e.name||e.host)}</span>
                  ${y(`icon-external`,{size:14})}
                </a>
              </li>`).join(``)}
        </ul>`},r=e=>{let t=e.target;t instanceof HTMLImageElement&&!t.dataset.fallbackUsed&&(t.dataset.fallbackUsed=`true`,t.src=t.dataset.fallback)};e.addEventListener(`error`,r,!0);let a=i(`favorites`,t);return t(),()=>{a(),e.removeEventListener(`error`,r,!0)}},password(e){e.innerHTML=`
      <form class="widget-password" data-password-form>
        <fieldset class="widget-password__toggles">
          <legend class="sr-only">Caracteres de la contraseña</legend>
          ${Object.entries(lt).map(([e,t])=>`
              <label class="check">
                <input class="check__input" type="checkbox" name="${e}" checked />
                <span class="check__box" aria-hidden="true">${y(`icon-check-circle`,{size:14})}</span>
                <span class="check__label">${t.label}</span>
              </label>`).join(``)}
        </fieldset>
        <button class="button button--primary" type="submit">${y(`icon-refresh`,{size:16})}<span>Generar</span></button>
      </form>
      <output class="widget-password__result" data-password-result>
        <span class="widget-password__value" data-password-value>Pulsa «Generar»</span>
        <span class="widget-password__meta" data-password-meta></span>
      </output>`;let t=e.querySelector(`[data-password-form]`),i=e.querySelector(`[data-password-value]`),a=e.querySelector(`[data-password-meta]`),s=n(`password-meta`,null);return s&&typeof s.entropy==`number`&&(a.textContent=`Última generación: ${s.level} · ${s.entropy} bits`),t.addEventListener(`submit`,e=>{e.preventDefault();let n=new FormData(t),s=ht({length:20,lower:n.has(`lower`),upper:n.has(`upper`),digits:n.has(`digits`),symbols:n.has(`symbols`),avoidAmbiguous:!1});if(!s){o(`Selecciona al menos un tipo de carácter.`);return}let c=gt(s.entropy);i.textContent=s.password,a.textContent=`${c.label} · ${s.entropy} bits · ${s.pool} caracteres posibles`,r(`password-meta`,{entropy:s.entropy,length:s.password.length,level:c.label,at:Date.now()}),o(`Contraseña generada`)}),()=>{}}};function wt(e){return e.charAt(0).toUpperCase()+e.slice(1)}var Tt={meta:{title:`Panel`},render(e){let t=[],n=()=>{for(let e of t)e();t=[]},r=()=>{n();let r=g();r.length===0?(e.innerHTML=`
          <section class="app app--dashboard">
            <div class="empty-state">
              ${y(`icon-grid`,{size:30,className:`empty-state__icon`})}
              <p class="empty-state__title">No hay aplicaciones visibles</p>
              <p class="empty-state__text">Activa al menos una desde el botón de ajustes.</p>
              <button class="button button--primary" type="button" id="dashboard-open-settings">
                ${y(`icon-settings`)}<span>Abrir ajustes</span>
              </button>
            </div>
          </section>`,e.querySelector(`#dashboard-open-settings`).addEventListener(`click`,()=>{document.getElementById(`settings-toggle`).click()})):(e.innerHTML=`
        <section class="app app--dashboard">
          <div class="dashboard__grid">
            ${r.map(e=>`
              <article class="card dashboard__card">
                <h2 class="dashboard__title">
                  <a class="dashboard__link" href="#/${e.id}">${b(e.label)}</a>
                </h2>
                <div class="dashboard__widget scrollable-y" data-widget="${e.id}">
                  <span class="skeleton" aria-hidden="true"></span>
                </div>
              </article>`).join(``)}
          </div>
        </section>`,t=[...e.querySelectorAll(`[data-widget]`)].map(e=>{let t=Ct[e.dataset.widget];return t?t(e):(e.textContent=``,null)}).filter(e=>typeof e==`function`))};r();let a=i(`settings`,r);return()=>{a(),n()}}},Et=`calendar`,Dt=[`lun`,`mar`,`mié`,`jue`,`vie`,`sáb`,`dom`],Ot=new Intl.DateTimeFormat(`es-ES`,{month:`long`,year:`numeric`}),kt=new Intl.DateTimeFormat(`es-ES`,{weekday:`long`,day:`numeric`,month:`long`}),F=new Date,I=T(new Date);function At(){let e=n(Et,{});return e&&typeof e==`object`?e:{}}function jt(e){r(Et,e)}function Mt(e){let t=At()[e];return Array.isArray(t)?t:[]}function Nt(){let e=document.getElementById(`calendar-panel`);if(!e)return;let t=w(I),n=Mt(I);e.innerHTML=`
    <h2 class="calendar__panel-title">${Rt(kt.format(t))}</h2>

    <form class="event-form" id="event-form">
      <div class="field">
        <label class="field__label" for="event-title">Nuevo evento</label>
        <input class="field__control" id="event-title" name="title" type="text" maxlength="80" placeholder="Ej. Reunión de equipo" autocomplete="off" required />
      </div>
      <div class="field event-form__row">
        <label class="field__label" for="event-time">Hora</label>
        <input class="field__control" id="event-time" name="time" type="time" />
        <button class="button button--primary" type="submit">${y(`icon-plus`)}<span>Añadir</span></button>
      </div>
    </form>

    ${n.length===0?`<p class="empty-state empty-state--compact">${y(`icon-calendar`,{size:22})}<span>Sin eventos este día.</span></p>`:`<ul class="event-list">
            ${n.map(e=>`
              <li class="event-list__item" data-id="${e.id}">
                <span class="event-list__time">${e.time?b(e.time):`Todo el día`}</span>
                <span class="event-list__title">${b(e.title)}</span>
                <button class="icon-button icon-button--small" type="button" aria-label="Eliminar evento ${b(e.title)}">
                  ${y(`icon-trash`,{size:16})}
                </button>
              </li>`).join(``)}
          </ul>`}`;let r=e.querySelector(`#event-form`);r.addEventListener(`submit`,t=>{t.preventDefault();let n=new FormData(r),i=String(n.get(`title`)||``).trim();if(!i)return;let a=At(),s=Array.isArray(a[I])?a[I]:[];a[I]=[...s,{id:x(),title:i,time:String(n.get(`time`)||``)}].sort((e,t)=>(e.time||`99:99`).localeCompare(t.time||`99:99`)),jt(a),o(`Evento añadido`);let c=e.querySelector(`#event-title`);c&&c.focus()}),e.querySelectorAll(`.event-list__item`).forEach(e=>{let t=e.querySelector(`button`);C(t,{label:t.getAttribute(`aria-label`),confirmLabel:`Confirmar eliminación`,onConfirm:()=>{let t=At();t[I]=(t[I]||[]).filter(t=>t.id!==e.dataset.id),jt(t),o(`Evento eliminado`)}})})}function Pt(){let e=document.getElementById(`calendar-table`),t=document.getElementById(`calendar-month`);if(!e||!t)return;let n=F.getFullYear(),r=F.getMonth();t.textContent=Rt(Ot.format(F));let i=(new Date(n,r,1).getDay()+6)%7,a=new Date(n,r+1,0).getDate(),o=At(),s=T(new Date),c=[];for(let e=0;e<i;e+=1)c.push(`<td class="calendar__cell calendar__cell--outside"></td>`);for(let e=1;e<=a;e+=1){let t=T(new Date(n,r,e)),i=Array.isArray(o[t])?o[t]:[],a=t===I,l=t===s,u=Rt(kt.format(w(t)));c.push(`
      <td class="calendar__cell${a?` is-selected`:``}${l?` is-today`:``}">
        <button
          class="calendar__day"
          type="button"
          data-date="${t}"
          tabindex="${a?`0`:`-1`}"
          aria-label="${u}${i.length>0?`, ${i.length} evento${i.length===1?``:`s`}`:``}"
        >
          <span class="calendar__day-number">${e}</span>
          ${i.length>0?`<span class="calendar__badge">${i.length}</span>`:``}
        </button>
      </td>`)}for(;c.length%7!=0;)c.push(`<td class="calendar__cell calendar__cell--outside"></td>`);let l=[];for(let e=0;e<c.length;e+=7)l.push(`<tr>${c.slice(e,e+7).join(``)}</tr>`);if(e.querySelector(`tbody`).innerHTML=l.join(``),!e.querySelector(`.calendar__day[tabindex="0"]`)){let t=e.querySelector(`.calendar__day`);t&&(t.tabIndex=0)}}function Ft(){Pt(),Nt()}function It(e){let t=w(e);(t.getMonth()!==F.getMonth()||t.getFullYear()!==F.getFullYear())&&(F=new Date(t.getFullYear(),t.getMonth(),1)),I=e,Ft()}var Lt={meta:{title:`Calendario`},render(e){e.innerHTML=`
      <section class="app app--calendar">
        <header class="app__header">
          <div>
            <h1 class="app__title">Calendario</h1>
          </div>
          <div class="calendar__controls">
            <button class="icon-button" id="calendar-prev" type="button" aria-label="Mes anterior">
              ${y(`icon-chevron-left`)}
            </button>
            <button class="button button--ghost" id="calendar-today" type="button">Hoy</button>
            <button class="icon-button" id="calendar-next" type="button" aria-label="Mes siguiente">
              ${y(`icon-chevron-right`)}
            </button>
          </div>
        </header>

        <div class="calendar__layout">
          <div class="calendar__main">
            <h2 class="calendar__month" id="calendar-month"></h2>
            <table class="calendar__table" id="calendar-table">
              <caption class="sr-only">Vista mensual del calendario</caption>
              <thead>
                <tr>
                  ${Dt.map(e=>`<th scope="col">${e}</th>`).join(``)}
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <aside class="calendar__panel card" id="calendar-panel"></aside>
        </div>
      </section>`;let t=e.querySelector(`#calendar-table`);e.querySelector(`#calendar-prev`).addEventListener(`click`,()=>{F=new Date(F.getFullYear(),F.getMonth()-1,1),Pt()}),e.querySelector(`#calendar-next`).addEventListener(`click`,()=>{F=new Date(F.getFullYear(),F.getMonth()+1,1),Pt()}),e.querySelector(`#calendar-today`).addEventListener(`click`,()=>{It(T(new Date))}),t.addEventListener(`click`,e=>{let t=e.target.closest(`.calendar__day`);t&&It(t.dataset.date)}),t.addEventListener(`keydown`,t=>{let n=t.target.closest(`.calendar__day`);if(!n)return;let r={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7},i=null;if(t.key in r){let e=w(n.dataset.date);e.setDate(e.getDate()+r[t.key]),i=T(e)}else if(t.key===`Home`){let e=w(n.dataset.date);e.setDate(e.getDate()-(e.getDay()+6)%7),i=T(e)}else if(t.key===`End`){let e=w(n.dataset.date);e.setDate(e.getDate()+(6-(e.getDay()+6)%7)),i=T(e)}else return;t.preventDefault(),It(i);let a=e.querySelector(`.calendar__day[data-date="${i}"]`);a&&a.focus()}),Ft();let n=i(Et,Ft);return()=>n()}};function Rt(e){return e.charAt(0).toUpperCase()+e.slice(1)}var zt=[{id:`summary`,label:`Resumen`},{id:`hourly`,label:`24 horas`},{id:`daily`,label:`7 días`},{id:`cities`,label:`Ciudades`}],L=null,R=`summary`,z=0,Bt=null;function B(e,t){let n=$e(e);return n.icon===`wmo-clear`&&!t?{iconName:`icon-moon`,label:n.label}:{iconName:n.icon,label:n.label}}function V(e,t=``,n=0){return e==null||Number.isNaN(Number(e))?`—`:`${Number(e).toFixed(n)}${t}`}function Vt(e){return`<p class="status-line" role="status">${y(`icon-refresh`,{size:16})}<span>${b(e)}</span></p>`}function H(e,t={}){let n=t.retry!==!1;return`<div class="alert" role="alert">
    ${y(`icon-alert`,{size:18})}
    <span>${b(e)}</span>
    ${n?`<button class="button button--ghost" type="button" data-retry>Reintentar</button>`:``}
  </div>`}function U(){let e=document.getElementById(`weather-panel`);if(!e||!L)return;let t=++z;e.innerHTML=Vt(`Cargando el tiempo de ${L.name}…`),et(L.latitude,L.longitude).then(e=>{t===z&&(Bt=e,Ht(e,t))}).catch(()=>{t===z&&(e.innerHTML=H(`No se pudo cargar el tiempo de ${L.name}. Comprueba tu conexión.`))})}function Ht(e,t){let n=document.getElementById(`weather-panel`);n&&(R===`cities`?Kt(t):n.innerHTML=R===`summary`?Ut(e):R===`hourly`?Wt(e):Gt(e))}function Ut(e){let t=e.current||{},n=e.daily||{},r=B(t.weather_code??0,t.is_day===1),i=n.sunrise&&n.sunrise[0]||``,a=n.sunset&&n.sunset[0]||``;return`
    <div class="weather__hero card">
      <div class="weather__hero-main">
        <svg class="icon weather__hero-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#${r.iconName}"></use></svg>
        <div>
          <p class="weather__place">${b(L.name)}</p>
          <p class="weather__temperature">${V(t.temperature_2m,`°`,1)}</p>
          <p class="weather__condition">${r.label}</p>
        </div>
      </div>
      <dl class="weather__metrics">
        <div class="weather__metric"><dt>Sensación</dt><dd>${V(t.apparent_temperature,`°`,1)}</dd></div>
        <div class="weather__metric"><dt>Humedad</dt><dd>${V(t.relative_humidity_2m,`%`)}</dd></div>
        <div class="weather__metric"><dt>Viento</dt><dd>${V(t.wind_speed_10m,` km/h`)}</dd></div>
        <div class="weather__metric"><dt>Precipitación</dt><dd>${V(t.precipitation,` mm`,1)}</dd></div>
        <div class="weather__metric"><dt>Amanece</dt><dd>${i?b(i.slice(11,16)):`—`}</dd></div>
        <div class="weather__metric"><dt>Anochece</dt><dd>${a?b(a.slice(11,16)):`—`}</dd></div>
      </dl>
    </div>

    <h2 class="weather__section-title">Hoy y mañana</h2>
    <ul class="weather__outlook">
      ${(n.time||[]).slice(0,2).map((e,t)=>{let r=B(n.weather_code[t],!0),i=new Date(`${e}T12:00:00`);return`<li class="weather__outlook-item">
            <span class="weather__outlook-day">${Yt(new Intl.DateTimeFormat(`es-ES`,{weekday:`long`}).format(i))}</span>
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#${r.iconName}"></use></svg>
            <span class="weather__outlook-range">${V(n.temperature_2m_min[t],`°`)} / ${V(n.temperature_2m_max[t],`°`)}</span>
            <span class="weather__outlook-note">${r.label} · ${V(n.precipitation_probability_max[t],`%`)} lluvia</span>
          </li>`}).join(``)}
    </ul>`}function Wt(e){let t=rt(e);return t.length===0?H(`No hay previsión por horas disponible.`):`
    <ol class="weather__hours">
      ${t.map(e=>{let t=Number(e.time.slice(11,13)),n=B(e.weatherCode,t>=6&&t<19);return`<li class="weather__hour">
            <span class="weather__hour-time">${b(e.time.slice(11,16))}</span>
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#${n.iconName}"></use></svg>
            <span class="weather__hour-temp">${V(e.temperature,`°`)}</span>
            <span class="weather__hour-rain">${V(e.precipitation,`%`)}</span>
          </li>`}).join(``)}
    </ol>`}function Gt(e){let t=e.daily||{},n=t.time||[];if(n.length===0)return H(`No hay previsión de 7 días disponible.`);let r=n.map((e,n)=>Number(t.temperature_2m_min[n])),i=n.map((e,n)=>Number(t.temperature_2m_max[n])),a=Math.min(...r),o=Math.max(...i)-a||1;return`
    <ul class="weather__days">
      ${n.map((e,n)=>{let s=new Date(`${e}T12:00:00`),c=new Intl.DateTimeFormat(`es-ES`,{weekday:`long`}).format(s),l=B(t.weather_code[n],!0),u=(r[n]-a)/o*100,d=(i[n]-r[n])/o*100;return`<li class="weather__day">
            <span class="weather__day-name">${Yt(c)}</span>
            <span class="weather__day-date">${new Intl.DateTimeFormat(`es-ES`,{day:`numeric`,month:`short`}).format(s)}</span>
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#${l.iconName}"></use></svg>
            <span class="weather__day-condition">${l.label}</span>
            <span class="weather__day-min">${V(r[n],`°`)}</span>
            <span class="weather__day-bar" aria-hidden="true"><span class="weather__day-range" style="left:${u.toFixed(1)}%; width:${d.toFixed(1)}%"></span></span>
            <span class="weather__day-max">${V(i[n],`°`)}</span>
            <span class="weather__day-rain">${V(t.precipitation_probability_max[n],`%`)}<span class="sr-only"> de lluvia</span></span>
            <span class="weather__day-wind">${V(t.wind_speed_10m_max[n],` km/h`)}</span>
          </li>`}).join(``)}
    </ul>`}function Kt(e){let t=document.getElementById(`weather-panel`);if(!t)return;let n=Xt(c,10);t.innerHTML=Vt(`Cargando ciudades del mundo…`),tt(n).then(t=>{let r=document.getElementById(`weather-panel`);r&&e===z&&(r.innerHTML=`
        <ul class="weather__cities">
          ${t.map((e,t)=>{let r=n[t];if(!r)return``;let i=B(e.weatherCode,e.isDay);return`<li>
                <button class="weather__city" type="button" data-city="${b(r.name)}" data-lat="${r.latitude}" data-lon="${r.longitude}">
                  <span class="weather__city-name">${b(r.name)}</span>
                  <span class="weather__city-temp">${V(e.temperature,`°`)}</span>
                  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#${i.iconName}"></use></svg>
                  <span class="weather__city-condition">${i.label}</span>
                </button>
              </li>`}).join(``)}
        </ul>`,r.querySelectorAll(`[data-city]`).forEach(e=>{e.addEventListener(`click`,()=>qt(e.dataset.city,Number(e.dataset.lat),Number(e.dataset.lon)))}))}).catch(()=>{let t=document.getElementById(`weather-panel`);t&&e===z&&(t.innerHTML=H(`No se pudieron cargar las ciudades del mundo.`))})}function qt(e,t,n){if(!Number.isFinite(t)||!Number.isFinite(n))return;L={name:e,latitude:t,longitude:n},Bt=null,R=`summary`;let r=document.getElementById(`weather-tab-summary`);r&&(r.checked=!0),U()}var Jt={meta:{title:`Clima`},render(e){e.innerHTML=`
      <section class="app app--weather">
        <header class="app__header">
          <div>
            <h1 class="app__title">Clima</h1>
          </div>
          <form class="weather__search" id="weather-search">
            <label class="field__label sr-only" for="weather-query">Buscar ciudad</label>
            <div class="input-with-icon">
              ${y(`icon-search`,{size:16})}
              <input class="field__control" id="weather-query" name="query" type="search" placeholder="Buscar ciudad…" autocomplete="off" list="weather-city-options" />
            </div>
            <datalist id="weather-city-options">
              ${c.map(e=>`<option value="${b(e.name)}"></option>`).join(``)}
            </datalist>
            <button class="button button--primary" type="submit">Buscar</button>
            <button class="button button--ghost" type="button" id="weather-locate">${y(`icon-pin`)}<span>Mi ubicación</span></button>
          </form>
        </header>

        <fieldset class="segmented" id="weather-tabs">
          <legend class="sr-only">Sección del clima</legend>
          ${zt.map(e=>`
            <input class="segmented__input" type="radio" name="weather-tab" id="weather-tab-${e.id}" value="${e.id}" ${e.id===R?`checked`:``} />
            <label class="segmented__label" for="weather-tab-${e.id}">${e.label}</label>`).join(``)}
        </fieldset>

        <div id="weather-panel"></div>
      </section>`;let t=e.querySelector(`#weather-search`),n=e.querySelector(`#weather-tabs`),r=e.querySelector(`#weather-locate`);return e.querySelector(`#weather-panel`).addEventListener(`click`,e=>{e.target.closest(`[data-retry]`)&&U()}),t.addEventListener(`submit`,e=>{e.preventDefault();let n=String(new FormData(t).get(`query`)||``).trim();if(!n)return;let r=document.getElementById(`weather-panel`);r&&(r.innerHTML=Vt(`Buscando ${n}…`)),se(n).then(e=>{!e.latitude||!e.longitude?r&&(r.innerHTML=H(`No encontré «${n}». Prueba con otra grafía.`,{retry:!1})):qt(e.name,e.latitude,e.longitude)})}),r.addEventListener(`click`,()=>{let e=document.getElementById(`weather-panel`);e&&(e.innerHTML=Vt(`Usando tu ubicación…`)),oe().then(t=>{t.latitude===null||!Number.isFinite(t.latitude)?e&&(e.innerHTML=H(`No pude obtener tu ubicación. Busca una ciudad por nombre.`,{retry:!1})):qt(t.name,t.latitude,t.longitude)})}),n.addEventListener(`change`,e=>{e.target.name===`weather-tab`&&(R=e.target.value,z+=1,R===`cities`?Kt(z):Bt?Ht(Bt,z):U())}),L?U():oe().then(e=>{if(e.latitude===null||!Number.isFinite(e.latitude)){let e=document.getElementById(`weather-panel`);e&&(e.innerHTML=H(`Activa la ubicación o elige una ciudad para ver el tiempo.`,{retry:!1}))}else L={name:e.name,latitude:e.latitude,longitude:e.longitude},U()}),()=>{z+=1}}};function Yt(e){return e.charAt(0).toUpperCase()+e.slice(1)}function Xt(e,t){let n=[...e];for(let e=n.length-1;e>0;--e){let t=Math.floor(Math.random()*(e+1));[n[e],n[t]]=[n[t],n[e]]}return n.slice(0,t)}var Zt=`todo`,Qt={all:`Todas`,pending:`Pendientes`,done:`Hechas`},$t=`all`;function en(){let e=n(Zt,[]);return Array.isArray(e)?e:[]}function tn(e){r(Zt,e)}function nn(){let e=document.getElementById(`todo-list`),t=document.getElementById(`todo-count`);if(!e||!t)return;let n=en(),r=n.filter(e=>!e.done).length,i=n.filter(e=>$t===`pending`?!e.done:$t!==`done`||e.done);t.textContent=`${r} pendiente${r===1?``:`s`} de ${n.length}`,i.length===0?e.innerHTML=`<li class="empty-state">
      ${y(`icon-inbox`,{size:28,className:`empty-state__icon`})}
      <p class="empty-state__title">${n.length===0?`Sin tareas todavía`:`Nada por aquí`}</p>
      <p class="empty-state__text">${n.length===0?`Añade la primera con el campo de arriba.`:`Prueba con otro filtro.`}</p>
    </li>`:(e.innerHTML=i.map(e=>`
      <li class="todo__item${e.done?` is-done`:``}" data-id="${e.id}">
        <label class="todo__check">
          <input type="checkbox" class="todo__checkbox" data-id="${e.id}" ${e.done?`checked`:``} />
          <span class="todo__text">${b(e.text)}</span>
        </label>
        <button class="icon-button icon-button--small todo__remove" type="button" data-remove="${e.id}" aria-label="Eliminar tarea ${b(e.text)}">
          ${y(`icon-trash`,{size:16})}
        </button>
      </li>`).join(``),e.querySelectorAll(`[data-remove]`).forEach(e=>{C(e,{label:e.getAttribute(`aria-label`),confirmLabel:`Confirmar eliminación`,onConfirm:()=>{tn(en().filter(t=>t.id!==e.dataset.remove)),o(`Tarea eliminada`)}})}))}var rn={meta:{title:`To do List`},render(e){e.innerHTML=`
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
            <input class="field__control" id="todo-input" name="text" type="text" maxlength="140" placeholder="Ej. Revisar el informe trimestral" autocomplete="off" required />
            <button class="button button--primary" type="submit">${y(`icon-plus`)}<span>Añadir</span></button>
          </div>
        </form>

        <fieldset class="segmented" id="todo-filters">
          <legend class="sr-only">Filtrar tareas</legend>
          ${Object.entries(Qt).map(([e,t])=>`
            <input class="segmented__input" type="radio" name="todo-filter" id="todo-filter-${e}" value="${e}" ${e===$t?`checked`:``} />
            <label class="segmented__label" for="todo-filter-${e}">${t}</label>`).join(``)}
        </fieldset>

        <ul class="todo__list" id="todo-list"></ul>
      </section>`;let t=e.querySelector(`#todo-form`),n=e.querySelector(`#todo-input`),r=e.querySelector(`#todo-filters`);nn(),t.addEventListener(`submit`,e=>{e.preventDefault();let t=n.value.trim();if(!t)return;let r=en();r.unshift({id:x(),text:t,done:!1,createdAt:Date.now()}),tn(r),n.value=``,n.focus(),o(`Tarea añadida`)}),r.addEventListener(`change`,e=>{e.target.name===`todo-filter`&&($t=e.target.value,nn())}),e.querySelector(`#todo-list`).addEventListener(`change`,e=>{let t=e.target.closest(`.todo__checkbox`);t&&tn(en().map(e=>e.id===t.dataset.id?{...e,done:t.checked}:e))});let a=i(Zt,nn);return()=>{a()}}},an=`notebook`,on=500,W=null,sn=``,cn=null,G=null;function K(){let e=n(an,[]);return Array.isArray(e)?e:[]}function ln(e){r(an,e)}function un(e){return K().find(t=>t.id===e)||null}function q(){let e=document.getElementById(`notebook-list`),t=document.getElementById(`notebook-count`);if(!e||!t)return;let n=K().sort((e,t)=>t.updatedAt-e.updatedAt),r=n.filter(e=>!sn||`${e.title} ${e.body}`.toLowerCase().includes(sn.toLowerCase()));t.textContent=sn?`${r.length} de ${n.length} nota${n.length===1?``:`s`}`:`${n.length} nota${n.length===1?``:`s`}`,e.innerHTML=r.length===0?`<li class="empty-state empty-state--compact">
      ${y(`icon-note`,{size:24})}
      <p class="empty-state__title">${n.length===0?`Sin notas`:`Sin coincidencias`}</p>
      <p class="empty-state__text">${n.length===0?`Crea la primera con «Nueva nota».`:`Prueba con otra búsqueda.`}</p>
    </li>`:r.map(e=>{let t=e.body.trim().split(`
`)[0]||`Sin contenido`;return`
      <li class="notebook__item${e.id===W?` is-active`:``}">
        <button class="notebook__item-button" type="button" data-id="${e.id}">
          <span class="notebook__item-title">${b(e.title||`Sin título`)}</span>
          <span class="notebook__item-preview">${b(t)}</span>
          <span class="notebook__item-date">${Te(e.updatedAt)}</span>
        </button>
      </li>`}).join(``)}function dn(){let e=document.getElementById(`notebook-editor`);if(!e)return;let t=W?un(W):null;if(!t){e.innerHTML=`<div class="empty-state">
      ${y(`icon-note`,{size:28,className:`empty-state__icon`})}
      <p class="empty-state__title">Ninguna nota abierta</p>
      <p class="empty-state__text">Elige una de la lista o crea una nueva.</p>
    </div>`;return}e.innerHTML=`
    <div class="notebook__editor-head">
      <label class="sr-only" for="notebook-title">Título de la nota</label>
      <input class="notebook__title-input" id="notebook-title" type="text" maxlength="80" placeholder="Título de la nota" value="${b(t.title)}" />
      <button class="icon-button" id="notebook-delete" type="button" aria-label="Eliminar nota ${b(t.title||`sin título`)}">
        ${y(`icon-trash`)}
      </button>
    </div>
    <label class="sr-only" for="notebook-body">Contenido de la nota</label>
    <textarea class="notebook__body" id="notebook-body" placeholder="Escribe aquí…">${b(t.body)}</textarea>
    <p class="notebook__meta" id="notebook-meta">Editada ${Te(t.updatedAt)}</p>`;let n=e.querySelector(`#notebook-title`),r=e.querySelector(`#notebook-body`),i=e.querySelector(`#notebook-delete`),a=()=>{window.clearTimeout(cn),G={...t,title:n.value,body:r.value,updatedAt:Date.now()},cn=window.setTimeout(()=>{let e=G;G=null,e&&ln(K().map(t=>t.id===e.id?e:t))},on)};n.addEventListener(`input`,a),r.addEventListener(`input`,a),C(i,{label:i.getAttribute(`aria-label`),confirmLabel:`Confirmar eliminación`,onConfirm:()=>{window.clearTimeout(cn),G=null,ln(K().filter(e=>e.id!==t.id)),W=null,q(),dn(),o(`Nota eliminada`)}})}function fn(){if(window.clearTimeout(cn),!G)return;let e=G;G=null,ln(K().map(t=>t.id===e.id?e:t))}function pn(e){fn(),W=e,q(),dn()}var mn={meta:{title:`Notebook`},render(e){e.innerHTML=`
      <section class="app app--notebook">
        <header class="app__header">
          <div>
            <h1 class="app__title">Notebook</h1>
          </div>
          <div class="notebook__toolbar">
            <label class="field__label sr-only" for="notebook-search">Buscar notas</label>
            <div class="input-with-icon">
              ${y(`icon-search`,{size:16})}
              <input class="field__control" id="notebook-search" type="search" placeholder="Buscar…" autocomplete="off" />
            </div>
            <button class="button button--primary" id="notebook-new" type="button">${y(`icon-plus`)}<span>Nueva nota</span></button>
          </div>
        </header>

        <div class="notebook__layout">
          <aside class="notebook__list-pane">
            <p class="notebook__count" id="notebook-count"></p>
            <ul class="notebook__list" id="notebook-list"></ul>
          </aside>
          <section class="notebook__editor card" id="notebook-editor"></section>
        </div>
      </section>`,q(),dn(),e.querySelector(`#notebook-search`).addEventListener(`input`,e=>{sn=e.target.value,q()}),e.querySelector(`#notebook-new`).addEventListener(`click`,()=>{fn();let t={id:x(),title:``,body:``,updatedAt:Date.now()};ln([t,...K()]),W=t.id,q(),dn();let n=e.querySelector(`#notebook-title`);n&&n.focus(),o(`Nota creada`)}),e.querySelector(`#notebook-list`).addEventListener(`click`,e=>{let t=e.target.closest(`[data-id]`);t&&pn(t.dataset.id)});let t=i(an,()=>{q();let e=document.getElementById(`notebook-meta`);if(e&&W){let t=un(W);t&&(e.textContent=`Editada ${Te(t.updatedAt)}`)}});return()=>{fn(),t()}}},hn=`player`,gn=1,_n=0,vn={queue:[],currentId:null},J=null,Y=!1,X=null,yn=null,bn=-1,xn=null,Sn=!1;function Z(){let e=n(hn,vn);return{queue:Array.isArray(e.queue)?e.queue:[],currentId:e.currentId||null}}function Q(e){r(hn,{...Z(),...e})}function Cn(){let e=Z();return e.queue.find(t=>t.id===e.currentId)||null}function $(){let e=document.getElementById(`player-queue`),t=document.getElementById(`player-queue-count`);if(!e||!t)return;let n=Z();t.textContent=`${n.queue.length} en cola`,n.queue.length===0?e.innerHTML=`<li class="empty-state empty-state--compact">
      ${y(`icon-play`,{size:24})}
      <p class="empty-state__title">Cola vacía</p>
      <p class="empty-state__text">Añade enlaces con «Reproducir» o «Añadir a la cola».</p>
    </li>`:(e.innerHTML=n.queue.map(e=>`
      <li class="queue__item${e.id===n.currentId?` is-current`:``}" data-id="${e.id}">
        <button class="queue__play" type="button" data-play="${e.id}">
          ${y(`icon-play`,{size:14})}
          <span class="queue__title">${b(e.title)}</span>
        </button>
        <button class="icon-button icon-button--small" type="button" data-remove="${e.id}" aria-label="Quitar de la cola ${b(e.title)}">
          ${y(`icon-close`,{size:16})}
        </button>
      </li>`).join(``),e.querySelectorAll(`[data-remove]`).forEach(e=>{C(e,{label:e.getAttribute(`aria-label`),confirmLabel:`Confirmar quitar`,onConfirm:()=>{let t=Z(),n=t.queue.filter(t=>t.id!==e.dataset.remove),r=t.currentId===e.dataset.remove?null:t.currentId;Q({queue:n,currentId:r}),r||Dn(),o(`Vídeo quitado de la cola`)}})}),e.querySelectorAll(`[data-play]`).forEach(e=>{e.addEventListener(`click`,()=>Fn(e.dataset.play))}))}function wn(){let e=document.getElementById(`player-toggle`),t=document.getElementById(`player-time`),n=document.getElementById(`player-progress`);if(!e)return;let r=bn===gn;if(xn!==r&&(xn=r,e.innerHTML=y(r?`icon-pause`:`icon-play`),e.setAttribute(`aria-label`,r?`Pausar`:`Reproducir`)),!J||!Y||typeof J.getCurrentTime!=`function`)return;let i=J.getCurrentTime()||0,a=J.getDuration()||0;t&&(t.textContent=`${S(i)} / ${S(a)}`),n&&document.activeElement!==n&&(n.max=String(Math.max(1,Math.round(a))),n.value=String(Math.round(i)),n.setAttribute(`aria-valuetext`,`${S(i)} de ${S(a)}`))}function Tn(){yn===null&&(yn=window.setInterval(wn,500))}function En(){yn!==null&&(window.clearInterval(yn),yn=null)}function Dn(){En(),bn=-1;let e=document.getElementById(`player-frame`);if(e&&(e.innerHTML=On()),J&&typeof J.destroy==`function`)try{J.destroy()}catch{J=null}J=null,Y=!1}function On(){return`<div class="player__placeholder">
    ${y(`icon-play`,{size:32,className:`player__placeholder-icon`})}
    <p class="player__placeholder-title">Sin reproduciendo</p>
    <p class="player__placeholder-text">Pega un enlace de YouTube en el campo de arriba para empezar.</p>
  </div>`}function kn(e){return`<iframe
    class="player__iframe"
    src="https://www.youtube.com/embed/${encodeURIComponent(e)}?rel=0"
    title="Reproductor de YouTube"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>`}function An(e,t={}){let n=document.getElementById(`player-frame`);n&&(J&&Y&&typeof J.loadVideoById==`function`?t.autoplay===!1?J.cueVideoById(e):J.loadVideoById(e):(X=e,J||(Sn?n.innerHTML=kn(e):(n.innerHTML=`<div class="player__target" id="player-target"></div>`,it().then(e=>{J||Sn||document.getElementById(`player-target`)&&(J=new e.Player(`player-target`,{width:`100%`,height:`100%`,videoId:X,playerVars:{controls:0,rel:0,modestbranding:1,playsinline:1,origin:window.location.origin},events:{onReady:jn,onStateChange:Mn,onError:Nn}}))}).catch(()=>{let e=document.getElementById(`player-frame`);e&&(Sn=!0,e.innerHTML=kn(X),o(`Sin controles propios: se usa el reproductor embebido de YouTube`))})))))}function jn(e){Y=!0,e.target&&typeof e.target.setVolume==`function`&&e.target.setVolume(80);let t=e.target.getVideoData?e.target.getVideoData().video_id:X;Pn(t,e.target.getVideoData?e.target.getVideoData().title:``),Tn(),wn(),X&&t!==X&&e.target.loadVideoById(X),X=null}function Mn(e){if(bn=e.data,wn(),e.data===gn){Tn();let t=e.target.getVideoData?e.target.getVideoData():null;t&&Pn(t.video_id,t.title)}e.data===_n&&In()}function Nn(){let e=document.getElementById(`player-frame`);e&&(e.innerHTML=`<div class="player__placeholder" role="alert">
      ${y(`icon-alert`,{size:28,className:`player__placeholder-icon`})}
      <p class="player__placeholder-title">No se pudo reproducir</p>
      <p class="player__placeholder-text">El vídeo no está disponible o su autor ha bloqueado la reproducción incrustada.</p>
    </div>`),En()}function Pn(e,t){let n=Z();n.queue.some(t=>t.videoId===e)&&t&&Q({queue:n.queue.map(n=>n.videoId===e?{...n,title:t}:n)})}function Fn(e){let t=Z().queue.find(t=>t.id===e);t&&(Q({currentId:t.id}),An(t.videoId),$())}function In(){let e=Z(),t=e.queue.findIndex(t=>t.id===e.currentId),n=e.queue[t+1];n?Fn(n.id):o(`Fin de la cola`)}async function Ln(e,t={}){let n=Z(),r=n.queue.find(t=>t.videoId===e);if(r)return t.enqueueOnly?(o(`Ese vídeo ya está en la cola`),r):(Q({currentId:r.id}),An(r.videoId),$(),r);let i={id:x(),videoId:e,title:`Vídeo ${e}`},a={queue:[...n.queue,i]};return t.enqueueOnly||(a.currentId=i.id),Q(a),$(),t.enqueueOnly&&o(`Añadido a la cola`),ot(e).then(t=>{t&&Pn(e,t)}),t.enqueueOnly||An(e),i}var Rn={meta:{title:`Reproductor`},render(e){e.innerHTML=`
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
              <input
                class="field__control"
                id="player-url"
                name="url"
                type="text"
                inputmode="url"
                placeholder="https://www.youtube.com/watch?v=…"
                autocomplete="off"
              />
              <button class="button button--primary" type="submit">${y(`icon-play`)}<span>Reproducir</span></button>
              <button class="button button--ghost" type="button" id="player-enqueue">${y(`icon-plus`)}<span>Añadir a la cola</span></button>
            </div>
          </div>
        </form>

        <div class="player__layout">
          <div class="player__stage card scrollable-y">
            <div class="player__frame" id="player-frame">${On()}</div>

            <div class="player__controls">
              <button class="icon-button player__toggle" id="player-toggle" type="button" aria-label="Reproducir">
                ${y(`icon-play`)}
              </button>
              <span class="player__time" id="player-time">0:00 / 0:00</span>
              <label class="sr-only" for="player-progress">Progreso de reproducción</label>
              <input class="player__progress" id="player-progress" type="range" min="0" max="100" value="0" step="1" />
              <button class="icon-button" id="player-mute" type="button" aria-label="Silenciar">
                ${y(`icon-volume`)}
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
      </section>`;let t=e.querySelector(`#player-form`),n=e.querySelector(`#player-url`),r=e.querySelector(`#player-progress`),a=e.querySelector(`#player-volume`),s=e.querySelector(`#player-mute`);$();let c=()=>at(String(new FormData(t).get(`url`)||``).trim())||(o(`Ese enlace no parece un vídeo de YouTube válido.`),null);t.addEventListener(`submit`,async e=>{e.preventDefault();let t=c();t&&(await Ln(t),n.value=``,n.focus())}),e.querySelector(`#player-enqueue`).addEventListener(`click`,async()=>{let e=c();e&&(await Ln(e,{enqueueOnly:!0}),n.value=``)}),e.querySelector(`#player-toggle`).addEventListener(`click`,()=>{J&&Y&&(bn===gn?J.pauseVideo():J.playVideo())}),r.addEventListener(`change`,()=>{J&&Y&&J.seekTo(Number(r.value),!0)}),a.addEventListener(`input`,()=>{J&&Y&&(J.setVolume(Number(a.value)),Number(a.value)>0&&s.dataset.muted===`true`&&(s.dataset.muted=`false`,s.innerHTML=y(`icon-volume`),s.setAttribute(`aria-label`,`Silenciar`)))}),s.addEventListener(`click`,()=>{if(!J||!Y)return;let e=s.dataset.muted===`true`;e?J.unMute():J.mute(),s.dataset.muted=String(!e),s.innerHTML=y(e?`icon-volume`:`icon-mute`),s.setAttribute(`aria-label`,e?`Silenciar`:`Activar sonido`)});let l=i(hn,$);if(Z().currentId){let e=Cn();e&&An(e.videoId,{autoplay:!1})}return()=>{if(l(),En(),J&&typeof J.destroy==`function`)try{J.destroy()}catch{J=null}J=null,Y=!1,X=null,bn=-1,xn=null,Sn=!1}}},zn=`favorites`;function Bn(){let e=n(zn,[]);return Array.isArray(e)?e:[]}function Vn(e){r(zn,e)}function Hn(e){let t=String(e||``).trim();if(!t)return null;let n;try{n=new URL(t.includes(`://`)?t:`https://${t}`)}catch{return null}return![`http:`,`https:`].includes(n.protocol)||!n.hostname.includes(`.`)?null:{url:n.href,host:n.hostname.replace(/^www\./,``)}}function Un(){let e=document.getElementById(`favorites-list`),t=document.getElementById(`favorites-count`);if(!e||!t)return;let n=Bn();t.textContent=`${n.length} enlace${n.length===1?``:`s`}`,n.length===0?e.innerHTML=`<li class="empty-state">
      ${y(`icon-star`,{size:28,className:`empty-state__icon`})}
      <p class="empty-state__title">Sin favoritos</p>
      <p class="empty-state__text">Guarda tu primer enlace con el formulario de arriba.</p>
    </li>`:(e.innerHTML=n.map(e=>`
      <li class="favorite" data-id="${e.id}">
        <a class="favorite__link" href="${b(e.url)}" target="_blank" rel="noopener noreferrer">
          <img
            class="favorite__logo"
            src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(e.host)}&sz=64"
            alt=""
            width="36"
            height="36"
            loading="lazy"
            data-fallback="${Ee}"
          />
          <span class="favorite__body">
            <span class="favorite__name">${b(e.name)}</span>
            <span class="favorite__host">${b(e.host)}</span>
          </span>
          ${y(`icon-external`,{size:16,className:`favorite__external`})}
        </a>
        <button class="icon-button icon-button--small favorite__remove" type="button" aria-label="Eliminar favorito ${b(e.name)}">
          ${y(`icon-trash`,{size:16})}
        </button>
      </li>`).join(``),e.querySelectorAll(`.favorite__remove`).forEach(e=>{let t=e.closest(`.favorite`).dataset.id;C(e,{label:e.getAttribute(`aria-label`),confirmLabel:`Confirmar eliminación`,onConfirm:()=>{Vn(Bn().filter(e=>e.id!==t)),o(`Favorito eliminado`)}})}))}var Wn={"":Tt,calendar:Lt,pomodoro:qe,weather:Jt,todo:rn,notebook:mn,player:Rn,favorites:{meta:{title:`Favoritos`},render(e){e.innerHTML=`
      <section class="app app--favorites">
        <header class="app__header">
          <div>
            <h1 class="app__title">Favoritos</h1>
          </div>
          <p class="app__count" id="favorites-count"></p>
        </header>

        <form class="favorites__form" id="favorites-form">
          <div class="field">
            <label class="field__label" for="favorite-name">Nombre</label>
            <input class="field__control" id="favorite-name" name="name" type="text" maxlength="40" placeholder="Ej. Documentación" autocomplete="off" required />
          </div>
          <div class="field">
            <label class="field__label" for="favorite-url">URL</label>
            <input class="field__control" id="favorite-url" name="url" type="text" inputmode="url" placeholder="https://ejemplo.com" autocomplete="off" required />
          </div>
          <button class="button button--primary" type="submit">${y(`icon-plus`)}<span>Guardar</span></button>
        </form>

        <ul class="favorites__grid" id="favorites-list"></ul>
      </section>`;let t=e.querySelector(`#favorites-form`),n=e.querySelector(`#favorites-list`);Un(),t.addEventListener(`submit`,e=>{e.preventDefault();let n=new FormData(t),r=String(n.get(`name`)||``).trim(),i=Hn(String(n.get(`url`)||``));if(!i){o(`Esa URL no parece válida. Incluye un dominio, por ejemplo https://ejemplo.com`);return}let a=Bn();a.some(e=>e.url===i.url)?o(`Ese enlace ya está guardado.`):(a.unshift({id:x(),name:r||i.host,url:i.url,host:i.host,createdAt:Date.now()}),Vn(a),t.reset(),o(`Favorito guardado`))}),n.addEventListener(`error`,e=>{let t=e.target;t instanceof HTMLImageElement&&!t.dataset.fallbackUsed&&(t.dataset.fallbackUsed=`true`,t.src=t.dataset.fallback)},!0);let r=i(zn,Un);return()=>r()}},password:_t},Gn=`Dashboard`,Kn=null,qn=!0;function Jn(e){let t=()=>{let t=Ce(),n=Wn[t]||Tt,r=n.meta||{};typeof Kn==`function`&&Kn(),Kn=null,e.innerHTML=``,document.title=`${t&&Wn[t]&&r.title||Gn} · DeskPRO`;let i=n.render(e);Kn=typeof i==`function`?i:null,qn?qn=!1:Yn(e)};window.addEventListener(`hashchange`,t),t()}function Yn(e){let t=e.querySelector(`h1`);t&&(t.setAttribute(`tabindex`,`-1`),t.focus({preventScroll:!1}))}m(f().theme),de(),Se(),ee(),Jn(document.getElementById(`view`));