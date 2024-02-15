"use client";

import * as React from "react";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

// ToDo. Nonce.
const SIWE = () => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const signIn = async () => {
    try {
      const chainId = chain?.id;
      if (!address || !chainId) return;

      const signature = await signMessageAsync({ message: `I want to sign in to grants.buidlguidl.com as ${address}` });

      // Verify signature
      const verifyRes = await fetch("/api/auth/siwe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signature, address }),
      });
      if (!verifyRes.ok) throw new Error("Error verifying message");
    } catch (error) {
      notification.error("Error signing in");
    }
  };

  return (
    <div>
      <button className="btn btn-primary" disabled={!isConnected} onClick={signIn}>
        Sign-In with Ethereum
      </button>
    </div>
  );
};

export default SIWE;
