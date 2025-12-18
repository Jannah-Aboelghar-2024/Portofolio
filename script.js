// Jannah Aboelghar - Portfolio JavaScript
// Optimized for Performance & Accessibility

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle hamburger animation state
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

    // Close menu when clicking link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            if (spans.length === 3) {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    // --- Skills Tree Interaction (Desktop) ---
    // Optimization: Event Delegation on the container instead of multiple listeners
    const treeContainer = document.querySelector('.tree-container');
    const branches = document.querySelectorAll('.branch');
    const trunk = document.querySelector('.tree-trunk');

    if (treeContainer && window.innerWidth > 900) {

        // Helper: Activate a specific branch path
        const highlightPath = (targetBranch) => {
            // 1. Activate Trunk
            if (trunk) trunk.classList.add('active');

            // 2. Manage Branches
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

        // Helper: Reset Tree to neutral state
        const resetTree = () => {
            if (trunk) trunk.classList.remove('active');
            branches.forEach(b => {
                b.classList.remove('active');
                b.classList.remove('dimmed');
            });
        };

        // Event Delegation: One listener for the whole tree
        treeContainer.addEventListener('mouseover', (e) => {
            // Check if hovering over a branch or any of its children (leaves/labels)
            const branch = e.target.closest('.branch');

            if (branch) {
                highlightPath(branch);
            }
        });

        // Use mouseout on container to reset, but check if we really left the tree
        treeContainer.addEventListener('mouseout', (e) => {
            // If the element we are moving TO (relatedTarget) is NOT inside the tree...
            if (!treeContainer.contains(e.relatedTarget)) {
                resetTree();
            }
        });

        // Accessibility: Keyboard focus delegation
        treeContainer.addEventListener('focusin', (e) => {
            const branch = e.target.closest('.branch');
            if (branch) highlightPath(branch);
        });

        treeContainer.addEventListener('focusout', (e) => {
            // Delay slightly to check if focus moved to another element in tree
            setTimeout(() => {
                if (!treeContainer.contains(document.activeElement)) {
                    resetTree();
                }
            }, 10);
        });
    }

    // --- Accordion Interaction (Experience Only) ---
    // Note: Projects now use Modals, so we target .timeline-item .accordion-trigger
    const timelineTriggers = document.querySelectorAll('.timeline-item .accordion-trigger');

    if (timelineTriggers.length > 0) {
        timelineTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const contentId = trigger.getAttribute('aria-controls');
                const content = document.getElementById(contentId);
                const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

                // 1. Close other timeline accordions
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

                // 2. Toggle Current
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

    // --- Project Modal Interaction (New) ---
    const projectCards = document.querySelectorAll('.project-card');
    const modalOverlay = document.getElementById('project-modal');
    const modalWrapper = modalOverlay ? modalOverlay.querySelector('.modal-wrapper') : null;
    const modalContent = modalOverlay ? modalOverlay.querySelector('.modal-content') : null;
    const modalCloseBtn = modalOverlay ? modalOverlay.querySelector('.modal-close') : null;
    let lastFocusedElement = null;

    if (projectCards.length > 0 && modalOverlay) {

        // Open Modal
        const openModal = (card) => {
            lastFocusedElement = document.activeElement;

            // Extract Data
            const title = card.querySelector('h3').textContent;
            const badge = card.querySelector('.project-badge').textContent;
            const year = card.querySelector('.project-year').textContent;
            const details = card.querySelector('.project-details').innerHTML; // Get hidden content

            // Populate Modal
            modalContent.innerHTML = `
                <div class="modal-header-meta">
                    <span class="project-badge">${badge}</span>
                    <span class="project-year">${year}</span>
                </div>
                <h3>${title}</h3>
                ${details}
            `;

            // Show
            modalOverlay.classList.add('is-active');
            modalOverlay.setAttribute('aria-hidden', 'false');

            // Trap Focus
            modalWrapper.focus();
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        };

        // Close Modal
        const closeModal = () => {
            modalOverlay.classList.remove('is-active');
            modalOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';

            // Return Focus
            if (lastFocusedElement) lastFocusedElement.focus();
        };

        // Event Listeners
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                openModal(card);
            });
            // Keyboard Interact (Enter/Space)
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(card);
                }
            });
        });

        // Close Events
        modalCloseBtn.addEventListener('click', closeModal);

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (modalOverlay.classList.contains('is-active') && e.key === 'Escape') {
                closeModal();
            }
        });

        // Focus Trap (Simple)
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

});
