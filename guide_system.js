// guide_system.js
const GuideSystem = {
    open: function() {
        let container = document.getElementById('guide-system-wrapper');
        
        // 監聽來自 introduction.html 內部的關閉訊息
        if (!window._guideListenerAdded) {
            window.addEventListener('message', (e) => {
                if (e.data === 'closeGuide') GuideSystem.close();
            });
            window._guideListenerAdded = true;
        }

        if (!container) {
            container = document.createElement('div');
            container.id = 'guide-system-wrapper';
            // 背景色設定為大濛版的深色基調
            container.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                z-index: 2000000; background: #2D2A26; display: none; flex-direction: column;
            `;
            container.innerHTML = `<iframe src="guide_system.html" style="width:100%; height:100%; border:none;"></iframe>`;
            document.body.appendChild(container);
        }
        
        container.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 鎖定主頁滾動
    },

    close: function() {
        const container = document.getElementById('guide-system-wrapper');
        if (container) {
            container.style.display = 'none';
        }
        document.body.style.overflow = 'auto'; // 恢復主頁滾動
    }
};