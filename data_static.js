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

// ========== [每日運勢資料庫：最終修訂版] ==========
const ELEMENT_FORTUNES = [
    // 1. H 氫
    { z: 1, s: "H", n: "氫", title: "起源", title_en: "Genesis", oracle_text: "萬物皆始於單純的一；最簡單的結構，往往蘊含著驅動恆星的無限能量。", score: 5, guide: "你正處於一個絕對的起點，身上沒有過去的包袱，如同宇宙初開般純粹。這股能量適合用來啟動任何全新的計畫，或是一個猶豫已久的改變。", science: "宇宙大爆炸後的第一個元素，恆星能量來源。" },
    { z: 1, s: "H", n: "氫", title: "起源", title_en: "Genesis", oracle_text: "萬物皆始於單純的一；最簡單的結構，往往蘊含著驅動恆星的無限能量。", score: 3, guide: "雖然單一個體的力量微弱，但當你願意與他人建立連結，就能形成維持生命運作的強大結構。不必強求獨自閃耀，在團隊中扮演那個關鍵的連結者，你的存在感將無可取代。", science: "氫鍵雖然個別微弱，卻是維持DNA結構與水分子特性的關鍵力量。" },

    // 2. He 氦
    { z: 2, s: "He", n: "氦", title: "獨行者", title_en: "The Loner", oracle_text: "真正的自由，是雖然身處人群，卻能保持完整的自我，不隨世俗起舞。", score: 3, guide: "保持適度的抽離與高冷，是你此刻最需要的智慧。當周遭充滿喧囂與盲從時，不必勉強融入。像氣球抗拒地心引力般，讓心靈輕輕飄浮在煩惱之上。", science: "惰性氣體，不活潑且密度比空氣小。" },
    { z: 2, s: "He", n: "氦", title: "獨行者", title_en: "The Loner", oracle_text: "真正的自由，是雖然身處人群，卻能保持完整的自我，不隨世俗起舞。", score: 5, guide: "阻力最小的時刻。你現在的狀態極佳，能夠像超流體一樣，毫不費力地越過原本看似不可能的障礙。保持純粹與低摩擦的處事態度，困難將會自動為你讓路。", science: "液態氦在接近絕對零度時會出現超流體現象，能無摩擦地流動甚至爬上杯壁。" },

    // 3. Li 鋰
    { z: 3, s: "Li", n: "鋰", title: "電池", title_en: "Battery", oracle_text: "能量需要載體，情緒需要出口；懂得適時充電與釋放，才能走得長遠。", score: 4, guide: "此刻的效率極高，思緒運轉乾淨俐落，正如一顆充飽電的電池。這是衝刺目標的最佳時機，但請謹記，能量輸出的目的是為了達成目標，而非耗盡自我。", science: "標準還原電位最低，現代電池核心。" },
    { z: 3, s: "Li", n: "鋰", title: "電池", title_en: "Battery", oracle_text: "能量需要載體，情緒需要出口；懂得適時充電與釋放，才能走得長遠。", score: 2, guide: "情緒如同一杯水，看似平靜卻可能因一點刺激而沸騰。你現在的反應活性極高，容易因為外界的一點小事就炸毛。請遠離潮濕混亂的環境，保持乾燥冷靜是今天的保命符。", science: "鋰是鹼金屬，活性大，遇到水會劇烈反應產生氫氣與熱。" },

    // 4. Be 鈹
    { z: 4, s: "Be", n: "鈹", title: "綠寶石", title_en: "Emerald", oracle_text: "珍貴的事物往往帶點刺；保持獨特的原則，即便在群體中，也不必跟隨他人。", score: 3, guide: "若你感到與周遭環境格格不入，那是因為你擁有獨特的本質。堅持你的原則與審美，不需要為了合群而磨平自己的稜角。那份不輕易妥協的高冷與堅硬，正是你如同寶石般珍貴的價值所在。", science: "鈹是綠寶石成分，化學性質獨特，傾向共價鍵。" },
    { z: 4, s: "Be", n: "鈹", title: "綠寶石", title_en: "Emerald", oracle_text: "珍貴的事物往往帶點刺；保持獨特的原則，即便在群體中，也不必跟隨他人。", score: 4, guide: "讓光線穿透你，而不是阻擋它。對於真相或外界的檢視，不需要過度防禦。你擁有極佳的通透性，展現真實的內在結構，反而能讓你通過考驗，讓人看見你毫無雜質的本心。", science: "鈹原子序小，對X射線的穿透率極高，常被用作X光機的窗口。" },

    // 5. B 硼
    { z: 5, s: "B", n: "硼", title: "特異", title_en: "Uniqueness", oracle_text: "完美的標準不只有一種；有時候，容許自己的缺憾存在，反而能創新連結。", score: 3, guide: "不必強迫自己符合世俗眼中的完美標準。你此刻感到的某些不足或缺口，其實是連結他人的契機。正因為不完整，才讓你不得不向外尋求協作，進而遇見互補的夥伴。", science: "硼是缺電子化合物，易接受電子對（路易士酸）。" },
    { z: 5, s: "B", n: "硼", title: "特異", title_en: "Uniqueness", oracle_text: "完美的標準不只有一種；有時候，容許自己的缺憾存在，反而能創新連結。", score: 4, guide: "看似不起眼的添加，卻能帶來質的飛躍。你不需要成為主角，只要在關鍵時刻加入一點點你的想法，就能讓整個團隊的結構變得耐熱且堅固。你的微小貢獻，將是強化的關鍵。", science: "硼加入玻璃中可製成耐熱玻璃（派熱克斯玻璃），大幅增加抗熱衝擊性。" },

    // 6. C 碳
    { z: 6, s: "C", n: "碳", title: "萬變", title_en: "Change", oracle_text: "價值取決於你的排列方式；在壓力之下，柔軟的黑炭也能轉化為堅不可摧的鑽石。", score: 3, guide: "彈性與角色切換是此刻的生存之道。面對高壓的環境，你需要展現鑽石般的堅毅；而在需要協調的場合，則需像石墨般身段柔軟。沒有哪一種面貌是絕對的，隨著環境自由調整形態，你將無堅不摧。", science: "同素異形體：鑽石（硬）與石墨（軟）。" },
    { z: 6, s: "C", n: "碳", title: "萬變", title_en: "Change", oracle_text: "價值取決於你的排列方式；在壓力之下，柔軟的黑炭也能轉化為堅不可摧的鑽石。", score: 5, guide: "你的連結能力正處於巔峰。就像能形成無數種化合物的碳一樣，你擁有無限的骨架搭建能力。不管是串聯人脈還是組織架構，現在是擴展版圖的最佳時機，全世界都是你的有機體。", science: "碳能形成長鏈與環狀結構，構成有機化學的骨架，擁有超過一千萬種化合物。" },

    // 7. N 氮
    { z: 7, s: "N", n: "氮", title: "雙面刃", title_en: "Double Edge", oracle_text: "沈默不代表軟弱；最平靜的空氣中，往往壓縮著足以撼動大地的爆發力。", score: 5, guide: "你擁有深藏不露的實力。外表的平靜隨和並非弱軟，而是內在底氣的展現。不需要大聲嚷嚷來證明什麼，只要時機成熟，你隨時能展現出驚人的爆發力，讓輕視你的人刮目相看。", science: "氮氣穩定，但氮的化合物（如炸藥）極具爆發力。" },
    { z: 7, s: "N", n: "氮", title: "雙面刃", title_en: "Double Edge", oracle_text: "沈默不代表軟弱；最平靜的空氣中，往往壓縮著足以撼動大地的爆發力。", score: 2, guide: "氣氛降到了冰點。你可能感到周遭環境冷漠，或是自己對什麼都提不起勁。這就像液態氮一樣，能瞬間凍結熱情。小心不要讓這股冷漠凍傷了親近的人，適度回溫是必要的。", science: "液態氮溫度極低（-196°C），常用於急速冷凍。" },

    // 8. O 氧
    { z: 8, s: "O", n: "氧", title: "點火", title_en: "Ignition", oracle_text: "生命是一場不斷的交換；想要發光發熱，就必須擁抱那股讓事物劇烈改變的熱情。", score: 5, guide: "你的熱情具有強大的傳染力，如同助燃劑般能點燃周遭死氣沈沈的氛圍。此刻非常適合推動停滯的計畫，或是大膽表達情感。不要吝嗇你的光與熱，去成為那個帶動氣氛的核心人物。", science: "氧是助燃劑，雖然自己不燃燒，但能劇烈加速燃燒反應。" },
    { z: 8, s: "O", n: "氧", title: "點火", title_en: "Ignition", oracle_text: "生命是一場不斷的交換；想要發光發熱，就必須擁抱那股讓事物劇烈改變的熱情。", score: 3, guide: "氧化是必經的過程，也就是老化與鏽蝕。你可能感到體力或熱情正在緩慢流失，這不是壞事，而是一種穩定的能量釋放。接受這種緩慢的變化，與其對抗歲月，不如優雅地與之共存。", science: "緩慢氧化是自然界普遍現象（如生鏽、老化），與劇烈燃燒不同。" },

    // 9. F 氟
    { z: 9, s: "F", n: "氟", title: "掠奪者", title_en: "Predator", oracle_text: "渴望是一種無法停止的反應；當你對目標的執著強烈到極致，世界將不得不回應。", score: 2, guide: "強烈的渴望能驅動成就，但也可能演變為具破壞性的執著。檢視你當下的慾望是否過於熾熱，太過強勢的掠奪姿態雖然能短期獲利，卻可能腐蝕珍貴的關係。適度收斂霸氣，退一步看清局勢。", science: "電負度最高，掠奪電子能力最強，極具腐蝕性。" },
    { z: 9, s: "F", n: "氟", title: "掠奪者", title_en: "Predator", oracle_text: "渴望是一種無法停止的反應；當你對目標的執著強烈到極致，世界將不得不回應。", score: 4, guide: "建立起你的防護層。像鐵氟龍一樣，讓那些煩人的瑣事、流言蜚語無法附著在你身上。你不需要去攻擊別人，只需要保持一種極度穩定的不沾鍋狀態，任何麻煩都會自動滑落。", science: "氟碳化合物（如特氟龍）鍵結極強，具有抗酸鹼、不沾黏的特性。" },

    // 10. Ne 氖
    { z: 10, s: "Ne", n: "氖", title: "霓虹", title_en: "Neon", oracle_text: "你不必改變本質去迎合他人；只需在黑暗中通電，展現你原本的顏色，就能成為指引。", score: 4, guide: "做自己就是最強大的吸引力。你不必刻意模仿他人的模樣，只要在適當的舞台上展現本質，那份自信就像夜裡的招牌一樣引人注目。相信自己獨特的色彩，光是自信地存在著，就足以成為他人的指引。", science: "通電後發出紅橘色光，霓虹燈的由來。" },
    { z: 10, s: "Ne", n: "氖", title: "霓虹", title_en: "Neon", oracle_text: "你不必改變本質去迎合他人；只需在黑暗中通電，展現你原本的顏色，就能成為指引。", score: 3, guide: "安於現狀的穩定。你對外界的誘惑不為所動，這份「不反應」的態度讓你免於捲入麻煩。雖然被批評不夠積極，但保持這種遺世獨立的姿態，是你目前最舒適的生存方式。", science: "氖是惰性氣體，化學性質極不活潑，很難與其他物質反應。" },

    // 11. Na 鈉
    { z: 11, s: "Na", n: "鈉", title: "躁動", title_en: "Restless", oracle_text: "過度的活躍源自內在的不安；柔軟的身段下，藏著一顆遇水即爆的激烈之心。", score: 2, guide: "內在的情緒如同一瓶未加蓋的汽水，些微的晃動都可能引發噴湧。這股躁動若未經疏導，極易化為衝動的言語。此刻最需要的是暫緩反應，在行動前給自己片刻緩衝，別讓一時的火花燒毀了長久累積的成果。", science: "活性大，遇水劇烈反應。" },
    { z: 11, s: "Na", n: "鈉", title: "躁動", title_en: "Restless", oracle_text: "過度的活躍源自內在的不安；柔軟的身段下，藏著一顆遇水即爆的激烈之心。", score: 4, guide: "你是不可或缺的調味劑。雖然平凡，但一旦少了你，整個團隊或生活就變得索然無味。你在群體中扮演著調節滲透壓的角色，維持著大家身心平衡與風味，這份日常的貢獻值得驕傲。", science: "鈉離子是維持體液滲透壓與神經傳導的關鍵，也是食鹽的主要成分。" },

    // 12. Mg 鎂
    { z: 12, s: "Mg", n: "鎂", title: "閃耀", title_en: "Flash", oracle_text: "燃燒是為了那一瞬間的永恆；即使是平凡的灰燼，也曾有過令人無法直視的輝煌。", score: 4, guide: "這是展現自我的絕佳時刻。無論是才華、觀點或成果，都值得被看見。雖然高強度的表現可能會帶來一時的耗損，但那一瞬間綻放的光芒，將會在他人心中留下不可磨滅的印象。不要躲藏，站到舞台中央去吧。", science: "燃燒發出耀眼白光，用於閃光燈。" },
    { z: 12, s: "Mg", n: "鎂", title: "閃耀", title_en: "Flash", oracle_text: "燃燒是為了那一瞬間的永恆；即使是平凡的灰燼，也曾有過令人無法直視的輝煌。", score: 3, guide: "輕量化是你的優勢。面對繁重的任務，試著減輕不必要的負擔，用更輕盈、更靈活的方式去執行。你不必背負沈重的外殼，保持輕巧的身段，反而能展現出優異的強度與效能。", science: "鎂是最輕的結構金屬，廣泛用於筆電與航太工業，強度高且輕。" },

    // 13. Al 鋁
    { z: 13, s: "Al", n: "鋁", title: "雙面適者", title_en: "The Adapter", oracle_text: "強大的適應力，是既能包容酸的尖銳，也能接納鹼的滑膩，並為自己穿上保護色。", score: 3, guide: "面對複雜多變的環境，你需要如水般的適應力。無論面對尖銳的批評或是圓滑的恭維，都能應對自如。建立起心理的保護層，外圓內方，在保留核心原則的同時靈活應對，便能在夾縫中游刃有餘。", science: "兩性元素，溶於酸鹼；氧化層保護。" },
    { z: 13, s: "Al", n: "鋁", title: "雙面適者", title_en: "The Adapter", oracle_text: "強大的適應力，是既能包容酸的尖銳，也能接納鹼的滑膩，並為自己穿上保護色。", score: 4, guide: "雖然你很常見，甚至容易被忽略，但你是現代結構不可或缺的基石。你的價值在於「輕量」與「廣泛應用」。不要因為自己大眾化而自卑，你的普及率與實用性，正是你影響世界的證明。", science: "地殼中含量最豐富的金屬，用途極廣，無處不在。" },

    // 14. Si 矽
    { z: 14, s: "Si", n: "矽", title: "邏輯", title_en: "Logic", oracle_text: "情感或許溫暖，但唯有冷靜的運算與邏輯，才能建構出支撐現代世界的基石。", score: 3, guide: "將豐沛的情感暫時收起，此刻是理性運算的時刻。混亂的局面需要清晰的邏輯來梳理，按部就班地處理眼前的數據與細節。雖然看似冷酷枯燥，但這份不受干擾的理性分析，是解決棘手難題的唯一途徑。", science: "半導體核心，邏輯運算基礎。" },
    { z: 14, s: "Si", n: "矽", title: "邏輯", title_en: "Logic", oracle_text: "情感或許溫暖，但唯有冷靜的運算與邏輯，才能建構出支撐現代世界的基石。", score: 4, guide: "你需要一點「不純粹」來激發潛能。就像純矽不導電，摻雜後卻能創造奇蹟。試著接受來自不同領域的意見或異質的元素，這點微小的雜質，將是你能力大躍進的關鍵摻雜劑。", science: "純矽導電性差，需透過「摻雜」（加入微量其他元素）才能成為半導體。" },

    // 15. P 磷
    { z: 15, s: "P", n: "磷", title: "火種", title_en: "Spark", oracle_text: "能量有兩種型態：一是隱忍待發的沈穩，一是接觸空氣即燃的瘋狂。", score: 3, guide: "你體內蘊藏著巨大的潛在能量，只差一個摩擦就會點燃。謹慎保管這顆火種，如同白磷需隔離空氣，紅磷則可點燃微光。選擇正確的時機與型態釋放，而非任由情緒引爆，這股力量既能是溫暖的燭光，也可能是毀滅的野火。", science: "紅磷結構穩定（火柴）；白磷活性極大、易自燃（需隔絕空氣）。" },
    { z: 15, s: "P", n: "磷", title: "火種", title_en: "Spark", oracle_text: "能量有兩種型態：一是隱忍待發的沈穩，一是接觸空氣即燃的瘋狂。", score: 4, guide: "你是生命能量的傳遞者。就像ATP攜帶能量一樣，你適合扮演資源調度或能量轉移的角色。你的介入能讓死氣沈沈的專案重新獲得動力，不要小看自己作為能量貨幣的價值。", science: "磷是ATP（三磷酸腺苷）的成分，是生物體內能量交易的貨幣。" },

    // 16. S 硫
    { z: 16, s: "S", n: "硫", title: "煉金", title_en: "Alchemy", oracle_text: "有些成長必然伴隨著難聞的氣味與高壓；這是為了讓原本軟弱的本質，轉化為堅韌。", score: 3, guide: "那些讓你感到不適的壓力或難聞的處境，其實是一場必要的轉化儀式。如同生橡膠經過硫化才能變得強韌，這些磨練是為了去除你性格中的軟弱，賦予你面對世界的彈性與韌性。堅持下去，這是升級的必經之路。", science: "硫化能讓橡膠變強韌；燃燒有異味。" },
    { z: 16, s: "S", n: "硫", title: "煉金", title_en: "Alchemy", oracle_text: "有些成長必然伴隨著難聞的氣味與高壓；這是為了讓原本軟弱的本質，轉化為堅韌。", score: 2, guide: "注意那些具有腐蝕性的氣氛。就像酸雨一樣，環境中可能瀰漫著隱性的攻擊或負面情緒，正在慢慢侵蝕你的好心情。撐起傘，保護好自己，或者遠離污染源，別讓自己被環境酸化。", science: "硫氧化物是酸雨的主要成因，具有腐蝕性。" },

    // 17. Cl 氯
    { z: 17, s: "Cl", n: "氯", title: "淨化", title_en: "Purify", oracle_text: "為了維持純淨，有時必須扮演無情的角色；清除雜質的過程，往往帶有刺鼻的代價。", score: 5, guide: "這是一個煥然一新的時刻，適合進行徹底的清理。無論是環境的髒亂，還是消耗心神的有毒關係，都應果斷斬除。雖然切斷的過程可能帶有刺痛感，但為了長遠的健康與純淨，這份無情是必要的慈悲。騰出空間，才能迎接新生。", science: "強氧化性，用於消毒漂白。" },
    { z: 17, s: "Cl", n: "氯", title: "淨化", title_en: "Purify", oracle_text: "為了維持純淨，有時必須扮演無情的角色；清除雜質的過程，往往帶有刺鼻的代價。", score: 3, guide: "你需要一個穩定的伴侶來中和你的銳氣。你現在的狀態極具攻擊性與活性，容易灼傷他人。試著尋找像鈉一樣願意包容你的夥伴，你們的結合將會從有毒的氣體轉化為滋養生命的鹽。", science: "氯氣有毒，但與鈉結合後成為食鹽（氯化鈉），是生命必需品。" },

    // 18. Ar 氬
    { z: 18, s: "Ar", n: "氬", title: "隱盾", title_en: "Hidden Shield", oracle_text: "不做任何反應，有時是最高級的保護；在熾熱的火花與高壓下，沈默是防止崩潰的盾牌。", score: 2, guide: "當外界充滿雜音與爭端時，不反應並非冷漠，而是最高級的智慧。與其捲入無謂的紛爭，不如啟動隱形護盾，對紛擾保持沈默與距離。這種不表態的隔絕，能保護你的核心價值不受高溫與氧化的侵蝕，讓你全身而退。", science: "焊接保護氣體，隔絕氧化。" },
    { z: 18, s: "Ar", n: "氬", title: "隱盾", title_en: "Hidden Shield", oracle_text: "不做任何反應，有時是最高級的保護；在熾熱的火花與高壓下，沈默是防止崩潰的盾牌。", score: 4, guide: "雖然你佔的比例看似不多，但其實無處不在。你是一種沈默的背景力量，默默支撐著大局。不要覺得自己被忽視，你的存在本身就是一種穩定的基調，讓一切得以正常運作。", science: "氬是目前大氣中含量第三多的氣體，約佔1%，常被忽略但無處不在。" },

    // 19. K 鉀
    { z: 19, s: "K", n: "鉀", title: "律動", title_en: "Rhythm", oracle_text: "生命在於流動；過度的停滯會導致枯萎，唯有順暢的傳遞，才能維持身心的平衡。", score: 3, guide: "流動是平衡的關鍵。若感到卡頓或焦慮，試著讓身體動起來，促進內在的循環。在溝通與情感上亦然，不要讓話語淤積在心底。跟隨直覺的律動去生活，保持輸入與輸出的動態平衡，活力自然會湧現。", science: "維持神經傳導與心跳節律。" },
    { z: 19, s: "K", n: "鉀", title: "律動", title_en: "Rhythm", oracle_text: "生命在於流動；過度的停滯會導致枯萎，唯有順暢的傳遞，才能維持身心的平衡。", score: 4, guide: "你的直覺正閃爍著紫色的光芒。現在的你靈性極高，對於那些看不見的氛圍或未來的趨勢有著敏銳的感知。信任那瞬間的靈光一閃，穿透表象的迷霧，你看見了別人忽略的真實。", science: "鉀的焰色反應呈現美麗的紫色，常象徵靈性與直覺。" },

    // 20. Ca 鈣
    { z: 20, s: "Ca", n: "鈣", title: "骨架", title_en: "Skeleton", oracle_text: "偉大的成就不是瞬間的火花，而是日復一日的沈澱；堅硬的骨架，源自對微小單位的堅持。", score: 3, guide: "此刻沒有捷徑，只有紮實的積累。無論是學習技能、鍛鍊身體還是儲蓄，這些看似枯燥重複的微小努力，正在一磚一瓦地建構你未來的骨架。做一個穩重可靠的人，這份厚實的基礎將成為你與他人最堅強的依靠。", science: "骨骼成分，需長期累積。" },
    { z: 20, s: "Ca", n: "鈣", title: "骨架", title_en: "Skeleton", oracle_text: "偉大的成就不是瞬間的火花，而是日復一日的沈澱；堅硬的骨架，源自對微小單位的堅持。", score: 4, guide: "你需要經歷一場沈澱後的硬化。就像鐘乳石一樣，時間是你最好的朋友。不要急著展現成果，讓經歷慢慢結晶。你現在所經歷的每一滴點滴，最終都會凝固成令人讚嘆的奇觀。", science: "石灰岩地形（鐘乳石）由碳酸鈣經年累月沈澱堆積而成。" },

    // 21. Sc 鈧
    { z: 21, s: "Sc", n: "鈧", title: "先鋒", title_en: "Pioneer", oracle_text: "萬事起頭難，但輕盈的開始是成功的關鍵；作為新時代的序幕，勇於踏入未知的領域。", score: 3, guide: "此刻是開啟新計畫的絕佳時機。你就像踏入未知領域的先行者，雖然知名度可能不高，但你的行動具有指標性意義。保持心情與腳步的輕盈，不要給自己太沈重的負擔，先跨出第一步再說。", science: "過渡金屬第一個元素，性質輕盈。" },
    { z: 21, s: "Sc", n: "鈧", title: "先鋒", title_en: "Pioneer", oracle_text: "萬事起頭難，但輕盈的開始是成功的關鍵；作為新時代的序幕，勇於踏入未知的領域。", score: 4, guide: "雖然你是稀有的，但你的價值在於強化他人。你不需要獨自戰鬥，試著加入一個既有的團隊或合金中，你的加入將會大幅提升整體的強度與性能，成為那個畫龍點睛的關鍵角色。", science: "鈧常微量加入鋁合金中，能大幅提升強度與耐用性（如鈧鋁合金）。" },

    // 22. Ti 鈦
    { z: 22, s: "Ti", n: "鈦", title: "不屈", title_en: "Unyielding", oracle_text: "真正的強大不是去攻擊，而是無論外界環境如何酸蝕，內在依然潔白無瑕，毫髮無傷。", score: 4, guide: "你的抗壓性極強。面對他人的批評、酸言酸語或惡劣的環境，你都能免疫。這份強大的自信與心理素質，讓你顯得格外堅毅且不可動搖。保持這份潔白與堅硬，外界的雜質無法附著於你。", science: "太空金屬，極度抗腐蝕。" },
    { z: 22, s: "Ti", n: "鈦", title: "不屈", title_en: "Unyielding", oracle_text: "真正的強大不是去攻擊，而是無論外界環境如何酸蝕，內在依然潔白無瑕，毫髮無傷。", score: 2, guide: "你可能正在過度遮蓋自己。就像最強的白色顏料一樣，你試圖掩飾所有的瑕疵與不完美，呈現出一張完美的假面。但請記得，過度的遮蓋會讓你失去透氣的空間，適度展現脆弱，反而更真實。", science: "二氧化鈦是覆蓋力極強的白色顏料（鈦白），用於修正液或油漆。" },

    // 23. V 釩
    { z: 23, s: "V", n: "釩", title: "多變", title_en: "Variety", oracle_text: "生命不該只有一種顏色；隨著環境改變自己的狀態，是為了展現出更多層次的美麗。", score: 3, guide: "情緒或角色的轉換像變色龍一樣豐富。早上可能憂鬱，下午變得陽光。不要排斥這種變化，善用你多樣的面貌來應對不同的人，你的多變會成為一種迷人的魅力與適應力。", science: "氧化態顏色豐富（紫綠藍黃）。" },
    { z: 23, s: "V", n: "釩", title: "多變", title_en: "Variety", oracle_text: "生命不該只有一種顏色；隨著環境改變自己的狀態，是為了展現出更多層次的美麗。", score: 4, guide: "你需要一點韌性來應對衝擊。就像釩鋼一樣，你的存在能讓周遭變得更耐磨、抗震。在動盪的局勢中，你是那個能吸收衝擊、維持結構不散架的關鍵力量，展現你的強韌吧。", science: "釩鋼（Vanadium steel）極其堅韌、耐磨、抗衝擊，曾用於福特T型車。" },

    // 24. Cr 鉻
    { z: 24, s: "Cr", n: "鉻", title: "不朽", title_en: "Stainless", oracle_text: "光鮮亮麗的外表下，是一層拒絕被腐蝕的堅定；自我保護，是為了讓光芒能夠永恆。", score: 4, guide: "展現你最完美、最自信的一面。你擁有一種不沾鍋的能力，外在的髒污或負面情緒無法附著在你身上。保持自信，維持你的形象，這層保護膜能讓你的價值歷久彌新。", science: "不鏽鋼成分，形成氧化層防鏽。" },
    { z: 24, s: "Cr", n: "鉻", title: "不朽", title_en: "Stainless", oracle_text: "光鮮亮麗的外表下，是一層拒絕被腐蝕的堅定；自我保護，是為了讓光芒能夠永恆。", score: 2, guide: "警惕那些看似鮮豔誘人的陷阱。有些事物雖然外表呈現迷人的橘紅色或黃色，但內在可能帶有劇毒。不要被表面的光鮮亮麗所迷惑，深入檢視本質，以免誤觸有毒的關係或投資。", science: "六價鉻化合物顏色鮮豔但具劇毒與致癌性。" },

    // 25. Mn 錳
    { z: 25, s: "Mn", n: "錳", title: "極端", title_en: "Extreme", oracle_text: "溫和並不能解決所有問題；有時你需要展現最強烈的氧化力量，才能徹底清除頑固的雜質。", score: 3, guide: "做事乾淨俐落。對於拖泥帶水的事情或壞習慣，適合展現出強勢的態度去解決。雖然你的手段可能有點激烈，但這能有效地釐清混亂的局面，讓一切回歸秩序。", science: "過錳酸鉀是強氧化劑，手段激烈。" },
    { z: 25, s: "Mn", n: "錳", title: "極端", title_en: "Extreme", oracle_text: "溫和並不能解決所有問題；有時你需要展現最強烈的氧化力量，才能徹底清除頑固的雜質。", score: 4, guide: "你的身份多重且複雜。就像擁有多種氧化態的錳一樣，你在不同場合能展現截然不同的面貌。不要將自己侷限在單一標籤裡，擁抱你的多面性，這將是你適應各種極端環境的武器。", science: "錳擁有多種氧化態（+2, +3, +4, +6, +7），化學性質多變。" },

    // 26. Fe 鐵
    { z: 26, s: "Fe", n: "鐵", title: "戰士", title_en: "Warrior", oracle_text: "意志如鋼鐵般堅硬，但切記，若缺乏保護與關愛，最強壯的盔甲也抵擋不住歲月的鏽蝕。", score: 3, guide: "這是一場持久戰，需要展現出鋼鐵般的紀律與意志力。但也請注意，不要讓自己太過疲勞或心冷，否則內心容易生鏽感到倦怠。適時尋求夥伴的防護與支持，是維持戰力的關鍵。", science: "工業之母，堅硬但易生鏽。" },
    { z: 26, s: "Fe", n: "鐵", title: "戰士", title_en: "Warrior", oracle_text: "意志如鋼鐵般堅硬，但切記，若缺乏保護與關愛，最強壯的盔甲也抵擋不住歲月的鏽蝕。", score: 5, guide: "你擁有強大的核心吸引力。現在的你就像一塊磁鐵，能夠自然地吸引資源、盟友與好運。不需要刻意去追逐，只要穩住你的核心價值，對的人事物自然會向你靠攏。", science: "鐵是鐵磁性物質，具有磁性，能吸引並建立磁場。" },

    // 27. Co 鈷
    { z: 27, s: "Co", n: "鈷", title: "感知", title_en: "Sense", oracle_text: "內心的乾燥與滋潤，都會誠實地顯化在臉上；保持敏銳的感知，那是你識別環境的獨特天賦。", score: 3, guide: "你像一張靈敏的試紙，對周遭的氣氛非常敏感。如果環境讓你感到溫暖就盡情享受，如果感到冷漠就回到自己的空間。相信你的直覺感應，那能幫你趨吉避凶。", science: "氯化鈷試紙檢驗水（藍變粉紅）。" },
    { z: 27, s: "Co", n: "鈷", title: "感知", title_en: "Sense", oracle_text: "內心的乾燥與滋潤，都會誠實地顯化在臉上；保持敏銳的感知，那是你識別環境的獨特天賦。", score: 4, guide: "在極端條件下，你依然能保持強韌。正如鈷合金在高溫下仍能維持硬度，現在的考驗不會融化你，反而會證明你的耐受力。堅持住，你的韌性比想像中更強。", science: "鈷基超合金耐極高溫，常用於噴射引擎渦輪葉片。" },

    // 28. Ni 鎳
    { z: 28, s: "Ni", n: "鎳", title: "推手", title_en: "The Mover", oracle_text: "真正的推手不一定站在舞台中央；默默地加事情的發展，促成改變卻不改變初衷。", score: 3, guide: "你不需要當主角，適合扮演幕後推手的角色。你的建議或行動能讓卡住的事情順利推進。這種促成好事發生的成就感，會比自己站在台前更有價值且長久。", science: "氫化反應催化劑，促成改變。" },
    { z: 28, s: "Ni", n: "鎳", title: "推手", title_en: "The Mover", oracle_text: "真正的推手不一定站在舞台中央；默默地加事情的發展，促成改變卻不改變初衷。", score: 4, guide: "你擁有強大的記憶力與復原力。就像記憶金屬一樣，無論遭遇怎樣的扭曲或挫折，只要給予適當的溫度（熱情），你就能瞬間恢復到最初的完美形狀。這份自我修復的能力是你最大的資產。", science: "鎳鈦合金是著名的形狀記憶合金，加熱後能恢復原狀。" },

    // 29. Cu 銅
    { z: 29, s: "Cu", n: "銅", title: "導體", title_en: "Conductor", oracle_text: "溫暖需要傳遞，訊息需要溝通；敞開你的心胸，成為那條連結人與人之間的高效導線。", score: 4, guide: "人際運勢極佳。你就像銅線一樣，溝通順暢無阻。適合聯繫朋友、談判或建立新的關係。你散發出的熱情與親和力，能有效地將你的想法傳遞給對方，建立深刻的連結。", science: "導電導熱極佳，用於電線。" },
    { z: 29, s: "Cu", n: "銅", title: "導體", title_en: "Conductor", oracle_text: "溫暖需要傳遞，訊息需要溝通；敞開你的心胸，成為那條連結人與人之間的高效導線。", score: 2, guide: "你的光芒可能會隨著時間變得黯淡。就像銅會生出綠色的銅鏽，原本清晰的溝通可能因為時間的推移而產生誤解或隔閡。是時候進行拋光保養，重新擦亮那些被忽視的關係了。", science: "銅在潮濕空氣中會氧化生鏽，產生綠色的鹼式碳酸銅（銅鏽）。" },

    // 30. Zn 鋅
    { z: 30, s: "Zn", n: "鋅", title: "守護者", title_en: "The Guardian", oracle_text: "愛有時意味著犧牲；為了守護更核心的價值，願意挺身而出，擋在鏽蝕與傷害的最前線。", score: 3, guide: "你可能會為了團隊或家人，做出一點犧牲或讓步。別覺得委屈，因為你的付出成功保護了對你而言很重要的人事物。這份俠義心腸會為你贏得他人的敬重與信任。", science: "犧牲陽極保護法，保護鐵不生鏽。" },
    { z: 30, s: "Zn", n: "鋅", title: "守護者", title_en: "The Guardian", oracle_text: "愛有時意味著犧牲；為了守護更核心的價值，願意挺身而出，擋在鏽蝕與傷害的最前線。", score: 4, guide: "微小但必要的存在。你就像體內的微量元素一樣，雖然不起眼，卻掌控著整體的免疫與代謝。不要小看自己的日常付出，正是這些瑣碎的細節，維持了整個系統的健康運作。", science: "鋅是人體必需微量元素，參與免疫與代謝功能。" },

    // 31. Ga 鎵
    { z: 31, s: "Ga", n: "鎵", title: "溫柔", title_en: "Tenderness", oracle_text: "最強的武器不是堅硬，而是溫度；只需一點點掌心的暖意，就能化解冰冷的防線。", score: 4, guide: "遇到僵局時，不要硬碰硬。試著用溫柔的態度去處理，展現你的誠意與溫度。你會發現原本頑固的人或事，會瞬間軟化下來，接受你的引導。", science: "熔點極低（29.8°C），手心可融化。" },
    { z: 31, s: "Ga", n: "鎵", title: "溫柔", title_en: "Tenderness", oracle_text: "最強的武器不是堅硬，而是溫度；只需一點點掌心的暖意，就能化解冰冷的防線。", score: 2, guide: "小心你的滲透力造成破壞。液態鎵能滲入鋁金屬使其脆化。你的溫柔或許對某些人來說是種負擔，或者是你在無意間瓦解了對方的防線。請謹慎使用你的影響力，以免造成不可逆的結構性破壞。", science: "液態鎵能滲入鋁的晶界，導致鋁瞬間脆化（液態金屬脆化）。" },

    // 32. Ge 鍺
    { z: 32, s: "Ge", n: "鍺", title: "奠基", title_en: "Foundation", oracle_text: "榮耀或許屬於後繼者，但歷史會記住開創者；在矽谷亮起之前，是我先點燃了電子的火花。", score: 3, guide: "你扮演著開路先鋒或墊腳石的角色。雖然你的努力可能不會馬上被看見，或者最後的榮耀被別人拿走，但請記得，沒有你的鋪路，後面的事都不會發生。相信自己的基礎價值。", science: "第一代半導體材料，後被矽取代。" },
    { z: 32, s: "Ge", n: "鍺", title: "奠基", title_en: "Foundation", oracle_text: "榮耀或許屬於後繼者，但歷史會記住開創者；在矽谷亮起之前，是我先點燃了電子的火花。", score: 4, guide: "你的視角穿透力極強。就像鍺透鏡能讓紅外線通過一樣，你能看見別人看不見的熱度與真相。在漆黑的局勢中，你是唯一能看清前方路徑的人，信任你的夜視能力。", science: "鍺對紅外線透明，常用於紅外線熱像儀的鏡頭。" },

    // 33. As 砷
    { z: 33, s: "As", n: "砷", title: "摻雜", title_en: "Doping", oracle_text: "純潔往往意味著絕緣；唯有容納異質的存在，才能激發出改變世界的導電潛能。", score: 4, guide: "適合打破常規，進行混搭。不要害怕在原本規律的生活中加入一點異質元素，例如嘗試新風格或接受新觀點。這一點點的不純粹，反而會激發出前所未有的潛能與效率。", science: "半導體摻雜劑，增加導電性。" },
    { z: 33, s: "As", n: "砷", title: "摻雜", title_en: "Doping", oracle_text: "純潔往往意味著絕緣；唯有容納異質的存在，才能激發出改變世界的導電潛能。", score: 2, guide: "隱藏的惡意正在靠近。就像砒霜一樣無色無味，某些看似無害的建議或關係，背後可能藏著劇毒。今天請提高警覺，對於太過美好的事物保持懷疑，明哲保身為上。", science: "著名的毒藥砒霜即為三氧化二砷。" },

    // 34. Se 硒
    { z: 34, s: "Se", n: "硒", title: "逐光者", title_en: "The Seeker", oracle_text: "才華需要舞台；在黑暗中我保持沈默絕緣，唯有光芒灑落時，我才開始導電運作。", score: 4, guide: "你是那種遇強則強、需要關注的類型。如果有機會站上舞台或被聚光燈照耀，你的表現會判若兩人，效率極高。不要躲在角落，勇敢爭取表現的機會。", science: "光電導效應，照光變導體。" },
    { z: 34, s: "Se", n: "硒", title: "逐光者", title_en: "The Seeker", oracle_text: "才華需要舞台；在黑暗中我保持沈默絕緣，唯有光芒灑落時，我才開始導電運作。", score: 3, guide: "與其等待光線，不如成為色彩的製造者。硒也是紅玻璃的原料。你的存在能為平淡的生活染上一抹鮮豔的紅。試著在今天做一些有創意、能增添生活情趣的小事，讓自己成為風景。", science: "硒可用於玻璃脫色或製造紅色玻璃。" },

    // 35. Br 溴
    { z: 35, s: "Br", n: "溴", title: "揮發", title_en: "Volatility", oracle_text: "情緒像紅色的液體般流動；不要試圖將其密封，適度的宣洩是為了避免壓力炸裂。", score: 2, guide: "情緒起伏較大，很容易受到環境刺激而波動。如果感到焦躁或生氣，不要強行壓抑，找個健康的方式宣洩出來，例如運動或寫作。承認自己的感覺，才不會成內傷。", science: "液態非金屬，易揮發成紅棕色氣體。" },
    { z: 35, s: "Br", n: "溴", title: "揮發", title_en: "Volatility", oracle_text: "情緒像紅色的液體般流動；不要試圖將其密封，適度的宣洩是為了避免壓力炸裂。", score: 4, guide: "具有阻斷危險的能力。就像含溴的阻燃劑一樣，你的出現能有效抑制事態的惡化。當周遭有人情緒失控或衝突一觸即發時，你的冷靜介入將是防止災難擴大的關鍵。", science: "溴化物常用作阻燃劑，能抑制燃燒連鎖反應。" },

    // 36. Kr 氪
    { z: 36, s: "Kr", n: "氪", title: "隱士", title_en: "The Hermit", oracle_text: "真正的力量懂得隱藏；將巨大的能量壓縮在無形的外表下，只為那一瞬間的耀眼爆發。", score: 3, guide: "適合保持低調，修煉內功。這不是因為你弱，而是因為你在蓄力。當關鍵時刻來臨，你會像高強度的閃光燈一樣，瞬間爆發出令人驚豔的成果。", science: "惰性氣體，用於強力閃光燈。" },
    { z: 36, s: "Kr", n: "氪", title: "隱士", title_en: "The Hermit", oracle_text: "真正的力量懂得隱藏；將巨大的能量壓縮在無形的外表下，只為那一瞬間的耀眼爆發。", score: 5, guide: "你就是超人的弱點，也是他的故鄉。這張牌暗示著你擁有某種神秘的克制力量。面對強大的對手或困難，不要硬碰硬，找出對方的關鍵弱點，你能以巧勁取勝。", science: "惰性氣體，用於高強度閃光燈；名稱與科幻作品中的虛構物質Kryptonite（氪星石）相關聯。" },

    // 37. Rb 銣
    { z: 37, s: "Rb", n: "銣", title: "準時", title_en: "Punctuality", oracle_text: "追求分秒不差的極致；在極度活躍的本性中，尋求宇宙間最穩定的律動。", score: 3, guide: "關鍵是節奏與準時。你的能量非常強大且活躍，如果沒有好的規劃，可能會變成混亂。按表操課、精準控制時間，你會發現事情進展得比預期還順利。", science: "銣原子鐘精準度極高。" },
    { z: 37, s: "Rb", n: "銣", title: "準時", title_en: "Punctuality", oracle_text: "追求分秒不差的極致；在極度活躍的本性中，尋求宇宙間最穩定的律動。", score: 5, guide: "你現在就像煙火一樣，一點就著，而且色彩斑斕。你的熱情極具爆發力，適合進行短期衝刺或公開演說。展現你紫紅色的魅力，這一刻你是最耀眼的焦點。", science: "銣活性大，焰色反應為紫紅色，可用於煙火。" },

    // 38. Sr 鍶
    { z: 38, s: "Sr", n: "鍶", title: "花火", title_en: "Fireworks", oracle_text: "存在的意義是為了提醒當下的美好；盡情燃燒你的色彩，哪怕只有一瞬間，也要染紅夜空。", score: 4, guide: "生活需要儀式感。不要過得太嚴肅，適合做一些讓自己開心、慶祝的事情。去展現你的熱情與色彩，吸引大家的目光。享受當下的快樂最重要。", science: "紅色煙火原料。" },
    { z: 38, s: "Sr", n: "鍶", title: "花火", title_en: "Fireworks", oracle_text: "存在的意義是為了提醒當下的美好；盡情燃燒你的色彩，哪怕只有一瞬間，也要染紅夜空。", score: 2, guide: "精準度是你的課題。雖然你擁有熱情，但如果沒有精確的控制，可能會變成一場失控的火災。向鍶原子鐘學習極致的精準，在釋放能量的同時，也要確保方向與時機的正確性。", science: "鍶原子鐘是目前世界上最精準的時鐘之一，比銫原子鐘更準確。" },

    // 39. Y 釔
    { z: 39, s: "Y", n: "釔", title: "零阻力", title_en: "Zero Resistance", oracle_text: "當內在的抗拒降至冰點，溝通將不再有損耗；尋找那個讓你能無礙流動的頻率。", score: 5, guide: "溝通運勢極佳，如同超導體般零阻力。你跟別人的頻率很對，想法能瞬間傳達給對方。適合進行談判、告白或團隊合作，你會驚訝於事情進展得如此順暢。", science: "YBCO高溫超導體成分。" },
    { z: 39, s: "Y", n: "釔", title: "零阻力", title_en: "Zero Resistance", oracle_text: "當內在的抗拒降至冰點，溝通將不再有損耗；尋找那個讓你能無礙流動的頻率。", score: 3, guide: "穩定的強化劑。你可能不是結構的主體，但加入你之後，整體的穩定性與耐熱性都會提升。適合在幕後支持，為不穩定的計畫注入一股安定的力量，就像氧化釔穩定氧化鋯一樣。", science: "氧化釔用於穩定氧化鋯（YSZ），增加其韌性與耐熱性。" },

    // 40. Zr 鋯
    { z: 40, s: "Zr", n: "鋯", title: "仿真", title_en: "Simulation", oracle_text: "價值在於本質而非出身；即使被視為替代品，只要夠堅硬璀璨，亦能證明自我的存在。", score: 3, guide: "可能會面臨比較或被質疑的課題。也許你會覺得自己不如別人昂貴或正統，但請記得，你擁有極強的抗壓性與實用價值。不必羨慕別人，你在自己的領域裡就是最閃亮的。", science: "立方氧化鋯是鑽石替代品。" },
    { z: 40, s: "Zr", n: "鋯", title: "仿真", title_en: "Simulation", oracle_text: "價值在於本質而非出身；即使被視為替代品，只要夠堅硬璀璨，亦能證明自我的存在。", score: 5, guide: "你的抗腐蝕能力一流。無論外界環境多麼惡劣，或是充滿酸言酸語，你都能像核能級的鋯合金一樣，毫髮無傷。專注於你的核心任務，外界的毒素無法滲透你堅硬的防護層。", science: "鋯合金極度抗腐蝕，且不吸收中子，是核反應爐燃料棒的包覆材料。" },

    // 41. Nb 鈮
    { z: 41, s: "Nb", n: "鈮", title: "假面", title_en: "Mask", oracle_text: "外表是為了保護內在而生；透過電壓的轉化，你可以自由決定向世界呈現什麼顏色的假面。", score: 4, guide: "適合稍微修飾與裝扮的時刻。這並非虛偽，而是一種適應環境的智慧與保護色。展現你多變且獨特的一面，讓外在形象成為你與世界溝通的橋樑，你會發現人們對你的態度隨之轉變。", science: "陽極處理可產生絢麗色彩。" },
    { z: 41, s: "Nb", n: "鈮", title: "假面", title_en: "Mask", oracle_text: "外表是為了保護內在而生；透過電壓的轉化，你可以自由決定向世界呈現什麼顏色的假面。", score: 3, guide: "冷靜的超導狀態。當環境溫度降低，大家都不想動時，反而是你能量流動最順暢的時候。利用眾人停滯的時刻，默默地高效運作，你將在低溫中創造零阻力的奇蹟。", science: "鈮鈦合金是強大的超導材料，用於MRI磁鐵。" },

    // 42. Mo 鉬
    { z: 42, s: "Mo", n: "鉬", title: "調停者", title_en: "Mediator", oracle_text: "衝突往往來自於乾澀的堅持；柔軟的身段能減少耗損，讓巨大的機制在極端壓力下運轉。", score: 3, guide: "你可能處於夾心餅乾的位置，需要協調兩邊的意見。保持圓融，成為團隊中的潤滑劑。雖然自己沒有發光發熱，但因為你的存在，讓原本卡住的機制得以順利運作，這份貢獻至關重要。", science: "二硫化鉬是固體潤滑劑。" },
    { z: 42, s: "Mo", n: "鉬", title: "調停者", title_en: "Mediator", oracle_text: "衝突往往來自於乾澀的堅持；柔軟的身段能減少耗損，讓巨大的機制在極端壓力下運轉。", score: 5, guide: "你是植物生長的關鍵。就像固氮酶中的鉬原子，你擁有將空氣中無用的資源（氮氣）轉化為實際養分（氨）的神奇能力。善用你的轉化力，將虛無的想法落實為可執行的成果。", science: "鉬是固氮酶的關鍵成分，幫助植物將氮氣轉化為養分。" },

    // 43. Tc 鎝
    { z: 43, s: "Tc", n: "鎝", title: "顯影", title_en: "Reveal", oracle_text: "肉眼看不見的病灶，需要特殊的視角；短暫地進入深處，是為了揭露那些被隱藏的真實。", score: 4, guide: "你的洞察力極強，適合進行診斷與檢視。無論是身體健康、專案進度還是人際關係的癥結點，都能看透問題的核心。找出隱患後就放下擔憂，不要過度糾結，看見真相是解決問題的第一步。", science: "鎝-99m是核醫學顯影劑。" },
    { z: 43, s: "Tc", n: "鎝", title: "顯影", title_en: "Reveal", oracle_text: "肉眼看不見的病灶，需要特殊的視角；短暫地進入深處，是為了揭露那些被隱藏的真實。", score: 2, guide: "人工製造的痕跡太重。你可能為了某個目的而過度用力，顯得有些不自然。就像鎝是第一個人造元素，雖然有用但終究稀少且不穩定。試著回歸自然本質，不要過度依賴人為的手段。", science: "第一個由人工合成發現的元素，自然界極稀少。" },

    // 44. Ru 釕
    { z: 44, s: "Ru", n: "釕", title: "輔佐", title_en: "Support", oracle_text: "偉大不需要獨佔舞台；只要微量的介入，就能讓原本脆弱的貴金屬，擁有堅不可摧的硬度。", score: 3, guide: "此刻不需要爭當主角，適合扮演關鍵少數的配角。你的加入會讓整個團隊或計畫變得更完美、更強韌。專注於你的微小貢獻，這將帶來巨大的質變，成為他人堅強的後盾。", science: "加入鉑中增加硬度。" },
    { z: 44, s: "Ru", n: "釕", title: "輔佐", title_en: "Support", oracle_text: "偉大不需要獨佔舞台；只要微量的介入，就能讓原本脆弱的貴金屬，擁有堅不可摧的硬度。", score: 5, guide: "你是吸收陽光的能手。就像染敏太陽能電池中的釕染料，你擅長捕捉外界的能量並將其轉化為電流。保持對外界資訊的開放與吸收，那將是你源源不絕的動力來源。", science: "釕錯合物是染敏太陽能電池的高效染料。" },

    // 45. Rh 銠
    { z: 45, s: "Rh", n: "銠", title: "天價", title_en: "Priceless", oracle_text: "稀缺就了地位；像一面永不氧化的鏡子，誠實地反射世界，也反射出你高不可攀的價值。", score: 5, guide: "你的價值無可估量，千萬不要看輕自己。面對他人的請求，如果覺得廉價或不合理，請勇敢拒絕。保持你的高冷與身價，就像一面明亮的鏡子，閃亮且拒絕被環境污染，榮耀自然會降臨。", science: "最昂貴金屬之一，反射率高且抗氧化。" },
    { z: 45, s: "Rh", n: "銠", title: "天價", title_en: "Priceless", oracle_text: "稀缺就了地位；像一面永不氧化的鏡子，誠實地反射世界，也反射出你高不可攀的價值。", score: 3, guide: "淨化的力量。就像汽車觸媒轉化器中的銠，你的存在能將有毒的氛圍（如氮氧化物）轉化為無害的氣體。你是環境中的清道夫，有能力化解周遭的烏煙瘴氣，還給大家一片清新。", science: "用於汽車觸媒轉化器，減少廢氣污染。" },

    // 46. Pd 鈀
    { z: 46, s: "Pd", n: "鈀", title: "包容", title_en: "Tolerance", oracle_text: "智慧是種巨大的容量；像海綿一樣渴望著，將外界流動的能量與知識，全數吸納入心。", score: 4, guide: "你的狀態像一塊乾燥的海綿，學習力與包容力極強。非常適合閱讀、上課或傾聽他人的想法。敞開你的心胸去吸收，你會獲得意想不到的養分，將外界的資源轉化為內在的智慧。", science: "能吸收900倍體積的氫氣。" },
    { z: 46, s: "Pd", n: "鈀", title: "包容", title_en: "Tolerance", oracle_text: "智慧是種巨大的容量；像海綿一樣渴望著，將外界流動的能量與知識，全數吸納入心。", score: 3, guide: "你是連結的魔術師。就像諾貝爾獎級別的鈀催化反應，你擅長將原本不相干的兩方（碳原子）連結在一起。善用你的撮合能力，無論是人脈還是資源，都能在你手中形成全新的結構。", science: "鈀催化偶聯反應（如Suzuki反應）是連結碳原子的重要方法，獲諾貝爾獎。" },

    // 47. Ag 銀
    { z: 47, s: "Ag", n: "銀", title: "直覺", title_en: "Intuition", oracle_text: "直覺是宇宙間最快的電流；當靈感降臨時，不要遲疑，以零時差的度將其落實。", score: 5, guide: "你的直覺敏銳到不可思議，反應度也極快。如果有什麼突如其來的靈感像電流通過，請立刻行動或記錄下來。這也是淨化身心的好時機，排除生活中的雜質與壞情緒，讓能量流動暢通無阻。", science: "導電導熱性第一，銀離子殺菌。" },
    { z: 47, s: "Ag", n: "銀", title: "直覺", title_en: "Intuition", oracle_text: "直覺是宇宙間最快的電流；當靈感降臨時，不要遲疑，以零時差的度將其落實。", score: 3, guide: "注意那些容易變質的關係。雖然你很耀眼，但就像銀飾容易變黑一樣，若長期暴露在含有「硫」（負面情緒）的環境中，你的光芒會被遮蔽。勤於擦拭心靈，遠離有毒的環境，保持亮麗。", science: "銀容易與硫反應變黑（硫化銀）。" },

    // 48. Cd 鎘
    { z: 48, s: "Cd", n: "鎘", title: "克制", title_en: "Restraint", oracle_text: "鮮豔的色彩往往伴隨著危險；在能量失控的邊緣，唯有強大的吸收力能踩下煞車。", score: 4, guide: "你是局勢中的節奏大師。當周遭陷入混亂或情緒激動時，只有你能優雅地掌控全局。適時踩下煞車，防止事情衝過頭。享受這種眾人皆醉我獨醒的掌控感，你的冷靜是安全的保障。", science: "核反應爐控制棒，吸收中子。" },
    { z: 48, s: "Cd", n: "鎘", title: "克制", title_en: "Restraint", oracle_text: "鮮豔的色彩往往伴隨著危險；在能量失控的邊緣，唯有強大的吸收力能踩下煞車。", score: 2, guide: "美麗但危險。鎘黃雖然是迷人的顏料，但內在潛藏著不易察覺的毒性。今天請特別留意那些包裝得太過完美的提案或人物，表面越鮮豔，背後可能越危險。保持距離，策安全。", science: "鎘黃是著名顏料，但鎘具有高毒性（痛痛病）。" },

    // 49. In 銦
    { z: 49, s: "In", n: "銦", title: "觸感", title_en: "Touch", oracle_text: "溝通不需言語，指尖的輕觸即是連結；柔軟並非軟弱，而是為了能敏銳地感知世界的溫度。", score: 3, guide: "重點在於連結與感應。透過你的指尖去感知世界，保持身段的柔軟。如果你感到壓力，適度地發出聲音表達痛苦是健康的釋放。人與人的互動不一定要剛硬，溫柔的觸碰更能傳遞心意。", science: "觸控螢幕材料，彎曲有錫鳴聲。" },
    { z: 49, s: "In", n: "銦", title: "觸感", title_en: "Touch", oracle_text: "溝通不需言語，指尖的輕觸即是連結；柔軟並非軟弱，而是為了能敏銳地感知世界的溫度。", score: 4, guide: "你是透明的導電體。就像ITO（氧化銦錫）一樣，你既能讓光線（真相）穿透，又能導通電流（能量）。這種同時具備透明度與執行力的特質，讓你成為溝通兩端的最佳橋樑。", science: "氧化銦錫（ITO）透明且導電，廣泛用於螢幕。" },

    // 50. Sn 錫
    { z: 50, s: "Sn", n: "錫", title: "封存", title_en: "Sealed", oracle_text: "文明的延續仰賴對滋味的守護；無論外在如何變遷，將最美好的本質密封，靜待開啟。", score: 3, guide: "適合保存美好的事物，無論是整理回憶、儲蓄還是享受美食。但也請注意環境的溫度變化，若感到人際關係變冷，要小心內心的熱情粉碎。在適當的時候封存自我，是為了走更長遠的路。", science: "馬口鐵防鏽；低溫下會粉碎（錫疫）。" },
    { z: 50, s: "Sn", n: "錫", title: "封存", title_en: "Sealed", oracle_text: "文明的延續仰賴對滋味的守護；無論外在如何變遷，將最美好的本質密封，靜待開啟。", score: 4, guide: "你是最好的黏著劑。就像銲錫一樣，雖然熔點不高，卻能將兩個堅硬的電子元件緊密連結。這一天適合修補關係，或是將不同的資源進行連接，你的柔軟能成就堅固的結構。", science: "銲錫（錫鉛合金）用於連接電子元件。" },

    // 51. Sb 銻
    { z: 51, s: "Sb", n: "銻", title: "阻燃", title_en: "Resist", oracle_text: "冷靜是最好的防護；在烈火蔓延之前，先築起一道不可燃燒的防線，隔絕毀滅的高溫。", score: 5, guide: "你的冷靜就是最強的氣場。無論發生什麼爭端或混亂，你都能泰然處之，不隨之起舞。這種穩如泰山的特質，能有效地防止災難擴大，讓大家對你充滿崇拜與信賴。", science: "阻燃劑成分，抑制燃燒。" },
    { z: 51, s: "Sb", n: "銻", title: "阻燃", title_en: "Resist", oracle_text: "冷靜是最好的防護；在烈火蔓延之前，先築起一道不可燃燒的防線，隔絕毀滅的高溫。", score: 2, guide: "表裡不一的矛盾。銻雖然看起來像金屬，性質卻像非金屬。你可能正處於自我認同的矛盾中，或者外界對你的誤解讓你困擾。不必急著定義自己，接受這種模糊的雙重性也是一種美。", science: "類金屬，外觀像金屬但導電熱性差。" },

    // 52. Te 碲
    { z: 52, s: "Te", n: "碲", title: "接地", title_en: "Grounding", oracle_text: "力量源自於腳下的土地；不需在意他人的排斥，將光芒轉化為能量，扎根於現實之中。", score: 3, guide: "適合腳踏實地。也許你會覺得自己有點邊緣，或者不被大眾理解，但沒關係。專注於你的工作與現實生活，像大地一樣穩重，吸收外界的資源轉化為自己的能量，你的成果最終會證明一切。", science: "太陽能電池材料；名字意為大地。" },
    { z: 52, s: "Te", n: "碲", title: "接地", title_en: "Grounding", oracle_text: "力量源自於腳下的土地；不需在意他人的排斥，將光芒轉化為能量，扎根於現實之中。", score: 2, guide: "小心口氣問題，或者是不受歡迎的發言。碲被人體吸收後會產生類似大蒜的難聞氣味，讓人避之唯恐不及。今天請特別留意溝通的方式與口氣，以免無意間遭到排擠。", science: "碲中毒會導致呼氣與汗水有強烈的大蒜味。" },

    // 53. I 碘
    { z: 53, s: "I", n: "碘", title: "昇華", title_en: "Sublimation", oracle_text: "刺痛是癒合的開始；不必經歷泥濘的拉扯，你可以選擇直接昇華，將傷口轉化為智慧。", score: 5, guide: "自我療癒的最佳時機。如果心裡有受傷的感覺，不要忽視它，給自己一點溫柔的呵護。你擁有跳躍式成長的能力，省略掉那些拖泥帶水的過程，直接從傷痛中提煉出高貴的智慧與紫色光芒。", science: "固體直接昇華為紫氣；碘酒消毒。" },
    { z: 53, s: "I", n: "碘", title: "昇華", title_en: "Sublimation", oracle_text: "刺痛是癒合的開始；不必經歷泥濘的拉扯，你可以選擇直接昇華，將傷口轉化為智慧。", score: 3, guide: "顯影的時刻。利用澱粉測試，碘能讓隱形的成分現形。今天適合進行測試或檢驗，無論是查核細節還是試探人心，一點點試劑就能讓隱藏的藍黑色真相浮出水面。", science: "碘遇澱粉會呈現深藍黑色，常用於檢驗澱粉。" },

    // 54. Xe 氙
    { z: 54, s: "Xe", n: "氙", title: "異客", title_en: "Stranger", oracle_text: "擁抱未知的訪客；在沈重的壓力之下，即使是高冷的靈魂，也能與世界產生前所未有的連結。", score: 3, guide: "對於新事物或陌生的訪客保持開放態度。不要抗拒未知，那可能是帶你前往新世界的推進器。如果感到疲憊，給自己一個高品質的深層休息是必要的，在沈靜中你會找到新的連結。", science: "稀有氣體，可作為推進器或麻醉劑。" },
    { z: 54, s: "Xe", n: "氙", title: "異客", title_en: "Stranger", oracle_text: "擁抱未知的訪客；在沈重的壓力之下，即使是高冷的靈魂，也能與世界產生前所未有的連結。", score: 5, guide: "你的光芒耀眼奪目。就像氙氣燈一樣，你擁有極高強度的亮度，能穿透黑暗的迷霧。現在不是低調的時候，盡情展現你的才華，你的光芒將成為指引眾人的燈塔。", science: "氙氣燈亮度極高，常用於汽車大燈與放映機。" },

    // 55. Cs 銫
    { z: 55, s: "Cs", n: "銫", title: "標準", title_en: "Standard", oracle_text: "定義時間，是為了掌握節奏；在極度活躍的熱情中，建立起宇宙間分秒不差的秩序。", score: 3, guide: "你是規則的制定者，或者是眾人的標準。大家都在看你的動作行事。保持守時、精準，將你充沛的能量導入規律之中，你建立的秩序將會帶領團隊順利運作，掌握節奏就能掌握全局。", science: "秒的定義基準（銫原子鐘）；活性極大。" },
    { z: 55, s: "Cs", n: "銫", title: "標準", title_en: "Standard", oracle_text: "定義時間，是為了掌握節奏；在極度活躍的熱情中，建立起宇宙間分秒不差的秩序。", score: 4, guide: "極致的敏感度。作為光電效應的材料，你對外界微弱的訊號（光線）反應極快。善用這份敏銳，在別人還沒察覺之前就先捕捉到趨勢的變化，先發制人。", science: "銫對光極其敏感，是光電管與夜視鏡的重要材料。" },

    // 56. Ba 鋇
    { z: 56, s: "Ba", n: "鋇", title: "對比", title_en: "Contrast", oracle_text: "有些真相無法直接看見；吞下沈重的試煉，是為了讓內在的曲折，在光線下清晰顯現。", score: 3, guide: "誠實面對內在的時刻。無論是檢視身體狀況還是心理感受，不要逃避。雖然揭露真相的過程可能有點沈重，但這能幫你找出長久以來的隱患，讓問題無所遁形，看清之後便能安心。", science: "鋇餐（硫酸鋇）用於X光顯影。" },
    { z: 56, s: "Ba", n: "鋇", title: "對比", title_en: "Contrast", oracle_text: "有些真相無法直接看見；吞下沈重的試煉，是為了讓內在的曲折，在光線下清晰顯現。", score: 4, guide: "綠色的希望。鋇在火焰中燃燒會發出蘋果綠的光芒，象徵著生機與創造力。今天適合揮灑創意，你的點子會像綠色火焰一樣獨特且引人注目，為沈悶的專案帶來生氣。", science: "鋇的焰色反應為蘋果綠，常用於綠色煙火。" },

    // 57. La 鑭
    { z: 57, s: "La", n: "鑭", title: "潛藏", title_en: "Conceal", oracle_text: "真相往往躲在相似的面孔之後；不要急著定義，先學會與混沌共存。", score: 4, guide: "適合玩尋寶遊戲。好運藏在不起眼的地方，或者在某個看似普通的人身上。保持好奇心，不要被表象迷惑，你會挖掘出意想不到的驚喜。現在的模糊不清，其實蘊藏著寶藏。", science: "隱藏在礦物中難發現。" },
    { z: 57, s: "La", n: "鑭", title: "潛藏", title_en: "Conceal", oracle_text: "真相往往躲在相似的面孔之後；不要急著定義，先學會與混沌共存。", score: 3, guide: "你是光學的魔術師。就像鑭玻璃能改善鏡頭的折射率，你的存在能讓事情看得更清楚、畫質更清晰。適合協助他人釐清觀點，或者是提升作品的品質，你的加入就是高畫質的保證。", science: "氧化鑭用於製造高折射率低色散的光學玻璃（相機鏡頭）。" },

    // 58. Ce 鈰
    { z: 58, s: "Ce", n: "鈰", title: "起火", title_en: "Kindling", oracle_text: "巨大的熱情源自微小的摩擦；只要輕輕一劃，平凡的石頭也能迸出火花。", score: 3, guide: "你是環境中的點火者。不需要做什麼驚天動地的大事，只要講個笑話、提個小建議，就能像打火石一樣，瞬間點燃團隊的氣氛或靈感。善用微小的互動，創造熱烈的迴響。", science: "打火石成分，易摩擦起火。" },
    { z: 58, s: "Ce", n: "鈰", title: "起火", title_en: "Kindling", oracle_text: "巨大的熱情源自微小的摩擦；只要輕輕一劃，平凡的石頭也能迸出火花。", score: 4, guide: "你是自我清潔的能手。就像鈰能運用在自潔烤箱壁上一樣，你有能力分解沾染在身上的油污與負能量。不要讓髒東西過夜，啟動你的高溫模式，把煩惱燒得乾乾淨淨。", science: "氧化鈰用於自潔式烤箱壁，能催化分解油污。" },

    // 59. Pr 鐠
    { z: 59, s: "Pr", n: "鐠", title: "雙生", title_en: "Twin", oracle_text: "你並非獨自一人；在茫茫人海中，總有個與你頻率相同的靈魂，正等待被辨識。", score: 3, guide: "適合尋找合作夥伴。單打獨鬥比較累，試著找一個跟你想法互補的人，你們合體的力量會比一個人強大得多。留意身邊那個與你雖有不同但本質相似的人，那就是你的雙生力量。", science: "與釹共生，意為綠色雙胞胎。" },
    { z: 59, s: "Pr", n: "鐠", title: "雙生", title_en: "Twin", oracle_text: "你並非獨自一人；在茫茫人海中，總有個與你頻率相同的靈魂，正等待被辨識。", score: 4, guide: "戴上你的防護鏡。鐠釹玻璃能過濾刺眼的黃光，讓你直視高溫的火焰而不受傷。今天你需要過濾掉刺耳的批評或過度耀眼的誘惑，保持冷靜的視野，看清火焰背後的真相。", science: "鐠釹玻璃用於焊接護目鏡，能過濾強光。" },

    // 60. Nd 釹
    { z: 60, s: "Nd", n: "釹", title: "磁力", title_en: "Magnetism", oracle_text: "吸引力不需要言語；當內在頻率調對了，世界自然會向你靠近。", score: 4, guide: "氣場很強，自帶吸力。你不需要刻意去追求什麼，只要專注做好自己的事，調整好內在的頻率，機會、資源或桃花自然會被你吸引過來。信任吸引力法則，你就是磁鐵。", science: "釹磁鐵是磁性最強的永久磁鐵。" },
    { z: 60, s: "Nd", n: "釹", title: "磁力", title_en: "Magnetism", oracle_text: "吸引力不需要言語；當內在頻率調對了，世界自然會向你靠近。", score: 2, guide: "容易易碎的強大。雖然你擁有強大的磁場與能力，但釹磁鐵其實質地易碎且容易氧化。在展現力量的同時，請記得保護好自己的脆弱面，避免硬碰硬造成崩角，適度的防護塗層（心理建設）是必要的。", science: "釹磁鐵雖然磁力強，但質地脆且容易氧化生鏽，需電鍍保護。" },

    // 61. Pm 鉕
    { z: 61, s: "Pm", n: "鉕", title: "曇花", title_en: "Ephemeral", oracle_text: "人的光芒雖然短暫，卻證明了存在的可能；在此刻燃燒殆盡，好過從未發光。", score: 3, guide: "機會稍縱即逝，如同流星劃過天際。如果有一個突如其來的點子、靈感或邀約，請立刻把握，因為它可能很不穩定，錯過這個瞬間就不復存在。不要追求永恆，要在短暫中創造價值。", science: "稀土中唯一放射性元素，極稀有且短暫。" },
    { z: 61, s: "Pm", n: "鉕", title: "曇花", title_en: "Ephemeral", oracle_text: "人的光芒雖然短暫，卻證明了存在的可能；在此刻燃燒殆盡，好過從未發光。", score: 2, guide: "孤獨的發光者。鉕在自然界中幾乎不存在，大多是人工合成的。你可能感到孤單或不被理解，像是來自另一個世界。但正是這份獨特，讓你在黑暗中能發出微弱卻持續的螢光，堅持你的獨特性。", science: "鉕可用於核電池與螢光塗料，持續發光。" },

    // 62. Sm 釤
    { z: 62, s: "Sm", n: "釤", title: "過濾", title_en: "Filter", oracle_text: "並非所有能量都該被接收；學會阻擋那些無用的雜訊，你的核心才會純淨。", score: 2, guide: "環境中的雜訊過多，可能是八卦、抱怨或無效資訊。你需要開啟過濾模式，只聽重點，堅決過濾掉那些會干擾你情緒的雜音。保護好自己的能量場，不要照單全收。", science: "強烈吸收中子，用於反應爐控制。" },
    { z: 62, s: "Sm", n: "釤", title: "過濾", title_en: "Filter", oracle_text: "並非所有能量都該被接收；學會阻擋那些無用的雜訊，你的核心才會純淨。", score: 4, guide: "你是最強的永久磁鐵之一。釤鈷磁鐵雖然不如釹磁鐵強，但它能耐高溫。這意味著在環境變得火熱、壓力極大時，別人可能會退磁失效，但你依然能保持你的吸引力與原則，展現高溫下的定力。", science: "釤鈷磁鐵耐高溫，磁性穩定。" },

    // 63. Eu 銪
    { z: 63, s: "Eu", n: "銪", title: "繽紛", title_en: "Colorful", oracle_text: "快樂是受到激發的本能；就像被點亮的螢光，不必害羞，盡情展現你內在的色彩。", score: 4, guide: "這是一個充滿快樂與色彩的時刻。像孩子一樣保持單純的心，穿著鮮豔一點，或者做些娛樂自己的事。你的環境需要一點輕鬆的氣氛，去當那個被激發的螢光點，為周遭帶來歡笑與活力。", science: "螢光粉原料，激發出紅藍光。" },
    { z: 63, s: "Eu", n: "銪", title: "繽紛", title_en: "Colorful", oracle_text: "快樂是受到激發的本能；就像被點亮的螢光，不必害羞，盡情展現你內在的色彩。", score: 3, guide: "防偽的印記。就像歐元鈔票上的銪防偽標誌，你擁有辨識真偽的能力。今天請張大眼睛，在平凡的光線下看不見的真相，在特殊的紫外光（視角）下會原形畢露。信任你的檢驗能力。", science: "歐元鈔票使用銪作為防偽螢光油墨。" },

    // 64. Gd 釓
    { z: 64, s: "Gd", n: "釓", title: "共振", title_en: "Resonance", oracle_text: "冷靜下來，才能看清內在的紋理；透過磁場的共鳴，讓隱藏的訊號浮現。", score: 3, guide: "此刻需要深度的溝通與洞察。不要只看表面的話語，去感應對方言下之意。當你冷靜下來調整頻率，就能透過深層的共鳴看清事情的真相，找出隱藏在表象下的結構。", science: "MRI顯影劑，增強影像對比。" },
    { z: 64, s: "Gd", n: "釓", title: "共振", title_en: "Resonance", oracle_text: "冷靜下來，才能看清內在的紋理；透過磁場的共鳴，讓隱藏的訊號浮現。", score: 4, guide: "你需要冷靜降溫。釓具有磁卡路里效應，磁化時發熱，去磁時吸熱降溫。這暗示著你該卸下身上的磁場（執著或壓力），讓自己冷卻下來。適度的「消磁」與放空，能幫你帶走累積已久的熱量與焦慮。", science: "磁卡路里效應（磁致冷），去磁時會吸熱降溫。" },

    // 65. Tb 鋱
    { z: 65, s: "Tb", n: "鋱", title: "信號", title_en: "Signal", oracle_text: "綠燈已亮，前路暢通；信任這個清晰的訊號，現在是執行的最佳時刻。", score: 5, guide: "環境已經為你開了綠燈。如果你之前在猶豫要不要做某件事，這張牌是一個明確的行動訊號。局勢對你有利，信任你的直覺，順著趨勢前進，將會一路暢通。", science: "綠色螢光粉原料。" },
    { z: 65, s: "Tb", n: "鋱", title: "信號", title_en: "Signal", oracle_text: "綠燈已亮，前路暢通；信任這個清晰的訊號，現在是執行的最佳時刻。", score: 3, guide: "聽音辨位。Terfenol-D（含鋱合金）能將微小的磁場變化轉化為巨大的形狀改變（聲納）。你現在對聲音或微小的波動極度敏感，適合傾聽弦外之音，或者將微小的訊號放大成具體的行動。", science: "Terfenol-D是磁致伸縮性最強的材料，用於聲納系統。" },

    // 66. Dy 鏑
    { z: 66, s: "Dy", n: "鏑", title: "難解", title_en: "Elusive", oracle_text: "越是難以定義的事物，越有探索的價值；不要急著尋求簡單的答案，享受解謎的過程。", score: 4, guide: "越難解的謎題，獎勵越豐厚。如果遇到看不懂的狀況或棘手的人，別急著焦慮，這代表你正在接觸高層次的智慧。耐心地抽絲剝繭，享受這個解謎的過程，你會發現其中的奧妙。", science: "難以取得與分離，具極高磁性。" },
    { z: 66, s: "Dy", n: "鏑", title: "難解", title_en: "Elusive", oracle_text: "越是難以定義的事物，越有探索的價值；不要急著尋求簡單的答案，享受解謎的過程。", score: 2, guide: "需要提升耐熱度。釹磁鐵雖然強，但不耐熱；加入鏑之後，就能在高溫下維持磁性。你現在面臨的環境可能比較「火熱」或高壓，請強化你的心理素質，讓自己能耐得住高溫考驗，不至於失去原本的能力。", science: "加入鏑可提升釹磁鐵的耐熱性（矯頑力）。" },

    // 67. Ho 鈥
    { z: 67, s: "Ho", n: "鈥", title: "聚焦", title_en: "Focus", oracle_text: "將能量集中於極小的一點；唯有極致的專注，才能精準地切除陳舊的病灶。", score: 3, guide: "注意力需要高度集中。不要試圖多工處理，一次只做一件事。像雷射一樣，把所有能量聚焦在最重要的那個點上，你能精準地解決問題，甚至切除長久以來的病灶。", science: "擁有最高磁矩，用於高功率雷射。" },
    { z: 67, s: "Ho", n: "鈥", title: "聚焦", title_en: "Focus", oracle_text: "將能量集中於極小的一點；唯有極致的專注，才能精準地切除陳舊的病灶。", score: 4, guide: "校正你的標準。氧化鈥玻璃是用來校正光譜儀的標準。此刻的你是大家的基準點，保持你的正直與準確，不要因為人情壓力而偏移。你的存在就是一把尺，幫助周遭的人校正回歸正軌。", science: "氧化鈥玻璃具有獨特的吸收光譜，用於校正分光光度計。" },

    // 68. Er 鉺
    { z: 68, s: "Er", n: "鉺", title: "增幅", title_en: "Amplify", oracle_text: "微弱的聲音也值得被聽見；成為那個放大器，讓遠方的訊號依然清晰如初。", score: 3, guide: "適合擔任傳聲筒或推廣者的角色。如果你覺得某個點子很好但聲音太小，幫它一把，把優點放大出去。你的助力會讓訊息傳得更遠，連結遠方的資源與機會。", science: "光纖放大器，增強訊號。" },
    { z: 68, s: "Er", n: "鉺", title: "增幅", title_en: "Amplify", oracle_text: "微弱的聲音也值得被聽見；成為那個放大器，讓遠方的訊號依然清晰如初。", score: 4, guide: "溫柔的粉紅力量。鉺離子呈現美麗的粉紅色，能用於美容雷射磨皮。這暗示著你需要用溫和的方式去除表面的瑕疵。不必大刀闊斧，用溫柔但精準的光束，慢慢磨平那些不完美的凹凸，讓新的氣象顯露出來。", science: "鉺雅各雷射（Er:YAG）波長2940nm，被水吸收佳，常用於皮膚雷射磨皮。" },

    // 69. Tm 銩
    { z: 69, s: "Tm", n: "銩", title: "微光", title_en: "Glimmer", oracle_text: "稀有的事物往往發著微弱的光；雖然不刺眼，卻能穿透最深層的黑暗。", score: 3, guide: "在迷惘或困惑中，請留意那些不起眼的希望。它可能不是大張旗鼓的幫助，而是一句輕聲的問候或一個小小的線索。抓住那道微光，它擁有穿透黑暗的力量。", science: "稀有元素，用於小型X光機源。" },
    { z: 69, s: "Tm", n: "銩", title: "微光", title_en: "Glimmer", oracle_text: "稀有的事物往往發著微弱的光；雖然不刺眼，卻能穿透最深層的黑暗。", score: 5, guide: "真金不怕火煉的鑑賞家。銩雖然稀少且昂貴，但也是紙鈔防偽的關鍵。你現在擁有極佳的鑑賞力，能夠在眾多贗品或虛假訊息中，一眼辨識出真正有價值的東西。相信你的眼光。", science: "銩在紫外光下發出藍色螢光，用於歐元防偽。" },

    // 70. Yb 鐿
    { z: 70, s: "Yb", n: "鐿", title: "抗壓", title_en: "Stress", oracle_text: "壓力是種物理訊號；感知環境的變化，適度的阻力反而能校準你的精準度。", score: 3, guide: "環境可能會給你一點壓力測試。這不是要壓垮你，而是像校正時鐘一樣，來確認你的狀態是否精準。保持彈性與感知力，你會發現適度的壓力轉化為了讓你更精確的動力。", science: "電阻率隨壓力變化（壓力感測器），用於原子鐘。" },
    { z: 70, s: "Yb", n: "鐿", title: "抗壓", title_en: "Stress", oracle_text: "壓力是種物理訊號；感知環境的變化，適度的阻力反而能校準你的精準度。", score: 4, guide: "穩定的雷射源。光纖雷射中的鐿，能將雜亂的能量轉化為高品質的光束。這是一個轉化的一天，把混亂的輸入（工作、情緒）在內心消化後，輸出成精準、強大的成果。你的轉化效率極高。", science: "鐿光纖雷射效率高，廣泛用於工業切割焊接。" },

    // 71. Lu 鎦
    { z: 71, s: "Lu", n: "鎦", title: "精煉", title_en: "Refine", oracle_text: "分離是為了更純粹的重組；作為最後的試煉，裂解舊有的鍵結，催化出全新的未來。", score: 3, guide: "適合去蕪存菁的時刻。無論是優化工作流程還是整理房間雜物，把多餘的、老舊的結構打散，只留下最有用的部分。這是一個除舊佈新的好時機，為新階段做準備。", science: "石油裂解催化劑，密度最大稀土。" },
    { z: 71, s: "Lu", n: "鎦", title: "精煉", title_en: "Refine", oracle_text: "分離是為了更純粹的重組；作為最後的試煉，裂解舊有的鍵結，催化出全新的未來。", score: 5, guide: "年代的見證者。鎦-鉿定年法能測定極古老的岩石與隕石。你現在擁有宏觀的時間視角，不被眼前的小挫折困住。用長遠的眼光看問題，你會發現現在的困難在漫長的時間長河中，只是微不足道的塵埃。", science: "鎦-鉿定年法用於測定古老隕石與岩石的年齡。" },

    // 72. Hf 鉿
    { z: 72, s: "Hf", n: "鉿", title: "影子", title_en: "Shadow", oracle_text: "強者背後總有共生者；隱藏在閃耀的鋯石背後，吸收混亂是為了維持大局的穩定。", score: 3, guide: "適合當個沈穩的配角或傾聽者。你不需要站在舞台中央，試著像影子一樣，吸收周遭的負能量或躁動。你的冷靜存在，是讓混亂場面安定下來的關鍵力量。", science: "與鋯共生，吸收中子能力強。" },
    { z: 72, s: "Hf", n: "鉿", title: "影子", title_en: "Shadow", oracle_text: "強者背後總有共生者；隱藏在閃耀的鋯石背後，吸收混亂是為了維持大局的穩定。", score: 4, guide: "你是科技的守門員。就像鉿的氧化物是用來取代傳統晶片中的絕緣層，你代表著更新、更精密的一代。如果覺得舊方法遇到瓶頸（漏電），大膽採用新技術或新觀念，你將突破摩爾定律的限制。", science: "氧化鉿（High-k材料）在晶片製程中取代二氧化矽，解決漏電問題。" },

    // 73. Ta 鉭
    { z: 73, s: "Ta", n: "鉭", title: "渴望", title_en: "Desire", oracle_text: "無論外在環境如何侵蝕，內在始終完好無損；將巨大的能量儲存在小小的空間裡，蓄勢待發。", score: 3, guide: "你內心可能有一種強烈的渴望或不滿足感。把這股感覺轉化為動力，像一顆充飽電的電容，外表平靜，但內在潛力驚人。無論外界如何變化，保持核心的完整，隨時準備釋放能量。", science: "極度抗酸，鉭質電容體積小容量大。" },
    { z: 73, s: "Ta", n: "鉭", title: "渴望", title_en: "Desire", oracle_text: "無論外在環境如何侵蝕，內在始終完好無損；將巨大的能量儲存在小小的空間裡，蓄勢待發。", score: 5, guide: "完美的生物相容性。你的親和力極佳，就像鉭金屬植入人體不會引起排斥一樣。這是一個適合建立新關係或融入新團體的日子，你的存在會被大家自然地接納，完全沒有異物感。", science: "鉭具有極佳的生物相容性，常用於骨科植入物與心臟支架。" },

    // 74. W 鎢
    { z: 74, s: "W", n: "鎢", title: "堅毅", title_en: "Tenacity", oracle_text: "原則是不可被融化的；唯有耐得住最高溫的考驗，才能在真空中發出最亮的光。", score: 3, guide: "面對壓力或困難，請展現出驚人的抗壓性。就像鎢絲一樣，環境的溫度與壓力越大，你反而表現得更亮眼。堅持你的立場與原則，絕對不要輕易妥協或融化。", science: "熔點最高的金屬（3422°C），燈泡燈絲。" },
    { z: 74, s: "W", n: "鎢", title: "堅毅", title_en: "Tenacity", oracle_text: "原則是不可被融化的；唯有耐得住最高溫的考驗，才能在真空中發出最亮的光。", score: 4, guide: "硬碰硬的實力派。碳化鎢的硬度僅次於鑽石，是用來切削鋼鐵的利器。面對難纏的問題，不需要太多花招，直接展現你的硬實力（專業技能），就能像切奶油一樣解決難題。", science: "碳化鎢極硬，用於切削工具與鑽頭。" },

    // 75. Re 錸
    { z: 75, s: "Re", n: "錸", title: "壓軸", title_en: "Finale", oracle_text: "最後登場的往往是關鍵；唯有極限的高溫，才能啟動噴射引擎，推動夢想起飛。", score: 4, guide: "你是壓軸的角色。也許前面的過程很漫長，但最後的關鍵一擊將由你完成。就像噴射引擎一樣，現在正是動力全開、推動計畫起飛的最佳時刻，展現你在極極限狀態下的優雅。", science: "最後發現的穩定元素，耐高溫，用於噴射引擎。" },
    { z: 75, s: "Re", n: "錸", title: "壓軸", title_en: "Finale", oracle_text: "最後登場的往往是關鍵；唯有極限的高溫，才能啟動噴射引擎，推動夢想起飛。", score: 3, guide: "雖然稀有且昂貴，但絕對值得。你可能覺得自己付出太多卻回收太慢，但請記得錸的開採極其困難。你的價值在於稀缺性與耐用性，不要賤賣自己的才華，懂得欣賞你的人自然會付出相應的代價。", science: "地殼中極稀有，且不形成獨立礦物，多為鉬礦副產品。" },

    // 76. Os 鋨
    { z: 76, s: "Os", n: "鋨", title: "份量", title_en: "Weight", oracle_text: "存在感不在於體積大小，而在於密度；小小一塊，就足以承載歷史的重量。", score: 3, guide: "你的言語或決定極具份量，大家都會認真對待。請謹言慎行，適合進行書寫、簽約或紀錄。你此刻所做下的決定，會像刻在石頭上一樣，難以磨滅且影響深遠。", science: "密度最大的天然元素，鋼筆筆尖。" },
    { z: 76, s: "Os", n: "鋨", title: "份量", title_en: "Weight", oracle_text: "存在感不在於體積大小，而在於密度；小小一塊，就足以承載歷史的重量。", score: 2, guide: "小心有毒的氣味。四氧化鋨雖然能用來染色指紋，但具有劇毒且易揮發。今天請留意自己的言行是否帶有「毒性」，或者過於尖銳的批評會讓人感到窒息。保持沈穩，收斂氣味。", science: "鋨粉易氧化成劇毒、有刺激性氣味的四氧化鋨。" },

    // 77. Ir 銥
    { z: 77, s: "Ir", n: "銥", title: "倖存者", title_en: "Survivor", oracle_text: "毀滅是重生的序曲；當巨大的衝擊來襲，唯有最強的抗性，能見證舊時代的終結。", score: 4, guide: "生活可能會發生一些意外的衝擊，那其實是為了打破僵局。你擁有極強的抗壓性與生存能力，保持信心，你會安然度過這場變動，並在廢墟之上迎來全新的開始。", science: "恐龍滅絕隕石坑富含銥，極度抗腐蝕。" },
    { z: 77, s: "Ir", n: "銥", title: "倖存者", title_en: "Survivor", oracle_text: "毀滅是重生的序曲；當巨大的衝擊來襲，唯有最強的抗性，能見證舊時代的終結。", score: 5, guide: "標準的守護者。國際公斤原器就是由鉑銥合金製成。你現在是誠信與標準的象徵，大家會以你為準則。保持不變的原則與操守，你將成為混亂世界中唯一的度量衡。", science: "鉑銥合金曾用於製作國際標準公斤原器，極度穩定。" },

    // 78. Pt 鉑
    { z: 78, s: "Pt", n: "鉑", title: "尊爵", title_en: "Prestige", oracle_text: "真正的貴族不需親自下場；透過在旁引導，促成他人的化學反應，卻不損耗自身分毫。", score: 4, guide: "你的價值不需要大聲嚷嚷，懂的人自然懂。適合扮演導師或媒人的角色，幫助他人達成目標。這種不介入卻能促成好事的特質，反而會提升你在大家心中的尊貴地位。", science: "白金，優異催化劑。" },
    { z: 78, s: "Pt", n: "鉑", title: "尊爵", title_en: "Prestige", oracle_text: "真正的貴族不需親自下場；透過在旁引導，促成他人的化學反應，卻不損耗自身分毫。", score: 3, guide: "抗癌的鬥士。順鉑是著名的化療藥物。你現在可能正經歷一段痛苦的治療或修正期，這是在對抗生命中的「癌細胞」（壞習慣或惡人）。過程雖然不舒服，但這是通往康復的必經之路。", science: "順鉑（Cisplatin）是含鉑的化療藥物。" },

    // 79. Au 金
    { z: 79, s: "Au", n: "金", title: "永恆", title_en: "Eternity", oracle_text: "真理是不會生鏽的；真正的強大是柔軟與包容，能屈能伸，卻永遠閃耀。", score: 5, guide: "你自帶光芒，像太陽一樣自信。同時請記得，真正的強大不只是剛硬，而是像金箔一樣，擁有極大的包容力與延展性。以柔克剛，保持本質的純粹，你就是最後的贏家。", science: "不活潑不生鏽，延展性最佳。" },
    { z: 79, s: "Au", n: "金", title: "永恆", title_en: "Eternity", oracle_text: "真理是不會生鏽的；真正的強大是柔軟與包容，能屈能伸，卻永遠閃耀。", score: 2, guide: "別被王水溶化了。黃金雖然穩定，但遇到極端的環境（王水）還是會消融。今天請遠離那些極度激進或惡意攻擊的環境，再完美的修養也經不起惡意的溶解。保護好自己的金身。", science: "金能溶於王水（濃硝酸與濃鹽酸混合液）。" },

    // 80. Hg 汞
    { z: 80, s: "Hg", n: "汞", title: "善變", title_en: "The Fickle", oracle_text: "型態是為了適應容器而生；快地流動、融合、吞噬，讓人無法捉摸，也無法緊握。", score: 2, guide: "局勢流動不定，就像水銀瀉地一樣難以掌握。你的溝通能力很強，但可能缺乏定性。利用這股靈活度去適應變化，但要小心，不要因為太過圓滑而失去了自己的原則，或給出無法兌現的承諾。", science: "液態金屬，形成汞齊（合金）。" },
    { z: 80, s: "Hg", n: "汞", title: "善變", title_en: "The Fickle", oracle_text: "型態是為了適應容器而生；快地流動、融合、吞噬，讓人無法捉摸，也無法緊握。", score: 4, guide: "凝聚力極強。水銀落地會自動聚成圓珠，這代表你擁有強大的自我修復與聚合能力。即使受到外力打擊分散，只要給點時間，你就能重新凝聚回一個完整的自我，表面張力會撐起你的尊嚴。", science: "汞具有極大的表面張力，在平面上會聚成圓球狀。" },

    // 81. Tl 鉈
    { z: 81, s: "Tl", n: "鉈", title: "偽裝者", title_en: "The Mimic", oracle_text: "美麗的綠色嫩芽下藏著陷阱；當原本屬於你的東西開始脫落，那是為了讓你看清真實的自我。", score: 4, guide: "展現變色龍般的演技。適度的偽裝是為了更順利地達成目標，運用你的社交手腕融入任何圈子並獲得情報。若發生失去或分離（如脫落），請理解那是為了汰換舊有模式，舊的不去新的不來。", science: "偽裝成鉀離子進入細胞，劇毒，導致脫髮。" },
    { z: 81, s: "Tl", n: "鉈", title: "偽裝者", title_en: "The Mimic", oracle_text: "美麗的綠色嫩芽下藏著陷阱；當原本屬於你的東西開始脫落，那是為了讓你看清真實的自我。", score: 2, guide: "美麗的綠光是警告。鉈的光譜是一條明亮的綠線，看似充滿希望，實則危險。今天對於那些「好得難以置信」的機會要特別小心，綠燈可能不是通行的訊號，而是陷阱的偽裝。", science: "鉈（Thallium）希臘文意為綠色的嫩枝，光譜為亮綠色。" },

    // 82. Pb 鉛
    { z: 82, s: "Pb", n: "鉛", title: "終局", title_en: "The End", oracle_text: "所有的躁動終將歸於平靜；我是漫長旅途的終點，也是抵擋致命射線的最後一道盾牌。", score: 5, guide: "享受塵埃落定的安穩感。最困難的部分已經過去了，現在是收成與休息的時候。你已經打了堅不可摧的堡壘，外界的干擾無法傷害你。這是一個圓滿且安全的結尾。", science: "放射性衰變鏈的最終穩定產物，阻擋輻射。" },
    { z: 82, s: "Pb", n: "鉛", title: "終局", title_en: "The End", oracle_text: "所有的躁動終將歸於平靜；我是漫長旅途的終點，也是抵擋致命射線的最後一道盾牌。", score: 3, guide: "沈重的甜蜜。羅馬人曾用乙酸鉛作為甜味劑，卻導致了慢性中毒。檢視生活中那些讓你感到沈溺的嗜好或關係，它們或許甜美，但正在累積看不見的負擔。是時候戒掉那些「有毒的糖」了。", science: "乙酸鉛有甜味（鉛糖），古羅馬人曾用作甜味劑導致鉛中毒。" },

    // 83. Bi 鉍
    { z: 83, s: "Bi", n: "鉍", title: "迷宮", title_en: "The Maze", oracle_text: "秩序中藏著混亂的美感；不必迎合大眾的磁場，保持一點排斥力，走出自己獨特的螺旋。", score: 3, guide: "你的生活路徑可能像迷宮一樣複雜曲折，但請欣賞這份繁複的美麗。保持一點個性與反磁性（Diamagnetism）。你不必隨波逐流去迎合大眾的磁場，反而因為這股天生的排斥力，讓你能在混亂中懸浮，走出一條獨特的路徑。", science: "晶體呈迷宮螺旋狀，是所有金屬中反磁性最強的。" },
    { z: 83, s: "Bi", n: "鉍", title: "迷宮", title_en: "The Maze", oracle_text: "秩序中藏著混亂的美感；不必迎合大眾的磁場，保持一點排斥力，走出自己獨特的螺旋。", score: 4, guide: "最後的準穩定。鉍曾被視為最重的穩定元素，直到近代才發現其極微弱的放射性。這代表你在一個長期的變動中，終於找到了一個可以長久安身的立足點。雖然本質仍有極緩慢的變化，但相較於周遭的衰變，你已是極致的安穩。", science: "鉍-209半衰期極長（宇宙年齡的十億倍），視為準穩定元素。" },

    // 84. Po 釙
    { z: 84, s: "Po", n: "釙", title: "熾熱", title_en: "Fervor", oracle_text: "愛與忠誠是一種燃燒；無需外來的火種，內在強烈的能量足以讓空氣發出幽藍的光芒。", score: 2, guide: "內心有一團火在燃燒，這股能量非常強大，能溫暖人也能灼傷人。將這份熱情用於你忠誠的目標，但要小心調節溫度，過度的自我消耗會導致毀滅。請注意身心過勞的警訊，不要燃燒殆盡。", science: "放射性極強，自體發熱，激發空氣發光。" },
    { z: 84, s: "Po", n: "釙", title: "熾熱", title_en: "Fervor", oracle_text: "愛與忠誠是一種燃燒；無需外來的火種，內在強烈的能量足以讓空氣發出幽藍的光芒。", score: 4, guide: "遙遠的傳遞。釙能消除靜電，讓紙張或膠片順利分開。你現在適合扮演消除摩擦的角色，解決團隊中那些無形的張力與「靜電」，讓事情運作得更順暢。你的能量雖然強烈，但也能用於和平用途。", science: "釙-210可作為工業用靜電消除器。" },

    // 85. At 砈
    { z: 85, s: "At", n: "砈", title: "稀有", title_en: "Rarity", oracle_text: "存在本身就是奇蹟；越是珍貴的事物越是短暫，在不穩定的無常中，看見剎那的永恆。", score: 4, guide: "機會極度稀有且稍縱即逝，不要試圖去抓緊或控制。當下的相遇或靈感非常難得，出現了就趕快把握，享受那極度短暫卻珍貴的時刻。無常是常態，學會欣賞剎那的光輝。", science: "最稀有的天然元素，極不穩定。" },
    { z: 85, s: "At", n: "砈", title: "稀有", title_en: "Rarity", oracle_text: "存在本身就是奇蹟；越是珍貴的事物越是短暫，在不穩定的無常中，看見剎那的永恆。", score: 2, guide: "難以捉摸的狀態。砈的性質介於金屬與非金屬之間，連科學家都搞不清楚它到底是黑是亮。你可能正處於身分認同的模糊地帶，感到迷惘。別急著定義自己，這種神秘感也是一種魅力。", science: "性質推測介於鹵素與金屬之間，因太稀少難以目視確認。" },

    // 86. Rn 氡
    { z: 86, s: "Rn", n: "氡", title: "潛伏", title_en: "Lurk", oracle_text: "看不見的影響最為深遠；沈積在深處的氣息，若不時常通風，終將成為隱形的負擔。", score: 2, guide: "氣氛有點沈悶，注意那些看不見的隱憂或環境影響。這可能是積壓已久的情緒，或是通風不良的關係。今天適合把心事說出來，或離開封閉的環境透透氣，別讓沈重的情緒像氡氣一樣積在心底。", science: "沈積在地下室的放射性氣體。" },
    { z: 86, s: "Rn", n: "氡", title: "潛伏", title_en: "Lurk", oracle_text: "看不見的影響最為深遠；沈積在深處的氣息，若不時常通風，終將成為隱形的負擔。", score: 4, guide: "來自地底的訊息。氡氣濃度的變化有時能預測地震。你的潛意識正在給你強烈的訊號，不要忽視那些莫名出現的預感或身體反應，那可能是大變動前的預警。相信你的直覺雷達。", science: "地下水或土壤中氡氣濃度異常，常被視為地震前兆。" },

    // 87. Fr 鍅
    { z: 87, s: "Fr", n: "鍅", title: "剎那", title_en: "The Instant", oracle_text: "理論上的爆發力無限大；不在乎天長地久，只在乎那稍縱即逝的激烈與衝動。", score: 4, guide: "能量來得快、去得也快，充滿了衝動與激情。如果你想做什麼瘋狂的事，現在就是時機，因為這股熱度維持不了太久。不要思考長遠後果，專注於當下的爆發力，去體驗那瞬間的極致。", science: "活性最大的鹼金屬（理論上），半衰期極短。" },
    { z: 87, s: "Fr", n: "鍅", title: "剎那", title_en: "The Instant", oracle_text: "理論上的爆發力無限大；不在乎天長地久，只在乎那稍縱即逝的激烈與衝動。", score: 3, guide: "極致的稀有與剎那。鍅的半衰期極短，化學性質難以捕捉。這提醒你，有些高能量的爆發註定無法持久。不必追求永恆的燃燒，在那短短的22分鐘內，綻放出理論極限的光芒，就已足夠震撼世界。", science: "地殼中總量極少（約30克），半衰期僅22分鐘，化學性質難以精確測量。" },

    // 88. Ra 鐳
    { z: 88, s: "Ra", n: "鐳", title: "覺醒", title_en: "Awakening", oracle_text: "真相的光芒無法被遮掩；這股力量既是解藥也是毒藥，端看你是否有足夠的智慧去駕馭。", score: 3, guide: "象徵揭露與覺醒的時刻。你手中握有強大的力量或真相，它能治癒也能毀滅。保持清醒的覺知，謹慎使用這份光芒。不要盲目崇拜力量，理解其代價後，你將成為照亮他人的燈塔。", science: "自發光熱，曾被濫用，後用於放療。" },
    { z: 88, s: "Ra", n: "鐳", title: "覺醒", title_en: "Awakening", oracle_text: "真相的光芒無法被遮掩；這股力量既是解藥也是毒藥，端看你是否有足夠的智慧去駕馭。", score: 4, guide: "時間會證明一切。就像鐳鐘錶上的螢光漆一樣，在黑暗中你依然能看清時間與方向。不必急著辯解，保持你的光亮，當環境變暗時，大家自然會看見你的價值與指引。", science: "鐳曾用於夜光手錶的塗料，雖有輻射但能持續發光。" },

    // 89. Ac 錒
    { z: 89, s: "Ac", n: "錒", title: "啟動", title_en: "Activate", oracle_text: "黑暗中的幽藍光芒；連鎖反應的開關已被按下，無論是否準備好，進程已經開始。", score: 3, guide: "環境中有一股力量正在強制啟動。也許是一項無法回頭的計畫，或是一個必然發生的事件。不要試圖剎車，順著這股啟動力前進，這是一個長遠變化的開端，連鎖反應已經無法停止。", science: "錒系元素之首，發出幽靈藍光。" },
    { z: 89, s: "Ac", n: "錒", title: "啟動", title_en: "Activate", oracle_text: "黑暗中的幽藍光芒；連鎖反應的開關已被按下，無論是否準備好，進程已經開始。", score: 4, guide: "源源不絕的熱情。錒的放射性強到能讓自身發光發熱。你現在充滿了幹勁，不需要別人的鼓勵，你自己就是發電機。這股內在的驅動力將帶領你和團隊穿越寒冬。", science: "放射性極強，會發熱與發光。" },

    // 90. Th 釷
    { z: 90, s: "Th", n: "釷", title: "潛能", title_en: "Potential", oracle_text: "沈睡的巨大礦藏；雖然不如鈾那般張揚，卻擁有更安全且長遠的燃燒力量。", score: 3, guide: "你身處的環境裡藏有未開發的豐沛資源。也許是一個被低估的人才，或是一條非主流的替代路徑。不要只看眼前最熱門的選項，去挖掘那些沈睡的潛力股，那裡蘊含著更長遠的價值。", science: "未來核能燃料，存量豐富且安全。" },
    { z: 90, s: "Th", n: "釷", title: "潛能", title_en: "Potential", oracle_text: "沈睡的巨大礦藏；雖然不如鈾那般張揚，卻擁有更安全且長遠的燃燒力量。", score: 4, guide: "提升視野的時刻。氧化釷用於製造高品質的相機鏡頭，能提升透光率。現在的你適合提升自己的格局與視野，透過學習或旅行，讓自己看得更遠、更清晰，未來的藍圖將一覽無遺。", science: "氧化釷折射率高，早期用於高階相機鏡頭。" },

    // 91. Pa 鏷
    { z: 91, s: "Pa", n: "鏷", title: "過渡", title_en: "Transition", oracle_text: "介於始祖與後裔之間；忍受衰變過程中的不穩定，是為了連結過去與未來的橋樑。", score: 4, guide: "你正處於通往更好地方的途中。雖然現在像是在過橋，狀態有點搖晃不穩，例如轉職期或曖昧期。把這段過渡期當作必要的中場休息，忍受暫時的焦慮，期待接下來的精彩轉變。", science: "錒的祖先，衰變鏈中間環節。" },
    { z: 91, s: "Pa", n: "鏷", title: "過渡", title_en: "Transition", oracle_text: "介於始祖與後裔之間；忍受衰變過程中的不穩定，是為了連結過去與未來的橋樑。", score: 2, guide: "昂貴的代價。鏷極其稀有且難以提取，曾是世上最貴的元素。這張牌提醒你，目前的過渡期可能代價高昂，無論是金錢還是心力。請評估這個成本是否值得，不要為了過渡而耗盡資產。", science: "極稀有，1960年代每克價值數千美元。" },

    // 92. U 鈾
    { z: 92, s: "U", n: "鈾", title: "臨界", title_en: "Critical", oracle_text: "能量密度已達極限；臨界質量一旦突破，原本的秩序將被連鎖反應徹底改寫。", score: 2, guide: "局勢一觸即發，壓力值已達紅線。你或環境就像一顆未爆彈，只要一點小火花就會引發連鎖反應，導致巨大的改變。請遠離壓力源，不要強撐，適度洩壓是為了避免理智線斷裂。", science: "核裂變原料，臨界質量引發反應。" },
    { z: 92, s: "U", n: "鈾", title: "臨界", title_en: "Critical", oracle_text: "能量密度已達極限；臨界質量一旦突破，原本的秩序將被連鎖反應徹底改寫。", score: 4, guide: "改變世界的顏色。鈾玻璃在紫外線下會發出美麗的綠色螢光。即便本質沈重且危險，你依然能展現出藝術與美的一面。將你的壓力轉化為創作的動力，你的作品將帶有獨特的螢光魅力。", science: "鈾玻璃（凡士林玻璃）呈黃綠色，有螢光反應。" },

    // 93. Np 錼
    { z: 93, s: "Np", n: "錼", title: "深海", title_en: "Abyss", oracle_text: "如海王星般深邃的潛意識；地表上的波濤，其實都源自於深海裡看不見的洋流。", score: 3, guide: "影響力來自潛意識或直覺。你可能會莫名地感到快樂或憂鬱，或者夢境特別清晰。不要忽視這些感覺，那是內在深海傳來的訊號，環境中隱藏著看不見的情緒暗流在推動事情發展。", science: "以海王星命名，核反應副產物。" },
    { z: 93, s: "Np", n: "錼", title: "深海", title_en: "Abyss", oracle_text: "如海王星般深邃的潛意識；地表上的波濤，其實都源自於深海裡看不見的洋流。", score: 4, guide: "通往新世界的門戶。錼是第一個超鈾元素，象徵著跨越已知、進入未知的起點。你正站在一個新領域的入口，雖然前方深不可測，但跨過去後，你將發現前所未有的新元素與機會。", science: "第一個被合成的超鈾元素，開啟了人造元素時代。" },

    // 94. Pu 鈽
    { z: 94, s: "Pu", n: "鈽", title: "毀滅", title_en: "Destruction", oracle_text: "冥王星的判決是絕對的；為了新生的地基，必須先將舊有的結構徹底摧毀。", score: 5, guide: "恭喜，你終於可以擺脫那些不適用的舊東西了。這不是修修補補，而是徹底的結束與破壞。大膽地按下刪除鍵，無論是關係還是舊習慣，唯有徹底的毀滅，才能在廢墟上建立全新的摩天大樓。", science: "以冥王星命名，原子彈原料。" },
    { z: 94, s: "Pu", n: "鈽", title: "毀滅", title_en: "Destruction", oracle_text: "冥王星的判決是絕對的；為了新生的地基，必須先將舊有的結構徹底摧毀。", score: 2, guide: "隱形的毒性。鈽被稱為地獄之王，毒性與放射性極強。小心那些看不見的危害，可能是某人的惡意中傷或是不良的生活習慣。這些毒素正在累積，請立刻啟動排毒程序，遠離輻射源。", science: "鈽具有極強的放射性毒性與化學毒性。" },

    // 95. Am 鋂
    { z: 95, s: "Am", n: "鋂", title: "警示", title_en: "Warning", oracle_text: "看不見的哨兵；在火焰尚未吞噬一切之前，先感知到煙霧的氣息。", score: 4, guide: "你的直覺準得可怕，是守護大家的雷達。留意環境給你的微小警訊，也許是某人的眼神或身體的不適。這個警報器正在響，不要忽略它，相信你的第六感，你能在問題發生前優雅地避開它。", science: "煙霧偵測器核心，電離空氣。" },
    { z: 95, s: "Am", n: "鋂", title: "警示", title_en: "Warning", oracle_text: "看不見的哨兵；在火焰尚未吞噬一切之前，先感知到煙霧的氣息。", score: 3, guide: "雖然你發出的訊號很微弱，但非常重要。就像煙霧偵測器裡的微量鋂，平時無人注意，關鍵時刻卻能救命。不要因為自己位階低或聲音小就不敢發言，你的提醒是團隊安全的最後一道防線。", science: "日常生活中最常見的人造放射性元素，含量微少但關鍵。" },

    // 96. Cm 鋦
    { z: 96, s: "Cm", n: "鋦", title: "熱源", title_en: "Heat", oracle_text: "在冰冷的虛空中持續燃燒；不需要太陽的眷顧，我自己就是能量的來源。", score: 2, guide: "你身處一個資源匱乏或較為冷漠的環境。別指望外在的援助或溫暖，你必須像鋦一樣自體發熱。雖然孤獨，但你擁有足夠的內在能量成為團隊中那個提供溫暖與動力的人，堅持下去。", science: "用於太空探測器熱電機，自體發熱。" },
    { z: 96, s: "Cm", n: "鋦", title: "熱源", title_en: "Heat", oracle_text: "在冰冷的虛空中持續燃燒；不需要太陽的眷顧，我自己就是能量的來源。", score: 4, guide: "探索火星的勇氣。鋦曾隨著探測車登陸火星，分析岩石成分。這張牌鼓勵你前往未知的領域探險，即便那裡荒涼無人，你的專業能力（α粒子X射線光譜儀）也能在那裡分析出寶貴的成果。", science: "用於火星探測車的α粒子X射線光譜儀（APXS），分析土壤。" },

    // 97. Bk 鉳
    { z: 97, s: "Bk", n: "鉳", title: "探索", title_en: "Explore", oracle_text: "知識的疆界在於未知；為了合成那個不存在的奇蹟，必須投入無數次的嘗試。", score: 3, guide: "氛圍是實驗性的。適合嘗試以前沒做過的方法，或者學習冷門的知識。雖然不一定馬上成功，或者前路充滿未知，但這個探索的過程本身就很有價值，你是拓荒者，不要害怕失敗。", science: "以柏克萊大學命名，合成困難。" },
    { z: 97, s: "Bk", n: "鉳", title: "探索", title_en: "Explore", oracle_text: "知識的疆界在於未知；為了合成那個不存在的奇蹟，必須投入無數次的嘗試。", score: 2, guide: "產量極低的回報。鉳的合成需要漫長的時間與巨大的資源，但產量卻微乎其微。今天請評估你的投入產出比，是否在某件不值得的事情上耗費了太多心力？適時停損也是一種智慧。", science: "鉳的製備需要極長時間的中子轟擊，產量以毫克計。" },

    // 98. Cf 鉲
    { z: 98, s: "Cf", n: "鉲", title: "關鍵", title_en: "Key", oracle_text: "極其微小的份量，卻是啟動巨大反應的鑰匙；價值不在於多，而在於不可取代。", score: 4, guide: "你扮演著關鍵鑰匙的角色。雖然你可能只講了一句話，或做了一個微小的動作，但這正是整件事能不能成的關鍵點。不要妄自菲薄，你的影響力比你想的更昂貴且不可取代。", science: "最強中子源，微量即可啟動反應爐。" },
    { z: 98, s: "Cf", n: "鉲", title: "關鍵", title_en: "Key", oracle_text: "極其微小的份量，卻是啟動巨大反應的鑰匙；價值不在於多，而在於不可取代。", score: 5, guide: "你是無價之寶。鉲是世界上最昂貴的物質之一，有錢也買不到。這張牌象徵你獨有的天賦或資源極具價值，市場上無可替代。提高你的報價，或是更加珍惜自己的羽毛，你值得最好的對待。", science: "極度昂貴，每公克價值數千萬美元。" },

    // 99. Es 鑀
    { z: 99, s: "Es", n: "鑀", title: "智慧", title_en: "Wisdom", oracle_text: "在毀滅的灰燼中發現真理；透過公式與想像，看見肉眼無法抵達的宇宙。", score: 4, guide: "需要跳脫框架的思考。遇到的問題用常規方法解決不了，試著發揮你的想像力，甚至有點瘋狂的想法。就像在爆炸的殘骸中尋找新元素一樣，智慧會帶你從混亂中找到答案。", science: "以愛因斯坦命名，氫彈殘骸中發現。" },
    { z: 99, s: "Es", n: "鑀", title: "智慧", title_en: "Wisdom", oracle_text: "在毀滅的灰燼中發現真理；透過公式與想像，看見肉眼無法抵達的宇宙。", score: 3, guide: "難以捉摸的量。鑀的產量極少，肉眼幾乎看不見。這暗示著智慧或真相往往是無形的，無法用物質衡量。今天請多關注精神層面或抽象的概念，不要執著於看得見的物質回報，靈性的成長才是重點。", science: "產量極少，肉眼難以觀察，多用於基礎科學研究。" },

    // 100. Fm 鐨
    { z: 100, s: "Fm", n: "鐨", title: "極限", title_en: "Limit", oracle_text: "抵達穩定的邊界；再往前一步就是崩解，知止是為了保持存在的完整。", score: 5, guide: "你已經登頂了，到達了某個階段的極限。這張牌代表你已經做到了最好，現在是插旗慶祝的時候。不要再逼自己往前，接受目前的邊界，知足並停下腳步欣賞山頂的風景，休息是為了不崩潰。", science: "中子轟擊產生的最重元素，物理極限。" },
    { z: 100, s: "Fm", n: "鐨", title: "極限", title_en: "Limit", oracle_text: "抵達穩定的邊界；再往前一步就是崩解，知止是為了保持存在的完整。", score: 3, guide: "向費米致敬。費米是原子能之父，這張牌象徵著「理論與實踐的結合」。光有想法不夠，光做不思考也不行。今天適合將你腦中的計畫付諸實行，或者為你的行動找尋理論支持，知行合一。", science: "以費米（Enrico Fermi）命名，他是打造第一座核反應爐的人。" },

    // 101. Md 鍆
    { z: 101, s: "Md", n: "鍆", title: "秩序", title_en: "Order", oracle_text: "萬物皆有其位；在混沌的元素海洋中，找出一條貫穿一切的規律。", score: 3, guide: "環境資訊過多或略顯混亂，此刻適合整理與歸納。把手邊的事物分類、列表、排定優先順序。當你建立起秩序與邏輯時，焦慮感便會自然消散，讓規律帶領你前進。", science: "以門得列夫命名，週期表發明者。" },
    { z: 101, s: "Md", n: "鍆", title: "秩序", title_en: "Order", oracle_text: "萬物皆有其位；在混沌的元素海洋中，找出一條貫穿一切的規律。", score: 4, guide: "預測未來的能力。就像門得列夫預言了未知元素一樣，你現在擁有極佳的前瞻性。根據現有的規律去推演未來，你的直覺與邏輯判斷將會非常準確，適合做長程規劃或投資佈局。", science: "門得列夫精準預言了當時尚未發現的元素（如鎵、鍺）。" },

    // 102. No 鍩
    { z: 102, s: "No", n: "鍩", title: "否定", title_en: "Negation", oracle_text: "符號是 No，但不代表沒有價值；有的時候，拒絕是為了定義什麼才是正確的。", score: 5, guide: "學會說不。運勢提醒你，你有絕對的權利拒絕不合理的要求、拒絕誘惑、拒絕隨波逐流。你的力量來自於你的拒絕，這是一種必要的自我保護，界線劃清了，自由就來了。", science: "化學符號No，發現過程充滿爭議。" },
    { z: 102, s: "No", n: "鍩", title: "否定", title_en: "Negation", oracle_text: "符號是 No，但不代表沒有價值；有的時候，拒絕是為了定義什麼才是正確的。", score: 2, guide: "爭議不斷。鍩的發現權曾引發國際爭議。你可能正處於一個名分未定或功勞被爭奪的局面。不要陷入無謂的口水戰，保留實力與證據，時間會釐清真相。避免捲入是非。", science: "諾貝爾獎得主命名，但發現者歸屬曾有美俄之爭。" },

    // 103. Lr 鐒
    { z: 103, s: "Lr", n: "鐒", title: "迴旋", title_en: "Cycle", oracle_text: "這不是終點，而是螺旋向上的起點；加粒子的終焉，是為了衝擊下一個維度。", score: 3, guide: "一個漫長的週期或業力即將結束。你正在迴旋加速，準備衝向下一個階段。整理好心情，無需頻頻回頭，利用這股離心力將自己拋向更高的維度，準備迎接全新的身份與挑戰。", science: "錒系最後元素，以迴旋加速器發明者命名。" },
    { z: 103, s: "Lr", n: "鐒", title: "迴旋", title_en: "Cycle", oracle_text: "這不是終點，而是螺旋向上的起點；加粒子的終焉，是為了衝擊下一個維度。", score: 4, guide: "科技帶來的突破。勞倫斯發明的迴旋加速器開啟了粒子物理新時代。這張牌建議你善用新工具或新科技，不要死守舊方法。一個新的APP、軟體或機器，可能是你突破現狀的加速器。", science: "勞倫斯發明的迴旋加速器是現代物理的重要工具。" },

    // 104. Rf 鑪
    { z: 104, s: "Rf", n: "鑪", title: "架構", title_en: "Structure", oracle_text: "在崩塌之前建立秩序；即使基礎不穩，宏大的架構依然能展現人類的野心。", score: 3, guide: "計畫可能有些趕鴨子上架，雖然基礎還未完全穩固，但必須先把架構搭起來。別過度追求細節的完美，此刻撐住場面、展現出宏觀的格局是最重要的，邊做邊修也是一種策略。", science: "第一個超重元素，極不穩定。" },
    { z: 104, s: "Rf", n: "鑪", title: "架構", title_en: "Structure", oracle_text: "在崩塌之前建立秩序；即使基礎不穩，宏大的架構依然能展現人類的野心。", score: 4, guide: "核心的本質。拉塞福發現了原子核，揭示了原子的空虛與核心的堅實。這暗示著你不要被龐大的表象嚇到，掌握核心的那一點點關鍵（原子核），就能掌控全局。", science: "以拉塞福命名，他發現了原子核結構。" },

    // 105. Db 杜
    { z: 105, s: "Db", n: "杜", title: "爭議", title_en: "Dispute", oracle_text: "真理往往伴隨著爭吵；不要害怕不同的聲音，觀點的衝撞是為了釐清歸屬。", score: 2, guide: "身處的環境充滿了不同意見，可能會捲入派系鬥爭或口角。保持中立，不要急著選邊站，也不要因為爭吵而退縮。這些觀點的衝撞是釐清真相的必經過程，讓子彈飛一會兒。", science: "美俄命名爭議（超費米子戰爭）。" },
    { z: 105, s: "Db", n: "杜", title: "爭議", title_en: "Dispute", oracle_text: "真理往往伴隨著爭吵；不要害怕不同的聲音，觀點的衝撞是為了釐清歸屬。", score: 4, guide: "合作後的妥協。杜元素的命名最終是國際妥協的結果。這張牌告訴你，完美的勝利不存在，雙贏往往來自於各退一步的妥協。接受一個不完美但大家都能接受的方案，是目前最好的解法。", science: "經過多年爭論，最終由IUPAC協調命名為Dubnium（俄羅斯杜布納）。" },

    // 106. Sg 𨭎
    { z: 106, s: "Sg", n: "𨭎", title: "傳承", title_en: "Legacy", oracle_text: "活著成為傳說；不需等待蓋棺論定，當下的成就足以證明你的名字。", score: 4, guide: "適合思考名聲與影響力。做一些能讓別人記得你的好事，或是傳承你的經驗。你現在的努力會立即得到認可，不需要等到以後，當下就是你的榮耀時刻，你的名字本身就是品牌。", science: "唯一以在世科學家命名的元素。" },
    { z: 106, s: "Sg", n: "𨭎", title: "傳承", title_en: "Legacy", oracle_text: "活著成為傳說；不需等待蓋棺論定，當下的成就足以證明你的名字。", score: 5, guide: "打破慣例的勇氣。𨭎的命名打破了「不以在世者命名」的傳統。這鼓勵你挑戰陳規，做第一個吃螃蟹的人。不要被「以前都是這樣」給限制住，你的創新將會立下新的標竿。", science: "西博格（Seaborg）在世時就獲得此殊榮，打破IUPAC慣例。" },

    // 107. Bh 𨨏
    { z: 107, s: "Bh", n: "𨨏", title: "躍遷", title_en: "Leap", oracle_text: "理解不需要連續；就像電子的跳躍，領悟往往發生在斷裂的瞬間。", score: 4, guide: "進步將是跳躍式的。不要鑽牛角尖去想邏輯連貫性，跟著你的直覺跳過去。你會突然靈光一閃，瞬間搞懂原本卡住很久的問題，這是一場非線性的智慧升級。", science: "以波耳命名，提出電子能級躍遷。" },
    { z: 107, s: "Bh", n: "𨨏", title: "躍遷", title_en: "Leap", oracle_text: "理解不需要連續；就像電子的跳躍，領悟往往發生在斷裂的瞬間。", score: 3, guide: "結構的穩定性。波耳模型解釋了原子穩定的原因。這張牌提醒你，雖然你在追求跳躍式的成長，但必須建立在一個穩定的軌道（核心價值）上。確認你的立足點穩固，然後大膽跳躍。", science: "波耳模型解釋了原子結構的穩定性。" },

    // 108. Hs 𨭆
    { z: 108, s: "Hs", n: "𨭆", title: "頑固", title_en: "Stubborn", oracle_text: "硬度是種態度；即便在極度不穩定的環境中，依然堅持原本的性質，拒絕改變。", score: 3, guide: "遇到困難時，適合展現出硬脾氣。環境可能很混亂，大家都在變來變去，但你不需改變。堅持你的原則與本質，這種頑固會讓你成為混亂局勢中的定海神針，贏得他人的敬畏。", science: "8B族，性質類似鋨（最硬），化學性質頑強。" },
    { z: 108, s: "Hs", n: "𨭆", title: "頑固", title_en: "Stubborn", oracle_text: "硬度是種態度；即便在極度不穩定的環境中，依然堅持原本的性質，拒絕改變。", score: 4, guide: "氣態的驚奇。𨭆的氧化物是揮發性的氣體，這在金屬中極為罕見。這暗示你展現出意想不到的一面。在大家以為你沈重呆板時，展現出靈活與輕盈，這種反差萌會為你帶來好運。", science: "四氧化𨭆是極少數的揮發性金屬氧化物。" },

    // 109. Mt 䥑
    { z: 109, s: "Mt", n: "䥑", title: "平反", title_en: "Justice", oracle_text: "被遺忘的功績終將浮現；正義或許會遲到，但榮耀終究會歸於真正的發現者。", score: 4, guide: "遲來的正義或被看見的機會即將降臨。如果你過去受了委屈、被低估或功勞被埋沒，現在有機會扳回一城。保持耐心與正直，時間會過濾掉雜質，讓你的真實價值浮現。", science: "以邁特納命名，曾因性別被諾貝爾獎遺漏。" },
    { z: 109, s: "Mt", n: "䥑", title: "平反", title_en: "Justice", oracle_text: "被遺忘的功績終將浮現；正義或許會遲到，但榮耀終究會歸於真正的發現者。", score: 3, guide: "分裂是為了釋放能量。邁特納發現了核分裂。這張牌告訴你，生活中的某些分離或拆夥，其實是為了釋放出更大的能量。不要害怕結束一段關係或模式，那是能量爆發的起點。", science: "邁特納是核分裂理論的解釋者。" },

    // 110. Ds 鐽
    { z: 110, s: "Ds", n: "鐽", title: "合成", title_en: "Synthesis", oracle_text: "奇蹟是被製出來的；將兩個巨大的重物強力撞擊，融合出前所未有的新物質。", score: 4, guide: "適合進行強強聯手。試著把兩個看似不相干的大專案、資源或強勢的人結合在一起。雖然過程可能會有激烈的碰撞與磨合，但融合後的結果將創造出全新的局面。", science: "重離子加速器撞擊融合而成。" },
    { z: 110, s: "Ds", n: "鐽", title: "合成", title_en: "Synthesis", oracle_text: "奇蹟是被製出來的；將兩個巨大的重物強力撞擊，融合出前所未有的新物質。", score: 2, guide: "極短暫的存在。鐽的壽命極短，稍縱即逝。這提醒你，某些高強度的結合或熱情可能無法持久。在投入資源進行「大融合」之前，請評估其可持續性，以免曇花一現。", science: "半衰期極短，存在時間微秒級。" },

    // 111. Rg 錀
    { z: 111, s: "Rg", n: "錀", title: "透視", title_en: "Insight", oracle_text: "肉眼不可見的真實；穿透表象的迷霧，在偶然的機遇中看見骨架。", score: 4, guide: "留意那些意外的發現。你可能會不小心看到事情的真相，或是發現某人的秘密。保持敏銳的觀察力，你的洞察力能穿透表象的迷霧，看見支撐事物的真實骨架。", science: "以倫琴命名，發現X射線。" },
    { z: 111, s: "Rg", n: "錀", title: "透視", title_en: "Insight", oracle_text: "肉眼不可見的真實；穿透表象的迷霧，在偶然的機遇中看見骨架。", score: 5, guide: "金色的光輝。錀與金同族，預測具有類似金的貴金屬性質。這是一個幸運的徵兆，象徵著財富與價值。你的透視眼將帶領你找到被埋沒的黃金機會，相信你的價值判斷。", science: "屬於1B族（銅銀金），預測為貴金屬。" },

    // 112. Cn 鎶
    { z: 112, s: "Cn", n: "鎶", title: "顛覆", title_en: "Subvert", oracle_text: "世界的中心並非你所想；改變觀看的視角，舊有的宇宙觀將在瞬間崩塌。", score: 3, guide: "適合打破常規與既定認知。如果有人告訴你以前都是這樣做的，請勇於挑戰他。換個角度看問題，你會發現原本的認知限制了你，這是一場思想的革命。", science: "以哥白尼命名（日心說）；金屬卻易揮發。" },
    { z: 112, s: "Cn", n: "鎶", title: "顛覆", title_en: "Subvert", oracle_text: "世界的中心並非你所想；改變觀看的視角，舊有的宇宙觀將在瞬間崩塌。", score: 2, guide: "流動的危機。鎶是易揮發的金屬，難以捕捉。你可能會感到手中的資源或承諾正在流失，或者是人心浮動。面對這種抓不住的狀況，不要強求控制，而是學習如何與「變動」共舞。", science: "性質類似汞，是易揮發的液態金屬（預測）。" },

    // 113. Nh 鉨
    { z: 113, s: "Nh", n: "鉨", title: "毅力", title_en: "Grit", oracle_text: "機率是給堅持者的禮物；在數萬億次的失敗撞擊中，等待那唯一的成功訊號。", score: 3, guide: "關鍵在於死纏爛打的毅力。這件事可能很難，成功率極低，但只要你堅持得夠久，奇蹟就會發生。像科學家守候多年一樣，絕對不要放棄，成功屬於最頑強的人。", science: "亞洲第一元素，日本理研耗時9年發現。" },
    { z: 113, s: "Nh", n: "鉨", title: "毅力", title_en: "Grit", oracle_text: "機率是給堅持者的禮物；在數萬億次的失敗撞擊中，等待那唯一的成功訊號。", score: 4, guide: "東方的曙光。鉨是第一個由亞洲國家發現的元素。這象徵著新的勢力或觀點正在崛起。如果你身處非主流或新興的領域，這是一個好兆頭，自信地展現你的文化或特色吧。", science: "Nihonium源自日本國名Nihon。" },

    // 114. Fl 鈇
    { z: 114, s: "Fl", n: "鈇", title: "孤島", title_en: "Island", oracle_text: "在毀滅的海洋中尋找平靜；相信混亂之中，存在著一個穩定不變的奇蹟之地。", score: 5, guide: "在忙亂、焦慮的環境中，尋找你的穩定島。這可能是一個人、一個地點或一段音樂。只要待在那裡，你就能在周遭的衰變與混亂中，保持安穩與長久。", science: "位於「穩定島」中心，壽命預測較長。" },
    { z: 114, s: "Fl", n: "鈇", title: "孤島", title_en: "Island", oracle_text: "在毀滅的海洋中尋找平靜；相信混亂之中，存在著一個穩定不變的奇蹟之地。", score: 2, guide: "冷漠的保護色。鈇預測具有惰性氣體的性質，不願與人反應。你可能為了保護自己而表現得太過冷漠，導致錯失了連結的機會。孤島雖然安全，但也孤獨，適度開放港口吧。", science: "受相對論效應影響，性質可能類似惰性氣體。" },

    // 115. Mc 鏌
    { z: 115, s: "Mc", n: "鏌", title: "謎團", title_en: "Enigma", oracle_text: "科學與傳說的交界；未被證實的力量，往往被視為來自外星的科技。", score: 2, guide: "會遇到一些無法解釋的事，可能是巧合，也可能是神秘的直覺，讓你感到困惑或無法掌握。不要急著用邏輯去分析，保持一點神秘感與敬畏，接受有些事情目前就是沒有答案。", science: "與UFO傳聞（元素115）有關。" },
    { z: 115, s: "Mc", n: "鏌", title: "謎團", title_en: "Enigma", oracle_text: "科學與傳說的交界；未被證實的力量，往往被視為來自外星的科技。", score: 4, guide: "跨越維度的思考。雖然115元素作為燃料只是傳說，但它象徵著超越現有科技的想像力。今天適合進行天馬行空的發想，那些看似瘋狂的點子，說不定就是未來的黑科技。", science: "大眾文化中常被描繪為反重力引擎燃料。" },

    // 116. Lv 鉝
    { z: 116, s: "Lv", n: "鉝", title: "協作", title_en: "Teamwork", oracle_text: "跨越海洋的握手；巨大的成就無法獨自完成，連結彼此的智慧才能創新元素。", score: 3, guide: "任務艱鉅，不可能一個人完成。你需要跨界合作，找不同領域、甚至是你原本不熟的人一起幫忙。連結彼此的資源與智慧，1加1的力量絕對大於2。", science: "美俄實驗室跨國合作發現。" },
    { z: 116, s: "Lv", n: "鉝", title: "協作", title_en: "Teamwork", oracle_text: "跨越海洋的握手；巨大的成就無法獨自完成，連結彼此的智慧才能創新元素。", score: 4, guide: "以地名為榮。鉝是以實驗室所在地（Livermore）命名。這提醒你重視你的根源與團隊基地。無論你的成就有多高，別忘了是哪個環境滋養了你。回饋鄉里或團隊，會為你帶來好運。", science: "以勞倫斯利福摩爾國家實驗室命名。" },

    // 117. Ts 鿬
    { z: 117, s: "Ts", n: "鿬", title: "邊界", title_en: "Boundary", oracle_text: "身分在邊緣變得模糊；既是這個家族的一員，卻又展現出截然不同的叛逆面貌。", score: 2, guide: "處於一個模糊地帶，定位不清。可能搞不清楚自己的職責、角色或關係界線。這讓你有點困惑與不安全感，但也給了你自由定義自己的機會，不要急著被舊標籤定義。", science: "鹵素家族成員，但性質可能像金屬。" },
    { z: 117, s: "Ts", n: "鿬", title: "邊界", title_en: "Boundary", oracle_text: "身分在邊緣變得模糊；既是這個家族的一員，卻又展現出截然不同的叛逆面貌。", score: 3, guide: "為了大局的合作。鿬的發現也是跨國合作的成果（田納西州）。這張牌建議你放下門戶之見，為了更大的目標，與競爭對手或不同背景的人攜手。邊界的模糊，正是融合的開始。", science: "以田納西州命名，紀念其在核物理的貢獻。" },

    // 118. Og 鿫
    { z: 118, s: "Og", n: "鿫", title: "圓滿", title_en: "Completion", oracle_text: "週期表的終章；填滿最後一個電子，達成完美的穩定，也是下一個維度的起點。", score: 5, guide: "事情到了大結局。無論是專案結案、學期結束還是關係的了斷，這是一個圓滿且完美的句點。整理好心情，享受這份完成的充實感，準備迎接新篇章。", science: "目前週期表最後一個元素，填滿第7週期。" },
    { z: 118, s: "Og", n: "鿫", title: "圓滿", title_en: "Completion", oracle_text: "週期表的終章；填滿最後一個電子，達成完美的穩定，也是下一個維度的起點。", score: 3, guide: "打破規則的氣體。鿫雖然是惰性氣體家族，但理論上它可能是固體半導體。這告訴你，即使到了最後階段，也不要被既有的框架限制。你以為的終點（氣體），可能展現出截然不同的型態（固體）。", science: "雖為8A族，但因相對論效應，預測其室溫下為固體。" }
];



