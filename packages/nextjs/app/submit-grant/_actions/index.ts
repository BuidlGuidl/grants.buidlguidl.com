"use server";

import { verifyMessage } from "viem";
import { createGrant } from "~~/services/database/grants";
import { findUserByAddress } from "~~/services/database/users";

type SignedMessage = {
  message?: string;
  signature?: `0x${string}`;
  address?: string;
};

export const submitGrantAction = async ({ message, signature, address }: SignedMessage, form: FormData) => {
  try {
    const formData = Object.fromEntries(form.entries());
    if (!formData.title || !formData.description || !formData.askAmount) {
      throw new Error("Invalid form data");
    }
    if (!message || !signature || !address) {
      throw new Error("Invalid message, signature, or address.");
    }

    const isMessageValid = await verifyMessage({ message, signature, address });
    if (!isMessageValid) {
      throw new Error("Invalid signature");
    }

    // Verif if the builder is present
    const builder = await findUserByAddress(address);
    if (!builder.exists) {
      throw new Error("Only buidlguild builders can submit for grants");
    }

    // Save the form data to the database
    const grant = await createGrant({
      title: formData.title as string,
      description: formData.description as string,
      askAmount: Number(formData.askAmount),
      builder: address,
    });

    return grant;
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }

    throw new Error("Error processing form");
  }
};
