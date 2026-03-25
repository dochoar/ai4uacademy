import { supabase } from './supabase-config.js';

const COURSE_META = {
    id: 'intro-ia',
    title: 'Introducción a la IA',
    modules: [
        { 
            id: 1, 
            title: 'Fundamentos', 
            duration: '45 min', 
            desc: 'Aprende los conceptos básicos de la inteligencia artificial, su historia reciente, y cómo los modelos de lenguaje transforman la manera en que trabajamos hoy.',
            quiz: [
                {
                    q: "¿Qué significa la sigla 'IA' en el contexto tecnológico?",
                    options: { a: "Información Automática", b: "Inteligencia Artificial", c: "Interfaz Avanzada", d: "Integración Algorítmica" },
                    correct: "b",
                    feedback: "IA significa Inteligencia Artificial, el campo de la informática que busca crear sistemas capaces de simular capacidades cognitivas humanas."
                },
                {
                    q: "¿Cuál es la relación correcta entre IA, Machine Learning y Deep Learning?",
                    options: { 
                        a: "Son tres tecnologías independientes sin relación", 
                        b: "IA es el campo más amplio; Machine Learning es un subconjunto de IA; Deep Learning es un subconjunto de Machine Learning",
                        c: "Deep Learning es el campo más amplio que contiene a los demás",
                        d: "Machine Learning y Deep Learning son lo mismo"
                    },
                    correct: "b",
                    feedback: "Funcionan como muñecas rusas: IA es el concepto general, ML es una forma de lograr IA aprendiendo de datos, y DL es una técnica específica de ML."
                },
                {
                    q: "¿Qué tipo de IA existe actualmente en el mundo real?",
                    options: { 
                        a: "IA General (AGI) que puede hacer cualquier tarea humana",
                        b: "Superinteligencia que supera al humano en todo",
                        c: "IA Estrecha (Narrow AI), especializada en tareas concretas",
                        d: "IA con consciencia y emociones propias"
                    },
                    correct: "c",
                    feedback: "Toda la IA que usamos hoy es 'Narrow AI' o IA estrecha: puede hacer muy bien UNA tarea, pero no puede transferir ese conocimiento a otras áreas."
                },
                {
                    q: "¿Cuál de estos es un ejemplo de IA que usamos en la vida cotidiana sin darnos cuenta?",
                    options: {
                        a: "Una calculadora básica",
                        b: "Las recomendaciones de Netflix o Spotify basadas en tus gustos",
                        c: "Un semáforo con temporizador fijo",
                        d: "Una hoja de cálculo de Excel"
                    },
                    correct: "b",
                    feedback: "Los sistemas de recomendación usan algoritmos de Machine Learning que analizan tu comportamiento para sugerirte contenido personalizado."
                },
                {
                    q: "¿Qué es la IA generativa?",
                    options: {
                        a: "IA que solo puede clasificar datos existentes",
                        b: "IA que genera contenido nuevo (texto, imágenes, código, audio) a partir de instrucciones",
                        c: "IA que genera electricidad de forma autónoma",
                        d: "IA que solo funciona con generadores eléctricos"
                    },
                    correct: "b",
                    feedback: "La IA generativa crea contenido original basándose en patrones aprendidos de grandes cantidades de datos."
                }
            ]
        },
        { 
            id: 2, 
            title: 'Cómo hablar con la IA', 
            duration: '1h 30 min', 
            desc: 'Descubre las mejores prácticas de "Prompt Engineering". Aprende a redactar instrucciones precisas para obtener resultados de altísima calidad.',
            quiz: [
                {
                    q: "¿Qué es un 'prompt' y por qué es importante?",
                    options: { 
                        a: "Es el nombre del modelo de IA; no tiene importancia práctica", 
                        b: "Es la instrucción que le das a la IA; su calidad determina directamente la calidad de la respuesta",
                        c: "Es el resultado que genera la IA; no lo controla el usuario",
                        d: "Es la contraseña para acceder a ChatGPT"
                    },
                    correct: "b",
                    feedback: "El prompt es tu instrucción a la IA. La regla de oro es: 'basura entra, basura sale'. Un prompt específico da mejores respuestas."
                },
                {
                    q: "¿Cuáles son los elementos clave de un prompt efectivo?",
                    options: { 
                        a: "Solo necesitas escribir una palabra y la IA entiende todo", 
                        b: "Rol + tarea específica + contexto + formato deseado + audiencia",
                        c: "Escribir en inglés siempre, sin importar el idioma deseado",
                        d: "Usar emojis y mayúsculas para que la IA preste más atención"
                    },
                    correct: "b",
                    feedback: "Un prompt efectivo incluye: quién quieres que sea la IA (rol), qué necesitas (tarea), contexto, formato y audiencia."
                },
                {
                    q: "¿Qué técnica consiste en pedirle a la IA que razone paso a paso antes de dar una respuesta final?",
                    options: { 
                        a: "Role Playing",
                        b: "Few-Shot Prompting",
                        c: "Chain of Thought (cadena de pensamiento)",
                        d: "Zero-Shot Prompting"
                    },
                    correct: "c",
                    feedback: "Chain of Thought le pide a la IA que muestre su razonamiento paso a paso, mejorando la precisión en tareas complejas."
                },
                {
                    q: "¿Qué es el 'Few-Shot Prompting'?",
                    options: {
                        a: "Darle a la IA solo unas pocas palabras como instrucción",
                        b: "Incluir ejemplos concretos del formato o tipo de respuesta que esperas",
                        c: "Pedirle a la IA que responda en pocas palabras",
                        d: "Usar la IA solo unas pocas veces al día"
                    },
                    correct: "b",
                    feedback: "Few-Shot significa darle 'pocos ejemplos' a la IA para que entienda el patrón, tono y formato que deseas."
                },
                {
                    q: "¿Cuál es la diferencia entre un mal prompt y un buen prompt?",
                    options: {
                        a: "No hay diferencia, la IA siempre responde igual",
                        b: "El mal prompt es corto y el buen prompt es largo",
                        c: "El buen prompt es específico, da contexto, define el formato y la audiencia; el mal prompt es vago y genérico",
                        d: "El buen prompt usa solo palabras técnicas y jerga de programación"
                    },
                    correct: "c",
                    feedback: "La diferencia fundamental es la especificidad y el contexto. Un prompt vago produce resultados vagos; uno detallado produce resultados útiles."
                }
            ]
        },
        { 
            id: 3, 
            title: 'Aplicaciones reales', 
            duration: '1h 30 min', 
            desc: 'Casos prácticos de uso en empresas, desde redacción de correos corporativos hasta análisis de tendencias de mercado sin saber programar.',
            quiz: [
                {
                    q: "¿En cuántos sectores profesionales tiene aplicaciones reales la IA actualmente?",
                    options: { 
                        a: "Solo en tecnología e informática", 
                        b: "En 3 o 4 sectores principales como banca y medicina",
                        c: "En prácticamente todos los sectores: salud, finanzas, marketing, legal, etc.",
                        d: "Solo en empresas de Silicon Valley"
                    },
                    correct: "c",
                    feedback: "La IA ya tiene presencia en casi todos los sectores productivos, desde diagnóstico médico hasta agricultura de precisión y análisis legal."
                },
                {
                    q: "¿Cómo se usa la IA en el sector salud actualmente?",
                    options: { 
                        a: "Robots que operan sin supervisión humana", 
                        b: "Asistencia en diagnóstico por imágenes, análisis de datos y descubrimiento de medicinas con supervisión médica",
                        c: "Reemplaza completamente a los doctores en consultas",
                        d: "Solo se usa para llevar la contabilidad de hospitales"
                    },
                    correct: "b",
                    feedback: "La IA asiste analizando radiografías y detectando patrones clínicos, siempre como herramienta de apoyo bajo supervisión médica."
                },
                {
                    q: "¿Qué herramientas de IA puede usar un pequeño negocio hoy sin necesidad de programar?",
                    options: { 
                        a: "Ninguna, la IA requiere equipos de programadores",
                        b: "ChatGPT para atención, Canva para diseño, chatbots automáticos, etc.",
                        c: "Solo puede usar Excel avanzado",
                        d: "Necesita invertir mínimo $100,000 en infraestructura"
                    },
                    correct: "b",
                    feedback: "Existen decenas de herramientas accesibles como ChatGPT, Canva, Tidio o Notion AI que no requieren conocimiento técnico."
                },
                {
                    q: "¿Cuál es un ejemplo real de IA en el marketing digital?",
                    options: {
                        a: "Imprimir volantes en una imprenta",
                        b: "Personalización de anuncios, generación de copy y segmentación automática",
                        c: "Enviar correos masivos sin ninguna segmentación",
                        d: "Poner carteles publicitarios en la calle"
                    },
                    correct: "b",
                    feedback: "La IA en marketing permite anuncios personalizados, generación de textos publicitarios y segmentación inteligente de audiencias."
                },
                {
                    q: "¿Cómo puede la IA ayudar en el sector educativo?",
                    options: {
                        a: "Reemplazando completamente a los profesores",
                        b: "Tutores virtuales personalizados, material didáctico y retroalimentación inmediata",
                        c: "Solo sirviendo como calculadora para los estudiantes",
                        d: "Eliminando la necesidad de estudiar"
                    },
                    correct: "b",
                    feedback: "La IA en educación personaliza el aprendizaje con tutores que se adaptan al ritmo del estudiante y retroalimentación inmediata."
                }
            ]
        },
        { 
            id: 4, 
            title: 'IA para productividad', 
            duration: '1h', 
            desc: 'Automatiza tareas repetitivas. Usa herramientas modernas para transcribir juntas, resumir documentos y crear presentaciones en segundos.',
            quiz: [
                {
                    q: "¿Cuáles son los tres pilares de la IA aplicada a la productividad personal?",
                    options: { 
                        a: "Comprar, vender y distribuir", 
                        b: "Automatizar, acelerar y amplificar",
                        c: "Copiar, pedir y enviar",
                        d: "Programar, compilar y ejecutar"
                    },
                    correct: "b",
                    feedback: "Los tres pilares son: AUTOMATIZAR tareas repetitivas, ACELERAR procesos creativos y AMPLIFICAR tus capacidades actuales."
                },
                {
                    q: "Si usas IA para automatizar 2 horas de tareas repetitivas al día, ¿cuánto tiempo liberas al mes?",
                    options: { 
                        a: "8 horas", 
                        b: "20 horas",
                        c: "40 horas (equivalente a una semana de trabajo)",
                        d: "100 horas"
                    },
                    correct: "c",
                    feedback: "2 horas al día × 20 días = 40 horas al mes. Es una semana completa redirigida a tareas de mayor valor."
                },
                {
                    q: "¿Cuál es la mejor práctica al usar IA para crear contenido profesional?",
                    options: { 
                        a: "Copiar y publicar directamente",
                        b: "Usar la IA como punto de partida, luego revisar y agregar tu perspectiva",
                        c: "Nunca usar IA porque todo es inventado",
                        d: "Pedirle a la IA que lo haga todo sin darle instrucciones"
                    },
                    correct: "b",
                    feedback: "La IA es tu copiloto. Genera borradores rápidos que TÚ revisas, editas y enriqueces con tu experiencia y contexto personal."
                },
                {
                    q: "¿Para cuál de estas tareas la IA puede ahorrarte más tiempo en tu día a día?",
                    options: {
                        a: "Caminar al trabajo",
                        b: "Redactar correos, resumir documentos largos y crear presentaciones",
                        c: "Hacer ejercicio físico",
                        d: "Cocinar la cena"
                    },
                    correct: "b",
                    feedback: "La IA destaca en tareas de procesamiento de texto: redactar emails, resumir documentos extensos y generar borradores de reportes."
                },
                {
                    q: "¿Qué significa que la IA 'amplifica' tus capacidades?",
                    options: {
                        a: "Que la IA hace todo por ti sin necesidad de intervención",
                        b: "Que te permite hacer cosas que antes no podías, como analizar muchos datos o crear contenido en otros idiomas",
                        c: "Que la IA habla más fuerte por el micrófono",
                        d: "Que duplica tu sueldo automáticamente"
                    },
                    correct: "b",
                    feedback: "Amplificar significa expandir tus límites: analizar miles de reseñas, traducir a 10 idiomas o crear diseños profesionales sin ser diseñador."
                }
            ]
        },
        { 
            id: 5, 
            title: 'Riesgos, ética y límites', 
            duration: '45 min', 
            desc: 'Entiende las alucinaciones de la IA, los sesgos de información y las precauciones necesarias al manejar datos privados de tu empresa.',
            quiz: [
                {
                    q: "¿Qué son las 'alucinaciones' de la IA?",
                    options: { 
                        a: "Errores de hardware en los servidores", 
                        b: "Cuando la IA genera información falsa pero la presenta como verdadera con total confianza",
                        c: "Cuando la IA no entiende el idioma",
                        d: "Cuando la IA muestra imágenes distorsionadas"
                    },
                    correct: "b",
                    feedback: "La IA puede inventar datos, citas o estadísticas de forma muy convincente. Por eso SIEMPRE se debe verificar la información crítica."
                },
                {
                    q: "¿Qué es el 'sesgo' (bias) en la IA y por qué es peligroso?",
                    options: { 
                        a: "Es cuando la IA tiene opiniones políticas propias", 
                        b: "Es cuando la IA reproduce prejuicios de sus datos de entrenamiento, pudiendo discriminar",
                        c: "Es cuando la IA solo funciona en un idioma",
                        d: "Es cuando la IA es demasiado lenta"
                    },
                    correct: "b",
                    feedback: "La IA aprende de datos históricos que pueden contener sesgos. Si no se controla, puede amplificar prejuicios en decisiones críticas."
                },
                {
                    q: "¿Cuál es la práctica ética más importante al usar IA en el trabajo?",
                    options: { 
                        a: "Presentar todo el contenido de IA como si fuera tuyo",
                        b: "Ser transparente, verificar la información y proteger datos personales",
                        c: "Usar IA para espiar a los compañeros",
                        d: "Compartir datos privados de clientes sin consentimiento"
                    },
                    correct: "b",
                    feedback: "La ética en IA se basa en: TRANSPARENCIA (decir cuándo usas IA), VERIFICACIÓN y PRIVACIDAD (no subir datos sensibles)."
                },
                {
                    q: "¿Por qué NO debes confiar ciegamente en la información que genera la IA?",
                    options: {
                        a: "Porque la IA siempre miente a propósito",
                        b: "Porque puede tener datos desactualizados, sesgos o 'alucinar', y el humano es responsable",
                        c: "Porque la IA es una conspiración",
                        d: "No hay razón, se puede confiar al 100%"
                    },
                    correct: "b",
                    feedback: "La IA trabaja con probabilidades estadísticas, no con la 'verdad'. Puede fallar por datos viejos o errores del modelo. TÚ eres el responsable final."
                },
                {
                    q: "¿Cuál de estos es un caso real donde el mal uso de IA causó problemas?",
                    options: {
                        a: "Un abogado presentó ante un juez casos legales inventados por ChatGPT sin verificarlos",
                        b: "Un robot de IA destruyó una fábrica",
                        c: "La IA tomó el control del gobierno",
                        d: "ChatGPT se negó a funcionar por un año"
                    },
                    correct: "a",
                    feedback: "Un abogado en 2023 citó casos judiciales inexistentes inventados por ChatGPT y fue sancionado. Esto demuestra por qué SIEMPRE se debe verificar."
                }
            ]
        },
        { 
            id: 6, 
            title: 'Taller práctico final', 
            duration: 'Taller', 
            desc: 'Aplica todo lo aprendido. Construiremos juntos una solución basada en IA para resolver un problema cotidiano. Evaluaremos tus prompts en tiempo real.',
            quiz: [
                {
                    q: "¿Cuál es el primer paso recomendado para integrar la IA en tu flujo de trabajo?",
                    options: { 
                        a: "Reemplazar inmediatamente todos tus procesos con IA", 
                        b: "Identificar tareas repetitivas de poco valor y probar herramientas específicas",
                        c: "Esperar 10 años hasta que la IA sea perfecta",
                        d: "Comprar el software de IA más caro del mercado"
                    },
                    correct: "b",
                    feedback: "La adopción exitosa es gradual: identifica dónde pierdes tiempo en tareas repetitivas, prueba herramientas específicas y escala lo que funcione."
                },
                {
                    q: "Cuando creas un prompt para resolver un problema real, ¿qué debes incluir siempre?",
                    options: { 
                        a: "Solo la pregunta, sin contexto ni detalles", 
                        b: "Contexto, resultado específico, formato deseado y audiencia",
                        c: "Tu nombre completo y dirección",
                        d: "El código fuente del modelo de IA"
                    },
                    correct: "b",
                    feedback: "Un prompt efectivo siempre contextualiza: quién eres, qué necesitas, formato, audiencia y restricciones. Más contexto = mejor resultado."
                },
                {
                    q: "¿Cuál es la forma correcta de evaluar si una herramienta de IA es útil?",
                    options: { 
                        a: "Si es gratis, es buena; si es de pago, es mala",
                        b: "Probarla con tareas reales, medir tiempo ahorrado, calidad y comparar con tu método actual",
                        c: "Leer solo los anuncios publicitarios",
                        d: "Preguntarle a la propia IA si es buena"
                    },
                    correct: "b",
                    feedback: "La evaluación práctica es clave: prueba con TUS tareas reales, mide el tiempo que ahorra y verifica si la calidad es aceptable."
                },
                {
                    q: "Después de este curso, ¿cuál debería ser tu mentalidad respecto a la IA?",
                    options: {
                        a: "La IA me va a quitar el trabajo, mejor ignorarla",
                        b: "Es una herramienta poderosa que potencia mis capacidades; debo usarla de forma ética y estratégica",
                        c: "La IA es perfecta y puede reemplazar todo el trabajo humano",
                        d: "Es solo una moda pasajera"
                    },
                    correct: "b",
                    feedback: "La IA no reemplaza personas, potencia personas. Los profesionales que aprendan a usarla de forma ética tendrán una ventaja competitiva enorme."
                },
                {
                    q: "¿Qué plan de acción deberías seguir después de completar este curso?",
                    options: {
                        a: "Olvidar todo y volver a mis métodos anteriores",
                        b: "Elegir 3 tareas reales, aplicar lo aprendido esta semana, medir resultados y expandir",
                        c: "Intentar automatizar todo de golpe",
                        d: "Esperar a que alguien me diga qué hacer"
                    },
                    correct: "b",
                    feedback: "El plan ideal es concreto e inmediato: elige 3 tareas, aplica técnicas de prompting, mide ganancias de tiempo/calidad y luego expande."
                }
            ]
        },
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
    const btnPrevMod = document.getElementById('btn-prev-mod');
    const btnNextMod = document.getElementById('btn-next-mod');

    // Quiz Elements
    const quizOverlay = document.getElementById('quiz-overlay');
    const quizStepText = document.getElementById('quiz-step');
    const quizQuestionText = document.getElementById('quiz-q-text');
    const quizOptionsContainer = document.getElementById('quiz-options');
    const quizFeedbackContainer = document.getElementById('quiz-feedback');
    const quizFeedbackText = document.getElementById('feedback-text');
    const btnNextQuestion = document.getElementById('btn-next-q');

    let currentQuiz = null;
    let currentQuestionIndex = 0;

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

            // Antigravity Entrance Animation
            gsap.from(".course-header", { y: -50, opacity: 0, duration: 1, ease: "power4.out" });
            gsap.from(".video-hero", { y: 30, opacity: 0, duration: 1.2, delay: 0.2, ease: "power3.out" });
            gsap.from(".module-details", { x: -30, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
            gsap.from(".course-sidebar-wrapper", { x: 30, opacity: 0, duration: 1, delay: 0.6, ease: "power3.out" });

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

        // Staggered entrance for sidebar items
        gsap.from(".module-item", {
            x: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out"
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

        // Update nav buttons visibility
        if (btnPrevMod) btnPrevMod.style.visibility = (modId > 1) ? 'visible' : 'hidden';
        if (btnNextMod) {
            const highestCompleted = completedModules.length > 0 ? Math.max(...completedModules) : 0;
            const highestUnlocked = highestCompleted + 1;
            btnNextMod.style.visibility = (modId < COURSE_META.modules.length && modId < highestUnlocked) ? 'visible' : 'hidden';
        }

        // Load comments for module
        loadComments(modId);
    }

    if (btnPrevMod) {
        btnPrevMod.addEventListener('click', () => {
            if (currentModuleId > 1) {
                currentModuleId--;
                renderSidebar();
                renderMainView(currentModuleId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    if (btnNextMod) {
        btnNextMod.addEventListener('click', () => {
            const highestCompleted = completedModules.length > 0 ? Math.max(...completedModules) : 0;
            const highestUnlocked = highestCompleted + 1;
            if (currentModuleId < COURSE_META.modules.length && currentModuleId < highestUnlocked) {
                currentModuleId++;
                renderSidebar();
                renderMainView(currentModuleId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
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

        // Check if module has a quiz and is not yet completed
        const mod = COURSE_META.modules.find(m => m.id === currentModuleId);
        if (mod && mod.quiz && !completedModules.includes(currentModuleId)) {
            startQuiz(mod.quiz);
            return;
        }

        await finalizeModuleCompletion(btn);
    });

    async function finalizeModuleCompletion(btn) {
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
    }

    // --- Quiz Engine Logic ---

    function startQuiz(quiz) {
        currentQuiz = quiz;
        currentQuestionIndex = 0;
        quizOverlay.style.display = 'flex';
        loadQuestion();
    }

    function loadQuestion() {
        const question = currentQuiz[currentQuestionIndex];
        quizStepText.textContent = `Paso ${currentQuestionIndex + 1} de ${currentQuiz.length}`;
        quizQuestionText.textContent = question.q;
        quizOptionsContainer.innerHTML = '';
        quizFeedbackContainer.style.display = 'none';

        Object.entries(question.options).forEach(([key, text]) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt-btn';
            btn.innerHTML = `<strong>${key.toUpperCase()})</strong> ${text}`;
            btn.onclick = () => checkAnswer(key, btn);
            quizOptionsContainer.appendChild(btn);
        });
    }

    function checkAnswer(selectedKey, selectedBtn) {
        const question = currentQuiz[currentQuestionIndex];
        const allBtns = quizOptionsContainer.querySelectorAll('.quiz-opt-btn');
        allBtns.forEach(b => b.disabled = true);

        if (selectedKey === question.correct) {
            selectedBtn.classList.add('correct');
        } else {
            selectedBtn.classList.add('wrong');
            // Highlight correct one
            const correctBtn = Array.from(allBtns).find(b => b.innerText.startsWith(question.correct.toUpperCase()));
            if (correctBtn) correctBtn.classList.add('correct');
        }

        quizFeedbackText.textContent = question.feedback;
        quizFeedbackContainer.style.display = 'block';

        if (currentQuestionIndex === currentQuiz.length - 1) {
            btnNextQuestion.textContent = 'Finalizar Ejercicio y Continuar';
        } else {
            btnNextQuestion.textContent = 'Siguiente Paso';
        }
    }

    btnNextQuestion.onclick = () => {
        if (currentQuestionIndex < currentQuiz.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            quizOverlay.style.display = 'none';
            finalizeModuleCompletion(document.getElementById('btn-complete'));
        }
    };

    // Dummy video click
    videoContainer.addEventListener('click', () => {
        const placeholder = document.getElementById('video-placeholder');
        placeholder.innerHTML = `<h2 style="color: #00A389">▶ Reproduciendo video...</h2><p>Simulador de carga rápido activo.</p>`;
    });

});
