const { network } = require("hardhat");
const { developmentChains, TITLE } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log, get } = deployments;
    const { nonprofit } = await getNamedAccounts();

    log("Deploying Event...");

    const event = await deploy("Event", {
        from: nonprofit,
        args: [TITLE],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    log(`Event at ${event.address}`);

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(event.address, [TITLE]);
    }
};

module.exports.tags = ["all", "event"];
