import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Websocket } from "./components/Websocket";
import { Toaster } from "react-hot-toast";
import { Route } from "wouter";
import { Succesfull } from "./components/succesfull";
function App() {
  return (
    <div className="ChatApp">
      <Route path="/"><Register/></Route>
      <Route path="/login"><Login/></Route>
      <Route path='/success'><Succesfull/></Route>
      <Toaster position="top-center" />
      {/* <Websocket /> */}

    </div>
  );
}

export default App;
