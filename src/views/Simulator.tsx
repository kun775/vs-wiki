import React, { useState } from 'react';
import { VS_DATA } from '../data/vsData';
import GameIcon from '../components/GameIcon';

interface SimulatorProps {
  altarWeapon: string | null;
  setAltarWeapon: (key: string | null) => void;
  altarPassive: string | null;
  setAltarPassive: (key: string | null) => void;
}

export const Simulator: React.FC<SimulatorProps> = ({
  altarWeapon,
  setAltarWeapon,
  altarPassive,
  setAltarPassive
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 匹配合成
  const match = VS_DATA.evolutions.find(
    evo => evo.weapon === altarWeapon && evo.passive === altarPassive
  );

  // 高亮与禁用的判定
  const allowedPassives = altarWeapon
    ? VS_DATA.evolutions.filter(evo => evo.weapon === altarWeapon).map(evo => evo.passive)
    : [];

  const allowedWeapons = altarPassive
    ? VS_DATA.evolutions.filter(evo => evo.passive === altarPassive).map(evo => evo.weapon)
    : [];

  const handleSelectWeapon = (key: string) => {
    if (altarWeapon === key) {
      setAltarWeapon(null);
    } else {
      setAltarWeapon(key);
    }
  };

  const handleSelectPassive = (key: string) => {
    if (altarPassive === key) {
      setAltarPassive(null);
    } else {
      setAltarPassive(key);
    }
  };

  // 搜索过滤后的项目
  const filteredWeaponKeys = Object.keys(VS_DATA.items).filter(key => {
    const item = VS_DATA.items[key];
    if (item.type !== 'base') return false;
    if (!searchQuery) return true;
    return (
      item.name.includes(searchQuery) ||
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.includes(searchQuery)
    );
  });

  const filteredPassiveKeys = Object.keys(VS_DATA.items).filter(key => {
    const item = VS_DATA.items[key];
    if (item.type !== 'passive') return false;
    if (!searchQuery) return true;
    return (
      item.name.includes(searchQuery) ||
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.includes(searchQuery)
    );
  });

  // 获取预测路径数据
  const getPreviewPaths = () => {
    if (!altarWeapon && !altarPassive) {
      return (
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
          💡 点击下方任意主武器，即可在此直接预览其可合成的被动、超武效果与专家点评
        </div>
      );
    }

    let matches: typeof VS_DATA.evolutions = [];
    if (altarWeapon) {
      matches = VS_DATA.evolutions.filter(evo => evo.weapon === altarWeapon);
    } else if (altarPassive) {
      matches = VS_DATA.evolutions.filter(evo => evo.passive === altarPassive);
    }

    if (matches.length === 0) {
      return (
        <div style={{ color: 'var(--glow-red)', fontSize: '0.8rem', textAlign: 'center' }}>
          ❌ 该物品暂无超武合成配方
        </div>
      );
    }

    const titleText = altarWeapon
      ? `🔮 「${VS_DATA.items[altarWeapon].name}」进化路径及超武特效`
      : `🔮 适配「${VS_DATA.items[altarPassive as string].name}」的可合成超武`;

    return (
      <>
        <div className="altar-preview-paths-title">{titleText}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {matches.map((evo) => {
            const w = VS_DATA.items[evo.weapon];
            const p = VS_DATA.items[evo.passive];
            const e = VS_DATA.items[evo.evolved];
            if (!w || !p || !e) return null;

            const condText = evo.cond ? (
              <span style={{ color: 'var(--glow-gold)', fontSize: '0.7rem', fontWeight: 'bold' }}>
                &nbsp;({evo.cond.replace('特殊：', '').replace('常规：', '')})
              </span>
            ) : null;

            return (
              <div className="preview-combo-row" key={`${evo.weapon}-${evo.passive}`}>
                <div className="preview-combo-formula" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem' }}>
                  <span
                    className="preview-combo-item-badge weapon-type"
                    onClick={() => handleSelectWeapon(evo.weapon)}
                    style={{ cursor: 'pointer' }}
                  >
                    <GameIcon item={w} size={20} /> {w.name}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)' }}>+</span>
                  <span
                    className="preview-combo-item-badge passive-type"
                    onClick={() => handleSelectPassive(evo.passive)}
                    style={{ cursor: 'pointer' }}
                  >
                    <GameIcon item={p} size={20} /> {p.name}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)' }}>➡️</span>
                  <span className="preview-combo-item-badge evolved-type">
                    <GameIcon item={e} size={20} /> {e.name}
                  </span>
                  {condText}
                  <button
                    onClick={() => {
                      setAltarWeapon(evo.weapon);
                      setAltarPassive(evo.passive);
                    }}
                    style={{
                      marginLeft: 'auto',
                      background: 'rgba(139,92,246,0.25)',
                      border: '1px solid var(--color-accent)',
                      color: '#fff',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    一键装载
                  </button>
                </div>
                <div className="preview-combo-desc" style={{ marginTop: '0.25rem', fontSize: '0.75rem', paddingLeft: '4px' }}>
                  <strong>合成超武效果：</strong>
                  {e.desc}
                  {e.review && (
                    <div style={{ color: '#94a3b8', fontStyle: 'italic', marginTop: '0.15rem' }}>
                      💬 点评：{e.review}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const getConditionTip = () => {
    if (!altarWeapon && !altarPassive) {
      return '💡 提示：在下方选择主武器和被动道具来测试合成配方';
    }
    if (!altarWeapon || !altarPassive) {
      return '💡 提示：继续选择另一个配件以查看是否能合成';
    }
    if (match) {
      return match.cond
        ? `⚠️ 进化条件：${match.cond}`
        : '💡 进化条件：主武器满级（8级） + 被动道具（1级即可）';
    }
    return '❌ 该主武器与被动道具不匹配，无法进化出超级武器！';
  };

  const getConditionTipClass = () => {
    if (altarWeapon && altarPassive && match && match.cond) {
      return 'altar-condition-tip special-cond';
    }
    return 'altar-condition-tip';
  };

  return (
    <div className="simulator-tab-content">
      {/* 祭坛区域 */}
      <div className="altar-section">
        <div className="altar-title">🧪 合成进化祭坛 (SYNTHESIZER ALTAR)</div>
        <div
          className="altar-slots"
          key={match ? `match-${match.evolved}` : 'no-match'}
          style={match ? { animation: 'altar-glow 0.8s ease-out' } : undefined}
        >
          {/* 主武器插槽 */}
          <div
            className={`altar-slot ${altarWeapon ? 'active' : ''}`}
            onClick={() => altarWeapon && setAltarWeapon(null)}
          >
            {altarWeapon ? (
              <>
                <span className="slot-icon">
                  <GameIcon item={VS_DATA.items[altarWeapon]} size={36} />
                </span>
                <span className="slot-name">{VS_DATA.items[altarWeapon].name}</span>
                <button
                  className="slot-clear"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAltarWeapon(null);
                  }}
                >
                  ×
                </button>
              </>
            ) : (
              <>
                <span className="slot-icon">❓</span>
                <span className="slot-name">选择主武器</span>
              </>
            )}
          </div>

          <div className="altar-plus">+</div>

          {/* 被动插槽 */}
          <div
            className={`altar-slot ${altarPassive ? 'active' : ''}`}
            onClick={() => altarPassive && setAltarPassive(null)}
          >
            {altarPassive ? (
              <>
                <span className="slot-icon">
                  <GameIcon item={VS_DATA.items[altarPassive]} size={36} />
                </span>
                <span className="slot-name">{VS_DATA.items[altarPassive].name}</span>
                <button
                  className="slot-clear"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAltarPassive(null);
                  }}
                >
                  ×
                </button>
              </>
            ) : (
              <>
                <span className="slot-icon">❓</span>
                <span className="slot-name">选择被动道具</span>
              </>
            )}
          </div>

          <div className="altar-equal">=</div>

          {/* 超武合成结果插槽 */}
          <div
            className={`altar-slot result-slot ${match ? 'evolved-active' : ''}`}
            style={{ borderStyle: altarWeapon && altarPassive ? 'solid' : 'dashed' }}
          >
            {altarWeapon && altarPassive ? (
              match ? (
                <>
                  <span className="slot-icon">
                    <GameIcon item={VS_DATA.items[match.evolved]} size={36} />
                  </span>
                  <span className="slot-name" style={{ color: 'var(--glow-gold)' }}>
                    {VS_DATA.items[match.evolved].name}
                  </span>
                </>
              ) : (
                <>
                  <span className="slot-icon">❌</span>
                  <span className="slot-name" style={{ color: 'var(--glow-red)' }}>
                    无法合成
                  </span>
                </>
              )
            ) : (
              <>
                <span className="slot-icon">❓</span>
                <span className="slot-name">进化超级武器</span>
              </>
            )}
          </div>
        </div>

        {/* 进化条件提示 */}
        <div className={getConditionTipClass()}>
          {getConditionTip()}
        </div>

        {/* 进化链路径预览 */}
        <div className="altar-preview-paths">
          {getPreviewPaths()}
        </div>
      </div>

      {/* 选择池过滤搜索 */}
      <div className="sim-search-box">
        <input
          type="text"
          placeholder="输入武器/道具名称或描述以全局过滤..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 选择池网格 */}
      <div className="sim-pools-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
        {/* 主武器池 */}
        <div>
          <h3 className="section-title" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', borderLeft: '3px solid var(--glow-blue)', paddingLeft: '5px' }}>
            ⚔️ 主武器选择池
          </h3>
          <div className="sim-grid" id="sim-weapons-grid">
            {filteredWeaponKeys.map(key => {
              const item = VS_DATA.items[key];
              const isSelected = altarWeapon === key;
              const isHighlighted = !altarWeapon && altarPassive && allowedWeapons.includes(key);
              const isDisabled = (altarPassive && !allowedWeapons.includes(key)) || (altarWeapon && !isSelected);

              let itemClass = 'sim-item';
              if (isSelected) itemClass += ' selected';
              if (isHighlighted) itemClass += ' highlighted';
              if (isDisabled) itemClass += ' disabled';

              return (
                <div
                  className={itemClass}
                  key={key}
                  onClick={() => handleSelectWeapon(key)}
                >
                  <span className="item-icon">
                    <GameIcon item={item} size={28} />
                  </span>
                  <span className="item-name">{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 被动道具池 */}
        <div>
          <h3 className="section-title" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', borderLeft: '3px solid var(--glow-green)', paddingLeft: '5px' }}>
            🛡️ 被动道具选择池
          </h3>
          <div className="sim-grid" id="sim-passives-grid">
            {filteredPassiveKeys.map(key => {
              const item = VS_DATA.items[key];
              const isSelected = altarPassive === key;
              const isHighlighted = !altarPassive && altarWeapon && allowedPassives.includes(key);
              const isDisabled = (altarWeapon && !allowedPassives.includes(key)) || (altarPassive && !isSelected);

              let itemClass = 'sim-item';
              if (isSelected) itemClass += ' selected';
              if (isHighlighted) itemClass += ' highlighted';
              if (isDisabled) itemClass += ' disabled';

              return (
                <div
                  className={itemClass}
                  key={key}
                  onClick={() => handleSelectPassive(key)}
                >
                  <span className="item-icon">
                    <GameIcon item={item} size={28} />
                  </span>
                  <span className="item-name">{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Simulator;
