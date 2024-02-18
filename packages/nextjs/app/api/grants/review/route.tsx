import { NextResponse } from "next/server";
import { getAllGrantsForReview } from "~~/services/database/grants";

export async function GET() {
  const grants = await getAllGrantsForReview();

  return NextResponse.json({ data: grants });
}
