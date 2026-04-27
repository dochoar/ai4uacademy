// tracker.js — AI4U Academy Page View Tracker
// Registers a unique visit per page per browser session.
// Import in each page: import './tracker.js'
// Or call manually: trackPageView('page-name')

import { supabase } from './supabase-config.js';

const SESSION_KEY = 'ai4u_sid';
const TRACKED_KEY = 'ai4u_tracked';

function getSessionId() {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
        // crypto.randomUUID() available in modern browsers
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
    // Deduplicate: don't count the same page twice in the same session
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
        // Fail silently — tracking should never break the page
        console.debug('[tracker] error:', err);
    }
}

// Auto-detect page by pathname if no name is passed
function inferPageName() {
    const path = window.location.pathname.replace(/\//g, '').replace('.html', '') || 'index';
    const MAP = {
        '':          'home',
        'index':     'home',
        'blog':      'blog',
        'acceso':    'access',
        'dashboard': 'dashboard',
        'course':    'course',
        'examen':    'exam',
        'terminos':  'terms',
        'certificado': 'certificate',
    };
    return MAP[path] || path;
}

// Automatically execute when importing the module
trackPageView(inferPageName());
