import { NextResponse } from "next/server";
import { getAllGrantsForReview } from "~~/services/database/grants";

export async function GET() {
  try {
    const grants = await getAllGrantsForReview();
    return NextResponse.json({ data: grants });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
      },
    );
  }
}
