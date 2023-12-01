const { ethers, getNamedAccounts } = require("hardhat");
const { states, results } = require("../helper-hardhat-config");

async function printInfo() {
    const { nonprofit, sponsor, firstvoter, secondvoter, thirdvoter } = await getNamedAccounts();
    const ballot = await ethers.getContract("Ballot");
    const event = await ethers.getContract("Event");

    console.log(`Event Title: ${await event.getEventTitle()}`);
    console.log(`Nonprofit: ${await event.getNonprofit()}`);
    console.log(`Governance Token Address: ${await event.getGovernanceToken()}`);
    console.log(`Clock: ${await event.clock()}\n`);

    console.log(`Votes of First Voter: ${await ballot.getVotes(firstvoter)}`);
    console.log(`Votes of Second Voter: ${await ballot.getVotes(secondvoter)}`);
    console.log(`Votes of Third Voter: ${await ballot.getVotes(thirdvoter)}\n`);

    const isSponsor = await event.isSponsor(sponsor);

    console.log(`Sponsor's Ballot Box Exists: ${isSponsor}\n`);

    if (isSponsor) {
        const confirmed = await event.ballotBoxConfirmed(sponsor);

        console.log(`Ballot Box Start Time: ${await event.getBallotBoxStartTime(sponsor)}`);
        console.log(`Ballot Box Vote Time: ${await event.getBallotBoxTimeToVote(sponsor)}`);
        console.log(`Ballot Box Confirmation: ${confirmed}\n`);

        if (confirmed) {
            const ballotBoxAddress = await event.getBallotBox(sponsor);
            const ballotBox = await ethers.getContractAt("BallotBox", ballotBoxAddress);
            const state = await ballotBox.getState();

            console.log(`Ballot Box Address: ${ballotBoxAddress}`);
            console.log(`Ballot Box Description: ${await event.getBallotBoxDescription(sponsor)}`);
            console.log(`State: ${states[state]}\n`);

            console.log(`Account Voting Status:`);
            console.log(`1: ${await ballotBox.addressHasVoted(firstvoter)}`);
            console.log(`2: ${await ballotBox.addressHasVoted(secondvoter)}`);
            console.log(`3: ${await ballotBox.addressHasVoted(thirdvoter)}\n`);

            if (state == 2) {
                console.log(`Result: ${results[await ballotBox.getResult()]}`);
                console.log(`Ballots For: ${await ballotBox.getBallotsFor()}`);
                console.log(`Ballots Against: ${await ballotBox.getBallotsAgainst()}\n`);
            }
        }
    }
}

printInfo()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
