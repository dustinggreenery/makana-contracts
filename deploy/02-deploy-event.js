const { network } = require("hardhat");
const { developmentChains, TITLE } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log, get } = deployments;
    const { nonprofit } = await getNamedAccounts();

    const ballot = await get("Ballot");

    log("Deploying Event...");

    const event = await deploy("Event", {
        from: nonprofit,
        args: [TITLE, ballot.address],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    log(`Event at ${event.address}`);

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(event.address, [TITLE, ballot.address]);
    }
};

module.exports.tags = ["all", "setup", "event"];
