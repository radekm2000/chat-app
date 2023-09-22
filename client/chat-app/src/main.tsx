import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { WebsocketProvider } from "./contexts/WebsocketContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext.tsx";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <WebsocketProvider>
          <App />
        </WebsocketProvider>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
