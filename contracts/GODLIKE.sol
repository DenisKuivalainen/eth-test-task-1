// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

contract GODLIKE is ERC20 {
    using SafeMath for uint256;
    constructor() ERC20("GODLIKE", "GDL") {}

    function mint() public payable {
        uint256 paidAmount = msg.value.mul(16384);
        _mint(msg.sender, paidAmount);
    }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        uint256 comission = amount.div(1000);
        require(balanceOf(msg.sender) >= amount + comission);
        _burn(msg.sender, comission);
        return super.transfer(recipient, amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        uint256 comission = amount.div(1000);
        require(balanceOf(sender) >= amount + comission);
        _burn(sender, comission);
        return super.transferFrom(sender, recipient, amount);
    }
}