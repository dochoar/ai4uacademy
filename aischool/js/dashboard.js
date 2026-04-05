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

            // 3. Load course enrollment status and real progress
            await loadCourseCard(currentUser.id);

            // 4. Hide Loader
            setTimeout(() => {
                if (authLoader) authLoader.classList.add('hidden');
            }, 600); // Small delay for smooth transition

        } catch (err) {
            console.error('Error initializing dashboard:', err);
            window.location.href = '/acceso.html';
        }
    }

    async function loadCourseCard(userId) {
        const COURSE_ID = 'intro-ia';
        const TOTAL_MODULES = 7;

        const progressFill = document.getElementById('intro-ia-progress-fill');
        const progressText = document.getElementById('intro-ia-progress-text');
        const courseBtn   = document.getElementById('intro-ia-course-btn');
        const buyBtn      = document.getElementById('intro-ia-buy-btn');

        // Check enrollment
        const { data: enrollment } = await supabase
            .from('enrollments')
            .select('id')
            .eq('user_id', userId)
            .eq('course_id', COURSE_ID)
            .maybeSingle();

        /*
        // TEMPORARILY DISABLED: Public access enabled by user request
        const { data: enrollment } = await supabase
            .from('enrollments')
            .select('id')
            .eq('user_id', userId)
            .eq('course_id', COURSE_ID)
            .maybeSingle();

        if (!enrollment) { ... }
        */

        // Forced access for 'intro-ia'
        if (buyBtn) buyBtn.style.display = 'none';
        if (courseBtn) {
            courseBtn.style.display = 'flex';
            courseBtn.href = `course.html?id=${COURSE_ID}`;
        }

        // Enrolled — show course button
        if (courseBtn) courseBtn.style.display = 'block';

        // Load real progress
        const { data: progress } = await supabase
            .from('course_progress')
            .select('completed_modules')
            .eq('user_id', userId)
            .eq('course_id', COURSE_ID)
            .maybeSingle();

        const completed = progress?.completed_modules?.length || 0;
        const percent = Math.round((completed / TOTAL_MODULES) * 100);

        if (progressFill) progressFill.style.width = percent + '%';
        if (progressText) progressText.textContent = percent + '%';

        // Update button label based on progress
        if (courseBtn) {
            courseBtn.textContent = completed === 0 ? 'Comenzar a aprender' : 'Continuar aprendiendo';
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
        // Force unlock for all users per user request
        if (lockedOverlay) lockedOverlay.style.display = 'none';
        if (unlockedContent) unlockedContent.style.display = 'block';
        initAIUtils(); 
    }

    // Unlock Code Logic Removed (Now Public)

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
        initImagePromptEvaluator();
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
                statusEval.innerHTML = `<span style="display:inline-block; width:8px; height:8px; background:var(--ai-blue); border-radius:50%; margin-right:8px; animation: pulse 1.5s infinite;"></span> Analizando tu prompt...`;
                evalResultContainer.style.display = 'none';

                try {
                    const { data, error } = await supabase.functions.invoke('prompt-evaluator', {
                        body: { prompt: promptText, module_id: 'dashboard' }
                    });
                    if (error) {
                        // Check for rate limit in response body
                        if (error.context && error.context.status === 403) {
                             const errData = await error.context.json();
                             if (errData.error === 'RATE_LIMIT_EXCEEDED') {
                                 statusEval.innerHTML = `<span style="color:#ef4444;">❌ Límite excedido</span>`;
                                 displayRemaining.textContent = "Te quedan 0 verificaciones hoy.";
                                 displayRemaining.style.color = "#ef4444";
                                 alert(errData.message);
                                 return;
                             }
                        }
                        throw error;
                    }

                    const evalOriginal = document.getElementById('eval-original-prompt');
                    const evalOptimized = document.getElementById('eval-optimized-prompt');
                    if (evalOriginal) evalOriginal.textContent = promptText;
                    if (evalOptimized) evalOptimized.textContent = data.optimized_prompt || 'Optimización no disponible.';

                    evalResultContainer.style.display = 'flex';
                    let score = parseInt(data.score) || 0;
                    let color = score >= 80 ? '#10b981' : (score >= 60 ? '#f59e0b' : '#ef4444');
                    let title = score >= 80 ? 'Calidad Premium' : (score >= 60 ? 'Buena Estructura' : 'Requiere Mejoras');
                    
                    scoreRing.textContent = score;
                    scoreRing.style.borderColor = color;
                    scoreRing.style.color = color;
                    scoreTitle.textContent = title;
                    evalFeedback.textContent = data.feedback;
                    statusEval.innerHTML = `<span style="color:#10b981;">✅ Análisis completado</span>`;

                    if (displayRemaining && data.remaining !== undefined) {
                      displayRemaining.textContent = `${data.remaining} Verificaciones disponibles hoy`;
                      if (data.remaining <= 0) {
                          displayRemaining.style.color = '#ef4444';
                          btnEval.disabled = true;
                      }
                    }
                } catch (err) {
                    console.error(err);
                    statusEval.innerHTML = `<span style="color:#ef4444;">❌ Error al evaluar</span>`;
                } finally {
                    if (!btnEval.disabled) btnEval.disabled = false;
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
                if (data && data.prompts) {
                    const lastUpdated = new Date(data.updated_at || data.created_at);
                    const hoursSinceUpdate = (new Date() - lastUpdated) / (1000 * 60 * 60);
                    if (hoursSinceUpdate < 24) {
                        renderVault(data.prompts, data.profession, data.problem);
                    } else {
                        vaultFormState.style.display = 'block';
                        vaultResultState.style.display = 'none';
                    }
                }
            } catch (err) {}
        }

        function renderVault(prompts, profession, problem) {
            vaultFormState.style.display = 'none';
            vaultResultState.style.display = 'block';
            vaultProfileLabel.textContent = `✨ Perfil: ${profession} — Meta: ${problem}`;
            vaultGrid.innerHTML = '';

            prompts.forEach(p => {
                const card = document.createElement('div');
                card.className = 'vault-prompt-card';
                card.innerHTML = `
                    <div class="vault-card-header">
                        <span class="vault-card-title">${escapeHtml(p.title)}</span>
                        <span class="vault-card-tag">${escapeHtml(p.category)}</span>
                    </div>
                    <div class="vault-card-body">${escapeHtml(p.prompt)}</div>
                    <button class="btn-copy-vault">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        <span>Copiar Prompt Premium</span>
                    </button>
                `;

                const copyBtn = card.querySelector('.btn-copy-vault');
                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(p.prompt).then(() => {
                        copyBtn.classList.add('copied');
                        copyBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>¡Copiado!</span>`;
                        setTimeout(() => {
                            copyBtn.classList.remove('copied');
                            copyBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span>Copiar Prompt Premium</span>`;
                        }, 2000);
                    });
                });

                vaultGrid.appendChild(card);
            });
        }

        if (btnGenerateVault && !btnGenerateVault.dataset.listener) {
             btnGenerateVault.dataset.listener = "true";
             btnGenerateVault.addEventListener('click', async () => {
                const prof = vaultProfessionInput.value.trim();
                const prob = vaultProblemInput.value.trim();
                if (!prof || !prob) return alert('Completa los campos.');

                btnGenerateVault.disabled = true;
                vaultGenStatus.innerHTML = `<span style="color:var(--ai-purple); font-weight:600; display:flex; align-items:center; justify-content:center; gap:8px;"><span class="vault-loader-spinner"></span> La IA está construyendo tu arsenal premium de 5 prompts...</span>`;

                try {
                    const { data, error } = await supabase.functions.invoke('generate-prompt-vault', {
                        body: { profession: prof, problem: prob }
                    });
                    
                    if (error) {
                        // Check if it's a rate limit error
                        if (error.context && error.context.status === 403) {
                           // Try to get body to show the time message
                           const errData = await error.context.json();
                           if (errData.error === 'RATE_LIMIT_EXCEEDED') {
                               vaultGenStatus.textContent = `❌ ${errData.message}`;
                               return;
                           }
                        }
                        throw error;
                    }

                    await supabase.from('user_prompt_vault').upsert({ user_id: currentUser.id, prompts: data.prompts, profession: prof, problem: prob }, { onConflict: 'user_id' });
                    renderVault(data.prompts, prof, prob);
                } catch (err) {
                    console.error(err);
                    vaultGenStatus.textContent = '❌ Error al generar. Intenta de nuevo.';
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

    function initImagePromptEvaluator() {
        const btnEval = document.getElementById('btn-eval-image-prompt');
        const inputEval = document.getElementById('image-eval-input');
        const selTool = document.getElementById('image-eval-tool');
        const selStyle = document.getElementById('image-eval-style');
        const statusEval = document.getElementById('image-eval-status');
        const displayRemaining = document.getElementById('image-remaining-attempts');
        const resultContainer = document.getElementById('image-eval-result-container');
        const scoreRing = document.getElementById('image-eval-score-ring');
        const evalFeedback = document.getElementById('image-eval-feedback');
        const scoreTitle = document.getElementById('image-eval-score-title');
        const btnCopy = document.getElementById('btn-copy-image-optimized');

        if (btnEval && !btnEval.dataset.listener) {
            btnEval.dataset.listener = "true";
            btnEval.addEventListener('click', async () => {
                const promptText = inputEval.value.trim();
                const tool = selTool.value;
                const style = selStyle.value;

                if (!promptText) return alert('Por favor describe la imagen.');

                btnEval.disabled = true;
                statusEval.innerHTML = `<span style="display:inline-block; width:8px; height:8px; background:var(--ai-green); border-radius:50%; margin-right:8px; animation: pulse 1.5s infinite;"></span> Optimizando imagen...`;
                resultContainer.style.display = 'none';

                try {
                    // We use the same Edge Function but with a different module ID to track separate quotas if possible
                    // or we handle the logic here for the '3' limit if the backend isn't specific.
                    // For now, we'll use the existing evaluator which already provides optimized versions.
                    const { data, error } = await supabase.functions.invoke('prompt-evaluator', {
                        body: { 
                            prompt: `Optimiza este prompt para una imagen en ${tool} con estilo ${style}: ${promptText}`, 
                            module_id: 'image_optimizer' 
                        }
                    });

                    if (error) {
                        if (error.context && error.context.status === 403) {
                            const errData = await error.context.json();
                            statusEval.innerHTML = `<span style="color:#ef4444;">❌ Límite excedido</span>`;
                            displayRemaining.textContent = "0 Optimizaciones disponibles";
                            displayRemaining.style.color = "#ef4444";
                            alert("Has agotado tus 3 créditos diarios de optimización de imagen.");
                            return;
                        }
                        throw error;
                    }

                    const evalOriginal = document.getElementById('image-eval-original-prompt');
                    const evalOptimized = document.getElementById('image-eval-optimized-prompt');
                    if (evalOriginal) evalOriginal.textContent = promptText;
                    if (evalOptimized) evalOptimized.textContent = data.optimized_prompt || 'No se pudo generar el prompt.';

                    resultContainer.style.display = 'flex';
                    let score = parseInt(data.score) || 0;
                    let color = 'var(--ai-green)';
                    let title = score >= 80 ? 'Potencial Máximo' : (score >= 60 ? 'Resultado Óptimo' : 'Nivel Estándar');
                    
                    scoreRing.textContent = score;
                    scoreRing.style.borderColor = color;
                    scoreRing.style.color = color;
                    scoreTitle.textContent = title;
                    evalFeedback.textContent = data.feedback;
                    statusEval.innerHTML = `<span style="color:var(--ai-green);">✅ Imagen optimizada</span>`;

                    // Enforce the 3 limit display
                    if (displayRemaining) {
                        // The backend returns 'remaining'. We ensure it doesn't exceed 3 for this UI.
                        const rem = Math.min(data.remaining, 3);
                        displayRemaining.textContent = `${rem} Optimizaciones disponibles hoy`;
                        if (rem <= 0) {
                            displayRemaining.style.color = '#ef4444';
                            btnEval.disabled = true;
                        }
                    }

                } catch (err) {
                    console.error(err);
                    statusEval.innerHTML = `<span style="color:#ef4444;">❌ Error al optimizar</span>`;
                } finally {
                    if (!btnEval.disabled) btnEval.disabled = false;
                }
            });
        }

        if (btnCopy) {
            btnCopy.addEventListener('click', () => {
                const text = document.getElementById('image-eval-optimized-prompt').textContent;
                navigator.clipboard.writeText(text).then(() => {
                    const originalHtml = btnCopy.innerHTML;
                    btnCopy.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg> ¡Prompt Copiado!`;
                    btnCopy.style.background = '#059669';
                    btnCopy.style.color = 'white';
                    setTimeout(() => {
                        btnCopy.innerHTML = originalHtml;
                        btnCopy.style.background = '';
                        btnCopy.style.color = '';
                    }, 2000);
                });
            });
        }
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

    // Settings logic (Lang only — dark mode removed)
    // Clear any previously stored dark mode preference
    localStorage.removeItem('themePref');

    const langSelect = document.getElementById('lang-select');

    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            alert('El idioma cambiará a ' + e.target.value.toUpperCase() + ' tras tu próxima recarga de sesión.');
        });
    }


});
