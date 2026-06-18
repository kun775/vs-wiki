import React, { useState } from 'react';
import { VS_DATA } from '../data/vsData';
import type { Character } from '../data/vsData';
import GameIcon from '../components/GameIcon';

interface BiographyProps {
  activeCharKey: string | null;
  setActiveCharKey: (key: string | null) => void;
  setActiveWikiKey: (key: string | null) => void;
  setActiveTab: (tab: string) => void;
  setAltarWeapon: (key: string | null) => void;
  setAltarPassive: (key: string | null) => void;
  setBuildWeapons: (weapons: (string | null)[]) => void;
  setBuildPassives: (passives: (string | null)[]) => void;
}

export const Biography: React.FC<BiographyProps> = ({
  activeCharKey,
  setActiveCharKey,
  setActiveWikiKey,
  setActiveTab,
  setAltarWeapon,
  setAltarPassive,
  setBuildWeapons,
  setBuildPassives
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dlcFilter, setDlcFilter] = useState('all');

  // 一键导入合成
  const handleImportToAltar = (char: Character) => {
    // 初始武器
    const weaponKey = char.initWeaponKey;
    if (weaponKey && VS_DATA.items[weaponKey]) {
      setAltarWeapon(weaponKey);
    }
    
    // 尝试寻找第一款推荐被动装填
    if (char.recommends && char.recommends.length > 0) {
      const firstPassive = char.recommends.find(r => {
        const item = VS_DATA.items[r];
        return item && item.type === 'passive';
      });
      if (firstPassive) {
        setAltarPassive(firstPassive);
      } else {
        setAltarPassive(null);
      }
    } else {
      setAltarPassive(null);
    }
    
    setActiveTab('simulator');
    setActiveCharKey(null);
  };

  // 一键导入 Build
  const handleImportToBuild = (char: Character) => {
    const newWeapons: (string | null)[] = Array(6).fill(null);
    const newPassives: (string | null)[] = Array(6).fill(null);
    
    // 1. 填入初始武器到第一个主武器槽
    const weaponKey = char.initWeaponKey;
    if (weaponKey && VS_DATA.items[weaponKey]) {
      if (VS_DATA.items[weaponKey].type === 'base') {
        newWeapons[0] = weaponKey;
      } else if (VS_DATA.items[weaponKey].type === 'passive') {
        newPassives[0] = weaponKey;
      }
    }

    // 2. 依次填入推荐装备到槽位
    let wIdx = newWeapons[0] ? 1 : 0;
    let pIdx = newPassives[0] ? 1 : 0;

    if (char.recommends) {
      char.recommends.forEach(rKey => {
        const item = VS_DATA.items[rKey];
        if (!item) return;

        if (item.type === 'base') {
          if (wIdx < 6 && !newWeapons.includes(rKey)) {
            newWeapons[wIdx] = rKey;
            wIdx++;
          }
        } else if (item.type === 'passive') {
          if (pIdx < 6 && !newPassives.includes(rKey)) {
            newPassives[pIdx] = rKey;
            pIdx++;
          }
        }
      });
    }

    setBuildWeapons(newWeapons);
    setBuildPassives(newPassives);
    setActiveTab('planner');
    setActiveCharKey(null);
  };

  // 辅助跳转到百科物品
  const handleJumpToWiki = (key: string) => {
    setActiveWikiKey(key);
    setActiveTab('encyclopedia');
  };

  // 过滤角色
  const filteredCharKeys = Object.keys(VS_DATA.characters).filter(key => {
    const char = VS_DATA.characters[key];

    // DLC 过滤
    if (dlcFilter !== 'all' && char.category !== dlcFilter) return false;

    // 检索过滤
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = char.name.includes(searchQuery);
      const nameEnMatch = char.nameEn.toLowerCase().includes(q);
      const passiveMatch = char.passiveDesc.toLowerCase().includes(q);
      const unlockMatch = char.unlock.toLowerCase().includes(q);
      const categoryName = (VS_DATA.categories[char.category] || '').includes(searchQuery);
      if (!nameMatch && !nameEnMatch && !passiveMatch && !unlockMatch && !categoryName) return false;
    }

    return true;
  });

  const activeChar = activeCharKey ? VS_DATA.characters[activeCharKey] : null;

  return (
    <div className="char-tab-content">
      {/* 检索与过滤器面板 */}
      <div className="wiki-filter-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', background: 'rgba(23, 12, 41, 0.4)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginRight: '0.2rem' }}>DLC 版本:</span>
          <button
            className={`filter-badge ${dlcFilter === 'all' ? 'active' : ''}`}
            onClick={() => setDlcFilter('all')}
          >
            全部
          </button>
          {Object.keys(VS_DATA.categories).map(catKey => (
            <button
              key={catKey}
              className={`filter-badge ${dlcFilter === catKey ? 'active' : ''}`}
              onClick={() => setDlcFilter(catKey)}
            >
              {VS_DATA.categories[catKey]}
            </button>
          ))}
        </div>

        <div className="sim-search-box" style={{ width: '100%', margin: '0.4rem 0 0 0' }}>
          <input
            type="text"
            placeholder="输入角色名字、解锁条件或被动特性检索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 角色卡片列表 */}
      <div className="char-grid">
        {filteredCharKeys.map(key => {
          const char = VS_DATA.characters[key];
          const dlcName = VS_DATA.categories[char.category] || '未知';
          const initWeapon = VS_DATA.items[char.initWeaponKey];

          return (
            <div
              className="char-card"
              key={key}
              onClick={() => setActiveCharKey(key)}
              style={{ cursor: 'pointer' }}
            >
              <div className="char-card-header">
                <div className="char-avatar-box">
                  <GameIcon item={char} size={48} />
                </div>
                <div className="char-name-group">
                  <h4>{char.name}</h4>
                  <span>{char.nameEn}</span>
                </div>
                <span className="char-badge">{dlcName}</span>
              </div>
              <div className="char-desc-block">
                <strong>🎭 特性：</strong>
                {char.passiveDesc}
              </div>
              <div className="char-unlock-cond">
                <strong>🔑 解锁：</strong>
                {char.unlock}
              </div>
              <div className="char-build-section" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.25rem', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                <div>
                  <strong>🔫 初始武器:</strong>&nbsp;
                  {initWeapon ? (
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      {initWeapon.icon} {initWeapon.name}
                    </span>
                  ) : '无'}
                </div>
                <div>
                  <strong>🛡️ 推荐装配:</strong>&nbsp;
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    {char.recommends.map(r => VS_DATA.items[r]?.name).filter(Boolean).slice(0, 3).join(', ')}...
                  </span>
                </div>
              </div>
              <div className="char-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.5rem' }}>
                <button
                  className="char-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImportToAltar(char);
                  }}
                  title="将该角色初始武器放入合成祭坛"
                >
                  🧪 导入合成
                </button>
                <button
                  className="char-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImportToBuild(char);
                  }}
                  title="将该角色推荐配装导入规划器"
                >
                  🛡️ 导入 Build
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 角色详情弹窗 */}
      {activeChar && activeCharKey && (
        <>
          <div
            className="modal-backdrop"
            id="char-detail-backdrop"
            style={{ display: 'block' }}
            onClick={() => setActiveCharKey(null)}
          />
          <div
            className="modal"
            id="char-detail-modal"
            style={{ display: 'block' }}
          >
            <button
              onClick={() => setActiveCharKey(null)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '12px',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '1.5rem',
                cursor: 'pointer',
                lineHeight: 1
              }}
            >
              &times;
            </button>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span className="char-badge" style={{ position: 'static', alignSelf: 'flex-start', margin: 0 }}>
                {VS_DATA.categories[activeChar.category] || '未知'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                <div
                  className="char-avatar-box"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    width: '56px',
                    height: '56px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <GameIcon item={activeChar} size={48} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 600, margin: 0, lineHeight: 1.2 }}>
                    {activeChar.name}
                  </h3>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    {activeChar.nameEn}
                  </span>
                </div>
              </div>

              <div>
                <div className="char-prop-title" style={{ marginBottom: '0.25rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  🎭 专属被动/特性
                </div>
                <div
                  className="char-desc-block"
                  style={{ fontSize: '0.85rem', lineHeight: 1.4, background: 'rgba(0,0,0,0.25)', padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}
                >
                  {activeChar.passiveDesc}
                </div>
              </div>

              <div>
                <div className="char-prop-title" style={{ marginBottom: '0.25rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  🔑 获取解锁条件
                </div>
                <div
                  className="char-unlock-cond"
                  style={{ fontSize: '0.85rem', lineHeight: 1.4, color: 'var(--glow-gold)', background: 'rgba(255,215,0,0.05)', padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(255,215,0,0.1)' }}
                >
                  {activeChar.unlock}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                <div>
                  <div className="char-prop-title" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                    🔫 初始武器
                  </div>
                  <div>
                    {VS_DATA.items[activeChar.initWeaponKey] ? (
                      <span
                        className="char-interactive-item"
                        onClick={() => handleJumpToWiki(activeChar.initWeaponKey)}
                        style={{ cursor: 'pointer' }}
                        title={`点击在百科中查看: ${VS_DATA.items[activeChar.initWeaponKey].name}`}
                      >
                        <GameIcon item={VS_DATA.items[activeChar.initWeaponKey]} size={20} /> {VS_DATA.items[activeChar.initWeaponKey].name}
                      </span>
                    ) : '无'}
                  </div>
                </div>
                <div>
                  <div className="char-prop-title" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                    🛡️ 推荐装配 (Build)
                  </div>
                  <div className="char-build-items" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {activeChar.recommends.map(rKey => {
                      const item = VS_DATA.items[rKey];
                      if (!item) return null;
                      return (
                        <span
                          className="char-interactive-item"
                          key={rKey}
                          onClick={() => handleJumpToWiki(rKey)}
                          style={{ cursor: 'pointer' }}
                          title={`点击在百科中查看: ${item.name}`}
                        >
                          <GameIcon item={item} size={20} /> {item.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="char-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  className="char-action-btn"
                  onClick={() => handleImportToAltar(activeChar)}
                  title="将该角色初始武器放入合成祭坛"
                  style={{ padding: '0.6rem', fontSize: '0.85rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  🧪 导入合成
                </button>
                <button
                  className="char-action-btn"
                  onClick={() => handleImportToBuild(activeChar)}
                  title="将该角色装配一键填入规划器"
                  style={{ padding: '0.6rem', fontSize: '0.85rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  🛡️ 导入 Build
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Biography;
