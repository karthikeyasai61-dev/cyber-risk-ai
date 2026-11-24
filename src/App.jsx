import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DemoProvider } from "./hooks/useDemoState";
import AppShell from "./components/layout/AppShell";

function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </DemoProvider>
  );
}

export default App;
