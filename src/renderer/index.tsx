import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload scripts
// window.electron.ipcRenderer.once('lab-inspection', (arg) => {
//   // eslint-disable-next-line no-console
//   console.log('asfasf', arg);
// });
// window.electron.ipcRenderer.sendMessage('lab-inspection', ['ping']);
