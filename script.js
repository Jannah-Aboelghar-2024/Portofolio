

document.addEventListener('DOMContentLoaded', () => {

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    /* -------------------------------------------------------------------------- */
    /*                          Active Link Highlighting                          */
    /* -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section, header.hero');

    const observerOptions = {
        threshold: 0.4,
        rootMargin: "-10% 0px -10% 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(link => {
                    link.classList.remove('active');
                    link.setAttribute('aria-current', 'false');
                });

                const id = entry.target.getAttribute('id');
                let activeLink;

                if (id) {
                    activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                } else if (entry.target.classList.contains('hero')) {
                    // Hero usually maps to the logo or nothing, but lets assumes it maps to 'About' or Home if exists
                    // Actually, often Hero is just the start.
                    // The prompt says "First visible section active".
                    // If hero is active, maybe no link is active, or 'About' if it's the first link.
                    // Let's leave it blank if no ID match, OR check if there is a specific home link.
                }

                if (activeLink) {
                    activeLink.classList.add('active');
                    activeLink.setAttribute('aria-current', 'page');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            const spans = hamburger.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => {
                navLinks.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                if (spans.length === 3) {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }, 150);
        });
    });

    const treeContainer = document.querySelector('.tree-container');
    const branches = document.querySelectorAll('.branch');
    const trunk = document.querySelector('.tree-trunk');

    if (treeContainer && window.innerWidth > 900) {

        const highlightPath = (targetBranch) => {

            if (trunk) trunk.classList.add('active');

            branches.forEach(branch => {
                if (branch === targetBranch) {
                    branch.classList.add('active');
                    branch.classList.remove('dimmed');
                } else {
                    branch.classList.remove('active');
                    branch.classList.add('dimmed');
                }
            });
        };

        const resetTree = () => {
            if (trunk) trunk.classList.remove('active');
            branches.forEach(b => {
                b.classList.remove('active');
                b.classList.remove('dimmed');
            });
        };

        treeContainer.addEventListener('mouseover', (e) => {

            const branch = e.target.closest('.branch');

            if (branch) {
                highlightPath(branch);
            }
        });

        treeContainer.addEventListener('mouseout', (e) => {

            if (!treeContainer.contains(e.relatedTarget)) {
                resetTree();
            }
        });

        treeContainer.addEventListener('focusin', (e) => {
            const branch = e.target.closest('.branch');
            if (branch) highlightPath(branch);
        });

        treeContainer.addEventListener('focusout', (e) => {

            setTimeout(() => {
                if (!treeContainer.contains(document.activeElement)) {
                    resetTree();
                }
            }, 10);
        });
    }

    const timelineTriggers = document.querySelectorAll('.timeline-item .accordion-trigger');

    if (timelineTriggers.length > 0) {
        timelineTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const contentId = trigger.getAttribute('aria-controls');
                const content = document.getElementById(contentId);
                const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

                timelineTriggers.forEach(otherTrigger => {
                    if (otherTrigger !== trigger) {
                        const otherContent = document.getElementById(otherTrigger.getAttribute('aria-controls'));
                        otherTrigger.setAttribute('aria-expanded', 'false');
                        if (otherContent) {
                            otherContent.classList.remove('is-open');
                            otherContent.setAttribute('hidden', '');
                        }
                    }
                });

                if (!isExpanded) {
                    trigger.setAttribute('aria-expanded', 'true');
                    content.removeAttribute('hidden');
                    requestAnimationFrame(() => content.classList.add('is-open'));
                } else {
                    trigger.setAttribute('aria-expanded', 'false');
                    content.classList.remove('is-open');
                    setTimeout(() => content.setAttribute('hidden', ''), 300);
                }
            });
        });
    }

    const projectCards = document.querySelectorAll('.project-card');
    const modalOverlay = document.getElementById('project-modal');
    const modalWrapper = modalOverlay ? modalOverlay.querySelector('.modal-wrapper') : null;
    const modalContent = modalOverlay ? modalOverlay.querySelector('.modal-content') : null;
    const modalCloseBtn = modalOverlay ? modalOverlay.querySelector('.modal-close') : null;
    let lastFocusedElement = null;

    if (projectCards.length > 0 && modalOverlay) {

        const openModal = (card) => {
            lastFocusedElement = document.activeElement;

            const title = card.querySelector('h3').textContent;
            const badge = card.querySelector('.project-badge').textContent;
            const year = card.querySelector('.project-year').textContent;
            const details = card.querySelector('.project-details').innerHTML;

            modalContent.innerHTML = `
                <div class="modal-header-meta">
                    <span class="project-badge">${badge}</span>
                    <span class="project-year">${year}</span>
                </div>
                <h3>${title}</h3>
                ${details}
            `;

            modalOverlay.classList.add('is-active');
            modalOverlay.setAttribute('aria-hidden', 'false');

            modalWrapper.focus();
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modalOverlay.classList.remove('is-active');
            modalOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';

            if (lastFocusedElement) lastFocusedElement.focus();
        };

        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                openModal(card);
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(card);
                }
            });
        });

        modalCloseBtn.addEventListener('click', closeModal);

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (modalOverlay.classList.contains('is-active') && e.key === 'Escape') {
                closeModal();
            }
        });

        modalWrapper.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusables = modalWrapper.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const first = focusables[0];
                const last = focusables[focusables.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        });
    }

    const renderProjectLinks = () => {
        projectCards.forEach(card => {
            const rawLinks = card.getAttribute('data-links');
            if (!rawLinks) return;

            try {
                const links = JSON.parse(rawLinks);
                if (!Array.isArray(links) || links.length === 0) return;

                const detailsDiv = card.querySelector('.project-details');
                if (!detailsDiv) return;

                const linksContainer = document.createElement('div');
                linksContainer.className = 'project-links';

                links.forEach(link => {
                    const a = document.createElement('a');
                    a.href = link.url;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.className = 'link-btn';
                    a.setAttribute('data-platform', link.platform);

                    let iconClass = 'fa-solid fa-link';
                    let label = 'View Project';

                    switch (link.platform) {
                        case 'instagram':
                            iconClass = 'fa-brands fa-instagram';
                            label = 'View on Instagram';
                            break;
                        case 'youtube':
                            iconClass = 'fa-brands fa-youtube';
                            label = 'Watch on YouTube';
                            break;
                        case 'article':
                            iconClass = 'fa-solid fa-newspaper';
                            label = 'Read Article';
                            break;
                        case 'website':
                            iconClass = 'fa-solid fa-globe';
                            label = 'Visit Website';
                            break;
                    }

                    a.setAttribute('aria-label', label);
                    a.innerHTML = `<i class="${iconClass}"></i>`;
                    linksContainer.appendChild(a);
                });

                detailsDiv.appendChild(linksContainer);

            } catch (e) {
                console.warn('Invalid JSON in data-links:', rawLinks);
            }
        });
    };

    renderProjectLinks();

});
