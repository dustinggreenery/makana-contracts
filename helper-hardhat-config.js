const { ethers } = require("hardhat");

const networkConfig = {
    11155111: {
        name: "sepolia",
    },
    31337: {
        name: "hardhat",
    },
};

const developmentChains = ["hardhat", "localhost"];

const INITIAL_AMOUNT = ethers.utils.parseEther("10");
const TIME_TILL_START = 1; // Unit is in 17 seconds
const TIME_TO_VOTE = 1; // Unit is in 17 seconds

module.exports = {
    developmentChains,
    networkConfig,
    INITIAL_AMOUNT,
    TIME_TILL_START,
    TIME_TO_VOTE,
};
