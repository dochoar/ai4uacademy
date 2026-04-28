import { supabase } from './supabase-config.js';

const EXAM_QUESTIONS = [
    // Módulo 1
    { q: "¿Cuál es la definición más precisa de Inteligencia Artificial?", options: { a: "Un robot que piensa como humano", b: "Sistemas que simulan capacidades cognitivas humanas", c: "Un programa siempre correcto", d: "Tecnología exclusiva de programadores" }, correct: "b" },
    { q: "¿Cuál es la diferencia principal entre IA, Machine Learning y Deep Learning?", options: { a: "Son lo mismo", b: "Deep Learning contiene a Machine Learning", c: "IA es el campo general, ML aprende de datos, DL usa redes neuronales", d: "ML es más avanzado que DL" }, correct: "c" },
    { q: "¿Qué tipo de IA utilizamos actualmente en la vida cotidiana?", options: { a: "IA General (AGI)", b: "Superinteligencia", c: "IA Estrecha o Narrow AI", d: "IA consciente" }, correct: "c" },
    { q: "¿Cuál de estas es una herramienta de IA generativa accesible sin conocimientos técnicos?", options: { a: "TensorFlow", b: "ChatGPT", c: "Kubernetes", d: "SQL Server" }, correct: "b" },
    // Módulo 2
    { q: "¿Qué es un 'prompt' en el contexto de la IA?", options: { a: "El modelo de IA", b: "La instrucción o pregunta para obtener una respuesta", c: "El resultado generado", d: "El código fuente" }, correct: "b" },
    { q: "¿Cuál de estos es un ejemplo de prompt bien estructurado?", options: { a: "'Dime algo sobre marketing'", b: "'Haz algo bueno'", c: "'Actúa como experto... Crea 5 ideas para Instagram...'", d: "'Marketing'" }, correct: "c" },
    { q: "¿Qué técnica de prompting consiste en darle a la IA un rol específico?", options: { a: "Chain of Thought", b: "Role Playing", c: "Few-shot", d: "Zero-shot" }, correct: "b" },
    { q: "¿Cuál es la principal ventaja del 'Few-Shot Prompting'?", options: { a: "No escribes nada", b: "Das ejemplos concretos para entender el patrón", c: "Hace la IA más rápida", d: "Solo inglés" }, correct: "b" },
    // Módulo 3
    { q: "¿En cuál de estos sectores la IA ya tiene aplicaciones reales?", options: { a: "Solo en tecnología", b: "En salud, educación, finanzas, marketing, legal, etc.", c: "Solo videojuegos", d: "Solo países desarrollados" }, correct: "b" },
    { q: "¿Cómo puede un pequeño negocio usar IA sin conocimientos técnicos?", options: { a: "Contratar programadores", b: "Usar ChatGPT para atención, contenido y datos", c: "No es posible", d: "Comprar robots" }, correct: "b" },
    { q: "¿Cuál es un ejemplo real de IA en el sector salud?", options: { a: "Robots autónomos", b: "Detección de patrones en radiografías", c: "Reemplazo de doctores", d: "Fabricación de medicinas sola" }, correct: "b" },
    { q: "¿Qué herramienta ayuda en la creación de contenido visual?", options: { a: "Excel", b: "DALL-E, Midjourney o Canva con IA", c: "PowerPoint", d: "Calculadora" }, correct: "b" },
    // Módulo 4
    { q: "¿Cuáles son los tres pilares de la IA para productividad?", options: { a: "Comprar, vender, distribuir", b: "Automatizar, acelerar y amplificar", c: "Programar, diseñar, contabilizar", d: "Leer, escribir, calcular" }, correct: "b" },
    { q: "¿Cómo ayuda la IA a escribir un correo profesional rápido?", options: { a: "No puede", b: "Generando un borrador con tono y objetivo para revisar", c: "Copiando de internet", d: "Enviando sin revisar" }, correct: "b" },
    { q: "¿Cuál es la mejor práctica al usar IA para contenido profesional?", options: { a: "Publicar directo", b: "IA como punto de partida, luego revisar y editar", c: "Nunca usar IA", d: "Prompts de una palabra" }, correct: "b" },
    { q: "Si la IA ahorra 2 horas diarias, ¿cuántas horas al mes liberas?", options: { a: "10", b: "20", c: "40", d: "60" }, correct: "c" },
    // Módulo 5
    { q: "¿Qué son las 'alucinaciones' de la IA?", options: { a: "Descompostura física", b: "Información falsa inventada presentada con confianza", c: "No responder nada", d: "Hablar otro idioma" }, correct: "b" },
    { q: "¿Cuál de estas es una práctica ética?", options: { a: "Presentar IA como propio", b: "Transparencia y verificación de resultados", c: "Confianza ciega", d: "Usar datos privados ajenos" }, correct: "b" },
    { q: "¿Por qué es importante verificar siempre la información?", options: { a: "IA siempre miente", b: "Puede ser desactualizada, sesgada o incorrecta", c: "No es necesario", d: "Solo si está en inglés" }, correct: "b" },
    // Módulo 6
    { q: "Al integrar la IA en tu flujo diario, ¿cuál es el enfoque recomendable?", options: { a: "Reemplazar todo", b: "Identificar tareas, probar, evaluar y escalar", c: "Esperar perfección", d: "Usar una sola herramienta" }, correct: "b" }
];

document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    let currentUserFullName = 'Estudiante Especial';
    let attemptsCount = 0;
    const MAX_ATTEMPTS = 2;
    const PASSING_SCORE = 70;

    const authLoader = document.getElementById('auth-loader');
    const examArea = document.getElementById('exam-area');
    const certArea = document.getElementById('certificate-area');
    const quizForm = document.getElementById('quiz-form');
    const quizMsg = document.getElementById('quiz-msg');
    const attemptsInfo = document.getElementById('attempts-info');
    const questionsContainer = document.getElementById('questions-container');

    // Certificate components
    const certName = document.getElementById('cert-name');
    const certDate = document.getElementById('cert-date');

    initExam();

    async function initExam() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) throw new Error('Not logged in');
            currentUser = session.user;

            if (currentUser.user_metadata) {
                currentUserFullName = currentUser.user_metadata.full_name || currentUser.user_metadata.name || 'Estudiante';
            }

            // Check if already passed
            const { data: certObj } = await supabase
                .from('course_certificates')
                .select('*')
                .eq('user_id', currentUser.id)
                .eq('course_id', 'intro-ia')
                .maybeSingle();

            if (certObj && certObj.score >= PASSING_SCORE) {
                renderDiploma(certObj);
            } else {
                // Fetch attempts
                const { data: attempts } = await supabase
                    .from('course_exam_attempts')
                    .select('id')
                    .eq('user_id', currentUser.id)
                    .eq('course_id', 'intro-ia');
                
                attemptsCount = (attempts || []).length;
                updateAttemptsUI();

                if (attemptsCount >= MAX_ATTEMPTS) {
                    lockExam('Has agotado tus intentos permitidos (2/2). Contacta a soporte si necesitas ayuda.');
                } else {
                    renderQuestions();
                    examArea.style.display = 'block';
                }
            }

            setTimeout(() => authLoader.classList.add('hidden'), 500);

        } catch (err) {
            console.error('Auth error:', err);
            window.location.href = 'acceso.html';
        }
    }

    function updateAttemptsUI() {
        attemptsInfo.innerHTML = `Intentos realizados: <strong>${attemptsCount}/${MAX_ATTEMPTS}</strong>`;
    }

    function lockExam(message) {
        examArea.style.display = 'block';
        questionsContainer.innerHTML = `<p style="color: #ef4444; font-size: 1.2rem; text-align: center; margin: 40px 0;">${message}</p>`;
        document.getElementById('btn-submit-exam').style.display = 'none';
        document.getElementById('exam-intro-text').style.display = 'none';
    }

    function renderQuestions() {
        questionsContainer.innerHTML = '';
        EXAM_QUESTIONS.forEach((qObj, index) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'question-block';
            qDiv.innerHTML = `
                <p class="question-text">${index + 1}. ${qObj.q}</p>
                ${Object.entries(qObj.options).map(([key, text]) => `
                    <label class="q-option">
                        <input type="radio" name="q${index}" value="${key}" required> 
                        <strong>${key.toUpperCase()})</strong> ${text}
                    </label>
                `).join('')}
            `;
            questionsContainer.appendChild(qDiv);
        });
    }

    quizForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn-submit-exam');
        btn.disabled = true;
        btn.innerHTML = 'Procesando...';

        const fd = new FormData(quizForm);
        let correctCount = 0;
        EXAM_QUESTIONS.forEach((qObj, index) => {
            if (fd.get(`q${index}`) === qObj.correct) correctCount++;
        });

        const scorePercent = Math.round((correctCount / EXAM_QUESTIONS.length) * 100);
        
        // 1. Record the attempt
        const { error: attemptError } = await supabase.from('course_exam_attempts').insert({
            user_id: currentUser.id,
            course_id: 'intro-ia',
            score: scorePercent
        });

        if (attemptError) {
            quizMsg.textContent = "Error guardando el intento. Verifica tu conexión.";
            btn.disabled = false;
            btn.innerHTML = 'Entregar Examen';
            return;
        }

        attemptsCount++;
        updateAttemptsUI();

        if (scorePercent >= PASSING_SCORE) {
            quizMsg.style.color = '#10b981';
            quizMsg.textContent = `¡Felicidades! Aprobaste con ${scorePercent}%. Generando certificado...`;
            
            const payload = {
                user_id: currentUser.id,
                course_id: 'intro-ia',
                score: scorePercent,
                user_name: currentUserFullName
            };
            
            const { data: cert, error: certError } = await supabase.from('course_certificates').insert(payload).select().single();
            if (certError) {
                quizMsg.textContent = "Error al generar certificado. Contacta a soporte.";
            } else {
                renderDiploma(cert);
            }
        } else {
            quizMsg.style.color = '#ef4444';
            if (attemptsCount >= MAX_ATTEMPTS) {
                lockExam(`Obtuviste un ${scorePercent}%. Has alcanzado el límite de intentos (2/2).`);
            } else {
                quizMsg.textContent = `Obtuviste un ${scorePercent}%. Necesitas al menos ${PASSING_SCORE}% para pasar. Te queda 1 intento.`;
                btn.disabled = false;
                btn.innerHTML = 'Reintentar Examen';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });

    function renderDiploma(record) {
        examArea.style.display = 'none';
        certArea.style.display = 'flex';
        certName.textContent = currentUserFullName;
        
        const d = record && record.issued_at ? new Date(record.issued_at) : new Date();
        const langOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        certDate.textContent = `Otorgado el ${d.toLocaleDateString('es-MX', langOptions)}`;

        const certDownloadLink = document.getElementById('cert-download-link');
        if (certDownloadLink && record && record.id) {
            certDownloadLink.href = `certificado.html?id=${record.id}`;
            certDownloadLink.style.display = 'block';
        }

        setupShareButtons(record ? record.id : '');
    }

    function setupShareButtons(certId) {
        const shareText = "🚀 ¡Me acabo de certificar en 'Introducción a la Inteligencia Artificial' por AI4U Academy! Una experiencia increíble para potenciar mi carrera.";
        const shareUrl = window.location.origin;
        const certLink = certId ? `${window.location.origin}/certificado.html?id=${certId}` : shareUrl;

        document.getElementById('share-facebook').onclick = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(certLink)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        document.getElementById('share-whatsapp').onclick = () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " Ver mi certificado aquí: " + certLink)}`, '_blank');
        document.getElementById('share-twitter').onclick = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(certLink)}`, '_blank');
        document.getElementById('share-linkedin').onclick = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certLink)}`, '_blank');
    }
});
