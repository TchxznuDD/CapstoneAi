import React, { useState } from 'react';
import LoginPage from './login-page';
import AssetPreloader from './components/AssetPreloader';
import BakaupGlyph from './assets/BakaupGlyph.svg';
import DatabaseIcon from './assets/Database.svg';
import ServerIcon from './assets/ServerIcon.svg';
import CheckIcon from './assets/CheckNew.svg';

const criticalAssets = [BakaupGlyph, DatabaseIcon, ServerIcon, CheckIcon];

const App = () => {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  if (!assetsLoaded) {
    return (
      <AssetPreloader
        assets={criticalAssets}
        timeout={8000}
        minVisible={800}
        logo={BakaupGlyph}
        onComplete={() => setAssetsLoaded(true)}
      />
    );
  }

  return (
    <div>
      <LoginPage />
    </div>
  );
};

export default App;