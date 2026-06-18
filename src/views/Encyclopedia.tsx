import React, { useState } from 'react';
import { VS_DATA } from '../data/vsData';
import type { GameItem } from '../data/vsData';
import GameIcon from '../components/GameIcon';
import { Modal } from '../components/Modal';

interface EncyclopediaProps {
  activeWikiKey: string | null;
  setActiveWikiKey: (key: string | null) => void;
}

export const Encyclopedia: React.FC<EncyclopediaProps> = ({
  activeWikiKey,
  setActiveWikiKey
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dlcFilter, setDlcFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // 获取道具对应的超武合成信息
  const getEvoInfo = (key: string, item: GameItem) => {
    if (item.type === 'base' || item.type === 'passive') {
      const evo = VS_DATA.evolutions.find(e => e.weapon === key || e.passive === key);
      if (evo) {
        const partnerKey = item.type === 'base' ? evo.passive : evo.weapon;
        const partner = VS_DATA.items[partnerKey];
        const evolved = VS_DATA.items[evo.evolved];
        if (partner && evolved) {
          const condText = evo.cond ? (
            <div style={{ color: 'var(--glow-gold)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              ⚠️ 条件：{evo.cond}
            </div>
          ) : null;
          return (
            <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                🧪 超武合成配方
              </div>
              <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                <span 
                  onClick={() => setActiveWikiKey(key)}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  <GameIcon item={item} size={20} /> {item.name}
                </span>
                &nbsp;+&nbsp;
                <span 
                  onClick={() => setActiveWikiKey(partnerKey)}
                  style={{ cursor: 'pointer', textDecoration: 'underline', color: 'var(--color-text-muted)' }}
                >
                  <GameIcon item={partner} size={20} /> {partner.name}
                </span>
                <br />
                ➡️&nbsp;
                <strong 
                  onClick={() => setActiveWikiKey(evo.evolved)}
                  style={{ cursor: 'pointer', textDecoration: 'underline', color: 'var(--glow-gold)' }}
                >
                  <GameIcon item={evolved} size={20} /> {evolved.name}
                </strong>
                {condText}
              </div>
            </div>
          );
        }
      }
    } else if (item.type === 'evolved') {
      const match = VS_DATA.evolutions.find(e => e.evolved === key);
      if (match) {
        const w = VS_DATA.items[match.weapon];
        const p = VS_DATA.items[match.passive];
        if (w && p) {
          const condText = match.cond ? (
            <div style={{ color: 'var(--glow-gold)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              ⚠️ 要求：{match.cond}
            </div>
          ) : (
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              💡 要求：主武器满级 + 被动1级
            </div>
          );
          return (
            <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                🧪 合成公式
              </div>
              <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                <span 
                  onClick={() => setActiveWikiKey(match.weapon)}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  <GameIcon item={w} size={20} /> {w.name}
                </span>
                &nbsp;+&nbsp;
                <span 
                  onClick={() => setActiveWikiKey(match.passive)}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  <GameIcon item={p} size={20} /> {p.name}
                </span>
                {condText}
              </div>
            </div>
          );
        }
      }
    }
    return null;
  };

  // 过滤百科物品
  const filteredItemKeys = Object.keys(VS_DATA.items).filter(key => {
    const item = VS_DATA.items[key];

    // DLC 过滤
    if (dlcFilter !== 'all' && item.category !== dlcFilter) return false;

    // 类型过滤
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;

    // 搜索词过滤
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = item.name.includes(searchQuery);
      const nameEnMatch = item.nameEn.toLowerCase().includes(q);
      const descMatch = item.desc.toLowerCase().includes(q);
      const categoryName = (VS_DATA.categories[item.category] || '').includes(searchQuery);
      if (!nameMatch && !nameEnMatch && !descMatch && !categoryName) return false;
    }

    return true;
  });

  const activeItem = activeWikiKey ? VS_DATA.items[activeWikiKey] : null;

  return (
    <div className="wiki-tab-content">
      {/* 过滤器面板 */}
      <div className="wiki-filter-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', background: 'rgba(23, 12, 41, 0.4)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
        {/* DLC 分类过滤 */}
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

        {/* 道具类型过滤 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center', marginLeft: 'auto' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginRight: '0.2rem' }}>类型:</span>
          <button
            className={`filter-badge ${typeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTypeFilter('all')}
          >
            全部
          </button>
          <button
            className={`filter-badge ${typeFilter === 'base' ? 'active' : ''}`}
            onClick={() => setTypeFilter('base')}
          >
            主武器
          </button>
          <button
            className={`filter-badge ${typeFilter === 'passive' ? 'active' : ''}`}
            onClick={() => setTypeFilter('passive')}
          >
            被动道具
          </button>
          <button
            className={`filter-badge ${typeFilter === 'evolved' ? 'active' : ''}`}
            onClick={() => setTypeFilter('evolved')}
          >
            超级武器
          </button>
        </div>

        {/* 文本搜索输入框 */}
        <div className="sim-search-box" style={{ width: '100%', margin: '0.4rem 0 0 0' }}>
          <input
            type="text"
            placeholder="输入武器名称、描述或 DLC 检索词..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 道具列表网格 */}
      <div className="wiki-grid">
        {filteredItemKeys.map(key => {
          const item = VS_DATA.items[key];
          const dlcName = VS_DATA.categories[item.category] || '未知';
          const stars = '⭐'.repeat(Math.floor(item.rating || 3));
          const typeLabel = item.type === 'base' ? '主武器' : item.type === 'passive' ? '被动' : '超级武器';

          return (
            <div
              className="wiki-card"
              key={key}
              onClick={() => setActiveWikiKey(key)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveWikiKey(key); } }}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              <span className="wiki-card-badge">{dlcName}</span>
              <div className="wiki-card-header">
                <div className="wiki-card-icon">
                  <GameIcon item={item} size={36} />
                </div>
                <div className="wiki-card-title">
                  <h4>{item.name}</h4>
                  <span>{item.nameEn}</span>
                </div>
              </div>
              <p className="wiki-card-desc">{item.desc}</p>
              <div className="wiki-card-footer">
                <span className="wiki-rating">{stars}</span>
                <span className="wiki-type">{typeLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 百科详情弹窗 */}
      <Modal open={!!activeItem && !!activeWikiKey} onClose={() => setActiveWikiKey(null)}>
        {activeItem && activeWikiKey && (
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span className="wiki-card-badge" style={{ position: 'static', alignSelf: 'flex-start', margin: 0 }}>
                {VS_DATA.categories[activeItem.category] || '未知'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                <div
                  className="wiki-card-icon"
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
                  <GameIcon item={activeItem} size={44} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 600, margin: 0, lineHeight: 1.2 }}>
                    {activeItem.name}
                  </h3>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    {activeItem.nameEn}
                  </span>
                </div>
              </div>
              <p
                style={{
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  color: 'var(--color-text)',
                  background: 'rgba(0,0,0,0.25)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.03)',
                  margin: 0
                }}
              >
                {activeItem.desc}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                <span>评分: {'⭐'.repeat(Math.floor(activeItem.rating || 3))}</span>
                <span>类型: {activeItem.type === 'base' ? '主武器' : activeItem.type === 'passive' ? '被动' : '超级武器'}</span>
              </div>

              {getEvoInfo(activeWikiKey, activeItem)}
            </div>
        )}
      </Modal>
    </div>
  );
};
export default Encyclopedia;
