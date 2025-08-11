document.addEventListener('DOMContentLoaded', () => {
  const data = {
    2012: { regular: '13th / 18', playoffs: 'Did not qualify', final: '13th' },
    2013: { regular: '12th / 18', playoffs: 'Did not qualify', final: '12th' },
    2014: { regular: '15th / 18', playoffs: 'Did not qualify', final: '15th' },
    2015: { regular: '17th / 18', playoffs: 'Did not qualify', final: '17th' },
    2016: { regular: '17th / 18', playoffs: 'Did not qualify', final: '17th' },
    2017: { regular: '18th / 18', playoffs: 'Did not qualify', final: '18th' },
    2018: { regular: '15th / 18', playoffs: 'Did not qualify', final: '15th' },
    2019: { regular: '2nd / 18', playoffs: 'Eliminated in Semifinals', final: '5th' },
    2020: { regular: '2nd / 18', playoffs: 'Eliminated in Semifinals', final: '3rd' },
    2021: { regular: '4th / 18', playoffs: 'Eliminated in Semifinals', final: '5th' },
    2022: { regular: '6th / 18', playoffs: 'Eliminated in Semifinals', final: '4th' },
    2023: { regular: '2nd / 18', playoffs: 'Runner-up (Finals)', final: '2nd' },
    2024: { regular: '5th / 18', playoffs: 'Premiers !', final: '1st' }
  };

  const buttons = document.querySelectorAll('.year-button');
  const yearFinal = document.getElementById('yearFinal');
  const yearRegular = document.getElementById('yearRegular');
  const yearPlayoffs = document.getElementById('yearPlayoffs');
  const section = document.getElementById('section2');

  const years = Object.keys(data).sort((a, b) => b - a); // [2024, 2023, ..., 2012]
  let currentIndex = 0;
  let intervalId = null;

  function updateBackground(year) {
    section.style.backgroundImage = `
      linear-gradient(to left, rgba(0, 0, 0, 0.8), rgba(29, 41, 69, 1)),
      url("images/${year}.jpg")
    `;
    section.style.backgroundRepeat = 'no-repeat';
    section.style.backgroundSize = '50% 100%';
    section.style.backgroundPosition = 'right top';
  }

  function updateContent(year) {
    const info = data[year];
    yearFinal.textContent = info.final;
    yearRegular.textContent = `Regular Season: ${info.regular}`;
    yearPlayoffs.textContent = `AFL Playoffs: ${info.playoffs}`;
    buttons.forEach(b => b.classList.remove('active'));
    document.querySelector(`.year-button[data-year="${year}"]`)?.classList.add('active');
  }

  function autoplay() {
    const year = years[currentIndex];
    updateContent(year);
    updateBackground(year);
    currentIndex = (currentIndex + 1) % years.length;
  }

  // 自动播放开始
  intervalId = setInterval(autoplay, 3000); // 每3秒播放一个年份

  // 鼠标悬停立即展示该年份并暂停自动播放
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      clearInterval(intervalId); // 暂停自动播放
      const year = button.dataset.year;
      updateContent(year);
      updateBackground(year);
    });

    button.addEventListener('mouseleave', () => {
      // 鼠标离开时恢复自动播放
      intervalId = setInterval(autoplay, 3000);
    });
  });

  // 默认初始化
  updateContent('2024');
  updateBackground('2024');
});



