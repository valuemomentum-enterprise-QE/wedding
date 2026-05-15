import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

function removeEmergentBadge() {
  document.getElementById("emergent-badge")?.remove();
  document.querySelectorAll('a[href*="emergent.sh"]').forEach((node) => {
    if (node.textContent?.includes("Emergent")) node.remove();
  });
}

removeEmergentBadge();
if (typeof MutationObserver !== "undefined") {
  new MutationObserver(removeEmergentBadge).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
