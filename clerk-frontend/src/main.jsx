import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={clerkPubKey} >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);

//Optional: Centralize Sign-Out Redirect in <ClerkProvider>
/*
<ClerkProvider
  publishableKey={clerkPubKey}
  navigate={(to) => navigate(to)} // required for routing to work
>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</ClerkProvider>

*/

//Template
/*
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
*/

