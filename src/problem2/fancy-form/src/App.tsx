import { Toaster } from "react-hot-toast";
import Home from "./pages/home";
import QueryProvider from "./providers/query-provider";

function App() {
  return (
    <QueryProvider>
      <Home />
      <Toaster />
    </QueryProvider>
  );
}

export default App;
