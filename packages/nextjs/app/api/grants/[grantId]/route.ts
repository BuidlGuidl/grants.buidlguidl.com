import { NextRequest, NextResponse } from "next/server";
import { recoverTypedDataAddress } from "viem";
import { updateGrant } from "~~/services/database/grants";
import { findUserByAddress } from "~~/services/database/users";
import { EIP_712_DOMAIN, EIP_712_TYPES__EDIT_GRANT } from "~~/utils/eip712";

type ReqBody = {
  title?: string;
  description?: string;
  askAmount?: number;
  signature?: `0x${string}`;
  signer?: string;
  private_note?: string;
};

export async function PATCH(req: NextRequest, { params }: { params: { grantId: string } }) {
  try {
    const { grantId } = params;
    const { title, description, signature, signer, askAmount, private_note } = (await req.json()) as ReqBody;

    if (!title || !description || !askAmount || typeof askAmount !== "number" || !signature || !signer) {
      return NextResponse.json({ error: "Invalid form details submited" }, { status: 400 });
    }

    const recoveredAddress = await recoverTypedDataAddress({
      domain: EIP_712_DOMAIN,
      types: EIP_712_TYPES__EDIT_GRANT,
      primaryType: "Message",
      message: { title, description, askAmount: askAmount.toString(), grantId, private_note: private_note ?? "" },
      signature: signature,
    });
    if (recoveredAddress !== signer) {
      return NextResponse.json({ error: "Recovered address did not match signer" }, { status: 401 });
    }

    // Only admins can edit grant
    const signerData = await findUserByAddress(signer);
    if (signerData.data?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await updateGrant(grantId, { title, description, askAmount }, private_note);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error editing grant" }, { status: 500 });
  }
}
