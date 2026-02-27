import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import WhatsAppButton from "./WhatsAppButton";
import LiveChatButton from "./LiveChatButton";

function SiteLayout() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
      <WhatsAppButton phoneNumber="03185756022" />
      <LiveChatButton />
    </div>
  );
}

export default SiteLayout;
