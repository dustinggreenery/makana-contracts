const { ethers, getNamedAccounts } = require("hardhat");
const { states, results } = require("../helper-hardhat-config");

async function printInfo() {
    const { deployer, secondaryVoter } = await getNamedAccounts();
    const ballot = await ethers.getContract("Ballot");
    const ballotBox = await ethers.getContract("BallotBox");
    const state = await ballotBox.getState();

    console.log(`State: ${states[state]}`);
    console.log(`Governance Token Address: ${await ballotBox.getTokenAddress()}\n`);

    console.log(`Get Votes of Deployer: ${await ballot.getVotes(deployer)}`);
    console.log(`Get Votes of Secondary Voter: ${await ballot.getVotes(secondaryVoter)}\n`);

    if (state == 2) {
        console.log(`Result: ${results[await ballotBox.getResult()]}`);
        console.log(`Ballots For: ${await ballotBox.getBallotsFor()}`);
        console.log(`Ballots Against: ${await ballotBox.getBallotsAgainst()}\n`);
    }

    console.log(`Clock: ${await ballotBox.clock()}`);
}

printInfo()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
