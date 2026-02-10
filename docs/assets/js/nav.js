/**
 * Site Navigation - Accessible Hamburger Menu
 * Handles mobile menu toggle with ARIA, keyboard, and click-outside support
 */

(function() {
  'use strict';

  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-links');

  if (!toggle || !menu) return;

  // Toggle menu on button click
  toggle.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!isExpanded));
    menu.hidden = isExpanded;
  });

  // Close menu on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !menu.hidden) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
      toggle.focus();
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!toggle.contains(e.target) && !menu.contains(e.target) && !menu.hidden) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    }
  });

  // Close menu when clicking a nav link (mobile only)
  menu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
      }
    });
  });
})();
