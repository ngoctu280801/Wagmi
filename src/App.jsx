import "./App.scss";
import { Button } from "@mui/material";
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SendTransaction from "./pages/SendTransaction";
import ContactWrite from "./pages/ContactWrite";
import SignMessage from "./pages/SignMessage";
import Layout from "./layout/Layout";
import {
  WagmiConfig,
  createClient,
  configureChains,
  mainnet,
  goerli,
} from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
const { chains, provider, webSocketProvider } = configureChains(
  [goerli],
  [alchemyProvider({ apiKey: "yourAlchemyApiKey" }), publicProvider()]
);
// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider,
});

function App() {
  return (
    <Suspense fallback="Loading...">
      <WagmiConfig client={client}>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/send-transaction"
            element={
              <Layout>
                <SendTransaction />
              </Layout>
            }
          />
          <Route
            path="/contact-write"
            element={
              <Layout>
                <ContactWrite />
              </Layout>
            }
          />
          <Route
            path="/sign-message"
            element={
              <Layout>
                <SignMessage />
              </Layout>
            }
          />
        </Routes>
      </WagmiConfig>
    </Suspense>
  );
}

export default App;
