/* =========================================================
   Мобильное меню (бургер)
   ========================================================= */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
  burger.addEventListener('click', function () {
    burger.classList.toggle('is-open');
    nav.classList.toggle('is-open');
  });

  // Закрываем меню при клике по ссылке
  var navLinks = nav.querySelectorAll('a');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      burger.classList.remove('is-open');
      nav.classList.remove('is-open');
    });
  });
}

/* =========================================================
   Анимация появления блоков при скролле (IntersectionObserver)
   ========================================================= */
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach(function (el) {
    observer.observe(el);
  });
} else {
  // Fallback для старых браузеров
  revealElements.forEach(function (el) {
    el.classList.add('is-visible');
  });
}

/* =========================================================
   Табы в блоке «Отзывы»
   ========================================================= */
const reviewTabs = document.querySelectorAll('.reviews__tab');
const reviewSlides = document.querySelectorAll('.reviews__slide');

reviewTabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    var idx = tab.dataset.review;

    reviewTabs.forEach(function (t) {
      t.classList.remove('is-active');
    });
    tab.classList.add('is-active');

    reviewSlides.forEach(function (slide) {
      slide.classList.toggle('is-active', slide.dataset.slide === idx);
    });
  });
});

/* =========================================================
   Калькулятор стоимости
   ========================================================= */
const calcButtons = document.querySelectorAll('.calc-btn');
const calcTotalEl = document.getElementById('calcTotal');

if (calcButtons.length && calcTotalEl) {
  var selected = {};

  // Инициализация начальных значений (у активных кнопок)
  calcButtons.forEach(function (btn) {
    if (btn.classList.contains('is-active')) {
      selected[btn.dataset.group] = Number(btn.dataset.price);
    }
  });

  function recalculate() {
    var total = 0;
    for (var key in selected) {
      if (Object.prototype.hasOwnProperty.call(selected, key)) {
        total += selected[key];
      }
    }
    calcTotalEl.textContent = total.toLocaleString('ru-RU');
  }

  calcButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var group = btn.dataset.group;

      // В группе активна только одна кнопка
      document
        .querySelectorAll('.calc-btn[data-group="' + group + '"]')
        .forEach(function (b) {
          b.classList.remove('is-active');
        });

      btn.classList.add('is-active');
      selected[group] = Number(btn.dataset.price);
      recalculate();
    });
  });

  recalculate();
}

/* =========================================================
   FAQ — аккордеон (закрываем остальные при открытии одного)
   ========================================================= */
const faqItems = document.querySelectorAll('.faq__item');

faqItems.forEach(function (item) {
  item.addEventListener('toggle', function () {
    if (item.open) {
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.open = false;
        }
      });
    }
  });
});

/* =========================================================
   Форма обратной связи (AJAX)
   ========================================================= */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function showStatus(text, type) {
  if (!formStatus) return;
  formStatus.textContent = text;
  formStatus.classList.remove('is-error', 'is-success');
  if (type === 'error') formStatus.classList.add('is-error');
  if (type === 'success') formStatus.classList.add('is-success');
}

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameEl = document.getElementById('name');
    var contactEl = document.getElementById('contact');
    var messageEl = document.getElementById('message');
    var consentEl = document.getElementById('consent');

    var name = nameEl.value.trim();
    var contact = contactEl.value.trim();
    var message = messageEl.value.trim();
    var consent = consentEl.checked;

    // Валидация на клиенте
    if (!name || !contact || !message) {
      showStatus('Заполните все поля.', 'error');
      return;
    }
    if (!consent) {
      showStatus('Необходимо согласие на обработку данных.', 'error');
      return;
    }

    showStatus('Отправка...', '');

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        contact: contact,
        message: message,
        consent: true,
      }),
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok && result.data.ok) {
          showStatus(result.data.message || 'Спасибо! Сообщение отправлено.', 'success');
          contactForm.reset();
        } else {
          showStatus(result.data.error || 'Ошибка отправки.', 'error');
        }
      })
      .catch(function () {
        showStatus('Ошибка сети. Попробуйте ещё раз.', 'error');
      });
  });
}