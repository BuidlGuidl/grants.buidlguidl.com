// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface ENSContract {
    function setName(string memory newName) external;
}

/**
 * @title BGGrants
 * @notice A smart contract to split ETH or ERC20 tokens between multiple recipients.
 * @dev This is intended for research and development purposes only. Use this contract at your
 * own risk and discretion.
 * @dev Based on https://split.buidlguidl.com/
 */

contract BGGrants is ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;
    // Mainnet ENS contract
    ENSContract public immutable ensContract = ENSContract(0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7Cb);

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Events
    event EthSplit(address indexed sender, uint256 totalAmount, address payable[] recipients, uint256[] amounts);
    event EthSplitEqual(address indexed sender, uint256 totalAmount, address payable[] recipients);
    event Erc20Split(address indexed sender, address payable[] recipients, uint256[] amounts, IERC20 token);
    event Erc20SplitEqual(address indexed sender, uint256 totalAmount, address payable[] recipients, IERC20 token);

    //*********************************************************************//
    // --------------------------- custom errors ------------------------- //
    //*********************************************************************//
    error INVALID_INPUT();
    error INSUFFICIENT_RECIPIENT_COUNT();
    error INVALID_RECIPIENT();
    error INSUFFICIENT_SPLIT_AMOUNT();
    error TRANSFER_FAILED();
    error NOT_ADMIN();

    modifier onlyAdmin() {
        if (!hasRole(ADMIN_ROLE, msg.sender)) revert NOT_ADMIN();
        _;
    }

    /**
     * @notice The constructor sets the owner of the contract
    */
    constructor(address _owner) {
        _setupRole(DEFAULT_ADMIN_ROLE, _owner);
        _setupRole(ADMIN_ROLE, _owner);
    }

    /**
     * @notice Splits the ETH amongst the given recipients, according to the specified amounts
     * @param recipients The recipients of the ETH
     * @param amounts The amounts each recipient shall receive
    */
    function splitETH(
        address payable[] calldata recipients,
        uint256[] calldata amounts
    ) external payable nonReentrant onlyAdmin {
        uint256 remainingAmount = _splitETH(recipients, amounts, msg.value);
        emit EthSplit(msg.sender, msg.value, recipients, amounts);

        if (remainingAmount > 0) {
            (bool success, ) = msg.sender.call{value: remainingAmount, gas: 20000}("");
            if (!success) revert TRANSFER_FAILED();
        }
    }

    /**
     * @notice Splits the ETH equally amongst the given recipients
     * @dev The contract adds any leftover dust to the amount to be received by the first recipient in the input array.
     * @param recipients The recipients of the ETH
    */
    function splitEqualETH(
        address payable[] calldata recipients
    ) external payable nonReentrant onlyAdmin {
        uint256 totalAmount = msg.value;
        uint256 rLength = recipients.length;
        uint256 equalAmount = totalAmount / rLength;
        uint256 remainingAmount = totalAmount % rLength;

        if (rLength > 25) revert INSUFFICIENT_RECIPIENT_COUNT();

        for (uint256 i = 0; i < rLength; ) {
            if (recipients[i] == address(0)) revert INVALID_RECIPIENT();
            uint256 amountToSend = equalAmount;
            if (i == 0) {
                amountToSend = amountToSend + remainingAmount;
            }
            (bool success, ) = recipients[i].call{value: amountToSend, gas: 20000}("");
            if (!success) revert TRANSFER_FAILED();
            unchecked {
                ++i;
            }
        }

        emit EthSplitEqual(msg.sender, msg.value, recipients);
    }

    /**
     * @notice Splits the ERC20 tokens amongst the given recipients, according to the specified amounts
     * @param token The token to be shared amongst the recipients
     * @param recipients The recipients of the ERC20 tokens
     * @param amounts The amounts each recipient shall receive
    */
    function splitERC20(
        IERC20 token,
        address payable[] calldata recipients,
        uint256[] calldata amounts
    ) external nonReentrant onlyAdmin {
        _transferTokensFromSenderToRecipients(token, recipients, amounts);
        emit Erc20Split(msg.sender, recipients, amounts, token);
    }

    /**
     * @notice Splits the ERC20 tokens equally amongst the given recipients
     * @param token The token to be shared amongst the recipients
     * @param recipients The recipients of the ERC20 tokens
     * @param totalAmount The total amount to be shared
    */
    function splitEqualERC20(
        IERC20 token,
        address payable[] calldata recipients,
        uint256 totalAmount
    ) external nonReentrant onlyAdmin {
        uint256 rLength = recipients.length;

        if (rLength > 25) revert INSUFFICIENT_RECIPIENT_COUNT();

        uint256 equalAmount = totalAmount / rLength;

        uint256 remainingAmount = totalAmount % rLength;
        for (uint256 i = 0; i < rLength; ) {
            if (recipients[i] == address(0)) revert INVALID_RECIPIENT();

            uint256 amountToSend = equalAmount;
            if (i == 0) {
                amountToSend = amountToSend + remainingAmount;
            }
            SafeERC20.safeTransferFrom(token, msg.sender, recipients[i], amountToSend);
            unchecked {
                ++i;
            }
        }

        emit Erc20SplitEqual(msg.sender, totalAmount, recipients, token);
    }

    /**
     * @notice Internal function to split the ETH amongst the given recipients, according to the specified amounts
     * @param recipients The recipients of the ETH
     * @param amounts The amounts each recipient shall receive
     * @param totalAvailable The total available ETH to be split
     * @return remainingAmount The remaining ETH dust
    */
    function _splitETH(
        address payable[] calldata recipients,
        uint256[] calldata amounts,
        uint256 totalAvailable
    ) internal returns (uint256 remainingAmount) {
        uint256 length = recipients.length;
        if (length != amounts.length) revert INVALID_INPUT();

        if (length > 25) revert INSUFFICIENT_RECIPIENT_COUNT();

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < length; ) {
            if (recipients[i] == address(0)) revert INVALID_RECIPIENT();
            if (amounts[i] == 0) revert INSUFFICIENT_SPLIT_AMOUNT();

            totalAmount = totalAmount + amounts[i];

            (bool success, ) = recipients[i].call{value: amounts[i], gas: 20000}("");
            if (!success) revert TRANSFER_FAILED();
            unchecked {
                ++i;
            }
        }

        return totalAvailable - totalAmount;
    }

    /**
     * @notice Internal function to transfer ERC20 tokens from the sender to the recipients
     * @param erc20Token The ERC20 token to be shared
     * @param recipients The noble recipients of the tokens
     * @param amounts The amounts each recipient shall receive
    */
    function _transferTokensFromSenderToRecipients(
        IERC20 erc20Token,
        address payable[] calldata recipients,
        uint256[] calldata amounts
    ) internal {
        uint256 length = recipients.length;

        if (length != amounts.length) revert INVALID_INPUT();
        if (length > 25) revert INSUFFICIENT_RECIPIENT_COUNT();

        for (uint256 i = 0; i < length; ) {
            if (recipients[i] == address(0)) revert INVALID_RECIPIENT();
            if (amounts[i] == 0) revert INSUFFICIENT_SPLIT_AMOUNT();

            SafeERC20.safeTransferFrom(erc20Token, msg.sender, recipients[i], amounts[i]);
            unchecked {
                ++i;
            }
        }
    }

    function addAdmin(address _admin) external onlyAdmin {
        grantRole(ADMIN_ROLE, _admin);
    }

    function removeAdmin(address _admin) external onlyAdmin {
        revokeRole(ADMIN_ROLE, _admin);
    }

    /**
     * @notice Withdraws the remaining ETH or ERC20 tokens to the owner's address
     * @param token The address of the ERC20 token, or 0 for ETH
    */
    function withdraw(IERC20 token) external onlyAdmin {
        if (address(token) == address(0)) {
            (bool success, ) = msg.sender.call{value: address(this).balance, gas: 20000}("");
            if (!success) revert TRANSFER_FAILED();
        } else {
            token.transfer(msg.sender, token.balanceOf(address(this)));
        }
    }

    /**
     * Set the reverse ENS name for the contract
     * @param _newName The new ENS name for the contract
     * @dev only meant to be call on mainnet
    */
    function setName(string memory _newName) onlyAdmin public {
        ensContract.setName(_newName);
    }

    receive() external payable {}
}
