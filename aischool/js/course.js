import { supabase } from './supabase-config.js';

const COURSE_META = {
    id: 'intro-ia',
    title: 'Introducción a la IA',
    modules: [
        { id: 1, title: 'Fundamentos', duration: '45 min', desc: 'Aprende los conceptos básicos de la inteligencia artificial, su historia reciente, y cómo los modelos de lenguaje transforman la manera en que trabajamos hoy.' },
        { id: 2, title: 'Cómo hablar con la IA', duration: '1h 30 min', desc: 'Descubre las mejores prácticas de "Prompt Engineering". Aprende a redactar instrucciones precisas para obtener resultados de altísima calidad.' },
        { id: 3, title: 'Aplicaciones reales', duration: '1h 30 min', desc: 'Casos prácticos de uso en empresas, desde redacción de correos corporativos hasta análisis de tendencias de mercado sin saber programar.' },
        { id: 4, title: 'IA para productividad', duration: '1h', desc: 'Automatiza tareas repetitivas. Usa herramientas modernas para transcribir juntas, resumir documentos y crear presentaciones en segundos.' },
        { id: 5, title: 'Riesgos, ética y límites', duration: '45 min', desc: 'Entiende las alucinaciones de la IA, los sesgos de información y las precauciones necesarias al manejar datos privados de tu empresa.' },
        { id: 6, title: 'Taller práctico final', duration: 'Taller', desc: 'Aplica todo lo aprendido. Construiremos juntos una solución basada en IA para resolver un problema cotidiano. Evaluaremos tus prompts en tiempo real.' },
        { id: 7, title: 'Examen de Certificación', duration: 'Evaluación Oficial', desc: 'Aprueba este breve desafío con más del 65% para obtener y lucir tu Certificado Profesional Oficial de AI4U Academy.' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    let currentUserFullName = 'Estudiante';
    let isAdmin = false;
    let adminUserIds = [];
    let completedModules = []; // array of module IDs (e.g. [1, 2])
    let currentModuleId = 1;

    // DOM Elements
    const authLoader = document.getElementById('auth-loader');
    const moduleListEl = document.getElementById('module-list');
    
    // Main View Elements
    const videoTitle = document.getElementById('current-video-title');
    const badgeEl = document.getElementById('module-badge');
    const titleEl = document.getElementById('module-title');
    const timeEl = document.getElementById('module-time');
    const descEl = document.getElementById('module-desc');
    const btnComplete = document.getElementById('btn-complete');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const videoContainer = document.querySelector('.video-container');

    initCourse();

    async function initCourse() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) throw new Error('Not logged in');
            currentUser = session.user;

            if (currentUser.user_metadata) {
                currentUserFullName = currentUser.user_metadata.full_name || currentUser.user_metadata.name || 'Estudiante';
            }

            // Check admin role from DB — never from client-side email comparison
            const { data: admins, error: adminsError } = await supabase
                .from('users')
                .select('id')
                .eq('role', 'admin');

            if (!adminsError && admins) {
                adminUserIds = admins.map(u => u.id);
                isAdmin = adminUserIds.includes(currentUser.id);
            }

            /*
            // TEMPORARILY DISABLED: Public access enabled by user request
            const { data: enrollment } = await supabase
                .from('enrollments')
                .select('id')
                .eq('user_id', currentUser.id)
                .eq('course_id', COURSE_META.id)
                .maybeSingle();

            if (!enrollment) {
                window.location.href = '/index.html#pricing';
                return;
            }
            */

            await fetchProgress();

            determineCurrentModule();
            
            renderSidebar();
            renderMainView(currentModuleId);

            setTimeout(() => {
                authLoader.classList.add('hidden');
            }, 600);

        } catch (err) {
            console.error('Auth error:', err);
            window.location.href = '/acceso.html';
        }
    }

    async function fetchProgress() {
        const { data, error } = await supabase
            .from('course_progress')
            .select('completed_modules')
            .eq('user_id', currentUser.id)
            .eq('course_id', COURSE_META.id)
            .single();

        if (error && error.code !== 'PGRST116') { // not found is okay
            console.error('Error fetching progress:', error);
        }

        if (data && data.completed_modules) {
            completedModules = data.completed_modules;
        } else {
            // First time accessing course, initialize progress
            await supabase.from('course_progress').insert({
                user_id: currentUser.id,
                course_id: COURSE_META.id,
                completed_modules: []
            });
            completedModules = [];
        }
    }

    function determineCurrentModule() {
        // Find highest completed
        const highestCompleted = completedModules.length > 0 ? Math.max(...completedModules) : 0;
        
        // Current module is highest completed + 1, up to total modules
        currentModuleId = Math.min(highestCompleted + 1, COURSE_META.modules.length);
    }

    function renderSidebar() {
        moduleListEl.innerHTML = '';
        const highestCompleted = completedModules.length > 0 ? Math.max(...completedModules) : 0;
        const highestUnlocked = highestCompleted + 1;

        COURSE_META.modules.forEach(mod => {
            const isCompleted = completedModules.includes(mod.id);
            const isLocked = !isCompleted && mod.id > highestUnlocked;
            const isActive = mod.id === currentModuleId;

            let statusClass = 'available';
            if (isLocked) statusClass = 'locked';
            if (isActive) statusClass = 'active';
            if (isCompleted && !isActive) statusClass = 'completed';

            let iconHtml = '';
            if (isLocked) {
                iconHtml = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
            } else if (isCompleted) {
                iconHtml = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            } else if (isActive) {
                iconHtml = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
            } else {
                iconHtml = `<div style="width: 8px; height: 8px; border-radius: 50%; background: #94a3b8;"></div>`;
            }

            const li = document.createElement('li');
            li.className = `module-item ${statusClass}`;
            li.innerHTML = `
                <div class="module-status-icon">${iconHtml}</div>
                <div class="module-info">
                    <h4>Módulo ${mod.id}: ${mod.title}</h4>
                    <p>${mod.duration}</p>
                </div>
            `;

            if (!isLocked) {
                li.addEventListener('click', () => {
                    currentModuleId = mod.id;
                    renderSidebar();
                    renderMainView(currentModuleId);
                });
            }

            moduleListEl.appendChild(li);
        });

        // Update Global Progress Bar
        const percent = Math.round((completedModules.length / COURSE_META.modules.length) * 100);
        progressFill.style.width = percent + '%';
        progressText.textContent = `${percent}% Completado`;
    }

    function renderMainView(modId) {
        const mod = COURSE_META.modules.find(m => m.id === modId);
        if (!mod) return;

        videoTitle.textContent = `Reproduciendo Módulo ${mod.id}...`;
        badgeEl.textContent = `Módulo ${mod.id}`;
        titleEl.textContent = mod.title;
        timeEl.textContent = mod.duration;
        descEl.textContent = mod.desc;

        const isCompleted = completedModules.includes(mod.id);

        if (isCompleted) {
            btnComplete.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Módulo Completado</span>
            `;
            btnComplete.classList.remove('btn-primary');
            btnComplete.classList.add('btn-secondary');
            btnComplete.style.border = "1px solid #10b981";
            btnComplete.style.color = "#10b981";
            btnComplete.disabled = true;
        } else if (mod.id === 7) {
            btnComplete.innerHTML = `
                <span>Hacer Examen Oficial y Obtener Certificado</span>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><path d="M5 12l5 5l10 -10"></path></svg>
            `;
            btnComplete.className = 'btn btn-primary btn-complete';
            btnComplete.style.background = '#0ea5e9'; // stand out color for exam
            btnComplete.disabled = false;
        } else {
            btnComplete.innerHTML = `
                <span>Marcar como Completado y Continuar</span>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><path d="M5 12l5 5l10 -10"></path></svg>
            `;
            btnComplete.className = 'btn btn-primary btn-complete';
            btnComplete.style = ''; // reset inline styles
            btnComplete.disabled = false;
        }
        
        // Animate content entrance
        const detailsPanel = document.querySelector('.module-details');
        detailsPanel.style.opacity = '0';
        detailsPanel.style.transform = 'translateY(10px)';
        setTimeout(() => {
            detailsPanel.style.transition = 'all 0.4s ease';
            detailsPanel.style.opacity = '1';
            detailsPanel.style.transform = 'translateY(0)';
        }, 50);

        // Load comments for module
        loadComments(modId);
    }

    // --- Comments Logic ---

    const commentsList = document.getElementById('comments-list');
    const commentForm = document.getElementById('comment-form');
    const commentInput = document.getElementById('comment-input');
    const commentSubmitBtn = document.getElementById('comment-submit');

    async function loadComments(modId) {
        commentsList.innerHTML = '<p style="color: #94a3b8;">Cargando comentarios...</p>';
        try {
            const { data, error } = await supabase
                .from('course_comments')
                .select('*')
                .eq('course_id', COURSE_META.id)
                .eq('module_id', modId)
                .order('created_at', { ascending: true });
            
            if (error) throw error;
            
            renderComments(data);
        } catch (err) {
            console.error(err);
            commentsList.innerHTML = '<p style="color: #ef4444;">Error cargando dudas.</p>';
        }
    }

    function renderComments(data) {
        commentsList.innerHTML = '';
        if (!data || data.length === 0) {
            commentsList.innerHTML = '<p style="color: #94a3b8; font-style: italic;">Sin comentarios aún. ¡Sé el primero en preguntar!</p>';
            return;
        }

        // Separate top-level and replies
        const parents = data.filter(c => !c.parent_id);
        const children = data.filter(c => c.parent_id);

        parents.forEach(p => {
            const html = createCommentHTML(p);
            const replies = children.filter(c => c.parent_id === p.id);
            const parentDiv = document.createElement('div');
            parentDiv.className = 'comment-card';
            parentDiv.innerHTML = html;

            replies.forEach(r => {
                const rHtml = createCommentHTML(r, true);
                const rDiv = document.createElement('div');
                rDiv.className = 'comment-reply';
                rDiv.innerHTML = rHtml;
                parentDiv.appendChild(rDiv);
            });

            commentsList.appendChild(parentDiv);
        });
    }

    function createCommentHTML(comment, isReply = false) {
        const date = new Date(comment.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const adminBadge = adminUserIds.includes(comment.user_id) ? '<span class="admin-badge">Profesor</span>' : '';
        
        let replyBtnHtml = '';
        let replyFormHtml = '';
        
        let deleteBtnHtml = '';
        if (isAdmin || comment.user_id === currentUser.id) {
            deleteBtnHtml = `<button class="btn-reply" style="color: #ef4444;" onclick="window.deleteComment('${comment.id}')">Eliminar</button>`;
        }
        
        if (!isReply) {
            replyBtnHtml = `<button class="btn-reply" onclick="window.toggleReplyForm('${comment.id}')">Responder</button>`;
            replyFormHtml = `
            <div id="reply-form-${comment.id}" class="reply-form-container" style="display: none;">
                <textarea id="reply-input-${comment.id}" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(0,0,0,0.3); color: white; min-height: 60px;" placeholder="Escribe tu respuesta..."></textarea>
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.submitReply('${comment.id}')" style="align-self: flex-start;">Enviar Respuesta</button>
            </div>`;
        }

        return `
            <div class="comment-header">
                <span class="comment-author">${escapeHtml(comment.user_name)} ${adminBadge}</span>
                <span class="comment-date">${date}</span>
            </div>
            <div class="comment-body">${escapeHtml(comment.content)}</div>
            <div class="comment-actions">
                ${replyBtnHtml}
                ${deleteBtnHtml}
            </div>
            ${replyFormHtml}
        `;
    }

    function containsProhibitedContent(text) {
        const socialRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|facebook\.com|instagram\.com|twitter\.com|x\.com|t\.me|wa\.me|@\w+)/i;
        const phoneRegex = /\+?\d[\d\s\-\.]{7,}\d/;
        return socialRegex.test(text) || phoneRegex.test(text);
    }

    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = commentInput.value.trim();
            if (!text) return;

            if (!isAdmin && containsProhibitedContent(text)) {
                alert('Las políticas prohíben compartir números de teléfono, correos, enlaces o redes sociales.');
                return;
            }

            commentSubmitBtn.disabled = true;
            commentSubmitBtn.textContent = 'Enviando...';
            
            const { error } = await supabase.from('course_comments').insert({
                course_id: COURSE_META.id,
                module_id: currentModuleId,
                user_id: currentUser.id,
                user_name: currentUserFullName,
                content: text
            });

            if (error) {
                alert('Error al publicar comentario.');
            } else {
                commentInput.value = '';
                await loadComments(currentModuleId);
            }
            commentSubmitBtn.disabled = false;
            commentSubmitBtn.textContent = 'Publicar Comentario';
        });
    }

    window.toggleReplyForm = function(commentId) {
        const form = document.getElementById('reply-form-' + commentId);
        if (form.style.display === 'none') {
            form.style.display = 'flex';
        } else {
            form.style.display = 'none';
        }
    };

    window.submitReply = async function(parentId) {
        const input = document.getElementById('reply-input-' + parentId);
        const text = input.value.trim();
        if (!text) return;

        if (!isAdmin && containsProhibitedContent(text)) {
            alert('Las políticas prohíben compartir números de teléfono, enlaces o redes sociales.');
            return;
        }

        input.disabled = true;
        
        const { error } = await supabase.from('course_comments').insert({
            course_id: COURSE_META.id,
            module_id: currentModuleId,
            user_id: currentUser.id,
            user_name: isAdmin ? 'David Ochoa' : currentUserFullName, 
            content: text,
            parent_id: parentId
        });

        if (error) {
            alert('Error publicando respuesta.');
            input.disabled = false;
            return;
        }

        await loadComments(currentModuleId);
    };

    window.deleteComment = async function(commentId) {
        if (!confirm('¿Seguro que deseas eliminar este comentario?')) return;
        
        const { error } = await supabase.from('course_comments').delete().eq('id', commentId);
        
        if (error) {
            alert('Error al intentar borrar el comentario.');
            console.error(error);
        } else {
            await loadComments(currentModuleId);
        }
    };

    function escapeHtml(unsafe) {
        return (unsafe || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    const oldBtnComplete = document.getElementById('btn-complete');
    const newBtnComplete = oldBtnComplete.cloneNode(true);
    oldBtnComplete.parentNode.replaceChild(newBtnComplete, oldBtnComplete);

    document.getElementById('btn-complete').addEventListener('click', async (e) => {
        const btn = e.currentTarget;

        if (currentModuleId === 7) {
            window.location.href = 'examen.html';
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<span>Guardando...</span>';

        // Add to completed modules avoiding duplicates
        if (!completedModules.includes(currentModuleId)) {
            completedModules.push(currentModuleId);
            
            // Save to Supabase
            const { error } = await supabase
                .from('course_progress')
                .update({ completed_modules: completedModules })
                .eq('user_id', currentUser.id)
                .eq('course_id', COURSE_META.id);
            
            if (error) {
                console.error('Error saving progress:', error);
                alert('No se pudo guardar el progreso. Verifica tu conexión.');
                btn.disabled = false;
                btn.innerHTML = '<span>Marcar como Completado</span>';
                completedModules.pop(); // revert
                return;
            }
        }

        // Advance to next module if available
        if (currentModuleId < COURSE_META.modules.length) {
            currentModuleId++;
        }

        renderSidebar();
        renderMainView(currentModuleId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Dummy video click
    videoContainer.addEventListener('click', () => {
        const placeholder = document.getElementById('video-placeholder');
        placeholder.innerHTML = `<h2 style="color: #00A389">▶ Reproduciendo video...</h2><p>Simulador de carga rápido activo.</p>`;
    });

});
