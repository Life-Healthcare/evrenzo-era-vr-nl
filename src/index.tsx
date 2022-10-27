import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/components/app/app";
import config from "@/config/config";

if ("serviceWorker" in navigator && config.env === "production") {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => {
        registration.onupdatefound = () => {
          const serviceWorker = registration.installing;
          if (serviceWorker == null) return;
          console.log("new version");
          let updating = false;
          serviceWorker.onstatechange = () => {
            if (
              serviceWorker.state === "installed" &&
              navigator.serviceWorker.controller &&
              registration &&
              registration.waiting
            ) {
              updating = true;
              registration.waiting.postMessage({ type: "SKIP_WAITING" });
            }

            if (updating && serviceWorker.state === "activated") {
              window.location.reload();
            }
          };
        };
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
