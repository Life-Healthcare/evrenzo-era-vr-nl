import React from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { DefaultXRControllers, VRCanvas as Canvas } from "@react-three/xr";
import { Html, Text } from "@react-three/drei";
import { AppReset, AppVersion } from "@/components/app/app.styles";
import packageJson from "../../../package.json";
import canvasConfig from "@/config/canvas-config";
import Container from "@/components/app/container";
import Camera from "@/components/camera/camera";
import useAppState from "@/hooks/use-app-state";
import Controllers from "@/components/controllers/controllers";
import { preloadAssets } from "@/utils";
import Home from "@/pages/home/home";
import Aerial1 from "@/pages/aerial-1/aerial-1";
import Aerial2 from "@/pages/aerial-2/aerial-2";
import Farmers from "@/pages/farmers/farmers";
import Yak from "@/pages/yak/yak";
import MountainPass from "@/pages/mountain-pass/mountain-pass";
import Timelapse from "@/pages/timelapse/timelapse";
import End from "@/pages/end/end";
import ResetAppOnExit from "@/components/reset-app-on-exit/reset-app-on-exit";
import ResetApp from "@/components/reset-app/reset-app";
import useSession from "@/hooks/use-session";

export default function App() {
  const { isPresenting } = useAppState();
  const [loading, setLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    setLoading(true);
    const preload = preloadAssets();
    preload.onProgress((progress) => {
      setProgress(Math.floor(progress * 100));
    });
    preload
      .load()
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <AppReset />
      {loading && <p>Loading ({progress}%)</p>}
      {!loading && (
        <Canvas
          flat
          linear
          dpr={1}
          // @ts-ignore
          vr="true"
        >
          {!isPresenting && (
            <Html center position={[0, -1.5, 0]}>
              <AppVersion>Version {packageJson.version}</AppVersion>
            </Html>
          )}
          <Router>
            <AppRoutes/>
          </Router>
        </Canvas>
      )}
    </>
  );
}

const AppRoutes = () => {
  const { isPresenting } = useAppState();
  const { pathname } = useLocation();
  const session = useSession(
    "https://analytics-server.finervision.com/api/save-sessions",
    "evrenzo-era-vr-nl"
  );
  
  React.useEffect(() => {
    if(pathname === "/") {
      session.start();
      console.log("session started");
    }

    if(pathname === "/end") {
      session.end();
      console.log("session ended");
    }

    window.onbeforeunload = () => {
      session.end();
      console.log("session ended");
    };
  }, [session, pathname])

  return (
    <>
      <DefaultXRControllers
        rayMaterial={{ transparent: true, opacity: 0 }}
      />
      <ResetApp />
      <ResetAppOnExit />
      <Container>
        <Camera />
        {isPresenting && (
          <>
            <Controllers />

            <ambientLight />

            <group
              position={canvasConfig.camera.position
                .clone()
                .multiplyScalar(-1)
                .add(canvasConfig.scene.offset)}
            >
              <React.Suspense fallback={<Text>Loading...</Text>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/aerial-1" element={<Aerial1 />} />
                  <Route path="/aerial-2" element={<Aerial2 />} />
                  <Route path="/farmers" element={<Farmers />} />
                  <Route path="/yak" element={<Yak />} />
                  <Route
                    path="/mountain-pass"
                    element={<MountainPass />}
                  />
                  <Route path="/timelapse" element={<Timelapse />} />
                  <Route path="/end" element={<End />} />
                </Routes>
              </React.Suspense>
            </group>
          </>
        )}
      </Container>
    </>
  )
}