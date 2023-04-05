import React from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotConnected from "../component/NotConnected";
import { Box, TextareaAutosize } from "@mui/material";
import { verifyMessage } from "ethers/lib/utils.js";

const SignMessage = () => {
  const { address, connector, isConnected } = useAccount();
  // const { name } = connector;
  const { disconnect } = useDisconnect();

  const recoveredAddress = React.useRef("");
  const { data, error, isLoading, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data);
      recoveredAddress.current = address;
    },
  });

  if (isConnected) {
    return (
      <Box sx={{ boxShadow: 2 }} className="rounded-lg p-4 w-[800px]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const message = formData.get("message");
            console.log(
              "🚀 ~ file: SignMessage.jsx:30 ~ SignMessage ~ message:",
              message
            );
            signMessage({ message });
          }}
        >
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
          <TextareaAutosize
            id="message"
            name="message"
            className="w-full min-h-[100px] mt-4 rounded-lg focus:border-blue-100 outline-none"
          />
          <button
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-500 rounded-lg text-white font-semibold mt-2"
          >
            {isLoading ? "Check Wallet..." : "Sign Message"}
          </button>
          {data && (
            <div className="mt-2">
              <div>
                Recovered Address: <strong>{recoveredAddress.current}</strong>
              </div>
              <div title={data} className="w-[780px] truncate">
                Signature: <strong>{data}</strong>
              </div>
            </div>
          )}

          {error && <div>{error.message}</div>}
        </form>
      </Box>
    );
  } else {
    return <NotConnected />;
  }
};

export default SignMessage;
