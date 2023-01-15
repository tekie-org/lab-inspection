/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ConfigureLab from './pages/ConfigureLab';
import tekieLogo from './assets/Tekie.png';
import closeIcon from './assets/Vector3.svg';
import minimizeIcon from './assets/Vector2.svg';

const Header = () => {
  return (
    <div className="header">
      <div className="header-left">
        <img src={tekieLogo} alt="logo" />
      </div>
      <div className="header-right">
        <img
          title="Minimize"
          src={minimizeIcon}
          alt="minimize"
          onClick={() => {
            window.electron.browser_window.sendMessage(
              'browser_window',
              'minimize'
            );
          }}
        />
        <img
          title="Close"
          src={closeIcon}
          alt="close"
          onClick={() => {
            window.electron.browser_window.sendMessage(
              'browser_window',
              'close'
            );
          }}
        />
      </div>
    </div>
  );
};

const Main = () => {
  const [system, setSystem] = React.useState({ osInfo: {} });

  const formatBytes = (bytes: any, decimals = 2) => {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    // eslint-disable-next-line no-restricted-properties
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  window.electron.ipcRenderer.once('ipc-example', (arg: any) => {
    // eslint-disable-next-line no-console
    console.log('asfasf', arg);
    setSystem(arg);
  });
  return (
    <>
      <Header />
      <ConfigureLab />
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
