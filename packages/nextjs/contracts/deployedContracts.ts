/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  1: {
    BGGrants: {
      address: "0x0ed8fa0ae29b6df59f755f285667dff5df97bd6b",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_owner",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "INSUFFICIENT_RECIPIENT_COUNT",
          type: "error",
        },
        {
          inputs: [],
          name: "INSUFFICIENT_SPLIT_AMOUNT",
          type: "error",
        },
        {
          inputs: [],
          name: "INVALID_INPUT",
          type: "error",
        },
        {
          inputs: [],
          name: "INVALID_RECIPIENT",
          type: "error",
        },
        {
          inputs: [],
          name: "NOT_ADMIN",
          type: "error",
        },
        {
          inputs: [],
          name: "TRANSFER_FAILED",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              indexed: false,
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
            {
              indexed: false,
              internalType: "contract IERC20",
              name: "token",
              type: "address",
            },
          ],
          name: "Erc20Split",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              indexed: false,
              internalType: "contract IERC20",
              name: "token",
              type: "address",
            },
          ],
          name: "Erc20SplitEqual",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              indexed: false,
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          name: "EthSplit",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
          ],
          name: "EthSplitEqual",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_admin",
              type: "address",
            },
          ],
          name: "addAdmin",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "ensContract",
          outputs: [
            {
              internalType: "contract ENSContract",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_admin",
              type: "address",
            },
          ],
          name: "removeAdmin",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_newName",
              type: "string",
            },
          ],
          name: "setName",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "contract IERC20",
              name: "token",
              type: "address",
            },
            {
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          name: "splitERC20",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          name: "splitETH",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "contract IERC20",
              name: "token",
              type: "address",
            },
            {
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
          ],
          name: "splitEqualERC20",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
          ],
          name: "splitEqualETH",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "contract IERC20",
              name: "token",
              type: "address",
            },
          ],
          name: "withdraw",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ],
      inheritedFunctions: {
        DEFAULT_ADMIN_ROLE: "@openzeppelin/contracts/access/AccessControl.sol",
        getRoleAdmin: "@openzeppelin/contracts/access/AccessControl.sol",
        grantRole: "@openzeppelin/contracts/access/AccessControl.sol",
        hasRole: "@openzeppelin/contracts/access/AccessControl.sol",
        renounceRole: "@openzeppelin/contracts/access/AccessControl.sol",
        revokeRole: "@openzeppelin/contracts/access/AccessControl.sol",
        supportsInterface: "@openzeppelin/contracts/access/AccessControl.sol",
      },
    },
  },
  10: {
    BGGrants: {
      address: "0x0eD8fa0aE29b6dF59f755F285667DFf5DF97bd6b",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_owner",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "INSUFFICIENT_RECIPIENT_COUNT",
          type: "error",
        },
        {
          inputs: [],
          name: "INSUFFICIENT_SPLIT_AMOUNT",
          type: "error",
        },
        {
          inputs: [],
          name: "INVALID_INPUT",
          type: "error",
        },
        {
          inputs: [],
          name: "INVALID_RECIPIENT",
          type: "error",
        },
        {
          inputs: [],
          name: "NOT_ADMIN",
          type: "error",
        },
        {
          inputs: [],
          name: "TRANSFER_FAILED",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              indexed: false,
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
            {
              indexed: false,
              internalType: "contract IERC20",
              name: "token",
              type: "address",
            },
          ],
          name: "Erc20Split",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              indexed: false,
              internalType: "contract IERC20",
              name: "token",
              type: "address",
            },
          ],
          name: "Erc20SplitEqual",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              indexed: false,
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          name: "EthSplit",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
          ],
          name: "EthSplitEqual",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_admin",
              type: "address",
            },
          ],
          name: "addAdmin",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "ensContract",
          outputs: [
            {
              internalType: "contract ENSContract",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_admin",
              type: "address",
            },
          ],
          name: "removeAdmin",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_newName",
              type: "string",
            },
          ],
          name: "setName",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "contract IERC20",
              name: "token",
              type: "address",
            },
            {
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          name: "splitERC20",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          name: "splitETH",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "contract IERC20",
              name: "token",
              type: "address",
            },
            {
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
          ],
          name: "splitEqualERC20",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
          ],
          name: "splitEqualETH",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "contract IERC20",
              name: "token",
              type: "address",
            },
          ],
          name: "withdraw",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ],
      inheritedFunctions: {
        DEFAULT_ADMIN_ROLE: "@openzeppelin/contracts/access/AccessControl.sol",
        getRoleAdmin: "@openzeppelin/contracts/access/AccessControl.sol",
        grantRole: "@openzeppelin/contracts/access/AccessControl.sol",
        hasRole: "@openzeppelin/contracts/access/AccessControl.sol",
        renounceRole: "@openzeppelin/contracts/access/AccessControl.sol",
        revokeRole: "@openzeppelin/contracts/access/AccessControl.sol",
        supportsInterface: "@openzeppelin/contracts/access/AccessControl.sol",
      },
    },
  },
  31337: {
    BGGrants: {
      address: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_owner",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "INSUFFICIENT_RECIPIENT_COUNT",
          type: "error",
        },
        {
          inputs: [],
          name: "INSUFFICIENT_SPLIT_AMOUNT",
          type: "error",
        },
        {
          inputs: [],
          name: "INVALID_INPUT",
          type: "error",
        },
        {
          inputs: [],
          name: "INVALID_RECIPIENT",
          type: "error",
        },
        {
          inputs: [],
          name: "NOT_ADMIN",
          type: "error",
        },
        {
          inputs: [],
          name: "TRANSFER_FAILED",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              indexed: false,
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
            {
              indexed: false,
              internalType: "contract IERC20",
              name: "token",
              type: "address",
            },
          ],
          name: "Erc20Split",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              indexed: false,
              internalType: "contract IERC20",
              name: "token",
              type: "address",
            },
          ],
          name: "Erc20SplitEqual",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              indexed: false,
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          name: "EthSplit",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
          ],
          name: "EthSplitEqual",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_admin",
              type: "address",
            },
          ],
          name: "addAdmin",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_admin",
              type: "address",
            },
          ],
          name: "removeAdmin",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "contract IERC20",
              name: "token",
              type: "address",
            },
            {
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          name: "splitERC20",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          name: "splitETH",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "contract IERC20",
              name: "token",
              type: "address",
            },
            {
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
            {
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
          ],
          name: "splitEqualERC20",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address payable[]",
              name: "recipients",
              type: "address[]",
            },
          ],
          name: "splitEqualETH",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "contract IERC20",
              name: "token",
              type: "address",
            },
          ],
          name: "withdraw",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ],
      inheritedFunctions: {
        DEFAULT_ADMIN_ROLE: "@openzeppelin/contracts/access/AccessControl.sol",
        getRoleAdmin: "@openzeppelin/contracts/access/AccessControl.sol",
        grantRole: "@openzeppelin/contracts/access/AccessControl.sol",
        hasRole: "@openzeppelin/contracts/access/AccessControl.sol",
        renounceRole: "@openzeppelin/contracts/access/AccessControl.sol",
        revokeRole: "@openzeppelin/contracts/access/AccessControl.sol",
        supportsInterface: "@openzeppelin/contracts/access/AccessControl.sol",
      },
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
