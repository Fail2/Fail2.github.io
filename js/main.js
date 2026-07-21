(function () {
	'use strict';

	/* Sticky nav shadow on scroll */
	var nav = document.querySelector('.site-nav');
	function updateNavShadow() {
		if (window.scrollY > 8) {
			nav.classList.add('is-scrolled');
		} else {
			nav.classList.remove('is-scrolled');
		}
	}
	if (nav) {
		updateNavShadow();
		window.addEventListener('scroll', updateNavShadow, { passive: true });
	}

	/* Mobile nav toggle */
	var toggle = document.querySelector('.nav-toggle');
	var links = document.querySelector('.nav-links');
	if (toggle && links) {
		toggle.addEventListener('click', function () {
			links.classList.toggle('is-open');
		});
		links.querySelectorAll('a').forEach(function (link) {
			link.addEventListener('click', function () {
				links.classList.remove('is-open');
			});
		});
	}

	/* Scroll-spy: highlight the nav link for the section in view */
	var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
	var sections = Array.prototype.map.call(navLinks, function (link) {
		return document.querySelector(link.getAttribute('href'));
	}).filter(Boolean);

	if (sections.length && 'IntersectionObserver' in window) {
		var spy = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				var id = '#' + entry.target.id;
				navLinks.forEach(function (link) {
					link.classList.toggle('is-active', link.getAttribute('href') === id);
				});
			});
		}, { rootMargin: '-40% 0px -55% 0px' });
		sections.forEach(function (section) { spy.observe(section); });
	}

	/* Contact form: open a pre-filled mailto instead of submitting anywhere */
	var form = document.getElementById('contactForm');
	if (form) {
		form.addEventListener('submit', function (event) {
			event.preventDefault();
			var name = document.getElementById('name').value;
			var email = document.getElementById('email').value;
			var message = document.getElementById('message').value;
			var subject = 'Portfolio contact from ' + name;
			var body = message + '\n\nFrom: ' + name + ' (' + email + ')';
			window.location.href = 'mailto:malaychakma54@gmail.com?subject=' +
				encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
		});
	}

	/* Visitor counter: always visible, increments the shared count only the
	   first time this browser has ever loaded the page. */
	(function () {
		var NAMESPACE = 'fail2-github-io-portfolio';
		var KEY = 'visits';
		var STORAGE_KEY = 'malay_portfolio_visited';

		var countEl = document.getElementById('visitorCount');
		if (!countEl) return;

		var isNewVisitor = !localStorage.getItem(STORAGE_KEY);
		var endpoint = isNewVisitor
			? 'https://abacus.jasoncameron.dev/hit/' + NAMESPACE + '/' + KEY
			: 'https://abacus.jasoncameron.dev/get/' + NAMESPACE + '/' + KEY;

		fetch(endpoint)
			.then(function (res) { return res.json(); })
			.then(function (data) {
				if (isNewVisitor) localStorage.setItem(STORAGE_KEY, '1');
				countEl.textContent = data.value.toLocaleString();
			})
			.catch(function () {
				countEl.textContent = '—';
			});
	})();
})();
