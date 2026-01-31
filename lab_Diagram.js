// lab_Diagram.js 容器
const DiagramLab = {
    open: function() {
        console.log("嘗試開啟三相圖演示...");
        let container = document.getElementById('diagram-lab-wrapper');
        
        // 監聽來自內部的關閉訊息
        if (!window._diagramListenerAdded) {
            window.addEventListener('message', (e) => {
                if (e.data === 'closeDiagramLab') DiagramLab.close();
            });
            window._diagramListenerAdded = true;
        }

        if (!container) {
            container = document.createElement('div');
            container.id = 'diagram-lab-wrapper';
            container.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                z-index: 999999; background: #020617; display: none; flex-direction: column;
            `;
            container.innerHTML = `<iframe src="lab_Diagram.html" style="width:100%; height:100%; border:none;"></iframe>`;
            document.body.appendChild(container);
        }
        
        container.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 鎖定主頁滾動
    },

    close: function() {
        console.log("關閉三相圖演示");
        const container = document.getElementById('diagram-lab-wrapper');
        if (container) {
            container.style.display = 'none';
        }
        document.body.style.overflow = 'auto'; // 恢復滾動
    }
};
