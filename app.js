(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');

  function setOpen(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    var desktop = window.matchMedia('(min-width: 1080px)');
    var onChange = function (m) { if (m.matches) setOpen(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
  }

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Forms: validate in the browser and show an inline thank-you. Nothing is sent anywhere.
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  document.querySelectorAll('form.js-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        var value = field.value.trim();
        var valid = value.length > 0 && (field.type !== 'email' || emailRe.test(value));
        field.setAttribute('aria-invalid', valid ? 'false' : 'true');
        if (!valid) ok = false;
      });

      var error = form.querySelector('.form-error');
      if (!ok) {
        if (error) error.hidden = false;
        var first = form.querySelector('[aria-invalid="true"]');
        if (first) first.focus();
        return;
      }
      if (error) error.hidden = true;

      var success = form.parentElement.querySelector('.form-success');
      var nameField = form.querySelector('[name="name"]');
      var nameSlot = success ? success.querySelector('.js-name') : null;
      if (nameSlot && nameField && nameField.value.trim()) {
        nameSlot.textContent = ', ' + nameField.value.trim().split(/\s+/)[0];
      }
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.focus();
      }
    });

    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true') {
        e.target.removeAttribute('aria-invalid');
      }
    });
  });
})();
