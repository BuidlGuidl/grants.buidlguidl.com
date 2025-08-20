import type { Simplify } from "type-fest";
import type { BuilderData } from "../api/sre/schema";

export type GrantWithoutTimestamps = {
  id: string;
  title: string;
  description: string;
  askAmount: number;
  builder: string;
  link?: string;
  status: "proposed" | "approved" | "submitted" | "completed" | "rejected";
  approvedTx?: string;
  completedTx?: string;
  note?: string;
  txChainId?: string;
};

export type GrantData = Simplify<
  GrantWithoutTimestamps & {
    [k in GrantWithoutTimestamps["status"] as `${k}At`]?: number;
  }
>;

export type GrantDataWithBuilder = Simplify<GrantData & { builderData?: BuilderData }>;
export type GrantDataWithPrivateNote = Simplify<GrantDataWithBuilder & { private_note?: string }>;
