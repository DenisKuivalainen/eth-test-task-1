// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract GDLSwap {
    address internal routerAddress = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    IUniswapV2Router02 public uniswapRouter;

    constructor() {
        uniswapRouter = IUniswapV2Router02(routerAddress);
    }

    function getPriceOfToken(uint amount, address token) public view returns (uint[] memory) {
        return uniswapRouter.getAmountsIn(amount, getPathEthGdlt(token));
    }

    function getPriceForToken(uint amount, address token) public view returns (uint) {
        return uniswapRouter.getAmountOut(amount, getPathEthGdlt(token));
    }

    function getPathEthGdlt(address token) private view returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = token;
            
        return path;
    }

    function getPathGdltEth(address token) private view returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = token;
        path[1] = uniswapRouter.WETH();
            
        return path;
    }

    function addLiquidity(uint amount, uint desiredAmount, uint desiredEthAmount, address token) public payable {
        uniswapRouter.addLiquidityETH{ value: msg.value }(
            token,
            amount,
            desiredAmount,
            desiredEthAmount,
            address(this),
            block.timestamp + 60
        );
        (bool success,) = msg.sender.call{ value: address(this).balance }("");
        require(success);
    }

    function buyToken(uint amount, address token) public payable {
        uniswapRouter.swapETHForExactTokens{ value: msg.value }(
            amount,
            getPathEthGdlt(token),
            address(this),
            block.timestamp + 60
        );
        (bool success,) = msg.sender.call{ value: address(this).balance }("");
        require(success);
    }

    function buyToken(uint amount, uint desiredEthAmount, address token) public payable {
        uniswapRouter.swapExactTokensForETH(
            amount,
            desiredEthAmount,
            getPathEthGdlt(token),
            address(this),
            block.timestamp + 60
        );
    }

    receive() payable external {}
}