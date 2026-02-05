// lab_Protein.js 容器（仿 lab_Diagram.js）
const ProteinLab = {
    open: function() {
        console.log("嘗試開啟蛋白質 3D 展示...");
        let container = document.getElementById('protein-lab-wrapper');

        // 監聽來自內部的關閉訊息（iframe postMessage）
        if (!window._proteinListenerAdded) {
            window.addEventListener('message', function(e) {
                if (e.data === 'closeProteinLab') ProteinLab.close();
            });
            window._proteinListenerAdded = true;
        }

        if (!container) {
            container = document.createElement('div');
            container.id = 'protein-lab-wrapper';
            container.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                z-index: 999999; background: #020617; display: none; flex-direction: column;
            `;
            container.innerHTML = `<iframe src="protein_lab/lab_Protein.html" style="width:100%; height:100%; border:none;"></iframe>`;
            document.body.appendChild(container);
        }

        container.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    },

    close: function() {
        console.log("關閉蛋白質 3D 展示");
        const container = document.getElementById('protein-lab-wrapper');
        if (container) {
            container.style.display = 'none';
        }
        document.body.style.overflow = 'auto';
    }
};
