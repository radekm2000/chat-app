import { Login } from "./components/Pages/LoginPage";
import "./style.css";

import { Register } from "./components/Pages/RegisterPage";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Toaster } from "react-hot-toast";
import { Route } from "wouter";
import { ConversationPage } from "./components/Pages/ConversationPage";
import { WebsocketContext, socket } from "./contexts/WebsocketContext";
import { PropsWithChildren } from "react";
import { UserProvider } from "./contexts/UserContext";
import { ChatProvider } from "./contexts/ChatContext";
import { UserMailVerification } from "./components/Pages/UserMailVerification";
import { ChangePassword } from "./components/Pages/ChangePassword";
import { NotFound } from "./components/Pages/NotFound";

function AppWithProviders({ children }: PropsWithChildren) {
  return (
    <WebsocketContext.Provider value={socket}>
      {children}
    </WebsocketContext.Provider>
  );
}

function App() {
  return (
    <AppWithProviders>
      <UserProvider>
        <ChatProvider>
          <div className="ChatApp">
            <Route path="/conversations/:id*">
              <ConversationPage />
            </Route>

            <Route path="/register">
              <Register />
            </Route>
            <Route path="">
              <Login />
            </Route>
            <Route path="/user-mail-verification">
              <UserMailVerification />
            </Route>

            <Route
              path="/resetPassword/:token/:userId"
              component={ChangePassword}
            ></Route>
            <Toaster
              position="top-center"
              toastOptions={{
                style: { background: "#363636", color: "#fff" },
              }}
            ></Toaster>
          </div>
        </ChatProvider>
      </UserProvider>
    </AppWithProviders>
  );
}

export default App;
