const { network } = require("hardhat");
const { developmentChains, TIME_TILL_START, TIME_TO_VOTE } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

// Deploy script to deploy a ballot box without an underlying event.
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log, get } = deployments;
    const { nonprofit } = await getNamedAccounts();

    const ballot = await get("Ballot");

    log("Deploying Ballot Box...");

    const ballotBox = await deploy("BallotBox", {
        from: nonprofit,
        args: [ballot.address, TIME_TILL_START, TIME_TO_VOTE],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    log(`Ballot Box at ${ballotBox.address}`);

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(ballotBox.address, [ballot.address, TIME_TILL_START, TIME_TO_VOTE]);
    }
};

module.exports.tags = ["noevent"];
