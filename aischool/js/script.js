/**
 * AI 4U Academy Landing Page Interactions
 */

document.addEventListener('DOMContentLoaded', () => {

    // 0. Splash Screen Logic
    window.addEventListener('load', () => {
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
            // Optional minimum display time to ensure user sees it briefly
            setTimeout(() => {
                splashScreen.classList.add('hidden');
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 800); // Matches CSS transition time
            }, 600);
        }
    });

    // Fallback if load event takes too long
    setTimeout(() => {
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen && splashScreen.style.display !== 'none') {
            splashScreen.classList.add('hidden');
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 800);
        }
    }, 2500);

    // 1. Smooth Scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 2. Sticky Mobile CTA visibility
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            // Show after scrolling 30% of viewport height
            if (window.scrollY > window.innerHeight * 0.3) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        }, { passive: true });
    }

    // 3. Modal Preview Logic
    const modal = document.getElementById('modal-preview');
    const btnPreview = document.getElementById('btn-preview');
    const modalClose = document.getElementById('modal-close');
    const modalCtaClose = document.querySelector('.modal-cta-close');

    let pdfViewerInitialized = false;

    function initPdfViewer() {
        if (typeof window.pdfjsLib === 'undefined') {
            console.error('PDF.js no está cargado');
            return;
        }

        const pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const renderArea = document.getElementById('pdf-render-area');
        const loadingIndicator = document.getElementById('pdf-loading');
        const overlayMessage = document.getElementById('pdf-overlay-message');
        const tabs = document.querySelectorAll('.pdf-tab');

        async function loadPdf(url) {
            renderArea.innerHTML = '';
            loadingIndicator.style.display = 'block';
            overlayMessage.style.display = 'none';

            try {
                const loadingTask = pdfjsLib.getDocument(url);
                const pdf = await loadingTask.promise;

                loadingIndicator.style.display = 'none';

                let baseHeight, baseWidth;

                // Render just first 15 pages for performance. 1-10 are clear, 11-15 blurred. 
                const renderLimit = Math.min(15, pdf.numPages);

                for (let pageNum = 1; pageNum <= renderLimit; pageNum++) {
                    const page = await pdf.getPage(pageNum);

                    const scale = 1.2;
                    const viewport = page.getViewport({ scale: scale });

                    if (pageNum === 1) {
                        baseHeight = viewport.height;
                        baseWidth = viewport.width;
                    }

                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    canvas.classList.add('pdf-page-canvas');

                    const renderContext = { canvasContext: context, viewport: viewport };
                    await page.render(renderContext).promise;

                    const wrapper = document.createElement('div');
                    wrapper.classList.add('pdf-page-wrapper');
                    wrapper.appendChild(canvas);

                    if (pageNum > 10) {
                        wrapper.classList.add('blurred-page');
                        if (pageNum === 11) overlayMessage.style.display = 'block';
                    }

                    renderArea.appendChild(wrapper);
                }

                // For remaining pages, add dummy wrappers to show length without freezing the browser
                if (pdf.numPages > 15) {
                    for (let pageNum = 16; pageNum <= pdf.numPages; pageNum++) {
                        const emptyWrapper = document.createElement('div');
                        emptyWrapper.classList.add('pdf-page-wrapper', 'blurred-page');
                        emptyWrapper.style.height = `${baseHeight}px`;
                        emptyWrapper.style.width = '100%';
                        emptyWrapper.style.maxWidth = `${baseWidth}px`;
                        emptyWrapper.style.backgroundColor = '#ddd';
                        renderArea.appendChild(emptyWrapper);
                    }
                }
            } catch (error) {
                console.error('Error loading PDF:', error);
                loadingIndicator.textContent = 'Error al cargar el documento.';
            }
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                const clickedTab = e.target;
                clickedTab.classList.add('active');

                const pdfUrl = clickedTab.getAttribute('data-pdf');
                if (pdfUrl) loadPdf(pdfUrl);
            });
        });

        const defaultPdfUrl = document.querySelector('.pdf-tab.active')?.getAttribute('data-pdf');
        if (defaultPdfUrl) loadPdf(defaultPdfUrl);
    }

    function openModal() {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        if (!pdfViewerInitialized) {
            initPdfViewer();
            pdfViewerInitialized = true;
        }
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (btnPreview && modal) {
        btnPreview.addEventListener('click', openModal);
        // Bind secondary preview buttons if they exist
        document.querySelectorAll('[data-track="cta-testimonials"], [data-track="descargar-pdf"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.tagName !== 'A') {
                    openModal();
                }
            });
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalCtaClose) {
        modalCtaClose.addEventListener('click', closeModal);
    }

    // Close modal on click outside content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // 3.5. Video Modal Logic
    const videoModal = document.getElementById('video-modal');
    const btnOpenVideoModal = document.getElementById('open-video-modal');
    const videoModalCloseBtn = document.getElementById('video-modal-close');
    const videoModalCtaClose = document.querySelector('.video-modal-cta-close');

    function openVideoModal() {
        if (!videoModal) return;
        videoModal.classList.add('active');
        videoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeVideoModal() {
        if (!videoModal) return;
        videoModal.classList.remove('active');
        videoModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Stop YouTube videos from playing by resetting the iframe src
        const iframes = videoModal.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            const currentSrc = iframe.src;
            iframe.src = currentSrc;
        });
    }

    if (btnOpenVideoModal && videoModal) {
        btnOpenVideoModal.addEventListener('click', openVideoModal);
    }

    if (videoModalCloseBtn) videoModalCloseBtn.addEventListener('click', closeVideoModal);
    if (videoModalCtaClose) videoModalCtaClose.addEventListener('click', closeVideoModal);

    window.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    // 3.6. Creator Video Modal Logic
    const creatorVideoModal = document.getElementById('creator-video-modal');
    const btnOpenCreatorVideo = document.getElementById('open-creator-video');
    const creatorVideoCloseBtn = document.getElementById('creator-video-close');
    const creatorVideoIframe = document.getElementById('creator-video-iframe');

    function openCreatorVideo() {
        if (!creatorVideoModal) return;
        creatorVideoModal.classList.add('active');
        creatorVideoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Only set the src when opening to save bandwidth initially
        if (creatorVideoIframe && !creatorVideoIframe.src.includes('youtube')) {
            creatorVideoIframe.src = "https://www.youtube.com/embed/CreOKFB26_Y?autoplay=1";
        } else if (creatorVideoIframe) {
            creatorVideoIframe.src = "https://www.youtube.com/embed/CreOKFB26_Y?autoplay=1";
        }
    }

    function closeCreatorVideo() {
        if (!creatorVideoModal) return;
        creatorVideoModal.classList.remove('active');
        creatorVideoModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Stop YouTube video from playing by clearing the iframe src
        if (creatorVideoIframe) {
            creatorVideoIframe.src = "";
        }
    }

    if (btnOpenCreatorVideo && creatorVideoModal) {
        btnOpenCreatorVideo.addEventListener('click', openCreatorVideo);
    }

    if (creatorVideoCloseBtn) creatorVideoCloseBtn.addEventListener('click', closeCreatorVideo);

    window.addEventListener('click', (e) => {
        if (e.target === creatorVideoModal) {
            closeCreatorVideo();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && creatorVideoModal && creatorVideoModal.classList.contains('active')) {
            closeCreatorVideo();
        }
    });


    // 4. FAQ Accordion Logic
    const faqButtons = document.querySelectorAll('.faq-btn');

    faqButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            // Close all other accordions (Optional depending on preference, currently independent)
            // document.querySelectorAll('.faq-btn').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
            // document.querySelectorAll('.faq-answer').forEach(ans => ans.hidden = true);

            // Toggle the current accordion
            button.setAttribute('aria-expanded', !isExpanded);
            const answer = button.nextElementSibling;

            if (!isExpanded) {
                answer.hidden = false;
                // Add soft fade-in
                answer.style.opacity = 0;
                setTimeout(() => answer.style.opacity = 1, 50);
                answer.style.transition = "opacity 0.3s ease";
            } else {
                answer.hidden = true;
            }
        });
    });

    // 5. Contact Form Validation (Client Side)
    const contactForm = document.getElementById('contact-form');
    const emailInput = document.getElementById('email');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameValue = document.getElementById('name').value.trim();
            const emailValue = emailInput.value.trim();
            const messageValue = document.getElementById('message').value.trim();

            // Construct WhatsApp link
            const waMessage = encodeURIComponent(`Hola, mi nombre es ${nameValue}.\nEmail: ${emailValue}\n\nMensaje:\n${messageValue}`);
            const waUrl = `https://wa.me/525575015163?text=${waMessage}`;

            // Open WhatsApp
            window.open(waUrl, '_blank');

            // UI Feedback
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = '¡Abriendo WhatsApp! 📱';
            submitBtn.style.backgroundColor = '#25D366';
            submitBtn.style.borderColor = '#25D366';

            contactForm.reset();

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.borderColor = '';
            }, 3000);
        });
    }

    // 6. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(element => {
        revealObserver.observe(element);
    });

    // 7. Tracking Hooks (Simulated GA4 events)
    document.querySelectorAll('[data-track]').forEach(element => {
        element.addEventListener('click', (e) => {
            const trackId = element.getAttribute('data-track');

            // Log to console for debugging
            console.log(`Tracking Event Triggered: ${trackId}`);

            // If gtag is available (Google Analytics)
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'click', {
                    'event_category': 'conversion_funnel',
                    'event_label': trackId
                });
            }
        });
    });

    // 8. Syllabus Toggle Logic
    const syllabusButtons = document.querySelectorAll('.syllabus-toggle');
    syllabusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';

            btn.setAttribute('aria-expanded', !isExpanded);
            btn.textContent = !isExpanded ? 'Ocultar Temario' : 'Ver Temario';

            if (!isExpanded) {
                content.hidden = false;
                content.style.opacity = 0;
                content.style.height = '0px';
                content.style.overflow = 'hidden';

                // Trigger reflow
                content.offsetHeight;

                content.style.transition = "opacity 0.3s ease, height 0.3s ease";
                content.style.opacity = 1;
                content.style.height = content.scrollHeight + 'px';

                setTimeout(() => {
                    content.style.height = 'auto';
                    content.style.overflow = 'visible';
                }, 300);
            } else {
                content.style.height = content.scrollHeight + 'px';
                content.style.overflow = 'hidden';

                // Trigger reflow
                content.offsetHeight;

                content.style.transition = "opacity 0.3s ease, height 0.3s ease";
                content.style.opacity = 0;
                content.style.height = '0px';

                setTimeout(() => {
                    content.hidden = true;
                }, 300);
            }
        });
    });

    // 9. Legacy Image Carousel Logic
    const legacySlides = document.querySelectorAll('.legacy-gallery .gallery-img');
    const legacyDots = document.querySelectorAll('.legacy-gallery .indicator');
    const legacyPrevBtn = document.querySelector('.legacy-gallery .gallery-btn.prev');
    const legacyNextBtn = document.querySelector('.legacy-gallery .gallery-btn.next');

    if (legacySlides.length > 0 && legacyPrevBtn && legacyNextBtn) {
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            legacySlides.forEach(s => s.classList.remove('active'));
            legacyDots.forEach(d => d.classList.remove('active'));

            legacySlides[index].classList.add('active');
            legacyDots[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() {
            let nextIndex = (currentSlide + 1) % legacySlides.length;
            showSlide(nextIndex);
        }

        function prevSlide() {
            let prevIndex = (currentSlide - 1 + legacySlides.length) % legacySlides.length;
            showSlide(prevIndex);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 4000);
        }

        legacyPrevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });

        legacyNextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });

        legacyDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showSlide(idx);
                resetInterval();
            });
        });

        resetInterval(); // Start auto carousel
    }

    // 9.5 Testimonials Carousel Logic
    const testmonialSlides = document.querySelectorAll('.testimonial-img');
    const testmonialDots = document.querySelectorAll('.testimonial-indicator');
    const testmonialPrevBtn = document.querySelector('.testimonials-prev');
    const testmonialNextBtn = document.querySelector('.testimonials-next');

    if (testmonialSlides.length > 0 && testmonialPrevBtn && testmonialNextBtn) {
        let currentTestimonialSlide = 0;
        let testimonialSlideInterval;

        function showTestimonialSlide(index) {
            testmonialSlides.forEach(s => s.classList.remove('active'));
            testmonialDots.forEach(d => d.classList.remove('active'));

            testmonialSlides[index].classList.add('active');
            testmonialDots[index].classList.add('active');
            currentTestimonialSlide = index;
        }

        function nextTestimonialSlide() {
            let nextIndex = (currentTestimonialSlide + 1) % testmonialSlides.length;
            showTestimonialSlide(nextIndex);
        }

        function prevTestimonialSlide() {
            let prevIndex = (currentTestimonialSlide - 1 + testmonialSlides.length) % testmonialSlides.length;
            showTestimonialSlide(prevIndex);
        }

        function resetTestimonialInterval() {
            clearInterval(testimonialSlideInterval);
            testimonialSlideInterval = setInterval(nextTestimonialSlide, 4000);
        }

        testmonialPrevBtn.addEventListener('click', () => {
            prevTestimonialSlide();
            resetTestimonialInterval();
        });

        testmonialNextBtn.addEventListener('click', () => {
            nextTestimonialSlide();
            resetTestimonialInterval();
        });

        testmonialDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showTestimonialSlide(idx);
                resetTestimonialInterval();
            });
        });

        // Initialize state, but wait before starting to stagger animations
        setTimeout(() => {
            resetTestimonialInterval();
        }, 2000);
    }

    // 10. Ruffle SWF Interactive Demo Logic
    const ruffleContainer = document.getElementById('ruffle-container');
    const demoButtons = document.querySelectorAll('.demo-btn');

    if (ruffleContainer && typeof window.RufflePlayer !== 'undefined') {
        const ruffle = window.RufflePlayer.newest();
        const player = ruffle.createPlayer();

        // Ruffle config to optimize layout
        player.config = {
            "autoplay": "on",
            "unmuteOverlay": "visible",
            "backgroundColor": "#1E3A5F",
            "letterbox": "on",
            "openUrlMode": "allow"
        };

        ruffleContainer.appendChild(player);

        // Load default SWF explicitly on first load to ensure it shows up right
        const defaultSwf = demoButtons.length > 0 ? demoButtons[0].getAttribute('data-swf') : null;
        if (defaultSwf) {
            player.load(defaultSwf);
        }

        // Handle button clicks to switch between SWF demos
        demoButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const swfSrc = btn.getAttribute('data-swf');

                if (swfSrc) {
                    player.load(swfSrc);

                    // Update Active States for styling
                    demoButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // Update fullscreen link
                    const fullscreenBtn = document.getElementById('btn-fullscreen-demo');
                    if (fullscreenBtn) {
                        fullscreenBtn.href = `visor-interactivo.html?swf=${swfSrc}`;
                    }

                    // Optional Analytics tracking specifically for the demo interaction
                    if (typeof window.gtag === 'function') {
                        window.gtag('event', 'demo_loaded', {
                            'event_category': 'interactive_demo',
                            'event_label': swfSrc
                        });
                    }
                }
            });
        });
    }

    // --- LIGHTBOX LOGIC ---
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox && lightboxImg) {
        // Open lightbox for preview images and hero image
        const clickables = document.querySelectorAll('.real-doc-preview img, .hero-real-image');

        clickables.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxCaption.textContent = img.alt || "";
                lightbox.style.display = 'block';
                // Force reflow for transition
                lightbox.offsetHeight;
                lightbox.classList.add('active');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            setTimeout(() => {
                lightbox.style.display = 'none';
            }, 300);
        };

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

});

// --- PROMO CAROUSEL LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.promo-carousel');
    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.promo-slide');
        let currentSlide = 0;
        if (slides.length <= 1) return;

        setInterval(() => {
            slides[currentSlide].style.opacity = '0';
            slides[currentSlide].classList.remove('active');

            currentSlide = (currentSlide + 1) % slides.length;

            slides[currentSlide].style.opacity = '1';
            slides[currentSlide].classList.add('active');
        }, 3500); // Change image every 3.5 seconds
    });
});
