// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "./Ballot.sol";
import "../../Election.sol";

//ranking ballot
contract IRV is Ballot {
    uint[][] Votes;

    function vote(
        address _voter,
        uint _candidate,
        uint _score,
        uint[] memory voteArr
    ) external override onlyOrganizerContract {
        _voter;
        _candidate;
        _score;
        require(voteStatus[_voter] == false, "Voter already voted");
        Votes.push(voteArr);
        voteStatus[_voter] = true;
    }
    function getVoteCount(
        uint _candidate,
        uint _weight
    ) external pure override returns (uint) {
        _weight = 1;
        _candidate;
        return uint(1);
    }
    function getVoteArr() external view override returns (uint[][] memory) {
        return Votes;
    }
}