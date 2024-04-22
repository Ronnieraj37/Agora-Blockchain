// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import "../../Election.sol";
import "../resultCalculator/ResultCalculator.sol";

abstract contract Ballot {
    // ------------------------------------------------------------------------------------------------------
    //                                              STATE
    // ------------------------------------------------------------------------------------------------------
    uint[] candidates;

    mapping(address => bool) voteStatus;
    address electionOrganizerContract;
    bool isInitialized;

    modifier onlyOrganizerContract() {
        require(
            msg.sender == electionOrganizerContract,
            "Must be called from the election organizer contract"
        );
        _;
    }

    function initialize(address _contractOwner) external {
        require(isInitialized == false, "Already Initialized");
        electionOrganizerContract = _contractOwner;
        isInitialized = true;
    }

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------

    function addCandidate(uint _candidate) external {
        candidates.push(_candidate);
    }

    function getCandidates() external view returns (uint[] memory) {
        return candidates;
    }

    function getVoteStatus(address _voter) external view returns (bool) {
        return voteStatus[_voter];
    }

    function vote(
        address _voter,
        uint _candidate,
        uint _weight,
        uint[] memory voteArr
    ) external virtual;

    /*
    Here the weight resembles the preference for preferential voting, in which case the function returns 
    the votes of a candidate in a particular preference.

    Else it just returns the vote count or score count.
    */
    function getVoteCount(
        uint _candidate,
        uint _weight
    ) external view virtual returns (uint);
    function getVoteArr() external virtual returns (uint[][] memory votes);
}
