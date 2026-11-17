// 數據校準模組：由 test.html 拆出，保留目前全域函式介面以相容既有 onclick。
// 依賴：data_static.js、data_molecules*.js，以及 test.html 中的共用格式化/3D 函式。

// --- 沉澱表：溶解規則引擎與題庫 ---
const PRECIP_ENGINE = (function() {
    const IA = new Set(['Li','Na','K','Rb','Cs']);
    const IIA = new Set(['Be','Mg','Ca','Sr','Ba']);
    const STATUS_LABEL = { soluble:'可溶', slightly:'微溶', insoluble:'難溶' };
    const STATUS_OPTS = ['可溶','微溶','難溶'];
    const BINARY_SOL_OPTS = ['可溶','難溶'];
    const NONE_ABOVE = '以上皆非';

    const CATIONS = [
        {id:'Li+',elem:'Li',ch:1,label:'Li⁺'},{id:'Na+',elem:'Na',ch:1,label:'Na⁺'},{id:'K+',elem:'K',ch:1,label:'K⁺'},
        {id:'NH4+',elem:'NH4',ch:1,label:'NH₄⁺',poly:true},{id:'H+',elem:'H',ch:1,label:'H⁺'},
        {id:'Mg2+',elem:'Mg',ch:2,label:'Mg²⁺'},{id:'Ca2+',elem:'Ca',ch:2,label:'Ca²⁺'},{id:'Sr2+',elem:'Sr',ch:2,label:'Sr²⁺'},
        {id:'Ba2+',elem:'Ba',ch:2,label:'Ba²⁺'},{id:'Be2+',elem:'Be',ch:2,label:'Be²⁺'},
        {id:'Al3+',elem:'Al',ch:3,label:'Al³⁺'},{id:'Fe2+',elem:'Fe',ch:2,label:'Fe²⁺'},{id:'Fe3+',elem:'Fe',ch:3,label:'Fe³⁺'},
        {id:'Cu2+',elem:'Cu',ch:2,label:'Cu²⁺'},{id:'Cu+',elem:'Cu',ch:1,label:'Cu⁺'},{id:'Ag+',elem:'Ag',ch:1,label:'Ag⁺'},
        {id:'Zn2+',elem:'Zn',ch:2,label:'Zn²⁺'},{id:'Cd2+',elem:'Cd',ch:2,label:'Cd²⁺'},{id:'Co2+',elem:'Co',ch:2,label:'Co²⁺'},
        {id:'Ni2+',elem:'Ni',ch:2,label:'Ni²⁺'},{id:'Mn2+',elem:'Mn',ch:2,label:'Mn²⁺'},{id:'Cr3+',elem:'Cr',ch:3,label:'Cr³⁺'},
        {id:'Pb2+',elem:'Pb',ch:2,label:'Pb²⁺'},
        {id:'Tl+',elem:'Tl',ch:1,label:'Tl⁺'},{id:'Sn2+',elem:'Sn',ch:2,label:'Sn²⁺'}
    ];
    const ANIONS = [
        {id:'NO3-',elem:'NO3',ch:-1,label:'NO₃⁻',poly:true},{id:'CH3COO-',elem:'CH3COO',ch:-1,label:'CH₃COO⁻',poly:true},
        {id:'Cl-',elem:'Cl',ch:-1,label:'Cl⁻'},{id:'Br-',elem:'Br',ch:-1,label:'Br⁻'},{id:'I-',elem:'I',ch:-1,label:'I⁻'},
        {id:'SO42-',elem:'SO4',ch:-2,label:'SO₄²⁻',poly:true},{id:'CrO42-',elem:'CrO4',ch:-2,label:'CrO₄²⁻',poly:true},
        {id:'S2-',elem:'S',ch:-2,label:'S²⁻'},{id:'OH-',elem:'OH',ch:-1,label:'OH⁻',poly:true},
        {id:'CO32-',elem:'CO3',ch:-2,label:'CO₃²⁻',poly:true},{id:'PO43-',elem:'PO4',ch:-3,label:'PO₄³⁻',poly:true},
        {id:'SO32-',elem:'SO3',ch:-2,label:'SO₃²⁻',poly:true},{id:'C2O42-',elem:'C2O4',ch:-2,label:'C₂O₄²⁻',poly:true},
        {id:'F-',elem:'F',ch:-1,label:'F⁻'}
    ];
    const CR_O4_SOL = new Set(['Mg2+','Ca2+','Zn2+','Cu2+','Fe2+','Fe3+','Al3+','Ni2+','Co2+','Mn2+','Cd2+','Sn2+','Cr3+']);
    const FORMULA_OVERRIDES = {
        'Ag+|Cl-':'AgCl','Ag+|Br-':'AgBr','Ag+|I-':'AgI','Ag+|CrO42-':'Ag2CrO4','Ag+|C2O42-':'Ag2C2O4','Ag+|S2-':'Ag2S',
        'Cu+|Cl-':'CuCl','Pb2+|Cl-':'PbCl2','Pb2+|Br-':'PbBr2','Pb2+|I-':'PbI2','Pb2+|SO42-':'PbSO4','Pb2+|CrO42-':'PbCrO4',
        'Pb2+|CO32-':'PbCO3','Pb2+|S2-':'PbS','Pb2+|OH-':'Pb(OH)2',
        'Ba2+|SO42-':'BaSO4','Ba2+|CrO42-':'BaCrO4','Ba2+|CO32-':'BaCO3','Ba2+|C2O42-':'BaC2O4','Ba2+|PO43-':'Ba3(PO4)2','Ba2+|SO32-':'BaSO3','Ba2+|S2-':'BaS',
        'Sr2+|SO42-':'SrSO4','Sr2+|CrO42-':'SrCrO4','Sr2+|CO32-':'SrCO3','Sr2+|C2O42-':'SrC2O4','Sr2+|PO43-':'Sr3(PO4)2',
        'Ca2+|SO42-':'CaSO4','Ca2+|CO32-':'CaCO3','Ca2+|C2O42-':'CaC2O4','Ca2+|PO43-':'Ca3(PO4)2','Ca2+|SO32-':'CaSO3','Ca2+|OH-':'Ca(OH)2',
        'Mg2+|CO32-':'MgCO3','Mg2+|C2O42-':'MgC2O4','Mg2+|PO43-':'Mg3(PO4)2','Mg2+|OH-':'Mg(OH)2',
        'Fe2+|S2-':'FeS','Fe3+|OH-':'Fe(OH)3','Fe2+|OH-':'Fe(OH)2','Cu2+|S2-':'CuS','Cu2+|OH-':'Cu(OH)2','Zn2+|S2-':'ZnS','Zn2+|OH-':'Zn(OH)2',
        'Al3+|OH-':'Al(OH)3','Ni2+|S2-':'NiS','Ni2+|OH-':'Ni(OH)2','Co2+|S2-':'CoS','Co2+|OH-':'Co(OH)2','Mn2+|S2-':'MnS','Cd2+|S2-':'CdS',
        'Ag+|OH-':'Ag2O','Ag+|CH3COO-':'CH3COOAg','Tl+|Cl-':'TlCl','Tl+|I-':'TlI'
    };

    function gcd(a,b){return b?gcd(b,a%b):Math.abs(a);}
    function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
    function pick(a){return a[Math.floor(Math.random()*a.length)];}
    function pickWeighted(pool,getW){
        const wfn=getW||(x=>x.w!=null?x.w:1);
        let total=0;
        for(const x of pool)total+=wfn(x);
        let r=Math.random()*total;
        for(const x of pool){r-=wfn(x);if(r<=0)return x;}
        return pool[pool.length-1];
    }
    function pickN(arr,n,eq){const s=shuffle(arr);const r=[];for(const x of s){if(r.length>=n)break;if(!r.some(y=>eq?eq(y,x):y===x))r.push(x);}return r;}
    function fmtF(f){return formatFormula(f);}

    function buildFormula(cat,an){
        const k=cat.id+'|'+an.id;
        if(FORMULA_OVERRIDES[k])return FORMULA_OVERRIDES[k];
        const g=gcd(cat.ch,Math.abs(an.ch)),nC=Math.abs(an.ch)/g,nA=cat.ch/g;
        // 多原子陽離子需要依化學式規則加括弧，例如 (NH4)2SO4、(NH4)3PO4。
        const cStr=cat.special?cat.elem:(cat.poly?(nC>1?'('+cat.elem+')'+nC:cat.elem):(cat.elem+(nC>1?nC:'')));
        const aE=an.elem;
        const aStr=an.poly?(nA>1?'('+aE+')'+nA:aE):(aE+(nA>1?nA:''));
        return cStr+aStr;
    }

    function getSolubility(cat,an){
        const ce=cat.elem,aid=an.id;
        if(aid==='NO3-')return{status:'soluble',formula:buildFormula(cat,an)};
        if(aid==='CH3COO-'){if(ce==='Ag')return{status:'slightly',formula:'CH3COOAg'};return{status:'soluble',formula:buildFormula(cat,an)};}
        if(IA.has(ce)||ce==='H'||cat.id==='NH4+')return{status:'soluble',formula:buildFormula(cat,an)};
        if(['Cl-','Br-','I-'].includes(aid)){
            if(['Cu+','Pb2+','Ag+','Tl+'].includes(cat.id))return{status:'insoluble',formula:buildFormula(cat,an)};
            return{status:'soluble',formula:buildFormula(cat,an)};
        }
        if(aid==='SO42-'){
            if(cat.id==='Ca2+')return{status:'slightly',formula:'CaSO4'};
            if(['Sr2+','Ba2+','Pb2+'].includes(cat.id))return{status:'insoluble',formula:buildFormula(cat,an)};
            return{status:'soluble',formula:buildFormula(cat,an)};
        }
        if(aid==='CrO42-'){
            if(cat.id==='Sr2+')return{status:'slightly',formula:'SrCrO4'};
            if(['Ba2+','Pb2+','Ag+'].includes(cat.id))return{status:'insoluble',formula:buildFormula(cat,an)};
            if(CR_O4_SOL.has(cat.id))return{status:'soluble',formula:buildFormula(cat,an)};
            return null;
        }
        if(aid==='S2-'){
            if(IA.has(ce)||ce==='H'||cat.id==='NH4+'||IIA.has(ce))return{status:'soluble',formula:buildFormula(cat,an)};
            return{status:'insoluble',formula:buildFormula(cat,an)};
        }
        if(aid==='OH-'){
            if(IA.has(ce)||cat.id==='NH4+')return{status:'soluble',formula:buildFormula(cat,an)};
            if(cat.id==='Ca2+')return{status:'slightly',formula:'Ca(OH)2'};
            if(['Sr2+','Ba2+'].includes(cat.id))return{status:'soluble',formula:buildFormula(cat,an)};
            return{status:'insoluble',formula:buildFormula(cat,an)};
        }
        if(['CO32-','PO43-','SO32-'].includes(aid))return{status:'insoluble',formula:buildFormula(cat,an)};
        if(aid==='C2O42-'){
            if(cat.id==='Mg2+')return{status:'slightly',formula:'MgC2O4'};
            if(['Be2+'].includes(cat.id))return{status:'soluble',formula:buildFormula(cat,an)};
            return{status:'insoluble',formula:buildFormula(cat,an)};
        }
        if(aid==='F-'){
            if(['Be2+','Tl+','Ag+'].includes(cat.id))return{status:'soluble',formula:buildFormula(cat,an)};
            return{status:'insoluble',formula:buildFormula(cat,an)};
        }
        return null;
    }

    /** 高中題庫：排除不常考、不合理或過冷僻的離子組合 */
    function isHighSchoolPair(cat,an,status){
        if(cat.id==='H+')return false;
        if(cat.id==='Cu+')return['Cl-','Br-','I-'].includes(an.id);
        if(an.id==='I-'){
            if(status==='soluble')return IA.has(cat.elem)||cat.id==='NH4+';
            return true;
        }
        if(cat.id==='Sn2+')return['OH-','S2-','CO32-','SO32-','Cl-','Br-','I-','SO42-'].includes(an.id);
        if(cat.id==='Tl+')return['Cl-','Br-','I-','F-'].includes(an.id);
        if(an.id==='F-'){
            if(status==='soluble')return IA.has(cat.elem)||cat.id==='NH4+'||['Be2+','Tl+','Ag+'].includes(cat.id);
            return false;
        }
        if(cat.id==='Be2+')return['F-','C2O42-','NO3-','CH3COO-'].includes(an.id);
        return true;
    }

    function pickPrecipAnion(ids){
        const main=ids.filter(id=>id!=='F-');
        if(main.length&&Math.random()>0.07){
            return pick(ANIONS.filter(a=>main.includes(a.id)));
        }
        const f=ANIONS.find(a=>a.id==='F-');
        return f||pick(ANIONS.filter(a=>ids.includes(a.id)));
    }

    function pickPair(pool,lowF){
        if(!lowF||!pool.length)return pick(pool);
        const noF=pool.filter(p=>p.an.id!=='F-');
        if(noF.length&&Math.random()>0.08)return pick(noF);
        return pick(pool);
    }

    let ALL_PAIRS=[],PRECIP_PAIRS=[],SOLUBLE_PAIRS=[];
    function init(){
        ALL_PAIRS=[];PRECIP_PAIRS=[];SOLUBLE_PAIRS=[];
        for(const c of CATIONS)for(const a of ANIONS){
            const r=getSolubility(c,a);if(!r||!isHighSchoolPair(c,a,r.status))continue;
            const item={cat:c,an:a,status:r.status,formula:r.formula,label:STATUS_LABEL[r.status]};
            ALL_PAIRS.push(item);
            if(r.status==='insoluble')PRECIP_PAIRS.push(item);
            else if(r.status==='soluble')SOLUBLE_PAIRS.push(item);
        }
    }
    init();

    const MUST_SOLUBLE_Q = [
        {q:'NO₃⁻ 與任一陽離子形成的鹽類，溶解情形為何？',a:'可溶',type:'必溶離子'},
        {q:'CH₃COO⁻ 與 Na⁺ 形成的鹽類，溶解情形為何？',a:'可溶',type:'必溶離子'},
        {q:'下列何者屬於「一律可溶」的陰離子？',a:'NO₃⁻',opts:['NO₃⁻','Cl⁻','SO₄²⁻','CO₃²⁻']},
        {q:'下列何者屬於「一律可溶」的陽離子？',a:'Na⁺',opts:['Na⁺','Ag⁺','Ba²⁺','Pb²⁺']},
        {q:'Na₂SO₄ 在水中的溶解情形為何？',a:'可溶',type:'必溶離子'},
        {q:'KNO₃ 在水中的溶解情形為何？',a:'可溶',type:'必溶離子'},
        {q:'下列鹽類何者一定可溶？',a:'NH₄Cl',opts:['NH₄Cl','AgCl','BaSO₄','CaCO₃']}
    ];
    const RARE_SLIGHTLY_Q={q:'CH₃COOAg 的溶解情形為何？',a:'微溶',type:'必溶離子例外'};

    const PRECIP_COLORS=[
        {f:'AgCl',c:'白色'},{f:'AgBr',c:'淡黃色'},{f:'AgI',c:'黃色'},{f:'PbCl2',c:'白色'},{f:'PbI2',c:'黃色'},
        {f:'BaSO4',c:'白色'},{f:'CaSO4',c:'白色'},{f:'BaCrO4',c:'黃色'},{f:'Ag2CrO4',c:'磚紅色'},
        {f:'CuS',c:'黑色'},{f:'PbS',c:'黑色'},{f:'FeS',c:'黑色'},{f:'ZnS',c:'白色'},{f:'CdS',c:'黃色'},
        {f:'Cu(OH)2',c:'藍色'},{f:'Fe(OH)3',c:'紅褐色'},{f:'Fe(OH)2',c:'綠色'},{f:'Al(OH)3',c:'白色'},
        {f:'CaCO3',c:'白色'},{f:'BaCO3',c:'白色'},{f:'Ni(OH)2',c:'綠色'},{f:'Co(OH)2',c:'粉紅色'}
    ];
    const SOL_COLORS=[
        {id:'Cu2+',l:'Cu²⁺',c:'藍色'},{id:'Fe2+',l:'Fe²⁺',c:'淡綠色'},{id:'Fe3+',l:'Fe³⁺',c:'黃褐色'},
        {id:'MnO4-',l:'MnO₄⁻',c:'紫色'},{id:'CrO42-',l:'CrO₄²⁻',c:'黃色'},{id:'Cr2O72-',l:'Cr₂O₇²⁻',c:'橙色'},
        {id:'FeSCN2+',l:'FeSCN²⁺',c:'血紅色'},{id:'Cu(NH3)42+',l:'Cu(NH₃)₄²⁺',c:'深藍色'},
        {id:'Ni2+',l:'Ni²⁺',c:'綠色'},{id:'Co2+',l:'Co²⁺',c:'粉紅色'},{id:'Mn2+',l:'Mn²⁺',c:'淡粉紅色'},
        {id:'Na+',l:'Na⁺',c:'無色'},{id:'Ag+',l:'Ag⁺',c:'無色'},{id:'Zn2+',l:'Zn²⁺',c:'無色'}
    ];
    const FLAME_COLORS=[
        {id:'Li+',l:'Li⁺',c:'鮮紅色'},{id:'Na+',l:'Na⁺',c:'黃色'},{id:'K+',l:'K⁺',c:'紫色'},
        {id:'Ca2+',l:'Ca²⁺',c:'橙紅色'},{id:'Sr2+',l:'Sr²⁺',c:'深紅色'},{id:'Ba2+',l:'Ba²⁺',c:'黃綠色'},
        {id:'Cu2+',l:'Cu²⁺',c:'藍綠色'},{id:'Mg2+',l:'Mg²⁺',c:'無色'},{id:'Be2+',l:'Be²⁺',c:'無色'}
    ];
    const COLOR_ION_Q=[
        {catId:'Ag+',anId:'CrO42-',color:'磚紅色'},
        {catId:'Ag+',anId:'Cl-',color:'白色'},
        {catId:'Cu2+',anId:'S2-',color:'黑色'},
        {catId:'Fe2+',anId:'S2-',color:'黑色'},
        {catId:'Pb2+',anId:'I-',color:'黃色'},
        {catId:'Ba2+',anId:'CrO42-',color:'黃色'}
    ];
    const NH3_COMPLEX_VARIANTS={
        'Cu²⁺':{correct:'Cu(NH₃)₄²⁺',wrong:['Cu(NH₃)₄⁺','Cu(NH₃)₄³⁺','Cu(NH₃)₂²⁺'],w:4},
        'Zn²⁺':{correct:'Zn(NH₃)₄²⁺',wrong:['Zn(NH₃)₄³⁺','Zn(NH₃)₂²⁺','Zn(NH₃)₆²⁺'],w:4},
        'Ag⁺':{correct:'Ag(NH₃)₂⁺',wrong:['Ag(NH₃)₂²⁺','Ag(NH₃)₄²⁺','Ag(NH₃)₃⁺'],w:4},
        'Ni²⁺':{correct:'Ni(NH₃)₆²⁺',wrong:['Ni(NH₃)₆³⁺','Ni(NH₃)₅²⁺','Ni(NH₃)₄²⁺'],w:1},
        'Co²⁺':{correct:'Co(NH₃)₆²⁺',wrong:['Co(NH₃)₆³⁺','Co(NH₃)₄²⁺','Co(NH₃)₆⁺'],w:1},
        'Cd²⁺':{correct:'Cd(NH₃)₄²⁺',wrong:['Cd(NH₃)₄³⁺','Cd(NH₃)₂²⁺','Cd(NH₃)₆²⁺'],w:1}
    };
    const SPECIAL_COMPLEX_Q=[
        {q:'Al³⁺ 加入過量 NaOH 後，主要錯離子為何？',a:'Al(OH)₄⁻',wrong:['Zn(OH)₄²⁻','Al(OH)₃','Cr(OH)₄⁻'],w:4},
        {q:'Zn²⁺ 加入過量 NaOH 後，主要錯離子為何？',a:'Zn(OH)₄²⁻',wrong:['Zn(OH)₂','Al(OH)₄⁻','Zn(OH)₃⁻'],w:4},
        {q:'Pb²⁺ 加入過量 NaOH 後，主要錯離子為何？',a:'Pb(OH)₄²⁻',wrong:['Pb(OH)₂','Sn(OH)₄²⁻','Pb(OH)₃⁻'],w:4},
        {q:'Sn²⁺ 加入過量 NaOH 後，主要錯離子為何？',a:'Sn(OH)₄²⁻',wrong:['Sn(OH)₂','Pb(OH)₄²⁻','Zn(OH)₄²⁻'],w:4},
        {q:'Cr³⁺ 加入過量 NaOH 後，主要錯離子為何？',a:'Cr(OH)₄⁻',wrong:['Cr(OH)₃','Al(OH)₄⁻','Cr(OH)₄²⁻'],w:1},
        {q:'Be²⁺ 加入過量 NaOH 後，主要錯離子為何？',a:'Be(OH)₄²⁻',wrong:['Be(OH)₂','Mg(OH)₂','Be(OH)₃⁻'],w:1},
        {q:'Cu²⁺ 加入過量氨水後，主要錯離子為何？',a:'Cu(NH₃)₄²⁺',wrong:['Cu(NH₃)₄⁺','Cu(NH₃)₂²⁺','Cu(NH₃)₆²⁺'],w:4},
        {q:'Ag⁺ 加入過量氨水後，主要錯離子為何？',a:'Ag(NH₃)₂⁺',wrong:['Ag(NH₃)₂²⁺','Ag(NH₃)₄²⁺','Ag(NH₃)₃⁺'],w:4},
        {q:'Zn²⁺ 加入過量氨水後，主要錯離子為何？',a:'Zn(NH₃)₄²⁺',wrong:['Zn(NH₃)₄³⁺','Zn(NH₃)₂²⁺','Zn(NH₃)₆²⁺'],w:4},
        {q:'Ni²⁺ 加入過量氨水後，主要錯離子為何？',a:'Ni(NH₃)₆²⁺',wrong:['Ni(NH₃)₆³⁺','Ni(NH₃)₅²⁺','Ni(NH₃)₄²⁺'],w:1},
        {q:'Co²⁺ 加入過量氨水後，主要錯離子為何？',a:'Co(NH₃)₆²⁺',wrong:['Co(NH₃)₆³⁺','Co(NH₃)₄²⁺','Co(NH₃)₆⁺'],w:1},
        {q:'Cd²⁺ 加入過量氨水後，主要錯離子為何？',a:'Cd(NH₃)₄²⁺',wrong:['Cd(NH₃)₄³⁺','Cd(NH₃)₂²⁺','Cd(NH₃)₆²⁺'],w:1}
    ];
    const NH3_AMPHI=[
        {ion:'Al³⁺',prec:'Al(OH)₃'},{ion:'Mg²⁺',prec:'Mg(OH)₂'},{ion:'Fe³⁺',prec:'Fe(OH)₃'},
        {ion:'Cr³⁺',prec:'Cr(OH)₃'},{ion:'Pb²⁺',prec:'Pb(OH)₂'}
    ];
    const SPECIAL_CASES=[
        {q:'MgCO₃ 在水中的溶解情形為何？',a:'難溶',key:'MgCO3'},
        {q:'PbCl₂ 在冷水中的溶解情形為何？',a:'難溶'},
        {q:'PbCl₂ 在熱水中的溶解情形為何？',a:'可溶'},
        {q:'CaSO₄ 的溶解情形為何？',a:'微溶'},
        {q:'Ca(OH)₂ 的溶解情形為何？',a:'微溶'},
        {q:'SrCrO₄ 的溶解情形為何？',a:'微溶'},
        {q:'MgC₂O₄ 的溶解情形為何？',a:'微溶'}
    ];
    const ACID_DISSOLVE=[
        {p:'CaCO₃',a:'溶解並放出 CO₂',cat:'碳酸鹽'},{p:'BaCO₃',a:'溶解並放出 CO₂',cat:'碳酸鹽'},
        {p:'Fe(OH)₃',a:'溶解',cat:'氫氧化物'},{p:'Al(OH)₃',a:'溶解',cat:'氫氧化物'},
        {p:'CaSO₃',a:'溶解並放出 SO₂',cat:'亞硫酸鹽'},{p:'BaCrO₄',a:'溶解且溶液變橙色',cat:'鉻酸鹽'},
        {p:'CaC₂O₄',a:'溶解',cat:'草酸鹽'},{p:'Ca₃(PO₄)₂',a:'溶解',cat:'磷酸鹽'}
    ];
    const ACID_NO_DISSOLVE=['BaSO₄','SrSO₄','PbSO₄','CuS'];
    const ACID_SOLUBLE_SULFIDES=['FeS','ZnS','MnS','NiS','PbS','CdS','CoS'];
    const ACID_SOLUBLE_EXTRA=['FeS','ZnS','MnS','NiS','PbS','CdS','MgCO₃','ZnCO₃','Ca(OH)₂','Mg(OH)₂','BaSO₃'];
    const BASE_DISSOLVE=[
        {p:'Al(OH)₃',ion:'Al(OH)₄⁻',c:'無色'},{p:'Zn(OH)₂',ion:'Zn(OH)₄²⁻',c:'無色'},
        {p:'Pb(OH)₂',ion:'Pb(OH)₄²⁻',c:'無色'},{p:'Cr(OH)₃',ion:'Cr(OH)₄⁻',c:'綠色'},
        {p:'Be(OH)₂',ion:'Be(OH)₄²⁻',c:'無色'},{p:'Sn(OH)₂',ion:'Sn(OH)₄²⁻',c:'無色'}
    ];
    const BASE_NO_DISSOLVE=['Cu(OH)₂','Fe(OH)₃','Mg(OH)₂'];
    const NH3_DISSOLVE=[
        {ion:'Cu²⁺',prec:'Cu(OH)₂',complex:'Cu(NH₃)₄²⁺',cc:'深藍色',w:4},
        {ion:'Ag⁺',prec:'Ag₂O',complex:'Ag(NH₃)₂⁺',cc:'無色',w:4},
        {ion:'Zn²⁺',prec:'Zn(OH)₂',complex:'Zn(NH₃)₄²⁺',cc:'無色',w:4},
        {ion:'Ni²⁺',prec:'Ni(OH)₂',complex:'Ni(NH₃)₆²⁺',cc:'藍紫色',w:1},
        {ion:'Co²⁺',prec:'Co(OH)₂',complex:'Co(NH₃)₆²⁺',cc:'黃褐色',w:1},
        {ion:'Cd²⁺',prec:'Cd(OH)₂',complex:'Cd(NH₃)₄²⁺',cc:'無色',w:1}
    ];
    const NH3_NO_DISSOLVE=['Al(OH)₃','Mg(OH)₂','Fe(OH)₃','Cr(OH)₃','Pb(OH)₂'];
    const NH3_SOL_DISSOLVE=[
        {p:'Cu(OH)₂',w:4},{p:'Ag₂O',w:4},{p:'Zn(OH)₂',w:4},
        {p:'Ni(OH)₂',w:1},{p:'Co(OH)₂',w:1},{p:'Cd(OH)₂',w:1}
    ];
    const AGX_DATA=[
        {f:'AgF',c:'無色',dilNH3:'可溶',concNH3:'可溶',s2o3:'可溶'},
        {f:'AgCl',c:'白色',dilNH3:'可溶',concNH3:'可溶',s2o3:'可溶'},
        {f:'AgBr',c:'淡黃色',dilNH3:'不溶',concNH3:'不溶',s2o3:'可溶'},
        {f:'AgI',c:'黃色',dilNH3:'不溶',concNH3:'不溶',s2o3:'可溶'}
    ];
    const GAS_ACID_Q=[
        {p:'CaCO₃',g:'CO₂'},{p:'BaCO₃',g:'CO₂'},{p:'MgCO₃',g:'CO₂'},
        {p:'CaSO₃',g:'SO₂'},{p:'BaSO₃',g:'SO₂'}
    ];

    function mkOpts(correct,pool,fmt,n){
        const opts=[correct];const used=new Set([correct]);
        for(const x of shuffle(pool)){if(opts.length>=n)break;const v=fmt?fmt(x):x;if(v&&!used.has(v)){used.add(v);opts.push(v);}}
        return shuffle(opts);
    }
    function mkOpts4(correct,candidates,extraPool,formulaOnly,ionCationBias){
        const opts=[correct];const used=new Set([correct]);
        for(const c of shuffle(candidates)){if(opts.length>=4)break;if(c&&c!==correct&&!used.has(c)){used.add(c);opts.push(c);}}
        if(extraPool)for(const c of shuffle(extraPool)){if(opts.length>=4)break;if(c&&!used.has(c)){used.add(c);opts.push(c);}}
        if(!formulaOnly){
            const allLabels=CATIONS.map(c=>c.label).concat(ANIONS.map(a=>a.label));
            let guard=0;
            while(opts.length<4&&guard<80){
                guard++;
                let f;
                if(ionCationBias!=null){
                    const pool=Math.random()<ionCationBias?CATIONS:ANIONS;
                    f=pick(pool).label;
                }else{
                    f=pick(allLabels);
                }
                if(!used.has(f)){used.add(f);opts.push(f);}
            }
        }
        return shuffle(opts);
    }
    function agxBin(val){return(val==='不溶')?'難溶':'可溶';}

    function gen21(qd){
        if(Math.random()<0.02){
            const item=RARE_SLIGHTLY_Q;
            qd.type=item.type||'溶解情形判斷';
            qd.question=item.q;
            qd.answer=item.a;
            qd.displayMode='text';
            qd.optionClass='bin-opt';
            qd.forcedOpts=shuffle(STATUS_OPTS.filter(s=>s!==item.a).concat([item.a]));
            return true;
        }
        if(Math.random()<0.22){
            const item=pick(MUST_SOLUBLE_Q);
            qd.type=item.type||'溶解情形判斷';
            qd.question=item.q;
            qd.answer=item.a;
            qd.displayMode='ion';
            qd.optionClass='chem-opt';
            if(item.opts){
                qd.forcedOpts=item.opts;
            }else{
                qd.forcedOpts=mkOpts(item.a,STATUS_OPTS,null,3);
            }
            return true;
        }
        const rev=Math.random()<0.42;
        if(rev){
            const st=pick(['insoluble','insoluble','insoluble','slightly','soluble']);
            let pool=ALL_PAIRS.filter(p=>p.status===st);
            const oppPool=ALL_PAIRS.filter(p=>p.status!==st);
            if(st==='slightly'&&Math.random()>0.12)pool=pool.filter(p=>p.formula!=='CH3COOAg');
            if(pool.length<2||oppPool.length<3)return false;
            const correct=pickPair(pool,true);
            qd.type='溶解情形判斷（反向）';
            qd.question=`下列何者為「${STATUS_LABEL[st]}」？`;
            qd.answer=fmtF(correct.formula);
            qd.displayMode='formula';
            qd.optionClass='chem-opt';
            qd.useChemFormat=true;
            const wrong=pickN(oppPool,3,x=>x.formula).map(x=>fmtF(x.formula));
            qd.forcedOpts=mkOpts4(qd.answer,wrong,oppPool.map(p=>fmtF(p.formula)),true);
            return true;
        }
        let item;
        if(Math.random()<0.58&&PRECIP_PAIRS.length){
            item=pickPair(PRECIP_PAIRS,true);
        }else{
            let pool=ALL_PAIRS.filter(p=>p.an.id!=='F-'||Math.random()<0.06);
            if(!pool.length)pool=ALL_PAIRS;
            if(Math.random()>0.1)pool=pool.filter(p=>p.formula!=='CH3COOAg');
            if(!pool.length)pool=ALL_PAIRS;
            item=pickPair(pool,true);
        }
        qd.type='溶解情形判斷';
        if(Math.random()<0.5){
            qd.question=`${item.cat.label} 與 ${item.an.label} 混合後，溶解情形為何？`;
        }else{
            qd.question=`${fmtF(item.formula)} 在水中的溶解情形為何？`;
        }
        qd.answer=item.label;
        qd.displayMode='text';
        qd.optionClass='bin-opt';
        qd.forcedOpts=shuffle(STATUS_OPTS.filter(s=>s!==item.label).concat([item.label]));
        return true;
    }

    function gen22(qd){
        if(Math.random()<0.32){
            const cq=pick(COLOR_ION_Q);
            const pair=PRECIP_PAIRS.find(p=>p.cat.id===cq.catId&&p.an.id===cq.anId);
            if(!pair)return false;
            const useCat=Math.random()<0.55;
            if(useCat){
                qd.type='離子配對沉澱';
                qd.question=`${pair.cat.label} 與下列何者混合產生<strong>${cq.color}</strong>沉澱？`;
                qd.answer=pair.an.label;
                const wrongAns=pickN(ANIONS.filter(a=>a.id!==pair.an.id),3,a=>a.id).map(a=>a.label);
                qd.displayMode='ion';qd.optionClass='chem-opt';
                qd.forcedOpts=mkOpts4(pair.an.label,wrongAns,null,false,0.88);
            }else{
                qd.type='離子配對沉澱';
                qd.question=`下列何種陽離子與 ${pair.an.label} 混合產生<strong>${cq.color}</strong>沉澱？`;
                qd.answer=pair.cat.label;
                const wrongCats=pickN(CATIONS.filter(c=>c.id!==pair.cat.id),3,c=>c.id).map(c=>c.label);
                qd.displayMode='ion';qd.optionClass='chem-opt';
                qd.forcedOpts=mkOpts4(pair.cat.label,wrongCats,null,false,0.88);
            }
            return true;
        }
        const PRECIP_ANIONS=['CO32-','SO42-','S2-','OH-','Cl-','CrO42-','PO43-','C2O42-'];
        if(Math.random()<0.5){
            const an=pickPrecipAnion(PRECIP_ANIONS);
            const pool=SOLUBLE_PAIRS.filter(p=>p.an.id===an.id);
            if(pool.length<2)return false;
            const correct=pick(pool);
            qd.type='離子配對沉澱（反向）';
            qd.question=`${an.label} 與下列何種陽離子混合後<strong>不會</strong>產生沉澱？`;
            qd.answer=correct.cat.label;
            const wrongPool=PRECIP_PAIRS.filter(p=>p.an.id===an.id).map(p=>p.cat.label);
            qd.displayMode='ion';qd.optionClass='chem-opt';
            qd.forcedOpts=mkOpts4(correct.cat.label,wrongPool,null,false,0.88);
            return true;
        }
        const cats=CATIONS.filter(c=>PRECIP_PAIRS.some(p=>p.cat.id===c.id)&&SOLUBLE_PAIRS.some(p=>p.cat.id===c.id));
        if(!cats.length)return false;
        const cat=pick(cats);
        const pool=SOLUBLE_PAIRS.filter(p=>p.cat.id===cat.id);
        if(pool.length<2)return false;
        const correct=pick(pool);
        qd.type='離子配對沉澱（反向）';
        qd.question=`${cat.label} 與下列何種陰離子混合後<strong>不會</strong>產生沉澱？`;
        qd.answer=correct.an.label;
        const wrongPool=PRECIP_PAIRS.filter(p=>p.cat.id===cat.id).map(p=>p.an.label);
        qd.displayMode='ion';qd.optionClass='chem-opt';
        qd.forcedOpts=mkOpts4(correct.an.label,wrongPool,null,false,0.88);
        return true;
    }

    function gen23(qd){
        const item=pickWeighted(SPECIAL_COMPLEX_Q);
        qd.type='特殊錯離子';
        qd.question=item.q;
        qd.answer=item.a;
        qd.displayMode='ion';
        qd.optionClass='chem-opt';
        qd.forcedOpts=mkOpts4(item.a,item.wrong);
        return true;
    }

    function gen24(qd){
        const rev=Math.random()<0.4;
        const colors=[...new Set(PRECIP_COLORS.map(x=>x.c))];
        if(rev){
            const col=pick(colors);
            const pool=PRECIP_COLORS.filter(x=>x.c===col);
            const correct=pick(pool);
            qd.type='沉澱物顏色（反向）';
            qd.question=`下列何者為「${col}」沉澱？`;
            qd.answer=fmtF(correct.f);
            qd.displayMode='formula';
            qd.optionClass='chem-opt';
            const wrongF=pickN(PRECIP_COLORS.filter(x=>x.c!==col),3,x=>x.f).map(x=>fmtF(x.f));
            const extraWrong=PRECIP_COLORS.filter(x=>x.c!==col).map(x=>fmtF(x.f));
            qd.forcedOpts=mkOpts4(qd.answer,wrongF,extraWrong,true);
            return true;
        }
        const item=pick(PRECIP_COLORS);
        qd.type='沉澱物顏色';
        qd.question=`${fmtF(item.f)} 沉澱的顏色為何？`;
        qd.answer=item.c;
        qd.displayMode='text';
        qd.forcedOpts=mkOpts4(item.c,colors.filter(c=>c!==item.c));
        return true;
    }

    function gen25(qd){
        const rev=Math.random()<0.4;
        const colors=[...new Set(SOL_COLORS.map(x=>x.c))];
        if(rev){
            const col=pick(colors);
            const pool=SOL_COLORS.filter(x=>x.c===col);
            const correct=pick(pool);
            qd.type='離子溶液顏色（反向）';
            qd.question=`下列何者的水溶液為「${col}」？`;
            qd.answer=correct.l;
            qd.displayMode='ion';
            qd.optionClass='chem-opt';
            qd.forcedOpts=mkOpts4(correct.l,pickN(SOL_COLORS.filter(x=>x.c!==col),3,x=>x.id).map(x=>x.l));
            return true;
        }
        const item=pick(SOL_COLORS);
        qd.type='離子溶液顏色';
        qd.question=`${item.l}(aq) 的顏色為何？`;
        qd.answer=item.c;
        qd.displayMode='text';
        qd.forcedOpts=mkOpts4(item.c,colors.filter(c=>c!==item.c));
        return true;
    }

    function gen26(qd){
        const r=Math.random();
        const sub=r<0.2?'gas':(r<0.4?'chromate':(r<0.8?'acid':'base'));
        const rev=Math.random()<0.4;
        const acidSolPool=[...ACID_DISSOLVE.map(x=>x.p),...ACID_SOLUBLE_EXTRA];
        if(sub==='gas'){
            const item=pick(GAS_ACID_Q);
            qd.type='酸溶出氣體';
            qd.question=`${item.p} 沉澱加入稀強酸後，會放出何種氣體？`;
            qd.answer=item.g;
            qd.displayMode='text';
            qd.forcedOpts=mkOpts4(item.g,['CO₂','SO₂','O₂','H₂'].filter(g=>g!==item.g));
            return true;
        }
        if(sub==='chromate'){
            qd.type='鉻酸鹽加酸變色';
            qd.question='BaCrO₄ 黃色沉澱加入稀強酸後，溶液顏色變為何者？';
            qd.answer='橙色（Cr₂O₇²⁻）';
            qd.displayMode='text';
            qd.forcedOpts=mkOpts4(qd.answer,['黃色（CrO₄²⁻）','藍色','無色','綠色']);
            return true;
        }
        if(sub==='acid'){
            const mode=pick(['hard','sol','sulf','sulfate','bin']);
            qd.displayMode='formula';
            qd.optionClass='chem-opt';
            qd.useChemFormat=true;
            if(mode==='hard'){
                const correct=pick(ACID_NO_DISSOLVE);
                qd.type='強酸溶解（反向）';
                qd.question='下列何者加入稀強酸後<strong>難溶</strong>（不溶解）？';
                qd.answer=correct;
                const acidWrong=acidSolPool.filter(p=>!ACID_NO_DISSOLVE.includes(p));
                qd.forcedOpts=mkOpts4(correct,pickN(acidWrong,6),acidWrong,true);
            }else if(mode==='sol'){
                const correct=pick(acidSolPool);
                qd.type='強酸溶解（反向）';
                qd.question='下列何者加入稀強酸後<strong>可溶</strong>？';
                qd.answer=correct;
                const acidWrong=[...ACID_NO_DISSOLVE,...acidSolPool.filter(p=>p!==correct)];
                qd.forcedOpts=mkOpts4(correct,pickN(acidWrong,6),acidWrong,true);
            }else if(mode==='sulf'){
                qd.type='強酸溶解（硫化物）';
                qd.question='下列何種<strong>硫化物</strong>加入稀強酸後<strong>難溶</strong>？';
                qd.answer='CuS';
                qd.forcedOpts=mkOpts4('CuS',ACID_SOLUBLE_SULFIDES,null,true);
            }else if(mode==='sulfate'){
                const correct=pick(['BaSO₄','SrSO₄','PbSO₄']);
                qd.type='強酸溶解（硫酸鹽）';
                qd.question='下列何種<strong>硫酸鹽</strong>加入稀強酸後<strong>難溶</strong>？';
                qd.answer=correct;
                qd.forcedOpts=mkOpts4(correct,['CaSO₄','MgSO₄','FeSO₄','CuSO₄','ZnSO₄','Na₂SO₄'],null,true);
            }else{
                const item=pick(ACID_DISSOLVE);
                qd.type='強酸溶解';
                qd.question=`${item.p} 沉澱加入稀強酸後，是否可溶？`;
                qd.answer='可溶';
                qd.displayMode='text';
                qd.optionClass='bin-opt';
                qd.useChemFormat=false;
                qd.forcedOpts=shuffle(['可溶','難溶']);
            }
            return true;
        }
        if(rev){
            const correct=pick(BASE_DISSOLVE);
            qd.type='強鹼溶解（反向）';
            qd.question='下列何者加入過量強鹼後可溶？';
            qd.answer=correct.p;
            qd.displayMode='formula';
            qd.optionClass='chem-opt';
            qd.useChemFormat=true;
            qd.forcedOpts=mkOpts4(correct.p,pickN(BASE_NO_DISSOLVE,3),BASE_NO_DISSOLVE,true);
        }else{
            const item=pick(BASE_DISSOLVE);
            qd.type='強鹼溶解';
            qd.question=`${item.p} 沉澱加入過量 NaOH 後，是否可溶？`;
            qd.answer='可溶';
            qd.displayMode='text';
            qd.optionClass='bin-opt';
            qd.forcedOpts=shuffle(['可溶','難溶']);
        }
        return true;
    }

    function gen27(qd){
        const sub=Math.random()<0.5?'nh3':(Math.random()<0.65?'complex':'amphi');
        if(sub==='complex'){
            const ionKey=pickWeighted(Object.keys(NH3_COMPLEX_VARIANTS),k=>NH3_COMPLEX_VARIANTS[k].w||1);
            const v=NH3_COMPLEX_VARIANTS[ionKey];
            qd.type='氨錯離子';
            qd.question=`${ionKey} 加入過量氨水再溶解後，主要錯離子為何？`;
            qd.answer=v.correct;
            qd.displayMode='ion';qd.optionClass='chem-opt';
            qd.forcedOpts=mkOpts4(v.correct,v.wrong);
            return true;
        }
        if(sub==='amphi'){
            const item=pick(NH3_AMPHI);
            qd.type='過量氨水溶解';
            qd.question=`${item.ion} 先產生沉澱，加入過量氨水後是否可溶？`;
            qd.answer='難溶';
            qd.displayMode='text';
            qd.optionClass='bin-opt';
            qd.forcedOpts=shuffle(['可溶','難溶']);
            return true;
        }
        const rev=Math.random()<0.4;
        if(rev){
            if(Math.random()<0.5){
                const correct=pick(NH3_NO_DISSOLVE);
                qd.type='過量氨水溶解（反向）';
                qd.question='下列何者加入過量氨水後<strong>難溶</strong>（不會再溶解）？';
                qd.answer=correct;
                qd.displayMode='formula';
                qd.optionClass='chem-opt';
                qd.useChemFormat=true;
                qd.forcedOpts=mkOpts4(correct,pickN(NH3_SOL_DISSOLVE,3,x=>x.p).map(x=>x.p),NH3_SOL_DISSOLVE.map(x=>x.p),true);
            }else{
                const correctItem=pickWeighted(NH3_SOL_DISSOLVE);
                const correct=correctItem.p;
                qd.type='過量氨水溶解（反向）';
                qd.question='下列何者加入過量氨水後<strong>可溶</strong>（會再溶解）？';
                qd.answer=correct;
                qd.displayMode='formula';
                qd.optionClass='chem-opt';
                qd.useChemFormat=true;
                qd.forcedOpts=mkOpts4(correct,pickN(NH3_NO_DISSOLVE,3),NH3_NO_DISSOLVE,true);
            }
        }else{
            const item=pickWeighted(NH3_DISSOLVE);
            qd.type='過量氨水溶解';
            qd.question=`${item.ion} 先產生沉澱，加入過量氨水後是否可溶？`;
            qd.answer='可溶';
            qd.displayMode='text';
            qd.optionClass='bin-opt';
            qd.forcedOpts=shuffle(['可溶','難溶']);
        }
        return true;
    }

    function gen28(qd){
        let item;
        if(typeof window._precipSpecialLeft==='number'&&window._precipSpecialLeft>0){
            if(window._precipSpecialLeft===2){
                item=SPECIAL_CASES.find(x=>x.key==='MgCO3')||SPECIAL_CASES[0];
            }else{
                const pool=SPECIAL_CASES.filter(x=>x.key!=='MgCO3');
                item=pick(pool.length?pool:SPECIAL_CASES);
            }
            window._precipSpecialLeft--;
        }else{
            item=pick(SPECIAL_CASES);
        }
        qd.type='特殊溶解情形';
        qd.question=item.q;
        qd.answer=item.a;
        qd.displayMode='text';
        qd.optionClass='bin-opt';
        const pool=STATUS_OPTS.filter(s=>s!==item.a);
        qd.forcedOpts=shuffle(pool.concat([item.a]));
        return true;
    }

    function gen29(qd){
        const item=pick(AGX_DATA.filter(x=>x.f!=='AgF'));
        const mode=pick(['dilNH3','concNH3','s2o3']);
        qd.type='鹵化銀溶解特性';
        if(mode==='dilNH3'){
            qd.question=`${fmtF(item.f)} 能否溶於稀氨水？`;
            qd.answer=agxBin(item.dilNH3);
        }else if(mode==='concNH3'){
            qd.question=`${fmtF(item.f)} 能否溶於濃氨水？`;
            qd.answer=agxBin(item.concNH3);
        }else{
            qd.question=`${fmtF(item.f)} 能否溶於 S₂O₃²⁻ 溶液？`;
            qd.answer=agxBin(item.s2o3);
        }
        qd.displayMode='text';
        qd.optionClass='bin-opt';
        qd.forcedOpts=shuffle(['可溶','難溶']);
        return true;
    }

    function gen30(qd){
        const rev=Math.random()<0.4;
        const colors=[...new Set(FLAME_COLORS.map(x=>x.c))];
        if(rev){
            const col=pick(colors.filter(c=>c!=='無色'));
            const pool=FLAME_COLORS.filter(x=>x.c===col);
            const correct=pick(pool);
            qd.type='焰色反應（反向）';
            qd.question=`焰色反應呈「${col}」的離子為何？`;
            qd.answer=correct.l;
            qd.displayMode='ion';
            qd.optionClass='chem-opt';
            qd.forcedOpts=mkOpts4(correct.l,pickN(FLAME_COLORS.filter(x=>x.c!==col),3,x=>x.id).map(x=>x.l));
            return true;
        }
        const item=pick(FLAME_COLORS);
        qd.type='焰色反應';
        qd.question=`${item.l} 的焰色為何？`;
        qd.answer=item.c;
        qd.displayMode='text';
        qd.forcedOpts=mkOpts4(item.c,colors.filter(c=>c!==item.c));
        return true;
    }

    function gen31(qd){
        const co3=ANIONS.find(a=>a.id==='CO32-');
        if(!co3)return false;
        if(Math.random()<0.45){
            qd.type='碳酸根沉澱規則';
            qd.question='依沉澱表，CO₃²⁻ 與<strong>多數</strong>金屬陽離子（不含 IA⁺、NH₄⁺）混合後，通常會？';
            qd.answer='沉澱';
            qd.displayMode='text';
            qd.optionClass='bin-opt';
            qd.forcedOpts=shuffle(['可溶','沉澱']);
            return true;
        }
        const solubleCats=CATIONS.filter(c=>IA.has(c.elem)||c.id==='NH4+'||c.id==='H+');
        const insolCats=CATIONS.filter(c=>!IA.has(c.elem)&&c.id!=='NH4+'&&c.id!=='H+'&&PRECIP_PAIRS.some(p=>p.an.id==='CO32-'&&p.cat.id===c.id));
        if(Math.random()<0.5&&insolCats.length){
            const cat=pick(insolCats);
            qd.type='碳酸根沉澱判斷';
            qd.question=`${cat.label} 與 CO₃²⁻ 混合後，生成物在水中的溶解情形通常為？`;
            qd.answer='沉澱';
            qd.displayMode='text';
            qd.optionClass='bin-opt';
            qd.forcedOpts=shuffle(['可溶','沉澱']);
            return true;
        }
        if(!solubleCats.length)return false;
        const cat=pick(solubleCats);
        qd.type='碳酸根沉澱（例外）';
        qd.question=`${cat.label} 與 CO₃²⁻ 混合後，生成物在水中的溶解情形通常為？`;
        qd.answer='可溶';
        qd.displayMode='text';
        qd.optionClass='bin-opt';
        qd.forcedOpts=shuffle(['可溶','沉澱']);
        return true;
    }

    const GEN_MAP={21:gen21,22:gen22,23:gen23,24:gen24,25:gen25,26:gen26,27:gen27,28:gen28,29:gen29,30:gen30,31:gen31};

    return {
        generate(type,qd){
            const fn=GEN_MAP[type];
            if(!fn||!fn(qd))return false;
            if(type>=21)qd.useChemFormat=true;
            const cleanPrompt = String(qd.question || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
            const cleanAnswer = String(qd.answer == null ? '' : qd.answer).replace(/<[^>]+>/g, '').trim();
            let rule = '';
            if (/離子配對沉澱/.test(qd.type || '')) {
                rule = `逐一配對題幹離子與「${cleanAnswer}」；依沉澱表的可溶性與顏色條件，只有符合題幹觀察的配對成立`;
            } else if (/溶解情形|特殊溶解/.test(qd.type || '')) {
                rule = `先辨認題幹中的鹽類或離子，再套用硝酸鹽、醋酸鹽、鹼金屬／銨鹽及題目指定例外；本題判定為「${cleanAnswer}」`;
            } else if (/沉澱物顏色/.test(qd.type || '')) {
                rule = `由題幹化學式辨識沉澱種類，再核對沉澱顏色資料；本題觀察為「${cleanAnswer}」`;
            } else if (/離子溶液顏色/.test(qd.type || '')) {
                rule = `依題幹水溶液中的實際離子辨識顏色；本題離子顏色為「${cleanAnswer}」`;
            } else if (/酸溶出氣體/.test(qd.type || '')) {
                rule = /SO₃|亞硫酸/.test(cleanPrompt)
                    ? `亞硫酸根遇酸先生成 H₂SO₃，再分解放出 ${cleanAnswer}`
                    : `碳酸根遇酸先生成 H₂CO₃，再分解放出 ${cleanAnswer}`;
            } else if (/鉻酸鹽加酸變色/.test(qd.type || '')) {
                rule = '酸化使 2 CrO₄²⁻ ⇌ Cr₂O₇²⁻ 平衡向右，黃色鉻酸根轉為橙色二鉻酸根';
            } else if (/強酸溶解/.test(qd.type || '')) {
                rule = /CO₃|碳酸/.test(cleanPrompt)
                    ? `酸提供 H⁺ 消耗 CO₃²⁻，生成 CO₂↑，故${cleanAnswer}`
                    : /SO₃|亞硫酸/.test(cleanPrompt)
                        ? `酸提供 H⁺ 消耗 SO₃²⁻，生成 SO₂↑，故${cleanAnswer}`
                        : `酸化使沉澱陰離子轉為較易溶物種，依題目條件判定為${cleanAnswer}`;
            } else if (/強鹼溶解/.test(qd.type || '')) {
                const complexByPrecip = {
                    'Al(OH)₃':'Al(OH)₄⁻', 'Zn(OH)₂':'Zn(OH)₄²⁻', 'Pb(OH)₂':'Pb(OH)₄²⁻',
                    'Cr(OH)₃':'Cr(OH)₄⁻', 'Be(OH)₂':'Be(OH)₄²⁻', 'Sn(OH)₂':'Sn(OH)₄²⁻'
                };
                const amphKey = Object.keys(complexByPrecip).find(k => cleanPrompt.includes(k));
                rule = amphKey
                    ? `${amphKey} 為兩性氫氧化物，加入過量 OH⁻ 形成 ${complexByPrecip[amphKey]}，故${cleanAnswer}`
                    : `依氫氧化物兩性與過量 OH⁻ 的錯離子規則，判定為${cleanAnswer}`;
            } else if (/特殊錯離子|氨錯離子|過量氨水/.test(qd.type || '')) {
                rule = /特殊錯離子/.test(qd.type || '')
                    ? `過量 NaOH 或 NH₃ 提供配體，兩性氫氧化物或金屬離子形成題目所列錯離子 ${cleanAnswer}`
                    : /氨錯離子/.test(qd.type || '')
                        ? `過量 NH₃ 以配位鍵取代水分子，形成題目所列錯離子 ${cleanAnswer}`
                        : `比較沉澱與過量 NH₃ 的配位溶解性；依題幹物種判定為${cleanAnswer}`;
            } else if (/鹵化銀/.test(qd.type || '')) {
                const halide = cleanPrompt.match(/Ag(?:Cl|Br|I|F)/)?.[0] || '該鹵化銀';
                rule = `${halide} 的溶解性依鹵化銀例外及題目指定試劑判斷，結果為${cleanAnswer}`;
            } else if (/焰色反應/.test(qd.type || '')) {
                rule = `由金屬離子受熱激發的特徵放光辨識；題目離子對應${cleanAnswer}`;
            } else if (/碳酸根沉澱/.test(qd.type || '')) {
                rule = /例外/.test(qd.type || '')
                    ? 'CO₃²⁻ 通常難溶，但 IA⁺ 與 NH₄⁺ 的鹽為可溶例外'
                    : 'CO₃²⁻ 與多數金屬陽離子形成難溶鹽，先排除 IA⁺ 與 NH₄⁺ 例外';
            }
            qd._precipContext = {
                subtype: qd.type,
                prompt: cleanPrompt,
                rule: rule || `依題幹「${cleanPrompt}」所指定的沉澱表條件判定「${cleanAnswer}」`
            };
            return true;
        },
        STATUS_LABEL,ALL_PAIRS,PRECIP_PAIRS
    };
})();

// --- 數據校準：化學邏輯運算引擎 ---
const QUIZ_HELPER = {
    // 1. 解析電子組態字串
    parse: (configStr) => {
        const parts = configStr.split(' ');
        const result = [];
        parts.forEach(p => {
            const m = p.match(/(\d)([spdf])(\d+)/);
            if (m) result.push({ n: parseInt(m[1]), type: m[2], count: parseInt(m[3]) });
        });
        return result;
    },

    // 修正版：考量過渡金屬與主族差異的價電子計算
    getValence: (parsed, target) => {
        if (!target) return 0;
        const i = target.iupac;
        if (target.s === 'He') return 2;
        // 1. 第 3-11 族 (過渡金屬)：價電子 = 族號 (即 (n-1)d + ns)
        if (i >= 3 && i <= 11) return i;
        // 2. 第 12 族 (Zn, Cd, Hg)：d 軌域已滿不計，價電子 = 2
        if (i === 12) return 2;
        // 3. 第 1-2 族與 13-18 族 (主族)：價電子 = 族號個位數
        return i > 10 ? i - 10 : i;
    },

    // 計算特定軌域 (s, p, d, f) 的電子總數
    getOrbitalSum: (parsed, type) => {
        return parsed.filter(o => o.type === type).reduce((sum, o) => sum + o.count, 0);
    },

    // 3. 計算未成對電子數 (洪德定則)
    getUnpaired: (parsed) => {
        let totalUnpaired = 0;
        const capacity = { s: 2, p: 6, d: 10, f: 14 };
        parsed.forEach(o => {
            const cap = capacity[o.type];
            if (o.count > 0 && o.count < cap) {
                const half = cap / 2;
                totalUnpaired += (o.count <= half) ? o.count : (cap - o.count);
            }
        });
        return totalUnpaired;
    },

    // 4. 取得合理的離子電荷 (依據台灣高中化學常見價態)
    getRandomCharge: (target) => {
        const i = target.iupac;
        const sym = target.s;
        if (sym === 'H') return 1; 
        if (i === 1) return 1;  // 1A: +1
        if (i === 2) return 2;  // 2A: +2
        if (i === 13) return 3; // 3A: +3
        if (i === 15) return -3; // 5A: -3
        if (i === 16) return -2; // 6A: -2
        if (i === 17) return -1; // 7A: -1
        if (target.type.includes("過渡")) return (Math.random() > 0.5 ? 2 : 3); // 過渡金屬常見 +2, +3
        return 0;
    },

    // 5. 電負度處理 (排除惰性氣體與無數據元素)
    getEN: (symbol) => {
        const props = ELEMENT_PROPS[symbol];
        if (!props || props.en === undefined) return null;
        // 排除惰性氣體 (He, Ne, Ar, Kr, Xe, Rn)
        if (['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'].includes(symbol)) return null;
        return props.en;
    }// 6. 狀態資料標準化 (解決 Mn 等元素判斷 Bug)
    ,getCleanState: (state) => {
        if (!state) return "未知";
        const s = state.trim();
        if (s.includes("固") || s.includes("金屬")) return "固態";
        if (s.includes("液")) return "液態";
        if (s.includes("氣")) return "氣態";
        return s;
    },
    // 7. 尋找等電子粒子夥伴
    getIsoelectronicParticle: (electrons, excludeZ) => {
        const candidates = ELECTRON_DATA.filter(el => {
            const charge = el.z - electrons;
            return Math.abs(charge) <= 3 && el.z !== excludeZ;
        });
        if (candidates.length === 0) return null;
        const picked = candidates[Math.floor(Math.random() * candidates.length)];
        const c = picked.z - electrons;
        const sign = c === 0 ? "" : (c > 0 ? (c===1?"+":`${c}+`) : (c===-1?"-":`${Math.abs(c)}-`));
        return `${picked.s}<sup>${sign}</sup>`;
    },
    // 8. 計算原子氧化數（傳統氧化數規則）
    calculateAtomOxidationNumber: (targetAtomIdx, atomsRaw, bondsRaw, molCharge) => {
        if (!atomsRaw || !bondsRaw || targetAtomIdx < 0 || targetAtomIdx >= atomsRaw.length) return 0;
        const targetAtom = atomsRaw[targetAtomIdx];
        const elem = targetAtom.elem;
        const charge = molCharge || 0;
        const elemCounts = {};
        atomsRaw.forEach(a => { elemCounts[a.elem] = (elemCounts[a.elem] || 0) + 1; });
        const fixedOx = { 'H': 1, 'O': -2, 'F': -1, 'Cl': -1, 'Br': -1, 'I': -1 };
        if (elem === 'H') {
            const hasMoreEN = atomsRaw.some(a => ['N','O','F','Cl','Br','I','S'].includes(a.elem));
            return hasMoreEN ? 1 : -1;
        }
        if (elem === 'O') {
            const hasF = atomsRaw.some(a => a.elem === 'F');
            if (hasF) return 2;
            const hasOnlyO = atomsRaw.every(a => a.elem === 'O');
            const peroxideLike = elemCounts['O'] === 2 && elemCounts['H'] === 2;
            if (peroxideLike) return -1;
            if (hasOnlyO) return 0;
            return -2;
        }
        if (elem === 'F') return -1;
        let knownSum = 0;
        let unknownCount = 0;
        let unknownElem = null;
        for (const e in elemCounts) {
            if (fixedOx[e] !== undefined) {
                let ox = fixedOx[e];
                if (e === 'H') { const hasMoreEN = atomsRaw.some(a => ['N','O','F','Cl','Br','I','S'].includes(a.elem)); ox = hasMoreEN ? 1 : -1; }
                if (e === 'O') { const peroxideLike = elemCounts['O'] === 2 && elemCounts['H'] === 2; ox = peroxideLike ? -1 : -2; }
                knownSum += ox * elemCounts[e];
            } else {
                unknownCount++;
                unknownElem = e;
            }
        }
        if (unknownCount === 1 && unknownElem === elem) {
            return (charge - knownSum) / elemCounts[elem];
        }
        const props = ELEMENT_PROPS[elem];
        const enSelf = props ? (props.en || 0) : 0;
        let oxState = 0;
        bondsRaw.forEach(b => {
            if (b[0] === targetAtomIdx || b[1] === targetAtomIdx) {
                const otherIdx = (b[0] === targetAtomIdx) ? b[1] : b[0];
                const otherAtom = atomsRaw[otherIdx];
                if (!otherAtom) return;
                const enOther = ELEMENT_PROPS[otherAtom.elem]?.en || 0;
                const bType = b[2] || "single";
                let lines = bType.includes("triple") ? 3 : (bType.includes("double") ? 2 : 1);
                if (bType.includes("coordinate")) lines = bType.includes("triple") ? 3 : (bType.includes("double") ? 2 : 1);
                if (elem === otherAtom.elem) oxState += 0;
                else oxState += (enSelf > enOther) ? -lines : lines;
            }
        });
        return oxState;
    }
};

// --- Modal 校準模式控制功能 ---
function openConfigModal() { 
    const modal = document.getElementById('config-modal'); 
    if(modal) { modal.style.display = 'flex'; renderConfigList(); } 
}

function closeConfigModal() { 
    const modal = document.getElementById('config-modal'); 
    if(modal) modal.style.display = 'none'; 
}

function resetConfigList() {
    var input = document.getElementById('configSearchInput');
    if (input) { input.value = ''; renderConfigList(); }
    var list = document.getElementById('configListContainer');
    if (list) list.scrollTop = 0;
}

function openCalibrationModal() {
    const modal = document.getElementById('calibration-modal');
    if (modal) {
        modal.style.display = 'flex';
        if (typeof pauseSystem === 'function') pauseSystem();
        resetToDifficultySelection();
    }
}

function closeCalibrationModal() {
    const modal = document.getElementById('calibration-modal');
    if (modal) modal.style.display = 'none';
    if (typeof resumeSystem === 'function') resumeSystem();
    resetToDifficultySelection();
}

window.resetToDifficultySelection = function() {
    const preserveKnowledge = arguments[0] && arguments[0].preserveKnowledge === true;
    const preserveExtension = arguments[0] && arguments[0].preserveExtension === true;
    document.getElementById('quiz-result-area').style.display = 'none';
    document.getElementById('quiz-setup-area').style.display = 'none';
    document.getElementById('quiz-content-area').style.display = 'none';
    document.getElementById('hybrid-type-select-area').style.display = 'none';
    document.getElementById('electron-type-select-area').style.display = 'none';
    document.getElementById('precip-type-select-area').style.display = 'none';
    document.getElementById('formula-type-select-area').style.display = 'none';
    const extensionArea = document.getElementById('extension-subtype-select-area');
    if (extensionArea) extensionArea.style.display = 'none';
    const knowledgeCategoryArea = document.getElementById('knowledge-category-area');
    const knowledgeTypeArea = document.getElementById('knowledge-constant-type-select-area');
    const knowledgeModeArea = document.getElementById('knowledge-mode-select-area');
    if (knowledgeCategoryArea) knowledgeCategoryArea.style.display = 'none';
    if (knowledgeTypeArea) knowledgeTypeArea.style.display = 'none';
    if (knowledgeModeArea) knowledgeModeArea.style.display = 'none';
    const periodicModeSelect = document.getElementById('periodic-mode-select');
    if (periodicModeSelect) periodicModeSelect.style.display = 'none';
    document.getElementById('difficulty-grid').style.setProperty('display', 'none', 'important');
    document.getElementById('cal-category-area').style.display = 'grid';
    document.getElementById('quiz-cancel-btn').style.display = 'none';
    const stText = document.getElementById('quiz-status-text');
    if(stText) stText.textContent = 'Select Category';
    if(window.quizState) {
        window.quizState.askedZ = [];
        window.quizState.askedQuestions = [];
        window.quizState.currentQ = 0;
        window.quizState.correctCount = 0;
        window.quizState.typeDeck = [];
    }
    window.formulaSelectedTypes = null;
    if (!preserveKnowledge) {
        window.knowledgeSelectedSubtypes = null;
        window.knowledgeMode = null;
        window.knowledgeTopic = null;
    }
    if (!preserveExtension) {
        window.extensionSelectedSubtypes = null;
        window.extensionCategory = null;
    }
    document.querySelectorAll('#formula-type-cards .hybrid-type-card').forEach(card => card.classList.add('selected'));
    document.querySelectorAll('#knowledge-constant-type-cards .hybrid-type-card').forEach(card => card.classList.add('selected'));
    renderCalibrationRuler(0, window.quizState && window.quizState.totalQ ? window.quizState.totalQ : 10);
};

// --- 週期表粒子模型 ---------------------------------------------------------
// 週期表題可以使用假想離子，但只允許可讀、可計算且不會產生負電子數的電荷。
const PERIODIC_PARTICLE_MAX_CHARGE = 4;
const PERIODIC_PARTICLE_CHARGES = Object.freeze([-4, -3, -2, -1, 0, 1, 2, 3, 4]);

function periodicDataPremise(element) {
    return element && Number(element.z) >= 104 ? '依本系統週期表資料，' : '';
}

function periodicChargeText(charge) {
    const q = Number(charge) || 0;
    if (!q) return '';
    const sign = q > 0 ? '+' : '-';
    const magnitude = Math.abs(q);
    return `<sup class="chem-sup">${magnitude === 1 ? '' : magnitude}${sign}</sup>`;
}

function periodicParticleLabel(particle) {
    if (!particle || !particle.element) return '';
    return `${particle.element.s}${periodicChargeText(particle.q)}`;
}

function periodicNuclideLabel(particle) {
    if (!particle || !particle.element) return '';
    return `<sup class="nuclide-mass">${particle.a}</sup>${particle.element.s}${periodicChargeText(particle.q)}`;
}

function periodicMassNumber(element) {
    if (!element) return null;
    // data_static.js is loaded before this file; also accept a window property so
    // the particle generator remains usable when scripts are bundled separately.
    const massTable = (typeof PERIODIC_MASS_NUMBERS !== 'undefined' && PERIODIC_MASS_NUMBERS)
        || (typeof window !== 'undefined' && window.PERIODIC_MASS_NUMBERS)
        || null;
    const a = Number(massTable && massTable[element.s]);
    return Number.isInteger(a) && a >= Number(element.z) ? a : null;
}

function periodicMakeParticle(element, charge, massNumber) {
    if (!element) return null;
    const q = Number(charge) || 0;
    const z = Number(element.z);
    const a = Number.isInteger(Number(massNumber)) ? Number(massNumber) : periodicMassNumber(element);
    if (!Number.isInteger(z) || !Number.isInteger(a) || a < z || Math.abs(q) > PERIODIC_PARTICLE_MAX_CHARGE) return null;
    const electrons = z - q;
    if (electrons <= 0) return null;
    return { element, z, a, q, p: z, e: electrons, n: a - z };
}

function periodicRandomParticle(element, excludeCharge) {
    const charges = calibrationShuffle(PERIODIC_PARTICLE_CHARGES.filter(q => q !== excludeCharge));
    for (const q of charges) {
        const particle = periodicMakeParticle(element, q);
        if (particle) return particle;
    }
    return periodicMakeParticle(element, 0);
}

function periodicParseParticle(value, pool) {
    const plain = calibrationPlainElement(value)
        .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, ch => String('⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(ch)))
        .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, ch => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(ch)))
        .replace(/\s+/g, '');
    const match = plain.match(/^([A-Z][a-z]?)(?:(\d+)?([+-]))?$/);
    if (!match) return null;
    const list = Array.isArray(pool) ? pool : [];
    const element = list.find(el => el.s === match[1]);
    if (!element) return null;
    const magnitude = match[3] ? Number(match[2] || 1) : 0;
    const q = match[3] ? (match[3] === '+' ? magnitude : -magnitude) : 0;
    return periodicMakeParticle(element, q);
}

function periodicParticleReason(particle) {
    if (!particle) return '粒子表示無法解析';
    const qText = particle.q === 0 ? '0' : `${particle.q > 0 ? '+' : ''}${particle.q}`;
    return `${particle.element.s} 的原子序 Z=${particle.z}、電荷 q=${qText}，所以質子 ${particle.p}、電子 ${particle.e}、中子 ${particle.n}`;
}

function periodicParticleOptions(quizData, correctParticle, predicate, reasonFn) {
    const pool = window.quizState && Array.isArray(window.quizState.pool) ? window.quizState.pool : [];
    const mode = quizData._periodicParticleMode || 'full';
    const allCandidates = [];
    const seen = new Set([periodicParticleLabel(correctParticle)]);
    for (const element of calibrationShuffle(pool)) {
        for (const q of calibrationShuffle(PERIODIC_PARTICLE_CHARGES)) {
            const particle = periodicMakeParticle(element, q);
            if (!particle || !predicate(particle) || seen.has(periodicParticleLabel(particle))) continue;
            seen.add(periodicParticleLabel(particle));
            const pGap = Math.abs(particle.p - correctParticle.p);
            const nGap = Math.abs(particle.n - correctParticle.n);
            const eGap = Math.abs(particle.e - correctParticle.e);
            const zGap = Math.abs(particle.z - correctParticle.z);
            const changedFields = [pGap, nGap, eGap].filter(gap => gap > 0).length;
            let score = 0;
            if (particle.z === correctParticle.z) score += 40; // 忘記電荷或正負號
            else if (zGap === 1) score += 24;
            else if (zGap === 2) score += 15;
            else if (zGap <= 4) score += 7;
            if (mode === 'isoelectronic') {
                if (eGap === 1) score += 28;
                else if (eGap === 2) score += 18;
                else if (eGap <= 4) score += 8;
            } else {
                if (changedFields === 1) score += 24; // 只在最後一個粒子數判斷出錯
                if (pGap === 1) score += 8;
                if (nGap === 1) score += 8;
                if (eGap === 1) score += 8;
            }
            allCandidates.push({
                value: periodicParticleLabel(particle),
                reason: reasonFn(particle),
                _particle: particle,
                score,
                zGap
            });
        }
    }
    if (allCandidates.length < 3) return false;
    const ranked = calibrationShuffle(allCandidates).sort((a, b) => b.score - a.score);
    const selected = [];
    const add = entry => {
        if (entry && !selected.some(item => calibrationOptionKey(item.value) === calibrationOptionKey(entry.value))) {
            selected.push(entry);
        }
    };
    // 至少保留一個同元素不同電荷的陷阱，再混入鄰近原子序與一般近鄰粒子。
    add(ranked.find(entry => entry._particle.z === correctParticle.z));
    add(ranked.find(entry => entry._particle.z !== correctParticle.z && entry.zGap <= 2));
    add(ranked.find(entry => entry._particle.z !== correctParticle.z && entry.zGap <= 4));
    for (const entry of ranked) {
        if (selected.length >= 3) break;
        add(entry);
    }
    const candidates = selected.slice(0, 3);
    if (candidates.length < 3) return false;
    quizData.forcedOpts = calibrationShuffle([
        periodicParticleLabel(correctParticle),
        ...candidates.map(entry => entry.value)
    ]);
    quizData.optionRationales = {};
    candidates.forEach(entry => { quizData.optionRationales[calibrationOptionKey(entry.value)] = entry.reason; });
    quizData._periodicOptionParticles = {
        [calibrationOptionKey(periodicParticleLabel(correctParticle))]: correctParticle,
        ...Object.fromEntries(candidates.map(entry => [calibrationOptionKey(entry.value), entry._particle]))
    };
    return true;
}

window.restartCalibrationSameSettings = function() {
    if (!window.quizState || typeof window.quizState.generateTypeDeck !== 'function') return;
    const resultArea = document.getElementById('quiz-result-area');
    const contentArea = document.getElementById('quiz-content-area');
    if (resultArea) resultArea.style.display = 'none';
    if (contentArea) contentArea.style.display = 'grid';
    window.quizState.currentQ = 0;
    window.quizState.correctCount = 0;
    window.quizState.askedZ = [];
    window.quizState.askedQuestions = [];
    window.quizState.typeDeck = [];
    if (window.quizViewer) {
        if (window.quizViewer.animFrame) cancelAnimationFrame(window.quizViewer.animFrame);
        window.removeEventListener('mousemove', window.quizViewer._onMove);
        window.removeEventListener('mouseup', window.quizViewer._onUp);
        window.removeEventListener('touchmove', window.quizViewer._onMove);
        window.removeEventListener('touchend', window.quizViewer._onUp);
        window.quizViewer = null;
    }
    renderCalibrationRuler(0, window.quizState.totalQ);
    window.initiateCalibration();
};

window.adjustCalibrationSettings = function() {
    const category = window.calCategory || 'periodic';
    if (window.CALIBRATION_EXTENSION_CATEGORIES?.[category]) {
        window.resetToDifficultySelection({ preserveExtension: true });
        window.selectCalCategory(category);
        return;
    }
    if (category === 'knowledge') {
        window.resetToDifficultySelection({ preserveKnowledge: true });
        window.selectCalCategory(category);
        window.selectKnowledgeTopic(window.knowledgeTopic || 'constants');
        return;
    }
    window.resetToDifficultySelection();
    window.selectCalCategory(category);
};

window.handleCalibrationBack = function() {
    if (window.extensionCategory) {
        const setup = document.getElementById('quiz-setup-area');
        const types = document.getElementById('extension-subtype-select-area');
        if (setup && setup.style.display !== 'none') {
            setup.style.display = 'none';
            if (types) types.style.display = 'flex';
            const cfg = window.CALIBRATION_EXTENSION_CATEGORIES?.[window.extensionCategory];
            document.getElementById('quiz-status-text').textContent = `${cfg?.label || '新章節'} > 選擇子題型`;
        } else {
            window.resetToDifficultySelection();
        }
        return;
    }
    if (window.calCategory !== 'knowledge') {
        window.resetToDifficultySelection();
        return;
    }
    const setup = document.getElementById('quiz-setup-area');
    const modeArea = document.getElementById('knowledge-mode-select-area');
    const typeArea = document.getElementById('knowledge-constant-type-select-area');
    const topicArea = document.getElementById('knowledge-category-area');
    if (setup && setup.style.display !== 'none') {
        setup.style.display = 'none';
        if (modeArea) modeArea.style.display = 'flex';
        document.getElementById('quiz-status-text').textContent = '知識校準 > 常數 > 選擇範圍';
    } else if (modeArea && modeArea.style.display !== 'none') {
        modeArea.style.display = 'none';
        if (typeArea) typeArea.style.display = 'flex';
        document.getElementById('quiz-status-text').textContent = '知識校準 > 常數 > 選擇題型';
    } else if (typeArea && typeArea.style.display !== 'none') {
        typeArea.style.display = 'none';
        if (topicArea) topicArea.style.display = 'flex';
        document.getElementById('quiz-status-text').textContent = '知識校準 > 選擇子項目';
    } else {
        window.resetToDifficultySelection();
    }
};

window.selectKnowledgeTopic = function(topic) {
    if (topic !== 'constants') return;
    window.knowledgeTopic = topic;
    const topicArea = document.getElementById('knowledge-category-area');
    const typeArea = document.getElementById('knowledge-constant-type-select-area');
    if (topicArea) topicArea.style.display = 'none';
    if (typeArea) typeArea.style.display = 'flex';
    document.getElementById('quiz-status-text').textContent = '知識校準 > 常數 > 選擇題型';
    const selected = window.knowledgeSelectedSubtypes || {
        particles: true, gas: true, phase: true, units: true, acidBase: true, hydrogen: true
    };
    window.knowledgeSelectedSubtypes = selected;
    document.querySelectorAll('#knowledge-constant-type-cards .hybrid-type-card').forEach(card => {
        card.classList.toggle('selected', selected[card.dataset.type] === true);
    });
};

window.toggleKnowledgeSubtype = function(card) {
    card.classList.toggle('selected');
};

window.confirmKnowledgeSubtypes = function() {
    const cards = document.querySelectorAll('#knowledge-constant-type-cards .hybrid-type-card');
    const selected = {};
    cards.forEach(card => { if (card.classList.contains('selected')) selected[card.dataset.type] = true; });
    if (Object.keys(selected).length === 0) {
        const button = document.getElementById('knowledge-subtype-confirm-btn');
        if (!button) return;
        const original = button.textContent;
        button.textContent = '請至少選擇一項！';
        button.style.background = '#ef4444';
        button.style.color = '#fff';
        setTimeout(() => { button.textContent = original; button.style.background = ''; button.style.color = ''; }, 1800);
        return;
    }
    window.knowledgeSelectedSubtypes = selected;
    document.getElementById('knowledge-constant-type-select-area').style.display = 'none';
    document.getElementById('knowledge-mode-select-area').style.display = 'flex';
    document.getElementById('quiz-status-text').textContent = '知識校準 > 常數 > 選擇範圍';
};

window.selectKnowledgeMode = function(mode) {
    window.knowledgeMode = mode === 'deep' ? 'deep' : 'common';
    const modeArea = document.getElementById('knowledge-mode-select-area');
    if (modeArea) modeArea.style.display = 'none';
    document.getElementById('quiz-setup-area').style.display = 'flex';
    document.getElementById('quiz-status-text').textContent = `常數｜${window.knowledgeMode === 'deep' ? '深度' : '常用'} > 選擇題數`;
    if (typeof window.updateSetupButtons === 'function') window.updateSetupButtons();
};

window.selectCalCategory = function(cat) {
    window.calCategory = cat;
    document.getElementById('cal-category-area').style.display = 'none';
    const catNameMap = { 'periodic': '週期表', 'electron': '電子組態', 'hybrid': '混成', 'redox': '氧化還原', 'precipitation': '沉澱表', 'formula': '化學式', 'knowledge': '知識校準', ...(window.CALIBRATION_EXTENSION_CATEGORIES ? Object.fromEntries(Object.entries(window.CALIBRATION_EXTENSION_CATEGORIES).map(([key, value]) => [key, value.label])) : {}) };
    document.getElementById('quiz-cancel-btn').style.display = 'block';

    if (window.CALIBRATION_EXTENSION_CATEGORIES?.[cat]) {
        const prevTotal = (window.quizState && window.quizState.totalQ) ? window.quizState.totalQ : 10;
        const cfg = window.CALIBRATION_EXTENSION_CATEGORIES[cat];
        const sameExtension = window.extensionCategory === cat;
        window.extensionCategory = cat;
        window.extensionSelectedSubtypes = sameExtension && window.extensionSelectedSubtypes
            ? window.extensionSelectedSubtypes
            : Object.fromEntries(cfg.subtypes.map(item => [item.id, true]));
        window.quizState = { rank: null, difficulty: cfg.difficulty, totalQ: prevTotal, currentQ: 0, correctCount: 0, pool: [], askedZ: [], typeDeck: [], askedQuestions: [] };
        window.quizState.generateTypeDeck = window._generateTypeDeck;
        const area = document.getElementById('extension-subtype-select-area');
        area.innerHTML = `<span class="setup-label">${cfg.label}子題型（可複選，至少一種）</span><div id="extension-subtype-cards" style="display:flex;flex-direction:column;gap:10px;">${cfg.subtypes.map(item => `<button type="button" class="hybrid-type-card ${window.extensionSelectedSubtypes[item.id] ? 'selected' : ''}" style="font:inherit;text-align:left;width:100%;" data-type="${item.id}" aria-pressed="${!!window.extensionSelectedSubtypes[item.id]}" onclick="toggleCalibrationExtensionSubtype(this)"><span class="hybrid-type-check"><span class="hybrid-type-check-mark">✓</span></span><span><span class="hybrid-type-name">${item.label}${item.required ? ' <small style="color:#94a3b8">必修</small>' : ' <small style="color:#fbbf24">選修</small>'}</span><span class="hybrid-type-desc">${item.description}</span></span></button>`).join('')}</div><small style="color:#64756f;line-height:1.6">每個子題型都由多種題幹與詳解模板搭配資料生成；可選題數依有效且不重複的組合數開放。</small><button type="button" class="start-cal-btn" id="extension-subtype-confirm-btn" onclick="confirmCalibrationExtensionSubtypes()">確認子題型，繼續 ▸</button>`;
        area.style.display = 'flex';
        document.getElementById('quiz-status-text').textContent = `${cfg.label} > 選擇子題型`;
        return;
    }

    if (cat === 'knowledge') {
        const prevTotal = (window.quizState && window.quizState.totalQ) ? window.quizState.totalQ : 10;
        window.quizState = {
            rank: null, difficulty: 7, totalQ: prevTotal, currentQ: 0, correctCount: 0,
            pool: [], askedZ: [], typeDeck: [], askedQuestions: []
        };
        window.quizState.generateTypeDeck = window._generateTypeDeck;
        if (!window.knowledgeSelectedSubtypes) {
            window.knowledgeSelectedSubtypes = { particles: true, gas: true, phase: true, units: true, acidBase: true, hydrogen: true };
        }
        if (!window.knowledgeTopic) window.knowledgeTopic = 'constants';
        document.getElementById('knowledge-category-area').style.display = 'flex';
        document.getElementById('quiz-status-text').textContent = '知識校準 > 選擇子項目';
        return;
    }

    if (cat === 'hybrid' || cat === 'redox' || cat === 'precipitation' || cat === 'formula') {
        const diffMap = { 'hybrid': 3, 'redox': 4, 'precipitation': 5, 'formula': 6 };
        const diff = diffMap[cat];
        const prevTotal = (window.quizState && window.quizState.totalQ) ? window.quizState.totalQ : 10;
        window.quizState = {
            rank: null, difficulty: diff, totalQ: prevTotal, currentQ: 0, correctCount: 0,
            pool: [], askedZ: [], typeDeck: [], askedQuestions: []
        };
        window.quizState.generateTypeDeck = window._generateTypeDeck;
        if (cat === 'hybrid') {
            document.getElementById('hybrid-type-select-area').style.display = 'flex';
            document.getElementById('quiz-status-text').textContent = '混成 > 選擇題型';
        } else if (cat === 'precipitation') {
            document.getElementById('precip-type-select-area').style.display = 'flex';
            document.getElementById('quiz-status-text').textContent = '沉澱表 > 選擇題型';
        } else if (cat === 'formula') {
            document.getElementById('formula-type-select-area').style.display = 'flex';
            document.getElementById('quiz-status-text').textContent = '化學式 > 選擇題型';
        } else {
            document.getElementById('quiz-setup-area').style.display = 'flex';
            document.getElementById('quiz-status-text').textContent = `${catNameMap[cat]} > 選擇題數`;
            setTimeout(() => { if (typeof window.updateSetupButtons === 'function') window.updateSetupButtons(); }, 50);
        }
    } else if (cat === 'electron') {
        document.getElementById('electron-type-select-area').style.display = 'flex';
        document.getElementById('quiz-status-text').textContent = '電子組態 > 選擇題型';
    } else {
        document.getElementById('difficulty-grid').style.setProperty('display', 'flex', 'important');
        document.getElementById('quiz-status-text').textContent = `${catNameMap[cat]} > 選擇範圍`;
    }
};

window.toggleCalibrationExtensionSubtype = function(card) {
    card.classList.toggle('selected');
    card.setAttribute('aria-pressed', card.classList.contains('selected') ? 'true' : 'false');
};

window.confirmCalibrationExtensionSubtypes = function() {
    const cards = [...document.querySelectorAll('#extension-subtype-cards .hybrid-type-card')];
    const selected = Object.fromEntries(cards.filter(card => card.classList.contains('selected')).map(card => [card.dataset.type, true]));
    const button = document.getElementById('extension-subtype-confirm-btn');
    if (!Object.keys(selected).length) {
        if (button) { const old = button.textContent; button.textContent = '請至少選擇一項！'; setTimeout(() => { button.textContent = old; }, 1600); }
        return;
    }
    const available = window.CALIBRATION_EXTENSION_ENGINE?.capacity(window.extensionCategory, selected) || 0;
    if (available < 10) {
        if (button) { const old = button.textContent; button.textContent = `所選題庫 ${available} 題，請再選子題型`; setTimeout(() => { button.textContent = old; }, 2200); }
        return;
    }
    window.extensionSelectedSubtypes = selected;
    document.getElementById('extension-subtype-select-area').style.display = 'none';
    document.getElementById('quiz-setup-area').style.display = 'flex';
    const label = window.CALIBRATION_EXTENSION_CATEGORIES[window.extensionCategory].label;
    document.getElementById('quiz-status-text').textContent = `${label} > 選擇題數`;
    if (typeof window.updateSetupButtons === 'function') window.updateSetupButtons();
};

// === Quiz Mini 3D Viewer (與主畫面渲染風格一致) ===
function renderQuizMini(viewer) {
    const svgEl = viewer.svgEl;
    if (!svgEl || !document.body.contains(svgEl)) return;
    const W = 280, H = 240;
    const renderObjects = viewer.renderObjects;
    const bonds = viewer.bonds, atoms = viewer.atoms, hl = viewer.highlightIdx;
    const m = viewer.matrix;

    // 計算 scale（與主畫面 project 同邏輯，但縮放至 mini 尺寸）
    let maxR = 1;
    renderObjects.forEach(o => { maxR = Math.max(maxR, Math.abs(o.x), Math.abs(o.y), Math.abs(o.z||0)); });
    const sc = Math.min(W, H) * 0.33 / (maxR || 1) * (viewer.zoom || 1);

    const proj = o => {
        const x3 = o.x*m[0]+o.y*m[1]+(o.z||0)*m[2];
        const y3 = o.x*m[3]+o.y*m[4]+(o.z||0)*m[5];
        const z3 = o.x*m[6]+o.y*m[7]+(o.z||0)*m[8];
        const s = (600/(600-Math.min(z3*sc,590)))*sc;
        return { px: x3*s+W/2, py: y3*s+H/2, z: z3*sc, scale: s };
    };

    const projRO = renderObjects.map(o => ({ ...o, ...proj(o) }));
    const projAtoms = atoms.map(a => proj(a));

    // 建立渲染清單（鍵 + 原子/電子），按 z 排序
    const list = [];
    bonds.forEach(b => {
        const pa1 = projAtoms[b[0]], pa2 = projAtoms[b[1]];
        if (!pa1||!pa2) return;
        const ro1 = renderObjects.find(o=>o.type==='atom'&&o.originalIndex===b[0]);
        const ro2 = renderObjects.find(o=>o.type==='atom'&&o.originalIndex===b[1]);
        const r1 = (ro1?.r||15)*pa1.scale, r2 = (ro2?.r||15)*pa2.scale;
        list.push({ type:'bond', z:(pa1.z+pa2.z)/2, x1:pa1.px,y1:pa1.py,x2:pa2.px,y2:pa2.py, r1, r2, bt:b[2]||'single' });
    });
    projRO.forEach(o => list.push(o));
    list.sort((a,b)=>a.z-b.z);

    const NS = "http://www.w3.org/2000/svg";
    const mk = tag => document.createElementNS(NS,tag);
    const set = (el,attrs) => { for(const k in attrs) el.setAttribute(k,attrs[k]); return el; };
    svgEl.innerHTML = '';

    // defs：濾鏡 + 漸層
    const defs = mk('defs');
    const glowF = mk('filter'); glowF.setAttribute('id','qmglow');
    glowF.innerHTML='<feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>';
    defs.appendChild(glowF);
    const hlGrad = mk('radialGradient');
    set(hlGrad,{id:'qmhl',cx:'50%',cy:'50%',r:'50%'});
    hlGrad.innerHTML='<stop offset="0%" stop-color="#facc15" stop-opacity="0.6"/><stop offset="100%" stop-color="#facc15" stop-opacity="0"/>';
    defs.appendChild(hlGrad);
    const seenCols=new Set();
    renderObjects.filter(o=>o.type==='atom').forEach(a=>{
        if(seenCols.has(a.color))return; seenCols.add(a.color);
        const id='qmag'+a.color.replace('#','');
        const g=mk('radialGradient');
        set(g,{id,cx:'35%',cy:'35%',r:'60%'});
        g.innerHTML=`<stop offset="0%" stop-color="#fff" stop-opacity="0.95"/><stop offset="40%" stop-color="${a.color}"/><stop offset="100%" stop-color="${adjustColor(a.color,-80)}"/>`;
        defs.appendChild(g);
    });
    svgEl.appendChild(defs);

    list.forEach(obj=>{
        if(obj.type==='bond'){
            const {x1,y1,x2,y2,r1,r2,bt}=obj;
            const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy)||1;
            const nx=dx/len,ny=dy/len,px2=-ny,py2=nx;
            const sh=0.75; // 縮短到原子表面
            const sx1=x1+nx*r1*sh,sy1=y1+ny*r1*sh,sx2=x2-nx*r2*sh,sy2=y2-ny*r2*sh;
            const sep=Math.min(r1,r2)*0.22;
            const bline=(ox,oy,w,da='')=>{
                const l=mk('line');
                const extra = da ? {'stroke-dasharray':da} : {};
                set(l,{x1:(sx1+ox).toFixed(1),y1:(sy1+oy).toFixed(1),x2:(sx2+ox).toFixed(1),y2:(sy2+oy).toFixed(1),stroke:'#fff','stroke-width':w,'stroke-linecap':'round',opacity:'0.65',...extra});
                svgEl.appendChild(l);
            };
            if(bt==='double'){bline(px2*sep,py2*sep,3.5);bline(-px2*sep,-py2*sep,3.5);}
            else if(bt==='triple'){bline(0,0,3);bline(px2*sep*1.8,py2*sep*1.8,2.5);bline(-px2*sep*1.8,-py2*sep*1.8,2.5);}
            else if(bt==='coordinate'){bline(0,0,3.5,'6,3');}
            else{bline(0,0,4);}
        } else if(obj.type==='atom'){
            const isHL = obj.originalIndex===hl;
            const r=obj.r*obj.scale;
            if(isHL){
                const h=set(mk('circle'),{cx:obj.px.toFixed(1),cy:obj.py.toFixed(1),r:(r*2.5).toFixed(1),fill:'url(#qmhl)'});
                svgEl.appendChild(h);
                const ring=set(mk('circle'),{cx:obj.px.toFixed(1),cy:obj.py.toFixed(1),r:(r*1.35).toFixed(1),fill:'none',stroke:'#f59e0b','stroke-width':'2.5',opacity:'0.9'});
                svgEl.appendChild(ring);
            }
            const c=set(mk('circle'),{cx:obj.px.toFixed(1),cy:obj.py.toFixed(1),r:r.toFixed(1),fill:`url(#qmag${obj.color.replace('#','')})`});
            svgEl.appendChild(c);
            const fs=obj.r*0.75*obj.scale;
            const t=set(mk('text'),{x:obj.px.toFixed(1),y:(obj.py+fs*0.38).toFixed(1),'font-size':fs.toFixed(1),'font-weight':'bold',fill:isHL?'#f59e0b':'#fff','text-anchor':'middle','font-family':'monospace','pointer-events':'none'});
            t.textContent=obj.elem;
            svgEl.appendChild(t);
        } else if(obj.type==='electron'){
            const r=obj.r*obj.scale;
            const col=obj.isNegativeCharge?'#ec4899':'#fff';
            svgEl.appendChild(set(mk('circle'),{cx:obj.px.toFixed(1),cy:obj.py.toFixed(1),r:r.toFixed(1),fill:col,opacity:'0.88'}));
        }
    });
}

function startQuizMiniViewer(svgEl, atoms, bonds, highlightIdx, center) {
    if (window.quizViewer) {
        if(window.quizViewer.animFrame) cancelAnimationFrame(window.quizViewer.animFrame);
        window.removeEventListener('mousemove', window.quizViewer._onMove);
        window.removeEventListener('mouseup',   window.quizViewer._onUp);
        window.removeEventListener('touchmove', window.quizViewer._onMove);
        window.removeEventListener('touchend',  window.quizViewer._onUp);
        if(window.quizViewer.svgEl && window.quizViewer._onWheel) window.quizViewer.svgEl.removeEventListener('wheel', window.quizViewer._onWheel);
    }
    // 用 processAtomsData 取得完整渲染物件（含孤對電子）
    const renderObjects = processAtomsData(
        JSON.parse(JSON.stringify(atoms)),
        JSON.parse(JSON.stringify(bonds)),
        center || (atoms[0]&&atoms[0].elem)
    );
    // 標記要高亮的原子
    renderObjects.forEach(o => {
        if(o.type==='atom' && o.originalIndex===highlightIdx) o.isQuizHL = true;
    });
    const hlOrigIdx = highlightIdx;

    const viewer = { svgEl, atoms, bonds, renderObjects, highlightIdx:hlOrigIdx,
        matrix:[1,0,0,0,1,0,0,0,1], rotVel:{x:0,y:0},
        zoom:1, isDragging:false, lastPos:null, animFrame:null };

    const getPos = e => e.touches?{x:e.touches[0].clientX,y:e.touches[0].clientY}:{x:e.clientX,y:e.clientY};
    let _pinchDist = null;
    const onDown = e => {
        viewer.isDragging=true; viewer.rotVel={x:0,y:0}; viewer.lastPos=getPos(e);
        if(e.touches&&e.touches.length===2) _pinchDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
        e.preventDefault();
    };
    const onMove = e => {
        if(!viewer.isDragging)return;
        if(e.touches&&e.touches.length===2){
            const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
            if(_pinchDist) viewer.zoom=Math.max(0.3,Math.min(4,viewer.zoom*(d/_pinchDist)));
            _pinchDist=d; e.preventDefault(); return;
        }
        _pinchDist=null;
        const p=getPos(e);
        const dx=(p.x-viewer.lastPos.x)*0.009, dy=(p.y-viewer.lastPos.y)*0.009;
        viewer.lastPos=p; viewer.rotVel={x:-dy,y:dx};
        const cx=Math.cos(-dy),sx=Math.sin(-dy),cy2=Math.cos(dx),sy2=Math.sin(dx);
        const rx=[1,0,0,0,cx,-sx,0,sx,cx],ry=[cy2,0,sy2,0,1,0,-sy2,0,cy2];
        viewer.matrix=normalizeMatrix(multiplyMatrix(multiplyMatrix(ry,rx),viewer.matrix));
        e.preventDefault();
    };
    const onUp=()=>{viewer.isDragging=false; _pinchDist=null;};
    const onWheel=e=>{ viewer.zoom=Math.max(0.3,Math.min(4,viewer.zoom*(e.deltaY>0?0.88:1.14))); e.preventDefault(); };
    viewer._onMove=onMove; viewer._onUp=onUp; viewer._onWheel=onWheel;
    svgEl.addEventListener('mousedown',onDown);
    svgEl.addEventListener('touchstart',onDown,{passive:false});
    svgEl.addEventListener('wheel',onWheel,{passive:false});
    window.addEventListener('mousemove',onMove);
    window.addEventListener('mouseup',onUp);
    window.addEventListener('touchmove',onMove,{passive:false});
    window.addEventListener('touchend',onUp);

    const loop=()=>{
        if(!document.body.contains(svgEl)){cancelAnimationFrame(viewer.animFrame);return;}
        if(!viewer.isDragging && (Math.abs(viewer.rotVel.x)>0.0001 || Math.abs(viewer.rotVel.y)>0.0001)){
            viewer.rotVel.x*=0.92; viewer.rotVel.y*=0.92;
            if(Math.hypot(viewer.rotVel.x,viewer.rotVel.y)<0.0001) viewer.rotVel={x:0,y:0};
            const cx=Math.cos(viewer.rotVel.x),sx=Math.sin(viewer.rotVel.x);
            const cy2=Math.cos(viewer.rotVel.y),sy2=Math.sin(viewer.rotVel.y);
            const rx=[1,0,0,0,cx,-sx,0,sx,cx],ry=[cy2,0,sy2,0,1,0,-sy2,0,cy2];
            viewer.matrix=normalizeMatrix(multiplyMatrix(multiplyMatrix(ry,rx),viewer.matrix));
        }
        renderQuizMini(viewer);
        viewer.animFrame=requestAnimationFrame(loop);
    };
    window.quizViewer=viewer;
    loop();
}

window.toggleHybridType = function(card, typeKey) {
    card.classList.toggle('selected');
};

window.toggleElectronType = function(card, typeKey) {
    card.classList.toggle('selected');
};

window.confirmElectronTypes = function() {
    const cards = document.querySelectorAll('#electron-type-cards .hybrid-type-card');
    const selected = [];
    cards.forEach(c => { if (c.classList.contains('selected')) selected.push(c.dataset.type); });
    if (selected.length === 0) {
        const btn = document.getElementById('electron-confirm-btn');
        const orig = btn.textContent;
        btn.textContent = '請至少選擇一種題型！';
        btn.style.background = '#ef4444';
        btn.style.color = '#fff';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; }, 2000);
        return;
    }
    window.electronSelectedSubtypes = {};
    selected.forEach(t => { window.electronSelectedSubtypes[t] = true; });
    document.getElementById('electron-type-select-area').style.display = 'none';
    document.getElementById('difficulty-grid').style.setProperty('display', 'flex', 'important');
    document.getElementById('quiz-status-text').textContent = '電子組態 > 選擇範圍';
};

window.togglePrecipType = function(el, typeKey) {
    el.classList.toggle('selected');
};

window.confirmPrecipTypes = function() {
    const cards = document.querySelectorAll('#precip-type-cards .hybrid-type-card');
    const selected = [];
    cards.forEach(c => { if (c.classList.contains('selected')) selected.push(c.dataset.type); });
    if (selected.length === 0) {
        const btn = document.getElementById('precip-confirm-btn');
        const orig = btn.textContent;
        btn.textContent = '請至少選擇一種題型！';
        btn.style.background = '#ef4444';
        btn.style.color = '#fff';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; }, 2000);
        return;
    }
    window.precipSelectedSubtypes = {};
    selected.forEach(t => { window.precipSelectedSubtypes[t] = true; });
    document.getElementById('precip-type-select-area').style.display = 'none';
    document.getElementById('quiz-setup-area').style.display = 'flex';
    document.getElementById('quiz-status-text').textContent = '沉澱表 > 選擇題數';
    setTimeout(() => { if (typeof window.updateSetupButtons === 'function') window.updateSetupButtons(); }, 50);
};

window.toggleFormulaType = function(el, typeKey) {
    el.classList.toggle('selected');
};

window.confirmFormulaTypes = function() {
    const cards = document.querySelectorAll('#formula-type-cards .hybrid-type-card');
    const selected = [];
    cards.forEach(c => { if (c.classList.contains('selected')) selected.push(c.dataset.type); });
    if (selected.length === 0) {
        const btn = document.getElementById('formula-confirm-btn');
        const orig = btn.textContent;
        btn.textContent = '請至少選擇一種題型！';
        btn.style.background = '#ef4444';
        btn.style.color = '#fff';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; }, 2000);
        return;
    }
    window.formulaSelectedTypes = {};
    selected.forEach(t => { window.formulaSelectedTypes[t] = true; });
    document.getElementById('formula-type-select-area').style.display = 'none';
    document.getElementById('quiz-setup-area').style.display = 'flex';
    document.getElementById('quiz-status-text').textContent = '化學式 > 選擇題數';
    setTimeout(() => { if (typeof window.updateSetupButtons === 'function') window.updateSetupButtons(); }, 50);
};

window.confirmHybridTypes = function() {
    const cards = document.querySelectorAll('#hybrid-type-cards .hybrid-type-card');
    const selected = [];
    cards.forEach(c => { if (c.classList.contains('selected')) selected.push(c.dataset.type); });
    if (selected.length === 0) {
        const btn = document.getElementById('hybrid-confirm-btn');
        const orig = btn.textContent;
        btn.textContent = '請至少選擇一種題型！';
        btn.style.background = '#ef4444';
        btn.style.color = '#fff';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; }, 2000);
        return;
    }
    window.hybridSelectedSubtypes = {};
    selected.forEach(t => { window.hybridSelectedSubtypes[t] = true; });
    document.getElementById('hybrid-type-select-area').style.display = 'none';
    document.getElementById('quiz-setup-area').style.display = 'flex';
    document.getElementById('quiz-status-text').textContent = '混成 > 選擇題數';
    setTimeout(() => { if (typeof window.updateSetupButtons === 'function') window.updateSetupButtons(); }, 50);
};

// 沉澱表：加權牌組（溶解/沉澱題多，焰色少）
function _generatePrecipTypeDeck(total, sub) {
    const W = { 21:10, 22:15, 28:1, 31:5, 24:2, 25:1, 26:6, 27:3, 23:2, 29:2 };
    const pool = [];
    if (sub['A']) pool.push(21, 22, 28, 31);
    if (sub['B']) pool.push(24, 25);
    if (sub['C']) pool.push(26, 27, 23, 29);
    if (pool.length === 0 && sub['D']) return Array.from({ length: total }, () => 30);
    if (pool.length === 0) pool.push(21, 22, 26, 27);

    const flameN = sub['D'] ? (total <= 15 ? 1 : Math.min(2, Math.round(total / 10))) : 0;
    const deck = [];
    for (let i = 0; i < flameN; i++) deck.push(30);

    const weighted = [];
    pool.forEach(t => { const w = W[t] || 2; for (let i = 0; i < w; i++) weighted.push(t); });

    const remain = Math.max(0, total - deck.length);
    for (let i = 0; i < remain; i++) {
        deck.push(weighted[Math.floor(Math.random() * weighted.length)]);
    }
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    for (let i = 0; i < deck.length - 1; i++) {
        if (deck[i] === deck[i + 1]) {
            for (let j = i + 2; j < deck.length; j++) {
                if (deck[j] !== deck[i]) { [deck[i + 1], deck[j]] = [deck[j], deck[i + 1]]; break; }
            }
        }
    }
    return deck;
}

// 化學式：先依選定的三大題型平均分配，再將約三成題目配置為是非題。
function _generateFormulaTypeDeck(total, sub) {
    const selected = Object.keys(sub || {}).filter(k => sub[k]);
    const groups = selected.length ? selected : ['name', 'ions', 'judge'];
    const tfGroups = groups.filter(group => group !== 'mass');
    const tfTotal = tfGroups.length ? Math.max(1, Math.round(total * 0.3)) : 0;
    const deck = [];
    const nonTfTypes = { name: [32, 33], ions: [34, 35], judge: [36], mass: [50] };
    const tfTypes = { name: [37], ions: [38], judge: [39] };

    const distributeByGroup = (count, typeMap, allowedGroups) => {
        const offsets = {};
        allowedGroups.forEach(g => { offsets[g] = 0; });
        for (let i = 0; i < count; i++) {
            const group = allowedGroups[i % allowedGroups.length];
            const choices = typeMap[group];
            deck.push(choices[offsets[group] % choices.length]);
            offsets[group]++;
        }
    };
    if (tfTotal) distributeByGroup(tfTotal, tfTypes, tfGroups);
    distributeByGroup(total - tfTotal, nonTfTypes, groups);

    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    for (let i = 0; i < deck.length - 1; i++) {
        if (deck[i] === deck[i + 1]) {
            const swap = deck.findIndex((v, idx) => idx > i + 1 && v !== deck[i]);
            if (swap >= 0) [deck[i + 1], deck[swap]] = [deck[swap], deck[i + 1]];
        }
    }

    const stageQuota = { j: Math.round(total * 0.3), s: Math.round(total * 0.4), a: 0 };
    stageQuota.a = total - stageQuota.j - stageQuota.s;
    const stages = [];
    Object.keys(stageQuota).forEach(stage => {
        for (let i = 0; i < stageQuota[stage]; i++) stages.push(stage);
    });
    for (let i = stages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [stages[i], stages[j]] = [stages[j], stages[i]];
    }
    window.quizState.formulaStageDeck = stages;
    window.quizState.formulaUsed = new Set();
    return deck;
}

const PERIODIC_SIMPLE_CAPABLE_TYPES = Object.freeze([0, 4, 5]);

function generatePeriodicProfileDeck(typeDeck, mode) {
    const profiles = Array.from({ length: typeDeck.length }, () => mode === 'challenge' ? 'challenge' : 'standard');
    if (mode !== 'challenge') {
        const candidates = typeDeck
            .map((type, index) => PERIODIC_SIMPLE_CAPABLE_TYPES.includes(type) ? index : -1)
            .filter(index => index >= 0);
        if (candidates.length) {
            profiles[candidates[Math.floor(Math.random() * candidates.length)]] = 'simple';
        }
    }
    return profiles;
}

// 獨立的牌組生成函式
window._generateTypeDeck = function(diff, total) {
    const restrictedTypes = [5, 14];
    const typePools = {
        1: [0, 1, 2, 4, 5, 6, 10, 14],
        2: [3, 6, 7, 8, 9, 10, 11, 14, 15],
        3: [16, 17],
        4: [18],
        5: [21, 22, 24, 25, 26, 27, 28, 29, 30, 31],
        7: [40, 41, 42, 43, 44, 45]
    };
    let types;
    if (diff === 6) {
        return _generateFormulaTypeDeck(total, window.formulaSelectedTypes || {});
    }
    if (diff >= 8 && diff <= 11) {
        const type = diff + 38;
        return Array.from({ length: total }, () => type);
    }
    if (diff === 5 && window.precipSelectedSubtypes) {
        return _generatePrecipTypeDeck(total, window.precipSelectedSubtypes);
    }
    if (diff === 7 && window.knowledgeSelectedSubtypes) {
        types = [];
        const subtypeTypes = { particles: 40, gas: 41, phase: 42, units: 43, acidBase: 44, hydrogen: 45 };
        Object.keys(subtypeTypes).forEach(key => {
            if (window.knowledgeSelectedSubtypes[key]) types.push(subtypeTypes[key]);
        });
        if (types.length === 0) types = typePools[7];
    }
    if (diff === 2 && window.electronSelectedSubtypes) {
        const sub = window.electronSelectedSubtypes;
        types = [];
        if (sub['3f']) types.push(3);
        if (sub['3r']) types.push(20);
        if (sub['6']) types.push(6);
        if (sub['789']) { types.push(7); types.push(8); types.push(9); }
        if (sub['1011']) { types.push(10); types.push(11); }
        if (sub['1415']) { types.push(14); types.push(15); }
        if (types.length === 0) types = typePools[2];
    } else if (diff === 3 && window.hybridSelectedSubtypes) {
        const sub = window.hybridSelectedSubtypes;
        types = [];
        if (sub['16f'] || sub['16r']) types.push(16);
        if (sub['17f'] || sub['17r']) types.push(17);
        if (sub['19']) types.push(19);
        if (types.length === 0) types = [16, 17];
    } else if (diff !== 7) {
        types = typePools[diff] || typePools[1];
    }

    // 知識校準採用所選子題型平均輪流出題，讓單一題型不會壟斷一輪。
    if (diff === 7) {
        const deck = [];
        while (deck.length < total && types.length) {
            for (const type of calibrationShuffle(types)) {
                if (deck.length >= total) break;
                deck.push(type);
            }
        }
        return deck;
    }

    // 週期表的 RANK 只限制元素池；所有 RANK 使用同一組題型比例。
    // 題數增加時以輪流方式補題，讓各主題的出現次數最多只差 1。
    if (diff === 1 && window.calCategory === 'periodic') {
        const deck = [];
        while (deck.length < total && types.length) {
            for (const type of calibrationShuffle(types)) {
                if (deck.length >= total) break;
                deck.push(type);
            }
        }
        window.quizState.periodicProfileDeck = generatePeriodicProfileDeck(deck, window.quizState.periodicMode || 'standard');
        return deck;
    }

    const restrictedInPool = types.filter(t => restrictedTypes.includes(t));
    const normalTypes = types.filter(t => !restrictedTypes.includes(t));
    let deck = [];
    restrictedInPool.forEach(t => deck.push(t));
    const remainingTotal = total - restrictedInPool.length;
    if (remainingTotal > 0 && normalTypes.length > 0) {
        const typesPerQuestion = Math.floor(remainingTotal / normalTypes.length);
        const remainder = remainingTotal % normalTypes.length;
        normalTypes.forEach(t => { for (let i = 0; i < typesPerQuestion; i++) deck.push(t); });
        const shuffledTypes = calibrationShuffle(normalTypes);
        for (let i = 0; i < remainder; i++) deck.push(shuffledTypes[i]);
    }
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    for (let i = 0; i < deck.length - 1; i++) {
        if (deck[i] === deck[i+1]) {
            let swapIdx = (i + 2) % deck.length;
            [deck[i+1], deck[swapIdx]] = [deck[swapIdx], deck[i+1]];
        }
    }
    return deck;
};

window.startQuiz = function(level) {
    document.getElementById('difficulty-grid').style.setProperty('display', 'none', 'important');
    document.getElementById('quiz-setup-area').style.display = 'flex';
    document.getElementById('quiz-cancel-btn').style.display = 'block';

    const cat = window.calCategory || 'periodic';
    const diffForCat = { 'periodic': 1, 'electron': 2, 'hybrid': 3 };
    const catNameMap = { 'periodic': '週期表', 'electron': '電子組態', 'hybrid': '混成' };
    const diff = diffForCat[cat] || 1;

    const previousTotalQ = (window.quizState && window.quizState.totalQ) ? window.quizState.totalQ : 10;
    const previousPeriodicMode = window.quizState && window.quizState.periodicMode === 'challenge'
        ? 'challenge'
        : 'standard';
    window.quizState = {
        rank: level, difficulty: diff, totalQ: previousTotalQ, currentQ: 0, correctCount: 0,
        pool: [], askedZ: [], typeDeck: [], askedQuestions: [],
        periodicMode: cat === 'periodic' ? previousPeriodicMode : null,
        periodicProfileDeck: []
    };
    window.quizState.generateTypeDeck = window._generateTypeDeck;

    const poolMap = {
        'A': ELECTRON_DATA.filter(el => el.z <= 36),
        'B': ELECTRON_DATA.filter(el => el.z <= 36 || (el.g && el.g.includes('A'))),
        'C': ELECTRON_DATA.filter(el => el.z <= 88 && el.g && !el.g.includes('系')),
        'D': [...ELECTRON_DATA]
    };
    window.quizState.pool = poolMap[level] || poolMap['A'];

    const periodicModeSelect = document.getElementById('periodic-mode-select');
    if (periodicModeSelect) periodicModeSelect.style.display = cat === 'periodic' ? 'block' : 'none';
    if (cat === 'periodic') {
        document.querySelectorAll('#periodic-mode-select .setup-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(`'${previousPeriodicMode}'`));
        });
    }

    const modeLabel = cat === 'periodic' ? `｜${previousPeriodicMode === 'challenge' ? '挑戰模式' : '標準模式'}` : '';
    document.getElementById('quiz-status-text').textContent = `RANK ${level}${modeLabel}｜${catNameMap[cat]}`;
    setTimeout(() => { if (typeof window.updateSetupButtons === 'function') window.updateSetupButtons(); }, 50);
};

window.setQuizParam = function(type, val, btn) {
    btn.parentElement.querySelectorAll('.setup-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (type === 'count' && window.quizState) {
        window.quizState.totalQ = parseInt(val);
    }
    if (type === 'periodicMode' && window.quizState && window.calCategory === 'periodic') {
        window.quizState.periodicMode = val === 'challenge' ? 'challenge' : 'standard';
        const rank = window.quizState.rank ? `RANK ${window.quizState.rank}` : '';
        const mode = window.quizState.periodicMode === 'challenge' ? '挑戰模式' : '標準模式';
        document.getElementById('quiz-status-text').textContent = `${rank}｜${mode}｜週期表校準`;
    }
};

window.updateSetupButtons = function() {
    if (!window.quizState) return;
    const countBtns = document.querySelectorAll('.setup-btns button[onclick*="setQuizParam(\'count\'"]');
    countBtns.forEach(btn => {
        const match = btn.getAttribute('onclick').match(/setQuizParam\('count',\s*(\d+)/);
        const requested = match ? parseInt(match[1]) : 0;
        const extensionCount = window.extensionCategory
            ? (window.CALIBRATION_EXTENSION_ENGINE?.capacity(window.extensionCategory, window.extensionSelectedSubtypes || {}) || 0)
            : Infinity;
        btn.disabled = requested > extensionCount;
        btn.title = btn.disabled ? `目前所選子題型可生成 ${extensionCount} 種有效題目` : '';
        if (match && parseInt(match[1]) === window.quizState.totalQ) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    const mode = window.quizState.periodicMode === 'challenge' ? 'challenge' : 'standard';
    document.querySelectorAll('#periodic-mode-select .setup-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(`'${mode}'`));
    });
};

// 生成問題的唯一標識（用於重複檢查）
// 智能識別問題的核心內容，允許同一type但不同問法，但禁止完全相同問題
function generateQuestionKey(type, quizData, target) {
    // 提取問題的核心內容（去除HTML標籤和格式化）
    let coreQuestion = quizData.question.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    // 題目唯一性以「題型＋方向／題幹＋目標物＋答案」為準，
    // 不再把同一方向的不同元素錯誤合併成同一題。
    const targetKey = target ? `${target.z || ''}-${target.s || ''}` : '';
    const answerKey = calibrationOptionKey(quizData.answer);
    const variantKey = quizData._templateId || quizData.type || '';
    return `type${type}|${variantKey}|${targetKey}|${answerKey}|${coreQuestion}`;
    
    // 根據題型生成唯一標識
    switch(type) {
        case 0: // 身分識別：中文名 ↔ 簡寫
            // 週期表校準已移除所有英文名稱方向，只保留兩種中文/符號互換。
            // 同一方向只允許問一次（無論什麼元素）
            if (coreQuestion.includes('化學符號') && (coreQuestion.includes('中文名稱') || coreQuestion.includes('中文名'))) {
                return `type0-簡寫→中文名`;
            } else if ((coreQuestion.includes('元素「') || coreQuestion.includes('「')) && coreQuestion.includes('符號') && !coreQuestion.includes('英文')) {
                return `type0-中文名→簡寫`;
            }
            return `type0-${coreQuestion}`;
            
        case 1: // 識別校準：符號 ↔ 原子序
            // 區分方向：符號→原子序、原子序→符號
            // 同一方向只允許問一次（無論什麼元素）
            // 例如：問了"N的原子序是多少"，就不能再問"F的原子序是多少"
            // 但可以問"原子序為9的元素符號為何"（反向）
            if (coreQuestion.includes('原子序') && (coreQuestion.includes('為何') || coreQuestion.includes('為')) && !coreQuestion.includes('原子序為') && !coreQuestion.includes('質子數為')) {
                return `type1-符號→原子序`;
            } else if (coreQuestion.includes('原子序為') || coreQuestion.includes('質子數為') || (coreQuestion.includes('原子核內有') && coreQuestion.includes('個質子'))) {
                return `type1-原子序→符號`;
            }
            return `type1-${coreQuestion}`;
            
        case 2: // 位置定位：座標 ↔ 符號 ↔ 原子序（含 IUPAC / A/B 兩種座標格式）
            if (coreQuestion.includes('位於週期表') && coreQuestion.includes('元素符號')) {
                return quizData.coordMode === 'ab' ? `type2-AB座標→符號` : `type2-IUPAC座標→符號`;
            } else if (coreQuestion.includes('位於週期表') && coreQuestion.includes('原子序')) {
                return quizData.coordMode === 'ab' ? `type2-AB座標→原子序` : `type2-IUPAC座標→原子序`;
            } else if (coreQuestion.includes('幾A') || coreQuestion.includes('幾B') || coreQuestion.includes('A/B')) {
                return coreQuestion.includes('原子序為') || coreQuestion.includes('原子序') ? `type2-原子序→AB座標` : `type2-符號→AB座標`;
            } else if (coreQuestion.includes('第幾族')) {
                return coreQuestion.includes('原子序為') || coreQuestion.includes('原子序') ? `type2-原子序→IUPAC座標` : `type2-符號→IUPAC座標`;
            }
            return `type2-${coreQuestion}`;
            
        case 4: // 特性校準：元素 ↔ 分類
            // 區分方向：元素→分類、分類→元素
            if (coreQuestion.includes('屬於下列何者') || coreQuestion.includes('化學性質分類')) {
                return `type4-元素→分類`;
            } else if (coreQuestion.includes('屬於「') || coreQuestion.includes('為「')) {
                return `type4-分類→元素`;
            }
            return `type4-${coreQuestion}`;
            
        case 5: // 特性校準：元素 ↔ 常溫狀態
            // 每一輪只能出現一次（不區分方向或元素）
            return `type5-常溫狀態`;
            
        case 6: // 計算與逆推（融合了12、13、16、17、18）
            // 根據子類型區分
            if (quizData.type.includes('電子總數') && !quizData.type.includes('逆推')) {
                return `type6-計算電子總數`;
            } else if (quizData.type.includes('質子總數') && !quizData.type.includes('逆推')) {
                return `type6-計算質子總數`;
            } else if (quizData.type.includes('質子數逆推')) {
                return `type6-質子數逆推`;
            } else if (quizData.type.includes('電子數逆推')) {
                return `type6-電子數逆推`;
            } else if (quizData.type.includes('等電子序列')) {
                return `type6-等電子序列`;
            }
            return `type6-${quizData.type}`;
            
        case 9: // 量子結構：軌域總數統計
            // 區分兩種問法：軌域總數統計、價電子能階統計
            if (quizData.type.includes('軌域總數統計')) {
                // 提取軌域類型（s/p/d）
                const orbMatch = quizData.type.match(/([spd])/i);
                const orbType = orbMatch ? orbMatch[1].toLowerCase() : '';
                return `type9-軌域總數統計-${orbType}`;
            } else if (quizData.type.includes('價電子能階統計')) {
                return `type9-價電子能階統計`;
            }
            return `type9-${quizData.type}`;
            
        case 10: // 邏輯判斷：同族元素或同一週期
            // 區分：同族、同一週期
            if (quizData.type.includes('同族')) {
                return `type10-同族元素`;
            } else if (quizData.type.includes('同一週期')) {
                return `type10-同一週期`;
            }
            return `type10-${coreQuestion}`;
            
        case 14: // 性質趨勢：電負度比較
            // 每一輪只能出現一次（不區分元素）
            return `type14-電負度`;
            
        case 16: // 混成軌域判斷（正向＋反向）
            if (coreQuestion.includes('下列何者') || coreQuestion.includes('下列哪一個') || coreQuestion.includes('哪一個')) {
                return `type16-reverse-${coreQuestion.substring(0, 50)}`;
            }
            const molMatch = coreQuestion.match(/([^中]+?)(?:中的|中，|的)([A-Z][a-z]?)/);
            if (molMatch) {
                return `type16-${molMatch[1].trim()}-${molMatch[2]}`;
            }
            return `type16-${coreQuestion.substring(0, 50)}`;
            
        case 17: // 分子形狀判斷（正向＋反向）
            if (coreQuestion.includes('下列何者') || coreQuestion.includes('下列哪一個') || coreQuestion.includes('以下哪個')) {
                return `type17-reverse-${coreQuestion.substring(0, 50)}`;
            }
            return `type17-${coreQuestion.substring(0, 50)}`;
        
        case 19: // 結構圖問混成
            return `type19-${quizData._imgMolName || ''}-${quizData._imgAtomElem || ''}-${quizData.answer || ''}`;
            
        case 18: // 氧化數判斷（正向＋反向）
            if (coreQuestion.includes('下列何者')) {
                return `type18-reverse-${coreQuestion.substring(0, 50)}`;
            }
            const oxMatch = coreQuestion.match(/(.+?)中的\s*([A-Z][a-z]?)/);
            if (oxMatch) {
                return `type18-${oxMatch[1].trim()}-${oxMatch[2]}`;
            }
            return `type18-${coreQuestion.substring(0, 50)}`;

        case 21: case 22: case 23: case 24: case 25: case 26: case 27: case 28: case 29: case 30:
            return `type${type}-${coreQuestion.substring(0, 60)}`;
            
        default:
            // 其他題型：使用題型+問題核心內容
            // 對於單向題型，同一題型只允許問一次（無論什麼元素）
            // 提取問題中的關鍵信息（元素符號、數值等）
            const elementMatch = coreQuestion.match(/\[?\s*([A-Z][a-z]?)\s*\]?/);
            const elementSymbol = elementMatch ? elementMatch[1] : '';
            const numberMatch = coreQuestion.match(/\d+/);
            const number = numberMatch ? numberMatch[0] : '';
            
            // 對於所有題型，使用題型作為唯一標識（同一題型只問一次）
            // 根據用戶要求：若同一個TYPE內有不同問法，可以算不同題型
            // 但對於單向題型（如 Type 3, 7, 8, 9, 11, 15），即使問法略有不同，也視為同一題型
            // 因為它們都是同一個方向（元素→答案），只是問法不同
            return `type${type}-${coreQuestion.substring(0, 50)}`;
    }
}

window.initiateCalibration = function() {
    const extensionCount = window.extensionCategory
        ? (window.CALIBRATION_EXTENSION_ENGINE?.capacity(window.extensionCategory, window.extensionSelectedSubtypes || {}) || 0)
        : Infinity;
    if (window.extensionCategory && window.quizState.totalQ > extensionCount) {
        window.handleCalibrationBack();
        return;
    }
    if (window.quizState) window.quizState._extensionAskedIds = new Set();
    // 1. 生成不連續重複的平衡題型牌組
    window.quizState.typeDeck = window.quizState.generateTypeDeck(window.quizState.difficulty, window.quizState.totalQ);
    
    document.getElementById('quiz-setup-area').style.display = 'none';
    document.getElementById('quiz-content-area').style.display = 'grid';
    // 新一輪開始時重置週期表為收起
    const wrap = document.getElementById('periodic-table-wrap');
    const btn  = document.getElementById('periodic-toggle-btn');
    if (wrap) wrap.style.display = 'none';
    if (btn) {
        btn.textContent = '開啟週期表';
        btn.setAttribute('aria-expanded', 'false');
    }
    renderCalibrationRuler(0, window.quizState.totalQ);
    updatePeriodicToggleVisibility();
    window.renderNextQuestion();
};

function getCalibrationTopicLabel(difficulty, type) {
    if (type === 18) return '氧化數判斷';
    if (type === 19) return '結構圖混成';
    if (type === 16) return '混成軌域';
    if (type === 17) return '分子形狀';
    if (type >= 21 && type <= 31) return '沉澱表';
    if ((type >= 32 && type <= 39) || type === 50) return '化學式';
    if (type >= 40 && type <= 45) return '知識校準';
    if (type >= 46 && type <= 49) return window.CALIBRATION_EXTENSION_CATEGORIES?.[window.extensionCategory]?.label || '新章節';
    const topicMap = {
        1: '週期表',
        2: '電子組態',
        3: '混成',
        4: '氧化還原',
        5: '沉澱表',
        6: '化學式',
        7: '知識校準'
    };
    return topicMap[difficulty] || '校準題型';
}

function calibrationEscapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function calibrationMathSpan(tex, fallback) {
    return `<span class="cal-math"><span class="cal-math-fallback">${calibrationEscapeHtml(fallback)}</span><span class="cal-math-source">\\(${tex}\\)</span></span>`;
}

function calibrationHtmlMathSpan(tex, fallbackHtml) {
    return `<span class="cal-math"><span class="cal-math-fallback">${fallbackHtml}</span><span class="cal-math-source">\\(${tex}\\)</span></span>`;
}

function orbitalPower(value) {
    return value === '²' ? '2' : (value === '³' ? '3' : String(value));
}

function formatHybridNotationHtml(value) {
    let output = String(value || '');
    const tokens = [];
    const protect = (tex, fallback) => {
        const token = `\uE000${tokens.length}\uE001`;
        tokens.push(calibrationMathSpan(tex, fallback));
        return token;
    };
    const hybrid = (spPower, dPower, fallback) => {
        const sp = spPower ? `^{${orbitalPower(spPower)}}` : '';
        const d = dPower ? `\\mathit{d}^{${orbitalPower(dPower)}}` : '\\mathit{d}';
        const tex = `\\mathit{sp}${sp}${d}`;
        return protect(tex, fallback);
    };

    // 先處理完整的 sp³d²／sp3d3，再處理單一混成符號，避免重複替換。
    output = output.replace(/sp(?:\^?([23²³]))d(?:\^?([23²³]))/gi, (match, spPower, dPower) => hybrid(spPower, dPower, match));
    output = output.replace(/sp(?:\^?([23²³]))d/gi, (match, spPower) => hybrid(spPower, '', match));
    output = output.replace(/sp(?:\^?([23²³]))/gi, (match, spPower) => {
        const tex = `\\mathit{sp}^{${orbitalPower(spPower)}}`;
        return protect(tex, match);
    });
    return output.replace(/\uE000(\d+)\uE001/g, (_, index) => tokens[Number(index)]);
}

function formatElectronConfigMath(value) {
    const raw = String(value || '').replace(/<[^>]+>/g, '');
    if (!raw) return '';
    const fallback = calibrationEscapeHtml(raw)
        .replace(/(\d+)([spdf])(\d+)/gi, '$1<i>$2</i><sup class="cal-electron-power">$3</sup>');
    let tex = calibrationEscapeHtml(raw)
        .replace(/\[([A-Za-z]+)\]/g, '\\left[\\mathrm{$1}\\right]')
        .replace(/(\d+)([spdf])(\d+)/gi, '$1\\mathit{$2}^{$3}');
    return calibrationHtmlMathSpan(tex, fallback);
}

// 只將化學式中的元素符號交給 Computer Modern 斜體，中文句子維持襯線字體。
// 以元素符號白名單辨識，避免把 QUESTION、VSEPR 等英文介面文字誤判為化學式。
const calibrationElementSymbols = [
    'He', 'Li', 'Be', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'Cl', 'Ar', 'Ca', 'Sc', 'Ti', 'Cr', 'Mn',
    'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Zr', 'Nb',
    'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'Xe', 'Cs', 'Ba', 'La',
    'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf',
    'Ta', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra',
    'Ac', 'Th', 'Pa', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', 'Rf',
    'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og',
    'H', 'B', 'C', 'N', 'O', 'F', 'P', 'S', 'K', 'V', 'Y', 'I', 'W', 'U'
].sort((a, b) => b.length - a.length);

const calibrationElementAtomPattern = calibrationElementSymbols
    .map(symbol => symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
const calibrationElementFormulaPattern = new RegExp(
    `(?<![A-Za-z])((?:${calibrationElementAtomPattern})(?:${calibrationElementAtomPattern})*)(?![A-Za-z])`,
    'g'
);

function formatCalibrationChemistryText(text) {
    return String(text || '').replace(/(10)([⁺⁻]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, '$1<span class="cal-scientific-exponent">$2</span>').replace(
        calibrationElementFormulaPattern,
        '<span class="cal-chemistry-math">$1</span>'
    );
}

function formatCalibrationChemistryHtml(html) {
    let output = String(html || '');
    const protectedSegments = [];
    const protect = (match) => {
        const token = `\uE100${protectedSegments.length}\uE101`;
        protectedSegments.push(match);
        return token;
    };

    // MathJax 的 TeX 原始來源不可再被 HTML 包裝，否則會破壞公式解析。
    output = output.replace(/<span class="cal-math-source">[\s\S]*?<\/span>/g, protect);
    output = output.split(/(<[^>]+>)/g).map(part => {
        return part.startsWith('<') ? part : formatCalibrationChemistryText(part);
    }).join('');

    output = output.replace(/\uE100(\d+)\uE101/g, (_, index) => protectedSegments[Number(index)]);
    const mathSources = [];
    output = output.replace(/<span class="cal-math-source">[\s\S]*?<\/span>/g, match => {
        const token = `\uE200${mathSources.length}\uE201`;
        mathSources.push(match);
        return token;
    });
    // 畫面字元格式化，不改題庫資料、答案鍵、運算字串或 MathJax 原始碼。
    output = output.split(/(<[^>]+>)/g).map(part => part.startsWith('<') ? part : part.replace(/[=+\-]/g, symbol => ({ '=': '＝', '+': '＋', '-': '－' })[symbol])).join('');
    return output.replace(/\uE200(\d+)\uE201/g, (_, index) => mathSources[Number(index)]);
}

function typesetCalibrationMath(root) {
    if (!root || !window.MathJax || !window.MathJax.startup) return;
    Promise.resolve(window.MathJax.startup.promise)
        .then(() => window.MathJax.typesetPromise([root]))
        .then(() => {
            root.querySelectorAll('.cal-math').forEach(node => node.classList.add('is-typeset'));
        })
        .catch(() => {
            // 保留 fallback，不將原始 TeX 暴露給學生。
        });
}

function renderCalibrationRuler(current, total) {
    const track = document.getElementById('calibration-ruler-track');
    const count = document.getElementById('calibration-ruler-count');
    const safeTotal = Math.max(1, Number(total) || 10);
    const safeCurrent = Math.min(Math.max(0, Number(current) || 0), safeTotal);
    if (track) {
        track.innerHTML = '';
        for (let i = 1; i <= 20; i++) {
            const tick = document.createElement('span');
            tick.className = 'cal-ruler-tick';
            const completed = i <= Math.round((safeCurrent / safeTotal) * 20);
            const isCurrent = safeCurrent > 0 && i === Math.max(1, Math.ceil((safeCurrent / safeTotal) * 20));
            if (completed) tick.classList.add('is-complete');
            if (isCurrent) tick.classList.add('is-current');
            tick.setAttribute('aria-hidden', 'true');
            track.appendChild(tick);
        }
    }
    if (count) count.textContent = `${String(safeCurrent).padStart(2, '0')} / ${String(safeTotal).padStart(2, '0')}`;
}

// -----------------------------------------------------------------------------
// 高鑑別選項與即時詳解
// -----------------------------------------------------------------------------
// 選項仍以字串傳給既有 UI；理由另外保存，讓答錯時可以指出「最後錯在哪一步」。
function calibrationOptionKey(value) {
    return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
}

function calibrationShuffle(values) {
    const out = [...(values || [])];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

function setCalibrationOptions(quizData, correct, entries) {
    const seen = new Set();
    const values = [];
    const reasons = {};
    const optionMeta = {};
    const add = (entry, isCorrect) => {
        const value = typeof entry === 'object' ? entry.value : entry;
        const reason = typeof entry === 'object' ? entry.reason : '';
        const misconception = typeof entry === 'object' ? (entry.misconception || '') : '';
        const semanticKey = typeof entry === 'object' ? (entry.semanticKey || '') : '';
        const key = calibrationOptionKey(value);
        if (!key || seen.has(key)) return;
        seen.add(key);
        values.push(value);
        if (!isCorrect && reason) reasons[key] = reason;
        optionMeta[key] = { misconception, semanticKey, isCorrect: !!isCorrect };
    };
    add({ value: correct }, true);
    (entries || []).forEach(entry => add(entry, false));
    quizData.forcedOpts = values;
    quizData.optionRationales = reasons;
    quizData.optionMeta = optionMeta;
    return values;
}

function setCalibrationReason(quizData, reason) {
    quizData.correctReason = String(reason || '').trim();
    quizData.showExplanation = true;
}

// 詳解資料與畫面分離：產生器可以保留計算依據，畫面只呈現精簡三段式內容。
function setCalibrationExplanation(quizData, basis, steps, conclusion) {
    const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
    quizData.explanation = {
        basis: clean(basis),
        steps: clean(steps),
        conclusion: clean(conclusion)
    };
    setCalibrationReason(quizData, [quizData.explanation.basis, quizData.explanation.steps, quizData.explanation.conclusion]
        .filter(Boolean).join(' '));
}

function calibrationPlainElement(value) {
    return String(value == null ? '' : value).replace(/<[^>]*>/g, '').trim();
}

function calibrationElementFromValue(value, pool) {
    const plain = calibrationPlainElement(value);
    const list = Array.isArray(pool) ? pool : [];
    return list.find(el => el.s === plain || el.cn === plain || String(el.z) === plain);
}

function calibrationElementValueForQuestion(value, quizData) {
    const plain = calibrationPlainElement(value);
    if (quizData && quizData.displayMode === 'number') return String(plain);
    return plain;
}

function calibrationBlockForElement(el) {
    if (!el) return '';
    if (el.s === 'He') return 's 區';
    const group = Number(el.iupac);
    if (el.g === '鑭系' || el.g === '錒系') return 'f 區';
    return group <= 2 ? 's 區' : (group >= 13 ? 'p 區' : 'd 區');
}

function calibrationIonValueForElement(el, charge) {
    if (!el) return '';
    const q = Number(charge) || 0;
    if (!q) return el.s;
    const sign = q > 0 ? '+' : '-';
    const magnitude = Math.abs(q);
    return `${el.s}<sup class="chem-sup">${magnitude === 1 ? '' : magnitude}${sign}</sup>`;
}

function calibrationSemanticMatch(quizData, value, target, pool) {
    const label = quizData.type || '';
    const plain = calibrationPlainElement(value);
    const answerPlain = calibrationPlainElement(quizData.answer);
    const element = calibrationElementFromValue(value, pool);
    if (typeof quizData._periodicSemanticMatcher === 'function') {
        return !!quizData._periodicSemanticMatcher(value, target, pool);
    }
    if (quizData._periodicParticleMode) {
        const optionParticle = periodicParseParticle(value, pool);
        const expected = quizData._periodicParticle;
        if (!optionParticle || !expected) return false;
        if (quizData._periodicParticleMode === 'electron' || quizData._periodicParticleMode === 'isoelectronic') {
            return optionParticle.e === expected.e;
        }
        if (quizData._periodicParticleMode === 'full') {
            return optionParticle.p === expected.p && optionParticle.n === expected.n && optionParticle.e === expected.e;
        }
    }
    if (/元素\s*>\s*分類/.test(label)) return plain === String(target && target.type || '');
    if (/分類\s*>\s*元素/.test(label)) return !!element && element.type === (target && target.type);
    if (/元素\s*>\s*常溫狀態/.test(label)) {
        return plain === String(target && typeof QUIZ_HELPER !== 'undefined' ? QUIZ_HELPER.getCleanState(target.state) : '');
    }
    if (/常溫狀態\s*>\s*元素/.test(label)) {
        return !!element && typeof QUIZ_HELPER !== 'undefined' && QUIZ_HELPER.getCleanState(element.state) === QUIZ_HELPER.getCleanState(target.state);
    }
    if (/同族/.test(label)) return !!element && element.z !== target.z && element.iupac === target.iupac;
    if (/同一週期/.test(label)) return !!element && element.z !== target.z && element.p === target.p;
    if (/化學性質相似/.test(label)) return !!element && element.z !== target.z && element.iupac === target.iupac;
    if (/電負度/.test(label)) {
        const answerEl = calibrationElementFromValue(answerPlain, pool);
        const optionEl = element;
        if (!answerEl || !optionEl || typeof QUIZ_HELPER === 'undefined') return calibrationOptionKey(value) === calibrationOptionKey(quizData.answer);
        return QUIZ_HELPER.getEN(optionEl.s) === QUIZ_HELPER.getEN(answerEl.s);
    }
    if (/區塊/.test(label)) return plain === calibrationBlockForElement(target);
    if (window.calCategory === 'formula' || /名稱與化學式|化學式判讀|離子與組成/.test(label)) {
        const formulaItem = formulaItemForQuiz(quizData);
        if (!formulaItem) return calibrationOptionKey(value) === calibrationOptionKey(quizData.answer);
        if (/名稱配對是非題|化學式判讀：正誤是非題/.test(label)) {
            return calibrationOptionKey(value) === calibrationOptionKey(quizData.answer);
        }
        if (/化學式 → 中文名稱/.test(label)) return plain === formulaItem.n;
        if (/中文名稱 → (?:電中性)?化學式|選出正確化學式|正確化學式/.test(label)) {
            return calibrationFormulaPlain(value).replace(/\s+/g, '').replace(/[·.]/g, '·')
                === String(formulaItem.f).replace(/\s+/g, '').replace(/[·.]/g, '·');
        }
        if (/陽陰離子|化學式 → 離子/.test(label)) {
            return calibrationOptionKey(value) === calibrationOptionKey(quizData.answer);
        }
        if (/指定離子數量|指定元素原子數|個數比|變價金屬/.test(label)) {
            return calibrationOptionKey(value) === calibrationOptionKey(quizData.answer);
        }
    }
    return calibrationOptionKey(value) === calibrationOptionKey(quizData.answer);
}

function validateCalibrationQuestion(quizData, type, target) {
    const opts = Array.isArray(quizData.forcedOpts) ? quizData.forcedOpts : [];
    const pool = window.quizState && Array.isArray(window.quizState.pool) ? window.quizState.pool : [];
    const keys = opts.map(calibrationOptionKey);
    if (!quizData.answer || !quizData.question || opts.length < 2) return { ok: false, reason: '缺少題幹、答案或選項' };
    if (new Set(keys).size !== keys.length) return { ok: false, reason: '選項文字重複' };
    if (keys.filter(key => key === calibrationOptionKey(quizData.answer)).length !== 1) return { ok: false, reason: '正解字串不唯一' };
    const semanticCount = opts.filter(value => calibrationSemanticMatch(quizData, value, target, pool)).length;
    if (semanticCount !== 1) return { ok: false, reason: `化學語意正解數為 ${semanticCount}` };
    if (!quizData.correctReason || /^依本題所屬化學規則判定/.test(quizData.correctReason)) {
        return { ok: false, reason: '缺少題目專屬詳解' };
    }
    if (window.calCategory === 'periodic') {
        if (quizData._periodicProfile === 'challenge' && Number(quizData._periodicRequiredSteps) < 2) {
            return { ok: false, reason: '挑戰題必要推理步驟不足' };
        }
        if (quizData._periodicProfile === 'challenge' && quizData._periodicUsesChinese) {
            return { ok: false, reason: '挑戰題不應使用中文元素名稱' };
        }
    }
    return { ok: true, reason: '' };
}

function calibrationFormulaPlain(value) {
    return String(value == null ? '' : value)
        .replace(/<[^>]*>/g, '')
        .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, ch => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(ch)))
        .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, ch => String('⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(ch)));
}

function formatCalibrationExplanationValue(value, quizData) {
    const raw = String(value == null ? '' : value);
    if (quizData && quizData.displayMode === 'hybrid') {
        return formatHybridNotationHtml(raw);
    }
    if (quizData && quizData.displayMode === 'noble') {
        return formatElectronConfigMath(raw);
    }
    if (quizData && quizData.displayMode === 'formula' && !/<[^>]+>/.test(raw)) {
        return formatCalibrationChemistryHtml(formatChemLabel(formatFormula(raw)));
    }
    if ((quizData && (quizData.displayMode === 'ion' || quizData.useChemFormat)) || /<sub|<sup|[₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]/.test(raw)) {
        return formatCalibrationChemistryHtml(formatChemLabel(raw));
    }
    return formatCalibrationChemistryHtml(raw);
}

function renderCalibrationExplanation(quizData, selectedOption, isCorrect) {
    const answer = formatCalibrationExplanationValue(quizData.answer, quizData);
    const explanation = quizData.explanation || {};
    const structured = explanation && typeof explanation === 'object'
        && [explanation.basis, explanation.steps, explanation.conclusion].some(Boolean);
    const reason = [explanation.basis, explanation.steps, explanation.conclusion]
        .filter(Boolean).join(' ') || quizData.correctReason || '本題詳解資料尚未建立。';
    const labels = explanation.labels || ['核心規則', '判斷依據', '結論'];
    const reasonHtml = structured
        ? [
            [labels[0], explanation.basis],
            [labels[1], explanation.steps],
            [labels[2], explanation.conclusion]
        ].filter(([, value]) => value)
            .map(([label, value]) => `<div class="cal-explanation-line"><strong>${label}：</strong>${value}</div>`)
            .join('')
        : `<div class="cal-explanation-line"><strong>解題：</strong>${reason}</div>`;
    const selectedKey = calibrationOptionKey(selectedOption);
    const selectedReason = !isCorrect && quizData.optionRationales
        ? quizData.optionRationales[selectedKey]
        : '';
    const selectedReasonText = String(selectedReason || '').replace(/[。；，,;\s]+$/g, '');
    const wrongNote = selectedReasonText
        ? `<div class="cal-explanation-line cal-explanation-mistake"><strong>你錯在：</strong>${selectedReasonText}；正確判斷應為 ${answer}。</div>`
        : (isCorrect
            ? `<div class="cal-explanation-line cal-explanation-correct"><strong>判斷正確：</strong>${answer} 符合題目條件。</div>`
            : '');
    return formatCalibrationChemistryHtml(`<div class="cal-explanation-line"><strong>正確答案：</strong>${answer}</div>`
        + `${reasonHtml}${wrongNote}`);
}

function attachGenericCalibrationReason(type, quizData, target, parsed) {
    if (quizData.explanation && quizData.explanation.basis) {
        quizData.showExplanation = true;
        return;
    }
    if (quizData._knowledgeFact && quizData.correctReason) {
        quizData.showExplanation = true;
        return;
    }
    if (quizData._periodicCustomExplanation && quizData.correctReason) {
        quizData.showExplanation = true;
        return;
    }
    if (quizData._formulaMassExplanation && quizData.correctReason) {
        quizData.showExplanation = true;
        return;
    }
    const label = quizData.type || '';
    const answer = calibrationFormulaPlain(quizData.answer);
    const pool = window.quizState && Array.isArray(window.quizState.pool) ? window.quizState.pool : [];
    const answerElement = calibrationElementFromValue(answer, pool) || target;
    const elementText = target ? `${target.cn}（${target.s}）` : '';
    let reason = '';
    if (/身分識別：簡寫/.test(label)) {
        reason = `${target.s} 是${target.cn}的元素符號；其原子序為 ${target.z}。`;
    } else if (/身分識別：中文名/.test(label)) {
        reason = `題目給的元素是${target.cn}，資料對應的元素符號為 ${target.s}（原子序 ${target.z}）。`;
    } else if (/識別校準：符號/.test(label)) {
        reason = `${target.s} 的原子序為 ${target.z}，原子核內因此有 ${target.z} 個質子。`;
    } else if (/識別校準：原子序|質子數逆推/.test(label)) {
        reason = `原子序等於質子數；${answer} 對應的元素是${target.cn}（${target.s}）。`;
    } else if (/位置定位/.test(label)) {
        const coord = quizData.coordMode === 'ab'
            ? `第${target.p}週期、${target.g}族`
            : `第 ${target.p} 週期、第 ${target.iupac} 族`;
        reason = `${elementText} 位於${coord}，原子序為 ${target.z}；依題目要求取出 ${answer}。`;
    } else if (/中子總數/.test(label) && quizData._periodicParticle) {
        const p = quizData._periodicParticle;
        reason = `質量數 A=${p.a}、原子序 Z=${p.z}，所以中子數 n=A−Z=${p.a}−${p.z}=${p.n}。`;
    } else if (/計算：電子總數/.test(label) && quizData._periodicParticle) {
        const p = quizData._periodicParticle;
        reason = `由電子數 e=Z−q=${p.z}−(${p.q})=${p.e}，所以答案為 ${answer}。`;
    } else if (/計算：質子總數/.test(label) && quizData._periodicParticle) {
        reason = `質子數等於原子序；${quizData._periodicParticle.element.s} 的 Z=${quizData._periodicParticle.z}，所以答案為 ${answer}。`;
    } else if (/質子／中子／電子反推/.test(label) && quizData._periodicParticle) {
        const p = quizData._periodicParticle;
        reason = `由 p=${p.p} 判定 Z=${p.z}，由 n=${p.n} 得 A=${p.a}，再由 e=${p.e} 得 q=Z−e=${p.q}；因此為 ${answer}。`;
    } else if (/電子數逆推/.test(label) && quizData._periodicParticle) {
        const p = quizData._periodicParticle;
        reason = `核對每個選項的 e=Z−q；正解 ${answer} 的電子數為 ${p.e}。`;
    } else if (/等電子/.test(label)) {
        const p = quizData._periodicParticle;
        reason = p
            ? `正解 ${answer} 的電子數為 Z−q=${p.z}−(${p.q})=${p.e}；其他選項的電子數不同。`
            : `核對每個選項的 Z−q；只有 ${answer} 與題目粒子的電子數相同。`;
    } else if (/組態辨識|組態逆推/.test(label)) {
        reason = `依填入順序核對 ${target ? target.noble : answer} 的末端次層與總電子數，因此對應答案為 ${answer}。`;
    } else if (/價電子數/.test(label)) {
        reason = `${target.s} 的價電子來自最外層（過渡元素另核對未填滿 d 次層），逐項統計得到 ${answer} 個。`;
    } else if (/未成對/.test(label)) {
        reason = `依 ${target.s} 的基態電子組態，等能軌域先單獨佔據再配對；依洪德定則得到 ${answer} 個未成對電子。`;
    } else if (/軌域總數統計/.test(label)) {
        const orb = (label.match(/([SPD]) 軌域/) || [,''])[1].toLowerCase();
        reason = `展開 ${target.s} 的電子組態後，把所有能階的 ${orb} 軌域電子逐項相加，總數為 ${answer}。`;
    } else if (/價電子能階統計/.test(label)) {
        reason = `只統計題目指定價電子能階，${target.s} 在該次層有 ${answer} 顆電子。`;
    } else if (/同族/.test(label)) {
        reason = `${target.s} 位於第 ${target.iupac} 族；正解 ${answer} 也位於第 ${target.iupac} 族。`;
    } else if (/同一週期/.test(label)) {
        reason = `${target.s} 位於第 ${target.p} 週期；正解 ${answer} 的最高主量子數也為 ${target.p}。`;
    } else if (/區塊/.test(label)) {
        reason = `由 ${target.s} 電子組態最後填入的次層判斷，所屬為 ${calibrationBlockForElement(target)}。`;
    } else if (/電負度/.test(label)) {
        const winnerEN = answerElement && typeof QUIZ_HELPER !== 'undefined' ? QUIZ_HELPER.getEN(answerElement.s) : null;
        reason = `依 Pauling 電負度資料，${answerElement ? answerElement.s : answer} 的數值最大${winnerEN == null ? '' : `（${winnerEN}）`}。`;
    } else if (/分類/.test(label)) {
        const className = /分類\s*>/.test(label) && answerElement ? answerElement.type : target.type;
        reason = `${elementText || (answerElement ? answerElement.cn : answer)} 的週期表位置與價電子特徵對應「${className}」分類。`;
    } else if (/常溫狀態/.test(label)) {
        const state = typeof QUIZ_HELPER !== 'undefined' ? QUIZ_HELPER.getCleanState(target.state) : answer;
        reason = `在 25°C、1 atm 下，${elementText} 的熔點與沸點範圍使其呈${state}；正解為 ${answer}。`;
    } else if (/化學性質相似/.test(label)) {
        reason = `${target.s} 與 ${answer} 同屬第 ${target.iupac} 族，價電子排列相近，因此化學性質最相似。`;
    } else if (/混成軌域|混成|結構圖/.test(label)) {
        const d = quizData._hybridDomains;
        reason = d
            ? `標示原子有 ${d.sigma} 個 σ 鍵域與 ${d.lonePairs} 對孤電子對，共 ${d.total} 個電子域，故為 ${answer} 混成。`
            : `依題目分子中標示原子的 σ 鍵域與孤電子對判斷電子域數，與 ${answer} 混成相符。`;
    } else if (/分子形狀/.test(label)) {
        const d = quizData._vseprDomains;
        reason = d
            ? `中心原子共有 ${d.total} 個電子域（${d.sigma} 個鍵域、${d.lonePairs} 對孤電子對），依 VSEPR 得到${answer}。`
            : `依題目分子的電子域總數與孤電子對，先判斷電子域幾何，再得到${answer}。`;
    } else if (/氧化數/.test(label)) {
        const ox = quizData._oxidationContext;
        reason = ox
            ? `令 ${ox.element} 的氧化數為 x，依「各原子氧化數總和＝${ox.charge === 0 ? '0' : ox.charge}」列式，解得 x=${answer}。`
            : `依氧化數總和等於分子或離子總電荷，代入題目化學式後得到 ${answer}。`;
    } else if (/沉澱|溶解|顏色|焰色|錯離子|氨水|強酸|強鹼/.test(label)) {
        const precip = quizData._precipContext;
        reason = precip
            ? `本題屬「${precip.subtype}」；${precip.rule}。`
            : `依題目指定的沉澱表規則與例外，核對題幹物種後判定為 ${answer}。`;
    } else if (/名稱與化學式|化學式判讀|離子與組成/.test(label)) {
        const item = formulaItemForQuiz(quizData);
        reason = item && item.ions
            ? `先核對 ${calibrationIonNotation(item.ions.cation)} 與 ${calibrationIonNotation(item.ions.anion)} 的電荷比，再展開括號與下標；因此答案為 ${answer}。`
            : `由題目名稱、離子電荷、原子守恆與下標規則逐項核對，得到 ${answer}。`;
    }
    const finalReason = reason || `本題題幹指定的條件與答案 ${answer} 已逐項核對。`;
    setCalibrationReason(quizData,
        target && Number(target.z) >= 104 && /分類|常溫狀態|化學性質/.test(label)
            ? `${periodicDataPremise(target)}${finalReason}`
            : finalReason);
}

function formulaItemForQuiz(quizData) {
    const data = Array.isArray(window.CHEM_FORMULA_DATA) ? window.CHEM_FORMULA_DATA : [];
    if (quizData && quizData._formulaItem) return quizData._formulaItem;
    const answerPlain = calibrationFormulaPlain(quizData.answer).replace(/[₀₁₂₃₄₅₆₇₈₉]/g, ch => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(ch)));
    return data.find(item => item.f === answerPlain)
        || data.find(item => item.n === quizData.answer)
        || data.find(item => quizData.question && quizData.question.includes(`「${item.n}」`))
        || data.find(item => quizData.question && quizData.question.includes(item.n));
}

function calibrationFormulaAscii(value) {
    return calibrationFormulaPlain(value).replace(/\s+/g, '').replace(/[·.]/g, '·');
}

function calibrationParseFormula(value) {
    const formula = calibrationFormulaAscii(value).replace(/·/g, '.');
    const total = {};
    const add = (dest, source, multiplier) => Object.keys(source).forEach(key => {
        dest[key] = (dest[key] || 0) + source[key] * multiplier;
    });
    const parseSegment = segment => {
        let index = 0;
        let coefficient = 1;
        const leading = segment.match(/^\d+/);
        if (leading) {
            coefficient = Number(leading[0]);
            index = leading[0].length;
        }
        const parseGroup = stop => {
            const counts = {};
            while (index < segment.length) {
                if (stop && segment[index] === stop) {
                    index++;
                    break;
                }
                if (segment[index] === '(') {
                    index++;
                    const nested = parseGroup(')');
                    const multiplierMatch = segment.slice(index).match(/^\d+/);
                    const multiplier = multiplierMatch ? Number(multiplierMatch[0]) : 1;
                    if (multiplierMatch) index += multiplierMatch[0].length;
                    add(counts, nested, multiplier);
                } else if (/[A-Z]/.test(segment[index])) {
                    let symbol = segment[index++];
                    if (index < segment.length && /[a-z]/.test(segment[index])) symbol += segment[index++];
                    const numberMatch = segment.slice(index).match(/^\d+/);
                    const number = numberMatch ? Number(numberMatch[0]) : 1;
                    if (numberMatch) index += numberMatch[0].length;
                    counts[symbol] = (counts[symbol] || 0) + number;
                } else {
                    index++;
                }
            }
            return counts;
        };
        return { counts: parseGroup(''), coefficient };
    };
    formula.split('.').forEach(segment => {
        if (!segment) return;
        const parsed = parseSegment(segment);
        add(total, parsed.counts, parsed.coefficient);
    });
    return total;
}

function calibrationFormulaDisplay(value) {
    return formatCalibrationExplanationValue(value, { displayMode: 'formula' });
}

function calibrationFormulaIonName(ion) {
    if (!ion) return '';
    const symbol = String(ion.symbol || '');
    const charge = Number(ion.charge);
    if (symbol === 'Fe') return charge === 2 ? '亞鐵離子' : '鐵離子';
    if (symbol === 'Cu') return charge === 1 ? '亞銅離子' : '銅離子';
    if (symbol === 'Sn') return charge === 2 ? '亞錫離子' : '錫離子';
    if (symbol === 'MnO4') return charge === -1 ? '過錳酸根' : '錳酸根';
    const names = {
        H: '氫離子', Li: '鋰離子', Na: '鈉離子', K: '鉀離子', Mg: '鎂離子', Ca: '鈣離子',
        Sr: '鍶離子', Ba: '鋇離子', Al: '鋁離子', Zn: '鋅離子', Ag: '銀離子', Cu: '銅離子',
        Pb: '鉛離子', Cr: '鉻離子', Mn: '錳離子', Co: '鈷離子', Ni: '鎳離子', NH4: '銨根',
        Cl: '氯離子', Br: '溴離子', I: '碘離子', F: '氟離子', O: '氧離子', O2: '過氧根', OH: '氫氧根',
        NO3: '硝酸根', NO2: '亞硝酸根', SO4: '硫酸根', SO3: '亞硫酸根', CO3: '碳酸根',
        HCO3: '碳酸氫根', PO4: '磷酸根', HPO4: '磷酸氫根', H2PO4: '磷酸二氫根',
        CH3COO: '醋酸根', C2O4: '草酸根', S: '硫離子', S2O3: '硫代硫酸根',
        CrO4: '鉻酸根', Cr2O7: '二鉻酸根', MnO3: '亞錳酸根', ClO: '次氯酸根',
        ClO2: '亞氯酸根', ClO3: '氯酸根', ClO4: '過氯酸根', IO3: '碘酸根'
    };
    return names[symbol] || `${symbol}離子`;
}

function calibrationFormulaOxyanionNote(ion) {
    if (!ion) return '';
    const key = `${ion.symbol}:${Number(ion.charge)}`;
    const notes = {
        'ClO:-1': '氯含氧酸根系列中氧最少，命名為次氯酸根',
        'ClO2:-1': '氯含氧酸根系列中氧數比次氯酸根多 1，命名為亞氯酸根',
        'ClO3:-1': '氯含氧酸根系列的基準氧數，命名為氯酸根',
        'ClO4:-1': '氯含氧酸根系列中氧最多，命名為過氯酸根',
        'NO2:-1': '氮含氧酸根系列中氧較少，命名為亞硝酸根',
        'NO3:-1': '氮含氧酸根系列中氧較多，命名為硝酸根',
        'SO3:-2': '硫含氧酸根系列中氧較少，命名為亞硫酸根',
        'SO4:-2': '硫含氧酸根系列中氧較多，命名為硫酸根',
        'MnO3:-2': '錳含氧酸根系列中氧較少且為 2−，命名為亞錳酸根',
        'MnO4:-2': '錳含氧酸根為 2− 且有 4 個氧，命名為錳酸根',
        'MnO4:-1': '同樣有 4 個氧但電荷為 1−，因此是過錳酸根，不是錳酸根',
        'CrO4:-2': 'CrO₄²⁻ 是鉻酸根；Cr₂O₇²⁻ 則是二鉻酸根，兩者不可混名',
        'Cr2O7:-2': 'Cr₂O₇²⁻ 由二鉻與七氧組成，命名為二鉻酸根'
    };
    return notes[key] || '';
}

function calibrationFormulaOxyacidNote(item) {
    const raw = calibrationFormulaAscii(item && item.f);
    const notes = {
        HClO: 'HClO 含 1 個氧，是氯含氧酸系列的最低級，命名為次氯酸',
        HClO2: 'HClO₂ 含 2 個氧，比次氯酸多 1 個氧，命名為亞氯酸',
        HClO3: 'HClO₃ 含 3 個氧，是氯含氧酸系列的基準級，命名為氯酸',
        HClO4: 'HClO₄ 含 4 個氧，是氯含氧酸系列的最高級，命名為過氯酸',
        HNO2: 'HNO₂ 的含氧酸根為 NO₂⁻，氧數較少，命名為亞硝酸',
        HNO3: 'HNO₃ 的含氧酸根為 NO₃⁻，氧數較多，命名為硝酸',
        H2SO3: 'H₂SO₃ 的含氧酸根為 SO₃²⁻，氧數較少，命名為亞硫酸',
        H2SO4: 'H₂SO₄ 的含氧酸根為 SO₄²⁻，氧數較多，命名為硫酸'
    };
    return notes[raw] || '';
}

function calibrationFormulaHydrateInfo(item) {
    const raw = calibrationFormulaAscii(item && item.f);
    const match = raw.match(/^(.+?)·(\d+)H2O$/i);
    return match ? { main: match[1], waters: Number(match[2]) } : null;
}

function calibrationFormulaCountsText(counts) {
    return Object.keys(counts || {}).map(symbol => `${symbol}=${counts[symbol]}`).join('、');
}

function calibrationFormulaGcd(a, b) {
    let x = Math.abs(Number(a) || 0), y = Math.abs(Number(b) || 0);
    while (y) [x, y] = [y, x % y];
    return x || 1;
}

function calibrationFormulaChargeDetails(item) {
    if (!item || !item.ions) return null;
    const c = item.ions.cation, a = item.ions.anion;
    const cCharge = Number(c.charge), aCharge = Number(a.charge);
    const expectedC = Math.abs(aCharge) / calibrationFormulaGcd(cCharge, aCharge);
    const expectedA = Math.abs(cCharge) / calibrationFormulaGcd(cCharge, aCharge);
    return {
        c, a, cName: calibrationFormulaIonName(c), aName: calibrationFormulaIonName(a),
        cNotation: calibrationIonNotation(c), aNotation: calibrationIonNotation(a),
        ratio: `${c.count}:${a.count}`,
        expectedRatio: `${expectedC}:${expectedA}`,
        chargeSum: `${c.count}×(${cCharge >= 0 ? '+' : ''}${cCharge}) + ${a.count}×(${aCharge}) = ${c.count * cCharge + a.count * aCharge}`
    };
}

function calibrationFormulaAtomDetail(item, atom, count) {
    const raw = calibrationFormulaAscii(item && item.f);
    const hydrate = calibrationFormulaHydrateInfo(item);
    if (hydrate) {
        const mainCounts = calibrationParseFormula(hydrate.main);
        const waterContribution = atom === 'H' ? hydrate.waters * 2 : (atom === 'O' ? hydrate.waters : 0);
        const mainCount = mainCounts[atom] || 0;
        return `先算主鹽 ${calibrationFormulaDisplay(hydrate.main)} 中的 ${atom}=${mainCount}，再看中點後 ${hydrate.waters}${calibrationFormulaDisplay('H2O')} 只貢獻 ${atom}=${waterContribution}；所以 ${atom} 總數為 ${mainCount}+${waterContribution}=${count}。`;
    }
    const group = raw.match(/\(([^()]+)\)(\d+)/);
    if (group) {
        const inside = calibrationParseFormula(group[1]);
        const multiplier = Number(group[2]);
        if (inside[atom]) return `括號內 ${group[1]} 含 ${atom}=${inside[atom]}，括號外下標 ${multiplier} 使其成為 ${inside[atom]}×${multiplier}=${inside[atom] * multiplier}；再加上式中其他 ${atom}，總數為 ${count}。`;
    }
    const escaped = String(atom).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = raw.match(new RegExp(`${escaped}(\\d+)`));
    return match
        ? `讀取 ${atom} 後的下標 ${match[1]}，且沒有其他括號或水合物項目，因此 ${atom} 原子數為 ${count}。`
        : `${atom} 未標下標，表示每個化學式單位只有 1 個 ${atom}；展開整個化學式後得到 ${count} 個。`;
}

function setFormulaDetailedExplanation(quizData, item) {
    if (!quizData || !item) return;
    const label = quizData.type || '';
    const formula = calibrationFormulaDisplay(item.f);
    const hydrate = calibrationFormulaHydrateInfo(item);
    const charges = calibrationFormulaChargeDetails(item);
    const counts = quizData._formulaAtomCounts || calibrationParseFormula(item.f);

    if (/名稱配對是非題/.test(label)) {
        const stated = (String(quizData.question || '').match(/中文名稱是「([^」]+)」/) || [,''])[1] || item.n;
        setCalibrationExplanation(quizData,
            `先由 ${formula} 讀出元素、離子或分子骨架，再依命名規則核對題幹的中文名稱「${stated}」。`,
            charges
                ? `${charges.cNotation} 是${charges.cName}，${charges.aNotation} 是${charges.aName}${calibrationFormulaOxyanionNote(charges.a) ? `；${calibrationFormulaOxyanionNote(charges.a)}` : ''}，所以主鹽名稱應由這兩個離子組合${hydrate ? `；中點後 ${hydrate.waters}${calibrationFormulaDisplay('H2O')} 只表示結晶水` : ''}。`
                : `此式不以陽、陰離子配對；逐一讀取元素符號、下標與分子前綴後，得到名稱「${item.n}」。`,
            `正確名稱為「${item.n}」，因此題幹應判為${quizData.answer === '是' ? '是' : '否'}。`);
        return;
    }
    if (/離子數量是非題/.test(label)) {
        const ratio = charges ? charges.ratio : '';
        setCalibrationExplanation(quizData,
            `先辨認「${item.n}」的陽、陰離子及其電荷，再讀取化學式下標所代表的離子個數。`,
            charges
                ? `${charges.cNotation} 有 ${charges.c.count} 個、${charges.aNotation} 有 ${charges.a.count} 個；總電荷驗算為 ${charges.chargeSum}。`
                : `此題須直接展開化學式下標，區分離子個數與元素原子個數。`,
            `正確的陽、陰離子最簡個數比為 ${ratio}，所以題幹敘述應判為${quizData.answer === '是' ? '是' : '否'}。`);
        return;
    }
    if (/正誤是非題/.test(label)) {
        const stated = (String(quizData.question || '').match(/正確化學式是\s*(.+?)。/) || [,''])[1] || item.f;
        const statedDisplay = calibrationFormulaDisplay(stated);
        setCalibrationExplanation(quizData,
            `先將題幹提出的化學式 ${statedDisplay} 與「${item.n}」所需的離子或分子組成逐項對照。`,
            charges
                ? `${charges.cNotation} 與 ${charges.aNotation} 應以 ${charges.expectedRatio} 配成電中性，且多原子離子下標須正確套用${hydrate ? `；${calibrationFormulaDisplay(hydrate.main)} 後的中點只表示結晶水` : ''}。`
                : `再核對元素下標、括號與分子前綴；正確式為 ${formula}。`,
            `「${item.n}」的正確化學式是 ${formula}，所以題幹應判為${quizData.answer === '是' ? '是' : '否'}。`);
        return;
    }
    if (/變價金屬/.test(label) && charges) {
        const metal = charges.c;
        setCalibrationExplanation(quizData,
            `由 ${formula} 讀出陰離子 ${charges.aNotation} 的電荷與數量，再令每個 ${metal.symbol} 金屬離子電荷為 x。`,
            `${metal.count}x + ${charges.a.count}×(${charges.a.charge}) = 0，解得 x=${metal.charge}；依此氧化態命名為${charges.cName}。`,
            `因此答案為 ${quizData.answer}，不是另一個氧化態。`);
        return;
    }
    if (/指定離子數量/.test(label) && charges) {
        const ion = quizData._formulaAskedIon || charges.c;
        const ionLabel = calibrationIonNotation(ion);
        setCalibrationExplanation(quizData,
            `在一個${hydrate ? '主鹽' : '化學式'}單位中，先讀取 ${formula} 的離子下標；中點後的結晶水不會改變主鹽離子個數。`,
            `${ionLabel} 的化學式下標為 ${ion.count === 1 ? '省略 1' : ion.count}，因此一個化學式單位含 ${ion.count} 個 ${ionLabel}；總電荷仍可由 ${charges.chargeSum} 驗算。`,
            `答案為 ${quizData.answer} 個 ${ionLabel}。`);
        return;
    }
    if (/個數比/.test(label) && charges) {
        setCalibrationExplanation(quizData,
            `先讀取 ${formula} 中陽離子與陰離子的下標，分別得到 ${charges.c.count} 個 ${charges.cNotation} 與 ${charges.a.count} 個 ${charges.aNotation}。`,
            `兩者的個數比為 ${charges.c.count}:${charges.a.count}；再除以最大公因數後仍是最簡比，且電荷驗算為 ${charges.chargeSum}。`,
            `所以陽、陰離子的最簡個數比為 ${charges.ratio}。`);
        return;
    }
    if (/指定元素原子數/.test(label)) {
        const atom = quizData._formulaAskedAtom || Object.keys(counts)[0] || 'O';
        const count = counts[atom] || 0;
        setCalibrationExplanation(quizData,
            `先把 ${formula} 拆成元素、括號與水合物各部分，題目指定的是 ${atom} 原子，不是 ${atom} 所在離子團的個數。`,
            calibrationFormulaAtomDetail(item, atom, count),
            `因此一個化學式單位含有 ${count} 個 ${atom} 原子。`);
        return;
    }
    if (/化學式 → 離子|中文名稱 → 陽陰離子/.test(label) && charges) {
        setCalibrationExplanation(quizData,
            `先由 ${formula} 或名稱辨認陽離子與陰離子：${charges.cNotation} 是${charges.cName}，${charges.aNotation} 是${charges.aName}。`,
            `化學式中的數量為 ${charges.c.count}:${charges.a.count}，總電荷驗算為 ${charges.chargeSum}；${calibrationFormulaOxyanionNote(charges.a) || '因此離子種類與電荷均符合題目所給物質。'}`,
            `答案為 ${charges.cName}、${charges.aName}。`);
        return;
    }
    if (/化學式 → 中文名稱/.test(label) && item.ions) {
        setCalibrationExplanation(quizData,
            `從 ${formula} 先讀出 ${charges.cNotation} 與 ${charges.aNotation}，再依金屬氧化態、酸根級序與水合數命名。`,
            `${charges.cNotation} 是${charges.cName}，${charges.aNotation} 是${charges.aName}${calibrationFormulaOxyanionNote(charges.a) ? `；${calibrationFormulaOxyanionNote(charges.a)}` : ''}${hydrate ? `；中點後 ${hydrate.waters}${calibrationFormulaDisplay('H2O')} 的係數只表示結晶水數量` : ''}。`,
            `所以中文名稱為「${item.n}」。`);
        return;
    }
    if (/化學式 → 中文名稱/.test(label)) {
        const oxyacidNote = calibrationFormulaOxyacidNote(item);
        setCalibrationExplanation(quizData,
            `先逐一讀取 ${formula} 的元素符號與下標，得到元素組成 ${calibrationFormulaCountsText(counts)}。`,
            item.kind === 'element'
                ? `這是元素的常態單質；下標表示分子中有 ${Object.values(counts)[0]} 個原子，但中文名稱仍取元素名。`
                : oxyacidNote || `此式沒有陽、陰離子配對，依分子前綴或該物質的常用名稱把各元素數量轉成中文。`,
            `因此中文名稱為「${item.n}」。`);
        return;
    }
    if (/中文名稱 → (?:電中性)?化學式|選出正確化學式/.test(label) && item.ions && charges) {
        const mainFormula = hydrate ? calibrationFormulaDisplay(hydrate.main) : formula;
        setCalibrationExplanation(quizData,
            `先依名稱辨認 ${charges.cName} ${charges.cNotation} 與 ${charges.aName} ${charges.aNotation}，再使用其電荷決定化學式。`,
            `為使總電荷為 0，陽、陰離子個數比為 |${charges.a.charge}|:${charges.c.charge}，約成最簡比 ${charges.expectedRatio}；${charges.a.count > 1 ? `${charges.aNotation} 出現 ${charges.a.count} 個，必須加括號` : `${charges.aNotation} 只有 1 個，不加括號`}${hydrate ? `；主鹽先寫成 ${mainFormula}，中點後 ${hydrate.waters}${calibrationFormulaDisplay('H2O')} 只作用於結晶水` : ''}。`,
            `所以正確化學式為 ${formula}。`);
        return;
    }
    if (/中文名稱 → (?:電中性)?化學式|選出正確化學式/.test(label)) {
        const oxyacidNote = calibrationFormulaOxyacidNote(item);
        setCalibrationExplanation(quizData,
            `先判斷「${item.n}」是單質、分子化合物或酸，再依名稱中的元素前綴與下標寫出組成。`,
            oxyacidNote ? `${oxyacidNote}；由名稱中的「次／亞／正／過」級序回寫氧數，得到 ${calibrationFormulaCountsText(counts)}。` : `元素數量由 ${calibrationFormulaCountsText(counts)} 逐項對應；分子化合物不以離子電荷交叉，而是依分子命名規則保留各元素下標。`,
            `所以正確化學式為 ${formula}。`);
    }
}

function formulaOptionDataEntry(value) {
    const data = Array.isArray(window.CHEM_FORMULA_DATA) ? window.CHEM_FORMULA_DATA : [];
    const formulaKey = calibrationFormulaAscii(value);
    return data.find(item => calibrationFormulaAscii(item.f) === formulaKey)
        || data.find(item => item.n === calibrationFormulaPlain(value));
}

function formulaOptionIonEntry(value) {
    const data = Array.isArray(window.CHEM_FORMULA_DATA) ? window.CHEM_FORMULA_DATA : [];
    const key = calibrationOptionKey(value);
    return data.find(item => item.ions && calibrationOptionKey(formulaIonPairForRationale(item)) === key) || null;
}

function formulaIonPairForRationale(item) {
    if (!item || !item.ions) return '';
    return `${calibrationIonNotation(item.ions.cation)}、${calibrationIonNotation(item.ions.anion)}`;
}

function calibrationFormulaNameRationale(item, other) {
    if (!item || !other) return `「${other ? other.n : '此名稱'}」沒有對應題目中的完整化學式。`;
    if (item.ions && other.ions) {
        if (item.ions.cation.symbol === other.ions.cation.symbol && Number(item.ions.cation.charge) !== Number(other.ions.cation.charge)) {
            return `把 ${item.ions.cation.symbol} 的氧化態讀錯：題目為 ${calibrationIonNotation(item.ions.cation)}（${calibrationFormulaIonName(item.ions.cation)}），不是 ${calibrationIonNotation(other.ions.cation)}（${calibrationFormulaIonName(other.ions.cation)}）`;
        }
        if (item.ions.anion.symbol === other.ions.anion.symbol && Number(item.ions.anion.charge) !== Number(other.ions.anion.charge)) {
            return `把含氧酸根級序讀錯：題目中的 ${calibrationIonNotation(item.ions.anion)} 應稱${calibrationFormulaIonName(item.ions.anion)}，不是${calibrationFormulaIonName(other.ions.anion)}`;
        }
        if (item.ions.cation.symbol === other.ions.cation.symbol && item.ions.anion.symbol !== other.ions.anion.symbol) {
            return `陽離子雖相同，但陰離子應為 ${calibrationFormulaIonName(item.ions.anion)}；選項改成了${calibrationFormulaIonName(other.ions.anion)}`;
        }
    }
    if (!!calibrationFormulaHydrateInfo(item) !== !!calibrationFormulaHydrateInfo(other)) {
        return `忽略了${calibrationFormulaHydrateInfo(item) ? '結晶水與水合數' : '無水主鹽與水合條件'}，題目物質應是「${item.n}」`;
    }
    return `把 ${calibrationFormulaDisplay(item.f)} 的元素、離子或下標對應成「${other.n}」；逐項核對後正確名稱應為「${item.n}」`;
}

function calibrationFormulaBinaryRationale(quizData, item) {
    const answer = quizData.answer;
    const label = quizData.type || '';
    if (answer === '是') {
        if (/名稱配對/.test(label)) return `題幹中的化學式 ${calibrationFormulaDisplay(item.f)} 確實對應「${item.n}」，否選項把正確配對判反`;
        if (/離子數量/.test(label) && item.ions) {
            const details = calibrationFormulaChargeDetails(item);
            return `正確個數比是 ${details.ratio}，且總電荷 ${details.chargeSum}；否選項把符合條件的敘述判反`;
        }
        return `正確式應為 ${calibrationFormulaDisplay(item.f)}；否選項把已符合離子比例、括號或下標規則的化學式判反`;
    }
    if (/名稱配對/.test(label)) {
        const stated = (String(quizData.question || '').match(/中文名稱是「([^」]+)」/) || [,''])[1] || '該名稱';
        return `${calibrationFormulaDisplay(item.f)} 依離子、氧化態或分子前綴判定應為「${item.n}」，題幹卻寫成「${stated}」`;
    }
    if (/離子數量/.test(label) && item.ions) {
        const details = calibrationFormulaChargeDetails(item);
        return `題幹的個數比不是 ${details.ratio}；應由下標讀出 ${details.c.count}:${details.a.count}，並以 ${details.chargeSum} 驗算`;
    }
    const stated = (String(quizData.question || '').match(/正確化學式是\s*(.+?)。/) || [,''])[1] || '';
    return `題幹提出的 ${calibrationFormulaDisplay(stated)} 不符合「${item.n}」的組成；正確化學式應為 ${calibrationFormulaDisplay(item.f)}`;
}

function calibrationFormulaOptionRationale(quizData, value, item) {
    if (!item || calibrationOptionKey(value) === calibrationOptionKey(quizData.answer)) return '';
    const label = quizData.type || '';
    if (/是非題/.test(label)) return formulaBinaryRationale(quizData, item);
    if (/化學式 → 中文名稱/.test(label)) {
        return calibrationFormulaNameRationale(item, formulaOptionDataEntry(value));
    }
    if (/中文名稱 → 陽陰離子|化學式 → 離子/.test(label)) {
        const candidate = formulaOptionIonEntry(value);
        if (candidate && candidate.ions && item.ions) {
            if (candidate.ions.cation.symbol !== item.ions.cation.symbol || Number(candidate.ions.cation.charge) !== Number(item.ions.cation.charge)) {
                return `陽離子應為 ${calibrationIonNotation(item.ions.cation)}（${calibrationFormulaIonName(item.ions.cation)}），選項列成 ${calibrationIonNotation(candidate.ions.cation)}（${calibrationFormulaIonName(candidate.ions.cation)}）`;
            }
            return `陰離子應為 ${calibrationIonNotation(item.ions.anion)}（${calibrationFormulaIonName(item.ions.anion)}），選項列成 ${calibrationIonNotation(candidate.ions.anion)}（${calibrationFormulaIonName(candidate.ions.anion)}）`;
        }
        return `選項列出的離子組成與「${item.n}」不一致；正確配對是 ${formulaIonPairForRationale(item)}`;
    }
    if (/指定離子數量|個數比|指定元素原子數|變價金屬/.test(label)) {
        const details = calibrationFormulaChargeDetails(item);
        if (/指定離子數量/.test(label) && details) {
            const ion = quizData._formulaAskedIon || details.c;
            return `由 ${calibrationFormulaDisplay(item.f)} 的下標可知 ${calibrationIonNotation(ion)} 有 ${ion.count} 個，選項卻填 ${value}`;
        }
        if (/個數比/.test(label) && details) {
            const option = String(value).trim();
            if (option === `${details.a.count}:${details.c.count}` && details.c.count !== details.a.count) return `把陽、陰離子個數順序顛倒；正確順序應是陽離子 ${details.c.count}：陰離子 ${details.a.count}`;
            return `下標直接給出陽、陰離子個數 ${details.c.count}:${details.a.count}，約成最簡比仍為 ${details.ratio}，不是 ${option}`;
        }
        if (/指定元素原子數/.test(label)) {
            const atom = quizData._formulaAskedAtom || 'O';
            const counts = quizData._formulaAtomCounts || calibrationParseFormula(item.f);
            return calibrationFormulaAtomDetail(item, atom, counts[atom] || 0).replace(`為 ${counts[atom] || 0}。`, `為 ${counts[atom] || 0}，不是 ${value}。`);
        }
        if (/變價金屬/.test(label) && details) return `由 ${details.chargeSum}=0 反推，${details.c.symbol} 應為 ${details.c.charge} 價，不是選項 ${value}`;
    }
    if (/中文名稱 → (?:電中性)?化學式|選出正確化學式/.test(label)) {
        const option = calibrationFormulaAscii(value);
        const correct = calibrationFormulaAscii(item.f);
        const noParentheses = correct.replace(/\(([^()]+)\)(\d*)/g, '$1$2');
        if (option === noParentheses && option !== correct) return `多原子離子出現不只 1 個卻漏寫括號；正確寫法為 ${calibrationFormulaDisplay(item.f)}`;
        const hydrate = calibrationFormulaHydrateInfo(item);
        if (hydrate) {
            const optionHydrate = option.match(/^(.+?)·(\d+)H2O$/i);
            if (optionHydrate && optionHydrate[1] === hydrate.main && Number(optionHydrate[2]) !== hydrate.waters) return `中點後的結晶水係數應為 ${hydrate.waters}，選項寫成 ${optionHydrate[2]}；此係數只作用於 H₂O`;
            if (option === `${hydrate.main}${hydrate.waters}H2O`) return `漏寫水合物中點；應把主鹽 ${calibrationFormulaDisplay(hydrate.main)} 與 ${hydrate.waters}${calibrationFormulaDisplay('H2O')} 分開`;
        }
        const expectedCounts = quizData._formulaAtomCounts || calibrationParseFormula(item.f);
        const actualCounts = calibrationParseFormula(value);
        const difference = Object.keys(expectedCounts).find(symbol => (actualCounts[symbol] || 0) !== expectedCounts[symbol]);
        if (difference) return `展開選項後 ${difference} 原子數為 ${actualCounts[difference] || 0}，但正確式應為 ${expectedCounts[difference]}；因此是 ${difference} 的下標或括號作用範圍寫錯`;
        const candidate = formulaOptionDataEntry(value);
        if (candidate && candidate.ions && item.ions) return calibrationFormulaNameRationale(item, candidate).replace(/^把 /, '把名稱或離子對應');
        return `選項 ${calibrationFormulaDisplay(value)} 沒有依「${item.n}」的命名、電荷比例與最簡下標寫成正確化學式 ${calibrationFormulaDisplay(item.f)}`;
    }
    return `選項 ${value} 未同時符合「${item.n}」的離子、下標與命名條件；正確答案為 ${quizData.answer}`;
}

function formulaConfusionScore(item, other) {
    if (!item || !other || item === other) return -1;
    let score = 0;
    if (item.g && item.g === other.g) score += 4;
    if (item.kind && item.kind === other.kind) score += 2;
    if (item.ions && other.ions) {
        if (item.ions.cation.symbol === other.ions.cation.symbol) score += 8;
        if (Number(item.ions.cation.charge) === Number(other.ions.cation.charge)) score += 2;
        if (item.ions.anion.symbol === other.ions.anion.symbol) score += 10;
        if (Number(item.ions.anion.charge) === Number(other.ions.anion.charge)) score += 4;
        if (item.ions.cation.count === other.ions.cation.count) score += 2;
        if (item.ions.anion.count === other.ions.anion.count) score += 2;
    }
    const a = String(item.f).replace(/\d/g, ''), b = String(other.f).replace(/\d/g, '');
    if (a === b) score += 5;
    return score;
}

function formulaNearNeighbors(item, limit) {
    const data = Array.isArray(window.CHEM_FORMULA_DATA) ? window.CHEM_FORMULA_DATA : [];
    return data.filter(other => other !== item)
        .map(other => ({ item: other, score: formulaConfusionScore(item, other) }))
        .filter(entry => entry.score > 0)
        .sort((a, b) => b.score - a.score || String(a.item.f).localeCompare(String(b.item.f)))
        .slice(0, limit || 12)
        .map(entry => entry.item);
}

// 公式題優先使用「只差最後一步」的近失誤：保留同一陽、陰離子骨架，
// 只改電荷比、括號、下標或水合數，避免用換一個金屬就能直接猜答案。
function formulaHighSimilarityDistractors(item) {
    const entries = [];
    const seen = new Set();
    const add = (value, reason) => {
        const key = calibrationOptionKey(value);
        if (!key || key === calibrationOptionKey(item && item.f) || seen.has(key)) return;
        seen.add(key);
        entries.push({ value, reason });
    };
    const ionicPart = (symbol, count) => {
        const n = Number(count);
        if (!symbol || !Number.isFinite(n) || n < 1) return '';
        if (n === 1) return symbol;
        return /^[A-Z][a-z]?$/.test(symbol) ? `${symbol}${n}` : `(${symbol})${n}`;
    };
    const raw = String(item && item.f || '');
    const hydrate = raw.match(/^(.+?)([·.])(\d+)H2O$/i);
    if (hydrate) {
        const main = hydrate[1], separator = hydrate[2], waterCount = Number(hydrate[3]);
        [waterCount - 1, waterCount + 1, waterCount + 2].filter(n => n > 0).forEach(n => {
            add(`${main}${separator}${n}H2O`, '保留主鹽骨架，只把結晶水數量判錯一步');
        });
        add(`${main}${waterCount}H2O`, '漏寫水合物分隔點，將結晶水誤接在主鹽後方');
    }
    if (item && item.ions) {
        const c = item.ions.cation, a = item.ions.anion;
        const make = (cc, aa, reason) => {
            const formula = ionicPart(c.symbol, cc) + ionicPart(a.symbol, aa);
            if (formula && formula !== raw) add(formula, reason);
        };
        make(Number(c.count) + 1, Number(a.count), '保留離子種類，但把陽、陰離子電荷比多算一格');
        make(Number(c.count), Number(a.count) + 1, '保留離子種類，但把陽、陰離子電荷比少算一格');
        if (Number(c.count) > 1) make(Number(c.count) - 1, Number(a.count), '忽略陽離子電荷比，少寫一個下標');
        if (Number(a.count) > 1) make(Number(c.count), Number(a.count) - 1, '忽略陰離子電荷比，少寫一個下標');
    }
    if (raw.includes('(')) {
        const noParentheses = raw.replace(/\(([^()]+)\)(\d*)/g, '$1$2');
        if (noParentheses !== raw) add(noParentheses, '漏掉多原子離子括號，導致下標只套到最後一個元素');
    }
    const normalizeImplicitOne = formula => String(formula || '')
        .replace(/([A-Z][a-z]?|\))1(?=[A-Z(·.]|$)/g, '$1');
    const matches = [...raw.matchAll(/\d+/g)];
    if (matches.length) {
        const m = matches[matches.length - 1], n = Number(m[0]);
        const lower = n <= 1 ? 2 : n - 1;
        const upper = n + 1;
        add(normalizeImplicitOne(raw.slice(0, m.index) + lower + raw.slice(m.index + m[0].length)), '只把最後一個下標少算一格，其他骨架仍相同');
        add(normalizeImplicitOne(raw.slice(0, m.index) + upper + raw.slice(m.index + m[0].length)), '只把最後一個下標多算一格，其他骨架仍相同');
    }
    // 元素分子題特別容易把雙原子分子誤看成單原子或任意多原子，
    // 這兩種選項比直接換成另一種元素更能檢查題目概念。
    const elemental = raw.match(/^([A-Z][a-z]?)(\d+)$/);
    if (elemental) {
        const symbol = elemental[1], n = Number(elemental[2]);
        add(symbol, '忽略元素在常態下以雙原子分子存在的規則');
        add(`${symbol}${n + 1}`, '保留元素符號，但把分子原子數誤增一個');
    }
    return entries;
}

function calibrationIonNotation(ion) {
    if (!ion) return '';
    const symbol = String(ion.symbol || '').replace(/\d/g, digit => '₀₁₂₃₄₅₆₇₈₉'[Number(digit)] || digit);
    const chargeNumber = Number(ion.charge);
    const charge = Number.isFinite(chargeNumber) && chargeNumber !== 0
        ? `${Math.abs(chargeNumber) === 1 ? '' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[Math.abs(chargeNumber)] || Math.abs(chargeNumber)}${chargeNumber > 0 ? '⁺' : '⁻'}`
        : '';
    return `${symbol}${charge}`;
}

function calibrationIonPair(item) {
    if (!item || !item.ions) return '';
    return `${calibrationIonNotation(item.ions.cation)}、${calibrationIonNotation(item.ions.anion)}`;
}

function refineFormulaQuestionOptions(quizData) {
    const item = formulaItemForQuiz(quizData);
    if (!item) return;
    setFormulaDetailedExplanation(quizData, item);
    const near = formulaNearNeighbors(item, 16);
    const distractors = [];
    const add = (value, reason) => {
        if (calibrationOptionKey(value) === calibrationOptionKey(quizData.answer)) return;
        if (distractors.some(entry => calibrationOptionKey(entry.value) === calibrationOptionKey(value))) return;
        distractors.push({ value, reason });
    };
    // 數量、比例、離子配對與是非題已有正確的顯示型態；只補理由，不把數字換成化學式。
    if (quizData.type.includes('是非題') || quizData.answer === '是' || quizData.answer === '否') {
        return;
    }
    if (quizData.type.includes('指定離子數量') || quizData.type.includes('個數比') || quizData.type.includes('指定元素原子數') || quizData.type.includes('變價金屬')) {
        return;
    }
    if (quizData.displayMode === 'ion') {
        if (item.ions) {
            const sameCation = near.filter(x => x.ions && x.ions.cation.symbol === item.ions.cation.symbol && x.ions.anion.symbol !== item.ions.anion.symbol);
            const sameAnion = near.filter(x => x.ions && x.ions.anion.symbol === item.ions.anion.symbol && x.ions.cation.symbol !== item.ions.cation.symbol);
            const sameCharge = near.filter(x => x.ions &&
                Number(x.ions.cation.charge) === Number(item.ions.cation.charge) &&
                Number(x.ions.anion.charge) === Number(item.ions.anion.charge));
            const ionEntries = [];
            sameCation.slice(0, 1).forEach(x => ionEntries.push({ value: calibrationIonPair(x), reason: '保留相同陽離子，卻把陰離子或其電荷判錯' }));
            sameAnion.slice(0, 1).forEach(x => ionEntries.push({ value: calibrationIonPair(x), reason: '保留相同陰離子，卻把陽離子或其變價判錯' }));
            sameCharge.slice(0, 2).forEach(x => ionEntries.push({ value: calibrationIonPair(x), reason: '電荷形式相近，但離子種類或組成不符' }));
            near.forEach(x => {
                if (ionEntries.length >= 3 || !x.ions) return;
                ionEntries.push({ value: calibrationIonPair(x), reason: '只在一個離子或電荷判斷步驟出錯' });
            });
            if (ionEntries.length >= 3) setCalibrationOptions(quizData, quizData.answer, ionEntries.slice(0, 3));
        }
        return;
    }
    if (quizData.type.includes('化學式 → 中文名稱')) {
        near.filter(x => x.n && x.n !== item.n).slice(0, 3).forEach(x => add(x.n, '把相同離子骨架或相鄰氧化態的名稱混在一起'));
    } else if (/中文名稱 → (?:電中性)?化學式|選出正確化學式/.test(quizData.type || '')) {
        formulaHighSimilarityDistractors(item).forEach(entry => add(entry.value, entry.reason));
        near.filter(x => x.f && x.f !== item.f).forEach(x => add(x.f, '保留部分化學式骨架，但把離子種類或相鄰氧化態判錯'));
    } else if (quizData.type.includes('離子與組成')) {
        near.filter(x => x.f && x.f !== item.f).slice(0, 3).forEach(x => add(x.f, '保留部分正確離子，但電荷比或原子數不符'));
    } else {
        (quizData.forcedOpts || []).filter(x => calibrationOptionKey(x) !== calibrationOptionKey(quizData.answer)).slice(0, 3)
            .forEach(x => add(x, '把題目中的一個關鍵規則判斷錯置'));
    }
    const fallback = (quizData.forcedOpts || []).filter(x => calibrationOptionKey(x) !== calibrationOptionKey(quizData.answer));
    while (distractors.length < 3 && fallback.length) {
        const candidate = fallback.shift();
        add(candidate, '只差一個命名、電荷或下標判斷');
    }
    if (distractors.length >= 1) setCalibrationOptions(quizData, quizData.answer, distractors.slice(0, 3));
}

function elementNearScore(target, element) {
    if (!target || !element || target.z === element.z) return -1;
    let score = 0;
    const dz = Math.abs(Number(target.z) - Number(element.z));
    if (dz === 1) score += 8;
    else if (dz === 2) score += 5;
    else if (dz <= 4) score += 2;
    if (target.p === element.p) score += 4;
    if (target.iupac === element.iupac) score += 5;
    if (target.type && target.type === element.type) score += 2;
    if (target.s[0] === element.s[0]) score += 1;
    return score;
}

function elementDistractors(target, valueFn, predicate, reason, limit) {
    const pool = (window.quizState && Array.isArray(window.quizState.pool) && window.quizState.pool.length)
        ? window.quizState.pool
        : (typeof ELECTRON_DATA !== 'undefined' && Array.isArray(ELECTRON_DATA) ? ELECTRON_DATA : []);
    const ranked = pool.filter(el => (!predicate || predicate(el)) && el.z !== target.z)
        .map(el => ({ el, score: elementNearScore(target, el) }))
        .sort((a, b) => b.score - a.score || a.el.z - b.el.z)
        .map(entry => ({ value: valueFn(entry.el), reason }))
        .filter(entry => entry.value != null && calibrationOptionKey(entry.value) !== calibrationOptionKey(valueFn(target)))
        .filter((entry, index, arr) => arr.findIndex(x => calibrationOptionKey(x.value) === calibrationOptionKey(entry.value)) === index);
    const wanted = limit || 3;
    if (ranked.length <= wanted) return ranked;

    // 標準題保留一個最接近的迷思選項，其餘從中距離與較寬的元素池抽取，
    // 避免三個錯項都集中在同一小段原子序而變成排列線索。
    const near = ranked.slice(0, Math.min(6, ranked.length));
    const medium = ranked.slice(6, Math.min(18, ranked.length));
    const wide = ranked.slice(18);
    const selected = [];
    const add = entry => {
        if (!entry) return;
        const key = calibrationOptionKey(entry.value);
        if (!selected.some(item => calibrationOptionKey(item.value) === key)) selected.push(entry);
    };
    add(calibrationShuffle(near)[0]);
    add(calibrationShuffle(medium.length ? medium : ranked.slice(near.length))[0]);
    add(calibrationShuffle(wide.length ? wide : ranked.slice(6))[0]);
    for (const entry of calibrationShuffle(ranked)) {
        if (selected.length >= wanted) break;
        add(entry);
    }
    return selected.slice(0, wanted);
}

function refineElementQuestionOptions(type, quizData, target) {
    if (!target || type >= 16 || type >= 21) return;
    const label = quizData.type || '';
    // 粒子反推題已由粒子模型建立選項；不可再被元素近鄰選項覆寫。
    if (quizData._periodicParticleMode || quizData._periodicCompound) return;
    const answer = quizData.answer;
    const pool = (window.quizState && Array.isArray(window.quizState.pool) && window.quizState.pool.length)
        ? window.quizState.pool
        : (typeof ELECTRON_DATA !== 'undefined' && Array.isArray(ELECTRON_DATA) ? ELECTRON_DATA : []);
    // 比較題的正解可能是由題庫先挑出的另一個元素；以正解作為排序錨點，
    // 才能讓電負度與同族／同週期的錯項維持在同一判斷鄰域。
    const answerElement = pool.find(el => el.s === answer) || target;
    let candidates = [];
    let reason = '選項與題目元素相鄰，但在題目指定的週期表特徵上不符合。';
    const mode = quizData.displayMode;
    const valueFn = el => {
        if (mode === 'symbol') return el.s;
        if (mode === 'chinese') return el.cn;
        if (mode === 'number') return String(el.z);
        if (mode === 'ion') {
            const electronCount = Number(quizData._electronCount);
            if (Number.isFinite(electronCount)) {
                const neededCharge = Number(el.z) - electronCount;
                const mistakenCharge = neededCharge === 3 ? neededCharge - 1 : neededCharge + 1;
                return calibrationIonValueForElement(el, mistakenCharge);
            }
            return el.s;
        }
        if (mode === 'raw') {
            if (quizData.coordMode === 'ab') {
                const pCh = ['', '一', '二', '三', '四', '五', '六', '七'][el.p] || el.p;
                return (el.g === '鑭系' || el.g === '錒系') ? `第${pCh}週期、${el.g}` : `第${pCh}週期、${el.g}族`;
            }
            return `第 ${el.p} 週期、第 ${el.iupac} 族`;
        }
        if (mode === 'noble') return el.noble;
        return el.s;
    };
    const valueForOptions = /區塊/.test(label)
        ? (el => {
            if (el.s === 'He') return 's 區';
            const group = Number(el.iupac);
            return `${group <= 2 ? 's' : (group >= 13 ? 'p' : (group >= 3 && group <= 12 ? 'd' : 'f'))} 區`;
        })
        : valueFn;
    if (/區塊/.test(label)) {
        candidates = ['s 區', 'p 區', 'd 區', 'f 區']
            .filter(value => calibrationOptionKey(value) !== calibrationOptionKey(answer))
            .map(value => ({ value, reason: '最後填入的次層不同；區塊必須由電子組態末端判定。' }));
    } else if (/同族/.test(label)) {
        candidates = elementDistractors(target, valueForOptions, el => el.iupac !== target.iupac, '位於相鄰族或相近週期，不能與題目元素視為同族。', 3);
    } else if (/同一週期/.test(label)) {
        candidates = elementDistractors(target, valueForOptions, el => el.p !== target.p, '原子序相近但週期不同，不能視為同一週期。', 3);
    } else if (/化學性質相似/.test(label)) {
        candidates = elementDistractors(answerElement, valueForOptions, el => el.iupac !== answerElement.iupac, '價電子排列不同；相似化學性質應優先比較族位置。', 3);
    } else if (/電負度/.test(label)) {
        const winnerEN = answerElement && typeof QUIZ_HELPER !== 'undefined' ? QUIZ_HELPER.getEN(answerElement.s) : null;
        candidates = elementDistractors(answerElement, valueForOptions,
            el => winnerEN != null && typeof QUIZ_HELPER !== 'undefined' && QUIZ_HELPER.getEN(el.s) != null && QUIZ_HELPER.getEN(el.s) < winnerEN,
            '電負度較低；同週期由左至右通常增加，往右上方的元素通常較大。', 3);
    } else if (/座標/.test(label)) {
        candidates = elementDistractors(target, valueForOptions, null, '週期或族其中一項相近，但不是題目要求的完整座標。', 3);
    } else if (/電子總數|質子總數|中子總數/.test(label)) {
        // 粒子計算題保留數值選項，但混入一個最容易犯的「交換粒子／忽略電荷」錯誤，
        // 另兩個再從鄰近數值補足，避免只有單一元素線索或三個等距數字。
        const numericAnswer = Number(calibrationFormulaPlain(answer).replace(/[^+\-\d.]/g, ''));
        if (Number.isFinite(numericAnswer)) {
            const particle = quizData._periodicParticle;
            const countKey = /電子總數/.test(label) ? 'e' : (/中子總數/.test(label) ? 'n' : 'p');
            const closeDelta = numericAnswer === 0 ? 1 : (Math.random() < 0.5 ? -1 : 1);
            const used = new Set([String(numericAnswer)]);
            const addNumeric = (value, entryReason) => {
                const n = Number(value);
                const key = String(n);
                if (!Number.isInteger(n) || n < 0 || used.has(key)) return;
                used.add(key);
                candidates.push({ value: key, reason: entryReason });
            };
            addNumeric(numericAnswer + closeDelta, '只差 1；通常是把計算中的增減方向或一步進位算錯。');
            if (particle) {
                if (countKey === 'e') {
                    addNumeric(particle.p, '把原子序（質子數）直接當成電子總數，忽略粒子所帶電荷。');
                    addNumeric(particle.n, '把中子數誤當成電子總數；電子數仍須用 e=Z−q 計算。');
                } else if (countKey === 'p') {
                    addNumeric(particle.e, '把電子數誤當成質子數；質子數應等於原子序 Z。');
                    addNumeric(particle.n, '把中子數誤當成質子數；中子數由 A−Z 求得。');
                } else {
                    addNumeric(particle.p, '把原子序（質子數）誤當成中子數；中子數應為 A−Z。');
                    addNumeric(particle.e, '把電子數誤當成中子數；離子電荷只影響電子數。');
                }
            }
            for (const offset of [2, -2, 3, -3, 4, -4, 5, -5]) {
                if (candidates.length >= 3) break;
                addNumeric(numericAnswer + offset, '與正解相近，但在題目指定的粒子計算中多算或少算電子、質子或中子。');
            }
            candidates = candidates.slice(0, 3);
        }
    } else if (/等電子/.test(label)) {
        // 等電子題用「只差一顆電子」的粒子作誘答，保持粒子表示形式而非塞入元素符號。
        const electronMatch = String(quizData.question || '').match(/(\d+)\s*個電子/);
        const electronCount = electronMatch ? Number(electronMatch[1]) : Number(target.z);
        const ionValue = (el, charge) => {
            if (!charge) return el.s;
            const sign = charge > 0 ? '+' : '-';
            const magnitude = Math.abs(charge);
            return `${el.s}<sup class="chem-sup">${magnitude === 1 ? '' : magnitude}${sign}</sup>`;
        };
        candidates = pool
            .filter(el => el.z !== target.z)
            .map(el => ({ el, score: elementNearScore(target, el) }))
            .sort((a, b) => b.score - a.score || a.el.z - b.el.z)
            .map(({ el }) => {
                const neededCharge = Number(el.z) - electronCount;
                const mistakenCharge = neededCharge === 3 ? neededCharge - 1 : neededCharge + 1;
                return {
                    value: ionValue(el, mistakenCharge),
                    reason: '元素核電荷相近，但電荷造成的電子數只差一顆，並非真正等電子。'
                };
            })
            .filter(entry => Math.abs(Number(String(entry.value).match(/[-+]?\d+/)?.[0] || 0)) <= 4)
            .filter((entry, index, arr) => arr.findIndex(x => calibrationOptionKey(x.value) === calibrationOptionKey(entry.value)) === index)
            .slice(0, 3);
    } else if (/原子序|質子/.test(label)) {
        candidates = elementDistractors(target, valueForOptions, null, '把鄰近元素的原子序或質子數誤當成題目元素。', 3);
    } else if (/組態辨識|質子數逆推|電子數逆推/.test(label)) {
        candidates = elementDistractors(target, valueForOptions, null, '電子總數或核電荷相近，但粒子身分／電荷不相符。', 3);
    } else if (/價電子|未成對|軌域/.test(label)) {
        candidates = elementDistractors(target, valueForOptions, null, '電子組態相近，但只在指定次層或價電子統計上不同。', 3);
    } else if (/元素\s*>\s*分類/.test(label)) {
        // 元素 → 分類要比較「分類標籤」本身，不能把週期表座標當成分類選項。
        const typeValues = [...new Set(pool.map(el => String(el.type || '').trim()).filter(Boolean))];
        if (!typeValues.includes('以上皆非')) typeValues.push('以上皆非');
        candidates = typeValues
            .filter(value => calibrationOptionKey(value) !== calibrationOptionKey(answer))
            .map(value => ({ value, reason: '元素位置可能相近，但金屬／非金屬／類金屬分類不同。' }))
            .slice(0, 3);
    } else if (/分類\s*>\s*元素/.test(label)) {
        const className = target && target.type;
        candidates = elementDistractors(target, valueForOptions,
            el => el.type !== className,
            `元素雖可能位於相近週期表位置，但分類不是「${className}」。`, 3);
    } else if (/元素\s*>\s*常溫狀態/.test(label)) {
        // 元素 → 常溫狀態只有固、液、氣三個合理類別，選項要維持同一表示形式。
        const stateValues = [...new Set(pool.map(el => QUIZ_HELPER.getCleanState(el.state)).filter(Boolean))];
        if (!stateValues.includes('以上皆非')) stateValues.push('以上皆非');
        candidates = stateValues
            .filter(value => calibrationOptionKey(value) !== calibrationOptionKey(answer))
            .map(value => ({ value, reason: '元素可能相鄰，但在 25°C、1 atm 下的物態不同。' }))
            .slice(0, 3);
    } else if (/常溫狀態\s*>\s*元素/.test(label)) {
        const state = typeof QUIZ_HELPER !== 'undefined' ? QUIZ_HELPER.getCleanState(target.state) : '';
        candidates = elementDistractors(target, valueForOptions,
            el => typeof QUIZ_HELPER === 'undefined' || QUIZ_HELPER.getCleanState(el.state) !== state,
            `元素的 25°C、1 atm 物態不是「${state}」。`, 3);
    } else if (/分類|常溫狀態/.test(label)) {
        candidates = elementDistractors(target, valueForOptions, null, '元素位置相近，但分類、物態或最後填入次層不同。', 3);
    } else {
        // 基本身分／座標／組態辨識題同樣使用相鄰元素池，維持與正解相同的顯示形式。
        // 這個分支只處理元素題，不會再退回隨機數字或無關元素。
        candidates = elementDistractors(target, valueFn, null, '元素原子序或週期表位置相近，但題目指定的身分特徵不同。', 3);
    }
    if (candidates.length >= 2) {
        setCalibrationOptions(quizData, answer, candidates);
    } else if (quizData.forcedOpts && quizData.forcedOpts.length > 1) {
        const fallback = quizData.forcedOpts.filter(v => calibrationOptionKey(v) !== calibrationOptionKey(answer))
            .slice(0, 3).map(v => ({ value: v, reason }));
        setCalibrationOptions(quizData, answer, fallback);
    }
    if (!quizData.correctReason) {
        attachGenericCalibrationReason(type, quizData, target, null);
    }
}

function attachOptionRationales(quizData, target) {
    if (!quizData.forcedOpts || quizData.forcedOpts.length < 2) return;
    if (quizData._periodicCustomRationales) return;
    if (quizData._knowledgeFact) return;
    if (!quizData.optionRationales) quizData.optionRationales = {};
    const label = quizData.type || '';
    const pool = window.quizState && Array.isArray(window.quizState.pool) ? window.quizState.pool : [];
    const elementFor = value => {
        const direct = calibrationElementFromValue(value, pool);
        if (direct) return direct;
        const raw = String(value == null ? '' : value).trim();
        if (/^\d+$/.test(raw)) {
            const z = Number(raw);
            return pool.find(el => Number(el.z) === z) || null;
        }
        return null;
    };
    quizData.forcedOpts.forEach(value => {
        const key = calibrationOptionKey(value);
        // 重新依照目前題型產生具體回饋；不要沿用 distractor 產生時的泛用舊理由。
        if (key !== calibrationOptionKey(quizData.answer)) {
            if (window.calCategory === 'formula' || /名稱與化學式|化學式判讀|離子與組成/.test(label)) {
                const formulaItem = formulaItemForQuiz(quizData);
                const formulaReason = calibrationFormulaOptionRationale(quizData, value, formulaItem);
                if (formulaReason) {
                    quizData.optionRationales[key] = formulaReason;
                    return;
                }
            }
            const el = elementFor(value);
            if (/分類\s*>\s*元素/.test(label) && el && target) {
                quizData.optionRationales[key] = `該元素屬於「${el.type}」，不是題目指定的「${target.type}」分類`;
            } else if (/元素\s*>\s*分類/.test(label) && target) {
                quizData.optionRationales[key] = `選項分類為「${key}」，但 ${target.s} 屬於「${target.type}」`;
            } else if (/元素\s*>\s*常溫狀態/.test(label) && target) {
                const targetState = typeof QUIZ_HELPER !== 'undefined' ? QUIZ_HELPER.getCleanState(target.state) : target.state;
                quizData.optionRationales[key] = `選項物態為「${key}」，但 ${target.s} 在 25°C、1 atm 下應為${targetState}`;
            } else if (/常溫狀態\s*>\s*元素/.test(label) && el && target && typeof QUIZ_HELPER !== 'undefined') {
                quizData.optionRationales[key] = `該元素在 25°C、1 atm 下為${QUIZ_HELPER.getCleanState(el.state)}，不是題目要求的物態`;
            } else if (/身分識別：簡寫/.test(label) && el && target) {
                quizData.optionRationales[key] = `${el.s} 是${el.cn}的元素符號，不是${target.cn}（${target.s}）`;
            } else if (/身分識別：中文名/.test(label) && el && target) {
                quizData.optionRationales[key] = `「${el.cn}」對應 ${el.s}（原子序 ${el.z}），不是題目指定的${target.cn}（${target.s}）`;
            } else if (/識別校準：符號/.test(label) && el && target) {
                quizData.optionRationales[key] = `${value} 的原子序為 ${el.z}，不是題目所給 ${target.s} 的原子序 ${target.z}`;
            } else if (/識別校準：原子序/.test(label) && el && target) {
                quizData.optionRationales[key] = `選項 ${value} 的原子序為 ${el.z}，不是題目指定的 ${target.z}`;
            } else if (/位置定位/.test(label) && el && target) {
                quizData.optionRationales[key] = `它位於第 ${el.p} 週期、第 ${el.iupac} 族；題目要求的是第 ${target.p} 週期、第 ${target.iupac} 族的元素`;
            } else if (/同族/.test(label) && el && target) {
                quizData.optionRationales[key] = `它位於第 ${el.iupac} 族，與題目元素的第 ${target.iupac} 族不同`;
            } else if (/同一週期/.test(label) && el && target) {
                quizData.optionRationales[key] = `它位於第 ${el.p} 週期，與題目元素的第 ${target.p} 週期不同`;
            } else if (/化學性質相似/.test(label) && el && target) {
                quizData.optionRationales[key] = `價電子排列不同；該選項位於第 ${el.iupac} 族，而題目元素位於第 ${target.iupac} 族`;
            } else if (/電負度/.test(label) && el && target && typeof QUIZ_HELPER !== 'undefined') {
                const optionEN = QUIZ_HELPER.getEN(el.s);
                const answerElement = calibrationElementFromValue(quizData.answer, pool);
                const answerEN = answerElement ? QUIZ_HELPER.getEN(answerElement.s) : null;
                quizData.optionRationales[key] = `其 Pauling 電負度為 ${optionEN}，低於正解 ${answerEN}`;
            } else {
                const particle = periodicParseParticle(value);
                if (particle && quizData._periodicParticle) {
                    const p = particle;
                    const t = quizData._periodicParticle;
                    if (/等電子|電子數逆推/.test(label)) {
                        quizData.optionRationales[key] = `${periodicParticleLabel(p)} 的電子數 e=Z−q=${p.z}−(${p.q})=${p.e}，與題目要求的 ${t.e} 不同`;
                    } else if (/質子／中子／電子反推/.test(label)) {
                        quizData.optionRationales[key] = `${periodicParticleLabel(p)} 的 p=${p.p}、n=${p.n}、e=${p.e}，與題目要求的 p=${t.p}、n=${t.n}、e=${t.e} 不同`;
                    } else if (/中子總數/.test(label)) {
                        quizData.optionRationales[key] = `中子數應為 n=A−Z=${t.a}−${t.z}=${t.n}，不是 ${value}`;
                    } else if (/質子總數/.test(label)) {
                        quizData.optionRationales[key] = `質子數應為原子序 Z=${t.z}，不是 ${value}`;
                    } else if (/電子總數/.test(label)) {
                        quizData.optionRationales[key] = `電子數應為 e=Z−q=${t.z}−(${t.q})=${t.e}，不是 ${value}`;
                    }
                }
                if (!quizData.optionRationales[key]) {
                    quizData.optionRationales[key] = el && target
                        ? `選項 ${el.s} 的原子序為 ${el.z}、位於第 ${el.p} 週期第 ${el.iupac} 族；題目要求 ${target.s}（Z=${target.z}）`
                        : `選項 ${value} 不符合題幹指定的判斷條件`;
                }
            }
        }
    });
}

function periodicChargePlain(charge) {
    const q = Number(charge) || 0;
    return q === 0 ? '0' : `${q > 0 ? '+' : ''}${q}`;
}

function periodicElementValue(element, mode) {
    return mode === 'number' ? String(element.z) : element.s;
}

function periodicCompoundElementEntries(correctElement, valueMode, predicate, reasonFn, excludeZ = []) {
    const pool = window.quizState && Array.isArray(window.quizState.pool) ? window.quizState.pool : [];
    const valueFn = element => periodicElementValue(element, valueMode);
    const excluded = new Set(excludeZ.map(Number));
    const wrongPool = pool.filter(element =>
        element.z !== correctElement.z && !excluded.has(Number(element.z)) && !predicate(element)
    );
    const ranked = calibrationShuffle(wrongPool)
        .map(element => ({ element, score: elementNearScore(correctElement, element) }))
        .sort((a, b) => b.score - a.score || a.element.z - b.element.z)
        .map(entry => entry.element);
    // 複合題需要較多可混淆選項：先取兩個同一鄰域的元素，再保留一個中距離錯項。
    const near = ranked.filter(element => Math.abs(Number(element.z) - Number(correctElement.z)) <= 4 || element.p === correctElement.p);
    const selected = [];
    const add = element => {
        if (element && !selected.some(item => item.z === element.z)) selected.push(element);
    };
    add(calibrationShuffle(near)[0]);
    add(calibrationShuffle(near.filter(element => !selected.some(item => item.z === element.z)))[0]);
    add(calibrationShuffle(ranked.filter(element => !selected.some(item => item.z === element.z) && !near.includes(element)))[0]);
    for (const element of calibrationShuffle(ranked)) {
        if (selected.length >= 3) break;
        add(element);
    }
    const candidates = selected.slice(0, 3);
    if (candidates.length < 3) return null;
    return {
        valueFn,
        entries: candidates.map(element => ({
            value: valueFn(element),
            reason: reasonFn(element)
        }))
    };
}

function setPeriodicCompoundElementQuestion(quizData, target, correctElement, predicate, config) {
    const optionData = periodicCompoundElementEntries(
        correctElement,
        config.valueMode,
        predicate,
        config.reasonFn,
        config.excludeZ || []
    );
    if (!optionData) return false;
    const valueFn = optionData.valueFn;
    quizData.type = config.type;
    quizData.question = config.question;
    quizData.answer = valueFn(correctElement);
    quizData.displayMode = config.valueMode === 'number' ? 'number' : 'symbol';
    quizData._periodicCompound = true;
    quizData._periodicRequiredSteps = 2;
    quizData._periodicUsesChinese = false;
    quizData._periodicCustomExplanation = true;
    quizData._periodicCustomRationales = true;
    quizData._periodicSemanticMatcher = value => {
        const pool = window.quizState && Array.isArray(window.quizState.pool) ? window.quizState.pool : [];
        const element = calibrationElementFromValue(value, pool);
        return !!element && element.z === correctElement.z && predicate(element);
    };
    setCalibrationOptions(quizData, quizData.answer, optionData.entries);
    setCalibrationReason(quizData, config.explanation);
    return true;
}

function applyPeriodicSimpleVariant(type, quizData, target) {
    if (!PERIODIC_SIMPLE_CAPABLE_TYPES.includes(type)) return false;
    quizData._periodicUsesChinese = true;
    quizData._periodicRequiredSteps = 1;
    quizData.forcedOpts = undefined;
    quizData.optionRationales = {};
    if (type === 0) {
        quizData.type = '身分識別：簡寫 > 中文名';
        quizData.question = `化學符號 ${target.s} 的中文名稱為何？`;
        quizData.answer = target.cn;
        quizData.displayMode = 'chinese';
    } else if (type === 4) {
        quizData.type = '特性校準：元素 > 分類';
        quizData.question = `元素「${target.cn}」在化學性質分類上屬於下列何者？`;
        quizData.answer = target.type;
        quizData.displayMode = 'raw';
    } else {
        const state = QUIZ_HELPER.getCleanState(target.state);
        quizData.type = '特性校準：元素 > 常溫狀態';
        quizData.question = `在常溫常壓 (25°C, 1 atm) 下，「${target.cn}」的物理狀態為何？`;
        quizData.answer = state;
        quizData.displayMode = 'raw';
    }
    return true;
}

function applyPeriodicStandardVariant(type, quizData, target) {
    if (!PERIODIC_SIMPLE_CAPABLE_TYPES.includes(type)) return false;
    quizData._periodicUsesChinese = false;
    quizData._periodicRequiredSteps = 1;
    quizData.forcedOpts = undefined;
    quizData.optionRationales = {};
    if (type === 0) {
        if (Math.random() < 0.5) {
            quizData.type = '識別校準：符號 > 原子序';
            quizData.question = `${target.s} 的原子序為何？`;
            quizData.answer = String(target.z);
            quizData.displayMode = 'number';
        } else {
            quizData.type = '識別校準：原子序 > 符號';
            quizData.question = `原子序為 ${target.z} 的元素符號為何？`;
            quizData.answer = target.s;
            quizData.displayMode = 'symbol';
        }
    } else if (type === 4) {
        const useNumber = Math.random() < 0.5;
        const reference = useNumber ? `原子序為 ${target.z} 的元素` : `[ ${target.s} ]`;
        quizData.type = '特性校準：元素 > 分類';
        quizData.question = `元素 ${reference} 在化學性質分類上屬於下列何者？`;
        quizData.answer = target.type;
        quizData.displayMode = 'raw';
    } else {
        const useNumber = Math.random() < 0.5;
        const reference = useNumber ? `原子序為 ${target.z} 的元素` : `[ ${target.s} ]`;
        quizData.type = '特性校準：元素 > 常溫狀態';
        quizData.question = `在常溫常壓 (25°C, 1 atm) 下，${reference} 的物理狀態為何？`;
        quizData.answer = QUIZ_HELPER.getCleanState(target.state);
        quizData.displayMode = 'raw';
    }
    return true;
}

function applyPeriodicChallengeVariant(type, quizData, target) {
    const pool = window.quizState && Array.isArray(window.quizState.pool) ? window.quizState.pool : [];
    const valueMode = Math.random() < 0.5 ? 'symbol' : 'number';
    const premise = periodicDataPremise(target);

    if (type === 0 || type === 1) {
        const particle = periodicRandomParticle(target);
        if (!particle) return false;
        const valueModeForQuestion = type === 0 ? 'symbol' : 'number';
        const valueFn = element => periodicElementValue(element, valueModeForQuestion);
        const ranked = calibrationShuffle(pool.filter(element => element.z !== target.z))
            .map(element => ({ element, score: elementNearScore(target, element) }))
            .sort((a, b) => b.score - a.score || a.element.z - b.element.z)
            .map(entry => entry.element);
        const near = ranked.filter(element => Math.abs(Number(element.z) - Number(target.z)) <= 4 || element.p === target.p);
        const selected = [];
        const add = element => {
            if (element && !selected.some(item => item.z === element.z)) selected.push(element);
        };
        add(calibrationShuffle(near)[0]);
        add(calibrationShuffle(near.filter(element => !selected.some(item => item.z === element.z)))[0]);
        add(calibrationShuffle(ranked.filter(element => !selected.some(item => item.z === element.z) && !near.includes(element)))[0]);
        for (const element of calibrationShuffle(ranked)) {
            if (selected.length >= 3) break;
            add(element);
        }
        const entries = selected.slice(0, 3).map(element => ({
                value: valueFn(element),
                reason: `${element.s} 若帶電荷 q=${periodicChargePlain(particle.q)}，電子數 e=${element.z}−(${periodicChargePlain(particle.q)})=${element.z - particle.q}，無法得到題目給定的 ${particle.e} 個電子`
            }));
        if (entries.length < 3) return false;
        quizData.type = type === 0
            ? '複合辨識：電子數／電荷 → 元素符號'
            : '複合辨識：電子數／電荷 → 原子序';
        quizData.question = `某粒子帶 ${periodicChargePlain(particle.q)} 電荷且有 ${particle.e} 個電子；${type === 0 ? '其元素符號為何？' : '其原子序為何？'}`;
        quizData.answer = valueFn(target);
        quizData.displayMode = valueModeForQuestion === 'number' ? 'number' : 'symbol';
        quizData._periodicParticle = particle;
        quizData._periodicCompound = true;
        quizData._periodicRequiredSteps = 2;
        quizData._periodicCustomExplanation = true;
        quizData._periodicCustomRationales = true;
        quizData._periodicUsesChinese = false;
        quizData._periodicSemanticMatcher = value => {
            const element = calibrationElementFromValue(value, pool);
            return !!element && element.z === target.z;
        };
        setCalibrationOptions(quizData, quizData.answer, entries);
        setCalibrationReason(quizData, `由 e=Z−q 反推 Z=e+q=${particle.e}+(${particle.q})=${particle.z}，再由原子序辨識 ${target.s}。`);
        return true;
    }

    if (type === 2) {
        const block = calibrationBlockForElement(target);
        const predicate = element => element.z !== target.z && element.p === target.p && calibrationBlockForElement(element) === block;
        const partner = calibrationShuffle(pool.filter(predicate))[0];
        if (!partner) return false;
        return setPeriodicCompoundElementQuestion(quizData, target, partner, predicate, {
            valueMode,
            type: '複合定位：同週期／同區塊',
            question: `下列哪個元素與 ${target.s} 位於同一週期且屬於同一區塊？`,
            explanation: `${target.s} 位於第 ${target.p} 週期、${block}；正解 ${partner.s} 同時符合這兩項條件。`,
            excludeZ: [target.z],
            reasonFn: element => `${element.s} 位於第 ${element.p} 週期、${calibrationBlockForElement(element)}；未同時符合第 ${target.p} 週期與 ${block}。`
        });
    }

    if (type === 4) {
        const predicate = element => element.type === target.type && element.p === target.p;
        return setPeriodicCompoundElementQuestion(quizData, target, target, predicate, {
            valueMode,
            type: '複合分類：週期／金屬性質',
            question: `${premise}下列哪個選項所代表的元素同時位於第 ${target.p} 週期且屬於「${target.type}」？`,
            explanation: `${target.s} 位於第 ${target.p} 週期，且資料分類為「${target.type}」；兩項條件同時成立。`,
            reasonFn: element => `${element.s} 位於第 ${element.p} 週期，分類為「${element.type}」；未同時符合第 ${target.p} 週期與「${target.type}」。`
        });
    }

    if (type === 5) {
        const state = QUIZ_HELPER.getCleanState(target.state);
        const predicate = element => QUIZ_HELPER.getCleanState(element.state) === state && element.p === target.p;
        return setPeriodicCompoundElementQuestion(quizData, target, target, predicate, {
            valueMode,
            type: '複合物態：週期／常溫狀態',
            question: `${premise}下列哪個選項所代表的元素同時位於第 ${target.p} 週期，且在 25°C、1 atm 下呈${state}？`,
            explanation: `${target.s} 位於第 ${target.p} 週期；在 25°C、1 atm 下呈${state}，兩項條件同時成立。`,
            reasonFn: element => `${element.s} 位於第 ${element.p} 週期，25°C、1 atm 下為${QUIZ_HELPER.getCleanState(element.state)}；未同時符合題目條件。`
        });
    }

    if (type === 6) {
        const particle = periodicRandomParticle(target);
        if (!particle) return false;
        if (Math.random() < 0.5) {
            quizData.type = '識別校準：質子／中子／電子反推';
            quizData.question = `某粒子有 ${particle.p} 個質子、${particle.n} 個中子與 ${particle.e} 個電子，該粒子為何？`;
            quizData.answer = periodicParticleLabel(particle);
            quizData.displayMode = 'ion';
            quizData._periodicParticle = particle;
            quizData._periodicParticleMode = 'full';
            if (!periodicParticleOptions(quizData, particle,
                candidate => candidate.p !== particle.p || candidate.n !== particle.n || candidate.e !== particle.e,
                candidate => `${periodicParticleReason(candidate)}；與題目給定的 p、n、e 不符`
            )) return false;
            setCalibrationReason(quizData, `由 p=${particle.p} 判定 Z=${particle.z}，由 n=${particle.n} 得 A=${particle.a}，由 e=${particle.e} 得 q=Z−e=${particle.q}；因此為 ${quizData.answer}。`);
        } else {
            const partner = calibrationShuffle(pool.filter(element => element.z !== target.z))
                .map(element => periodicRandomParticle(element))
                .find(candidate => candidate && candidate.e === particle.e);
            if (!partner) return false;
            quizData.type = '邏輯判斷：等電子序列';
            quizData.question = `下列哪一個粒子與 [ ${periodicParticleLabel(particle)} ] 具有相同的電子數？`;
            quizData.answer = periodicParticleLabel(partner);
            quizData.displayMode = 'ion';
            quizData._periodicParticle = partner;
            quizData._periodicParticleMode = 'isoelectronic';
            if (!periodicParticleOptions(quizData, partner,
                candidate => candidate.e !== partner.e,
                candidate => `${periodicParticleReason(candidate)}；與正解不具有 ${partner.e} 個電子`
            )) return false;
            setCalibrationReason(quizData, `正解 ${quizData.answer} 的電子數為 Z−q=${partner.z}−(${partner.q})=${partner.e}，與題目粒子等電子。`);
        }
        quizData._periodicCompound = true;
        quizData._periodicRequiredSteps = 2;
        quizData._periodicCustomExplanation = true;
        quizData._periodicCustomRationales = true;
        quizData._periodicUsesChinese = false;
        return true;
    }

    if (type === 10) {
        const groupCandidates = Number.isInteger(Number(target.iupac))
            ? pool.filter(element => Number(element.iupac) === Number(target.iupac) && element.z > target.z)
            : [];
        const useGroup = groupCandidates.length > 0;
        const predicate = useGroup
            ? element => Number(element.iupac) === Number(target.iupac) && element.z > target.z
            : element => element.p === target.p && element.z > target.z;
        const partner = calibrationShuffle(pool.filter(element => element.z !== target.z && predicate(element)))[0];
        if (!partner) return false;
        return setPeriodicCompoundElementQuestion(quizData, target, partner, predicate, {
            valueMode,
            type: useGroup ? '複合關係：同族／原子序方向' : '複合關係：同週期／原子序方向',
            question: useGroup
                ? `下列哪個元素與 ${target.s} 屬於同一族，且原子序較大？`
                : `下列哪個元素與 ${target.s} 位於同一週期，且原子序較大？`,
            explanation: useGroup
                ? `${partner.s} 與 ${target.s} 同為第 ${target.iupac} 族，且 ${partner.z}>${target.z}。`
                : `${partner.s} 與 ${target.s} 同為第 ${target.p} 週期，且 ${partner.z}>${target.z}。`,
            excludeZ: [target.z],
            reasonFn: element => useGroup
                ? `${element.s} 的原子序為 ${element.z}；未同時符合第 ${target.iupac} 族且原子序大於 ${target.z}。`
                : `${element.s} 的原子序為 ${element.z}；未同時符合第 ${target.p} 週期且原子序大於 ${target.z}。`
        });
    }

    if (type === 14) {
        const groups = new Map();
        pool.forEach(element => {
            const en = QUIZ_HELPER.getEN(element.s);
            if (en == null) return;
            if (!groups.has(element.p)) groups.set(element.p, []);
            groups.get(element.p).push({ element, en });
        });
        const eligibleGroups = [...groups.values()].filter(items => items.length >= 4);
        if (!eligibleGroups.length) return false;
        const items = calibrationShuffle(eligibleGroups[Math.floor(Math.random() * eligibleGroups.length)]).slice(0, 4);
        const maxEN = Math.max(...items.map(item => item.en));
        const winners = items.filter(item => item.en === maxEN);
        if (winners.length !== 1) return false;
        const winner = winners[0];
        const optionMode = Math.random() < 0.5 ? 'symbol' : 'number';
        const valueFn = item => periodicElementValue(item.element, optionMode);
        quizData.type = '複合比較：同週期電負度';
        quizData.question = `在第 ${winner.element.p} 週期的下列選項中，哪一個原子的電負度最大？`;
        quizData.answer = valueFn(winner);
        quizData.displayMode = optionMode === 'number' ? 'number' : 'symbol';
        quizData.forcedOpts = items.map(valueFn);
        quizData.optionRationales = {};
        items.filter(item => item.element.z !== winner.element.z).forEach(item => {
            quizData.optionRationales[calibrationOptionKey(valueFn(item))] = `${item.element.s} 的 Pauling 電負度為 ${item.en}，低於正解 ${winner.en}。`;
        });
        quizData._periodicCompound = true;
        quizData._periodicRequiredSteps = 2;
        quizData._periodicCustomExplanation = true;
        quizData._periodicCustomRationales = true;
        quizData._periodicUsesChinese = false;
        quizData._periodicSemanticMatcher = value => {
            const element = calibrationElementFromValue(value, pool);
            return !!element && QUIZ_HELPER.getEN(element.s) === maxEN;
        };
        setCalibrationReason(quizData, `先定位各選項皆在第 ${winner.element.p} 週期，再比較 Pauling 電負度；最大值為 ${winner.element.s} 的 ${winner.en}。`);
        return true;
    }

    return false;
}

window.renderNextQuestion = function() {
    window.quizState.currentQ++;
    if (window.quizState.currentQ > window.quizState.totalQ) return window.finishCalibration();
    updatePeriodicToggleVisibility();
    
    const catNames = { 1: "週期表", 2: "電子組態", 3: "混成", 4: "氧化還原", 5: "沉澱表", 6: "化學式", 7: "知識校準" };
    const catName = catNames[window.quizState.difficulty] || "未知";
    const isPeriodic = window.calCategory === 'periodic';
    const rankText = window.quizState.rank ? `RANK ${window.quizState.rank}` : '';
    const modeText = isPeriodic
        ? (window.quizState.periodicMode === 'challenge' ? '挑戰模式' : '標準模式')
        : window.calCategory === 'knowledge'
        ? (window.knowledgeMode === 'deep' ? '深度' : '常用')
        : '';
    const statusPrefix = isPeriodic
        ? [rankText, modeText, `${catName}校準`].filter(Boolean).join('｜')
        : window.calCategory === 'knowledge'
        ? [catName, modeText].filter(Boolean).join('｜')
        : `${rankText ? `${rankText} | ` : ''}${catName}校準`;
    document.getElementById('quiz-status-text').textContent =
        `${statusPrefix} [Q ${window.quizState.currentQ}/${window.quizState.totalQ}]`;
    
    // 依照預選牌組類型出題
    const type = window.quizState.typeDeck[window.quizState.currentQ - 1];
    
    const periodicProfile = isPeriodic
        ? (window.quizState.periodicProfileDeck?.[window.quizState.currentQ - 1] || 'standard')
        : null;
    const quizData = {
        question: "", answer: "", type: "", displayMode: "symbol",
        _periodicProfile: periodicProfile,
        _periodicRequiredSteps: periodicProfile === 'challenge' ? 2 : (periodicProfile === 'simple' ? 1 : 1)
    };
    let target = null;
    let parsed = null;
    let s = "";
    let avail = [];
    
    // 混成/氧化還原/沉澱表/化學式/知識校準不依賴元素 pool，直接跳過元素選擇
    if (type !== 16 && type !== 17 && type !== 18 && type !== 19 && type < 21 && !(type >= 32 && type <= 50)) {
        // 元素均等分佈演算法
        avail = window.quizState.pool.filter(el => !window.quizState.askedZ.includes(el.z));
        if (avail.length === 0) {
            window.quizState.askedZ = []; 
            avail = [...window.quizState.pool];
        }
        target = avail[Math.floor(Math.random() * avail.length)];
        window.quizState.askedZ.push(target.z);
        parsed = QUIZ_HELPER.parse(target.c);
        s = `[ ${target.s} ]`;
    }
    
    // 重複問題檢查：生成問題後檢查是否已問過；候選池尚未耗盡前絕不接受重複題。
    let questionKey = "";
    let attempts = 0;
    let questionGenerated = false;
    
    while (!questionGenerated && attempts < 60) {
        attempts++;
        // 如果已經嘗試過，重新選擇元素（混成/形狀/結構圖題型跳過）
        if (attempts > 1 && type !== 16 && type !== 17 && type !== 18 && type !== 19 && type < 21 && !(type >= 32 && type <= 50)) {
            avail = window.quizState.pool.filter(el => !window.quizState.askedZ.includes(el.z));
            if (avail.length === 0) {
                window.quizState.askedZ = []; 
                avail = [...window.quizState.pool];
            }
            target = avail[Math.floor(Math.random() * avail.length)];
            window.quizState.askedZ.push(target.z);
            parsed = QUIZ_HELPER.parse(target.c);
            s = `[ ${target.s} ]`;
        }
        
        // 重置quizData
        quizData.question = "";
        quizData.answer = "";
        quizData.type = "";
        quizData.displayMode = "symbol";
        quizData.forcedOpts = undefined;
        quizData.optionClass = undefined;
        quizData.questionHtml = undefined;
        quizData.explanationHtml = undefined;
        quizData.showExplanation = false;
        quizData.correctReason = '';
        quizData.optionRationales = {};
        quizData._periodicParticle = undefined;
        quizData._periodicParticleMode = undefined;
        quizData._periodicOptionParticles = undefined;
        quizData._particleCharge = undefined;
        quizData._electronCount = undefined;
        quizData._protonCount = undefined;
        quizData._neutronCount = undefined;
        quizData._periodicUsesChinese = false;
        quizData._periodicCompound = false;
        quizData._periodicCustomExplanation = false;
        quizData._periodicCustomRationales = false;
        quizData._periodicSemanticMatcher = undefined;
        quizData._periodicRequiredSteps = periodicProfile === 'challenge' ? 2 : (periodicProfile === 'simple' ? 1 : 1);

    // 3. 題型詳細定義與隨機敘述模板 (全面中文化與渲染優化)
if (type === 0) {
    // 週期表校準只保留中文名與化學符號互相辨識，不出英文名稱題。
    if (Math.random() < 0.5) {
        quizData.type        = "身分識別：簡寫 > 中文名";
        quizData.question    = [ `化學符號 ${s} 的中文名稱為何？`, `化學符號 ${s} 指的是哪種元素？` ][Math.floor(Math.random() * 2)];
        quizData.answer      = target.cn;
        quizData.displayMode = "chinese";
    } else {
        quizData.type        = "身分識別：中文名 > 簡寫";
        quizData.question    = [ `元素「${target.cn}」的正確化學符號為何？`, `下列哪一個符號代表「${target.cn}」？` ][Math.floor(Math.random() * 2)];
        quizData.answer      = target.s;
        quizData.displayMode = "symbol";
    }
} else if (type === 1) {
    // 雙向：符號 ↔ 原子序
    const direction = Math.random();
    if (direction > 0.5) {
        // 符號 → 原子序
        quizData.type        = "識別校準：符號 > 原子序"; 
        quizData.question    = [ `${s} 的「原子序」為何？`, `${s} 原子核內的質子數為？` ][Math.floor(Math.random() * 2)];
        quizData.answer      = target.z.toString();
        quizData.displayMode = "number";
    } else {
        // 原子序 → 符號
        quizData.type        = "識別校準：原子序 > 符號"; 
        quizData.question    = [ `原子序為 ${target.z} 的元素符號為何？`, `原子核內有 ${target.z} 個質子的元素，其化學符號是？` ][Math.floor(Math.random() * 2)];
        quizData.answer      = target.s;
        quizData.displayMode = "symbol";
    }
} else if (type === 2) {
    const periodCh = ["","一","二","三","四","五","六","七"][target.p] || `${target.p}`;
    const isSeries = (target.g === "鑭系" || target.g === "錒系");
    const iupacCoord = `第 ${target.p} 週期、第 ${target.iupac} 族`;
    const abCoord    = isSeries ? `第${periodCh}週期、${target.g}` : `第${periodCh}週期、${target.g}族`;
    // 8B 橫跨 Fe/Co/Ni 三欄，鑭系／錒系也不是單一 IUPAC 族；
    // 這些座標只能用於「元素 → 座標」，不可反向唯一辨識元素。
    const abIsUnique = !isSeries && target.g !== '8B';
    const modes = [
        ...(isSeries ? [] : ['iupacToSymbol', 'iupacToNumber']),
        ...(abIsUnique ? ['abToSymbol', 'abToNumber'] : []),
        ...(isSeries ? [] : ['symbolToIupac']),
        'symbolToAb',
        ...(isSeries ? [] : ['numberToIupac']),
        'numberToAb'
    ];
    const mode = modes[Math.floor(Math.random() * modes.length)];
    if (mode === 'iupacToSymbol') {
        // 座標(IUPAC) → 符號
        quizData.type        = "位置定位：座標(IUPAC) > 符號";
        quizData.question    = `位於週期表「${iupacCoord}」的元素符號是？`;
        quizData.answer      = target.s;
        quizData.displayMode = "symbol";
        quizData.coordMode   = "iupac";
    } else if (mode === 'abToSymbol') {
        // 座標(A/B族) → 符號
        quizData.type        = "位置定位：座標(A/B) > 符號";
        quizData.question    = `位於週期表「${abCoord}」的元素符號是？`;
        quizData.answer      = target.s;
        quizData.displayMode = "symbol";
        quizData.coordMode   = "ab";
    } else if (mode === 'iupacToNumber') {
        // 座標(IUPAC) → 原子序
        quizData.type        = "位置定位：座標(IUPAC) > 原子序";
        quizData.question    = `位於週期表「${iupacCoord}」的元素，其原子序為何？`;
        quizData.answer      = target.z.toString();
        quizData.displayMode = "number";
        quizData.coordMode   = "iupac";
    } else if (mode === 'abToNumber') {
        // 座標(A/B族) → 原子序
        quizData.type        = "位置定位：座標(A/B) > 原子序";
        quizData.question    = `位於週期表「${abCoord}」的元素，其原子序為何？`;
        quizData.answer      = target.z.toString();
        quizData.displayMode = "number";
        quizData.coordMode   = "ab";
    } else if (mode === 'symbolToIupac') {
        // 符號 → 座標(IUPAC)
        quizData.type        = "位置定位：符號 > 座標(IUPAC)";
        quizData.question    = [`元素 ${s} 位於週期表的第幾週期、第幾族（IUPAC）？`, `元素 ${s} 屬於第幾週期、第幾族？`][Math.floor(Math.random() * 2)];
        quizData.answer      = iupacCoord;
        quizData.displayMode = "raw";
        quizData.coordMode   = "iupac";
    } else if (mode === 'symbolToAb') {
        // 符號 → 座標(A/B族)
        quizData.type        = "位置定位：符號 > 座標(A/B)";
        quizData.question    = [`元素 ${s} 位於週期表的第幾週期、幾A或幾B族？`, `元素 ${s} 屬於第幾週期、幾A/B族？`][Math.floor(Math.random() * 2)];
        quizData.answer      = abCoord;
        quizData.displayMode = "raw";
        quizData.coordMode   = "ab";
    } else if (mode === 'numberToIupac') {
        // 原子序 → 座標(IUPAC)
        quizData.type        = "位置定位：原子序 > 座標(IUPAC)";
        quizData.question    = [`原子序為 ${target.z} 的元素位於週期表的第幾週期、第幾族？`, `原子序 ${target.z} 的元素在週期表中的位置（週期與族）為何？`][Math.floor(Math.random() * 2)];
        quizData.answer      = iupacCoord;
        quizData.displayMode = "raw";
        quizData.coordMode   = "iupac";
    } else {
        // 原子序 → 座標(A/B族)
        quizData.type        = "位置定位：原子序 > 座標(A/B)";
        quizData.question    = [`原子序為 ${target.z} 的元素位於第幾週期、幾A或幾B族？`, `原子序 ${target.z} 的元素屬於第幾週期、幾A/B族？`][Math.floor(Math.random() * 2)];
        quizData.answer      = abCoord;
        quizData.displayMode = "raw";
        quizData.coordMode   = "ab";
    }
} else if (type === 3) {
    quizData.type        = "量子結構：組態辨識"; 
    quizData.question    = [ `基態電子組態為 ${target.noble} 的元素為何？`, `下列何種元素具備 ${target.noble} 的電子排列？` ][Math.floor(Math.random() * 2)];
    const electronConfigHtml = formatElectronConfigMath(target.noble);
    quizData.questionHtml = quizData.question.replace(target.noble, electronConfigHtml);
    quizData.answer      = target.s;
    quizData.displayMode = "symbol";
} else if (type === 4) {
        // 雙向：元素 ↔ 分類，反向時元素可用中文名或原子序
    const direction = Math.random();
    if (direction > 0.5) {
        // 元素 → 分類
        const elementDisplay = Math.random();
        let elementText = s;
        let answerDisplayMode = "raw";
        
        if (elementDisplay < 0.33) {
            // 使用符號
            elementText = s;
        } else if (elementDisplay < 0.67) {
            // 使用中文名
            elementText = `「${target.cn}」`;
        } else {
            // 使用原子序
            elementText = `原子序為 ${target.z} 的元素`;
        }
        
        quizData.type        = "特性校準：元素 > 分類"; 
        quizData.question    = `${periodicDataPremise(target)}元素 ${elementText} 在化學性質分類上屬於下列何者？`;
        quizData.answer      = target.type;
        quizData.displayMode = "raw";
    } else {
        // 分類 → 元素（元素可用中文名或原子序）
        const elementFormat = Math.random();
        let answerValue, answerDisplayMode;
        
        if (elementFormat < 0.5) {
            // 答案為中文名
            answerValue = target.cn;
            answerDisplayMode = "chinese";
        } else {
            // 答案為原子序
            answerValue = target.z.toString();
            answerDisplayMode = "number";
        }
        
        // 生成選項：正確答案 + 3個不同分類的元素（確保只有一個正確答案）
        const diffTypeElements = window.quizState.pool.filter(el => el.type !== target.type);
        let forcedOpts = [];
        
        // 添加正確答案
        if (answerDisplayMode === "chinese") {
            forcedOpts.push(target.cn);
        } else {
            forcedOpts.push(target.z.toString());
        }
        
        // 添加不同類型的元素（3個，確保都是錯誤選項）
        const shuffledDiff = calibrationShuffle(diffTypeElements).slice(0, 3);
        shuffledDiff.forEach(el => {
            if (answerDisplayMode === "chinese") {
                forcedOpts.push(el.cn);
            } else {
                forcedOpts.push(el.z.toString());
            }
        });
        
        // 如果選項不足4個，從不同類型的元素中隨機補充
        while (forcedOpts.length < 4 && diffTypeElements.length > 0) {
            const randomEl = diffTypeElements[Math.floor(Math.random() * diffTypeElements.length)];
            let val = "";
            if (answerDisplayMode === "chinese") val = randomEl.cn;
            else val = randomEl.z.toString();
            if (!forcedOpts.includes(val)) forcedOpts.push(val);
        }
        
        quizData.type        = "特性校準：分類 > 元素"; 
        let questionTemplates;
        if (answerDisplayMode === "number") {
            questionTemplates = [
                `${periodicDataPremise(target)}下列哪個原子序的元素屬於「${target.type}」？`,
                `${periodicDataPremise(target)}下列哪個原子序對應的元素，其性質屬於「${target.type}」？`
            ];
        } else {
            questionTemplates = [
                `${periodicDataPremise(target)}下列哪個元素屬於「${target.type}」？`,
                `${periodicDataPremise(target)}「${target.type}」類別中包含下列哪個元素？`
            ];
        }
        quizData.question    = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
        quizData.answer      = answerValue;
        quizData.displayMode = answerDisplayMode;
        quizData.forcedOpts  = forcedOpts.slice(0, 4); // 確保只有4個選項
    }
} else if (type === 5) {
    // 雙向：元素 ↔ 常溫狀態，反向時元素可用中文名或原子序
    const direction = Math.random();
    if (direction > 0.5) {
        // 元素 → 狀態
        const elementDisplay = Math.random();
        let elementText = s;
        
        if (elementDisplay < 0.33) {
            // 使用符號
            elementText = s;
        } else if (elementDisplay < 0.67) {
            // 使用中文名
            elementText = `「${target.cn}」`;
        } else {
            // 使用原子序
            elementText = `原子序為 ${target.z} 的元素`;
        }
        
        quizData.type        = "特性校準：元素 > 常溫狀態"; 
        quizData.question    = `${periodicDataPremise(target)}在常溫常壓 (25°C, 1atm) 下，${elementText} 的物理狀態為何？`;
        quizData.answer      = QUIZ_HELPER.getCleanState(target.state);
        quizData.displayMode = "raw";
    } else {
        // 狀態 → 元素（元素可用中文名或原子序）
        const cleanState = QUIZ_HELPER.getCleanState(target.state);
        const elementFormat = Math.random();
        let answerValue, answerDisplayMode;
        
        if (elementFormat < 0.33) {
            // 答案為中文名
            answerValue = target.cn;
            answerDisplayMode = "chinese";
        } else {
            // 答案為原子序
            answerValue = target.z.toString();
            answerDisplayMode = "number";
        }
        
        // 生成選項：正確答案 + 3個不同狀態的元素（確保只有一個正確答案）
        const diffStateElements = window.quizState.pool.filter(el => {
            const elState = QUIZ_HELPER.getCleanState(el.state);
            return elState !== cleanState; // 只選擇不同狀態的元素作為錯誤選項
        });
        let forcedOpts = [];
        
        // 添加正確答案
        if (answerDisplayMode === "chinese") {
            forcedOpts.push(target.cn);
        } else {
            forcedOpts.push(target.z.toString());
        }
        
        // 添加不同狀態的元素（3個，確保都是錯誤選項）
        const shuffledDiff = calibrationShuffle(diffStateElements).slice(0, 3);
        shuffledDiff.forEach(el => {
            if (answerDisplayMode === "chinese") {
                forcedOpts.push(el.cn);
            } else {
                forcedOpts.push(el.z.toString());
            }
        });
        
        // 如果選項不足4個，從不同狀態的元素中隨機補充
        while (forcedOpts.length < 4 && diffStateElements.length > 0) {
            const randomEl = diffStateElements[Math.floor(Math.random() * diffStateElements.length)];
            let val = "";
            if (answerDisplayMode === "chinese") val = randomEl.cn;
            else val = randomEl.z.toString();
            if (!forcedOpts.includes(val)) forcedOpts.push(val);
        }
        
        quizData.type        = "特性校準：常溫狀態 > 元素"; 
        const questionTemplates = [
                `${periodicDataPremise(target)}下列哪個元素在常溫常壓 (25°C, 1atm) 下為「${cleanState}」？`,
                `${periodicDataPremise(target)}在常溫常壓下呈「${cleanState}」狀態的元素是？`,
                `${periodicDataPremise(target)}下列何者在常溫常壓下為「${cleanState}」？`
        ];
        quizData.question    = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
        quizData.answer      = answerValue;
        quizData.displayMode = answerDisplayMode;
        quizData.forcedOpts  = forcedOpts.slice(0, 4); // 確保只有4個選項
    }
} else if (type === 6) {
    // 粒子計算與反推：每個選項都以 p=Z、e=Z−q、n=A−Z 重新驗算。
    const charge = calibrationShuffle(PERIODIC_PARTICLE_CHARGES)[0];
    const particle = periodicMakeParticle(target, charge);
    if (!particle) continue;
    const subType = Math.floor(Math.random() * 6);
    const particleText = periodicParticleLabel(particle);
    quizData._periodicParticle = particle;
    quizData._particleCharge = particle.q;
    quizData._electronCount = particle.e;
    quizData._protonCount = particle.p;
    quizData._neutronCount = particle.n;

    if (subType === 0) {
        quizData.type = "計算：電子總數";
        quizData.question = `粒子 [ ${particleText} ] 的核外電子總數為何？`;
        quizData.answer = String(particle.e);
        quizData.displayMode = "number";
    } else if (subType === 1) {
        quizData.type = "計算：質子總數";
        quizData.question = `粒子 [ ${particleText} ] 的原子核內質子總數為何？`;
        quizData.answer = String(particle.p);
        quizData.displayMode = "number";
    } else if (subType === 2) {
        quizData.type = "計算：中子總數";
        quizData.questionHtml = `核種 ${periodicNuclideLabel(particle)} 的原子核內中子總數為何？`;
        quizData.question = `核種 ${particle.a}${target.s} 的原子核內中子總數為何？`;
        quizData.answer = String(particle.n);
        quizData.displayMode = "number";
    } else if (subType === 3) {
        quizData.type = "識別校準：電子數逆推";
        quizData.question = `核外電子總數為 ${particle.e} 的粒子，可能為下列何者？`;
        quizData.answer = particleText;
        quizData.displayMode = "ion";
        quizData._periodicParticleMode = "electron";
        if (!periodicParticleOptions(
            quizData,
            particle,
            candidate => candidate.e !== particle.e,
            candidate => `${periodicParticleReason(candidate)}；不是題目要求的 ${particle.e} 個電子`
        )) continue;
    } else if (subType === 4) {
        quizData.type = "識別校準：質子／中子／電子反推";
        quizData.question = `某粒子有 ${particle.p} 個質子、${particle.n} 個中子與 ${particle.e} 個電子，該粒子為何？`;
        quizData.answer = particleText;
        quizData.displayMode = "ion";
        quizData._periodicParticleMode = "full";
        if (!periodicParticleOptions(
            quizData,
            particle,
            candidate => candidate.p !== particle.p || candidate.n !== particle.n || candidate.e !== particle.e,
            candidate => `${periodicParticleReason(candidate)}；與題目給定的質子、中子、電子數不符`
        )) continue;
    } else {
        quizData.type = "邏輯判斷：等電子序列";
        quizData.question = `下列哪一個粒子與 [ ${particleText} ] 具有相同的電子數？`;
        quizData.answer = particleText;
        quizData.displayMode = "ion";
        quizData._periodicParticleMode = "isoelectronic";
        const electronPartner = window.quizState.pool
            .filter(el => el.z !== particle.z)
            .map(el => periodicRandomParticle(el))
            .find(candidate => candidate && candidate.e === particle.e);
        if (!electronPartner) continue;
        quizData.answer = periodicParticleLabel(electronPartner);
        quizData._periodicParticle = electronPartner;
        quizData._electronCount = electronPartner.e;
        if (!periodicParticleOptions(
            quizData,
            electronPartner,
            candidate => candidate.e !== electronPartner.e,
            candidate => `${periodicParticleReason(candidate)}；與正解並非 ${electronPartner.e} 個電子`
        )) continue;
    }
} else if (type === 7) {
    quizData.type        = "量子結構：價電子數"; 
    quizData.question    = [ `${s} 的「價電子數」共有多少個？`, `${s} 最外層殼層的電子數為何？` ][Math.floor(Math.random() * 2)];
    quizData.answer      = QUIZ_HELPER.getValence(parsed, target).toString();
    quizData.displayMode = "number";
} else if (type === 8) {
    quizData.type        = "量子結構：未成對電子"; 
    quizData.question    = [ `${s} 在基態下，其「未成對電子」（單電子）總數為？`, `${s} 基態原子中，填充在軌域中不成對的電子數為何？` ][Math.floor(Math.random() * 2)];
    quizData.answer      = QUIZ_HELPER.getUnpaired(parsed).toString();
    quizData.displayMode = "number";
} else if (type === 9) {
    const isTransition   = target.iupac >= 3 && target.iupac <= 12;
    const maxN           = Math.max(...parsed.map(o => o.n));
    if (Math.random() > 0.5) {
        let availOrbs = ['s'];
        if (QUIZ_HELPER.getOrbitalSum(parsed, 'p') > 0) availOrbs.push('p');
        if (QUIZ_HELPER.getOrbitalSum(parsed, 'd') > 0) availOrbs.push('d');
        const orb            = availOrbs[Math.floor(Math.random() * availOrbs.length)];
        quizData.type        = `量子結構：${orb.toUpperCase()} 軌域總數統計`;
        quizData.question    = [ `在 ${s} 的基態電子組態中，填充在「所有能階」之 ${orb} 軌域的電子總數為何？`, `${s} 基態原子內有多少顆電子位於 ${orb} 軌域中（不分能階）？` ][Math.floor(Math.random() * 2)];
        quizData.answer      = QUIZ_HELPER.getOrbitalSum(parsed, orb).toString();
    } else {
        let vOrb = 's', vCount = 0, orbName = "";
        if (isTransition) {
            const askD = Math.random() > 0.5;
            if (askD) { vOrb = 'd'; vCount = parsed.find(o => o.n === (maxN - 1) && o.type === 'd')?.count || 0; orbName = `(n-1)d`; }
            else { vOrb = 's'; vCount = parsed.find(o => o.n === maxN && o.type === 's')?.count || 0; orbName = `ns`; }
        } else {
            const hasP = parsed.some(o => o.n === maxN && o.type === 'p');
            const askP = hasP && Math.random() > 0.5;
            if (askP) { vOrb = 'p'; vCount = parsed.find(o => o.n === maxN && o.type === 'p')?.count || 0; orbName = `np`; }
            else { vOrb = 's'; vCount = parsed.find(o => o.n === maxN && o.type === 's')?.count || 0; orbName = `ns`; }
        }
        quizData.type        = `量子結構：價電子能階統計`;
        quizData.question    = [ `根據價電子定義，${s} 填充在「${orbName}」軌域中的電子數為何？`, `針對 ${s} 的價電子分佈，其中有多少顆電子位於 ${orbName} 軌域？` ][Math.floor(Math.random() * 2)];
        quizData.answer      = vCount.toString();
    }
    quizData.displayMode = "number";
} else if (type === 10) {
    // 擴展：同族元素或同一週期
    const groupPartners = window.quizState.pool.filter(el => Number.isInteger(Number(target.iupac)) && Number.isInteger(Number(el.iupac)) && el.iupac === target.iupac && el.z !== target.z);
    const direction = groupPartners.length ? Math.random() : 0;
    if (direction > 0.5) {
        // 同族元素
        quizData.type        = "邏輯判斷：同族元素"; 
        const questionTemplates = [
            `下列哪一個元素與 ${s} 位於週期表的「同一族」？`,
            `與 ${s} 屬於同一族的元素是？`,
            `下列何者與 ${s} 位於週期表的相同族？`
        ];
        quizData.question    = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
        // 修正：確保正確答案也在pool範圍內（符合RANK限制）
        const partners       = groupPartners;
        quizData.answer      = partners.length > 0 ? partners[Math.floor(Math.random() * partners.length)].s : "以上皆非";
        quizData.displayMode = "symbol";
        
        // 生成選項：正確答案 + 3個不同族的元素（確保只有一個正確答案，且不包含問題中的元素）
        const diffGroupElements = window.quizState.pool.filter(el => {
            return el.iupac !== target.iupac && el.z !== target.z; // 只選擇不同族且不是問題中元素的元素作為錯誤選項
        });
        let forcedOpts = [quizData.answer];
        const shuffledDiff = calibrationShuffle(diffGroupElements).slice(0, 3);
        shuffledDiff.forEach(el => {
            forcedOpts.push(el.s);
        });
        // 如果選項不足4個，從不同族的元素中隨機補充
        while (forcedOpts.length < 4 && diffGroupElements.length > 0) {
            const randomEl = diffGroupElements[Math.floor(Math.random() * diffGroupElements.length)];
            if (!forcedOpts.includes(randomEl.s) && randomEl.z !== target.z) forcedOpts.push(randomEl.s);
        }
        quizData.forcedOpts = forcedOpts.slice(0, 4); // 確保只有4個選項
    } else {
        // 同一週期
        quizData.type        = "邏輯判斷：同一週期"; 
        const questionTemplates = [
            `下列哪一個元素與 ${s} 位於週期表的「同一週期」？`,
            `與 ${s} 屬於同一週期的元素是？`,
            `下列何者與 ${s} 位於週期表的相同週期？`
        ];
        quizData.question    = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
        // 修正：確保正確答案也在pool範圍內（符合RANK限制）
        const partners       = window.quizState.pool.filter(el => el.p === target.p && el.z !== target.z);
        quizData.answer      = partners.length > 0 ? partners[Math.floor(Math.random() * partners.length)].s : "以上皆非";
        quizData.displayMode = "symbol";
        
        // 生成選項：正確答案 + 3個不同週期的元素（確保只有一個正確答案，且不包含問題中的元素）
        const diffPeriodElements = window.quizState.pool.filter(el => {
            return el.p !== target.p && el.z !== target.z; // 只選擇不同週期且不是問題中元素的元素作為錯誤選項
        });
        let forcedOpts = [quizData.answer];
        const shuffledDiff = calibrationShuffle(diffPeriodElements).slice(0, 3);
        shuffledDiff.forEach(el => {
            forcedOpts.push(el.s);
        });
        // 如果選項不足4個，從不同週期的元素中隨機補充
        while (forcedOpts.length < 4 && diffPeriodElements.length > 0) {
            const randomEl = diffPeriodElements[Math.floor(Math.random() * diffPeriodElements.length)];
            if (!forcedOpts.includes(randomEl.s) && randomEl.z !== target.z) forcedOpts.push(randomEl.s);
        }
        quizData.forcedOpts = forcedOpts.slice(0, 4); // 確保只有4個選項
    }
} else if (type === 11) {
    quizData.type        = "位置定位：區塊 (Block)";
    const i = target.iupac; let blockName = "f";
    if (target.s === "He") blockName = "s";
    else if (typeof i === 'number') { if (i <= 2) blockName = "s"; else if (i >= 13) blockName = "p"; else blockName = "d"; }
    quizData.question    = `元素 ${s} 屬於週期表中的哪一個區塊 (Block)？`;
    quizData.answer      = `${blockName} 區`;
    quizData.displayMode = "raw";
} else if (type === 14) {
    const enPool         = window.quizState.pool.filter(el => QUIZ_HELPER.getEN(el.s) !== null);
    let sel              = calibrationShuffle(enPool).slice(0, 4);
    let winner           = sel.reduce((p, c) => (QUIZ_HELPER.getEN(c.s) > QUIZ_HELPER.getEN(p.s)) ? c : p);
    quizData.type        = "性質趨勢：電負度比較";
    quizData.question    = `下列哪一個原子的「電負度」最大？`;
    quizData.answer      = winner.s;
    quizData.forcedOpts  = sel.map(el => el.s);
    quizData.displayMode = "symbol";
} else if (type === 15) {
    quizData.type        = "邏輯判斷：化學性質相似"; 
    quizData.question    = `${periodicDataPremise(target)}根據電子組態特徵，下列哪一個元素與 ${s} 的「化學性質」最相似？`;
    // 修正：確保正確答案也在pool範圍內（符合RANK限制）
    const partners       = window.quizState.pool.filter(el => Number.isInteger(Number(target.iupac)) && Number.isInteger(Number(el.iupac)) && el.iupac === target.iupac && el.z !== target.z);
    if (!partners.length) continue;
    quizData.answer      = partners.length > 0 ? partners[Math.floor(Math.random() * partners.length)].s : "以上皆非";
    quizData.displayMode = "symbol";
    
    // 生成選項：正確答案 + 3個不同 iupac 的元素（確保只有一個正確答案，且不包含問題中的元素）
    const diffIupacElements = window.quizState.pool.filter(el => {
        return el.iupac !== target.iupac && el.z !== target.z; // 只選擇不同 iupac 且不是問題中元素的元素作為錯誤選項
    });
    let forcedOpts = [quizData.answer];
    const shuffledDiff = calibrationShuffle(diffIupacElements).slice(0, 3);
    shuffledDiff.forEach(el => {
        forcedOpts.push(el.s);
    });
    // 如果選項不足4個，從不同 iupac 的元素中隨機補充
    while (forcedOpts.length < 4 && diffIupacElements.length > 0) {
        const randomEl = diffIupacElements[Math.floor(Math.random() * diffIupacElements.length)];
        if (!forcedOpts.includes(randomEl.s) && randomEl.z !== target.z) forcedOpts.push(randomEl.s);
    }
    quizData.forcedOpts = forcedOpts.slice(0, 4); // 確保只有4個選項
} else if (type === 20) {
    // 組態逆推：給元素或離子，問縮寫電子組態
    const useIon = Math.random() < 0.4 && target.z >= 3;
    let charge = 0;
    let questionParticle, correctConfig;
    if (useIon) {
        const maxC = target.z <= 20 ? 3 : 4;
        charge = (Math.random() < 0.65) ? Math.ceil(Math.random() * maxC) : -Math.ceil(Math.random() * 2);
        const ionConfig = calculateIonConfig(target.c, charge);
        correctConfig = toNobleNotation(ionConfig).replace(/<span class="noble">|<\/span>/g, '');
        const absC = Math.abs(charge);
        const sign = charge > 0 ? '+' : '-';
        const sup = `<sup>${absC === 1 ? '' : absC}${sign}</sup>`;
        questionParticle = `離子 ${target.s}${sup}`;
    } else {
        correctConfig = target.noble;
        const useFormat = Math.floor(Math.random() * 3);
        if (useFormat === 0) questionParticle = target.s;
        else if (useFormat === 1) questionParticle = `「${target.cn}」`;
        else questionParticle = `原子序 ${target.z} 的元素`;
    }
    // 三個錯誤選項：從pool中隨機挑不同noble的元素
    const wrongCfgPool = window.quizState.pool.filter(el => el.noble !== correctConfig && el.z !== target.z);
    const wrongCfgs = calibrationShuffle(wrongCfgPool).slice(0, 3).map(el => el.noble);
    quizData.type = "組態逆推";
    quizData.question = `${questionParticle} 的基態電子組態（縮寫）為何？`;
    quizData.answer = correctConfig;
    quizData.displayMode = "noble";
    quizData.forcedOpts = calibrationShuffle([correctConfig, ...wrongCfgs]);
} else if (type === 16) {
    // 混成軌域判斷題型（正向＋反向）
    const validMolecules = [];
    for (let mKey in MOLECULE_DB) {
        const mol = MOLECULE_DB[mKey];
        if (mol.isIonic && mol.isMetal) continue;
        if (!mol.hybrid || mol.hybrid === "-" || mol.hybrid === "") continue;
        const nameParts = (mol.fullKey || mKey).split('|');
        const mainName = nameParts[0].trim();
        const chineseName = nameParts[1] ? nameParts[1].trim() : null;
        const centerAtom = mol.center;
        if (!centerAtom || centerAtom === "雙原子" || centerAtom === "Metal") continue;
        if (mol.variants) {
            for (let vKey in mol.variants) {
                const variant = mol.variants[vKey];
                if (variant.isIonic && variant.isMetal) continue;
                if (variant.hybrid && variant.hybrid !== "-" && variant.hybrid !== "") {
                    const vNameParts = (variant.fullKey || vKey).split('|');
                    const vMainName = vNameParts[0].trim();
                    const vChineseName = vNameParts[1] ? vNameParts[1].trim() : null;
                    const vCenter = variant.center || mol.center;
                    if (vCenter && vCenter !== "雙原子" && vCenter !== "Metal") {
                        validMolecules.push({ key: mKey, variant: vKey, name: vMainName, chineseName: vChineseName, center: vCenter, hybrid: variant.hybrid });
                    }
                }
            }
        } else {
            validMolecules.push({ key: mKey, variant: null, name: mainName, chineseName: chineseName, center: centerAtom, hybrid: mol.hybrid });
        }
    }
    const filteredMolecules = validMolecules.filter(item => {
        const name = item.name;
        if (name.includes("Fe(C5H5)2") || name.includes("二茂鐵") || name.includes("Ferrocene")) return false;
        const simpleOrgs = ["CH4", "C2H6", "C2H4", "C2H2", "C6H6"];
        if (simpleOrgs.some(s => name.startsWith(s))) return true;
        const complexOrgMatch = name.match(/^C(\d+)H(\d+)/);
        if (complexOrgMatch) {
            if ((name.includes("NO2") || name.includes("硝基")) && item.center === "N") return true;
            if ((name.includes("NH2") || name.includes("胺")) && item.center === "N") return true;
            return false;
        }
        return true;
    });
    if (filteredMolecules.length === 0) {
        quizData.type = "混成軌域判斷";
        quizData.question = "暫無可用題目";
        quizData.answer = "sp³";
        quizData.displayMode = "hybrid";
        quizData.forcedOpts = ["sp", "sp²", "sp³", "sp³d"];
    } else {
        // 依題型選擇決定正向或反向（type 16）
        const _sub16 = window.hybridSelectedSubtypes;
        const _allow16f = !_sub16 || _sub16['16f'];
        const _allow16r = !_sub16 || _sub16['16r'];
        const isReverse = (_allow16f && _allow16r) ? (Math.random() < 0.4) : (!_allow16f);
        if (isReverse) {
            // 反向：給混成類型，問哪個分子是此混成
            const availHybrids = [...new Set(filteredMolecules.map(m => m.hybrid))];
            const targetHybrid = availHybrids[Math.floor(Math.random() * availHybrids.length)];
            const correctPool = filteredMolecules.filter(m => m.hybrid === targetHybrid);
            const wrongPool = filteredMolecules.filter(m => m.hybrid !== targetHybrid);
            const correctMol = correctPool[Math.floor(Math.random() * correctPool.length)];

            const _getHybridDisplayName = (mol) => {
                const raw = mol.chineseName || mol.name;
                const isFml = /^[A-Z][A-Za-z0-9()\s]*([+-]|\d+[+-])?$/.test(raw);
                return isFml ? formatFormula(raw) : raw;
            };

            const correctDisplay = _getHybridDisplayName(correctMol);
            const wrongOpts = [];
            const usedNames = new Set([correctMol.name]);
            const shuffledWrong = calibrationShuffle(wrongPool);
            for (const w of shuffledWrong) {
                if (wrongOpts.length >= 3) break;
                if (!usedNames.has(w.name)) {
                    usedNames.add(w.name);
                    wrongOpts.push(_getHybridDisplayName(w));
                }
            }
            let _hSafety = 0;
            while (wrongOpts.length < 3 && _hSafety < 50) {
                _hSafety++;
                const filler = filteredMolecules[Math.floor(Math.random() * filteredMolecules.length)];
                const fd = _getHybridDisplayName(filler);
                if (!usedNames.has(filler.name) && filler.hybrid !== targetHybrid) {
                    usedNames.add(filler.name);
                    wrongOpts.push(fd);
                }
            }

            const questionTemplates = [
                `下列何者的中心原子為 ${targetHybrid} 混成？`,
                `下列哪一個物質採取 ${targetHybrid} 混成軌域？`,
                `哪一個分子或離子的中心原子為 ${targetHybrid} 混成？`
            ];
            quizData.type = "混成軌域判斷（反向）";
            quizData.question = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
            quizData.answer = correctDisplay;
            const hybridDomainTotal = ({sp:2, 'sp²':3, 'sp³':4, 'sp³d':5, 'sp³d²':6, 'sp³d³':7})[targetHybrid] || 0;
            let reverseSigma = 0;
            let reverseLonePairs = 0;
            const reverseBaseMol = MOLECULE_DB[correctMol.key];
            const reverseMolData = correctMol.variant && reverseBaseMol && reverseBaseMol.variants
                ? reverseBaseMol.variants[correctMol.variant]
                : reverseBaseMol;
            if (reverseMolData && Array.isArray(reverseMolData.atomsRaw) && Array.isArray(reverseMolData.bondsRaw)) {
                const centerIdx = reverseMolData.atomsRaw.findIndex(atom => atom.elem === correctMol.center);
                if (centerIdx >= 0) {
                    reverseMolData.bondsRaw.forEach(bond => {
                        if (bond[0] === centerIdx || bond[1] === centerIdx) reverseSigma++;
                    });
                    const centerAtomData = reverseMolData.atomsRaw[centerIdx];
                    reverseLonePairs = Number(centerAtomData.lpCount || (centerAtomData.lp3d && centerAtomData.lp3d.length) || 0);
                }
            }
            if (reverseSigma + reverseLonePairs !== hybridDomainTotal) {
                reverseSigma = hybridDomainTotal;
                reverseLonePairs = 0;
            }
            quizData._hybridDomains = { sigma: reverseSigma, lonePairs: reverseLonePairs, total: hybridDomainTotal };
            quizData.displayMode = "formula";
            quizData.forcedOpts = calibrationShuffle([correctDisplay, ...wrongOpts]);
        } else {
            // 正向：給分子，問混成
            const selected = filteredMolecules[Math.floor(Math.random() * filteredMolecules.length)];
            const rawName = selected.name || selected.chineseName;
            const isFormula = /^[A-Z][A-Za-z0-9()]*\s*([+-]|\d+[+-])?$/.test(rawName);
            let displayName;
            if (isFormula) {
                const formattedFormula = formatFormula(rawName);
                displayName = `<span style="display: inline; font-size: 1.7rem; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(56,189,248,0.5); vertical-align: baseline;">${formattedFormula}</span>`;
            } else {
                displayName = rawName;
            }
            const correctHybrid = selected.hybrid;
            const _spOpts = ["sp", "sp²", "sp³"], _dOpts = ["sp³d", "sp³d²", "sp³d³"];
            let allOptions;
            if (_spOpts.includes(correctHybrid)) {
                const dPick = _dOpts[Math.floor(Math.random()*_dOpts.length)];
                allOptions = calibrationShuffle([..._spOpts, dPick]);
            } else {
                const otherD = calibrationShuffle(_dOpts.filter(h=>h!==correctHybrid)).slice(0,1);
                const spPick = calibrationShuffle(_spOpts).slice(0,2);
                allOptions = calibrationShuffle([correctHybrid, ...otherD, ...spPick]);
            }

            let atomDescription = selected.center;
            const molData = selected.variant ? MOLECULE_DB[selected.key].variants[selected.variant] : MOLECULE_DB[selected.key];
            if (molData && Array.isArray(molData.atomsRaw) && Array.isArray(molData.bondsRaw)) {
                const centerIdx = molData.atomsRaw.findIndex(atom => atom.elem === selected.center);
                if (centerIdx >= 0) {
                    let sigma = 0;
                    molData.bondsRaw.forEach(bond => { if (bond[0] === centerIdx || bond[1] === centerIdx) sigma++; });
                    const atom = molData.atomsRaw[centerIdx];
                    const lonePairs = Number(atom.lpCount || (atom.lp3d && atom.lp3d.length) || 0);
                    quizData._hybridDomains = { sigma, lonePairs, total: sigma + lonePairs };
                }
            }
            if (molData && molData.atomsRaw && molData.bondsRaw) {
                const sameTypeIndices = [];
                molData.atomsRaw.forEach((atom, idx) => { if (atom.elem === selected.center) sameTypeIndices.push(idx); });
                if (sameTypeIndices.length > 1) {
                    const atomHybrids = sameTypeIndices.map(idx => {
                        let sigmaCount = 0; let lpCount = molData.atomsRaw[idx].lpCount || 0;
                        molData.bondsRaw.forEach(bond => { if (bond[0] === idx || bond[1] === idx) sigmaCount++; });
                        const sum = sigmaCount + lpCount;
                        let hybrid = (sum === 2) ? "sp" : (sum === 3) ? "sp²" : (sum === 4) ? "sp³" : (sum === 5) ? "sp³d" : (sum === 6) ? "sp³d²" : "";
                        return { idx, hybrid };
                    });
                    const uniqueHybrids = [...new Set(atomHybrids.map(a => a.hybrid))];
                    if (uniqueHybrids.length > 1) {
                        const targetHybrid2 = atomHybrids.find(a => a.hybrid === correctHybrid);
                        if (targetHybrid2) {
                            const bondedAtoms = [];
                            molData.bondsRaw.forEach(bond => {
                                const otherIdx = bond[0] === targetHybrid2.idx ? bond[1] : (bond[1] === targetHybrid2.idx ? bond[0] : -1);
                                if (otherIdx >= 0) { const oa = molData.atomsRaw[otherIdx]; if (oa && oa.elem !== selected.center) bondedAtoms.push(oa.elem); }
                            });
                            if (bondedAtoms.includes("N")) atomDescription = `連接N原子的${selected.center}`;
                            else if (bondedAtoms.includes("O")) atomDescription = `連接O原子的${selected.center}`;
                            else if (bondedAtoms.includes("Cl")) atomDescription = `連接Cl原子的${selected.center}`;
                            else if (bondedAtoms.length > 0) atomDescription = `連接${bondedAtoms[0]}原子的${selected.center}`;
                        }
                    }
                }
            }
            const questionTemplates = [
                `${displayName}中的${atomDescription}原子採取何種混成軌域？`,
                `${displayName}的${atomDescription}原子為何種混成？`,
                `${displayName}中，${atomDescription}原子的混成方式為？`
            ];
            quizData.type = "混成軌域判斷";
            quizData.question = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
            quizData.answer = correctHybrid;
            quizData.displayMode = "hybrid";
            quizData.forcedOpts = allOptions;
        }
    }
} else if (type === 17) {
    // 分子形狀判斷題型（正向＋反向）
    // VSEPR 形狀對照表
    const VSEPR_SHAPES = {
        "2_0": "直線形", "3_0": "平面三角形", "2_1": "角形", "4_0": "正四面體",
        "3_1": "三角錐形", "2_2": "角形", "5_0": "雙三角錐形", "4_1": "蹺蹺板形",
        "3_2": "T字形", "2_3": "直線形", "6_0": "八面體形", "5_1": "四角錐形", "4_2": "平面四邊形"
    };
    // 簡單多中心分子的形狀白名單
    const MULTI_CENTER_SHAPES = {
        "C2H2": "直線形", "C2H4": "平面形",
        "P4": "正四面體", "S8": "皇冠形", "C6H6": "平面形",
        "N2O4": "平面形"
    };
    const METAL_ELEMS = new Set(["Li","Na","K","Rb","Cs","Be","Mg","Ca","Sr","Ba","Al","Ga","In","Fe","Cu","Ag","Au","Zn","Cd","Hg","Sn","Pb","Ni","Co","Mn","Cr","Ti","V","Pt","Pd"]);
    const shouldExcludeFromShapeQuiz = (rawName) => {
        const formula = (rawName || "").replace(/\s+/g, "");
        if (!formula) return false;
        const elems = [...formula.matchAll(/([A-Z][a-z]?)/g)].map(m => m[1]);
        if (elems.length === 0) return false;
        const uniqueElems = [...new Set(elems)];
        const hasO = uniqueElems.includes("O");
        if (!hasO) return false;
        // 含氧酸 / 含氧酸根（例如 H2SO4、HSO4-）
        const isOxyAcidLike = /^H\d*/.test(formula) && uniqueElems.some(e => e !== "H" && e !== "O");
        if (isOxyAcidLike) return true;
        // 離子化合物中的含氧鹽（例如 Na2SO4、MgSO4）
        const hasMetal = uniqueElems.some(e => METAL_ELEMS.has(e));
        const hasCentralNonMetal = uniqueElems.some(e => e !== "O" && !METAL_ELEMS.has(e));
        return hasMetal && hasCentralNonMetal;
    };

    // 收集可用的形狀題目
    const shapeItems = [];
    for (let mKey in MOLECULE_DB) {
        const mol = MOLECULE_DB[mKey];
        if (mol.isIonic || mol.isMetal) continue;
        if (!mol.hybrid || mol.hybrid === "-" || mol.hybrid === "") continue;
        // 白名單分子由下方統一加入，避免重複與形狀衝突
        if (MULTI_CENTER_SHAPES[mKey]) continue;
        const centerAtom = mol.center;
        if (!centerAtom || centerAtom === "Metal") continue;

        const nameParts = (mol.fullKey || mKey).split('|');
        const mainName = nameParts[0].trim();
        const chineseName = nameParts[1] ? nameParts[1].trim() : null;
        if (shouldExcludeFromShapeQuiz(mainName)) continue;

        // 單中心分子（無 variants）：用 VSEPR 自動計算形狀
        if (centerAtom !== "雙原子" && !mol.variants) {
            if (mol.atomsRaw && mol.bondsRaw && mol.atomsRaw.length >= 2) {
                // 確認是真正的單中心（中心原子只出現一次）
                const centerCount = mol.atomsRaw.filter(a => a.elem === centerAtom).length;
                if (centerCount === 1) {
                    const centerIdx = mol.atomsRaw.findIndex(a => a.elem === centerAtom);
                    if (centerIdx >= 0) {
                        const isStarTopology = mol.atomsRaw.every((a, i) =>
                            i === centerIdx || a.elem === "H" ||
                            mol.bondsRaw.some(b => (b[0] === centerIdx && b[1] === i) || (b[1] === centerIdx && b[0] === i))
                        );
                        if (isStarTopology) {
                            let sigmaCount = 0;
                            mol.bondsRaw.forEach(bond => { if (bond[0] === centerIdx || bond[1] === centerIdx) sigmaCount++; });
                            const lpCount = mol.atomsRaw[centerIdx].lpCount || 0;
                            const lp = lpCount > 0 ? lpCount : (mol.atomsRaw[centerIdx].lp3d ? mol.atomsRaw[centerIdx].lp3d.length : 0);
                            const shapeKey = `${sigmaCount}_${lp}`;
                            const shapeName = VSEPR_SHAPES[shapeKey];
                            if (shapeName) {
                                shapeItems.push({ name: mainName, chineseName, shape: shapeName, sigma: sigmaCount, lonePairs: lp, isMultiCenter: false });
                            }
                        }
                    }
                }
            }
        }
        // 有 variants 的分子：逐一檢查每個 variant
        if (mol.variants) {
            for (let vKey in mol.variants) {
                const variant = mol.variants[vKey];
                if (variant.isIonic) continue;
                const vCenter = variant.center || centerAtom;
                if (!vCenter || vCenter === "雙原子" || vCenter === "Metal") continue;
                if (!variant.atomsRaw || !variant.bondsRaw || variant.atomsRaw.length < 2) continue;
                const vCenterCount = variant.atomsRaw.filter(a => a.elem === vCenter).length;
                if (vCenterCount !== 1) continue;
                if (variant.atomsRaw.some(a => a.elem !== vCenter && METAL_ELEMS.has(a.elem))) continue;
                const cIdx = variant.atomsRaw.findIndex(a => a.elem === vCenter);
                if (cIdx < 0) continue;
                const isStarV = variant.atomsRaw.every((a, i) =>
                    i === cIdx || a.elem === "H" ||
                    variant.bondsRaw.some(b => (b[0] === cIdx && b[1] === i) || (b[1] === cIdx && b[0] === i))
                );
                if (!isStarV) continue;
                const vNameParts = (variant.fullKey || vKey).split('|');
                const vMainName = vNameParts[0].trim();
                const vChineseName = vNameParts[1] ? vNameParts[1].trim() : null;
                if (shouldExcludeFromShapeQuiz(vMainName)) continue;
                let sc = 0;
                variant.bondsRaw.forEach(bond => { if (bond[0] === cIdx || bond[1] === cIdx) sc++; });
                const lp = variant.atomsRaw[cIdx].lpCount || (variant.atomsRaw[cIdx].lp3d ? variant.atomsRaw[cIdx].lp3d.length : 0);
                const sk = `${sc}_${lp}`;
                const sn = VSEPR_SHAPES[sk];
                if (sn) {
                    shapeItems.push({ name: vMainName, chineseName: vChineseName, shape: sn, sigma: sc, lonePairs: lp, isMultiCenter: false });
                }
            }
        }
    }
    // 加入多中心分子白名單
    for (let mcKey in MULTI_CENTER_SHAPES) {
        if (MOLECULE_DB[mcKey]) {
            const mol = MOLECULE_DB[mcKey];
            const np = (mol.fullKey || mcKey).split('|');
            shapeItems.push({ name: np[0].trim(), chineseName: np[1] ? np[1].trim() : null, shape: MULTI_CENTER_SHAPES[mcKey], isMultiCenter: true });
        }
    }

    // 過濾複雜有機物
    const filteredShapes = shapeItems.filter(item => {
        const name = item.name;
        if (name.includes("Fe(C5H5)2") || name.includes("二茂鐵")) return false;
        const simpleOrgs = ["CH4", "CO2", "CS2", "BeCl2", "BCl3", "BF3", "SO2", "SO3", "O3", "NO2", "N2O",
            "PCl5", "SF6", "SF4", "ClF3", "XeF2", "XeF4", "BrF5", "IF7", "XeO3", "XeO4", "XeOF4",
            "NH3", "PH3", "H2O", "H2S", "SiH4", "SiCl4", "PCl3", "NF3", "C2H2", "C2H4", "C2H6",
            "P4", "S8", "C6H6", "P4O6", "P4O10", "N2O3", "N2O4", "N2O5", "CH4", "CCl4",
            "NO2 +", "SCN -", "BF4 -", "PF6 -", "NH4 +", "H3O +", "POCl3", "SOCl2",
            "SeF6", "TeF6", "AsF5", "TeF4", "PBr5"];
        if (simpleOrgs.some(s => name === s || name.startsWith(s + "|"))) return true;
        // 排除複雜有機物
        const orgMatch = name.match(/^C(\d+)H(\d+)/);
        if (orgMatch && parseInt(orgMatch[1]) > 6) return false;
        return true;
    });

    if (filteredShapes.length === 0) {
        quizData.type = "分子形狀判斷";
        quizData.question = "暫無可用題目";
        quizData.answer = "直線形";
        quizData.displayMode = "shape";
        quizData.forcedOpts = ["直線形", "角形", "平面三角形", "正四面體"];
    } else {
        const allShapeNames = [...new Set([...Object.values(VSEPR_SHAPES), ...Object.values(MULTI_CENTER_SHAPES)])];
        const shapeDomainCount = shape => {
            const hit = Object.entries(VSEPR_SHAPES).find(([, name]) => name === shape);
            if (!hit) return 4;
            const [sigma, lone] = hit[0].split('_').map(Number);
            return sigma + lone;
        };
        const _sub17 = window.hybridSelectedSubtypes;
        const _allow17f = !_sub17 || _sub17['17f'];
        const _allow17r = !_sub17 || _sub17['17r'];
        const isReverse = (_allow17f && _allow17r) ? (Math.random() < 0.4) : (!_allow17f);

        if (isReverse) {
            // 反向：給形狀，問哪個分子
            const availShapes = [...new Set(filteredShapes.map(m => m.shape))];
            const targetShape = availShapes[Math.floor(Math.random() * availShapes.length)];
            const correctPool = filteredShapes.filter(m => m.shape === targetShape);
            const wrongPool = filteredShapes.filter(m => m.shape !== targetShape);
            const correctMol = correctPool[Math.floor(Math.random() * correctPool.length)];

            const _getShapeDisplayName = (mol) => {
                const raw = mol.chineseName || mol.name;
                const isFml = /^[A-Z][A-Za-z0-9()\s]*([+-]|\d+[+-])?$/.test(raw);
                return isFml ? formatFormula(raw) : raw;
            };
            const correctDisplay = _getShapeDisplayName(correctMol);
            const wrongOpts = [];
            const usedNames = new Set([correctMol.name]);
            const targetDomain = shapeDomainCount(targetShape);
            const rankedWrong = [...wrongPool].sort((a, b) => {
                const da = Math.abs(shapeDomainCount(a.shape) - targetDomain);
                const db = Math.abs(shapeDomainCount(b.shape) - targetDomain);
                return da - db || String(a.name).localeCompare(String(b.name));
            });
            for (const w of rankedWrong) {
                if (wrongOpts.length >= 3) break;
                if (!usedNames.has(w.name)) { usedNames.add(w.name); wrongOpts.push(_getShapeDisplayName(w)); }
            }
            const questionTemplates = [
                `下列何者的分子形狀為${targetShape}？`,
                `下列哪一個物質為${targetShape}？`,
                `以下哪個分子或離子的形狀是${targetShape}？`
            ];
            quizData.type = "分子形狀判斷（反向）";
            quizData.question = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
            quizData.answer = correctDisplay;
            quizData._vseprDomains = {
                total: targetDomain,
                sigma: Number(correctMol.sigma || 0),
                lonePairs: Number(correctMol.lonePairs || 0)
            };
            quizData.displayMode = "formula";
            quizData.forcedOpts = calibrationShuffle([correctDisplay, ...wrongOpts]);
        } else {
            // 正向：給分子，問形狀
            const selected = filteredShapes[Math.floor(Math.random() * filteredShapes.length)];
            const rawName = selected.name || selected.chineseName;
            const isFormula = /^[A-Z][A-Za-z0-9()]*\s*([+-]|\d+[+-])?$/.test(rawName);
            let displayName;
            if (isFormula) {
                const ff = formatFormula(rawName);
                displayName = `<span style="display: inline; font-size: 1.7rem; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(56,189,248,0.5); vertical-align: baseline;">${ff}</span>`;
            } else {
                displayName = rawName;
            }
            const correctShape = selected.shape;
            const wrongShapes = allShapeNames.filter(s => s !== correctShape)
                .sort((a, b) => Math.abs(shapeDomainCount(a) - shapeDomainCount(correctShape)) - Math.abs(shapeDomainCount(b) - shapeDomainCount(correctShape)) || a.localeCompare(b))
                .slice(0, 3);
            const shuffledWrong = wrongShapes;
            const allOptions = calibrationShuffle([correctShape, ...shuffledWrong]);
            const questionTemplates = [
                `${displayName} 的分子形狀為何？`,
                `${displayName} 的幾何形狀是？`,
                `依據 VSEPR 理論，${displayName} 的形狀為？`
            ];
            quizData.type = "分子形狀判斷";
            quizData.question = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
            quizData.answer = correctShape;
            const shapeTotal = shapeDomainCount(correctShape);
            quizData._vseprDomains = {
                total: shapeTotal,
                sigma: Number(selected.sigma || shapeTotal),
                lonePairs: Number(selected.lonePairs || 0)
            };
            quizData.displayMode = "shape";
            quizData.forcedOpts = allOptions;
        }
    }
} else if (type === 19) {
    // 結構圖問混成：顯示 2D 投影結構圖，問標示原子的混成軌域
    const _calcHybrid19 = (sigma, lp) => {
        const s = sigma + lp;
        return s === 2 ? "sp" : s === 3 ? "sp²" : s === 4 ? "sp³" : s === 5 ? "sp³d" : s === 6 ? "sp³d²" : null;
    };
    const _simpleOrgs19 = ["CH4","C2H6","C2H4","C2H2","CH3Cl","CH2Cl2","CHCl3","HCN","CH3CN"];
    const molPool19 = [];
    for (let mKey in MOLECULE_DB) {
        const mol = MOLECULE_DB[mKey];
        if (mol.isIonic || mol.isMetal) continue;
        const nameParts = (mol.fullKey || mKey).split('|');
        const mainName = nameParts[0].trim();
        const chName = nameParts[1] ? nameParts[1].trim() : null;
        const orgMatch = mainName.match(/^C(\d+)H(\d+)/);
        if (orgMatch && parseInt(orgMatch[1]) > 2 && !_simpleOrgs19.some(s => mainName === s)) continue;
        const processAtoms19 = (atoms, bonds, name, cName, center) => {
            if (!atoms || !bonds || atoms.length < 2 || atoms.length > 18) return;
            const seen = new Set();
            atoms.forEach((atom, idx) => {
                if (atom.elem === 'H') return;
                let sigma = 0, bondElectrons = 0;
                bonds.forEach(b => {
                    if (b[0] !== idx && b[1] !== idx) return;
                    sigma++;
                    const bt = b[2] || 'single';
                    if (bt === 'triple' || bt === 'coordinate_triple') bondElectrons += 3;
                    else if (bt === 'double') bondElectrons += 2;
                    else if (bt === 'coordinate') { if (b[0] === idx) bondElectrons += 2; }
                    else bondElectrons += 1;
                });
                let lp;
                if (atom.lpCount !== undefined) {
                    lp = atom.lpCount;
                } else {
                    const props = ELEMENT_PROPS[atom.elem];
                    lp = props ? Math.max(0, Math.floor((props.ve - bondElectrons) / 2)) : 0;
                }
                const hybrid = _calcHybrid19(sigma, lp);
                if (!hybrid) return;
                const k = `${name}-${idx}-${hybrid}`;
                if (!seen.has(k)) { seen.add(k); molPool19.push({ name, chName: cName, atoms, bonds, atomIdx: idx, elem: atom.elem, hybrid, sigma, lonePairs: lp, center: center || atom.elem }); }
            });
        };
        if (mol.atomsRaw && mol.atomsRaw.length > 0) {
            processAtoms19(mol.atomsRaw, mol.bondsRaw, mainName, chName, mol.center);
        }
        if (mol.variants) {
            for (let vKey in mol.variants) {
                const v = mol.variants[vKey];
                if (v.isIonic) continue;
                const vParts = (v.fullKey || vKey).split('|');
                const vName = vParts[0].trim();
                const vCh = vParts[1] ? vParts[1].trim() : null;
                const vOrgM = vName.match(/^C(\d+)H(\d+)/);
                if (vOrgM && parseInt(vOrgM[1]) > 2 && !_simpleOrgs19.some(s => vName === s)) continue;
                processAtoms19(v.atomsRaw, v.bondsRaw, vName, vCh, v.center || mol.center);
            }
        }
    }
    if (molPool19.length === 0) {
        quizData.type = "結構圖問混成";
        quizData.question = "暫無可用題目";
        quizData.answer = "sp³";
        quizData.displayMode = "hybrid";
        quizData.forcedOpts = ["sp", "sp²", "sp³", "sp³d"];
    } else {
        const sel19 = molPool19[Math.floor(Math.random() * molPool19.length)];
        const _sp19 = ["sp", "sp²", "sp³"], _d19 = ["sp³d", "sp³d²", "sp³d³"];
        let opts19;
        if (_sp19.includes(sel19.hybrid)) {
            const dPick = _d19[Math.floor(Math.random()*_d19.length)];
            opts19 = calibrationShuffle([..._sp19, dPick]);
        } else {
            const otherD = calibrationShuffle(_d19.filter(h=>h!==sel19.hybrid)).slice(0,1);
            const spPick = calibrationShuffle(_sp19).slice(0,2);
            opts19 = calibrationShuffle([sel19.hybrid, ...otherD, ...spPick]);
        }
        quizData.type = "結構圖問混成";
        quizData.question = `圖中標示的 ${sel19.elem} 原子採取何種混成軌域？`;
        quizData.answer = sel19.hybrid;
        quizData._hybridDomains = { sigma: sel19.sigma, lonePairs: sel19.lonePairs, total: sel19.sigma + sel19.lonePairs };
        quizData.displayMode = "hybrid";
        quizData.forcedOpts = opts19;
        quizData._mol19 = { atoms: sel19.atoms, bonds: sel19.bonds, atomIdx: sel19.atomIdx, elem: sel19.elem, name: sel19.chName || sel19.name, center: sel19.center };
        quizData._imgMolName = sel19.name;
        quizData._imgAtomElem = sel19.elem;
    }
} else if (type === 18) {
    // 氧化數判斷題型（正向＋反向）
    const METAL_ELEMS = new Set(["Li","Na","K","Rb","Cs","Be","Mg","Ca","Sr","Ba","Al","Ga","In","Fe","Cu","Ag","Au","Zn","Cd","Hg","Sn","Pb","Ni","Co","Mn","Cr","Ti","V","Pt","Pd"]);
    const oxItems = [];
    const _countElem = (atoms, elem) => atoms.filter(a => a.elem === elem).length;
    const _isComplexOrg = (name) => { const m = name.match(/^C(\d+)/); return m && parseInt(m[1]) > 2; };
    const _parseCharge = (name) => {
        const m = name.match(/\s+(\d*)([+-])\s*$/);
        if (!m) return 0;
        const num = m[1] ? parseInt(m[1]) : 1;
        return m[2] === '+' ? num : -num;
    };
    for (let mKey in MOLECULE_DB) {
        const mol = MOLECULE_DB[mKey];
        if (mol.isIonic || mol.isMetal) continue;
        if (!mol.atomsRaw || !mol.bondsRaw || mol.atomsRaw.length < 2) continue;
        const hasOnlyH = mol.atomsRaw.every(a => a.elem === "H");
        if (hasOnlyH) continue;
        const hasMetal = mol.atomsRaw.some(a => METAL_ELEMS.has(a.elem));
        if (hasMetal) continue;
        const nameParts = (mol.fullKey || mKey).split('|');
        const mainName = nameParts[0].trim();
        if (_isComplexOrg(mainName)) continue;
        const charge = _parseCharge(mainName);
        mol.atomsRaw.forEach((atom, idx) => {
            if (_countElem(mol.atomsRaw, atom.elem) > 1 && atom.elem !== "H" && atom.elem !== "O") return;
            const ox = QUIZ_HELPER.calculateAtomOxidationNumber(idx, mol.atomsRaw, mol.bondsRaw, charge);
                    oxItems.push({ molKey: mKey, name: mainName, atomElem: atom.elem, atomIdx: idx, oxidationNumber: ox, atomCount: _countElem(mol.atomsRaw, atom.elem), charge });
        });
        if (mol.variants) {
            for (let vKey in mol.variants) {
                const variant = mol.variants[vKey];
                if (variant.isIonic) continue;
                if (!variant.atomsRaw || !variant.bondsRaw || variant.atomsRaw.length < 2) continue;
                const vHasMetal = variant.atomsRaw.some(a => METAL_ELEMS.has(a.elem));
                if (vHasMetal) continue;
                const vNameParts = (variant.fullKey || vKey).split('|');
                const vMainName = vNameParts[0].trim();
                if (_isComplexOrg(vMainName)) continue;
                const vCharge = _parseCharge(vMainName);
                variant.atomsRaw.forEach((atom, idx) => {
                    if (_countElem(variant.atomsRaw, atom.elem) > 1 && atom.elem !== "H" && atom.elem !== "O") return;
                    const ox = QUIZ_HELPER.calculateAtomOxidationNumber(idx, variant.atomsRaw, variant.bondsRaw, vCharge);
                    oxItems.push({ molKey: vKey, name: vMainName, atomElem: atom.elem, atomIdx: idx, oxidationNumber: ox, atomCount: _countElem(variant.atomsRaw, atom.elem), charge: vCharge });
                });
            }
        }
    }
    const uniqueOxItems = [];
    const seenKeys = new Set();
    oxItems.forEach(item => {
        const key = `${item.name}-${item.atomElem}-${item.oxidationNumber}`;
        if (!seenKeys.has(key)) { seenKeys.add(key); uniqueOxItems.push(item); }
    });
    const interestingItems = uniqueOxItems.filter(item => item.oxidationNumber !== 0);
    const finalItems = interestingItems.length > 5 ? interestingItems : uniqueOxItems;
    if (finalItems.length === 0) {
        quizData.type = "氧化數判斷";
        quizData.question = "暫無可用題目";
        quizData.answer = "0";
        quizData.displayMode = "text";
        quizData.forcedOpts = ["-2", "-1", "0", "+1"];
    } else {
        const isReverse = Math.random() < 0.4;
        const _formatOx = (ox) => ox > 0 ? `+${ox}` : `${ox}`;
        if (isReverse) {
            const availOx = [...new Set(finalItems.map(m => m.oxidationNumber))];
            const targetOx = availOx[Math.floor(Math.random() * availOx.length)];
            const correctPool = finalItems.filter(m => m.oxidationNumber === targetOx);
            const wrongPool = finalItems.filter(m => m.oxidationNumber !== targetOx);
            const correctMol = correctPool[Math.floor(Math.random() * correctPool.length)];
            const correctDisplay = formatFormula(correctMol.name) + ` 中的 ${correctMol.atomElem}`;
            const wrongOpts = [];
            const usedNames = new Set([correctMol.name + correctMol.atomElem]);
            const rankedWrong = [...wrongPool].sort((a, b) => {
                const da = Math.abs(a.oxidationNumber - targetOx);
                const db = Math.abs(b.oxidationNumber - targetOx);
                return da - db || String(a.name).localeCompare(String(b.name));
            });
            for (const w of rankedWrong) {
                if (wrongOpts.length >= 3) break;
                const wKey = w.name + w.atomElem;
                if (!usedNames.has(wKey)) { usedNames.add(wKey); wrongOpts.push(formatFormula(w.name) + ` 中的 ${w.atomElem}`); }
            }
            quizData.type = "氧化數判斷（反向）";
            quizData.question = `下列何者的氧化數為 ${_formatOx(targetOx)}？`;
            quizData.answer = correctDisplay;
            quizData._oxidationContext = { element: correctMol.atomElem, charge: correctMol.charge || 0, target: targetOx };
            quizData.displayMode = "formula";
            quizData.forcedOpts = calibrationShuffle([correctDisplay, ...wrongOpts]);
        } else {
            const selected = finalItems[Math.floor(Math.random() * finalItems.length)];
            const displayName = `<span style="display: inline; font-size: 1.7rem; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(56,189,248,0.5); vertical-align: baseline;">${formatFormula(selected.name)}</span>`;
            const correctOx = _formatOx(selected.oxidationNumber);
            const wrongOxSet = new Set();
            const candidates = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6].filter(x => x !== selected.oxidationNumber);
            candidates.sort((a, b) => {
                const aSignFlip = Math.sign(a) !== Math.sign(selected.oxidationNumber) ? 0 : 1;
                const bSignFlip = Math.sign(b) !== Math.sign(selected.oxidationNumber) ? 0 : 1;
                return Math.abs(a - selected.oxidationNumber) - Math.abs(b - selected.oxidationNumber) || aSignFlip - bSignFlip || a - b;
            });
            for (let i = 0; i < 3 && i < candidates.length; i++) wrongOxSet.add(candidates[i]);
            const wrongOxArr = [...wrongOxSet].map(x => _formatOx(x));
            const allOptions = calibrationShuffle([correctOx, ...wrongOxArr]);
            quizData.type = "氧化數判斷";
            quizData.question = `${displayName} 中的 ${selected.atomElem} 原子，其氧化數為何？`;
            quizData.answer = correctOx;
            quizData._oxidationContext = { element: selected.atomElem, charge: selected.charge || 0, target: selected.oxidationNumber };
            quizData.displayMode = "text";
            quizData.forcedOpts = allOptions;
        }
    }
} else if ((type >= 32 && type <= 39) || type === 50) {
    if (!window.FORMULA_ENGINE || !window.FORMULA_ENGINE.generate(type, quizData)) {
        continue;
    }
} else if (type >= 21 && type <= 31) {
    if (!PRECIP_ENGINE.generate(type, quizData)) {
        continue;
    }
} else if (type >= 40 && type <= 45) {
    if (!window.KNOWLEDGE_ENGINE || !window.KNOWLEDGE_ENGINE.generate(type, quizData)) {
        continue;
    }
} else if (type >= 46 && type <= 49) {
    if (!window.CALIBRATION_EXTENSION_ENGINE || !window.CALIBRATION_EXTENSION_ENGINE.generate(quizData)) {
        continue;
    }
}

        // 週期表模式在共用題型生成後套用本輪的難度變體；RANK 只影響元素池。
        if (isPeriodic) {
            if (periodicProfile === 'simple') {
                if (!applyPeriodicSimpleVariant(type, quizData, target)) continue;
            } else if (periodicProfile === 'challenge') {
                if (!applyPeriodicChallengeVariant(type, quizData, target)) continue;
            } else if (PERIODIC_SIMPLE_CAPABLE_TYPES.includes(type)) {
                applyPeriodicStandardVariant(type, quizData, target);
            }
        }

        // 所有可出現題型都在這裡完成選項品質與詳解資料的最後校準。
        // 題型引擎仍可提供專屬選項；若沒有專屬資料，才由同類近鄰池補齊，絕不再抽無關隨機值。
        if (type >= 32 && type <= 39) {
            refineFormulaQuestionOptions(quizData);
        } else if (type < 16) {
            refineElementQuestionOptions(type, quizData, target);
        }
        attachGenericCalibrationReason(type, quizData, target, parsed);
        attachOptionRationales(quizData, target);

        const semanticValidation = validateCalibrationQuestion(quizData, type, target);
        if (!semanticValidation.ok) {
            // 內容不合格時重抽，避免把多個化學上正確的選項送到學生面前。
            quizData._validationFailure = semanticValidation.reason;
            continue;
        }

        // 若選項池不足、重複或沒有唯一正解，直接重抽本題；不以無關的隨機值補齊選項。
        const optionKeys = Array.isArray(quizData.forcedOpts)
            ? quizData.forcedOpts.map(calibrationOptionKey)
            : [];
        const uniqueOptionCount = new Set(optionKeys).size;
        const answerKey = calibrationOptionKey(quizData.answer);
        const correctCount = optionKeys.filter(key => key === answerKey).length;
        const isStateQuestion = /常溫狀態/.test(quizData.type || '');
        const isClassificationQuestion = /分類/.test(quizData.type || '');
        const minimumOptions = type >= 46 && type <= 49 ? 3 : isStateQuestion
            ? 4
            : isClassificationQuestion
            ? 4
            : optionKeys.includes('微溶')
            ? 3
            : (optionKeys.includes('是') || optionKeys.includes('否') || optionKeys.includes('可溶') || optionKeys.includes('難溶') || optionKeys.includes('沉澱') ? 2 : 4);
        if (!Array.isArray(quizData.forcedOpts) || quizData.forcedOpts.length < minimumOptions ||
            uniqueOptionCount !== quizData.forcedOpts.length || correctCount !== 1) {
            continue;
        }
        
        // 生成問題的唯一標識（用於重複檢查）
        // 智能識別問題的核心內容，允許同一type但不同問法，但禁止完全相同問題
        questionKey = generateQuestionKey(type, quizData, target);
        
        // 檢查是否已問過相同問題
        if (!window.quizState.askedQuestions.includes(questionKey)) {
            // 問題不重複，標記為已問過
            window.quizState.askedQuestions.push(questionKey);
            questionGenerated = true;
        }
        // 如果重複，繼續循環重新生成
    }
    
    // 若題庫在本次嘗試沒有產生合格或未重複的題目，回退本題計數並重新抽取；
    // 不把最後一次重複題偷偷送出，避免「重抽失效」。
    if (!questionGenerated) {
        // 不讓題庫在極端亂數或重複題情況下以遞迴重試造成堆疊溢位。
        window.quizState.currentQ--;
        window.quizState._periodicRenderRetry = (window.quizState._periodicRenderRetry || 0) + 1;
        if (window.quizState._periodicRenderRetry <= 2) return window.renderNextQuestion();
        window.quizState._periodicRenderRetry = 0;
        // 本題無法在有限次嘗試內取得唯一正解時，改抽一般週期表題，仍維持四選一流程。
        if (Array.isArray(window.quizState.typeDeck)) {
            const retryIndex = Math.max(0, window.quizState.currentQ);
            window.quizState.typeDeck[retryIndex] = 0;
        }
        return window.renderNextQuestion();
    }
    window.quizState._periodicRenderRetry = 0;

    // 4. UI 視覺標準化與渲染
    const questionEl = document.getElementById('quiz-question');
    document.getElementById('quiz-type').textContent = `> TYPE: ${quizData.type}`;
    const questionCodeEl = document.getElementById('quiz-question-code');
    const topicBadgeEl = document.getElementById('quiz-topic-badge');
    if (questionCodeEl) {
        questionCodeEl.textContent = `QUESTION ${String(window.quizState.currentQ).padStart(2, '0')}`;
    }
    if (topicBadgeEl) {
        topicBadgeEl.textContent = getCalibrationTopicLabel(window.quizState.difficulty, type);
    }
    const feedbackEl = document.getElementById('quiz-feedback');
    if (feedbackEl) {
        feedbackEl.innerHTML = '';
        feedbackEl.style.display = 'none';
    }
    renderCalibrationRuler(window.quizState.currentQ, window.quizState.totalQ);
    
    // 混成軌域交由 MathJax 排版；其他化學式沿用資料相容的語意上下標。
    let htmlQ = formatHybridNotationHtml(quizData.questionHtml || quizData.question);
    if (!quizData.questionHtml) {
        // 題幹也統一走與選項相同的 Unicode→語意標籤轉換；否則 H₃O⁺ 會保留
        // 字型內建的小字形，而選項的 <sub>/<sup> 則使用 CSS 排版，造成上下標不一致。
        htmlQ = htmlQ.split(/(<[^>]+>)/).map(part => part.startsWith("<") ? part : formatChemLabel(part)).join("");
    }
    htmlQ = formatCalibrationChemistryHtml(htmlQ);
    
    // 停止前一題的 mini viewer
    if (window.quizViewer) {
        if (window.quizViewer.animFrame) cancelAnimationFrame(window.quizViewer.animFrame);
        window.removeEventListener('mousemove', window.quizViewer._onMove);
        window.removeEventListener('mouseup', window.quizViewer._onUp);
        window.removeEventListener('touchmove', window.quizViewer._onMove);
        window.removeEventListener('touchend', window.quizViewer._onUp);
        window.quizViewer = null;
    }

    const questionCard = questionEl.closest('.quiz-question-card');
    const quizContentArea = document.getElementById('quiz-content-area');
    if (quizData.type === "結構圖問混成" && quizData._mol19) {
        const mol = quizData._mol19;
        if (questionCard) questionCard.classList.add('mol-mode');
        if (quizContentArea) quizContentArea.classList.add('mol-mode');
        questionEl.style.fontSize = "1.7rem";
        questionEl.innerHTML = `<svg id="quiz-mol-svg" width="260" height="220" viewBox="0 0 280 240" style="width:min(260px,85vw);height:auto;background:rgba(0,0,0,0.45);border-radius:8px;border:1px solid rgba(245,158,11,0.35);display:block;margin:4px auto;cursor:grab;touch-action:none;"></svg><div style="margin-top:8px;">圖中標示的 <b style="color:#f59e0b;">${mol.elem}</b> 原子（${mol.name}）採取何種混成軌域？</div>`;
        const svgEl = document.getElementById('quiz-mol-svg');
        if (svgEl) startQuizMiniViewer(svgEl, mol.atoms, mol.bonds, mol.atomIdx, mol.center);
    } else {
        if (questionCard) questionCard.classList.remove('mol-mode');
        if (quizContentArea) quizContentArea.classList.remove('mol-mode');
        questionEl.innerHTML = htmlQ;
        questionEl.style.fontSize = "1.7rem";
    }
    typesetCalibrationMath(questionEl);

    // 5. 智慧選項生成 (建立 opts 陣列)
    // 從問題中提取元素符號，確保選項中不包含問題中提到的元素
    const questionText = quizData.question;
    const questionElementSymbols = [];
    // 提取問題中的元素符號（例如 [ Mg ] 或 ${s}）
    const symbolMatches = questionText.match(/\[?\s*([A-Z][a-z]?)\s*\]?/g);
    if (symbolMatches) {
        symbolMatches.forEach(match => {
            const symbol = match.replace(/[\[\]\s]/g, '');
            if (symbol && symbol.length <= 2) {
                questionElementSymbols.push(symbol);
                // 同時檢查中文名和英文名
                const element = ELECTRON_DATA.find(el => el.s === symbol);
                if (element) {
                    questionElementSymbols.push(element.cn);
                    questionElementSymbols.push(element.n);
                }
            }
        });
    }
    // 也檢查問題中是否包含目標元素的符號、中文名、英文名
    if (target) {
        questionElementSymbols.push(target.s);
        questionElementSymbols.push(target.cn);
        questionElementSymbols.push(target.n);
    }
    
    // 題目生成階段已完成選項校準；這裡只使用經過檢核的 forcedOpts，
    // 不再以隨機元素、隨機數字或隨機電荷補齊，避免出現無關誘答或卡題。
    const opts = Array.isArray(quizData.forcedOpts)
        ? [...quizData.forcedOpts]
        : [quizData.answer];

    // 洗牌選項並渲染到按鈕
    const shuffledOpts = calibrationShuffle(opts);
    const container = document.getElementById('quiz-options');
    container.innerHTML = "";
    document.getElementById('quiz-confirm-wrap').innerHTML = "";
    container.style.gridTemplateColumns = (quizData.displayMode === "noble") ? "1fr" : (opts.length <= 2 ? "1fr 1fr" : "");
    let selectedOption = null; // 儲存選中的選項

    shuffledOpts.forEach((o, optionIndex) => {
        const b = document.createElement('button'); 
        b.type = 'button';
        b.className = 'option-btn';
        b.setAttribute('aria-pressed', 'false');
        if (quizData.optionClass) b.classList.add(quizData.optionClass);
        else if (quizData.useChemFormat) b.classList.add('chem-opt');
        else if (quizData.displayMode === 'formula') b.classList.add('chem-opt');
        else if (quizData.displayMode === 'ion') b.classList.add('chem-opt');
        // 處理混成軌域選項的上標顯示
        let displayText = o;
        if (quizData.displayMode === "noble") {
            displayText = formatElectronConfigMath(o);
            b.style.fontSize = "0.95rem";
            b.style.letterSpacing = "0.02em";
        } else if (quizData.displayMode === "hybrid") {
            displayText = formatHybridNotationHtml(o);
        } else if (type >= 32 && type <= 39 && quizData.displayMode === 'formula') {
            displayText = formatChemLabel(formatFormula(o));
            displayText = formatCalibrationChemistryHtml(displayText);
        } else if (quizData.useChemFormat || quizData.displayMode === 'ion' || /<sub|<sup|[₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]/.test(o)) {
            displayText = formatChemLabel(o);
            displayText = formatCalibrationChemistryHtml(displayText);
        } else if (quizData.displayMode === 'symbol') {
            displayText = formatCalibrationChemistryHtml(displayText);
        }
        displayText = formatCalibrationChemistryHtml(displayText);
        b.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + optionIndex)}</span><span class="option-value">${displayText}</span><span class="option-state-mark" aria-hidden="true"></span>`;
        b.dataset.value = o; // 儲存選項值（原始值，用於比較答案）
        b.title = String(o).replace(/<[^>]*>/g, '');
        b.setAttribute('aria-label', `選項 ${String.fromCharCode(65 + optionIndex)}：${b.title}`);
        b.onclick = () => {
            // 如果已經確認過（有 nextBtn），不再允許選擇
            if (document.getElementById('quiz-confirm-wrap').querySelector('.confirm-btn.confirmed')) return;
            
            // 如果選項已被禁用，不允許選擇
            if (b.disabled) return;
            
            // 移除所有選項的選中狀態
            container.querySelectorAll('.option-btn').forEach(btn => {
                btn.classList.remove('selected');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            // 設置當前選項為選中狀態（黃光）
            b.classList.add('selected');
            b.setAttribute('aria-pressed', 'true');
            b.setAttribute('aria-label', `已選取：選項 ${String.fromCharCode(65 + optionIndex)}：${b.title}`);
            selectedOption = o;
            
            // 顯示確認按鈕（固定在 quiz-confirm-wrap，與選項數量無關）
            const confirmWrap = document.getElementById('quiz-confirm-wrap');
            let confirmBtn = confirmWrap.querySelector('.confirm-btn');
            if (!confirmBtn) {
                confirmBtn = document.createElement('button');
                confirmBtn.className = 'confirm-btn';
                confirmBtn.textContent = '校準';
                let isCalibrated = false; // 標記是否已校準
                
                confirmBtn.onclick = () => {
                    if (isCalibrated) {
                        // 只有完成第一次校準後才前進；避免快速連點造成狀態競速。
                        if (!confirmBtn.disabled) window.renderNextQuestion();
                        return;
                    }

                    // 第一次點擊：同步完成判題，讓答錯後的 NEXT 一定可用。
                    isCalibrated = true;
                    confirmBtn.disabled = true;
                    container.querySelectorAll('.option-btn').forEach(btn => { btn.disabled = true; });

                    const isCorrect = (selectedOption === quizData.answer);
                    if (feedbackEl && quizData.showExplanation) {
                        feedbackEl.innerHTML = renderCalibrationExplanation(quizData, selectedOption, isCorrect);
                        feedbackEl.style.display = 'block';
                    }

                    const selectedBtn = container.querySelector('.option-btn.selected');
                    if (selectedBtn) {
                        selectedBtn.classList.remove('selected');
                        selectedBtn.setAttribute('aria-label', `${selectedBtn.title}：${isCorrect ? '答對' : '答錯'}`);
                        if (isCorrect) {
                            selectedBtn.classList.add('correct');
                            window.quizState.correctCount++;
                        } else {
                            selectedBtn.classList.add('wrong');
                            container.querySelectorAll('.option-btn').forEach(btn => {
                                if (btn.dataset.value === quizData.answer) {
                                    setTimeout(() => {
                                        btn.classList.add('correct');
                                        btn.setAttribute('aria-label', `${btn.title}：正確答案`);
                                    }, 300);
                                }
                            });
                        }
                    }

                    setTimeout(() => {
                        confirmBtn.disabled = false;
                        confirmBtn.classList.add('confirmed');
                        confirmBtn.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
                        confirmBtn.textContent = isCorrect ? "✓ 數據正確  NEXT >" : "✕ 校準失敗  NEXT >";
                    }, 180);
                };
                confirmWrap.appendChild(confirmBtn);
            }
        };
        container.appendChild(b);
    });
    typesetCalibrationMath(container);
};

window.finishCalibration = function() {
    document.getElementById('quiz-content-area').style.display = 'none';
    document.getElementById('quiz-result-area').style.display = 'grid';
    const accuracy = Math.round((window.quizState.correctCount / window.quizState.totalQ) * 100);
    let rankName = accuracy === 100 ? "數據大師 (MASTER)" : (accuracy >= 80 ? "資深分析師 (SENIOR)" : "校準未完成 (FAILED)");
    const assessment = accuracy === 100
        ? '目前範圍的核心概念已能穩定辨識。'
        : (accuracy >= 80 ? '主要概念已建立，建議再複習少數錯題。' : '建議回到校準範圍，重新整理關鍵規則後再試一次。');
    document.getElementById('quiz-result-card').innerHTML = `
        <div class="cal-result-eyebrow">CALIBRATION REPORT</div>
        <div class="cal-result-title">校準完成</div>
        <div class="cal-result-metrics">
            <div class="cal-result-metric"><span>完成題數</span><strong>${window.quizState.totalQ}</strong></div>
            <div class="cal-result-metric"><span>答對題數</span><strong>${window.quizState.correctCount}</strong></div>
            <div class="cal-result-metric"><span>正確率</span><strong>${accuracy}%</strong></div>
        </div>
        <div class="cal-result-assessment">
            <span>能力摘要</span>
            <strong>${rankName}</strong>
            <p>${assessment}</p>
            ${window.calCategory === 'periodic'
                ? `<p>RANK ${window.quizState.rank || '-'}｜${window.quizState.periodicMode === 'challenge' ? '挑戰模式' : '標準模式'}</p>`
                : ''}
        </div>`;
    const rptRank = window.quizState.rank
        ? ` RANK ${window.quizState.rank}${window.calCategory === 'periodic' ? `｜${window.quizState.periodicMode === 'challenge' ? '挑戰模式' : '標準模式'}` : ''}`
        : '';
    document.getElementById('quiz-status-text').textContent = `REPORT:${rptRank}`;
    renderCalibrationRuler(window.quizState.totalQ, window.quizState.totalQ);
    const resultCard = document.getElementById('quiz-result-card');
    if (resultCard) {
        resultCard.setAttribute('tabindex', '-1');
        requestAnimationFrame(() => resultCard.focus({ preventScroll: true }));
    }
};

// --- 週期表參考 ---
window._periodicBuilt = false;
function buildMiniPeriodicTable() {
    if (window._periodicBuilt) return;
    window._periodicBuilt = true;
    const grid = [];
    for (let r = 0; r < 7; r++) grid[r] = new Array(18).fill(null);
    const lan = new Array(15).fill(null);
    const act = new Array(15).fill(null);

    ELECTRON_DATA.forEach(el => {
        if (el.g === "鑭系") { lan[el.z - 57] = el; return; }
        if (el.g === "錒系") { act[el.z - 89] = el; return; }
        if (el.p >= 1 && el.p <= 7 && el.iupac >= 1 && el.iupac <= 18) {
            grid[el.p - 1][el.iupac - 1] = el;
        }
    });

    function getBlock(el) {
        if (el.iupac <= 2) return 'pt-s-block';
        if (el.iupac >= 13) return 'pt-p-block';
        return 'pt-d-block';
    }
    function makeCell(el, blockCls) {
        const d = document.createElement('div');
        if (!el) { d.className = 'pt-cell pt-empty'; return d; }
        d.className = `pt-cell ${blockCls || getBlock(el)}`;
        d.innerHTML = `<span class="pt-z">${el.z}</span><span class="pt-s">${el.s}</span>`;
        d.title = `${el.z} ${el.s} ${el.cn || ''}`;
        return d;
    }

    const container = document.getElementById('mini-periodic-table');
    // 主表格第6週期(row5)和第7週期(row6)的第3族(col2)放鑭系/錒系佔位格
    // rows 1-7
    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 18; c++) {
            // 第6週期第3族：鑭系佔位
            if (r === 5 && c === 2) {
                const d = document.createElement('div');
                d.className = 'pt-cell pt-f-block pt-placeholder';
                d.innerHTML = `<span class="pt-z">57-71</span><span class="pt-s" style="font-size:clamp(0.26rem,1.3vw,0.46rem);">鑭系</span>`;
                d.title = '鑭系元素 57-71';
                container.appendChild(d);
            // 第7週期第3族：錒系佔位
            } else if (r === 6 && c === 2) {
                const d = document.createElement('div');
                d.className = 'pt-cell pt-f-block pt-placeholder';
                d.innerHTML = `<span class="pt-z">89-103</span><span class="pt-s" style="font-size:clamp(0.26rem,1.3vw,0.46rem);">錒系</span>`;
                d.title = '錒系元素 89-103';
                container.appendChild(d);
            } else {
                container.appendChild(makeCell(grid[r][c]));
            }
        }
    }
    // spacer row (縮小高度，只留一點間距)
    for (let c = 0; c < 18; c++) {
        const d = document.createElement('div');
        d.className = 'pt-cell pt-empty';
        d.style.height = '3px';
        container.appendChild(d);
    }
    // lanthanide row：col0-2 空格，col3-17 放元素
    [lan, act].forEach(data => {
        for (let c = 0; c < 3; c++) { const sp = document.createElement('div'); sp.className = 'pt-cell pt-empty'; container.appendChild(sp); }
        for (let c = 3; c < 18; c++) container.appendChild(makeCell(data[c - 3], 'pt-f-block'));
    });
}

window.togglePeriodicTable = function() {
    buildMiniPeriodicTable();
    const wrap = document.getElementById('periodic-table-wrap');
    const btn  = document.getElementById('periodic-toggle-btn');
    const open = wrap.style.display === 'none';
    wrap.style.display = open ? 'block' : 'none';
    btn.textContent = open ? '收起週期表' : '開啟週期表';
    btn.setAttribute('aria-expanded', String(open));
    if (open) initPeriodicTableGesture();
};

function initPeriodicTableGesture() {
    const wrap = document.getElementById('periodic-table-wrap');
    const table = document.getElementById('mini-periodic-table');
    if (!wrap || !table || wrap._gestureInited) return;
    wrap._gestureInited = true;

    // 鎖定初始自然高度作為顯示視窗
    requestAnimationFrame(() => {
        wrap.style.height = wrap.offsetHeight + 'px';
        table.style.position = 'absolute';
        table.style.top = '0';
        table.style.left = '0';
    });

    let scale = 1, tx = 0, ty = 0;
    let lastDist = 0, lastMidX = 0, lastMidY = 0;
    let isPinching = false, isDragging = false;
    let dragStartX = 0, dragStartY = 0, dragStartTx = 0, dragStartTy = 0;

    function applyTransform() {
        scale = Math.min(Math.max(scale, 1), 4);
        const ww = wrap.clientWidth, wh = wrap.clientHeight;
        const tw = table.offsetWidth * scale, th = table.offsetHeight * scale;
        tx = tw > ww ? Math.min(0, Math.max(tx, ww - tw)) : 0;
        ty = th > wh ? Math.min(0, Math.max(ty, wh - th)) : 0;
        table.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
    }

    function getDist(t) { return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); }
    function getMid(t, el) {
        const r = el.getBoundingClientRect();
        return { x: (t[0].clientX + t[1].clientX) / 2 - r.left, y: (t[0].clientY + t[1].clientY) / 2 - r.top };
    }

    wrap.addEventListener('touchstart', e => {
        if (e.touches.length === 2) {
            isPinching = true; isDragging = false;
            lastDist = getDist(e.touches);
            const m = getMid(e.touches, wrap);
            lastMidX = m.x; lastMidY = m.y;
            e.preventDefault();
        } else if (e.touches.length === 1) {
            isDragging = true; isPinching = false;
            dragStartX = e.touches[0].clientX;
            dragStartY = e.touches[0].clientY;
            dragStartTx = tx; dragStartTy = ty;
        }
    }, { passive: false });

    wrap.addEventListener('touchmove', e => {
        if (isPinching && e.touches.length === 2) {
            const dist = getDist(e.touches);
            const m = getMid(e.touches, wrap);
            const ratio = dist / lastDist;
            const prevScale = scale;
            scale = Math.min(Math.max(scale * ratio, 1), 4);
            const actualRatio = scale / prevScale;
            tx = m.x - actualRatio * (m.x - tx);
            ty = m.y - actualRatio * (m.y - ty);
            lastDist = dist; lastMidX = m.x; lastMidY = m.y;
            applyTransform();
            e.preventDefault();
        } else if (isDragging && e.touches.length === 1) {
            tx = dragStartTx + (e.touches[0].clientX - dragStartX);
            ty = dragStartTy + (e.touches[0].clientY - dragStartY);
            applyTransform();
            e.preventDefault();
        }
    }, { passive: false });

    wrap.addEventListener('touchend', e => {
        if (e.touches.length < 2) isPinching = false;
        if (e.touches.length === 0) isDragging = false;
    });
}

// 顯示/隱藏週期表切換按鈕（依類別決定）
function updatePeriodicToggleVisibility() {
    const bar = document.getElementById('periodic-toggle-bar');
    if (!bar) return;
    const cat = window.calCategory || 'periodic';
    bar.style.display = (cat === 'periodic') ? 'block' : 'none';
    // 換題時保持週期表開關狀態，不重置
}

// ================================================================
// 化學式校準題目引擎
// 題型 32-39 對應名稱互譯、離子與組成、化學式判讀三大選單。
// ================================================================
window.FORMULA_ENGINE = (() => {
    const DATA = () => Array.isArray(window.CHEM_FORMULA_DATA) ? window.CHEM_FORMULA_DATA : [];
    const SUBS = '₀₁₂₃₄₅₆₇₈₉';
    const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';

    function shuffle(arr) {
        const out = [...arr];
        for (let i = out.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
    }

    function unique(arr) {
        return [...new Set(arr.filter(v => v !== undefined && v !== null && String(v) !== ''))];
    }

    function toUnicodeFormula(raw) {
        return String(raw || '').replace(/\d/g, d => SUBS[Number(d)]);
    }

    function normalizeFormulaSubscripts(raw) {
        return String(raw || '').replace(/([A-Z][a-z]?|\))1(?=[A-Z(]|$)/g, '$1');
    }

    function chargeText(charge) {
        const n = Number(charge);
        if (!Number.isFinite(n) || n === 0) return '';
        const sign = n > 0 ? '⁺' : '⁻';
        const abs = Math.abs(n);
        return `${abs === 1 ? '' : SUPS[abs] || abs}${sign}`;
    }

    function formulaHtml(raw) {
        const normalized = normalizeFormulaSubscripts(raw);
        const formatted = typeof formatFormula === 'function' ? formatFormula(normalized) : toUnicodeFormula(normalized);
        return typeof formatChemLabel === 'function' ? formatChemLabel(formatted) : formatted;
    }

    function ionTextRaw(ion) {
        return `${toUnicodeFormula(ion.symbol)}${chargeText(ion.charge)}`;
    }

    function ionHtml(ion) {
        return typeof formatChemLabel === 'function' ? formatChemLabel(ionTextRaw(ion)) : ionTextRaw(ion);
    }

    function ionPair(item) {
        if (!item.ions) return '';
        return `${ionTextRaw(item.ions.cation)}、${ionTextRaw(item.ions.anion)}`;
    }

    const ION_NAMES = {
        H: '氫離子', Li: '鋰離子', Na: '鈉離子', K: '鉀離子', Mg: '鎂離子', Ca: '鈣離子',
        Sr: '鍶離子', Ba: '鋇離子', Al: '鋁離子', Zn: '鋅離子', Ag: '銀離子', Cu: '銅離子',
        Fe: '鐵離子', Sn: '錫離子', Pb: '鉛離子', Cr: '鉻離子', Mn: '錳離子', Co: '鈷離子',
        Ni: '鎳離子', NH4: '銨根', Cl: '氯離子', Br: '溴離子', I: '碘離子', F: '氟離子',
        O: '氧離子', O2: '過氧根', OH: '氫氧根', NO3: '硝酸根', NO2: '亞硝酸根',
        SO4: '硫酸根', SO3: '亞硫酸根', CO3: '碳酸根', HCO3: '碳酸氫根', PO4: '磷酸根',
        HPO4: '磷酸氫根', H2PO4: '磷酸二氫根', CH3COO: '醋酸根', C2O4: '草酸根',
        S: '硫離子', S2O3: '硫代硫酸根', CrO4: '鉻酸根', Cr2O7: '二鉻酸根',
        MnO3: '亞錳酸根', MnO4: '錳酸根', ClO: '次氯酸根', ClO2: '亞氯酸根', ClO3: '氯酸根', ClO4: '過氯酸根',
        IO3: '碘酸根'
    };

    function ionName(ion) {
        if (ion.symbol === 'MnO4') return Number(ion.charge) === -1 ? '過錳酸根' : '錳酸根';
        if (ion.symbol === 'Fe') return Number(ion.charge) === 2 ? '亞鐵離子' : '鐵離子';
        if (ion.symbol === 'Cu') return Number(ion.charge) === 1 ? '亞銅離子' : '銅離子';
        if (ion.symbol === 'Sn') return Number(ion.charge) === 2 ? '亞錫離子' : '錫離子';
        return ION_NAMES[ion.symbol] || `${ion.symbol}離子`;
    }

    function ionNamePair(item) {
        if (!item.ions) return '';
        return `${ionName(item.ions.cation)}、${ionName(item.ions.anion)}`;
    }

    function formulaStage() {
        const state = window.quizState || {};
        const deck = state.formulaStageDeck || [];
        return deck[Math.max(0, (state.currentQ || 1) - 1)] || '';
    }

    function chooseItem(type, predicate) {
        const all = DATA().filter(item => !predicate || predicate(item));
        if (!all.length) return null;
        const stage = formulaStage();
        const staged = stage ? all.filter(item => item.s === stage) : all;
        const pool = staged.length ? staged : all;
        const used = window.quizState && window.quizState.formulaUsed instanceof Set ? window.quizState.formulaUsed : new Set();
        let fresh = pool.filter(item => !used.has(`${type}|${item.f}`));
        if (!fresh.length) fresh = all.filter(item => !used.has(`${type}|${item.f}`));
        if (!fresh.length) fresh = pool;
        const item = fresh[Math.floor(Math.random() * fresh.length)];
        used.add(`${type}|${item.f}`);
        if (window.quizState) window.quizState.formulaUsed = used;
        return item;
    }

    function sameIon(a, b) {
        return !!(a && b && a.symbol === b.symbol && Number(a.charge) === Number(b.charge));
    }

    function sameIonSymbol(a, b) {
        return !!(a && b && a.symbol === b.symbol);
    }

    function relatedEntries(item) {
        return DATA()
            .filter(other => other !== item)
            .map(other => {
                let score = 0;
                if (other.g === item.g) score += 8;
                if (other.kind === item.kind) score += 2;
                if (item.ions && other.ions) {
                    if (sameIon(item.ions.cation, other.ions.cation)) score += 5;
                    if (sameIon(item.ions.anion, other.ions.anion)) score += 5;
                    // 過錳酸鉀／錳酸鉀等級序題，電荷不同但酸根骨架相同，仍應列為高品質誘答。
                    if (sameIonSymbol(item.ions.cation, other.ions.cation)) score += 4;
                    if (sameIonSymbol(item.ions.anion, other.ions.anion)) score += 4;
                }
                return { other, score };
            })
            .filter(x => x.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(x => x.other);
    }

    function alteredFormula(raw) {
        const text = String(raw || '');
        const matches = [...text.matchAll(/\d+/g)];
        if (!matches.length) return '';
        const m = matches[matches.length - 1];
        const n = Number(m[0]);
        const replacement = n <= 1 ? '2' : String(n - 1);
        return text.slice(0, m.index) + replacement + text.slice(m.index + m[0].length);
    }

    function unparenthesizedFormula(raw) {
        const text = String(raw || '');
        const result = text.replace(/\(([^()]+)\)(\d*)/g, '$1$2');
        return result === text ? '' : result;
    }

    function fourOptions(correct, candidates, strongCandidates = []) {
        const out = [];
        const add = value => {
            if (value === undefined || value === null || String(value) === '') return;
            const normalized = String(value);
            if (!out.includes(normalized)) out.push(normalized);
        };
        add(correct);
        shuffle(strongCandidates || []).forEach(add);
        shuffle(candidates || []).forEach(add);
        return shuffle(out.slice(0, 4));
    }

    function nameOptions(item) {
        const related = relatedEntries(item);
        return fourOptions(item.n, DATA().map(x => x.n), related.slice(0, 10).map(x => x.n));
    }

    function ionicPart(symbol, count) {
        if (count <= 1) return symbol;
        const polyatomic = !/^[A-Z][a-z]?$/.test(symbol);
        return polyatomic ? `(${symbol})${count}` : `${symbol}${count}`;
    }

    function ionicFormulaWithCounts(item, cationCount, anionCount) {
        if (!item.ions || cationCount < 1 || anionCount < 1) return '';
        return ionicPart(item.ions.cation.symbol, cationCount) + ionicPart(item.ions.anion.symbol, anionCount);
    }

    function ionicRatioDistractors(item) {
        if (!item.ions) return [];
        const c = item.ions.cation.count;
        const a = item.ions.anion.count;
        return [
            ionicFormulaWithCounts(item, c + 1, a),
            ionicFormulaWithCounts(item, c, a + 1),
            ionicFormulaWithCounts(item, Math.max(1, c - 1), a),
            ionicFormulaWithCounts(item, c, Math.max(1, a - 1))
        ].filter(formula => formula && formula !== item.f);
    }

    function formulaOptions(item) {
        const related = relatedEntries(item);
        const strong = ionicRatioDistractors(item).concat([
            unparenthesizedFormula(item.f),
            alteredFormula(item.f)
        ]);
        const candidates = related.map(x => x.f);
        candidates.push(unparenthesizedFormula(item.f), alteredFormula(item.f));
        candidates.push(...DATA().map(x => x.f));
        const normalizedCorrect = normalizeFormulaSubscripts(item.f);
        const normalizedCandidates = candidates.map(normalizeFormulaSubscripts);
        const normalizedStrong = strong.map(normalizeFormulaSubscripts);
        return fourOptions(normalizedCorrect, normalizedCandidates, normalizedStrong);
    }

    function numberOptions(answer, candidates) {
        const n = Number(answer);
        const nearby = [n - 2, n - 1, n + 1, n + 2, 1, 2, 3, 4, 5, 6, 8, 9, 10]
            .filter(v => v >= 1 && v !== n)
            .map(String);
        return fourOptions(String(answer), (candidates || []).map(String).concat(nearby));
    }

    function ratioOptions(answer, candidates) {
        return fourOptions(answer, (candidates || []).concat(['1:1', '1:2', '2:1', '2:3', '3:2', '3:1', '1:3', '4:1']));
    }

    function parseFormula(raw) {
        const formula = String(raw || '').replace(/\s/g, '');
        const total = {};
        const add = (dest, source, multiplier) => Object.keys(source).forEach(k => { dest[k] = (dest[k] || 0) + source[k] * multiplier; });
        const parseSegment = segment => {
            let i = 0;
            let coefficient = 1;
            const leading = segment.match(/^\d+/);
            if (leading) { coefficient = Number(leading[0]); i = leading[0].length; }
            const parseGroup = stop => {
                const counts = {};
                while (i < segment.length) {
                    if (stop && segment[i] === stop) { i++; break; }
                    if (segment[i] === '(') {
                        i++;
                        const nested = parseGroup(')');
                        const multiplierMatch = segment.slice(i).match(/^\d+/);
                        const multiplier = multiplierMatch ? Number(multiplierMatch[0]) : 1;
                        if (multiplierMatch) i += multiplierMatch[0].length;
                        add(counts, nested, multiplier);
                    } else if (/[A-Z]/.test(segment[i])) {
                        let symbol = segment[i++];
                        if (i < segment.length && /[a-z]/.test(segment[i])) symbol += segment[i++];
                        const numberMatch = segment.slice(i).match(/^\d+/);
                        const number = numberMatch ? Number(numberMatch[0]) : 1;
                        if (numberMatch) i += numberMatch[0].length;
                        counts[symbol] = (counts[symbol] || 0) + number;
                    } else {
                        i++;
                    }
                }
                return counts;
            };
            return { counts: parseGroup(''), coefficient };
        };
        formula.split(/[·.]/).forEach(segment => {
            if (!segment) return;
            const parsed = parseSegment(segment);
            add(total, parsed.counts, parsed.coefficient);
        });
        return total;
    }

    function atomForQuestion(counts) {
        const preferred = ['O', 'N', 'S', 'Cl', 'C', 'H'];
        return preferred.find(symbol => counts[symbol]) || Object.keys(counts)[0] || 'O';
    }

    function tfResult(statement, answer, explanation) {
        return {
            question: statement.replace(/<[^>]+>/g, ''),
            questionHtml: statement,
            answer,
            forcedOpts: ['是', '否'],
            displayMode: 'text',
            optionClass: 'binary-opt',
            showExplanation: true,
            correctReason: explanation,
            optionRationales: {
                [answer === '是' ? '否' : '是']: '把題幹中的名稱、離子比例或化學式判斷反向。'
            }
        };
    }

    function generateNameTF(item) {
        if (Math.random() < 0.5) {
            return tfResult(`化學式 ${formulaHtml(item.f)} 的中文名稱是「${item.n}」。`, '是', `化學式 ${formulaHtml(item.f)} 對應的名稱就是「${item.n}」。`);
        }
        const wrong = nameOptions(item).find(name => name !== item.n) || '其他物質';
        return tfResult(`化學式 ${formulaHtml(item.f)} 的中文名稱是「${wrong}」。`, '否', `正確名稱為「${item.n}」。`);
    }

    function generateIonTF(item) {
        const c = item.ions.cation;
        const a = item.ions.anion;
        if (Math.random() < 0.5) {
            return tfResult(`「${item.n}」由 ${ionHtml(c)} 與 ${ionHtml(a)} 組成，陽、陰離子個數比為 ${c.count}:${a.count}。`, '是', `其正確化學式為 ${formulaHtml(item.f)}，離子個數比為 ${c.count}:${a.count}。`);
        }
        const wrongCount = Number(c.count) + 1;
        return tfResult(`「${item.n}」中 ${ionHtml(c)} 與 ${ionHtml(a)} 的個數比為 ${wrongCount}:${a.count}。`, '否', `正確個數比為 ${c.count}:${a.count}，化學式為 ${formulaHtml(item.f)}。`);
    }

    function generateJudgeTF(item) {
        if (Math.random() < 0.5) {
            return tfResult(`「${item.n}」的正確化學式是 ${formulaHtml(item.f)}。`, '是', `「${item.n}」的化學式確為 ${formulaHtml(item.f)}。`);
        }
        const wrong = formulaOptions(item).find(formula => formula !== item.f) || alteredFormula(item.f) || item.f + '？';
        return tfResult(`「${item.n}」的正確化學式是 ${formulaHtml(wrong)}。`, '否', `正確化學式為 ${formulaHtml(item.f)}。`);
    }

    function oxidationNumberText(charge) {
        const n = Number(charge);
        return n > 0 ? `+${n}` : String(n);
    }

    function oxidationOptions(item) {
        const c = item.ions.cation;
        const related = relatedEntries(item)
            .filter(other => other.ions && other.ions.cation.symbol === c.symbol)
            .map(other => oxidationNumberText(other.ions.cation.charge));
        return fourOptions(oxidationNumberText(c.charge), ['+1', '+2', '+3', '+4', '+5', '+6', '+7'], related);
    }

    function generateOxidationQuestion(item, quizData) {
        const c = item.ions.cation;
        const answer = oxidationNumberText(c.charge);
        quizData._formulaTask = 'oxidation';
        quizData._formulaAskedIon = c;
        quizData.type = '離子與組成：變價金屬電荷反推';
        if (Math.random() < 0.5) {
            quizData.question = `化學式 ${item.f} 中的 ${c.symbol} 金屬離子，其電荷為何？`;
            quizData.questionHtml = `化學式 ${formulaHtml(item.f)} 中的 ${c.symbol} 金屬離子，其電荷為何？`;
        } else {
            quizData.question = `「${item.n}」中的 ${ionName(c)}，其電荷為何？`;
            quizData.questionHtml = quizData.question;
        }
        quizData.answer = answer;
        quizData.forcedOpts = oxidationOptions(item);
        quizData.displayMode = 'text';
    }

    function generate(type, quizData) {
        let item = null;
        switch (type) {
            case 32:
                item = chooseItem(type);
                if (!item) return false;
                quizData.type = '名稱與化學式：化學式 → 中文名稱';
                quizData.question = `化學式 ${item.f} 的中文名稱為何？`;
                quizData.questionHtml = `化學式 ${formulaHtml(item.f)} 的中文名稱為何？`;
                quizData.answer = item.n;
                quizData.forcedOpts = nameOptions(item);
                quizData.displayMode = 'text';
                break;
            case 33:
                item = chooseItem(type);
                if (!item) return false;
                quizData.type = '名稱與化學式：中文名稱 → 化學式';
                quizData.question = `中文名稱「${item.n}」的正確化學式為何？`;
                quizData.questionHtml = `中文名稱「${item.n}」的正確化學式為何？`;
                quizData.answer = normalizeFormulaSubscripts(item.f);
                quizData.forcedOpts = formulaOptions(item);
                quizData.displayMode = 'formula';
                quizData.optionClass = 'chem-opt';
                break;
            case 34: {
                item = chooseItem(type, x => !!x.ions);
                if (!item) return false;
                const c = item.ions.cation;
                const a = item.ions.anion;
                const mode = Math.random();
                if (mode < 0.4) {
                    // 主要改為中文名稱推導，不直接把電荷寫在題幹中。
                    quizData.type = '離子與組成：中文名稱 → 電中性化學式';
                    quizData.question = `「${item.n}」的化學式單位，應如何寫成電中性化學式？`;
                    quizData.questionHtml = quizData.question;
                    quizData.answer = normalizeFormulaSubscripts(item.f);
                    quizData.forcedOpts = formulaOptions(item);
                    quizData.displayMode = 'formula';
                    quizData.optionClass = 'chem-opt';
                } else if (mode < 0.75) {
                    // 考中文離子名稱與酸根辨識，保留離子組成概念但移除電荷提示。
                    quizData.type = '離子與組成：中文名稱 → 陽陰離子';
                    quizData.question = `「${item.n}」由哪一組陽、陰離子組成？`;
                    quizData.questionHtml = quizData.question;
                    quizData.answer = ionPair(item);
                    const ionCandidates = relatedEntries(item).filter(x => x.ions).map(ionPair);
                    quizData.forcedOpts = fourOptions(ionPair(item), ionCandidates, ionCandidates.slice(0, 6));
                    quizData.displayMode = 'ion';
                    quizData.optionClass = 'chem-opt';
                } else {
                    quizData.type = '離子與組成：化學式 → 離子';
                    quizData.question = `化學式 ${item.f} 由哪一組陽、陰離子組成？`;
                    quizData.questionHtml = `化學式 ${formulaHtml(item.f)} 由哪一組陽、陰離子組成？`;
                    quizData.answer = ionPair(item);
                    quizData.forcedOpts = fourOptions(ionPair(item), relatedEntries(item).filter(x => x.ions).map(ionPair));
                    quizData.displayMode = 'ion';
                    quizData.optionClass = 'chem-opt';
                }
                break;
            }
            case 35: {
                const oxidationMode = Math.random() < 0.25;
                item = chooseItem(type, oxidationMode ? x => !!x.ions && x.g === 'variable' : undefined);
                if (!item) return false;
                if (oxidationMode && item.ions) {
                    generateOxidationQuestion(item, quizData);
                } else if (item.ions && Math.random() < 0.65) {
                    const c = item.ions.cation;
                    const a = item.ions.anion;
                    if (Math.random() < 0.5) {
                        quizData._formulaTask = 'ion-count';
                        quizData._formulaAskedIon = c;
                        quizData.type = '離子與組成：指定離子數量';
                        quizData.question = `「${item.n}」的一個化學式單位中，含有幾個 ${ionTextRaw(c)}？`;
                        quizData.questionHtml = `「${item.n}」的一個化學式單位中，含有幾個 ${ionHtml(c)}？`;
                        quizData.answer = String(c.count);
                        quizData.forcedOpts = numberOptions(c.count, DATA().filter(x => x.ions).map(x => x.ions.cation.count));
                    } else {
                        quizData._formulaTask = 'ion-ratio';
                        quizData.type = '離子與組成：陽陰離子最簡個數比';
                        quizData.question = `「${item.n}」由 ${ionTextRaw(c)} 與 ${ionTextRaw(a)} 組成，陽、陰離子的最簡個數比為何？`;
                        quizData.questionHtml = `「${item.n}」由 ${ionHtml(c)} 與 ${ionHtml(a)} 組成，陽、陰離子的最簡個數比為何？`;
                        quizData.answer = `${c.count}:${a.count}`;
                        quizData.forcedOpts = ratioOptions(quizData.answer, DATA().filter(x => x.ions).map(x => `${x.ions.cation.count}:${x.ions.anion.count}`));
                    }
                } else {
                    const counts = parseFormula(item.f);
                    const atom = atomForQuestion(counts);
                    quizData._formulaTask = 'atom-count';
                    quizData._formulaAskedAtom = atom;
                    quizData.type = '離子與組成：指定元素原子數';
                    quizData.question = `「${item.n}」的一個化學式單位中含有幾個 ${atom} 原子？`;
                    quizData.questionHtml = `「${item.n}」的一個化學式單位中含有幾個 <span class="chem-element">${atom}</span> 原子？`;
                    quizData.answer = String(counts[atom]);
                    quizData.forcedOpts = numberOptions(quizData.answer, Object.values(counts));
                }
                quizData.displayMode = 'number';
                break;
            }
            case 36:
                item = chooseItem(type);
                if (!item) return false;
                quizData.type = '化學式判讀：選出正確化學式';
                quizData.question = `下列何者是「${item.n}」的正確化學式？`;
                quizData.questionHtml = `下列何者是「${item.n}」的正確化學式？`;
                quizData.answer = normalizeFormulaSubscripts(item.f);
                quizData.forcedOpts = formulaOptions(item);
                quizData.displayMode = 'formula';
                quizData.optionClass = 'chem-opt';
                break;
            case 37:
                item = chooseItem(type);
                if (!item) return false;
                quizData.type = '名稱與化學式：名稱配對是非題';
                Object.assign(quizData, generateNameTF(item));
                break;
            case 38:
                item = chooseItem(type, x => !!x.ions);
                if (!item) return false;
                quizData.type = '離子與組成：離子數量是非題';
                Object.assign(quizData, generateIonTF(item));
                break;
            case 39:
                item = chooseItem(type);
                if (!item) return false;
                quizData.type = '化學式判讀：正誤是非題';
                Object.assign(quizData, generateJudgeTF(item));
                break;
            case 50: {
                const masses = window.CALIBRATION_ATOMIC_MASSES || {};
                item = chooseItem(type, entry => {
                    const counts = parseFormula(entry.f);
                    if (!Object.keys(counts).every(symbol => Number.isFinite(masses[symbol]))) return false;
                    return Object.entries(counts).reduce((sum, [symbol, count]) => sum + masses[symbol] * count, 0) >= 12;
                });
                if (!item) return false;
                const counts = parseFormula(item.f);
                const terms = Object.entries(counts).map(([symbol, count]) => `${count > 1 ? `${count}×` : ''}${masses[symbol]}`);
                const mass = Object.entries(counts).reduce((sum, [symbol, count]) => sum + masses[symbol] * count, 0);
                const formatMass = value => String(Number(value.toFixed(2)));
                const answer = formatMass(mass);
                const wrongOptions = unique([mass + 1, mass - 1, mass + 2, mass - 2, mass * 2]
                    .map(formatMass).filter(value => value !== answer)).slice(0, 3);
                if (wrongOptions.length !== 3) return false;
                quizData.type = '式量與分子量：式量計算';
                quizData.question = `${item.f} 的式量約為多少 u？`;
                quizData.questionHtml = `${formulaHtml(item.f)} 的式量約為多少 u？`;
                quizData.answer = answer;
                quizData.forcedOpts = shuffle([answer, ...wrongOptions]);
                quizData.displayMode = 'number';
                quizData._formulaMassExplanation = true;
                quizData.correctReason = `${formulaHtml(item.f)} 中各元素原子量依序為 ${terms.join('＋')}，相加得到 ${answer} u。`;
                break;
            }
            default:
                return false;
        }
        if (item) {
            quizData._formulaItem = item;
            quizData._formulaAtomCounts = parseFormula(item.f);
        }
        return Array.isArray(quizData.forcedOpts) && quizData.forcedOpts.length >= 2;
    }

    return { generate };
})();

// ================================================================
// 知識校準：常數題目引擎
// 題型 40-45 對應常數下的六個可複選子子項目。
// ================================================================
window.KNOWLEDGE_ENGINE = (() => {
    const DATA = () => Array.isArray(window.CHEM_KNOWLEDGE_CONSTANT_DATA)
        ? window.CHEM_KNOWLEDGE_CONSTANT_DATA
        : [];
    const GROUP_LABELS = {
        particles: '粒子與莫耳',
        gas: '氣體基準',
        phase: '物性與相變',
        units: '單位與量綱',
        acidBase: '酸鹼常數',
        hydrogen: '氫原子光譜'
    };
    const TYPE_GROUP = { 40: 'particles', 41: 'gas', 42: 'phase', 43: 'units', 44: 'acidBase', 45: 'hydrogen' };

    function shuffle(arr) {
        const out = [...arr];
        for (let i = out.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
    }

    function distinct(values) {
        return [...new Set(values.filter(value => value !== undefined && value !== null && String(value).trim() !== ''))];
    }

    function formatValue(fact, raw) {
        const value = String(raw == null ? '' : raw);
        if (!fact.unit) return value;
        return `${value} ${fact.unit}`;
    }

    function conditionText(fact) {
        return fact.condition ? `（${fact.condition}）` : '';
    }

    function factReason(fact) {
        const note = String(fact.note || '').trim();
        const condition = fact.condition ? `適用條件：${fact.condition}。` : '';
        return `${note}${condition}` || '依題庫所列的化學常數與單位判定。';
    }

    function applyKnowledgeExplanation(fact, mode, answer, quizData) {
        const supplied = fact.explanation && typeof fact.explanation === 'object' ? fact.explanation : {};
        const condition = fact.condition ? `適用條件：${fact.condition}。` : '';
        const note = String(fact.note || '').trim();
        const value = String(answer || formatValue(fact, fact.value));
        let explanation;
        if (mode === 'unit' || mode === 'unit-context') {
            explanation = {
                basis: `「${fact.title}」的正確表示為 ${value}。`,
                steps: fact.id === 'u-cal-j'
                    ? 'cal 和 J 都是能量單位；先確認兩邊是否屬於同一物理量，再使用換算關係。'
                    : '先辨認題目所問的物理量，再核對單位與量綱。',
                conclusion: note
            };
        } else if (mode === 'meaning') {
            explanation = {
                basis: `數值 ${value} 對應「${fact.title}」。`,
                steps: `先核對單位${fact.unit ? `（${fact.unit}）` : ''}與數量級，再配對物理量名稱。${condition}`,
                conclusion: note
            };
        } else if (mode === 'custom') {
            explanation = {
                basis: `正確關係為 ${value}。`,
                steps: `先確認關係式兩側的物理量、單位與方向。${condition}`,
                conclusion: note
            };
        } else {
            explanation = {
                basis: `「${fact.title}」${conditionText(fact)}的教學近似值為 ${value}。`,
                steps: fact.unit ? `答案單位為 ${fact.unit}；先核對數值、單位與條件。` : '先核對數值的數量級與適用條件。',
                conclusion: note
            };
        }
        quizData.explanation = { ...explanation, ...supplied };
        quizData.correctReason = [quizData.explanation.basis, quizData.explanation.steps, quizData.explanation.conclusion]
            .filter(Boolean).join(' ');
        quizData.showExplanation = true;
    }

    function setKnowledgeOptionRationales(fact, mode, answer, options, quizData) {
        const answerKey = String(answer);
        quizData.optionRationales = {};
        options.forEach(option => {
            if (String(option) === answerKey) return;
            let reason;
            if (mode === 'unit' || mode === 'unit-context') {
                reason = `此選項不是「${fact.title}」的正確單位或表示；請重新核對單位與量綱`;
            } else if (mode === 'meaning') {
                reason = `「${option}」不對應題目給定的數值、單位或條件`;
            } else if (mode === 'custom') {
                reason = '此關係不符合題目要求的常數關係；請核對公式兩側的物理量與方向';
            } else {
                reason = `此選項的數值或單位不符合「${fact.title}」的要求；請重新核對數量級與適用條件`;
            }
            quizData.optionRationales[calibrationOptionKey(option)] = reason;
        });
    }

    function meaningOptions(fact, pool) {
        const eligible = pool.filter(item => item.kind !== 'custom' && item.id !== fact.id);
        const sameSemanticGroup = eligible.filter(item => item.semanticGroup && item.semanticGroup === fact.semanticGroup);
        const source = sameSemanticGroup.length >= 3
            ? sameSemanticGroup
            : [...sameSemanticGroup, ...eligible.filter(item => !sameSemanticGroup.includes(item))];
        const titles = distinct(source
            .map(item => item.reverseTitle || item.title));
        return shuffle(distinct([fact.reverseTitle || fact.title, ...titles])).slice(0, 4);
    }

    function buildValueQuestion(fact, quizData) {
        const answer = formatValue(fact, fact.value);
        const opts = distinct((fact.options || []).map(option => formatValue(fact, option)));
        if (opts.length < 4 || !opts.includes(answer)) return false;
        quizData.type = `常數：${GROUP_LABELS[fact.group]}｜數值辨識`;
        quizData.question = `${fact.title}${conditionText(fact)}的數值約為何？`;
        quizData.answer = answer;
        quizData.forcedOpts = shuffle(opts);
        quizData.displayMode = 'text';
        applyKnowledgeExplanation(fact, 'value', answer, quizData);
        setKnowledgeOptionRationales(fact, 'value', answer, quizData.forcedOpts, quizData);
        quizData._knowledgeFact = fact;
        quizData._knowledgeQuestionMode = 'value';
        return true;
    }

    function buildMeaningQuestion(fact, pool, quizData) {
        const opts = meaningOptions(fact, pool);
        const answer = fact.reverseTitle || fact.title;
        const value = formatValue(fact, fact.value);
        if (opts.length < 4 || !opts.includes(answer)) return false;
        quizData.type = `常數：${GROUP_LABELS[fact.group]}｜意義辨識`;
        quizData.question = `數值「${value}」${fact.condition ? `（${fact.condition}）` : ''}對應下列哪一項？`;
        quizData.answer = answer;
        quizData.forcedOpts = opts;
        quizData.displayMode = 'text';
        applyKnowledgeExplanation(fact, 'meaning', value, quizData);
        setKnowledgeOptionRationales(fact, 'meaning', answer, quizData.forcedOpts, quizData);
        quizData._knowledgeFact = fact;
        quizData._knowledgeQuestionMode = 'meaning';
        return true;
    }

    function buildUnitQuestion(fact, quizData, variant) {
        const opts = distinct(fact.options || []);
        if (opts.length < 4 || !opts.includes(fact.value)) return false;
        quizData.type = `常數：${GROUP_LABELS[fact.group]}｜單位辨識`;
        quizData.question = variant === 'context'
            ? `在化學計算中，「${fact.title}」應採用下列哪一項表示？`
            : `下列何者是「${fact.title}」的正確表示？`;
        quizData.answer = fact.value;
        quizData.forcedOpts = shuffle(opts);
        quizData.displayMode = 'text';
        const mode = variant === 'context' ? 'unit-context' : 'unit';
        applyKnowledgeExplanation(fact, mode, fact.value, quizData);
        setKnowledgeOptionRationales(fact, mode, fact.value, quizData.forcedOpts, quizData);
        quizData._knowledgeFact = fact;
        quizData._knowledgeQuestionMode = mode;
        return true;
    }

    function buildCustomQuestion(fact, quizData) {
        const opts = distinct(fact.options || []);
        if (opts.length < 4 || !opts.includes(fact.answer)) return false;
        quizData.type = `常數：${GROUP_LABELS[fact.group]}｜關係辨識`;
        quizData.question = fact.question;
        quizData.answer = fact.answer;
        quizData.forcedOpts = shuffle(opts);
        quizData.displayMode = 'text';
        applyKnowledgeExplanation(fact, 'custom', fact.answer, quizData);
        setKnowledgeOptionRationales(fact, 'custom', fact.answer, quizData.forcedOpts, quizData);
        quizData._knowledgeFact = fact;
        quizData._knowledgeQuestionMode = 'custom';
        return true;
    }

    function generate(type, quizData) {
        const group = TYPE_GROUP[type];
        if (!group) return false;
        const selected = window.knowledgeSelectedSubtypes || {};
        if (selected[group] !== true) return false;
        const tier = window.knowledgeMode === 'deep' ? 'deep' : 'common';
        const pool = DATA().filter(item => item.group === group && item.tier === tier);
        if (!pool.length) return false;
        const fact = pool[Math.floor(Math.random() * pool.length)];
        const candidates = fact.kind === 'custom'
            ? ['custom']
            : fact.kind === 'unit'
            ? ['unit', 'unit-context']
            : (fact.modes || ['value', 'meaning']).filter(mode => mode !== 'unit');
        const mode = candidates[Math.floor(Math.random() * candidates.length)];
        if (mode === 'custom') return buildCustomQuestion(fact, quizData);
        if (mode === 'meaning') {
            const meaningPool = DATA().filter(item => item.group === group && item.tier === tier && item.kind !== 'custom');
            return buildMeaningQuestion(fact, meaningPool, quizData);
        }
        if (mode === 'unit') return buildUnitQuestion(fact, quizData, 'direct');
        if (mode === 'unit-context') return buildUnitQuestion(fact, quizData, 'context');
        return buildValueQuestion(fact, quizData);
    }

    return { generate, groupLabels: GROUP_LABELS, typeGroup: TYPE_GROUP };
})();
// --- Bundled knowledge calibration data (source: calibration_knowledge_data.js) ---
// 知識校準：常數題庫。
// 所有數值皆以高中課堂可使用的近似值呈現；條件欄位是答案的一部分，避免
// 例如 1 atm／1 bar、0 °C／25 °C 或不同溫度下汽化熱混淆。
(function () {
    const facts = [];
    const add = (id, group, tier, title, value, unit, options, condition, note, extra = {}) => {
        facts.push({
            id, group, tier, kind: extra.kind || 'value', title, value, unit: unit || '',
            options: Array.isArray(options) ? options : [], condition: condition || '',
            note: note || '', explanation: extra.explanation || note || '',
            modes: extra.modes || ['value', 'meaning'],
            questionModes: extra.questionModes || extra.modes || ['value', 'meaning'],
            distractorGroup: extra.distractorGroup || `${group}:${id}`,
            semanticGroup: extra.semanticGroup || `${group}:${unit || 'concept'}`,
            unitOptions: extra.unitOptions || null, reverseTitle: extra.reverseTitle || title,
            ...extra
        });
    };
    const custom = (id, group, tier, question, answer, options, note) => {
        facts.push({ id, group, tier, kind: 'custom', question, answer, options, note: note || '',
            explanation: note || '', modes: ['custom'], questionModes: ['custom'], distractorGroup: `${group}:${id}`,
            semanticGroup: `${group}:relation` });
    };

    // 1. 粒子與莫耳 ---------------------------------------------------------
    add('p-na', 'particles', 'common', '亞佛加厥常數', '6.022×10²³', 'mol⁻¹',
        ['6.022×10²³', '6.022×10²²', '9.6485×10⁴', '1.602×10⁻¹⁹'], '', '一莫耳含有的基本粒子數。');
    add('p-e-charge', 'particles', 'common', '基本電荷量的量值', '1.602×10⁻¹⁹', 'C',
        ['1.602×10⁻¹⁹', '9.109×10⁻³¹', '6.022×10²³', '9.6485×10⁴'], '', '電子帶負號，正電子與質子帶正號。');
    add('p-e-mass', 'particles', 'common', '電子質量', '9.109×10⁻³¹', 'kg',
        ['9.109×10⁻³¹', '1.673×10⁻²⁷', '1.675×10⁻²⁷', '1.661×10⁻²⁷'], '', '電子質量遠小於核子。');
    add('p-p-mass', 'particles', 'common', '質子質量', '1.673×10⁻²⁷', 'kg',
        ['1.673×10⁻²⁷', '9.109×10⁻³¹', '1.675×10⁻²⁷', '6.645×10⁻²⁷'], '', '質子帶一個正基本電荷。');
    add('p-n-mass', 'particles', 'common', '中子質量', '1.675×10⁻²⁷', 'kg',
        ['1.675×10⁻²⁷', '1.673×10⁻²⁷', '9.109×10⁻³¹', '1.661×10⁻²⁷'], '', '中子電量為零。');
    add('p-u', 'particles', 'common', '統一原子質量單位', '1.661×10⁻²⁷', 'kg',
        ['1.661×10⁻²⁷', '9.109×10⁻³¹', '1.673×10⁻²⁷', '6.022×10²³'], '', '1 u 定義為碳-12原子質量的十二分之一。');
    add('p-faraday', 'particles', 'common', '法拉第常數', '9.6485×10⁴', 'C·mol⁻¹ e⁻',
        ['9.6485×10⁴', '8.314', '6.022×10²³', '1.602×10⁻¹⁹'], '', '一莫耳電子的電量量值。');
    add('p-e-qm', 'particles', 'common', '電子荷質比', '−1.759×10¹¹', 'C·kg⁻¹',
        ['−1.759×10¹¹', '9.58×10⁷', '−9.58×10⁷', '1.759×10⁹'], '', '電子電荷為負，常考量值與正負號。');
    add('p-mass-ratio', 'particles', 'common', '質子與電子的質量比', '1836', '倍',
        ['1836', '183.6', '18.36', '1.836×10⁵'], '', '質子約為電子的1836倍。');
    add('p-proton-qm', 'particles', 'deep', '質子荷質比', '+9.58×10⁷', 'C·kg⁻¹',
        ['+9.58×10⁷', '−1.759×10¹¹', '+4.82×10⁷', '9.58×10⁵'], '', '質子帶一個正基本電荷。');
    add('p-alpha-mass', 'particles', 'deep', 'α粒子質量', '6.645×10⁻²⁷', 'kg',
        ['6.645×10⁻²⁷', '1.673×10⁻²⁷', '3.344×10⁻²⁷', '9.109×10⁻³¹'], '', '可視為氦-4原子核。');
    add('p-alpha-charge', 'particles', 'deep', 'α粒子電量', '+3.204×10⁻¹⁹', 'C',
        ['+3.204×10⁻¹⁹', '+1.602×10⁻¹⁹', '−3.204×10⁻¹⁹', '0'], '', 'α粒子含兩個質子。');
    add('p-alpha-qm', 'particles', 'deep', 'α粒子荷質比', '+4.82×10⁷', 'C·kg⁻¹',
        ['+4.82×10⁷', '+9.58×10⁷', '−1.759×10¹¹', '+4.82×10⁹'], '', '荷質比為電量除以質量。');
    add('p-deuteron-mass', 'particles', 'deep', '氘核質量', '3.344×10⁻²⁷', 'kg',
        ['3.344×10⁻²⁷', '6.645×10⁻²⁷', '1.673×10⁻²⁷', '3.344×10⁻²⁹'], '', '氘核含一個質子與一個中子。');
    add('p-e-u', 'particles', 'deep', '電子質量（以u表示）', '5.486×10⁻⁴', 'u',
        ['5.486×10⁻⁴', '1.0073', '1.0087', '0.05486'], '', '電子質量以u表示時遠小於1。');
    add('p-p-u', 'particles', 'deep', '質子質量（以u表示）', '1.0073', 'u',
        ['1.0073', '1.0087', '0.0005486', '6.022'], '', '自由質子質量的近似值。');
    add('p-n-u', 'particles', 'deep', '中子質量（以u表示）', '1.0087', 'u',
        ['1.0087', '1.0073', '0.0005486', '2.0174'], '', '自由中子質量的近似值。');
    add('p-e-molar-mass', 'particles', 'deep', '一莫耳電子的質量', '5.49×10⁻⁴', 'g',
        ['5.49×10⁻⁴', '5.49×10⁻¹', '9.65×10⁴', '1.007'], '', '電子雖有一莫耳，總質量仍只有約0.000549 g。');
    add('p-p-molar-mass', 'particles', 'deep', '一莫耳質子的質量', '1.007', 'g',
        ['1.007', '0.000549', '1.675×10⁻²⁷', '1836'], '', '以自由質子質量近似。');
    add('p-n-molar-mass', 'particles', 'deep', '一莫耳中子的質量', '1.009', 'g',
        ['1.009', '1.007', '0.000549', '1.675×10⁻²⁷'], '', '以自由中子質量近似。');
    custom('p-f-relation', 'particles', 'deep', '下列哪個關係可用來由基本電荷量與亞佛加厥常數得到法拉第常數？', 'F=N_Ae',
        ['F=N_Ae', 'F=N_A/e', 'F=e/N_A', 'F=R/N_A'], '法拉第常數等於一莫耳所含電子數乘上單一電子電量的量值。');

    // 2. 氣體基準 -----------------------------------------------------------
    const gasTemps = [
        ['g-0k', '0 °C換算的絕對溫度', '273', 'K', ['273', '298', '300', '373'], '攝氏溫度加273。'],
        ['g-25k', '25 °C換算的絕對溫度', '298', 'K', ['298', '273', '300', '325'], '高中常用近似值。'],
        ['g-27k', '27 °C換算的絕對溫度', '300', 'K', ['300', '273', '298', '400'], '27 °C常用來形成整數絕對溫度。'],
        ['g-100k', '100 °C換算的絕對溫度', '373', 'K', ['373', '273', '298', '400'], '高中常用近似值。'],
        ['g-127k', '127 °C換算的絕對溫度', '400', 'K', ['400', '300', '373', '500'], '127 °C常用來形成400 K。'],
        ['g-227k', '227 °C換算的絕對溫度', '500', 'K', ['500', '400', '473', '546'], '227 °C常用來形成500 K。'],
        ['g-273k', '273 °C換算的絕對溫度', '546', 'K', ['546', '500', '573', '273'], '273 °C約為546 K。']
    ];
    gasTemps.forEach(x => add(x[0], 'gas', 'common', x[1], x[2], x[3], x[4], '', x[5]));
    add('g-vm0', 'gas', 'common', '1 atm、0 °C下理想氣體莫耳體積', '22.4', 'L·mol⁻¹',
        ['22.4', '24.5', '24.6', '32.8'], '1 atm、0 °C', '高中標準狀況的常用近似值。');
    add('g-vm25', 'gas', 'common', '1 atm、25 °C下理想氣體莫耳體積', '24.5', 'L·mol⁻¹',
        ['24.5', '22.4', '24.6', '30.6'], '1 atm、25 °C', '室溫附近的常用近似值。');
    add('g-vm27', 'gas', 'common', '1 atm、27 °C下理想氣體莫耳體積', '24.6', 'L·mol⁻¹',
        ['24.6', '22.4', '24.5', '32.8'], '1 atm、27 °C', '由莫耳體積與絕對溫度成正比得到。');
    add('g-vm100', 'gas', 'common', '1 atm、100 °C下理想氣體莫耳體積', '30.6', 'L·mol⁻¹',
        ['30.6', '22.4', '24.5', '32.8'], '1 atm、100 °C', '由理想氣體關係估算。');
    add('g-vm127', 'gas', 'common', '1 atm、127 °C下理想氣體莫耳體積', '32.8', 'L·mol⁻¹',
        ['32.8', '24.6', '30.6', '41.0'], '1 atm、127 °C', '400 K下的理想氣體莫耳體積。');
    add('g-vm227', 'gas', 'common', '1 atm、227 °C下理想氣體莫耳體積', '41.0', 'L·mol⁻¹',
        ['41.0', '32.8', '44.8', '24.5'], '1 atm、227 °C', '500 K下的理想氣體莫耳體積。');
    add('g-vm273', 'gas', 'common', '1 atm、273 °C下理想氣體莫耳體積', '44.8', 'L·mol⁻¹',
        ['44.8', '41.0', '32.8', '22.4'], '1 atm、273 °C', '約為0 °C時的兩倍。');
    add('g-r-si', 'gas', 'common', '氣體常數R的SI形式', '8.314', 'J·mol⁻¹·K⁻¹',
        ['8.314', '0.08206', '62.36', '1.987'], '', '與能量單位J搭配。');
    add('g-r-atm', 'gas', 'common', '氣體常數R的L·atm形式', '0.08206', 'L·atm·mol⁻¹·K⁻¹',
        ['0.08206', '8.314', '62.36', '101.325'], '', '與壓力atm、體積L搭配。');
    add('g-r-kpa', 'gas', 'deep', '氣體常數R的L·kPa形式', '8.314', 'L·kPa·mol⁻¹·K⁻¹',
        ['8.314', '0.08206', '62.36', '1.987'], '', '因為1 kPa·L=1 J。');
    add('g-r-torr', 'gas', 'deep', '氣體常數R的L·torr形式', '62.36', 'L·torr·mol⁻¹·K⁻¹',
        ['62.36', '8.314', '0.08206', '760'], '', '壓力以torr或mmHg表示時使用。');
    add('g-r-cal', 'gas', 'deep', '氣體常數R的cal形式', '1.987', 'cal·mol⁻¹·K⁻¹',
        ['1.987', '8.314', '0.08206', '4.184'], '', '與卡路里能量單位搭配。');
    add('g-atm', 'gas', 'deep', '1 atm的壓力值', '101.325', 'kPa',
        ['101.325', '100.000', '760', '8.314'], '壓力單位換算', '1 atm=101.325 kPa=760 torr。');
    add('g-bar', 'gas', 'deep', '1 bar的壓力值', '100', 'kPa',
        ['100', '101.325', '760', '1.01325'], '壓力單位換算', '1 bar=100 kPa，與1 atm不同。');
    add('g-vm0bar', 'gas', 'deep', '1 bar、0 °C下理想氣體莫耳體積', '22.71', 'L·mol⁻¹',
        ['22.71', '22.40', '24.79', '24.50'], '1 bar、0 °C', '採1 bar而非1 atm。');
    add('g-vm25bar', 'gas', 'deep', '1 bar、25 °C下理想氣體莫耳體積', '24.79', 'L·mol⁻¹',
        ['24.79', '24.50', '22.71', '25.00'], '1 bar、25 °C', '採1 bar而非1 atm。');
    add('g-r-j-deep', 'gas', 'deep', '氣體常數R的SI形式', '8.314', 'J·mol⁻¹·K⁻¹',
        ['8.314', '0.08206', '62.36', '1.987'], '', '與L·kPa形式數值相同，但單位不同。');
    add('g-atm-torr', 'gas', 'deep', '一標準大氣壓的torr表示', '760', 'torr',
        ['760', '101.325', '100', '7.60'], '1 atm', '1 atm=760 torr。');
    add('g-bar-pa', 'gas', 'deep', '一bar的帕斯卡表示', '1.00×10⁵', 'Pa',
        ['1.00×10⁵', '1.01325×10⁵', '100', '760'], '1 bar', '1 bar=100 kPa。');

    // 3. 物性與相變 ---------------------------------------------------------
    const phase = (id, title, value, unit, opts, condition, note, tier = 'common') =>
        add(id, 'phase', tier, title, value, unit, opts, condition, note, { modes: ['value', 'meaning'] });
    phase('ph-water-mp', '水的熔點', '0', '°C', ['0', '−78.5', '16.6', '100'], '1 atm', '冰與液態水的相變溫度。');
    phase('ph-water-bp', '水的沸點', '100', '°C', ['100', '0', '78.4', '56.1'], '1 atm', '液態水與水蒸氣的相變溫度。');
    phase('ph-methanol-bp', '甲醇的正常沸點', '64.7', '°C', ['64.7', '78.4', '56.1', '118.1'], '1 atm', '常見有機溶劑物性。');
    phase('ph-ethanol-mp', '乙醇的熔點', '−114.1', '°C', ['−114.1', '−97.6', '−78.5', '−38.8'], '1 atm', '乙醇在室溫下為液體。');
    phase('ph-ethanol-bp', '乙醇的正常沸點', '78.4', '°C', ['78.4', '64.7', '56.1', '100'], '1 atm', '常見酒精的主要物性。');
    phase('ph-acetone-bp', '丙酮的正常沸點', '56.1', '°C', ['56.1', '64.7', '78.4', '118.1'], '1 atm', '丙酮比乙醇更易揮發。');
    phase('ph-acetic-mp', '醋酸的熔點', '16.6', '°C', ['16.6', '0', '−16.6', '78.4'], '1 atm', '純醋酸在低於此溫度時凝固。');
    phase('ph-acetic-bp', '醋酸的正常沸點', '118.1', '°C', ['118.1', '100', '78.4', '56.1'], '1 atm', '醋酸沸點高於水。');
    phase('ph-bromine-bp', '溴的正常沸點', '58.8', '°C', ['58.8', '−7.2', '78.4', '184.3'], '1 atm', '溴在室溫下為液體。');
    phase('ph-bromine-mp', '溴的熔點', '−7.2', '°C', ['−7.2', '−38.8', '5.5', '16.6'], '1 atm', '常溫下溴不為固體。');
    phase('ph-iodine-mp', '碘的熔點', '113.7', '°C', ['113.7', '184.3', '80.2', '78.4'], '1 atm', '碘在常溫下為固體。');
    phase('ph-iodine-bp', '碘的正常沸點', '184.3', '°C', ['184.3', '113.7', '100', '218'], '1 atm', '可與昇華現象辨析。');
    phase('ph-mercury-mp', '汞的熔點', '−38.8', '°C', ['−38.8', '−7.2', '−114.1', '0'], '1 atm', '汞在室溫下為液體金屬。');
    phase('ph-mercury-bp', '汞的沸點', '356.7', '°C', ['356.7', '100', '184.3', '444.7'], '1 atm', '常見液態金屬物性。');
    phase('ph-dryice', '乾冰在1 atm下的昇華溫度', '−78.5', '°C', ['−78.5', '0', '−196', '−183'], '1 atm', '1 atm下不經液態直接昇華。');
    phase('ph-n2-bp', '液態氮的正常沸點', '−196', '°C', ['−196', '−183', '−253', '−78.5'], '1 atm', '低溫液體的常見基準。');
    phase('ph-o2-bp', '液態氧的正常沸點', '−183', '°C', ['−183', '−196', '−253', '−78.5'], '1 atm', '低溫液體的常見基準。');
    add('ph-water-fusion-mol', 'phase', 'common', '水的莫耳熔化熱', '6.01', 'kJ·mol⁻¹',
        ['6.01', '40.7', '44.0', '333'], '0 °C附近', '熔化一莫耳冰所需熱量。');
    add('ph-water-fusion-mass', 'phase', 'common', '水的質量熔化熱', '333', 'J·g⁻¹',
        ['333', '2257', '4.18', '40.7'], '0 °C附近', '與6.01 kJ/mol互相換算。');
    add('ph-water-vap-mol', 'phase', 'common', '水在100 °C的莫耳汽化熱', '40.7', 'kJ·mol⁻¹',
        ['40.7', '6.01', '44.0', '2257'], '100 °C、1 atm', '沸點汽化熱。');
    add('ph-water-vap-mass', 'phase', 'common', '水在100 °C的質量汽化熱', '2257', 'J·g⁻¹',
        ['2257', '333', '4.18', '40.7'], '100 °C、1 atm', '與40.7 kJ/mol互相換算。');
    add('ph-water-cp', 'phase', 'common', '液態水的比熱', '4.18', 'J·g⁻¹·K⁻¹',
        ['4.18', '2.09', '2.01', '333'], '室溫附近', '常用於q=mcΔT。');
    add('ph-water-density', 'phase', 'common', '水的密度', '1.00', 'g·mL⁻¹',
        ['1.00', '0.997', '4.18', '18.0'], '室溫附近', '近似換算mL與g。');
    phase('ph-ice-cp', '冰的比熱', '2.09', 'J·g⁻¹·K⁻¹', ['2.09', '4.18', '2.01', '333'], '0 °C附近', '深度相變題會用到。', 'deep');
    phase('ph-steam-cp', '水蒸氣的比熱', '2.01', 'J·g⁻¹·K⁻¹', ['2.01', '2.09', '4.18', '2257'], '100 °C附近', '深度相變題會用到。', 'deep');
    phase('ph-water-vap25', '水在25 °C的莫耳汽化熱', '44.0', 'kJ·mol⁻¹', ['44.0', '40.7', '6.01', '2257'], '25 °C附近', '汽化熱會隨溫度改變。', 'deep');
    phase('ph-triple-t', '水的三相點溫度', '273.16', 'K', ['273.16', '273.15', '373.15', '647.10'], '三相點', '固、液、氣三相共存。', 'deep');
    phase('ph-triple-p', '水的三相點壓力', '611', 'Pa', ['611', '101325', '2206000', '0.0061'], '三相點', '約611 Pa。', 'deep');
    phase('ph-critical-t', '水的臨界溫度', '647', 'K', ['647', '373', '273', '400'], '臨界點', '高於此溫度無法只靠加壓液化。', 'deep');
    phase('ph-critical-p', '水的臨界壓力', '22.06', 'MPa', ['22.06', '0.611', '101.325', '220.6'], '臨界點', '約22.06 MPa。', 'deep');
    phase('ph-benzene-mp', '苯的熔點', '5.5', '°C', ['5.5', '80.1', '16.6', '−5.5'], '1 atm', '深度物性辨識。', 'deep');
    phase('ph-benzene-bp', '苯的正常沸點', '80.1', '°C', ['80.1', '78.4', '56.1', '100'], '1 atm', '深度物性辨識。', 'deep');
    phase('ph-naphthalene-mp', '萘的熔點', '80.2', '°C', ['80.2', '5.5', '113.7', '218'], '1 atm', '常見有機固體物性。', 'deep');
    phase('ph-nacl-mp', '氯化鈉的熔點', '801', '°C', ['801', '100', '444.7', '1465'], '1 atm', '離子晶體物性。', 'deep');
    phase('ph-sulfur-mp', '硫的熔點', '115', '°C', ['115', '113.7', '80.2', '444.7'], '1 atm', '常見非金屬物性。', 'deep');

    // 4. 單位與量綱 ---------------------------------------------------------
    const unit = (id, tier, title, answer, options, note, extra = {}) => add(id, 'units', tier, title, answer, '', options, '', note, {
        kind: 'unit', modes: ['unit', 'unit-context'], unitOptions: options, ...extra
    });
    unit('u-specific-heat', 'common', '比熱的常用單位', 'J·g⁻¹·K⁻¹', ['J·g⁻¹·K⁻¹', 'J·mol⁻¹·K⁻¹', 'kJ·mol⁻¹', 'mol·L⁻¹'], 'q=mcΔT中的c。');
    unit('u-molar-heat', 'common', '莫耳熱容量的常用單位', 'J·mol⁻¹·K⁻¹', ['J·mol⁻¹·K⁻¹', 'J·g⁻¹·K⁻¹', 'kJ·mol⁻¹', 'mol·kg⁻¹'], '以一莫耳物質為基準。');
    unit('u-enthalpy', 'common', '莫耳反應熱的常用單位', 'kJ·mol⁻¹', ['kJ·mol⁻¹', 'J·g⁻¹·K⁻¹', 'mol·L⁻¹', 'J·mol⁻¹·K⁻¹'], '反應熱常以每莫耳反應表示。');
    unit('u-molarity', 'common', '莫耳濃度的常用單位', 'mol·L⁻¹', ['mol·L⁻¹', 'mol·kg⁻¹', 'g·mL⁻¹', 'L·mol⁻¹'], '溶質莫耳數除以溶液體積。');
    unit('u-molality', 'common', '重量莫耳濃度的常用單位', 'mol·kg⁻¹', ['mol·kg⁻¹', 'mol·L⁻¹', 'g·mL⁻¹', 'kg·mol⁻¹'], '溶質莫耳數除以溶劑質量。');
    unit('u-density', 'common', '密度的常用化學單位', 'g·mL⁻¹', ['g·mL⁻¹', 'mol·L⁻¹', 'J·g⁻¹·K⁻¹', 'g·mol⁻¹'], '也常見kg·L⁻¹。');
    unit('u-rate', 'common', '溶液反應速率的常用單位', 'mol·L⁻¹·s⁻¹', ['mol·L⁻¹·s⁻¹', 'mol·kg⁻¹', 'L·mol⁻¹·s⁻¹', 'kJ·mol⁻¹'], '濃度變化除以時間。');
    unit('u-cal-j', 'common', '卡與焦耳的換算', '1 cal=4.184 J', ['1 cal=4.184 J', '1 cal=0.4184 J', '1 cal=41.84 J', '1 cal=101.325 J'], 'cal與J都是能量單位；熱化學中使用1 cal=4.184 J。', { semanticGroup: 'units:energy-conversion' });
    unit('u-kpal', 'common', '壓力、體積與能量的換算', '1 kPa·L=1 J', ['1 kPa·L=1 J', '1 kPa·L=0.001 J', '1 kPa·L=101.325 J', '1 kPa·L=1 cal'], '由Pa·m³=J得到。');
    unit('u-latm', 'common', 'L·atm與焦耳的換算', '1 L·atm=101.325 J', ['1 L·atm=101.325 J', '1 L·atm=1 J', '1 L·atm=760 J', '1 L·atm=4.184 J'], '理想氣體與熱力學常見換算。');
    unit('u-pa', 'common', '帕斯卡的基本單位', 'N·m⁻²', ['N·m⁻²', 'J·s⁻¹', 'C·s⁻¹', 'J·C⁻¹'], 'Pa=N/m²。');
    unit('u-coulomb', 'common', '庫侖的基本單位', 'A·s', ['A·s', 'J·C⁻¹', 'N·m⁻²', 'J·s⁻¹'], 'C=A·s。');
    unit('u-watt', 'common', '瓦特的基本關係', 'J·s⁻¹', ['J·s⁻¹', 'N·m⁻²', 'C·s⁻¹', 'J·C⁻¹'], 'W=J/s。');
    unit('u-volt', 'common', '伏特的基本關係', 'J·C⁻¹', ['J·C⁻¹', 'J·s⁻¹', 'A·s', 'N·m⁻²'], 'V=J/C。');
    unit('u-ev', 'deep', '電子伏特的能量換算', '1.602×10⁻¹⁹ J', ['1.602×10⁻¹⁹ J', '9.6485×10⁴ J', '1.602×10⁻¹⁹ C', '6.626×10⁻³⁴ J'], '一個電子伏特是單一基本電荷通過1 V的能量。');
    unit('u-ev-mol', 'deep', '電子伏特與莫耳能量的換算', '1 eV/粒子≈96.485 kJ·mol⁻¹', ['1 eV/粒子≈96.485 kJ·mol⁻¹', '1 eV/粒子≈9.6485 kJ·mol⁻¹', '1 eV/粒子≈1.602 kJ·mol⁻¹', '1 eV/粒子≈1312 kJ·mol⁻¹'], '用亞佛加厥常數換算。');
    unit('u-angstrom', 'deep', '埃的長度換算', '1 Å=10⁻¹⁰ m', ['1 Å=10⁻¹⁰ m', '1 Å=10⁻⁹ m', '1 Å=10⁻¹² m', '1 Å=10⁻⁸ m'], '原子與鍵長常見單位。');
    unit('u-nm-a', 'deep', '奈米與埃的換算', '1 nm=10 Å', ['1 nm=10 Å', '1 nm=100 Å', '1 nm=0.1 Å', '1 nm=10⁻¹⁰ Å'], '光譜波長與原子尺度常見換算。');
    unit('u-wavenumber', 'deep', '光譜波數的常用單位', 'cm⁻¹', ['cm⁻¹', 'nm⁻¹', 's⁻¹', 'J·mol⁻¹'], '紅外光譜常以波數表示。');
    unit('u-dipole', 'deep', '偶極矩的常用非SI單位', 'D（Debye）', ['D（Debye）', 'Pa', 'Wb', 'mol·L⁻¹'], '分子極性常見單位。');
    unit('u-capacitance', 'deep', '電容的SI單位', 'F（farad）', ['F（farad）', 'C·mol⁻¹', 'S（siemens）', 'Ω（ohm）'], 'F=C/V，與法拉第常數的符號需辨析。');
    unit('u-conductance', 'deep', '電導的SI單位', 'S（siemens）', ['S（siemens）', 'F（farad）', 'Ω（ohm）', 'V（volt）'], 'S=Ω⁻¹。');
    unit('u-hc', 'deep', '光子常數hc的常用形式', '1240 eV·nm', ['1240 eV·nm', '96.485 kJ·mol⁻¹', '8.314 L·kPa·mol⁻¹·K⁻¹', '22.4 L·mol⁻¹'], '方便由波長直接估算光子能量。');
    unit('u-molar-volume', 'deep', '氣體莫耳體積的單位', 'L·mol⁻¹', ['L·mol⁻¹', 'mol·L⁻¹', 'L·atm', 'L·kPa·mol⁻¹·K⁻¹'], '理想氣體題常以每莫耳體積表示。');
    unit('u-charge-mass', 'deep', '荷質比的單位', 'C·kg⁻¹', ['C·kg⁻¹', 'C·mol⁻¹', 'kg·C⁻¹', 'J·C⁻¹'], '電荷除以質量的量綱。');

    // 5. 酸鹼常數 -----------------------------------------------------------
    const acid = (id, tier, title, value, opts, note) => add(id, 'acidBase', tier, title, value, '', opts, '25 °C附近', note, {
        modes: ['value', 'meaning'], unitOptions: ['Ka', 'Kb', 'pKa', 'pKb']
    });
    acid('a-kw', 'common', '水的離子積 Kw', '1.0×10⁻¹⁴', ['1.0×10⁻¹⁴', '1.0×10⁻⁷', '1.0×10⁻¹⁰', '1.0×10⁻²'], '25 °C時。');
    acid('a-acetic-ka', 'common', '醋酸的 Ka', '1.8×10⁻⁵', ['1.8×10⁻⁵', '5.6×10⁻¹⁰', '6.8×10⁻⁴', '1.8×10⁻⁴'], '弱酸常用基準。');
    acid('a-ammonia-kb', 'common', '氨的 Kb', '1.8×10⁻⁵', ['1.8×10⁻⁵', '5.6×10⁻¹⁰', '1.8×10⁻⁴', '6.8×10⁻⁴'], '弱鹼常用基準。');
    acid('a-ammonium-ka', 'common', '銨根的 Ka', '5.6×10⁻¹⁰', ['5.6×10⁻¹⁰', '1.8×10⁻⁵', '1.0×10⁻¹⁴', '5.6×10⁻⁵'], '與氨的Kb互為共軛關係。');
    acid('a-hf-ka', 'common', '氫氟酸的 Ka', '6.8×10⁻⁴', ['6.8×10⁻⁴', '1.8×10⁻⁵', '4.3×10⁻⁷', '5.0×10⁻¹⁰'], '弱酸但比醋酸強。');
    acid('a-hcn-ka', 'common', '氫氰酸的 Ka', '5.0×10⁻¹⁰', ['5.0×10⁻¹⁰', '5.6×10⁻¹⁰', '6.8×10⁻⁴', '4.3×10⁻⁷'], '弱酸數值辨析。');
    acid('a-hclo-ka', 'common', '次氯酸的 Ka', '3.0×10⁻⁸', ['3.0×10⁻⁸', '3.0×10⁻⁴', '1.8×10⁻⁵', '5.0×10⁻¹⁰'], '含氧酸常用弱酸。');
    acid('a-carbonic-1', 'common', '碳酸第一階 Ka', '4.3×10⁻⁷', ['4.3×10⁻⁷', '4.7×10⁻¹¹', '7.1×10⁻³', '6.3×10⁻⁸'], '碳酸的第一階解離。');
    acid('a-carbonic-2', 'common', '碳酸第二階 Ka', '4.7×10⁻¹¹', ['4.7×10⁻¹¹', '4.3×10⁻⁷', '4.2×10⁻¹³', '5.0×10⁻¹⁰'], '碳酸的第二階解離。');
    acid('a-phosphoric-1', 'common', '磷酸第一階 Ka', '7.1×10⁻³', ['7.1×10⁻³', '6.3×10⁻⁸', '4.2×10⁻¹³', '4.3×10⁻⁷'], '磷酸第一階解離。');
    acid('a-phosphoric-2', 'common', '磷酸第二階 Ka', '6.3×10⁻⁸', ['6.3×10⁻⁸', '7.1×10⁻³', '4.2×10⁻¹³', '4.7×10⁻¹¹'], '磷酸第二階解離。');
    acid('a-phosphoric-3', 'common', '磷酸第三階 Ka', '4.2×10⁻¹³', ['4.2×10⁻¹³', '6.3×10⁻⁸', '7.1×10⁻³', '5.0×10⁻¹⁰'], '磷酸第三階解離。');
    custom('a-kakb', 'acidBase', 'common', '對共軛酸鹼對而言，下列哪個關係正確？', 'KₐKᵦ=K𝑤',
        ['KₐKᵦ=K𝑤', 'Kₐ+Kᵦ=K𝑤', 'Kₐ/Kᵦ=K𝑤', 'KₐKᵦ=1/K𝑤'], '25 °C附近適用。');
    acid('a-formic-ka', 'deep', '甲酸的 Ka', '1.8×10⁻⁴', ['1.8×10⁻⁴', '1.8×10⁻⁵', '6.3×10⁻⁵', '1.3×10⁻⁵'], '比醋酸強一個數量級。');
    acid('a-propionic-ka', 'deep', '丙酸的 Ka', '1.3×10⁻⁵', ['1.3×10⁻⁵', '1.8×10⁻⁴', '6.3×10⁻⁵', '4.0×10⁻⁴'], '羧酸強度比較。');
    acid('a-benzoic-ka', 'deep', '苯甲酸的 Ka', '6.3×10⁻⁵', ['6.3×10⁻⁵', '1.8×10⁻⁴', '1.3×10⁻⁵', '1.0×10⁻¹⁰'], '芳香族弱酸基準。');
    acid('a-nitrous-ka', 'deep', '亞硝酸的 Ka', '4.0×10⁻⁴', ['4.0×10⁻⁴', '3.0×10⁻⁸', '6.3×10⁻⁵', '4.2×10⁻¹³'], '含氧酸強度比較。');
    acid('a-oxalic-1', 'deep', '草酸第一階 Ka', '5.9×10⁻²', ['5.9×10⁻²', '6.4×10⁻⁵', '7.4×10⁻⁴', '1.8×10⁻⁴'], '二元酸第一階解離。');
    acid('a-oxalic-2', 'deep', '草酸第二階 Ka', '6.4×10⁻⁵', ['6.4×10⁻⁵', '5.9×10⁻²', '6.3×10⁻⁵', '4.2×10⁻¹³'], '二元酸第二階解離。');
    acid('a-phenol-ka', 'deep', '苯酚的 Ka', '1.0×10⁻¹⁰', ['1.0×10⁻¹⁰', '6.3×10⁻⁵', '3.0×10⁻⁸', '1.8×10⁻⁵'], '弱酸強度辨析。');
    acid('a-h2o2-ka', 'deep', '過氧化氫的 Ka', '2.4×10⁻¹²', ['2.4×10⁻¹²', '2.4×10⁻⁷', '1.0×10⁻¹⁰', '4.7×10⁻¹¹'], '過氧化氫的酸性很弱。');
    acid('a-methylamine-kb', 'deep', '甲胺的 Kb', '4.4×10⁻⁴', ['4.4×10⁻⁴', '1.8×10⁻⁵', '1.7×10⁻⁹', '5.6×10⁻¹⁰'], '弱鹼數值比較。');
    acid('a-pyridine-kb', 'deep', '吡啶的 Kb', '1.7×10⁻⁹', ['1.7×10⁻⁹', '4.4×10⁻⁴', '1.8×10⁻⁵', '1.0×10⁻¹⁰'], '有機弱鹼數值。');

    // 6. 氫原子光譜 ---------------------------------------------------------
    const spectrum = (id, tier, title, value, unit, opts, condition, note) =>
        add(id, 'hydrogen', tier, title, value, unit, opts, condition, note, { modes: ['value', 'meaning'] });
    spectrum('h-c', 'common', '真空中光速', '2.998×10⁸', 'm·s⁻¹', ['2.998×10⁸', '3.00×10⁶', '6.626×10⁻³⁴', '1.097×10⁷'], '', '光子關係式中的c。');
    spectrum('h-planck', 'common', '普朗克常數', '6.626×10⁻³⁴', 'J·s', ['6.626×10⁻³⁴', '2.998×10⁸', '1.602×10⁻¹⁹', '1.097×10⁷'], '', 'E=hν。');
    spectrum('h-rydberg', 'common', '里德伯常數', '1.097×10⁷', 'm⁻¹', ['1.097×10⁷', '1.097×10⁵', '2.998×10⁸', '6.626×10⁻³⁴'], '', '氫原子光譜波長公式中的常數。');
    spectrum('h-ground-energy', 'common', '氫原子基態能量', '−13.6', 'eV', ['−13.6', '−3.40', '−1.51', '+13.6'], 'n=1', '波耳能階公式。');
    spectrum('h-n2-energy', 'common', '氫原子第二能階能量', '−3.40', 'eV', ['−3.40', '−13.6', '−1.51', '−0.850'], 'n=2', '波耳能階公式。');
    spectrum('h-n3-energy', 'common', '氫原子第三能階能量', '−1.51', 'eV', ['−1.51', '−3.40', '−13.6', '−0.850'], 'n=3', '波耳能階公式。');
    spectrum('h-n4-energy', 'common', '氫原子第四能階能量', '−0.850', 'eV', ['−0.850', '−1.51', '−3.40', '−13.6'], 'n=4', '波耳能階公式。');
    spectrum('h-ionization-ev', 'common', '氫原子基態游離能', '13.6', 'eV·atom⁻¹', ['13.6', '10.2', '1.89', '3.40'], 'n=1→∞', '由基態移至游離狀態。');
    spectrum('h-ionization-mol', 'common', '氫原子基態游離能', '1312', 'kJ·mol⁻¹', ['1312', '96.485', '10.2', '218'], 'n=1→∞', '13.6 eV/atom的莫耳形式。');
    spectrum('h-lyman-alpha-e', 'common', '來曼系第一條能量差', '10.2', 'eV', ['10.2', '1.89', '12.1', '3.40'], 'n=2→1', '紫外光。');
    spectrum('h-lyman-alpha-l', 'common', '來曼系第一條波長', '121.6', 'nm', ['121.6', '656.3', '486.1', '91.2'], 'n=2→1', '紫外光。');
    spectrum('h-lyman-alpha-f', 'common', '來曼系第一條頻率', '2.47×10¹⁵', 'Hz', ['2.47×10¹⁵', '4.57×10¹⁴', '2.47×10¹³', '1.10×10⁷'], 'n=2→1', '由E=hν得到。');
    spectrum('h-balmer-alpha-e', 'common', '巴耳末系第一條能量差', '1.89', 'eV', ['1.89', '10.2', '3.40', '0.661'], 'n=3→2', '可見光。');
    spectrum('h-balmer-alpha-l', 'common', '巴耳末系第一條波長', '656.3', 'nm', ['656.3', '121.6', '486.1', '1875'], 'n=3→2', 'Hα，可見紅光。');
    spectrum('h-balmer-alpha-f', 'common', '巴耳末系第一條頻率', '4.57×10¹⁴', 'Hz', ['4.57×10¹⁴', '2.47×10¹⁵', '4.57×10¹²', '1.10×10⁷'], 'n=3→2', '由E=hν得到。');
    custom('h-bohr-formula', 'hydrogen', 'common', '下列哪個是氫原子波耳能階的正確表示式？', 'Eₙ=−13.6/n² eV',
        ['Eₙ=−13.6/n² eV', 'Eₙ=−13.6n² eV', 'Eₙ=+13.6/n² eV', 'Eₙ=−13.6/n eV'], 'n越大，能量越接近0。');
    spectrum('h-lyman-limit', 'deep', '來曼系極限波長', '91.2', 'nm', ['91.2', '121.6', '364.6', '820.4'], 'n=∞→1', '氫原子系列極限。');
    spectrum('h-balmer-limit', 'deep', '巴耳末系極限波長', '364.6', 'nm', ['364.6', '91.2', '656.3', '1875'], 'n=∞→2', '氫原子系列極限。');
    spectrum('h-paschen-alpha', 'deep', '帕申系第一條波長', '1875', 'nm', ['1875', '656.3', '121.6', '486.1'], 'n=4→3', '紅外光。');
    spectrum('h-lyman-beta', 'deep', '來曼系第二條波長', '102.6', 'nm', ['102.6', '121.6', '97.3', '486.1'], 'n=3→1', '紫外光。');
    spectrum('h-balmer-beta', 'deep', '巴耳末系第二條波長', '486.1', 'nm', ['486.1', '656.3', '434.0', '364.6'], 'n=4→2', 'Hβ，可見藍綠光。');
    spectrum('h-balmer-gamma', 'deep', '巴耳末系第三條波長', '434.0', 'nm', ['434.0', '486.1', '410.2', '656.3'], 'n=5→2', 'Hγ，可見光。');
    spectrum('h-balmer-delta', 'deep', '巴耳末系第四條波長', '410.2', 'nm', ['410.2', '434.0', '486.1', '364.6'], 'n=6→2', 'Hδ，可見紫光。');
    spectrum('h-paschen-beta', 'deep', '帕申系第二條波長', '1282', 'nm', ['1282', '1875', '1094', '102.6'], 'n=5→3', '近紅外光。');
    spectrum('h-bohr-radius', 'deep', '波耳半徑', '5.29×10⁻¹¹', 'm', ['5.29×10⁻¹¹', '1.097×10⁷', '2.998×10⁸', '6.626×10⁻³⁴'], '氫原子基態', '原子尺度長度基準。');
    spectrum('h-hc', 'deep', '光子常數hc', '1.240×10³', 'eV·nm', ['1.240×10³', '96.485', '8.314', '22.4'], '', '常用近似為1240 eV·nm。');
    spectrum('h-rydberg-energy', 'deep', '里德伯能量', '13.6', 'eV', ['13.6', '1.89', '10.2', '27.2'], '氫原子', '等於基態游離能的近似值。');

    window.CHEM_KNOWLEDGE_CONSTANT_DATA = Object.freeze(facts);
})();

// --- Bundled calibration extension data (source: calibration_extension_data.js) ---
// 校準新增章節採「概念資料 × 共用模板」；此檔不儲存完整題幹或固定選項。
window.CALIBRATION_EXTENSION_CATEGORIES = {
    concentration: {
        label:'濃度與溶解度', difficulty:9,
        subtypes:[
            {id:'expressions',label:'濃度表示、計算與換算',description:'公式、單位與各種濃度的正反向換算',required:true},
            {id:'influence',label:'濃度受哪些因素影響',description:'溫度、體積、加水與溶質變動',required:true},
            {id:'atomicStandard',label:'原子量標準改變',description:'莫耳質量縮放及濃度數值反向換算',required:true},
            {id:'dilution',label:'稀釋與配製',description:'原液、目標濃度、體積與加水量互求',required:true},
            {id:'mixing',label:'同溶質溶液混合',description:'混合濃度、用量與比例互求',required:true},
            {id:'changes',label:'蒸發、加水與增減溶質',description:'溶液質量與質量百分濃度變化',required:true},
            {id:'solubility',label:'溶解度與飽和溶液',description:'溶解度、水量與飽和溶液濃度互求',required:true},
            {id:'saturation',label:'飽和狀態與溫度變化',description:'飽和狀態、冷卻析晶及反向計算',required:true}
        ]
    },
    acidBase: {
        label: '酸鹼與鹽類', difficulty: 8,
        subtypes: [
            { id: 'strength', label: '常見強弱酸鹼', description: '比較等濃度溶液、解離程度與強弱排序；辨認題僅少量穿插', required: true },
            { id: 'conjugate', label: '共軛酸鹼對', description: '從質子轉移反應判角色、共軛粒子與電荷守恆', required: false },
            { id: 'salt', label: '離子水解與鹽類酸鹼性', description: '追蹤離子來源、水解方向與 Ka／Kb 對溶液酸鹼性的影響', required: true },
            { id: 'pH', label: 'pH 與中和計算', description: '互換 [H₃O⁺]、[OH⁻]、pH、pOH，計算過量中和與混合後 pH', required: true },
            { id: 'acidNature', label: '酸鹼性判斷與中性基準', description: '依 Kw／pKw 判斷中性點，交叉運用 [H⁺]、[OH⁻]、pH 與 pOH（含非 25°C）', required: true },
            { id: 'indicator', label: '指示劑與變色', description: '綜合多種指示劑觀察結果，推定 pH 範圍並排除不可能值', required: true }
        ]
    },
    mole: {
        label: '莫耳、溶液與氣體', difficulty: 9,
        subtypes: [
            { id: 'mole', label: '質量、莫耳與粒子數', description: '依莫耳質量及亞佛加厥常數進行正反向換算', required: true },
            { id: 'particles', label: '亞佛加厥常數與粒子數', description: '分子、原子與化學式單位的莫耳數正反向換算', required: false },
            { id: 'stoich', label: '反應係數與莫耳比', description: '由平衡反應式選取反應物或生成物配對計算', required: true },
            { id: 'solution', label: '濃度與稀釋', description: '莫耳濃度、溶質莫耳數與稀釋計算', required: true },
            { id: 'gas', label: '氣體體積關係', description: '明確溫壓條件下的莫耳體積與體積比', required: false },
            { id: 'solubility', label: '溶解度與結晶量', description: '依給定溶解度及溫度計算溶解或析出量', required: false }
        ]
    },
    thermo: {
        label: '熱化學、速率與平衡', difficulty: 10,
        subtypes: [
            { id: 'thermo', label: '熱化學與反應熱', description: '吸放熱符號、量熱關係與熱化學方程式', required: true },
            { id: 'rate', label: '反應速率與活化能', description: '速率級數、濃度倍數及催化前後的能障判讀', required: true },
            { id: 'equilibrium', label: '平衡常數與平衡移動', description: 'Kc 式、濃度／壓力／溫度變動與平衡方向', required: true }
        ]
    },
    organic: {
        label: '有機化學', difficulty: 11,
        subtypes: [
            { id: 'functional', label: '官能基與物質分類', description: '由名稱或結構辨認高中常見官能基', required: true },
            { id: 'name', label: '名稱、結構與簡單異構', description: '常見小分子名稱、分子式與結構特徵', required: true },
            { id: 'reaction', label: '常見反應與產物', description: '只在反應物與必要條件明確時判斷代表性產物', required: false },
            { id: 'polymer', label: '單體與聚合物', description: '辨認加成聚合的單體、重複單元與聚合物', required: false }
        ]
    }
};

// 模板登錄表。模板 ID 由引擎執行，不為每筆概念資料撰寫專屬題目程式。
window.CALIBRATION_EXTENSION_TEMPLATES = {
    acidBase: {
        strength: ['equal-concentration-acid-base-comparison', 'weak-acid-equilibrium-ph', 'weak-base-equilibrium-ph', 'condition-to-strength-class'],
        conjugate: ['acid-to-conjugate-base-from-reactants', 'base-to-conjugate-acid-from-reactants'],
        salt: ['ion-origin-to-solution-ph', 'hydrolysis-to-major-ion', 'salt-water-reactive-ion'],
        pH: ['[H3O+]-to-pH-and-reverse', '[OH-]-to-[H3O+]-or-pH', 'pH-to-[OH-]', 'pOH-to-pH', 'strong-acid-base-mixture'],
        acidNature: ['[H+]-vs-sqrtKw', '[OH-]-vs-sqrtKw', 'pH-vs-pKw/2', 'pH-vs-Kw-derived-neutral-pH', 'pOH-vs-pKw/2', 'pH+pOH=pKw', 'ion-product-and-acidity'],
        indicator: ['two-indicator-interval-intersection']
    },
    mole: {
        mole: ['mass-to-moles', 'moles-to-mass'],
        particles: ['moles-to-particles', 'particles-to-moles'],
        stoich: ['coefficient-ratio', 'reactant-to-product', 'product-to-reactant'],
        solution: ['molarity', 'solute-moles', 'dilution-final-concentration', 'dilution-volume'],
        gas: ['molar-volume', 'gas-volume-ratio'],
        solubility: ['solubility-at-temperature', 'crystallization-amount']
    },
    thermo: {
        thermo: ['heat-sign', 'calorimetry-q', 'reverse-heat-sign'],
        rate: ['rate-law-factor', 'identify-order', 'catalyst-energy-effect'],
        equilibrium: ['kc-expression', 'concentration-shift', 'pressure-shift', 'temperature-shift']
    },
    organic: {
        functional: ['structure-to-functional-group', 'functional-group-to-family'],
        name: ['name-to-formula', 'formula-to-name', 'bond-type-classification'],
        reaction: ['conditioned-product', 'reaction-type'],
        polymer: ['monomer-to-polymer', 'polymer-to-monomer', 'repeat-unit']
    }
};

// 概念資料：每筆保存化學事實、條件、誘答依據與詳解規則，不保存題目選項。
window.CALIBRATION_EXTENSION_DATA = {
    acidStrength: [
        { id:'acid-hcl', formula:'HCl', name:'氫氯酸', kind:'acid', strength:'strong', rule:'高中常見強酸在水中近乎完全解離。' },
        { id:'acid-hbr', formula:'HBr', name:'氫溴酸', kind:'acid', strength:'strong', rule:'高中常見強酸在水中近乎完全解離。' },
        { id:'acid-hi', formula:'HI', name:'氫碘酸', kind:'acid', strength:'strong', rule:'高中常見強酸在水中近乎完全解離。' },
        { id:'acid-hno3', formula:'HNO₃', name:'硝酸', kind:'acid', strength:'strong', rule:'硝酸是高中常見強酸。' },
        { id:'acid-hclo4', formula:'HClO₄', name:'過氯酸', kind:'acid', strength:'strong', rule:'過氯酸列為常見強酸；此題只考定性分類。' },
        { id:'acid-h2so4', formula:'H₂SO₄', name:'硫酸', kind:'acid', strength:'strong', rule:'硫酸第一階段解離視為完全解離；題目不延伸第二階段平衡。' },
        { id:'acid-hf', formula:'HF', name:'氫氟酸', kind:'acid', strength:'weak', rule:'HF 在水中只部分解離，屬弱酸。' },
        { id:'acid-acetic', formula:'CH₃COOH', name:'醋酸', kind:'acid', strength:'weak', Ka:1.8e-5, rule:'醋酸在水中只部分解離，屬弱酸。' },
        { id:'acid-carbonic', formula:'H₂CO₃', name:'碳酸', kind:'acid', strength:'weak', rule:'碳酸在水中只部分解離，屬弱酸。' },
        { id:'acid-phosphoric', formula:'H₃PO₄', name:'磷酸', kind:'acid', strength:'weak', rule:'磷酸屬弱酸；多元解離不在此模板中計算。' },
        { id:'acid-nitrous', formula:'HNO₂', name:'亞硝酸', kind:'acid', strength:'weak', Ka:4.5e-4, rule:'亞硝酸在水中部分解離，屬弱酸。' },
        { id:'acid-hclo', formula:'HClO', name:'次氯酸', kind:'acid', strength:'weak', Ka:3.0e-8, rule:'次氯酸在水中部分解離，屬弱酸。' }
    ],
    baseStrength: [
        { id:'base-naoh', formula:'NaOH', name:'氫氧化鈉', strength:'strong', rule:'可溶性 IA 族氫氧化物屬常見強鹼。' },
        { id:'base-koh', formula:'KOH', name:'氫氧化鉀', strength:'strong', rule:'可溶性 IA 族氫氧化物屬常見強鹼。' },
        { id:'base-lioh', formula:'LiOH', name:'氫氧化鋰', strength:'strong', rule:'可溶性 IA 族氫氧化物屬常見強鹼。' },
        { id:'base-baoh', formula:'Ba(OH)₂', name:'氫氧化鋇', strength:'strong', rule:'氫氧化鋇為高中常見強鹼。' },
        { id:'base-caoh', formula:'Ca(OH)₂', name:'氫氧化鈣', strength:'strong', rule:'溶解部分解離出的氫氧根視為強鹼性來源。' },
        { id:'base-nh3', formula:'NH₃', name:'氨', strength:'weak', Kb:1.8e-5, rule:'氨與水建立平衡，僅部分生成 OH⁻，屬弱鹼。' },
        { id:'base-methylamine', formula:'CH₃NH₂', name:'甲胺', strength:'weak', Kb:4.4e-4, rule:'胺類可接受質子，但在水中通常只部分反應，屬弱鹼。' },
        { id:'base-pyridine', formula:'C₅H₅N', name:'吡啶', strength:'weak', Kb:1.7e-9, rule:'吡啶的氮原子可接受質子，在水中呈弱鹼性。' }
    ],
    conjugates: [
        { id:'conj-hcl', acid:'HCl', base:'Cl⁻', note:'失去一個質子形成共軛鹼。' },
        { id:'conj-hf', acid:'HF', base:'F⁻', note:'失去一個質子形成共軛鹼。' },
        { id:'conj-acetic', acid:'CH₃COOH', base:'CH₃COO⁻', note:'醋酸失去一個質子形成醋酸根。' },
        { id:'conj-carbonic-1', acid:'H₂CO₃', base:'HCO₃⁻', note:'碳酸失去一個質子形成碳酸氫根。' },
        { id:'conj-carbonic-2', acid:'HCO₃⁻', base:'CO₃²⁻', note:'碳酸氫根再失去一個質子形成碳酸根。' },
        { id:'conj-phosphate-1', acid:'H₃PO₄', base:'H₂PO₄⁻', note:'磷酸失去一個質子形成磷酸二氫根。' },
        { id:'conj-phosphate-2', acid:'H₂PO₄⁻', base:'HPO₄²⁻', note:'磷酸二氫根失去一個質子形成磷酸氫根。' },
        { id:'conj-phosphate-3', acid:'HPO₄²⁻', base:'PO₄³⁻', note:'磷酸氫根失去一個質子形成磷酸根。' },
        { id:'conj-ammonium', acid:'NH₄⁺', base:'NH₃', note:'銨離子失去一個質子形成氨。' },
        { id:'conj-hydronium', acid:'H₃O⁺', base:'H₂O', note:'水合氫離子失去一個質子形成水。' },
        { id:'conj-water', acid:'H₂O', base:'OH⁻', note:'水失去一個質子形成氫氧根。' }
    ],
    salts: [
        { id:'salt-nh4cl', formula:'NH₄Cl', cation:'NH₄⁺', anion:'Cl⁻', behavior:'酸性', activeIon:'NH₄⁺', product:'H₃O⁺', rule:'NH₄⁺是弱鹼 NH₃ 的共軛酸，會與水作用；Cl⁻來自強酸，通常不水解。' },
        { id:'salt-nh4no3', formula:'NH₄NO₃', cation:'NH₄⁺', anion:'NO₃⁻', behavior:'酸性', activeIon:'NH₄⁺', product:'H₃O⁺', rule:'NH₄⁺水解增加 H₃O⁺；NO₃⁻來自強酸，通常不水解。' },
        { id:'salt-ch3coona', formula:'CH₃COONa', cation:'Na⁺', anion:'CH₃COO⁻', behavior:'鹼性', activeIon:'CH₃COO⁻', product:'OH⁻', rule:'CH₃COO⁻是弱酸的共軛鹼，與水作用可生成 OH⁻。' },
        { id:'salt-na2co3', formula:'Na₂CO₃', cation:'Na⁺', anion:'CO₃²⁻', behavior:'鹼性', activeIon:'CO₃²⁻', product:'OH⁻', rule:'CO₃²⁻是弱酸的共軛鹼，水解後溶液呈鹼性。' },
        { id:'salt-naf', formula:'NaF', cation:'Na⁺', anion:'F⁻', behavior:'鹼性', activeIon:'F⁻', product:'OH⁻', rule:'F⁻是弱酸 HF 的共軛鹼，水解後溶液呈鹼性。' },
        { id:'salt-nacl', formula:'NaCl', cation:'Na⁺', anion:'Cl⁻', behavior:'中性', activeIon:'無', product:'無', rule:'Na⁺與 Cl⁻分別來自強鹼與強酸，常見高中近似下不顯著水解。' },
        { id:'salt-kno3', formula:'KNO₃', cation:'K⁺', anion:'NO₃⁻', behavior:'中性', activeIon:'無', product:'無', rule:'K⁺與 NO₃⁻分別來自強鹼與強酸，常見高中近似下不顯著水解。' },
        { id:'salt-nahco3', formula:'NaHCO₃', cation:'Na⁺', anion:'HCO₃⁻', behavior:'弱鹼性', activeIon:'HCO₃⁻', product:'OH⁻', rule:'HCO₃⁻為兩性粒子，但水溶液中鹼性作用略占優勢。' },
        { id:'salt-nahso4', formula:'NaHSO₄', cation:'Na⁺', anion:'HSO₄⁻', behavior:'酸性', activeIon:'HSO₄⁻', product:'H₃O⁺', rule:'HSO₄⁻仍可解離出 H⁺，水溶液呈酸性。' },
        { id:'salt-nh4acetate', formula:'NH₄CH₃COO', cation:'NH₄⁺', anion:'CH₃COO⁻', behavior:'條件依 Ka 與 Kb 比較', activeIon:'NH₄⁺、CH₃COO⁻', product:'須比較 Ka、Kb', rule:'兩離子都會水解；未提供 Ka、Kb 時不判定其溶液酸鹼性。', excludedFromUniquePH:true }
    ],
    indicators: [
        { id:'indicator-litmus', name:'石蕊', acid:'紅色', neutral:'紫色', base:'藍色', range:'定性' },
        { id:'indicator-phenolphthalein', name:'酚酞', acid:'無色', neutral:'無色', base:'粉紅色', range:'約 pH 8.2 以下無色，約 pH 8.2–10.0 逐漸變粉紅，較高 pH 呈粉紅' },
        { id:'indicator-methyl-orange', name:'甲基橙', acid:'紅色', neutral:'黃色', base:'黃色', range:'約 pH 3.1 以下紅色，約 pH 3.1–4.4 橙色過渡，約 pH 4.4 以上黃色' },
        { id:'indicator-btb', name:'溴瑞香草酚藍（BTB）', acid:'黃色', neutral:'綠色', base:'藍色', range:'約 pH 6.0 以下黃色，約 pH 6.0–7.6 綠色過渡，約 pH 7.6 以上藍色' }
    ],
    neutralizations: [
        { id:'neut-hcl-naoh', acid:'HCl', acidName:'鹽酸', base:'NaOH', baseName:'氫氧化鈉', equation:'HCl＋NaOH→NaCl＋H₂O', salt:'NaCl', ratio:'1:1', condition:'完全中和' },
        { id:'neut-hno3-koh', acid:'HNO₃', acidName:'硝酸', base:'KOH', baseName:'氫氧化鉀', equation:'HNO₃＋KOH→KNO₃＋H₂O', salt:'KNO₃', ratio:'1:1', condition:'完全中和' },
        { id:'neut-h2so4-naoh', acid:'H₂SO₄', acidName:'硫酸', base:'NaOH', baseName:'氫氧化鈉', equation:'H₂SO₄＋2NaOH→Na₂SO₄＋2H₂O', salt:'Na₂SO₄', ratio:'1:2', condition:'完全中和' },
        { id:'neut-h2so4-koh', acid:'H₂SO₄', acidName:'硫酸', base:'KOH', baseName:'氫氧化鉀', equation:'H₂SO₄＋2KOH→K₂SO₄＋2H₂O', salt:'K₂SO₄', ratio:'1:2', condition:'完全中和' },
        { id:'neut-h3po4-naoh', acid:'H₃PO₄', acidName:'磷酸', base:'NaOH', baseName:'氫氧化鈉', equation:'H₃PO₄＋3NaOH→Na₃PO₄＋3H₂O', salt:'Na₃PO₄', ratio:'1:3', condition:'三個可解離質子皆完全中和' },
        { id:'neut-hcl-caoh', acid:'HCl', acidName:'鹽酸', base:'Ca(OH)₂', baseName:'氫氧化鈣', equation:'2HCl＋Ca(OH)₂→CaCl₂＋2H₂O', salt:'CaCl₂', ratio:'2:1', condition:'完全中和' },
        { id:'neut-hno3-baoh', acid:'HNO₃', acidName:'硝酸', base:'Ba(OH)₂', baseName:'氫氧化鋇', equation:'2HNO₃＋Ba(OH)₂→Ba(NO₃)₂＋2H₂O', salt:'Ba(NO₃)₂', ratio:'2:1', condition:'完全中和' }
    ],
    strongPH: [
        { id:'ph-hcl-1e3', formula:'HCl', concentration:0.001, pH:3, condition:'25 °C、強酸完全解離、單元酸' },
        { id:'ph-hno3-1e2', formula:'HNO₃', concentration:0.01, pH:2, condition:'25 °C、強酸完全解離、單元酸' },
        { id:'ph-naoh-1e3', formula:'NaOH', concentration:0.001, pH:11, condition:'25 °C、強鹼完全解離' },
        { id:'ph-koh-1e2', formula:'KOH', concentration:0.01, pH:12, condition:'25 °C、強鹼完全解離' }
    ],
    acidNatureConditions: [
        { id:'water-25c', temperature:25, kw:1.0e-14, kwText:'1.0×10⁻¹⁴', pKw:14, pKwText:'14.00' },
        { id:'water-50c', temperature:50, kw:5.5e-14, kwText:'5.5×10⁻¹⁴', pKw:-Math.log10(5.5e-14), pKwText:'13.26' }
    ],
    moleSpecies: [
        { id:'sp-water', formula:'H₂O', name:'水', molarMass:18, particle:'分子' },
        { id:'sp-carbon-dioxide', formula:'CO₂', name:'二氧化碳', molarMass:44, particle:'分子' },
        { id:'sp-oxygen', formula:'O₂', name:'氧氣', molarMass:32, particle:'分子' },
        { id:'sp-nitrogen', formula:'N₂', name:'氮氣', molarMass:28, particle:'分子' },
        { id:'sp-carbon-monoxide', formula:'CO', name:'一氧化碳', molarMass:28, particle:'分子' },
        { id:'sp-ammonia', formula:'NH₃', name:'氨', molarMass:17, particle:'分子' },
        { id:'sp-methane', formula:'CH₄', name:'甲烷', molarMass:16, particle:'分子' },
        { id:'sp-sodium-chloride', formula:'NaCl', name:'氯化鈉', molarMass:58.5, particle:'化學式單位' },
        { id:'sp-calcium-carbonate', formula:'CaCO₃', name:'碳酸鈣', molarMass:100, particle:'化學式單位' },
        { id:'sp-sodium-carbonate', formula:'Na₂CO₃', name:'碳酸鈉', molarMass:106, particle:'化學式單位' },
        { id:'sp-sulfuric-acid', formula:'H₂SO₄', name:'硫酸', molarMass:98, particle:'分子' },
        { id:'sp-hydrogen-chloride', formula:'HCl', name:'氯化氫', molarMass:36.5, particle:'分子' }
    ],
    stoichiometry: [
        { id:'rx-water', equation:'2H₂＋O₂→2H₂O', terms:[['H₂',2],['O₂',1],['H₂O',2]] },
        { id:'rx-ammonia', equation:'N₂＋3H₂→2NH₃', terms:[['N₂',1],['H₂',3],['NH₃',2]] },
        { id:'rx-carbon', equation:'C＋O₂→CO₂', terms:[['C',1],['O₂',1],['CO₂',1]] },
        { id:'rx-methane', equation:'CH₄＋2O₂→CO₂＋2H₂O', terms:[['CH₄',1],['O₂',2],['CO₂',1],['H₂O',2]] },
        { id:'rx-magnesium', equation:'2Mg＋O₂→2MgO', terms:[['Mg',2],['O₂',1],['MgO',2]] },
        { id:'rx-aluminum', equation:'4Al＋3O₂→2Al₂O₃', terms:[['Al',4],['O₂',3],['Al₂O₃',2]] },
        { id:'rx-calcium-carbonate', equation:'CaCO₃→CaO＋CO₂', terms:[['CaCO₃',1],['CaO',1],['CO₂',1]] },
        { id:'rx-potassium-chlorate', equation:'2KClO₃→2KCl＋3O₂', terms:[['KClO₃',2],['KCl',2],['O₂',3]] },
        { id:'rx-iron-oxide', equation:'Fe₂O₃＋3CO→2Fe＋3CO₂', terms:[['Fe₂O₃',1],['CO',3],['Fe',2],['CO₂',3]] },
        { id:'rx-sodium-carbonate', equation:'Na₂CO₃＋2HCl→2NaCl＋H₂O＋CO₂', terms:[['Na₂CO₃',1],['HCl',2],['NaCl',2],['H₂O',1],['CO₂',1]] }
    ],
    concentrationCases: [
        { id:'conc-1', n:0.1, volume:0.5 }, { id:'conc-2', n:0.2, volume:1 },
        { id:'conc-3', n:0.5, volume:0.25 }, { id:'conc-4', n:0.4, volume:2 },
        { id:'conc-5', n:0.3, volume:0.15 }, { id:'conc-6', n:1, volume:0.5 },
        { id:'conc-7', n:0.25, volume:0.5 }, { id:'conc-8', n:0.6, volume:0.3 }
    ],
    dilutionCases: [
        { id:'dil-1', initial:1, v1:100, v2:500 }, { id:'dil-2', initial:2, v1:50, v2:200 },
        { id:'dil-3', initial:0.8, v1:250, v2:1000 }, { id:'dil-4', initial:1.5, v1:100, v2:300 },
        { id:'dil-5', initial:0.5, v1:200, v2:500 }, { id:'dil-6', initial:3, v1:25, v2:150 },
        { id:'dil-7', initial:1.2, v1:250, v2:600 }, { id:'dil-8', initial:2.4, v1:50, v2:400 }
    ],
    gasFacts: [
        { id:'gas-0c-1atm', temp:'0 °C', pressure:'1 atm', molarVolume:22.4 },
        { id:'gas-25c-1atm', temp:'25 °C', pressure:'1 atm', molarVolume:24.5 },
        { id:'gas-27c-1atm', temp:'27 °C', pressure:'1 atm', molarVolume:24.6 },
        { id:'gas-0c-1bar', temp:'0 °C', pressure:'1 bar', molarVolume:22.71 },
        { id:'gas-25c-1bar', temp:'25 °C', pressure:'1 bar', molarVolume:24.79 }
    ],
    solubilities: [
        { id:'sol-kno3', name:'KNO₃', hot:110, cold:32, unit:'g/100 g 水', hotTemp:60, coldTemp:20 },
        { id:'sol-kcl', name:'KCl', hot:45, cold:34, unit:'g/100 g 水', hotTemp:60, coldTemp:20 },
        { id:'sol-nacl', name:'NaCl', hot:37, cold:36, unit:'g/100 g 水', hotTemp:60, coldTemp:20 },
        { id:'sol-nh4cl', name:'NH₄Cl', hot:55, cold:37, unit:'g/100 g 水', hotTemp:60, coldTemp:20 }
    ],
    thermoFacts: [
        { id:'th-fuel', process:'甲烷完全燃燒', heat:'放熱', deltaH:'負值', rule:'系統將熱傳給環境，系統焓降低。' },
        { id:'th-ice', process:'冰融化', heat:'吸熱', deltaH:'正值', rule:'系統吸收熱量克服粒子間作用力。' },
        { id:'th-water-vapor', process:'液態水汽化', heat:'吸熱', deltaH:'正值', rule:'汽化需由環境吸收熱量。' },
        { id:'th-neutralization', process:'強酸與強鹼中和', heat:'放熱', deltaH:'負值', rule:'形成水的中和過程通常放出熱量。' },
        { id:'th-condensation', process:'水蒸氣凝結', heat:'放熱', deltaH:'負值', rule:'凝結時系統向外放出熱量。' },
        { id:'th-sublimation', process:'乾冰昇華', heat:'吸熱', deltaH:'正值', rule:'固體直接轉為氣體需吸收熱量。' },
        { id:'th-dissolve-naoh', process:'NaOH 固體溶於水', heat:'放熱', deltaH:'負值', rule:'此常見溶解過程放熱；題目採稀溶液條件。' },
        { id:'th-dissolve-nh4no3', process:'NH₄NO₃ 固體溶於水', heat:'吸熱', deltaH:'正值', rule:'此常見溶解過程吸熱；題目採稀溶液條件。' }
    ],
    rateLaws: [
        { id:'rate-a0', rate:'v=k[A]', order:1, variable:'[A]', power:1 },
        { id:'rate-a1', rate:'v=k[A]²', order:2, variable:'[A]', power:2 },
        { id:'rate-b0', rate:'v=k[B]', order:1, variable:'[B]', power:1 },
        { id:'rate-a-b', rate:'v=k[A][B]', order:2, variable:'[A]', power:1 },
        { id:'rate-b2', rate:'v=k[B]²', order:2, variable:'[B]', power:2 },
        { id:'rate-zero-a', rate:'v=k[A]⁰', order:0, variable:'[A]', power:0 },
        { id:'rate-a2b', rate:'v=k[A]²[B]', order:3, variable:'[A]', power:2 },
        { id:'rate-ab2', rate:'v=k[A][B]²', order:3, variable:'[B]', power:2 }
    ],
    equilibria: [
        { id:'eq-ammonia', equation:'N₂(g)＋3H₂(g)⇌2NH₃(g)', reactants:4, products:2, endothermic:false, kc:'[NH₃]²/([N₂][H₂]³)' },
        { id:'eq-iodine', equation:'H₂(g)＋I₂(g)⇌2HI(g)', reactants:2, products:2, endothermic:false, kc:'[HI]²/([H₂][I₂])' },
        { id:'eq-n2o4', equation:'N₂O₄(g)⇌2NO₂(g)', reactants:1, products:2, endothermic:true, kc:'[NO₂]²/[N₂O₄]' },
        { id:'eq-so2', equation:'2SO₂(g)＋O₂(g)⇌2SO₃(g)', reactants:3, products:2, endothermic:false, kc:'[SO₃]²/([SO₂]²[O₂])' },
        { id:'eq-haber', equation:'CO(g)＋2H₂(g)⇌CH₃OH(g)', reactants:3, products:1, endothermic:false, kc:'[CH₃OH]/([CO][H₂]²)' },
        { id:'eq-watergas', equation:'C(s)＋H₂O(g)⇌CO(g)＋H₂(g)', reactants:1, products:2, endothermic:true, kc:'[CO][H₂]/[H₂O]' },
        { id:'eq-hcl', equation:'H₂(g)＋Cl₂(g)⇌2HCl(g)', reactants:2, products:2, endothermic:false, kc:'[HCl]²/([H₂][Cl₂])' },
        { id:'eq-pcl', equation:'PCl₅(g)⇌PCl₃(g)＋Cl₂(g)', reactants:1, products:2, endothermic:true, kc:'[PCl₃][Cl₂]/[PCl₅]' }
    ],
    organicCompounds: [
        { id:'org-ethanol', name:'乙醇', formula:'CH₃CH₂OH', family:'醇', functional:'羥基（−OH）', bond:'單鍵' },
        { id:'org-methanol', name:'甲醇', formula:'CH₃OH', family:'醇', functional:'羥基（−OH）', bond:'單鍵' },
        { id:'org-acetic', name:'乙酸', formula:'CH₃COOH', family:'羧酸', functional:'羧基（−COOH）', bond:'單鍵' },
        { id:'org-ethyl-acetate', name:'乙酸乙酯', formula:'CH₃COOCH₂CH₃', family:'酯', functional:'酯基（−COO−）', bond:'單鍵' },
        { id:'org-acetone', name:'丙酮', formula:'CH₃COCH₃', family:'酮', functional:'羰基（>C=O）', bond:'單鍵' },
        { id:'org-ethanal', name:'乙醛', formula:'CH₃CHO', family:'醛', functional:'醛基（−CHO）', bond:'單鍵' },
        { id:'org-dimethyl-ether', name:'二甲醚', formula:'CH₃OCH₃', family:'醚', functional:'醚鍵（−O−）', bond:'單鍵' },
        { id:'org-methylamine', name:'甲胺', formula:'CH₃NH₂', family:'胺', functional:'胺基（−NH₂）', bond:'單鍵' },
        { id:'org-ethene', name:'乙烯', formula:'C₂H₄', structure:'CH₂=CH₂', family:'烯', functional:'碳碳雙鍵（C=C）', bond:'雙鍵' },
        { id:'org-propene', name:'丙烯', formula:'C₃H₆', structure:'CH₂=CHCH₃', family:'烯', functional:'碳碳雙鍵（C=C）', bond:'雙鍵' },
        { id:'org-ethyne', name:'乙炔', formula:'C₂H₂', structure:'HC≡CH', family:'炔', functional:'碳碳三鍵（C≡C）', bond:'三鍵' },
        { id:'org-benzene', name:'苯', formula:'C₆H₆', structure:'C₆H₆（六元共軛環）', family:'芳香烴', functional:'芳香環', bond:'共軛環狀結構' },
        { id:'org-ethane', name:'乙烷', formula:'C₂H₆', structure:'CH₃CH₃', family:'烷', functional:'無特定官能基', bond:'單鍵' },
        { id:'org-methane', name:'甲烷', formula:'CH₄', family:'烷', functional:'無特定官能基', bond:'單鍵' },
        { id:'org-formic', name:'甲酸', formula:'HCOOH', family:'羧酸', functional:'羧基（−COOH）', bond:'單鍵' }
    ],
    organicReactions: [
        { id:'org-add-bromine', reactant:'乙烯', formula:'C₂H₄', condition:'Br₂（適當條件）', product:'1,2-二溴乙烷', type:'加成反應', rule:'溴加到碳碳雙鍵兩端。' },
        { id:'org-hydrogenation', reactant:'乙烯', formula:'C₂H₄', condition:'H₂、Ni 催化', product:'乙烷', type:'加成反應', rule:'氫加到碳碳雙鍵兩端，使不飽和鍵轉為單鍵。' },
        { id:'org-esterification', reactant:'乙酸與乙醇', formula:'CH₃COOH＋CH₃CH₂OH', condition:'濃硫酸催化、加熱', product:'乙酸乙酯與水', type:'酯化反應', rule:'羧酸與醇在酸催化下形成酯與水。' },
        { id:'org-ethanol-combustion', reactant:'乙醇', formula:'C₂H₅OH', condition:'氧氣充足、完全燃燒', product:'二氧化碳與水', type:'完全燃燒', rule:'含碳、氫有機物完全燃燒生成 CO₂ 與 H₂O。' },
        { id:'org-methane-combustion', reactant:'甲烷', formula:'CH₄', condition:'氧氣充足、完全燃燒', product:'二氧化碳與水', type:'完全燃燒', rule:'烴完全燃燒生成 CO₂ 與 H₂O。' },
        { id:'org-ethene-polymer', reactant:'乙烯', formula:'C₂H₄', condition:'適當催化與聚合條件', product:'聚乙烯', type:'加成聚合', rule:'乙烯雙鍵開啟後連接成聚合物重複單元。' },
        { id:'org-propene-polymer', reactant:'丙烯', formula:'C₃H₆', condition:'適當催化與聚合條件', product:'聚丙烯', type:'加成聚合', rule:'丙烯雙鍵開啟後連接成聚合物重複單元。' }
    ],
    polymers: [
        { id:'poly-ethylene', monomer:'乙烯', monomerFormula:'CH₂=CH₂', polymer:'聚乙烯', repeatUnit:'−CH₂−CH₂−' },
        { id:'poly-propylene', monomer:'丙烯', monomerFormula:'CH₂=CHCH₃', polymer:'聚丙烯', repeatUnit:'−CH₂−CH(CH₃)−' },
        { id:'poly-vinyl-chloride', monomer:'氯乙烯', monomerFormula:'CH₂=CHCl', polymer:'聚氯乙烯', repeatUnit:'−CH₂−CHCl−' },
        { id:'poly-styrene', monomer:'苯乙烯', monomerFormula:'CH₂=CHC₆H₅', polymer:'聚苯乙烯', repeatUnit:'−CH₂−CH(C₆H₅)−' },
        { id:'poly-tetrafluoroethylene', monomer:'四氟乙烯', monomerFormula:'CF₂=CF₂', polymer:'聚四氟乙烯', repeatUnit:'−CF₂−CF₂−' },
        { id:'poly-acrylonitrile', monomer:'丙烯腈', monomerFormula:'CH₂=CHCN', polymer:'聚丙烯腈', repeatUnit:'−CH₂−CH(CN)−' },
        { id:'poly-methyl-methacrylate', monomer:'甲基丙烯酸甲酯', monomerFormula:'CH₂=C(CH₃)COOCH₃', polymer:'聚甲基丙烯酸甲酯', repeatUnit:'−CH₂−C(CH₃)(COOCH₃)−' }
    ]
};

// --- Bundled calibration extension engine (source: calibration_extension_engine.js) ---
// 四個新增章節的資料×模板引擎。題幹、正解、誘答與詳解在出題時組合。
window.CALIBRATION_EXTENSION_ENGINE = (() => {
    const DATA = () => window.CALIBRATION_EXTENSION_DATA || {};
    const CATEGORIES = () => window.CALIBRATION_EXTENSION_CATEGORIES || {};
    const shuffle = values => {
        const out = [...values];
        for (let i = out.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
    };
    const unique = values => [...new Set(values.filter(v => v != null && String(v).trim() !== ''))];
    const key = value => calibrationOptionKey(value);
    const num = value => String(Number(Number(value).toPrecision(4)));
    const superscript = value => String(value).replace(/[0-9+-]/g, char => ({ '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻','+':'⁺' })[char]);
    const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
    const ratio = (a, b) => { const g = gcd(a, b) || 1; return `${a / g}:${b / g}`; };

    function itemCandidates(correct, pool, minimum = 3) {
        const answerKey = key(correct);
        const values = shuffle(unique(pool).filter(value => key(value) !== answerKey));
        return values.slice(0, minimum);
    }

    function numericDistractors(answer, unit = '', scale = 1) {
        const a = Number(answer);
        const offsets = [a * 2, a / 2, a + scale, Math.max(0, a - scale), a + scale * 2, Math.max(0, a - scale * 2)];
        return unique(offsets.map(num).filter(v => Number(v) !== a).map(v => unit ? `${v} ${unit}` : v));
    }

    function chemDistractors(pool, answer) {
        return itemCandidates(answer, pool, 3);
    }

    function appendQuestion(out, cfg) {
        const options = unique([cfg.answer, ...itemCandidates(cfg.answer, cfg.distractors, 3)]);
        if (options.length < 3 || options.length > 4) return;
        out.push({
            id: `${cfg.template}:${cfg.factId}:${cfg.variant || 'a'}`,
            template: cfg.template,
            question: cfg.question,
            answer: String(cfg.answer),
            options: shuffle(options),
            displayMode: cfg.displayMode || 'text',
            basis: cfg.basis,
            steps: cfg.steps,
            conclusion: cfg.conclusion,
            misconception: cfg.misconception || '先辨認題目指定的條件，再依同一章節規則比較選項。',
            optionRationales: cfg.optionRationales,
            syllabus: cfg.required === false ? '加深加廣選修' : '必修',
            type: cfg.type
        });
    }

    function addStyled(out, cfg, stems) {
        stems.forEach((stem, index) => appendQuestion(out, { ...cfg, question: stem, variant: String(index + 1) }));
    }

    function buildAcidStrength(subtype) {
        const out = [];
        const acid = DATA().acidStrength || [];
        const base = DATA().baseStrength || [];
        if (subtype !== 'strength') return out;
        const classPools = [
            { group: acid, label: '酸', weak: 'weak', distract: acid.filter(x => x.strength === 'weak') },
            { group: base, label: '鹼', weak: 'weak', distract: base.filter(x => x.strength === 'weak') }
        ];
        classPools.forEach(({ group, label, distract }) => group.filter(x => x.strength === 'strong').forEach((item, index) => {
            const weakChoice = distract[index % distract.length];
            const options = [item, ...distract.filter(x => x.id !== weakChoice.id).slice(0, 3)];
            const names = options.map(x => x.formula);
            addStyled(out, {
                template: `equal-concentration-${label}-strength`, factId: item.id, answer: item.formula,
                distractors: names, type: `強弱酸鹼｜等濃度${label}溶液比較`, displayMode: 'formula',
                basis: `各溶液的分析濃度相同，且溫度相同；強${label}在水中解離程度較高。`,
                steps: `先排除只部分反應的弱${label}，再依題目所問的主要離子濃度或酸鹼程度比較。${item.formula}屬強${label}，在本題假設下反應近乎完全。`,
                conclusion: label === '酸' ? `${item.formula}的 [H₃O⁺] 較高，因此同濃度下 pH 較低。` : `${item.formula}提供的 [OH⁻] 較高，因此同濃度下 pH 較高。`,
                misconception: label === '酸' ? '比較 pH 時方向相反： [H₃O⁺] 越大，pH 越小；多元酸的可解離氫數不能直接當作解離程度。' : '強弱描述解離程度；溶液濃度相同才可直接比較生成的 OH⁻。'
            }, label === '酸' ? [
                `四種酸溶液的分析濃度相同，哪一杯的 pH 最低？`,
                `若各酸均配成相同濃度，哪一種溶液能建立最高的 [H₃O⁺]？`,
                `在相同溫度與分析濃度下，哪種酸的解離最接近完全？`
            ] : [
                `四種鹼溶液的分析濃度相同，哪一杯的 pH 最高？`,
                `若各鹼均配成相同濃度，哪一種溶液能建立最高的 [OH⁻]？`,
                `在相同溫度與分析濃度下，哪種鹼與水反應最完全？`
            ]);
        }));
        const weakSpecies = [
            ...acid.filter(x => x.strength === 'weak' && x.Ka).map(x => ({ ...x, constant:x.Ka, kind:'acid' })),
            ...base.filter(x => x.strength === 'weak' && x.Kb).map(x => ({ ...x, constant:x.Kb, kind:'base' }))
        ];
        weakSpecies.forEach(item => [0.10, 0.050].forEach((concentration, index) => {
            const k = item.constant;
            const ion = (-k + Math.sqrt(k * k + 4 * k * concentration)) / 2;
            const pH = item.kind === 'acid' ? -Math.log10(ion) : 14 + Math.log10(ion);
            const answer = Number(pH.toFixed(2)).toString();
            const [kMantissa, kExponent] = Number(k).toExponential(2).split('e');
            const hText = `${kMantissa}×10${superscript(Number(kExponent))}`;
            const cText = concentration.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
            const parameterId = `${item.id}-c${index}`;
            const kindLabel = item.kind === 'acid' ? '酸' : '鹼';
            addStyled(out, {
                template: `weak-${item.kind}-equilibrium-ph`, factId:parameterId, answer,
                distractors:numericDistractors(pH, '', 1), type:`強弱酸鹼｜弱${kindLabel}平衡計算`, displayMode:'number',
                basis:`${item.formula} 為弱${kindLabel}，在水中部分反應；25 °C 且濃度為 ${cText} M。`,
                steps: item.kind === 'acid'
                    ? `設平衡時 [H₃O⁺]=x。Kₐ=x²/(${cText}−x)=${hText}；解 x²+Kₐx−Kₐ(${cText})=0，得 x=${ion.toPrecision(3)} M，pH=−log x=${answer}。`
                    : `設平衡時 [OH⁻]=x。Kᵦ=x²/(${cText}−x)=${hText}；解 x²+Kᵦx−Kᵦ(${cText})=0，得 x=${ion.toPrecision(3)} M，pOH=−log x；pH=14−pOH=${answer}。`,
                conclusion:`該溶液的 pH 約為 ${answer}。`,
                misconception:'弱酸／弱鹼不能把分析濃度直接當成 [H₃O⁺]／[OH⁻]；先用平衡常數求反應量，再取對數。'
            }, [
                `${item.formula} 溶液濃度為 ${cText} M，${item.kind === 'acid' ? 'Kₐ' : 'Kᵦ'}=${hText}，求 25 °C 下 pH。`,
                `某 ${kindLabel}以 ${item.formula} 表示，分析濃度 ${cText} M、${item.kind === 'acid' ? 'Kₐ' : 'Kᵦ'}=${hText}。溶液 pH 約多少？`,
                `不假設完全解離。對 ${cText} M 的 ${item.formula} 水溶液，已知 ${item.kind === 'acid' ? 'Kₐ' : 'Kᵦ'}=${hText}，估算 pH。`
            ]);
        }));
        // 少量反向分類題保留基本辨識；同一物種仍以共用資料與模板生成。
        [...acid, ...base].forEach(item => {
            const label = item.kind === 'acid' || acid.some(x => x.id === item.id) ? '酸' : '鹼';
            const answer = `${item.strength === 'strong' ? '強' : '弱'}${label}`;
            appendQuestion(out, {
                template: 'strength-classification-reverse', factId: item.id, answer,
                question: `${item.formula} 的水溶液在相同分析濃度下呈現近乎完全解離／反應。此分類最適合哪一項？`,
                distractors: ['強酸', '弱酸', '強鹼', '弱鹼'], type: '強弱酸鹼｜條件反推分類',
                basis: `${item.formula}為${answer}；本題用解離程度定義強弱。`,
                steps: `先依物種接受或提供質子的性質判斷屬${label}，再把近乎完全解離／反應對應到「強」。`,
                conclusion: `分類為${answer}。`, misconception: '「強」指反應／解離程度，不等於濃度大；酸鹼類別與強弱是兩個判斷步驟。'
            });
        });
        return out;
    }

    function buildConjugates() {
        const out = [];
        const facts = DATA().conjugates || [];
        const acids = facts.map(x => x.acid);
        const bases = facts.map(x => x.base);
        facts.forEach(item => {
            const reactants = `${item.acid} 與 H₂O`;
            addStyled(out, {
                template: 'reaction-acid-role-conjugate-base', factId: item.id, answer: item.base,
                distractors: bases, type: '共軛酸鹼｜反應式辨認共軛鹼', displayMode: 'ion',
                basis: `反應中 ${item.acid} 將質子轉移給水，成為共軛鹼。`,
                steps: `比較反應物與生成物：${item.acid} 少一個 H⁺，電荷也減少 1；所以對應生成粒子為 ${item.base}。`,
                conclusion: `${item.acid} 的共軛鹼是 ${item.base}。`, misconception: '共軛粒子只差一個質子；寫出粒子後仍要檢查原子數與總電荷。'
            }, [
                `在 ${reactants} 的質子轉移反應中，${item.acid} 失去一個質子後形成哪種粒子？`,
                `只考慮 ${reactants} 互相傳遞一個 H⁺，指出 ${item.acid} 所對應的共軛鹼。`,
                `${item.acid} 與水作用時，哪一粒子是它失去 H⁺ 後的共軛對象？`
            ]);
            addStyled(out, {
                template: 'reaction-base-role-conjugate-acid', factId: item.id, answer: item.acid,
                distractors: acids, type: '共軛酸鹼｜反應式辨認共軛酸', displayMode: 'ion',
                basis: `${item.base} 接受一個 H⁺ 後形成 ${item.acid}；兩者只差一個質子。`,
                steps: `在反應式中比較 ${item.acid} 和 ${item.base}：兩者只差一個 H⁺。逐項核對氫原子數及電荷，排除多／少兩個質子或電荷不符的選項。`,
                conclusion: `${item.base} 的共軛酸是 ${item.acid}。`, misconception: '鹼的共軛酸需加上一個 H⁺，電荷增加 1；不可以只補氫而漏改電荷。'
            }, [
                `若 ${item.base} 參與質子轉移，接受一個 H⁺ 後會形成哪種共軛酸？`,
                `考慮 ${item.base} 與 H₃O⁺ 的質子轉移，哪種粒子是 ${item.base} 接受一個質子後的產物？`,
                `若 ${item.base} 反向接受 H⁺，生成物的化學式應是哪一項？`
            ]);
        });
        return out;
    }

    function buildSalts(subtype) {
        const out = [];
        const facts = (DATA().salts || []).filter(x => !x.excludedFromUniquePH);
        const behaviors = ['酸性', '弱鹼性', '鹼性', '中性'];
        const ions = unique(facts.flatMap(x => [x.cation, x.anion, x.activeIon]).filter(x => x && x !== '無'));
        facts.forEach(item => {
            if (subtype === 'salt') {
                const active = item.activeIon !== '無';
                const answerProduct = item.product === 'H₃O⁺' ? 'H₃O⁺' : item.product === 'OH⁻' ? 'OH⁻' : '無顯著增加';
                const distractProduct = ['H₃O⁺', 'OH⁻', 'Na⁺', 'Cl⁻', '無顯著增加'];
                appendQuestion(out, {
                    template: 'salt-source-to-ph', factId: item.id, answer: item.behavior,
                    question: `某鹽由 ${item.cation} 與 ${item.anion} 組成。依其離子來源判斷，稀水溶液的主要酸鹼性為何？`,
                    distractors: behaviors, type: '離子水解｜來源推論酸鹼性', displayMode: 'text',
                    basis: `先分別判斷陽、陰離子是否為強酸／強鹼的共軛粒子，再判斷哪些離子與水反應。`,
                    steps: `${item.rule} ${active ? `本例主要水解粒子為 ${item.activeIon}，其反應使溶液偏向${item.behavior}。` : '兩離子均不顯著水解，水的自解離仍是主要酸鹼來源。'}`,
                    conclusion: `溶液主要呈${item.behavior}。`,
                    misconception: '鹽的酸鹼性取決於離子在水中的反應；不能看到金屬陽離子就一律判中性，也不能只看鹽的名稱。'
                });
                appendQuestion(out, {
                    template: 'salt-hydrolysis-effect', factId: item.id, answer: answerProduct,
                    question: active ? `由 ${item.cation}、${item.anion} 組成的鹽溶於水後，水解作用主要使哪種粒子增加？` : `由 ${item.cation}、${item.anion} 組成的鹽溶於水後，哪一項描述最恰當？`,
                    distractors: distractProduct, type: '離子水解｜粒子變化推論', displayMode: 'ion',
                    basis: active ? `${item.activeIon} 是此鹽中主要與水作用的離子。` : `${item.cation}與${item.anion}在高中常見近似下都不顯著水解。`,
                    steps: active ? `${item.rule} 若水解產生 H₃O⁺，酸性增強；若產生 OH⁻，鹼性增強。` : '兩離子來源分別為強鹼與強酸，水溶液近似中性，沒有單一水解產物顯著增加。',
                    conclusion: active ? `主要增加 ${answerProduct}，故溶液呈${item.behavior}。` : '不會由鹽離子水解顯著增加 H₃O⁺ 或 OH⁻。',
                    misconception: '區分水解產物與原本存在的旁觀離子；酸性水解增加 H₃O⁺，鹼性水解增加 OH⁻。'
                });
                const correctIon = active ? item.activeIon : '無顯著水解離子';
                const ionOptions = [...ions, '無顯著水解離子'];
                addStyled(out, {
                    template: 'salt-active-ion', factId: item.id, answer: correctIon,
                    distractors: ionOptions, type: '離子水解｜判別反應粒子', displayMode: 'ion',
                    basis: active ? `${item.activeIon}為弱鹼／弱酸的共軛粒子，會與水發生反應。` : '由強酸與強鹼形成的離子通常不顯著水解。',
                    steps: `${item.rule} 逐一檢查陽、陰離子的共軛酸鹼強度，再排除旁觀離子。`,
                    conclusion: active ? `主要反應粒子為 ${correctIon}。` : '沒有單一離子顯著水解。',
                    misconception: '弱酸的共軛鹼或弱鹼的共軛酸才會明顯水解；另一離子可能只是旁觀離子。'
                }, [
                    `由 ${item.cation}、${item.anion} 組成的鹽進入水中，哪個離子主要參與水解？`,
                    `若追蹤這種鹽造成溶液偏酸／偏鹼的來源，應先追查哪個粒子？`,
                    `檢查 ${item.cation} 與 ${item.anion}，何者是此溶液中主要的水解粒子？`
                ]);
            }
        });
        return out;
    }

    function buildPH(subtype) {
        const out = [];
        if (subtype !== 'pH') return out;
        const powers = [-2, -3, -4, -5];
        const coefficients = [1, 2, 5];
        const log10 = c => -Math.log10(c);
        const sci = c => {
            const exp = Math.floor(Math.log10(c));
            const mantissa = Number((c / Math.pow(10, exp)).toPrecision(3));
            return `${mantissa}×10${superscript(exp)}`;
        };
        const fmtPH = value => Number(value.toFixed(2)).toString();
        const choices = (answer, unit) => {
            if (unit !== 'M') return unique([answer, ...numericDistractors(Number(answer), '', 1)]);
            const match = String(answer).match(/^([\d.]+)×10([⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+)$/);
            if (!match) return [answer, `${answer}×2`, `${answer}÷2`, `${answer}×10`].slice(0, 4);
            const supMap = { '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-','⁺':'+' };
            const mantissa = Number(match[1]), exponent = Number([...match[2]].map(c => supMap[c]).join(''));
            const fmt = (m, e) => `${Number(m.toPrecision(3))}×10${superscript(e)}`;
            return unique([answer, fmt(mantissa * 2, exponent), fmt(mantissa / 2, exponent), fmt(mantissa, exponent + 1), fmt(mantissa, exponent - 1)]).map(value => `${value} M`);
        };
        const addConversion = (id, givenSpecies, given, target, answer, steps, explainError, stems, unit = 'M') => {
            const answerText = unit ? `${answer} ${unit}` : answer;
            addStyled(out, {
                template: `acidbase-convert-${givenSpecies}-to-${target}`, factId: id,
                answer: answerText, distractors: choices(answer, unit),
                type: `pH 計算｜${givenSpecies} 轉 ${target}`, displayMode: 'number',
                basis: `25 °C 時使用 pH＋pOH＝14、K_w＝1.0×10⁻¹⁴；強酸強鹼假設完全解離。`,
                steps, conclusion: `所求 ${target} 為 ${answerText}。`, misconception: explainError
            }, stems);
        };
        powers.forEach((power, pIndex) => coefficients.forEach((coef, cIndex) => {
            const concentration = coef * Math.pow(10, power);
            const h = concentration;
            const oh = 1e-14 / h;
            const pH = log10(h);
            const pOH = 14 - pH;
            const hText = sci(h), ohText = sci(oh);
            const ident = `calculated-${power}-${coef}`;
            const phText = fmtPH(pH), pohText = fmtPH(pOH);
            addConversion(ident, '[H₃O⁺]', hText, 'pH', phText,
                `[H₃O⁺]=${hText} M；pH=−log[H₃O⁺]=−log(${coef}×10^(${power}))=${phText}。`,
                '先確認科學記號的指數與係數；pH 是負對數，濃度增加時 pH 應降低。',
                [`已知 [H₃O⁺]=${hText} M，求 pH。`, `一份溶液的氫氧鎓離子濃度為 ${hText} M；其 pH 為多少？`, `若 [H⁺]=${hText} M，這份溶液的 pH 約是多少？`], '');
            addConversion(ident, 'pH', phText, '[H₃O⁺]', hText,
                `[H₃O⁺]=10^(−pH)=10^(−${phText})=${hText} M。`,
                '由 pH 反推濃度要取 10^(−pH)，不能把 pH 數字直接當濃度或指數。',
                [`某水溶液 pH=${phText}，求 [H₃O⁺]。`, `量得 pH 為 ${phText}，氫氧鎓離子濃度約為多少？`, `若 pH=${phText}，對應的 [H⁺] 是多少 M？`]);
            addConversion(ident, '[OH⁻]', ohText, '[H₃O⁺]', hText,
                `[H₃O⁺][OH⁻]=K_w；[H₃O⁺]=(1.0×10⁻¹⁴)/(${ohText})=${hText} M。`,
                '酸、鹼離子濃度互換應使用 K_w 的乘積關係；不能把兩者濃度直接相減。',
                [`25 °C 下 [OH⁻]=${ohText} M，求 [H₃O⁺]。`, `已知氫氧根濃度為 ${ohText} M，溶液中的 [H⁺] 約為何？`, `若 [OH⁻]=${ohText} M，水合氫離子濃度是多少？`]);
            addConversion(ident, '[OH⁻]', ohText, 'pH', phText,
                `[OH⁻]=${ohText} M；pOH=−log[OH⁻]=${pohText}，故 pH=14−${pohText}=${phText}。`,
                '先求 pOH 再以 14 相減；把 pOH 當成 pH 會得到互補的錯誤值。',
                [`25 °C 時 [OH⁻]=${ohText} M，求此溶液的 pH。`, `鹼性溶液的氫氧根濃度為 ${ohText} M，pH 約為何？`, `若 [OH⁻]=${ohText} M，請反推 pH。`], '');
            addConversion(ident, 'pH', phText, '[OH⁻]', ohText,
                `pOH=14−${phText}=${pohText}；[OH⁻]=10^(−${pohText})=${ohText} M。`,
                '已知 pH 時，先用 pOH=14−pH；直接計算 10^(−pH) 會得到 [H₃O⁺] 而非 [OH⁻]。',
                [`pH=${phText}，求 [OH⁻]。`, `某水溶液 pH 為 ${phText}，其氫氧根濃度約多少？`, `已知 pH=${phText}，反求 [OH⁻]。`]);
            addConversion(ident, 'pOH', pohText, 'pH', phText,
                `pH＋pOH=14；pH=14−${pohText}=${phText}。`,
                '25 °C 下 pH 與 pOH 相加為 14；要以 14 減去已知值。',
                [`25 °C 時 pOH=${pohText}，求 pH。`, `溶液的 pOH 為 ${pohText}，其 pH 是多少？`, `已知 pOH=${pohText}，反算氫離子指數。`], '');
        }));

        // 反應物只列酸、鹼與測量資料；不把平衡式或產物寫進題幹。
        const mixCases = [
            { id:'mix-acid-excess-a', ca:0.020, va:25, cb:0.010, vb:20, excess:'acid' },
            { id:'mix-base-excess-b', ca:0.010, va:20, cb:0.020, vb:25, excess:'base' },
            { id:'mix-acid-excess-c', ca:0.050, va:10, cb:0.020, vb:20, excess:'acid' },
            { id:'mix-base-excess-d', ca:0.020, va:20, cb:0.050, vb:10, excess:'base' }
        ];
        mixCases.forEach(item => {
            const acidEq = item.ca * item.va / 1000;
            const baseEq = item.cb * item.vb / 1000;
            const residual = Math.abs(acidEq - baseEq) / ((item.va + item.vb) / 1000);
            const pH = item.excess === 'acid' ? -Math.log10(residual) : 14 + Math.log10(residual);
            const answer = fmtPH(pH);
            const wrong = [fmtPH(14 - pH), fmtPH(item.excess === 'acid' ? pH + 1 : pH - 1), fmtPH(item.excess === 'acid' ? pH - 1 : pH + 1)];
            addStyled(out, {
                template: 'strong-acid-base-mix-ph', factId: item.id, answer,
                distractors: wrong, type: '中和計算｜過量反應物與混合後 pH', displayMode: 'number',
                basis: '假設 HCl、NaOH 完全解離，體積可加成；先比較 H₃O⁺、OH⁻ 莫耳數，過量者除以混合總體積。',
                steps: `n(H₃O⁺)=${item.ca}×${item.va}/1000=${acidEq.toPrecision(3)} mol；n(OH⁻)=${item.cb}×${item.vb}/1000=${baseEq.toPrecision(3)} mol。${item.excess === 'acid' ? `酸過量，剩餘濃度=${residual.toPrecision(3)} M，pH=−log(${residual.toPrecision(3)})=${answer}。` : `鹼過量，剩餘濃度=${residual.toPrecision(3)} M，pOH=−log(${residual.toPrecision(3)})，pH=14−pOH=${answer}。`}`,
                conclusion: `混合液 pH 約為 ${answer}。`,
                misconception: '不可直接平均兩杯溶液的 pH；先用莫耳數做中和，再除以總體積，並辨認最後剩下的是酸或鹼。'
            }, [
                `將 ${item.va} mL、${item.ca} M HCl 與 ${item.vb} mL、${item.cb} M NaOH 混合，反應後 pH 約為何？`,
                `取 ${item.ca} M 鹽酸 ${item.va} mL，加入 ${item.cb} M 氫氧化鈉 ${item.vb} mL；假設體積可加，求混合液 pH。`,
                `一份 ${item.va} mL 的 ${item.ca} M 強酸，與 ${item.vb} mL 的 ${item.cb} M 強鹼混合。完全反應後 pH 約多少？`
            ]);
        });
        return out;
    }

    function buildAcidNature() {
        const out = [];
        const conditions = DATA().acidNatureConditions || [];
        const classes = ['酸性', '中性', '鹼性'];
        const fmtPH = value => Number(value.toFixed(2)).toString();
        const fmtSci = value => {
            const exponent = Math.floor(Math.log10(value));
            const mantissa = Number((value / Math.pow(10, exponent)).toPrecision(3));
            return `${mantissa}×10${superscript(exponent)}`;
        };
        const classifyH = (h, threshold) => Math.abs(h - threshold) / threshold < 1e-10 ? '中性' : h > threshold ? '酸性' : '鹼性';
        const classifyOH = (oh, threshold) => Math.abs(oh - threshold) / threshold < 1e-10 ? '中性' : oh > threshold ? '鹼性' : '酸性';
        const classWrong = answer => classes.filter(value => value !== answer).concat(['資料不足']);
        const questionSet = (cfg, stems) => addStyled(out, cfg, stems);

        conditions.forEach(condition => {
            const threshold = Math.sqrt(condition.kw);
            const neutralPH = condition.pKw / 2;
            const temperature = `${condition.temperature} °C`;
            const kwContext = `${temperature}，K_w=${condition.kwText}`;
            const pKwContext = `${temperature}，pK_w=${condition.pKwText}`;
            const factors = [0.05, 0.5, 1, 2, 4];

            factors.forEach((factor, index) => {
                const h = threshold * factor;
                const hText = fmtSci(h);
                const hClass = classifyH(h, threshold);
                questionSet({
                    template:'acidity-h-concentration-threshold', factId:`${condition.id}-h-${index}`,
                    answer:hClass, distractors:classWrong(hClass), type:'酸鹼性判斷｜[H⁺] 與 √Kw 比較',
                    basis:`中性時 [H⁺]=[OH⁻]=√K_w=√(${condition.kwText})=${fmtSci(threshold)} M。`,
                    steps:`比較題給的 [H⁺]=${hText} M 與中性基準 ${fmtSci(threshold)} M。${hClass === '酸性' ? '[H⁺] 較大，故溶液偏酸。' : hClass === '鹼性' ? '[H⁺] 較小，故溶液偏鹼。' : '[H⁺] 正好等於中性基準。'}`,
                    conclusion:`此溶液為${hClass}。`, misconception:'非 25°C 時不能固定使用 1.0×10⁻⁷ M；應以題目溫度下的 √Kw 為比較基準。'
                }, [
                    `在 ${kwContext} 下，某溶液 [H⁺]=${hText} M。判斷溶液酸鹼性。`,
                    `已知 ${kwContext}，量得 [H⁺] 為 ${hText} M；此溶液屬於哪一類？`,
                    `在 ${temperature} 下，水的 K_w 為 ${condition.kwText}。若 [H⁺]=${hText} M，溶液呈何性？`
                ]);

                const oh = threshold * factor;
                const ohText = fmtSci(oh);
                const ohClass = classifyOH(oh, threshold);
                questionSet({
                    template:'acidity-oh-concentration-threshold', factId:`${condition.id}-oh-${index}`,
                    answer:ohClass, distractors:classWrong(ohClass), type:'酸鹼性判斷｜[OH⁻] 與 √Kw 比較',
                    basis:`中性時 [OH⁻]=√K_w=√(${condition.kwText})=${fmtSci(threshold)} M。`,
                    steps:`比較 [OH⁻]=${ohText} M 與中性基準 ${fmtSci(threshold)} M。${ohClass === '酸性' ? '[OH⁻] 較小，故 [H⁺] 相對較大，溶液偏酸。' : ohClass === '鹼性' ? '[OH⁻] 較大，故溶液偏鹼。' : '[OH⁻] 正好等於中性基準。'}`,
                    conclusion:`此溶液為${ohClass}。`, misconception:'用 [OH⁻] 判斷時方向與 [H⁺] 相反；[OH⁻] 大於 √Kw 才是鹼性。'
                }, [
                    `在 ${kwContext} 下，某溶液 [OH⁻]=${ohText} M。判斷其酸鹼性。`,
                    `在 ${temperature} 下，一份溶液的氫氧根濃度為 ${ohText} M。其水溶液呈何性？`,
                    `某水溶液在 ${temperature} 時的 K_w=${condition.kwText}，且 [OH⁻]=${ohText} M。它是酸性、中性還是鹼性？`
                ]);

                const hPair = threshold * factor;
                const ohPair = condition.kw / hPair;
                const pairClass = classifyH(hPair, threshold);
                questionSet({
                    template:'acidity-ion-product-and-classification', factId:`${condition.id}-ion-pair-${index}`,
                    answer:pairClass, distractors:classWrong(pairClass), type:'酸鹼性判斷｜Kw、[H⁺] 與 [OH⁻] 綜合',
                    basis:`同一溫度下 [H⁺][OH⁻]=K_w；中性時兩者相等，皆為 √K_w。`,
                    steps:`檢查乘積：(${fmtSci(hPair)})(${fmtSci(ohPair)})=${condition.kwText}。再比較 [H⁺]=${fmtSci(hPair)} M 與 [OH⁻]=${fmtSci(ohPair)} M；${pairClass === '酸性' ? '[H⁺] 較大' : pairClass === '鹼性' ? '[OH⁻] 較大' : '兩者相等'}。`,
                    conclusion:`符合 K_w 的條件，溶液為${pairClass}。`, misconception:'先用乘積檢查離子濃度是否與 K_w 相符，再以 [H⁺] 和 [OH⁻] 的大小關係判斷酸鹼性。'
                }, [
                    `在 ${kwContext} 下，某溶液 [H⁺]=${fmtSci(hPair)} M、[OH⁻]=${fmtSci(ohPair)} M。依離子乘積與濃度大小判斷其酸鹼性。`,
                    `一份溶液在 ${temperature} 時測得 [H⁺]=${fmtSci(hPair)} M、[OH⁻]=${fmtSci(ohPair)} M。若該溫度 K_w=${condition.kwText}，此結果代表何種酸鹼性？`,
                    `某水溶液在 ${temperature} 的兩種離子濃度分別為 [H⁺]=${fmtSci(hPair)} M 與 [OH⁻]=${fmtSci(ohPair)} M。已知 K_w=${condition.kwText}，判斷溶液性質。`
                ]);
            });

            [-0.8, -0.3, 0, 0.35, 0.9].forEach((offset, index) => {
                const pH = Number((neutralPH + offset).toFixed(2));
                const pHClass = pH < neutralPH - 0.001 ? '酸性' : pH > neutralPH + 0.001 ? '鹼性' : '中性';
                questionSet({
                    template:'acidity-ph-vs-pkw-half', factId:`${condition.id}-ph-${index}`,
                    answer:pHClass, distractors:classWrong(pHClass), type:'酸鹼性判斷｜pH 與 pKw/2 比較',
                    basis:`pH+pOH=pK_w；中性時 pH=pOH，因此中性 pH=pK_w/2=${fmtPH(neutralPH)}。`,
                    steps:`將 pH=${fmtPH(pH)} 與中性基準 pK_w/2=${fmtPH(neutralPH)} 比較。${pHClass === '酸性' ? 'pH 較小，溶液偏酸。' : pHClass === '鹼性' ? 'pH 較大，溶液偏鹼。' : 'pH 等於中性基準。'}`,
                    conclusion:`此溶液為${pHClass}。`, misconception:'只有在 25°C 且 pKw=14 時中性 pH 才是 7；其他溫度要比較 pH 與 pKw/2。'
                }, [
                    `在 ${pKwContext} 下，某溶液 pH=${fmtPH(pH)}。判斷其酸鹼性。`,
                    `某水溶液在 ${temperature} 的 pH 為 ${fmtPH(pH)}，且該溫度 pK_w=${condition.pKwText}。它呈何性？`,
                    `已知 ${temperature} 下 pK_w=${condition.pKwText}。一份溶液的 pH=${fmtPH(pH)}，請判斷酸鹼性。`
                ]);

                questionSet({
                    template:'acidity-ph-from-kw-derived-neutral-point', factId:`${condition.id}-kw-ph-${index}`,
                    answer:pHClass, distractors:classWrong(pHClass), type:'酸鹼性判斷｜由 Kw 推得 pKw 與中性 pH',
                    basis:`先由 pK_w=−log K_w 求出 pK_w，再用中性時 pH=pK_w/2。`,
                    steps:`pK_w=−log(${condition.kwText})≈${condition.pKwText}；中性 pH≈${condition.pKwText}/2=${fmtPH(neutralPH)}。題給 pH=${fmtPH(pH)}，${pHClass === '酸性' ? '低於' : pHClass === '鹼性' ? '高於' : '等於'}中性 pH，因此判為${pHClass}。`,
                    conclusion:`該溶液呈${pHClass}。`, misconception:'不要只背中性 pH=7；先由當下溫度的 Kw 求 pKw，再除以 2 得中性點。'
                }, [
                    `${temperature} 時 K_w=${condition.kwText}。某溶液 pH=${fmtPH(pH)}，不預設 pK_w，判斷其酸鹼性。`,
                    `已知 ${temperature} 時 K_w=${condition.kwText}，一份溶液的 pH 為 ${fmtPH(pH)}。先由 K_w 找出中性 pH，再判斷溶液性質。`,
                    `某溫度下水的離子積為 ${condition.kwText}，溶液 pH=${fmtPH(pH)}。此溶液為酸性、中性或鹼性？`
                ]);

                const pOH = Number((condition.pKw - pH).toFixed(2));
                const pOHClass = pOH > neutralPH + 0.001 ? '酸性' : pOH < neutralPH - 0.001 ? '鹼性' : '中性';
                questionSet({
                    template:'acidity-poh-vs-pkw-half', factId:`${condition.id}-poh-${index}`,
                    answer:pOHClass, distractors:classWrong(pOHClass), type:'酸鹼性判斷｜pOH 與 pKw/2 比較',
                    basis:`中性時 pOH=pK_w/2=${fmtPH(neutralPH)}；pOH 高於此值代表 [OH⁻] 較低。`,
                    steps:`比較 pOH=${fmtPH(pOH)} 與 pK_w/2=${fmtPH(neutralPH)}。${pOHClass === '酸性' ? 'pOH 較大，[OH⁻] 較小，因此偏酸。' : pOHClass === '鹼性' ? 'pOH 較小，[OH⁻] 較大，因此偏鹼。' : 'pOH 等於中性基準。'}`,
                    conclusion:`此溶液為${pOHClass}。`, misconception:'pOH 的判斷方向與 pH 相反：pOH 大於 pKw/2 為酸性，小於 pKw/2 為鹼性。'
                }, [
                    `在 ${pKwContext} 下，某溶液 pOH=${fmtPH(pOH)}。判斷溶液酸鹼性。`,
                    `一份溶液在 ${temperature} 時 pOH 為 ${fmtPH(pOH)}，且 pK_w=${condition.pKwText}。此溶液呈何性？`,
                    `已知 ${temperature} 下 pK_w=${condition.pKwText}；若 pOH=${fmtPH(pOH)}，溶液屬於哪一類？`
                ]);

                const comboAnswer = `pOH ${fmtPH(pOH)}，${pOHClass}`;
                const comboWrong = unique([
                    `pOH ${fmtPH(pH)}，${pOHClass}`,
                    `pOH ${fmtPH(pOH)}，${pOHClass === '酸性' ? '鹼性' : pOHClass === '鹼性' ? '酸性' : '酸性'}`,
                    `pOH ${fmtPH(pOH + 1)}，${pOHClass}`,
                    `pOH ${fmtPH(pOH - 1)}，${pOHClass === '中性' ? '鹼性' : '中性'}`
                ]);
                questionSet({
                    template:'acidity-pH-pOH-pKw-conversion', factId:`${condition.id}-convert-${index}`,
                    answer:comboAnswer, distractors:comboWrong, type:'酸鹼性判斷｜pH、pOH 與 pKw 互換',
                    basis:`任一溫度下 pH+pOH=pK_w=${condition.pKwText}；中性點為 pK_w/2=${fmtPH(neutralPH)}。`,
                    steps:`pOH=pK_w−pH=${condition.pKwText}−${fmtPH(pH)}=${fmtPH(pOH)}。再比較 pOH 與 pK_w/2=${fmtPH(neutralPH)}，判定為${pOHClass}。`,
                    conclusion:`pOH 約為 ${fmtPH(pOH)}，溶液呈${pOHClass}。`, misconception:'非 25°C 時 pH+pOH=pKw，不一定等於 14；先求 pOH，再與 pKw/2 比較。'
                }, [
                    `${temperature} 時某溶液 pH=${fmtPH(pH)}，已知 pK_w=${condition.pKwText}。先求 pOH，再判斷酸鹼性。`,
                    `在 pK_w=${condition.pKwText} 的溫度下，若 pH=${fmtPH(pH)}，下列哪組 pOH 與酸鹼性判斷正確？`,
                    `某溫度的 pK_w=${condition.pKwText}。一份溶液 pH=${fmtPH(pH)}，求其 pOH 及溶液性質。`
                ]);
            });
        });
        return out;
    }

    function buildIndicators() {
        const out = [];
        if (!((DATA().indicators || []).length)) return out;
        const indicators = DATA().indicators;
        const methyl = indicators.find(x => x.id === 'indicator-methyl-orange');
        const btb = indicators.find(x => x.id === 'indicator-btb');
        const phenol = indicators.find(x => x.id === 'indicator-phenolphthalein');
        if (!methyl || !btb || !phenol) return out;
        const ranges = [
            { label:'pH＜3.1', mid:2.5 }, { label:'3.1＜pH＜4.4', mid:3.7 },
            { label:'4.4＜pH＜6.0', mid:5.2 }, { label:'6.0＜pH＜7.6', mid:6.8 },
            { label:'7.6＜pH＜8.2', mid:7.9 }, { label:'8.2＜pH＜10.0', mid:9.0 }, { label:'pH＞10.0', mid:11 }
        ];
        const color = (item, pH) => {
            if (item === methyl) return pH < 3.1 ? '紅色' : pH < 4.4 ? '橙色' : '黃色';
            if (item === btb) return pH < 6 ? '黃色' : pH < 7.6 ? '綠色' : '藍色';
            if (item === phenol) return pH < 8.2 ? '無色' : pH < 10 ? '淡粉紅色' : '粉紅色';
            return '未知';
        };
        const triplets = [[methyl, btb], [methyl, phenol], [btb, phenol]];
        triplets.forEach((pair, pairIndex) => {
            const signatures = new Map();
            ranges.forEach((range, index) => {
                const signature = pair.map(indicator => `${indicator.name}：${color(indicator, range.mid)}`).join('；');
                if (!signatures.has(signature)) signatures.set(signature, []);
                signatures.get(signature).push({ range, index });
            });
            [...signatures.entries()].forEach(([signature, matches], sigIndex) => {
                // 若同組顏色對應多段 pH，保留為多解區間題，不偽裝成唯一答案。
                const answer = matches.map(x => x.range.label).join(' 或 ');
                const plausible = ranges.filter(x => !matches.some(m => m.index === ranges.indexOf(x))).map(x => x.label);
                const distractors = itemCandidates(answer, plausible, 3);
                const stems = [
                    `同一份溶液分別加入 ${pair[0].name}、${pair[1].name}，觀察為「${signature}」。依變色範圍，pH 可能落在哪一區？`,
                    `實驗記錄顯示 ${signature}。綜合兩項指示劑結果，哪個 pH 範圍與觀察相容？`,
                    `已知 ${pair[0].range}；另知 ${pair[1].range}。若兩種指示劑呈現 ${signature}，可將 pH 限定在哪個範圍？`
                ];
                addStyled(out, {
                    template:'combined-indicator-interval', factId:`ind-combo-${pairIndex}-${sigIndex}`,
                    answer, distractors, type:'指示劑｜多觀察條件交集', displayMode:'text',
                    basis:`每一種指示劑只提供 pH 的區間限制；要取兩項觀察所允許範圍的交集。`,
                    steps:`依資料表逐一定位：${signature}。${matches.length > 1 ? '這組顏色仍容許多段 pH，因此答案列出所有相容區間。' : `兩項限制的交集為 ${answer}。`}`,
                    conclusion:`符合觀察的範圍為 ${answer}。`,
                    misconception:'單一指示劑的顏色通常只限制 pH 區間；不要把顏色直接等同於酸性、中性或鹼性的唯一值。'
                }, stems);
            });
        });
        return out;
    }

    function buildConcentration(subtype) {
        const out = [];
        const emit = (template, id, stems, answer, wrong, basis, steps, mistake) => {
            const values = unique(wrong.map(String).filter(v => key(v) !== key(String(answer))));
            if (values.length < 2) return;
            const reasons = Object.fromEntries(values.map(v => [key(v), `選擇 ${v} 與題目條件不符。${mistake} ${steps}`]));
            addStyled(out, {template, factId:id, answer:String(answer), distractors:values, type:`濃度與溶解度｜${template}`, basis, steps, conclusion:`答案為 ${answer}。`, misconception:mistake, optionRationales:reasons}, stems);
        };
        const calc = (template, id, stems, answer, unit, steps, mistake) => {
            const a=Number(answer), fmt=x=>`${num(x)}${unit}`;
            emit(template,id,stems,fmt(a),[fmt(a*2),fmt(a/2),fmt(a*10),fmt(a/10)],'依題目指定的量綱列式，再核對溶質、溶劑與溶液。',steps,mistake);
        };
        if (subtype==='expressions') {
            const formulas=[
                {id:'molarity',name:'莫耳濃度', formula:'溶質莫耳數／溶液體積（L）',unit:'mol/L 溶液'},
                {id:'molality',name:'重量莫耳濃度',formula:'溶質莫耳數／溶劑質量（kg）',unit:'mol/kg 溶劑'},
                {id:'masspercent',name:'重量百分濃度',formula:'溶質質量／溶液質量×100%',unit:'g 溶質／100 g 溶液'},
                {id:'volumepercent',name:'體積百分濃度',formula:'溶質體積／溶液體積×100%',unit:'mL 溶質／100 mL 溶液'},
                {id:'massvolume',name:'質量體積百分濃度',formula:'溶質質量（g）／溶液體積（mL）×100%',unit:'g 溶質／100 mL 溶液'},
                {id:'massconcentration',name:'質量濃度',formula:'溶質質量（g）／溶液體積（L）',unit:'g 溶質／L 溶液'},
                {id:'fraction',name:'溶質莫耳分率',formula:'溶質莫耳數／總莫耳數',unit:'無單位'},
                {id:'ppm',name:'質量 ppm',formula:'溶質質量／溶液質量×10⁶',unit:'mg 溶質／kg 溶液'}
            ];
            formulas.forEach(f=>{
                emit('濃度名稱→公式',f.id,[`${f.name}的公式為何？`,`哪個式子表示${f.name}？`],f.formula,formulas.map(x=>x.formula),'先辨識分子及分母。',`${f.name}＝${f.formula}。`,'溶液與溶劑不同，莫耳數與質量也不可混用。');
                emit('公式→濃度名稱',f.id,[`${f.formula}，代表何種濃度？`,`哪種濃度可用「${f.formula}」表示？`],f.name,formulas.map(x=>x.name),'由公式的分子、分母與倍率辨認。',`${f.formula} 定義的是${f.name}。`,'注意是每公斤溶劑還是每公升溶液。');
                emit('濃度名稱→單位',f.id,[`${f.name}可使用哪個單位？`,`下列何者是${f.name}的表示方式？`],f.unit,formulas.map(x=>x.unit),'單位反映公式的分子與分母。',`${f.name}可表示為 ${f.unit}。`,'莫耳分率無單位，溶液體積與溶劑質量不能互換。');
                emit('單位→濃度名稱',f.id,[`「${f.unit}」可表示哪一種濃度？`,`下列何種濃度使用 ${f.unit}？`],f.name,formulas.map(x=>x.name),'逐一比對單位與定義。',`${f.unit} 對應${f.name}。`,'先核對單位中的溶質、溶劑及溶液。');
            });
            const solutes=[{id:'NaCl',name:'食鹽',formula:'NaCl',mw:58.5},{id:'NaOH',name:'氫氧化鈉',formula:'NaOH',mw:40},{id:'glucose',name:'葡萄糖',formula:'C₆H₁₂O₆',mw:180}];
            solutes.forEach(s=>[0.07,0.12,0.18,0.35,0.48].forEach((n,i)=>[0.24,0.35,0.6,0.85].forEach((v,j)=>{
                const m=n*s.mw, c=n/v, id=`${s.id}-${i}-${j}`, label=(i+j)%2?s.name:s.formula;
                calc('質量與體積→莫耳濃度',id,[`${num(m)} g ${label}配成 ${num(v*1000)} mL 溶液，濃度為何？（莫耳質量 ${s.mw} g/mol）`,`溶解 ${num(m)} g ${label}並定容至 ${num(v*1000)} mL，求莫耳濃度。（莫耳質量 ${s.mw} g/mol）`],c,' M',`n=${num(m)}÷${s.mw}=${num(n)} mol；C=${num(n)}÷${v}=${num(c)} M。`,'mL 須換成 L，且應用溶液的最終體積。');
                calc('莫耳濃度→溶質質量',id,[`配製 ${num(v*1000)} mL、${num(c)} M ${label}溶液需幾克？（莫耳質量 ${s.mw} g/mol）`,`要配製 ${num(v*1000)} mL 的 ${num(c)} M ${label}，應稱取多少克？（莫耳質量 ${s.mw} g/mol）`],m,' g',`n=CV=${num(c)}×${v}=${num(n)} mol；質量=${num(n)}×${s.mw}=${num(m)} g。`,'先由濃度乘以公升數求莫耳數，再乘莫耳質量。');
                calc('質量與莫耳濃度→體積',id,[`${num(m)} g ${label}配成 ${num(c)} M，需定容至幾 mL？（莫耳質量 ${s.mw} g/mol）`,`將 ${num(m)} g ${label}配為 ${num(c)} M，溶液體積是多少 mL？（莫耳質量 ${s.mw} g/mol）`],v*1000,' mL',`n=${num(m)}÷${s.mw}=${num(n)} mol；V=n/C=${num(n)}÷${num(c)}=${v} L=${v*1000} mL。`,'先以質量除莫耳質量，再以莫耳數除濃度。');
            })));
            [0.07,0.12,0.18,0.27].forEach((w,i)=>[0.24,0.35,0.6,0.85].forEach((kg,j)=>{
                const sol=kg*1000*w/(1-w), total=kg*1000+sol, id=`${i}-${j}`;
                calc('質量→重量百分率',id,[`${num(sol)} g 溶質溶於 ${num(kg*1000)} g 水，重量百分濃度為何？`,`將 ${num(sol)} g 溶質加入 ${num(kg*1000)} g 水，求重量百分濃度。`],w*100,'%',`溶液質量=${num(sol)}+${kg*1000}=${num(total)} g；百分濃度=${num(sol)}÷${num(total)}×100%=${num(w*100)}%。`,'重量百分濃度的分母是溶液總質量。');
                calc('重量百分率→溶質質量',id,[`${num(total)} g、${num(w*100)}%（w/w）溶液含幾克溶質？`,`重量濃度 ${num(w*100)}% 的溶液 ${num(total)} g，溶質多少克？`],sol,' g',`溶質質量=${num(total)}×${num(w)}=${num(sol)} g。`,'百分比須以溶液總質量為基準。');
            }));
            [12,17.5,28,35].forEach((percent,i)=>[125,240,375,650].forEach((vol,j)=>{
                const amount=percent*vol/100,id=`${i}-${j}`;
                for(const [kind,u] of [['體積百分濃度','mL'],['質量體積百分濃度','g']]){
                    calc(`${kind}→溶質量`,id,[`${vol} mL 的 ${percent}% ${kind}溶液，含溶質多少 ${u}？`,`要配製 ${vol} mL、${percent}% 的${kind}溶液，需溶質多少 ${u}？`],amount,` ${u}`,`${percent}% 表示每 100 mL 溶液含 ${percent} ${u} 溶質；${vol} mL 含 ${num(amount)} ${u}。`,'百分濃度的分母是最終溶液體積。');
                    calc(`溶質量→${kind}`,id,[`${amount} ${u} 溶質配成 ${vol} mL 溶液，其${kind}為何？`,`將 ${amount} ${u} 溶質配製成 ${vol} mL，求${kind}。`],percent,'%',`${amount}÷${vol}×100%=${percent}%。`,'先確認質量或體積的表示基準。');
                }
            }));
            [0.07,0.12,0.18,0.35,0.48].forEach((n,i)=>[0.24,0.35,0.6,0.85].forEach((kg,j)=>{
                const molality=n/kg, x=n/(n+kg*1000/18),id=`${i}-${j}`;
                calc('莫耳數與溶劑→重量莫耳濃度',id,[`${num(n)} mol 溶質溶於 ${kg*1000} g 水，重量莫耳濃度為何？`,`將 ${num(n)} mol 溶質加入 ${kg*1000} g 水，求重量莫耳濃度。`],molality,' mol/kg',`${kg*1000} g=${kg} kg；m=${num(n)}÷${kg}=${num(molality)} mol/kg。`,'重量莫耳濃度用溶劑質量且單位為 kg。');
                calc('重量莫耳濃度→溶質莫耳數',id,[`${kg*1000} g 水配成 ${num(molality)} mol/kg 溶液，含溶質幾 mol？`,`溶劑為 ${kg*1000} g 水、重量莫耳濃度 ${num(molality)} mol/kg，求溶質莫耳數。`],n,' mol',`n=m×溶劑 kg=${num(molality)}×${kg}=${num(n)} mol。`,'重量莫耳濃度需乘溶劑的公斤數。');
                calc('重量莫耳濃度→莫耳分率',id,[`水溶液重量莫耳濃度為 ${num(molality)} mol/kg，溶質莫耳分率約為何？（水 18 g/mol）`,`某水溶液為 ${num(molality)} mol/kg，求溶質莫耳分率。（水 18 g/mol）`],x,'',`取 ${kg} kg 水：溶質 ${num(n)} mol，水 ${num(kg*1000/18)} mol；分率=${num(n)}÷(${num(n)}+${num(kg*1000/18)})≈${num(x)}。`,'莫耳分率分母須包含全部成分的莫耳數。');
                calc('莫耳分率→重量莫耳濃度',id,[`水溶液溶質莫耳分率約 ${num(x)}，重量莫耳濃度約為何？（水 18 g/mol）`,`溶質莫耳分率約 ${num(x)} 的水溶液，重量莫耳濃度約為多少？（水 18 g/mol）`],molality,' mol/kg',`設溶液總量為 1 mol，水為 1−${num(x)} mol；m≈${num(x)}÷[(1−${num(x)})×0.018]=${num(molality)} mol/kg。`,'由分率先還原溶質與溶劑莫耳比，再換算溶劑公斤數。');
            }));
            [0.08,0.17,0.28,0.43].forEach((x,i)=>[0.75,1.4,2.5,3.2].forEach((total,j)=>{
                const n=x*total,id=`${i}-${j}`;
                calc('莫耳數→莫耳分率',id,[`溶液含 ${num(n)} mol 溶質及 ${num(total-n)} mol 溶劑，溶質莫耳分率為何？`,`溶質 ${num(n)} mol、溶劑 ${num(total-n)} mol，求溶質莫耳分率。`],x,'',`x=${num(n)}÷(${num(n)}+${num(total-n)})=${num(x)}。`,'分母是溶質與溶劑的莫耳數總和。');
                calc('莫耳分率→溶質莫耳數',id,[`溶質莫耳分率 ${x}，總莫耳數 ${total} mol；溶質有幾 mol？`,`混合液共 ${total} mol，溶質分率 ${x}，溶質為多少 mol？`],n,' mol',`溶質莫耳數=${x}×${total}=${num(n)} mol。`,'莫耳分率要乘總莫耳數。');
            }));
            [3,12,35,120].forEach((ppm,i)=>[0.75,2.4,3.5].forEach((kg,j)=>{
                const mg=ppm*kg,id=`${i}-${j}`;
                calc('質量→ppm',id,[`${kg} kg 溶液含 ${mg} mg 溶質，為幾 ppm（質量比）？`,`溶液 ${kg} kg 含溶質 ${mg} mg，求質量 ppm。`],ppm,' ppm',`${mg} mg÷${kg} kg=${ppm} mg/kg=${ppm} ppm。`,'質量 ppm 以溶液的總質量為分母。');
                calc('ppm→溶質質量',id,[`${kg} kg 溶液為 ${ppm} ppm（質量比），含溶質多少 mg？`,`質量濃度 ${ppm} ppm 的 ${kg} kg 溶液中，溶質為幾 mg？`],mg,' mg',`${ppm} mg/kg×${kg} kg=${mg} mg。`,'1 ppm（質量比）等於 1 mg/kg 溶液。');
            }));
            [0.12,0.18,0.25,0.32].forEach((w,i)=>[1.03,1.12,1.18,1.25].forEach((density,j)=>{
                const mw=40, molarity=w*density*1000/mw, molality=w*1000/(mw*(1-w)),id=`${i}-${j}`;
                calc('重量百分率→莫耳濃度',id,[`NaOH 溶液 ${w*100}%（w/w），密度 ${density} g/mL。求莫耳濃度。（NaOH：40 g/mol）`,`氫氧化鈉水溶液 ${w*100}%（w/w）、密度 ${density} g/mL，求莫耳濃度。（莫耳質量 40 g/mol）`],molarity,' M',`取 1 L 溶液，質量=${density}×1000 g；溶質=${num(w*density*1000)} g；C=${num(w*density*1000)}÷40=${num(molarity)} M。`,'百分率以溶液質量為分母；轉莫耳濃度需使用密度。');
                calc('莫耳濃度→重量百分率',id,[`NaOH 水溶液 ${num(molarity)} M、密度 ${density} g/mL，重量百分濃度為何？（NaOH：40 g/mol）`,`氫氧化鈉溶液 ${num(molarity)} M、密度 ${density} g/mL，求重量百分率。（莫耳質量 40 g/mol）`],w*100,'%',`1 L 溶液含 ${num(molarity)} mol，即 ${num(molarity*40)} g；溶液質量 ${density*1000} g，百分率=${num(w*100)}%。`,'質量百分率必須用溶液總質量作分母。');
                calc('莫耳濃度→重量莫耳濃度',id,[`NaOH 水溶液 ${num(molarity)} M、密度 ${density} g/mL，重量莫耳濃度約為何？（NaOH：40 g/mol）`,`氫氧化鈉溶液 ${num(molarity)} M、密度 ${density} g/mL，求重量莫耳濃度。（莫耳質量 40 g/mol）`],molality,' mol/kg',`取 1 L 溶液，溶質 ${num(molarity)} mol，其質量 ${num(molarity*40)} g；水質量=${density*1000}−${num(molarity*40)} g，故 m≈${num(molality)} mol/kg。`,'先用密度求溶液質量，再減去溶質質量以求溶劑公斤數。');
                calc('重量莫耳濃度→莫耳濃度',id,[`NaOH 水溶液 ${num(molality)} mol/kg、密度 ${density} g/mL，莫耳濃度約為何？（NaOH：40 g/mol）`,`氫氧化鈉溶液 ${num(molality)} mol/kg、密度 ${density} g/mL，求莫耳濃度。（莫耳質量 40 g/mol）`],molarity,' M',`取 1 kg 水，溶質 ${num(molality)} mol，總質量≈${num(1000+molality*40)} g；除以密度得溶液體積，故 C≈${num(molarity)} M。`,'重量莫耳濃度的分母是溶劑質量，計算莫耳濃度前須用密度轉為溶液體積。');
                calc('重量百分率→重量莫耳濃度',id,[`NaOH 水溶液 ${w*100}%（w/w），重量莫耳濃度為何？（NaOH：40 g/mol）`,`氫氧化鈉溶液重量百分濃度 ${w*100}%，求重量莫耳濃度。（莫耳質量 40 g/mol）`],molality,' mol/kg',`取 100 g 溶液，溶質 ${w*100} g，水 ${(1-w)*100} g；m=(${w*100}÷40)÷${num((1-w)/10)}=${num(molality)} mol/kg。`,'重量莫耳濃度的分母是溶劑質量，不是溶液質量。');
                calc('重量莫耳濃度→重量百分率',id,[`NaOH 水溶液 ${num(molality)} mol/kg，重量百分濃度約為何？（NaOH：40 g/mol）`,`氫氧化鈉溶液 ${num(molality)} mol/kg，求重量百分率。（莫耳質量 40 g/mol）`],w*100,'%',`取 1 kg 水，溶質質量約 ${num(molality)}×40=${num(molality*40)} g；溶質除以溶液總質量，百分率≈${num(w*100)}%。`,'重量百分濃度要除以溶劑和溶質的總質量。');
            }));
        }
        if (subtype==='influence') {
            const facts=[
                {id:'heat',condition:'密閉溶液加熱且體積增加',changed:'莫耳濃度',stable:['重量百分濃度','重量莫耳濃度','莫耳分率'],rule:'溶液體積增加而溶質莫耳數不變，因此莫耳濃度下降；質量、莫耳數及其比值不變。'},
                {id:'water',condition:'向未飽和水溶液加水',changed:'重量百分濃度',stable:['溶質質量','溶質莫耳數','溶質粒子數'],rule:'加水使溶液總質量增加、溶質質量不變，重量百分濃度下降。'},
                {id:'evaporate',condition:'未飽和溶液僅蒸發部分水',changed:'重量百分濃度',stable:['溶質質量','溶質莫耳數','溶質粒子數'],rule:'水減少而溶質質量不變，溶液質量下降，重量百分濃度增加。'},
                {id:'dilute',condition:'溶液加水稀釋且無物質流失',changed:'溶質莫耳分率',stable:['溶質質量','溶質莫耳數','溶質粒子數'],rule:'加水增加溶劑莫耳數，溶質莫耳數不變，因此溶質莫耳分率下降。'}
            ];
            facts.forEach(f=>{
                emit('條件→改變',f.id,[`${f.condition}，下列何者改變？`,`${f.condition}時，哪個量會變化？`],f.changed,f.stable,'將改變前後的溶質量與分母逐一比較。',f.rule,'分清增加的是溶劑、溶液體積還是溶質。');
                f.stable.forEach((s,i)=>emit('條件→不變',`${f.id}-${i}`,[`${f.condition}，下列何者不變？`,`${f.condition}時，哪個量維持不變？`],s,[f.changed, f.id==='heat'?'質量濃度':'溶液總質量',f.id==='heat'?'溶液體積':'溶劑質量'],'依指定變化比較各量。',`${f.rule} ${s}在此條件下保持不變。`,'需依題目條件判斷，不可只依濃度名稱猜測。'));
            });
        }
        if(subtype==='atomicStandard'){
            const shifts=[{old:12,next:24},{old:12,next:18},{old:12,next:36},{old:12,next:30}];
            shifts.forEach(({old,next},i)=>{
                const ratio=next/old;
                emit('原子量標準改變→濃度數值',`affected-${i}`,
                    [`溶液實際質量不變，原子量標準由 ${old} 改為 ${next}；哪種濃度數值會改變？`,`原子量標準 ${old}→${next}，同一溶液的質量百分率、重量莫耳濃度、質量 ppm，何者數值改變？`],
                    '重量莫耳濃度',['重量百分率','質量 ppm','質量體積百分率'],
                    '相對原子量標準改變會按比例改變莫耳質量；質量基準濃度不依賴莫耳數。',
                    `標準值放大 ${num(ratio)} 倍時，同一溶質質量所代表的莫耳數按反比改變；重量莫耳濃度因此改變。質量百分率與質量 ppm 只由質量比決定。`,
                    '分清以莫耳數為基準的濃度與以質量比為基準的濃度。');
            });
            [{old:12,next:24,m:3},{old:12,next:18,m:2.7},{old:12,next:36,m:4.5},{old:12,next:30,m:3.6}].forEach(({old,next,m},i)=>{
                const result=m*old/next,id=`molality-${i}`;
                calc('原子量標準改變→重量莫耳濃度',id,
                    [`¹²C 原子量標準由 ${old} 改為 ${next}，原重量莫耳濃度 ${num(m)} m。新數值為何？`,`原為 ${num(m)} m；若 ¹²C 標準 ${old}→${next}，重量莫耳濃度變為多少？`],
                    result,' m',`莫耳質量按標準倍率 ${num(next/old)} 改變；固定溶質質量下，莫耳數反比改變。新 m=${num(m)}×${old}/${next}=${num(result)} m。`,
                    '莫耳數和重量莫耳濃度都與莫耳質量成反比。');
            });
        }
        if(subtype==='dilution'){
            const cases=[
                {c:1.8,v:20,v2:50},{c:1.25,v:48,v2:125},{c:2.4,v:35,v2:90},
                {c:1.6,v:75,v2:240},{c:0.85,v:120,v2:300},{c:2.75,v:32,v2:140},
                {c:3.2,v:45,v2:180},{c:0.72,v:85,v2:250},{c:1.35,v:64,v2:160},
                {c:2.1,v:28,v2:115},{c:0.95,v:150,v2:420},{c:1.45,v:55,v2:210}
            ];
            cases.forEach(({c,v,v2:finalV},i)=>{
                const c2=c*v/finalV,id=`${i}`;
                calc('稀釋→濃度',id,[`${v} mL、${c} M 原液定容至 ${finalV} mL，濃度為何？`,`將 ${v} mL ${c} M 溶液稀釋至 ${finalV} mL，求濃度。`],c2,' M',`溶質莫耳數不變；C₂=C₁V₁/V₂=${c}×${v}/${finalV}=${num(c2)} M。`,'定容體積是最終體積，並非加水量。');
                calc('目標濃度→原液體積',id,[`配製 ${finalV} mL、${num(c2)} M 溶液，需取 ${c} M 原液多少 mL？`,`用 ${c} M 原液配成 ${finalV} mL、${num(c2)} M，取原液幾 mL？`],v,' mL',`V₁=C₂V₂/C₁=${num(c2)}×${finalV}/${c}=${v} mL。`,'使用稀釋前後溶質莫耳數相等。');
                calc('稀釋→加水量',id,[`${v} mL ${c} M 原液稀釋為 ${num(c2)} M，體積可加，需加水多少 mL？`,`將 ${v} mL、${c} M 溶液稀釋至 ${num(c2)} M，體積可加，需加水多少？`],finalV-v,' mL',`V₂=${v}×${c}/${num(c2)}=${finalV} mL；加水量=${finalV}−${v}=${finalV-v} mL。`,'加水量等於最終體積減原液體積。');
            });
        }
        if(subtype==='mixing'){
            const cases=[
                {c1:.8,v1:75,c2:1.4,v2:125},{c1:1.25,v1:120,c2:.65,v2:80},
                {c1:2.4,v1:35,c2:.9,v2:165},{c1:.72,v1:240,c2:1.85,v2:60},
                {c1:1.6,v1:85,c2:2.3,v2:115},{c1:.95,v1:140,c2:1.55,v2:90},
                {c1:2.75,v1:48,c2:.8,v2:152},{c1:1.15,v1:225,c2:2.4,v2:75}
            ];
            cases.forEach(({c1,v1,c2,v2},i)=>{
                const final=(c1*v1+c2*v2)/(v1+v2),id=`${i}`;
                calc('混合→莫耳濃度',id,[`${v1} mL、${c1} M NaCl 與 ${v2} mL、${c2} M NaCl 混合，體積可加，濃度為何？`,`食鹽水 ${c1} M ${v1} mL 與 ${c2} M ${v2} mL 混合，體積可加，求濃度。`],final,' M',`C=(${c1}×${v1}+${c2}×${v2})/(${v1}+${v2})=${num(final)} M。`,'先加總溶質莫耳數，再除以總體積。');
                calc('混合濃度→體積',id,[`${v1} mL、${c1} M NaCl 與 ${c2} M NaCl 混合成 ${num(final)} M，體積可加，需後者多少 mL？`,`食鹽水 ${c1} M ${v1} mL 加入 ${c2} M 溶液後為 ${num(final)} M，體積可加，後者幾 mL？`],v2,' mL',`由 ${c1}×${v1}+${c2}V=${num(final)}(${v1}+V)，解得 V≈${v2} mL。`,'需考慮兩溶液體積與溶質莫耳數。');
            });
        }
        if(subtype==='changes'){
            const cases=[
                {total:180,w:.12,water:25},{total:275,w:.18,water:45},{total:420,w:.25,water:80},
                {total:350,w:.14,water:62},{total:240,w:.22,water:36},{total:525,w:.16,water:95},
                {total:165,w:.28,water:24},{total:460,w:.11,water:72},{total:315,w:.24,water:55}
            ];
            cases.forEach(({total,w,water},i)=>{
                const sol=total*w, id=`${i}`;
                calc('蒸發→濃度',id,[`${total} g、${w*100}% 食鹽水蒸發 ${water} g 水，全部食鹽仍溶解，濃度為何？`,`將 ${total} g、${w*100}% 食鹽水蒸發 ${water} g 水，無固體析出；求重量百分率。`],sol/(total-water)*100,'%',`溶質=${total}×${w}=${sol} g；溶液剩 ${total-water} g，濃度=${sol}/${total-water}×100%=${num(sol/(total-water)*100)}%。`,'蒸發後分母要扣除水，溶質質量不變。');
                const target=sol/(total+water)*100;
                calc('加水→濃度',id,[`${total} g、${w*100}% 食鹽水加 ${water} g 水，濃度為何？`,`重量濃度 ${w*100}% 的 ${total} g 食鹽水，加入 ${water} g 水後為多少％？`],target,'%',`溶質 ${sol} g 不變，溶液質量=${total}+${water}=${total+water} g；濃度=${num(target)}%。`,'加水後溶質不變，溶液總質量增加。');
                calc('目標濃度→加水量',id,[`${total} g、${w*100}% 食鹽水稀釋至 ${num(target)}%，需加水多少克？`,`將 ${total} g、${w*100}% 食鹽水調為 ${num(target)}%，應加水幾克？`],water,' g',`溶質 ${sol} g；最終溶液約 ${sol}/(${num(target)}/100)=${total+water} g，故加水約 ${water} g。`,'先固定溶質質量，再反求最終溶液質量。');
                calc('加入溶質→濃度',id,[`${total} g、${w*100}% 食鹽水加入 ${water} g 食鹽並全部溶解，重量百分濃度約為何？`,`向 ${total} g、${w*100}% 食鹽水加入 ${water} g 食鹽並完全溶解，求重量百分率。`],(sol+water)/(total+water)*100,'%',`溶質由 ${sol} g 增至 ${sol+water} g，溶液質量增至 ${total+water} g；濃度≈${num((sol+water)/(total+water)*100)}%。`,'加入溶質時分子與分母都增加。');
            });
        }
        if(subtype==='solubility'||subtype==='saturation'){
            const cases=[
                {cold:23,difference:7,water:85},{cold:37,difference:13,water:125},
                {cold:46,difference:18,water:180},{cold:58,difference:27,water:240},
                {cold:31,difference:16,water:135},{cold:64,difference:11,water:275},
                {cold:42,difference:23,water:95},{cold:75,difference:19,water:160},
                {cold:28,difference:9,water:225},{cold:53,difference:32,water:115}
            ];
            cases.forEach(({cold,difference,water},i)=>{
                const hot=cold+difference, dissolved=cold*water/100, crystal=difference*water/100,id=`${i}`;
                if(subtype==='solubility'){
                    calc('溶解度→飽和溶質量',id,[`某固體溶解度為 ${cold} g／100 g 水。${water} g 水最多溶解多少克？`,`溶解度 ${cold} g／100 g 水，${water} g 水可溶多少克至飽和？`],dissolved,' g',`最大溶解量=${cold}×${water}/100=${num(dissolved)} g。`,'溶解度的分母是水，不是飽和溶液。');
                    calc('飽和溶質量→水量',id,[`某固體溶解度 ${cold} g／100 g 水，溶解 ${num(dissolved)} g 至少需多少克水？`,`溶解 ${num(dissolved)} g 固體，溶解度 ${cold} g／100 g 水；至少需多少克水？`],water,' g',`水量=${num(dissolved)}×100/${cold}=${water} g。`,'用溶質量與溶解度反求水量。');
                    calc('溶解度→飽和重量百分率',id,[`固體溶解度 ${cold} g／100 g 水，飽和溶液重量百分濃度約為何？`,`溶解度 ${cold} g／100 g 水，求飽和溶液的重量百分率。`],cold/(100+cold)*100,'%',`取 100 g 水與 ${cold} g 溶質；濃度=${cold}/(${cold}+100)×100%≈${num(cold/(100+cold)*100)}%。`,'飽和溶液質量包含水及已溶解溶質。');
                    calc('飽和重量百分率→溶解度',id,[`飽和溶液為 ${num(cold/(100+cold)*100)}%（w/w），溶解度約為多少 g／100 g 水？`,`飽和水溶液濃度 ${num(cold/(100+cold)*100)}%，溶解度約為多少 g／100 g 水？`],cold,' g',`取 100 g 溶液，溶質 ${num(cold/(100+cold)*100)} g，其餘為水；溶質/水×100≈${cold} g／100 g 水。`,'溶解度分母為溶劑，不能直接取百分率數值。');
                }else{
                    calc('冷卻飽和溶液→析晶量',id,[`溶解度由 ${hot} 降至 ${cold} g／100 g 水；${water} g 水的熱飽和溶液冷卻後析出幾克？`,`熱、冷溶解度分別為 ${hot}、${cold} g／100 g 水；${water} g 水的熱飽和溶液冷卻析出多少克？`],crystal,' g',`析出量=(${hot}−${cold})×${water}/100=${num(crystal)} g；假設水不蒸發。`,'應用溶解度差，而非直接使用冷卻後溶解度。');
                    calc('析晶量→水量',id,[`熱、冷溶解度為 ${hot}、${cold} g／100 g 水。熱飽和溶液冷卻析出 ${num(crystal)} g，水有幾克？`,`飽和溶液冷卻析出 ${num(crystal)} g，溶解度由 ${hot} 降至 ${cold} g／100 g 水，原含水幾克？`],water,' g',`水量=${num(crystal)}×100/(${hot}−${cold})=${water} g；假設水不蒸發。`,'先求每 100 g 水的溶解度差，再反求水量。');
                    const factor=[.35,.7,1,1.18,1.42,.82,1.08,.55,1.3,.92][i], added=dissolved*factor;
                    const state=factor<1?'未飽和，固體全溶':factor===1?'恰為飽和，無固體剩餘':'飽和，有固體剩餘';
                    const otherStates=['未飽和，固體全溶','恰為飽和，無固體剩餘','飽和，有固體剩餘'].filter(s=>s!==state);
                    emit('溶解度→飽和狀態',id,[`溶解度 ${cold} g／100 g 水。${water} g 水中加入 ${num(added)} g 溶質，充分攪拌後為何？`,`溶解度 ${cold} g／100 g 水，${water} g 水加入 ${num(added)} g 固體，狀態為何？`],state,otherStates,'先依溶解度換算該水量可溶上限，再與加入量比較。',`最多溶解 ${cold}×${water}/100=${num(dissolved)} g；加入 ${num(added)} g，${factor<1?'低於上限，全部溶解且未飽和。':factor===1?'恰等於上限，溶液飽和且無固體剩餘。':'高於上限，溶液飽和並有固體剩餘。'}`,'比較實際加入量與對應水量的最大溶解量。');
                }
            });
        }
        return out;
    }

    function buildMoles(subtype) {
        const out = [];
        const species = DATA().moleSpecies || [];
        const NA = 6.02e23;
        species.forEach(item => [0.25, 0.5, 1, 2].forEach((n, index) => {
            if (subtype === 'mole') {
                const mass = num(item.molarMass * n);
                appendQuestion(out, {
                    template: 'moles-to-mass', factId: item.id, variant: String(index),
                    question: `${n} mol ${item.formula} 的質量約為多少 g？`, answer: mass,
                    distractors: numericDistractors(mass, 'g', item.molarMass), type: '莫耳計算｜莫耳轉質量', displayMode: 'number',
                    basis: `${item.formula} 的莫耳質量為 ${item.molarMass} g·mol⁻¹。`,
                    steps: `m=nM=${n} mol×${item.molarMass} g·mol⁻¹=${mass} g。`, conclusion: `質量為 ${mass} g。`,
                    misconception: '質量要用莫耳數乘以莫耳質量，不是相除。'
                });
                const massInput = item.molarMass * n;
                appendQuestion(out, {
                    template: 'mass-to-moles', factId: item.id, variant: String(index),
                    question: `${massInput} g ${item.formula} 約為幾 mol？`, answer: num(n),
                    distractors: numericDistractors(n, 'mol', Math.max(0.1, n)), type: '莫耳計算｜質量轉莫耳', displayMode: 'number',
                    basis: `${item.formula} 的莫耳質量為 ${item.molarMass} g·mol⁻¹。`,
                    steps: `n=m/M=${massInput} g÷${item.molarMass} g·mol⁻¹=${num(n)} mol。`, conclusion: `物質的量為 ${num(n)} mol。`,
                    misconception: '質量轉莫耳數要以質量除以莫耳質量。'
                });
            } else if (subtype === 'particles') {
                const particleCount = n * NA;
                const scientific = Number(particleCount).toExponential(2).split('e');
                const answer = `${Number(scientific[0])}×10${superscript(Number(scientific[1]))}`;
                const wrongs = [particleCount / 2, particleCount * 2, n * 6.02e22, n * 9.65e4].map(value => {
                    const parts = Number(value).toExponential(2).split('e');
                    return `${Number(parts[0])}×10${superscript(Number(parts[1]))}`;
                });
                appendQuestion(out, {
                    template: 'moles-to-particles', factId: item.id, variant: String(index),
                    question: `${n} mol ${item.formula} 約含有多少個${item.particle}？`, answer,
                    distractors: wrongs, type: '莫耳計算｜莫耳轉粒子數', displayMode: 'text',
                    basis: '一莫耳含有約 6.02×10²³ 個指定粒子。',
                    steps: `N=nNₐ=${n}×6.02×10²³=${answer}。`, conclusion: `約有 ${answer} 個${item.particle}。`,
                    misconception: '需先辨認題目問的是分子、原子或化學式單位。'
                });
            }
        }));
        return out;
    }

    function buildStoich() {
        const out = [];
        (DATA().stoichiometry || []).forEach(reaction => {
            reaction.terms.forEach(([a, ca], i) => reaction.terms.slice(i + 1).forEach(([b, cb], j) => {
                const correct = ratio(ca, cb);
                const coefficientRatios = reaction.terms.map(([, c]) => c);
                const distractors = unique(['1:1', '1:2', '2:1', '2:3', '3:2', '3:4', ...coefficientRatios.flatMap(x => [`${x}:1`, `1:${x}`])]);
                appendQuestion(out, {
                    template: 'stoich-coefficient-ratio', factId: reaction.id, variant: `${i}-${j}`,
                    question: `依平衡反應式 ${reaction.equation}，${a} 與 ${b} 的莫耳比為何？`, answer: correct,
                    distractors, type: '反應化學計量｜係數比',
                    basis: '平衡反應式係數代表各物種的反應莫耳比。',
                    steps: `${a} 與 ${b} 的係數分別為 ${ca}、${cb}；取最簡整數比為 ${correct}。`,
                    conclusion: `莫耳比 ${a}:${b}=${correct}。`,
                    misconception: '配對順序依題目物種順序，最後將係數比約成最簡整數比。'
                });
                if ((ca !== cb) && out.length % 2 === 0) appendQuestion(out, {
                    template: 'stoich-reverse-ratio', factId: reaction.id, variant: `${i}-${j}`,
                    question: `反應 ${reaction.equation} 中，若 ${a} 為 ${ca} mol，依係數比需多少 mol ${b}？`,
                    answer: num(ca * cb / ca), distractors: numericDistractors(cb, 'mol', Math.max(1, cb)),
                    type: '反應化學計量｜莫耳量推算', displayMode: 'number',
                    basis: `${a} 與 ${b} 的係數比為 ${ca}:${cb}。`,
                    steps: `每 ${ca} mol ${a} 對應 ${cb} mol ${b}，所以所需 ${b} 為 ${cb} mol。`,
                    conclusion: `答案為 ${cb} mol ${b}。`, misconception: '反應係數比是物質的量比，不是質量比。'
                });
            }));
        });
        return out;
    }

    function buildSolutions(subtype) {
        const out = [];
        if (subtype === 'solution') {
            (DATA().concentrationCases || []).forEach(item => {
                const M = item.n / item.volume;
                appendQuestion(out, {
                    template: 'molarity-calc', factId: item.id,
                    question: `${item.n} mol 溶質配成 ${item.volume} L 溶液，莫耳濃度為何？`, answer: `${num(M)} M`,
                    distractors: numericDistractors(M, 'M', Math.max(0.1, M)), type: '溶液計算｜莫耳濃度', displayMode: 'number',
                    basis: '莫耳濃度定義為溶質莫耳數除以溶液體積。',
                    steps: `M=n/V=${item.n} mol÷${item.volume} L=${num(M)} mol·L⁻¹。`, conclusion: `濃度為 ${num(M)} M。`,
                    misconception: '體積須使用溶液體積，並以 L 作為單位。'
                });
                appendQuestion(out, {
                    template: 'molarity-solute-moles', factId: item.id,
                    question: `${num(M)} M 溶液取 ${item.volume} L，含有幾 mol 溶質？`, answer: `${num(item.n)} mol`,
                    distractors: numericDistractors(item.n, 'mol', Math.max(0.1, item.n)), type: '溶液計算｜濃度反推莫耳數', displayMode: 'number',
                    basis: '由 M=n/V 可得 n=MV。', steps: `n=MV=${num(M)} mol·L⁻¹×${item.volume} L=${num(item.n)} mol。`,
                    conclusion: `溶質物質的量為 ${num(item.n)} mol。`, misconception: '濃度乘以溶液體積才得到莫耳數。'
                });
            });
            (DATA().dilutionCases || []).forEach(item => {
                const finalM = item.initial * item.v1 / item.v2;
                appendQuestion(out, {
                    template: 'dilution-final-concentration', factId: item.id,
                    question: `取 ${item.initial} M 溶液 ${item.v1} mL，稀釋至 ${item.v2} mL，最後濃度為何？`, answer: `${num(finalM)} M`,
                    distractors: numericDistractors(finalM, 'M', Math.max(0.1, finalM)), type: '溶液計算｜稀釋濃度', displayMode: 'number',
                    basis: '稀釋前後溶質莫耳數不變。',
                    steps: `M₁V₁=M₂V₂；M₂=${item.initial}×${item.v1}/${item.v2}=${num(finalM)} M。`,
                    conclusion: `稀釋後濃度為 ${num(finalM)} M。`, misconception: '稀釋時體積增加、濃度降低，不能把體積比顛倒。'
                });
                appendQuestion(out, {
                    template: 'dilution-final-volume', factId: item.id,
                    question: `${item.initial} M 溶液取 ${item.v1} mL，稀釋至 ${num(item.initial * item.v1 / finalM)} mL 後濃度為 ${num(finalM)} M；最終體積為何？`,
                    answer: `${num(item.v2)} mL`, distractors: numericDistractors(item.v2, 'mL', Math.max(10, item.v2 / 5)),
                    type: '溶液計算｜稀釋體積反推', displayMode: 'number',
                    basis: '稀釋前後溶質莫耳數不變。',
                    steps: `V₂=M₁V₁/M₂=${item.initial}×${item.v1}/${num(finalM)}=${num(item.v2)} mL。`,
                    conclusion: `最終體積為 ${num(item.v2)} mL。`, misconception: '先列 M₁V₁=M₂V₂，再解出要求的體積。'
                });
            });
        }
        return out;
    }

    function buildGas() {
        const out = [];
        (DATA().gasFacts || []).forEach(fact => [0.5, 1, 2, 3].forEach((n, index) => {
            const volume = n * fact.molarVolume;
            appendQuestion(out, {
                template: 'gas-molar-volume', factId: fact.id, variant: String(index),
                question: `${fact.pressure}、${fact.temp} 下有 ${n} mol 理想氣體，體積約為多少 L？`,
                answer: `${num(volume)} L`, distractors: numericDistractors(volume, 'L', fact.molarVolume),
                type: '氣體計算｜莫耳體積', displayMode: 'number',
                basis: `指定條件下莫耳體積為 ${fact.molarVolume} L·mol⁻¹。`,
                steps: `V=nVₘ=${n} mol×${fact.molarVolume} L·mol⁻¹=${num(volume)} L。`,
                conclusion: `氣體體積約為 ${num(volume)} L。`, misconception: '莫耳體積只在題目指定的溫度與壓力條件下使用。'
            });
        }));
        return out;
    }

    function buildSolubility() {
        const out = [];
        (DATA().solubilities || []).forEach(fact => [25, 50, 100, 150, 200, 250].forEach((water, index) => {
            const crystallized = (fact.hot - fact.cold) * water / 100;
            appendQuestion(out, {
                template: 'solubility-crystallization', factId: fact.id, variant: String(index),
                question: `${fact.name} 在 ${fact.hotTemp} °C 的溶解度為 ${fact.hot} ${fact.unit}，降至 ${fact.coldTemp} °C 後為 ${fact.cold} ${fact.unit}。若有 ${water} g 水且熱溶液原已飽和，冷卻析出多少 g 溶質？`,
                answer: `${num(crystallized)} g`, distractors: numericDistractors(crystallized, 'g', Math.max(1, crystallized)),
                type: '溶解度｜結晶量計算', displayMode: 'number',
                basis: '冷卻析出量等於高溫與低溫溶解度差，乘以實際水量比例。',
                steps: `ΔS=${fact.hot}−${fact.cold}=${fact.hot - fact.cold} g/100 g 水；析出量=${fact.hot - fact.cold}×${water}/100=${num(crystallized)} g。`,
                conclusion: `冷卻後析出 ${num(crystallized)} g。`, misconception: '要用溶解度差乘上水量比例；水量不是溶液總質量。'
            });
        }));
        return out;
    }

    function buildThermo() {
        const out = [];
        (DATA().thermoFacts || []).forEach(item => {
            appendQuestion(out, {
                template: 'thermo-sign', factId: item.id,
                question: `以系統為範圍，${item.process}屬於吸熱或放熱？`, answer: item.heat,
                distractors: ['吸熱', '放熱', '不交換熱量', '僅由催化劑決定'], type: '熱化學｜吸放熱辨識',
                basis: item.rule, steps: `${item.process}的熱量流向決定系統焓變號誌。`,
                conclusion: `${item.heat}過程對應 ΔH ${item.deltaH}。`, misconception: '判斷 ΔH 正負時要先指定系統，吸熱為正、放熱為負。'
            });
            appendQuestion(out, {
                template: 'thermo-delta-h', factId: item.id,
                question: `以系統為範圍，${item.process}的 ΔH 符號為何？`, answer: item.deltaH,
                distractors: ['正值', '負值', '必為零', '只由反應速率決定'], type: '熱化學｜反應熱符號',
                basis: item.rule, steps: `${item.heat}時系統焓${item.deltaH === '正值' ? '增加' : '降低'}。`,
                conclusion: `ΔH 為${item.deltaH}。`, misconception: '吸熱與放熱的符號以系統能量變化為準。'
            });
        });
        const heatCases = [
            { m:100, c:4.18, dt:10 }, { m:200, c:4.18, dt:5 }, { m:50, c:4.18, dt:20 }, { m:150, c:4.18, dt:4 },
            { m:100, c:4.18, dt:25 }, { m:250, c:4.18, dt:8 }, { m:80, c:4.18, dt:15 }, { m:120, c:4.18, dt:10 }
        ];
        heatCases.forEach((x, i) => {
            const q = x.m * x.c * x.dt / 1000;
            appendQuestion(out, {
                template: 'calorimetry-heat', factId: `water-heat-${i}`,
                question: `${x.m} g 水的比熱取 4.18 J·g⁻¹·°C⁻¹，溫度上升 ${x.dt} °C，吸收熱量約多少 kJ？`,
                answer: `${num(q)} kJ`, distractors: numericDistractors(q, 'kJ', Math.max(0.5, q / 4)), type: '熱化學｜量熱計算', displayMode: 'number',
                basis: '定壓比熱計算使用 q=mcΔT。',
                steps: `q=mcΔT=${x.m}×4.18×${x.dt}=${num(q * 1000)} J=${num(q)} kJ。`,
                conclusion: `水吸收約 ${num(q)} kJ。`, misconception: '先以 J 計算，再確認是否需要換算成 kJ。'
            });
        });
        return out;
    }

    function buildRate() {
        const out = [];
        (DATA().rateLaws || []).forEach(item => {
            appendQuestion(out, {
                template: 'rate-total-order', factId: item.id,
                question: `速率式為 ${item.rate}，反應總級數為何？`, answer: String(item.order),
                distractors: ['0', '1', '2', '3', '4'], type: '反應速率｜總級數', displayMode: 'number',
                basis: '總級數為速率式中所有反應物濃度指數的總和。',
                steps: `由 ${item.rate} 讀取各濃度指數並相加，得到總級數 ${item.order}。`,
                conclusion: `此反應為 ${item.order} 級反應。`, misconception: '只看單一反應物指數不一定等於總級數。'
            });
            [2, 3, 0.5].forEach((factor, index) => {
                const speedFactor = Math.pow(factor, item.power);
                appendQuestion(out, {
                    template: 'rate-concentration-factor', factId: item.id, variant: String(index),
                    question: `反應速率式為 ${item.rate}。其他條件不變時，${item.variable}變為原來的 ${factor} 倍，速率變為幾倍？`,
                    answer: `${num(speedFactor)} 倍`, distractors: numericDistractors(speedFactor, '倍', Math.max(1, speedFactor / 2)),
                    type: '反應速率｜濃度倍數', displayMode: 'number',
                    basis: `${item.variable}在速率式中的級數為 ${item.power}。`,
                    steps: `速率倍數=${factor}^${item.power}=${num(speedFactor)}。`,
                    conclusion: `反應速率變為 ${num(speedFactor)} 倍。`, misconception: '濃度倍數需取該物種的速率級數次方。'
                });
            });
            appendQuestion(out, {
                template: 'rate-catalyst', factId: item.id,
                question: `對速率式 ${item.rate} 所代表的反應加入適當催化劑，活化能與平衡常數如何改變？`,
                answer: '活化能降低，平衡常數不變',
                distractors: ['活化能降低，平衡常數增加', '活化能增加，平衡常數不變', '活化能不變，平衡常數降低'],
                type: '反應速率｜催化劑作用',
                basis: '催化劑提供較低活化能的反應途徑，但不改變反應物與生成物的能量差。',
                steps: '正、逆反應速率都會加快；固定溫度下的平衡位置與平衡常數不因此改變。',
                conclusion: '活化能降低，平衡常數不變。', misconception: '催化劑不能改變反應焓或平衡常數。'
            });
        });
        return out;
    }

    function buildEquilibrium() {
        const out = [];
        const shifts = ['向左移動', '向右移動', '不移動'];
        (DATA().equilibria || []).forEach(item => {
            appendQuestion(out, {
                template: 'equilibrium-kc', factId: item.id,
                question: `反應 ${item.equation} 的 Kc 表示式為何？`, answer: item.kc,
                distractors: (DATA().equilibria || []).map(x => x.kc), type: '化學平衡｜Kc 表示式', displayMode: 'text',
                basis: 'Kc 以生成物濃度列於分子、反應物濃度列於分母，指數取平衡係數。',
                steps: `依 ${item.equation} 列式；純固體不寫入 Kc。`, conclusion: `Kc=${item.kc}。`,
                misconception: '不要把反應物與生成物位置顛倒，也不要將純固體寫入 Kc。'
            });
            appendQuestion(out, {
                template: 'equilibrium-pressure', factId: item.id,
                question: `對平衡 ${item.equation} 加壓（定溫），平衡如何移動？`,
                answer: item.products < item.reactants ? '向右移動' : item.products > item.reactants ? '向左移動' : '不移動',
                distractors: [...shifts, '須比較氣體莫耳質量'], type: '化學平衡｜壓力影響',
                basis: '定溫增壓時，平衡傾向移向氣體總莫耳數較少的一側。',
                steps: `左側氣體係數總和為 ${item.reactants}，右側為 ${item.products}。`,
                conclusion: `因此平衡${item.products < item.reactants ? '向生成物側' : item.products > item.reactants ? '向反應物側' : '不因壓力改變而'}移動。`,
                misconception: '比較的是氣體係數總和；純固體不計入氣體莫耳數。'
            });
            appendQuestion(out, {
                template: 'equilibrium-temperature', factId: item.id,
                question: `反應 ${item.equation} 正向${item.endothermic ? '吸熱' : '放熱'}。升高溫度時，平衡如何移動？`,
                answer: item.endothermic ? '向右移動' : '向左移動', distractors: shifts,
                type: '化學平衡｜溫度影響',
                basis: '升溫相當於加入熱；平衡向吸收熱量的方向移動。',
                steps: `正向反應${item.endothermic ? '吸熱' : '放熱'}，所以${item.endothermic ? '正向' : '逆向'}是吸熱方向。`,
                conclusion: `平衡${item.endothermic ? '向右' : '向左'}移動。`,
                misconception: '溫度改變會影響平衡常數；不要套用只適用於濃度與壓力改變的判斷。'
            });
            appendQuestion(out, {
                template: 'equilibrium-concentration', factId: item.id,
                question: `在平衡 ${item.equation} 中，增加反應物濃度後，系統初始反應商 Q 與 Kc 比較為何？`,
                answer: 'Q＜Kc', distractors: ['Q＞Kc', 'Q＝Kc', 'Q與Kc必同時改變'],
                type: '化學平衡｜反應商與移動',
                basis: '定溫增加反應物濃度會使反應商 Q 暫時變小，Kc 不變。',
                steps: '系統接著朝正向反應消耗新增反應物，直到 Q 再次等於 Kc。',
                conclusion: '改變後立即有 Q＜Kc，平衡向右移動。',
                misconception: '定溫改變濃度不改變 Kc；要比較的是 Q 與 Kc。'
            });
        });
        return out;
    }

    function buildOrganic(subtype) {
        const out = [];
        const compounds = DATA().organicCompounds || [];
        compounds.forEach(item => {
            if (subtype === 'functional') {
                addStyled(out, {
                    template: 'organic-structure-to-functional', factId: item.id,
                    answer: item.functional,
                    distractors: compounds.map(x => x.functional), type: '有機化學｜官能基辨識', displayMode: 'text',
                    basis: `${item.name}屬於${item.family}。`, steps: `由結構 ${item.formula} 辨認特徵基團 ${item.functional}。`,
                    conclusion: `此物質的分類為${item.family}。`, misconception: '先找出特徵基團，再判斷有機物類別。'
                }, [`${item.name}的代表性官能基或鍵結特徵為何？`, `結構 ${item.structure || item.formula} 中，最具代表性的官能基或鍵結特徵為何？`]);
                appendQuestion(out, {
                    template: 'organic-functional-to-family', factId: item.id,
                    question: `含有「${item.functional}」的有機物，應歸在哪一類？`, answer: item.family,
                    distractors: compounds.map(x => x.family), type: '有機化學｜官能基與分類',
                    basis: `${item.functional}是${item.family}的辨識特徵。`, steps: `題目物種為 ${item.formula}，與此官能基相符。`,
                    conclusion: `分類為${item.family}。`, misconception: '分子中含氧不代表一定是醇；要看氧所處的鍵結環境。'
                });
            }
            if (subtype === 'name') {
                appendQuestion(out, {
                    template: 'organic-name-to-formula', factId: item.id,
                    question: `「${item.name}」的分子式或簡式為何？`, answer: item.formula,
                    distractors: compounds.map(x => x.formula), type: '有機化學｜名稱轉結構', displayMode: 'formula',
                    basis: `${item.name}對應結構表示為 ${item.formula}。`, steps: `核對碳骨架、官能基與不飽和鍵後得到 ${item.formula}。`,
                    conclusion: `正確表示為 ${item.formula}。`, misconception: '同分異構物可能分子式相同，名稱題須核對結構而非只看分子式。'
                });
                appendQuestion(out, {
                    template: 'organic-formula-to-name', factId: item.id,
                    question: `結構簡式 ${item.structure || item.formula} 對應的高中常見物質名稱為何？`, answer: item.name,
                    distractors: compounds.map(x => x.name), type: '有機化學｜結構轉名稱', displayMode: 'formula',
                    basis: `${item.structure || item.formula}的特徵骨架與官能基對應${item.name}。`, steps: `辨認 ${item.functional}，再核對碳數與連接方式。`,
                    conclusion: `名稱為${item.name}。`, misconception: '相同分子式可能有不同結構，需依題目給出的連接方式辨認。'
                });
            }
        });
        if (subtype === 'reaction') (DATA().organicReactions || []).forEach(item => {
            addStyled(out, {
                template: 'organic-reaction-product', factId: item.id,
                answer: item.product, distractors: (DATA().organicReactions || []).map(x => x.product), type: '有機化學｜條件式產物',
                basis: `題目已提供反應物與必要條件：${item.condition}。`,
                steps: item.rule, conclusion: `主要產物為${item.product}。`,
                misconception: '反應條件不足以唯一決定產物時不出題；本題條件已限定反應路徑。'
            }, [
                `${item.reactant}在「${item.condition}」下反應，主要產物為何？`,
                `依反應物 ${item.formula} 與條件「${item.condition}」，判斷主要產物。`
            ]);
            addStyled(out, {
                template: 'organic-reaction-type', factId: item.id,
                answer: item.type, distractors: ['加成反應', '取代反應', '酯化反應', '加成聚合', '完全燃燒'], type: '有機化學｜反應類型',
                basis: `${item.rule}`, steps: `依反應物與「${item.condition}」條件判斷鍵結如何改變，再確認反應分類。`,
                conclusion: `此反應屬於${item.type}。`, misconception: '需看鍵結與產物變化，不能只看反應物名稱。'
            }, [
                `${item.reactant}在「${item.condition}」下反應，屬於哪一類反應？`,
                `依反應物 ${item.formula} 與條件「${item.condition}」，此反應應如何分類？`
            ]);
        });
        if (subtype === 'polymer') (DATA().polymers || []).forEach(item => {
            for (const direction of ['monomer-to-polymer', 'polymer-to-monomer', 'repeat-unit']) {
                const map = {
                    'monomer-to-polymer': { question:`${item.monomer}進行加成聚合後，形成何種聚合物？`, answer:item.polymer, distractors:(DATA().polymers||[]).map(x=>x.polymer), basis:`${item.monomer}的雙鍵開啟後形成${item.polymer}。`, steps:`單體 ${item.monomerFormula} 的雙鍵開啟並重複連接，形成重複單元 ${item.repeatUnit}。`, conclusion:`聚合物為${item.polymer}。` },
                    'polymer-to-monomer': { question:`${item.polymer}的加成聚合單體為何？`, answer:item.monomer, distractors:(DATA().polymers||[]).map(x=>x.monomer), basis:`${item.polymer}由${item.monomer}加成聚合形成。`, steps:`由重複單元 ${item.repeatUnit} 還原雙鍵，得到單體 ${item.monomerFormula}。`, conclusion:`單體為${item.monomer}。` },
                    'repeat-unit': { question:`${item.polymer}的重複單元為何？`, answer:item.repeatUnit, distractors:(DATA().polymers||[]).map(x=>x.repeatUnit), basis:`${item.monomer}聚合時碳碳雙鍵開啟。`, steps:`保留單體取代基並將雙鍵轉為主鏈單鍵，得到 ${item.repeatUnit}。`, conclusion:`重複單元為 ${item.repeatUnit}。` }
                }[direction];
                appendQuestion(out, { ...map, template:`polymer-${direction}`, factId:item.id, type:'有機化學｜聚合物與單體', displayMode:'text', misconception:'辨認單體雙鍵開啟後形成的主鏈，並保留取代基位置。' });
            }
        });
        return out;
    }

    function generatePool(category, selected) {
        const out = [];
        const subtypes = Object.keys(selected || {}).filter(k => selected[k]);
        subtypes.forEach(subtype => {
            let generated = [];
            if (category === 'acidBase') {
                if (subtype === 'strength') generated = buildAcidStrength(subtype);
                if (subtype === 'conjugate') generated = buildConjugates();
                if (subtype === 'salt') generated = buildSalts(subtype);
                if (subtype === 'pH') generated = buildPH(subtype);
                if (subtype === 'acidNature') generated = buildAcidNature();
                if (subtype === 'indicator') generated = buildIndicators();
            } else if (category === 'concentration') generated = buildConcentration(subtype).map(q => ({...q, subtype}));
            else if (category === 'mole') {
                if (subtype === 'mole' || subtype === 'particles') generated = buildMoles(subtype);
                if (subtype === 'stoich') generated = buildStoich();
                if (subtype === 'solution') generated = buildSolutions(subtype);
                if (subtype === 'gas') generated = buildGas();
                if (subtype === 'solubility') generated = buildSolubility();
            } else if (category === 'thermo') {
                if (subtype === 'thermo') generated = buildThermo();
                if (subtype === 'rate') generated = buildRate();
                if (subtype === 'equilibrium') generated = buildEquilibrium();
            } else if (category === 'organic') generated = buildOrganic(subtype);
        out.push(...generated.filter(q => q && q.options.length >= 3 && q.options.length <= 4 && q.options.filter(v => key(v) === key(q.answer)).length === 1));
        });
        return out;
    }

    function capacity(category, selected) {
        return generatePool(category, selected).length;
    }

    function explanationStyle(question) {
        const modes = ['guided', 'worked', 'diagnostic'];
        const mode = modes[Math.floor(Math.random() * modes.length)];
        if (mode === 'worked') return {
            basis: question.basis,
            steps: question.steps,
            conclusion: question.conclusion,
            labels: ['已知與所求', '推導過程', '答案檢核']
        };
        if (mode === 'diagnostic') return {
            basis: question.basis,
            steps: `${question.steps} 常見錯誤：${question.misconception}`,
            conclusion: question.conclusion,
            labels: ['核心概念', '判斷與易錯點', '結論']
        };
        return {
            basis: question.basis,
            steps: question.steps,
            conclusion: question.conclusion,
            labels: ['核心規則', '逐步判斷', '結論']
        };
    }

    function generate(quizData) {
        const category = window.extensionCategory;
        const cfg = CATEGORIES()[category];
        if (!cfg) return false;
        const pool = generatePool(category, window.extensionSelectedSubtypes || {});
        const used = window.quizState._extensionAskedIds || (window.quizState._extensionAskedIds = new Set());
        let candidates = pool.filter(item => !used.has(item.id));
        if (category === 'concentration' && candidates.length) {
            const enabled = Object.keys(window.extensionSelectedSubtypes || {}).filter(id => window.extensionSelectedSubtypes[id]);
            const counts = window.quizState._concentrationSubtypeCounts || (window.quizState._concentrationSubtypeCounts = {});
            const available = enabled.filter(id => candidates.some(item => item.subtype === id));
            const least = Math.min(...available.map(id => counts[id] || 0));
            const chosen = shuffle(available.filter(id => (counts[id] || 0) === least))[0];
            candidates = candidates.filter(item => item.subtype === chosen);
            const recent = window.quizState._concentrationRecentFacts || (window.quizState._concentrationRecentFacts = []);
            const fresh = candidates.filter(item => !recent.includes(`${item.subtype}:${item.id.split(':')[1]}`));
            if (fresh.length) candidates = fresh;
            const templateCounts = window.quizState._concentrationTemplateCounts || (window.quizState._concentrationTemplateCounts = {});
            const templates = unique(candidates.map(item => item.template));
            const minimum = Math.min(...templates.map(id => templateCounts[`${chosen}:${id}`] || 0));
            const template = shuffle(templates.filter(id => (templateCounts[`${chosen}:${id}`] || 0) === minimum))[0];
            candidates = candidates.filter(item => item.template === template);
            templateCounts[`${chosen}:${template}`] = (templateCounts[`${chosen}:${template}`] || 0) + 1;
            counts[chosen] = (counts[chosen] || 0) + 1;
        }
        if (!candidates.length) return false;
        const item = candidates[Math.floor(Math.random() * candidates.length)];
        if (category === 'concentration') {
            const recent = window.quizState._concentrationRecentFacts;
            recent.push(`${item.subtype}:${item.id.split(':')[1]}`);
            if (recent.length > 12) recent.shift();
        }
        const explanations = explanationStyle(item);
        used.add(item.id);
        quizData._templateId = `extension:${item.id}`;
        quizData._extensionRecord = item;
        quizData.type = `${cfg.label}｜${item.type}`;
        quizData.question = item.question;
        quizData.answer = item.answer;
        quizData.forcedOpts = item.options;
        quizData.displayMode = item.displayMode || 'text';
        quizData.showExplanation = true;
        quizData.explanation = explanations;
        quizData.correctReason = [explanations.basis, explanations.steps, explanations.conclusion].join(' ');
        quizData.optionRationales = Object.fromEntries(item.options.filter(v => key(v) !== key(item.answer)).map((v, index) => {
            const specific = item.optionRationales && (item.optionRationales[key(v)] || item.optionRationales[v]);
            return [key(v), specific || `${item.misconception}（選項 ${v} 未符合上述轉換／條件。）`];
        }));
        return true;
    }

    return { generate, capacity, generatePool };
})();
