import React, { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import Simulator from './views/Simulator';
import Encyclopedia from './views/Encyclopedia';
import Planner from './views/Planner';
import Biography from './views/Biography';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('simulator');

  // 合成祭坛状态
  const [altarWeapon, setAltarWeapon] = useState<string | null>(null);
  const [altarPassive, setAltarPassive] = useState<string | null>(null);

  // 配装规划器状态
  const [buildWeapons, setBuildWeapons] = useState<(string | null)[]>(Array(6).fill(null));
  const [buildPassives, setBuildPassives] = useState<(string | null)[]>(Array(6).fill(null));

  // 弹窗状态 (Key)
  const [activeWikiKey, setActiveWikiKey] = useState<string | null>(null);
  const [activeCharKey, setActiveCharKey] = useState<string | null>(null);

  // 切换 Tab：重置滚动 + 关闭弹窗
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
          <h1>🎮 吸血鬼幸存者 v1.15 百科 & 模拟器</h1>
          <div className="header-tag">DATABASE</div>
          <div className="subtitle">最全面的合成配方查询与配装属性雷达分析</div>
        </header>

        <div
          className="tab-content active"
          id={activeTab}
          style={{ scrollBehavior: 'smooth' }}
        >
          {renderActiveTabContent()}
        </div>

        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => handleTabChange('simulator')}
          >
            合成器
          </button>
          <button
            className={`tab-btn ${activeTab === 'encyclopedia' ? 'active' : ''}`}
            onClick={() => handleTabChange('encyclopedia')}
          >
            百科
          </button>
          <button
            className={`tab-btn ${activeTab === 'planner' ? 'active' : ''}`}
            onClick={() => handleTabChange('planner')}
          >
            规划器
          </button>
          <button
            className={`tab-btn ${activeTab === 'biography' ? 'active' : ''}`}
            onClick={() => handleTabChange('biography')}
          >
            角色志
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
