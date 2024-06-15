//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ResultCalculator.sol";
import "../ballot/Ballot.sol";

contract RankedQuadraticResults is ResultCalculator {
    uint[] winners;

    function getResult(
        Ballot _ballot,
        uint _voterCount
    ) external override returns (uint[] memory) {
        uint maxScore = 0;
        uint numOfCandidates = _ballot.getCandidateCount();
        // Iterate through candidates to find the one(s) with the highest score
        for (uint i = 0; i < numOfCandidates; i++) {
            uint candidateScore = _ballot.getVoteCount(i, 1);
            if (candidateScore > maxScore) {
                // Reset result array as we found a new maximum score
                delete winners;

                // Update maximum score and add candidate to result array
                maxScore = candidateScore;
                winners.push(i);
            } else if (candidateScore == maxScore) {
                // Add candidate to result array if they have the same score as the current maximum
                winners.push(i);
            }
        }

        return winners;
    }
}
