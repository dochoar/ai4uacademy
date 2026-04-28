// tracker.js — AI4U Academy Page View Tracker
// Registra una visita única por página por sesión de navegador.
// Importar en cada página: import './tracker.js'
// O llamar manualmente: trackPageView('nombre-pagina')

import { supabase } from './supabase-config.js';

const SESSION_KEY = 'ai4u_sid';
const TRACKED_KEY = 'ai4u_tracked';

function getSessionId() {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
        // crypto.randomUUID() disponible en navegadores modernos
        sid = (typeof crypto !== 'undefined' && crypto.randomUUID)
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
}

function getTrackedPages() {
    try {
        return JSON.parse(sessionStorage.getItem(TRACKED_KEY) || '[]');
    } catch {
        return [];
    }
}

function markPageTracked(page) {
    const tracked = getTrackedPages();
    if (!tracked.includes(page)) {
        tracked.push(page);
        sessionStorage.setItem(TRACKED_KEY, JSON.stringify(tracked));
    }
}

export async function trackPageView(pageName) {
    // Deduplicar: no volver a contar la misma página en la misma sesión
    const tracked = getTrackedPages();
    if (tracked.includes(pageName)) return;

    const sessionId = getSessionId();
    const referrer  = document.referrer ? new URL(document.referrer).hostname : null;

    try {
        await supabase.from('page_views').insert({
            page:       pageName,
            session_id: sessionId,
            referrer:   referrer
        });
        markPageTracked(pageName);
    } catch (err) {
        // Fail silently — tracking never debe romper la página
        console.debug('[tracker] error:', err);
    }
}

// Auto-detectar la página por pathname si no se pasa nombre
function inferPageName() {
    const path = window.location.pathname.replace(/\//g, '').replace('.html', '') || 'index';
    const MAP = {
        '':          'inicio',
        'index':     'inicio',
        'blog':      'blog',
        'acceso':    'acceso',
        'dashboard': 'dashboard',
        'course':    'curso',
        'examen':    'examen',
        'terminos':  'terminos',
        'certificado': 'certificado',
    };
    return MAP[path] || path;
}

// Ejecutar automáticamente al importar el módulo
trackPageView(inferPageName());
