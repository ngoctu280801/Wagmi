import React, { useEffect, useState } from "react";
import {
  useAccount,
  useBalance,
  useDisconnect,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { useDebounce } from "use-debounce";
import { parseEther } from "ethers/lib/utils.js";
import NotConnected from "../component/NotConnected";

const InputForm = ({
  value,
  setValue,
  label = "",
  placeholder = "",
  setSuccess = () => {},
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold" htmlFor={label}>
        {label}
      </label>
      <input
        className="rounded-lg w-[400px] px-4 py-2"
        type="text"
        id={label}
        value={value}
        onChange={(e) => {
          setSuccess(false);
          setValue(e.target.value);
        }}
        placeholder={placeholder}
        required
      />
    </div>
  );
};
const Send = ({ address = "" }) => {
  const [to, setTo] = useState("");
  const [debounceTo] = useDebounce(to, 500);
  const [amount, setAmount] = useState("");
  const [debounceAmount] = useDebounce(amount, 500);
  const [success, setSuccess] = useState(false);

  const { data } = useBalance({
    address: address,
  });

  const { disconnect } = useDisconnect();

  const handleSend = () => {
    sendTransaction?.();
  };
  const { config } = usePrepareSendTransaction({
    request: {
      to: debounceTo,
      value: debounceAmount ? parseEther(debounceAmount) : undefined,
    },
  });
  const { data: dataSend, sendTransaction } = useSendTransaction(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: dataSend?.hash,
  });
  useEffect(() => {
    setSuccess(isSuccess);
  }, [isSuccess]);
  return (
    <div className="flex flex-col gap-4 max-w-[400px]">
      <h1 className="mx-auto font-bold text-2xl ">Send Transaction</h1>
      <div className="ml-auto -mb-4">
        Balance:{" "}
        <strong>
          {(data?.formatted * 1).toFixed(4)} {data?.symbol}
        </strong>
      </div>
      <div className="font-semibold ml-auto ">{address}</div>
      <InputForm
        placeholder="0xA0Cf...251e"
        label="Recipient"
        value={to}
        setValue={setTo}
        setSuccess={setSuccess}
      />
      <InputForm
        placeholder="0.05"
        label="Amount"
        value={amount}
        setValue={setAmount}
        setSuccess={setSuccess}
      />
      <button
        disabled={!sendTransaction || !to || !amount}
        onClick={handleSend}
        className="w-full px-4 py-2 bg-blue-500 rounded-lg text-white font-semibold"
      >
        {isLoading ? "Sending..." : "Send"}
      </button>
      <button
        onClick={disconnect}
        className="w-full px-4 py-2 bg-red-500 rounded-lg text-white font-semibold"
      >
        Disconnected
      </button>
      {success && (
        <div className="text-green-500 text-center">
          Successfully sent <strong>{amount}</strong> ether to{" "}
          <strong>{to}</strong>
          <div className="font-semibold">
            <a href={`https://etherscan.io/tx/${dataSend?.hash}`}>Etherscan</a>
          </div>
        </div>
      )}
    </div>
  );
};

const SendTransaction = () => {
  const { address, connector, isConnected } = useAccount();
  return <>{isConnected ? <Send address={address} /> : <NotConnected />}</>;
};

export default SendTransaction;
