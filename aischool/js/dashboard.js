import { supabase } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const authLoader = document.getElementById('auth-loader');
    const userNameEl = document.getElementById('user-name');
    const userInitialsEl = document.getElementById('user-initials');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Mobile Menu Elements
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const mobileClose = document.getElementById('mobile-close');
    const dashOverlay = document.getElementById('dash-overlay');

    // Sections
    const coursesSection = document.querySelector('.courses-grid').parentElement;
    const profileSection = document.getElementById('profile-section');
    const settingsSection = document.getElementById('settings-section');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Profile Form
    const profileForm = document.getElementById('profile-form');
    const profileNameInput = document.getElementById('profile-name');
    const profileEmailInput = document.getElementById('profile-email');
    const profileMsg = document.getElementById('profile-msg');

    let currentUser = null;

    // Initialize Dashboard
    initDashboard();

    // Setup Ping for Activity Logs (Every 5 mins)
    setInterval(sendActivityPing, 5 * 60 * 1000);

    async function initDashboard() {
        try {
            // 1. Check active session
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error || !session) {
                // Not authenticated, redirect to login
                window.location.href = '/acceso.html';
                return;
            }

            // 2. Fetch User Data
            currentUser = session.user;
            let fullName = 'Estudiante';
            
            // Try to get name from user metadata (Google or Email signup)
            if (currentUser.user_metadata) {
                if (currentUser.user_metadata.full_name) {
                    fullName = currentUser.user_metadata.full_name;
                } else if (currentUser.user_metadata.name) {
                    fullName = currentUser.user_metadata.name;
                }
            }
            
            // Extract first name for greeting
            const firstName = fullName.split(' ')[0];
            
            // Update UI
            if (userNameEl) userNameEl.textContent = firstName;
            if (userInitialsEl) userInitialsEl.textContent = firstName.charAt(0).toUpperCase();

            // Store in Profile Form
            if (profileNameInput) profileNameInput.value = fullName;
            if (profileEmailInput) profileEmailInput.value = currentUser.email;

            // Send initial ping
            sendActivityPing();

            // 3. Hide Loader
            setTimeout(() => {
                if (authLoader) authLoader.classList.add('hidden');
            }, 600); // Small delay for smooth transition

        } catch (err) {
            console.error('Error initializing dashboard:', err);
            window.location.href = '/acceso.html';
        }
    }

    // Logout Functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const originalText = logoutBtn.innerHTML;
            logoutBtn.innerHTML = '<span>Saliendo...</span>';
            logoutBtn.style.opacity = '0.5';
            
            try {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                // Redirect immediately
                window.location.href = '/index.html';
            } catch (err) {
                console.error('Error signing out:', err);
                logoutBtn.innerHTML = originalText;
                logoutBtn.style.opacity = '1';
                alert('No se pudo cerrar sesión. Inténtalo de nuevo.');
            }
        });
    }

    // Mobile Menu Functionality
    function toggleMobileMenu() {
        sidebar.classList.toggle('active');
        dashOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    if (mobileClose) mobileClose.addEventListener('click', toggleMobileMenu);
    if (dashOverlay) dashOverlay.addEventListener('click', toggleMobileMenu);
    
    // Close sidebar on window resize if open
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // Navigation Tabs Logic
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const text = item.querySelector('span')?.textContent;
            if (!text || text === 'Cerrar Sesión') return;
            
            e.preventDefault();
            
            // Remove active from all
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            if (text === 'Mis Cursos') {
                coursesSection.style.display = 'block';
                profileSection.style.display = 'none';
                if (settingsSection) settingsSection.style.display = 'none';
            } else if (text === 'Mi Perfil') {
                coursesSection.style.display = 'none';
                profileSection.style.display = 'block';
                if (settingsSection) settingsSection.style.display = 'none';
            } else if (text === 'Configuración') {
                coursesSection.style.display = 'none';
                profileSection.style.display = 'none';
                if (settingsSection) settingsSection.style.display = 'block';
            }
            
            // Close mobile menu when navigating
            if (window.innerWidth <= 768) {
                toggleMobileMenu();
            }
        });
    });

    // Profile Form Submission
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newName = profileNameInput.value.trim();
            const btn = profileForm.querySelector('button');
            
            btn.textContent = 'Guardando...';
            btn.disabled = true;
            
            try {
                const { data, error } = await supabase.auth.updateUser({
                    data: { full_name: newName }
                });
                
                if (error) throw error;
                
                profileMsg.textContent = '¡Perfil actualizado correctamente!';
                profileMsg.style.color = '#10b981'; // green
                
                // Update greeting
                if (userNameEl) userNameEl.textContent = newName.split(' ')[0];
                if (userInitialsEl) userInitialsEl.textContent = newName.charAt(0).toUpperCase();
                
            } catch (err) {
                console.error(err);
                profileMsg.textContent = 'Error al actualizar perfil.';
                profileMsg.style.color = '#ef4444'; // red
            } finally {
                btn.textContent = 'Guardar Cambios';
                btn.disabled = false;
                setTimeout(() => { profileMsg.textContent = ''; }, 3000);
            }
        });
    }

    // Ping Function for Admin Metrics
    async function sendActivityPing() {
        if (!currentUser) return;
        try {
            // Send ping for duration tracking
            await supabase.from('activity_logs').insert([{ user_id: currentUser.id }]);
        } catch (err) {
            // fail silently, metric tracking is background check
        }
    }

    // Settings logic (Night Mode & Lang)
    const themeToggle = document.getElementById('theme-toggle');
    const langSelect = document.getElementById('lang-select');
    
    if (themeToggle) {
        // Load preference
        const isDark = localStorage.getItem('themePref') === 'dark';
        themeToggle.checked = isDark;
        if (isDark) applyDarkMode();

        themeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                applyDarkMode();
                localStorage.setItem('themePref', 'dark');
            } else {
                removeDarkMode();
                localStorage.setItem('themePref', 'light');
            }
        });
    }

    function applyDarkMode() {
        document.body.style.backgroundColor = '#0b0f19';
        document.body.style.color = '#e2e8f0';
        // Let's invert header texts and cards
        document.documentElement.style.setProperty('--dash-bg', '#0b0f19');
        document.documentElement.style.setProperty('--panel-bg', 'rgba(255, 255, 255, 0.05)');
        document.querySelectorAll('.glass-panel').forEach(el => {
            el.style.borderColor = 'rgba(255,255,255,0.1)';
        });
        document.querySelectorAll('h3, h2, h4').forEach(h => h.style.color = '#fff');
    }

    function removeDarkMode() {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
        document.documentElement.style.setProperty('--dash-bg', '#F4F7F9');
        document.documentElement.style.setProperty('--panel-bg', 'rgba(255, 255, 255, 0.9)');
        document.querySelectorAll('.glass-panel').forEach(el => {
            el.style.borderColor = 'rgba(255,255,255,0.5)';
        });
        document.querySelectorAll('h3, h2, h4').forEach(h => h.style.color = '');
    }

    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            alert('El idioma cambiará a ' + e.target.value.toUpperCase() + ' tras tu próxima recarga de sesión.');
        });
    }

    // --- PROMPT EVALUATOR LOGIC ---
    const btnEval = document.getElementById('btn-eval-prompt');
    const inputEval = document.getElementById('prompt-eval-input');
    const statusEval = document.getElementById('prompt-eval-status');
    const displayRemaining = document.getElementById('eval-remaining-attempts');
    const evalResultContainer = document.getElementById('eval-result-container');
    const scoreRing = document.getElementById('eval-score-ring');
    const evalFeedback = document.getElementById('eval-feedback');
    const scoreTitle = document.getElementById('eval-score-title');

    if (btnEval && inputEval) {
        btnEval.addEventListener('click', async () => {
            const promptText = inputEval.value.trim();
            if (!promptText) {
                alert('Por favor, escribe un prompt antes de evaluarlo.');
                return;
            }

            btnEval.disabled = true;
            statusEval.textContent = 'Analizando tu prompt con IA... 🧠';
            evalResultContainer.style.display = 'none';

            try {
                // Call Supabase Edge Function
                const { data, error } = await supabase.functions.invoke('prompt-evaluator', {
                    body: { prompt: promptText, module_id: 'dashboard' }
                });

                if (error) throw error;
                
                evalResultContainer.style.display = 'block';
                
                let score = parseInt(data.score) || 0;
                let color = score >= 80 ? '#10b981' : (score >= 60 ? '#f59e0b' : '#ef4444');
                let title = score >= 80 ? '¡Excelente Prompt! 🌟' : (score >= 60 ? 'Buen intento, se puede mejorar 👍' : 'Rechazado: Faltan pilares clave ⚠️');

                scoreTitle.textContent = title;
                scoreRing.textContent = score;
                scoreRing.style.borderColor = color;
                scoreRing.style.color = color;
                evalResultContainer.style.borderLeftColor = color;
                
                evalFeedback.textContent = data.feedback || 'Sin comentarios adicionales de la IA.';
                statusEval.textContent = 'Evaluación completada.';

                if (displayRemaining && typeof data.remaining !== 'undefined') {
                    displayRemaining.textContent = `Te quedan ${data.remaining} verificaciones hoy.`;
                    if (data.remaining <= 0) {
                        displayRemaining.style.color = '#ef4444';
                        btnEval.disabled = true;
                    } else if (data.remaining <= 2) {
                        displayRemaining.style.color = '#f59e0b';
                    }
                }

            } catch (err) {
                console.error("AI Evaluation Error:", err);
                
                let isRateLimited = false;
                if (err.context && err.context.status === 403) {
                    isRateLimited = true;
                } else if (err.message && err.message.includes('RATE_LIMIT_EXCEEDED')) {
                    isRateLimited = true;
                }
                
                if (isRateLimited) {
                     statusEval.textContent = 'Límite superado.';
                     if (displayRemaining) {
                         displayRemaining.style.color = '#ef4444';
                         displayRemaining.textContent = 'Te quedan 0 verificaciones hoy.';
                     }
                     alert('Has alcanzado tu límite máximo de 5 evaluaciones por día. Por favor, ¡vuelve mañana para seguir practicando!');
                } else {
                     statusEval.textContent = 'Error al evaluar. Intenta de nuevo.';
                     alert('Ocurrió un error consultando al profesor de IA.');
                     btnEval.disabled = false;
                }
            } finally {
                if (displayRemaining && displayRemaining.textContent.includes(' 0 ')) {
                     btnEval.disabled = true;
                } else {
                     btnEval.disabled = false;
                }
            }
        });
    }
});
