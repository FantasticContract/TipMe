import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ConnectKitButton } from "connectkit";
import {
  useAccount,
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { useState, useEffect } from "react";
import { tipjarConfig } from "./abi";
import { parseEther } from "viem";

function MainBlock() {
  return (
    <main className={styles.main}>
      <ConnectBlock />
      <TitleBlock />
      <TipBlock />
    </main>
  );
}

function ConnectBlock() {
  return (
    <div className={styles.connectDiv}>
      <ConnectKitButton />
    </div>
  );
}

function TitleBlock() {
  return (
    <div className={styles.titleDiv}>
      <h1 className={styles.title}>Tip me</h1>
      <p className={styles.description}>Toss a coin to the witcher ✨</p>
    </div>
  );
}

export const useIsMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

function TipBlock() {
  const isMounted = useIsMounted();
  const { address, isConnected } = useAccount();

  const {
    data: userData,
    isError: userIsError,
    isLoading: userIsLoading,
  } = useBalance({
    address: address,
    watch: true,
  });

  if (!isMounted) return null;

  const userBalance = parseFloat(userData?.formatted || "0")?.toFixed(4);

  return (
    <div className={styles.tipDiv}>
      <BalanceBlock
        userIsConnected={isConnected}
        userBalance={userBalance}
        userIsError={userIsError}
        userIsLoading={userIsLoading}
      />
      <TipModal isConnected={isConnected} userBalance={userBalance} />
    </div>
  );
}

interface BalanceBlockProps {
  userIsConnected: boolean;
  userBalance: string;
  userIsError: boolean;
  userIsLoading: boolean;
}

function BalanceBlock({
  userIsConnected,
  userBalance,
  userIsError,
  userIsLoading,
}: BalanceBlockProps) {
  const isMounted = useIsMounted();

  const {
    data: contractData,
    isError: contractIsError,
    isLoading: contractIsLoading,
  } = useBalance({
    address: "0x728DDDe0aB16B59df95a4D43d9692a44b7AEe944",
    watch: true,
  });

  const contractBalance = parseFloat(contractData?.formatted || "0")?.toFixed(
    4,
  );

  if (!isMounted) return null;

  return (
    <div className={styles.balanceDiv}>
      <BalanceCard
        title={"Your Balance"}
        balance={userBalance}
        isConnected={userIsConnected}
        isError={userIsError}
        isLoading={userIsLoading}
      />
      <BalanceCard
        title={"Tip contract Balance"}
        balance={contractBalance}
        isConnected={true}
        isError={contractIsError}
        isLoading={contractIsLoading}
      />
    </div>
  );
}

interface BalanceCardProps {
  title: string;
  balance: string;
  isConnected: boolean;
  isError: boolean;
  isLoading: boolean;
}

function BalanceCard({
  title,
  balance,
  isConnected,
  isError,
  isLoading,
}: BalanceCardProps) {
  return (
    <div className={styles.balanceCard}>
      <h2 className={styles.balanceHeader}>{title}</h2>
      <p>
        {!isConnected
          ? "0 ETH"
          : isLoading
            ? "Fetching balance…"
            : isError
              ? "Error fetching balance"
              : `${balance} ETH`}
      </p>
    </div>
  );
}

interface TipModalProps {
  isConnected: boolean;
  userBalance: string;
}

function TipModal({ isConnected, userBalance }: TipModalProps) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Update the input value state when the input changes
    setInputValue(event.target.value);
  };

  const isNotNumber = isNaN(Number(inputValue));

  const { config } = usePrepareContractWrite({
    address: "0x728DDDe0aB16B59df95a4D43d9692a44b7AEe944",
    abi: tipjarConfig.abi,
    functionName: "deposit",
    value: parseEther(inputValue),
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return (
    <div className={styles.tipmodal}>
      <div className={styles.modal}>
        <h4 className={styles.modalHeader}> Enter tip amount in ETH </h4>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        ></input>
        <button
          onClick={() => write?.()}
          className={styles.buttonmodal}
          disabled={
            !write ||
            isLoading ||
            inputValue === "" ||
            isNotNumber ||
            !isConnected ||
            Number(inputValue) > Number(userBalance)
          }
        >
          Send Tip
        </button>
        {Number(inputValue) > Number(userBalance) && (
          <div>You dont have enough ETH...</div>
        )}
        {isLoading && <div>Check Wallet</div>}
      </div>
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
    </div>
  );
}

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>TipJar</title>
        <meta name="description" content="Tipping app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainBlock />
    </div>
  );
};

export default Home;
