/**
 * ページ遷移アニメーション用スクリプト
 * リンククリック時にフェード効果でページを切り替えます
 * 戻るボタン対応: ページ遷移履歴を適切に処理します
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page transitions script loaded');
    
    // 遷移アニメーション用のオーバーレイ要素を作成
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition';
    document.body.appendChild(transitionOverlay);
    
    // 現在のURLをセット
    let currentPage = window.location.href;
    
    // 戻るボタンで戻ってきたかどうかを検知するためのフラグ
    let isBackNavigation = false;
      // 通常のリンククリックを捕捉（同じドメイン内）- 改善版
    document.addEventListener('click', function(e) {
        // リンク要素を探す
        const link = e.target.closest('a');
        
        // リンクでない場合やダウンロードリンク、新しいタブで開く場合、またはアンカーリンクは除外
        if (!link || link.hasAttribute('download') || link.target === '_blank' || 
            link.getAttribute('href').startsWith('javascript:') || 
            link.getAttribute('href').startsWith('mailto:') || 
            link.getAttribute('href').startsWith('tel:')) {
            return;
        }
        
        const linkUrl = link.href;
        const isAnchorLink = link.getAttribute('href').startsWith('#');
        
        // アンカーリンクの場合は特別な処理
        if (isAnchorLink) {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            console.log('Navigating to anchor:', targetId);
            
            // 履歴に追加
            history.pushState({ targetId: targetId }, '', targetId);
            
            // すべてのセクションを非表示にする
            document.querySelectorAll('section').forEach(section => {
                section.style.display = 'none';
            });
            
            // ターゲットセクションを表示
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
            
            return;
        }
        
        // 同一サイト内のリンクかどうかチェック
        if (linkUrl.includes(window.location.hostname) && 
            linkUrl !== currentPage && 
            !e.ctrlKey && !e.metaKey) {
            
            // デフォルトのリンク動作を防止
            e.preventDefault();
            
            console.log('Transition to:', linkUrl);
            
            // フェードアウトエフェクト
            transitionOverlay.classList.add('fade-out');
            
            // トランジションデータを保存
            sessionStorage.setItem('lastTransition', JSON.stringify({
                from: window.location.href,
                to: linkUrl,
                timestamp: new Date().getTime()
            }));
            
            // フェードアウト完了後に新しいページへ遷移
            setTimeout(function() {
                window.location.href = linkUrl;
            }, 500); // トランジション時間に合わせる
        }
    });
      // ブラウザの戻る/進むボタンの検出 - 改善版
    window.addEventListener('popstate', function(event) {
        console.log('popstate event triggered', window.location.href);
        isBackNavigation = true;
        
        // フェードアウトエフェクト
        transitionOverlay.classList.add('fade-out');
        
        // フェードアウト完了後の処理
        setTimeout(function() {
            // 履歴の状態を確認して適切に処理
            if (window.location.href.includes('#')) {
                // ハッシュがある場合はセクション間の移動なので、リロードせずにセクションを表示
                const hash = window.location.hash;
                const targetSection = document.querySelector(hash);
                
                if (targetSection) {
                    // すべてのセクションを非表示
                    document.querySelectorAll('section').forEach(section => {
                        section.style.display = 'none';
                    });
                    
                    // 対象のセクションを表示
                    targetSection.style.display = 'block';
                    transitionOverlay.classList.remove('fade-out');
                } else {
                    // セクションが見つからない場合はリロード
                    window.location.reload();
                }
            } else {
                // ハッシュがない場合は通常のページ遷移なのでリロード
                window.location.reload();
            }
        }, 500);
    });
    
    // ページ読み込み完了時
    window.addEventListener('load', function() {
        console.log('Page fully loaded', window.location.href);
        
        // 戻るボタンで戻ってきた場合は特別な処理
        if (isBackNavigation && window.location.href.includes('#')) {
            const hash = window.location.hash;
            const targetSection = document.querySelector(hash);
            
            if (targetSection) {
                // すべてのセクションを非表示
                document.querySelectorAll('section').forEach(section => {
                    section.style.display = 'none';
                });
                
                // 対象のセクションを表示
                targetSection.style.display = 'block';
            }
        }
        
        // フェードインが完了したらオーバーレイを非表示に
        setTimeout(function() {
            transitionOverlay.classList.remove('fade-out');
        }, 100);
        
        // 初期表示のセクション処理
        if (window.location.hash) {
            const hash = window.location.hash;
            const targetSection = document.querySelector(hash);
            
            if (targetSection) {
                // すべてのセクションを非表示
                document.querySelectorAll('section').forEach(section => {
                    section.style.display = 'none';
                });
                
                // 対象のセクションを表示
                targetSection.style.display = 'block';
            }
        }
    });
});
