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
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


const stripePromise = loadStripe("pk_test_51P6o5iSI4sHwXFd9ai7FZwPXRWCXfD0f7cWeKOVJwGqqvTLjWfrTzu90aqRLpHMI1wQNPOo7WtVgA2IXmXYLC1pu00udlJHjEd");


const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <CourseProvider>

            <NextUIProvider>
            <Elements stripe={stripePromise}>
              <Toaster richColors position="top-center" />
              <App />
             
            </Elements>
            </NextUIProvider>
          </CourseProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  
);
