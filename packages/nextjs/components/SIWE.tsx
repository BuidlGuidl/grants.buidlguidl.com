"use client";

import * as React from "react";
import { useLocalStorage } from "usehooks-ts";
import { useAccount, useSignMessage } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

// ToDo. "Connect wallet" info tooltip if disabled
// ToDo. Nonce?
// ToDo. Check if expired?
const SIWE = () => {
  const { isConnected, address } = useAccount();
  const [jwt, setJwt] = useLocalStorage<string>("jwt", "", {
    initializeWithValue: false,
  });

  const { signMessageAsync } = useSignMessage();

  const signIn = async () => {
    try {
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
      const { token } = await verifyRes.json();
      setJwt(token);
      notification.success("Signed in successfully");
    } catch (error) {
      notification.error("Error signing in");
    }
  };

  return (
    <div>
      {jwt ? (
        <div>
          <p>Already signed in!!</p>
        </div>
      ) : (
        <button className="btn btn-primary" disabled={!isConnected} onClick={signIn}>
          Sign-In with Ethereum
        </button>
      )}
    </div>
  );
};

export default SIWE;
