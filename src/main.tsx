import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Ensure React is available for libraries expecting a global React in dev
// This helps avoid runtime issues with certain prebundled chunks
// without affecting production builds
// @ts-ignore
(globalThis as any).React = React;

createRoot(document.getElementById("root")!).render(<App />);
