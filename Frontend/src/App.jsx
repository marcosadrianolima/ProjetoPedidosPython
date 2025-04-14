import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Container } from "@mui/material";
import Navbar from "./pages/Navbar";
import AppRoutes from "./routes/Router";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <AppRoutes />
      </Container>
    </BrowserRouter>
  );
}

export default App;