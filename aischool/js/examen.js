import { supabase } from './supabase-config.js';

const EXAM_QUESTIONS = [
    // Module 1
    { q: "What is the most accurate definition of Artificial Intelligence?", options: { a: "A robot that thinks like a human", b: "Systems that simulate human cognitive capabilities", c: "A program that is always correct", d: "Technology exclusive to programmers" }, correct: "b" },
    { q: "What is the main difference between AI, Machine Learning, and Deep Learning?", options: { a: "They are the same", b: "Deep Learning contains Machine Learning", c: "AI is the general field, ML learns from data, DL uses neural networks", d: "ML is more advanced than DL" }, correct: "c" },
    { q: "What type of AI do we currently use in daily life?", options: { a: "General AI (AGI)", b: "Superintelligence", c: "Narrow AI", d: "Conscious AI" }, correct: "c" },
    { q: "Which of these is a generative AI tool accessible without technical knowledge?", options: { a: "TensorFlow", b: "ChatGPT", c: "Kubernetes", d: "SQL Server" }, correct: "b" },
    // Module 2
    { q: "What is a 'prompt' in the context of AI?", options: { a: "The AI model", b: "The instruction or question to get an answer", c: "The generated result", d: "The source code" }, correct: "b" },
    { q: "Which of these is an example of a well-structured prompt?", options: { a: "'Tell me something about marketing'", b: "'Do something good'", c: "'Act as an expert... Create 5 ideas for Instagram...'", d: "'Marketing'" }, correct: "c" },
    { q: "Which prompting technique consists of giving the AI a specific role?", options: { a: "Chain of Thought", b: "Role Playing", c: "Few-shot", d: "Zero-shot" }, correct: "b" },
    { q: "What is the main advantage of 'Few-Shot Prompting'?", options: { a: "You don't write anything", b: "You give concrete examples to understand the pattern", c: "It makes the AI faster", d: "Only English" }, correct: "b" },
    // Module 3
    { q: "In which of these sectors does AI already have real applications?", options: { a: "Only in technology", b: "In health, education, finance, marketing, legal, etc.", c: "Only video games", d: "Only developed countries" }, correct: "b" },
    { q: "How can a small business use AI without technical knowledge?", options: { a: "Hire programmers", b: "Use ChatGPT for customer service, content, and data", c: "It is not possible", d: "Buy robots" }, correct: "b" },
    { q: "What is a real example of AI in the health sector?", options: { a: "Autonomous robots", b: "Detection of patterns in X-rays", c: "Replacement of doctors", d: "Making medicines alone" }, correct: "b" },
    { q: "Which tool helps in creating visual content?", options: { a: "Excel", b: "DALL-E, Midjourney, or Canva with AI", c: "PowerPoint", d: "Calculator" }, correct: "b" },
    // Module 4
    { q: "What are the three pillars of AI for productivity?", options: { a: "Buy, sell, distribute", b: "Automate, accelerate, and amplify", c: "Program, design, account", d: "Read, write, calculate" }, correct: "b" },
    { q: "How does AI help write a professional email quickly?", options: { a: "It can't", b: "Generating a draft with tone and objective to review", c: "Copying from the internet", d: "Sending without reviewing" }, correct: "b" },
    { q: "What is the best practice when using AI for professional content?", options: { a: "Publish directly", b: "AI as a starting point, then review and edit", c: "Never use AI", d: "One-word prompts" }, correct: "b" },
    { q: "If AI saves 2 hours a day, how many hours a month do you free up?", options: { a: "10", b: "20", c: "40", d: "60" }, correct: "c" },
    // Module 5
    { q: "What are AI 'hallucinations'?", options: { a: "Physical breakdown", b: "Invented false information presented with confidence", c: "Not answering anything", d: "Speaking another language" }, correct: "b" },
    { q: "Which of these is an ethical practice?", options: { a: "Present AI as your own", b: "Transparency and verification of results", c: "Blind trust", d: "Using other people's private data" }, correct: "b" },
    { q: "Why is it important to always verify information?", options: { a: "AI always lies", b: "It can be outdated, biased, or incorrect", c: "It is not necessary", d: "Only if it is in English" }, correct: "b" },
    // Module 6
    { q: "When integrating AI into your daily flow, what is the recommended approach?", options: { a: "Replace everything", b: "Identify tasks, test, evaluate, and scale", c: "Wait for perfection", d: "Use a single tool" }, correct: "b" }
];

document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    let currentUserFullName = 'Special Student';
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
                currentUserFullName = currentUser.user_metadata.full_name || currentUser.user_metadata.name || 'Student';
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
                    lockExam('You have exhausted your allowed attempts (2/2). Contact support if you need help.');
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
        attemptsInfo.innerHTML = `Attempts made: <strong>${attemptsCount}/${MAX_ATTEMPTS}</strong>`;
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
        btn.innerHTML = 'Processing...';

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
            quizMsg.textContent = "Error saving attempt. Check your connection.";
            btn.disabled = false;
            btn.innerHTML = 'Submit Exam';
            return;
        }

        attemptsCount++;
        updateAttemptsUI();

        if (scorePercent >= PASSING_SCORE) {
            quizMsg.style.color = '#10b981';
            quizMsg.textContent = `Congratulations! You passed with ${scorePercent}%. Generating certificate...`;
            
            const payload = {
                user_id: currentUser.id,
                course_id: 'intro-ia',
                score: scorePercent,
                user_name: currentUserFullName
            };
            
            const { data: cert, error: certError } = await supabase.from('course_certificates').insert(payload).select().single();
            if (certError) {
                quizMsg.textContent = "Error generating certificate. Contact support.";
            } else {
                renderDiploma(cert);
            }
        } else {
            quizMsg.style.color = '#ef4444';
            if (attemptsCount >= MAX_ATTEMPTS) {
                lockExam(`You got ${scorePercent}%. You have reached the limit of attempts (2/2).`);
            } else {
                quizMsg.textContent = `You got ${scorePercent}%. You need at least ${PASSING_SCORE}% to pass. You have 1 attempt left.`;
                btn.disabled = false;
                btn.innerHTML = 'Retry Exam';
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
        certDate.textContent = `Awarded on ${d.toLocaleDateString('en-US', langOptions)}`;

        const certDownloadLink = document.getElementById('cert-download-link');
        if (certDownloadLink && record && record.id) {
            certDownloadLink.href = `certificado.html?id=${record.id}`;
            certDownloadLink.style.display = 'block';
        }

        setupShareButtons(record ? record.id : '');
    }

    function setupShareButtons(certId) {
        const shareText = "🚀 I just got certified in 'Introduction to Artificial Intelligence' by AI4U Academy! An incredible experience to boost my career.";
        const shareUrl = window.location.origin;
        const certLink = certId ? `${window.location.origin}/certificado.html?id=${certId}` : shareUrl;

        document.getElementById('share-facebook').onclick = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(certLink)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        document.getElementById('share-whatsapp').onclick = () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " See my certificate here: " + certLink)}`, '_blank');
        document.getElementById('share-twitter').onclick = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(certLink)}`, '_blank');
        document.getElementById('share-linkedin').onclick = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certLink)}`, '_blank');
    }
});
