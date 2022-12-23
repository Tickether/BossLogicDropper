//SPDX-License-Identifier: MIT


pragma solidity ^0.8.4;


import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC721 {
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

contract BossLogicDropper is Ownable {
    
    constructor() {}

    function BossLogicDrop(IERC721 tokenContract, address[] calldata _to, uint256[] calldata _id) public onlyOwner {
        require(_to.length == _id.length, 'different lenght');
        for (uint256 i = 0; i < _to.length; i++) {
            tokenContract.safeTransferFrom(msg.sender, _to[i], _id[i]);
        }
    }

}