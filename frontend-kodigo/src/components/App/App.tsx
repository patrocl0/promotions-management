import { Dashboard } from "../Dashboard/Dashboard";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";

export const App = () => {
  return (
    <div className="flex flex-col ">
      <Header />
      <Dashboard />
      <Footer />
    </div>
  );
};
