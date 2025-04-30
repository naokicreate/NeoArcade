// slider.js
// 画像スライダー用JavaScript

document.addEventListener('DOMContentLoaded', () => {
    console.log('スライダーJavaScript読み込み完了');
    
    // スライダー関連の要素を取得
    const slides = document.querySelectorAll('.pixel-slide');
    const dots = document.querySelectorAll('.pixel-dot');
    const sliderContainer = document.querySelector('.pixel-slider-container');
    const slider = document.querySelector('.pixel-slider');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    
    // 現在のスライド番号
    let currentSlideIndex = 0;
    // スライドの総数
    const totalSlides = slides.length;
    // スライド自動切り替えの間隔（ミリ秒）
    const slideInterval = 5000;
    // アニメーション中フラグ
    let isAnimating = false;
    // 自動スライド用タイマーID
    let slideTimer = null;
    
    console.log(`スライド数: ${totalSlides}`);
    console.log(`ドットボタン数: ${dots.length}`);    // スライドの表示状態をリセットする
    function resetSlides() {
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev', 'next', 'slide-in-from-right', 'slide-out-to-left');
            slide.style.zIndex = 1;
        });
    }
    
    // スライドを更新する
    function updateSlideClasses() {
        resetSlides();
        
        const prevIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
        const nextIndex = (currentSlideIndex + 1) % totalSlides;
        
        // 現在のスライドをアクティブに
        slides[currentSlideIndex].classList.add('active');
        slides[currentSlideIndex].style.zIndex = 2;
        
        // 前後のスライドにクラスを設定
        slides[prevIndex].classList.add('prev');
        slides[nextIndex].classList.add('next');
    }      // 初期化処理
    function initSlider() {
        console.log('スライダー初期化中...');
        console.log(`初期化時のスライド数: ${totalSlides}`);
        console.log(`初期化時のドットボタン数: ${dots.length}`);
        
        // 全てのドットボタンをリセット
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // 最初のスライドをアクティブにする
        if (dots.length > 0) {
            dots[0].classList.add('active');
        }
        
        // スライドを初期化
        updateSlideClasses();
        
        // 自動スライドを開始
        startAutoSlide();
    }// 特定のスライドに移動
    function goToSlide(index) {
        console.log(`スライド ${index} へ移動`);
        if (isAnimating) {
            console.log('アニメーション中のため移動をスキップ');
            return;
        }
        isAnimating = true;
        
        // インデックスが範囲外の場合は調整
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        console.log(`調整後のスライドインデックス: ${index}`);
        
        // 前のスライドを記憶
        const oldIndex = currentSlideIndex;
        
        // 現在表示中のスライドにアニメーションを適用
        slides[oldIndex].classList.add('slide-out-to-left');
        
        // 次に表示するスライド
        slides[index].classList.remove('active', 'prev', 'next');
        slides[index].classList.add('slide-in-from-right');
        
        // アニメーション完了まで待機
        setTimeout(() => {
            // 前のスライドのアニメーションクラスをクリア
            slides[oldIndex].classList.remove('active', 'slide-out-to-left');
            
            // 現在のスライドをアクティブに設定
            currentSlideIndex = index;
            
            // ドットボタンを更新
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            
            // スライドの状態を更新
            updateSlideClasses();
            
            // アニメーション完了
            isAnimating = false;
        }, 600);
        
        // 自動スライド用タイマーをリセット
        if (slideTimer) {
            clearTimeout(slideTimer);
            startAutoSlide();
        }
    }    // 次のスライドに移動
    function nextSlide() {
        goToSlide(currentSlideIndex + 1);
    }
    
    // 前のスライドに移動
    function prevSlide() {
        goToSlide(currentSlideIndex - 1);
    }
      // 自動スライドを開始
    function startAutoSlide() {
        // 既存のタイマーがあればクリア
        if (slideTimer) {
            clearTimeout(slideTimer);
        }
        // 新しいタイマーをセット
        slideTimer = setTimeout(() => {
            nextSlide();
            startAutoSlide();
        }, slideInterval);
    }
      // ドットボタンのクリックイベント
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            console.log(`ドットボタン ${index} がクリックされました`);
            goToSlide(index);
        });
    });
    
    // 前へボタンのクリックイベント
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            console.log('前へボタンがクリックされました');
            prevSlide();
        });
    }
    
    // 次へボタンのクリックイベント
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            console.log('次へボタンがクリックされました');
            nextSlide();
        });
    }
    
    // スライダーがあれば初期化
    if (sliderContainer && slides.length > 0) {
        console.log('スライダーコンテナが見つかりました、初期化を開始します');
        initSlider();
        
        // スマートフォンのタッチ操作対応
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        // スワイプ方向を判定して対応するスライドに移動
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX - touchStartX > swipeThreshold) {
                // 右にスワイプ -> 前のスライド
                prevSlide();
            } else if (touchStartX - touchEndX > swipeThreshold) {
                // 左にスワイプ -> 次のスライド
                nextSlide();
            }
        }
    }
});
