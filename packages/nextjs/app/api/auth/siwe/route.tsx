import jwt from "jsonwebtoken";
import { verifyMessage } from "viem";
import { findUserByAddress } from "~~/services/database/users";

export async function POST(request: Request) {
  const { signature, address } = await request.json();
  if (!process.env.JWT_SECRET) return new Response("Internal Server Error: JWT", { status: 500 });
  if (!signature || !address) return new Response("Bad Request", { status: 400 });

  const user = await findUserByAddress(address);
  if (!user.exists || user.data?.role !== "admin") return new Response("Unauthorized", { status: 401 });

  const signedMessage = `I want to sign in to grants.buidlguidl.com as ${address}`;
  const isMessageValid = await verifyMessage({ message: signedMessage, signature, address });

  if (!isMessageValid) return new Response("Unauthorized", { status: 401 });

  const token = jwt.sign({ address }, process.env.JWT_SECRET, { expiresIn: "1w" });

  return new Response(JSON.stringify({ token }), {
    headers: { "Content-Type": "application/json" },
  });
}
