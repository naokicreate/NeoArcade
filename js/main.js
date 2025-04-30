// main.js
// ドット風WEBサイト用JavaScript

// ドキュメントが読み込まれたら実行
document.addEventListener('DOMContentLoaded', () => {
  // ナビゲーションのスムーススクロール
  const navLinks = document.querySelectorAll('.pixel-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // スムーススクロール
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  // フォーム送信処理は削除されました

  // ピクセルアートキャラクターのアニメーション
  const pixelCharacter = document.querySelector('.pixel-art-character');
  if (pixelCharacter) {
    // マウスでホバー時にジャンプアニメーション
    pixelCharacter.addEventListener('mouseenter', () => {
      pixelCharacter.style.animation = 'jump 0.5s ease';
      setTimeout(() => {
        pixelCharacter.style.animation = 'float 2s ease-in-out infinite alternate';
      }, 500);
    });
  }
});

// ジャンプアニメーション
// 注: CSSのキーフレームアニメーションはCSSファイルに定義する必要があります
// このコードブロックはstyle.cssに移動させる必要があります

// 画面サイズに応じた調整
window.addEventListener('resize', () => {
  // レスポンシブ対応の追加処理があればここに実装
});

// ピクセル調整関数
// 座標をピクセルグリッドにスナップさせる
function snapToPixel(value) {
  const pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));
  return Math.round(value / pixelSize) * pixelSize;
}

// 画像の遅延読み込み
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('.lazy-load');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy-load');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
});
