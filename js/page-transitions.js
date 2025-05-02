/**
 * ページ遷移アニメーション用スクリプト
 * リンククリック時にフェード効果でページを切り替えます
 * 戻るボタン対応: History APIを使用して正しいページ遷移履歴を維持します
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page transitions script loaded');
    
    // 遷移アニメーション用のオーバーレイ要素を作成
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition';
    document.body.appendChild(transitionOverlay);
    
    // 現在のURLをセット
    let currentPage = window.location.href;
    let currentBasePath = window.location.pathname.split('/')[1];
    
    // ページコンテンツをキャッシュするオブジェクト
    const pageCache = {};
    
    // ページコンテンツを非同期に取得する関数
    async function fetchPage(url) {
        if (pageCache[url]) {
            return pageCache[url];
        }
        
        try {
            const response = await fetch(url, { 
                method: 'GET',
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch page: ${response.status}`);
            }
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // キャッシュに保存
            pageCache[url] = doc;
            return doc;
        } catch (error) {
            console.error('Error fetching page:', error);
            return null;
        }
    }
    
    // ページコンテンツを現在のページに適用する関数
    function updatePageContent(doc, url) {
        if (!doc) {
            // フェッチに失敗した場合は通常のページ遷移
            window.location.href = url;
            return;
        }
        
        // タイトルを更新
        document.title = doc.title;
        
        // メインコンテンツを更新
        const sourceContent = doc.querySelector('.main-content');
        const targetContent = document.querySelector('.main-content');
        
        if (sourceContent && targetContent) {
            targetContent.innerHTML = sourceContent.innerHTML;
        }
        
        // 必要なスクリプトを実行
        initializePageScripts();
        
        // スクロールをトップに
        window.scrollTo(0, 0);
        
        // フェードインエフェクト
        transitionOverlay.classList.remove('fade-out');
    }
    
    // ページ遷移の実行関数
    async function navigateTo(url, pushState = true) {
        // 同じURLなら何もしない
        if (url === currentPage) {
            return;
        }
        
        console.log('Navigating to:', url);
        
        // フェードアウトエフェクト
        transitionOverlay.classList.add('fade-out');
        
        // 異なるディレクトリへの遷移かチェック
        const targetPath = new URL(url).pathname.split('/')[1];
        if (targetPath !== currentBasePath) {
            // 異なるディレクトリへの遷移は通常の方法で
            setTimeout(function() {
                window.location.href = url;
            }, 500);
            return;
        }
        
        // 履歴に追加（必要な場合）
        if (pushState) {
            history.pushState({ url: url }, '', url);
        }
        
        // 現在のURLを更新
        currentPage = url;
        
        // 非同期でコンテンツを取得して表示
        setTimeout(async function() {
            const newPage = await fetchPage(url);
            updatePageContent(newPage, url);
        }, 500);
    }
    
    // アンカーリンク処理関数
    function handleAnchorLink(targetId, pushState = true) {
        console.log('Navigating to anchor:', targetId);
        
        // 履歴に追加（必要な場合）
        if (pushState) {
            history.pushState({ targetId: targetId }, '', targetId);
        }
        
        // すべてのセクションを非表示にする
        document.querySelectorAll('section').forEach(section => {
            section.style.display = 'none';
        });
        
        // ターゲットセクションを表示
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }
    
    // 各ページ固有のスクリプトを初期化する関数
    function initializePageScripts() {
        // スライダーの初期化（必要な場合）
        if (typeof initSlider === 'function') {
            initSlider();
        }
        
        // レスポンシブメニューの再初期化
        if (typeof initResponsiveMenu === 'function') {
            initResponsiveMenu();
        }
        
        // データ遷移属性を持つリンクにイベントリスナーを再設定
        document.querySelectorAll('a[data-page-transition="true"]').forEach(link => {
            link.addEventListener('click', handleTransitionLinkClick);
        });
    }
    
    // 遷移リンクのクリックハンドラ
    function handleTransitionLinkClick(e) {
        // リンク要素を取得
        const link = e.currentTarget;
        
        // デフォルトのリンク動作を防止
        e.preventDefault();
        
        const linkUrl = link.href;
        const isAnchorLink = link.getAttribute('href').startsWith('#');
        
        // アンカーリンクの場合は特別な処理
        if (isAnchorLink) {
            const targetId = link.getAttribute('href');
            handleAnchorLink(targetId);
            return;
        }
        
        // 別ディレクトリへの遷移かどうかを確認（例：mine-page/ など）
        const targetPath = new URL(linkUrl).pathname.split('/')[1];
        if (targetPath !== currentBasePath) {
            // フェードアウトエフェクト
            transitionOverlay.classList.add('fade-out');
            
            // 500ms後に通常のページ遷移
            setTimeout(function() {
                window.location.href = linkUrl;
            }, 500);
            return;
        }
        
        // 同じディレクトリ内の遷移は非同期処理
        navigateTo(linkUrl);
    }
    
    // すべての遷移リンクにイベントリスナーを設定
    document.querySelectorAll('a[data-page-transition="true"]').forEach(link => {
        link.addEventListener('click', handleTransitionLinkClick);
    });
    
    // ブラウザの戻る/進むボタンの検出
    window.addEventListener('popstate', function(event) {
        console.log('popstate event triggered', window.location.href);
        
        // フェードアウトエフェクト
        transitionOverlay.classList.add('fade-out');
        
        const state = event.state;
        const url = window.location.href;
        
        // 別ディレクトリへの戻りかどうかを確認
        const targetPath = new URL(url).pathname.split('/')[1];
        if (targetPath !== currentBasePath) {
            // リロードして完全遷移
            window.location.reload();
            return;
        }
        
        // 500ms後に処理を実行（フェードアウト完了後）
        setTimeout(async function() {
            if (window.location.hash && (!state || state.targetId)) {
                // ハッシュがある場合はセクション間の移動
                const hash = window.location.hash;
                handleAnchorLink(hash, false);
                transitionOverlay.classList.remove('fade-out');
            } else {
                // 通常のページ遷移
                const newPage = await fetchPage(url);
                updatePageContent(newPage, url);
            }
        }, 500);
    });
    
    // ページ読み込み完了時
    window.addEventListener('load', function() {
        console.log('Page fully loaded', window.location.href);
        
        // 現在のURLを履歴に記録（初回ロード時）
        const url = window.location.href;
        if (!history.state) {
            history.replaceState({ url: url }, '', url);
        }
        
        // 初期表示のセクション処理
        if (window.location.hash) {
            const hash = window.location.hash;
            handleAnchorLink(hash, false);
        }
        
        // フェードインが完了したらオーバーレイを非表示に
        setTimeout(function() {
            transitionOverlay.classList.remove('fade-out');
        }, 100);
    });
});
