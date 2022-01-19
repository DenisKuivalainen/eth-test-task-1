import useUniswap from "./useUniswap";

export default () => {
  const u = useUniswap();

  if (u.loading) return <p>Loading...</p>;
  if (u.pending) return <p>Operation in progress</p>;
  return (
    <>
      <button onClick={() => u.addLiquidity(2)}>Add 2 GDL to liqidity</button>
      <br />
      <br />
      <button onClick={() => u.buyToken(1)}>Buy GDL for 0.005 ETH</button>
      <br />
      <br />
      <button onClick={() => u.sellToken(1)}>Sell 1 GDL</button>
    </>
  );
};
