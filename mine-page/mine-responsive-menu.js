// Mine-page ハンバーガーメニューの制御用スクリプト
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const pixelNav = document.querySelector('.pixel-nav');
    const body = document.body;
    
    // メニューオーバーレイ要素を作成
    const overlay = document.createElement('div');
    overlay.classList.add('menu-overlay');
    body.appendChild(overlay);
    
    // ハンバーガーメニュークリック時の処理
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            pixelNav.classList.toggle('open');
            overlay.classList.toggle('show');
            body.classList.toggle('menu-open');
        });
    }
    
    // オーバーレイクリック時にメニューを閉じる
    overlay.addEventListener('click', function() {
        if (hamburgerMenu) {
            hamburgerMenu.classList.remove('active');
            pixelNav.classList.remove('open');
            this.classList.remove('show');
            body.classList.remove('menu-open');
        }
    });
    
    // メニューリンククリック時にメニューを閉じる
    const menuLinks = document.querySelectorAll('.pixel-nav a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburgerMenu) {
                hamburgerMenu.classList.remove('active');
                pixelNav.classList.remove('open');
                overlay.classList.remove('show');
                body.classList.remove('menu-open');
            }
        });
    });
    
    // ウィンドウリサイズ時の処理
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (hamburgerMenu) {
                hamburgerMenu.classList.remove('active');
                pixelNav.classList.remove('open');
                overlay.classList.remove('show');
                body.classList.remove('menu-open');
            }
        }
    });
});
