// lab_equilibrium.js 容器
const EquilibriumLab = {
    open: function() {
        console.log("嘗試開啟化學平衡實驗室...");
        let container = document.getElementById('equilibrium-lab-wrapper');
        
        // 新增：監聽來自內部的關閉訊息 (解決關不掉的問題)
        if (!window._equilibriumListenerAdded) {
            window.addEventListener('message', (e) => {
                if (e.data === 'closeEquilibriumLab') EquilibriumLab.close();
            });
            window._equilibriumListenerAdded = true;
        }

        if (!container) {
            container = document.createElement('div');
            container.id = 'equilibrium-lab-wrapper';
            container.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                z-index: 999999; background: #020617; display: none; flex-direction: column;
            `;
            // 修正：iframe 必須設定 height: 100% 才能撐開
            container.innerHTML = `<iframe src="lab_equilibrium.html" style="width:100%; height:100%; border:none;"></iframe>`;
            document.body.appendChild(container);
        }
        
        container.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 鎖定主頁滾動
    },

    close: function() {
        console.log("關閉化學平衡實驗室");
        const container = document.getElementById('equilibrium-lab-wrapper');
        if (container) {
            container.style.display = 'none';
        }
        document.body.style.overflow = 'auto'; // 恢復滾動
    }
};
