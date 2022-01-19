import IUniswapV2Router02 from "@uniswap/v2-periphery/build/IUniswapV2Router02.json";
import IUniswapV2Factory from "@uniswap/v2-core/build/IUniswapV2Factory.json";
import GodlikeContract from "./GODLIKE.json";
import { useState } from "react/cjs/react.development";
import useWeb3 from "./useWeb3";
import { toWei, fromWei } from "./weiConverter";

export default () => {
  const tokenAddress = "0x6d005D654D9C141fF1004394649Bc4686B29cfC8";
  const routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const [pending, setPending] = useState(false);

  const {
    account,
    useContract,
    loading: web3Loading,
    reload,
    balance: ethBalance,
  } = useWeb3();

  // Router contract to make swaps
  const { contract: router } = useContract(IUniswapV2Router02, routerAddress);

  // Factory contract to create and check pairs
  const { contract: factory } = useContract(
    IUniswapV2Factory,
    "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
  );
  // Token contract to check balance and set allowance
  const { contract: gdl, balance: gdlBalance } = useContract(GodlikeContract);

  const loading = web3Loading || !router || !factory || !gdl;

  // Get WETH address
  const getWeth = () => router.methods.WETH().call();

  // Returns token price in ETH for taking it out of the pool
  const priceOfToken = async (amount) =>
    router.methods
      .getAmountsIn(toWei(amount), [await getWeth(), tokenAddress])
      .call()
      .then((res) => fromWei(res[0]))
      .then(parseFloat);

  // Returns token price in ETH for taking it into the pool
  const priceForToken = async (amount) =>
    router.methods
      .getAmountsOut(toWei(amount), [tokenAddress, await getWeth()])
      .call()
      .then((res) => fromWei(res[1]))
      .then(parseFloat);

  // Check if pair exists, if not, create it
  const checkPair = async () => {
    const wethAddress = await getWeth();
    const pair = await factory.methods
      .getPair(tokenAddress, wethAddress)
      .call();
    const pairNotExists = pair === "0x0000000000000000000000000000000000000000";

    if (pairNotExists)
      await factory.methods.createPair(tokenAddress, wethAddress).call();
  };

  // Check if user allowed to use token
  const checkAllowance = async (amount) => {
    const allowed = await gdl.methods
      .allowance(account, routerAddress)
      .call()
      .then(fromWei)
      .then(parseFloat);
    if (allowed < amount)
      await gdl.methods
        .approve(routerAddress, toWei(gdlBalance))
        .send({ from: account });
  };

  const getDeadline = (t) => toWei(Math.ceil(Date.now() / 1000 + t));
  const fixToWei = (n) => toWei(parseFloat(n).toFixed(18));

  const generateEvent = (fn) => async (amount) => {
    if (loading) return;
    setPending(true);
    try {
      await checkPair();
      await checkAllowance(amount);
      await fn(amount);
    } catch (e) {}
    setPending(false);
    reload();
  };

  return {
    addLiquidity: generateEvent(async (amount) => {
      await router.methods
        .addLiquidityETH(
          tokenAddress,
          toWei(amount),
          fixToWei(amount * 0.9),
          fixToWei((await priceForToken(amount)) * 0.9),
          account,
          getDeadline(30)
        )
        .send({
          from: account,
          value: fixToWei((await priceOfToken(amount)) * 1.1),
        });
    }),

    buyToken: generateEvent(async (amount) => {
      await router.methods
        .swapETHForExactTokens(
          fixToWei(amount),
          [await getWeth(), tokenAddress],
          account,
          getDeadline(30)
        )
        .send({
          from: account,
          value: fixToWei((await priceOfToken(amount)) * 0.9),
        });
    }),

    sellToken: generateEvent(async (amount) => {
      await router.methods
        .swapExactTokensForETH(
          toWei(amount),
          fixToWei((await priceForToken(amount)) * 0.9),
          [tokenAddress, await getWeth()],
          account,
          getDeadline(30)
        )
        .send({ from: account });
    }),
    loading,
    pending,
  };
};
