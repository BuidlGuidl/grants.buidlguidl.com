import scaffoldConfig from "~~/scaffold.config";

export const EIP_712_DOMAIN = {
  name: "BuidlGuidl Grants",
  version: "1",
  chainId: scaffoldConfig.targetNetworks[0].id,
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
    { name: "txHash", type: "string" },
  ],
} as const;

export const EIP_712_TYPES__SUBMIT_GRANT = {
  Message: [
    { name: "grantId", type: "string" },
    { name: "action", type: "string" },
    { name: "link", type: "string" },
  ],
} as const;
