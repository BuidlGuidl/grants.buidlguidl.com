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

    event EthSplitEqual(address indexed sender, uint256 totalAmount, address payable[] recipients);

    constructor(address _owner) {
        super.transferOwnership(_owner);
    }

    function splitEqualETH(address payable[] calldata recipients) external payable nonReentrant {
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
