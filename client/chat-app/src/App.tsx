import { Login } from "./components/Pages/LoginPage";
import "./style.css";

import { Register } from "./components/Pages/RegisterPage";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Websocket } from "./components/Websocket";
import { Toaster } from "react-hot-toast";
import { Route, Router, useRoute, useRouter } from "wouter";
import { Succesfull } from "./components/succesfull";
import { ConversationPage } from "./components/Pages/ConversationPage";
import { RouteParams } from "./interfaces/interface";
import { ConversationChannelPage } from "./components/conversations/ConversationChannelPage";
function App() {

  return (
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
      {/* <Websocket /> */}
    </div>
  );
}

export default App;
