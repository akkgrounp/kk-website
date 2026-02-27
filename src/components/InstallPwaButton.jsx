import { useEffect, useState } from "react";

function InstallPwaButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const onInstalled = () => {
      setDeferredPrompt(null);
      setShowHint(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return;
    }

    // Fallback for browsers without beforeinstallprompt support.
    setShowHint((prev) => !prev);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={installApp}
        className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
      >
        Install App
      </button>
      {showHint && (
        <div className="absolute right-0 top-11 z-30 w-64 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-lg">
          Open browser menu and select <span className="font-semibold">Install app</span> or{" "}
          <span className="font-semibold">Add to Home Screen</span>.
        </div>
      )}
    </div>
  );
}

export default InstallPwaButton;
