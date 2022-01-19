const GDL = artifacts.require("GODLIKE");

contract("Test GDL", (accounts) => {
  let dglt;
  before(async () => {
    dglt = await GDL.deployed();
  });

  const checkBalance = (id, expected) =>
    dglt
      .balanceOf(accounts[id])
      .then(web3.utils.fromWei)
      .then((b) => expect(b).to.equal(expected));

  it("Mint 2560 GDL on account 0", async () => {
    await dglt.mint({value: web3.utils.toWei("10", "ether")})
    await checkBalance(0, "2560");
  });

  it("Transfer 1 GDL from account 0 to account 1", async () => {
    await dglt.mint({value: web3.utils.toWei("2", "ether")})
    await dglt.transfer(accounts[1], web3.utils.toWei("1", "ether"));
    await checkBalance(0, "3070.999");
    await checkBalance(1, "1");
  });
});