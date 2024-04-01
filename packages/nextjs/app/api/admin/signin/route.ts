import { NextResponse } from "next/server";
import { recoverTypedDataAddress } from "viem";
import { findUserByAddress } from "~~/services/database/users";
import { EIP_712_DOMAIN, EIP_712_TYPES__ADMIN_SIGN_IN } from "~~/utils/eip712";

type AdminSignInBody = {
  signer?: string;
  signature?: `0x${string}`;
};
export async function POST(req: Request) {
  try {
    const { signer, signature } = (await req.json()) as AdminSignInBody;

    if (!signer || !signature) {
      return new Response("Missing signer or signature", { status: 400 });
    }

    const signerData = await findUserByAddress(signer);
    if (signerData.data?.role !== "admin") {
      console.error("Unauthorized", signer);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recoveredAddress = await recoverTypedDataAddress({
      domain: EIP_712_DOMAIN,
      types: EIP_712_TYPES__ADMIN_SIGN_IN,
      primaryType: "Message",
      message: { action: "Sign In", description: "I authorize myself as admin" },
      signature,
    });
    if (recoveredAddress !== signer) {
      console.error("Signer and Recovered address does not match", recoveredAddress, signer);
      return NextResponse.json({ error: "Unauthorized in batch" }, { status: 401 });
    }

    const API_KEY = process.env.ADMIN_API_KEY;

    return NextResponse.json({ data: { apiKey: API_KEY } }, { status: 200 });
  } catch (error) {
    console.error("Error in admin signin", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
