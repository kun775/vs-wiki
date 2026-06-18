import React, { useState, Suspense, lazy } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import Icon from './components/Icon';

const Simulator = lazy(() => import('./views/Simulator'));
const Encyclopedia = lazy(() => import('./views/Encyclopedia'));
const Planner = lazy(() => import('./views/Planner'));
const Biography = lazy(() => import('./views/Biography'));

const TabFallback: React.FC = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '200px', color: 'var(--color-text-dim)', fontSize: '0.9rem'
  }}>
    加载中...
  </div>
);

interface TabDef {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Icon>['name'];
}

const tabs: TabDef[] = [
  { key: 'simulator', label: '合成', icon: 'flask' },
  { key: 'encyclopedia', label: '百科', icon: 'book' },
  { key: 'planner', label: '规划', icon: 'chart' },
  { key: 'biography', label: '角色', icon: 'user' },
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('simulator');

  // 合成祭坛状态
  const [altarWeapon, setAltarWeapon] = useState<string | null>(null);
  const [altarPassive, setAltarPassive] = useState<string | null>(null);

  // 配装规划器状态
  const [buildWeapons, setBuildWeapons] = useState<(string | null)[]>(Array(6).fill(null));
  const [buildPassives, setBuildPassives] = useState<(string | null)[]>(Array(6).fill(null));

  // 弹窗状态
  const [activeWikiKey, setActiveWikiKey] = useState<string | null>(null);
  const [activeCharKey, setActiveCharKey] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo(0, 0);
    setActiveWikiKey(null);
    setActiveCharKey(null);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'simulator':
        return (
          <Simulator
            altarWeapon={altarWeapon}
            setAltarWeapon={setAltarWeapon}
            altarPassive={altarPassive}
            setAltarPassive={setAltarPassive}
          />
        );
      case 'encyclopedia':
        return (
          <Encyclopedia
            activeWikiKey={activeWikiKey}
            setActiveWikiKey={setActiveWikiKey}
          />
        );
      case 'planner':
        return (
          <Planner
            buildWeapons={buildWeapons}
            setBuildWeapons={setBuildWeapons}
            buildPassives={buildPassives}
            setBuildPassives={setBuildPassives}
            setAltarWeapon={setAltarWeapon}
            setAltarPassive={setAltarPassive}
            setActiveTab={setActiveTab}
          />
        );
      case 'biography':
        return (
          <Biography
            activeCharKey={activeCharKey}
            setActiveCharKey={setActiveCharKey}
            setActiveWikiKey={setActiveWikiKey}
            setActiveTab={setActiveTab}
            setAltarWeapon={setAltarWeapon}
            setAltarPassive={setAltarPassive}
            setBuildWeapons={setBuildWeapons}
            setBuildPassives={setBuildPassives}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="container">
        <header>
          <h1>
            <Icon name="gamepad" size={22} style={{ marginRight: '6px', color: 'var(--color-accent)' }} />
            吸血鬼幸存者 v1.15 百科 &amp; 模拟器
          </h1>
          <div className="header-tag">DATABASE</div>
          <div className="subtitle">最全面的合成配方查询与配装属性雷达分析</div>
        </header>

        <div
          className="tab-content active"
          id={activeTab}
          style={{ scrollBehavior: 'smooth' }}
        >
          <Suspense fallback={<TabFallback />}>
            {renderActiveTabContent()}
          </Suspense>
        </div>

        <nav className="tabs-nav" role="tablist" aria-label="功能导航">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.key)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTabChange(tab.key);
                }
              }}
              role="tab"
              aria-selected={activeTab === tab.key}
              tabIndex={activeTab === tab.key ? 0 : -1}
            >
              <Icon name={tab.icon} size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </ErrorBoundary>
  );
};

export default App;
