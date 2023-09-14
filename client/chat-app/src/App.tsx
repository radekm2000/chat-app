import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { WebsocketProvider, socket } from "./contexts/WebsocketContext";
import { Websocket } from "./components/Websocket";
function App() {
  return <WebsocketProvider value={socket}>
    <Websocket/>
  </WebsocketProvider>
}

export default App;
