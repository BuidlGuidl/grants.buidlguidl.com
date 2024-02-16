import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getAllGrants } from "~~/services/database/grants";

export async function GET(request: Request) {
  // ToDo. We probably want to use a middleware for this.
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET || "");
  } catch (error) {
    return new Response("Unauthorized", { status: 401 });
  }

  const grants = await getAllGrants();

  return NextResponse.json({ data: grants });
}
