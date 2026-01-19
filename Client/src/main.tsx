import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import store, { persistor } from "./redux/store.tsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./config/stripe.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <Elements stripe={stripePromise}>
            <App />
          </Elements>
        </GoogleOAuthProvider>
      </StrictMode>
    </PersistGate>
  </Provider>
);
