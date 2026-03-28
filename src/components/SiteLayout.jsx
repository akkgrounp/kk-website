import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import WhatsAppButton from "./WhatsAppButton";
import LiveChatButton from "./LiveChatButton";
import { DEFAULT_WHATSAPP_MESSAGE } from "../utils/whatsapp";

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
      <WhatsAppButton
        phoneNumber="+44 7757 674489"
        message={DEFAULT_WHATSAPP_MESSAGE}
      />
      <LiveChatButton />
    </div>
  );
}

export default SiteLayout;
