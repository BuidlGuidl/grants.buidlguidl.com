import jwt from "jsonwebtoken";
import { verifyMessage } from "viem";

// import { findUserByAddress } from "~~/services/database/users";

// ToDo. Only for admins?
export async function POST(request: Request) {
  const { signature, address } = await request.json();
  if (!process.env.JWT_SECRET) return new Response("Internal Server Error: JWT", { status: 500 });
  if (!signature || !address) return new Response("Bad Request", { status: 400 });

  const signedMessage = `I want to sign in to grants.buidlguidl.com as ${address}`;
  const isMessageValid = await verifyMessage({ message: signedMessage, signature, address });

  if (!isMessageValid) return new Response("Unauthorized", { status: 401 });

  // Create a JWT token, with process.env.JWT_SECRET as the secret, and expires in 1 week
  const token = jwt.sign({ address }, process.env.JWT_SECRET, { expiresIn: "1w" });
  console.log("token", token);
  // const user = await findUserByAddress(signature);
  // if (!user) return new Response("Unauthorized", { status: 401 });
  return new Response(token, { status: 200 });
}
