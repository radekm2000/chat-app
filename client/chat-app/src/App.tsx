import { Register } from "./components/Register";
import { Websocket } from "./components/Websocket";
import { Button123 } from "./components/button";
import {Toaster} from 'react-hot-toast'

function App() {
  return (
    <div className="ChatApp">
      {/* <Websocket /> */}
      <Register />
      <Button123></Button123>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
