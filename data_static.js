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

// ========== [每日運勢資料庫：包含神諭文字] ==========
const ELEMENT_FORTUNES = [
    { z: 1, s: "H", n: "氫", title: "起源", title_en: "Genesis", oracle_text: "萬物皆始於單純的一；最簡單的結構，往往蘊含著驅動恆星的無限能量。", score: 5, guide: "你正處於一個絕對的起點，身上沒有過去的包袱，如同宇宙初開般純粹。這股能量適合用來啟動任何全新的計畫，或是一個猶豫已久的改變。" },
    { z: 2, s: "He", n: "氦", title: "獨行者", title_en: "The Loner", oracle_text: "真正的自由，是雖然身處人群，卻能保持完整的自我，不隨世俗起舞。", score: 3, guide: "保持適度的抽離與高冷，是你此刻最需要的智慧。當周遭充滿喧囂與盲從時，不必勉強融入。像氣球抗拒地心引力般，讓心靈輕輕飄浮在煩惱之上。" },
    { z: 3, s: "Li", n: "鋰", title: "電池", title_en: "Battery", oracle_text: "能量需要載體，情緒需要出口；懂得適時充電與釋放，才能走得長遠。", score: 4, guide: "此刻的效率極高，思緒運轉乾淨俐落，正如一顆充飽電的電池。這是衝刺目標的最佳時機，但請謹記，能量輸出的目的是為了達成目標，而非耗盡自我。" },
    { z: 4, s: "Be", n: "鈹", title: "綠寶石", title_en: "Emerald", oracle_text: "珍貴的事物往往帶點刺；保持獨特的原則，即便在群體中，也不必跟隨他人。", score: 3, guide: "若你感到與周遭環境格格不入，那是因為你擁有獨特的本質。堅持你的原則與審美，不需要為了合群而磨平自己的稜角。" },
    { z: 5, s: "B", n: "硼", title: "特異", title_en: "Uniqueness", oracle_text: "完美的標準不只有一種；有時候，容許自己的缺憾存在，反而能創新連結。", score: 3, guide: "不必強迫自己符合世俗眼中的完美標準。你此刻感到的某些不足或缺口，其實是連結他人的契機。正因為不完整，才讓你不得不向外尋求協作。" },
    { z: 6, s: "C", n: "碳", title: "萬變", title_en: "Change", oracle_text: "價值取決於你的排列方式；在壓力之下，柔軟的黑炭也能轉化為堅不可摧的鑽石。", score: 3, guide: "彈性與角色切換是此刻的生存之道。面對高壓的環境，你需要展現鑽石般的堅毅；而在需要協調的場合，則需像石墨般身段柔軟。" },
    { z: 7, s: "N", n: "氮", title: "雙面刃", title_en: "Double Edge", oracle_text: "沈默不代表軟弱；最平靜的空氣中，往往壓縮著足以撼動大地的爆發力。", score: 5, guide: "你擁有深藏不露的實力。外表的平靜隨和並非弱軟，而是內在底氣的展現。不需要大聲嚷嚷來證明什麼，只要時機成熟，你隨時能展現出驚人的爆發力。" },
    { z: 8, s: "O", n: "氧", title: "點火", title_en: "Ignition", oracle_text: "生命是一場不斷的交換；想要發光發熱，就必須擁抱那股讓事物劇烈改變的熱情。", score: 5, guide: "你的熱情具有強大的傳染力，如同助燃劑般能點燃周遭死氣沈沈的氛圍。此刻非常適合推動停滯的計畫，或是大膽表達情感。" },
    { z: 9, s: "F", n: "氟", title: "掠奪者", title_en: "Predator", oracle_text: "渴望是一種無法停止的反應；當你對目標的執著強烈到極致，世界將不得不回應。", score: 2, guide: "強烈的渴望能驅動成就，但也可能演變為具破壞性的執著。檢視你當下的慾望是否過於熾熱，太過強勢的掠奪姿態雖然能短期獲利，卻可能腐蝕珍貴的關係。" },
    { z: 10, s: "Ne", n: "氖", title: "霓虹", title_en: "Neon", oracle_text: "你不必改變本質去迎合他人；只需在黑暗中通電，展現你原本的顏色，就能成為指引。", score: 4, guide: "做自己就是最強大的吸引力。你不必刻意模仿他人的模樣，只要在適當的舞台上展現本質，那份自信就像夜裡的招牌一樣引人注目。" },
    { z: 11, s: "Na", n: "鈉", title: "躁動", title_en: "Restless", oracle_text: "過度的活躍源自內在的不安；柔軟的身段下，藏著一顆遇水即爆的激烈之心。", score: 2, guide: "內在的情緒如同一瓶未加蓋的汽水，些微的晃動都可能引發噴湧。這股躁動若未經疏導，極易化為衝動的言語。此刻最需要的是暫緩反應。" },
    { z: 12, s: "Mg", n: "鎂", title: "閃耀", title_en: "Flash", oracle_text: "燃燒是為了那一瞬間的永恆；即使是平凡的灰燼，也曾有過令人無法直視的輝煌。", score: 4, guide: "這是展現自我的絕佳時刻。無論是才華、觀點或成果，都值得被看見。雖然高強度的表現可能會帶來一時的耗損，但那一瞬間綻放的光芒，將會在他人心中留下不可磨滅的印象。" },
    { z: 13, s: "Al", n: "鋁", title: "雙面適者", title_en: "The Adapter", oracle_text: "強大的適應力，是既能包容酸的尖銳，也能接納鹼的滑膩，並為自己穿上保護色。", score: 3, guide: "面對複雜多變的環境，你需要如水般的適應力。無論面對尖銳的批評或是圓滑的恭維，都能應對自如。建立起心理的保護層，外圓內方。" },
    { z: 14, s: "Si", n: "矽", title: "邏輯", title_en: "Logic", oracle_text: "情感或許溫暖，但唯有冷靜的運算與邏輯，才能建構出支撐現代世界的基石。", score: 3, guide: "將豐沛的情感暫時收起，此刻是理性運算的時刻。混亂的局面需要清晰的邏輯來梳理，按部就班地處理眼前的數據與細節。" },
    { z: 15, s: "P", n: "磷", title: "火種", title_en: "Spark", oracle_text: "能量有兩種型態：一是隱忍待發的沈穩，一是接觸空氣即燃的瘋狂。", score: 3, guide: "你體內蘊藏著巨大的潛在能量，只差一個摩擦就會點燃。這是一股中性的力量，既可以用來啟動希望的燭光，也可能因一時失控而引發毀滅的野火。" },
    { z: 16, s: "S", n: "硫", title: "煉金", title_en: "Alchemy", oracle_text: "有些成長必然伴隨著難聞的氣味與高壓；這是為了讓原本軟弱的本質，轉化為堅韌。", score: 3, guide: "那些讓你感到不適的壓力或難聞的處境，其實是一場必要的轉化儀式。如同生橡膠經過硫化才能變得強韌，這些磨練是為了去除你性格中的軟弱。" },
    { z: 17, s: "Cl", n: "氯", title: "淨化", title_en: "Purify", oracle_text: "為了維持純淨，有時必須扮演無情的角色；清除雜質的過程，往往帶有刺鼻的代價。", score: 5, guide: "這是一個煥然一新的時刻，適合進行徹底的清理。無論是環境的髒亂，還是消耗心神的有毒關係，都應果斷斬除。" },
    { z: 18, s: "Ar", n: "氬", title: "隱盾", title_en: "Hidden Shield", oracle_text: "不做任何反應，有時是最高級的保護；在熾熱的火花與高壓下，沈默是防止崩潰的盾牌。", score: 2, guide: "當外界充滿雜音與爭端時，不反應並非冷漠，而是最高級的智慧。與其捲入無謂的紛爭，不如啟動隱形護盾，對紛擾保持沈默與距離。" },
    { z: 19, s: "K", n: "鉀", title: "律動", title_en: "Rhythm", oracle_text: "生命在於流動；過度的停滯會導致枯萎，唯有順暢的傳遞，才能維持身心的平衡。", score: 3, guide: "流動是平衡的關鍵。若感到卡頓或焦慮，試著讓身體動起來，促進內在的循環。在溝通與情感上亦然，不要讓話語淤積在心底。" },
    { z: 20, s: "Ca", n: "鈣", title: "骨架", title_en: "Skeleton", oracle_text: "偉大的成就不是瞬間的火花，而是日復一日的沈澱；堅硬的骨架，源自對微小單位的堅持。", score: 3, guide: "此刻沒有捷徑，只有紮實的積累。無論是學習技能、鍛鍊身體還是儲蓄，這些看似枯燥重複的微小努力，正在一磚一瓦地建構你未來的骨架。" },
    { z: 21, s: "Sc", n: "鈧", title: "先鋒", title_en: "Pioneer", oracle_text: "萬事起頭難，但輕盈的開始是成功的關鍵；作為新時代的序幕，勇於踏入未知的領域。", score: 3, guide: "此刻是開啟新計畫的絕佳時機。你就像踏入未知領域的先行者，雖然知名度可能不高，但你的行動具有指標性意義。保持心情與腳步的輕盈，不要給自己太沈重的負擔。" },
    { z: 22, s: "Ti", n: "鈦", title: "不屈", title_en: "Unyielding", oracle_text: "真正的強大不是去攻擊，而是無論外界環境如何酸蝕，內在依然潔白無瑕，毫髮無傷。", score: 4, guide: "你的抗壓性極強。面對他人的批評、酸言酸語或惡劣的環境，你都能免疫。這份強大的自信與心理素質，讓你顯得格外堅毅且不可動搖。" },
    { z: 23, s: "V", n: "釩", title: "多變", title_en: "Variety", oracle_text: "生命不該只有一種顏色；隨著環境改變自己的狀態，是為了展現出更多層次的美麗。", score: 3, guide: "情緒或角色的轉換像變色龍一樣豐富。早上可能鬱悶，下午變得陽光。不要排斥這種變化，善用你多樣的面貌來應對不同的人。" },
    { z: 24, s: "Cr", n: "鉻", title: "不朽", title_en: "Stainless", oracle_text: "光鮮亮麗的外表下，是一層拒絕被腐蝕的堅定；自我保護，是為了讓光芒能夠永恆。", score: 4, guide: "展現你最完美、最自信的一面。你擁有一種不沾鍋的能力，外在的髒污或負面情緒無法附著在你身上。保持自信，維持你的形象。" },
    { z: 25, s: "Mn", n: "錳", title: "極端", title_en: "Extreme", oracle_text: "溫和並不能解決所有問題；有時你需要展現最強烈的氧化力量，才能徹底清除頑固的雜質。", score: 2, guide: "做事乾淨俐落。對於拖泥帶水的事情或壞習慣，適合展現出強勢的態度去解決。雖然你的手段可能有點激烈，但這能有效地釐清混亂的局面。" },
    { z: 26, s: "Fe", n: "鐵", title: "戰士", title_en: "Warrior", oracle_text: "意志如鋼鐵般堅硬，但切記，若缺乏保護與關愛，最強壯的盔甲也抵擋不住歲月的鏽蝕。", score: 3, guide: "這是一場持久戰，需要展現出鋼鐵般的紀律與意志力。但也請注意，不要讓自己太過疲勞或心冷，否則內心容易生鏽感到倦怠。" },
    { z: 27, s: "Co", n: "鈷", title: "感知", title_en: "Sense", oracle_text: "內心的乾燥與滋潤，都會誠實地顯化在臉上；保持敏銳的感知，那是你識別環境的獨特天賦。", score: 3, guide: "你像一張靈敏的試紙，對周遭的氣氛非常敏感。如果環境讓你感到溫暖就盡情享受，如果感到冷漠就回到自己的空間。" },
    { z: 28, s: "Ni", n: "鎳", title: "推手", title_en: "The Mover", oracle_text: "真正的推手不一定站在舞台中央；默默地加事情的發展，促成改變卻不改變初衷。", score: 3, guide: "你不需要當主角，適合扮演幕後推手的角色。你的建議或行動能讓卡住的事情順利推進。這種促成好事發生的成就感，會比自己站在台前更有價值且長久。" },
    { z: 29, s: "Cu", n: "銅", title: "導體", title_en: "Conductor", oracle_text: "溫暖需要傳遞，訊息需要溝通；敞開你的心胸，成為那條連結人與人之間的高效導線。", score: 4, guide: "人際運勢極佳。你就像銅線一樣，溝通順暢無阻。適合聯繫朋友、談判或建立新的關係。你散發出的熱情與親和力，能有效地將你的想法傳遞給對方。" },
    { z: 30, s: "Zn", n: "鋅", title: "守護者", title_en: "The Guardian", oracle_text: "愛有時意味著犧牲；為了守護更核心的價值，願意挺身而出，擋在鏽蝕與傷害的最前線。", score: 3, guide: "你可能會為了團隊或家人，做出一點犧牲或讓步。別覺得委屈，因為你的付出成功保護了對你而言很重要的人事物。" },
    { z: 31, s: "Ga", n: "鎵", title: "溫柔", title_en: "Tenderness", oracle_text: "最強的武器不是堅硬，而是溫度；只需一點點掌心的暖意，就能化解冰冷的防線。", score: 4, guide: "遇到僵局時，不要硬碰硬。試著用溫柔的態度去處理，展現你的誠意與溫度。你會發現原本頑固的人或事，會瞬間軟化下來。" },
    { z: 32, s: "Ge", n: "鍺", title: "奠基", title_en: "Foundation", oracle_text: "榮耀或許屬於後繼者，但歷史會記住開創者；在矽谷亮起之前，是我先點燃了電子的火花。", score: 3, guide: "你扮演著開路先鋒或墊腳石的角色。雖然你的努力可能不會馬上被看見，或者最後的榮耀被別人拿走，但請記得，沒有你的鋪路，後面的事都不會發生。" },
    { z: 33, s: "As", n: "砷", title: "摻雜", title_en: "Doping", oracle_text: "純潔往往意味著絕緣；唯有容納異質的存在，才能激發出改變世界的導電潛能。", score: 4, guide: "適合打破常規，進行混搭。不要害怕在原本規律的生活中加入一點異質元素，例如嘗試新風格或接受新觀點。" },
    { z: 34, s: "Se", n: "硒", title: "逐光者", title_en: "The Seeker", oracle_text: "才華需要舞台；在黑暗中我保持沈默絕緣，唯有光芒灑落時，我才開始導電運作。", score: 4, guide: "你是那種遇強則強、需要關注的類型。如果有機會站上舞台或被聚光燈照耀，你的表現會判若兩人，效率極高。" },
    { z: 35, s: "Br", n: "溴", title: "揮發", title_en: "Volatility", oracle_text: "情緒像紅色的液體般流動；不要試圖將其密封，適度的宣洩是為了避免壓力炸裂。", score: 2, guide: "情緒起伏較大，很容易受到環境刺激而波動。如果感到焦躁或生氣，不要強行壓抑，找個健康的方式宣洩出來。" },
    { z: 36, s: "Kr", n: "氪", title: "隱士", title_en: "The Hermit", oracle_text: "真正的力量懂得隱藏；將巨大的能量壓縮在無形的外表下，只為那一瞬間的耀眼爆發。", score: 3, guide: "適合保持低調，修煉內功。這不是因為你弱，而是因為你在蓄力。當關鍵時刻來臨，你會像高強度的閃光燈一樣，瞬間爆發出令人驚豔的成果。" },
    { z: 37, s: "Rb", n: "銣", title: "準時", title_en: "Punctuality", oracle_text: "追求分秒不差的極致；在極度活躍的本性中，尋求宇宙間最穩定的律動。", score: 3, guide: "關鍵是節奏與準時。你的能量非常強大且活躍，如果沒有好的規劃，可能會變成混亂。按表操課、精準控制時間，你會發現事情進展得比預期還順利。" },
    { z: 38, s: "Sr", n: "鍶", title: "花火", title_en: "Fireworks", oracle_text: "存在的意義是為了提醒當下的美好；盡情燃燒你的色彩，哪怕只有一瞬間，也要染紅夜空。", score: 4, guide: "生活需要儀式感。不要過得太嚴肅，適合做一些讓自己開心、慶祝的事情。去展現你的熱情與色彩，吸引大家的目光。" },
    { z: 39, s: "Y", n: "釔", title: "零阻力", title_en: "Zero Resistance", oracle_text: "當內在的抗拒降至冰點，溝通將不再有損耗；尋找那個讓你能無礙流動的頻率。", score: 5, guide: "溝通運勢極佳，如同超導體般零阻力。你跟別人的頻率很對，想法能瞬間傳達給對方。適合進行談判、告白或團隊合作。" },
    { z: 40, s: "Zr", n: "鋯", title: "仿真", title_en: "Simulation", oracle_text: "價值在於本質而非出身；即使被視為替代品，只要夠堅硬璀璨，亦能證明自我的存在。", score: 3, guide: "可能會面臨比較或被質疑的課題。也許你會覺得自己不如別人昂貴或正統，但請記得，你擁有極強的抗壓性與實用價值。" },
    { z: 41, s: "Nb", n: "鈮", title: "假面", title_en: "Mask", oracle_text: "外表是為了保護內在而生；透過電壓的轉化，你可以自由決定向世界呈現什麼顏色的假面。", score: 4, guide: "適合稍微修飾與裝扮的時刻。這並非虛偽，而是一種適應環境的智慧與保護色。展現你多變且獨特的一面，讓外在形象成為你與世界溝通的橋樑。" },
    { z: 42, s: "Mo", n: "鉬", title: "調停者", title_en: "Mediator", oracle_text: "衝突往往來自於乾澀的堅持；柔軟的身段能減少耗損，讓巨大的機制在極端壓力下運轉。", score: 3, guide: "你可能處於夾心餅乾的位置，需要協調兩邊的意見。保持圓融，成為團隊中的潤滑劑。雖然自己沒有發光發熱，但因為你的存在，讓原本卡住的機制得以順利運作。" },
    { z: 43, s: "Tc", n: "鎝", title: "顯影", title_en: "Reveal", oracle_text: "肉眼看不見的病灶，需要特殊的視角；短暫地進入深處，是為了揭露那些被隱藏的真實。", score: 4, guide: "你的洞察力極強，適合進行診斷與檢視。無論是身體健康、專案進度還是人際關係的癥結點，都能看透問題的核心。" },
    { z: 44, s: "Ru", n: "釕", title: "輔佐", title_en: "Support", oracle_text: "偉大不需要獨佔舞台；只要微量的介入，就能讓原本脆弱的貴金屬，擁有堅不可摧的硬度。", score: 3, guide: "此刻不需要爭當主角，適合扮演關鍵少數的配角。你的加入會讓整個團隊或計畫變得更完美、更強韌。" },
    { z: 45, s: "Rh", n: "銠", title: "天價", title_en: "Priceless", oracle_text: "稀缺就了地位；像一面永不氧化的鏡子，誠實地反射世界，也反射出你高不可攀的價值。", score: 5, guide: "你的價值無可估量，千萬不要看輕自己。面對他人的請求，如果覺得廉價或不合理，請勇敢拒絕。保持你的高冷與身價，榮耀自然會降臨。" },
    { z: 46, s: "Pd", n: "鈀", title: "包容", title_en: "Tolerance", oracle_text: "智慧是種巨大的容量；像海綿一樣渴望著，將外界流動的能量與知識，全數吸納入心。", score: 4, guide: "你的狀態像一塊乾燥的海綿，學習力與包容力極強。非常適合閱讀、上課或傾聽他人的想法。敞開你的心胸去吸收，你會獲得意想不到的養分。" },
    { z: 47, s: "Ag", n: "銀", title: "直覺", title_en: "Intuition", oracle_text: "直覺是宇宙間最快的電流；當靈感降臨時，不要遲疑，以零時差的度將其落實。", score: 5, guide: "你的直覺敏銳到不可思議，反應度也極快。如果有什麼突如其來的靈感像電流通過，請立刻行動或記錄下來。" },
    { z: 48, s: "Cd", n: "鎘", title: "克制", title_en: "Restraint", oracle_text: "鮮豔的色彩往往伴隨著危險；在能量失控的邊緣，唯有強大的吸收力能踩下煞車。", score: 4, guide: "你是局勢中的節奏大師。當周遭陷入混亂或情緒激動時，只有你能優雅地掌控全局。適時踩下煞車，防止事情衝過頭。" },
    { z: 49, s: "In", n: "銦", title: "觸感", title_en: "Touch", oracle_text: "溝通不需言語，指尖的輕觸即是連結；柔軟並非軟弱，而是為了能敏銳地感知世界的溫度。", score: 3, guide: "重點在於連結與感應。透過你的指尖去感知世界，保持身段的柔軟。如果你感到壓力，適度地發出聲音表達痛苦是健康的釋放。" },
    { z: 50, s: "Sn", n: "錫", title: "封存", title_en: "Sealed", oracle_text: "文明的延續仰賴對滋味的守護；無論外在如何變遷，將最美好的本質密封，靜待開啟。", score: 3, guide: "適合保存美好的事物，無論是整理回憶、儲蓄還是享受美食。但也請注意環境的溫度變化，若感到人際關係變冷，要小心內心的熱情粉碎。" },
    { z: 51, s: "Sb", n: "銻", title: "阻燃", title_en: "Resist", oracle_text: "冷靜是最好的防護；在烈火蔓延之前，先築起一道不可燃燒的防線，隔絕毀滅的高溫。", score: 5, guide: "你的冷靜就是最強的氣場。無論發生什麼爭端或混亂，你都能泰然處之，不隨之起舞。這種穩如泰山的特質，能有效地防止災難擴大。" },
    { z: 52, s: "Te", n: "碲", title: "接地", title_en: "Grounding", oracle_text: "力量源自於腳下的土地；不需在意他人的排斥，將光芒轉化為能量，扎根於現實之中。", score: 3, guide: "適合腳踏實地。也許你會覺得自己有點邊緣，或者不被大眾理解，但沒關係。專注於你的工作與現實生活，像大地一樣穩重，吸收外界的資源轉化為自己的能量。" },
    { z: 53, s: "I", n: "碘", title: "昇華", title_en: "Sublimation", oracle_text: "刺痛是癒合的開始；不必經歷泥濘的拉扯，你可以選擇直接昇華，將傷口轉化為智慧。", score: 5, guide: "自我療癒的最佳時機。如果心裡有受傷的感覺，不要忽視它，給自己一點溫柔的呵護。你擁有跳躍式成長的能力，省略掉那些拖泥帶水的過程，直接從傷痛中提煉出高貴的智慧與紫色光芒。" },
    { z: 54, s: "Xe", n: "氙", title: "異客", title_en: "Stranger", oracle_text: "擁抱未知的訪客；在沈重的壓力之下，即使是高冷的靈魂，也能與世界產生前所未有的連結。", score: 3, guide: "對於新事物或陌生的訪客保持開放態度。不要抗拒未知，那可能是帶你前往新世界的推進器。如果感到疲憊，給自己一個高品質的深層休息是必要的。" },
    { z: 55, s: "Cs", n: "銫", title: "標準", title_en: "Standard", oracle_text: "定義時間，是為了掌握節奏；在極度活躍的熱情中，建立起宇宙間分秒不差的秩序。", score: 3, guide: "你是規則的制定者，或者是眾人的標準。大家都在看你的動作行事。保持守時、精準，將你充沛的能量導入規律之中，掌握節奏就能掌握全局。" },
    { z: 56, s: "Ba", n: "鋇", title: "對比", title_en: "Contrast", oracle_text: "有些真相無法直接看見；吞下沈重的試煉，是為了讓內在的曲折，在光線下清晰顯現。", score: 3, guide: "誠實面對內在的時刻。無論是檢視身體狀況還是心理感受，不要逃避。雖然揭露真相的過程可能有點沈重，但這能幫你找出長久以來的隱患。" },
    { z: 57, s: "La", n: "鑭", title: "潛藏", title_en: "Conceal", oracle_text: "真相往往躲在相似的面孔之後；不要急著定義，先學會與混沌共存。", score: 4, guide: "適合玩尋寶遊戲。好運藏在不起眼的地方，或者在某個看似普通的人身上。保持好奇心，不要被表象迷惑，你會挖掘出意想不到的驚喜。" },
    { z: 58, s: "Ce", n: "鈰", title: "起火", title_en: "Kindling", oracle_text: "巨大的熱情源自微小的摩擦；只要輕輕一劃，平凡的石頭也能迸出火花。", score: 3, guide: "你是環境中的點火者。不需要做什麼驚天動地的大事，只要講個笑話、提個小建議，就能像打火石一樣，瞬間點燃團隊的氣氛或靈感。" },
    { z: 59, s: "Pr", n: "鐠", title: "雙生", title_en: "Twin", oracle_text: "你並非獨自一人；在茫茫人海中，總有個與你頻率相同的靈魂，正等待被辨識。", score: 3, guide: "適合尋找合作夥伴。單打獨鬥比較累，試著找一個跟你想法互補的人，你們合體的力量會比一個人強大得多。" },
    { z: 60, s: "Nd", n: "釹", title: "磁力", title_en: "Magnetism", oracle_text: "吸引力不需要言語；當內在頻率調對了，世界自然會向你靠近。", score: 4, guide: "氣場很強，自帶吸力。你不需要刻意去追求什麼，只要專注做好自己的事，調整好內在的頻率，機會、資源或桃花自然會被你吸引過來。" },
    { z: 61, s: "Pm", n: "鉕", title: "曇花", title_en: "Ephemeral", oracle_text: "人的光芒雖然短暫，卻證明了存在的可能；在此刻燃燒殆盡，好過從未發光。", score: 3, guide: "機會稍縱即逝，如同流星劃過天際。如果有一個突如其來的點子、靈感或邀約，請立刻把握，因為它可能很不穩定，錯過這個瞬間就不復存在。" },
    { z: 62, s: "Sm", n: "釤", title: "過濾", title_en: "Filter", oracle_text: "並非所有能量都該被接收；學會阻擋那些無用的雜訊，你的核心才會純淨。", score: 2, guide: "環境中的雜訊過多，可能是八卦、抱怨或無效資訊。你需要開啟過濾模式，只聽重點，堅決過濾掉那些會干擾你情緒的雜音。" },
    { z: 63, s: "Eu", n: "銪", title: "繽紛", title_en: "Colorful", oracle_text: "快樂是受到激發的本能；就像被點亮的螢光，不必害羞，盡情展現你內在的色彩。", score: 4, guide: "這是一個充滿快樂與色彩的時刻。像孩子一樣保持單純的心，穿著鮮豔一點，或者做些娛樂自己的事。你的環境需要一點輕鬆的氣氛。" },
    { z: 64, s: "Gd", n: "釓", title: "共振", title_en: "Resonance", oracle_text: "冷靜下來，才能看清內在的紋理；透過磁場的共鳴，讓隱藏的訊號浮現。", score: 3, guide: "此刻需要深度的溝通與洞察。不要只看表面的話語，去感應對方言下之意。當你冷靜下來調整頻率，就能透過深層的共鳴看清事情的真相。" },
    { z: 65, s: "Tb", n: "鋱", title: "信號", title_en: "Signal", oracle_text: "綠燈已亮，前路暢通；信任這個清晰的訊號，現在是執行的最佳時刻。", score: 5, guide: "環境已經為你開了綠燈。如果你之前在猶豫要不要做某件事，這張牌是一個明確的行動訊號。局勢對你有利，信任你的直覺，順著趨勢前進。" },
    { z: 66, s: "Dy", n: "鏑", title: "難解", title_en: "Elusive", oracle_text: "越是難以定義的事物，越有探索的價值；不要急著尋求簡單的答案，享受解謎的過程。", score: 4, guide: "越難解的謎題，獎勵越豐厚。如果遇到看不懂的狀況或棘手的人，別急著焦慮，這代表你正在接觸高層次的智慧。" },
    { z: 67, s: "Ho", n: "鈥", title: "聚焦", title_en: "Focus", oracle_text: "將能量集中於極小的一點；唯有極致的專注，才能精準地切除陳舊的病灶。", score: 3, guide: "注意力需要高度集中。不要試圖多工處理，一次只做一件事。像雷射一樣，把所有能量聚焦在最重要的那個點上，你能精準地解決問題。" },
    { z: 68, s: "Er", n: "鉺", title: "增幅", title_en: "Amplify", oracle_text: "微弱的聲音也值得被聽見；成為那個放大器，讓遠方的訊號依然清晰如初。", score: 3, guide: "適合擔任傳聲筒或推廣者的角色。如果你覺得某個點子很好但聲音太小，幫它一把，把優點放大出去。你的助力會讓訊息傳得更遠。" },
    { z: 69, s: "Tm", n: "銩", title: "微光", title_en: "Glimmer", oracle_text: "稀有的事物往往發著微弱的光；雖然不刺眼，卻能穿透最深層的黑暗。", score: 3, guide: "在迷惘或困惑中，請留意那些不起眼的希望。它可能不是大張旗鼓的幫助，而是一句輕聲的問候或一個小小的線索。抓住那道微光，它擁有穿透黑暗的力量。" },
    { z: 70, s: "Yb", n: "鐿", title: "抗壓", title_en: "Stress", oracle_text: "壓力是種物理訊號；感知環境的變化，適度的阻力反而能校準你的精準度。", score: 3, guide: "環境可能會給你一點壓力測試。這不是要壓垮你，而是像校正時鐘一樣，來確認你的狀態是否精準。保持彈性與感知力。" },
    { z: 71, s: "Lu", n: "鎦", title: "精煉", title_en: "Refine", oracle_text: "分離是為了更純粹的重組；作為最後的試煉，裂解舊有的鍵結，催化出全新的未來。", score: 3, guide: "適合去蕪存菁的時刻。無論是優化工作流程還是整理房間，把多餘的、老舊的結構打散，只留下最有用的部分。" },
    { z: 72, s: "Hf", n: "鉿", title: "影子", title_en: "Shadow", oracle_text: "強者背後總有共生者；隱藏在閃耀的鋯石背後，吸收混亂是為了維持大局的穩定。", score: 3, guide: "適合當個沈穩的配角或傾聽者。你不需要站在舞台中央，試著像影子一樣，吸收周遭的負能量或躁動。你的冷靜存在，是讓混亂場面安定下來的關鍵力量。" },
    { z: 73, s: "Ta", n: "鉭", title: "渴望", title_en: "Desire", oracle_text: "無論外在環境如何侵蝕，內在始終完好無損；將巨大的能量儲存在小小的空間裡，蓄勢待發。", score: 3, guide: "你內心可能有一種強烈的渴望或不滿足感。把這股感覺轉化為動力，像一顆充飽電的電容，外表平靜，但內在潛力驚人。" },
    { z: 74, s: "W", n: "鎢", title: "堅毅", title_en: "Tenacity", oracle_text: "原則是不可被融化的；唯有耐得住最高溫的考驗，才能在真空中發出最亮的光。", score: 3, guide: "面對壓力或困難，請展現出驚人的抗壓性。就像鎢絲一樣，環境的溫度與壓力越大，你反而表現得更亮眼。堅持你的立場與原則，絕對不要輕易妥協。" },
    { z: 75, s: "Re", n: "錸", title: "壓軸", title_en: "Finale", oracle_text: "最後登場的往往是關鍵；唯有極限的高溫，才能啟動噴射引擎，推動夢想起飛。", score: 4, guide: "你是壓軸的角色。也許前面的過程很漫長，但最後的關鍵一擊將由你完成。就像噴射引擎一樣，現在正是動力全開、推動計畫起飛的最佳時刻。" },
    { z: 76, s: "Os", n: "鋨", title: "份量", title_en: "Weight", oracle_text: "存在感不在於體積大小，而在於密度；小小一塊，就足以承載歷史的重量。", score: 3, guide: "你的言語或決定極具份量，大家都會認真對待。請謹言慎行，適合進行書寫、簽約或紀錄。你此刻所做下的決定，會像刻在石頭上一樣，難以磨滅。" },
    { z: 77, s: "Ir", n: "銥", title: "倖存者", title_en: "Survivor", oracle_text: "毀滅是重生的序曲；當巨大的衝擊來襲，唯有最強的抗性，能見證舊時代的終結。", score: 4, guide: "生活可能會發生一些意外的衝擊，那其實是為了打破僵局。你擁有極強的抗壓性與生存能力，保持信心，你會安然度過這場變動。" },
    { z: 78, s: "Pt", n: "鉑", title: "尊爵", title_en: "Prestige", oracle_text: "真正的貴族不需親自下場；透過在旁引導，促成他人的化學反應，卻不損耗自身分毫。", score: 4, guide: "你的價值不需要大聲嚷嚷，懂的人自然懂。適合扮演導師或媒人的角色，幫助他人達成目標。這種不介入卻能促成好事的特質，反而會提升你在大家心中的尊貴地位。" },
    { z: 79, s: "Au", n: "金", title: "永恆", title_en: "Eternity", oracle_text: "真理是不會生鏽的；真正的強大是柔軟與包容，能屈能伸，卻永遠閃耀。", score: 5, guide: "你自帶光芒，像太陽一樣自信。同時請記得，真正的強大不只是剛硬，而是像金箔一樣，擁有極大的包容力與延展性。" },
    { z: 80, s: "Hg", n: "汞", title: "善變", title_en: "The Fickle", oracle_text: "型態是為了適應容器而生；快地流動、融合、吞噬，讓人無法捉摸，也無法握緊。", score: 2, guide: "局勢流動不定，就像水銀瀉地一樣難以掌握。你的溝通能力很強，但可能缺乏定性。利用這股靈活度去適應變化，但要小心，不要因為太過圓滑而失去了自己的原則。" },
    { z: 81, s: "Tl", n: "鉈", title: "偽裝者", title_en: "The Mimic", oracle_text: "美麗的綠色嫩芽下藏著陷阱；當原本屬於你的東西開始脫落，那是為了讓你看清真實的自我。", score: 4, guide: "展現變色龍般的演技。適度的偽裝是為了更順利地達成目標，運用你的社交手腕融入任何圈子並獲得情報。若發生失去或分離，請理解那是為了汰換舊有模式。" },
    { z: 82, s: "Pb", n: "鉛", title: "終局", title_en: "The End", oracle_text: "所有的躁動終將歸於平靜；我是漫長旅途的終點，也是抵擋致命射線的最後一道盾牌。", score: 5, guide: "享受塵埃落定的安穩感。最困難的部分已經過去了，現在是收成與休息的時候。你已經打了堅不可摧的堡壘，外界的干擾無法傷害你。這是一個圓滿且安全的結尾。" },
    { z: 83, s: "Bi", n: "鉍", title: "迷宮", title_en: "The Maze", oracle_text: "秩序中藏著混亂的美感；不必迎合大眾的磁場，保持一點排斥力，走出自己獨特的螺旋。", score: 3, guide: "你的生活路徑可能像迷宮一樣複雜曲折，但請欣賞這份繁複的美麗。保持一點個性與抗磁性，不必隨波逐流去迎合大眾的吸引力，做獨特的自己最迷人。" },
    { z: 84, s: "Po", n: "釙", title: "熾熱", title_en: "Fervor", oracle_text: "愛與忠誠是一種燃燒；無需外來的火種，內在強烈的能量足以讓空氣發出幽藍的光芒。", score: 2, guide: "內心有一團火在燃燒，這股能量非常強大，能溫暖人也能灼傷人。將這份熱情用於你忠誠的目標，但要小心調節溫度，過度的自我消耗會導致毀滅。" },
    { z: 85, s: "At", n: "砈", title: "稀有", title_en: "Rarity", oracle_text: "存在本身就是奇蹟；越是珍貴的事物越是短暫，在不穩定的無常中，看見剎那的永恆。", score: 4, guide: "機會極度稀有且稍縱即逝，不要試圖去抓緊或控制。當下的相遇或靈感非常難得，出現了就趕快把握，享受那極度短暫卻珍貴的時刻。" },
    { z: 86, s: "Rn", n: "氡", title: "潛伏", title_en: "Lurk", oracle_text: "看不見的影響最為深遠；沈積在深處的氣息，若不時常通風，終將成為隱形的負擔。", score: 2, guide: "氣氛有點沈悶，注意那些看不見的隱憂或環境影響。這可能是積壓已久的情緒，或是通風不良的關係。今天適合把心事說出來，或離開封閉的環境透透氣。" },
    { z: 87, s: "Fr", n: "鍅", title: "剎那", title_en: "The Instant", oracle_text: "理論上的爆發力無限大；不在乎天長地久，只在乎那稍縱即逝的激烈與衝動。", score: 4, guide: "能量來得快、去得也快，充滿了衝動與激情。如果你想做什麼瘋狂的事，現在就是時機，因為這股熱度維持不了太久。不要思考長遠後果，專注於當下的爆發力。" },
    { z: 88, s: "Ra", n: "鐳", title: "覺醒", title_en: "Awakening", oracle_text: "真相的光芒無法被遮掩；這股力量既是解藥也是毒藥，端看你是否有足夠的智慧去駕馭。", score: 3, guide: "象徵揭露與覺醒的時刻。你手中握有強大的力量或真相，它能治癒也能毀滅。保持清醒的覺知，謹慎使用這份光芒。不要盲目崇拜力量。" },
    { z: 89, s: "Ac", n: "錒", title: "啟動", title_en: "Activate", oracle_text: "黑暗中的幽藍光芒；連鎖反應的開關已被按下，無論是否準備好，進程已經開始。", score: 3, guide: "環境中有一股力量正在強制啟動。也許是一項無法回頭的計畫，或是一個必然發生的事件。不要試圖剎車，順著這股啟動力前進，這是一個長遠變化的開端。" },
    { z: 90, s: "Th", n: "釷", title: "潛能", title_en: "Potential", oracle_text: "沈睡的巨大礦藏；雖然不如鈾那般張揚，卻擁有更安全且長遠的燃燒力量。", score: 3, guide: "你身處的環境裡藏有未開發的豐沛資源。也許是一個被低估的人才，或是一條非主流的替代路徑。不要只看眼前最熱門的選項，去挖掘那些沈睡的潛力股。" },
    { z: 91, s: "Pa", n: "鏷", title: "過渡", title_en: "Transition", oracle_text: "介於始祖與後裔之間；忍受衰變過程中的不穩定，是為了連結過去與未來的橋樑。", score: 4, guide: "你正處於通往更好地方的途中。雖然現在像是在過橋，狀態有點搖晃不穩，例如轉職期或曖昧期。把這段過渡期當作必要的中場休息，忍受暫時的焦慮。" },
    { z: 92, s: "U", n: "鈾", title: "臨界", title_en: "Critical", oracle_text: "能量密度已達極限；臨界質量一旦突破，原本的秩序將被連鎖反應徹底改寫。", score: 2, guide: "局勢一觸即發，壓力值已達紅線。你或環境就像一顆未爆彈，只要一點小火花就會引發連鎖反應，導致巨大的改變。請遠離壓力源，不要強撐。" },
    { z: 93, s: "Np", n: "錼", title: "深海", title_en: "Abyss", oracle_text: "如海王星般深邃的潛意識；地表上的波濤，其實都源自於深海裡看不見的洋流。", score: 3, guide: "影響力來自潛意識或直覺。你可能會莫名地感到快樂或憂鬱，或者夢境特別清晰。不要忽視這些感覺，那是內在深海傳來的訊號。" },
    { z: 94, s: "Pu", n: "鈽", title: "毀滅", title_en: "Destruction", oracle_text: "冥王星的判決是絕對的；為了新生的地基，必須先將舊有的結構徹底摧毀。", score: 5, guide: "恭喜，你終於可以擺脫那些不適用的舊東西了。這不是修修補補，而是徹底的結束與破壞。大膽地按下刪除鍵，無論是關係還是舊習慣，唯有徹底的毀滅，才能重生。" },
    { z: 95, s: "Am", n: "鋂", title: "警示", title_en: "Warning", oracle_text: "看不見的哨兵；在火焰尚未吞噬一切之前，先感知到煙霧的氣息。", score: 4, guide: "你的直覺準得可怕，是守護大家的雷達。留意環境給你的微小警訊，也許是某人的眼神或身體的不適。這個警報器正在響，不要忽略它。" },
    { z: 96, s: "Cm", n: "鋦", title: "熱源", title_en: "Heat", oracle_text: "在冰冷的虛空中持續燃燒；不需要太陽的眷顧，我自己就是能量的來源。", score: 2, guide: "你身處一個資源匱乏或較為冷漠的環境。別指望外在的援助或溫暖，你必須像鋦一樣自體發熱。雖然孤獨，但你擁有足夠的內在能量成為團隊中那個提供溫暖與動力的人。" },
    { z: 97, s: "Bk", n: "鉳", title: "探索", title_en: "Explore", oracle_text: "知識的疆界在於未知；為了合成那個不存在的奇蹟，必須投入無數次的嘗試。", score: 3, guide: "氛圍是實驗性的。適合嘗試以前沒做過的方法，或者學習冷門的知識。雖然不一定馬上成功，或者前路充滿未知，但這個探索的過程本身就很有價值。" },
    { z: 98, s: "Cf", n: "鉲", title: "關鍵", title_en: "Key", oracle_text: "極其微小的份量，卻是啟動巨大反應的鑰匙；價值不在於多，而在於不可取代。", score: 4, guide: "你扮演著關鍵鑰匙的角色。雖然你可能只講了一句話，或做了一個微小的動作，但這正是整件事能不能成的關鍵點。不要妄自菲薄，你的影響力比你想的更昂貴。" },
    { z: 99, s: "Es", n: "鑀", title: "智慧", title_en: "Wisdom", oracle_text: "在毀滅的灰燼中發現真理；透過公式與想像，看見肉眼無法抵達的宇宙。", score: 4, guide: "需要跳脫框架的思考。遇到的問題用常規方法解決不了，試著發揮你的想像力，甚至有點瘋狂的想法。就像在爆炸的殘骸中尋找新元素一樣，智慧會帶你從混亂中找到答案。" },
    { z: 100, s: "Fm", n: "鐨", title: "極限", title_en: "Limit", oracle_text: "抵達穩定的邊界；再往前一步就是崩解，知止是為了保持存在的完整。", score: 5, guide: "你已經登頂了，到達了某個階段的極限。這張牌代表你已經做到了最好，現在是插旗慶祝的時候。不要再逼自己往前，接受目前的邊界，知足並停下腳步。" },
    { z: 101, s: "Md", n: "鍆", title: "秩序", title_en: "Order", oracle_text: "萬物皆有其位；在混沌的元素海洋中，找出一條貫穿一切的規律。", score: 3, guide: "環境資訊過多或略顯混亂，此刻適合整理與歸納。把手邊的事物分類、列表、排定優先順序。當你建立起秩序與邏輯時，焦慮感便會自然消散。" },
    { z: 102, s: "No", n: "鍩", title: "否定", title_en: "Negation", oracle_text: "符號是 No，但不代表沒有價值；有的時候，拒絕是為了定義什麼才是正確的。", score: 5, guide: "學會說不。運勢提醒你，你有絕對的權利拒絕不合理的要求、拒絕誘惑、拒絕隨波逐流。你的力量來自於你的拒絕，這是一種必要的自我保護。" },
    { z: 103, s: "Lr", n: "鐒", title: "迴旋", title_en: "Cycle", oracle_text: "這不是終點，而是螺旋向上的起點；加粒子的終焉，是為了衝擊下一個維度。", score: 3, guide: "一個漫長的週期或業力即將結束。你正在迴旋加速，準備衝向下一個階段。整理好心情，無需頻頻回頭，利用這股離心力將自己拋向更高的維度。" },
    { z: 104, s: "Rf", n: "鑪", title: "架構", title_en: "Structure", oracle_text: "在崩塌之前建立秩序；即使基礎不穩，宏大的架構依然能展現人類的野心。", score: 3, guide: "計畫可能有些趕鴨子上架，雖然基礎還未完全穩固，但必須先把架構搭起來。別過度追求細節的完美，此刻撐住場面、展現出宏觀的格局是最重要的。" },
    { z: 105, s: "Db", n: "杜", title: "爭議", title_en: "Dispute", oracle_text: "真理往往伴隨著爭吵；不要害怕不同的聲音，觀點的衝撞是為了釐清歸屬。", score: 2, guide: "身處的環境充滿了不同意見，可能會捲入派系鬥爭或口角。保持中立，不要急著選邊站，也不要因為爭吵而退縮。這些觀點的衝撞是釐清真相的必經過程。" },
    { z: 106, s: "Sg", n: "𨭎", title: "傳承", title_en: "Legacy", oracle_text: "活著成為傳說；不需等待蓋棺論定，當下的成就足以證明你的名字。", score: 4, guide: "適合思考名聲與影響力。做一些能讓別人記得你的好事，或是傳承你的經驗。你現在的努力會立即得到認可，不需要等到以後，當下就是你的榮耀時刻。" },
    { z: 107, s: "Bh", n: "𨨏", title: "躍遷", title_en: "Leap", oracle_text: "理解不需要連續；就像電子的跳躍，領悟往往發生在斷裂的瞬間。", score: 4, guide: "進步將是跳躍式的。不要鑽牛角尖去想邏輯連貫性，跟著你的直覺跳過去。你會突然靈光一閃，瞬間搞懂原本卡住很久的問題，這是一場非線性的智慧升級。" },
    { z: 108, s: "Hs", n: "𨭆", title: "頑固", title_en: "Stubborn", oracle_text: "硬度是種態度；即便在極度不穩定的環境中，依然堅持原本的性質，拒絕改變。", score: 3, guide: "遇到困難時，適合展現出硬脾氣。環境可能很混亂，大家都在變來變去，但你不需改變。堅持你的原則與本質，這種頑固會讓你成為混亂局勢中的定海神針。" },
    { z: 109, s: "Mt", n: "䥑", title: "平反", title_en: "Justice", oracle_text: "被遺忘的功績終將浮現；正義或許會遲到，但榮耀終究會歸於真正的發現者。", score: 4, guide: "遲來的正義或被看見的機會即將降臨。如果你過去受了委屈、被低估或功勞被埋沒，現在有機會扳回一城。保持耐心與正直，時間會過濾掉雜質。" },
    { z: 110, s: "Ds", n: "鐽", title: "合成", title_en: "Synthesis", oracle_text: "奇蹟是被製出來的；將兩個巨大的重物強力撞擊，融合出前所未有的新物質。", score: 4, guide: "適合進行強強聯手。試著把兩個看似不相干的大專案、資源或強勢的人結合在一起。雖然過程可能會有激烈的碰撞與磨合，但融合後的結果將創造出全新的局面。" },
    { z: 111, s: "Rg", n: "錀", title: "透視", title_en: "Insight", oracle_text: "肉眼不可見的真實；穿透表象的迷霧，在偶然的機遇中看見骨架。", score: 4, guide: "留意那些意外的發現。你可能會不小心看到事情的真相，或是發現某人的秘密。保持敏銳的觀察力，你的洞察力能穿透表象的迷霧，看見支撐事物的真實骨架。" },
    { z: 112, s: "Cn", n: "鎶", title: "顛覆", title_en: "Subvert", oracle_text: "世界的中心並非你所想；改變觀看的視角，舊有的宇宙觀將在瞬間崩塌。", score: 3, guide: "適合打破常規與既定認知。如果有人告訴你以前都是這樣做的，請勇於挑戰他。換個角度看問題，你會發現原本的認知限制了你，這是一場思想的革命。" },
    { z: 113, s: "Nh", n: "鉨", title: "毅力", title_en: "Grit", oracle_text: "機率是給堅持者的禮物；在數萬億次的失敗撞擊中，等待那唯一的成功訊號。", score: 3, guide: "關鍵在於死纏爛打的毅力。這件事可能很難，成功率極低，但只要你堅持得夠久，奇蹟就會發生。像科學家守候多年一樣，絕對不要放棄，成功屬於最頑強的人。" },
    { z: 114, s: "Fl", n: "鈇", title: "孤島", title_en: "Island", oracle_text: "在毀滅的海洋中尋找平靜；相信混亂之中，存在著一個穩定不變的奇蹟之地。", score: 5, guide: "在忙亂、焦慮的環境中，尋找你的穩定島。這可能是一個人、一個地點或一段音樂。只要待在那裡，你就能在周遭的衰變與混亂中，保持安穩與長久。" },
    { z: 115, s: "Mc", n: "鏌", title: "謎團", title_en: "Enigma", oracle_text: "科學與傳說的交界；未被證實的力量，往往被視為來自外星的科技。", score: 2, guide: "會遇到一些無法解釋的事，可能是巧合，也可能是神秘的直覺，讓你感到困惑或無法掌握。不要急著用邏輯去分析，保持一點神秘感與敬畏，接受有些事情目前就是沒有答案。" },
    { z: 116, s: "Lv", n: "鉝", title: "協作", title_en: "Teamwork", oracle_text: "跨越海洋的握手；巨大的成就無法獨自完成，連結彼此的智慧才能創新元素。", score: 3, guide: "任務艱鉅，不可能一個人完成。你需要跨界合作，找不同領域、甚至是你原本不熟的人一起幫忙。連結彼此的資源與智慧，1加1的力量絕對大於2。" },
    { z: 117, s: "Ts", n: "鿬", title: "邊界", title_en: "Boundary", oracle_text: "身分在邊緣變得模糊；既是這個家族的一員，卻又展現出截然不同的叛逆面貌。", score: 2, guide: "處於一個模糊地帶，定位不清。可能搞不清楚自己的職責、角色或關係界線。這讓你有點困惑與不安全感，但也給了你自由定義自己的機會，不要急著被舊標籤定義。" },
    { z: 118, s: "Og", n: "鿫", title: "圓滿", title_en: "Completion", oracle_text: "週期表的終章；填滿最後一個電子，達成完美的穩定，也是下一個維度的起點。", score: 5, guide: "事情到了大結局。無論是專案結案、學期結束還是關係的了斷，這是一個圓滿且完美的句點。整理好心情，享受這份完成的充實感，準備迎接新篇章。" }
];



