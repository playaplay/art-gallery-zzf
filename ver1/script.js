// script.js
const langContent = {
  zh: {
    name: '章肇方',
    titles: '四川美术协会副会长 / 中国当代艺术家', // 在这里填入中文头衔
    desc: '二〇二六 · 线上作品展',
    contactLabel: '联系方式 / CONTACT',
    footer: '艺术，是灵魂的呼吸。',
  },
  jp: {
    name: '先生の名前',
    titles: '四川美術家協会副会長 / 中国現代アーティスト', // 在这里填入日文头衔
    desc: '二〇二六 · オンライン作品展',
    contactLabel: 'お問い合わせ / CONTACT',
    footer: '芸術とは、魂の呼吸である。',
  },
};

let images = [];
let currentIdx = 0;

function setLang(lang) {
  const data = langContent[lang];
  if (!data) return;

  document.getElementById('artist-name').innerText = data.name;
  document.getElementById('artist-desc').innerText = data.desc;
  document.getElementById('footer-name').innerText = data.footer;
  document.getElementById('contact-label').innerText = data.contactLabel;

  // 新增：渲染头衔
  // 如果头衔很长，可以用 <br> 换行
  document.getElementById('artist-titles').innerHTML = data.titles;

  document.documentElement.lang = lang;

  // ... 原有的切换按钮 active 逻辑
}
function openLightbox(idx) {
  currentIdx = idx;
  document.getElementById('lightbox-img').src = images[currentIdx];
  document.getElementById('lightbox').classList.add('active');
  document.body.classList.add('lightbox-open');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.classList.remove('lightbox-open');
}

function changeImage(dir) {
  currentIdx = (currentIdx + dir + images.length) % images.length;
  const img = document.getElementById('lightbox-img');
  img.style.opacity = '0.3';
  setTimeout(() => {
    img.src = images[currentIdx];
    img.style.opacity = '1';
  }, 150);
}

function copyWeChat(id) {
  const el = document.createElement('input');
  el.value = id;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  alert(
    document.documentElement.lang === 'jp'
      ? 'IDをコピーしました'
      : '微信号已复制'
  );
}

// --- 修复版滑动逻辑 ---
let touchStartX = 0;
let touchStartY = 0;

function init() {
  setLang(navigator.language.includes('ja') ? 'jp' : 'zh');
  document.getElementById('year').innerText = new Date().getFullYear();

  const items = document.querySelectorAll('.gallery-item');
  items.forEach((item, i) => {
    const img = item.querySelector('img');
    images.push(img.src);
    item.onclick = () => openLightbox(i);
  });

  // 基础事件
  document.getElementById('lightbox-close').onclick = closeLightbox;
  document.getElementById('lightbox-prev').onclick = (e) => {
    e.stopPropagation();
    changeImage(-1);
  };
  document.getElementById('lightbox-next').onclick = (e) => {
    e.stopPropagation();
    changeImage(1);
  };
  document.getElementById('lightbox').onclick = (e) => {
    if (e.target.id === 'lightbox' || e.target.id === 'lightbox-content')
      closeLightbox();
  };

  // 键盘
  document.onkeydown = (e) => {
    if (!document.getElementById('lightbox').classList.contains('active'))
      return;
    if (e.key === 'ArrowLeft') changeImage(-1);
    if (e.key === 'ArrowRight') changeImage(1);
    if (e.key === 'Escape') closeLightbox();
  };

  // 手机滑动修复
  const lbContent = document.getElementById('lightbox-content');
  lbContent.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true }
  );

  lbContent.addEventListener(
    'touchend',
    (e) => {
      let touchEndX = e.changedTouches[0].screenX;
      let touchEndY = e.changedTouches[0].screenY;

      let dx = touchEndX - touchStartX;
      let dy = touchEndY - touchStartY;

      // 确保是水平滑动而非垂直滚动
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        changeImage(dx > 0 ? -1 : 1);
      }
    },
    { passive: true }
  );
}

document.addEventListener('DOMContentLoaded', init);
