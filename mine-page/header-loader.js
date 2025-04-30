// ヘッダーを読み込むスクリプト
document.addEventListener('DOMContentLoaded', function() {
    // header.htmlを読み込む
    fetch('header.html')
        .then(response => {
            return response.text();
        })        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            
            // レスポンシブメニューのスクリプトを読み込み、実行する
            setTimeout(() => {
                const hamburgerMenu = document.getElementById('hamburgerMenu');
                const pixelNav = document.querySelector('.pixel-nav');
                const body = document.body;
                
                // メニューオーバーレイ要素を作成
                const overlay = document.createElement('div');
                overlay.classList.add('menu-overlay');
                body.appendChild(overlay);
                
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
            }, 100);
            
            // 現在のページのURLを取得
            const currentPath = window.location.pathname;
            const currentPage = currentPath.split('/').pop();
            
            // 現在のページのナビリンクをアクティブにする
            const navLinks = document.querySelectorAll('.pixel-nav a');
            navLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                if (linkHref === currentPage) {
                    link.classList.add('active');
                }
            });

            // ページ遷移用のオーバーレイ要素を確認
            if (!document.querySelector('.page-transition')) {
                // 遷移アニメーション用のオーバーレイ要素を作成（必要な場合）
                const transitionOverlay = document.createElement('div');
                transitionOverlay.className = 'page-transition';
                document.body.appendChild(transitionOverlay);
            }
        });
});
