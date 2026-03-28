// script.js
const langContent = {
  zh: {
    name: '章肇方',
    titles:
      '1962年12月出生  中国水彩画家<br>四川省美术家协会水彩艺术委员会副主任 <br> 天府新区水彩专业委员会主任', // 在这里填入中文头衔
    desc: '在德国等国内外举办过多次个展。<br>主要个展包括：2024年在德国锡根举办水彩双人展、2016年在德国鲁本斯文化交流中心举办水彩个展、<br>2014年受中德友好协会邀请在德国举办个展、2013年在成都蓝顶艺术区举办“天圆地方”个展等。<br>2007年受柏林艺术家联盟邀请举办个展。<br>作品发表于《中国水彩》专题号（2021年）以及《艺术界》《美术观潮》等美术专业杂志。<br>2005年由江苏美术出版社出版作品集《章肇方水彩》。',
    contactLabel: '联系方式 / CONTACT',
    footer: '艺术，是灵魂的呼吸。',
  },
  jp: {
    name: '章肇方（しょう ちょうほう）',
    titles:
      '1962年12月生まれ  中国の水彩画家<br>四川省美術家協会水彩画芸術委員会副主任<br>天府新区水彩専門委員会主任', // 在这里填入日文头衔
    desc: 'ドイツをはじめ国内外で個展を多数開催。<br>主な個展に、2024年ドイツ・ジーゲンにて水彩二人展、2016年ドイツ・ルーベンス文化交流センター水彩個展、<br>2014年中独友好協会招聘によるドイツ個展、2013年成都ブルートップ芸術区にて「天円地方」個展など。<br>2007年にはベルリン芸術家連盟の招待により個展を開催。<br>作品は『中国水彩』特集号（2021年）をはじめ、『芸術界』『美術観潮』などの美術専門誌に掲載。<br>2005年には江蘇美術出版社より作品集『章肇方水彩』を出版。',
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
  document.getElementById('artist-desc').innerHTML = data.desc;
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
      : '微信号已复制',
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
    { passive: true },
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
    { passive: true },
  );
}

document.addEventListener('DOMContentLoaded', init);
