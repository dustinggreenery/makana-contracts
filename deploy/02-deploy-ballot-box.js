const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

const START_TIME = 1;
const TIME_TO_VOTE = 10;

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();

    const ballot = await get("Ballot");

    log(`Ballot Address: ${ballot.address}`);

    log("Deploying Ballot Box...");

    const ballotBox = await deploy("BallotBox", {
        from: deployer,
        args: [ballot.address, START_TIME, TIME_TO_VOTE],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    log(`Ballot Box at ${ballotBox.address}`);

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(ballotBox.address, [ballot.address, START_TIME, TIME_TO_VOTE]);
    }
};
