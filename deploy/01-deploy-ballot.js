const { network, ethers } = require("hardhat");
const { developmentChains, INITIAL_AMOUNT } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("Deploying Ballot...");

    const ballot = await deploy("Ballot", {
        from: deployer,
        args: [INITIAL_AMOUNT],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    log(`Ballot at ${ballot.address}`);

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(ballot.address, [INITIAL_AMOUNT]);
    }

    await delegate(ballot.address, deployer);
    log(`Delegated to ${deployer}`);
    log(`---------------------------------------------------------------------------------`);
};

const delegate = async (ballotAddress, delegatedAccount) => {
    const ballot = await ethers.getContractAt("Ballot", ballotAddress);
    const tx = await ballot.delegate(delegatedAccount);
    await tx.wait(1);

    console.log(`Checkpoints: ${await ballot.numCheckpoints(delegatedAccount)}`);
    console.log(`Votes: ${await ballot.getVotes(delegatedAccount)}`);
};
