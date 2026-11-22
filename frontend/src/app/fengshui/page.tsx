'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { api } from '@/lib/api/client';
import { fengshuiCompass, fengshuiEightMansion, fengshuiFlyingStars, fengshuiYangHouse, fengshuiYinHouse } from '@/lib/engines/fengshui/calculate';
import { yearRangeDesc } from '@/lib/utils/year';
import { STAR_NAMES } from '@/lib/constants/fengshui';
import { ER_SHI_SI_SHAN } from '@/lib/engines/fengshui/constants';
import { BAZHAI_STARS, FEIXING_STARS, FEIXING_COMBOS, FEIXING_COMBO_LEVEL, YANGZHAI_HOUSES, YINZHAI_TOPICS } from '@/lib/data/meanings/fengshui-meanings';
import { calculateHouseMansion, calculateYunFlyingStars } from '@/lib/engines/fengshui/engine';

const HOUSE_SITS = [
  { gua: '坎', label: '坐北（坎）' }, { gua: '坤', label: '坐西南（坤）' },
  { gua: '震', label: '坐东（震）' }, { gua: '巽', label: '坐东南（巽）' },
  { gua: '乾', label: '坐西北（乾）' }, { gua: '兑', label: '坐西（兑）' },
  { gua: '艮', label: '坐东北（艮）' }, { gua: '离', label: '坐南（离）' },
];
const SANYAO_DIRS = [
  { gua: '坎', label: '北（坎）' }, { gua: '艮', label: '东北（艮）' },
  { gua: '震', label: '东（震）' }, { gua: '巽', label: '东南（巽）' },
  { gua: '离', label: '南（离）' }, { gua: '坤', label: '西南（坤）' },
  { gua: '兑', label: '西（兑）' }, { gua: '乾', label: '西北（乾）' },
];
const BAGUA_ELEMENT: Record<string, string> = { 坎: '水', 离: '火', 震: '木', 巽: '木', 乾: '金', 兑: '金', 艮: '土', 坤: '土' };
const BAZHAI_REMEDY: Record<string, string> = {
  绝命: '宜作厕所/储物，置六帝钱或金属物化解。',
  五鬼: '宜静置，放铜葫芦/五帝钱，忌红色与火。',
  六煞: '宜作卫浴，置黑/蓝色物，忌作主卧。',
  祸害: '宜储物，放绿植或水晶，忌作大门/办公位。',
};
const SITTING_TIPS: Record<string, string> = {
  坎: '坐北水，宜背后有靠、向首开阔；忌低洼积水与门冲。',
  离: '坐南火，宜向首明亮；忌北风直灌、背后空虚。',
  震: '坐东木，宜东侧实、西侧有缓冲；忌西晒与尖角逼压。',
  巽: '坐东南木，宜文昌位清净；忌西北金气重压、门冲。',
  乾: '坐西北金，宜厚重有靠；忌东南尖角冲射、低陷。',
  兑: '坐西金，宜水木调和；忌声煞、金属尖角冲门。',
  艮: '坐东北土，宜背后有靠、气止而稳；忌西南高楼逼压。',
  坤: '坐西南土，宜低平见水；忌东北高塔压向、积水。',
};
const YIN_DIR_TO_GUA: Record<string, string> = {
  坐北朝南: '坎', 坐南朝北: '离', 坐东朝西: '震', 坐西朝东: '兑',
  坐西北朝东南: '乾', 坐西南朝东北: '坤', 坐东北朝西南: '艮', 坐东南朝西北: '巽',
};
const yunOf = (year: number) => ((Math.floor((year - 1864) / 20) % 9) + 9) % 9 + 1;
const findHouseDir = (house: any, gua: string) =>
  [...(house?.favorableDirections || []), ...(house?.unfavorableDirections || [])].find((d: any) => d.direction === gua);
const buildSanYao = (house: any, door: string, bed: string, stove: string) => [
  { label: '大门', gua: door, entry: findHouseDir(house, door) },
  { label: '主卧', gua: bed, entry: findHouseDir(house, bed) },
  { label: '灶台', gua: stove, entry: findHouseDir(house, stove) },
];
const yinTopicTip = (k: string, loc: string, dir: string, gua: string, wm: any) => {
  if (k === '龙') return loc === '山区' ? '看主山来势、过峡束气与少祖山，忌直硬断裂。' : loc === '平原' ? '平原以水为龙、以路为龙，看水/路屈曲环抱与来去。' : '水边以来水与岸线为龙，看水势环抱，忌直冲反弓。';
  if (k === '穴') return loc === '山区' ? '宜藏风聚气、龙虎环抱，避凹风与水浸。' : loc === '平原' ? '平原高一寸为山、低一寸为水，选高燥聚气处。' : '水边选高燥不被淹处，避水口直冲与蚁患。';
  if (k === '砂') return loc === '山区' ? '看左右龙虎砂高低与有情无情，忌尖射破碎。' : loc === '平原' ? '以林带、建筑、土坡为砂，宜环抱忌逼压。' : '以堤岸、护林为砂，宜回护忌缺口直泄。';
  if (k === '水') return loc === '山区' ? '看溪流屈曲环抱、去水关锁，忌直冲切割。' : loc === '平原' ? '看沟渠/道路环抱，忌反弓与直射。' : '看来水屈曲、去水盘旋，忌湍急直出。';
  if (k === '向') return `坐向${dir}，坐${gua}宅属${BAGUA_ELEMENT[gua]}；${SITTING_TIPS[gua]}`;
  if (k === '明堂') return loc === '山区' ? '明堂宜平整开阔、略聚水，忌倾倒破碎。' : loc === '平原' ? '明堂宜低平聚水、无遮挡，忌坑洼尖射。' : '明堂宜高出水位、平展开阔，忌水漫与逼窄。';
  if (k === '水口') return wm ? `水口宜去${wm.bad.join('、')}（凶方），忌去${wm.good.join('、')}（吉方）；去水宜盘旋关锁，忌直射。` : '水口宜关锁盘旋，忌直射开阔。';
  return '';
};


type TabKey = 'compass' | 'bazhai' | 'feixing' | 'yanghouse' | 'yinhouse';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'compass', label: '罗盘', icon: '🧭' },
  { key: 'bazhai', label: '八宅', icon: '宅' },
  { key: 'feixing', label: '飞星', icon: '★' },
  { key: 'yanghouse', label: '阳宅', icon: '☀' },
  { key: 'yinhouse', label: '阴宅', icon: '🌙' },
];

const starColors: Record<number, string> = {
  1: 'from-cyan-500/20 border-cyan-500/40 text-cyan-400',
  2: 'from-gray-500/20 border-gray-500/40 text-gray-400',
  3: 'from-emerald-500/20 border-emerald-500/40 text-emerald-400',
  4: 'from-green-500/20 border-green-500/40 text-green-400',
  5: 'from-yellow-500/20 border-yellow-500/40 text-yellow-400',
  6: 'from-slate-400/20 border-slate-400/40 text-slate-300',
  7: 'from-red-500/20 border-red-500/40 text-red-400',
  8: 'from-amber-500/20 border-amber-500/40 text-amber-400',
  9: 'from-purple-500/20 border-purple-500/40 text-purple-400',
};

export default function FengshuiPage() {
  const [tab, setTab] = useState<TabKey>('compass');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [compassData, setCompassData] = useState<any[]>([]);

  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startAngleRef = useRef(0);
  const startRotationRef = useRef(0);
  const compassContainerRef = useRef<HTMLDivElement>(null);

  const [followState, setFollowState] = useState<'idle' | 'pending' | 'active' | 'no-event' | 'denied' | 'unsupported'>('idle');
  const [followMsg, setFollowMsg] = useState('');
  const [followSupported, setFollowSupported] = useState(true);
  const followHeadingRef = useRef(0);
  const gotOrientationRef = useRef(false);
  const followTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const followListening = followState === 'pending' || followState === 'active';

  useEffect(() => { try { const data: any = fengshuiCompass(); setCompassData(data?.mountains); } catch {} }, []);

  useEffect(() => {
    const hasRel = typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
    const hasAbs = typeof window !== 'undefined' && 'ondeviceorientationabsolute' in window;
    setFollowSupported(hasRel || hasAbs);
    return () => { if (followTimerRef.current) clearTimeout(followTimerRef.current); };
  }, []);

  // 方向事件双通道：deviceorientation 与 deviceorientationabsolute 任一有数据即进入跟随。
  useEffect(() => {
    if (!followListening) return;
    const onOrientation = (evt: Event) => {
      const e = evt as any;
      let target: number | null = null;
      if (typeof e.webkitCompassHeading === 'number') target = e.webkitCompassHeading;
      else if (typeof e.alpha === 'number') target = (360 - e.alpha + 360) % 360;
      if (target === null) return;
      gotOrientationRef.current = true;
      if (followTimerRef.current) { clearTimeout(followTimerRef.current); followTimerRef.current = null; }
      setFollowState('active');
      const prev = followHeadingRef.current;
      const delta = ((target - prev + 540) % 360) - 180;
      const next = (prev + delta * 0.2 + 360) % 360;
      followHeadingRef.current = next;
      rotationRef.current = next;
      setRotation(next);
    };
    window.addEventListener('deviceorientation', onOrientation);
    window.addEventListener('deviceorientationabsolute' as any, onOrientation as any);
    return () => {
      window.removeEventListener('deviceorientation', onOrientation);
      window.removeEventListener('deviceorientationabsolute' as any, onOrientation as any);
    };
  }, [followListening]);

  const calcAngle = (clientX: number, clientY: number) => {
    const container = compassContainerRef.current;
    if (!container) return 0;
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  };

  const applyDrag = (clientX: number, clientY: number) => {
    let delta = calcAngle(clientX, clientY) - startAngleRef.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const newRotation = ((startRotationRef.current + delta) % 360 + 360) % 360;
    rotationRef.current = newRotation;
    setRotation(newRotation);
  };

  const handleCompassPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (followState === 'active') return;
    isDraggingRef.current = true;
    startAngleRef.current = calcAngle(e.clientX, e.clientY);
    startRotationRef.current = rotationRef.current;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    e.preventDefault();
  };

  const handleCompassPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || followState === 'active') return;
    applyDrag(e.clientX, e.clientY);
  };

  const endCompassDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
  };

  // Touch Events 兜底（微信 X5 等 Pointer Events 不完整的内核）。
  useEffect(() => {
    const container = compassContainerRef.current;
    if (!container) return;
    const onStart = (e: TouchEvent) => {
      if (followState === 'active') return;
      const t = e.touches[0];
      if (!t) return;
      isDraggingRef.current = true;
      startAngleRef.current = calcAngle(t.clientX, t.clientY);
      startRotationRef.current = rotationRef.current;
      e.preventDefault();
    };
    const onMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || followState === 'active') return;
      const t = e.touches[0];
      if (!t) return;
      applyDrag(t.clientX, t.clientY);
      e.preventDefault();
    };
    const onEnd = () => { isDraggingRef.current = false; };
    container.addEventListener('touchstart', onStart, { passive: false });
    container.addEventListener('touchmove', onMove, { passive: false });
    container.addEventListener('touchend', onEnd);
    container.addEventListener('touchcancel', onEnd);
    return () => {
      container.removeEventListener('touchstart', onStart);
      container.removeEventListener('touchmove', onMove);
      container.removeEventListener('touchend', onEnd);
      container.removeEventListener('touchcancel', onEnd);
    };
  }, [followState]);

  const stopFollow = () => {
    if (followTimerRef.current) { clearTimeout(followTimerRef.current); followTimerRef.current = null; }
    setFollowState('idle');
    setFollowMsg('');
  };

  const toggleFollow = async () => {
    if (followState === 'active' || followState === 'pending') { stopFollow(); return; }
    const hasRel = typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
    const hasAbs = typeof window !== 'undefined' && 'ondeviceorientationabsolute' in window;
    if (!hasRel && !hasAbs) {
      setFollowState('unsupported');
      setFollowMsg('当前环境不支持方向传感器事件，请直接拖动转盘手动对山。');
      return;
    }
    try {
      const anyDOE = (window as any).DeviceOrientationEvent;
      if (anyDOE && typeof anyDOE.requestPermission === 'function') {
        const res = await Promise.race([
          anyDOE.requestPermission(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('permission-timeout')), 3000)),
        ]);
        if (res !== 'granted') {
          setFollowState('denied');
          setFollowMsg('方向权限被拒绝。请在浏览器/系统设置中允许「运动与方向」权限后重试；也可直接拖动转盘手动对山。');
          return;
        }
      }
    } catch {
      setFollowState('denied');
      setFollowMsg('方向权限申请超时或被拒绝。请在浏览器/系统设置中允许「运动与方向」权限后重试；也可直接拖动转盘手动对山。');
      return;
    }
    gotOrientationRef.current = false;
    followHeadingRef.current = rotationRef.current;
    setFollowState('pending');
    setFollowMsg('正在等待方向传感器…');
    if (followTimerRef.current) clearTimeout(followTimerRef.current);
    followTimerRef.current = setTimeout(() => {
      if (!gotOrientationRef.current) {
        setFollowState('no-event');
        setFollowMsg('3 秒内未收到方向事件。当前环境可能限制了方向传感器（微信内置浏览器常见）。可点右上角 ··· 选择「在浏览器打开」再试；也可以直接拖动转盘手动对山。');
      }
    }, 3000);
  };

  const followStatusText = !followSupported
    ? '当前环境不支持方向传感器事件，请直接拖动转盘手动对山。'
    : followState === 'active'
      ? `跟随中：${Math.round(rotation)}°（拖动已暂停）`
      : followState === 'pending'
        ? '正在等待方向传感器…'
        : followState === 'no-event' || followState === 'denied' || followState === 'unsupported'
          ? followMsg
          : '点「跟随方向」后，罗盘会跟着手机转；也可以直接拖动转盘手动对山。';

  const [bazhai, setBazhai] = useState({ birthYear: 1990, gender: 'male' as 'male' | 'female', houseGua: '坎', doorGua: '离', bedGua: '震', stoveGua: '兑' });
  const runBazhai = async () => {
    setLoading(true);
    try {
      const base: any = fengshuiEightMansion({ birthYear: bazhai.birthYear, gender: bazhai.gender });
      const house = calculateHouseMansion(bazhai.houseGua);
      setResult({
        type: 'bazhai',
        data: {
          ...base, houseGua: bazhai.houseGua, houseMansion: house,
          match: base.isEastFour === house.isEastFour,
          sanYao: buildSanYao(house, bazhai.doorGua, bazhai.bedGua, bazhai.stoveGua),
        },
      });
    } catch (e) {} finally { setLoading(false); }
  };

  const [fsYear, setFsYear] = useState(new Date().getFullYear());
  const [fsBuildYear, setFsBuildYear] = useState(new Date().getFullYear());
  const runFeixing = async () => {
    setLoading(true);
    try {
      const base: any = fengshuiFlyingStars({ year: Number(fsYear) });
      const yun = yunOf(Number(fsBuildYear));
      const yunStars = calculateYunFlyingStars(yun);
      setResult({ type: 'feixing', data: { ...base, buildYear: Number(fsBuildYear), yun, yunStars } });
    } catch (e) {} finally { setLoading(false); }
  };

  const [yangHouse, setYangHouse] = useState({ facing: '子', year: new Date().getFullYear(), doorGua: '离', bedGua: '震', stoveGua: '兑' });
  const runYangHouse = async () => {
    setLoading(true);
    try {
      const base: any = fengshuiYangHouse({ facing: yangHouse.facing, year: Number(yangHouse.year) });
      const yun = yunOf(Number(yangHouse.year));
      const yunStars = calculateYunFlyingStars(yun);
      const sanYao = base.bazhai ? buildSanYao(base.bazhai, yangHouse.doorGua, yangHouse.bedGua, yangHouse.stoveGua) : [];
      setResult({ type: 'yanghouse', data: { ...base, sanYao, yun, yunStars } });
    } catch (e) {} finally { setLoading(false); }
  };

  const [yinHouse, setYinHouse] = useState({ location: '山区', direction: '坐北朝南' });
  const runYinHouse = async () => {
    setLoading(true);
    try {
      const base: any = fengshuiYinHouse({ location: yinHouse.location, direction: yinHouse.direction });
      const sittingGua = YIN_DIR_TO_GUA[base.direction] || '坎';
      const baz = calculateHouseMansion(sittingGua);
      const good = baz.favorableDirections.map((d: any) => d.direction);
      const bad = baz.unfavorableDirections.map((d: any) => d.direction);
      setResult({ type: 'yinhouse', data: { ...base, sittingGua, bazhai: baz, waterMouth: { good, bad } } });
    } catch (e) {} finally { setLoading(false); }
  };

  const compassRadius = 140;
  const topMountainIndex = compassData.length ? Math.round(((360 - (rotation % 360)) % 360) / 15) % 24 : 0;

  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block text-xs tracking-[0.3em] text-xuan-jade/70 font-chinese mb-4">风水系统</span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">风水堪舆</h1>
            <p className="text-xuan-muted font-chinese">罗盘 · 八宅 · 飞星 · 阳宅 · 阴宅</p>
          </motion.div>

          <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-5 gap-3 mb-8">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => { setTab(t.key); setResult(null); }}
                className={`p-4 rounded-xl border text-center transition-all ${
                  tab === t.key ? 'border-xuan-jade bg-xuan-jade/10 shadow-lg shadow-xuan-jade/10' : 'card-xuan hover:border-xuan-jade/30'
                }`}>
                <span className="text-2xl sm:text-3xl block mb-1">{t.icon}</span>
                <span className={`text-xs sm:text-sm font-chinese ${tab === t.key ? 'text-xuan-jade' : 'text-xuan-silver'}`}>{t.label}</span>
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {tab === 'compass' && (
              <motion.div key="compass" initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8 flex flex-col items-center">
                  <h3 className="text-xl font-chinese font-bold text-xuan-gold mb-6">二十四山罗盘</h3>
                  <div
                    ref={compassContainerRef}
                    onPointerDown={handleCompassPointerDown}
                    onPointerMove={handleCompassPointerMove}
                    onPointerUp={endCompassDrag}
                    onPointerCancel={endCompassDrag}
                    className={`relative select-none ${followState === 'active' ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
                    style={{ width: compassRadius * 2 + 60, height: compassRadius * 2 + 60, touchAction: 'none' }}
                  >
                    <svg width={compassRadius * 2 + 60} height={compassRadius * 2 + 60} viewBox={`0 0 ${compassRadius * 2 + 60} ${compassRadius * 2 + 60}`} style={{ pointerEvents: 'none' }}>
                      <defs><filter id="glow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
                      <g transform={`translate(${compassRadius + 30}, 16)`}>
                        <polygon points="-12,0 12,0 0,18" fill="#d4a853" filter="url(#glow)" />
                        <line x1="-30" y1="18" x2="30" y2="18" stroke="#d4a853" strokeWidth="1.5" />
                      </g>
                      <g transform={`translate(${compassRadius + 30}, ${compassRadius + 30}) rotate(${rotation})`}>
                        <circle r={compassRadius + 15} fill="none" stroke="rgba(212,168,83,0.3)" strokeWidth="2" />
                        <circle r={compassRadius + 3} fill="none" stroke="rgba(212,168,83,0.5)" strokeWidth="1.5" />
                        <circle r={compassRadius - 20} fill="none" stroke="rgba(212,168,83,0.2)" strokeWidth="1" />
                        <circle r={compassRadius - 50} fill="rgba(10,10,15,0.9)" stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
                        {compassData.map((m, i) => {
                          const rad = ((i * 15 - 90) * Math.PI) / 180;
                          const x1 = Math.cos(rad) * (compassRadius - 5);
                          const y1 = Math.sin(rad) * (compassRadius - 5);
                          const x2 = Math.cos(rad) * (compassRadius - 25);
                          const y2 = Math.sin(rad) * (compassRadius - 25);
                          const tx = Math.cos(rad) * (compassRadius - 40);
                          const ty = Math.sin(rad) * (compassRadius - 40);
                          const isCardinal = i % 6 === 0;
                          return (
                            <g key={i}>
                              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={isCardinal ? 'rgba(212,168,83,0.6)' : 'rgba(212,168,83,0.2)'} strokeWidth={isCardinal ? 1.5 : 0.5} />
                              <text x={tx} y={ty} textAnchor="middle" dominantBaseline="central" fill={isCardinal ? '#d4a853' : 'rgba(156,163,175,0.7)'} fontSize={isCardinal ? 11 : 8} fontFamily="serif">{m.name}</text>
                            </g>
                          );
                        })}
                        <circle r={12} fill="rgba(212,168,83,0.1)" stroke="#d4a853" strokeWidth="1" />
                        <text x="0" y="-2" textAnchor="middle" dominantBaseline="central" fill="#d4a853" fontSize="12" fontFamily="serif">☯</text>
                        <line x1={0} y1={-compassRadius + 50} x2={0} y2={compassRadius - 50} stroke="rgba(212,168,83,0.1)" strokeWidth="0.5" />
                        <line x1={-compassRadius + 50} y1={0} x2={compassRadius - 50} y2={0} stroke="rgba(212,168,83,0.1)" strokeWidth="0.5" />
                      </g>
                    </svg>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-2xl font-chinese font-bold text-xuan-gold">
                      {Math.round(rotation)}° · {compassData[topMountainIndex]?.name ?? '—'}山
                    </div>
                    <div className="text-xs text-xuan-muted font-chinese">
                      {compassData[topMountainIndex]?.element ?? '—'} · 拖动罗盘调整朝向
                    </div>
                    <div className="mt-3 flex flex-col items-center gap-1">
                      <button type="button" onClick={toggleFollow} disabled={!followSupported}
                        className={`px-4 py-2 rounded-lg text-sm border font-chinese transition-all ${followState === 'active' || followState === 'pending' ? 'border-xuan-jade bg-xuan-jade/10 text-xuan-jade' : 'border-xuan-border text-xuan-silver hover:border-xuan-jade/30'} ${!followSupported ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {followState === 'active' || followState === 'pending' ? '停止跟随' : '跟随方向'}
                      </button>
                      <div className={`text-[11px] font-chinese ${followState === 'no-event' || followState === 'denied' || followState === 'unsupported' ? 'text-amber-300' : 'text-xuan-muted'}`}>
                        {followStatusText}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 w-full max-w-lg">
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
                      {compassData.map((m, i) => (
                        <div key={i} className="text-center p-1.5 bg-xuan-dark rounded border border-xuan-border">
                          <div className="text-xs font-chinese text-xuan-gold">{m.name}</div>
                          <div className="text-[10px] text-xuan-muted">{m.element}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === 'bazhai' && (
              <motion.div key="bazhai" initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8 mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">出生年份</label>
                      <select value={bazhai.birthYear} onChange={e => setBazhai({...bazhai, birthYear: Number(e.target.value)})}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {yearRangeDesc().map(y=><option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">性别</label>
                      <div className="flex gap-2">
                        {[{v:'male',l:'男'},{v:'female',l:'女'}].map(o=>(
                          <button key={o.v} onClick={()=>setBazhai({...bazhai,gender:o.v as any})}
                            className={`flex-1 py-3 rounded-lg text-sm border ${bazhai.gender===o.v?'border-xuan-jade bg-xuan-jade/10 text-xuan-jade':'border-xuan-border text-xuan-muted hover:border-xuan-jade/30'}`}>{o.l}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">宅坐向</label>
                      <select value={bazhai.houseGua} onChange={e => setBazhai({ ...bazhai, houseGua: e.target.value })}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {HOUSE_SITS.map(s => <option key={s.gua} value={s.gua}>{s.label}</option>)}
                      </select>
                    </div>
                    {[{ k: 'doorGua', l: '大门方位' }, { k: 'bedGua', l: '主卧方位' }, { k: 'stoveGua', l: '灶台方位' }].map((f) => (
                      <div key={f.k}>
                        <label className="text-xs text-xuan-muted font-chinese mb-1 block">{f.l}</label>
                        <select value={(bazhai as any)[f.k]} onChange={e => setBazhai({ ...bazhai, [f.k]: e.target.value })}
                          className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                          {SANYAO_DIRS.map(s => <option key={s.gua} value={s.gua}>{s.label}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <button onClick={runBazhai} disabled={loading} className="w-full btn-gold py-4 text-lg font-chinese disabled:opacity-50">
                    {loading ? '计算中...' : '计算命卦与宅配'}
                  </button>
                </div>
                {result?.type === 'bazhai' && (
                  <div className="space-y-4">
                    <div className="card-xuan-gold p-6 text-center">
                      <div className="flex flex-wrap items-end justify-center gap-4">
                        <div>
                          <div className="text-4xl font-chinese font-bold text-xuan-gold mb-2">{result.data.birthGua}</div>
                          <div className="text-sm text-xuan-muted">命卦（{result.data.birthElement}）· {result.data.isEastFour ? '东四命' : '西四命'}</div>
                        </div>
                        <div className="text-xuan-muted text-xl">×</div>
                        <div>
                          <div className="text-4xl font-chinese font-bold text-xuan-gold mb-2">{result.data.houseGua}</div>
                          <div className="text-sm text-xuan-muted">宅卦（{BAGUA_ELEMENT[result.data.houseGua]}）· {result.data.houseMansion?.isEastFour ? '东四宅' : '西四宅'}</div>
                        </div>
                      </div>
                      <div className={`mt-3 inline-block px-3 py-1 rounded-full text-sm font-chinese ${result.data.match ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                        {result.data.match ? '宅命相配' : '宅命不配'}：{result.data.match
                          ? `命卦与宅卦同属${result.data.isEastFour ? '东四' : '西四'}，气场相合。`
                          : `命卦属${result.data.isEastFour ? '东四' : '西四'}、宅卦属${result.data.houseMansion?.isEastFour ? '东四' : '西四'}，宜换宅或调整主要活动方位。`}
                      </div>
                      <div className="text-[10px] text-xuan-muted mt-2">游星解说为模板化解读，仅供参考。</div>
                    </div>
                    <div className="card-xuan-gold p-4 sm:p-6">
                      <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-3">八方游星（按{result.data.houseGua}宅）</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[...result.data.houseMansion.favorableDirections, ...result.data.houseMansion.unfavorableDirections].map((d: any, i: number) => {
                          const star = String(d.rating).replace(/\(.*\)$/, '');
                          const m = BAZHAI_STARS[star];
                          const good = String(d.rating).includes('吉');
                          return (
                            <div key={i} title={m ? `${m.detail}\n布局：${m.layout}` : ''} className={`p-3 rounded-lg border ${good ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                              <div className="flex justify-between text-xs font-chinese">
                                <span className="text-xuan-silver">{d.direction}({d.shan})</span>
                                <span className={good ? 'text-emerald-400' : 'text-red-400'}>{d.rating}</span>
                              </div>
                              {m && <div className="text-[10px] text-xuan-muted mt-1 leading-snug">{m.brief}</div>}
                              {m && <div className="text-[10px] text-xuan-muted leading-snug">宜/忌：{m.layout}</div>}
                              {!good && <div className="text-[10px] text-amber-300 leading-snug mt-0.5">化解：{BAZHAI_REMEDY[star] || '宜静置、保持整洁。'}</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="card-xuan p-4">
                      <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-3">三要速查</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(result.data.sanYao || []).map((s: any, i: number) => {
                          const star = String(s.entry?.rating || '').replace(/\(.*\)$/, '');
                          const m = BAZHAI_STARS[star];
                          const good = String(s.entry?.rating || '').includes('吉');
                          return (
                            <div key={i} className={`p-3 rounded-lg border ${good ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
                              <div className="text-xs font-chinese text-xuan-silver">{s.label}：{s.entry?.direction}({s.entry?.shan})</div>
                              <div className={`text-sm font-chinese font-bold ${good ? 'text-emerald-400' : 'text-red-400'}`}>{s.entry?.rating || '—'}</div>
                              {m && <div className="text-[10px] text-xuan-muted leading-snug mt-1">{m.brief}</div>}
                              {m && <div className="text-[10px] text-xuan-muted leading-snug">宜/忌：{m.layout}</div>}
                              {!good && <div className="text-[10px] text-amber-300 leading-snug mt-0.5">化解：{BAZHAI_REMEDY[star] || '宜静置、保持整洁。'}</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {result.data.analysis && (
                      <div className="card-xuan-gold p-6">
                        <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">详细分析</h3>
                        <div className="text-sm font-chinese text-xuan-silver leading-relaxed whitespace-pre-wrap">
                          {result.data.analysis}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'feixing' && (
              <motion.div key="feixing" initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8 mb-6">
                  <div className="flex gap-4 mb-4 items-end">
                    <div className="flex-1">
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">年份</label>
                      <select value={fsYear} onChange={e => setFsYear(Number(e.target.value))}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {yearRangeDesc().map(y=><option key={y} value={y}>{y}年</option>)}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">入住/建造年份</label>
                      <select value={fsBuildYear} onChange={e => setFsBuildYear(Number(e.target.value))}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {yearRangeDesc().map(y => <option key={y} value={y}>{y}年</option>)}
                      </select>
                    </div>
                    <button onClick={runFeixing} disabled={loading} className="btn-gold px-6 py-3 font-chinese disabled:opacity-50">
                      {loading ? '...' : '推算'}
                    </button>
                  </div>
                </div>
                {result?.type === 'feixing' && (
                  <div className="space-y-4">
                    <div className="card-xuan p-4 flex flex-wrap gap-2 text-sm font-chinese">
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full">{result.data.year}年</span>
                      <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full">{result.data.buildYear}年入住 · {result.data.yun}运</span>
                      <span className="px-3 py-1 bg-xuan-gold/10 text-xuan-gold rounded-full">中宫: {STAR_NAMES[result.data.centerStar]?.name || result.data.centerStar}</span>
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full">财位: {result.data.wealthPosition}方</span>
                    </div>
                    {(() => {
                      const cm = FEIXING_STARS[(STAR_NAMES[result.data.centerStar]?.name || '').slice(0, 2)];
                      return cm ? (
                        <div className="card-xuan p-3 text-xs font-chinese text-xuan-silver leading-relaxed">
                          中宫点评：{cm.nature}｜{cm.brief}
                        </div>
                      ) : null;
                    })()}
                    <div className="card-xuan-gold p-4 sm:p-6">
                      <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4 text-center">九宫飞星</h3>
                      <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
                        {result.data.grid.map((g: any, i: number) => {
                          const starInfo = STAR_NAMES[g.star];
                          const colors = starColors[g.star] || '';
                          const m = FEIXING_STARS[(starInfo?.name || g.name || '').slice(0, 2)];
                          const yg = result.data.yunStars?.grid.find((x: any) => x.palace === g.palace);
                          const yInfo = yg ? STAR_NAMES[yg.star] : null;
                          const ym = yg ? FEIXING_STARS[(yInfo?.name || '').slice(0, 2)] : null;
                          const keyA = yg ? `${Math.min(g.star, yg.star)}-${Math.max(g.star, yg.star)}` : '';
                          const combo = yg ? (FEIXING_COMBOS[keyA] || FEIXING_COMBOS[`${g.star}-${yg.star}`] || '') : '';
                          const level = yg ? (FEIXING_COMBO_LEVEL[keyA] || FEIXING_COMBO_LEVEL[`${g.star}-${yg.star}`] || '平') : '平';
                          return (
                            <div key={i} title={m ? `${m.nature}｜${m.detail}` : ''} className={`p-2.5 rounded-lg border bg-gradient-to-br ${colors} text-center`}>
                              <div className="text-[10px] text-xuan-muted mb-0.5">{['东南','南','西南','东','中','西','东北','北','西北'][i]}</div>
                              {yg ? (
                                <div className="text-[11px] font-chinese font-bold text-white">运{yg.star} · 年{g.star}</div>
                              ) : (
                                <div className="text-xl font-chinese font-bold text-white">{g.star}</div>
                              )}
                              <div className="text-[10px] font-chinese mt-0.5">{starInfo?.name || g.name}</div>
                              {yg && <div className="text-[9px] font-chinese text-xuan-muted">运星 {yInfo?.name} · 年星 {starInfo?.name}</div>}
                              <div className={`text-[9px] font-chinese ${level === '吉' ? 'text-emerald-300' : level === '凶' ? 'text-red-300' : 'text-xuan-gold/80'}`}>双星{level}</div>
                              {combo ? (
                                <div className="text-[9px] font-chinese text-xuan-silver mt-0.5 leading-snug">{combo}</div>
                              ) : (
                                <>
                                  {m && <div className="text-[9px] font-chinese text-xuan-muted mt-0.5 leading-snug">{m.brief}</div>}
                                  {ym && <div className="text-[9px] font-chinese text-xuan-muted leading-snug">运：{ym.brief}</div>}
                                </>
                              )}
                              {m && <div className="text-[9px] font-chinese text-xuan-gold/80 mt-0.5">{m.nature}</div>}
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 text-[10px] text-xuan-muted font-chinese text-center">飞星解说为模板化解读，仅供参考。</div>
                    </div>
                    {result.data.analysis && (
                      <div className="card-xuan-gold p-6">
                        <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">详细分析</h3>
                        <div className="text-sm font-chinese text-xuan-silver leading-relaxed whitespace-pre-wrap">
                          {result.data.analysis}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'yanghouse' && (
              <motion.div key="yanghouse" initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8 mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">房屋坐向</label>
                      <select value={yangHouse.facing} onChange={e => setYangHouse({...yangHouse, facing: e.target.value})}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {ER_SHI_SI_SHAN.map(s=><option key={s} value={s}>{s}山</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">入住年份</label>
                      <select value={yangHouse.year} onChange={e => setYangHouse({...yangHouse, year: Number(e.target.value)})}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {yearRangeDesc().map(y=><option key={y} value={y}>{y}年</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[{ k: 'doorGua', l: '大门方位' }, { k: 'bedGua', l: '主卧方位' }, { k: 'stoveGua', l: '灶台方位' }].map((f) => (
                      <div key={f.k}>
                        <label className="text-xs text-xuan-muted font-chinese mb-1 block">{f.l}</label>
                        <select value={(yangHouse as any)[f.k]} onChange={e => setYangHouse({ ...yangHouse, [f.k]: e.target.value })}
                          className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                          {SANYAO_DIRS.map(s => <option key={s.gua} value={s.gua}>{s.label}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <button onClick={runYangHouse} disabled={loading} className="w-full btn-gold py-4 text-lg font-chinese disabled:opacity-50">
                    {loading ? '分析中...' : '开始阳宅分析'}
                  </button>
                </div>
                {result?.type === 'yanghouse' && (
                  <div className="space-y-4">
                    <div className="card-xuan-gold p-6">
                      <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">阳宅风水分析</h3>
                      <div className="text-sm font-chinese text-xuan-silver leading-relaxed whitespace-pre-wrap">
                        {result.data.summary}
                      </div>
                    </div>
                    {result.data.sittingGua && (() => {
                      const gua = result.data.sittingGua;
                      const h = YANGZHAI_HOUSES[gua];
                      const baz = result.data.bazhai;
                      return (
                        <>
                          <div className="card-xuan-gold p-6">
                            <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-3">坐山详解：{result.data.facing}山 → {gua}宅（{BAGUA_ELEMENT[gua]}）</h4>
                            {h && <>
                              <p className="text-sm font-chinese text-xuan-silver leading-relaxed">{h.brief}</p>
                              <p className="text-xs font-chinese text-xuan-silver leading-relaxed mt-2">{h.detail}</p>
                              <p className="text-xs font-chinese text-xuan-muted leading-relaxed mt-2">{SITTING_TIPS[gua]}</p>
                              <p className="text-xs font-chinese text-xuan-muted leading-relaxed mt-1">门主灶三要：{h.tips}</p>
                            </>}
                          </div>
                          {baz && (
                            <div className="card-xuan p-4">
                              <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-3">八方吉凶分布（按{gua}宅）</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[...baz.favorableDirections, ...baz.unfavorableDirections].map((d: any, i: number) => {
                                  const star = String(d.rating).replace(/\(.*\)$/, '');
                                  const m = BAZHAI_STARS[star];
                                  const good = String(d.rating).includes('吉');
                                  return (
                                    <div key={i} title={m ? `${m.detail}\n布局：${m.layout}` : ''} className="p-2 bg-xuan-dark rounded border border-xuan-border">
                                      <div className="flex justify-between text-xs font-chinese">
                                        <span className="text-xuan-silver">{d.direction}({d.shan})</span>
                                        <span className={good ? 'text-emerald-400' : 'text-red-400'}>{d.rating}</span>
                                      </div>
                                      {m && <div className="text-[10px] text-xuan-muted mt-1 leading-snug">{m.brief}</div>}
                                      {m && <div className="text-[10px] text-xuan-muted leading-snug">宜/忌：{m.layout}</div>}
                                      {!good && <div className="text-[10px] text-amber-300 leading-snug">化解：{BAZHAI_REMEDY[star] || '宜静置、保持整洁。'}</div>}
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="mt-3 text-[10px] text-xuan-muted font-chinese text-center">阳宅与游星解说为模板化解读，仅供参考。</div>
                            </div>
                          )}
                          {result.data.sanYao?.length > 0 && (
                            <div className="card-xuan p-4">
                              <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-3">三要结论</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {result.data.sanYao.map((s: any, i: number) => {
                                  const star = String(s.entry?.rating || '').replace(/\(.*\)$/, '');
                                  const m = BAZHAI_STARS[star];
                                  const good = String(s.entry?.rating || '').includes('吉');
                                  return (
                                    <div key={i} className={`p-3 rounded-lg border ${good ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
                                      <div className="text-xs font-chinese text-xuan-silver">{s.label}：{s.entry?.direction}({s.entry?.shan})</div>
                                      <div className={`text-sm font-chinese font-bold ${good ? 'text-emerald-400' : 'text-red-400'}`}>{s.entry?.rating || '—'}</div>
                                      {m && <div className="text-[10px] text-xuan-muted leading-snug mt-1">{m.brief}</div>}
                                      {m && <div className="text-[10px] text-xuan-muted leading-snug">宜/忌：{m.layout}</div>}
                                      {!good && <div className="text-[10px] text-amber-300 leading-snug mt-0.5">化解：{BAZHAI_REMEDY[star] || '宜静置、保持整洁。'}</div>}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {result.data.yunStars && (
                            <div className="card-xuan p-4">
                              <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-3">入住年份运星（{result.data.yun}运）</h4>
                              <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
                                {result.data.yunStars.grid.map((g: any, i: number) => {
                                  const info = STAR_NAMES[g.star];
                                  const m = FEIXING_STARS[(info?.name || '').slice(0, 2)];
                                  return (
                                    <div key={i} className="p-2 bg-xuan-dark rounded border border-xuan-border text-center">
                                      <div className="text-[10px] text-xuan-muted">{['东南','南','西南','东','中','西','东北','北','西北'][i]}</div>
                                      <div className="text-sm font-chinese font-bold text-xuan-gold">{g.star} · {info?.name}</div>
                                      {m && <div className="text-[9px] text-xuan-muted leading-snug">{m.brief}</div>}
                                      {m && <div className="text-[9px] text-xuan-gold/80">{m.nature}</div>}
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="mt-3 text-[10px] text-xuan-muted font-chinese text-center">运星逐宫简评，仅供参考。</div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                    {result.data.keyPoints && (
                      <div className="card-xuan p-4">
                        <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-3">装修建议要点</h4>
                        <div className="space-y-2">
                          {result.data.keyPoints.map((kp: string, i: number) => (
                            <div key={i} className="text-xs font-chinese text-xuan-silver bg-xuan-dark p-3 rounded border border-xuan-border">• {kp}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'yinhouse' && (
              <motion.div key="yinhouse" initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8 mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">地形类型</label>
                      <select value={yinHouse.location} onChange={e => setYinHouse({...yinHouse, location: e.target.value})}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {[{v:'山区',l:'山区'},{v:'平原',l:'平原'},{v:'水边',l:'水边'}].map(l=><option key={l.v} value={l.v}>{l.l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">坐向</label>
                      <select value={yinHouse.direction} onChange={e => setYinHouse({...yinHouse, direction: e.target.value})}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {['坐北朝南','坐南朝北','坐东朝西','坐西朝东','坐西北朝东南','坐西南朝东北','坐东北朝西南','坐东南朝西北'].map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <button onClick={runYinHouse} disabled={loading} className="w-full btn-gold py-4 text-lg font-chinese disabled:opacity-50">
                    {loading ? '分析中...' : '开始阴宅分析'}
                  </button>
                </div>
                {result?.type === 'yinhouse' && (
                  <div className="space-y-4">
                    <div className="card-xuan-gold p-6">
                      <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">阴宅风水分析</h3>
                      <div className="text-sm font-chinese text-xuan-silver leading-relaxed whitespace-pre-wrap">
                        {result.data.summary}
                      </div>
                    </div>
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-chinese text-amber-300">
                      原则性解读，不能替代实地勘测。
                    </div>
                    {result.data.sittingGua && (() => {
                      const gua = result.data.sittingGua;
                      const h = YANGZHAI_HOUSES[gua];
                      return (
                        <div className="card-xuan-gold p-4">
                          <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-2">坐山详解：{result.data.direction} · {gua}宅（{BAGUA_ELEMENT[gua]}）</h4>
                          {h && <p className="text-xs font-chinese text-xuan-silver leading-relaxed">{h.brief}</p>}
                          <p className="text-xs font-chinese text-xuan-silver leading-relaxed mt-1">{SITTING_TIPS[gua]}</p>
                          {h && <p className="text-[10px] font-chinese text-xuan-muted leading-relaxed mt-1">八宅参考：{h.tips}</p>}
                        </div>
                      );
                    })()}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['龙','穴','砂','水','向','明堂','水口'].map((k) => {
                        const t = YINZHAI_TOPICS[k];
                        if (!t) return null;
                        return (
                          <div key={k} className="card-xuan p-4">
                            <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-2">{k}</h4>
                            <p className="text-xs font-chinese text-xuan-silver leading-relaxed">{t.brief}</p>
                            <p className="text-[11px] font-chinese text-xuan-silver leading-relaxed mt-1">{t.detail}</p>
                            <p className="text-[10px] font-chinese text-xuan-muted leading-relaxed mt-2">评判要点：{t.keyPoints}</p>
                            <p className="text-[10px] font-chinese text-amber-200/80 leading-relaxed mt-2">
                              按当前{result.data.location}/{result.data.direction}：{yinTopicTip(k, result.data.location, result.data.direction, result.data.sittingGua, result.data.waterMouth)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    {result.data.waterMouth && (
                      <div className="card-xuan p-4">
                        <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-2">水口判定</h4>
                        <p className="text-xs font-chinese text-xuan-silver leading-relaxed">宜去：{result.data.waterMouth.bad.join('、')}（凶方）</p>
                        <p className="text-xs font-chinese text-xuan-silver leading-relaxed">忌去：{result.data.waterMouth.good.join('、')}（吉方）</p>
                        <p className="text-[10px] font-chinese text-xuan-muted leading-relaxed mt-1">去水宜凶方、忌吉方；水口宜关锁盘旋，忌直射开阔。（八宅水法，原则性参考）</p>
                      </div>
                    )}
                    <div className="text-[10px] text-xuan-muted font-chinese text-center">以上为原则性、模板化解读，仅供参考，不能替代实地勘测。</div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </main>
  );
}
