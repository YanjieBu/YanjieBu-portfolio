document.addEventListener('DOMContentLoaded', () => {
  const allDigits = [];

  // 初始化每个 funfact 里的 digit 框
  document.querySelectorAll('.funfact').forEach(fact => {
    const value = fact.getAttribute('data-value');
    const suffix = fact.getAttribute('data-suffix') || ''; // 如 "%"
    const container = fact.querySelector('.digit-boxes');
    container.innerHTML = '';

    [...value].forEach(d => {
      const digit = document.createElement('div');
      digit.classList.add('digit');
      digit.textContent = '0';
      container.appendChild(digit);
      allDigits.push({ el: digit, target: d });
    });

    //  加入后缀符号，例如 "%"
    if (suffix) {
      const symbol = document.createElement('div');
      symbol.classList.add('digit');
      symbol.textContent = suffix;
      container.appendChild(symbol);
    }
  });

  // 老虎机动画：所有数字一起开始转，但从左到右依次停
  const startSlotAnimation = () => {
    allDigits.forEach(({ el, target }, i) => {
      const interval = setInterval(() => {
        el.textContent = Math.floor(Math.random() * 10);
      }, 40);

      // 从左到右依次停下
      setTimeout(() => {
        clearInterval(interval);
        el.textContent = target;
      }, 1000 + i * 400);
    });
  };

  // 滚动到视图触发动画
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startSlotAnimation();
      }
    });
  }, { threshold: 0.3 });

  const section = document.querySelector('#section6');
  if (section) observer.observe(section);
});




