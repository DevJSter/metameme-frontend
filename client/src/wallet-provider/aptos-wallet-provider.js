// AptosProvider.jsx
'use client';
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { AptosWalletAdapterProvider, useWallet } from "@aptos-labs/wallet-adapter-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from 'aptos';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const NETWORK = "testnet";
const NETWORK_URL = {
  testnet: "https://fullnode.testnet.aptoslabs.com/v1",
  mainnet: "https://fullnode.mainnet.aptoslabs.com/v1",
};

const WalletStateContext = createContext({});

const useWalletState = () => useContext(WalletStateContext);

function ConnectWalletButton() {
  const { connected } = useWallet();
  
  if (connected) return null;
  
  return (
    <div className="flex justify-center items-center">
      <WalletSelector />
    </div>
  );
}

function WalletContainer({ children }) {
  const { connected } = useWallet();
  
  if (!connected) {
    return (
      <div className="relative h-screen w-full flex items-center justify-center">
        <Card className="w-[350px] bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Hey!, Welcome to MetaMeme</CardTitle>
            <CardDescription>Connect your wallet to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectWalletButton />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return <>{children}</>;
}

function WalletStateProvider({ children }) {
  const { account, connected, disconnect, wallet } = useWallet();
  const [accountAddress, setAccountAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initProvider = async () => {
      try {
        const newProvider = new Provider(NETWORK_URL[NETWORK]);
        setProvider(newProvider);
      } catch (error) {
        console.error("Failed to initialize provider:", error);
      }
    };
    initProvider();
  }, []);

  useEffect(() => {
    if (connected && account?.address) {
      setAccountAddress(account.address);
    } else {
      setAccountAddress("");
    }
    setIsLoading(false);
  }, [connected, account]);

  const executeFunction = async (moduleAddress, moduleName, functionName, typeArgs = [], args = []) => {
    if (!connected || !wallet) {
      throw new Error("Wallet not connected");
    }

    try {
      const payload = {
        type: "entry_function_payload",
        function: `${moduleAddress}::${moduleName}::${functionName}`,
        type_arguments: typeArgs,
        arguments: args
      };

      const response = await wallet.signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
      return response.hash;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  };

  const queryResource = async (address, resourceType) => {
    if (!provider) {
      throw new Error("Provider not initialized");
    }

    try {
      const resource = await provider.getAccountResource(
        address,
        resourceType
      );
      return resource.data;
    } catch (error) {
      console.error("Query failed:", error);
      throw error;
    }
  };

  const value = {
    connected,
    accountAddress,
    provider,
    isLoading,
    wallet,
    executeFunction,
    queryResource,
    disconnect
  };

  return (
    <WalletStateContext.Provider value={value}>
      {children}
    </WalletStateContext.Provider>
  );
}

export default function AptosProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{ network: NETWORK }}
      onError={(error) => {
        console.error("Aptos Provider Error: ", error);
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WalletStateProvider>
          <WalletContainer>
            {children}
          </WalletContainer>
        </WalletStateProvider>
      </QueryClientProvider>
    </AptosWalletAdapterProvider>
  );
}

export { useWalletState };