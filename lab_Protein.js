// lab_Protein.js（與三相圖相同：postMessage 關閉）
const ProteinLab = {
    open: function() {
        if (!window._proteinListenerAdded) {
            window.addEventListener('message', function(e) {
                if (e.data === 'closeProteinLab') ProteinLab.close();
            });
            window._proteinListenerAdded = true;
        }
        var container = document.getElementById('protein-lab-wrapper');
        if (!container) {
            container = document.createElement('div');
            container.id = 'protein-lab-wrapper';
            container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;background:#020617;display:none;flex-direction:column;';
            container.innerHTML = '<iframe src="lab_Protein.html" style="width:100%;height:100%;border:none;"></iframe>';
            document.body.appendChild(container);
        }
        container.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    },
    close: function() {
        var container = document.getElementById('protein-lab-wrapper');
        if (container) container.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};
