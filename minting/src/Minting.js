import { useState } from "react";
import GodlikeContract from "./GODLIKE.json";
import useWeb3 from "./useWeb3";
import { toWei } from "./weiConverter";

export default () => {
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const {
    account,
    balance: ethBalance,
    useContract,
    loading,
    reload,
  } = useWeb3();
  const { contract, balance: gdlBalance } = useContract(GodlikeContract);

  const [to, setTo] = useState("0xE25931A1597a1Dc6eC09D3e88e11938cF11Ae28a");
  const mintToken = async () => {
    try {
      setIsPending(true);
      await contract.methods
        .mint()
        .send({ from: account, value: toWei(10 / 16384) });
      setIsPending(false);
      reload();
    } catch (e) {
      setError("ERROR: Minting tokens");
    }
  };
  const transferTo = async () => {
    try {
      setIsPending(true);
      await contract.methods.transfer(to, toWei(1)).send({ from: account });
      setIsPending(false);
      setTo("");
      reload();
    } catch (e) {
      setError("ERROR: Transfer tokens");
    }
  };
  if (loading) return <p>Loading...</p>;
  if (isPending) return <p>Operation in progress</p>;
  return (
    <>
      <br />
      <a>{`Your balance is ${ethBalance} ETH, ${gdlBalance} GDL.`}</a>
      <br />
      <br />
      <a>Mint 10 GDL.</a> <button onClick={mintToken}>MINT</button>
      <br />
      <br />
      <a>Transfer 1 tokens to </a>
      <input onChange={(e) => setTo(e.target.value)} value={to} />
      <a>. </a>
      <button onClick={transferTo}>TRANSFER</button>
      {error.length ? <p>{error}</p> : <></>}
    </>
  );
};
