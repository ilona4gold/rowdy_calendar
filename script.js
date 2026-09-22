/*
   TACTICAL ART GALLERY CALENDAR JAVASCRIPT
   Clean, vanilla, lightweight.
   Manages image fallbacks, smooth scroll triggers, and target flashing.
*/

document.addEventListener('DOMContentLoaded', () => {
    setupImageFallbacks();
    setupActiveMonthTracking();
    setupNavigationScrolls();
    handleInitialHash();
});

/**
 * Automatically detects broken images and replaces them with a gorgeous,
 * stylized placeholder, ensuring the layout remains functional and professional
 * even if some illustration assets are missing on disk.
 */
function setupImageFallbacks() {
    const calendarImages = document.querySelectorAll('.calendar-img');
    
    calendarImages.forEach(img => {
        // If image fails to load, swap it with a gorgeous placeholder
        img.addEventListener('error', function() {
            const monthName = this.getAttribute('data-month-name') || 'МЕСЯЦ';
            const card = this.closest('.illustration-card');
            
            if (card) {
                const placeholder = document.createElement('div');
                placeholder.className = 'img-placeholder';
                placeholder.innerHTML = `
                    <div class="placeholder-text">
                        <span class="placeholder-title">${monthName}</span>
                        <span class="placeholder-status">ИЛЛЮСТРАЦИЯ В РАБОТЕ // ART IN PROGRESS</span>
                    </div>
                `;
                this.replaceWith(placeholder);
            }
        });
        
        // Trigger error handler if already broken before listener was added
        if (img.complete && img.naturalWidth === 0) {
            img.dispatchEvent(new Event('error'));
        }
    });
}

/**
 * Uses IntersectionObserver to track which month block is currently
 * active in the viewport and highlights the corresponding menu item in the sidebar.
 */
function setupActiveMonthTracking() {
    const blocks = document.querySelectorAll('.month-block');
    const menuItems = document.querySelectorAll('.month-menu-item');
    
    if (blocks.length === 0 || menuItems.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Center-biased viewport tracking
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                
                // Remove active class from all menu items on this page
                menuItems.forEach(item => {
                    const link = item.querySelector('a');
                    if (link) {
                        const href = link.getAttribute('href');
                        if (href && (href === `#${id}` || href.endsWith(`#${id}`))) {
                            item.classList.add('active-month');
                        } else {
                            item.classList.remove('active-month');
                        }
                    }
                });
            }
        });
    }, observerOptions);
    
    blocks.forEach(block => observer.observe(block));
}

/**
 * Handles smooth scrolling and flashing animations when clicking links.
 */
function setupNavigationScrolls() {
    const links = document.querySelectorAll('.month-menu-item a, .page-dot-link');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Check if this is an anchor to the current page
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    triggerFlashAnimation(targetElement);
                    
                    // Update URL hash without scrolling
                    history.pushState(null, null, href);
                }
            }
        });
    });
}

/**
 * Triggers a beautiful flash animation on the illustration card of the target month block.
 */
function triggerFlashAnimation(element) {
    const card = element.querySelector('.illustration-card');
    if (card) {
        card.classList.remove('flash-active');
        // Force reflow to restart animation
        void card.offsetWidth;
        card.classList.add('flash-active');
    }
}

/**
 * Checks if the page was loaded with a hash (e.g. index.html#march)
 * and scrolls/flashes the target month block if it exists.
 */
function handleInitialHash() {
    const hash = window.location.hash;
    if (hash) {
        // Delay slightly to allow layout calculations to settle and scroll smoothly
        setTimeout(() => {
            const targetId = hash.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                triggerFlashAnimation(targetElement);
            }
        }, 300);
    }
}
