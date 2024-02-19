export const EIP_712_DOMAIN = {
  name: "BuidlGuidl Grants",
  version: "1",
  chainId: 10,
} as const;

export const EIP_712_TYPES__APPLY_FOR_GRANT = {
  Message: [
    { name: "title", type: "string" },
    { name: "description", type: "string" },
    { name: "askAmount", type: "string" },
  ],
} as const;

// ToDo. We could add more fields (grant title, builder, etc)
export const EIP_712_TYPES__REVIEW_GRANT = {
  Message: [
    { name: "grantId", type: "string" },
    { name: "action", type: "string" },
  ],
} as const;
