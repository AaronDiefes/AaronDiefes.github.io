/**
 * Site Navigation - Accessible Hamburger Menu
 * Handles mobile menu toggle with ARIA, keyboard, and click-outside support
 */

(function() {
  'use strict';

  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-links');

  if (!toggle || !menu) return;

  // Set active state based on current page
  const currentPath = window.location.pathname;
  const navLinks = menu.querySelectorAll('a');

  navLinks.forEach(function(link) {
    const href = link.getAttribute('href');

    // Handle homepage
    if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
      if (href === 'index.html' || href === '#' || href === '/') {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    }
    // Handle project pages (demo, docs, admin)
    else if (href && !href.startsWith('http') && !href.startsWith('#')) {
      if (currentPath.includes(href) || href.includes(currentPath.split('/').pop())) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    }
  });

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
