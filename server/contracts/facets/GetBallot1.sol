// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
pragma experimental ABIEncoderV2;

// Import Ballots
import "./votingApp/ballot/Ballot.sol";
import "./votingApp/ballot/GeneralBallot.sol";
import "./votingApp/ballot/PreferenceBallot.sol";
import "./votingApp/ballot/BordaBallot.sol";
//New Ballot

import "../libraries/LibDiamond.sol";

contract GetBallot1 {
    // ------------------------------------------------------------------------------------------------------
    //                                          DEPENDENCIES
    // ------------------------------------------------------------------------------------------------------

    Ballot _ballot;

    // ------------------------------------------------------------------------------------------------------
    //                                              STATE
    // ------------------------------------------------------------------------------------------------------

    address electionOrganizerContract;

    // // ------------------------------------------------------------------------------------------------------
    // //                                            CONSTRUCTOR
    // // ------------------------------------------------------------------------------------------------------

    // constructor() {
    //     electionOrganizerContract = msg.sender;
    // }

    /*
        Each ballot has specific result calculation algorithms
        So the algorithms specific to the ballots are indexed from 1
         
            For GeneralBallot, say there are algorithms: GeneralResults and Moore
            GeneralResults would be 1
            Moore would be 2

            For PreferenceBallot, now Oklahoma would be 1 again

        Ballot Types and ResultCalcultors

            1 : GeneralBallot
                1 : GeneralResults
                2 : Moore
            
            2 : PreferenceBallot
                1 : Oklahoma
            
            3 : ScoreBallot

            // add new Ballots and ResultCalculators here
    */

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------

    function getNewBallot1(uint _ballotType) external {
        /*
            1: GenralBallot
            2: PreferenceBallot
            3: ScoreBallot
            // new Ballots
            default: GeneralBallot
        */
        if (_ballotType == 1) {
            _ballot = new GeneralBallot();
        } else if (_ballotType == 2) {
            _ballot = new PreferenceBallot();
        } else if (_ballotType == 3) {
            // ballot = new ScoreBallot();
        } else if (_ballotType == 4) {
            _ballot = new BordaBallot();
        }

        LibDiamond.electionStorage().ballot = _ballot;
    }
}
