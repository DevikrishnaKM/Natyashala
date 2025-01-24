import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import store, { persistor } from "./redux/store.ts";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";
import { CourseProvider } from "./context/courseContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <CourseProvider>
            <NextUIProvider>
              <Toaster richColors position="top-center" />
              <App />
            </NextUIProvider>
          </CourseProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
