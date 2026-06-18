import React, { useState, useEffect } from 'react';
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

  // iOS Safari 防多指缩放与手势捏合放大
  useEffect(() => {
    const preventPinch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    const preventGesture = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('touchstart', preventPinch, { passive: false });
    document.addEventListener('gesturestart', preventGesture);

    return () => {
      document.removeEventListener('touchstart', preventPinch);
      document.removeEventListener('gesturestart', preventGesture);
    };
  }, []);

  // 彻底根治移动端切换 Tab 时视口漂移/上移 bug
  useEffect(() => {
    // 强制视口滚动位置归零
    window.scrollTo(0, 0);
    if (document.body) document.body.scrollTop = 0;
    
    // 同时在切换 Tab 时，关闭所有打开的弹窗，保持界面干净
    setActiveWikiKey(null);
    setActiveCharKey(null);
  }, [activeTab]);

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
    <div className="container">
      {/* 炫酷像素霓虹页头 */}
      <header>
        <h1>🎮 吸血鬼幸存者 v1.15 百科 & 模拟器</h1>
        <div className="header-tag">DATABASE</div>
        <div className="subtitle">最全面的合成配方查询与配装属性雷达分析</div>
      </header>

      {/* 中间动态选项卡内容面板 (带移动端局部防偏移滚动) */}
      <div 
        className="tab-content active"
        id={activeTab}
        style={{ scrollBehavior: 'smooth' }}
      >
        {renderActiveTabContent()}
      </div>

      {/* 固底不横滚极简导航栏 */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
          onClick={() => setActiveTab('simulator')}
        >
          合成器
        </button>
        <button
          className={`tab-btn ${activeTab === 'encyclopedia' ? 'active' : ''}`}
          onClick={() => setActiveTab('encyclopedia')}
        >
          百科
        </button>
        <button
          className={`tab-btn ${activeTab === 'planner' ? 'active' : ''}`}
          onClick={() => setActiveTab('planner')}
        >
          规划器
        </button>
        <button
          className={`tab-btn ${activeTab === 'biography' ? 'active' : ''}`}
          onClick={() => setActiveTab('biography')}
        >
          角色志
        </button>
      </div>
    </div>
  );
};

export default App;
