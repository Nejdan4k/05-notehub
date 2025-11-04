import React from 'react';
import ReactDOM from 'react-dom/client';
import 'modern-normalize/modern-normalize.css';
import './index.css';
import './App.css'; // <— ВАЖЛИВО: точна назва файлу з тим самим регістром

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './components/App/App';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
