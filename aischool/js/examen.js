import { supabase } from './supabase-config.js';

const ANSWERS = {
    q1: 'b',
    q2: 'c',
    q3: 'a',
    q4: 'b',
    q5: 'b'
};

document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    let currentUserFullName = 'Estudiante Especial';

    const authLoader = document.getElementById('auth-loader');
    const examArea = document.getElementById('exam-area');
    const certArea = document.getElementById('certificate-area');
    const quizForm = document.getElementById('quiz-form');
    const quizMsg = document.getElementById('quiz-msg');

    // Certificate text
    const certName = document.getElementById('cert-name');
    const certDate = document.getElementById('cert-date');

    // Share buttons
    const shareLinkedIn = document.getElementById('share-linkedin');
    const shareFace = document.getElementById('share-facebook');
    const shareTwitter = document.getElementById('share-twitter');

    initExam();

    async function initExam() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) throw new Error('Not logged in');
            currentUser = session.user;

            if (currentUser.user_metadata) {
                currentUserFullName = currentUser.user_metadata.full_name || currentUser.user_metadata.name || 'Estudiante Especial';
            }

            // Verify paid enrollment before allowing access to the exam
            const { data: enrollment } = await supabase
                .from('enrollments')
                .select('id')
                .eq('user_id', currentUser.id)
                .eq('course_id', 'intro-ia')
                .maybeSingle();

            if (!enrollment) {
                window.location.href = '/index.html#pricing';
                return;
            }

            // Check if already passed
            const { data: certObj } = await supabase
                .from('course_certificates')
                .select('*')
                .eq('user_id', currentUser.id)
                .eq('course_id', 'intro-ia')
                .single();

            if (certObj && certObj.score >= 65) {
                // Already passed! Show diploma directly
                renderDiploma(certObj);
            } else {
                // Prepare form
                examArea.style.display = 'block';
                certArea.style.display = 'none';
            }

            setTimeout(() => {
                authLoader.classList.add('hidden');
            }, 500);

        } catch (err) {
            console.error('Auth error:', err);
            window.location.href = '/acceso.html';
        }
    }

    quizForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fd = new FormData(quizForm);
        let correctCount = 0;
        let total = Object.keys(ANSWERS).length;

        for (const [q, correctOption] of Object.entries(ANSWERS)) {
            if (fd.get(q) === correctOption) {
                correctCount++;
            }
        }

        const scorePercent = Math.round((correctCount / total) * 100);

        if (scorePercent >= 65) {
            quizMsg.style.color = '#10b981';
            quizMsg.textContent = `¡Aprobaste con el ${scorePercent}%! Evaluando servidor...`;
            
            // Save to database
            const payload = {
                user_id: currentUser.id,
                course_id: 'intro-ia',
                score: scorePercent,
                user_name: currentUserFullName
            };
            
            // Allow update if they retry, but RLS might block update so we use upsert if needed.
            // Wait, supabase requires matching unique key for upsert or deletion. RLS is insert only right now.
            // If they failed previously, it wouldn't exist since we only save if passed.
            const { data, error } = await supabase.from('course_certificates').insert(payload).select().single();
            
            if (error && error.code === '23505') {
                 // Already exists, just show previous
                 const { data: oldCert } = await supabase.from('course_certificates').select().eq('user_id', currentUser.id).single();
                 renderDiploma(oldCert);
            } else if (error) {
                 quizMsg.textContent = `Error salvando diploma: ` + error.message;
            } else {
                 renderDiploma(data);
            }

        } else {
            quizMsg.style.color = '#ef4444';
            quizMsg.textContent = `Obtuviste un ${scorePercent}%. Necesitas mínimo 65% para pasar. Puedes volver a intentarlo.`;
        }
    });

    function renderDiploma(record) {
        examArea.style.display = 'none';
        certArea.style.display = 'flex';

        certName.textContent = currentUserFullName;
        
        let d = new Date();
        if (record && record.issued_at) {
             d = new Date(record.issued_at);
        }
        
        const langOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        certDate.textContent = `Otorgado el ${d.toLocaleDateString('es-MX', langOptions)}`;

        // Official Certificate Link
        const certDownloadLink = document.getElementById('cert-download-link');
        if (certDownloadLink && record && record.id) {
            certDownloadLink.href = `certificado.html?id=${record.id}`;
            certDownloadLink.style.display = 'block';
        }

        setupShareButtons();
    }

    function setupShareButtons() {
        // Standard social sharing intents. 
        const shareText = encodeURIComponent("🚀 ¡Acabo de certificarme en Introducción a la Inteligencia Artificial por AI4U Academy!");
        const shareUrl = encodeURIComponent(window.location.origin);
        
        shareFace.onclick = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`, '_blank');
        shareTwitter.onclick = () => window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, '_blank');
        shareLinkedIn.onclick = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank');
    }

});
