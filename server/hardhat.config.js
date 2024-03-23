// /** @type import('hardhat/config').HardhatUserConfig */
// require("dotenv").config();

// require("@nomiclabs/hardhat-waffle");

// module.exports = {
//   solidity: "0.8.9",
//   networks: {
//     goerli: {
//       network_id: 5,
//       url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
//       accounts: [process.env.GOERLI_PRIVATE_KEY]
//     }
//   }, solidity: {
//     version: "0.8.9",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200,
//       },
//     },
//   },
// };

/** @type import('hardhat/config').HardhatUserConfig */
//require("hardhat-contract-sizer");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
module.exports = {
  solidity: '0.8.10',
  defaultNetwork: "mumbai",
  paths: {
    artifacts: "../client/src/artifacts"
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    },
    mumbai: {
      allowUnlimitedContractSize: true,
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  mocha: {
    timeout: 100000000
  },
  settings: {
    optimizer: {
      enabled: true
    }
  },
  contractSizer: {
    runOnCompile: true
  }
};

