/**
 * DSGVO Cookie Consent Banner
 * Aktives Leben – Praxis für Ergotherapie
 * Blockiert externe Dienste (Google Fonts, Maps) bis zur Einwilligung.
 */
(function () {
    'use strict';

    const CONSENT_KEY = 'cookie_consent';
    const CONSENT_VERSION = '1';

    const CATEGORIES = {
        necessary: {
            label: 'Notwendig',
            description: 'Technisch erforderlich für die Funktion der Website.',
            locked: true
        },
        functional: {
            label: 'Funktional',
            description: 'Externe Schriftarten (Google Fonts) & eingebettete Karten (Google Maps) für eine optimale Darstellung.',
            default: false
        }
    };

    // ========== CONSENT LOGIC ==========

    function getConsent() {
        try {
            const data = JSON.parse(localStorage.getItem(CONSENT_KEY));
            if (data && data.version === CONSENT_VERSION) return data;
        } catch (e) { /* ignore */ }
        return null;
    }

    function saveConsent(categories) {
        const data = {
            version: CONSENT_VERSION,
            timestamp: new Date().toISOString(),
            categories: categories
        };
        localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    }

    function acceptAll() {
        const cats = {};
        Object.keys(CATEGORIES).forEach(function (k) { cats[k] = true; });
        saveConsent(cats);
        hideBanner();
        applyConsent(cats);
    }

    function acceptNecessaryOnly() {
        const cats = {};
        Object.keys(CATEGORIES).forEach(function (k) {
            cats[k] = CATEGORIES[k].locked || false;
        });
        saveConsent(cats);
        hideBanner();
        applyConsent(cats);
    }

    function acceptSelected() {
        const cats = {};
        Object.keys(CATEGORIES).forEach(function (k) {
            if (CATEGORIES[k].locked) {
                cats[k] = true;
            } else {
                var checkbox = document.getElementById('consent-' + k);
                cats[k] = checkbox ? checkbox.checked : false;
            }
        });
        saveConsent(cats);
        hideBanner();
        applyConsent(cats);
    }

    // ========== APPLY CONSENT ==========

    function applyConsent(categories) {
        if (categories.functional) {
            loadBlockedResources();
        }
    }

    function loadBlockedResources() {
        // Load blocked stylesheets (Google Fonts etc.)
        document.querySelectorAll('link[data-consent-src]').forEach(function (el) {
            el.href = el.getAttribute('data-consent-src');
            el.removeAttribute('data-consent-src');
        });

        // Load blocked scripts
        document.querySelectorAll('script[data-consent-src]').forEach(function (el) {
            var script = document.createElement('script');
            script.src = el.getAttribute('data-consent-src');
            if (el.getAttribute('data-consent-async')) script.async = true;
            el.parentNode.replaceChild(script, el);
        });

        // Load blocked iframes (Google Maps etc.)
        document.querySelectorAll('[data-consent-iframe]').forEach(function (el) {
            var iframe = document.createElement('iframe');
            iframe.src = el.getAttribute('data-consent-iframe');
            ['width', 'height', 'style', 'allowfullscreen', 'loading', 'referrerpolicy', 'title'].forEach(function (attr) {
                if (el.getAttribute(attr)) iframe.setAttribute(attr, el.getAttribute(attr));
            });
            el.parentNode.replaceChild(iframe, el);
        });
    }

    // ========== UI ==========

    function showBanner() {
        var banner = document.getElementById('cookie-consent-banner');
        if (!banner) {
            banner = createBanner();
            document.body.appendChild(banner);
        }
        requestAnimationFrame(function () {
            banner.classList.add('cc-visible');
        });
    }

    function hideBanner() {
        var banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('cc-visible');
            setTimeout(function () { banner.remove(); }, 400);
        }
    }

    function createBanner() {
        var banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Cookie-Einstellungen');

        var categoriesHTML = '';
        Object.keys(CATEGORIES).forEach(function (key) {
            var cat = CATEGORIES[key];
            categoriesHTML +=
                '<label class="cc-category ' + (cat.locked ? 'cc-locked' : '') + '">' +
                '<input type="checkbox" id="consent-' + key + '" ' + (cat.locked || cat.default ? 'checked' : '') + ' ' + (cat.locked ? 'disabled' : '') + '>' +
                '<span class="cc-checkmark"></span>' +
                '<span class="cc-cat-info">' +
                '<strong>' + cat.label + '</strong>' +
                '<small>' + cat.description + '</small>' +
                '</span>' +
                '</label>';
        });

        banner.innerHTML =
            '<div class="cc-content">' +
            '<div class="cc-text">' +
            '<h3>🍪 Cookie-Einstellungen</h3>' +
            '<p>Wir verwenden externe Dienste wie Google Fonts und Google Maps, um Ihnen die bestmögliche Erfahrung zu bieten. ' +
            'Diese Dienste können Daten an Server außerhalb der EU übertragen.</p>' +
            '<a href="datenschutz.html" class="cc-privacy-link">Datenschutzerklärung</a>' +
            '</div>' +
            '<div class="cc-details" id="cc-details" hidden>' +
            '<div class="cc-categories">' + categoriesHTML + '</div>' +
            '</div>' +
            '<div class="cc-actions">' +
            '<button class="cc-btn cc-btn-accept" id="cc-accept-all">Alle akzeptieren</button>' +
            '<button class="cc-btn cc-btn-necessary" id="cc-accept-necessary">Nur notwendige</button>' +
            '<button class="cc-btn cc-btn-details" id="cc-toggle-details">Einstellungen</button>' +
            '<button class="cc-btn cc-btn-save" id="cc-save-selected" hidden>Auswahl speichern</button>' +
            '</div>' +
            '</div>';

        banner.querySelector('#cc-accept-all').addEventListener('click', acceptAll);
        banner.querySelector('#cc-accept-necessary').addEventListener('click', acceptNecessaryOnly);
        banner.querySelector('#cc-toggle-details').addEventListener('click', function () {
            var details = banner.querySelector('#cc-details');
            var saveBtn = banner.querySelector('#cc-save-selected');
            var isHidden = details.hidden;
            details.hidden = !isHidden;
            saveBtn.hidden = !isHidden;
            this.textContent = isHidden ? 'Weniger' : 'Einstellungen';
        });
        banner.querySelector('#cc-save-selected').addEventListener('click', acceptSelected);

        return banner;
    }

    // ========== INIT ==========

    function init() {
        var consent = getConsent();
        if (consent) {
            applyConsent(consent.categories);
        } else {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', showBanner);
            } else {
                showBanner();
            }
        }

        // Re-open button handler
        document.addEventListener('click', function (e) {
            if (e.target.closest('[data-cc-reopen]')) {
                e.preventDefault();
                localStorage.removeItem(CONSENT_KEY);
                showBanner();
            }
        });
    }

    init();
})();
