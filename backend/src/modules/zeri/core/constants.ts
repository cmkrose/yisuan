export const HEAVENLY_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'] as const;
export const EARTHLY_BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'] as const;

// 建除十二神
export const JIANCHU = ['建','除','满','平','定','执','破','危','成','收','开','闭'] as const;

// 黄道吉日（青龙、明堂、金匮、天德、玉堂、司命）
const HUANGDAO = new Set([1,2,5,6,9,10]); // 青龙明堂金匮天德玉堂司命 对应的建除序号
// 黑道日（天刑、朱雀、白虎、天牢、玄武、勾陈）
const HEIDAO = new Set([3,4,7,8,11,0]);

// 二十八星宿
export const ER_SHI_BA_XIU = [
  { name:'角木蛟', element:'木', fortune:'吉', desc:'角星造作主荣昌' },
  { name:'亢金龙', element:'金', fortune:'凶', desc:'亢星造作长房当' },
  { name:'氐土貉', element:'土', fortune:'吉', desc:'氐星造作主安康' },
  { name:'房日兔', element:'火', fortune:'吉', desc:'房星造作主高强' },
  { name:'心月狐', element:'火', fortune:'凶', desc:'心星造作主凶亡' },
  { name:'尾火虎', element:'火', fortune:'吉', desc:'尾星造作主才良' },
  { name:'箕水豹', element:'水', fortune:'吉', desc:'箕星造作主田庄' },
  { name:'斗木獬', element:'木', fortune:'吉', desc:'斗星造作主文章' },
  { name:'牛金牛', element:'金', fortune:'凶', desc:'牛星造作主灾殃' },
  { name:'女土蝠', element:'土', fortune:'凶', desc:'女星造作主损伤' },
  { name:'虚日鼠', element:'火', fortune:'凶', desc:'虚星造作主孤凄' },
  { name:'危月燕', element:'火', fortune:'凶', desc:'危星造作主灾危' },
  { name:'室火猪', element:'火', fortune:'吉', desc:'室星造作主吉昌' },
  { name:'壁水貐', element:'水', fortune:'吉', desc:'壁星造作主风光' },
  { name:'奎木狼', element:'木', fortune:'吉', desc:'奎星造作主祯祥' },
  { name:'娄金狗', element:'金', fortune:'吉', desc:'娄星造作主丰穰' },
  { name:'胃土雉', element:'土', fortune:'吉', desc:'胃星造作主仓箱' },
  { name:'昴日鸡', element:'火', fortune:'凶', desc:'昴星造作主伤亡' },
  { name:'毕月乌', element:'火', fortune:'吉', desc:'毕星造作主荣光' },
  { name:'觜火猴', element:'火', fortune:'凶', desc:'觜星造作主刑伤' },
  { name:'参水猿', element:'水', fortune:'吉', desc:'参星造作主文章' },
  { name:'井木犴', element:'木', fortune:'吉', desc:'井星造作主田蚕' },
  { name:'鬼金羊', element:'金', fortune:'凶', desc:'鬼星造作主官符' },
  { name:'柳土獐', element:'土', fortune:'凶', desc:'柳星造作主瘟皇' },
  { name:'星日马', element:'火', fortune:'凶', desc:'星宿造作主悲惶' },
  { name:'张月鹿', element:'火', fortune:'吉', desc:'张星造作主荣昌' },
  { name:'翼火蛇', element:'火', fortune:'凶', desc:'翼星造作主刑伤' },
  { name:'轸水蚓', element:'水', fortune:'吉', desc:'轸星造作主文章' },
] as const;

export const SHENG_XIAO = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];

// 宜忌分类模板
export const YI_JI_TEMPLATES: Record<string, { yi: string[]; ji: string[] }> = {
  wedding: { yi: ['嫁娶','纳采','订婚','会亲友'], ji: ['安床','伐木'] },
  business: { yi: ['开业','开市','交易','立契'], ji: ['破土','安葬'] },
  moving: { yi: ['搬家','入宅','迁徙','移徙'], ji: ['破土','安葬'] },
  construction: { yi: ['动土','修造','起基','上梁'], ji: ['嫁娶','入宅'] },
};

export interface DayResult {
  date: string;
  yearStem: string;
  yearBranch: string;
  monthStem: string;
  monthBranch: string;
  dayStem: string;
  dayBranch: string;
  jianchu: string;
  jianchuIndex: number;
  isHuangdao: boolean;
  dayType: string;
  ershiba: string;
  xiuFortune: string;
  chongAnimal: string;
  sha: string;
  yi: string[];
  ji: string[];
}
