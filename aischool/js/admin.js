import { supabase } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Nav & Layout
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const sections = document.querySelectorAll('.admin-section');
    const authLoader = document.getElementById('auth-loader');
    const logoutBtn = document.getElementById('logout-btn');
    const mobileClose = document.getElementById('mobile-close');
    const dashOverlay = document.getElementById('dash-overlay');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');

    // Stats
    const totalUsersEl = document.getElementById('stat-total-users');
    const activeUsersEl = document.getElementById('stat-active-users');
    const totalHoursEl = document.getElementById('stat-total-hours');

    // Table
    const tableBody = document.getElementById('users-table-body');
    const searchInput = document.getElementById('user-search');

    // Modal
    const modal = document.getElementById('action-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalInputs = document.getElementById('modal-inputs');
    const newPasswordInput = document.getElementById('modal-new-password');
    const modalConfirm = document.getElementById('modal-confirm');
    const modalCancel = document.getElementById('modal-cancel');

    let adminSession = null;
    let usersData = [];
    let modalAction = null; // { type: 'ban'|'unban'|'password', userId: '', userEmail: '' }
    let trafficData = null; // cache for traffic analytics
    let trafficLoaded = false;

    initAdmin();

    async function initAdmin() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) throw new Error('Not logged in');
            
            // Check manual array (Backend is also securing this)
            const email = session.user.email;
            if (email !== 'ochoadr@gmail.com' && email !== 'contacto@ai4uacademy.com') {
                alert('Acceso Denegado. Esta cuenta no tiene permisos de administrador.');
                window.location.href = '/dashboard.html';
                return;
            }

            adminSession = session;

            // Load Data
            await loadStats();
            await loadUsers();

            setTimeout(() => {
                if (authLoader) authLoader.classList.add('hidden');
            }, 500);

        } catch (err) {
            console.error(err);
            window.location.href = '/acceso.html';
        }
    }

    // --- Data Loading --- //

    async function loadStats() {
        const { data, error } = await supabase.rpc('admin_get_stats');
        if (error) {
            console.error('Error fetching stats:', error);
            return;
        }
        if (data && data.length > 0) {
            totalUsersEl.textContent = data[0].total_users || 0;
            activeUsersEl.textContent = data[0].active_users || 0;
            totalHoursEl.textContent = (data[0].total_hours || 0) + ' Hrs';
        }
    }

    async function loadUsers() {
        const { data, error } = await supabase.rpc('admin_get_users');
        if (error) {
            console.error('Error fetching users:', error);
            tableBody.innerHTML = '<tr><td colspan="5" style="color:red; text-align:center;">Error cargando usuarios</td></tr>';
            return;
        }
        
        usersData = data;
        renderUsers(usersData);
    }

    function renderUsers(list) {
        tableBody.innerHTML = '';
        if (!list || list.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding: 20px;">No se encontraron usuarios</td></tr>';
            return;
        }

        list.forEach(u => {
            const tr = document.createElement('tr');
            
            const isBanned = u.banned_until != null && new Date(u.banned_until) > new Date();
            const statusBadge = isBanned 
                ? '<span class="status-badge status-banned">Bloqueado</span>' 
                : '<span class="status-badge status-active">Activo</span>';
            
            const joinDate = new Date(u.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
            const lastLogin = u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString('es-MX') : 'Nunca';

            tr.innerHTML = `
                <td><strong>${escapeHtml(u.email)}</strong></td>
                <td>${joinDate}</td>
                <td>${lastLogin}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="action-dropdown">
                        <button class="btn-action" onclick="window.triggerPassword('${u.id}', '${u.email}')">Clave</button>
                        ${isBanned 
                            ? `<button class="btn-action" onclick="window.triggerUnban('${u.id}', '${u.email}')">Desbloquear</button>`
                            : `<button class="btn-action btn-action-danger" onclick="window.triggerBan('${u.id}', '${u.email}')">Bloquear</button>`
                        }
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // --- Layout Actions --- //

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const targetId = item.getAttribute('data-target');
            sections.forEach(sec => sec.style.display = sec.id === targetId ? 'block' : 'none');

            // Lazy-load traffic data on first visit
            if (targetId === 'admin-traffic' && !trafficLoaded) {
                loadTrafficStats();
            }

            if (window.innerWidth <= 768) {
                toggleMobileMenu();
            }
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            const filtered = usersData.filter(u => u.email.toLowerCase().includes(val));
            renderUsers(filtered);
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
            window.location.href = '/index.html';
        });
    }

    function toggleMobileMenu() {
        sidebar.classList.toggle('active');
        dashOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    if (mobileClose) mobileClose.addEventListener('click', toggleMobileMenu);
    if (dashOverlay) dashOverlay.addEventListener('click', toggleMobileMenu);

    // --- RPC Modal Logic --- //

    window.triggerBan = (id, email) => openModal('ban', id, email);
    window.triggerUnban = (id, email) => openModal('unban', id, email);
    window.triggerPassword = (id, email) => openModal('password', id, email);

    function openModal(type, id, email) {
        modalAction = { type, id, email };
        modalInputs.style.display = 'none';
        newPasswordInput.value = '';
        
        if (type === 'ban') {
            modalTitle.textContent = 'Bloquear Usuario';
            modalDesc.textContent = `¿Estás seguro que deseas revocar permanentemente el acceso a ${email}?`;
        } else if (type === 'unban') {
            modalTitle.textContent = 'Desbloquear Usuario';
            modalDesc.textContent = `Se restaurará el acceso de ${email}.`;
        } else if (type === 'password') {
            modalTitle.textContent = 'Reestablecer Contraseña';
            modalDesc.textContent = `Escribe la nueva contraseña para ${email}.`;
            modalInputs.style.display = 'block';
        }
        
        modal.classList.remove('hidden');
    }

    modalCancel.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modalConfirm.addEventListener('click', async () => {
        const btnText = modalConfirm.textContent;
        modalConfirm.textContent = 'Procesando...';
        modalConfirm.disabled = true;

        try {
            if (modalAction.type === 'ban') {
                const { error } = await supabase.rpc('admin_ban_user', { target_user_id: modalAction.id });
                if (error) throw error;
            } else if (modalAction.type === 'unban') {
                const { error } = await supabase.rpc('admin_unban_user', { target_user_id: modalAction.id });
                if (error) throw error;
            } else if (modalAction.type === 'password') {
                const pwd = newPasswordInput.value.trim();
                if (pwd.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres.");
                const { error } = await supabase.rpc('admin_update_password', { 
                    target_user_id: modalAction.id, 
                    new_password: pwd 
                });
                if (error) throw error;
            }

            alert('Acción completada con éxito.');
            modal.classList.add('hidden');
            await loadUsers(); // refresh data
            
        } catch (err) {
            console.error(err);
            alert('Error: ' + err.message);
        } finally {
            modalConfirm.textContent = btnText;
            modalConfirm.disabled = false;
        }
    });

    // ─────────────────────────────────────────────────────────────
    // TRAFFIC ANALYTICS
    // ─────────────────────────────────────────────────────────────
    async function loadTrafficStats() {
        trafficLoaded = true;

        try {
            const { data, error } = await supabase.rpc('get_pageview_stats');
            if (error) throw error;

            trafficData = typeof data === 'string' ? JSON.parse(data) : data;

            // Fill summary cards
            document.getElementById('tv-total').textContent  = Number(trafficData.total_all_time || 0).toLocaleString('es-MX');
            document.getElementById('tv-today').textContent  = Number(trafficData.total_today   || 0).toLocaleString('es-MX');
            document.getElementById('tv-week').textContent   = Number(trafficData.total_week    || 0).toLocaleString('es-MX');
            document.getElementById('tv-month').textContent  = Number(trafficData.total_month   || 0).toLocaleString('es-MX');

            // Render default chart (7 days)
            renderBarChart(7);
            renderPagesBreakdown();

            // Period buttons
            document.querySelectorAll('.tv-period-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.tv-period-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    renderBarChart(parseInt(btn.dataset.days));
                });
            });

        } catch (err) {
            console.error('Traffic stats error:', err);
            document.getElementById('tv-bar-chart').innerHTML = '<div class="tv-chart-empty">Error al cargar datos de tráfico.</div>';
        }
    }

    function renderBarChart(days) {
        const container = document.getElementById('tv-bar-chart');
        const rangeLabel = document.getElementById('tv-chart-range');
        rangeLabel.textContent = `(últimos ${days} días)`;

        if (!trafficData?.by_day || trafficData.by_day.length === 0) {
            container.innerHTML = '<div class="tv-chart-empty">Sin datos aún. Las vistas aparecerán aquí en cuanto haya tráfico.</div>';
            return;
        }

        // Filter to the requested days window
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);

        const filtered = trafficData.by_day.filter(d => new Date(d.day) >= cutoff);

        // Fill missing days with 0
        const dayMap = {};
        filtered.forEach(d => { dayMap[d.day] = Number(d.views); });

        const allDays = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            allDays.push({ day: key, views: dayMap[key] || 0 });
        }

        const maxViews = Math.max(...allDays.map(d => d.views), 1);

        container.innerHTML = allDays.map(d => {
            const heightPct = Math.round((d.views / maxViews) * 100);
            const label = new Date(d.day + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
            return `
                <div class="tv-bar-wrap">
                    <div class="tv-bar" style="height: ${Math.max(heightPct, 2)}%;">
                        <div class="tv-bar-tooltip">${d.views} vistas<br>${label}</div>
                    </div>
                    <span class="tv-bar-label">${label}</span>
                </div>
            `;
        }).join('');
    }

    function renderPagesBreakdown() {
        const container = document.getElementById('tv-pages-list');

        if (!trafficData?.by_page || trafficData.by_page.length === 0) {
            container.innerHTML = '<div class="tv-chart-empty">Sin datos aún.</div>';
            return;
        }

        const maxViews = Math.max(...trafficData.by_page.map(p => Number(p.views)), 1);

        container.innerHTML = trafficData.by_page.map(p => {
            const pct = Math.round((Number(p.views) / maxViews) * 100);
            return `
                <div class="tv-page-row">
                    <span class="tv-page-name">${escapeHtml(p.page)}</span>
                    <div class="tv-page-bar-wrap">
                        <div class="tv-page-bar-fill" style="width: ${pct}%;"></div>
                    </div>
                    <span class="tv-page-count">${Number(p.views).toLocaleString('es-MX')}</span>
                </div>
            `;
        }).join('');
    }

    function escapeHtml(unsafe) {
        return (unsafe || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
});
