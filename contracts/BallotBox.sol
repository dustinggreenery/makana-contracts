// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";
import {Time} from "@openzeppelin/contracts/utils/types/Time.sol";
import "hardhat/console.sol";

error BallotBox__NotOpen(BallotBox.BBState state, uint256 time);
error BallotBox__NotClosed(BallotBox.BBState state, uint256 time);
error BallotBox__AlreadyCast(address voter);

contract BallotBox is AutomationCompatibleInterface {
    // Type for State of Ballot Box
    enum BBState {
        SETUP,
        VOTING_PERIOD,
        RESULTS
    }
    enum Result {
        FOR,
        AGAINST,
        TIE
    }

    // Governance Token
    ERC721Votes private immutable i_governanceToken;

    // Ballots, Result
    Result private s_result;
    uint256 private s_ballotsFor;
    uint256 private s_ballotsAgainst;
    mapping(address voter => bool) private hasVoted;

    // Time/State
    BBState private s_state;
    uint256 private immutable i_snapshot; // also start time
    uint256 private immutable i_timeToVote;

    // Event when a ballot is entered
    event BallotCast(address indexed voter, bool support);

    constructor(ERC721Votes tokenAddress, uint256 timeTillStart, uint256 timeToVote) {
        i_governanceToken = ERC721Votes(address(tokenAddress));
        i_snapshot = clock() + timeTillStart;
        i_timeToVote = timeToVote;
        s_state = BBState.SETUP;
    }

    function vote(bool support) public returns (uint256) {
        if (s_state != BBState.VOTING_PERIOD) {
            revert BallotBox__NotOpen(s_state, block.timestamp);
        }

        address voter = msg.sender;
        uint256 weight = getVotes(voter, i_snapshot);

        if (hasVoted[voter]) {
            revert BallotBox__AlreadyCast(voter);
        }
        hasVoted[voter] = true;

        if (support) {
            s_ballotsFor += weight;
        } else if (!support) {
            s_ballotsAgainst += weight;
        }

        emit BallotCast(voter, support);

        return weight;
    }

    function checkUpkeep(
        bytes memory
    ) public view override returns (bool upkeepNeeded, bytes memory) {
        if (s_state == BBState.SETUP) {
            upkeepNeeded = clock() >= i_snapshot;
        } else if (s_state == BBState.VOTING_PERIOD) {
            upkeepNeeded = clock() >= i_snapshot + i_timeToVote;
        }
    }

    function performUpkeep(bytes calldata performData) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        require(upkeepNeeded);

        if (s_state == BBState.SETUP) {
            s_state = BBState.VOTING_PERIOD;
        } else if (s_state == BBState.VOTING_PERIOD) {
            s_state = BBState.RESULTS;

            if (s_ballotsFor > s_ballotsAgainst) {
                s_result = Result.FOR;
            } else if (s_ballotsFor < s_ballotsAgainst) {
                s_result = Result.AGAINST;
            }
            if (s_ballotsFor == s_ballotsAgainst) {
                s_result = Result.TIE;
            }
        }
    }

    // Getter Functions:
    function getState() public view returns (BBState) {
        return s_state;
    }

    function getTokenAddress() public view returns (address) {
        return address(i_governanceToken);
    }

    function getResult() public view returns (Result) {
        if (s_state != BBState.RESULTS) {
            revert BallotBox__NotClosed(s_state, block.timestamp);
        }
        return s_result;
    }

    function getBallotsFor() public view returns (uint256) {
        if (s_state != BBState.RESULTS) {
            revert BallotBox__NotClosed(s_state, block.timestamp);
        }
        return s_ballotsFor;
    }

    function getBallotsAgainst() public view returns (uint256) {
        if (s_state != BBState.RESULTS) {
            revert BallotBox__NotClosed(s_state, block.timestamp);
        }
        return s_ballotsAgainst;
    }

    function addressHasVoted(address voter) public view returns (bool) {
        return hasVoted[voter];
    }

    function getStartTime() public view returns (uint256) {
        return i_snapshot;
    }

    function getTimeToVote() public view returns (uint256) {
        return i_timeToVote;
    }

    // Special Getter Functions:
    function getVotes(address account, uint256 timepoint) internal view returns (uint256) {
        return i_governanceToken.getPastVotes(account, timepoint);
    }

    function clock() public view returns (uint48) {
        return Time.blockNumber();
    }
}
