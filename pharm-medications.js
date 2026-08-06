(function(){
  const d=(name,brand='')=>({name,brand});
  window.PHARM_MEDICATION_GROUPS=[
    {
      id:'autonomic',category:'Autonomic & emergency',categoryZh:'自主神经与急救',title:'Adrenergic and cholinergic drugs',titleZh:'肾上腺素能与胆碱能药物',
      drugs:[d('Epinephrine','EpiPen'),d('Norepinephrine'),d('Salbutamol / albuterol','Ventolin'),d('Propranolol','Inderal'),d('Pilocarpine'),d('Atropine')],
      use:'Mimic or block sympathetic and parasympathetic responses.',useZh:'模拟或阻断交感神经与副交感神经反应。',
      key:'Epinephrine raises heart rate and blood pressure; salbutamol is a beta-2 bronchodilator; pilocarpine increases saliva; atropine reduces saliva.',keyZh:'肾上腺素提高心率和血压；沙丁胺醇为β2支气管扩张剂；毛果芸香碱增加唾液；阿托品减少唾液。',
      dental:'Check cardiovascular stability and medication interactions before vasoconstrictor use. Anticholinergic effects increase xerostomia risk.',dentalZh:'使用血管收缩剂前评估心血管稳定性和药物相互作用。抗胆碱作用会增加口干风险。',page:'pp. 29–30, 41'
    },
    {
      id:'diuretics',category:'Blood pressure & cardiovascular',categoryZh:'血压与心血管',title:'Diuretics',titleZh:'利尿剂',
      drugs:[d('Hydrochlorothiazide','Microzide'),d('Chlorthalidone','Hygroton'),d('Furosemide','Lasix'),d('Bumetanide','Bumex'),d('Spironolactone','Aldactone')],
      use:'Reduce sodium and fluid; used for hypertension, edema, or heart failure.',useZh:'减少钠和体液，用于高血压、水肿或心力衰竭。',
      key:'Watch for dehydration, dizziness, electrolyte changes, and orthostatic hypotension.',keyZh:'注意脱水、头晕、电解质变化和体位性低血压。',
      dental:'Raise the chair slowly; xerostomia may increase caries risk.',dentalZh:'缓慢抬高牙椅；口干可能增加龋病风险。',page:'pp. 30–32, 45, 50'
    },
    {
      id:'beta-blockers',category:'Blood pressure & cardiovascular',categoryZh:'血压与心血管',title:'Beta blockers',titleZh:'β受体阻滞剂',
      drugs:[d('Atenolol','Tenormin'),d('Bisoprolol','Zebeta'),d('Metoprolol','Lopressor'),d('Propranolol','Inderal'),d('Timolol','Timoptic'),d('Nadolol','Corgard')],
      use:'Slow heart rate and reduce cardiac output; some are also used for arrhythmia or anxiety.',useZh:'减慢心率并降低心输出量；部分也用于心律失常或焦虑。',
      key:'Non-selective agents also block beta-2 receptors and can cause bronchoconstriction.',keyZh:'非选择性药物也阻断β2受体，可能导致支气管收缩。',
      dental:'Use epinephrine cautiously with non-selective beta blockers because of possible marked hypertension and reflex bradycardia.',dentalZh:'非选择性β阻滞剂与肾上腺素合用时需谨慎，可能出现明显高血压和反射性心动过缓。',page:'pp. 30–32, 50'
    },
    {
      id:'ace-inhibitors',category:'Blood pressure & cardiovascular',categoryZh:'血压与心血管',title:'ACE inhibitors',titleZh:'ACE抑制剂',
      drugs:[d('Lisinopril','Zestril'),d('Enalapril','Vasotec'),d('Ramipril','Altace'),d('Captopril','Capoten')],
      use:'Block formation of angiotensin II to lower blood pressure.',useZh:'阻断血管紧张素II形成以降低血压。',
      key:'Classic clues are persistent dry cough, hypotension, and rare angioedema.',keyZh:'典型线索为持续干咳、低血压及少见的血管性水肿。',
      dental:'Ask about cough or swelling and monitor for orthostatic symptoms.',dentalZh:'询问咳嗽或肿胀，并监测体位性症状。',page:'pp. 30–31, 50'
    },
    {
      id:'arbs',category:'Blood pressure & cardiovascular',categoryZh:'血压与心血管',title:'Angiotensin II receptor blockers (ARBs)',titleZh:'血管紧张素II受体阻滞剂',
      drugs:[d('Losartan','Cozaar'),d('Valsartan','Diovan'),d('Irbesartan','Avapro')],
      use:'Block angiotensin II receptors and cause vasodilation.',useZh:'阻断血管紧张素II受体并使血管扩张。',
      key:'Often used when ACE-inhibitor cough is not tolerated; monitor dizziness and hypotension.',keyZh:'ACE抑制剂咳嗽不能耐受时常选用；监测头晕和低血压。',
      dental:'Raise the chair slowly and review blood-pressure control.',dentalZh:'缓慢抬高牙椅并评估血压控制。',page:'pp. 30–31, 50'
    },
    {
      id:'calcium-channel-blockers',category:'Blood pressure & cardiovascular',categoryZh:'血压与心血管',title:'Calcium channel blockers',titleZh:'钙通道阻滞剂',
      drugs:[d('Nifedipine','Procardia'),d('Amlodipine','Norvasc'),d('Diltiazem','Cardizem'),d('Verapamil','Isoptin')],
      use:'Reduce calcium entry into vascular smooth muscle or cardiac tissue.',useZh:'减少钙进入血管平滑肌或心肌组织。',
      key:'Nifedipine is especially associated with gingival enlargement.',keyZh:'硝苯地平特别与牙龈增生有关。',
      dental:'Reinforce plaque control and monitor gingival overgrowth.',dentalZh:'加强菌斑控制并监测牙龈增生。',page:'pp. 30–32, 49–50'
    },
    {
      id:'nitrates',category:'Blood pressure & cardiovascular',categoryZh:'血压与心血管',title:'Nitrates and antianginals',titleZh:'硝酸酯类与抗心绞痛药',
      drugs:[d('Nitroglycerin','Nitrostat'),d('Isosorbide dinitrate','Isordil'),d('Isosorbide mononitrate','Imdur')],
      use:'Dilate vessels to improve coronary oxygen supply and reduce cardiac workload.',useZh:'扩张血管，改善冠脉供氧并减轻心脏负荷。',
      key:'Headache, dizziness, and hypotension are common. PDE-5 inhibitors can cause profound hypotension when combined with nitrates.',keyZh:'常见头痛、头晕和低血压。PDE-5抑制剂与硝酸酯合用可导致严重低血压。',
      dental:'Confirm recent erectile-dysfunction medication use before giving nitroglycerin.',dentalZh:'给予硝酸甘油前确认近期是否使用勃起功能障碍药物。',page:'pp. 32, 50'
    },
    {
      id:'heart-failure-arrhythmia',category:'Blood pressure & cardiovascular',categoryZh:'血压与心血管',title:'Heart-failure and antiarrhythmic drugs',titleZh:'心力衰竭与抗心律失常药',
      drugs:[d('Digoxin','Lanoxin'),d('Disopyramide','Norpace / Rythmodan'),d('Quinidine'),d('Mexiletine','Mexitil'),d('Amiodarone','Cordarone'),d('Lidocaine','Xylocaine'),d('Diltiazem','Cardizem'),d('Verapamil','Isoptin'),d('Atenolol','Tenormin'),d('Metoprolol','Lopressor')],
      use:'Improve cardiac pumping or control abnormal rhythm through class-specific mechanisms.',useZh:'通过不同机制改善心脏泵血或控制异常心律。',
      key:'Bradycardia, AV block, dizziness, and drug-specific toxicities are important clues.',keyZh:'心动过缓、房室传导阻滞、头晕及特定药物毒性是重要线索。',
      dental:'Monitor vital signs. Digoxin may increase the gag reflex; high-dose epinephrine can raise arrhythmia risk.',dentalZh:'监测生命体征。地高辛可能增强咽反射；高剂量肾上腺素可增加心律失常风险。',page:'pp. 31–32, 49–50'
    },
    {
      id:'antithrombotics',category:'Blood pressure & cardiovascular',categoryZh:'血压与心血管',title:'Anticoagulants and antiplatelets',titleZh:'抗凝药与抗血小板药',
      drugs:[d('Warfarin','Coumadin'),d('Aspirin','Bayer'),d('Clopidogrel','Plavix')],
      use:'Reduce clot formation through coagulation-factor or platelet pathways.',useZh:'通过凝血因子或血小板途径减少血栓形成。',
      key:'Warfarin is monitored with INR. Aspirin irreversibly reduces platelet function.',keyZh:'华法林通过INR监测；阿司匹林不可逆地降低血小板功能。',
      dental:'Assess bleeding history, procedure risk, INR when indicated, and interactions. Never independently advise stopping therapy.',dentalZh:'评估出血史、操作风险、必要时查看INR及药物相互作用；不得擅自建议停药。',page:'pp. 31–33, 49–50'
    },
    {
      id:'lipid-lowering',category:'Blood pressure & cardiovascular',categoryZh:'血压与心血管',title:'Lipid-lowering drugs',titleZh:'降脂药',
      drugs:[d('Atorvastatin','Lipitor'),d('Simvastatin','Zocor'),d('Rosuvastatin','Crestor'),d('Lovastatin','Mevacor'),d('Cholestyramine','Questran'),d('Niacin','Niaspan'),d('Fenofibrate','Tricor'),d('Gemfibrozil','Lopid')],
      use:'Lower LDL, triglycerides, or cholesterol absorption through different mechanisms.',useZh:'通过不同机制降低LDL、甘油三酯或胆固醇吸收。',
      key:'Statins inhibit HMG-CoA reductase; unexplained muscle pain or liver concerns require attention.',keyZh:'他汀类抑制HMG-CoA还原酶；不明原因肌痛或肝脏问题需注意。',
      dental:'Usually no direct oral effect; review systemic adverse effects and interactions.',dentalZh:'通常无直接口腔影响；需了解全身不良反应与相互作用。',page:'pp. 32, 43, 50'
    },
    {
      id:'nsaids',category:'Pain, sedation & local anesthesia',categoryZh:'疼痛、镇静与局麻',title:'NSAIDs',titleZh:'非甾体抗炎药',
      drugs:[d('Ibuprofen','Advil / Motrin'),d('Naproxen','Aleve'),d('Ketorolac','Toradol'),d('Diclofenac','Voltaren'),d('Aspirin','Bayer')],
      use:'Reduce pain, fever, and inflammation by inhibiting cyclooxygenase enzymes.',useZh:'通过抑制环氧化酶减轻疼痛、发热和炎症。',
      key:'Think stomach, kidneys, and bleeding. Avoid or use cautiously with ulcers, significant kidney disease, anticoagulants, or NSAID-sensitive asthma.',keyZh:'记住胃、肾和出血风险；溃疡、明显肾病、抗凝治疗或NSAID敏感性哮喘时需避免或谨慎。',
      dental:'Useful for inflammatory dental pain but may increase bleeding and interact with warfarin, lithium, and SSRIs.',dentalZh:'适用于炎性牙痛，但可能增加出血并与华法林、锂盐和SSRIs相互作用。',page:'pp. 33–34, 47, 49'
    },
    {
      id:'acetaminophen',category:'Pain, sedation & local anesthesia',categoryZh:'疼痛、镇静与局麻',title:'Acetaminophen',titleZh:'对乙酰氨基酚',
      drugs:[d('Acetaminophen','Tylenol')],
      use:'Relieves pain and fever with little peripheral anti-inflammatory effect.',useZh:'缓解疼痛和发热，但外周抗炎作用很弱。',
      key:'Major overdose concern is liver toxicity; check combination products to prevent duplicate dosing.',keyZh:'过量的主要风险是肝毒性；检查复方制剂以避免重复用药。',
      dental:'Often preferred when NSAIDs are unsuitable, but liver disease and substantial alcohol use matter.',dentalZh:'NSAIDs不适用时常作为替代，但需考虑肝病和大量饮酒。',page:'pp. 33–34, 47'
    },
    {
      id:'opioids',category:'Pain, sedation & local anesthesia',categoryZh:'疼痛、镇静与局麻',title:'Opioids and reversal',titleZh:'阿片类药物与逆转药',
      drugs:[d('Codeine','Tylenol No. 3'),d('Hydrocodone','Vicodin'),d('Oxycodone','Percocet / Percodan'),d('Morphine'),d('Naloxone','Narcan')],
      use:'Provide moderate-to-severe analgesia; naloxone reverses opioid receptor effects.',useZh:'用于中度至重度镇痛；纳洛酮可逆转阿片受体作用。',
      key:'Sedation, respiratory depression, constipation, dependence, and pinpoint pupils are high-yield clues.',keyZh:'镇静、呼吸抑制、便秘、依赖和针尖样瞳孔是高频线索。',
      dental:'Avoid additive CNS depressants. Recognize overdose and activate emergency response while using naloxone when indicated.',dentalZh:'避免与其他中枢抑制剂叠加；识别过量并启动急救，适应证明确时使用纳洛酮。',page:'pp. 33–34, 49'
    },
    {
      id:'nitrous-oxide',category:'Pain, sedation & local anesthesia',categoryZh:'疼痛、镇静与局麻',title:'Nitrous oxide–oxygen sedation',titleZh:'氧化亚氮–氧气镇静',
      drugs:[d('Nitrous oxide'),d('Oxygen')],
      use:'Produces minimal inhalation sedation and anxiolysis with rapid exhalation.',useZh:'产生最低程度吸入镇静和抗焦虑作用，并可快速呼出。',
      key:'Titrate with oxygen and give 100% oxygen after termination. Airway obstruction and certain respiratory conditions can limit use.',keyZh:'与氧气滴定，停止后给予100%氧气；气道阻塞和某些呼吸系统疾病可能限制使用。',
      dental:'Patient remains responsive; monitor continuously and follow local authorization and protocols.',dentalZh:'患者保持反应；持续监测并遵循当地授权和操作规范。',page:'pp. 34–35'
    },
    {
      id:'local-anesthetics',category:'Pain, sedation & local anesthesia',categoryZh:'疼痛、镇静与局麻',title:'Local anesthetics',titleZh:'局部麻醉药',
      drugs:[d('Lidocaine','Xylocaine'),d('Mepivacaine','Carbocaine'),d('Articaine','Septanest / Astracaine'),d('Prilocaine','Citanest'),d('Bupivacaine','Marcaine'),d('Benzocaine'),d('Procaine'),d('Tetracaine')],
      use:'Block voltage-gated sodium channels and prevent nerve impulse propagation.',useZh:'阻断电压门控钠通道，阻止神经冲动传播。',
      key:'Amides are mainly injectable and usually metabolized in the liver; esters are more associated with allergy. Toxicity can cause excitation, seizures, then depression.',keyZh:'酰胺类多用于注射并主要经肝代谢；酯类更易过敏。毒性可先兴奋、惊厥，继而抑制。',
      dental:'Calculate total dose, account for vasoconstrictor concentration, and recognize sulfite sensitivity and methemoglobinemia risk.',dentalZh:'计算总剂量，考虑血管收缩剂浓度，并识别亚硫酸盐敏感和高铁血红蛋白血症风险。',page:'pp. 46–47, 51'
    },
    {
      id:'penicillins-cephalosporins',category:'Antimicrobials',categoryZh:'抗微生物药物',title:'Penicillins and cephalosporins',titleZh:'青霉素类与头孢菌素类',
      drugs:[d('Amoxicillin','Amoxil'),d('Penicillin V / VK'),d('Ampicillin'),d('Cephalexin','Keflex'),d('Cefazolin'),d('Ceftriaxone')],
      use:'Beta-lactam antibiotics that inhibit bacterial cell-wall synthesis.',useZh:'抑制细菌细胞壁合成的β-内酰胺类抗生素。',
      key:'Clarify the exact allergy reaction. Severe immediate penicillin allergy changes cephalosporin choices.',keyZh:'确认具体过敏反应；严重即刻型青霉素过敏会影响头孢类选择。',
      dental:'Amoxicillin is the usual oral prophylaxis choice when indicated; use a single pre-procedure dose according to current guidance.',dentalZh:'有适应证时阿莫西林通常为口服预防首选；按现行指南在操作前单次给药。',page:'pp. 35, 48, 51'
    },
    {
      id:'macrolides-lincosamides',category:'Antimicrobials',categoryZh:'抗微生物药物',title:'Macrolides and clindamycin',titleZh:'大环内酯类与克林霉素',
      drugs:[d('Azithromycin','Zithromax'),d('Clarithromycin','Biaxin'),d('Erythromycin'),d('Clindamycin','Dalacin')],
      use:'Inhibit bacterial protein synthesis; azithromycin may be an alternative prophylaxis option for penicillin allergy.',useZh:'抑制细菌蛋白合成；青霉素过敏时阿奇霉素可作为预防用药替代。',
      key:'Macrolides may interact with warfarin. Clindamycin has an important C. difficile colitis risk and is no longer the preferred prophylaxis alternative in the chapter.',keyZh:'大环内酯类可能与华法林相互作用；克林霉素有重要的艰难梭菌结肠炎风险，章节中已不再作为首选预防替代药。',
      dental:'Ask about persistent diarrhea after antibiotics and coordinate anticoagulant monitoring when relevant.',dentalZh:'询问抗生素后持续腹泻；涉及抗凝治疗时协调监测。',page:'pp. 35–36, 48–49, 51'
    },
    {
      id:'tetracyclines-nitroimidazole',category:'Antimicrobials',categoryZh:'抗微生物药物',title:'Tetracyclines and metronidazole',titleZh:'四环素类与甲硝唑',
      drugs:[d('Tetracycline'),d('Doxycycline','Vibramycin / Atridox / Periostat'),d('Minocycline','Arestin'),d('Metronidazole','Flagyl')],
      use:'Tetracyclines inhibit protein synthesis; metronidazole targets anaerobic organisms.',useZh:'四环素类抑制蛋白合成；甲硝唑针对厌氧菌。',
      key:'Tetracyclines can cause photosensitivity and permanent discoloration during tooth development. Metronidazole can cause metallic taste and a disulfiram-like alcohol reaction.',keyZh:'四环素类可导致光敏和牙齿发育期永久变色；甲硝唑可引起金属味及与酒精相关的双硫仑样反应。',
      dental:'Avoid tetracyclines in pregnancy and young children as directed; metronidazole can markedly increase warfarin effect.',dentalZh:'按指导避免孕期及幼儿使用四环素类；甲硝唑可显著增强华法林作用。',page:'pp. 35–36, 49, 51'
    },
    {
      id:'periodontal-antimicrobials',category:'Antimicrobials',categoryZh:'抗微生物药物',title:'Periodontal antimicrobial products',titleZh:'牙周抗微生物制剂',
      drugs:[d('Chlorhexidine','Peridex / PerioChip'),d('Minocycline','Arestin'),d('Doxycycline','Atridox / Periostat')],
      use:'Adjuncts to mechanical periodontal therapy; local or subantimicrobial-dose delivery varies by product.',useZh:'作为机械性牙周治疗的辅助；不同制剂采用局部或亚抗菌剂量给药。',
      key:'Chlorhexidine can stain teeth and alter taste. Local sustained-release products should not be disturbed after placement.',keyZh:'氯己定可使牙齿着色并改变味觉；局部缓释制剂放置后不应扰动。',
      dental:'These are adjuncts, not substitutes for debridement and plaque control.',dentalZh:'这些是辅助治疗，不能替代洁治和菌斑控制。',page:'pp. 36–37'
    },
    {
      id:'tb-drugs',category:'Antimicrobials',categoryZh:'抗微生物药物',title:'Antituberculosis drugs',titleZh:'抗结核药物',
      drugs:[d('Isoniazid','INH'),d('Rifampin','Rifadin'),d('Pyrazinamide')],
      use:'Used in multidrug regimens for tuberculosis because of resistance and slow replication.',useZh:'因耐药性和复制缓慢，结核病采用多药联合方案。',
      key:'Treatment is prolonged; systemic adverse effects and drug interactions vary by agent.',keyZh:'疗程较长；全身不良反应和药物相互作用因药而异。',
      dental:'Confirm whether disease is active and follow infection-control and medical-clearance requirements.',dentalZh:'确认是否为活动性疾病，并遵循感染控制和医疗许可要求。',page:'p. 37'
    },
    {
      id:'antivirals',category:'Antimicrobials',categoryZh:'抗微生物药物',title:'Antiviral drugs',titleZh:'抗病毒药物',
      drugs:[d('Acyclovir','Zovirax'),d('Docosanol','Abreva'),d('Zidovudine','AZT / Retrovir')],
      use:'Interfere with virus-specific replication; docosanol is topical for herpes labialis.',useZh:'干扰特定病毒复制；多可沙诺用于唇疱疹局部治疗。',
      key:'Antivirals suppress active replication but do not eliminate latent virus; early use matters for herpes therapy.',keyZh:'抗病毒药抑制活动性复制但不能清除潜伏病毒；疱疹治疗需尽早开始。',
      dental:'Assess active lesions, immune status, and possible oral ulceration or infection risk.',dentalZh:'评估活动性病损、免疫状态及口腔溃疡或感染风险。',page:'p. 37'
    },
    {
      id:'antifungals',category:'Antimicrobials',categoryZh:'抗微生物药物',title:'Antifungal drugs',titleZh:'抗真菌药物',
      drugs:[d('Nystatin','Mycostatin'),d('Clotrimazole','Mycelex / Clotrimaderm'),d('Fluconazole','Diflucan'),d('Ketoconazole')],
      use:'Treat candidiasis through topical or systemic routes.',useZh:'通过局部或全身途径治疗念珠菌病。',
      key:'Nystatin is topical and should contact tissues; clotrimazole troches dissolve slowly; systemic azoles have more interaction and toxicity concerns.',keyZh:'制霉菌素为局部用药并需接触组织；克霉唑含片应缓慢溶解；全身唑类相互作用和毒性更多。',
      dental:'Remove dentures during topical treatment and address predisposing factors such as inhaled steroids or recent antibiotics.',dentalZh:'局部治疗时取下义齿，并处理吸入激素或近期抗生素等诱因。',page:'p. 37'
    },
    {
      id:'antidepressants',category:'Psychiatric & neurologic',categoryZh:'精神与神经系统',title:'Antidepressants',titleZh:'抗抑郁药',
      drugs:[d('Fluoxetine','Prozac'),d('Sertraline','Zoloft'),d('Citalopram','Celexa'),d('Paroxetine','Paxil'),d('Amitriptyline','Elavil'),d('Phenelzine','Nardil'),d('Bupropion','Wellbutrin / Zyban')],
      use:'SSRIs, TCAs, MAOIs, and NDRIs alter monoamine signaling by different mechanisms.',useZh:'SSRIs、TCAs、MAOIs和NDRIs通过不同机制改变单胺信号。',
      key:'Xerostomia is common. TCAs and MAOIs have important sympathomimetic interactions; SSRIs may increase bleeding with NSAIDs.',keyZh:'口干常见；TCAs和MAOIs与拟交感药有重要相互作用；SSRIs与NSAIDs合用可能增加出血。',
      dental:'Assess dry mouth, bruxism, orthostatic hypotension, sedation, and vasoconstrictor interactions.',dentalZh:'评估口干、磨牙、体位性低血压、镇静及血管收缩剂相互作用。',page:'pp. 38, 49'
    },
    {
      id:'antipsychotics',category:'Psychiatric & neurologic',categoryZh:'精神与神经系统',title:'Antipsychotics',titleZh:'抗精神病药',
      drugs:[d('Chlorpromazine','Thorazine'),d('Haloperidol','Haldol'),d('Clozapine','Clozaril'),d('Risperidone','Risperdal'),d('Olanzapine','Zyprexa'),d('Quetiapine','Seroquel')],
      use:'Treat psychosis and related disorders through dopamine and other receptor effects.',useZh:'通过多巴胺及其他受体作用治疗精神病性症状和相关疾病。',
      key:'Typical agents have more extrapyramidal effects; atypical agents have more metabolic concerns.',keyZh:'典型药物锥体外系反应更多；非典型药物代谢问题更多。',
      dental:'Watch for xerostomia, sedation, orthostatic hypotension, and tardive dyskinesia involving oral/facial movements.',dentalZh:'注意口干、镇静、体位性低血压及涉及口面部运动的迟发性运动障碍。',page:'pp. 38–39, 49'
    },
    {
      id:'anxiolytics-hypnotics',category:'Psychiatric & neurologic',categoryZh:'精神与神经系统',title:'Anxiolytics and hypnotics',titleZh:'抗焦虑药与催眠药',
      drugs:[d('Diazepam','Valium'),d('Lorazepam','Ativan'),d('Alprazolam','Xanax'),d('Triazolam','Halcion'),d('Midazolam','Versed'),d('Zolpidem','Ambien'),d('Eszopiclone','Lunesta'),d('Buspirone','Buspar'),d('Propranolol','Inderal'),d('Sertraline','Zoloft'),d('Paroxetine','Paxil')],
      use:'Reduce anxiety or produce sedation through GABA, serotonin, or adrenergic pathways.',useZh:'通过GABA、血清素或肾上腺素能途径减轻焦虑或产生镇静。',
      key:'Benzodiazepines and hypnotics have additive CNS-depressant effects with alcohol and opioids.',keyZh:'苯二氮䓬类和催眠药与酒精及阿片类合用会叠加中枢抑制。',
      dental:'Plan for sedation, xerostomia, impaired coordination, escort needs, and gag-reflex suppression.',dentalZh:'考虑镇静、口干、协调受损、陪同需求及咽反射抑制。',page:'pp. 39, 47, 49'
    },
    {
      id:'antiseizure-neurologic',category:'Psychiatric & neurologic',categoryZh:'精神与神经系统',title:'Antiseizure and neurologic drugs',titleZh:'抗癫痫与神经系统药物',
      drugs:[d('Phenytoin','Dilantin'),d('Phenobarbital','Luminal'),d('Gabapentin','Neurontin'),d('Pregabalin','Lyrica'),d('Carbamazepine','Tegretol'),d('Lithium')],
      use:'Stabilize neuronal activity or treat neuropathic pain and mood disorders.',useZh:'稳定神经元活动，或治疗神经性疼痛和情绪障碍。',
      key:'Phenytoin is classically associated with gingival enlargement. NSAIDs can raise lithium levels.',keyZh:'苯妥英典型地与牙龈增生有关；NSAIDs可升高锂浓度。',
      dental:'Reinforce meticulous plaque control, assess sedation and coordination, and avoid important interactions.',dentalZh:'加强严格菌斑控制，评估镇静和协调能力，并避免重要相互作用。',page:'pp. 40, 49'
    },
    {
      id:'muscle-relaxants',category:'Psychiatric & neurologic',categoryZh:'精神与神经系统',title:'Skeletal muscle relaxants',titleZh:'骨骼肌松弛剂',
      drugs:[d('Cyclobenzaprine','Flexeril'),d('Methocarbamol','Robaxin')],
      use:'Reduce muscle spasm through central nervous system effects.',useZh:'通过中枢神经系统作用减轻肌肉痉挛。',
      key:'Xerostomia, drowsiness, dizziness, fatigue, orthostatic hypotension, and reduced coordination are high-yield concerns.',keyZh:'口干、嗜睡、头晕、疲劳、体位性低血压和协调下降是高频注意点。',
      dental:'Ask whether medication was taken before the appointment; recline and raise the chair slowly and reinforce caries prevention.',dentalZh:'询问就诊前是否服药；缓慢放倒和抬高牙椅，并加强龋病预防。',page:'p. 40'
    },
    {
      id:'emergency-kit',category:'Autonomic & emergency',categoryZh:'自主神经与急救',title:'Core dental emergency agents',titleZh:'牙科核心急救药物',
      drugs:[d('Epinephrine','EpiPen'),d('Nitroglycerin','Nitrostat'),d('Salbutamol / albuterol','Ventolin'),d('Glucose'),d('Oxygen'),d('Aspirin','Bayer'),d('Naloxone','Narcan')],
      use:'Match the agent to anaphylaxis, angina, bronchospasm, hypoglycemia, hypoxia, suspected myocardial infarction, or opioid overdose.',useZh:'将药物分别对应过敏性休克、心绞痛、支气管痉挛、低血糖、缺氧、疑似心肌梗死或阿片过量。',
      key:'Correct drug selection never replaces airway, breathing, circulation, emergency activation, and ongoing monitoring.',keyZh:'正确选择药物不能替代气道、呼吸、循环、启动急救和持续监测。',
      dental:'Know indication, contraindications, route, dose protocol, expiry, and location of every office emergency agent.',dentalZh:'掌握诊所每种急救药物的适应证、禁忌证、给药途径、剂量流程、有效期和存放位置。',page:'pharmacology emergency-drug review'
    },
    {
      id:'allergy-anaphylaxis',category:'Allergy, inflammation & immunity',categoryZh:'过敏、炎症与免疫',title:'Antihistamines and anaphylaxis drugs',titleZh:'抗组胺药与过敏性休克药物',
      drugs:[d('Diphenhydramine','Benadryl'),d('Loratadine','Claritin'),d('Cetirizine','Reactine'),d('Epinephrine','EpiPen'),d('Prednisone'),d('Hydrocortisone')],
      use:'Block histamine for allergy symptoms; epinephrine is first-line for anaphylaxis; corticosteroids suppress inflammation.',useZh:'抗组胺药缓解过敏；肾上腺素是过敏性休克一线药；糖皮质激素抑制炎症。',
      key:'Epinephrine has no absolute contraindication in life-threatening anaphylaxis. First-generation antihistamines are more sedating and drying.',keyZh:'危及生命的过敏性休克中肾上腺素无绝对禁忌；第一代抗组胺药更易镇静和引起口干。',
      dental:'Prioritize airway, breathing, circulation, IM epinephrine, and EMS activation for anaphylaxis.',dentalZh:'过敏性休克时优先处理气道、呼吸、循环，肌注肾上腺素并启动急救系统。',page:'p. 41'
    },
    {
      id:'immunosuppressants',category:'Allergy, inflammation & immunity',categoryZh:'过敏、炎症与免疫',title:'Immunosuppressants',titleZh:'免疫抑制剂',
      drugs:[d('Cyclosporine','Sandimmune'),d('Tacrolimus','Prograf'),d('Sirolimus','Rapamune'),d('Methotrexate')],
      use:'Prevent transplant rejection or manage autoimmune disease.',useZh:'预防移植排斥或治疗自身免疫性疾病。',
      key:'Cyclosporine is strongly associated with gingival enlargement; methotrexate toxicity can cause mucositis and marrow suppression.',keyZh:'环孢素与牙龈增生密切相关；甲氨蝶呤毒性可导致黏膜炎和骨髓抑制。',
      dental:'Assess infection risk, delayed healing, blood counts when relevant, and need for medical coordination before invasive care.',dentalZh:'评估感染风险、延迟愈合、必要时血细胞计数，并在侵入性治疗前进行医疗协作。',page:'pp. 41, 43'
    },
    {
      id:'corticosteroids',category:'Allergy, inflammation & immunity',categoryZh:'过敏、炎症与免疫',title:'Corticosteroids',titleZh:'糖皮质激素',
      drugs:[d('Prednisone'),d('Hydrocortisone'),d('Dexamethasone'),d('Fluticasone','Flovent'),d('Budesonide','Pulmicort')],
      use:'Suppress inflammatory and immune responses by mimicking cortisol effects.',useZh:'模拟皮质醇作用，抑制炎症和免疫反应。',
      key:'Long-term systemic use can cause adrenal suppression, infection risk, delayed healing, hyperglycemia, and bone loss.',keyZh:'长期全身使用可导致肾上腺抑制、感染风险、延迟愈合、高血糖和骨量减少。',
      dental:'Assess long-term use and medical stability. Rinse after inhaled steroids to reduce oral candidiasis.',dentalZh:'评估长期使用和医疗稳定性；吸入激素后漱口以减少口腔念珠菌病。',page:'pp. 41, 44, 49, 51'
    },
    {
      id:'insulins',category:'Diabetes & hormones',categoryZh:'糖尿病与激素',title:'Insulins',titleZh:'胰岛素',
      drugs:[d('Insulin glargine','Lantus'),d('Insulin lispro','Humalog'),d('Insulin aspart','NovoLog'),d('Regular insulin')],
      use:'Replace insulin; rapid-acting products cover meals and glargine provides long basal action.',useZh:'补充胰岛素；速效制剂覆盖进餐，甘精胰岛素提供长效基础作用。',
      key:'Hypoglycemia is the immediate board-exam danger: sweating, tremor, confusion, tachycardia, or altered consciousness.',keyZh:'低血糖是考试中的即时危险：出汗、震颤、意识混乱、心动过速或意识改变。',
      dental:'Confirm normal meals and medication timing; keep a rapid glucose source available.',dentalZh:'确认正常进餐和用药时间；备有快速葡萄糖来源。',page:'pp. 41–42, 52'
    },
    {
      id:'oral-diabetes',category:'Diabetes & hormones',categoryZh:'糖尿病与激素',title:'Oral diabetes drugs',titleZh:'口服降糖药',
      drugs:[d('Metformin','Glucophage'),d('Glyburide','Diabeta'),d('Glipizide','Glucotrol'),d('Repaglinide','Prandin'),d('Nateglinide','Starlix'),d('Canagliflozin','Invokana'),d('Dapagliflozin','Farxiga'),d('Sitagliptin','Januvia'),d('Saxagliptin','Onglyza'),d('Pioglitazone','Actos'),d('Rosiglitazone','Avandia')],
      use:'Lower glucose through hepatic, pancreatic, renal, incretin, or insulin-sensitivity pathways.',useZh:'通过肝脏、胰腺、肾脏、肠促胰素或胰岛素敏感性途径降低血糖。',
      key:'Metformin has low hypoglycemia risk alone; sulfonylureas and meglitinides can cause hypoglycemia; SGLT2 inhibitors increase urinary glucose loss.',keyZh:'二甲双胍单用时低血糖风险低；磺脲类和格列奈类可引起低血糖；SGLT2抑制剂增加尿糖排出。',
      dental:'Assess glycemic control, healing, infection risk, taste changes, and whether the patient has eaten.',dentalZh:'评估血糖控制、愈合、感染风险、味觉改变以及患者是否进食。',page:'pp. 41–42, 52'
    },
    {
      id:'incretin-weight',category:'Diabetes & hormones',categoryZh:'糖尿病与激素',title:'Incretin and weight-management drugs',titleZh:'肠促胰素与体重管理药物',
      drugs:[d('Semaglutide','Ozempic / Wegovy'),d('Liraglutide','Victoza / Saxenda'),d('Tirzepatide','Mounjaro'),d('Pramlintide','Symlin'),d('Phentermine–topiramate','Qsymia')],
      use:'Increase satiety or modify insulin and glucagon responses; indications vary between diabetes and weight management.',useZh:'增加饱腹感或改变胰岛素和胰高血糖素反应；适应证涵盖糖尿病和体重管理。',
      key:'GI effects, reduced appetite, and hypoglycemia risk when combined with other glucose-lowering therapy are important.',keyZh:'胃肠道反应、食欲下降及与其他降糖治疗合用时的低血糖风险很重要。',
      dental:'Ask about nausea, nutrition, glycemic stability, and delayed gastric emptying when planning care.',dentalZh:'治疗计划中询问恶心、营养、血糖稳定性及胃排空延迟。',page:'pp. 41–42, 45, 52'
    },
    {
      id:'thyroid',category:'Diabetes & hormones',categoryZh:'糖尿病与激素',title:'Thyroid drugs',titleZh:'甲状腺药物',
      drugs:[d('Levothyroxine','Synthroid'),d('Liothyronine','Cytomel'),d('Methimazole','Tapazole'),d('Propylthiouracil','PTU')],
      use:'Replace thyroid hormone or block thyroid hormone production.',useZh:'补充甲状腺激素或阻断甲状腺激素生成。',
      key:'Levothyroxine is T4 replacement; methimazole and PTU treat hyperthyroidism.',keyZh:'左甲状腺素为T4替代；甲巯咪唑和丙硫氧嘧啶治疗甲亢。',
      dental:'Uncontrolled hyperthyroidism increases sensitivity to sympathomimetics; confirm medical stability.',dentalZh:'未控制的甲亢会增加对拟交感药的敏感性；需确认医疗稳定。',page:'p. 42'
    },
    {
      id:'bronchodilators',category:'Respiratory & gastrointestinal',categoryZh:'呼吸与胃肠系统',title:'Bronchodilators',titleZh:'支气管扩张剂',
      drugs:[d('Salbutamol / albuterol','Ventolin'),d('Terbutaline'),d('Salmeterol','Serevent'),d('Formoterol','Foradil'),d('Ipratropium','Atrovent'),d('Tiotropium','Spiriva'),d('Theophylline')],
      use:'Relax airway smooth muscle through beta-2, anticholinergic, or methylxanthine mechanisms.',useZh:'通过β2、抗胆碱或甲基黄嘌呤机制松弛气道平滑肌。',
      key:'SABA is rescue; LABA is maintenance and must not be used alone in asthma. Anticholinergics can cause dry mouth.',keyZh:'SABA用于急救；LABA用于维持且哮喘中不能单独使用。抗胆碱药可引起口干。',
      dental:'Ensure the rescue inhaler is available and assess asthma control before care.',dentalZh:'治疗前确保急救吸入器可用并评估哮喘控制。',page:'pp. 44, 51'
    },
    {
      id:'respiratory-controllers',category:'Respiratory & gastrointestinal',categoryZh:'呼吸与胃肠系统',title:'Respiratory controller drugs',titleZh:'呼吸系统控制药',
      drugs:[d('Fluticasone','Flovent'),d('Budesonide','Pulmicort'),d('Montelukast','Singulair'),d('Fluticasone–salmeterol','Advair'),d('Budesonide–formoterol','Symbicort')],
      use:'Prevent airway inflammation or provide long-term control.',useZh:'预防气道炎症或提供长期控制。',
      key:'Inhaled corticosteroids can cause oral candidiasis; combination inhalers pair anti-inflammatory and bronchodilator effects.',keyZh:'吸入性糖皮质激素可导致口腔念珠菌病；复方吸入器结合抗炎和支气管扩张作用。',
      dental:'Advise rinsing and spitting after steroid inhalers and assess for candidiasis.',dentalZh:'建议吸入激素后漱口并吐出，检查念珠菌病。',page:'pp. 37, 44, 49, 51'
    },
    {
      id:'acid-reducers',category:'Respiratory & gastrointestinal',categoryZh:'呼吸与胃肠系统',title:'Acid-reducing drugs',titleZh:'抑酸药',
      drugs:[d('Omeprazole','Losec / Prilosec'),d('Esomeprazole','Nexium'),d('Lansoprazole','Prevacid'),d('Pantoprazole','Tecta / Protonix'),d('Famotidine','Pepcid'),d('Cimetidine','Tagamet'),d('Ranitidine','Zantac — withdrawn')],
      use:'PPIs block the proton pump; H2 blockers reduce histamine-stimulated acid secretion.',useZh:'PPI阻断质子泵；H2阻滞剂减少组胺刺激的胃酸分泌。',
      key:'Long-term acid suppression may affect nutrient absorption; ranitidine is identified as withdrawn in the source.',keyZh:'长期抑酸可能影响营养吸收；资料中标明雷尼替丁已撤市。',
      dental:'Consider reflux-related erosion, xerostomia, taste changes, and medication interactions.',dentalZh:'考虑反流相关牙蚀、口干、味觉变化及药物相互作用。',page:'pp. 45, 51'
    },
    {
      id:'antacids-mucosal',category:'Respiratory & gastrointestinal',categoryZh:'呼吸与胃肠系统',title:'Antacids and mucosal agents',titleZh:'抗酸剂与黏膜保护药',
      drugs:[d('Calcium carbonate','Tums'),d('Magnesium hydroxide','Milk of Magnesia'),d('Aluminum hydroxide','Amphojel'),d('Bismuth subsalicylate','Pepto-Bismol')],
      use:'Neutralize acid or protect gastrointestinal mucosa.',useZh:'中和胃酸或保护胃肠黏膜。',
      key:'Antacid composition affects constipation, diarrhea, and electrolyte concerns. Bismuth can temporarily darken tongue and stool.',keyZh:'抗酸剂成分影响便秘、腹泻和电解质风险；铋剂可暂时使舌和粪便变黑。',
      dental:'A black tongue from bismuth can be benign; distinguish it from pathology and review salicylate exposure.',dentalZh:'铋剂引起的黑舌可能为良性；需与病变区分并评估水杨酸盐暴露。',page:'pp. 45, 49'
    },
    {
      id:'gi-regulation',category:'Respiratory & gastrointestinal',categoryZh:'呼吸与胃肠系统',title:'GI regulation and antiemetic drugs',titleZh:'胃肠调节与止吐药',
      drugs:[d('Psyllium','Metamucil'),d('Docusate','Colace'),d('Bisacodyl','Dulcolax'),d('Loperamide','Imodium'),d('Diphenoxylate–atropine','Lomotil'),d('Mebeverine'),d('Ondansetron','Zofran'),d('Promethazine','Phenergan'),d('Scopolamine','Transderm Scop'),d('Metoclopramide','Reglan'),d('Dimenhydrinate','Gravol')],
      use:'Alter bowel motility, stool properties, or nausea pathways.',useZh:'改变肠道动力、粪便性质或恶心相关通路。',
      key:'Laxative misuse can cause electrolyte imbalance; loperamide reduces motility; several antiemetics are sedating or anticholinergic.',keyZh:'滥用泻药可导致电解质紊乱；洛哌丁胺降低肠动力；多种止吐药具有镇静或抗胆碱作用。',
      dental:'Assess xerostomia, sedation, orthostatic effects, and possible electrolyte disturbances.',dentalZh:'评估口干、镇静、体位性影响及可能的电解质紊乱。',page:'p. 45'
    },
    {
      id:'bone-modifying',category:'Other high-yield dental drugs',categoryZh:'其他牙科高频药物',title:'Bone-modifying drugs',titleZh:'骨代谢调节药物',
      drugs:[d('Bisphosphonates'),d('Denosumab','Prolia / Xgeva')],
      use:'Reduce bone resorption for osteoporosis or malignancy-related bone disease.',useZh:'用于骨质疏松或肿瘤相关骨病，减少骨吸收。',
      key:'Medication-related osteonecrosis of the jaw risk varies by indication, potency, route, duration, comorbidities, and procedure.',keyZh:'药物相关颌骨坏死风险取决于适应证、效力、给药途径、疗程、合并症及操作。',
      dental:'Assess MRONJ risk before invasive procedures and coordinate care; do not independently stop therapy.',dentalZh:'侵入性操作前评估MRONJ风险并协调治疗；不要擅自停药。',page:'course review dental-drug summary'
    }
  ];
})();
