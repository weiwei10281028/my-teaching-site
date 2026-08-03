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
        {id:'Pb2+',elem:'Pb',ch:2,label:'Pb²⁺'},{id:'Hg22+',elem:'Hg2',ch:2,label:'Hg₂²⁺',special:true},
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
        'Hg22+|Cl-':'Hg2Cl2','Hg22+|Br-':'Hg2Br2','Hg22+|I-':'Hg2I2','Hg22+|SO42-':'Hg2SO4','Hg22+|CrO42-':'Hg2CrO4',
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
            if(['Hg22+','Cu+','Pb2+','Ag+','Tl+'].includes(cat.id))return{status:'insoluble',formula:buildFormula(cat,an)};
            return{status:'soluble',formula:buildFormula(cat,an)};
        }
        if(aid==='SO42-'){
            if(cat.id==='Ca2+')return{status:'slightly',formula:'CaSO4'};
            if(['Sr2+','Ba2+','Pb2+'].includes(cat.id))return{status:'insoluble',formula:buildFormula(cat,an)};
            return{status:'soluble',formula:buildFormula(cat,an)};
        }
        if(aid==='CrO42-'){
            if(cat.id==='Sr2+')return{status:'slightly',formula:'SrCrO4'};
            if(['Ba2+','Hg22+','Pb2+','Ag+'].includes(cat.id))return{status:'insoluble',formula:buildFormula(cat,an)};
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
        if(cat.id==='Hg22+')return['Cl-','Br-','I-','SO42-','CrO42-'].includes(an.id);
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
    document.getElementById('quiz-result-area').style.display = 'none';
    document.getElementById('quiz-setup-area').style.display = 'none';
    document.getElementById('quiz-content-area').style.display = 'none';
    document.getElementById('hybrid-type-select-area').style.display = 'none';
    document.getElementById('electron-type-select-area').style.display = 'none';
    document.getElementById('precip-type-select-area').style.display = 'none';
    document.getElementById('formula-type-select-area').style.display = 'none';
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
    document.querySelectorAll('#formula-type-cards .hybrid-type-card').forEach(card => card.classList.add('selected'));
    renderCalibrationRuler(0, window.quizState && window.quizState.totalQ ? window.quizState.totalQ : 10);
};

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
    window.resetToDifficultySelection();
    window.selectCalCategory(category);
};

window.selectCalCategory = function(cat) {
    window.calCategory = cat;
    document.getElementById('cal-category-area').style.display = 'none';
    const catNameMap = { 'periodic': '週期表', 'electron': '電子組態', 'hybrid': '混成', 'redox': '氧化還原', 'precipitation': '沉澱表', 'formula': '化學式' };
    document.getElementById('quiz-cancel-btn').style.display = 'block';

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
    window._precipSpecialLeft = 2;
    const W = { 21:10, 22:15, 28:1, 31:5, 24:2, 25:1, 26:6, 27:3, 23:2, 29:2 };
    const pool = [];
    if (sub['A']) pool.push(21, 22, 28, 31);
    if (sub['B']) pool.push(24, 25);
    if (sub['C']) pool.push(26, 27, 23, 29);
    if (pool.length === 0) pool.push(21, 22, 26, 27);

    const specialN = 2;
    const flameN = sub['D'] ? (total <= 15 ? 1 : Math.min(2, Math.round(total / 10))) : 0;
    const deck = [];
    for (let i = 0; i < specialN; i++) deck.push(28);
    for (let i = 0; i < flameN; i++) deck.push(30);

    const weighted = [];
    pool.forEach(t => { const w = W[t] || 2; for (let i = 0; i < w; i++) weighted.push(t); });

    const remain = total - deck.length;
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
    const tfTotal = Math.max(1, Math.round(total * 0.3));
    const deck = [];
    const nonTfTypes = { name: [32, 33], ions: [34, 35], judge: [36] };
    const tfTypes = { name: [37], ions: [38], judge: [39] };

    const distributeByGroup = (count, typeMap) => {
        const offsets = {};
        groups.forEach(g => { offsets[g] = 0; });
        for (let i = 0; i < count; i++) {
            const group = groups[i % groups.length];
            const choices = typeMap[group];
            deck.push(choices[offsets[group] % choices.length]);
            offsets[group]++;
        }
    };
    distributeByGroup(tfTotal, tfTypes);
    distributeByGroup(total - tfTotal, nonTfTypes);

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

// 獨立的牌組生成函式
window._generateTypeDeck = function(diff, total) {
    const restrictedTypes = [5, 14];
    const typePools = {
        1: [0, 1, 2, 4, 5, 6, 10, 14],
        2: [3, 6, 7, 8, 9, 10, 11, 14, 15],
        3: [16, 17],
        4: [18],
        5: [21, 22, 24, 25, 26, 27, 28, 29, 30, 31]
    };
    let types;
    if (diff === 6) {
        return _generateFormulaTypeDeck(total, window.formulaSelectedTypes || {});
    }
    if (diff === 5 && window.precipSelectedSubtypes) {
        return _generatePrecipTypeDeck(total, window.precipSelectedSubtypes);
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
    } else {
        types = typePools[diff] || typePools[1];
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
        const shuffledTypes = [...normalTypes].sort(() => 0.5 - Math.random());
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
    window.quizState = {
        rank: level, difficulty: diff, totalQ: previousTotalQ, currentQ: 0, correctCount: 0,
        pool: [], askedZ: [], typeDeck: [], askedQuestions: []
    };
    window.quizState.generateTypeDeck = window._generateTypeDeck;

    const poolMap = {
        'A': ELECTRON_DATA.filter(el => el.z <= 36),
        'B': ELECTRON_DATA.filter(el => el.z <= 36 || (el.g && el.g.includes('A'))),
        'C': ELECTRON_DATA.filter(el => el.z <= 88 && el.g && !el.g.includes('系')),
        'D': [...ELECTRON_DATA]
    };
    window.quizState.pool = poolMap[level] || poolMap['A'];

    document.getElementById('quiz-status-text').textContent = `RANK ${level} | ${catNameMap[cat]}`;
    setTimeout(() => { if (typeof window.updateSetupButtons === 'function') window.updateSetupButtons(); }, 50);
};

window.setQuizParam = function(type, val, btn) {
    btn.parentElement.querySelectorAll('.setup-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (type === 'count' && window.quizState) {
        window.quizState.totalQ = parseInt(val);
    }
};

window.updateSetupButtons = function() {
    if (!window.quizState) return;
    const countBtns = document.querySelectorAll('.setup-btns button[onclick*="setQuizParam(\'count\'"]');
    countBtns.forEach(btn => {
        const match = btn.getAttribute('onclick').match(/setQuizParam\('count',\s*(\d+)/);
        if (match && parseInt(match[1]) === window.quizState.totalQ) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
};

// 生成問題的唯一標識（用於重複檢查）
// 智能識別問題的核心內容，允許同一type但不同問法，但禁止完全相同問題
function generateQuestionKey(type, quizData, target) {
    // 提取問題的核心內容（去除HTML標籤和格式化）
    let coreQuestion = quizData.question.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    
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
    if (type >= 32 && type <= 39) return '化學式';
    const topicMap = {
        1: '週期表',
        2: '電子組態',
        3: '混成',
        4: '氧化還原',
        5: '沉澱表',
        6: '化學式'
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
    let tex = calibrationEscapeHtml(raw)
        .replace(/\[([A-Za-z]+)\]/g, '\\left[\\mathrm{$1}\\right]')
        .replace(/(\d+)([spdf])(\d+)/gi, '$1\\mathit{$2}^{$3}');
    return calibrationMathSpan(tex, raw);
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
    return String(text || '').replace(
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

    return output.replace(/\uE100(\d+)\uE101/g, (_, index) => protectedSegments[Number(index)]);
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

window.renderNextQuestion = function() {
    window.quizState.currentQ++;
    if (window.quizState.currentQ > window.quizState.totalQ) return window.finishCalibration();
    updatePeriodicToggleVisibility();
    
    const catNames = { 1: "週期表", 2: "電子組態", 3: "混成", 4: "氧化還原", 5: "沉澱表", 6: "化學式" };
    const catName = catNames[window.quizState.difficulty] || "未知";
    const rankPfx = window.quizState.rank ? `RANK ${window.quizState.rank} | ` : '';
    document.getElementById('quiz-status-text').textContent = 
        `${rankPfx}${catName}校準 [Q ${window.quizState.currentQ}/${window.quizState.totalQ}]`;
    
    // 依照預選牌組類型出題
    const type = window.quizState.typeDeck[window.quizState.currentQ - 1];
    
    const quizData = { question: "", answer: "", type: "", displayMode: "symbol" }; 
    let target = null;
    let parsed = null;
    let s = "";
    
    // 混成/氧化還原/沉澱表/結構圖題型不依賴元素 pool，直接跳過元素選擇
    if (type !== 16 && type !== 17 && type !== 18 && type !== 19 && type < 21 && !(type >= 32 && type <= 39)) {
        // 元素均等分佈演算法
        let avail = window.quizState.pool.filter(el => !window.quizState.askedZ.includes(el.z));
        if (avail.length === 0) {
            window.quizState.askedZ = []; 
            avail = [...window.quizState.pool];
        }
        target = avail[Math.floor(Math.random() * avail.length)];
        window.quizState.askedZ.push(target.z);
        parsed = QUIZ_HELPER.parse(target.c);
        s = `[ ${target.s} ]`;
    }
    
    // 重複問題檢查：生成問題後檢查是否已問過，如果重複則重新生成（最多嘗試20次）
    let questionKey = "";
    let attempts = 0;
    let questionGenerated = false;
    
    while (!questionGenerated && attempts < 20) {
        attempts++;
        // 如果已經嘗試過，重新選擇元素（混成/形狀/結構圖題型跳過）
        if (attempts > 1 && type !== 16 && type !== 17 && type !== 19 && type < 21 && !(type >= 32 && type <= 39)) {
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
    const isLanthanide = (target.g === "鑭系" || target.g === "錒系");
    const iupacCoord = `第 ${target.p} 週期、第 ${target.iupac} 族`;
    const abCoord    = isLanthanide ? `第${periodCh}週期、${target.g}` : `第${periodCh}週期、${target.g}族`;
    const direction = Math.random();
    if (direction < 0.125) {
        // 座標(IUPAC) → 符號
        quizData.type        = "位置定位：座標(IUPAC) > 符號";
        quizData.question    = `位於週期表「${iupacCoord}」的元素符號是？`;
        quizData.answer      = target.s;
        quizData.displayMode = "symbol";
        quizData.coordMode   = "iupac";
    } else if (direction < 0.25) {
        // 座標(A/B族) → 符號
        quizData.type        = "位置定位：座標(A/B) > 符號";
        quizData.question    = `位於週期表「${abCoord}」的元素符號是？`;
        quizData.answer      = target.s;
        quizData.displayMode = "symbol";
        quizData.coordMode   = "ab";
    } else if (direction < 0.375) {
        // 座標(IUPAC) → 原子序
        quizData.type        = "位置定位：座標(IUPAC) > 原子序";
        quizData.question    = `位於週期表「${iupacCoord}」的元素，其原子序為何？`;
        quizData.answer      = target.z.toString();
        quizData.displayMode = "number";
        quizData.coordMode   = "iupac";
    } else if (direction < 0.5) {
        // 座標(A/B族) → 原子序
        quizData.type        = "位置定位：座標(A/B) > 原子序";
        quizData.question    = `位於週期表「${abCoord}」的元素，其原子序為何？`;
        quizData.answer      = target.z.toString();
        quizData.displayMode = "number";
        quizData.coordMode   = "ab";
    } else if (direction < 0.5625) {
        // 符號 → 座標(IUPAC)
        quizData.type        = "位置定位：符號 > 座標(IUPAC)";
        quizData.question    = [`元素 ${s} 位於週期表的第幾週期、第幾族（IUPAC）？`, `元素 ${s} 屬於第幾週期、第幾族？`][Math.floor(Math.random() * 2)];
        quizData.answer      = iupacCoord;
        quizData.displayMode = "raw";
        quizData.coordMode   = "iupac";
    } else if (direction < 0.625) {
        // 符號 → 座標(A/B族)
        quizData.type        = "位置定位：符號 > 座標(A/B)";
        quizData.question    = [`元素 ${s} 位於週期表的第幾週期、幾A或幾B族？`, `元素 ${s} 屬於第幾週期、幾A/B族？`][Math.floor(Math.random() * 2)];
        quizData.answer      = abCoord;
        quizData.displayMode = "raw";
        quizData.coordMode   = "ab";
    } else if (direction < 0.75) {
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
        quizData.question    = `元素 ${elementText} 在化學性質分類上屬於下列何者？`;
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
        const shuffledDiff = [...diffTypeElements].sort(() => 0.5 - Math.random()).slice(0, 3);
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
                `下列哪個原子序的元素屬於「${target.type}」？`,
                `下列哪個原子序對應的元素，其性質屬於「${target.type}」？`
            ];
        } else {
            questionTemplates = [
                `下列哪個元素屬於「${target.type}」？`,
                `「${target.type}」類別中包含下列哪個元素？`
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
        quizData.question    = `在常溫常壓 (25°C, 1atm) 下，${elementText} 的物理狀態為何？`;
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
        const shuffledDiff = [...diffStateElements].sort(() => 0.5 - Math.random()).slice(0, 3);
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
            `下列哪個元素在常溫常壓 (25°C, 1atm) 下為「${cleanState}」？`,
            `在常溫常壓下呈「${cleanState}」狀態的元素是？`,
            `下列何者在常溫常壓下為「${cleanState}」？`
        ];
        quizData.question    = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
        quizData.answer      = answerValue;
        quizData.displayMode = answerDisplayMode;
        quizData.forcedOpts  = forcedOpts.slice(0, 4); // 確保只有4個選項
    }
} else if (type === 6) {
    // 融合計算與逆推題型：電子總數、質子總數、質子數逆推、電子數逆推、等電子序列
    const subType = Math.random();
    if (subType < 0.2) {
        // Type 12: 計算：電子總數
        let charge = (Math.random() > 0.4) ? (Math.floor(Math.random() * 7) - 3 || 1) : 0;
        let signHTML = "";
        if (charge !== 0) {
            let val = Math.abs(charge);
            let sign = charge > 0 ? "+" : "-";
            let styledSign = `<span class="charge-sign ${sign === '-' ? 'minus' : 'plus'}">${sign}</span>`;
            signHTML = `<sup>${val === 1 ? "" : val}${styledSign}</sup>`;
        }
        const particle = charge === 0 ? `中性原子 ${s}` : `離子 [ ${target.s}${signHTML} ]`;
        quizData.type     = "計算：電子總數";
        quizData.question = `${particle} 的「核外電子總數」為何？`;
        quizData.answer   = (target.z - charge).toString();
        quizData.displayMode = "number";
    } else if (subType < 0.4) {
        // Type 13: 計算：質子總數
        let charge = (Math.random() > 0.4) ? (Math.floor(Math.random() * 7) - 3 || 1) : 0;
        let signHTML = "";
        if (charge !== 0) {
            let val = Math.abs(charge);
            let sign = charge > 0 ? "+" : "-";
            let styledSign = `<span class="charge-sign ${sign === '-' ? 'minus' : 'plus'}">${sign}</span>`;
            signHTML = `<sup>${val === 1 ? "" : val}${styledSign}</sup>`;
        }
        const particle = charge === 0 ? `中性原子 ${s}` : `離子 [ ${target.s}${signHTML} ]`;
        quizData.type     = "計算：質子總數";
        quizData.question = `${particle} 的「原子核內質子數」為何？`;
        quizData.answer   = target.z.toString();
        quizData.displayMode = "number";
    } else if (subType < 0.6) {
        // Type 16: 識別校準：質子數逆推
        quizData.type        = "識別校準：質子數逆推";
        const questionTemplates = [
            `原子核內質子總數為 ${target.z} 的元素符號為何？`,
            `原子核內有 ${target.z} 個質子的元素，其化學符號是？`,
            `質子數為 ${target.z} 的元素為何？`
        ];
        quizData.question    = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
        quizData.answer      = target.s;
        quizData.displayMode = "symbol";
    } else if (subType < 0.8) {
        // Type 17: 計算：電子數逆推
        let c = Math.floor(Math.random() * 5) - 2;
        const eCount = target.z - c;
        quizData.type = "計算：電子數逆推";
        const questionTemplates = [
            `總電子數為 ${eCount} 的粒子，可能為下列何者？`,
            `核外電子總數為 ${eCount} 的粒子為何？`,
            `具有 ${eCount} 個電子的粒子是？`
        ];
        quizData.question = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
        
        if (c === 0) {
            quizData.answer = target.s;
        } else {
            let val = Math.abs(c);
            let sign = c > 0 ? "+" : "-";
            let styledSign = `<span class="charge-sign ${sign === '-' ? 'minus' : 'plus'}">${sign}</span>`;
            quizData.answer = `${target.s}<sup>${val === 1 ? "" : val}${styledSign}</sup>`;
        }
        quizData.displayMode = "ion";
    } else {
        // Type 18: 邏輯判斷：等電子序列
        let c = Math.floor(Math.random() * 7) - 3;
        const eCount = target.z - c;
        const signHTML = c === 0 ? "" : `<sup class="chem-sup">${Math.abs(c) === 1 ? "" : Math.abs(c)}<span class="charge-sign ${c > 0 ? 'plus' : 'minus'}">${c > 0 ? "+" : "-"}</span></sup>`;
        const partner = QUIZ_HELPER.getIsoelectronicParticle(eCount, target.z);
        quizData.type = "邏輯判斷：等電子序列";
        const questionTemplates = [
            `下列哪一個粒子與 [ ${target.s}${signHTML} ] 具備相同的電子排列？`,
            `與 [ ${target.s}${signHTML} ] 等電子的粒子是？`,
            `下列何者與 [ ${target.s}${signHTML} ] 具有相同的電子數？`
        ];
        quizData.question = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
        if (partner) {
            quizData.answer = partner.replace(/<sup>(\d+)?([\+\-])<\/sup>/, (match, num, sign) => {
                return `<sup class="chem-sup">${(num === "1" || !num) ? "" : num}<span class="charge-sign ${sign === '-' ? 'minus' : 'plus'}">${sign}</span></sup>`;
            });
        } else {
            quizData.answer = "以上皆非";
        }
        quizData.displayMode = "ion";
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
    const direction = Math.random();
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
        const partners       = window.quizState.pool.filter(el => el.iupac === target.iupac && el.z !== target.z);
        quizData.answer      = partners.length > 0 ? partners[Math.floor(Math.random() * partners.length)].s : "以上皆非";
        quizData.displayMode = "symbol";
        
        // 生成選項：正確答案 + 3個不同族的元素（確保只有一個正確答案，且不包含問題中的元素）
        const diffGroupElements = window.quizState.pool.filter(el => {
            return el.iupac !== target.iupac && el.z !== target.z; // 只選擇不同族且不是問題中元素的元素作為錯誤選項
        });
        let forcedOpts = [quizData.answer];
        const shuffledDiff = [...diffGroupElements].sort(() => 0.5 - Math.random()).slice(0, 3);
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
        const shuffledDiff = [...diffPeriodElements].sort(() => 0.5 - Math.random()).slice(0, 3);
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
    let sel              = [...enPool].sort(() => 0.5 - Math.random()).slice(0, 4);
    let winner           = sel.reduce((p, c) => (QUIZ_HELPER.getEN(c.s) > QUIZ_HELPER.getEN(p.s)) ? c : p);
    quizData.type        = "性質趨勢：電負度比較";
    quizData.question    = `下列哪一個原子的「電負度」最大？`;
    quizData.answer      = winner.s;
    quizData.forcedOpts  = sel.map(el => el.s);
    quizData.displayMode = "symbol";
} else if (type === 15) {
    quizData.type        = "邏輯判斷：化學性質相似"; 
    quizData.question    = `根據電子組態特徵，下列哪一個元素與 ${s} 的「化學性質」最相似？`;
    // 修正：確保正確答案也在pool範圍內（符合RANK限制）
    const partners       = window.quizState.pool.filter(el => el.iupac === target.iupac && el.z !== target.z);
    quizData.answer      = partners.length > 0 ? partners[Math.floor(Math.random() * partners.length)].s : "以上皆非";
    quizData.displayMode = "symbol";
    
    // 生成選項：正確答案 + 3個不同 iupac 的元素（確保只有一個正確答案，且不包含問題中的元素）
    const diffIupacElements = window.quizState.pool.filter(el => {
        return el.iupac !== target.iupac && el.z !== target.z; // 只選擇不同 iupac 且不是問題中元素的元素作為錯誤選項
    });
    let forcedOpts = [quizData.answer];
    const shuffledDiff = [...diffIupacElements].sort(() => 0.5 - Math.random()).slice(0, 3);
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
    const wrongCfgs = [...wrongCfgPool].sort(() => 0.5 - Math.random()).slice(0, 3).map(el => el.noble);
    quizData.type = "組態逆推";
    quizData.question = `${questionParticle} 的基態電子組態（縮寫）為何？`;
    quizData.answer = correctConfig;
    quizData.displayMode = "noble";
    quizData.forcedOpts = [correctConfig, ...wrongCfgs].sort(() => 0.5 - Math.random());
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
            const shuffledWrong = [...wrongPool].sort(() => 0.5 - Math.random());
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
            quizData.displayMode = "formula";
            quizData.forcedOpts = [correctDisplay, ...wrongOpts].sort(() => 0.5 - Math.random());
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
                allOptions = [..._spOpts, dPick].sort(() => 0.5 - Math.random());
            } else {
                const otherD = _dOpts.filter(h=>h!==correctHybrid).sort(()=>0.5-Math.random()).slice(0,1);
                const spPick = [..._spOpts].sort(()=>0.5-Math.random()).slice(0,2);
                allOptions = [correctHybrid, ...otherD, ...spPick].sort(() => 0.5 - Math.random());
            }

            let atomDescription = selected.center;
            const molData = selected.variant ? MOLECULE_DB[selected.key].variants[selected.variant] : MOLECULE_DB[selected.key];
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
                                shapeItems.push({ name: mainName, chineseName, shape: shapeName, isMultiCenter: false });
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
                    shapeItems.push({ name: vMainName, chineseName: vChineseName, shape: sn, isMultiCenter: false });
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
            const shuffledWrong = [...wrongPool].sort(() => 0.5 - Math.random());
            for (const w of shuffledWrong) {
                if (wrongOpts.length >= 3) break;
                if (!usedNames.has(w.name)) { usedNames.add(w.name); wrongOpts.push(_getShapeDisplayName(w)); }
            }
            let _sSafety = 0;
            while (wrongOpts.length < 3 && _sSafety < 50) {
                _sSafety++;
                const filler = filteredShapes[Math.floor(Math.random() * filteredShapes.length)];
                const fd = _getShapeDisplayName(filler);
                if (!usedNames.has(filler.name) && filler.shape !== targetShape) { usedNames.add(filler.name); wrongOpts.push(fd); }
            }
            const questionTemplates = [
                `下列何者的分子形狀為${targetShape}？`,
                `下列哪一個物質為${targetShape}？`,
                `以下哪個分子或離子的形狀是${targetShape}？`
            ];
            quizData.type = "分子形狀判斷（反向）";
            quizData.question = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
            quizData.answer = correctDisplay;
            quizData.displayMode = "formula";
            quizData.forcedOpts = [correctDisplay, ...wrongOpts].sort(() => 0.5 - Math.random());
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
            const wrongShapes = allShapeNames.filter(s => s !== correctShape);
            const shuffledWrong = [...wrongShapes].sort(() => 0.5 - Math.random()).slice(0, 3);
            const allOptions = [correctShape, ...shuffledWrong].sort(() => 0.5 - Math.random());
            const questionTemplates = [
                `${displayName} 的分子形狀為何？`,
                `${displayName} 的幾何形狀是？`,
                `依據 VSEPR 理論，${displayName} 的形狀為？`
            ];
            quizData.type = "分子形狀判斷";
            quizData.question = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
            quizData.answer = correctShape;
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
                if (!seen.has(k)) { seen.add(k); molPool19.push({ name, chName: cName, atoms, bonds, atomIdx: idx, elem: atom.elem, hybrid, center: center || atom.elem }); }
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
            opts19 = [..._sp19, dPick].sort(() => 0.5 - Math.random());
        } else {
            const otherD = _d19.filter(h=>h!==sel19.hybrid).sort(()=>0.5-Math.random()).slice(0,1);
            const spPick = [..._sp19].sort(()=>0.5-Math.random()).slice(0,2);
            opts19 = [sel19.hybrid, ...otherD, ...spPick].sort(() => 0.5 - Math.random());
        }
        quizData.type = "結構圖問混成";
        quizData.question = `圖中標示的 ${sel19.elem} 原子採取何種混成軌域？`;
        quizData.answer = sel19.hybrid;
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
            oxItems.push({ molKey: mKey, name: mainName, atomElem: atom.elem, atomIdx: idx, oxidationNumber: ox });
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
                    oxItems.push({ molKey: vKey, name: vMainName, atomElem: atom.elem, atomIdx: idx, oxidationNumber: ox });
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
            const shuffledWrong = [...wrongPool].sort(() => 0.5 - Math.random());
            for (const w of shuffledWrong) {
                if (wrongOpts.length >= 3) break;
                const wKey = w.name + w.atomElem;
                if (!usedNames.has(wKey)) { usedNames.add(wKey); wrongOpts.push(formatFormula(w.name) + ` 中的 ${w.atomElem}`); }
            }
            let safety = 0;
            while (wrongOpts.length < 3 && safety < 50) {
                safety++;
                const filler = finalItems[Math.floor(Math.random() * finalItems.length)];
                const fKey = filler.name + filler.atomElem;
                if (!usedNames.has(fKey) && filler.oxidationNumber !== targetOx) {
                    usedNames.add(fKey);
                    wrongOpts.push(formatFormula(filler.name) + ` 中的 ${filler.atomElem}`);
                }
            }
            quizData.type = "氧化數判斷（反向）";
            quizData.question = `下列何者的氧化數為 ${_formatOx(targetOx)}？`;
            quizData.answer = correctDisplay;
            quizData.displayMode = "formula";
            quizData.forcedOpts = [correctDisplay, ...wrongOpts].sort(() => 0.5 - Math.random());
        } else {
            const selected = finalItems[Math.floor(Math.random() * finalItems.length)];
            const displayName = `<span style="display: inline; font-size: 1.7rem; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(56,189,248,0.5); vertical-align: baseline;">${formatFormula(selected.name)}</span>`;
            const correctOx = _formatOx(selected.oxidationNumber);
            const wrongOxSet = new Set();
            const candidates = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6].filter(x => x !== selected.oxidationNumber);
            candidates.sort(() => 0.5 - Math.random());
            for (let i = 0; i < 3 && i < candidates.length; i++) wrongOxSet.add(candidates[i]);
            const wrongOxArr = [...wrongOxSet].map(x => _formatOx(x));
            const allOptions = [correctOx, ...wrongOxArr].sort(() => 0.5 - Math.random());
            quizData.type = "氧化數判斷";
            quizData.question = `${displayName} 中的 ${selected.atomElem} 原子，其氧化數為何？`;
            quizData.answer = correctOx;
            quizData.displayMode = "text";
            quizData.forcedOpts = allOptions;
        }
    }
} else if (type >= 32 && type <= 39) {
    if (!window.FORMULA_ENGINE || !window.FORMULA_ENGINE.generate(type, quizData)) {
        continue;
    }
} else if (type >= 21 && type <= 31) {
    if (!PRECIP_ENGINE.generate(type, quizData)) {
        continue;
    }
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
    
    // 如果嘗試20次後仍然重複，使用最後生成的問題（避免無限循環）
    if (!questionGenerated) {
        console.warn(`警告：嘗試20次後仍有重複問題，使用最後生成的問題`);
        window.quizState.askedQuestions.push(questionKey);
    }

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
        if (type >= 21 && type <= 31) {
            htmlQ = htmlQ.split(/(<[^>]+>)/).map(part => part.startsWith("<") ? part : formatChemLabel(part)).join("");
        }
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
    
    let opts = [quizData.answer]; 
    if (quizData.forcedOpts) {
    opts = quizData.forcedOpts;
    } else {
    let safety = 0;
    while (opts.length < 4 && safety < 100) {
        safety++;
        // 混成/形狀題型不需要從 pool 選擇元素
        let cand = (type === 16 || type === 17) ? null : window.quizState.pool[Math.floor(Math.random() * window.quizState.pool.length)];
        let val = "";

        // 根據 displayMode 決定抓取什麼類型的錯誤選項
        switch (quizData.displayMode) {
    case "hybrid":
        // 混成軌域選項：從所有混成軌域中隨機選擇
        const allHybrids = ["sp", "sp²", "sp³", "sp³d", "sp³d²"];
        val = allHybrids[Math.floor(Math.random() * allHybrids.length)];
        break;
    case "noble":
        // 電子組態逆推選項：從pool中隨機挑元素的noble config
        val = cand ? cand.noble : "";
        break;
    case "symbol": val = cand ? cand.s : ""; break;
    case "chinese": val = cand ? cand.cn : ""; break;
    case "english": val = cand ? cand.n : ""; break;
    case "number":
        let offset = Math.floor(Math.random() * 11) - 5;
        val = Math.max(0, parseInt(quizData.answer) + offset).toString();
        break;
    case "ion":
                if (cand) {
                    let rC = Math.floor(Math.random() * 7) - 3;
                    if (rC === 0) {
                        val = cand.s;
                    } else {
                        let rVal = Math.abs(rC);
                        let rSign = rC > 0 ? "+" : "-";
                        val = `${cand.s}<sup class="chem-sup">${rVal === 1 ? "" : rVal}<span class="charge-sign ${rSign === '-' ? 'minus' : 'plus'}">${rSign}</span></sup>`;
                    }
                } else {
                    val = "";
                }
                break;
            case "raw":
                // 根據題型生成對應的選項格式
                if (type === 2) {
                    // Type 2: 座標格式，依 coordMode 決定用 IUPAC 或 A/B 族
                    const randomEl = window.quizState.pool[Math.floor(Math.random() * window.quizState.pool.length)];
                    const isLanEl = (randomEl.g === "鑭系" || randomEl.g === "錒系");
                    if (quizData.coordMode === "ab") {
                        const pCh = ["","一","二","三","四","五","六","七"][randomEl.p] || randomEl.p;
                        val = isLanEl ? `第${pCh}週期、${randomEl.g}` : `第${pCh}週期、${randomEl.g}族`;
                    } else {
                        val = `第 ${randomEl.p} 週期、第 ${randomEl.iupac} 族`;
                    }
                } else if (type === 4) {
                    // Type 4: 元素分類
                    const allTypes = [...new Set(ELECTRON_DATA.map(el => el.type))];
                    val = allTypes[Math.floor(Math.random() * allTypes.length)];
                } else if (type === 5) {
                    // Type 5: 常溫狀態
                    const allStates = [...new Set(ELECTRON_DATA.map(el => QUIZ_HELPER.getCleanState(el.state)))];
                    val = allStates[Math.floor(Math.random() * allStates.length)];
                } else if (type === 11) {
                    // Type 11: 區塊
                    if (cand) {
                        const i = cand.iupac; let b = "f";
                        if (cand.s === "He") b = "s";
                        else if (typeof i === 'number') { if (i <= 2) b = "s"; else if (i >= 13) b = "p"; else b = "d"; }
                        val = `${b} 區`;
                    } else {
                        val = "s 區"; // 預設值
                    }
                } else {
                    val = cand ? cand.s : "";
                }
                break;
            default: val = cand.s; break;
}
        
        // 確保選項不重複，不是空的，且不包含問題中提到的元素
        if (val && !opts.includes(val) && !questionElementSymbols.includes(val)) {
            // 對於符號類型的選項，也要檢查對應的元素是否在問題中
            if (quizData.displayMode === "symbol" && questionElementSymbols.includes(cand.s)) {
                continue; // 跳過這個選項
            }
            if (quizData.displayMode === "chinese" && questionElementSymbols.includes(cand.cn)) {
                continue; // 跳過這個選項
            }
            if (quizData.displayMode === "english" && questionElementSymbols.includes(cand.n)) {
                continue; // 跳過這個選項
            }
            opts.push(val);
        }
    }
    }

    // 洗牌選項並渲染到按鈕
    opts.sort(() => 0.5 - Math.random());
    const container = document.getElementById('quiz-options');
    container.innerHTML = "";
    document.getElementById('quiz-confirm-wrap').innerHTML = "";
    container.style.gridTemplateColumns = (quizData.displayMode === "noble") ? "1fr" : (opts.length <= 2 ? "1fr 1fr" : "");
    let selectedOption = null; // 儲存選中的選項

    opts.forEach((o, optionIndex) => {
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
        b.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + optionIndex)}</span><span class="option-value">${displayText}</span><span class="option-state-mark" aria-hidden="true"></span>`;
        b.dataset.value = o; // 儲存選項值（原始值，用於比較答案）
        b.title = String(o).replace(/<[^>]*>/g, '');
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
                    if (!isCalibrated) {
                        // 第一次點擊：校準
                        // 使用 requestAnimationFrame 確保動畫流暢
                        requestAnimationFrame(() => {
                            // 禁用所有選項
                            container.querySelectorAll('.option-btn').forEach(btn => {
                                btn.disabled = true;
                            });
                            
                            // 判斷答案是否正確
                            const isCorrect = (selectedOption === quizData.answer);
                            if (feedbackEl && quizData.showExplanation && quizData.explanationHtml) {
                                feedbackEl.innerHTML = quizData.explanationHtml;
                                feedbackEl.style.display = 'block';
                            }
                            
                            // 找到選中的按鈕並更新狀態
                            const selectedBtn = container.querySelector('.option-btn.selected');
                            if (selectedBtn) {
                                // 先移除選中狀態，使用短暫延遲讓動畫更流暢
                                selectedBtn.classList.remove('selected');
                                
                                // 使用 requestAnimationFrame 確保狀態更新在下一幀
                                requestAnimationFrame(() => {
                                    if (isCorrect) { 
                                        selectedBtn.classList.add('correct'); 
                                        window.quizState.correctCount++; 
                                    } else { 
                                        selectedBtn.classList.add('wrong'); 
                                        // 顯示正確答案
                                        container.querySelectorAll('.option-btn').forEach(btn => { 
                                            // 修正答案顯示比對邏輯，使用 dataset.value 來比對原始值
                                            if(btn.dataset.value === quizData.answer) {
                                                // 延遲顯示正確答案，讓錯誤動畫先完成
                                                setTimeout(() => {
                                                    btn.classList.add('correct');
                                                }, 300);
                                            }
                                        }); 
                                    }
                                });
                            }
                            
                            // 轉換按鈕為確認按鈕，使用動畫
                            setTimeout(() => {
                                isCalibrated = true;
                                confirmBtn.classList.add('confirmed');
                                confirmBtn.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
                                confirmBtn.textContent = isCorrect ? "✓ 數據正確  NEXT >" : "✕ 校準失敗  NEXT >";
                            }, 200);
                        });
                    } else {
                        // 第二次點擊：繼續下一題
                        window.renderNextQuestion();
                    }
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
        </div>`;
    const rptRank = window.quizState.rank ? ` RANK ${window.quizState.rank}` : '';
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
        S: '硫離子', S2O3: '硫代硫酸根', CrO4: '鉻酸根', Cr2O7: '重鉻酸根',
        MnO4: '錳酸根', ClO: '次氯酸根', ClO2: '亞氯酸根', ClO3: '氯酸根', ClO4: '過氯酸根',
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
            explanationHtml: `<strong>正確答案：</strong>${answer}。${explanation}`
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
                        quizData.type = '離子與組成：指定離子數量';
                        quizData.question = `「${item.n}」的一個化學式單位中，含有幾個 ${ionTextRaw(c)}？`;
                        quizData.questionHtml = `「${item.n}」的一個化學式單位中，含有幾個 ${ionHtml(c)}？`;
                        quizData.answer = String(c.count);
                        quizData.forcedOpts = numberOptions(c.count, DATA().filter(x => x.ions).map(x => x.ions.cation.count));
                    } else {
                        quizData.type = '離子與組成：陽陰離子最簡個數比';
                        quizData.question = `「${item.n}」由 ${ionTextRaw(c)} 與 ${ionTextRaw(a)} 組成，陽、陰離子的最簡個數比為何？`;
                        quizData.questionHtml = `「${item.n}」由 ${ionHtml(c)} 與 ${ionHtml(a)} 組成，陽、陰離子的最簡個數比為何？`;
                        quizData.answer = `${c.count}:${a.count}`;
                        quizData.forcedOpts = ratioOptions(quizData.answer, DATA().filter(x => x.ions).map(x => `${x.ions.cation.count}:${x.ions.anion.count}`));
                    }
                } else {
                    const counts = parseFormula(item.f);
                    const atom = atomForQuestion(counts);
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
            default:
                return false;
        }
        return Array.isArray(quizData.forcedOpts) && quizData.forcedOpts.length >= 2;
    }

    return { generate };
})();

