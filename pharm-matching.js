const MATCH_BANK = [
  {id:'c1',mode:'class',left:'Amlodipine',leftZh:'氨氯地平',right:'Calcium channel blocker',rightZh:'钙通道阻滞剂',explain:'Amlodipine is a dihydropyridine calcium channel blocker used for hypertension and angina.',explainZh:'氨氯地平是二氢吡啶类钙通道阻滞剂，用于高血压和心绞痛。'},
  {id:'c2',mode:'class',left:'Metoprolol',leftZh:'美托洛尔',right:'Beta blocker',rightZh:'β受体阻滞剂',explain:'Metoprolol primarily blocks beta-1 receptors and lowers heart rate and blood pressure.',explainZh:'美托洛尔主要阻断β1受体，可降低心率和血压。'},
  {id:'c3',mode:'class',left:'Lisinopril',leftZh:'赖诺普利',right:'ACE inhibitor',rightZh:'血管紧张素转换酶抑制剂',explain:'Lisinopril inhibits angiotensin-converting enzyme and may cause cough or angioedema.',explainZh:'赖诺普利抑制血管紧张素转换酶，可能引起咳嗽或血管性水肿。'},
  {id:'c4',mode:'class',left:'Losartan',leftZh:'氯沙坦',right:'Angiotensin II receptor blocker (ARB)',rightZh:'血管紧张素II受体阻滞剂',explain:'Losartan blocks angiotensin II receptors and is an ARB antihypertensive.',explainZh:'氯沙坦阻断血管紧张素II受体，属于ARB类降压药。'},
  {id:'c5',mode:'class',left:'Furosemide',leftZh:'呋塞米',right:'Loop diuretic',rightZh:'袢利尿剂',explain:'Furosemide is a potent loop diuretic used for edema and hypertension.',explainZh:'呋塞米是强效袢利尿剂，用于水肿和高血压。'},
  {id:'c6',mode:'class',left:'Hydrochlorothiazide',leftZh:'氢氯噻嗪',right:'Thiazide diuretic',rightZh:'噻嗪类利尿剂',explain:'Hydrochlorothiazide is a thiazide diuretic commonly used for hypertension.',explainZh:'氢氯噻嗪是常用于高血压的噻嗪类利尿剂。'},
  {id:'c7',mode:'class',left:'Warfarin',leftZh:'华法林',right:'Vitamin K antagonist anticoagulant',rightZh:'维生素K拮抗剂类抗凝药',explain:'Warfarin reduces synthesis of vitamin K-dependent clotting factors and is monitored with INR.',explainZh:'华法林减少维生素K依赖性凝血因子的合成，并通过INR监测。'},
  {id:'c8',mode:'class',left:'Clopidogrel',leftZh:'氯吡格雷',right:'Antiplatelet drug',rightZh:'抗血小板药',explain:'Clopidogrel inhibits ADP-mediated platelet activation.',explainZh:'氯吡格雷抑制ADP介导的血小板活化。'},
  {id:'c9',mode:'class',left:'Metformin',leftZh:'二甲双胍',right:'Biguanide antidiabetic',rightZh:'双胍类降糖药',explain:'Metformin is a first-line biguanide that lowers hepatic glucose production and improves insulin sensitivity.',explainZh:'二甲双胍是一线双胍类药物，可减少肝糖生成并改善胰岛素敏感性。'},
  {id:'c10',mode:'class',left:'Salbutamol (albuterol)',leftZh:'沙丁胺醇',right:'Short-acting beta-2 agonist',rightZh:'短效β2受体激动剂',explain:'Salbutamol is a rapid bronchodilator used as a rescue inhaler.',explainZh:'沙丁胺醇是快速支气管扩张剂，用作急救吸入药。'},
  {id:'c11',mode:'class',left:'Prednisone',leftZh:'泼尼松',right:'Systemic corticosteroid',rightZh:'全身性糖皮质激素',explain:'Prednisone is a systemic corticosteroid with anti-inflammatory and immunosuppressive effects.',explainZh:'泼尼松是具有抗炎和免疫抑制作用的全身性糖皮质激素。'},
  {id:'c12',mode:'class',left:'Amoxicillin',leftZh:'阿莫西林',right:'Penicillin antibiotic',rightZh:'青霉素类抗生素',explain:'Amoxicillin is an aminopenicillin beta-lactam antibiotic.',explainZh:'阿莫西林是氨基青霉素类β-内酰胺抗生素。'},
  {id:'c13',mode:'class',left:'Azithromycin',leftZh:'阿奇霉素',right:'Macrolide antibiotic',rightZh:'大环内酯类抗生素',explain:'Azithromycin is a macrolide that inhibits bacterial protein synthesis.',explainZh:'阿奇霉素是抑制细菌蛋白合成的大环内酯类抗生素。'},
  {id:'c14',mode:'class',left:'Fluconazole',leftZh:'氟康唑',right:'Azole antifungal',rightZh:'唑类抗真菌药',explain:'Fluconazole is an azole antifungal used for susceptible Candida infections.',explainZh:'氟康唑是用于敏感念珠菌感染的唑类抗真菌药。'},
  {id:'c15',mode:'class',left:'Ibuprofen',leftZh:'布洛芬',right:'NSAID',rightZh:'非甾体抗炎药',explain:'Ibuprofen reduces prostaglandin synthesis by inhibiting cyclooxygenase.',explainZh:'布洛芬通过抑制环氧化酶减少前列腺素合成。'},
  {id:'c16',mode:'class',left:'Acetaminophen',leftZh:'对乙酰氨基酚',right:'Non-opioid analgesic and antipyretic',rightZh:'非阿片类镇痛退热药',explain:'Acetaminophen relieves pain and fever but has little peripheral anti-inflammatory effect.',explainZh:'对乙酰氨基酚可止痛退热，但外周抗炎作用很弱。'},

  {id:'o1',mode:'oral',left:'Phenytoin',leftZh:'苯妥英',right:'Gingival enlargement',rightZh:'牙龈增生',explain:'Phenytoin is a classic medication associated with gingival enlargement.',explainZh:'苯妥英是与牙龈增生相关的经典药物。'},
  {id:'o2',mode:'oral',left:'Nifedipine',leftZh:'硝苯地平',right:'Gingival enlargement',rightZh:'牙龈增生',explain:'Nifedipine, a calcium channel blocker, can contribute to gingival enlargement.',explainZh:'硝苯地平属于钙通道阻滞剂，可能导致牙龈增生。'},
  {id:'o3',mode:'oral',left:'Cyclosporine',leftZh:'环孢素',right:'Gingival enlargement',rightZh:'牙龈增生',explain:'Cyclosporine is an immunosuppressant strongly associated with gingival overgrowth.',explainZh:'环孢素是与牙龈增生密切相关的免疫抑制剂。'},
  {id:'o4',mode:'oral',left:'Anticholinergic medications',leftZh:'抗胆碱能药物',right:'Xerostomia',rightZh:'口干',explain:'Anticholinergic effects reduce salivary secretion and raise caries risk.',explainZh:'抗胆碱作用会减少唾液分泌并增加龋病风险。'},
  {id:'o5',mode:'oral',left:'Inhaled corticosteroids',leftZh:'吸入性糖皮质激素',right:'Oral candidiasis',rightZh:'口腔念珠菌病',explain:'Local immunosuppression and residue from inhaled steroids can promote oral candidiasis; rinsing after use helps.',explainZh:'吸入激素的局部免疫抑制和药物残留可促进口腔念珠菌病；使用后漱口有帮助。'},
  {id:'o6',mode:'oral',left:'Tetracycline during tooth development',leftZh:'牙齿发育期使用四环素',right:'Intrinsic tooth discoloration',rightZh:'内源性牙齿变色',explain:'Tetracyclines can bind developing calcified tissues and discolor teeth.',explainZh:'四环素可与发育中的钙化组织结合并导致牙齿变色。'},
  {id:'o7',mode:'oral',left:'Bisphosphonates',leftZh:'双膦酸盐',right:'Medication-related osteonecrosis of the jaw risk',rightZh:'药物相关颌骨坏死风险',explain:'Antiresorptive therapy can increase MRONJ risk, particularly with potent intravenous regimens and invasive procedures.',explainZh:'抗骨吸收治疗会增加MRONJ风险，尤其是强效静脉方案及侵入性操作时。'},
  {id:'o8',mode:'oral',left:'Methotrexate',leftZh:'甲氨蝶呤',right:'Oral ulceration or mucositis',rightZh:'口腔溃疡或黏膜炎',explain:'Methotrexate toxicity or immunosuppression may present with oral ulceration and mucositis.',explainZh:'甲氨蝶呤毒性或免疫抑制可能表现为口腔溃疡和黏膜炎。'},
  {id:'o9',mode:'oral',left:'Aspirin',leftZh:'阿司匹林',right:'Prolonged bleeding tendency',rightZh:'出血时间延长倾向',explain:'Aspirin irreversibly inhibits platelet function for the platelet lifespan.',explainZh:'阿司匹林不可逆抑制血小板功能，作用持续至血小板寿命结束。'},
  {id:'o10',mode:'oral',left:'Selective serotonin reuptake inhibitors (SSRIs)',leftZh:'选择性5-羟色胺再摄取抑制剂',right:'Xerostomia and possible bleeding tendency',rightZh:'口干及可能的出血倾向',explain:'SSRIs may reduce salivary flow and can affect platelet serotonin, increasing bleeding tendency in some clients.',explainZh:'SSRIs可能减少唾液流量，并影响血小板5-羟色胺，从而增加部分患者的出血倾向。'},
  {id:'o11',mode:'oral',left:'Chemotherapy',leftZh:'化疗',right:'Mucositis and infection risk',rightZh:'黏膜炎与感染风险',explain:'Cytotoxic chemotherapy can injure rapidly dividing oral epithelium and suppress immunity.',explainZh:'细胞毒性化疗可损伤快速分裂的口腔上皮并抑制免疫。'},
  {id:'o12',mode:'oral',left:'Warfarin',leftZh:'华法林',right:'Increased bleeding risk',rightZh:'出血风险增加',explain:'Warfarin reduces vitamin K-dependent clotting factors, so bleeding assessment is important before invasive care.',explainZh:'华法林减少维生素K依赖性凝血因子，因此侵入性治疗前需评估出血风险。'},

  {id:'e1',mode:'emergency',left:'Epinephrine',leftZh:'肾上腺素',right:'Anaphylaxis',rightZh:'过敏性休克',explain:'Intramuscular epinephrine is the first-line medication for anaphylaxis.',explainZh:'肌内注射肾上腺素是过敏性休克的一线用药。'},
  {id:'e2',mode:'emergency',left:'Nitroglycerin',leftZh:'硝酸甘油',right:'Anginal chest pain',rightZh:'心绞痛性胸痛',explain:'Nitroglycerin causes vasodilation and is used for suspected angina when appropriate.',explainZh:'硝酸甘油可扩张血管，在适当情况下用于疑似心绞痛。'},
  {id:'e3',mode:'emergency',left:'Salbutamol (albuterol)',leftZh:'沙丁胺醇',right:'Acute bronchospasm',rightZh:'急性支气管痉挛',explain:'A short-acting beta-2 agonist rapidly opens constricted airways.',explainZh:'短效β2受体激动剂可迅速扩张痉挛的气道。'},
  {id:'e4',mode:'emergency',left:'Oral glucose',leftZh:'口服葡萄糖',right:'Conscious hypoglycemia',rightZh:'清醒患者的低血糖',explain:'A conscious client who can swallow can receive a rapid oral carbohydrate source.',explainZh:'清醒且能吞咽的低血糖患者可给予快速口服碳水化合物。'},
  {id:'e5',mode:'emergency',left:'Glucagon',leftZh:'胰高血糖素',right:'Severe hypoglycemia when oral glucose is unsafe',rightZh:'无法安全口服葡萄糖的严重低血糖',explain:'Glucagon raises blood glucose when the client cannot safely take oral carbohydrate.',explainZh:'当患者不能安全口服碳水化合物时，胰高血糖素可升高血糖。'},
  {id:'e6',mode:'emergency',left:'Naloxone',leftZh:'纳洛酮',right:'Opioid overdose',rightZh:'阿片类药物过量',explain:'Naloxone competitively reverses opioid effects, especially respiratory depression.',explainZh:'纳洛酮可竞争性逆转阿片类作用，尤其是呼吸抑制。'},
  {id:'e7',mode:'emergency',left:'Aspirin',leftZh:'阿司匹林',right:'Suspected myocardial infarction, when not contraindicated',rightZh:'疑似心肌梗死且无禁忌时',explain:'Chewed aspirin helps inhibit platelet aggregation during suspected acute coronary syndrome when appropriate.',explainZh:'在适当且无禁忌时，咀嚼阿司匹林可在疑似急性冠脉综合征中抑制血小板聚集。'},
  {id:'e8',mode:'emergency',left:'Oxygen',leftZh:'氧气',right:'Hypoxemia or respiratory compromise',rightZh:'低氧血症或呼吸功能受损',explain:'Supplemental oxygen is indicated when oxygenation is inadequate, according to emergency protocols.',explainZh:'依照急救流程，当氧合不足时应给予补充氧气。'},
  {id:'e9',mode:'emergency',left:'Diphenhydramine',leftZh:'苯海拉明',right:'Mild allergic reaction adjunct',rightZh:'轻度过敏反应辅助用药',explain:'An antihistamine may help mild allergic symptoms but does not replace epinephrine in anaphylaxis.',explainZh:'抗组胺药可缓解轻度过敏症状，但不能替代过敏性休克中的肾上腺素。'},
  {id:'e10',mode:'emergency',left:'Midazolam',leftZh:'咪达唑仑',right:'Prolonged seizure management by trained providers',rightZh:'由受训人员处理持续性癫痫发作',explain:'A benzodiazepine may be used for prolonged seizure activity within the provider’s training and protocol.',explainZh:'在受训范围和流程内，苯二氮䓬类可用于持续性癫痫发作。'},

  {id:'d1',mode:'dental',left:'Warfarin',leftZh:'华法林',right:'Review INR, bleeding history, and interactions before invasive care',rightZh:'侵入性治疗前评估INR、出血史及相互作用',explain:'Do not independently stop warfarin; assess current anticoagulation and coordinate care when indicated.',explainZh:'不要自行停用华法林；应评估当前抗凝状态并在需要时协调医疗。'},
  {id:'d2',mode:'dental',left:'Direct oral anticoagulants (DOACs)',leftZh:'直接口服抗凝药',right:'Consider dose timing, renal function, procedure bleeding risk, and prescriber guidance',rightZh:'考虑服药时间、肾功能、操作出血风险及处方者建议',explain:'DOAC management depends on the specific drug, timing, renal function, and invasiveness of care.',explainZh:'DOAC处理取决于具体药物、服药时间、肾功能及操作侵入程度。'},
  {id:'d3',mode:'dental',left:'Metronidazole plus warfarin',leftZh:'甲硝唑与华法林合用',right:'Potentially increased anticoagulant effect',rightZh:'可能增强抗凝作用',explain:'Metronidazole can inhibit warfarin metabolism and raise bleeding risk.',explainZh:'甲硝唑可抑制华法林代谢并增加出血风险。'},
  {id:'d4',mode:'dental',left:'Erythromycin or clarithromycin',leftZh:'红霉素或克拉霉素',right:'Important interaction potential through CYP inhibition',rightZh:'通过CYP抑制产生重要相互作用',explain:'Some macrolides inhibit CYP enzymes and can raise concentrations of interacting drugs.',explainZh:'部分大环内酯类抑制CYP酶，可升高相互作用药物的浓度。'},
  {id:'d5',mode:'dental',left:'Nonselective beta blocker plus epinephrine',leftZh:'非选择性β阻滞剂与肾上腺素',right:'Risk of marked hypertension and reflex bradycardia',rightZh:'显著高血压与反射性心动过缓风险',explain:'Unopposed alpha stimulation can produce a strong pressor response; use caution and follow guidance.',explainZh:'未受拮抗的α作用可产生强烈升压反应；应谨慎并遵循相关指南。'},
  {id:'d6',mode:'dental',left:'Long-term systemic corticosteroids',leftZh:'长期全身性糖皮质激素',right:'Assess adrenal suppression, infection risk, healing, and medical stability',rightZh:'评估肾上腺抑制、感染风险、愈合及医疗稳定性',explain:'Chronic corticosteroid use can affect stress response, immunity, and healing.',explainZh:'长期使用糖皮质激素可影响应激反应、免疫和愈合。'},
  {id:'d7',mode:'dental',left:'Insulin or sulfonylurea',leftZh:'胰岛素或磺脲类药物',right:'Confirm meals and monitor for hypoglycemia',rightZh:'确认进食情况并监测低血糖',explain:'These therapies can cause hypoglycemia, especially if meals are delayed or missed.',explainZh:'这些治疗可能导致低血糖，尤其在延迟或漏餐时。'},
  {id:'d8',mode:'dental',left:'Bisphosphonate or denosumab',leftZh:'双膦酸盐或地舒单抗',right:'Assess MRONJ risk before invasive procedures',rightZh:'侵入性操作前评估MRONJ风险',explain:'Risk assessment includes indication, route, duration, comorbidities, and planned procedure.',explainZh:'风险评估包括用药指征、给药途径、疗程、合并症和计划操作。'},
  {id:'d9',mode:'dental',left:'Tricyclic antidepressant',leftZh:'三环类抗抑郁药',right:'Xerostomia and caution with sympathomimetics',rightZh:'口干并需谨慎使用拟交感药',explain:'Anticholinergic effects reduce saliva, and cardiovascular interactions may matter with sympathomimetics.',explainZh:'抗胆碱作用会减少唾液，且与拟交感药合用时可能有心血管相互作用。'},
  {id:'d10',mode:'dental',left:'Lithium',leftZh:'锂盐',right:'NSAIDs may increase lithium levels',rightZh:'NSAIDs可能升高锂浓度',explain:'NSAIDs can reduce renal lithium clearance and increase toxicity risk.',explainZh:'NSAIDs可降低肾脏对锂的清除并增加中毒风险。'},
  {id:'d11',mode:'dental',left:'Methotrexate',leftZh:'甲氨蝶呤',right:'Avoid interacting drugs and assess marrow suppression or mucositis',rightZh:'避免相互作用药物并评估骨髓抑制或黏膜炎',explain:'Toxicity may include oral ulceration, infection risk, and blood dyscrasias.',explainZh:'毒性可能包括口腔溃疡、感染风险及血液异常。'},
  {id:'d12',mode:'dental',left:'Inhaled corticosteroid',leftZh:'吸入性糖皮质激素',right:'Encourage rinsing after use and assess for candidiasis',rightZh:'建议使用后漱口并评估念珠菌病',explain:'Rinsing and good inhaler technique reduce local steroid residue and candidiasis risk.',explainZh:'漱口和正确吸入技巧可减少局部激素残留及念珠菌病风险。'}
];

let selectedMode=null, currentPairs=[], leftSelected=null, rightSelected=null, matched=0, attempts=0;
const $=id=>document.getElementById(id);
const shuffleMatch=a=>[...a].sort(()=>Math.random()-.5);

document.querySelectorAll('.match-mode').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.match-mode').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active'); selectedMode=btn.dataset.mode; $('startBtn').disabled=false;
}));
$('startBtn').addEventListener('click',startRound);$('resetRound').addEventListener('click',renderRound);$('newSet').addEventListener('click',showSetup);$('againBtn').addEventListener('click',showSetup);

function startRound(){
  const count=Number($('pairCount').value);
  const pool=selectedMode==='mixed'?MATCH_BANK:MATCH_BANK.filter(x=>x.mode===selectedMode);
  currentPairs=shuffleMatch(pool).slice(0,Math.min(count,pool.length));
  $('setup').classList.add('hidden');$('finish').classList.add('hidden');$('game').classList.remove('hidden');renderRound();
}
function renderRound(){
  leftSelected=rightSelected=null;matched=attempts=0;
  $('matchFeedback').className='card match-feedback hidden';
  const names={class:'Drug → Category / 药物 → 类别',oral:'Drug → Oral Effect / 药物 → 口腔影响',emergency:'Emergency Drug → Purpose / 急救药物 → 用途',dental:'Drug → Dental Implication / 药物 → 牙科注意事项',mixed:'Mixed Board Review / 综合复习'};
  $('roundTitle').textContent=names[selectedMode];
  const left=shuffleMatch(currentPairs), right=shuffleMatch(currentPairs);
  $('leftCards').innerHTML=left.map(x=>cardHtml(x,'left')).join('');
  $('rightCards').innerHTML=right.map(x=>cardHtml(x,'right')).join('');
  document.querySelectorAll('[data-side="left"]').forEach(b=>b.onclick=()=>selectCard(b,'left'));
  document.querySelectorAll('[data-side="right"]').forEach(b=>b.onclick=()=>selectCard(b,'right'));
  updateStatus();
}
function cardHtml(x,side){
  const en=side==='left'?x.left:x.right, zh=side==='left'?x.leftZh:x.rightZh;
  return `<button class="match-card" data-side="${side}" data-id="${x.id}"><b>${en}</b><span class="zh-inline">${zh}</span></button>`;
}
function selectCard(btn,side){
  if(btn.classList.contains('matched'))return;
  document.querySelectorAll(`[data-side="${side}"]`).forEach(x=>x.classList.remove('selected'));
  btn.classList.add('selected');
  if(side==='left')leftSelected=btn; else rightSelected=btn;
  if(leftSelected&&rightSelected)checkPair();
}
function checkPair(){
  attempts++;
  const correct=leftSelected.dataset.id===rightSelected.dataset.id;
  const item=currentPairs.find(x=>x.id===leftSelected.dataset.id);
  if(correct){
    matched++;[leftSelected,rightSelected].forEach(x=>{x.classList.remove('selected');x.classList.add('matched');x.disabled=true});
    $('matchFeedback').className='card match-feedback good';
    $('matchFeedback').innerHTML=`<h3>✅ Match / 配对正确</h3><b>${item.left} → ${item.right}</b><span class="zh">${item.leftZh} → ${item.rightZh}</span><p>${item.explain}</p><span class="zh">${item.explainZh}</span>`;
    record('practice',true,'Medication Matching');
    leftSelected=rightSelected=null;
    updateStatus();
    if(matched===currentPairs.length)setTimeout(finishRound,650);
  }else{
    const a=leftSelected,b=rightSelected;
    [a,b].forEach(x=>x.classList.add('error'));
    $('matchFeedback').className='card match-feedback bad';
    $('matchFeedback').innerHTML='<h3>Not a match yet / 尚未配对</h3><p>Try again. Compare the drug family, mechanism, oral effect, or clinical purpose.</p><span class="zh">请再试一次。比较药物类别、作用机制、口腔影响或临床用途。</span>';
    record('practice',false,'Medication Matching');
    setTimeout(()=>{[a,b].forEach(x=>x.classList.remove('selected','error'));leftSelected=rightSelected=null},500);
    updateStatus();
  }
}
function updateStatus(){
  $('matchedCount').textContent=`${matched}/${currentPairs.length}`;
  $('attemptCount').textContent=`${attempts} attempt${attempts===1?'':'s'}`;
  $('matchBar').style.width=`${currentPairs.length?matched/currentPairs.length*100:0}%`;
}
function finishRound(){
  $('game').classList.add('hidden');$('finish').classList.remove('hidden');
  const accuracy=attempts?Math.round(currentPairs.length/attempts*100):100;
  $('finalScore').textContent=`${currentPairs.length} matched`;
  $('finalMessage').innerHTML=`Accuracy: <b>${accuracy}%</b> across ${attempts} attempts.<span class="zh">${attempts}次尝试，准确率为<b>${accuracy}%</b>。</span>`;
}
function showSetup(){
  $('game').classList.add('hidden');$('finish').classList.add('hidden');$('setup').classList.remove('hidden');
}
