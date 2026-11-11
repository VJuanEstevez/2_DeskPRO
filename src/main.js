import './css/global.css';
import './css/layout.css';

import { getSettings, applyTheme, mountSettings } from './modules/settings.js';
import { mountHeader } from './modules/header.js';
import { mountNav } from './modules/nav.js';
import { startRouter } from './modules/router.js';

applyTheme(getSettings().theme);
mountHeader();
mountNav();
mountSettings();
startRouter(document.getElementById('view'));
