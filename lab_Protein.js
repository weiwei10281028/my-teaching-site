// lab_Protein.js 容器
const ProteinLab = {
    open: function() {
        let container = document.getElementById('protein-lab-wrapper');
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
window.ProteinLab = ProteinLab;
