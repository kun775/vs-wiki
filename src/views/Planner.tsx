import React, { useState, useRef } from 'react';
import { VS_DATA } from '../data/vsData';
import GameIcon from '../components/GameIcon';
import Icon from '../components/Icon';
import { useToast } from '../components/toast-context';

interface PlannerProps {
  buildWeapons: (string | null)[];
  setBuildWeapons: (weapons: (string | null)[]) => void;
  buildPassives: (string | null)[];
  setBuildPassives: (passives: (string | null)[]) => void;
  setAltarWeapon: (key: string | null) => void;
  setAltarPassive: (key: string | null) => void;
  setActiveTab: (tab: string) => void;
}

interface PickerPosition {
  top: number;
  left: number;
}

export const Planner: React.FC<PlannerProps> = ({
  buildWeapons, setBuildWeapons,
  buildPassives, setBuildPassives,
  setAltarWeapon, setAltarPassive, setActiveTab
}) => {
  const showToast = useToast();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerType, setPickerType] = useState<'base' | 'passive'>('base');
  const [pickerSlotIndex, setPickerSlotIndex] = useState<number>(0);
  const [pickerPos, setPickerPos] = useState<PickerPosition>({ top: 0, left: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleOpenPicker = (type: 'base' | 'passive', slotIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
    setPickerType(type);
    setPickerSlotIndex(slotIndex);
    const rect = event.currentTarget.getBoundingClientRect();
    const top = rect.bottom + window.scrollY;
    const left = rect.left + window.scrollX;
    const containerWidth = 290;
    let targetLeft = left;
    if (left + containerWidth > window.innerWidth) {
      targetLeft = window.innerWidth - containerWidth - 16;
    }
    targetLeft = Math.max(16, targetLeft);
    setPickerPos({ top: top + 8, left: targetLeft });
    setPickerOpen(true);
  };

  const handleSelectPickerItem = (key: string) => {
    const list = pickerType === 'base' ? [...buildWeapons] : [...buildPassives];
    if (list.includes(key) && list[pickerSlotIndex] !== key) {
      showToast(`该${pickerType === 'base' ? '主武器' : '被动道具'}已存在于配装中！`);
      return;
    }
    list[pickerSlotIndex] = key;
    if (pickerType === 'base') setBuildWeapons(list);
    else setBuildPassives(list);
    setPickerOpen(false);
  };

  const handleRemoveSlot = (type: 'base' | 'passive', index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const list = type === 'base' ? [...buildWeapons] : [...buildPassives];
    list[index] = null;
    if (type === 'base') setBuildWeapons(list);
    else setBuildPassives(list);
    setPickerOpen(false);
  };

  const getRadarStats = () => {
    const baseStats = { dps: 10, sur: 10, cc: 10, gro: 10, cdr: 10 };
    buildWeapons.forEach(key => {
      if (!key) return;
      const item = VS_DATA.items[key];
      if (item && item.stats) {
        baseStats.dps += (item.stats.dps || 0) * 15;
        baseStats.sur += (item.stats.sur || 0) * 15;
        baseStats.cc += (item.stats.cc || 0) * 15;
        baseStats.gro += (item.stats.gro || 0) * 15;
        baseStats.cdr += (item.stats.cdr || 0) * 15;
      }
    });
    buildPassives.forEach(key => {
      if (!key) return;
      if (key === 'spinach') baseStats.dps += 50;
      if (key === 'hollow_heart' || key === 'pummarola') baseStats.sur += 50;
      if (key === 'empty_tome') baseStats.cdr += 60;
      if (key === 'candelabrador') baseStats.dps += 25;
      if (key === 'duplicator') baseStats.dps += 35;
      if (key === 'crown' || key === 'stone_mask') baseStats.gro += 60;
      if (key === 'attractorb') baseStats.gro += 30;
      if (key === 'spellbinder') baseStats.cc += 30;
      if (key === 'clock_lancet') baseStats.cc += 50;
      if (key === 'laurel') baseStats.sur += 60;
      if (key === 'parm_aegis') baseStats.sur += 40;
      if (key === 'karomas_mana') baseStats.cdr += 40;
    });
    const maxVal = 130;
    return {
      dps: Math.min(100, Math.round((baseStats.dps / maxVal) * 100)),
      sur: Math.min(100, Math.round((baseStats.sur / maxVal) * 100)),
      cc: Math.min(100, Math.round((baseStats.cc / maxVal) * 100)),
      gro: Math.min(100, Math.round((baseStats.gro / maxVal) * 100)),
      cdr: Math.min(100, Math.round((baseStats.cdr / maxVal) * 100))
    };
  };

  const stats = getRadarStats();

  const getRadarSVGPoints = () => {
    const cx = 100, cy = 100, r = 70;
    const angles = [0, (2 * Math.PI) / 5, (4 * Math.PI) / 5, (6 * Math.PI) / 5, (8 * Math.PI) / 5];
    const valKeys: ('dps' | 'sur' | 'cc' | 'gro' | 'cdr')[] = ['dps', 'sur', 'cc', 'gro', 'cdr'];

    const getPointsStr = (scale: number) => {
      return angles.map(a => {
        const radius = r * scale;
        return `${cx + radius * Math.sin(a)},${cy - radius * Math.cos(a)}`;
      }).join(' ');
    };

    const dataPoints = angles.map((a, i) => {
      const val = stats[valKeys[i]];
      const radius = r * (val / 100);
      return `${cx + radius * Math.sin(a)},${cy - radius * Math.cos(a)}`;
    }).join(' ');

    return {
      bg1: getPointsStr(1.0), bg2: getPointsStr(0.75),
      bg3: getPointsStr(0.5), bg4: getPointsStr(0.25),
      data: dataPoints,
      nodes: angles.map((a, i) => {
        const val = stats[valKeys[i]];
        const radius = r * (val / 100);
        return { x: cx + radius * Math.sin(a), y: cy - radius * Math.cos(a), key: valKeys[i] };
      }),
      spokes: angles.map(a => ({ x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) })),
      cx, cy, r
    };
  };

  const svgData = getRadarSVGPoints();

  const activeWeapons = buildWeapons.filter(Boolean) as string[];
  const activePassives = buildPassives.filter(Boolean) as string[];

  const getEvolutionsPreviewList = () => {
    if (activeWeapons.length === 0) {
      return (
        <div className="empty-state">
          <Icon name="crystal" size={28} />
          <div className="empty-state-title">添加武器后自动预测超武</div>
          <div className="empty-state-hint">在左侧槽位中点击 + 号，从选择器中选择主武器和被动道具</div>
        </div>
      );
    }

    const matchedEvos = VS_DATA.evolutions.filter(evo => activeWeapons.includes(evo.weapon));

    if (matchedEvos.length === 0) {
      return (
        <div className="empty-state">
          <Icon name="lightbulb" size={28} />
          <div className="empty-state-title">当前无匹配的超武配方</div>
          <div className="empty-state-hint">尝试更换选择的主武器，或添加对应的被动道具</div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {matchedEvos.map((evo) => {
          const wItem = VS_DATA.items[evo.weapon];
          const pItem = VS_DATA.items[evo.passive];
          const eItem = VS_DATA.items[evo.evolved];
          if (!wItem || !pItem || !eItem) return null;

          const hasPassive = activePassives.includes(evo.passive);
          const conditionLabel = evo.cond ? (
            <span className="combo-condition-label">
              {evo.cond.includes('满级') ? '被动需满级' : '特殊'}
            </span>
          ) : null;

          return (
            <div className={`evo-combo-item ${hasPassive ? 'completed' : ''}`} key={`${evo.weapon}-${evo.passive}`}>
              <div className="combo-formula">
                <span onClick={() => { setAltarWeapon(evo.weapon); setAltarPassive(evo.passive); setActiveTab('simulator'); }}
                  style={{ cursor: 'pointer' }}>
                  <GameIcon item={wItem} size={20} /> {wItem.name}
                </span>
                <span style={{ color: 'var(--color-text-dim)' }}>+</span>
                <span onClick={() => { setAltarWeapon(evo.weapon); setAltarPassive(evo.passive); setActiveTab('simulator'); }}
                  style={{ cursor: 'pointer', opacity: hasPassive ? 1 : 0.4 }}>
                  <GameIcon item={pItem} size={20} /> {pItem.name}
                </span>
                {conditionLabel}
              </div>
              <div className={`combo-result ${hasPassive ? 'active' : ''}`}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {hasPassive ? (
                    <Icon name="check" size={16} style={{ color: 'var(--glow-green)' }} />
                  ) : (
                    <Icon name="clock" size={16} style={{ color: 'var(--color-text-dim)' }} />
                  )}
                  {hasPassive ? '可合成' : '缺被动'}
                </span>
                <span onClick={() => { setAltarWeapon(evo.weapon); setAltarPassive(evo.passive); setActiveTab('simulator'); }}
                  style={{ cursor: 'pointer' }}>
                  <Icon name="arrow" size={14} style={{ color: 'var(--color-text-dim)' }} />
                  <GameIcon item={eItem} size={20} /> {eItem.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const selectedWeaponsCount = activeWeapons.length;
  const selectedPassivesCount = activePassives.length;

  return (
    <div className="planner-tab-content">
      <div className="build-planner-layout">
        <div className="planner-slots-column">
          {/* 主武器配置 */}
          <div className="build-section-card">
            <h3 className="section-title" style={{ borderLeft: '3px solid var(--glow-blue)' }}>
              <Icon name="sword" size={18} style={{ color: 'var(--glow-blue)' }} />
              主武器 ({selectedWeaponsCount}/6)
            </h3>
            <div className="slots-grid">
              {buildWeapons.map((key, index) => {
                if (key) {
                  const item = VS_DATA.items[key];
                  return (
                    <div className="build-slot active" key={index}
                      onClick={(e) => handleOpenPicker('base', index, e)}
                      role="button" tabIndex={0} aria-label={item.name}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpenPicker('base', index, e as any); } }}
                    >
                      <span className="slot-icon"><GameIcon item={item} size={20} /></span>
                      <span className="slot-name">{item.name}</span>
                      <button className="remove-btn" onClick={(e) => handleRemoveSlot('base', index, e)} aria-label="移除">×</button>
                    </div>
                  );
                }
                return (
                  <div className="build-slot" key={index}
                    onClick={(e) => handleOpenPicker('base', index, e)}
                    role="button" tabIndex={0} aria-label={`主武器槽位 ${index + 1}`}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpenPicker('base', index, e as any); } }}
                  >
                    <span className="slot-icon">
                      <Icon name="plus" size={18} style={{ color: 'var(--color-text-dim)' }} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 被动配置 */}
          <div className="build-section-card">
            <h3 className="section-title" style={{ borderLeft: '3px solid var(--glow-green)' }}>
              <Icon name="shield" size={18} style={{ color: 'var(--glow-green)' }} />
              被动 ({selectedPassivesCount}/6)
            </h3>
            <div className="slots-grid">
              {buildPassives.map((key, index) => {
                if (key) {
                  const item = VS_DATA.items[key];
                  return (
                    <div className="build-slot active" key={index}
                      onClick={(e) => handleOpenPicker('passive', index, e)}
                      role="button" tabIndex={0} aria-label={item.name}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpenPicker('passive', index, e as any); } }}
                    >
                      <span className="slot-icon"><GameIcon item={item} size={20} /></span>
                      <span className="slot-name">{item.name}</span>
                      <button className="remove-btn" onClick={(e) => handleRemoveSlot('passive', index, e)} aria-label="移除">×</button>
                    </div>
                  );
                }
                return (
                  <div className="build-slot" key={index}
                    onClick={(e) => handleOpenPicker('passive', index, e)}
                    role="button" tabIndex={0} aria-label={`被动槽位 ${index + 1}`}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpenPicker('passive', index, e as any); } }}
                  >
                    <span className="slot-icon">
                      <Icon name="plus" size={18} style={{ color: 'var(--color-text-dim)' }} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="planner-sidebar-column">
          {/* 雷达图 */}
          <div className="radar-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1rem' }}>
            <h3 className="section-title" style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              <Icon name="chart" size={18} style={{ color: 'var(--color-text-dim)' }} />
              综合配装属性五维雷达
            </h3>
            <div className="radar-svg-container" style={{ position: 'relative' }}>
              <svg width="200" height="200" viewBox="0 0 200 200" style={{ overflow: 'visible', width: '100%', height: 'auto', maxWidth: '260px' }}>
              <polygon points={svgData.bg1} fill="rgba(139,92,246,0.05)" stroke="rgba(139,92,246,0.3)" strokeWidth="1" />
              <polygon points={svgData.bg2} fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />
              <polygon points={svgData.bg3} fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />
              <polygon points={svgData.bg4} fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="1" />
              {svgData.spokes.map((pt, i) => (
                <line key={i} x1={svgData.cx} y1={svgData.cy} x2={pt.x} y2={pt.y} stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
              ))}
              <polygon points={svgData.data} fill="rgba(139,92,246,0.35)" stroke="var(--color-accent)" strokeWidth="2" />
              {svgData.nodes.map((node, i) => (
                <circle key={i} cx={node.x} cy={node.y} r="3" fill="#fff" stroke="var(--color-accent)" strokeWidth="1" />
              ))}
              <text x={svgData.cx} y={svgData.cy - svgData.r - 8} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">输出 ({stats.dps}%)</text>
              <text x={svgData.cx + svgData.r + 24} y={svgData.cy - svgData.r * 0.3} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">生存 ({stats.sur}%)</text>
              <text x={svgData.cx + svgData.r * 0.6} y={svgData.cy + svgData.r + 12} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">控制 ({stats.cc}%)</text>
              <text x={svgData.cx - svgData.r * 0.6} y={svgData.cy + svgData.r + 12} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">发育 ({stats.gro}%)</text>
              <text x={svgData.cx - svgData.r - 24} y={svgData.cy - svgData.r * 0.3} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">冷却 ({stats.cdr}%)</text>
            </svg>
          </div>
        </div>

        {/* 进化超武预测 */}
        <div className="build-evolutions-card" style={{ background: 'rgba(15, 7, 27, 0.4)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem' }}>
          <h3 className="section-title" style={{ borderLeft: '3px solid var(--glow-gold)' }}>
            <Icon name="crystal" size={18} style={{ color: 'var(--glow-gold)' }} />
            自动合成预测超武列表
          </h3>
          <div id="build-evolutions-list">
            {getEvolutionsPreviewList()}
          </div>
        </div>
      </div>
    </div>

      {/* Popover 选择器 */}
      {pickerOpen && (
        <>
          <div className="build-picker-backdrop" style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            zIndex: 999, background: 'transparent'
          }} onClick={() => setPickerOpen(false)} />
          <div ref={pickerRef} id="build-picker-container" style={{
            display: 'block', position: 'absolute',
            top: `${pickerPos.top}px`, left: `${pickerPos.left}px`,
            zIndex: 1000
          }}>
            <h4 style={{ fontSize: '0.8rem', color: '#fff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', marginBottom: '0.6rem', fontWeight: 600 }}>
              选择 {pickerType === 'base' ? '主武器' : '被动道具'} 填入槽位 #{pickerSlotIndex + 1}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', maxHeight: '220px', overflowY: 'auto' }}>
              {Object.keys(VS_DATA.items).filter(key => {
                const item = VS_DATA.items[key];
                return item.type === pickerType;
              }).map(key => {
                const item = VS_DATA.items[key];
                const list = pickerType === 'base' ? buildWeapons : buildPassives;
                const isSelected = list.includes(key);
                return (
                  <div className={`sim-item ${isSelected ? 'selected' : ''}`} key={key}
                    onClick={() => handleSelectPickerItem(key)}
                    role="button" tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectPickerItem(key); } }}
                    style={{ padding: '0.35rem 0.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.15rem' }}
                  >
                    <span className="item-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <GameIcon item={item} size={24} />
                    </span>
                    <span className="item-name" style={{ fontSize: '0.7rem' }}>{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Planner;
