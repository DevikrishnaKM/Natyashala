import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import store, { persistor } from "./redux/store.ts";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>

  < Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StrictMode>
        <Toaster richColors position="top-center"/>
        <App />
      </StrictMode>
    </PersistGate>
  </Provider>
 </QueryClientProvider>
)
