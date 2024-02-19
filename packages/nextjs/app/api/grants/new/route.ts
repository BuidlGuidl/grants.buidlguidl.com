import { NextResponse } from "next/server";
import { verifyMessage } from "viem";
import { createGrant } from "~~/services/database/grants";
import { findUserByAddress } from "~~/services/database/users";

type ReqBody = {
  title?: string;
  description?: string;
  askAmount?: string;
  signature?: `0x${string}`;
  address?: string;
};

export async function POST(req: Request) {
  try {
    const { title, description, askAmount, signature, address } = (await req.json()) as ReqBody;

    if (!title || !description || !askAmount || !signature || !address) {
      return NextResponse.json({ error: "Invalid form details submited" }, { status: 400 });
    }

    const constructedMessage = JSON.stringify({ title, description, askAmount });
    const isMessageValid = await verifyMessage({ message: constructedMessage, signature, address });

    if (!isMessageValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Verif if the builder is present
    const builder = await findUserByAddress(address);
    if (!builder.exists) {
      return NextResponse.json({ error: "Only buidlguild builders can submit for grants" }, { status: 401 });
    }

    // Save the form data to the database
    const grant = await createGrant({
      title: title,
      description: description,
      askAmount: Number(askAmount),
      builder: address,
    });

    return NextResponse.json({ grant }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error processing form" }, { status: 500 });
  }
}
