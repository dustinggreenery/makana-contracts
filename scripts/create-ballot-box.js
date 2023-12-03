const { ethers, network } = require("hardhat");
const {
    developmentChains,
    TIME_TILL_START,
    TIME_TO_VOTE,
    DESCRIPTION,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const { Typed } = require("ethers");

async function createBallotBox() {
    const { nonprofit, sponsor } = await getNamedAccounts();
    [, sponsorSigner] = await ethers.getSigners();

    const event = await ethers.getContract("Event", nonprofit);
    const ballotAddress = await event.getGovernanceToken();

    console.log("Creating Ballot Box...");

    const tx = await event.requestVoteBox(sponsor, DESCRIPTION, TIME_TILL_START, TIME_TO_VOTE);
    await tx.wait(1);

    const tx2 = await event.connect(sponsorSigner).confirmVoteBox(Typed.address(sponsor));
    await tx2.wait(1);

    console.log(`Ballot Box at ${await event.getBallotBox(sponsor)}`);

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(await event.getBallotBox(sponsor), [
            ballotAddress,
            TIME_TILL_START,
            TIME_TO_VOTE,
        ]);
    }
}

createBallotBox()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
