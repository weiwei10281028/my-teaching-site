/*
 ==========================================================================
 ★ 視覺鍵長標準參考表 (Visual Bond Length Standards) v16.2
 ==========================================================================
 基準：以 1,2-二氯丙烷為錨點 (C-C ~ 70, C-H ~ 50, C-Cl ~ 75)
 
 [1] 原子視覺半徑貢獻 (Base Radius Contribution)
 --------------------------------------------------------------------------
  - H (氫) .................... 15  (最小，確保緊湊)
  - Row 2 (C, N, O, F) ........ 35  (基準)
  - Row 3 (Si, P, S, Cl) ...... 40  (略大)
  - Row 4 (Br) ................ 45
  - Row 5 (I, Xe) ............. 50  (最大)

 [2] 鍵級修正係數 (Bond Order Multiplier)
 --------------------------------------------------------------------------
  - 單鍵 (Single) ............. x 1.00
  - 雙鍵 (Double) ............. x 0.90
  - 參鍵 (Triple) ............. x 0.85

 [3] 常見鍵長計算範例 (Calculated Examples)
 --------------------------------------------------------------------------
  Type      Calc (R1 + R2) * Multiplier      Final Value
  -------   ---------------------------      -----------
  H-H       (15 + 15) * 1.0                  30
  C-H       (35 + 15) * 1.0                  50  (基準)
  N-H       (35 + 15) * 1.0                  50
  O-H       (35 + 15) * 1.0                  50
  P-H       (40 + 15) * 1.0                  55

  C-C       (35 + 35) * 1.0                  70  (基準)
  C=C       (35 + 35) * 0.9                  63
  C≡C       (35 + 35) * 0.85                 60
  
  C-O       (35 + 35) * 1.0                  70
  C=O       (35 + 35) * 0.9                  63

  S-O       (40 + 35) * 1.0                  75
  S=O       (40 + 35) * 0.9                  68  (SO4, SO3)
  
  P-Cl      (40 + 40) * 1.0                  80  (PCl3)
  Xe=O      (50 + 35) * 0.9                  76  (XeO3)
  
  F-F       (35 + 35) * 1.0                  70
  Cl-Cl     (40 + 40) * 1.0                  80
  I-I       (50 + 50) * 1.0                  100
 ==========================================================================
*/


const ELEMENT_PROPS = {
    // --- 第 1 週期 ---
    "H":  { ve: 1, c3d: "#F0F0F0", r3d: 12, lp: 0, mass: 1.008, en: 2.20 }, // [保留] 白灰
    "He": { ve: 2, c3d: "#A5F3FC", r3d: 11, lp: 1, mass: 4.002, en: 0 },    // [保留] 淡青

    // --- 第 2 週期 (半徑漸小: Li > Be > B > C > N > O > F) ---
    "Li": { ve: 1, c3d: "#E879F9", r3d: 26, lp: 0, mass: 6.94, en: 0.98 },  // [保留] 粉紫
    "Be": { ve: 2, c3d: "#C2F970", r3d: 22, lp: 0, mass: 9.012, en: 1.57 }, // [保留] 萊姆綠
    "B":  { ve: 3, c3d: "#FDBA74", r3d: 20, lp: 0, mass: 10.81, en: 2.04 }, // [保留] 蜜桃橘 (您喜歡的顏色)
    "C":  { ve: 4, c3d: "#94A3B8", r3d: 19, lp: 0, mass: 12.011, en: 2.55 },// [保留] 藍灰
    "N":  { ve: 5, c3d: "#3B82F6", r3d: 18, lp: 1, mass: 14.007, en: 3.04 },// [保留] 亮藍
    "O":  { ve: 6, c3d: "#EF4444", r3d: 17, lp: 2, mass: 15.999, en: 3.44 },// [保留] 紅
    "F":  { ve: 7, c3d: "#90E050", r3d: 16, lp: 3, mass: 18.998, en: 3.98 },// [保留] 鮮綠
    "Ne": { ve: 8, c3d: "#67E8F9", r3d: 15, lp: 4, mass: 20.180, en: 0 },   // [保留] 青

    // --- 第 3 週期 (半徑漸小: Na > Mg > Al > Si > P > S > Cl) ---
    "Na": { ve: 1, c3d: "#C084FC", r3d: 30, lp: 0, mass: 22.990, en: 0.93 },// [保留] 紫
    "Mg": { ve: 2, c3d: "#10B981", r3d: 26, lp: 0, mass: 24.305, en: 1.31 },// [保留] 翡翠綠
    "Al": { ve: 3, c3d: "#E2E8F0", r3d: 24, lp: 0, mass: 26.982, en: 1.61 },// [保留] 淺灰
    "Si": { ve: 4, c3d: "#CBD5E1", r3d: 22, lp: 0, mass: 28.085, en: 1.90 },// [保留] 灰
    "P":  { ve: 5, c3d: "#F97316", r3d: 21, lp: 0, mass: 30.974, en: 2.19 },// [保留] 橘
    "S":  { ve: 6, c3d: "#FACC15", r3d: 20, lp: 0, mass: 32.06, en: 2.58 }, // [保留] 黃
    "Cl": { ve: 7, c3d: "#22C55E", r3d: 19, lp: 3, mass: 35.45, en: 3.16 }, // [保留] 深綠 (比F深，符合視覺邏輯)
    "Ar": { ve: 8, c3d: "#38BDF8", r3d: 18, lp: 4, mass: 39.948, en: 0 },   // [保留] 天藍

    // --- 第 4 週期 (K > Ca > Sc ... > Br) ---
    "K":  { ve: 1, c3d: "#8B5CF6", r3d: 36, lp: 0, mass: 39.098, en: 0.82 },// [保留] 靛紫
    "Ca": { ve: 2, c3d: "#4ADE80", r3d: 32, lp: 0, mass: 40.078, en: 1.00 },// [保留] 淺綠
    "Sc": { ve: 3, c3d: "#E6E6E6", r3d: 28, lp: 0, mass: 44.96, en: 1.36 }, // [新增] CPK 銀白
    "Ti": { ve: 4, c3d: "#BFC2C7", r3d: 26, lp: 0, mass: 47.87, en: 1.54 }, // [新增] CPK 鈦灰
    "V":  { ve: 5, c3d: "#A6A6AB", r3d: 25, lp: 0, mass: 50.94, en: 1.63 }, // [新增] 灰
    "Cr": { ve: 6, c3d: "#94A3B8", r3d: 24, lp: 0, mass: 51.996, en: 1.66 },// [保留] 鉻灰
    "Mn": { ve: 7, c3d: "#D946EF", r3d: 24, lp: 0, mass: 54.938, en: 1.55 },// [保留] 紫紅 (很適合Mn)
    "Fe": { ve: 8, c3d: "#EA580C", r3d: 24, lp: 0, mass: 55.845, en: 1.83 },// [保留] 鐵鏽橘
    "Co": { ve: 9, c3d: "#F472B6", r3d: 23, lp: 0, mass: 58.93, en: 1.88 }, // [新增] CPK 粉紅 (鈷)
    "Ni": { ve: 10, c3d: "#50D050", r3d: 23, lp: 0, mass: 58.69, en: 1.91 },// [新增] CPK 綠 (鎳)
    "Cu": { ve: 11, c3d: "#D97706", r3d: 23, lp: 0, mass: 63.546, en: 1.90 },// [保留] 銅色
    "Zn": { ve: 12, c3d: "#78716C", r3d: 23, lp: 0, mass: 65.38, en: 1.65 },// [保留] 鋅灰
    "Ga": { ve: 3, c3d: "#C28F8F", r3d: 23, lp: 0, mass: 69.72, en: 1.81 }, // [新增] 紅褐
    "Ge": { ve: 4, c3d: "#668F8F", r3d: 23, lp: 0, mass: 72.63, en: 2.01 }, // [新增] 灰綠
    "As": { ve: 5, c3d: "#BD80E3", r3d: 22, lp: 0, mass: 74.92, en: 2.18 }, // [修正] 紫色 (區分 Na)
    "Se": { ve: 6, c3d: "#FFA100", r3d: 22, lp: 0, mass: 78.96, en: 2.55 }, // [修正] 深橘 (區分 P)
    "Br": { ve: 7, c3d: "#B91C1C", r3d: 21, lp: 3, mass: 79.904, en: 2.96 },// [保留] 深紅
    "Kr": { ve: 8, c3d: "#5CB8D1", r3d: 20, lp: 4, mass: 83.80, en: 3.00 }, // [新增] 青

    // --- 其他常用元素 (第 5, 6 週期) ---
    "Rb": { ve: 1, c3d: "#702EB0", r3d: 38, lp: 0, mass: 85.47, en: 0.82 }, // CPK 紫
    "Sr": { ve: 2, c3d: "#00FF00", r3d: 34, lp: 0, mass: 87.62, en: 0.95 }, // CPK 綠
    "Ag": { ve: 11, c3d: "#F1F5F9", r3d: 25, lp: 0, mass: 107.87, en: 1.93 },// [保留] 銀白
    "Sn": { ve: 4, c3d: "#668080", r3d: 25, lp: 0, mass: 118.7, en: 1.96 }, // 灰
    "Sb": { ve: 5, c3d: "#A855F7", r3d: 25, lp: 0, mass: 121.76, en: 2.05 },// [保留] 紫
    "Te": { ve: 6, c3d: "#EA580C", r3d: 25, lp: 0, mass: 127.60, en: 2.10 },// [保留] 橘褐
    "I":  { ve: 7, c3d: "#A855F7", r3d: 24, lp: 3, mass: 126.90, en: 2.66 },// [保留] 紫
    "Xe": { ve: 8, c3d: "#818CF8", r3d: 24, lp: 3, mass: 131.29, en: 2.60 },// [保留] 藍紫
    "Cs": { ve: 1, c3d: "#57178F", r3d: 42, lp: 0, mass: 132.9, en: 0.79 }, // CPK 深紫
    "Ba": { ve: 2, c3d: "#00C900", r3d: 38, lp: 0, mass: 137.3, en: 0.89 }, // CPK 深綠
    "Pt": { ve: 10, c3d: "#D0D0E0", r3d: 25, lp: 0, mass: 195.1, en: 2.28 },// 鉑
    "Au": { ve: 11, c3d: "#F59E0B", r3d: 25, lp: 0, mass: 196.97, en: 2.54 },// [保留] 金黃
    "Hg": { ve: 12, c3d: "#B8B8D0", r3d: 24, lp: 0, mass: 200.6, en: 2.00 },// 汞
    "Pb": { ve: 4, c3d: "#575961", r3d: 26, lp: 0, mass: 207.2, en: 2.33 }, // 鉛

    // --- [補齊] 金屬與放射性元素 (滿足晶體結構需求) ---
    "Po": { ve: 6, c3d: "#AB5C00", r3d: 26, lp: 0, mass: 209, en: 2.0 },    // [新增] 釙 (金屬) - 深橘褐
    "Fr": { ve: 1, c3d: "#420066", r3d: 44, lp: 0, mass: 223, en: 0.7 },    // [新增] 鍅 (1A) - 極深紫
    "Ra": { ve: 2, c3d: "#006400", r3d: 40, lp: 0, mass: 226, en: 0.9 },    // [新增] 鐳 (2A) - 深綠
// --- 電子軌域專用材質 (無文字版) ---
    // 技巧：使用不同數量的空白鍵作為 ID，這樣畫面上就不會有文字，但能區分顏色
    " ":      { ve: 0, c3d: "#3B82F6", r3d: 0 }, // s (藍)
    "  ":     { ve: 0, c3d: "#10B981", r3d: 0 }, // p (備用)
    "   ":    { ve: 0, c3d: "#F59E0B", r3d: 0 }, // d (橘)
    
    // --- 座標軸系統 ---
    "Origin": { ve: 0, c3d: "#000000", r3d: 0,    lp: 0, mass: 0, en: 0 }, // 隱藏原點
    "Axis":   { ve: 0, c3d: "#444444", r3d: 1.0,  lp: 0, mass: 0, en: 0 }, // 極細深灰軸
    "X":      { ve: 0, c3d: "#EF4444", r3d: 0,    lp: 0, mass: 0, en: 0 }, // 紅色 X
    "Y":      { ve: 0, c3d: "#22C55E", r3d: 0,    lp: 0, mass: 0, en: 0 }, // 綠色 Y
    "Z":      { ve: 0, c3d: "#3B82F6", r3d: 0,    lp: 0, mass: 0, en: 0 }  // 藍色 Z
};

// ========== [請插入這段 JS] 電子組態邏輯 ==========
    const ELECTRON_DATA = [
    // Period 1
    { z: 1, s: "H", n: "Hydrogen", cn: "氫", type: "非金屬", state: "氣體", mp: "-259°C", bp: "-253°C", p: 1, g: "1A", iupac: 1, c: "1s1", noble: "1s1" },
    { z: 2, s: "He", n: "Helium", cn: "氦", type: "非金屬", state: "氣體", mp: "-272°C", bp: "-269°C", p: 1, g: "8A", iupac: 18, c: "1s2", noble: "1s2" },
    // Period 2
    { z: 3, s: "Li", n: "Lithium", cn: "鋰", type: "金屬", state: "固體", mp: "180°C", bp: "1342°C", p: 2, g: "1A", iupac: 1, c: "1s2 2s1", noble: "[He] 2s1" },
    { z: 4, s: "Be", n: "Beryllium", cn: "鈹", type: "金屬", state: "固體", mp: "1287°C", bp: "2469°C", p: 2, g: "2A", iupac: 2, c: "1s2 2s2", noble: "[He] 2s2" },
    { z: 5, s: "B", n: "Boron", cn: "硼", type: "類金屬", state: "固體", mp: "2076°C", bp: "3927°C", p: 2, g: "3A", iupac: 13, c: "1s2 2s2 2p1", noble: "[He] 2s2 2p1" },
    { z: 6, s: "C", n: "Carbon", cn: "碳", type: "非金屬", state: "固體", mp: "3550°C", bp: "4027°C", p: 2, g: "4A", iupac: 14, c: "1s2 2s2 2p2", noble: "[He] 2s2 2p2" },
    { z: 7, s: "N", n: "Nitrogen", cn: "氮", type: "非金屬", state: "氣體", mp: "-210°C", bp: "-196°C", p: 2, g: "5A", iupac: 15, c: "1s2 2s2 2p3", noble: "[He] 2s2 2p3" },
    { z: 8, s: "O", n: "Oxygen", cn: "氧", type: "非金屬", state: "氣體", mp: "-218°C", bp: "-183°C", p: 2, g: "6A", iupac: 16, c: "1s2 2s2 2p4", noble: "[He] 2s2 2p4" },
    { z: 9, s: "F", n: "Fluorine", cn: "氟", type: "非金屬", state: "氣體", mp: "-220°C", bp: "-188°C", p: 2, g: "7A", iupac: 17, c: "1s2 2s2 2p5", noble: "[He] 2s2 2p5" },
    { z: 10, s: "Ne", n: "Neon", cn: "氖", type: "非金屬", state: "氣體", mp: "-249°C", bp: "-246°C", p: 2, g: "8A", iupac: 18, c: "1s2 2s2 2p6", noble: "[He] 2s2 2p6" },
    // Period 3
    { z: 11, s: "Na", n: "Sodium", cn: "鈉", type: "金屬", state: "固體", mp: "98°C", bp: "883°C", p: 3, g: "1A", iupac: 1, c: "1s2 2s2 2p6 3s1", noble: "[Ne] 3s1" },
    { z: 12, s: "Mg", n: "Magnesium", cn: "鎂", type: "金屬", state: "固體", mp: "650°C", bp: "1090°C", p: 3, g: "2A", iupac: 2, c: "1s2 2s2 2p6 3s2", noble: "[Ne] 3s2" },
    { z: 13, s: "Al", n: "Aluminium", cn: "鋁", type: "金屬", state: "固體", mp: "660°C", bp: "2519°C", p: 3, g: "3A", iupac: 13, c: "1s2 2s2 2p6 3s2 3p1", noble: "[Ne] 3s2 3p1" },
    { z: 14, s: "Si", n: "Silicon", cn: "矽", type: "類金屬", state: "固體", mp: "1414°C", bp: "3265°C", p: 3, g: "4A", iupac: 14, c: "1s2 2s2 2p6 3s2 3p2", noble: "[Ne] 3s2 3p2" },
    { z: 15, s: "P", n: "Phosphorus", cn: "磷", type: "非金屬", state: "固體", mp: "44°C", bp: "280°C", p: 3, g: "5A", iupac: 15, c: "1s2 2s2 2p6 3s2 3p3", noble: "[Ne] 3s2 3p3" },
    { z: 16, s: "S", n: "Sulfur", cn: "硫", type: "非金屬", state: "固體", mp: "115°C", bp: "445°C", p: 3, g: "6A", iupac: 16, c: "1s2 2s2 2p6 3s2 3p4", noble: "[Ne] 3s2 3p4" },
    { z: 17, s: "Cl", n: "Chlorine", cn: "氯", type: "非金屬", state: "氣體", mp: "-101°C", bp: "-34°C", p: 3, g: "7A", iupac: 17, c: "1s2 2s2 2p6 3s2 3p5", noble: "[Ne] 3s2 3p5" },
    { z: 18, s: "Ar", n: "Argon", cn: "氬", type: "非金屬", state: "氣體", mp: "-189°C", bp: "-186°C", p: 3, g: "8A", iupac: 18, c: "1s2 2s2 2p6 3s2 3p6", noble: "[Ne] 3s2 3p6" },
    // Period 4
    { z: 19, s: "K", n: "Potassium", cn: "鉀", type: "金屬", state: "固體", mp: "63°C", bp: "759°C", p: 4, g: "1A", iupac: 1, c: "1s2 2s2 2p6 3s2 3p6 4s1", noble: "[Ar] 4s1" },
    { z: 20, s: "Ca", n: "Calcium", cn: "鈣", type: "金屬", state: "固體", mp: "842°C", bp: "1484°C", p: 4, g: "2A", iupac: 2, c: "1s2 2s2 2p6 3s2 3p6 4s2", noble: "[Ar] 4s2" },
    { z: 21, s: "Sc", n: "Scandium", cn: "鈧", type: "金屬", state: "固體", mp: "1541°C", bp: "2836°C", p: 4, g: "3B", iupac: 3, c: "1s2 2s2 2p6 3s2 3p6 3d1 4s2", noble: "[Ar] 3d1 4s2" },
    { z: 22, s: "Ti", n: "Titanium", cn: "鈦", type: "金屬", state: "固體", mp: "1668°C", bp: "3287°C", p: 4, g: "4B", iupac: 4, c: "1s2 2s2 2p6 3s2 3p6 3d2 4s2", noble: "[Ar] 3d2 4s2" },
    { z: 23, s: "V", n: "Vanadium", cn: "釩", type: "金屬", state: "固體", mp: "1910°C", bp: "3407°C", p: 4, g: "5B", iupac: 5, c: "1s2 2s2 2p6 3s2 3p6 3d3 4s2", noble: "[Ar] 3d3 4s2" },
    { z: 24, s: "Cr", n: "Chromium", cn: "鉻", type: "金屬", state: "固體", mp: "1907°C", bp: "2671°C", p: 4, g: "6B", iupac: 6, c: "1s2 2s2 2p6 3s2 3p6 3d5 4s1", noble: "[Ar] 3d5 4s1", ex: true },    
    { z: 25, s: "Mn", n: "Manganese", cn: "錳", type: "金屬", state: "固體", mp: "1246°C", bp: "2061°C", p: 4, g: "7B", iupac: 7, c: "1s2 2s2 2p6 3s2 3p6 3d5 4s2", noble: "[Ar] 3d5 4s2" },
    { z: 26, s: "Fe", n: "Iron", cn: "鐵", type: "金屬", state: "固體", mp: "1538°C", bp: "2861°C", p: 4, g: "8B", iupac: 8, c: "1s2 2s2 2p6 3s2 3p6 3d6 4s2", noble: "[Ar] 3d6 4s2" },
    { z: 27, s: "Co", n: "Cobalt", cn: "鈷", type: "金屬", state: "固體", mp: "1495°C", bp: "2927°C", p: 4, g: "8B", iupac: 9, c: "1s2 2s2 2p6 3s2 3p6 3d7 4s2", noble: "[Ar] 3d7 4s2" },
    { z: 28, s: "Ni", n: "Nickel", cn: "鎳", type: "金屬", state: "固體", mp: "1455°C", bp: "2730°C", p: 4, g: "8B", iupac: 10, c: "1s2 2s2 2p6 3s2 3p6 3d8 4s2", noble: "[Ar] 3d8 4s2" },
    { z: 29, s: "Cu", n: "Copper", cn: "銅", type: "金屬", state: "固體", mp: "1085°C", bp: "2562°C", p: 4, g: "1B", iupac: 11, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s1", noble: "[Ar] 3d10 4s1", ex: true },
    { z: 30, s: "Zn", n: "Zinc", cn: "鋅", type: "金屬", state: "固體", mp: "420°C", bp: "907°C", p: 4, g: "2B", iupac: 12, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2", noble: "[Ar] 3d10 4s2" },
    { z: 31, s: "Ga", n: "Gallium", cn: "鎵", type: "金屬", state: "固體", mp: "30°C", bp: "2204°C", p: 4, g: "3A", iupac: 13, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p1", noble: "[Ar] 3d10 4s2 4p1" },
    { z: 32, s: "Ge", n: "Germanium", cn: "鍺", type: "類金屬", state: "固體", mp: "938°C", bp: "2833°C", p: 4, g: "4A", iupac: 14, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p2", noble: "[Ar] 3d10 4s2 4p2" },
    { z: 33, s: "As", n: "Arsenic", cn: "砷", type: "類金屬", state: "固體", mp: "817°C", bp: "614°C", p: 4, g: "5A", iupac: 15, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p3", noble: "[Ar] 3d10 4s2 4p3" },
    { z: 34, s: "Se", n: "Selenium", cn: "硒", type: "非金屬", state: "固體", mp: "221°C", bp: "685°C", p: 4, g: "6A", iupac: 16, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p4", noble: "[Ar] 3d10 4s2 4p4" },
    { z: 35, s: "Br", n: "Bromine", cn: "溴", type: "非金屬", state: "液體", mp: "-7°C", bp: "59°C", p: 4, g: "7A", iupac: 17, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p5", noble: "[Ar] 3d10 4s2 4p5" },
    { z: 36, s: "Kr", n: "Krypton", cn: "氪", type: "非金屬", state: "氣體", mp: "-157°C", bp: "-153°C", p: 4, g: "8A", iupac: 18, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6", noble: "[Ar] 3d10 4s2 4p6" },
    // Period 5
    { z: 37, s: "Rb", n: "Rubidium", cn: "銣", type: "金屬", state: "固體", mp: "39°C", bp: "688°C", p: 5, g: "1A", iupac: 1, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 5s1", noble: "[Kr] 5s1" },
    { z: 38, s: "Sr", n: "Strontium", cn: "鍶", type: "金屬", state: "固體", mp: "777°C", bp: "1382°C", p: 5, g: "2A", iupac: 2, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 5s2", noble: "[Kr] 5s2" },
    { z: 39, s: "Y", n: "Yttrium", cn: "釔", type: "金屬", state: "固體", mp: "1526°C", bp: "3338°C", p: 5, g: "3B", iupac: 3, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d1 5s2", noble: "[Kr] 4d1 5s2" },
    { z: 40, s: "Zr", n: "Zirconium", cn: "鋯", type: "金屬", state: "固體", mp: "1855°C", bp: "4409°C", p: 5, g: "4B", iupac: 4, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d2 5s2", noble: "[Kr] 4d2 5s2" },
    { z: 41, s: "Nb", n: "Niobium", cn: "鈮", type: "金屬", state: "固體", mp: "2477°C", bp: "4744°C", p: 5, g: "5B", iupac: 5, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d4 5s1", noble: "[Kr] 4d4 5s1", ex: true },    
    { z: 42, s: "Mo", n: "Molybdenum", cn: "鉬", type: "金屬", state: "固體", mp: "2623°C", bp: "4639°C", p: 5, g: "6B", iupac: 6, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d5 5s1", noble: "[Kr] 4d5 5s1", ex: true },    
    { z: 43, s: "Tc", n: "Technetium", cn: "鎝", type: "金屬", state: "固體", mp: "2157°C", bp: "4265°C", p: 5, g: "7B", iupac: 7, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d5 5s2", noble: "[Kr] 4d5 5s2" },
    { z: 44, s: "Ru", n: "Ruthenium", cn: "釕", type: "金屬", state: "固體", mp: "2334°C", bp: "4150°C", p: 5, g: "8B", iupac: 8, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d7 5s1", noble: "[Kr] 4d7 5s1" },
    { z: 45, s: "Rh", n: "Rhodium", cn: "銠", type: "金屬", state: "固體", mp: "1964°C", bp: "3695°C", p: 5, g: "8B", iupac: 9, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d8 5s1", noble: "[Kr] 4d8 5s1", ex: true },    
    { z: 46, s: "Pd", n: "Palladium", cn: "鈀", type: "金屬", state: "固體", mp: "1555°C", bp: "2963°C", p: 5, g: "8B", iupac: 10, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10", noble: "[Kr] 4d10", ex: true },    
    { z: 47, s: "Ag", n: "Silver", cn: "銀", type: "金屬", state: "固體", mp: "962°C", bp: "2162°C", p: 5, g: "1B", iupac: 11, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s1", noble: "[Kr] 4d10 5s1", ex: true },    
    { z: 48, s: "Cd", n: "Cadmium", cn: "鎘", type: "金屬", state: "固體", mp: "321°C", bp: "767°C", p: 5, g: "2B", iupac: 12, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2", noble: "[Kr] 4d10 5s2" },
    { z: 49, s: "In", n: "Indium", cn: "銦", type: "金屬", state: "固體", mp: "157°C", bp: "2072°C", p: 5, g: "3A", iupac: 13, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p1", noble: "[Kr] 4d10 5s2 5p1" },
    { z: 50, s: "Sn", n: "Tin", cn: "錫", type: "金屬", state: "固體", mp: "232°C", bp: "2602°C", p: 5, g: "4A", iupac: 14, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p2", noble: "[Kr] 4d10 5s2 5p2" },
    { z: 51, s: "Sb", n: "Antimony", cn: "銻", type: "類金屬", state: "固體", mp: "631°C", bp: "1587°C", p: 5, g: "5A", iupac: 15, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p3", noble: "[Kr] 4d10 5s2 5p3" },
    { z: 52, s: "Te", n: "Tellurium", cn: "碲", type: "類金屬", state: "固體", mp: "450°C", bp: "988°C", p: 5, g: "6A", iupac: 16, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p4", noble: "[Kr] 4d10 5s2 5p4" },
    { z: 53, s: "I", n: "Iodine", cn: "碘", type: "非金屬", state: "固體", mp: "114°C", bp: "184°C", p: 5, g: "7A", iupac: 17, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p5", noble: "[Kr] 4d10 5s2 5p5" },
    { z: 54, s: "Xe", n: "Xenon", cn: "氙", type: "非金屬", state: "氣體", mp: "-112°C", bp: "-108°C", p: 5, g: "8A", iupac: 18, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6", noble: "[Kr] 4d10 5s2 5p6" },
    // Period 6
    { z: 55, s: "Cs", n: "Cesium", cn: "銫", type: "金屬", state: "固體", mp: "28°C", bp: "671°C", p: 6, g: "1A", iupac: 1, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 6s1", noble: "[Xe] 6s1" },
    { z: 56, s: "Ba", n: "Barium", cn: "鋇", type: "金屬", state: "固體", mp: "727°C", bp: "1897°C", p: 6, g: "2A", iupac: 2, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 6s2", noble: "[Xe] 6s2" },
    { z: 57, s: "La", n: "Lanthanum", cn: "鑭", type: "金屬", state: "固體", mp: "920°C", bp: "3464°C", p: 6, g: "鑭系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 5d1 6s2", noble: "[Xe] 5d1 6s2", ex: true },    
    { z: 58, s: "Ce", n: "Cerium", cn: "鈰", type: "金屬", state: "固體", mp: "795°C", bp: "3443°C", p: 6, g: "鑭系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f1 5d1 6s2", noble: "[Xe] 4f1 5d1 6s2", ex: true },    
    { z: 59, s: "Pr", n: "Praseodymium", cn: "鐠", type: "金屬", state: "固體", mp: "931°C", bp: "3520°C", p: 6, g: "鑭系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f3 6s2", noble: "[Xe] 4f3 6s2" },
    { z: 60, s: "Nd", n: "Neodymium", cn: "釹", type: "金屬", state: "固體", mp: "1024°C", bp: "3074°C", p: 6, g: "鑭系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f4 6s2", noble: "[Xe] 4f4 6s2" },
    { z: 61, s: "Pm", n: "Promethium", cn: "鉕", type: "金屬", state: "固體", mp: "1042°C", bp: "3000°C", p: 6, g: "鑭系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f5 6s2", noble: "[Xe] 4f5 6s2" },
    { z: 62, s: "Sm", n: "Samarium", cn: "釤", type: "金屬", state: "固體", mp: "1072°C", bp: "1794°C", p: 6, g: "鑭系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f6 6s2", noble: "[Xe] 4f6 6s2" },
    { z: 63, s: "Eu", n: "Europium", cn: "銪", type: "金屬", state: "固體", mp: "826°C", bp: "1529°C", p: 6, g: "鑭系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f7 6s2", noble: "[Xe] 4f7 6s2" },
    { z: 64, s: "Gd", n: "Gadolinium", cn: "釓", type: "金屬", state: "固體", mp: "1312°C", bp: "3273°C", p: 6, g: "鑭系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f7 5d1 6s2", noble: "[Xe] 4f7 5d1 6s2", ex: true },    
    { z: 65, s: "Tb", n: "Terbium", cn: "鋱", type: "金屬", state: "固體", mp: "1356°C", bp: "3230°C", p: 6, g: "鑭系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f9 6s2", noble: "[Xe] 4f9 6s2" },
    { z: 66, s: "Dy", n: "Dysprosium", cn: "鏑", type: "金屬", state: "固體", mp: "1407°C", bp: "2567°C", p: 6, g: "鑭系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f10 6s2", noble: "[Xe] 4f10 6s2" },
    { z: 67, s: "Ho", n: "Holmium", cn: "鈥", type: "金屬", state: "固體", mp: "1461°C", bp: "2720°C", p: 6, g: "鑭系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f11 6s2", noble: "[Xe] 4f11 6s2" },
    { z: 68, s: "Er", n: "Erbium", cn: "鉺", type: "金屬", state: "固體", mp: "1529°C", bp: "2868°C", p: 6, g: "鑭系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f12 6s2", noble: "[Xe] 4f12 6s2" },
    { z: 69, s: "Tm", n: "Thulium", cn: "銩", type: "金屬", state: "固體", mp: "1545°C", bp: "1950°C", p: 6, g: "鑭系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f13 6s2", noble: "[Xe] 4f13 6s2" },
    { z: 70, s: "Yb", n: "Ytterbium", cn: "鐿", type: "金屬", state: "固體", mp: "824°C", bp: "1196°C", p: 6, g: "鑭系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 6s2", noble: "[Xe] 4f14 6s2" },
    { z: 71, s: "Lu", n: "Lutetium", cn: "鎦", type: "金屬", state: "固體", mp: "1663°C", bp: "3402°C", p: 6, g: "鑭系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d1 6s2", noble: "[Xe] 4f14 5d1 6s2" },
    { z: 72, s: "Hf", n: "Hafnium", cn: "鉿", type: "金屬", state: "固體", mp: "2233°C", bp: "4603°C", p: 6, g: "4B", iupac: 4, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d2 6s2", noble: "[Xe] 4f14 5d2 6s2" },
    { z: 73, s: "Ta", n: "Tantalum", cn: "鉭", type: "金屬", state: "固體", mp: "3017°C", bp: "5458°C", p: 6, g: "5B", iupac: 5, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d3 6s2", noble: "[Xe] 4f14 5d3 6s2" },
    { z: 74, s: "W", n: "Tungsten", cn: "鎢", type: "金屬", state: "固體", mp: "3422°C", bp: "5930°C", p: 6, g: "6B", iupac: 6, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d4 6s2", noble: "[Xe] 4f14 5d4 6s2" },
    { z: 75, s: "Re", n: "Rhenium", cn: "錸", type: "金屬", state: "固體", mp: "3186°C", bp: "5596°C", p: 6, g: "7B", iupac: 7, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d5 6s2", noble: "[Xe] 4f14 5d5 6s2" },
    { z: 76, s: "Os", n: "Osmium", cn: "鋨", type: "金屬", state: "固體", mp: "3033°C", bp: "5012°C", p: 6, g: "8B", iupac: 8, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d6 6s2", noble: "[Xe] 4f14 5d6 6s2" },
    { z: 77, s: "Ir", n: "Iridium", cn: "銥", type: "金屬", state: "固體", mp: "2446°C", bp: "4428°C", p: 6, g: "8B", iupac: 9, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d7 6s2", noble: "[Xe] 4f14 5d7 6s2" },
    { z: 78, s: "Pt", n: "Platinum", cn: "鉑", type: "金屬", state: "固體", mp: "1768°C", bp: "3825°C", p: 6, g: "8B", iupac: 10, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d9 6s1", noble: "[Xe] 4f14 5d9 6s1", ex: true },    
    { z: 79, s: "Au", n: "Gold", cn: "金", type: "金屬", state: "固體", mp: "1064°C", bp: "2970°C", p: 6, g: "1B", iupac: 11, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s1", noble: "[Xe] 4f14 5d10 6s1", ex: true },    
    { z: 80, s: "Hg", n: "Mercury", cn: "汞", type: "金屬", state: "液體", mp: "-39°C", bp: "357°C", p: 6, g: "2B", iupac: 12, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2", noble: "[Xe] 4f14 5d10 6s2" },
    { z: 81, s: "Tl", n: "Thallium", cn: "鉈", type: "金屬", state: "固體", mp: "304°C", bp: "1473°C", p: 6, g: "3A", iupac: 13, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p1", noble: "[Xe] 4f14 5d10 6s2 6p1" },
    { z: 82, s: "Pb", n: "Lead", cn: "鉛", type: "金屬", state: "固體", mp: "327°C", bp: "1749°C", p: 6, g: "4A", iupac: 14, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p2", noble: "[Xe] 4f14 5d10 6s2 6p2" },
    { z: 83, s: "Bi", n: "Bismuth", cn: "鉍", type: "金屬", state: "固體", mp: "271°C", bp: "1564°C", p: 6, g: "5A", iupac: 15, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p3", noble: "[Xe] 4f14 5d10 6s2 6p3" },
    { z: 84, s: "Po", n: "Polonium", cn: "釙", type: "金屬", state: "固體", mp: "254°C", bp: "962°C", p: 6, g: "6A", iupac: 16, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p4", noble: "[Xe] 4f14 5d10 6s2 6p4" },
    { z: 85, s: "At", n: "Astatine", cn: "砈", type: "類金屬", state: "固體", mp: "302°C", bp: "337°C", p: 6, g: "7A", iupac: 17, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p5", noble: "[Xe] 4f14 5d10 6s2 6p5" },
    { z: 86, s: "Rn", n: "Radon", cn: "氡", type: "非金屬", state: "氣體", mp: "-71°C", bp: "-62°C", p: 6, g: "8A", iupac: 18, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6", noble: "[Xe] 4f14 5d10 6s2 6p6" },
    // Period 7
    { z: 87, s: "Fr", n: "Francium", cn: "鍅", type: "金屬", state: "固體", mp: "27°C", bp: "677°C", p: 7, g: "1A", iupac: 1, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 7s1", noble: "[Rn] 7s1" },
    { z: 88, s: "Ra", n: "Radium", cn: "鐳", type: "金屬", state: "固體", mp: "700°C", bp: "1737°C", p: 7, g: "2A", iupac: 2, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 7s2", noble: "[Rn] 7s2" },
    { z: 89, s: "Ac", n: "Actinium", cn: "錒", type: "金屬", state: "固體", mp: "1050°C", bp: "3198°C", p: 7, g: "錒系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 6d1 7s2", noble: "[Rn] 6d1 7s2", ex: true },
    { z: 90, s: "Th", n: "Thorium", cn: "釷", type: "金屬", state: "固體", mp: "1750°C", bp: "4788°C", p: 7, g: "錒系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 6d2 7s2", noble: "[Rn] 6d2 7s2", ex: true },
    { z: 91, s: "Pa", n: "Protactinium", cn: "鏷", type: "金屬", state: "固體", mp: "1568°C", bp: "4027°C", p: 7, g: "錒系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f2 6d1 7s2", noble: "[Rn] 5f2 6d1 7s2", ex: true },
    { z: 92, s: "U", n: "Uranium", cn: "鈾", type: "金屬", state: "固體", mp: "1132°C", bp: "4131°C", p: 7, g: "錒系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f3 6d1 7s2", noble: "[Rn] 5f3 6d1 7s2", ex: true },
    { z: 93, s: "Np", n: "Neptunium", cn: "錼", type: "金屬", state: "固體", mp: "644°C", bp: "3902°C", p: 7, g: "錒系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f4 6d1 7s2", noble: "[Rn] 5f4 6d1 7s2", ex: true },
    { z: 94, s: "Pu", n: "Plutonium", cn: "鈽", type: "金屬", state: "固體", mp: "640°C", bp: "3228°C", p: 7, g: "錒系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f6 7s2", noble: "[Rn] 5f6 7s2" },
    { z: 95, s: "Am", n: "Americium", cn: "鋂", type: "金屬", state: "固體", mp: "1176°C", bp: "2607°C", p: 7, g: "錒系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f7 7s2", noble: "[Rn] 5f7 7s2" },
    { z: 96, s: "Cm", n: "Curium", cn: "鋦", type: "金屬", state: "固體", mp: "1340°C", bp: "3110°C", p: 7, g: "錒系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f7 6d1 7s2", noble: "[Rn] 5f7 6d1 7s2", ex: true },    
    { z: 97, s: "Bk", n: "Berkelium", cn: "鉳", type: "金屬", state: "固體", mp: "986°C", bp: "-", p: 7, g: "錒系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f9 7s2", noble: "[Rn] 5f9 7s2" },
    { z: 98, s: "Cf", n: "Californium", cn: "鉲", type: "金屬", state: "固體", mp: "900°C", bp: "-", p: 7, g: "錒系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f10 7s2", noble: "[Rn] 5f10 7s2" },
    { z: 99, s: "Es", n: "Einsteinium", cn: "鑀", type: "金屬", state: "固體", mp: "860°C", bp: "-", p: 7, g: "錒系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f11 7s2", noble: "[Rn] 5f11 7s2" },
    { z: 100, s: "Fm", n: "Fermium", cn: "鐨", type: "金屬", state: "固體", mp: "1527°C", bp: "-", p: 7, g: "錒系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f12 7s2", noble: "[Rn] 5f12 7s2" },
    { z: 101, s: "Md", n: "Mendelevium", cn: "鍆", type: "金屬", state: "固體", mp: "827°C", bp: "-", p: 7, g: "錒系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f13 7s2", noble: "[Rn] 5f13 7s2" },
    { z: 102, s: "No", n: "Nobelium", cn: "鍩", type: "金屬", state: "固體", mp: "827°C", bp: "-", p: 7, g: "錒系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f14 7s2", noble: "[Rn] 5f14 7s2" },
    { z: 103, s: "Lr", n: "Lawrencium", cn: "鐒", type: "金屬", state: "固體", mp: "1627°C", bp: "-", p: 7, g: "錒系", iupac: "-", c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f14 7s2 7p1", noble: "[Rn] 5f14 7s2 7p1" },
    { z: 104, s: "Rf", n: "Rutherfordium", cn: "鑪", type: "金屬", state: "固體", mp: "-", bp: "-", p: 7, g: "4B", iupac: 4, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f14 6d2 7s2", noble: "[Rn] 5f14 6d2 7s2" },
    { z: 105, s: "Db", n: "Dubnium", cn: "𨧀", type: "金屬", state: "固體", mp: "-", bp: "-", p: 7, g: "5B", iupac: 5, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f14 6d3 7s2", noble: "[Rn] 5f14 6d3 7s2" },
    { z: 106, s: "Sg", n: "Seaborgium", cn: "𨭎", type: "金屬", state: "固體", mp: "-", bp: "-", p: 7, g: "6B", iupac: 6, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f14 6d4 7s2", noble: "[Rn] 5f14 6d4 7s2" },
    { z: 107, s: "Bh", n: "Bohrium", cn: "𨨏", type: "金屬", state: "固體", mp: "-", bp: "-", p: 7, g: "7B", iupac: 7, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f14 6d5 7s2", noble: "[Rn] 5f14 6d5 7s2" },
    { z: 108, s: "Hs", n: "Hassium", cn: "𨭆", type: "金屬", state: "固體", mp: "-", bp: "-", p: 7, g: "8B", iupac: 8, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f14 6d6 7s2", noble: "[Rn] 5f14 6d6 7s2" },
    { z: 109, s: "Mt", n: "Meitnerium", cn: "䥑", type: "金屬", state: "固體", mp: "-", bp: "-", p: 7, g: "8B", iupac: 9, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f14 6d7 7s2", noble: "[Rn] 5f14 6d7 7s2" },
    { z: 110, s: "Ds", n: "Darmstadtium", cn: "鐽", type: "金屬", state: "固體", mp: "-", bp: "-", p: 7, g: "8B", iupac: 10, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f14 6d8 7s2", noble: "[Rn] 5f14 6d8 7s2" },
    { z: 111, s: "Rg", n: "Roentgenium", cn: "錀", type: "金屬", state: "固體", mp: "-", bp: "-", p: 7, g: "1B", iupac: 11, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f14 6d9 7s2", noble: "[Rn] 5f14 6d9 7s2" },
    { z: 112, s: "Cn", n: "Copernicium", cn: "鎶", type: "金屬", state: "固體", mp: "-", bp: "-", p: 7, g: "2B", iupac: 12, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f14 6d10 7s2", noble: "[Rn] 5f14 6d10 7s2" },
    { z: 113, s: "Nh", n: "Nihonium", cn: "鉨", type: "金屬", state: "固體", mp: "-", bp: "-", p: 7, g: "3A", iupac: 13, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f14 6d10 7s2 7p1", noble: "[Rn] 5f14 6d10 7s2 7p1" },
    { z: 114, s: "Fl", n: "Flerovium", cn: "鈇", type: "金屬", state: "固體", mp: "-", bp: "-", p: 7, g: "4A", iupac: 14, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f14 6d10 7s2 7p2", noble: "[Rn] 5f14 6d10 7s2 7p2" },
    { z: 115, s: "Mc", n: "Moscovium", cn: "鏌", type: "金屬", state: "固體", mp: "-", bp: "-", p: 7, g: "5A", iupac: 15, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f14 6d10 7s2 7p3", noble: "[Rn] 5f14 6d10 7s2 7p3" },
    { z: 116, s: "Lv", n: "Livermorium", cn: "鉝", type: "金屬", state: "固體", mp: "-", bp: "-", p: 7, g: "6A", iupac: 16, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f14 6d10 7s2 7p4", noble: "[Rn] 5f14 6d10 7s2 7p4" },
    { z: 117, s: "Ts", n: "Tennessine", cn: "鿬", type: "類金屬", state: "固體", mp: "-", bp: "-", p: 7, g: "7A", iupac: 17, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f14 6d10 7s2 7p5", noble: "[Rn] 5f14 6d10 7s2 7p5" },
    { z: 118, s: "Og", n: "Oganesson", cn: "鿫", type: "非金屬", state: "氣體", mp: "-", bp: "-", p: 7, g: "8A", iupac: 18, c: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6 5f14 6d10 7s2 7p6", noble: "[Rn] 5f14 6d10 7s2 7p6" }
];



