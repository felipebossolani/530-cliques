const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const MONTHS_LC = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

function initCalculator() {
  const input = document.getElementById('birth-year');
  const btn = document.getElementById('calc-btn');
  const result = document.getElementById('calc-result');
  const counter = document.getElementById('click-count');
  const subtitle = document.getElementById('calc-subtitle');
  const message = document.getElementById('calc-message');

  function calculate() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const year = parseInt(input.value, 10);
    if (isNaN(year) || year < 1900 || year > currentYear) {
      input.style.borderColor = '#C0392B';
      return;
    }
    input.style.borderColor = '';

    const clicks = (currentYear - year) * 12 + currentMonth + 2;
    result.hidden = false;

    const duration = 1500;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      counter.textContent = Math.floor(eased * clicks);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        counter.textContent = clicks;
        subtitle.textContent = `São ${clicks} cliques. Numa setinha de 12 pixels. No celular. Com o dedo.`;

        let msg, color;
        if (clicks <= 200) {
          msg = 'Ruim, mas sobrevivível.';
          color = '#F39C12';
        } else if (clicks <= 400) {
          msg = 'Seu dedo já tá doendo.';
          color = '#E67E22';
        } else if (clicks <= 600) {
          msg = 'Você provavelmente desistiria do cadastro.';
          color = '#C0392B';
        } else {
          msg = 'Parabéns, você quebraria o date picker.';
          color = '#C0392B';
        }
        message.textContent = msg;
        message.style.color = color;
      }
    }
    requestAnimationFrame(tick);
  }

  btn.addEventListener('click', calculate);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') calculate();
  });
}

function initPainDemo() {
  const now = new Date();
  let currentMonth = now.getMonth();
  let currentYear = now.getFullYear();
  let clickCount = 0;

  const display = document.getElementById('dp-display');
  const grid = document.getElementById('dp-grid');
  const clicksEl = document.getElementById('dp-clicks');
  const messageEl = document.getElementById('dp-message');
  const prevBtn = document.getElementById('dp-prev');
  const nextBtn = document.getElementById('dp-next');
  const desistoBtn = document.getElementById('btn-desisto');
  const picker = document.getElementById('datepicker');
  const outro = document.getElementById('dp-outro');

  function render() {
    display.textContent = `${MONTHS[currentMonth]} ${currentYear}`;
    grid.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const frag = document.createDocumentFragment();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('span');
      empty.className = 'dp-day empty';
      frag.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const btn = document.createElement('button');
      btn.className = 'dp-day';
      btn.textContent = d;
      btn.addEventListener('click', () => {
        incrementClick();
      });
      frag.appendChild(btn);
    }
    grid.appendChild(frag);
  }

  function incrementClick() {
    clickCount++;
    clicksEl.textContent = clickCount;
    updateMessage();
  }

  function getTarget() {
    const yearInput = document.getElementById('birth-year');
    const year = parseInt(yearInput.value, 10);
    const ref = new Date();
    const refYear = ref.getFullYear();
    if (!isNaN(year) && year >= 1900 && year <= refYear) {
      return (refYear - year) * 12 + ref.getMonth() + 2;
    }
    return 530;
  }

  function updateMessage() {
    const target = getTarget();
    if (clickCount >= 100) {
      messageEl.textContent = 'Ok, acho que você entendeu o ponto.';
      messageEl.style.color = '#C0392B';
    } else if (clickCount >= 50) {
      messageEl.textContent = 'Você já teria digitado a data 25 vezes.';
      messageEl.style.color = '#E67E22';
    } else if (clickCount >= 20) {
      const remaining = Math.max(0, target - clickCount);
      messageEl.textContent = `Já são ${clickCount} cliques. Faltam ${remaining}. Quer mesmo continuar?`;
    }
  }

  prevBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    incrementClick();
    render();
  });

  nextBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    incrementClick();
    render();
  });

  desistoBtn.addEventListener('click', () => {
    picker.style.display = 'none';
    desistoBtn.style.display = 'none';
    const msg = document.createElement('p');
    msg.className = 'dp-desistiu';
    msg.textContent = 'Pois é. Seus usuários também desistem.';
    picker.parentNode.insertBefore(msg, desistoBtn);
    outro.hidden = false;
  });

  render();
}

function initPopoverDemo() {
  const _now = new Date();
  let currentMonth = _now.getMonth();
  let currentYear = _now.getFullYear();
  let interactionCount = 0;

  const monthBtn = document.getElementById('pp-month-btn');
  const yearBtn = document.getElementById('pp-year-btn');
  const popoverContainer = document.getElementById('pp-popover-container');
  const weekdays = document.getElementById('pp-weekdays');
  const grid = document.getElementById('pp-grid');
  const clicksEl = document.getElementById('pp-clicks');
  const messageEl = document.getElementById('pp-message');
  const resultDiv = document.getElementById('pp-result');
  const resultText = document.getElementById('pp-result-text');

  function count() {
    interactionCount++;
    clicksEl.textContent = interactionCount;
  }

  function updateHeader() {
    monthBtn.textContent = MONTHS[currentMonth];
    yearBtn.textContent = currentYear;
  }

  let _lastPopoverTrigger = null;

  function closePopover() {
    popoverContainer.innerHTML = '';
    weekdays.style.display = '';
    grid.style.display = '';
    if (_lastPopoverTrigger) {
      _lastPopoverTrigger.focus();
      _lastPopoverTrigger = null;
    }
  }

  function showMonthPicker() {
    _lastPopoverTrigger = monthBtn;
    count();
    grid.style.display = 'none';
    weekdays.style.display = 'none';
    const pop = document.createElement('div');
    pop.className = 'pp-popover';
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-label', 'Selecionar mês');
    const g = document.createElement('div');
    g.className = 'pp-months-grid';
    MONTHS.forEach((name, i) => {
      const btn = document.createElement('button');
      btn.className = 'pp-month-item';
      btn.textContent = name.substring(0, 3);
      if (i === currentMonth) btn.style.background = '#333';
      btn.addEventListener('click', () => {
        currentMonth = i;
        count();
        updateHeader();
        closePopover();
        renderDays();
      });
      g.appendChild(btn);
    });
    pop.appendChild(g);
    popoverContainer.innerHTML = '';
    popoverContainer.appendChild(pop);
  }

  function showYearPicker() {
    _lastPopoverTrigger = yearBtn;
    count();
    grid.style.display = 'none';
    weekdays.style.display = 'none';
    const pop = document.createElement('div');
    pop.className = 'pp-popover';
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-label', 'Selecionar ano');
    const list = document.createElement('div');
    list.className = 'pp-years-list';
    const yearFrag = document.createDocumentFragment();
    for (let y = new Date().getFullYear(); y >= 1920; y--) {
      const btn = document.createElement('button');
      btn.className = 'pp-year-item';
      btn.textContent = y;
      if (y === currentYear) btn.style.background = '#333';
      btn.addEventListener('click', () => {
        currentYear = y;
        count();
        updateHeader();
        closePopover();
        renderDays();
      });
      yearFrag.appendChild(btn);
    }
    list.appendChild(yearFrag);
    pop.appendChild(list);
    popoverContainer.innerHTML = '';
    popoverContainer.appendChild(pop);
    // Scroll to current year
    const active = list.querySelector('[style]');
    if (active) active.scrollIntoView({ block: 'center' });
  }

  function renderDays() {
    grid.innerHTML = '';
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const frag = document.createDocumentFragment();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('span');
      empty.className = 'dp-day empty';
      frag.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const btn = document.createElement('button');
      btn.className = 'dp-day';
      btn.textContent = d;
      btn.addEventListener('click', () => {
        count();
        grid.querySelectorAll('.dp-day').forEach(el => el.style.background = '');
        btn.style.background = '#333';
        messageEl.textContent = `${d} de ${MONTHS_LC[currentMonth]} de ${currentYear}`;
        messageEl.style.color = '#E0E0E0';
        resultText.textContent = `${interactionCount} interações. Pra digitar algo que você sabe de cor desde os 12 anos.`;
        resultDiv.hidden = false;
      });
      frag.appendChild(btn);
    }
    grid.appendChild(frag);
  }

  monthBtn.addEventListener('click', showMonthPicker);
  yearBtn.addEventListener('click', showYearPicker);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popoverContainer.children.length > 0) {
      closePopover();
    }
  });

  updateHeader();
  renderDays();
}

function initNativeDropdownDemo() {
  const monthSelect = document.getElementById('nd-month');
  const daySelect = document.getElementById('nd-day');
  const yearSelect = document.getElementById('nd-year');
  const clicksEl = document.getElementById('nd-clicks');
  const messageEl = document.getElementById('nd-message');
  const resultDiv = document.getElementById('nd-result');
  const resultText = document.getElementById('nd-result-text');

  let interactionCount = 0;

  // Populate days 1-31
  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    daySelect.appendChild(opt);
  }

  // Populate years current-1920
  for (let y = new Date().getFullYear(); y >= 1920; y--) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }

  function count() {
    interactionCount++;
    clicksEl.textContent = interactionCount;
  }

  function checkComplete() {
    const m = monthSelect.value;
    const d = daySelect.value;
    const y = yearSelect.value;
    if (m !== '' && d !== '' && y !== '') {
      const day = parseInt(d, 10);
      const month = parseInt(m, 10);
      const year = parseInt(y, 10);
      // Validate the date actually exists (e.g. Feb 31 is invalid)
      const testDate = new Date(year, month, day);
      if (testDate.getDate() !== day) {
        messageEl.textContent = `Data inválida: ${day} de ${MONTHS_LC[month]} não existe.`;
        messageEl.style.color = '#C0392B';
        resultDiv.hidden = true;
        return;
      }
      messageEl.textContent = `${day} de ${MONTHS_LC[month]} de ${year}`;
      messageEl.style.color = '#E0E0E0';
      resultText.textContent = `${interactionCount} interações e 3 scrolls. Ou 3 campos de texto em 2 segundos.`;
      resultDiv.hidden = false;
    }
  }

  [monthSelect, daySelect, yearSelect].forEach(sel => {
    sel.addEventListener('change', () => {
      count();
      checkComplete();
    });
  });
}

function initSolutionDemo() {
  const dd = document.getElementById('sol-dd');
  const mm = document.getElementById('sol-mm');
  const yyyy = document.getElementById('sol-yyyy');
  const result = document.getElementById('solution-result');
  const dateDisplay = document.getElementById('solution-date');
  const fields = [dd, mm, yyyy];

  function stripNonNumeric(input) {
    input.value = input.value.replace(/\D/g, '');
  }

  function autoAdvance(current, next) {
    if (current.value.length >= parseInt(current.maxLength) && next) {
      next.focus();
    }
  }

  function validate() {
    const d = parseInt(dd.value, 10);
    const m = parseInt(mm.value, 10);
    const y = parseInt(yyyy.value, 10);

    if (dd.value.length === 2 && mm.value.length === 2 && yyyy.value.length === 4) {
      if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1900 && y <= new Date().getFullYear()) {
        const date = new Date(y, m - 1, d);
        if (date.getDate() === d && date.getMonth() === m - 1) {
          fields.forEach(f => f.classList.add('valid'));
          dateDisplay.textContent = `${d} de ${MONTHS_LC[m - 1]} de ${y}`;
          result.hidden = false;
          return;
        }
      }
    }
    fields.forEach(f => f.classList.remove('valid'));
    result.hidden = true;
  }

  dd.addEventListener('input', () => {
    stripNonNumeric(dd);
    autoAdvance(dd, mm);
    validate();
  });

  mm.addEventListener('input', () => {
    stripNonNumeric(mm);
    autoAdvance(mm, yyyy);
    validate();
  });

  yyyy.addEventListener('input', () => {
    stripNonNumeric(yyyy);
    validate();
  });

  // Backspace on empty field focuses previous
  mm.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && mm.value === '') {
      dd.focus();
    }
  });

  yyyy.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && yyyy.value === '') {
      mm.focus();
    }
  });
}

function initShareLinks() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent('530 cliques pra informar minha data de nascimento num date picker. Para de usar calendário pra data de nascimento.');

  document.getElementById('share-twitter').href =
    `https://twitter.com/intent/tweet?text=${text}&url=${url}`;

  const linkedinText = encodeURIComponent(`530 cliques pra informar minha data de nascimento num date picker. Para de usar calendário pra data de nascimento.\n\n${window.location.href}`);
  document.getElementById('share-linkedin').href =
    `https://www.linkedin.com/feed/?shareActive=true&text=${linkedinText}`;

  const copyBtn = document.getElementById('share-copy');
  copyBtn.addEventListener('click', () => {
    const pageUrl = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pageUrl).then(() => {
        copyBtn.textContent = 'Copiado!';
        setTimeout(() => { copyBtn.textContent = 'Copiar link'; }, 2000);
      }).catch(() => {
        copyBtn.textContent = 'Erro ao copiar';
        setTimeout(() => { copyBtn.textContent = 'Copiar link'; }, 2000);
      });
    } else {
      try {
        const ta = document.createElement('textarea');
        ta.value = pageUrl;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        copyBtn.textContent = 'Copiado!';
      } catch {
        copyBtn.textContent = 'Erro ao copiar';
      }
      setTimeout(() => { copyBtn.textContent = 'Copiar link'; }, 2000);
    }
  });
}

function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-target').forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
  initPainDemo();
  initPopoverDemo();
  initNativeDropdownDemo();
  initSolutionDemo();
  initShareLinks();
  initAnimations();
});
