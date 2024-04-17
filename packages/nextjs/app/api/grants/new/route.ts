import { NextResponse } from "next/server";
import { recoverTypedDataAddress } from "viem";
import { createGrant } from "~~/services/database/grants";
import { findUserByAddress } from "~~/services/database/users";
import { EIP_712_DOMAIN, EIP_712_TYPES__APPLY_FOR_GRANT } from "~~/utils/eip712";

type ReqBody = {
  title?: string;
  description?: string;
  askAmount?: string;
  signature?: `0x${string}`;
  signer?: string;
};

// Hardcoded default ask amount
const askAmount = 0.25;
// TODO: We could also add extra validation of nonce
export async function POST(req: Request) {
  try {
    const { title, description, signature, signer } = (await req.json()) as ReqBody;

    if (!title || !description || !signature || !signer || description.length > 750 || title.length > 75) {
      return NextResponse.json({ error: "Invalid form details submitted" }, { status: 400 });
    }

    // Verif if the builder is present
    const builder = await findUserByAddress(signer);
    if (!builder.exists) {
      return NextResponse.json({ error: "Only Buidlguidl builders can submit for grants" }, { status: 401 });
    }

    const recoveredAddress = await recoverTypedDataAddress({
      domain: EIP_712_DOMAIN,
      types: EIP_712_TYPES__APPLY_FOR_GRANT,
      primaryType: "Message",
      message: { title, description },
      signature: signature,
    });

    if (recoveredAddress !== signer) {
      return NextResponse.json({ error: "Recovered address did not match signer" }, { status: 401 });
    }

    const grant = await createGrant({
      title: title,
      description: description,
      askAmount: askAmount,
      builder: signer,
    });

    return NextResponse.json({ grant }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error processing form" }, { status: 500 });
  }
}
