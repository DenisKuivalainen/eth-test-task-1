const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

module.exports = {
  networks: {
    dev: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "5777", // Any network (default: none)
    },
    test: {
      provider: function () {
        return new HDWalletProvider({
          privateKeys: (process.env.PRIVATE_KEYS || "").split(","),
          providerOrUrl: `https://ropsten.infura.io/v3/${process.env.PROJECT_KEY}`,
        });
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 3
    }
  },

  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.11",
    },
  },
};
