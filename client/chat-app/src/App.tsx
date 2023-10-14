import { Login } from "./components/Pages/LoginPage";
import "./style.css";

import { Register } from "./components/Pages/RegisterPage";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Websocket } from "./components/Websocket";
import { Toaster } from "react-hot-toast";
import { Route } from "wouter";
import { Succesfull } from "./components/succesfull";
import { ConversationPage } from "./components/Pages/ConversationPage";
import { WebsocketContext, socket } from "./contexts/WebsocketContext";
import { PropsWithChildren } from "react";
import { UserContext, UserProvider } from "./contexts/UserContext";
import { useUser } from "./hooks/useUser";
import { useChatMsg } from "./hooks/useChatMsg";
import { ChatProvider } from "./contexts/ChatContext";

function AppWithProviders({ children }: PropsWithChildren) {
  const { user, setUser } = useUser();
  const { chatMessages, setChatMessages } = useChatMsg();
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
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/success">
              <Succesfull />
            </Route>
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
