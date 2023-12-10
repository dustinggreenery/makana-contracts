const { ethers, network, getNamedAccounts } = require("hardhat");
const fs = require("fs");

const EVENT_JSON_FILE = "./artifacts/contracts/Event.sol/Event.json";
const EVENT_ADDRESSES_FILE = "../makana-front-end/constants/eventAddresses.json";
const EVENT_ABI_FILE = "../makana-front-end/constants/eventAbi.json";

const BALLOT_JSON_FILE = "./artifacts/contracts/Ballot.sol/Ballot.json";
const BALLOT_ADDRESSES_FILE = "../makana-front-end/constants/ballotAddresses.json";
const BALLOT_ABI_FILE = "../makana-front-end/constants/ballotAbi.json";

const BOX_JSON_FILE = "./artifacts/contracts/BallotBox.sol/BallotBox.json";
const BOX_ABI_FILE = "../makana-front-end/constants/boxAbi.json";

module.exports = async function () {
    console.log("Updating Front End...");
    updateContractAddresses();
    updateAbi();
};

async function updateContractAddresses() {
    const { nonprofit } = await getNamedAccounts();
    const event = await ethers.getContract("Event", nonprofit);
    const eventAddress = await event.getAddress();
    const ballotAddress = await event.getGovernanceToken();
    const chainId = network.config.chainId.toString();

    const eventAddresses = JSON.parse(fs.readFileSync(EVENT_ADDRESSES_FILE, "utf8"));
    const ballotAddresses = JSON.parse(fs.readFileSync(BALLOT_ADDRESSES_FILE, "utf8"));

    if (chainId in eventAddresses) {
        if (!eventAddresses[chainId].includes(eventAddress)) {
            eventAddresses[chainId].push(eventAddress);
        }
    } else {
        eventAddresses[chainId] = [eventAddress];
    }

    if (chainId in ballotAddresses) {
        if (!ballotAddresses[chainId].includes(ballotAddress)) {
            ballotAddresses[chainId].push(ballotAddress);
        }
    } else {
        ballotAddresses[chainId] = [ballotAddress];
    }

    fs.writeFileSync(EVENT_ADDRESSES_FILE, JSON.stringify(eventAddresses));
    fs.writeFileSync(BALLOT_ADDRESSES_FILE, JSON.stringify(ballotAddresses));
}

async function updateAbi() {
    const eventJson = JSON.parse(fs.readFileSync(EVENT_JSON_FILE, "utf8"));
    const eventAbi = eventJson.abi;
    fs.writeFileSync(EVENT_ABI_FILE, JSON.stringify(eventAbi));

    const ballotJson = JSON.parse(fs.readFileSync(BALLOT_JSON_FILE, "utf8"));
    const ballotAbi = ballotJson.abi;
    fs.writeFileSync(BALLOT_ABI_FILE, JSON.stringify(ballotAbi));

    const boxJson = JSON.parse(fs.readFileSync(BOX_JSON_FILE, "utf8"));
    const boxAbi = boxJson.abi;
    fs.writeFileSync(BOX_ABI_FILE, JSON.stringify(boxAbi));
}

module.exports.tags = ["all", "event", "frontend"];
