const { network } = require("hardhat");
const {
    developmentChains,
    TIME_TILL_START,
    TIME_TO_VOTE,
    DESCRIPTION,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const { Typed } = require("ethers");

// Deploy script to deploy a ballot box along with the event.
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { log, get } = deployments;
    const { nonprofit, sponsor } = await getNamedAccounts();
    [, sponsorSigner] = await ethers.getSigners();

    const event = await ethers.getContract("Event", nonprofit);
    const ballotAddress = await event.getGovernanceToken();

    log("Creating Ballot Box...");

    const tx = await event.requestVoteBox(sponsor, DESCRIPTION, TIME_TILL_START, TIME_TO_VOTE);
    await tx.wait(1);

    const tx2 = await event.connect(sponsorSigner).confirmVoteBox(Typed.address(sponsor));
    await tx2.wait(1);

    log(`Ballot Box at ${await event.getBallotBox(sponsor)}`);

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(await event.getBallotBox(sponsor), [
            ballotAddress,
            TIME_TILL_START,
            TIME_TO_VOTE,
        ]);
    }
};

module.exports.tags = ["all", "ballotbox"];
