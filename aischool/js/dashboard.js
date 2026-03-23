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
    const toolsSection = document.getElementById('tools-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const text = item.querySelector('span')?.textContent;
            if (!text || text === 'Cerrar Sesión') return;
            
            e.preventDefault();
            
            // Remove active from all
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Hide all sections first
            coursesSection.style.display = 'none';
            profileSection.style.display = 'none';
            if (settingsSection) settingsSection.style.display = 'none';
            if (toolsSection) toolsSection.style.display = 'none';

            if (text === 'Mis Cursos') {
                coursesSection.style.display = 'block';
            } else if (text === 'Mi Perfil') {
                profileSection.style.display = 'block';
            } else if (text === 'Configuración') {
                settingsSection.style.display = 'block';
            } else if (text === 'Herramientas IA') {
                toolsSection.style.display = 'block';
                checkToolsUnlockState();
            }
            
            // Close mobile menu when navigating
            if (window.innerWidth <= 768) {
                toggleMobileMenu();
            }
        });
    });

    // ─────────────────────────────────────────────────────────────
    // HERRAMIENTAS IA - UNLOCK LOGIC
    // ─────────────────────────────────────────────────────────────
    const lockedOverlay = document.getElementById('tools-locked-overlay');
    const unlockedContent = document.getElementById('tools-unlocked-content');
    const unlockInput = document.getElementById('unlock-code-input');
    const unlockBtn = document.getElementById('btn-unlock-tools');
    const unlockError = document.getElementById('unlock-error-msg');

    async function checkToolsUnlockState() {
        if (!currentUser) return;
        
        // Update WhatsApp link with user email for faster identification
        const waLink = document.getElementById('whatsapp-unlock-link');
        if (waLink) {
            const baseMsg = "Hola!%20Acabo%20de%20compartir%20mi%20opini%C3%B3n%20sobre%20AI4U%20Academy%20y%20compart%C3%AD%20la%20web%20en%20mis%20redes.%20%C2%BFI%20Podr%C3%ADas%20darme%20mi%20c%C3%B3digo%20para%20desbloquear%20las%20Herramientas%20IA%3F";
            const emailStr = `%20Mi%20correo%20es:%20${encodeURIComponent(currentUser.email)}`;
            waLink.href = `https://wa.me/5212211173457?text=${baseMsg}${emailStr}`;
        }

        // Metadata might be fresh from getSession() or needs refresh
        const isUnlocked = currentUser.user_metadata?.tools_unlocked === true;
        
        if (isUnlocked) {
            lockedOverlay.style.display = 'none';
            unlockedContent.style.display = 'block';
            initAIUtils(); // Load vault if exists
        } else {
            lockedOverlay.style.display = 'block';
            unlockedContent.style.display = 'none';
        }
    }

    if (unlockBtn) {
        unlockBtn.addEventListener('click', async () => {
            const code = unlockInput.value.trim().toLowerCase();
            if (code === 'ai4uacademy') {
                unlockBtn.disabled = true;
                unlockBtn.textContent = 'Validando...';
                
                try {
                    // Save to user metadata for persistence
                    const { data, error } = await supabase.auth.updateUser({
                        data: { tools_unlocked: true }
                    });
                    
                    if (error) throw error;
                    
                    currentUser = data.user; // Update local ref
                    checkToolsUnlockState();
                    alert('¡Acceso concedido! Bienvenido a tus herramientas de élite.');
                } catch (err) {
                    console.error(err);
                    unlockError.textContent = 'Error al activar. Intenta de nuevo.';
                } finally {
                    unlockBtn.disabled = false;
                    unlockBtn.textContent = 'Desbloquear';
                }
            } else {
                unlockError.textContent = 'Código incorrecto. Asegúrate de haber compartido la web.';
                setTimeout(() => { unlockError.textContent = ''; }, 3000);
            }
        });
    }

    // ─────────────────────────────────────────────────────────────
    // AI UTILS (CORRECTOR & VAULT)
    // ─────────────────────────────────────────────────────────────
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function initAIUtils() {
        initPromptEvaluator();
        initPromptVault();
    }

    // REUSED FROM COURSE.JS
    function initPromptEvaluator() {
        const btnEval = document.getElementById('btn-eval-prompt');
        const inputEval = document.getElementById('prompt-eval-input');
        const statusEval = document.getElementById('prompt-eval-status');
        const displayRemaining = document.getElementById('eval-remaining-attempts');
        const evalResultContainer = document.getElementById('eval-result-container');
        const scoreRing = document.getElementById('eval-score-ring');
        const evalFeedback = document.getElementById('eval-feedback');
        const scoreTitle = document.getElementById('eval-score-title');

        if (btnEval && !btnEval.dataset.listener) {
            btnEval.dataset.listener = "true";
            btnEval.addEventListener('click', async () => {
                const promptText = inputEval.value.trim();
                if (!promptText) return alert('Escribe un prompt.');

                btnEval.disabled = true;
                statusEval.textContent = 'Analizando... 🧠';
                evalResultContainer.style.display = 'none';

                try {
                    const { data, error } = await supabase.functions.invoke('prompt-evaluator', {
                        body: { prompt: promptText, module_id: 'dashboard' }
                    });
                    if (error) throw error;

                    evalResultContainer.style.display = 'block';
                    let score = parseInt(data.score) || 0;
                    let color = score >= 80 ? '#10b981' : (score >= 60 ? '#f59e0b' : '#ef4444');
                    
                    scoreRing.textContent = score;
                    scoreRing.style.borderColor = color;
                    scoreRing.style.color = color;
                    evalFeedback.textContent = data.feedback;
                    statusEval.textContent = 'Completado.';

                    if (displayRemaining && data.remaining !== undefined) {
                      displayRemaining.textContent = `Te quedan ${data.remaining} verificaciones hoy.`;
                    }
                } catch (err) {
                    console.error(err);
                    statusEval.textContent = 'Error al evaluar.';
                } finally {
                    btnEval.disabled = false;
                }
            });
        }
    }

    function initPromptVault() {
        const vaultFormState    = document.getElementById('vault-form-state');
        const vaultResultState  = document.getElementById('vault-result-state');
        const vaultGrid         = document.getElementById('vault-prompts-grid');
        const btnGenerateVault  = document.getElementById('btn-generate-vault');
        const btnRegenerateVault = document.getElementById('btn-regenerate-vault');
        const vaultGenStatus    = document.getElementById('vault-gen-status');
        const vaultProfessionInput = document.getElementById('vault-profession');
        const vaultProblemInput    = document.getElementById('vault-problem');
        const vaultProfileLabel = document.getElementById('vault-profile-label');

        async function loadVault() {
            try {
                const { data, error } = await supabase.from('user_prompt_vault').select('*').eq('user_id', currentUser.id).single();
                if (data && data.prompts) renderVault(data.prompts, data.profession, data.problem);
            } catch (err) {}
        }

        function renderVault(prompts, profession, problem) {
            vaultFormState.style.display = 'none';
            vaultResultState.style.display = 'block';
            vaultProfileLabel.textContent = `✨ Perfil: ${profession}`;
            vaultGrid.innerHTML = '';
            prompts.forEach(p => {
                const card = document.createElement('div');
                card.className = 'vault-prompt-card';
                card.style.background = 'rgba(168,85,247,0.1)';
                card.style.border = '1px solid rgba(168,85,247,0.2)';
                card.style.padding = '15px';
                card.style.borderRadius = '10px';
                card.style.marginBottom = '10px';
                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span style="font-weight:bold; color:#fff; font-size:0.9rem;">${escapeHtml(p.title)}</span>
                        <span style="font-size:0.7rem; background:#a855f7; color:white; padding:2px 6px; border-radius:4px;">${escapeHtml(p.category)}</span>
                    </div>
                    <p style="font-size:0.8rem; color:#94a3b8; line-height:1.4;">${escapeHtml(p.prompt)}</p>
                    <button class="btn-copy-vault" style="width:100%; border:1px solid #a855f7; background:transparent; color:#a855f7; border-radius:6px; padding:5px; font-size:0.8rem; cursor:pointer;" data-text="${escapeHtml(p.prompt)}">Copiar Prompt</button>
                `;
                vaultGrid.appendChild(card);
            });

            vaultGrid.querySelectorAll('.btn-copy-vault').forEach(btn => {
                btn.addEventListener('click', () => {
                   navigator.clipboard.writeText(btn.dataset.text).then(() => {
                        const original = btn.textContent;
                        btn.textContent = '¡Copiado!';
                        setTimeout(() => btn.textContent = original, 2000);
                   });
                });
            });
        }

        if (btnGenerateVault && !btnGenerateVault.dataset.listener) {
             btnGenerateVault.dataset.listener = "true";
             btnGenerateVault.addEventListener('click', async () => {
                const prof = vaultProfessionInput.value.trim();
                const prob = vaultProblemInput.value.trim();
                if (!prof || !prob) return alert('Completa los campos.');

                btnGenerateVault.disabled = true;
                vaultGenStatus.textContent = 'Generando tu bóveda (Aprox. 10s)... ⏳';

                try {
                    const { data, error } = await supabase.functions.invoke('generate-prompt-vault', {
                        body: { profession: prof, problem: prob }
                    });
                    if (error) throw error;

                    await supabase.from('user_prompt_vault').upsert({ user_id: currentUser.id, prompts: data.prompts, profession: prof, problem: prob }, { onConflict: 'user_id' });
                    renderVault(data.prompts, prof, prob);
                } catch (err) {
                    console.error(err);
                    vaultGenStatus.textContent = 'Error al generar.';
                } finally {
                    btnGenerateVault.disabled = false;
                }
             });
        }

        if (btnRegenerateVault && !btnRegenerateVault.dataset.listener) {
            btnRegenerateVault.dataset.listener = "true";
            btnRegenerateVault.addEventListener('click', () => {
                vaultResultState.style.display = 'none';
                vaultFormState.style.display = 'block';
            });
        }

        loadVault();
    }

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


});
