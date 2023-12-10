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

const states = {
    0: "SETUP",
    1: "VOTING_PERIOD",
    2: "RESULTS",
};

const results = {
    0: "FOR",
    1: "AGAINST",
    2: "TIE",
};

const TITLE = "Movies in the Park 2023";

const DESCRIPTION = "Did movies in the park 2023 show the movie?";
const TIME_TILL_START = 100; // Unit is in 17 seconds
const TIME_TO_VOTE = 100; // Unit is in 17 seconds

module.exports = {
    developmentChains,
    networkConfig,
    states,
    results,
    TITLE,
    DESCRIPTION,
    TIME_TILL_START,
    TIME_TO_VOTE,
};
