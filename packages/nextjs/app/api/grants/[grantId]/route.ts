import { NextRequest, NextResponse } from "next/server";
import { EIP712TypedData } from "@safe-global/safe-core-sdk-types";
import { recoverTypedDataAddress } from "viem";
import { fetchBuilderData } from "~~/services/database/builders";
import { updateGrant } from "~~/services/database/grants";
import { EIP_712_DOMAIN, EIP_712_TYPES__EDIT_GRANT } from "~~/utils/eip712";
import { validateSafeSignature } from "~~/utils/safe-signature";

type ReqBody = {
  title?: string;
  description?: string;
  askAmount?: number;
  signature?: `0x${string}`;
  signer?: string;
  private_note?: string;
  isSafeSignature?: boolean;
  chainId?: number;
};

export async function PATCH(req: NextRequest, { params }: { params: { grantId: string } }) {
  try {
    const { grantId } = params;
    const { title, description, signature, signer, askAmount, private_note, isSafeSignature, chainId } =
      (await req.json()) as ReqBody;

    if (!title || !description || !askAmount || typeof askAmount !== "number" || !signature || !signer) {
      return NextResponse.json({ error: "Invalid form details submited" }, { status: 400 });
    }

    let isValidSignature: boolean;

    const typedData = {
      domain: EIP_712_DOMAIN,
      types: EIP_712_TYPES__EDIT_GRANT,
      primaryType: "Message",
      message: { title, description, askAmount: askAmount.toString(), grantId, private_note: private_note ?? "" },
      signature: signature,
    } as const;

    if (isSafeSignature) {
      if (!chainId) return new Response("Missing chainId", { status: 400 });
      isValidSignature = await validateSafeSignature({
        chainId: Number(chainId),
        typedData: typedData as unknown as EIP712TypedData,
        safeAddress: signer,
        signature,
      });
    } else {
      const recoveredAddress = await recoverTypedDataAddress(typedData);
      isValidSignature = recoveredAddress === signer;
    }

    if (!isValidSignature) {
      return NextResponse.json({ error: "Recovered address did not match signer" }, { status: 401 });
    }

    // Only admins can edit grant
    const signerData = await fetchBuilderData(signer);
    if (signerData?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await updateGrant(grantId, { title, description, askAmount }, private_note);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error editing grant" }, { status: 500 });
  }
}
