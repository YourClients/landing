const menuToggler = document.querySelector('.menu-toggler');
const navbarNav = document.querySelector('.navbar-nav');
const YANDEX_METRIKA_COUNTER_ID = 109704360;

function reachMetrikaGoal(goalName) {
  if (typeof window !== 'undefined' && typeof window.ym === 'function' && goalName) {
    window.ym(YANDEX_METRIKA_COUNTER_ID, 'reachGoal', goalName);
  }
}

if (menuToggler && navbarNav) {
  menuToggler.addEventListener('click', () => {
    const isOpen = navbarNav.classList.toggle('is-open');
    menuToggler.setAttribute('aria-expanded', String(isOpen));
    menuToggler.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  });

  navbarNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navbarNav.classList.remove('is-open');
      menuToggler.setAttribute('aria-expanded', 'false');
      menuToggler.setAttribute('aria-label', 'Открыть меню');
    });
  });
}

// Tabs
const tabButtons = document.querySelectorAll('[data-tab]');
const tabPanels = document.querySelectorAll('[data-tab-panel]');

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.tab;
    tabButtons.forEach((b) => b.classList.toggle('is-active', b === btn));
    tabPanels.forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.tabPanel === id);
    });
  });
});

// FAQ: one open at a time
const faqItems = document.querySelectorAll('.faq__item');
faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

// Lead form → Formspree
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xreveddq';
const leadForm = document.getElementById('lead-form');
const formStatus = document.getElementById('form-status');

if (leadForm && formStatus) {
  const submitBtn = leadForm.querySelector('button[type="submit"]');

  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!leadForm.checkValidity()) {
      leadForm.reportValidity();
      return;
    }

    const data = new FormData(leadForm);

    formStatus.hidden = false;
    formStatus.className = 'form-status';
    formStatus.textContent = 'Отправляем…';
    if (submitBtn) submitBtn.disabled = true;

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || 'Не удалось отправить форму');
      }

      reachMetrikaGoal('lead_form_submit');
      reachMetrikaGoal('call');

      formStatus.classList.add('is-success');
      formStatus.textContent = 'Заявка принята! Свяжемся в течение 24 часов.';
      leadForm.reset();
    } catch {
      formStatus.classList.add('is-error');
      formStatus.textContent = 'Ошибка отправки. Напишите на mail@antonbutov.com или в Telegram: @antonbutov';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

document.querySelectorAll('a[href="#forma"]').forEach((link) => {
  link.addEventListener('click', () => {
    reachMetrikaGoal('cta_to_form');
  });
});

document.querySelectorAll('a[href^="https://t.me/antonbutov"]').forEach((link) => {
  link.addEventListener('click', () => {
    reachMetrikaGoal('telegram_click');
    reachMetrikaGoal('call');
  });
});
