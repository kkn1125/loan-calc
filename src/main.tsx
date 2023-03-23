import { Box } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Box>
    {/* <React.StrictMode> */}
      <App />
    {/* </React.StrictMode> */}
  </Box>
);
