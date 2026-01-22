// 簡化版 - 直接開啟 lab_hydrogen.html
const HydrogenLab = {
    open: function() {
        // 如果已經存在，直接顯示
        if (document.getElementById('hydrogen-lab-overlay')) {
            document.getElementById('hydrogen-lab-overlay').style.display = 'flex';
            return;
        }
        this.init();
    },

    close: function() {
        const overlay = document.getElementById('hydrogen-lab-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    },

    init: function() {
        // 創建覆蓋層
        const modal = document.createElement('div');
        modal.id = 'hydrogen-lab-overlay';
        modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:#020617; z-index:99999; display:flex; flex-direction:column;";

        // 創建退出按鈕
        const exitBtn = document.createElement('div');
        exitBtn.innerHTML = '✕';
        exitBtn.style.cssText = "position:absolute; top:8px; right:15px; width:32px; height:32px; border-radius:50%; background:rgba(0,0,0,0.4); border:1.5px solid #00f2ff; color:#00f2ff; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:100000; transition:0.3s; font-size:1.1rem; backdrop-filter:blur(5px); font-family:sans-serif; font-weight:bold; box-shadow: 0 0 15px rgba(0, 242, 255, 0.3);";
        exitBtn.onclick = () => this.close();
        exitBtn.onmouseenter = function() { 
            this.style.background = '#00f2ff'; 
            this.style.color = '#000'; 
            this.style.boxShadow = '0 0 15px #00f2ff'; 
        };
        exitBtn.onmouseleave = function() { 
            this.style.background = 'rgba(0,0,0,0.4)'; 
            this.style.color = '#00f2ff'; 
            this.style.boxShadow = '0 0 15px rgba(0, 242, 255, 0.3)'; 
        };
        modal.appendChild(exitBtn);

        // 監聽來自 iframe 的訊息（用於隱藏/顯示退出按鈕）
        window.addEventListener('message', function(e) {
            if (e.data === 'hide-lab-exit') exitBtn.style.display = 'none';
            if (e.data === 'show-lab-exit') exitBtn.style.display = 'flex';
        });

        // 創建 iframe 直接載入 lab_hydrogen.html
        const iframe = document.createElement('iframe');
        iframe.style.cssText = "width:100%; height:100%; border:none; background:#020617;";
        iframe.src = "lab_hydrogen.html";
        modal.appendChild(iframe);

        document.body.appendChild(modal);
    }
};

// 全域函數，方便調用
window.openHydrogenLab = function() {
    HydrogenLab.open();
};
