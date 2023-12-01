const { network } = require("hardhat");
const {
    developmentChains,
    TIME_TILL_START,
    TIME_TO_VOTE,
    DESCRIPTION,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const { Typed } = require("ethers");

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { log, get } = deployments;
    const { nonprofit, sponsor } = await getNamedAccounts();
    [first, secondaryVoter] = await ethers.getSigners();

    const ballot = await get("Ballot");
    const event = await ethers.getContract("Event", nonprofit);

    log("Creating Ballot Box...");

    const tx = await event.requestVoteBox(sponsor, DESCRIPTION, TIME_TILL_START, TIME_TO_VOTE);
    await tx.wait(1);

    const tx2 = await event.connect(secondaryVoter).confirmVoteBox(Typed.address(sponsor));
    await tx2.wait(1);

    log(`Ballot Box at ${await event.getBallotBox(sponsor)}`);

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(await event.getBallotBox(sponsor), [
            ballot.address,
            TIME_TILL_START,
            TIME_TO_VOTE,
        ]);
    }
};

module.exports.tags = ["all", "ballotbox"];
