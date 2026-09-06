import { Outlet } from "react-router-dom";
import TopBar from "./TopBar.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import SupportBot from "../common/SupportBot.jsx";

export default function Layout() {
  const { theme } = useTheme();

  return (
    <div className="site-wrapper" data-theme={theme === "dark" ? "bw" : "color"}>
      <TopBar />
      <Navbar />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
      <SupportBot />
    </div>
  );
}
