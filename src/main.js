import './css/global.css';
import './css/layout.css';

import { getSettings, applyTheme, mountSettings } from './modules/settings.js';
import { mountHeader } from './modules/header.js';
import { mountNav } from './modules/nav.js';
import { startRouter } from './modules/router.js';
import { announce } from './modules/store.js';

/**
 * Keeps every clear button in sync with its input. Delegated listeners are
 * used because most panels rebuild their markup with innerHTML.
 * @param {ParentNode} [root]
 */
function refreshClearButtons(root = document) {
  root.querySelectorAll('.input-with-clear').forEach((wrapper) => {
    const input = wrapper.querySelector('input');
    const button = wrapper.querySelector('.input-clear');
    if (!input || !button) return;
    button.hidden = input.value.length === 0;
  });
}

document.addEventListener('input', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  const wrapper = target.closest('.input-with-clear');
  if (wrapper) refreshClearButtons(wrapper);
});

// Values restored programmatically (e.g. the settings dialog) are caught here.
document.addEventListener('focusin', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  const wrapper = target.closest('.input-with-clear');
  if (wrapper) refreshClearButtons(wrapper);
});

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const button = target.closest('.input-clear');
  if (!button) return;

  const wrapper = button.closest('.input-with-clear');
  const input = wrapper && wrapper.querySelector('input');
  if (!input) return;

  input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  refreshClearButtons(wrapper);
  input.focus();
});

// form.reset() bypasses input events, so refresh on the next frame.
document.addEventListener('reset', (event) => {
  if (!(event.target instanceof HTMLFormElement)) return;
  const form = event.target;
  window.requestAnimationFrame(() => refreshClearButtons(form));
});

const clearButtonObserver = new MutationObserver((records) => {
  if (records.some((record) => record.addedNodes.length > 0)) refreshClearButtons();
});
clearButtonObserver.observe(document.body, { childList: true, subtree: true });
refreshClearButtons();

applyTheme(getSettings().theme);
mountHeader();
mountNav();
mountSettings();
startRouter(document.getElementById('view'));
registerServiceWorker();
mountInstallPrompt();

/**
 * Registers the service worker with an app-relative URL and scope, so the PWA
 * works both at "/" and under a subpath. Skipped in dev to avoid caching HMR.
 */
function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;

  const scriptUrl = new URL('./sw.js', document.baseURI);
  const scope = new URL('./', scriptUrl).href;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register(scriptUrl.href, { scope }).catch((error) => {
      console.error('DeskPRO service worker registration failed', error);
    });
  });
}

/** Shows the native install prompt only when the browser offers it. */
function mountInstallPrompt() {
  const button = document.getElementById('app-install');
  if (!button) return;

  let deferred = null;
  const hide = () => {
    button.hidden = true;
  };

  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) hide();

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferred = event;
    button.hidden = false;
  });

  button.addEventListener('click', async () => {
    if (!deferred) return;
    const prompt = deferred;
    prompt.prompt();
    const choice = await prompt.userChoice;
    deferred = null;
    hide();
    announce(choice.outcome === 'accepted' ? 'App instalada' : 'Instalación cancelada');
  });

  window.addEventListener('appinstalled', () => {
    deferred = null;
    hide();
    announce('App instalada');
  });
}
