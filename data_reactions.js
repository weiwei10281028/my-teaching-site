// ==========================================
// data_reactions.js - 化學反應邏輯與動畫控制
// ==========================================

// 儲存反應歷史紀錄，用於「重置/返回」功能
moleculeHistory = [];

// 取得當前分子的中文名稱 (輔助函式)
function getCurrentMoleculeName() {
    // 確保讀取全域的 window.currentMolecule
    if (!window.currentMolecule || !window.currentMolecule.fullKey) return "";
    const parts = currentMolecule.fullKey.split('|');
    return parts.length > 1 ? parts[1].trim() : parts[0].trim();
}

// 核心邏輯：檢查按鈕狀態 & 決定哪些反應按鈕該出現
function checkReactionAvailable(key) {
    const btnContainer = document.getElementById("reaction-container");
    const resetBtn = document.querySelector(".reset-btn");
    const btns = document.querySelectorAll(".reaction-btn"); 
    
    // 1. 初始化：隱藏所有按鈕
    btns.forEach(b => b.style.display = "none");
    btnContainer.style.display = "none";
    resetBtn.style.display = "none";

    const currentName = getCurrentMoleculeName();

    // --- A. 乙烯專屬反應 ---
    if (currentName === "乙烯") {
        btnContainer.style.display = "block";
        ["reaction-btn", "reaction-h2-btn", "reaction-hcl-btn", "reaction-cl2-btn", "reaction-kmno4-btn"].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.style.display = "flex";
        });
    } 
    // --- B. 丙烯專屬反應 ---
    else if (currentName === "丙烯") { 
        btnContainer.style.display = "block";
        ["reaction-propene-h2-btn", "reaction-propene-cl2-btn", "reaction-propene-hcl-btn", "reaction-propene-h2o-btn"].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.style.display = "flex";
        });
    } 
    // --- C. 乙炔專屬反應 ---
    else if (currentName === "乙炔") {
        btnContainer.style.display = "block";
        ["btn-c2h2-h2-full", "btn-c2h2-h2-part", "btn-c2h2-cl2-full", "btn-c2h2-cl2-part", "btn-c2h2-hcl-full", "btn-c2h2-hcl-part", "btn-c2h2-h2o"].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.style.display = "flex";
        });
    }
    // --- D. 甲烷專屬反應 ---
    else if (currentName === "甲烷") {
        btnContainer.style.display = "block";
        const subBtn = document.getElementById("reaction-sub-btn");
        const nitroBtn = document.getElementById("reaction-nitro-btn");
        if(subBtn) subBtn.style.display = "flex"; 
        if(nitroBtn) nitroBtn.style.display = "flex"; 
    } 
    // --- E. 乙醇/乙醛/乙酸 ---
    else if (currentName === "乙醇" || currentName === "酒精") {
        btnContainer.style.display = "block";
        const oxBtn = document.getElementById("reaction-ox-btn");
        const kmBtn = document.getElementById("reaction-kmno4-btn");
        if(oxBtn) oxBtn.style.display = "flex";
        if(kmBtn) kmBtn.style.display = "flex";
    }
    else if (currentName === "乙醛") {
        btnContainer.style.display = "block";
        const oxBtn = document.getElementById("reaction-ox-btn");
        const redBtn = document.getElementById("reaction-red-btn");
        if(oxBtn) oxBtn.style.display = "flex";
        if(redBtn) redBtn.style.display = "flex";
    }

    // 只要歷史紀錄不是空的，就顯示重置按鈕 (回到上一步)
    if (moleculeHistory.length > 0) {
        btnContainer.style.display = "block";
        resetBtn.style.display = "block";
    }
}

// 重置反應 (返回上一步)
function resetReaction() {
    if (moleculeHistory.length === 0) return;

    isReactionRunning = false;
    isReactionFinished = false; 
    
    const subEl = document.getElementById("viewport-subtitle");
    if(subEl) subEl.style.display = 'none';

    // 取出上一筆紀錄並載入
    const previousState = moleculeHistory.pop();
    loadMolecule(previousState.key, previousState.variant);
}

// 執行反應動畫與切換分子
function finishReaction(nextKey, nextTitle, variantName = null, description = null) {
    moleculeHistory.push({
        key: currentKey,
        variant: currentVariantKey
    });

    const svg = document.getElementById("scene-root");
    svg.classList.add("scene-blur-out");
    
    setTimeout(() => {
        loadMolecule(nextKey, variantName); 
        
        if (description) {
            const subtitle = document.getElementById("viewport-subtitle");
            if (subtitle) {
                subtitle.innerHTML = description;
                // 強制還原截圖中「琥珀橘」的樣式細節
                subtitle.style.cssText = `
                    display: inline-block;
                    margin-top: 15px;
                    padding: 12px 18px;
                    border: 1.5px solid #f59e0b;
                    border-radius: 15px;
                    background-color: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(8px);
                    color: #f59e0b;
                    font-size: 1rem;
                    font-weight: 500;
                    line-height: 1.6;
                    max-width: 330px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                    text-align: justify;
                    pointer-events: auto;
                `;
            }
            
            // 隱藏下方重複的卡片
            const kCard = document.getElementById("knowledge-card");
            if (kCard) kCard.style.display = "none";
        }
        
        svg.classList.remove("scene-blur-out");
        svg.classList.add("scene-blur-in");
        
        setTimeout(() => {
            svg.classList.remove("scene-blur-in");
            isReactionRunning = false; 
            isReactionFinished = true; 
            checkReactionAvailable(nextKey); 
        }, 1500);
    }, 1500);
}

// --- 以下為各別反應的 Runner 函式 ---
// 1. 乙烯系列 (原料: 乙烯)
function runEthyleneHydration() {
    finishReaction("C2H5OH", "乙醇", null, "乙烯的碳碳𝝿鍵打斷，一個C原子接H，另一個C原子接OH，轉變成乙醇");
}
function runEthyleneChlorination() {
    finishReaction("C2H4Cl2", "1,2-二氯乙烷", "C2H4Cl2|1,2-二氯乙烷", "乙烯的碳碳𝝿鍵打斷，兩個C原子各接1個Cl，轉變成1,2-二氯乙烷，亦為氧化反應(C氧化數上升)");
}
function runEthyleneHydrogenation() {
    finishReaction("C2H6", "乙烷", null, "乙烯的碳碳𝝿鍵打斷，兩個C原子各接1個H，轉變成乙烷，亦為還原反應(C氧化數下降)");
}
function runEthyleneHydrohalogenation() {
    finishReaction("C2H5Cl", "氯乙烷", null, "乙烯的碳碳𝝿鍵打斷，一個C原子接H，另一個C原子接Cl，轉變成氯乙烷");
}
function runEthyleneOxidation() {
    finishReaction("C2H4(OH)2", "乙二醇", "C2H4(OH)2|乙二醇|1,2-乙二醇", "乙烯通入冷稀、中性或微鹼性的過錳酸鉀溶液中，碳碳雙鍵斷裂，發生氧化反應，雙鍵的兩個C接上OH，生成乙二醇。");
}

// 2. 甲烷系列 (原料: 甲烷)
function runMethaneSubstitution() {
    finishReaction("CH3Cl", "一氯甲烷", null, "甲烷其中一個C-H鍵斷裂，接上Cl原子，脫去的H與另一個Cl原子結合成HCl");
}
function runMethaneNitration() {
    finishReaction("CH3NO2", "硝基甲烷", null, "甲烷其中一個C-H鍵斷裂，接上NO₂，脫去的H與硝酸脫去的OH結合成H₂O");
}

// 3. 丙烯系列 (原料: 丙烯)
function runPropeneHydrogenation() {
    finishReaction("C3H8", "丙烷", null, "丙烯的碳碳𝝿鍵打斷，兩個斷𝝿鍵的C原子各接1個H，轉變成丙烷，亦為還原反應(C氧化數下降)");
}
function runPropeneChlorination() {
    finishReaction("C3H6Cl2", "1,2-二氯丙烷", "C3H6Cl2|1,2-二氯丙烷", "丙烯的碳碳𝝿鍵打斷，兩個斷𝝿鍵的C原子各接1個Cl，轉變成1,2-二氯丙烷，亦為氧化反應(C氧化數上升)");
}
function runPropeneHydrohalogenation() {
    finishReaction("C3H7Cl", "2-氯丙烷", "C3H7Cl|2-氯丙烷", "丙烯的碳碳𝝿鍵打斷，兩個斷𝝿鍵的C原子，含H較多的C連接H，另一個C(中間)連接Cl，轉變成2-氯丙烷(需考慮馬氏規則)");
}
function runPropeneHydration() {
    finishReaction("C3H8O", "2-丙醇", "C3H8O|2-丙醇", "丙烯的碳碳𝝿鍵打斷，兩個斷𝝿鍵的C原子，含H較多的C連接H，另一個C(中間)連接OH，轉變成異丙醇(需考慮馬氏規則)");
}

// 4. 乙醇/乙醛系列
function runEthanolMildOxidation() {
    finishReaction("CH3CHO", "乙醛", null, "乙醇為1級醇，接O的C上具有H，一般氧化劑會先將乙醇氧化成乙醛");
}
function runEthanolStrongOxidation() {
    finishReaction("CH3COOH", "乙酸", null, "乙醇為1級醇，接O的C上具有H，由於過錳酸鉀氧化力較強，故乙醇直接氧化成乙酸");
}
function runAcetaldehydeOxidation() {
    finishReaction("CH3COOH", "乙酸", null, "乙醛接O的C上具有H，經過氧化可以形成乙酸");
}
function runAcetaldehydeReduction() {
    finishReaction("C2H5OH", "乙醇", null, "醛類可以還原，變回1級醇，乙醛還原後形成乙醇");
}

// 5. 乙炔系列
function runAcetyleneFullHydrogenation() {
    finishReaction("C2H6", "乙烷", null, "乙炔的兩個碳碳𝝿鍵全數打斷，參鍵兩端的C原子各接上2個H，轉變成飽和的乙烷，亦為還原反應(C氧化數下降)。");
}
function runAcetylenePartialHydrogenation() {
    finishReaction("C2H4", "乙烯", null, "乙炔的其中一個碳碳𝝿鍵打斷，參鍵兩端的C原子各接上1個H，轉變成乙烯，此為控制條件下的部分還原反應(C氧化數下降)。");
}
function runAcetyleneFullHalogenation() {
    finishReaction("C2H2Cl4", "1,1,2,2-四氯乙烷", "C2H2Cl4|1,1,2,2-四氯乙烷", "乙炔的兩個碳碳𝝿鍵全數打斷，參鍵兩端的C原子各接上2個Cl，轉變成1,1,2,2-四氯乙烷，亦為氧化反應(C氧化數上升)。");
}
function runAcetylenePartialHalogenation() {
    finishReaction("C2H2Cl2", "反-1,2-二氯乙烯", "C2H2Cl2|反-1,2-二氯乙烯", "乙炔的其中一個碳碳𝝿鍵打斷，參鍵兩端的C原子各接上1個Cl，轉變成1,2-二氯乙烯(從反應機構可知主產物為反式)。");
}
function runAcetyleneFullHydrohalogenation() {
    finishReaction("C2H4Cl2", "1,1-二氯乙烷", "C2H4Cl2|1,1-二氯乙烷", "乙炔與足量鹵化氫反應，兩個碳碳𝝿鍵全數打斷。依馬氏規則，兩個Cl原子會接在同一個C原子上，轉變成1,1-二氯乙烷。");
}
function runAcetylenePartialHydrohalogenation() {
    finishReaction("C2H3Cl", "氯乙烯", "C2H3Cl|氯乙烯", "乙炔的其中一個碳碳𝝿鍵打斷，一個C接H，另一個C接Cl，轉變成氯乙烯，此為聚氯乙烯(PVC)的重要單體原料。");
}
function runAcetyleneHydration() {
    finishReaction("CH3CHO", "乙醛", null, "乙炔在硫酸與硫酸汞(HgSO₄)催化下與水加成，𝝿鍵斷裂後先形成不穩定的乙烯醇，隨即發生『醛酮-烯醇互變異構』，氫原子轉移，最終轉變成乙醛。");
}