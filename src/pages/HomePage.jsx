import React from "react";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useEnsName,
} from "wagmi";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const HomePage = () => {
  const { address, connector, isConnected } = useAccount();
  const { data, isError } = useBalance({
    address: address,
  });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <>
        <AccountCircleIcon sx={{ width: "100px", height: "80px" }} />
        <strong>{address}</strong>
        <div>
          Balance:{" "}
          <strong>
            {(data?.formatted * 1).toFixed(4)} {data?.symbol}
          </strong>
        </div>
        <div>
          Connected to <strong>{connector?.name}</strong>
        </div>
        <button
          className="bg-red-500 rounded-lg px-3 py-1 text-white"
          onClick={disconnect}
        >
          Disconnect
        </button>
      </>
    );
  }

  return (
    <>
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
    </>
  );
};

export default HomePage;
