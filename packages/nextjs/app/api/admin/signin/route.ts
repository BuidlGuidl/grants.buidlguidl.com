import { NextResponse } from "next/server";
import { recoverTypedDataAddress } from "viem";
import { findUserByAddress } from "~~/services/database/users";
import { EIP_712_DOMAIN, EIP_712_TYPES__ADMIN_SIGN_IN } from "~~/utils/eip712";
import { validateSafeSignature } from "~~/utils/safe-signature";

type AdminSignInBody = {
  signer?: string;
  signature?: `0x${string}`;
  isSafeSignature?: boolean;
  chainId?: number;
};
export async function POST(req: Request) {
  try {
    const { signer, signature, isSafeSignature, chainId } = (await req.json()) as AdminSignInBody;
    console.log("AdminSignInBody", { signer, signature, isSafeSignature, chainId });

    if (!signer || !signature) {
      return new Response("Missing signer or signature", { status: 400 });
    }

    const signerData = await findUserByAddress(signer);
    if (signerData.data?.role !== "admin") {
      console.error("Unauthorized", signer);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let isValidSignature = false;

    const typedData = {
      domain: EIP_712_DOMAIN,
      types: EIP_712_TYPES__ADMIN_SIGN_IN,
      primaryType: "Message",
      message: { action: "Sign In", description: "I authorize myself as admin" },
      signature,
    } as const;

    if (isSafeSignature) {
      if (!chainId) return new Response("Missing chainId", { status: 400 });
      isValidSignature = await validateSafeSignature({ chainId, typedData, safeAddress: signer, signature });
    } else {
      const recoveredAddress = await recoverTypedDataAddress(typedData);
      isValidSignature = recoveredAddress === signer;
    }

    if (!isValidSignature) {
      console.error("Signer and Recovered address does not match");
      return NextResponse.json({ error: "Unauthorized in batch" }, { status: 401 });
    }

    const API_KEY = process.env.ADMIN_API_KEY;

    return NextResponse.json({ data: { apiKey: API_KEY } }, { status: 200 });
  } catch (error) {
    console.error("Error in admin signin", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
