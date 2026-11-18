/* Oxidation-reduction and electrochemistry template bank. Loaded after calibration.js. */
(() => {
    const redoxSubtypes = [
        { id: 'oxidationState', label: '氧化數判定', description: '沿用既有 37 組資料；常見規則、氫氧特殊情況與平均氧化數辨識', required: true },
        { id: 'oxidationReduction', label: '氧化還原反應', description: '依氧化數升降、電子得失與反應前後變化判斷', required: true },
        { id: 'agents', label: '氧化劑與還原劑', description: '由反應式辨識氧化劑、還原劑及其反應後變化', required: true },
        { id: 'electronTransfer', label: '電子轉移量', description: '原子個數、氧化數差與物質莫耳數互換', required: true },
        { id: 'halfReaction', label: '半反應與配平', description: '電子方向、半反應係數及最小共同電子數', required: true },
        { id: 'disproportionation', label: '自身氧化還原與歸中', description: '依氧化數變化，辨識一般氧化還原、自身氧化還原、歸中及非氧化還原反應', required: false }
    ];
    const electrochemSubtypes = [
        { id: 'electrodeRole', label: '電極角色與極性', description: '陽極、陰極、正負極與氧化還原的對應', required: true },
        { id: 'cellOperation', label: '原電池運作', description: '電子、傳統電流與鹽橋離子方向', required: true },
        { id: 'electrodeChange', label: '電極與溶液變化', description: '電極質量及指定離子生成、消耗', required: true },
        { id: 'cellNotation', label: '電池表示法', description: '半電池、總反應、電池表示式與惰性電極', required: false },
        { id: 'standardPotential', label: '標準電位', description: '標準電池電位、自發方向與氧化還原能力', required: true },
        { id: 'electrolysisProduct', label: '電解產物', description: '依熔融或水溶液、電極材料與條件判產物', required: true },
        { id: 'chargeAmount', label: '電量與電解量', description: 'Q、I、t、電子莫耳數與析出質量正反向', required: true },
        { id: 'platingSeries', label: '電鍍與串聯電解', description: '電鍍時間、串聯產量、電流效率', required: false }
    ];

    window.CALIBRATION_EXTENSION_CATEGORIES.redox = {
        label: '氧化還原', difficulty: 14, subtypes: redoxSubtypes
    };
    window.CALIBRATION_EXTENSION_CATEGORIES.electrochem = {
        label: '電化學', difficulty: 15, subtypes: electrochemSubtypes
    };

    const shuffle = values => {
        const out = [...values];
        for (let i = out.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
    };
    const key = value => String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
    const fmt = (value, digits = 3) => Number(Number(value).toPrecision(digits)).toString();
    const signed = value => Number(value) > 0 ? `+${value}` : String(value).replace('-', '−');
    const htmlFormula = value => typeof window.formatFormula === 'function' ? window.formatFormula(value) : value;
    const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
    const CATALOG = new Map();

    function add(out, cfg, stems) {
        const answer = String(cfg.answer);
        const rationales = { ...(cfg.optionRationales || {}) };
        const options = [answer];
        for (const entry of shuffle(cfg.distractors || [])) {
            const value = String(typeof entry === 'object' ? entry.value : entry);
            if (options.some(item => key(item) === key(value))) continue;
            options.push(value);
            if (entry && typeof entry === 'object' && entry.reason) rationales[key(value)] = entry.reason;
            if (options.length === 4) break;
        }
        if (options.length < 3) return;
        stems.forEach((question, index) => {
            const id = `${cfg.template}:${cfg.factId}:${index + 1}`;
            out.push({
                id, template: cfg.template, subtype: cfg.subtype, question, answer,
                options: shuffle(options), displayMode: cfg.displayMode || 'text',
                basis: cfg.basis, steps: cfg.steps, conclusion: cfg.conclusion,
                misconception: cfg.misconception || '先辨認已知量與所求，再依反應係數或守恆關係計算。',
                optionRationales: rationales, syllabus: cfg.required === false ? '加深加廣選修' : '必修',
                type: cfg.type || cfg.subtype
            });
        });
    }

    const stemTriplet = (a, b, c) => [a, b, c];
    const redoxStems = {
        direct: fact => stemTriplet(
            `${htmlFormula(fact.formula)} 中 ${fact.element} 的氧化數為何？`,
            `求 ${htmlFormula(fact.formula)} 裡 ${fact.element} 的氧化數。`,
            `${htmlFormula(fact.formula)} 的 ${fact.element}：氧化數是多少？`
        ),
        reverse: (value, labels) => stemTriplet(
            `下列何者的指定元素氧化數為 ${signed(value)}？`,
            `找出指定元素氧化數等於 ${signed(value)} 的物種。`,
            `哪一物種符合「指定元素氧化數 ${signed(value)}」？`
        )
    };

    function buildOxidationState() {
        const out = [];
        (window.CALIBRATION_OXIDATION_FACTS || []).forEach((fact, index, facts) => {
            const answer = signed(fact.oxidation);
            const explain = `${fact.rule}。設 ${fact.element} 氧化數為 x，依氧化數總和等於粒子電荷列式，得 x＝${answer}。`;
            const errors = [
                { value: signed(-fact.oxidation), reason: '解氧化數總和時將正負號顛倒。' },
                { value: signed(fact.charge), reason: '把整個粒子的總電荷當成目標原子的氧化數。' },
                { value: signed(fact.count ? (fact.charge - fact.known) : fact.oxidation), reason: '算出目標元素氧化數總和後，漏除該元素原子個數。' },
                { value: signed(0), reason: '把化合物中的原子誤當成游離元素。' }
            ];
            add(out, {
                subtype: 'oxidationState', template: 'redox-oxidation-number-direct', factId: `legacy-${index}`,
                answer, distractors: errors, type: '氧化數判定｜化學式求氧化數',
                basis: fact.rule, steps: explain, conclusion: `${fact.element} 的氧化數為 ${answer}。`,
                misconception: '逐項套用氧化數規則；過氧化物、氧氟化物、金屬氫化物及多原子離子需依實際條件判斷。'
            }, redoxStems.direct(fact));
            const matching = facts.filter(item => item.oxidation === fact.oxidation).slice(0, 1);
            if (matching.length) {
                const correct = `${htmlFormula(fact.formula)} 中的 ${fact.element}`;
                const distractors = shuffle(facts.filter(item => item.oxidation !== fact.oxidation).slice(0, 8))
                    .slice(0, 3).map(item => `${htmlFormula(item.formula)} 中的 ${item.element}`);
                add(out, {
                    subtype: 'oxidationState', template: 'redox-oxidation-number-reverse', factId: `legacy-${index}`,
                    answer: correct, distractors, type: '氧化數判定｜氧化數反向辨識', displayMode: 'formula',
                    basis: '將選項物種依氧化數總和與粒子電荷逐一判斷。',
                    steps: `${fact.rule} ${fact.element} 的氧化數為 ${answer}，符合題目條件。`,
                    conclusion: `符合者為 ${correct}。`, misconception: '反向辨識時需確認指定元素及粒子電荷，不能只比化學式外觀。'
                }, redoxStems.reverse(fact.oxidation));
            }
        });
        return out;
    }

    const REDOX_TRANSFORMS = [
        { id:'fe', before:'Fe²⁺', after:'Fe³⁺', element:'Fe', old:2, now:3, e:1 },
        { id:'cu', before:'Cu²⁺', after:'Cu', element:'Cu', old:2, now:0, e:2 },
        { id:'cl', before:'Cl₂', after:'Cl⁻', element:'Cl', old:0, now:-1, e:1, atoms:2 },
        { id:'mn', before:'MnO₄⁻', after:'Mn²⁺', element:'Mn', old:7, now:2, e:5 },
        { id:'cr', before:'Cr₂O₇²⁻', after:'Cr³⁺', element:'Cr', old:6, now:3, e:3, atoms:2 },
        { id:'i', before:'I⁻', after:'I₂', element:'I', old:-1, now:0, e:1 },
        { id:'s', before:'SO₃²⁻', after:'SO₄²⁻', element:'S', old:4, now:6, e:2 },
        { id:'n', before:'NO₃⁻', after:'NO', element:'N', old:5, now:2, e:3 },
        { id:'zn', before:'Zn', after:'Zn²⁺', element:'Zn', old:0, now:2, e:2 },
        { id:'br', before:'Br₂', after:'Br⁻', element:'Br', old:0, now:-1, e:1, atoms:2 }
    ];
    const REDOX_REACTIONS = [
        { id:'permanganate-iron', equation:'MnO₄⁻＋5Fe²⁺＋8H⁺ → Mn²⁺＋5Fe³⁺＋4H₂O', oxidant:'MnO₄⁻', reductant:'Fe²⁺', red:'Fe²⁺ → Fe³⁺', ox:'MnO₄⁻ → Mn²⁺', medium:'酸性', species:['MnO₄⁻','Fe²⁺','H⁺','Mn²⁺','Fe³⁺','H₂O'] },
        { id:'dichromate-iodide', equation:'Cr₂O₇²⁻＋6I⁻＋14H⁺ → 2Cr³⁺＋3I₂＋7H₂O', oxidant:'Cr₂O₇²⁻', reductant:'I⁻', red:'I⁻ → I₂', ox:'Cr₂O₇²⁻ → Cr³⁺', medium:'酸性', species:['Cr₂O₇²⁻','I⁻','H⁺','Cr³⁺','I₂','H₂O'] },
        { id:'copper-zinc', equation:'Zn＋Cu²⁺ → Zn²⁺＋Cu', oxidant:'Cu²⁺', reductant:'Zn', red:'Zn → Zn²⁺', ox:'Cu²⁺ → Cu', medium:'水溶液', species:['Zn','Cu²⁺','Zn²⁺','Cu'] },
        { id:'chlorine-iron', equation:'Cl₂＋2Fe²⁺ → 2Cl⁻＋2Fe³⁺', oxidant:'Cl₂', reductant:'Fe²⁺', red:'Fe²⁺ → Fe³⁺', ox:'Cl₂ → Cl⁻', medium:'水溶液', species:['Cl₂','Fe²⁺','Cl⁻','Fe³⁺'] },
        { id:'acid-copper', equation:'Cu＋2NO₃⁻＋4H⁺ → Cu²⁺＋2NO₂＋2H₂O', oxidant:'NO₃⁻', reductant:'Cu', red:'Cu → Cu²⁺', ox:'NO₃⁻ → NO₂', medium:'濃硝酸酸性', species:['Cu','NO₃⁻','H⁺','Cu²⁺','NO₂','H₂O'] },
        { id:'hydrogen-oxygen', equation:'2H₂＋O₂ → 2H₂O', oxidant:'O₂', reductant:'H₂', red:'H₂ → H₂O', ox:'O₂ → H₂O', medium:'燃燒', species:['H₂','O₂','H₂O'] },
        { id:'sulfite-permanganate', equation:'2MnO₄⁻＋5SO₃²⁻＋6H⁺ → 2Mn²⁺＋5SO₄²⁻＋3H₂O', oxidant:'MnO₄⁻', reductant:'SO₃²⁻', red:'SO₃²⁻ → SO₄²⁻', ox:'MnO₄⁻ → Mn²⁺', medium:'酸性', species:['MnO₄⁻','SO₃²⁻','H⁺','Mn²⁺','SO₄²⁻','H₂O'] },
        { id:'bromine-iodide', equation:'Br₂＋2I⁻ → 2Br⁻＋I₂', oxidant:'Br₂', reductant:'I⁻', red:'I⁻ → I₂', ox:'Br₂ → Br⁻', medium:'水溶液', species:['Br₂','I⁻','Br⁻','I₂'] },
        { id:'iron-copper', equation:'Fe＋Cu²⁺ → Fe²⁺＋Cu', oxidant:'Cu²⁺', reductant:'Fe', red:'Fe → Fe²⁺', ox:'Cu²⁺ → Cu', medium:'水溶液', species:['Fe','Cu²⁺','Fe²⁺','Cu'] },
        { id:'peroxide-iodide', equation:'H₂O₂＋2I⁻＋2H⁺ → I₂＋2H₂O', oxidant:'H₂O₂', reductant:'I⁻', red:'I⁻ → I₂', ox:'H₂O₂ → H₂O', medium:'酸性', species:['H₂O₂','I⁻','H⁺','I₂','H₂O'] }
    ];

    function buildOxidationReduction() {
        const out = [];
        REDOX_TRANSFORMS.forEach(item => {
            const isOx = item.now > item.old;
            const role = isOx ? '氧化' : '還原';
            const sign = isOx ? '失去' : '得到';
            const eSide = isOx ? '生成物側' : '反應物側';
            add(out, {
                subtype:'oxidationReduction', template:'redox-change-direction', factId:item.id,
                answer:role, distractors:[isOx ? '還原' : '氧化', '非氧化還原', '無法判斷'],
                type:'氧化還原｜氧化數變化判斷',
                basis:'氧化數上升為氧化，氧化數下降為還原。',
                steps:`${item.element} 的氧化數由 ${signed(item.old)} 變為 ${signed(item.now)}，${isOx ? '上升' : '下降'}。`,
                conclusion:`此變化屬於${role}。`, misconception:'把氧化數上升與下降的定義顛倒。'
            }, [`${item.element}：${signed(item.old)} → ${signed(item.now)}，屬於氧化還是還原？`, `判斷 ${item.element} 由 ${signed(item.old)} 變成 ${signed(item.now)} 的變化。`, `${item.before} → ${item.after}，${item.element} 發生氧化或還原？`]);
            add(out, {
                subtype:'oxidationReduction', template:'redox-change-electron', factId:item.id,
                answer:`${sign} ${item.e} e⁻`, distractors:[`得到 ${item.e} e⁻`,`失去 ${item.e + 1} e⁻`,`得到 ${item.e + 1} e⁻`],
                type:'氧化還原｜物種變化求電子數',
                basis:'氧化數每改變 1，對應每個該原子轉移 1 個電子。',
                steps:`${item.element} 氧化數改變 ${Math.abs(item.now-item.old)}；依此變化判定電子得失方向。`,
                conclusion:`每個 ${item.element} 原子${sign} ${item.e} 個電子。`, misconception:'只記氧化數差，漏判電子得失方向或漏乘原子數。'
            }, [`${item.before} → ${item.after}，每個 ${item.element} 原子得失幾個電子？`, `由 ${item.before} 變成 ${item.after}，電子如何轉移？`, `${item.element} 氧化數改變 ${Math.abs(item.now-item.old)}，對應何種電子變化？`]);
        });
        REDOX_REACTIONS.forEach((rxn, i) => add(out, {
            subtype:'oxidationReduction', template:'redox-identify-reaction', factId:rxn.id,
            answer:'是', distractors:['否','僅發生氧化','僅發生還原'], type:'氧化還原｜判斷反應類型',
            basis:'氧化還原反應中必同時有氧化與還原。',
            steps:`${rxn.red} 的氧化數上升；${rxn.ox} 的氧化數下降。`,
            conclusion:'同時發生氧化與還原，故此反應為氧化還原反應。', misconception:'只找到單一物種變化，或把氧化與還原當成互斥反應。'
        }, [`${rxn.equation} 是氧化還原反應嗎？`, `檢查反應式：${rxn.equation}，是否有電子轉移？`, `反應 ${rxn.equation} 中，氧化數有升有降嗎？`]));
        [
            {id:'neutralization',equation:'HCl＋NaOH → NaCl＋H₂O',why:'各元素氧化數在反應前後不變。'},
            {id:'precipitation',equation:'AgNO₃＋NaCl → AgCl↓＋NaNO₃',why:'離子配對改變，元素氧化數均不變。'},
            {id:'carbonate-acid',equation:'CaCO₃＋2HCl → CaCl₂＋CO₂＋H₂O',why:'C 在反應前後皆為 +4，其他元素氧化數也不變。'},
            {id:'ammonia-water',equation:'NH₃＋H₂O ⇌ NH₄⁺＋OH⁻',why:'此為質子轉移，N 的氧化數仍為 −3。'}
        ].forEach(item=>add(out,{subtype:'oxidationReduction',template:'redox-identify-nonredox',factId:item.id,answer:'否',distractors:['是','僅發生氧化','僅發生還原'],type:'氧化還原｜辨認非氧化還原反應',basis:'若所有元素氧化數不變，反應不屬於氧化還原。',steps:item.why,conclusion:'此反應不是氧化還原反應。',misconception:'酸鹼、沉澱或氣體生成反應不一定是氧化還原；需比較反應前後的氧化數。'},[
            `${item.equation} 是氧化還原反應嗎？`,`判斷反應 ${item.equation} 是否有氧化數變化。`,`檢查 ${item.equation}：是否發生氧化還原？`]));
        return out;
    }

    function buildAgents() {
        const out = [];
        REDOX_REACTIONS.forEach(rxn => {
            const records = [
                { target:'oxidant', answer:rxn.oxidant, own:'被還原', other:'氧化', cue:'氧化劑接受電子，反應後自身被還原。' },
                { target:'reductant', answer:rxn.reductant, own:'被氧化', other:'還原', cue:'還原劑提供電子，反應後自身被氧化。' }
            ];
            records.forEach(record => {
                const pool = shuffle([...new Set(rxn.species.filter(x => x !== record.answer))]).slice(0, 3);
                add(out, {
                    subtype:'agents', template:`redox-${record.target}`, factId:rxn.id, answer:record.answer,
                    distractors:pool, type:`氧化劑與還原劑｜${record.target === 'oxidant' ? '找氧化劑' : '找還原劑'}`,
                    displayMode:'formula', basis:record.cue,
                    steps:`反應中 ${record.target === 'oxidant' ? rxn.oxidant : rxn.reductant} ${record.own}；依自身變化判斷其角色。`,
                    conclusion:`${record.answer} 是${record.target === 'oxidant' ? '氧化劑' : '還原劑'}。`,
                    misconception:'氧化劑自身被還原；還原劑自身被氧化。不要依名稱或反應物位置猜測。'
                }, [`${rxn.equation} 中的${record.target === 'oxidant' ? '氧化劑' : '還原劑'}是哪一種物質？`, `在反應 ${rxn.equation} 中，找出${record.target === 'oxidant' ? '氧化劑' : '還原劑'}。`, `${rxn.equation}：哪個反應物${record.target === 'oxidant' ? '接受電子' : '提供電子'}？`]);
            });
        });
        return out;
    }

    function buildElectronTransfer() {
        const out = [];
        REDOX_TRANSFORMS.forEach(item => {
            [0.2, 0.5, 1.2].forEach((amount, index) => {
                const electronsPerFormula = item.e * (item.atoms || 1);
                const electrons = amount * electronsPerFormula;
                const options = [electrons, amount, electrons * 2, electrons / 2]
                    .map((v, i) => ({ value:`${fmt(v,3)} mol`, reason:[
                        '依氧化數差換算電子莫耳數。', '漏乘每個物種的電子係數。', '把轉移電子數加倍。', '將電子莫耳數除以電子係數。'
                    ][i] }));
                add(out, {
                    subtype:'electronTransfer', template:'redox-mole-electron', factId:`${item.id}-${index}`,
                    answer:`${fmt(electrons,3)} mol`, distractors:options, type:'電子轉移量｜物質莫耳數求電子莫耳數',
                    basis:`每 1 mol ${item.before} 對應 ${electronsPerFormula} mol e⁻。`,
                    steps:`n(e⁻)＝${fmt(amount)} mol × ${electronsPerFormula}＝${fmt(electrons,3)} mol。`,
                    conclusion:`轉移電子量為 ${fmt(electrons,3)} mol。`, misconception:'物質莫耳數需乘上每個粒子轉移的電子數。'
                }, [`${fmt(amount)} mol ${item.before} 轉變成 ${item.after}，轉移多少 mol 電子？`, `若有 ${fmt(amount)} mol ${item.before} 反應，電子轉移量為何？`, `${item.before} → ${item.after}，${fmt(amount)} mol 物質對應幾 mol e⁻？`]);
                const substance = electrons / electronsPerFormula;
                add(out, {
                    subtype:'electronTransfer', template:'redox-mole-species', factId:`${item.id}-${index}`,
                    answer:`${fmt(substance,3)} mol`,
                    distractors:[{value:`${fmt(electrons,3)} mol`,reason:'把電子莫耳數直接當成反應物莫耳數。'},{value:`${fmt(electrons*electronsPerFormula,3)} mol`,reason:'應除以每莫耳物種對應的電子係數，卻再次相乘。'},{value:`${fmt(substance/2,3)} mol`,reason:'多除了一次電子係數。'}],
                    type:'電子轉移量｜電子莫耳數反求物質量',
                    basis:`每 1 mol ${item.before} 轉移 ${electronsPerFormula} mol 電子。`,
                    steps:`n(${item.before})＝${fmt(electrons,3)} mol ÷ ${electronsPerFormula}＝${fmt(substance,3)} mol。`,
                    conclusion:`${item.before} 的量為 ${fmt(substance,3)} mol。`, misconception:'反求物質量時以電子莫耳數除以每莫耳物種的電子係數。'
                }, [`轉移 ${fmt(electrons,3)} mol 電子，相當於多少 mol ${item.before} 反應？`, `若電子量為 ${fmt(electrons,3)} mol，${item.before} 的反應量為何？`, `${item.before} → ${item.after}，${fmt(electrons,3)} mol e⁻ 對應多少 mol 物種？`]);
            });
        });
        return out;
    }

    const HALF_RXNS = [
        { id:'fe', text:'Fe²⁺ → Fe³⁺', e:1, side:'右側', coefficient:1, medium:'酸性' },
        { id:'cu', text:'Cu²⁺ → Cu', e:2, side:'左側', coefficient:2, medium:'水溶液' },
        { id:'mn', text:'MnO₄⁻ → Mn²⁺', e:5, side:'左側', coefficient:5, medium:'酸性' },
        { id:'cr', text:'Cr₂O₇²⁻ → Cr³⁺', e:6, side:'左側', coefficient:6, medium:'酸性' },
        { id:'cl', text:'Cl₂ → Cl⁻', e:2, side:'左側', coefficient:2, medium:'水溶液' },
        { id:'i', text:'I⁻ → I₂', e:2, side:'右側', coefficient:2, medium:'水溶液' },
        { id:'so', text:'SO₃²⁻ → SO₄²⁻', e:2, side:'右側', coefficient:2, medium:'酸性' },
        { id:'no', text:'NO₃⁻ → NO', e:3, side:'左側', coefficient:3, medium:'酸性' }
    ];
    function buildHalfReaction() {
        const out = [];
        HALF_RXNS.forEach(rx => {
            add(out, {
                subtype:'halfReaction', template:'redox-half-electrons', factId:rx.id,
                answer:`e⁻ 在${rx.side}`, distractors:[`e⁻ 在${rx.side === '左側' ? '右側' : '左側'}`, '無電子', '需乘 2 才能判斷'],
                type:'半反應與配平｜判電子方向', basis:'半反應配平後，電荷較正的一側需加入電子以平衡電荷。',
                steps:`${rx.text}；${rx.medium}條件下配平原子與電荷，電子位於${rx.side}。`,
                conclusion:`電子應放在${rx.side}。`, misconception:'電子位於還原半反應的反應物側、氧化半反應的生成物側。'
            }, [`半反應 ${rx.text}（${rx.medium}），電子應在方程式哪一側？`, `配平 ${rx.text}，e⁻ 放在左側還是右側？`, `${rx.text} 的半反應中，電子位於哪一側？`]);
            add(out, {
                subtype:'halfReaction', template:'redox-half-electron-coefficient', factId:rx.id,
                answer:String(rx.coefficient), distractors:[String(Math.max(1,rx.coefficient-1)),String(rx.coefficient+1),String(rx.coefficient*2)],
                type:'半反應與配平｜電子係數', basis:'半反應需同時守恆原子數與總電荷。',
                steps:`${rx.text} 的氧化數變化與原子數相乘，補入 ${rx.coefficient} 個電子後電荷守恆。`,
                conclusion:`電子係數為 ${rx.coefficient}。`, misconception:'要乘上同一化學式中該元素的原子個數，且檢查電荷守恆。'
            }, [`${rx.text} 配平後，e⁻ 的係數為多少？`, `在 ${rx.text} 的半反應中需補幾個電子？`, `配平 ${rx.text} 時，電子係數是多少？`]);
        });
        [[1,2],[2,3],[5,2],[3,2],[6,5],[4,3]].forEach(([a,b],i) => {
            const lcm = a*b / gcd(a,b);
            add(out, {
                subtype:'halfReaction', template:'redox-electron-lcm', factId:`lcm-${i}`,
                answer:`${lcm} mol e⁻`, distractors:[`${a+b} mol e⁻`,`${a*b} mol e⁻`,`${Math.abs(a-b)} mol e⁻`],
                type:'半反應與配平｜最小共同電子數', basis:'兩半反應需乘整數，使失去與得到的電子莫耳數相等。',
                steps:`${a} 與 ${b} 的最小公倍數為 ${lcm}，因此共同電子數為 ${lcm} mol。`,
                conclusion:`最小共同電子數為 ${lcm} mol e⁻。`, misconception:'應取最小公倍數，避免只相加或直接相乘造成非最小係數。'
            }, [`兩半反應每 mol 物種分別轉移 ${a} mol 與 ${b} mol 電子，最小共同電子數為何？`, `${a} mol e⁻ 與 ${b} mol e⁻ 的最小共同量是多少？`, `兩半反應的電子係數為 ${a}、${b}，配平需取多少 mol e⁻？`]);
        });
        [
            {id:'permanganate-iron',equation:'MnO₄⁻＋Fe²⁺＋H⁺ → Mn²⁺＋Fe³⁺＋H₂O',medium:'酸性',asked:'Fe²⁺ : MnO₄⁻',answer:'5 : 1',ratio:[5,1],basis:'MnO₄⁻ 還原半反應需 5 e⁻，每個 Fe²⁺ 氧化提供 1 e⁻。'},
            {id:'dichromate-iodide',equation:'Cr₂O₇²⁻＋I⁻＋H⁺ → Cr³⁺＋I₂＋H₂O',medium:'酸性',asked:'I⁻ : Cr₂O₇²⁻',answer:'6 : 1',ratio:[6,1],basis:'每個 Cr₂O₇²⁻ 接受 6 e⁻；每個 I⁻ 氧化提供 1 e⁻。'},
            {id:'copper-zinc',equation:'Zn＋Cu²⁺ → Zn²⁺＋Cu',medium:'水溶液',asked:'Zn : Cu²⁺',answer:'1 : 1',ratio:[1,1],basis:'Zn 氧化提供 2 e⁻，Cu²⁺ 還原消耗 2 e⁻。'},
            {id:'bromine-iron',equation:'Br₂＋Fe²⁺ → Br⁻＋Fe³⁺',medium:'水溶液',asked:'Fe²⁺ : Br₂',answer:'2 : 1',ratio:[2,1],basis:'每個 Br₂ 還原需 2 e⁻，每個 Fe²⁺ 氧化提供 1 e⁻。'},
            {id:'acid-copper',equation:'Cu＋NO₃⁻＋H⁺ → Cu²⁺＋NO₂＋H₂O',medium:'酸性',asked:'Cu : NO₃⁻',answer:'1 : 2',ratio:[1,2],basis:'每個 Cu 氧化提供 2 e⁻；每個 NO₃⁻ 還原至 NO₂ 接受 1 e⁻。'}
        ].forEach(item=>{
            const [a,b]=item.ratio;
            const distractors=[
                {value:`${b} : ${a}`,reason:'把所求係數比的前後項顛倒。'},
                {value:'1 : 1',reason:'直接假設兩種物質係數相等，未按電子守恆調整。'},
                {value:`${a+b} : 1`,reason:'把兩半反應所需電子數相加，未取最小共同電子數。'},
                {value:`${a} : ${b+1}`,reason:'調整了一側係數，卻未同步守恆電子。'},
                {value:'3 : 1',reason:'未依半反應電子係數調整係數比。'},
                {value:'1 : 3',reason:'未依半反應電子係數調整係數比。'}
            ].filter((entry,index,all)=>entry.value!==item.answer&&all.findIndex(other=>other.value===entry.value)===index).slice(0,3);
            add(out,{subtype:'halfReaction',template:'redox-full-reaction-coefficient-ratio',factId:item.id,answer:item.answer,distractors,type:'半反應與配平｜係數比',basis:'先配平兩半反應，再使電子得失總數相等。',steps:`${item.basis} 配平介質中的 H⁺、H₂O 後，${item.asked} 的係數比為 ${item.answer}。`,conclusion:`${item.asked}＝${item.answer}。`,misconception:'以兩半反應電子係數的最小公倍數調整係數，再約成最簡整數比。'},[
                `${item.equation} 在${item.medium}中配平後，${item.asked} 的係數比為何？`,`配平反應 ${item.equation}，求 ${item.asked} 的最簡係數比。`,`${item.medium}條件下，反應骨架 ${item.equation} 的 ${item.asked} 係數比是多少？`]);
        });
        return out;
    }
    function gcd(a,b){ return b ? gcd(b,a%b) : Math.abs(a); }

    const DISPROPORTION = [
        { id:'cl2-water', equation:'Cl₂＋H₂O ⇌ HCl＋HClO', kind:'自身氧化還原反應', rule:'Cl 的氧化數由 0 同時升高為 +1、降低為 −1。', cue:'Cl₂ 中 Cl(0) 同時變為 Cl⁻(−1) 與 HClO 中 Cl(+1)' },
        { id:'h2o2', equation:'2H₂O₂ → 2H₂O＋O₂', kind:'自身氧化還原反應', rule:'O 的氧化數由 −1 同時降低為 −2、升高為 0。', cue:'H₂O₂ 中 O(−1) 同時變為 H₂O 中 O(−2) 與 O₂ 中 O(0)' },
        { id:'no2', equation:'2NO₂＋H₂O → HNO₂＋HNO₃', kind:'自身氧化還原反應', rule:'N 的氧化數由 +4 同時降低為 +3、升高為 +5。', cue:'NO₂ 中 N(+4) 同時變為 HNO₂ 中 N(+3) 與 HNO₃ 中 N(+5)' },
        { id:'cu', equation:'2Cu⁺ → Cu²⁺＋Cu', kind:'自身氧化還原反應', rule:'Cu 的氧化數由 +1 同時升高為 +2、降低為 0。', cue:'Cu⁺ 中 Cu(+1) 同時變為 Cu²⁺ 中 Cu(+2) 與 Cu(s)(0)' },
        { id:'fe', equation:'Fe＋2Fe³⁺ → 3Fe²⁺', kind:'歸中反應', rule:'Fe 的氧化數 0 與 +3 轉變為相同的 +2。', cue:'Fe(s)(0) 與 Fe³⁺(+3) 共同生成 Fe²⁺(+2)' },
        { id:'s', equation:'SO₂＋2H₂S → 3S＋2H₂O', kind:'歸中反應', rule:'S 的氧化數 +4 與 −2 轉變為相同的 0。', cue:'SO₂ 中 S(+4) 與 H₂S 中 S(−2) 共同生成 S(0)' },
        { id:'clo', equation:'ClO⁻＋Cl⁻＋2H⁺ → Cl₂＋H₂O', kind:'歸中反應', rule:'Cl 的氧化數 +1 與 −1 轉變為相同的 0。', cue:'ClO⁻ 中 Cl(+1) 與 Cl⁻(−1) 共同生成 Cl₂(0)' },
        { id:'i', equation:'IO₃⁻＋5I⁻＋6H⁺ → 3I₂＋3H₂O', kind:'歸中反應', rule:'I 的氧化數 +5 與 −1 轉變為相同的 0。', cue:'IO₃⁻ 中 I(+5) 與 I⁻(−1) 共同生成 I₂(0)' },
        { id:'cl-alkali', equation:'Cl₂＋2OH⁻ → Cl⁻＋ClO⁻＋H₂O', kind:'自身氧化還原反應', rule:'Cl 的氧化數由 0 同時升高為 +1、降低為 −1。', cue:'Cl₂ 在鹼性條件下生成 Cl⁻ 與 ClO⁻' },
        { id:'nitrous', equation:'3HNO₂ → HNO₃＋2NO＋H₂O', kind:'自身氧化還原反應', rule:'N 的氧化數由 +3 同時升高為 +5、降低為 +2。', cue:'HNO₂ 中 N(+3) 同時變為 HNO₃ 中 N(+5) 與 NO 中 N(+2)' }
    ];
    function buildDisproportionation() {
        const out=[];
        DISPROPORTION.forEach(rx => {
            add(out, {
            subtype:'disproportionation', template:'redox-disproportionation-kind', factId:rx.id,
            answer:rx.kind, distractors:['一般氧化還原反應','自身氧化還原反應','歸中反應','非氧化還原反應'].filter((v,i,a)=>v!==rx.kind&&a.indexOf(v)===i),
            type:'氧化還原分類｜反應類型', basis:'自身氧化還原反應中，同種元素的氧化數在同一反應中同時升高、降低；歸中反應中，不同氧化數轉變為相同氧化數。',
            steps:rx.rule, conclusion:`此反應屬於${rx.kind}。`, misconception:'判斷同種元素在反應前後的氧化數變化，不依反應物或生成物數量猜測。'
            }, [`${rx.equation} 屬於一般氧化還原反應、自身氧化還原反應、歸中反應，或非氧化還原反應？`, `判斷反應類型：${rx.equation}`, `${rx.equation} 中同種元素的氧化數變化符合哪一類？`]);
            const choices=shuffle(DISPROPORTION.filter(item=>item.id!==rx.id)).slice(0,3).map(item=>item.equation);
            add(out,{subtype:'disproportionation',template:'redox-disproportionation-reverse',factId:rx.id,answer:rx.equation,distractors:choices,type:'氧化還原分類｜由氧化數變化選反應',displayMode:'formula',basis:'對照題目指定元素在反應前後的氧化數，辨識自身氧化還原或歸中反應。',steps:`${rx.cue}，符合「${rx.kind}」的定義。`,conclusion:`符合條件的反應為 ${rx.equation}。`,misconception:'不要只依反應類型選擇；還需核對題目指定元素的氧化數。'},[
                `下列哪個反應符合：${rx.cue}？`,`選出符合「${rx.cue}」的反應式。`,`哪個反應中的氧化數變化為：${rx.cue}？`]);
        });
        return out;
    }

    const CELLS = [
        { id:'zncu', anode:'Zn', cathode:'Cu', anion:'NO₃⁻', cation:'K⁺', e:'Zn → Zn²⁺＋2e⁻', c:'Cu²⁺＋2e⁻ → Cu', notation:'Zn(s)｜Zn²⁺(aq) || Cu²⁺(aq)｜Cu(s)', E:-0.76, Ec:0.34 },
        { id:'mgcu', anode:'Mg', cathode:'Cu', anion:'NO₃⁻', cation:'K⁺', e:'Mg → Mg²⁺＋2e⁻', c:'Cu²⁺＋2e⁻ → Cu', notation:'Mg(s)｜Mg²⁺(aq) || Cu²⁺(aq)｜Cu(s)', E:-2.37, Ec:0.34 },
        { id:'fecu', anode:'Fe', cathode:'Cu', anion:'SO₄²⁻', cation:'K⁺', e:'Fe → Fe²⁺＋2e⁻', c:'Cu²⁺＋2e⁻ → Cu', notation:'Fe(s)｜Fe²⁺(aq) || Cu²⁺(aq)｜Cu(s)', E:-0.44, Ec:0.34 },
        { id:'znag', anode:'Zn', cathode:'Ag', anion:'NO₃⁻', cation:'K⁺', e:'Zn → Zn²⁺＋2e⁻', c:'2Ag⁺＋2e⁻ → 2Ag', notation:'Zn(s)｜Zn²⁺(aq) || Ag⁺(aq)｜Ag(s)', E:-0.76, Ec:0.80 },
        { id:'alcu', anode:'Al', cathode:'Cu', anion:'NO₃⁻', cation:'K⁺', e:'Al → Al³⁺＋3e⁻', c:'Cu²⁺＋2e⁻ → Cu', notation:'Al(s)｜Al³⁺(aq) || Cu²⁺(aq)｜Cu(s)', E:-1.66, Ec:0.34 },
        { id:'pbcu', anode:'Pb', cathode:'Cu', anion:'NO₃⁻', cation:'K⁺', e:'Pb → Pb²⁺＋2e⁻', c:'Cu²⁺＋2e⁻ → Cu', notation:'Pb(s)｜Pb²⁺(aq) || Cu²⁺(aq)｜Cu(s)', E:-0.13, Ec:0.34 },
        { id:'sncu', anode:'Sn', cathode:'Cu', anion:'NO₃⁻', cation:'K⁺', e:'Sn → Sn²⁺＋2e⁻', c:'Cu²⁺＋2e⁻ → Cu', notation:'Sn(s)｜Sn²⁺(aq) || Cu²⁺(aq)｜Cu(s)', E:-0.14, Ec:0.34 }
    ];
    const EL = [
        { id:'ag', name:'Ag⁺/Ag', half:'Ag⁺(aq)＋e⁻ → Ag(s)', oxidant:'Ag⁺', E:0.80 },
        { id:'cu', name:'Cu²⁺/Cu', half:'Cu²⁺(aq)＋2e⁻ → Cu(s)', oxidant:'Cu²⁺', E:0.34 },
        { id:'h', name:'2H⁺/H₂', half:'2H⁺(aq)＋2e⁻ → H₂(g)', oxidant:'H⁺', E:0.00 },
        { id:'pb', name:'Pb²⁺/Pb', half:'Pb²⁺(aq)＋2e⁻ → Pb(s)', oxidant:'Pb²⁺', E:-0.13 },
        { id:'sn', name:'Sn²⁺/Sn', half:'Sn²⁺(aq)＋2e⁻ → Sn(s)', oxidant:'Sn²⁺', E:-0.14 },
        { id:'fe', name:'Fe²⁺/Fe', half:'Fe²⁺(aq)＋2e⁻ → Fe(s)', oxidant:'Fe²⁺', E:-0.44 },
        { id:'zn', name:'Zn²⁺/Zn', half:'Zn²⁺(aq)＋2e⁻ → Zn(s)', oxidant:'Zn²⁺', E:-0.76 },
        { id:'al', name:'Al³⁺/Al', half:'Al³⁺(aq)＋3e⁻ → Al(s)', oxidant:'Al³⁺', E:-1.66 },
        { id:'mg', name:'Mg²⁺/Mg', half:'Mg²⁺(aq)＋2e⁻ → Mg(s)', oxidant:'Mg²⁺', E:-2.37 }
    ];
    function buildElectrodeRole() {
        const out=[];
        CELLS.forEach(cell => {
            [
                { half:cell.e, role:'陽極', polarity:'負極', process:'氧化' },
                { half:cell.c, role:'陰極', polarity:'正極', process:'還原' }
            ].forEach((row,i) => {
                add(out, { subtype:'electrodeRole', template:'electrode-half-role', factId:`${cell.id}-${i}`,
                    answer:row.role, distractors:[row.role==='陽極'?'陰極':'陽極','正極','負極'],
                    type:'電極角色與極性｜半反應判電極', basis:'陽極發生氧化，陰極發生還原。',
                    steps:`${row.half} 是${row.process}半反應，故發生於${row.role}。`, conclusion:`此半反應位於${row.role}。`,
                    misconception:'陽極／陰極由反應決定；原電池陽極為負、陰極為正。'
                }, [`${row.half} 發生在陽極還是陰極？`, `判斷半反應 ${row.half} 的電極角色。`, `${row.half} 是${row.process}，位於哪一極？`]);
                add(out, { subtype:'electrodeRole', template:'electrode-polarity', factId:`${cell.id}-${i}`,
                    answer:row.polarity, distractors:[row.polarity==='負極'?'正極':'負極',row.role,row.role==='陽極'?'陰極':'陽極'],
                    type:'電極角色與極性｜原電池判極性', basis:'原電池陽極為負極、陰極為正極。',
                    steps:`原電池中${row.role}發生${row.process}，因此為${row.polarity}。`, conclusion:`該電極為${row.polarity}。`,
                    misconception:'勿將電解池極性套用到原電池；電解池陽極正、陰極負。'
                }, [`原電池的${row.role}是正極還是負極？`, `此電池中發生${row.process}的${row.role}帶何種極性？`, `原電池${row.role}的電極極性為何？`]);
                const electrolysisPolarity=row.role==='陽極'?'正極':'負極';
                add(out,{subtype:'electrodeRole',template:'electrolytic-electrode-polarity',factId:`${cell.id}-${i}`,answer:electrolysisPolarity,distractors:[electrolysisPolarity==='正極'?'負極':'正極',row.role,row.role==='陽極'?'陰極':'陽極'],type:'電極角色與極性｜電解池判極性',basis:'電解池中陽極接電源正端、陰極接電源負端。',steps:`${row.role}定義仍由氧化／還原決定；在電解池中${row.role}為${electrolysisPolarity}。`,conclusion:`電解池${row.role}為${electrolysisPolarity}。`,misconception:'原電池與電解池的電極極性相反；陽極氧化、陰極還原則不變。'},[
                    `電解池的${row.role}接正極還是負極？`,`電解裝置中發生${row.process}的${row.role}帶何種極性？`,`判斷電解池${row.role}的正負極。`]);
            });
        });
        return out;
    }
    function buildCellOperation() {
        const out=[];
        CELLS.forEach(cell => {
            const rows=[
                { q:'電子由哪個電極流向哪個電極？', a:`${cell.anode} 電極 → ${cell.cathode} 電極`, d:[`${cell.cathode} 電極 → ${cell.anode} 電極`,`電子由${cell.anode}半電池經溶液流向${cell.cathode}半電池`,`電子由${cell.cathode}半電池經鹽橋流向${cell.anode}半電池`], why:'電子由原電池陽極經外電路流向陰極；鹽橋中移動的是離子。' },
                { q:'外電路傳統電流方向為何？', a:`${cell.cathode} 電極 → ${cell.anode} 電極`, d:[`${cell.anode} 電極 → ${cell.cathode} 電極`,`傳統電流由${cell.cathode}半電池經鹽橋流向${cell.anode}半電池`,`傳統電流由${cell.anode}電極流經外電路至${cell.cathode}電極`], why:'傳統電流方向與電子流方向相反，且經外電路。' },
                { q:`鹽橋中的 ${cell.anion} 主要移向哪一側？`, a:`${cell.anode} 半電池`, d:[`${cell.cathode} 半電池`,'同時等量移向兩側','不經鹽橋移動，只走外電路'], why:'陽極氧化使溶液累積正電，鹽橋陰離子移向陽極側。' },
                { q:`鹽橋中的 ${cell.cation} 主要移向哪一側？`, a:`${cell.cathode} 半電池`, d:[`${cell.anode} 半電池`,'同時等量移向兩側','不經鹽橋移動，只走外電路'], why:'陰極還原使溶液電荷平衡改變，鹽橋陽離子主要移向陰極側。' }
            ];
            rows.forEach((r,i)=>add(out,{subtype:'cellOperation',template:'galvanic-cell-flow',factId:`${cell.id}-${i}`,answer:r.a,distractors:r.d,type:'原電池運作｜方向判斷',basis:'原電池由自發氧化還原反應推動；電子經外電路，離子經鹽橋維持電中性。',steps:`${cell.anode} 為陽極，${cell.cathode} 為陰極。${r.why}`,conclusion:`${r.q.replace('？','')}：${r.a}。`,misconception:'電子走外電路，鹽橋只讓離子遷移；傳統電流與電子方向相反。'},[
                `${cell.anode}｜${cell.cathode} 原電池：${r.q}`,
                `此原電池以 ${cell.anode} 為陽極、${cell.cathode} 為陰極。${r.q}`,
                `依 ${cell.e} 與 ${cell.c}，${r.q}`
            ]));
        });
        return out;
    }

    const HALF_CHANGES = [
        {id:'zn',half:'Zn(s) → Zn²⁺(aq)＋2e⁻',mass:'減少',ion:'Zn²⁺',change:'增加',opts:['減少','增加','不變']},
        {id:'cu',half:'Cu²⁺(aq)＋2e⁻ → Cu(s)',mass:'增加',ion:'Cu²⁺',change:'減少',opts:['增加','減少','不變']},
        {id:'ag',half:'Ag⁺(aq)＋e⁻ → Ag(s)',mass:'增加',ion:'Ag⁺',change:'減少',opts:['增加','減少','不變']},
        {id:'fe',half:'Fe(s) → Fe²⁺(aq)＋2e⁻',mass:'減少',ion:'Fe²⁺',change:'增加',opts:['減少','增加','不變']},
        {id:'ni',half:'Ni²⁺(aq)＋2e⁻ → Ni(s)',mass:'增加',ion:'Ni²⁺',change:'減少',opts:['增加','減少','不變']},
        {id:'cl',half:'2Cl⁻(aq) → Cl₂(g)＋2e⁻',mass:'不變',ion:'Cl⁻',change:'減少',opts:['增加','減少','不變']}
    ];
    function buildElectrodeChange(){
        const out=[];
        HALF_CHANGES.forEach(item=>{
            const condition=item.id==='cl'?'惰性電極上':'電極上';
            add(out,{subtype:'electrodeChange',template:'electrode-mass-change',factId:item.id,answer:item.mass,distractors:item.opts.filter(x=>x!==item.mass),type:'電極與溶液變化｜電極質量',basis:'金屬沉積會增加電極質量；金屬氧化溶出會減少電極質量；惰性電極不因氣體逸出改變質量。',steps:`${item.half}。${item.id==='cl'?'此反應產生氣體，惰性電極本身不消耗。':`固態金屬${item.mass==='增加'?'沉積':'溶出'}。`}`,conclusion:`電極質量${item.mass}。`,misconception:'看固態金屬是沉積到電極或由電極進入溶液。'},[
                `半反應 ${item.half} 發生${condition}，電極質量如何變化？`,`${condition}${item.half}；電極質量會增加、減少或不變？`,`依${condition}${item.half}，判斷電極質量變化。`]);
            add(out,{subtype:'electrodeChange',template:'electrode-ion-change',factId:item.id,answer:item.change,distractors:item.opts.filter(x=>x!==item.change),type:'電極與溶液變化｜離子量',basis:'依半反應的反應物與生成物判斷指定離子消耗或生成。',steps:`${item.half} 中 ${item.ion} 位於${item.change==='增加'?'生成物':'反應物'}側，因此其量${item.change}。`,conclusion:`${item.ion} 的量${item.change}。`,misconception:'不要把電極質量變化與溶液離子濃度變化方向混為一談。'},[
                `半反應 ${item.half} 進行時，${item.ion} 的量如何變化？`,`依 ${item.half}，溶液中的 ${item.ion} 會增加、減少或不變？`,`判斷半反應 ${item.half} 對 ${item.ion} 量的影響。`]);
        });
        return out;
    }
    function buildCellNotation(){
        const out=[];
        CELLS.forEach(cell=>{
            const left=cell.notation.split(' || ')[0], right=cell.notation.split(' || ')[1];
            const reversed=`${right} || ${left}`;
            [
                {id:'anode',answer:cell.e,other:cell.c,question:'左側半電池反應'},
                {id:'cathode',answer:cell.c,other:cell.e,question:'右側半電池反應'},
                {id:'notation',answer:cell.notation,other:reversed,question:'電池表示式'}
            ].forEach(item=>{
                const reverseHalf=item.id==='anode'||item.id==='cathode' ? item.answer.split(' → ').reverse().join(' → ') : cell.notation.replace(' || ',' | ');
                const distractors=item.id==='notation' ? [item.other,reverseHalf] : [item.other,reverseHalf];
                add(out,{subtype:'cellNotation',template:`cell-notation-${item.id}`,factId:cell.id,answer:item.answer,distractors,type:'電池表示法｜反應與表示式',displayMode:'formula',basis:'電池表示式左側為陽極氧化、右側為陰極還原；單線為相界，雙線為鹽橋。',steps:`左側 ${left} 對應 ${cell.e}；右側 ${right} 對應 ${cell.c}。`,conclusion:`${item.question}為 ${item.answer}。`,misconception:'依題目指定左、右半電池或電池表示式作答；半反應方向需符合陽極氧化、陰極還原。'},[
                `${cell.notation}：${item.question}為何？`,`依電池表示式 ${cell.notation}，求${item.question}。`,`電池 ${cell.notation} 的${item.question}是什麼？`]);
            });
        });
        return out;
    }
    function buildStandardPotential(){
        const out=[];
        for(let i=0;i<EL.length;i++) for(let j=i+1;j<EL.length;j++){
            const high=EL[i], low=EL[j]; if(high.E<=low.E) continue;
            const value=high.E-low.E;
            if(value<0.20) continue;
            add(out,{subtype:'standardPotential',template:'standard-cell-potential',factId:`${high.id}-${low.id}`,answer:`${fmt(value,3)} V`,distractors:[
                {value:`${fmt(-value,3)} V`,reason:'將陽極與陰極次序顛倒，得到相反號。'},
                {value:`${fmt(high.E+low.E,3)} V`,reason:'把兩個還原電位相加，應以陰極還原電位減陽極還原電位。'},
                {value:`${fmt(value*2,3)} V`,reason:'把標準電位乘上反應係數；電位是強度量，不乘係數。'}],
                type:'標準電位｜求標準電池電位',basis:'E°cell＝E°red(陰極)－E°red(陽極)，電位不乘平衡係數。',
                steps:`E°cell＝${fmt(high.E,2)}－(${fmt(low.E,2)})＝${fmt(value,3)} V。`,conclusion:`標準電池電位為 ${fmt(value,3)} V。`,misconception:'不要把兩個還原電位相加、次序顛倒或乘反應係數。'},[
                `標準狀態下，${high.name} 為陰極、${low.name} 為陽極，求 E°cell。`,
                `以 ${low.name} 為陽極、${high.name} 為陰極的原電池，其標準電壓是多少？`,
                `${low.name}｜${high.name} 電池在標準條件下的電池電位是多少？`]);
            add(out,{subtype:'standardPotential',template:'standard-potential-reverse',factId:`${high.id}-${low.id}`,answer:`${fmt(low.E,2)} V`,distractors:[
                {value:`${fmt(high.E,2)} V`,reason:'把已知陰極還原電位當成所求陽極還原電位。'},
                {value:`${fmt(-low.E,2)} V`,reason:'反求時把電位正負號反轉。'},
                {value:`${fmt(high.E+value,2)} V`,reason:'由 E°cell＝E°cathode−E°anode 反求時錯用加法。'}],
                type:'標準電位｜電池電位反求半電池電位',basis:'E°cell＝E°red(陰極)－E°red(陽極)。',
                steps:`E°red(陽極)＝${fmt(high.E,2)}－${fmt(value,3)}＝${fmt(low.E,2)} V。`,conclusion:`${low.name} 的標準還原電位為 ${fmt(low.E,2)} V。`,misconception:'反求時仍按陰極減陽極的順序列式，不因未知量改變符號。'},[
                    `E°cell＝${fmt(value,3)} V，陰極為 ${high.name}（E°red＝${fmt(high.E,2)} V），求陽極還原電位。`,
                    `標準電池電位 ${fmt(value,3)} V，陰極還原電位 ${fmt(high.E,2)} V，陽極的 E°red 為何？`,
                    `已知 E°cell=${fmt(value,3)} V、E°red(陰極)=${fmt(high.E,2)} V，求 E°red(陽極)。`]);
        }
        [
            {high:'ag',low:'cu'}, {high:'cu',low:'fe'}, {high:'h',low:'zn'}, {high:'fe',low:'al'}
        ].forEach(({high:highId,low:lowId},i)=>{
            const high=EL.find(item=>item.id===highId), low=EL.find(item=>item.id===lowId);
            const comparison=[high,low,...EL.filter(item=>item.id!==high.id&&item.id!==low.id&&item.E<high.E)
                .sort((a,b)=>Math.abs(a.E-low.E)-Math.abs(b.E-low.E)).slice(0,2)];
            const dataLine=comparison.map(item=>`${item.name}（E°red＝${item.E.toFixed(2)} V）`).join('；');
            add(out,{subtype:'standardPotential',template:'standard-oxidant-strength',factId:`oxidant-${i}`,answer:high.oxidant,distractors:comparison.map(item=>item.oxidant).filter(value=>value!==high.oxidant),type:'標準電位｜比較氧化劑強弱',basis:'標準還原電位越大，該還原反應越容易進行，對應氧化態物種的氧化性越強。',steps:`依題目列出的四組電位資料排序，${high.name} 的 E°red 最高（${high.E.toFixed(2)} V），故其氧化態物種氧化力最強。`,conclusion:`${high.oxidant} 是較強氧化劑。`,misconception:'比較時只能使用題目列出的半反應資料；E°red 越大，對應氧化劑越強。'},[
                `已知各半反應的標準還原電位：${dataLine}。哪一種氧化態物種的氧化力最強？`,
                `比較下列電位資料：${dataLine}。對應氧化劑何者最容易得電子？`,
                `表列四組 E°red：${dataLine}。哪一種物質是最強氧化劑？`]);
        });
        return out;
    }

    function buildElectrolysisProduct(){
        const cases=[
            {id:'molten-nacl-c',question:'熔融 NaCl，以惰性電極電解，陰極產物',answer:'Na(s)',wrong:['Cl₂(g)','Na⁺(l)','Cl⁻(l)'],rule:'熔融物只有 Na⁺、Cl⁻；陰極 Na⁺ 得電子。',half:'Na⁺＋e⁻ → Na'},
            {id:'molten-nacl-a',question:'熔融 NaCl，以惰性電極電解，陽極產物',answer:'Cl₂(g)',wrong:['Na(s)','Na⁺(l)','Cl⁻(l)'],rule:'熔融物只有 Na⁺、Cl⁻；陽極 Cl⁻ 失電子。',half:'2Cl⁻ → Cl₂＋2e⁻'},
            {id:'molten-mgcl-c',question:'熔融 MgCl₂，以惰性電極電解，陰極產物',answer:'Mg(s)',wrong:['Cl₂(g)','Mg²⁺(l)','Cl⁻(l)'],rule:'熔融物中 Mg²⁺ 在陰極得電子。',half:'Mg²⁺＋2e⁻ → Mg'},
            {id:'cu-inert-c',question:'CuSO₄(aq) 以石墨電極電解，陰極主要產物',answer:'Cu(s)',wrong:['H₂(g)','O₂(g)','SO₄²⁻(aq)'],rule:'Cu²⁺ 比水更易在陰極還原，析出 Cu。',half:'Cu²⁺＋2e⁻ → Cu'},
            {id:'cu-inert-a',question:'CuSO₄(aq) 以石墨電極電解，陽極主要產物',answer:'O₂(g)',wrong:['Cu(s)','H₂(g)','SO₄²⁻(aq)'],rule:'石墨為惰性陽極，水氧化產生 O₂。',half:'2H₂O → O₂＋4H⁺＋4e⁻'},
            {id:'cu-active-a',question:'CuSO₄(aq) 以銅電極作陽極，陽極反應',answer:'Cu → Cu²⁺＋2e⁻',wrong:['2H₂O → O₂＋4H⁺＋4e⁻','Cu²⁺＋2e⁻ → Cu','2SO₄²⁻ → S₂O₈²⁻＋2e⁻'],rule:'活性銅陽極優先溶解，補充 Cu²⁺。',half:'Cu → Cu²⁺＋2e⁻'},
            {id:'conc-nacl-a',question:'濃 NaCl(aq) 以惰性電極電解，陽極主要產物',answer:'Cl₂(g)',wrong:['O₂(g)','ClO₃⁻(aq)','OH⁻(aq)'],rule:'濃食鹽水中 Cl⁻ 在惰性陽極氧化產生 Cl₂。',half:'2Cl⁻ → Cl₂＋2e⁻'},
            {id:'molten-cacl-c',question:'熔融 CaCl₂，以惰性電極電解，陰極產物',answer:'Ca(s)',wrong:['Cl₂(g)','Ca²⁺(l)','Cl⁻(l)'],rule:'熔融物中 Ca²⁺ 在陰極得電子。',half:'Ca²⁺＋2e⁻ → Ca'},
            {id:'molten-cacl-a',question:'熔融 CaCl₂，以惰性電極電解，陽極產物',answer:'Cl₂(g)',wrong:['Ca(s)','Ca²⁺(l)','Cl⁻(l)'],rule:'熔融物中 Cl⁻ 在陽極失電子。',half:'2Cl⁻ → Cl₂＋2e⁻'},
            {id:'dilute-nacl-a',question:'稀 NaCl(aq) 以惰性電極電解，陽極主要產物',answer:'O₂(g)',wrong:['Cl₂(g)','ClO₃⁻(aq)','OH⁻(aq)'],rule:'稀食鹽水中水在惰性陽極氧化產生 O₂。',half:'2H₂O → O₂＋4H⁺＋4e⁻'}
        ];
        const out=[];
        cases.forEach(item=>add(out,{subtype:'electrolysisProduct',template:'electrolysis-product',factId:item.id,answer:item.answer,distractors:item.wrong,type:'電解產物｜依條件判定',displayMode:'formula',basis:item.rule,steps:`半反應：${item.half}。`,conclusion:`主要產物為 ${item.answer}。`,misconception:'先分清熔融鹽或水溶液，再確認電極是否惰性及溶液濃度。'},[
            `${item.question}為何？`,`電解條件：${item.question.replace('，','；')}。選出對應產物。`,`判斷「${item.question}」的反應產物。`]));
        return out;
    }

    const F=96500;
    const METALS=[
        {id:'Cu',name:'銅',formula:'Cu',M:63.5,z:2,half:'Cu²⁺＋2e⁻ → Cu',condition:'Cu²⁺ 足量，陰極析銅，電流效率 100%'},
        {id:'Ag',name:'銀',formula:'Ag',M:107.9,z:1,half:'Ag⁺＋e⁻ → Ag',condition:'Ag⁺ 足量，陰極析銀，電流效率 100%'},
        {id:'Zn',name:'鋅',formula:'Zn',M:65.4,z:2,half:'Zn²⁺＋2e⁻ → Zn',condition:'依指定 Zn²⁺/Zn 半反應析鋅，電流效率 100%'}
    ];
    function numericDistractors(answer, unit, errors){
        const opts=[]; const seen=new Set([fmt(answer,4)]);
        for(const [v,reason] of errors){
            if(!Number.isFinite(v)) continue;
            const value=fmt(v,4); if(seen.has(value)) continue; seen.add(value); opts.push({value:`${value} ${unit}`,reason});
        }
        return opts;
    }
    function buildChargeAmount(){
        const out=[];
        const runs=[[1.5,40],[0.8,25],[2.4,12],[1.2,35],[3.0,18],[0.6,50],[2.2,15],[1.8,22],[0.9,45],[2.7,16],[1.1,28],[3.2,10]];
        runs.forEach(([I,min],i)=>{
            const t=min*60,Q=I*t;
            add(out,{subtype:'chargeAmount',template:'faraday-q-it',factId:`q-${i}`,answer:`${fmt(Q,4)} C`,distractors:numericDistractors(Q,'C',[[I*min,'分鐘未換算成秒。'],[Q/60,'將庫侖換成安培分鐘，單位混用。'],[Q*60,'把分鐘換秒的因子多乘一次。']]),type:'電量與電解量｜I、t 求 Q',basis:'Q＝It；時間須以秒代入。',steps:`t＝${min} min×60＝${t} s；Q＝${I} A×${t} s＝${fmt(Q,4)} C。`,conclusion:`通過電量為 ${fmt(Q,4)} C。`,misconception:'安培乘秒才得到庫侖；分鐘先乘 60。'},[
                `以 ${I} A 通電 ${min} 分鐘，通過多少電量？`,`電流為 ${I} A、時間 ${min} min，求 Q。`,`${I} A 電流維持 ${min} 分鐘，電量是多少庫侖？`]);
            const iAns=Q/t;
            add(out,{subtype:'chargeAmount',template:'faraday-i-qt',factId:`i-${i}`,answer:`${fmt(iAns,4)} A`,distractors:numericDistractors(iAns,'A',[[Q/min,'時間未換算成秒。'],[t/Q,'將 Q/t 倒置。'],[iAns*60,'秒換分鐘方向用反。']]),type:'電量與電解量｜Q、t 求 I',basis:'Q＝It，因此 I＝Q/t，時間用秒。',steps:`${min} min＝${t} s；I＝${fmt(Q,4)} C÷${t} s＝${fmt(iAns,4)} A。`,conclusion:`電流為 ${fmt(iAns,4)} A。`,misconception:'使用 Q/t 並確保時間單位為秒。'},[
                `通過 ${fmt(Q,4)} C 電量需時 ${min} 分鐘，電流為何？`,`Q＝${fmt(Q,4)} C、t＝${min} min，求 I。`,`若 ${fmt(Q,4)} C 在 ${min} 分鐘內通過，電流是多少安培？`]);
            const tAns=Q/I;
            add(out,{subtype:'chargeAmount',template:'faraday-t-qi',factId:`t-${i}`,answer:`${fmt(tAns/60,4)} min`,distractors:numericDistractors(tAns/60,'min',[[tAns,'答案保留秒，未換成分鐘。'],[tAns/3600,'將秒換小時後仍標成分鐘。'],[tAns/60*60,'將分鐘再乘 60。']]),type:'電量與電解量｜Q、I 求 t',basis:'Q＝It，因此 t＝Q/I；先求秒再換成分鐘。',steps:`t＝${fmt(Q,4)} C÷${I} A＝${tAns} s＝${fmt(tAns/60,4)} min。`,conclusion:`通電時間為 ${fmt(tAns/60,4)} 分鐘。`,misconception:'Q/I 的單位是秒，題目若問分鐘需再除以 60。'},[
                `${I} A 電流通過 ${fmt(Q,4)} C，需時幾分鐘？`,`通過 ${fmt(Q,4)} C 電量，電流 ${I} A，求通電分鐘數。`,`要通過 ${fmt(Q,4)} C，維持 ${I} A 需多久？`]);
            add(out,{subtype:'chargeAmount',template:'faraday-electron-moles',factId:`ne-${i}`,answer:`${fmt(Q/F,4)} mol`,distractors:numericDistractors(Q/F,'mol',[[Q/1000,'把電量數值誤作電子莫耳數。'],[Q/F*2,'電子莫耳數多乘電子係數。'],[Q/(2*F),'除以錯誤的二電子係數。']]),type:'電量與電解量｜Q 求電子莫耳數',basis:'1 mol 電子帶電量為 F＝96500 C mol⁻¹。',steps:`n(e⁻)＝Q/F＝${fmt(Q,4)}÷96500＝${fmt(Q/F,4)} mol。`,conclusion:`電子量為 ${fmt(Q/F,4)} mol。`,misconception:'Q/F 直接求電子莫耳數；電子係數用於後續物質量換算。'},[
                `F＝96500 C mol⁻¹，通過 ${fmt(Q,4)} C 相當於多少 mol 電子？`,`電量為 ${fmt(Q,4)} C，求電子莫耳數。`,`${fmt(Q,4)} C 電量對應幾 mol e⁻？`]);
            const qBack=0.1+i*0.05;
            add(out,{subtype:'chargeAmount',template:'faraday-charge-from-electron-moles',factId:`qback-${i}`,answer:`${fmt(qBack*F,4)} C`,distractors:numericDistractors(qBack*F,'C',[[qBack/F,'把 Faraday 常數除錯方向。'],[qBack*1000,'把電子莫耳數直接當庫侖量。'],[qBack*F/60,'將電量錯誤換成庫侖分鐘。']]),type:'電量與電解量｜電子莫耳數求 Q',basis:'Q＝n(e⁻)F。',steps:`Q＝${fmt(qBack,3)} mol×96500 C mol⁻¹＝${fmt(qBack*F,4)} C。`,conclusion:`電量為 ${fmt(qBack*F,4)} C。`,misconception:'由電子莫耳數求電量需乘 Faraday 常數。'},[
                `通過 ${fmt(qBack,3)} mol 電子，F＝96500 C mol⁻¹，電量為何？`,`電子量為 ${fmt(qBack,3)} mol，求電量 Q。`,`${fmt(qBack,3)} mol e⁻ 對應多少庫侖？`]);
            const metal=METALS[i%METALS.length], mass=Q*metal.M/(metal.z*F);
            addMetalCalc(out,`m-${i}`,metal,{I,min,mass,Q});
        });
        return out;
    }
    function addMetalCalc(out,id,metal,{I,min,mass,Q}){
        const timeSeconds=min*60;
        const massErr=numericDistractors(mass,'g',[[Q*metal.M/F,'漏除半反應中的電子係數。'],[I*min*metal.M/(metal.z*F),'分鐘未換秒。'],[Q*metal.M/(F),'漏除電子係數。']]);
        add(out,{subtype:'chargeAmount',template:'faraday-mass-it',factId:id,answer:`${fmt(mass,4)} g`,distractors:massErr,type:'電量與電解量｜I、t 求析出質量',basis:`${metal.condition}；${metal.half}；F＝96500 C mol⁻¹。`,steps:`Q＝${I}×${min}×60＝${fmt(Q,4)} C；m＝Q×${metal.M}/(${metal.z}×96500)＝${fmt(mass,4)} g。`,conclusion:`析出 ${fmt(mass,4)} g ${metal.name}。`,misconception:'分鐘換秒，並以半反應電子係數 z 除電子莫耳數。'},[
            `以 ${I} A 電流電解 ${metal.condition} ${min} 分鐘，析出多少克 ${metal.name}？`,`電流 ${I} A 維持 ${min} min，依 ${metal.half} 求 ${metal.name} 質量。`,`${I} A 通電 ${min} 分鐘，${metal.name} 的析出質量為何？`]);
        const iAns=mass*metal.z*F/(timeSeconds*metal.M);
        add(out,{subtype:'chargeAmount',template:'faraday-current-mass-time',factId:id,answer:`${fmt(iAns,4)} A`,distractors:numericDistractors(iAns,'A',[[iAns/metal.z,'漏乘電子係數。'],[iAns*60,'分鐘與秒換算錯誤。'],[mass*F/(timeSeconds*metal.M),'未乘電子係數。']]),type:'電量與電解量｜質量、時間求電流',basis:`m＝ItM/(zF)，反求 I；${metal.condition}。`,steps:`I＝m z F/(t M)＝${fmt(mass,4)}×${metal.z}×96500÷(${timeSeconds}×${metal.M})＝${fmt(iAns,4)} A。`,conclusion:`所需電流為 ${fmt(iAns,4)} A。`,misconception:'反求電流時乘上 zF，再除通電秒數與莫耳質量。'},[
            `以 ${metal.condition} 電解 ${min} 分鐘析出 ${fmt(mass,4)} g ${metal.name}，電流為何？`,`${min} 分鐘析出 ${fmt(mass,4)} g ${metal.name}，所需電流是多少？`,`依 ${metal.half}，${fmt(mass,4)} g ${metal.name} 在 ${min} min 析出時的電流為何？`]);
        const tAns=mass*metal.z*F/(I*metal.M);
        add(out,{subtype:'chargeAmount',template:'faraday-time-mass-current',factId:id,answer:`${fmt(tAns/60,4)} min`,distractors:numericDistractors(tAns/60,'min',[[tAns,'算得秒數後未換成分鐘。'],[tAns/3600,'將秒轉成小時但標成分鐘。'],[mass*F/(I*metal.M*60),'漏乘電子係數。']]),type:'電量與電解量｜質量、電流求時間',basis:`m＝ItM/(zF)，反求 t；${metal.condition}。`,steps:`t＝m z F/(I M)＝${fmt(mass,4)}×${metal.z}×96500÷(${I}×${metal.M})＝${fmt(tAns/60,4)} min。`,conclusion:`需通電 ${fmt(tAns/60,4)} 分鐘。`,misconception:'先以秒代入法拉第定律，最後將秒換為分鐘。'},[
            `要析出 ${fmt(mass,4)} g ${metal.name}，電流維持 ${I} A，需幾分鐘？`,`以 ${I} A 電解析出 ${fmt(mass,4)} g ${metal.name}，通電時間為何？`,`電流 ${I} A，依 ${metal.half} 析出 ${fmt(mass,4)} g，需時幾分鐘？`]);
    }

    function buildPlatingSeries(){
        const out=[];
        const times=[10,18,25,32,45,55,70,85];
        times.forEach((min,i)=>{
            const I=[1.2,1.5,0.8,2.0][i%4], metal=METALS[i%3], m=I*min*60*metal.M/(metal.z*F);
            add(out,{subtype:'platingSeries',template:'electroplate-time',factId:`plate-${i}`,answer:`${fmt(min,4)} min`,distractors:numericDistractors(min,'min',[[min*60,'秒數未換成分鐘。'],[min/metal.z,'漏乘電子係數。'],[min*metal.z,'反應電子係數用反。']]),type:'電鍍與串聯電解｜質量與電流求時間',basis:`${metal.condition}；${metal.half}。`,steps:`t＝m z F/(I M)；代入 ${fmt(m,4)} g、${metal.z}、96500、${I} A 得 ${min*60} s＝${min} min。`,conclusion:`需電鍍 ${min} 分鐘。`,misconception:'先依半反應找 z，再將秒換成分鐘。'},[
                `以 ${I} A 電流鍍上 ${fmt(m,4)} g ${metal.name}，需幾分鐘？`,`要鍍 ${fmt(m,4)} g ${metal.name}，電流維持 ${I} A，通電多久？`,`${I} A 電流下析出 ${fmt(m,4)} g ${metal.name}，需時幾分鐘？`]);
            const eff=[0.75,0.8,0.9,0.6][i%4], actual=m*eff;
            add(out,{subtype:'platingSeries',template:'electrolysis-efficiency',factId:`eff-${i}`,answer:`${fmt(eff*100,3)}%`,distractors:[{value:`${fmt((1-eff)*100,3)}%`,reason:'把未析出的比例當成電流效率。'},{value:`${fmt(eff,3)}%`,reason:'將小數效率直接標成百分率，漏乘 100%。'},{value:`${fmt(eff*100+10,3)}%`,reason:'以實際產量除理論產量時加減了百分點。'}],type:'電鍍與串聯電解｜求電流效率',basis:'電流效率＝實際產量÷理論產量×100%。',steps:`效率＝${fmt(actual,4)} g÷${fmt(m,4)} g×100%＝${fmt(eff*100,3)}%。`,conclusion:`電流效率為 ${fmt(eff*100,3)}%。`,misconception:'分子放實際產量，分母放理論產量。'},[
                `理論析出 ${fmt(m,4)} g，實際得到 ${fmt(actual,4)} g，電流效率為何？`,`實際產量 ${fmt(actual,4)} g、理論產量 ${fmt(m,4)} g，求效率。`,`電解理論可得 ${fmt(m,4)} g，測得 ${fmt(actual,4)} g，效率是多少？`]);
            const other=METALS[(i+1)%3], m2=m*(other.M/other.z)/(metal.M/metal.z);
            add(out,{subtype:'platingSeries',template:'series-electrolysis-mass',factId:`series-${i}`,answer:`${fmt(m2,4)} g ${other.name}`,distractors:[{value:`${fmt(m,4)} g ${other.name}`,reason:'只比較電量相同，漏看電子係數與莫耳質量。'},{value:`${fmt(m2*2,4)} g ${other.name}`,reason:'將轉移電子量加倍。'},{value:`${fmt(m2,4)} g ${metal.name}`,reason:'沿用第一槽的金屬名稱。'}],type:'電鍍與串聯電解｜同電量比較',basis:'串聯電解槽通過相同電量；m∝M/z。',steps:`m₂＝m₁×(M₂/z₂)÷(M₁/z₁)＝${fmt(m,4)}×(${other.M}/${other.z})÷(${metal.M}/${metal.z})＝${fmt(m2,4)} g。`,conclusion:`第二槽析出 ${fmt(m2,4)} g ${other.name}。`,misconception:'串聯槽電量相同，但析出質量還取決於金屬莫耳質量與電子係數。'},[
                `同一電量通過串聯槽：${metal.half}、${other.half}。第一槽析出 ${fmt(m,4)} g ${metal.name}，第二槽析出多少克 ${other.name}？`,`兩槽串聯電解，${metal.name} 槽得到 ${fmt(m,4)} g；半反應分別為 ${metal.half}、${other.half}。求 ${other.name} 產量。`,`${metal.half} 與 ${other.half} 兩槽串聯，第一槽生成 ${fmt(m,4)} g ${metal.name}，求另一槽的 ${other.name} 質量。`]);
        });
        return out;
    }

    function buildPool(category, selected){
        const out=[]; const enabled=Object.keys(selected||{}).filter(id=>selected[id]);
        for(const subtype of enabled){
            let items=[];
            if(category==='redox'){
                if(subtype==='oxidationState') items=buildOxidationState();
                if(subtype==='oxidationReduction') items=buildOxidationReduction();
                if(subtype==='agents') items=buildAgents();
                if(subtype==='electronTransfer') items=buildElectronTransfer();
                if(subtype==='halfReaction') items=buildHalfReaction();
                if(subtype==='disproportionation') items=buildDisproportionation();
            } else if(category==='electrochem'){
                if(subtype==='electrodeRole') items=buildElectrodeRole();
                if(subtype==='cellOperation') items=buildCellOperation();
                if(subtype==='electrodeChange') items=buildElectrodeChange();
                if(subtype==='cellNotation') items=buildCellNotation();
                if(subtype==='standardPotential') items=buildStandardPotential();
                if(subtype==='electrolysisProduct') items=buildElectrolysisProduct();
                if(subtype==='chargeAmount') items=buildChargeAmount();
                if(subtype==='platingSeries') items=buildPlatingSeries();
            }
            items.forEach(item=>out.push({...item,subtype}));
        }
        return out;
    }
    const semanticKey=item=>item.id.split(':').slice(0,-1).join(':');
    function capacity(category, selected){return new Set(buildPool(category,selected).map(semanticKey)).size;}
    function generate(quizData){
        const category=window.extensionCategory;
        if(category!=='redox' && category!=='electrochem') return false;
        const pool=buildPool(category,window.extensionSelectedSubtypes||{});
        const used=window.quizState._redoxElectrochemAsked||(window.quizState._redoxElectrochemAsked=new Set());
        let candidates=pool.filter(item=>!used.has(semanticKey(item)));
        const enabled=Object.keys(window.extensionSelectedSubtypes||{}).filter(id=>window.extensionSelectedSubtypes[id]);
        const counts=window.quizState._redoxElectrochemSubtypeCounts||(window.quizState._redoxElectrochemSubtypeCounts={});
        const available=enabled.filter(id=>candidates.some(item=>item.subtype===id));
        if(!available.length) return false;
        const least=Math.min(...available.map(id=>counts[id]||0));
        const chosen=shuffle(available.filter(id=>(counts[id]||0)===least))[0];
        candidates=candidates.filter(item=>item.subtype===chosen);
        const templateCounts=window.quizState._redoxElectrochemTemplateCounts||(window.quizState._redoxElectrochemTemplateCounts={});
        const templates=[...new Set(candidates.map(item=>item.template))];
        const leastTemplate=Math.min(...templates.map(id=>templateCounts[`${chosen}:${id}`]||0));
        const template=shuffle(templates.filter(id=>(templateCounts[`${chosen}:${id}`]||0)===leastTemplate))[0];
        candidates=candidates.filter(item=>item.template===template);
        const item=candidates[Math.floor(Math.random()*candidates.length)];
        if(!item) return false;
        used.add(semanticKey(item)); counts[chosen]=(counts[chosen]||0)+1;
        templateCounts[`${chosen}:${template}`]=(templateCounts[`${chosen}:${template}`]||0)+1;
        const mode=['guided','worked','diagnostic'][Math.floor(Math.random()*3)];
        const labels=mode==='worked'?['已知與所求','計算與判斷','答案檢核']:mode==='diagnostic'?['核心規則','常見錯因','結論']:['核心規則','逐步判斷','結論'];
        quizData._templateId=`redox-electrochem:${item.id}`;
        quizData._extensionRecord=item;
        quizData.type=`${window.CALIBRATION_EXTENSION_CATEGORIES[category].label}｜${item.type}`;
        quizData.question=item.question; quizData.answer=item.answer; quizData.forcedOpts=item.options;
        quizData.displayMode=item.displayMode||'text'; quizData.showExplanation=true;
        quizData.showPotentialLookup=category==='electrochem' && item.template==='standard-cell-potential';
        quizData.explanation={basis:item.basis,steps:mode==='diagnostic'?`${item.steps} 常見錯誤：${item.misconception}`:item.steps,conclusion:item.conclusion,labels};
        quizData.correctReason=[item.basis,item.steps,item.conclusion].join(' ');
        quizData.optionRationales=Object.fromEntries(item.options.filter(v=>key(v)!==key(item.answer)).map(v=>[key(v),item.optionRationales[key(v)]||item.optionRationales[v]||`${item.misconception}（選項 ${v} 不符合反應條件。）`]));
        return true;
    }
    window.CALIBRATION_REDCHEM_ENGINE={generate,capacity,generatePool:buildPool,standardPotentialTable:()=>EL.map(({name,half,E})=>({name,half,E}))};

    const base=window.CALIBRATION_EXTENSION_ENGINE;
    window.CALIBRATION_EXTENSION_ENGINE={
        ...base,
        generate(quizData){return ['redox','electrochem'].includes(window.extensionCategory)?generate(quizData):base.generate(quizData);},
        capacity(category,selected){return ['redox','electrochem'].includes(category)?capacity(category,selected):base.capacity(category,selected);},
        generatePool(category,selected){return ['redox','electrochem'].includes(category)?buildPool(category,selected):base.generatePool(category,selected);}
    };
})();
