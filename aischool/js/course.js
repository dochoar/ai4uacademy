import { supabase } from './supabase-config.js';

const COURSE_META = {
    id: 'intro-ia',
    title: 'Introduction to AI',
    modules: [
        { 
            id: 1, 
            title: 'Fundamentals', 
            duration: '45 min', 
            desc: 'Learn the basic concepts of artificial intelligence, its recent history, and how language models are transforming the way we work today.',
            quiz: [
                {
                    q: "What does the acronym 'AI' stand for in a technological context?",
                    options: { a: "Automatic Information", b: "Artificial Intelligence", c: "Advanced Interface", d: "Algorithmic Integration" },
                    correct: "b",
                    feedback: "AI stands for Artificial Intelligence, the field of computer science that aims to create systems capable of simulating human cognitive abilities."
                },
                {
                    q: "What is the correct relationship between AI, Machine Learning, and Deep Learning?",
                    options: { 
                        a: "They are three independent technologies with no relationship", 
                        b: "AI is the broadest field; Machine Learning is a subset of AI; Deep Learning is a subset of Machine Learning",
                        c: "Deep Learning is the broadest field that contains the others",
                        d: "Machine Learning and Deep Learning are the same thing"
                    },
                    correct: "b",
                    feedback: "They work like Russian dolls: AI is the general concept, ML is a way to achieve AI by learning from data, and DL is a specific ML technique."
                },
                {
                    q: "What type of AI currently exists in the real world?",
                    options: { 
                        a: "General AI (AGI) that can do any human task",
                        b: "Superintelligence that surpasses humans in everything",
                        c: "Narrow AI, specialized in specific tasks",
                        d: "AI with its own consciousness and emotions"
                    },
                    correct: "c",
                    feedback: "All AI we use today is 'Narrow AI': it can do ONE task very well, but cannot transfer that knowledge to other areas."
                },
                {
                    q: "Which of these is an example of AI that we use in our daily lives without realizing it?",
                    options: {
                        a: "A basic calculator",
                        b: "Netflix or Spotify recommendations based on your tastes",
                        c: "A traffic light with a fixed timer",
                        d: "An Excel spreadsheet"
                    },
                    correct: "b",
                    feedback: "Recommendation systems use Machine Learning algorithms that analyze your behavior to suggest personalized content."
                },
                {
                    q: "What is generative AI?",
                    options: {
                        a: "AI that can only classify existing data",
                        b: "AI that generates new content (text, images, code, audio) from instructions",
                        c: "AI that autonomously generates electricity",
                        d: "AI that only works with electric generators"
                    },
                    correct: "b",
                    feedback: "Generative AI creates original content based on patterns learned from large amounts of data."
                }
            ]
        },
        { 
            id: 2, 
            title: 'How to Talk to AI', 
            duration: '1h 30 min', 
            desc: 'Discover the best practices of "Prompt Engineering". Learn how to write precise instructions to get extremely high-quality results.',
            quiz: [
                {
                    q: "What is a 'prompt' and why is it important?",
                    options: { 
                        a: "It's the name of the AI model; it has no practical importance", 
                        b: "It's the instruction you give the AI; its quality directly determines the quality of the response",
                        c: "It's the result the AI generates; the user does not control it",
                        d: "It's the password to access ChatGPT"
                    },
                    correct: "b",
                    feedback: "The prompt is your instruction to the AI. The golden rule is: 'garbage in, garbage out'. A specific prompt gives better responses."
                },
                {
                    q: "What are the key elements of an effective prompt?",
                    options: { 
                        a: "You just need to write one word and the AI understands everything", 
                        b: "Role + specific task + context + desired format + audience",
                        c: "Always write in English, regardless of the desired language",
                        d: "Use emojis and capital letters so the AI pays more attention"
                    },
                    correct: "b",
                    feedback: "An effective prompt includes: who you want the AI to be (role), what you need (task), context, format, and audience."
                },
                {
                    q: "What technique involves asking the AI to reason step by step before giving a final answer?",
                    options: { 
                        a: "Role Playing",
                        b: "Few-Shot Prompting",
                        c: "Chain of Thought",
                        d: "Zero-Shot Prompting"
                    },
                    correct: "c",
                    feedback: "Chain of Thought asks the AI to show its reasoning step by step, improving accuracy on complex tasks."
                },
                {
                    q: "What is 'Few-Shot Prompting'?",
                    options: {
                        a: "Giving the AI only a few words as instruction",
                        b: "Including concrete examples of the format or type of response you expect",
                        c: "Asking the AI to respond in a few words",
                        d: "Using the AI only a few times a day"
                    },
                    correct: "b",
                    feedback: "Few-Shot means giving the AI a 'few examples' so it understands the pattern, tone, and format you want."
                },
                {
                    q: "What is the difference between a bad prompt and a good prompt?",
                    options: {
                        a: "There is no difference, the AI always responds the same",
                        b: "A bad prompt is short and a good prompt is long",
                        c: "A good prompt is specific, gives context, defines format and audience; a bad prompt is vague and generic",
                        d: "A good prompt only uses technical words and programming jargon"
                    },
                    correct: "c",
                    feedback: "The fundamental difference is specificity and context. A vague prompt produces vague results; a detailed one produces useful results."
                }
            ]
        },
        { 
            id: 3, 
            title: 'Real World Applications', 
            duration: '1h 30 min', 
            desc: 'Practical use cases in companies, from writing corporate emails to analyzing market trends without knowing how to code.',
            quiz: [
                {
                    q: "In how many professional sectors does AI currently have real applications?",
                    options: { 
                        a: "Only in technology and computing", 
                        b: "In 3 or 4 main sectors like banking and medicine",
                        c: "In practically all sectors: health, finance, marketing, legal, etc.",
                        d: "Only in Silicon Valley companies"
                    },
                    correct: "c",
                    feedback: "AI is already present in almost all productive sectors, from medical diagnosis to precision agriculture and legal analysis."
                },
                {
                    q: "How is AI used in the healthcare sector today?",
                    options: { 
                        a: "Robots operating without human supervision", 
                        b: "Assistance in medical imaging diagnosis, data analysis, and drug discovery with medical supervision",
                        c: "Completely replaces doctors in consultations",
                        d: "Only used to keep hospital accounting"
                    },
                    correct: "b",
                    feedback: "AI assists by analyzing X-rays and detecting clinical patterns, always as a support tool under medical supervision."
                },
                {
                    q: "What AI tools can a small business use today without coding?",
                    options: { 
                        a: "None, AI requires teams of programmers",
                        b: "ChatGPT for customer service, Canva for design, automated chatbots, etc.",
                        c: "Can only use advanced Excel",
                        d: "Needs to invest a minimum of $100,000 in infrastructure"
                    },
                    correct: "b",
                    feedback: "There are dozens of accessible tools like ChatGPT, Canva, Tidio or Notion AI that do not require technical knowledge."
                },
                {
                    q: "What is a real example of AI in digital marketing?",
                    options: {
                        a: "Printing flyers at a print shop",
                        b: "Ad personalization, copy generation, and automatic segmentation",
                        c: "Sending mass emails without any segmentation",
                        d: "Putting up billboards on the street"
                    },
                    correct: "b",
                    feedback: "AI in marketing allows personalized ads, advertising text generation, and intelligent audience segmentation."
                },
                {
                    q: "How can AI help in the education sector?",
                    options: {
                        a: "Completely replacing teachers",
                        b: "Personalized virtual tutors, educational materials, and immediate feedback",
                        c: "Only serving as a calculator for students",
                        d: "Eliminating the need to study"
                    },
                    correct: "b",
                    feedback: "AI in education personalizes learning with tutors that adapt to the student's pace and provide immediate feedback."
                }
            ]
        },
        { 
            id: 4, 
            title: 'AI for Productivity', 
            duration: '1h', 
            desc: 'Automate repetitive tasks. Use modern tools to transcribe meetings, summarize documents, and create presentations in seconds.',
            quiz: [
                {
                    q: "What are the three pillars of AI applied to personal productivity?",
                    options: { 
                        a: "Buy, sell, and distribute", 
                        b: "Automate, accelerate, and amplify",
                        c: "Copy, ask, and send",
                        d: "Program, compile, and execute"
                    },
                    correct: "b",
                    feedback: "The three pillars are: AUTOMATE repetitive tasks, ACCELERATE creative processes, and AMPLIFY your current capabilities."
                },
                {
                    q: "If you use AI to automate 2 hours of repetitive tasks a day, how much time do you free up per month?",
                    options: { 
                        a: "8 hours", 
                        b: "20 hours",
                        c: "40 hours (equivalent to a week of work)",
                        d: "100 hours"
                    },
                    correct: "c",
                    feedback: "2 hours a day × 20 days = 40 hours a month. It's a full week redirected to higher-value tasks."
                },
                {
                    q: "What is the best practice when using AI to create professional content?",
                    options: { 
                        a: "Copy and publish directly",
                        b: "Use AI as a starting point, then review and add your perspective",
                        c: "Never use AI because everything is made up",
                        d: "Ask the AI to do everything without giving it instructions"
                    },
                    correct: "b",
                    feedback: "AI is your copilot. It generates quick drafts that YOU review, edit, and enrich with your experience and personal context."
                },
                {
                    q: "For which of these tasks can AI save you the most time in your daily life?",
                    options: {
                        a: "Walking to work",
                        b: "Writing emails, summarizing long documents, and creating presentations",
                        c: "Doing physical exercise",
                        d: "Cooking dinner"
                    },
                    correct: "b",
                    feedback: "AI excels at text processing tasks: writing emails, summarizing extensive documents, and generating report drafts."
                },
                {
                    q: "What does it mean that AI 'amplifies' your capabilities?",
                    options: {
                        a: "That AI does everything for you without intervention",
                        b: "That it allows you to do things you couldn't before, like analyzing lots of data or creating content in other languages",
                        c: "That AI speaks louder through the microphone",
                        d: "That it automatically doubles your salary"
                    },
                    correct: "b",
                    feedback: "Amplifying means expanding your limits: analyzing thousands of reviews, translating into 10 languages, or creating professional designs without being a designer."
                }
            ]
        },
        { 
            id: 5, 
            title: 'Risks, Ethics, and Limits', 
            duration: '45 min', 
            desc: 'Understand AI hallucinations, information biases, and the precautions needed when handling private company data.',
            quiz: [
                {
                    q: "What are AI 'hallucinations'?",
                    options: { 
                        a: "Hardware errors in the servers", 
                        b: "When AI generates false information but presents it as true with complete confidence",
                        c: "When AI doesn't understand the language",
                        d: "When AI shows distorted images"
                    },
                    correct: "b",
                    feedback: "AI can invent facts, quotes, or statistics very convincingly. That is why you should ALWAYS verify critical information."
                },
                {
                    q: "What is 'bias' in AI and why is it dangerous?",
                    options: { 
                        a: "It's when AI has its own political opinions", 
                        b: "It's when AI reproduces prejudices from its training data, which can lead to discrimination",
                        c: "It's when AI only works in one language",
                        d: "It's when AI is too slow"
                    },
                    correct: "b",
                    feedback: "AI learns from historical data that may contain biases. If not controlled, it can amplify prejudices in critical decisions."
                },
                {
                    q: "What is the most important ethical practice when using AI at work?",
                    options: { 
                        a: "Presenting all AI content as if it were yours",
                        b: "Being transparent, verifying information, and protecting personal data",
                        c: "Using AI to spy on coworkers",
                        d: "Sharing private client data without consent"
                    },
                    correct: "b",
                    feedback: "Ethics in AI is based on: TRANSPARENCY (saying when you use AI), VERIFICATION, and PRIVACY (not uploading sensitive data)."
                },
                {
                    q: "Why should you NOT blindly trust the information AI generates?",
                    options: {
                        a: "Because AI always lies on purpose",
                        b: "Because it may have outdated data, biases, or 'hallucinate', and the human is responsible",
                        c: "Because AI is a conspiracy",
                        d: "There is no reason, it can be trusted 100%"
                    },
                    correct: "b",
                    feedback: "AI works with statistical probabilities, not with the 'truth'. It can fail due to old data or model errors. YOU are ultimately responsible."
                },
                {
                    q: "Which of these is a real case where the misuse of AI caused problems?",
                    options: {
                        a: "A lawyer presented fake legal cases invented by ChatGPT to a judge without verifying them",
                        b: "An AI robot destroyed a factory",
                        c: "AI took control of the government",
                        d: "ChatGPT refused to work for a year"
                    },
                    correct: "a",
                    feedback: "A lawyer in 2023 cited non-existent court cases invented by ChatGPT and was sanctioned. This shows why you should ALWAYS verify."
                }
            ]
        },
        { 
            id: 6, 
            title: 'Final Practical Workshop', 
            duration: 'Workshop', 
            desc: 'Apply everything you have learned. We will build an AI-based solution together to solve an everyday problem. We will evaluate your prompts in real-time.',
            quiz: [
                {
                    q: "What is the recommended first step to integrate AI into your workflow?",
                    options: { 
                        a: "Immediately replace all your processes with AI", 
                        b: "Identify low-value repetitive tasks and test specific tools",
                        c: "Wait 10 years until AI is perfect",
                        d: "Buy the most expensive AI software on the market"
                    },
                    correct: "b",
                    feedback: "Successful adoption is gradual: identify where you waste time on repetitive tasks, test specific tools, and scale what works."
                },
                {
                    q: "When creating a prompt to solve a real problem, what should you always include?",
                    options: { 
                        a: "Only the question, without context or details", 
                        b: "Context, specific desired outcome, format, and audience",
                        c: "Your full name and address",
                        d: "The source code of the AI model"
                    },
                    correct: "b",
                    feedback: "An effective prompt always contextualizes: who you are, what you need, format, audience, and constraints. More context = better result."
                },
                {
                    q: "What is the right way to evaluate if an AI tool is useful?",
                    options: { 
                        a: "If it's free, it's good; if it's paid, it's bad",
                        b: "Test it with real tasks, measure time saved, quality, and compare it with your current method",
                        c: "Only read the advertisements",
                        d: "Ask the AI itself if it's good"
                    },
                    correct: "b",
                    feedback: "Practical evaluation is key: test it with YOUR real tasks, measure the time it saves, and verify if the quality is acceptable."
                },
                {
                    q: "After this course, what should be your mindset regarding AI?",
                    options: {
                        a: "AI is going to take my job, better ignore it",
                        b: "It's a powerful tool that enhances my capabilities; I must use it ethically and strategically",
                        c: "AI is perfect and can replace all human work",
                        d: "It's just a passing fad"
                    },
                    correct: "b",
                    feedback: "AI doesn't replace people, it empowers people. Professionals who learn to use it ethically will have a huge competitive advantage."
                },
                {
                    q: "What action plan should you follow after completing this course?",
                    options: {
                        a: "Forget everything and go back to my previous methods",
                        b: "Choose 3 real tasks, apply what you learned this week, measure results, and expand",
                        c: "Try to automate everything at once",
                        d: "Wait for someone to tell me what to do"
                    },
                    correct: "b",
                    feedback: "The ideal plan is concrete and immediate: choose 3 tasks, apply prompting techniques, measure time/quality gains, and then expand."
                }
            ]
        },
        { id: 7, title: 'Certification Exam', duration: 'Official Evaluation', desc: 'Pass this short challenge with over 65% to get and show off your Official Professional Certificate from AI4U Academy.' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    let currentUserFullName = 'Student';
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
    const quizSection = document.getElementById('quiz-section');
    const quizStepText = document.getElementById('quiz-step');
    const quizQuestionText = document.getElementById('quiz-q-text');
    const quizOptionsContainer = document.getElementById('quiz-options');
    const quizFeedbackContainer = document.getElementById('quiz-feedback');
    const quizFeedbackText = document.getElementById('feedback-text');
    const btnNextQuestion = document.getElementById('btn-next-q');

    let currentQuiz = null;
    let currentQuestionIndex = 0;

    const MODULE_CELEBRATION = {
        1: { emoji: '🧠', objective: 'Now you understand what AI is, how it works, and its types.' },
        2: { emoji: '💬', objective: 'You master prompt engineering to get quality answers.' },
        3: { emoji: '🚀', objective: 'You know real-world applications of AI in different sectors.' },
        4: { emoji: '⚡', objective: 'You know how to use AI to automate and work smarter.' },
        5: { emoji: '🛡️', objective: 'You understand hallucinations, biases, and ethical limits of AI.' },
        6: { emoji: '🏆', objective: 'You applied everything in a practical workshop! You are ready for the exam.' }
    };
    const ENCOURAGEMENT_MESSAGES = {
        1: 'Great first step! The journey of a thousand miles begins with one.',
        2: 'You are at 33%! Fundamentals and communication with AI: mastered.',
        3: 'Halfway there! The certificate is getting closer. Don\'t stop now.',
        4: 'More than halfway through! The final stretch is on the horizon.',
        5: 'One more module and you\'ve made it! The certificate is almost yours.',
        6: 'Course completed! Now conquer the certification exam.'
    };
    let stopConfettiFn = null;

    initCourse();

    async function initCourse() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) throw new Error('Not logged in');
            currentUser = session.user;

            if (currentUser.user_metadata) {
                currentUserFullName = currentUser.user_metadata.full_name || currentUser.user_metadata.name || 'Student';
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

            const btnShowQuiz = document.getElementById('btn-show-quiz');
            if (btnShowQuiz) {
                btnShowQuiz.addEventListener('click', () => {
                    const mod = COURSE_META.modules.find(m => m.id === currentModuleId);
                    if (mod && mod.quiz) {
                        startQuiz(mod.quiz);
                    } else {
                        alert('This module does not require quiz exercises.');
                    }
                });
            }

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

            let stateClass = 'csnav__item';
            if (isLocked)            stateClass += ' csnav__item--locked';
            else if (isCompleted && !isActive) stateClass += ' csnav__item--done';
            else if (isActive)       stateClass += ' csnav__item--active';
            else                     stateClass += ' csnav__item--available';

            // Bubble content
            let bubbleContent = '';
            if (isLocked) {
                bubbleContent = `<svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
            } else if (isCompleted && !isActive) {
                bubbleContent = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`;
            } else {
                bubbleContent = `${mod.id}`;
            }

            const li = document.createElement('li');
            li.className = stateClass;
            li.innerHTML = `
                <span class="csnav__bubble">${bubbleContent}</span>
                <span class="csnav__item-text">
                    <strong>${mod.title}</strong>
                    <small>${mod.duration}</small>
                </span>
                ${isActive ? '<span class="csnav__now-pill">Now</span>' : ''}
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
        gsap.from(".csnav__item", {
            x: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out"
        });

        // Update Global Progress Bar
        const percent = Math.round((completedModules.length / COURSE_META.modules.length) * 100);
        progressFill.style.width = percent + '%';
        progressText.textContent = `${percent}% Completed`;

        // Update sidebar ring
        const ringFill = document.getElementById('sidebar-ring-fill');
        const ringPct  = document.getElementById('sidebar-ring-pct');
        if (ringFill) {
            const circumference = 213.6;
            const offset = circumference - (percent / 100) * circumference;
            ringFill.style.strokeDashoffset = offset;
        }
        if (ringPct) ringPct.textContent = `${percent}%`;
    }

    function renderMainView(modId) {
        const mod = COURSE_META.modules.find(m => m.id === modId);
        if (!mod) return;

        videoTitle.textContent = `Playing Module ${mod.id}...`;
        badgeEl.textContent = `Module ${mod.id}`;
        titleEl.textContent = mod.title;
        timeEl.textContent = mod.duration;
        descEl.textContent = mod.desc;

        const isCompleted = completedModules.includes(mod.id);

        if (isCompleted) {
            btnComplete.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Module Completed</span>
            `;
            btnComplete.classList.remove('btn-primary');
            btnComplete.classList.add('btn-secondary');
            btnComplete.style.border = "1px solid #10b981";
            btnComplete.style.color = "#10b981";
            btnComplete.disabled = true;
        } else if (mod.id === 7) {
            btnComplete.innerHTML = `
                <span>Take Official Exam & Get Certificate</span>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><path d="M5 12l5 5l10 -10"></path></svg>
            `;
            btnComplete.className = 'btn btn-primary btn-complete';
            btnComplete.style.background = '#0ea5e9'; // stand out color for exam
            btnComplete.disabled = false;
        } else {
            btnComplete.innerHTML = `
                <span>Mark as Completed & Continue</span>
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
        commentsList.innerHTML = '<p style="color: #94a3b8;">Loading comments...</p>';
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
            commentsList.innerHTML = '<p style="color: #ef4444;">Error loading comments.</p>';
        }
    }

    function renderComments(data) {
        commentsList.innerHTML = '';
        if (!data || data.length === 0) {
            commentsList.innerHTML = '<p style="color: #94a3b8; font-style: italic;">No comments yet. Be the first to ask!</p>';
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
        const date = new Date(comment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const adminBadge = adminUserIds.includes(comment.user_id) ? '<span class="admin-badge">Teacher</span>' : '';
        
        let replyBtnHtml = '';
        let replyFormHtml = '';
        
        let deleteBtnHtml = '';
        if (isAdmin || comment.user_id === currentUser.id) {
            deleteBtnHtml = `<button class="btn-reply" style="color: #ef4444;" onclick="window.deleteComment('${comment.id}')">Delete</button>`;
        }
        
        if (!isReply) {
            replyBtnHtml = `<button class="btn-reply" onclick="window.toggleReplyForm('${comment.id}')">Reply</button>`;
            replyFormHtml = `
            <div id="reply-form-${comment.id}" class="reply-form-container" style="display: none;">
                <textarea id="reply-input-${comment.id}" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(0,0,0,0.3); color: white; min-height: 60px;" placeholder="Write your reply..."></textarea>
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.submitReply('${comment.id}')" style="align-self: flex-start;">Submit Reply</button>
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
                alert('Policies prohibit sharing phone numbers, emails, links, or social media.');
                return;
            }

            commentSubmitBtn.disabled = true;
            commentSubmitBtn.textContent = 'Sending...';
            
            const { error } = await supabase.from('course_comments').insert({
                course_id: COURSE_META.id,
                module_id: currentModuleId,
                user_id: currentUser.id,
                user_name: currentUserFullName,
                content: text
            });

            if (error) {
                alert('Error posting comment.');
            } else {
                commentInput.value = '';
                await loadComments(currentModuleId);
            }
            commentSubmitBtn.disabled = false;
            commentSubmitBtn.textContent = 'Post Comment';
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
            alert('Policies prohibit sharing phone numbers, links, or social media.');
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
            alert('Error posting reply.');
            input.disabled = false;
            return;
        }

        await loadComments(currentModuleId);
    };

    window.deleteComment = async function(commentId) {
        if (!confirm('Are you sure you want to delete this comment?')) return;
        
        const { error } = await supabase.from('course_comments').delete().eq('id', commentId);
        
        if (error) {
            alert('Error trying to delete the comment.');
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
        const justCompletedId = currentModuleId;

        // Save to Supabase (avoid duplicates)
        if (!completedModules.includes(justCompletedId)) {
            completedModules.push(justCompletedId);

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
                completedModules.pop();
                return;
            }
        }

        // Módulos 1-6: mostrar modal de celebración antes de avanzar
        if (justCompletedId <= 6) {
            showCelebrationModal(justCompletedId);
            return;
        }
        advanceAfterCelebration();
    }

    function advanceAfterCelebration() {
        if (currentModuleId < COURSE_META.modules.length) {
            currentModuleId++;
        }
        renderSidebar();
        renderMainView(currentModuleId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ─── Confetti ────────────────────────────────────────────────────────────
    function launchConfetti(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        const COLORS = ['#00A389', '#00d4b5', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#ffffff', '#152247'];
        const particles = Array.from({ length: 140 }, () => ({
            x:      Math.random() * canvas.width,
            y:      Math.random() * canvas.height * -0.6,
            w:      5 + Math.random() * 9,
            h:      3 + Math.random() * 5,
            color:  COLORS[Math.floor(Math.random() * COLORS.length)],
            vx:     -1.5 + Math.random() * 3,
            vy:     2 + Math.random() * 4,
            angle:  Math.random() * Math.PI * 2,
            spin:   -0.08 + Math.random() * 0.16,
            opacity: 0.8 + Math.random() * 0.2
        }));

        let rafId;
        let elapsed = 0;
        const FADE_START = 3500;
        const FADE_DURATION = 900;

        function draw() {
            elapsed += 16;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const fade = elapsed > FADE_START
                ? Math.max(0, 1 - (elapsed - FADE_START) / FADE_DURATION)
                : 1;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.angle += p.spin;
                p.vy += 0.055;
                if (p.x < -20) p.x = canvas.width + 20;
                if (p.x > canvas.width + 20) p.x = -20;
                ctx.save();
                ctx.globalAlpha = p.opacity * fade;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });

            if (fade > 0) {
                rafId = requestAnimationFrame(draw);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        rafId = requestAnimationFrame(draw);

        return function stop() {
            cancelAnimationFrame(rafId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    }

    // ─── Show celebration modal ───────────────────────────────────────────────
    function showCelebrationModal(completedModId) {
        const TOTAL_CONTENT = 6;
        const completedCount = completedModules.filter(id => id <= TOTAL_CONTENT).length;
        const percent = Math.round((completedCount / TOTAL_CONTENT) * 100);
        const meta = MODULE_CELEBRATION[completedModId] || { emoji: '🎉', objective: '' };
        const isLast = completedModId === TOTAL_CONTENT;

        document.getElementById('celebration-module-pill').textContent = `Módulo ${completedModId} de ${TOTAL_CONTENT}`;
        document.getElementById('celebration-icon').textContent = meta.emoji;
        document.getElementById('celebration-headline').textContent = `¡Módulo ${completedModId} completado!`;
        document.getElementById('celebration-objective').textContent = meta.objective;
        document.getElementById('celebration-progress-label').textContent =
            `${completedCount} de ${TOTAL_CONTENT} módulos completados · ${percent}% del curso`;

        const fill = document.getElementById('celebration-progress-fill');
        fill.style.transition = 'none';
        fill.style.width = '0%';
        requestAnimationFrame(() => {
            fill.style.transition = 'width 1.1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s';
            fill.style.width = percent + '%';
        });

        document.getElementById('celebration-encouragement').textContent =
            ENCOURAGEMENT_MESSAGES[completedCount] || '¡Sigue adelante!';

        wireShareButtons(completedModId, completedCount, TOTAL_CONTENT, percent);

        // CTA — clone to remove old listeners
        const oldCta = document.getElementById('celebration-cta');
        const newCta = oldCta.cloneNode(true);
        oldCta.parentNode.replaceChild(newCta, oldCta);
        newCta.textContent = isLast
            ? 'Ir al Examen de Certificación →'
            : `Continuar al Módulo ${completedModId + 1} →`;
        newCta.addEventListener('click', closeCelebrationModal);

        const overlay = document.getElementById('celebration-modal');
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        stopConfettiFn = launchConfetti(document.getElementById('confetti-canvas'));
    }

    function closeCelebrationModal() {
        const overlay = document.getElementById('celebration-modal');
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (stopConfettiFn) { stopConfettiFn(); stopConfettiFn = null; }
        advanceAfterCelebration();
    }

    // ─── Wire share buttons ───────────────────────────────────────────────────
    function wireShareButtons(modId, count, total, percent) {
        const MOD_TITLES = {
            1: 'Fundamentos de IA',
            2: 'Cómo hablar con la IA',
            3: 'Aplicaciones reales de IA',
            4: 'IA para Productividad',
            5: 'Riesgos, Ética y Límites de la IA',
            6: 'Taller Práctico Final'
        };
        const courseUrl = 'https://ai4uacademy.com/';
        const modName   = MOD_TITLES[modId] || `Módulo ${modId}`;

        const xText  = `¡Acabo de completar el módulo "${modName}" de mi curso de introducción a la IA de AI4U Academy! 🎯 (${count}/${total} módulos · ${percent}%) Únete y empieza a aprender: ${courseUrl}`;
        const liText = `¡Acabo de completar el módulo "${modName}" de mi curso de introducción a la IA de AI4U Academy! Llevo ${count} de ${total} módulos completados (${percent}%). Únete hoy mismo y empieza a aprender: ${courseUrl}`;

        const urls = {
            'csb-linkedin': `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(liText)}`,
            'csb-facebook': `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(courseUrl)}&quote=${encodeURIComponent(liText)}`,
            'csb-x':        `https://x.com/intent/tweet?text=${encodeURIComponent(xText)}`
        };

        Object.entries(urls).forEach(([cls, url]) => {
            const old = document.querySelector(`.celebration-share-btn.${cls}`);
            if (!old) return;
            const fresh = old.cloneNode(true);
            old.parentNode.replaceChild(fresh, old);
            fresh.addEventListener('click', () =>
                window.open(url, '_blank', 'width=620,height=500,noopener,noreferrer')
            );
        });
    }

    // --- Quiz Engine Logic ---

    function startQuiz(quiz) {
        currentQuiz = quiz;
        currentQuestionIndex = 0;
        quizSection.style.display = 'block';
        loadQuestion();
        
        // Scroll quiz into view smoothly
        quizSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
            btnNextQuestion.textContent = 'Finalizar Evaluación y Continuar';
        } else {
            btnNextQuestion.textContent = 'Siguiente Pregunta';
        }
    }

    btnNextQuestion.onclick = () => {
        if (currentQuestionIndex < currentQuiz.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            quizSection.style.display = 'none';
            finalizeModuleCompletion(document.getElementById('btn-complete'));
        }
    };

    // Dummy video click
    videoContainer.addEventListener('click', () => {
        const placeholder = document.getElementById('video-placeholder');
        placeholder.innerHTML = `<h2 style="color: #00A389">▶ Reproduciendo video...</h2><p>Simulador de carga rápido activo.</p>`;
    });

});
