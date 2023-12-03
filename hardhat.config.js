require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-network-helpers");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_KEY_2 = process.env.PRIVATE_KEY_2;
const PRIVATE_KEY_3 = process.env.PRIVATE_KEY_3;
const PRIVATE_KEY_4 = process.env.PRIVATE_KEY_4;
const PRIVATE_KEY_5 = process.env.PRIVATE_KEY_5;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        localhost: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        sepolia: {
            chainId: 11155111,
            blockConfirmations: 6,
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY, PRIVATE_KEY_2, PRIVATE_KEY_3, PRIVATE_KEY_4, PRIVATE_KEY_5],
        },
        zkEVM: {
            chainId: 1442,
            url: `https://rpc.public.zkevm-test.net`,
            accounts: [PRIVATE_KEY, PRIVATE_KEY_2, PRIVATE_KEY_3, PRIVATE_KEY_4, PRIVATE_KEY_5],
        },
    },
    etherscan: {
        apiKey: {
            sepolia: ETHERSCAN_API_KEY,
            zkEVM: POLYGONSCAN_API_KEY,
        },
        customChains: [
            {
                network: "zkEVM",
                chainId: 1442,
                urls: {
                    apiURL: `https://api-testnet-zkevm.polygonscan.com/api`,
                    browserURL: "https://testnet-zkevm.polygonscan.com/",
                },
            },
        ],
    },
    gasReporter: {
        enabled: false,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
    },
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000,
            },
        },
    },
    allowUnlimitedContractSize: true,
    namedAccounts: {
        nonprofit: {
            default: 0,
        },
        sponsor: {
            default: 1,
        },
        firstvoter: {
            default: 2,
        },
        secondvoter: {
            default: 3,
        },
        thirdvoter: {
            default: 4,
        },
    },
    mocha: {
        timeout: 200000,
    },
};
