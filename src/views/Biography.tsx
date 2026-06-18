import React, { useState } from 'react';
import { VS_DATA } from '../data/vsData';
import type { Character } from '../data/vsData';
import GameIcon from '../components/GameIcon';
import Icon from '../components/Icon';
import { Modal } from '../components/Modal';

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
  activeCharKey, setActiveCharKey, setActiveWikiKey, setActiveTab,
  setAltarWeapon, setAltarPassive, setBuildWeapons, setBuildPassives
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dlcFilter, setDlcFilter] = useState('all');

  const handleImportToAltar = (char: Character) => {
    const weaponKey = char.initWeaponKey;
    if (weaponKey && VS_DATA.items[weaponKey]) {
      setAltarWeapon(weaponKey);
    }
    if (char.recommends && char.recommends.length > 0) {
      const firstPassive = char.recommends.find(r => {
        const item = VS_DATA.items[r];
        return item && item.type === 'passive';
      });
      setAltarPassive(firstPassive || null);
    } else {
      setAltarPassive(null);
    }
    setActiveTab('simulator');
    setActiveCharKey(null);
  };

  const handleImportToBuild = (char: Character) => {
    const newWeapons: (string | null)[] = Array(6).fill(null);
    const newPassives: (string | null)[] = Array(6).fill(null);
    const weaponKey = char.initWeaponKey;
    if (weaponKey && VS_DATA.items[weaponKey]) {
      if (VS_DATA.items[weaponKey].type === 'base') newWeapons[0] = weaponKey;
      else if (VS_DATA.items[weaponKey].type === 'passive') newPassives[0] = weaponKey;
    }
    let wIdx = newWeapons[0] ? 1 : 0;
    let pIdx = newPassives[0] ? 1 : 0;
    if (char.recommends) {
      char.recommends.forEach(rKey => {
        const item = VS_DATA.items[rKey];
        if (!item) return;
        if (item.type === 'base') {
          if (wIdx < 6 && !newWeapons.includes(rKey)) { newWeapons[wIdx] = rKey; wIdx++; }
        } else if (item.type === 'passive') {
          if (pIdx < 6 && !newPassives.includes(rKey)) { newPassives[pIdx] = rKey; pIdx++; }
        }
      });
    }
    setBuildWeapons(newWeapons);
    setBuildPassives(newPassives);
    setActiveTab('planner');
    setActiveCharKey(null);
  };

  const handleJumpToWiki = (key: string) => {
    setActiveWikiKey(key);
    setActiveTab('encyclopedia');
  };

  const filteredCharKeys = Object.keys(VS_DATA.characters).filter(key => {
    const char = VS_DATA.characters[key];
    if (dlcFilter !== 'all' && char.category !== dlcFilter) return false;
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
      <div className="wiki-filter-panel" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', background: 'rgba(15, 7, 27, 0.5)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.15)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', alignItems: 'center' }}>
          {Object.keys(VS_DATA.categories).map(catKey => (
            <button key={catKey}
              className={`filter-badge ${dlcFilter === catKey ? 'active' : ''}`}
              onClick={() => setDlcFilter(catKey)}
            >
              {VS_DATA.categories[catKey]}
            </button>
          ))}
        </div>
        <div className="sim-search-box" style={{ width: '100%', margin: 0 }}>
          <input type="text" placeholder="搜索角色名字或解锁条件..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="搜索角色" />
        </div>
      </div>

      <div className="char-grid">
        {filteredCharKeys.map(key => {
          const char = VS_DATA.characters[key];
          const initWeapon = VS_DATA.items[char.initWeaponKey];
          return (
            <div className="char-card" key={key}
              onClick={() => setActiveCharKey(key)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveCharKey(key); } }}
              role="button" tabIndex={0}
            >
              <div className="char-card-header">
                <div className="char-avatar-box">
                  <GameIcon item={char} size={32} />
                </div>
                <div className="char-name-group">
                  <h4>{char.name}</h4>
                  <span>{char.nameEn}</span>
                </div>
              </div>
              <div className="char-desc-block">
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                  <Icon name="mask" size={14} style={{ color: 'var(--color-text-dim)' }} />
                  <strong>特性：</strong>
                </div>
                {char.passiveDesc}
              </div>
              <div className="char-unlock-cond">
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                  <Icon name="key" size={14} style={{ color: 'var(--glow-gold)' }} />
                  <strong>解锁：</strong>
                </div>
                {char.unlock}
              </div>
              <div className="char-build-section" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.25rem', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Icon name="gun" size={14} style={{ color: 'var(--color-text-dim)' }} />
                  <strong>初始武器:</strong>&nbsp;
                  {initWeapon ? (
                    <span style={{ color: 'var(--color-text-muted)' }}>{initWeapon.name}</span>
                  ) : '无'}
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                  <Icon name="shield" size={14} style={{ color: 'var(--color-text-dim)' }} />
                  <div>
                    <strong>推荐装配:</strong>&nbsp;
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      {char.recommends.map(r => VS_DATA.items[r]?.name).filter(Boolean).slice(0, 3).join(', ')}...
                    </span>
                  </div>
                </div>
              </div>
              <div className="char-actions">
                <button className="char-action-btn" onClick={(e) => { e.stopPropagation(); handleImportToAltar(char); }}
                  title="将该角色初始武器放入合成祭坛">
                  <Icon name="flask" size={14} />
                  导入合成
                </button>
                <button className="char-action-btn" onClick={(e) => { e.stopPropagation(); handleImportToBuild(char); }}
                  title="将该角色推荐配装导入规划器">
                  <Icon name="shield" size={14} />
                  导入 Build
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!activeChar && !!activeCharKey} onClose={() => setActiveCharKey(null)}>
        {activeChar && activeCharKey && (
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span className="char-badge" style={{ position: 'static', alignSelf: 'flex-start', margin: 0 }}>
                {VS_DATA.categories[activeChar.category] || '未知'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                <div className="char-avatar-box" style={{
                  background: 'rgba(255,255,255,0.05)', width: '56px', height: '56px',
                  borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
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
                <div className="char-prop-title" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.25rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  <Icon name="mask" size={16} />
                  专属被动/特性
                </div>
                <div className="char-desc-block" style={{ fontSize: '0.85rem', lineHeight: 1.4, background: 'rgba(0,0,0,0.25)', padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                  {activeChar.passiveDesc}
                </div>
              </div>
              <div>
                <div className="char-prop-title" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.25rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  <Icon name="key" size={16} />
                  获取解锁条件
                </div>
                <div className="char-unlock-cond" style={{ fontSize: '0.85rem', lineHeight: 1.4, color: 'var(--glow-gold)', background: 'rgba(255,215,0,0.05)', padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(255,215,0,0.1)' }}>
                  {activeChar.unlock}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                <div>
                  <div className="char-prop-title" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                    <Icon name="gun" size={16} />
                    初始武器
                  </div>
                  <div>
                    {VS_DATA.items[activeChar.initWeaponKey] ? (
                      <span className="char-interactive-item"
                        onClick={() => handleJumpToWiki(activeChar.initWeaponKey)}
                        title={`点击在百科中查看: ${VS_DATA.items[activeChar.initWeaponKey].name}`}>
                        <GameIcon item={VS_DATA.items[activeChar.initWeaponKey]} size={20} /> {VS_DATA.items[activeChar.initWeaponKey].name}
                      </span>
                    ) : '无'}
                  </div>
                </div>
                <div>
                  <div className="char-prop-title" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                    <Icon name="shield" size={16} />
                    推荐装配 (Build)
                  </div>
                  <div className="char-build-items">
                    {activeChar.recommends.map(rKey => {
                      const item = VS_DATA.items[rKey];
                      if (!item) return null;
                      return (
                        <span className="char-interactive-item" key={rKey}
                          onClick={() => handleJumpToWiki(rKey)}
                          title={`点击在百科中查看: ${item.name}`}>
                          <GameIcon item={item} size={20} /> {item.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="char-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button className="char-action-btn"
                  onClick={() => handleImportToAltar(activeChar)}
                  title="将该角色初始武器放入合成祭坛"
                  style={{ padding: '0.6rem', fontSize: '0.85rem', borderRadius: '8px', cursor: 'pointer' }}>
                  <Icon name="flask" size={16} />
                  导入合成
                </button>
                <button className="char-action-btn"
                  onClick={() => handleImportToBuild(activeChar)}
                  title="将该角色装配一键填入规划器"
                  style={{ padding: '0.6rem', fontSize: '0.85rem', borderRadius: '8px', cursor: 'pointer' }}>
                  <Icon name="shield" size={16} />
                  导入 Build
                </button>
              </div>
            </div>
        )}
      </Modal>
    </div>
  );
};
export default Biography;
