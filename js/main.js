const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Открыть меню');
    });
  });
}

// FAQ: only one open at a time on mobile-friendly accordion
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
        const message = result.error || 'Не удалось отправить форму';
        throw new Error(message);
      }

      if (typeof ym === 'function') {
        ym(window.YANDEX_METRIKA_ID, 'reachGoal', 'lead_submit');
      }

      formStatus.classList.add('is-success');
      formStatus.textContent = 'Заявка принята! Свяжемся в течение 24 часов.';
      leadForm.reset();
    } catch {
      formStatus.classList.add('is-error');
      formStatus.textContent = 'Ошибка отправки. Напишите в Telegram: @antonbutov';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// Telegram / phone click goals
document.querySelectorAll('[data-goal]').forEach((el) => {
  el.addEventListener('click', () => {
    const goal = el.dataset.goal;
    if (typeof ym === 'function' && goal) {
      ym(window.YANDEX_METRIKA_ID, 'reachGoal', goal);
    }
  });
});
