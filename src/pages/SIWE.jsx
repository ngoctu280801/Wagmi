import { Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React from "react";
import { useAccount, useDisconnect, useNetwork, useSignMessage } from "wagmi";
import NotConnected from "../component/NotConnected";
import { SiweMessage } from "siwe";
import axios from "axios";

function SignInButton({ onSuccess, onError }) {
  const [state, setState] = React.useState({ loading: false, nonce: "" });

  const fetchNonce = async () => {
    try {
      const res = await axios(
        `https://dev-admin-api.hellven.io/api/v1/authentication/nonce?address=${address}`
      );
      console.log("🚀 ~ file: SIWE.jsx:17 ~ fetchNonce ~ res:", res);
      const { data: nonce } = res?.data;
      //   const nonce = await nonceRes.text()
      console.log("🚀 ~ file: SIWE.js:13 ~ fetchNonce ~ nonceRes:", nonce);
      setState((x) => ({ ...x, nonce }));
    } catch (error) {
      setState((x) => ({ ...x, error: error }));
    }
  };

  // Pre-fetch random nonce when button is rendered
  // to ensure deep linking works for WalletConnect
  // users on iOS when signing the SIWE message
  React.useEffect(() => {
    fetchNonce();
  }, []);

  const { address } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const signIn = async () => {
    try {
      const chainId = chain?.id;
      if (!address || !chainId) return;

      setState((x) => ({ ...x, loading: true }));
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: state.nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      setState((x) => ({ ...x, loading: false }));
      onSuccess({ address });
    } catch (error) {
      setState((x) => ({ ...x, loading: false, nonce: undefined }));
      onError({ error: error });
      fetchNonce();
    }
  };

  return (
    <button
      className="w-full px-4 py-2 bg-blue-500 rounded-lg text-white font-semibold mt-4"
      disabled={!state.nonce || state.loading}
      onClick={signIn}
    >
      Sign-In with Ethereum
    </button>
  );
}

const SIWE = () => {
  const { address, connector, isConnected } = useAccount();
  // const { name } = connector;
  const { disconnect } = useDisconnect();

  const [state, setState] = React.useState({
    address: "",
    error: null,
    loading: false,
  });

  // Fetch user when:
  React.useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch("/api/me");
        const json = await res.json();
        setState((x) => ({ ...x, address: json.address }));
      } catch (_error) {}
    };
    // 1. page loads
    handler();

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  if (isConnected) {
    return (
      <Box sx={{ boxShadow: 2 }} className="rounded-lg p-4 w-[800px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AccountCircleIcon sx={{ width: "40px", height: "40px" }} />
            <span>
              <h5>{address}</h5>
              <h5 className="text-gray-500">
                Connect to <strong>{"MetaMask" || ""}</strong>
              </h5>
            </span>
          </div>
          <button
            className="bg-red-500 rounded-lg px-3 py-1 h-fit text-white"
            onClick={disconnect}
          >
            Disconnect
          </button>
        </div>
        {/* <button className="w-full px-4 py-2 bg-blue-500 rounded-lg text-white font-semibold mt-4">
          Sign In With Etherium
        </button> */}
        {state.address ? (
          <div className=" mt-2 flex flex-col items-center justify-center gap-2">
            <div>
              Signed in as <strong>{state.address}</strong>
            </div>
            <button
              onClick={async () => {
                await fetch("/api/logout");
                setState({});
              }}
              className="bg-gray-300 rounded-lg px-3 py-1 text-gray-900  "
            >
              Sign Out
            </button>
          </div>
        ) : (
          <SignInButton
            onSuccess={({ address }) => setState((x) => ({ ...x, address }))}
            onError={({ error }) => setState((x) => ({ ...x, error }))}
          />
        )}
      </Box>
    );
  } else {
    return <NotConnected />;
  }
};

export default SIWE;
