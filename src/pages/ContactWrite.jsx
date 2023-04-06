import React from "react";
import {
  useAccount,
  useContractWrite,
  useDisconnect,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotConnected from "../component/NotConnected";
import { Box } from "@mui/material";

const ContactWrite = () => {
  const { address, connector, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const { config } = usePrepareContractWrite({
    address: "0x7aCAcE5FC83269F389884fa8f57851d0ffB103f0",
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    args: [address],
    functionName: "mint",
  });
  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  if (!isConnected) return <NotConnected></NotConnected>;
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
      <button
        className="w-full px-4 py-2 bg-blue-500 rounded-lg text-white font-semibold mt-2"
        disabled={!write || isLoading}
        onClick={() => write()}
      >
        {isLoading ? "Minting..." : "Mint"}
      </button>
      {isSuccess && (
        <div className="mt-2 text-green-500 text-center">
          Successfully minted your NFT!
          <div className="font-semibold">
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )}
    </Box>
  );
};

export default ContactWrite;
