import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import store from 'app/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'assets/styles/keen/theme01/style.bundle.css';
import 'assets/styles/keen/theme01/plugins.bundle.css';
import 'assets/styles/app.style.scss';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <I18nextProvider>
      <App />
    </I18nextProvider>
  </Provider>
);

reportWebVitals();
