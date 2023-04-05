import React from "react";
import WarningIcon from "@mui/icons-material/Warning";

const NotConnected = () => {
  return (
    <>
      <WarningIcon sx={{ height: "80px", width: "80px" }} />
      <p className="font-semibold">Please Connect Wallet</p>
      <a href="/" className="bg-gray-200 rounded-lg px-4 py-2 ">
        Connect Wallet
      </a>
    </>
  );
};

export default NotConnected;
