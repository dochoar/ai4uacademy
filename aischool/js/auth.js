import { supabase } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    checkSession();

    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const googleBtn = document.getElementById('google-btn');
    const loginTab = document.getElementById('tab-login');
    const signupTab = document.getElementById('tab-signup');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const authError = document.getElementById('auth-error');
    const authSuccess = document.getElementById('auth-success');

    let currentMode = 'login'; // 'login' or 'signup'

    // Tab Switching Logic
    if (loginTab && signupTab) {
        loginTab.addEventListener('click', () => switchTab('login'));
        signupTab.addEventListener('click', () => switchTab('signup'));
    }

    function switchTab(mode) {
        currentMode = mode;
        clearMessages();
        
        if (mode === 'login') {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            formTitle.textContent = 'Welcome back';
            formSubtitle.textContent = 'Enter your credentials to continue';
        } else {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.style.display = 'block';
            loginForm.style.display = 'none';
            formTitle.textContent = 'Create your account';
            formSubtitle.textContent = 'Join the academy and master AI';
        }
    }

    // Google OAuth
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            clearMessages();
            try {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: `${window.location.origin}/dashboard.html`
                    }
                });
                if (error) throw error;
            } catch (error) {
                showError('Error logging in with Google: ' + error.message);
            }
        });
    }

    // Login Form Submit
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearMessages();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const btn = loginForm.querySelector('button[type="submit"]');
            
            setLoading(btn, true, 'Logging in...');
            
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                
                if (error) throw error;
                
                if (data.session) {
                    window.location.href = '/dashboard.html';
                }
            } catch (error) {
                showError('Incorrect credentials or login error.');
            } finally {
                setLoading(btn, false, 'Log In');
            }
        });
    }

    // Signup Form Submit
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearMessages();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-password-confirm').value;
            const termsChecked = document.getElementById('signup-terms').checked;
            const btn = signupForm.querySelector('button[type="submit"]');
            
            if (password !== confirmPassword) {
                showError('Passwords do not match.');
                return;
            }

            if (!termsChecked) {
                showError('You must accept the Terms and Conditions.');
                return;
            }
            
            setLoading(btn, true, 'Creating account...');
            
            try {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name
                        }
                    }
                });
                
                if (error) throw error;
                
                if (data.user && data.user.identities && data.user.identities.length === 0) {
                    showError('This email is already registered. Please log in.');
                } else if (data.session) {
                    // Email confirmation disabled — session created immediately
                    showSuccess('Account created! Entering your dashboard...');
                    setTimeout(() => {
                        window.location.href = '/dashboard.html';
                    }, 1500);
                } else {
                    // Email confirmation enabled — user must verify before logging in
                    showSuccess('Account created! Check your email and click the confirmation link to activate your account.');
                    signupForm.reset();
                }
            } catch (error) {
                showError('Error creating account: ' + error.message);
            } finally {
                setLoading(btn, false, 'Create Account');
            }
        });
    }

    // Helper Functions
    async function checkSession() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            window.location.href = '/dashboard.html';
        }
    }

    function showError(msg) {
        if (!authError) return;
        authError.textContent = msg;
        authError.style.display = 'block';
    }

    function showSuccess(msg) {
        if (!authSuccess) return;
        authSuccess.textContent = msg;
        authSuccess.style.display = 'block';
    }

    function clearMessages() {
        if (authError) authError.style.display = 'none';
        if (authSuccess) authSuccess.style.display = 'none';
    }

    function setLoading(button, isLoading, text) {
        if (!button) return;
        button.disabled = isLoading;
        button.textContent = text;
        if (isLoading) {
            button.classList.add('loading');
        } else {
            button.classList.remove('loading');
        }
    }
});
