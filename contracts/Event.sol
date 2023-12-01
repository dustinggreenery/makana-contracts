// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BallotBox.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";
import {Time} from "@openzeppelin/contracts/utils/types/Time.sol";

error Event__NotNonProfit();
error Event__NotSponsor();
error Event__Late(uint256 current, uint256 start);

contract Event {
    struct VoteBox {
        BallotBox ballotBox;
        string description;
        address sponsor;
        uint256 timeTillStart;
        uint256 startTime;
        uint256 timeToVote;
        bool confirmed;
    }

    mapping(address => VoteBox) private sponsorVoteBox;
    address[] private sponsors;

    address private immutable i_nonprofit;
    ERC721Votes private immutable i_token;
    string private eventTitle;

    modifier onlyNonprofit() {
        if (msg.sender != i_nonprofit) revert Event__NotNonProfit();
        _;
    }

    constructor(string memory _eventTitle, ERC721Votes governanceToken) {
        i_nonprofit = msg.sender;
        eventTitle = _eventTitle;
        i_token = governanceToken;
    }

    function requestVoteBox(
        address sponsor,
        string memory description,
        uint256 timeTillStart,
        uint256 timeToVote
    ) public onlyNonprofit {
        VoteBox storage voteBox = sponsorVoteBox[sponsor];
        voteBox.sponsor = sponsor;
        voteBox.description = description;
        voteBox.timeTillStart = timeTillStart;
        voteBox.startTime = clock() + timeTillStart;
        voteBox.timeToVote = timeToVote;
        voteBox.confirmed = false;

        sponsors.push(sponsor);
    }

    function confirmVoteBox() public {
        _confirmVoteBox(sponsorVoteBox[msg.sender]);
    }

    function confirmVoteBox(address sponsor) public {
        if (msg.sender != sponsor) {
            revert Event__NotSponsor();
        }

        _confirmVoteBox(sponsorVoteBox[sponsor]);
    }

    function confirmVoteBox(VoteBox memory voteBox) public {
        if (msg.sender != voteBox.sponsor) {
            revert Event__NotSponsor();
        }
        _confirmVoteBox(voteBox);
    }

    function _confirmVoteBox(VoteBox memory voteBox) internal {
        if (clock() > voteBox.startTime) {
            revert Event__Late(clock(), voteBox.startTime);
        }

        voteBox.confirmed = true;
        voteBox.ballotBox = new BallotBox(i_token, voteBox.timeTillStart, voteBox.timeToVote);
        sponsorVoteBox[voteBox.sponsor] = voteBox;
    }

    // Getter Functions
    function getNonprofit() public view returns (address) {
        return i_nonprofit;
    }

    function getEventTitle() public view returns (string memory) {
        return eventTitle;
    }

    function getGovernanceToken() public view returns (address) {
        return address(i_token);
    }

    function isSponsor(address sponsor) public view returns (bool) {
        for (uint i = 0; i < sponsors.length; i++) {
            if (sponsors[i] == sponsor) {
                return true;
            }
        }

        return false;
    }

    function getNumSponsors() public view returns (uint256) {
        return sponsors.length;
    }

    function getSponsor(uint256 index) public view returns (address) {
        return sponsors[index];
    }

    function getBallotBox(address sponsor) public view returns (address) {
        return address(sponsorVoteBox[sponsor].ballotBox);
    }

    function getBallotBoxDescription(address sponsor) public view returns (string memory) {
        return sponsorVoteBox[sponsor].description;
    }

    function getBallotBoxTimeTillStart(address sponsor) public view returns (uint256) {
        return sponsorVoteBox[sponsor].timeTillStart;
    }

    function getBallotBoxStartTime(address sponsor) public view returns (uint256) {
        return sponsorVoteBox[sponsor].startTime;
    }

    function getBallotBoxTimeToVote(address sponsor) public view returns (uint256) {
        return sponsorVoteBox[sponsor].timeToVote;
    }

    function ballotBoxConfirmed(address sponsor) public view returns (bool) {
        return sponsorVoteBox[sponsor].confirmed;
    }

    // Special Getter Functions
    function clock() public view returns (uint48) {
        return Time.blockNumber();
    }
}
