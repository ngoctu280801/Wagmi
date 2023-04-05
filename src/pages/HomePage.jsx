import React from "react";
import Layout from "../layout/Layout";
import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const HomePage = () => {
  const { address, connector, isConnected } = useAccount();
  console.log(
    "🚀 ~ file: HomePage.jsx:7 ~ HomePage ~ isConnected:",
    isConnected
  );

  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className=" absolute  w-fit flex flex-col items-center gap-2 top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2">
        <div>{address}</div>
        <div>
          Connected to <strong>{connector.name}</strong>
        </div>
        <button
          className="bg-red-500 rounded-lg px-3 py-1 text-white"
          onClick={disconnect}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className=" absolute  w-fit flex flex-col items-center gap-2 top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2">
      {connectors.map((connector) => (
        <button
          className="bg-orange-400 text-white  rounded-lg px-3 py-1"
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector?.name}
          {!connector.ready && " (unsupported)"}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            " (connecting)"}
        </button>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  );
};

export default HomePage;
