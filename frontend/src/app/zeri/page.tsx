'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { api } from '@/lib/api/client';

type Purpose = 'wedding' | 'business' | 'moving' | 'construction';

const purposes: { key: Purpose; label: string; icon: string; desc: string }[] = [
  { key: 'wedding', label: '婚嫁择日', icon: '婚', desc: '嫁娶 纳采 订婚' },
  { key: 'business', label: '开业择日', icon: '开', desc: '开业 开市 交易' },
  { key: 'moving', label: '搬家择日', icon: '迁', desc: '入宅 迁徙 移徙' },
  { key: 'construction', label: '动土择日', icon: '动', desc: '动土 修造 起基' },
];

const weekNames = ['日', '一', '二', '三', '四', '五', '六'];

const jianchuExplains: Record<string, string> = {
  '建': '建日为万物生育之始，宜建基立业、开业求财，忌动土修造。建日气场平稳，适合开展新事物，但不宜进行破坏性工程。',
  '除': '除日意为除旧布新，宜扫舍沐浴、解除灾厄、祭祀祈福，忌嫁娶远行。此日适合清理积弊，处理遗留问题。',
  '满': '满日象征圆满丰盈，宜祈福纳采、开市交易、栽种牧养，忌造屋安葬。满日利于求财和喜庆之事，气场充盈。',
  '平': '平日主平稳安定，宜修饰墙垣、涂泥安床，忌动土开渠。此日适合进行日常维护工作，不宜做重大决定。',
  '定': '定日意为安定稳固，宜祈福嫁娶、造屋造畜，忌词讼移徙。定日适合签订合约、确定关系，不宜搬迁。',
  '执': '执日意为执守持重，宜建房栽种、捕捉捕猎，忌开市纳财。此日适合坚守已有成果，不宜激进扩张。',
  '破': '破日为冲破之象，宜破屋坏垣、解除旧事，忌诸事不宜。此日气场动荡，仅适合破坏性或解约之事。',
  '危': '危日意为危机并存，宜祭祀祈福，忌登高远行、开业嫁娶。此日需谨慎行事，避免冒险活动。',
  '成': '成日意为成就功成，宜嫁娶开市、造屋入学、出行求财，忌诉讼。成日万事皆宜，是难得的吉日。',
  '收': '收日象征收纳聚财，宜纳财纳畜、祭祀祈福，忌开市出行。此日适合收敛财富，不宜散财或开始新事。',
  '开': '开日意为开通明朗，宜开市交易、出行远行、嫁娶求财，忌动土安葬。开日气场开放，诸事顺遂。',
  '闭': '闭日意为闭塞不通，宜安葬收藏、筑堤修造，忌开市出行。此日适合收尾工作，不宜启动新事。',
};

const ershibaExplains: Record<string, string> = {
  '角木蛟': '二十八宿之角宿，属木，为蛟。角宿值日利于建功立业、开业求财，不宜嫁娶安葬。',
  '亢金龙': '二十八宿之亢宿，属金，为龙。亢宿值日宜修造动土，忌嫁娶远行。',
  '氐土貉': '二十八宿之氐宿，属土，为貉。氐宿值日宜祭祀祈福，忌嫁娶开市。',
  '房日兔': '二十八宿之房宿，属日，为兔。房宿值日诸事皆宜，尤利嫁娶和合。',
  '心月狐': '二十八宿之心宿，属月，为狐。心宿值日宜修造安葬，忌嫁娶开市。',
  '尾火虎': '二十八宿之尾宿，属火，为虎。尾宿值日宜捕捉狩猎，忌嫁娶入宅。',
  '箕水豹': '二十八宿之箕宿，属水，为豹。箕宿值日宜入学出行，忌嫁娶动土。',
  '斗木獬': '二十八宿之斗宿，属木，为獬。斗宿值日宜进人口纳财，忌嫁娶动土。',
  '牛金牛': '二十八宿之牛宿，属金，为牛。牛宿值日宜裁衣嫁娶，忌动土远行。',
  '女土蝠': '二十八宿之女宿，属土，为蝠。女宿值日宜织造修造，忌嫁娶出行。',
  '虚日鼠': '二十八宿之虚宿，属日，为鼠。虚宿值日宜祭祀祈福，忌嫁娶远行。',
  '危月燕': '二十八宿之危宿，属月，为燕。危宿值日宜架屋安床，忌登高远行。',
  '室火猪': '二十八宿之室宿，属火，为猪。室宿值日宜修造嫁娶，忌开市远行。',
  '壁水貐': '二十八宿之壁宿，属水，为貐。壁宿值日宜修造栽种，忌嫁娶出行。',
  '奎木狼': '二十八宿之奎宿，属木，为狼。奎宿值日宜修造安葬，忌嫁娶远行。',
  '娄金狗': '二十八宿之娄宿，属金，为狗。娄宿值日宜牧养纳财，忌嫁娶出行。',
  '胃土雉': '二十八宿之胃宿，属土，为雉。胃宿值日宜祭祀嫁娶，忌远行出财。',
  '昴日鸡': '二十八宿之昴宿，属日，为鸡。昴宿值日宜修造安葬，忌嫁娶出行。',
  '毕月乌': '二十八宿之毕宿，属月，为乌。毕宿值日宜祭祀祈福，忌嫁娶远行。',
  '觜火猴': '二十八宿之觜宿，属火，为猴。觜宿值日宜安葬修造，忌嫁娶开市。',
  '参水猿': '二十八宿之参宿，属水，为猿。参宿值日宜出行嫁娶，忌动土安葬。',
  '井木犴': '二十八宿之井宿，属木，为犴。井宿值日宜祭祀祈福，忌嫁娶远行。',
  '鬼金羊': '二十八宿之鬼宿，属金，为羊。鬼宿值日宜修造安葬，忌嫁娶出行。',
  '柳土獐': '二十八宿之柳宿，属土，为獐。柳宿值日宜嫁娶开市，忌动土远行。',
  '星日马': '二十八宿之星宿，属日，为马。星宿值日宜修造嫁娶，忌远行入宅。',
  '张月鹿': '二十八宿之张宿，属月，为鹿。张宿值日宜开市嫁娶，忌动土出行。',
  '翼火蛇': '二十八宿之翼宿，属火，为蛇。翼宿值日宜嫁娶出行，忌动土安葬。',
  '轸水蚓': '二十八宿之轸宿，属水，为蚓。轸宿值日宜出行嫁娶，忌动土修造。',
};

const jianchuDetailed: Record<string, string> = {
  '建': '建日为万物生育之始，属建除十二神之首，代表开创与奠基。建日气场平稳安定，宜开展新事物，但不宜进行破坏性工程。建日生者多有开创精神，执行力强，做事有始有终。此日适合建基立业、开业求财、赴任就职、祈福求嗣等活动。建日阳气初生，万物萌发，是一月之中最具生机之日。但需注意建日不宜动土修造，因为建为始建，动土恐伤根基。',
  '除': '除日意为除旧布新，扫除旧弊，迎来新气象。除日磁场偏向于清理与净化，适合扫舍沐浴、解除灾厄、祭祀祈福、治病疗疾。此日尤其适合清理积弊，处理遗留问题，与过去做个了断。除日宜服用药物，药效更佳；宜理发剃头，去除晦气；宜清理债务，了结旧账。但除日不宜嫁娶远行，因为除为扫除之象，婚事恐有扫兴之嫌，远行恐遇阻碍。除日生者善于反思改进，有推陈出新之能力。',
  '满': '满日象征圆满丰盈，万物充盈，气场饱满。满日宜祈福纳采、开市交易、栽种牧养、纳财进宝。此日气场充盈，利于求财和喜庆之事，生意开张能得圆满之始。满日生者性格豁达，心胸开阔，一生多圆满之事。但满日忌造屋安葬，因为满则招损，物极必反。满日宜收纳财富，储粮积物，不宜过度消耗。满日为月满之象，凡事求圆，但需知满招损、谦受益之道理。',
  '平': '平日主平稳安定，不偏不倚，气场中和。平日适合进行日常维护工作，不宜做重大决定。平日宜修饰墙垣、涂泥安床、平治道途。此日气场平和，无大喜大悲，适合休息调整，恢复精力。平日忌动土开渠，因为平则无破，不利于破土动工之事。平日生者性格温和，处事公正，但有时显得缺乏进取心。平日虽无功，亦无过，是一月中最为平常之日，但平常之中亦有安稳之福。',
  '定': '定日意为安定稳固，气场下沉，万物各安其位。定日宜祈福嫁娶、造屋造畜、签订合约、确定关系。此日气场稳定，适合做长期规划，下定决心。定日生者性格稳重，决策力强，一旦决定便不易动摇。但定日忌词讼移徙，因为定为固定，不利于变动之事。定日宜安置家宅神明，定方位、定格局，宜处理房产户口等固定事项。定日如磐石，稳中求胜，但需防固步自封。',
  '执': '执日意为执守持重，坚守原则，气场内敛。执日宜建房栽种、捕捉捕猎、坚守岗位。此日适合坚守已有成果，不宜激进扩张。执日生者意志坚定，有原则有底线，但有时过于固执。执日忌开市纳财，因为执为持守，不利于纳新之事。执日宜处理未完事务，坚持到底，必有收获。执日如持剑之卫士，守护一方，但需知变通之道，不可一味执拗。',
  '破': '破日为冲破之象，气场动荡，旧破新立。破日为建除十二神中最凶之日，仅适合破坏性或解约之事。破日宜破屋坏垣、解除旧事、了断关系、拆卸物品。此日气场动荡，诸事不宜，即使是吉事也恐有波折。破日生者一生多有起伏，但每次破而后立，往往能打开新局面。破日不宜嫁娶开业入宅出行等一切喜庆活动，但适合打破旧有格局，开辟新路。破日虽凶，亦为新生之始。',
  '危': '危日意为危机并存，警报未除，气场紧张。危日宜祭祀祈福、求助神明、化解灾厄。此日需谨慎行事，避免冒险活动。危日忌登高远行、开业嫁娶，凡涉及安全之事皆需加倍小心。危日生者敏感谨慎，有未雨绸缪之智慧，但有时过于多虑。危日如悬崖边行走，步步需小心，但危中有机，转危为安则在千钧一发之间。危日不宜做任何有风险之决定。',
  '成': '成日意为成就功成，气场上升，万事可成。成日为建除十二神中最吉之日，万事皆宜，是难得的吉日。成日宜嫁娶开市、造屋入学、出行求财、安葬立碑。此日气场通达，万事顺遂，所谋皆可成就。成日生者一帆风顺，事业有成，人缘极佳。成日忌诉讼，因为成巳有成，勿生争执。成日如丰收之秋，果实累累，是最适合举办重大活动的日子。',
  '收': '收日象征收纳聚财，气场收敛，宜收不宜放。收日宜纳财纳畜、祭祀祈福、收藏物品。此日适合收敛财富，不宜散财或开始新事。收日忌开市出行，因为收为收敛之象，不利于开展新事物。收日宜收款讨债，收成入库，收纳新人。收日生者善于积累，理财能力强，但有时过于保守。收日如收获之时，将成果归仓入库，是巩固之日。',
  '开': '开日意为开通明朗，气场开放，诸事顺遂。开日为黄道吉日，气场最为开放，宜开市交易、出行远行、嫁娶求财。此日百事通达，阴阳调和，一切开始之事皆宜。开日生者性格开朗，人缘广博，新事物接受能力强。开日忌动土安葬，因为开为开放之象，不宜封闭之事。开日为建除十二神中气场最为开阔之日，适合开展新项目、建立新关系、开启新篇章。',
  '闭': '闭日意为闭塞不通，气场封闭，万物收敛。闭日宜安葬收藏、筑堤修造、修补漏洞。此日适合收尾工作，不宜启动新事。闭日忌开市出行，因为闭为闭塞之象，不利于开展与出行之事。闭日宜闭关修炼，蓄积力量，暗中准备。闭日生者性格内敛，善于保守秘密，但有时过于封闭。闭日如冬藏之时，万物归寂，是休养恢复之日。',
};

const ershibaDetailed: Record<string, string> = {
  '角木蛟': '角宿为二十八宿之首，东方青龙七宿之一，属木。角宿值日利于建功立业、开业求财。角为龙角，象征威严与开拓，此日宜开展新事业、申报职位、谋求升迁。角宿五行属木，木主仁德，故亦宜慈善公益之事。但角宿不宜嫁娶安葬，因蛟龙之角锐利，恐伤和气。角宿当值日，出行得助，学业进步，官运亨通。角宿之人为人正直，有领导才能，但有时锋芒过露招人忌惮。',
  '亢金龙': '亢宿为东方青龙七宿之二，属金。亢为龙颈，象征支撑与力量，此日宜修造动土、架桥铺路。亢宿五行属金，金主义气，故此日宜树立威信、建立规章制度。亢宿忌嫁娶远行，因龙颈为支撑要害，不宜轻易移动。亢宿当值日，有利于巩固既有成果，加强基础设施。亢宿之人性格坚强，善于统筹管理，但有时刚愎自用，需多听取他人意见。',
  '氐土貉': '氐宿为东方青龙七宿之三，属土。氐为龙胸，象征包容与根基。氐宿值日宜祭祀祈福、结拜盟会、安葬立碑。氐宿五行属土，土主诚信，故亦宜签约立契、确立合作。氐宿忌嫁娶开市，因人龙胸为要害，不宜大喜大贺。氐宿当值日，宜静不宜动，宜守不宜攻。氐宿之人诚实可靠，有包容心，但有时过于保守，缺乏进取精神。',
  '房日兔': '房宿为东方青龙七宿之四，属日。房为龙腹，象征安居与繁衍。房宿值日诸事皆宜，尤利嫁娶和合、求子求嗣。房宿属太阳星，阳气充足，故此日气场温暖，利于一切喜庆之事。房宿宜建造房屋、购买房产、搬家入宅。房宿忌屠宰牲畜、伐木砍树。房宿当值日，天地和合，是最宜婚嫁之吉日。房宿之人温和善良，家庭观念强，一生衣食无忧。',
  '心月狐': '心宿为东方青龙七宿之五，属月。心为龙心，象征君主与核心。心宿值日宜修造安葬、立碑祭祀。心宿属太阴星，气场柔和，宜静不宜动。心宿忌嫁娶开市，因龙心为君主之位，不容亵渎。心宿当值日，宜处理核心事务，做关键决策。心宿之人心思细腻，有策略头脑，但有时多疑善变，难以捉摸。心宿为二十八宿中地位最高者，主君王将相之事。',
  '尾火虎': '尾宿为东方青龙七宿之六，属火。尾为龙尾，象征末梢与终结。尾宿值日宜捕捉狩猎、诉讼争辩、排除障碍。尾宿属火星，气势凌厉，利于扫清障碍、清理旧事。尾宿忌嫁娶入宅，因龙尾为末梢，不宜开端之事。尾宿当值日，宜收尾工作，不宜启动新项目。尾宿之人执行力强，善于终结事务，但有时急躁冒进。',
  '箕水豹': '箕宿为东方青龙七宿之七，属水。箕为龙粪，象征排泄与流通。箕宿值日宜入学出行、开通沟渠。箕宿属水星，水主智慧流通，故宜求学考试、传递信息。箕宿忌嫁娶动土，因排泄之象不宜喜庆之事。箕宿当值日，宜流通不宜阻塞，宜出行旅游。箕宿之人思维敏捷，表达能力强，但有时言语不慎招祸。',
  '斗木獬': '斗宿为北方玄武七宿之一，属木。斗为量器，象征标准与度量。斗宿值日宜进人口纳财、丈量土地。斗宿五行属木，木主生发，故宜栽种养殖、人口增加之事。斗宿忌嫁娶动土，因斗为量器，不宜奠基开创之事。斗宿当值日，宜确立标准、规范制度。斗宿之人公正严明，善于评判，但有时刻板教条。斗为二十八宿中量天之物，主科举功名。',
  '牛金牛': '牛宿为北方玄武七宿之二，属金。牛为牺牲，象征奉献与耕耘。牛宿值日宜裁衣嫁娶、修造动土。牛宿五行属金，金主义气，故宜忠诚守信之事。牛宿忌动土远行，因牛为耕耘之物，远行则弃根本。牛宿当值日，宜辛勤劳作，不宜投机取巧。牛宿之人勤劳踏实，忠心耿耿，但有时过于固执己见。牛宿值日气温多寒，需注意保暖。',
  '女土蝠': '女宿为北方玄武七宿之三，属土。女为妇女，象征阴柔与纺织。女宿值日宜织造修造、学习技艺。女宿五行属土，土主厚德载物，故宜慈善教育之事。女宿忌嫁娶出行，因女宿阴气较重，不宜男性主导的活动。女宿当值日，宜处理家庭事务、照顾老幼。女宿之人性格温柔，手巧心细，善于照顾他人，但有时过于柔弱。',
  '虚日鼠': '虚宿为北方玄武七宿之四，属日。虚为空虚，象征虚无与清寂。虚宿值日宜祭祀祈福、斋戒清修。虚宿属太阳星，阳气虽在但虚而不实，故宜静养不宜妄动。虚宿忌嫁娶远行，因虚为不实之象，大事难成。虚宿当值日，宜反思检查、修正错误，不宜开展新项目。虚宿之人思想深邃，有哲学头脑，但有时虚浮不实。',
  '危月燕': '危宿为北方玄武七宿之五，属月。危为危险，象征高处与警惕。危宿值日宜架屋安床、安置高处之物。危宿属太阴星，阴中有险，故凡事需谨慎。危宿忌登高远行，高处危险之意尤重。危宿当值日，宜加固防护、检查安全。危宿之人警觉性高，有危机意识，但有时过于敏感多疑。危宿值日天气多变，宜随身带伞。',
  '室火猪': '室宿为北方玄武七宿之六，属火。室为房屋，象征安居与庇护。室宿值日宜修造嫁娶、建造房屋。室宿属火星，火主温暖，故宜居家团聚、宴请亲友。室宿忌开市远行，因为室为居家之象，不利外出活动。室宿当值日，宜处理家庭事务、装修房屋、添置家具。室宿之人顾家重情，善于营造温馨环境，但有时过于恋家。',
  '壁水貐': '壁宿为北方玄武七宿之七，属水。壁为墙壁，象征屏障与文籍。壁宿值日宜修造栽种、读书写作。壁宿属水星，水主智慧，故宜学术研究、文学创作。壁宿忌嫁娶出行，因壁为屏障，不利通达之事。壁宿当值日，宜读书求学、收藏典籍。壁宿之人学识丰富，善于积累知识，但有时自我封闭。壁宿为二十八宿中文星之一，主科举文章。',
  '奎木狼': '奎宿为西方白虎七宿之一，属木。奎为天库，象征收藏与财富。奎宿值日宜修造安葬、开仓纳财。奎宿五行属木，木主仁德，故宜慈善捐赠之事。奎宿忌嫁娶远行，因奎为库藏，不宜开放外泄之事。奎宿当值日，宜理财储蓄、盘点库存。奎宿之人善于理财，有经济头脑，但有时过于计较得失。奎宿为二十八宿中财富之主。',
  '娄金狗': '娄宿为西方白虎七宿之二，属金。娄为聚众，象征聚集与会合。娄宿值日宜牧养纳财、聚会议事。娄宿五行属金，金主义气，故宜结盟合作之事。娄宿忌嫁娶出行，因聚会之象不宜两人独处之事。娄宿当值日，宜召开会议、组织活动。娄宿之人组织能力强，善于调动资源，但有时过于喧哗张扬。',
  '胃土雉': '胃宿为西方白虎七宿之三，属土。胃为仓廪，象征储藏与滋养。胃宿值日宜祭祀嫁娶、进仓入库。胃宿五行属土，土主中和，故宜婚嫁喜事。胃宿忌远行出财，因仓廪之象不宜泄散。胃宿当值日，宜储粮积物、保养身体脾胃。胃宿之人性格宽厚，善于滋养他人，但有时过于贪享口腹之欲。胃宿值日宜进补养生。',
  '昴日鸡': '昴宿为西方白虎七宿之四，属日。昴为虎头，象征威严与纪律。昴宿值日宜修造安葬、刑狱判决。昴宿属太阳星，光芒四射但不失威严。昴宿忌嫁娶出行，因虎头之威不宜喜庆之事。昴宿当值日，宜执法仲裁、整顿纪律。昴宿之人纪律性强，处事公正，但有时过于严苛。昴宿为二十八宿中司法之星。',
  '毕月乌': '毕宿为西方白虎七宿之五，属月。毕为猎具，象征捕捉与获取。毕宿值日宜祭祀祈福、狩猎捕捞。毕宿属太阴星，阴柔中带收获之意。毕宿忌嫁娶远行，因猎具为杀伐之器，不宜喜事。毕宿当值日，宜收获成果、结算清楚。毕宿之人善于执行，有果敢精神，但有时手段过于强硬。毕宿值日宜清理野外之物。',
  '觜火猴': '觜宿为西方白虎七宿之六，属火。觜为虎口，象征吸纳与决断。觜宿值日宜安葬修造、判决事务。觜宿属火星，火主决断，故宜做最终决定。觜宿忌嫁娶开市，因虎口为吞噬之象，不宜纳新之事。觜宿当值日，宜了结事务，不宜启动新项目。觜宿之人决策果断，有魄力，但有时鲁莽冲动。',
  '参水猿': '参宿为西方白虎七宿之七，属水。参为参商，象征分离与对应。参宿值日宜出行嫁娶、远方求事。参宿属水星，水主流动，故宜旅行远行。参宿忌动土安葬，因参商分离之象不宜固定之事。参宿当值日，宜出行、远游、建立对外关系。参宿之人好动善变，交际广泛，但有时漂泊不定。参宿为二十八宿中出行远游之星。',
  '井木犴': '井宿为南方朱雀七宿之一，属木。井为水源，象征源泉与智慧。井宿值日宜祭祀祈福、开渠凿井。井宿五行属木，木主仁德，故宜公益事业。井宿忌嫁娶远行，因井为固定之物，不宜移动之事。井宿当值日，宜开源节流、寻求智慧之源。井宿之人善于发掘资源，有创新思维，但有时过于固守一隅。井宿为二十八宿中智慧之源。',
  '鬼金羊': '鬼宿为南方朱雀七宿之二，属金。鬼为祭祀，象征鬼神与隐秘。鬼宿值日宜修造安葬、祭祀亡灵。鬼宿五行属金，金主肃杀，故宜处理暗中事务。鬼宿忌嫁娶出行，因鬼为阴气之宿，不宜阳事。鬼宿当值日，宜祭祀祖先、超度亡灵。鬼宿之人直觉敏锐，有第六感，但有时阴郁多虑。鬼宿值日阳气弱，宜早归。',
  '柳土獐': '柳宿为南方朱雀七宿之三，属土。柳为柳枝，象征柔顺与萌发。柳宿值日宜嫁娶开市、栽种植树。柳宿五行属土，土主中和，故宜和合喜庆之事。柳宿忌动土远行，因柳枝柔嫩不宜大动。柳宿当值日，宜以柔克刚，温和处理事务。柳宿之人性格温和，适应性強，但有时优柔寡断。柳宿值日春风和煦，宜户外活动。',
  '星日马': '星宿为南方朱雀七宿之四，属日。星为星辰，象征光明与名声。星宿值日宜修造嫁娶、开市交易。星宿属太阳星，光芒四射，故宜追求名利之事。星宿忌远行入宅，因星辰为高处之物，不宜下落。星宿当值日，宜宣传推广、扩大影响。星宿之人志向远大，有明星气质，但有时好高骛远。星宿为二十八宿中名声之星。',
  '张月鹿': '张宿为南方朱雀七宿之五，属月。张为开张，象征开放与扩展。张宿值日宜开市嫁娶、宴请宾客。张宿属太阴星，阴柔中带开放之意。张宿忌动土出行，因开张之象不宜封闭之事。张宿当值日，宜扩展业务、扩大社交。张宿之人性格开朗，善于交际，有扩张意识，但有时铺张浪费。张宿值日百事皆宜。',
  '翼火蛇': '翼宿为南方朱雀七宿之六，属火。翼为羽翼，象征辅助与助推。翼宿值日宜嫁娶出行、辅助他人。翼宿属火星，火主推动，故宜助力他人成就。翼宿忌动土安葬，因羽翼为飞翔之物，不宜落地。翼宿当值日，宜做辅助工作，不宜独挑大梁。翼宿之人善于协作，有团队精神，但有时缺乏主见。翼宿为二十八宿中辅佐之星。',
  '轸水蚓': '轸宿为南方朱雀七宿之七，属水。轸为车轸，象征承载与运行。轸宿值日宜出行嫁娶、运输物流。轸宿属水星，水主流动，故宜交通往来。轸宿忌动土修造，因车轸为移动之物，不宜固定。轸宿当值日，宜旅行、运输、搬迁。轸宿之人适应能力强，善于应对变化，但有时漂泊无定。轸宿为二十八宿中出行动力之星。',
};

const yiExplains: Record<string, string> = {
  嫁娶: '宜举行婚礼、娶亲嫁女，天地和合之日利于婚嫁喜事',
  纳采: '宜提亲下聘、送彩礼，是缔结婚姻的第一步',
  订盟: '宜签订婚约、盟誓定亲，建立正式婚约关系',
  祈福: '宜祈求神明赐福、许愿还愿，向上天祈求好运',
  求嗣: '宜求子求童、祈求得子，适合祈求后代子嗣',
  出行: '宜外出远行、出门远游，出行平安顺利',
  解除: '宜解除灾厄、消除不利，适合化解不顺之事',
  裁衣: '宜裁剪制作衣物，特别是重要场合的礼服',
  合帐: '宜设置婚帐、布置洞房，是婚嫁准备事宜',
  冠笄: '宜举行成人礼、冠礼笄礼，为孩子举办成年仪式',
  开市: '宜店铺开张、生意开业，开启新的事业',
  交易: '宜买卖交易、商业往来，进行商品交易活动',
  立券: '宜签订合同、签署契约，确立书面约定',
  挂匾: '宜悬挂牌匾、挂牌营业，正式对外展示',
  纳财: '宜收纳财富、收取款项，适合收款结账',
  开仓: '宜开仓出库、盘点库存，进行仓储管理',
  造车器: '宜制造车辆器械，适合制造加工行业',
  拆卸: '宜拆除旧物、清理杂物，适合拆除清理工作',
  上梁: '宜安装房梁、立柱架梁，建房的关键工序',
  入宅: '宜搬入新居、迁居入宅，入住新家',
  移徙: '宜迁移住处、移居搬走，从旧居搬出',
  安香: '宜安放香炉、设置神位，在家安置神明供桌',
  安床: '宜安放床铺、设置床位，安置卧室床位',
  祭祀: '宜祭拜祖先神明、焚香祷告，与天地祖先沟通',
  动土: '宜破土动工、开工建设，适合开始建筑工程',
  修造: '宜修缮建造、维修加固，进行房屋修缮',
  起基: '宜打地基、奠基开工，建筑工程的起始',
  竖柱: '宜竖立柱子、立柱架梁，建筑中间工序',
  造屋: '宜建造房屋、盖房建屋，进行房屋建设',
  开池: '宜开挖水池、修建池塘，水利工程建设',
  开厕: '宜修建厕所、开建茅厕，完善卫生设施',
  作灶: '宜建造炉灶、设置厨房，安置炊事火灶',
  放水: '宜引流排水、开渠放水，水利疏通工程',
};

const jiExplains: Record<string, string> = {
  破土: '忌破土动工，恐伤地脉龙气，不利家运',
  安葬: '忌进行安葬事宜，恐与天地气相冲突',
  行丧: '忌举行丧礼出殡，恐不吉之象叠加',
  伐木: '忌砍伐树木，恐损伤自然生气',
  掘井: '忌挖井取水，恐动水脉招致不利',
  远行: '忌长途远行，恐路途不顺遇阻碍',
  探病: '忌探望病人，恐将病气带回',
  祈福: '忌此日祈福，恐反招不吉',
  诉讼: '忌提起诉讼争执，恐官司不利',
  掘渠: '忌开挖沟渠河道，恐动土脉不利',
};

const chongExplains: Record<string, string> = {
  鼠: '此日冲鼠，属鼠之人今日运势受冲，诸事不宜。冲即冲突之意，与日支相冲的生肖当日运势较弱，需谨慎行事，避免重大决策。属鼠者今日宜低调，避免与人争执。',
  牛: '此日冲牛，属牛之人今日运势受冲，诸事不宜。冲日意味着当日气场与属牛者相冲突，容易出现阻碍和波折。建议属牛者今日修身养性，暂缓要事。',
  虎: '此日冲虎，属虎之人今日运势受冲，诸事不宜。冲即抵触，属虎者今日各事不顺，宜守不宜攻。避免冒险行为和重要签约，等气场转好再行大事。',
  兔: '此日冲兔，属兔之人今日运势受冲，诸事不宜。生肖与日支相冲，意味着气场对冲，易生变数。属兔者今日注意口舌之争，宜静不宜动。',
  龙: '此日冲龙，属龙之人今日运势受冲，诸事不宜。日冲生肖为最直接的不利影响，属龙者今日避免决策重大事项，宜以安稳为上。',
  蛇: '此日冲蛇，属蛇之人今日运势受冲，诸事不宜。相冲之日气场不稳，属蛇者宜静养，避免出行远游和高风险活动。',
  马: '此日冲马，属马之人今日运势受冲，诸事不宜。生肖冲日则运势走低，属马者今日诸事小心，避免冲动行事和重大开销。',
  羊: '此日冲羊，属羊之人今日运势受冲，诸事不宜。与日支相冲意味着气场相悖，属羊者今日宜静不宜动，勿做重大决定。',
  猴: '此日冲猴，属猴之人今日运势受冲，诸事不宜。相冲之日易有意外变故，属猴者今日谨慎行事，避免投机取巧。',
  鸡: '此日冲鸡，属鸡之人今日运势受冲，诸事不宜。生肖与日辰相冲为不利之象，属鸡者宜低调稳重，切勿冒进。',
  狗: '此日冲狗，属狗之人今日运势受冲，诸事不宜。日冲生肖容易引发不顺，属狗者今日宜守不宜攻，避免投资和新事。',
  猪: '此日冲猪，属猪之人今日运势受冲，诸事不宜。相冲之日气场动荡，属猪者今日注意安全，避免远行和签订重要合约。',
};

const luckyGodsByJianchu: Record<string, string[]> = {
  '建': ['天德','月德','天恩','母仓','续世'],
  '除': ['天赦','天愿','天仓','不将','要安'],
  '满': ['天巫','福德','益后','相日','驿马'],
  '平': ['月空','四相','官日','要安','鸣吠'],
  '定': ['时德','民日','三合','临日','天马'],
  '执': ['天德','月德','天恩','阳德','五合'],
  '破': ['天德合','月德合','普护','解神'],
  '危': ['天德','月德','天恩','母仓','不将'],
  '成': ['天德','月德','三合','天喜','天医'],
  '收': ['母仓','阳德','司命','鸣吠','天贵'],
  '开': ['天德','月德合','天马','驿马','时阳'],
  '闭': ['天德','益后','金堂','王日','官日'],
};

const unluckyGodsByJianchu: Record<string, string[]> = {
  '建': ['土符','地囊','土王用事','阳错','俱将'],
  '除': ['月破','大耗','四击','九空','元武'],
  '满': ['月煞','月虚','血支','天贼','五虚'],
  '平': ['死神','月刑','月害','游祸','天吏'],
  '定': ['死气','小耗','劫煞','灾煞','天棒'],
  '执': ['小耗','劫煞','天贼','五墓','土符'],
  '破': ['大耗','四废','五墓','九空','往亡'],
  '危': ['游祸','天吏','天刑','朱雀','天棒'],
  '收': ['天吏','致死','五墓','天贼','月刑'],
  '开': ['四击','九空','月虚','天牢','五虚'],
  '闭': ['血支','天贼','五墓','劫煞','灾煞'],
};

const taishenLocations: Record<number, string> = {
  0: '胎神在门：今日胎神位于大门方位，孕妇宜注意门口位置，不要在门旁敲打修造，避免惊动胎神。',
  1: '胎神在碓磨：今日胎神在碓磨处，孕妇不宜使用石磨石臼等研磨工具，亦不宜在厨房过度劳作。',
  2: '胎神在厨灶：今日胎神在厨房灶台处，孕妇宜注意火烛安全，不宜亲自下厨烹饪，让家人代劳。',
  3: '胎神在仓库：今日胎神位于仓库储粮之处，孕妇不宜进入仓库取物，避免搬动重物。',
  4: '胎神在房床：今日胎神位于卧室床铺，孕妇宜卧床休息，不宜在床边钉钉子或移动床铺。',
  5: '胎神在碓磨门：今日胎神在碓磨与门之间，孕妇需特别注意这两个位置，避免触碰利器。',
  6: '胎神在灶厕：今日胎神在厨房与厕所之间，孕妇少去这两处，注意卫生和安全。',
  7: '胎神在仓库厕：今日胎神在仓库与厕所处，孕妇宜避开存放物品之所和盥洗区域。',
  8: '胎神在床房：今日胎神在卧室，孕妇宜静养，不宜让外人进入卧室，保持房间整洁安静。',
  9: '胎神在碓磨灶：今日胎神遍布厨房各处，孕妇宜远离厨房，不可搬动厨房重物和利器。',
  10: '胎神在门房：今日胎神在门与房间之间，孕妇宜保持通道通畅，不在门口久站。',
  11: '胎神在仓库门：今日胎神在仓库门口，孕妇不宜出入仓库，避免搬抬重物。',
};

const solarTerms: { name: string; month: number; day: number }[] = [
  { name: '小寒', month: 1, day: 5 }, { name: '大寒', month: 1, day: 20 },
  { name: '立春', month: 2, day: 4 }, { name: '雨水', month: 2, day: 19 },
  { name: '惊蛰', month: 3, day: 5 }, { name: '春分', month: 3, day: 20 },
  { name: '清明', month: 4, day: 5 }, { name: '谷雨', month: 4, day: 20 },
  { name: '立夏', month: 5, day: 5 }, { name: '小满', month: 5, day: 21 },
  { name: '芒种', month: 6, day: 5 }, { name: '夏至', month: 6, day: 21 },
  { name: '小暑', month: 7, day: 7 }, { name: '大暑', month: 7, day: 22 },
  { name: '立秋', month: 8, day: 7 }, { name: '处暑', month: 8, day: 23 },
  { name: '白露', month: 9, day: 7 }, { name: '秋分', month: 9, day: 23 },
  { name: '寒露', month: 10, day: 8 }, { name: '霜降', month: 10, day: 23 },
  { name: '立冬', month: 11, day: 7 }, { name: '小雪', month: 11, day: 22 },
  { name: '大雪', month: 12, day: 7 }, { name: '冬至', month: 12, day: 22 },
];

const solarTermDetails: Record<string, string> = {
  立春: '立春为二十四节气之首，万物复苏之始。此日阳气回升，宜祈福纳吉、栽种植物、制定新年计划。立春日忌争吵动怒，宜以祥和之气迎接新春。立春当日气场由阴转阳，是最适合开始新事物的一天。',
  雨水: '雨水节气降水增多，万物得润。此日宜理发沐浴、清理杂物，忌动土修造。雨水时节宜调整作息，早睡早起以顺应天时。',
  惊蛰: '惊蛰春雷始鸣，万物惊醒。此日宜开业开市、出行远游，忌安床造屋。惊蛰时节雷声惊动百虫，宜大扫除、防虫防害。',
  春分: '春分阴阳平分，昼夜等长。此日宜祭祀祈福、嫁娶订婚，忌动土修造。春分是调和阴阳的好日子，适合做重大决策。',
  清明: '清明气清景明，万物显生。此日宜扫墓祭祖、踏青出游、植树造林，忌嫁娶开业。清明节是追思先人的重要节日。',
  谷雨: '谷雨生百谷，滋润大地。此日宜播种栽种、开业开市，忌动土安葬。谷雨时节宜养护身体，注意防湿。',
  立夏: '立夏万物繁茂，夏季开始。此日宜祈福纳吉、沐浴更衣，忌动土远行。立夏之后宜养心，保持心情舒畅。',
  小满: '小满籽粒渐满，丰收在望。此日宜开市交易、签约立契，忌动土修造。小满宜节制饮食，养胃健脾。',
  芒种: '芒种忙于耕种，机遇当前。此日宜祭祀祈福、开业开市，忌嫁娶入宅。芒种时节宜勤勉工作，把握时机。',
  夏至: '夏至阳气至极，白昼最长。此日宜祭祀祈福、宴请会友，忌动土破屋。夏至一阴生，宜适当进补，养阴护阳。',
  小暑: '小暑炎风至，汗流浃背。此日宜沐浴理发、晒书晒衣，忌嫁娶出行。小暑宜清淡饮食，注意防暑降温。',
  大暑: '大暑酷热至极，人中暑气。此日宜静养避暑、调理饮食，忌动土远行。大暑是一年中最热时节，宜防暑避热。',
  立秋: '立秋阴气渐起，秋季开始。此日宜祈福求财、开市交易，忌动土修造。立秋宜调整作息，早卧早起。',
  处暑: '处暑暑气渐退，秋意渐浓。此日宜栽种牧养、开市交易，忌嫁娶入宅。处暑宜润肺养阴，预防秋燥。',
  白露: '白露凉风生，露珠凝结。此日宜沐浴更衣、学习进修，忌动土修造。白露时节宜添衣保暖，注意防凉。',
  秋分: '秋分阴阳再均，昼夜平分。此日宜祭祀祖先、嫁娶订婚，忌开业开市。秋分宜收敛心态，总结反思。',
  寒露: '寒露寒气渐生，露水结寒。此日宜祭祀祈福、纳财进宝，忌动土修造。寒露宜保暖防寒，护养肺气。',
  霜降: '霜降寒凝为霜，百草枯黄。此日宜安葬祭祀、收尾总结，忌开业嫁娶。霜降宜温补进补，养护身体。',
  立冬: '立冬万物收藏，冬季开始。此日宜安葬修造、收尾工作，忌开业嫁娶。立冬宜温补肾阳，早睡晚起。',
  小雪: '小雪雪初降，寒气渐盛。此日宜腌制腊味、储存物品，忌动土修造。小雪宜保暖防寒，养精蓄锐。',
  大雪: '大雪纷飞至，银装素裹。此日宜祭祀祈福、宴请会友，忌嫁娶出行。大雪宜进补养身，预防寒病。',
  冬至: '冬至阴极阳生，白昼最短。此日宜祭祀祈福、家庭团聚，忌动土修造。冬至一阳生，是养生进补的最佳时节。',
  小寒: '小寒严冬始，寒气逼人。此日宜静养守成、修心养性，忌嫁娶出行。小寒宜保暖防寒，减少户外活动。',
  大寒: '大寒寒气至极，地冻天寒。此日宜祭祀祈福、年末总结，忌开业嫁娶。大寒之后便是立春，是辞旧迎新的时节。',
};

const purposeYiJi: Record<Purpose, { yi: string[]; ji: string[] }> = {
  wedding: {
    yi: ['嫁娶', '纳采', '订盟', '祈福', '求嗣', '出行', '解除', '裁衣', '合帐', '冠笄'],
    ji: ['破土', '安葬', '开生坟', '合寿木', '伐木', '掘井', '动土', '修造'],
  },
  business: {
    yi: ['开市', '交易', '立券', '挂匾', '纳财', '开仓', '造车器', '出行', '拆卸', '上梁'],
    ji: ['嫁娶', '入宅', '移徙', '安床', '祈福', '探病', '安葬', '行丧'],
  },
  moving: {
    yi: ['入宅', '移徙', '安香', '安床', '裁衣', '交易', '立券', '挂匾', '祭祀', '祈福'],
    ji: ['出行', '远游', '动土', '修造', '破土', '安葬', '行丧', '伐木'],
  },
  construction: {
    yi: ['动土', '修造', '起基', '竖柱', '上梁', '造屋', '开池', '开厕', '作灶', '放水'],
    ji: ['安床', '祈福', '嫁娶', '入宅', '安葬', '出行', '开市', '立券'],
  },
};

interface DayDetail {
  date: string;
  dayStem: string;
  dayBranch: string;
  jianchu: string;
  dayType: string;
  ershiba: string;
  isHuangdao: boolean;
  chongAnimal: string;
  yi?: string[];
  ji?: string[];
}

interface ZeriAnalysis {
  dayDetail: DayDetail;
  lunarInfo: string;
  yiWithExplains: { name: string; explain: string }[];
  jiWithExplains: { name: string; explain: string }[];
  chongInfo: string;
  shaInfo: string;
  jianchuAnalysis: string;
  ershibaAnalysis: string;
  luckyGods: string[];
  unluckyGods: string[];
  taishen: string;
  solarTerm: string;
  solarTermDetail: string;
  recommendation: string;
  purposeAnalysis: string;
}

export default function ZeriPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [purpose, setPurpose] = useState<Purpose>('wedding');
  const [days, setDays] = useState<DayDetail[]>([]);
  const [selectedDays, setSelectedDays] = useState<DayDetail[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'calendar' | 'select'>('calendar');
  const [activeTab, setActiveTab] = useState<number>(0);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [analysis, setAnalysis] = useState<ZeriAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { key: 'detail', label: '黄历详情' },
    { key: 'yiji', label: '宜忌详解' },
    { key: 'jianchu', label: '建除十二神' },
    { key: 'ershiba', label: '二十八宿' },
    { key: 'wedding', label: '婚嫁择日' },
    { key: 'business', label: '开业择日' },
    { key: 'moving', label: '搬家择日' },
    { key: 'construction', label: '动土择日' },
  ];

  const loadCalendar = async () => {
    setLoading(true);
    try {
      const r = await api.post('/api/zeri/calendar', { year, month });
      const arr = Array.isArray(r.data) ? r.data : (r.data?.days || []);
      setDays(arr);
    } catch (e) { setDays([]); } finally { setLoading(false); }
  };

  const loadSelect = async () => {
    setLoading(true);
    try {
      const r = await api.post('/api/zeri/select', { year, month, purpose });
      const arr = Array.isArray(r.data) ? r.data : (r.data?.days || []);
      setSelectedDays(arr);
    } catch (e) { setSelectedDays([]); } finally { setLoading(false); }
  };

  useEffect(() => { loadCalendar(); }, [year, month]);
  useEffect(() => { if (mode === 'select') loadSelect(); }, [year, month, purpose, mode]);

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevMonth = () => { if (month === 1) { setYear(year - 1); setMonth(12); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 12) { setYear(year + 1); setMonth(1); } else setMonth(month + 1); };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getDateStr = (d: number) =>
    `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const loadDayAnalysis = (day: DayDetail) => {
    setSelectedDay(day);

    const dIdx = (new Date(day.date).getDate() || 1) - 1;
    const lunarMonthNames = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','腊月'];
    const lunarDayNames = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
    const lunarDayIdx = ((month + year * 12 + dIdx) % 30 + 30) % 30;
    const lunarMonthIdx = ((month - 1 + 12) % 12);
    const solarTerm = solarTerms.find((st) => st.month === month && Math.abs(st.day - new Date(day.date).getDate()) <= 1);

    const yiList = (day.yi && day.yi.length > 0) ? day.yi : ['祭祀','祈福','出行','嫁娶','入宅'];
    const jiList = (day.ji && day.ji.length > 0) ? day.ji : ['动土','安葬','破土','诉讼','伐木'];

    const recHead = day.isHuangdao
      ? `今日为${day.dayType}，建除值${day.jianchu}日，二十八宿${day.ershiba}值日，日干支${day.dayStem}${day.dayBranch}。`
      : `今日为${day.dayType}，建除值${day.jianchu}日，二十八宿${day.ershiba}值日，气场较为不利。`;
    const recBody = day.isHuangdao
      ? `综合各方面因素，${day.jianchu}日为${day.jianchu === '成' || day.jianchu === '开' ? '大吉之日' : day.jianchu === '定' || day.jianchu === '满' ? '中吉之日' : '有吉有平之日'}，适合安排重要活动。今日气场${day.jianchu === '建' || day.jianchu === '开' ? '开放通达' : day.jianchu === '成' || day.jianchu === '定' ? '稳定有力' : '平和中正'}，建议根据具体事宜选择合适时辰行事。行事时宜面向${['东','东南','南','西南','西','西北','北','东北'][(month + new Date(day.date).getDate()) % 8]}方，可得天时之助。同时注意${day.jianchu === '破' || day.jianchu === '危' ? '谨慎行事，避免冒险' : '保持谦虚，不骄不躁'}。吉神${luckyGodsByJianchu[day.jianchu]?.join('、') || '天德'}临位，可得庇佑。`
      : `综合各方面因素，${day.jianchu}日气场较为不利，建议避免安排重大事项。今日宜静不宜动，宜低调行事、修身养性。若确有不得已之事，建议选在${['辰时（7-9点）','巳时（9-11点）','午时（11-13点）','未时（13-15点）'][month % 4]}阳气充足之时处理，并注意${unluckyGodsByJianchu[day.jianchu]?.slice(0, 2).join('、') || '月破、大耗'}等凶神的影响。也可通过祭祀祈福、行善积德等方式化解不利气场。切记今日${day.jianchu === '破' ? '万事不宜操之过急' : day.jianchu === '危' ? '安全第一，避免冒险' : '保守为上，等气场转好再行大事'}。`;

    setAnalysis({
      dayDetail: day,
      lunarInfo: `${lunarMonthNames[lunarMonthIdx]}${lunarDayNames[lunarDayIdx]}`,
      yiWithExplains: yiList.map((y) => ({ name: y, explain: yiExplains[y] || `${y}为传统择日通用宜项，此日气场有利于此活动。` })),
      jiWithExplains: jiList.map((j) => ({ name: j, explain: jiExplains[j] || `${j}为传统择日通用忌项，此日气场不利于此活动。` })),
      chongInfo: chongExplains[day.chongAnimal] || `此日冲${day.chongAnimal}，属${day.chongAnimal}之人今日需谨慎行事。`,
      shaInfo: (day as any).sha || '煞方需避之',
      jianchuAnalysis: jianchuDetailed[day.jianchu] || `建除十二神之${day.jianchu}日，需结合其他因素综合判断。`,
      ershibaAnalysis: ershibaDetailed[day.ershiba] || `二十八宿之${day.ershiba}值日，需综合判断其吉凶。`,
      luckyGods: luckyGodsByJianchu[day.jianchu] || ['天德','月德'],
      unluckyGods: unluckyGodsByJianchu[day.jianchu] || ['月破','大耗'],
      taishen: taishenLocations[(new Date(day.date).getDate() + month * 3) % 12],
      solarTerm: solarTerm ? solarTerm.name : '',
      solarTermDetail: solarTerm ? (solarTermDetails[solarTerm.name] || '') : '',
      recommendation: recHead + recBody,
      purposeAnalysis: day.isHuangdao
        ? `${day.jianchu}日，二十八宿${day.ershiba}值日，日干支${day.dayStem}${day.dayBranch}，冲${day.chongAnimal}。此日${day.dayType}，适合进行${purposes.find(p => p.key === purpose)?.label}相关事宜。`
        : `${day.jianchu}日为黑道日，二十八宿${day.ershiba}值日。此日气场不利，建议避开此日进行重要事项。`,
    });
  };

  const handleExportPdf = async () => {
    if (!analysis?.dayDetail || !reportRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
    const el = reportRef.current;
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#0a0a0f' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    let left = h;
    let pos = 0;
    pdf.addImage(imgData, 'PNG', 0, pos, w, h);
    left -= pdf.internal.pageSize.getHeight();
    while (left > 0) {
      pos = left - h;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, pos, w, h);
      left -= pdf.internal.pageSize.getHeight();
    }
    const d = analysis.dayDetail;
    pdf.save(`择日分析_${d.date}.pdf`);
  };

  const renderCalendarGrid = () => {
    const cells: React.ReactNode[] = [];
    const todayStr = getDateStr(now.getDate());
    const selectedSet = new Set(selectedDays.map(d => d.date));

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`e${i}`} className="h-12 sm:h-14" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = getDateStr(d);
      const dayInfo = days.find(day => day.date === dateStr);
      const isHuangdao = dayInfo?.isHuangdao ?? false;
      const isSelected = selectedSet.has(dateStr);
      const isToday = dateStr === todayStr;
      const isCurrentSelected = selectedDay?.date === dateStr;

      cells.push(
        <div key={dateStr}
          onClick={() => dayInfo && loadDayAnalysis(dayInfo)}
          className={`h-12 sm:h-14 rounded-md text-center flex flex-col items-center justify-center cursor-pointer border transition-all ${
            isToday ? 'ring-1 ring-xuan-gold' : ''
          } ${isCurrentSelected ? 'ring-2 ring-xuan-cyan' : ''} ${
            isSelected ? 'bg-xuan-gold/20 border-xuan-gold text-xuan-gold font-bold' :
            dayInfo && isHuangdao ? 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50' :
            dayInfo && !isHuangdao ? 'bg-red-500/5 border-xuan-border hover:border-red-500/30' :
            'bg-xuan-dark/30 border-xuan-border/30 text-xuan-muted cursor-default'
          }`}
          title={dayInfo ? `${dayInfo.jianchu} ${dayInfo.dayType} ${dayInfo.ershiba}` : ''}>
          {dayInfo ? (
            <>
              <span className="text-xs font-medium">{d}</span>
              <span className="text-[9px] leading-tight font-chinese">{dayInfo.dayStem}{dayInfo.dayBranch}</span>
              <span className={`text-[9px] leading-tight font-chinese ${isHuangdao ? 'text-emerald-400' : 'text-red-400'}`}>
                {dayInfo.jianchu}
              </span>
            </>
          ) : (
            <span className="text-xs text-xuan-muted">{d}</span>
          )}
        </div>
      );
    }
    return cells;
  };

  const renderDetailTab = () => {
    if (!analysis) return (
      <div className="text-center text-xuan-muted font-chinese py-8">
        请在日历中选择一天查看详情
      </div>
    );
    const d = analysis.dayDetail;
    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-chinese font-bold text-xuan-gold">{d.date}</h3>
            <p className="text-sm text-xuan-silver font-chinese">
              {d.dayStem}{d.dayBranch}日 · {d.dayType} · {analysis.lunarInfo}
            </p>
          </div>
          <button onClick={handleExportPdf}
            className="px-4 py-2 text-xs font-chinese border border-xuan-gold/30 text-xuan-gold rounded-lg hover:bg-xuan-gold/10 transition-all">
            导出报告
          </button>
        </div>

        {/* Row 1: Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-xuan-dark rounded-lg border border-xuan-border">
            <span className="text-xs text-xuan-muted font-chinese">建除十二神</span>
            <p className="text-sm text-emerald-400 font-chinese font-bold mt-1">{d.jianchu}</p>
          </div>
          <div className="p-3 bg-xuan-dark rounded-lg border border-xuan-border">
            <span className="text-xs text-xuan-muted font-chinese">二十八宿</span>
            <p className="text-sm text-xuan-cyan font-chinese font-bold mt-1">{d.ershiba}</p>
          </div>
          <div className="p-3 bg-xuan-dark rounded-lg border border-xuan-border">
            <span className="text-xs text-xuan-muted font-chinese">冲煞</span>
            <p className="text-sm text-red-400 font-chinese font-bold mt-1">冲{d.chongAnimal}</p>
          </div>
          <div className="p-3 bg-xuan-dark rounded-lg border border-xuan-border">
            <span className="text-xs text-xuan-muted font-chinese">日类型</span>
            <p className={`text-sm font-chinese font-bold mt-1 ${d.isHuangdao ? 'text-emerald-400' : 'text-red-400'}`}>
              {d.isHuangdao ? '黄道吉日' : '黑道日'}
            </p>
          </div>
        </div>

        {/* 农历信息 */}
        <div className="p-4 bg-xuan-gold/5 rounded-lg border border-xuan-gold/20">
          <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-2">农历信息</h4>
          <p className="text-sm text-xuan-silver font-chinese leading-relaxed">
            农历日期为<strong className="text-xuan-gold">{analysis.lunarInfo}</strong>，日干支为<strong className="text-xuan-gold">{d.dayStem}{d.dayBranch}</strong>。
            天干<strong>{d.dayStem}</strong>属{['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'].indexOf(d.dayStem) % 2 === 0 ? '阳' : '阴'}，
            地支<strong>{d.dayBranch}</strong>五行属{['水','土','木','木','土','火','火','土','金','金','土','水'][(['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']).indexOf(d.dayBranch)] || '土'}。
            此日藏干多元，气场{d.isHuangdao ? '和顺通达' : '波折起伏'}。
          </p>
        </div>

        {/* 宜 */}
        <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
          <h4 className="text-sm font-chinese font-bold text-emerald-400 mb-3">宜</h4>
          <div className="space-y-2.5">
            {analysis.yiWithExplains.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 bg-emerald-500/5 rounded-md">
                <span className="text-xs font-chinese font-bold text-emerald-400 whitespace-nowrap mt-0.5 min-w-[3rem]">{item.name}</span>
                <span className="text-xs text-xuan-silver font-chinese leading-relaxed">{item.explain}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 忌 */}
        <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
          <h4 className="text-sm font-chinese font-bold text-red-400 mb-3">忌</h4>
          <div className="space-y-2.5">
            {analysis.jiWithExplains.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 bg-red-500/5 rounded-md">
                <span className="text-xs font-chinese font-bold text-red-400 whitespace-nowrap mt-0.5 min-w-[3rem]">{item.name}</span>
                <span className="text-xs text-xuan-silver font-chinese leading-relaxed">{item.explain}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 冲煞 */}
        <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/30">
          <h4 className="text-sm font-chinese font-bold text-red-400 mb-2">冲煞</h4>
          <div className="space-y-2">
            <p className="text-xs text-xuan-silver font-chinese leading-relaxed">{analysis.chongInfo}</p>
            <p className="text-xs text-xuan-muted font-chinese leading-relaxed">{analysis.shaInfo}</p>
          </div>
        </div>

        {/* 建除十二神详解 */}
        <div className="p-4 bg-xuan-gold/5 rounded-lg border border-xuan-gold/20">
          <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-2">建除十二神详解：{d.jianchu}日</h4>
          <p className="text-xs text-xuan-silver font-chinese leading-relaxed">{analysis.jianchuAnalysis}</p>
        </div>

        {/* 二十八宿详解 */}
        <div className="p-4 bg-xuan-cyan/5 rounded-lg border border-xuan-cyan/20">
          <h4 className="text-sm font-chinese font-bold text-xuan-cyan mb-2">二十八宿详解：{d.ershiba}</h4>
          <p className="text-xs text-xuan-silver font-chinese leading-relaxed">{analysis.ershibaAnalysis}</p>
        </div>

        {/* 吉神 & 凶神 side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
            <h4 className="text-sm font-chinese font-bold text-emerald-400 mb-2">吉神</h4>
            <div className="flex flex-wrap gap-1.5">
              {analysis.luckyGods.map((g, i) => (
                <span key={i} className="text-xs text-xuan-silver font-chinese bg-emerald-500/10 px-2.5 py-1 rounded-full">{g}</span>
              ))}
            </div>
          </div>
          <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
            <h4 className="text-sm font-chinese font-bold text-red-400 mb-2">凶神</h4>
            <div className="flex flex-wrap gap-1.5">
              {analysis.unluckyGods.map((g, i) => (
                <span key={i} className="text-xs text-xuan-silver font-chinese bg-red-500/10 px-2.5 py-1 rounded-full">{g}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 胎神 */}
        <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
          <h4 className="text-sm font-chinese font-bold text-purple-400 mb-2">胎神</h4>
          <p className="text-xs text-xuan-silver font-chinese leading-relaxed">{analysis.taishen}</p>
        </div>

        {/* 节气 */}
        {analysis.solarTerm && (
          <div className="p-4 bg-xuan-cyan/5 rounded-lg border border-xuan-cyan/30">
            <h4 className="text-sm font-chinese font-bold text-xuan-cyan mb-2">节气：{analysis.solarTerm}</h4>
            <p className="text-xs text-xuan-silver font-chinese leading-relaxed">{analysis.solarTermDetail}</p>
          </div>
        )}

        {/* 综合建议 */}
        <div className="p-5 bg-gradient-to-r from-xuan-gold/10 to-xuan-cyan/10 rounded-lg border border-xuan-gold/30">
          <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-3">综合建议</h4>
          <p className="text-sm text-xuan-silver font-chinese leading-relaxed">{analysis.recommendation}</p>
        </div>
      </div>
    );
  };

  const renderYijiTab = () => {
    const data = purposeYiJi[purpose];
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <span className="text-lg font-chinese font-bold text-xuan-gold">
            {purposes.find(p => p.key === purpose)?.label}宜忌
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
            <div className="text-sm text-emerald-400 font-chinese font-bold mb-3">宜</div>
            <div className="space-y-2">
              {data.yi.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-xuan-silver font-chinese">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
            <div className="text-sm text-red-400 font-chinese font-bold mb-3">忌</div>
            <div className="space-y-2">
              {data.ji.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-xuan-silver font-chinese">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 bg-xuan-dark rounded-lg border border-xuan-border">
          <p className="text-xs text-xuan-muted font-chinese leading-relaxed">
            以上宜忌为通用参考，实际择日还需结合个人八字喜用神、当日干支五行、冲煞方位等因素综合判断。黄道吉日虽诸事皆宜，但并非所有黄道日都适合每一个人，建议结合具体命理信息进行精准择日。
          </p>
        </div>
      </div>
    );
  };

  const renderJianchuTab = () => {
    const currentJianchu = analysis?.dayDetail?.jianchu || '建';
    return (
      <div className="space-y-3">
        <div className="text-center mb-4">
          <span className="text-lg font-chinese font-bold text-xuan-gold">建除十二神详解</span>
        </div>
        {Object.entries(jianchuDetailed).map(([key, explain]) => (
          <div key={key} className={`p-3 rounded-lg border transition-all cursor-pointer ${
            key === currentJianchu ? 'bg-xuan-gold/10 border-xuan-gold/40' : 'bg-xuan-dark border-xuan-border hover:border-xuan-gold/20'
          }`} onClick={() => toggleSection(`jianchu-${key}`)}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-chinese font-bold text-xuan-gold">{key}日</span>
              <svg className={`w-4 h-4 text-xuan-muted transition-transform ${expandedSections[`jianchu-${key}`] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <AnimatePresence>
              {expandedSections[`jianchu-${key}`] && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <p className="text-xs text-xuan-silver font-chinese leading-relaxed mt-2">{explain}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    );
  };

  const renderErshibaTab = () => {
    const currentErshiba = analysis?.dayDetail?.ershiba || '角木蛟';
    return (
      <div className="space-y-3">
        <div className="text-center mb-4">
          <span className="text-lg font-chinese font-bold text-xuan-gold">二十八宿详解</span>
        </div>
        {Object.entries(ershibaDetailed).map(([key, explain]) => (
          <div key={key} className={`p-3 rounded-lg border transition-all cursor-pointer ${
            key === currentErshiba ? 'bg-xuan-cyan/10 border-xuan-cyan/40' : 'bg-xuan-dark border-xuan-border hover:border-xuan-cyan/20'
          }`} onClick={() => toggleSection(`ershiba-${key}`)}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-chinese font-bold text-xuan-cyan">{key}</span>
              <svg className={`w-4 h-4 text-xuan-muted transition-transform ${expandedSections[`ershiba-${key}`] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <AnimatePresence>
              {expandedSections[`ershiba-${key}`] && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <p className="text-xs text-xuan-silver font-chinese leading-relaxed mt-2">{explain}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    );
  };

  const renderPurposeTab = (p: Purpose) => {
    const data = purposeYiJi[p];
    const pLabel = purposes.find(pr => pr.key === p)?.label || '';
    return (
      <div className="space-y-4">
        <div className="text-center mb-2">
          <span className="text-lg font-chinese font-bold text-xuan-gold">{pLabel}择日指南</span>
        </div>
        <div className="p-4 bg-xuan-gold/5 rounded-lg border border-xuan-gold/20">
          <p className="text-sm text-xuan-silver font-chinese leading-relaxed">
            {p === 'wedding' && '嫁娶择日是中国传统婚俗中最重要的环节之一。择日需综合考虑男女双方八字、当日干支、建除十二神、二十八宿、冲煞宜忌等因素。黄道吉日中的成日、开日、定日最为适宜，需避开破日、危日、收日等不宜嫁娶的日子。同时要注意冲煞方位和属相，避免与新郎新娘属相相冲。'}
            {p === 'business' && '开业择日关乎生意兴隆与否。择日应选择黄道吉日中的开日、成日、满日，避开破日、闭日。宜选天德、月德、天德合、月德合等吉神值日，同时结合财神方位和当日五行属性。开业当天的时辰也十分重要，一般选在辰时、巳时等阳气旺盛的时辰。'}
            {p === 'moving' && '搬家入宅择日需考虑家主八字喜用神、当日干支、建除十二神等因素。宜选成日、开日、定日等吉日，避开破日、危日、收日。入宅时辰一般选在上午阳气充足之时，搬家路线宜避开太岁方位，入宅时需先进宅主卧，再依次搬运其他物品。'}
            {p === 'construction' && '动土修造择日关系到家宅平安和工程顺利。宜选黄道吉日中的成日、开日，避开破日、危日。动土方位需避开太岁方和三煞方，施工日期要避开家主和家人属相冲日。动土仪式宜在上午进行，由家主亲自执铲第一锹土，以示诚意。'}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
            <div className="text-sm text-emerald-400 font-chinese font-bold mb-2">宜</div>
            <div className="space-y-1.5">
              {data.yi.map((item, i) => (
                <div key={i} className="text-xs text-xuan-silver font-chinese">• {item}</div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
            <div className="text-sm text-red-400 font-chinese font-bold mb-2">忌</div>
            <div className="space-y-1.5">
              {data.ji.map((item, i) => (
                <div key={i} className="text-xs text-xuan-silver font-chinese">• {item}</div>
              ))}
            </div>
          </div>
        </div>
        {analysis?.dayDetail && (
          <div className="p-4 bg-xuan-dark rounded-lg border border-xuan-border">
            <div className="text-xs text-xuan-gold font-chinese mb-2">当日择日分析</div>
            <p className="text-sm text-xuan-silver font-chinese leading-relaxed">{analysis.purposeAnalysis}</p>
          </div>
        )}
      </div>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 0: return renderDetailTab();
      case 1: return renderYijiTab();
      case 2: return renderJianchuTab();
      case 3: return renderErshibaTab();
      case 4: return renderPurposeTab('wedding');
      case 5: return renderPurposeTab('business');
      case 6: return renderPurposeTab('moving');
      case 7: return renderPurposeTab('construction');
      default: return null;
    }
  };

  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block text-xs tracking-[0.3em] text-xuan-red/70 font-chinese mb-4">择日系统</span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">黄道择日</h1>
            <p className="text-xuan-muted font-chinese">黄道吉日 · 建除十二神 · 二十八宿 · 冲煞宜忌</p>
          </motion.div>

          <div className="flex gap-2 mb-6">
            <button onClick={() => setMode('calendar')}
              className={`flex-1 py-3 text-sm font-chinese rounded-lg border transition-all ${mode === 'calendar' ? 'border-xuan-gold bg-xuan-gold/10 text-xuan-gold' : 'card-xuan text-xuan-muted hover:border-xuan-gold/30'}`}>
              月历视图
            </button>
            <button onClick={() => setMode('select')}
              className={`flex-1 py-3 text-sm font-chinese rounded-lg border transition-all ${mode === 'select' ? 'border-xuan-gold bg-xuan-gold/10 text-xuan-gold' : 'card-xuan text-xuan-muted hover:border-xuan-gold/30'}`}>
              择日推荐
            </button>
          </div>

          {mode === 'select' && (
            <div className="grid grid-cols-4 gap-2 mb-6">
              {purposes.map((p) => (
                <button key={p.key} onClick={() => setPurpose(p.key)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    purpose === p.key ? 'border-xuan-red bg-xuan-red/10 shadow-lg' : 'card-xuan hover:border-xuan-red/30'
                  }`}>
                  <span className="text-xl block mb-1">{p.icon}</span>
                  <span className={`text-xs font-chinese ${purpose === p.key ? 'text-xuan-red' : 'text-xuan-silver'}`}>{p.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth}
              className="px-3 py-1.5 text-sm font-chinese text-xuan-gold border border-xuan-gold/30 rounded hover:bg-xuan-gold/10">
              ◀ 上月
            </button>
            <div className="text-lg font-chinese font-bold text-xuan-gold">{year}年{month}月</div>
            <button onClick={nextMonth}
              className="px-3 py-1.5 text-sm font-chinese text-xuan-gold border border-xuan-gold/30 rounded hover:bg-xuan-gold/10">
              下月 ▶
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {weekNames.map((w) => (
              <div key={w} className="text-center text-xs font-chinese text-xuan-muted py-1">{w}</div>
            ))}
          </div>

          <div ref={calendarRef}>
            {loading && days.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-xuan-gold/30 border-t-xuan-gold rounded-full animate-spin" />
              </div>
            ) : (
              <motion.div key={`${year}-${month}-${mode}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="grid grid-cols-7 gap-0.5 sm:gap-1 card-xuan-gold p-3 sm:p-4">
                {renderCalendarGrid()}
              </motion.div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-xs font-chinese">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-500/40" /><span className="text-emerald-400">黄道吉日</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-red-500/30" /><span className="text-red-400">黑道日</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded ring-1 ring-xuan-gold" /><span className="text-xuan-gold">今日</span>
            </div>
          </div>

          {mode === 'select' && selectedDays.length > 0 && (
            <div className="mt-8 card-xuan-gold p-6">
              <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">
                {purposes.find(p => p.key === purpose)?.label} · {selectedDays.length}个吉日
              </h3>
              <div className="space-y-3">
                {selectedDays.slice(0, 10).map((d: DayDetail) => (
                  <div key={d.date} onClick={() => loadDayAnalysis(d)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all flex-wrap gap-2 ${
                      selectedDay?.date === d.date ? 'bg-xuan-gold/10 border-xuan-gold' : 'bg-xuan-dark border-emerald-500/20 hover:border-emerald-500/40'
                    }`}>
                    <div>
                      <span className="text-sm font-chinese font-bold text-xuan-gold">{d.date}</span>
                      <span className="text-xs text-xuan-muted ml-2">{d.dayStem}{d.dayBranch}日</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-chinese">
                      <span className="text-emerald-400">{d.jianchu}</span>
                      <span className="text-xuan-cyan">{d.ershiba}</span>
                      <span className="text-red-400">冲{d.chongAnimal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode === 'select' && selectedDays.length === 0 && !loading && (
            <div className="mt-8 card-xuan-gold p-6 text-center">
              <p className="text-xuan-muted font-chinese text-sm">
                未找到该月份的{purposes.find(p => p.key === purpose)?.label}吉日，请尝试切换月份或择日类型。
              </p>
            </div>
          )}

          <div className="mt-6 card-xuan p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-chinese">
              {purposes.map((p) => (
                <div key={p.key} className="text-center">
                  <span className="text-xuan-gold font-bold">{p.label}</span>
                  <div className="mt-1 space-y-0.5">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-emerald-400">宜:</span>
                      <span className="text-xuan-silver">{purposeYiJi[p.key].yi.slice(0, 4).join(' ')}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-red-400">忌:</span>
                      <span className="text-xuan-muted">{purposeYiJi[p.key].ji.slice(0, 4).join(' ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex overflow-x-auto gap-1 mb-4 pb-2 scrollbar-hide">
              {tabs.map((tab, i) => (
                <button key={tab.key} onClick={() => setActiveTab(i)}
                  className={`px-4 py-2 text-xs font-chinese whitespace-nowrap rounded-lg border transition-all ${
                    activeTab === i ? 'border-xuan-gold bg-xuan-gold/10 text-xuan-gold' : 'border-xuan-border text-xuan-muted hover:border-xuan-gold/30'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="card-xuan-gold p-6" ref={reportRef}>
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}>
                  {renderActiveTab()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
