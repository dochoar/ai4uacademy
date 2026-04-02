# AI 4U Academy - Agent Guidelines

This document provides guidelines and instructions for AI coding agents working in this repository.

## Project Overview

AI 4U Academy is an educational platform landing page built with vanilla JavaScript, Vite, and Supabase for authentication and data storage.

**Tech Stack:**
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Build Tool:** Vite 5.x
- **Backend/Auth:** Supabase (@supabase/supabase-js 2.x)
- **Hosting:** Vercel

**Directory Structure:**
```
ai4uacademy/
├── aischool/              # Main application
│   ├── js/                # JavaScript source files
│   ├── css/               # Stylesheets
│   ├── public/            # Static assets
│   ├── dist/              # Built files (generated)
│   ├── index.html         # Main landing page
│   ├── dashboard.html     # User dashboard
│   ├── admin.html         # Admin panel
│   ├── course.html        # Course viewer
│   ├── examen.html        # Exam module
│   ├── acceso.html        # Auth page
│   ├── certificado.html   # Certificate page
│   ├── terminos.html      # Terms page
│   └── vite.config.js     # Vite configuration
├── package.json           # Root workspace config
└── vercel.json            # Vercel deployment config
```

---

## Build Commands

### Root Workspace
```bash
# Install all dependencies
npm install

# Build entire project
npm run build

# Development (runs aischool dev)
npm run dev
```

### Aischool (Main App)
```bash
cd aischool

# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

### Vercel Deployment
The `vercel.json` at root handles deployment configuration. Build output comes from `aischool/dist/`.

---

## Code Style Guidelines

### General Principles

1. **ES6+ JavaScript** - Use modern syntax (const/let, arrow functions, template literals, destructuring)
2. **Vanilla JS Only** - No frameworks (React, Vue, etc.) unless explicitly requested
3. **Module Syntax** - Use ES modules (`import`/`export`) for all JS files
4. **No TypeScript** - This project uses plain JavaScript

### JavaScript Conventions

```javascript
// ✓ Use const/let, avoid var
const CONFIG = { /* immutable values */ };
let state = { /* mutable state */ };

// ✓ Arrow functions for callbacks
const handleClick = (event) => { /* ... */ };

// ✓ Template literals for strings
const message = `Hello, ${userName}!`;

// ✓ Destructuring
const { email, password } = formData;
const [first, ...rest] = array;

// ✓ Object shorthand
const createUser = (name, email) => ({ name, email });

// ✗ Avoid var
// ✗ Avoid function declarations for callbacks
```

### File Organization

```javascript
// 1. Imports
import { supabase } from './supabase-config.js';

// 2. Constants/Config
const API_URL = 'https://api.example.com';

// 3. State variables
let currentUser = null;

// 4. Helper functions
function formatDate(date) { /* ... */ }

// 5. Event handlers
function handleSubmit(e) { /* ... */ }

// 6. Initialization
document.addEventListener('DOMContentLoaded', () => { /* ... */ });
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `userName`, `isLoggedIn` |
| Constants | UPPER_SNAKE | `MAX_RETRY_COUNT`, `API_URL` |
| Functions | camelCase, verb prefix | `handleClick`, `fetchUserData` |
| Classes | PascalCase | `UserProfile`, `CourseViewer` |
| DOM elements | camelCase with suffix | `loginForm`, `submitBtn` |
| CSS classes | kebab-case | `.login-form`, `.submit-btn` |
| Files | kebab-case | `auth-handler.js`, `user-profile.js` |

### Event Handling

```javascript
// ✓ Null checks before adding listeners
const form = document.getElementById('login-form');
if (form) {
    form.addEventListener('submit', handleSubmit);
}

// ✓ Use passive listeners for scroll events
window.addEventListener('scroll', handler, { passive: true });

// ✓ Remove listeners when cleaning up (if needed)
const cleanup = () => element.removeEventListener('click', handler);
```

### Async/Await Patterns

```javascript
// ✓ Prefer async/await over .then()
async function fetchCourses() {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*');
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        showErrorMessage('No se pudieron cargar los cursos.');
    }
}

// ✗ Avoid callback hell
```

### Supabase Integration

```javascript
// ✓ Always handle errors from Supabase
const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
});

if (error) {
    showError(error.message);
    return;
}

// ✓ Check for null/undefined data
if (!data?.session) {
    redirectToLogin();
}
```

### Error Handling

```javascript
// ✓ Use try/catch for async operations
try {
    await riskyOperation();
} catch (error) {
    console.error('Operation failed:', error);
    showUserFriendlyError();
}

// ✓ Provide fallback values
const userName = user?.name ?? 'Usuario';

// ✓ Validate before processing
if (!email || !isValidEmail(email)) {
    showError('Por favor ingresa un email válido.');
    return;
}
```

### CSS Guidelines

```css
/* ✓ Use CSS custom properties for theming */
:root {
    --primary-color: #2563eb;
    --font-family: 'Inter', sans-serif;
}

/* ✓ BEM naming for complex components */
.modal__header { }
.modal__content { }
.modal--active { }

/* ✓ Mobile-first responsive */
.container {
    padding: 1rem;
}
@media (min-width: 768px) {
    .container {
        padding: 2rem;
    }
}
```

---

## Accessibility Requirements

1. **ARIA Attributes** - Use proper ARIA labels and roles
2. **Keyboard Navigation** - Ensure all interactive elements are focusable
3. **Alt Text** - All images must have descriptive alt attributes
4. **Form Labels** - All form inputs must have associated labels
5. **Color Contrast** - Maintain WCAG 2.1 AA contrast ratios
6. **Focus States** - Visible focus indicators on all interactive elements

```html
<!-- ✓ Proper button with accessibility -->
<button 
    type="button" 
    aria-expanded="false" 
    aria-controls="menu-content"
    class="menu-toggle">
    Menu
</button>

<!-- ✗ Avoid -->
<button onclick="toggle()">Menu</button>
```

---

## Security Guidelines

1. **Never commit secrets** - API keys go in environment variables
2. **Validate inputs** - Sanitize all user inputs before processing
3. **HTTPS only** - All API calls must use HTTPS
4. **SQL injection** - Use parameterized queries (Supabase handles this)

```javascript
// ✓ Environment variables for secrets
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✗ Never hardcode secrets
// const API_KEY = 'sk_live_xxxxxx';
```

---

## Testing Guidelines

This project currently has **no automated tests**. When adding tests:

1. Use **Vitest** for unit tests
2. Use **Playwright** or **Cypress** for E2E tests

```bash
# Example test setup (if added)
npm install -D vitest
npm run test
```

---

## Git Workflow

1. **Commits** - Use clear, descriptive commit messages
   - `feat: add course progress tracking`
   - `fix: resolve login redirect issue`
   - `docs: update README`

2. **Branches** - Use feature branches
   - `feature/course-module`
   - `fix/auth-redirect`

3. **PRs** - Keep PRs focused and small

---

## Common Patterns in This Project

### Modal Pattern
```javascript
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}
```

### Form Validation Pattern
```javascript
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, 'Este campo es requerido');
            isValid = false;
        }
    });
    
    return isValid;
}
```

### Loading State Pattern
```javascript
function setLoading(button, isLoading, originalText) {
    if (!button) return;
    button.disabled = isLoading;
    button.textContent = isLoading ? 'Cargando...' : originalText;
    button.classList.toggle('loading', isLoading);
}
```

---

## Important Notes for Agents

1. **Spanish Language** - UI text is in Spanish; write messages and comments in Spanish
2. **Supabase Auth** - Uses email/password and Google OAuth
3. **No Build-step for HTML** - HTML pages load compiled JS from `dist/`
4. **Responsive Design** - Must work on mobile and desktop
5. **Vercel Deployment** - Changes to `aischool/` trigger automatic deployments
