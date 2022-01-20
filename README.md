## How to test
### Add ETH for Ropsten testnet
To mint 10 tokens (what will be enough), it is required 10 * 1 / 16384 ETH. So one small transaction from any of fausets is enough:
* https://faucet.ropsten.be/
* https://faucet.metamask.io/
* https://faucet.dimensions.network/
* https://faucet.egorfine.com/
* https://www.moonborrow.com/

### Testing webpage
* https://eth-task-1.vercel.app 

The page consists of 2 independent components, so ballance will not be updated on tokens swap.

### Contact contract
**Mint tokens.** The operation requires 0.00061035 ETH + fee.

**Transfer tokens.** You can specify the reciever by changing address in the input field. By default it is my account. Operation requires 0.000061035 ETH + fee.

### Swap tokens
**Add to liquidity pool.** The operation will add exactly 2 GDL to liquidity pool and equivalent ETH. Operation requires 0.0002 ETH + fee.

**Buy token** or swap ETH -> GDL. Operation requires 0.0001 ETH + fee.

**Sell token** or swap GDL -> ETH. Operation requires ETH for fee.