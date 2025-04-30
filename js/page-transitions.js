/**
 * ページ遷移アニメーション用スクリプト
 * リンククリック時にフェード効果でページを切り替えます
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page transitions script loaded');
    
    // 遷移アニメーション用のオーバーレイ要素を作成
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition';
    document.body.appendChild(transitionOverlay);
    
    // 現在のURLをセット
    let currentPage = window.location.href;
    
    // 通常のリンククリックを捕捉（同じドメイン内）
    document.addEventListener('click', function(e) {
        // リンク要素を探す
        const link = e.target.closest('a');
        
        // リンクでない場合やダウンロードリンク、新しいタブで開く場合、またはアンカーリンクは除外
        if (!link || link.hasAttribute('download') || link.target === '_blank' || 
            link.getAttribute('href').startsWith('#') || 
            link.getAttribute('href').startsWith('javascript:') || 
            link.getAttribute('href').startsWith('mailto:') || 
            link.getAttribute('href').startsWith('tel:')) {
            return;
        }
        
        const linkUrl = link.href;
        
        // 同一サイト内のリンクかどうかチェック
        if (linkUrl.includes(window.location.hostname) && 
            linkUrl !== currentPage && 
            !e.ctrlKey && !e.metaKey) {
            
            // デフォルトのリンク動作を防止
            e.preventDefault();
            
            console.log('Transition to:', linkUrl);
            
            // フェードアウトエフェクト
            transitionOverlay.classList.add('fade-out');
            
            // フェードアウト完了後に新しいページへ遷移
            setTimeout(function() {
                window.location.href = linkUrl;
            }, 500); // トランジション時間に合わせる
        }
    });
    
    // ブラウザの戻る/進むボタンの検出
    window.addEventListener('popstate', function() {
        // フェードアウトエフェクト
        transitionOverlay.classList.add('fade-out');
        
        // フェードアウト完了後にページを更新
        setTimeout(function() {
            window.location.reload();
        }, 500);
    });
    
    // ページ読み込み完了時
    window.addEventListener('load', function() {
        // フェードインが完了したらオーバーレイを非表示に
        setTimeout(function() {
            transitionOverlay.classList.remove('fade-out');
        }, 100);
    });
});
