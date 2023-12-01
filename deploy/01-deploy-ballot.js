const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { nonprofit } = await getNamedAccounts();

    log("Deploying Ballot...");

    const ballot = await deploy("Ballot", {
        from: nonprofit,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    log(`Ballot at ${ballot.address}`);

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(ballot.address, []);
    }
};

module.exports.tags = ["all", "setup", "ballot"];
