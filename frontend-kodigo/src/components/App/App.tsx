import { Dashboard } from "../Dashboard/Dashboard";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";

export const App = () => (
  <div className="app-shell">
    <Header />
    <Dashboard />
    <Footer />
  </div>
);
