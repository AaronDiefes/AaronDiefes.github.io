/**
 * Accessible Tab Implementation
 * WCAG 2.1 compliant tabbed interface with keyboard navigation
 * Follows WAI-ARIA Authoring Practices for Tabs pattern
 */

(function() {
    'use strict';

    /**
     * Initialize all tablists on the page
     */
    function initTabs() {
        const tablists = document.querySelectorAll('[role="tablist"]');

        if (tablists.length === 0) {
            return; // No tabs found, exit gracefully
        }

        tablists.forEach(tablist => {
            const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));

            if (tabs.length === 0) {
                return; // No tabs in this tablist
            }

            // Bind click handlers
            tabs.forEach(tab => {
                tab.addEventListener('click', handleTabClick);
                tab.addEventListener('keydown', handleTabKeydown);
            });

            // Initialize first tab as selected if none are selected
            const selectedTab = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');
            if (!selectedTab && tabs.length > 0) {
                selectTab(tabs[0]);
            } else if (selectedTab) {
                selectTab(selectedTab);
            }
        });
    }

    /**
     * Handle tab click events
     */
    function handleTabClick(event) {
        selectTab(event.currentTarget);
    }

    /**
     * Handle keyboard navigation
     */
    function handleTabKeydown(event) {
        const tab = event.currentTarget;
        const tablist = tab.closest('[role="tablist"]');
        const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
        const currentIndex = tabs.indexOf(tab);

        let targetTab = null;

        switch (event.key) {
            case 'ArrowRight':
                event.preventDefault();
                targetTab = tabs[(currentIndex + 1) % tabs.length]; // Wrap to first
                break;

            case 'ArrowLeft':
                event.preventDefault();
                targetTab = tabs[(currentIndex - 1 + tabs.length) % tabs.length]; // Wrap to last
                break;

            case 'Home':
                event.preventDefault();
                targetTab = tabs[0];
                break;

            case 'End':
                event.preventDefault();
                targetTab = tabs[tabs.length - 1];
                break;

            default:
                return; // Don't handle other keys
        }

        if (targetTab) {
            selectTab(targetTab);
            targetTab.focus();
        }
    }

    /**
     * Select a tab and show its associated panel
     * @param {HTMLElement} tab - The tab element to select
     */
    function selectTab(tab) {
        const tablist = tab.closest('[role="tablist"]');
        const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));

        // Get the panel ID from aria-controls
        const panelId = tab.getAttribute('aria-controls');
        if (!panelId) {
            console.warn('Tab missing aria-controls attribute:', tab);
            return;
        }

        const panel = document.getElementById(panelId);
        if (!panel) {
            console.warn('Panel not found for ID:', panelId);
            return;
        }

        // Update all tabs in this tablist
        tabs.forEach(t => {
            const isSelected = t === tab;

            // Update ARIA attributes
            t.setAttribute('aria-selected', isSelected ? 'true' : 'false');
            t.setAttribute('tabindex', isSelected ? '0' : '-1');

            // Update associated panels
            const tPanelId = t.getAttribute('aria-controls');
            if (tPanelId) {
                const tPanel = document.getElementById(tPanelId);
                if (tPanel) {
                    if (isSelected) {
                        tPanel.removeAttribute('hidden');
                    } else {
                        tPanel.setAttribute('hidden', '');
                    }
                }
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTabs);
    } else {
        initTabs();
    }
})();
