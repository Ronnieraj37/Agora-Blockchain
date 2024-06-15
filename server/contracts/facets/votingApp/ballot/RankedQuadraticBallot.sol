//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Ballot.sol";

contract RankedQuadraticBallot is Ballot {
    error AlreadyVoted();

    uint public immutable contractType;

    /// @notice This helps to set votingAlgo to RankedVoting or QudraticVoting
    constructor(uint _contractType) {
        contractType = _contractType;
    }

    mapping(uint => uint) candidateVotes;

    function checkCreditsRanked(
        uint[] memory voteArr
    ) internal view returns (bool) {
        uint _candidates = candidates.length;
        uint totalCredits = (_candidates * (_candidates + 1)) / 2;
        for (uint i = 0; i < voteArr.length; i++) {
            totalCredits = totalCredits - voteArr[i];
        }
        return totalCredits == 0;
    }

    function checkCreditsQuadratic(
        uint[] memory voteArr
    ) internal pure returns (bool) {
        uint totalCredits = 100;
        for (uint i = 0; i < voteArr.length; i++) {
            totalCredits = totalCredits - voteArr[i];
        }
        return totalCredits == 0;
    }

    function vote(
        address _voter,
        uint _candidate,
        uint _score,
        uint[] memory voteArr
    ) external override onlyOrganizerContract {
        if (voteStatus[_voter]) revert AlreadyVoted();
        uint totalCandidates = candidates.length;
        require(
            voteArr.length == totalCandidates,
            "Votes Dont match the Candidates"
        );
        if (contractType == 0)
            require(checkCreditsRanked(voteArr), "Incorrect Credits Given");
        else require(checkCreditsQuadratic(voteArr), "Incorrect Credits given");
        if (contractType == 0) {
            for (uint i = 0; i < totalCandidates; i++) {
                candidateVotes[voteArr[i]] += totalCandidates - i;
            }
        }
        // Assign direct points for quadratic voting
        else {
            for (uint i = 0; i < totalCandidates; i++) {
                candidateVotes[i] += voteArr[i];
            }
        }
        voteStatus[_voter] = true;
    }

    function getVoteCount(
        uint _candidate,
        uint _weight
    ) external view override returns (uint) {
        return candidateVotes[_candidate];
    }

    function getVoteArr()
        external
        pure
        override
        returns (uint[][] memory votes)
    {}
}
