import React, { useState, useRef } from 'react';
import { VS_DATA } from '../data/vsData';
import GameIcon from '../components/GameIcon';
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
  buildWeapons,
  setBuildWeapons,
  buildPassives,
  setBuildPassives,
  setAltarWeapon,
  setAltarPassive,
  setActiveTab
}) => {
  const showToast = useToast();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerType, setPickerType] = useState<'base' | 'passive'>('base');
  const [pickerSlotIndex, setPickerSlotIndex] = useState<number>(0);
  const [pickerPos, setPickerPos] = useState<PickerPosition>({ top: 0, left: 0 });

  const pickerRef = useRef<HTMLDivElement>(null);

  // 打开物品选择器
  const handleOpenPicker = (type: 'base' | 'passive', slotIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
    setPickerType(type);
    setPickerSlotIndex(slotIndex);
    
    // 绝对定位与边界避让逻辑
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

  // 选择某个物品填入槽位
  const handleSelectPickerItem = (key: string) => {
    const list = pickerType === 'base' ? [...buildWeapons] : [...buildPassives];
    
    // 排重校验
    if (list.includes(key) && list[pickerSlotIndex] !== key) {
      showToast(`该${pickerType === 'base' ? '主武器' : '被动道具'}已存在于配装中！`);
      return;
    }

    list[pickerSlotIndex] = key;
    if (pickerType === 'base') {
      setBuildWeapons(list);
    } else {
      setBuildPassives(list);
    }
    setPickerOpen(false);
  };

  // 移出槽位
  const handleRemoveSlot = (type: 'base' | 'passive', index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const list = type === 'base' ? [...buildWeapons] : [...buildPassives];
    list[index] = null;
    if (type === 'base') {
      setBuildWeapons(list);
    } else {
      setBuildPassives(list);
    }
    setPickerOpen(false);
  };

  // ----------------- 雷达图数据计算 -----------------
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

  // 渲染 SVG 雷达图的点
  const getRadarSVGPoints = () => {
    const cx = 100, cy = 100, r = 70;
    const angles = [
      0,                 
      (2 * Math.PI) / 5, 
      (4 * Math.PI) / 5, 
      (6 * Math.PI) / 5, 
      (8 * Math.PI) / 5  
    ];
    
    const valKeys: ('dps' | 'sur' | 'cc' | 'gro' | 'cdr')[] = ['dps', 'sur', 'cc', 'gro', 'cdr'];
    
    const getPointsStr = (scale: number) => {
      return angles.map(a => {
        const radius = r * scale;
        const x = cx + radius * Math.sin(a);
        const y = cy - radius * Math.cos(a);
        return `${x},${y}`;
      }).join(' ');
    };

    const dataPoints = angles.map((a, i) => {
      const val = stats[valKeys[i]];
      const radius = r * (val / 100);
      const x = cx + radius * Math.sin(a);
      const y = cy - radius * Math.cos(a);
      return `${x},${y}`;
    }).join(' ');

    return {
      bg1: getPointsStr(1.0),
      bg2: getPointsStr(0.75),
      bg3: getPointsStr(0.5),
      bg4: getPointsStr(0.25),
      data: dataPoints,
      nodes: angles.map((a, i) => {
        const val = stats[valKeys[i]];
        const radius = r * (val / 100);
        const x = cx + radius * Math.sin(a);
        const y = cy - radius * Math.cos(a);
        return { x, y, key: valKeys[i] };
      }),
      spokes: angles.map(a => {
        const x = cx + r * Math.sin(a);
        const y = cy - r * Math.cos(a);
        return { x, y };
      }),
      cx, cy, r
    };
  };

  const svgData = getRadarSVGPoints();

  // ----------------- 超武配方预测 -----------------
  const activeWeapons = buildWeapons.filter(Boolean) as string[];
  const activePassives = buildPassives.filter(Boolean) as string[];

  const getEvolutionsPreviewList = () => {
    if (activeWeapons.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          添加主武器和被动道具后自动预测超武...
        </div>
      );
    }

    const matchedEvos = VS_DATA.evolutions.filter(evo => activeWeapons.includes(evo.weapon));

    if (matchedEvos.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          当前选择的主武器无对应超武配方，或尚未添加配方所需的道具。
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
              {evo.cond.includes('满级') ? '⚠️ 被动需满级' : '⚙️ 特殊'}
            </span>
          ) : null;

          return (
            <div 
              className={`evo-combo-item ${hasPassive ? 'completed' : ''}`}
              key={`${evo.weapon}-${evo.passive}`}
            >
              <div className="combo-formula">
                <span 
                  onClick={() => {
                    setAltarWeapon(evo.weapon);
                    setAltarPassive(evo.passive);
                    setActiveTab('simulator');
                  }}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  <GameIcon item={wItem} size={20} /> {wItem.name}
                </span>
                <span>+</span>
                <span 
                  onClick={() => {
                    setAltarWeapon(evo.weapon);
                    setAltarPassive(evo.passive);
                    setActiveTab('simulator');
                  }}
                  style={{ 
                    cursor: 'pointer', 
                    textDecoration: 'underline', 
                    opacity: hasPassive ? 1 : 0.4, 
                    textDecorationLine: hasPassive ? 'underline' : 'line-through' 
                  }}
                >
                  <GameIcon item={pItem} size={20} /> {pItem.name}
                </span>
                {conditionLabel}
              </div>
              <div className={`combo-result ${hasPassive ? 'active' : ''}`}>
                <span>{hasPassive ? '✔️ 可合成' : '⏳ 缺被动'}</span>
                <span 
                  onClick={() => {
                    setAltarWeapon(evo.weapon);
                    setAltarPassive(evo.passive);
                    setActiveTab('simulator');
                  }}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  ➡️ <GameIcon item={eItem} size={20} /> {eItem.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 获得已选的装备总数
  const selectedWeaponsCount = activeWeapons.length;
  const selectedPassivesCount = activePassives.length;

  return (
    <div className="planner-tab-content">
      {/* 槽位与雷达图并列排布 */}
      <div className="build-planner-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        
        {/* 左侧：槽位区域 */}
        <div className="slots-area">
          {/* 主武器配置 */}
          <div className="build-section-card" style={{ marginBottom: '0.75rem' }}>
            <h3 className="section-title" style={{ fontSize: '0.8rem', marginBottom: '0.4rem', borderLeft: '3px solid var(--glow-blue)', paddingLeft: '5px' }}>
              ⚔️ 主武器 ({selectedWeaponsCount}/6)
            </h3>
            <div className="build-slots-grid" id="build-weapons-slots">
              {buildWeapons.map((key, index) => {
                if (key) {
                  const item = VS_DATA.items[key];
                  return (
                    <div
                      className="build-slot active"
                      key={index}
                      onClick={(e) => handleOpenPicker('base', index, e)}
                    >
                      <span className="slot-icon">
                        <GameIcon item={item} size={20} />
                      </span>
                      <span className="slot-name">{item.name}</span>
                      <button
                        className="remove-btn"
                        onClick={(e) => handleRemoveSlot('base', index, e)}
                      >
                        ×
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div
                      className="build-slot"
                      key={index}
                      onClick={(e) => handleOpenPicker('base', index, e)}
                    >
                      <span className="slot-icon">＋</span>
                    </div>
                  );
                }
              })}
            </div>
          </div>

          {/* 被动配置 */}
          <div className="build-section-card">
            <h3 className="section-title" style={{ fontSize: '0.8rem', marginBottom: '0.4rem', borderLeft: '3px solid var(--glow-green)', paddingLeft: '5px' }}>
              🛡️ 被动 ({selectedPassivesCount}/6)
            </h3>
            <div className="build-slots-grid" id="build-passives-slots">
              {buildPassives.map((key, index) => {
                if (key) {
                  const item = VS_DATA.items[key];
                  return (
                    <div
                      className="build-slot active"
                      key={index}
                      onClick={(e) => handleOpenPicker('passive', index, e)}
                    >
                      <span className="slot-icon">
                        <GameIcon item={item} size={20} />
                      </span>
                      <span className="slot-name">{item.name}</span>
                      <button
                        className="remove-btn"
                        onClick={(e) => handleRemoveSlot('passive', index, e)}
                      >
                        ×
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div
                      className="build-slot"
                      key={index}
                      onClick={(e) => handleOpenPicker('passive', index, e)}
                    >
                      <span className="slot-icon">＋</span>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>

        {/* 右侧：雷达图展示 */}
        <div className="radar-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(23, 12, 41, 0.4)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1rem' }}>
          <h3 className="section-title" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
            📊 综合配装属性五维雷达
          </h3>
          <div id="radar-container" style={{ position: 'relative', width: '200px', height: '200px' }}>
            <svg width="200" height="200" style={{ overflow: 'visible' }}>
              {/* 背景网线 */}
              <polygon points={svgData.bg1} fill="rgba(139,92,246,0.05)" stroke="rgba(139,92,246,0.3)" strokeWidth="1" />
              <polygon points={svgData.bg2} fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />
              <polygon points={svgData.bg3} fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />
              <polygon points={svgData.bg4} fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="1" />
              
              {/* 五条辐线 */}
              {svgData.spokes.map((pt, i) => (
                <line key={i} x1={svgData.cx} y1={svgData.cy} x2={pt.x} y2={pt.y} stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
              ))}
              
              {/* 实测数据多边形 */}
              <polygon 
                points={svgData.data} 
                fill="rgba(139,92,246,0.4)" 
                stroke="var(--color-accent)" 
                strokeWidth="2" 
                filter="drop-shadow(0 0 4px rgba(139,92,246,0.5))"
              />
              
              {/* 数据节点端点 */}
              {svgData.nodes.map((node, i) => (
                <circle key={i} cx={node.x} cy={node.y} r="3" fill="#fff" stroke="var(--color-accent)" strokeWidth="1" />
              ))}
              
              {/* 各指标名称与当前评级数值 */}
              <text x={svgData.cx} y={svgData.cy - svgData.r - 8} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">输出 ({stats.dps}%)</text>
              <text x={svgData.cx + svgData.r + 24} y={svgData.cy - svgData.r * 0.3} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">生存 ({stats.sur}%)</text>
              <text x={svgData.cx + svgData.r * 0.6} y={svgData.cy + svgData.r + 12} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">控制 ({stats.cc}%)</text>
              <text x={svgData.cx - svgData.r * 0.6} y={svgData.cy + svgData.r + 12} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">发育 ({stats.gro}%)</text>
              <text x={svgData.cx - svgData.r - 24} y={svgData.cy - svgData.r * 0.3} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">冷却 ({stats.cdr}%)</text>
            </svg>
          </div>
        </div>
      </div>

      {/* 底部：进化超武预测 */}
      <div className="build-evolutions-card" style={{ marginTop: '1rem', background: 'rgba(15, 7, 27, 0.4)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem' }}>
        <h3 className="section-title" style={{ fontSize: '0.85rem', marginBottom: '0.6rem', borderLeft: '3px solid var(--glow-gold)', paddingLeft: '5px' }}>
          🔮 自动合成预测超武列表
        </h3>
        <div id="build-evolutions-list">
          {getEvolutionsPreviewList()}
        </div>
      </div>

      {/* 绝对定位的浮窗物品选择器 Popover */}
      {pickerOpen && (
        <>
          <div
            className="build-picker-backdrop"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 999,
              background: 'transparent'
            }}
            onClick={() => setPickerOpen(false)}
          />
          <div
            ref={pickerRef}
            id="build-picker-container"
            style={{
              display: 'block',
              position: 'absolute',
              top: `${pickerPos.top}px`,
              left: `${pickerPos.left}px`,
              zIndex: 1000
            }}
          >
            <h4 
              id="build-picker-title" 
              style={{ fontSize: '0.8rem', color: '#fff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', marginBottom: '0.6rem', fontWeight: 600 }}
            >
              选择填入 {pickerType === 'base' ? '主武器' : '被动道具'} 槽位 #{pickerSlotIndex + 1}
            </h4>
            <div 
              className="build-picker-grid" 
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', maxHeight: '220px', overflowY: 'auto' }}
            >
              {Object.keys(VS_DATA.items).filter(key => {
                const item = VS_DATA.items[key];
                return item.type === pickerType;
              }).map(key => {
                const item = VS_DATA.items[key];
                const list = pickerType === 'base' ? buildWeapons : buildPassives;
                const isSelected = list.includes(key);

                return (
                  <div
                    className={`sim-item ${isSelected ? 'selected' : ''}`}
                    key={key}
                    onClick={() => handleSelectPickerItem(key)}
                    style={{ padding: '0.35rem 0.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.15rem' }}
                  >
                    <span className="item-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <GameIcon item={item} size={24} />
                    </span>
                    <span className="item-name" style={{ fontSize: '0.7rem', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '100%', textAlign: 'center' }}>{item.name}</span>
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
