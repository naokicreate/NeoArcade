// ヘッダーを読み込むスクリプト
document.addEventListener('DOMContentLoaded', function() {
    // header.htmlを読み込む
    fetch('header.html')
        .then(response => {
            return response.text();
        })
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            
            // レスポンシブメニューのスクリプトを読み込み、実行する
            const script = document.createElement('script');
            script.src = 'mine-responsive-menu.js';
            document.body.appendChild(script);
            
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
