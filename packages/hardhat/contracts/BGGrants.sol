//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Dummy contract for initial iteration
// From https://github.com/BuidlGuidl/Eth-Splitter/blob/master/packages/hardhat/contracts/Splitter.sol
contract BGGrants is Ownable, ReentrancyGuard {
    error INVALID_RECIPIENT();
    error INSUFFICIENT_RECIPIENT_COUNT();
    error TRANSFER_FAILED();
    error INSUFFICIENT_SPLIT_AMOUNT();
    error INVALID_INPUT();

    event EthSplit(address indexed sender, uint256 totalAmount, address payable[] recipients, uint256[] amounts);

    constructor(address _owner) {
        super.transferOwnership(_owner);
    }

    function splitETH(
        address payable[] calldata recipients,
        uint256[] calldata amounts
    ) external payable nonReentrant {
        uint256 remainingAmount = _splitETH(recipients, amounts, msg.value);
        emit EthSplit(msg.sender, msg.value, recipients, amounts);

        if (remainingAmount > 0) {
            (bool success, ) = msg.sender.call{value: remainingAmount, gas: 20000}("");
            if (!success) revert TRANSFER_FAILED();
        }
    }

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
     * Function that allows the owner to withdraw all the Ether in the contract
     * The function can only be called by the owner of the contract as defined by the isOwner modifier
     */
    function withdraw() public onlyOwner {
        (bool success, ) = owner().call{ value: address(this).balance }("");
        require(success, "Failed to send Ether");
    }

    /**
     * Function that allows the contract to receive ETH
     */
    receive() external payable {}
}
