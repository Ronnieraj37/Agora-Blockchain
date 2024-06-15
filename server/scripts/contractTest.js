/* global ethers */
/* eslint prefer-const: "off" */

const { getSelectors, FacetCutAction } = require("./libraries/diamond.js");
const { deployDiamond } = require("./deploy.js");

async function contractTest() {
  const accounts = await ethers.getSigners();
  const contractOwner = accounts[0];

  //   const diamondAddress2 = await deployDiamond();
  //   console.log("Diamond 2 address ", diamondAddress2);

  // deploy DiamondCutFacet
  const DiamondCutFacet = await ethers.getContractFactory("DiamondCutFacet");
  const diamondCutFacet = await DiamondCutFacet.deploy();
  await diamondCutFacet.deployed();

  // deploy Diamond
  const Diamond = await ethers.getContractFactory("Diamond");
  const diamond = await Diamond.deploy(
    contractOwner.address,
    diamondCutFacet.address
  );
  await diamond.deployed();

  // deploy DiamondInit
  // DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
  // Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
  const DiamondInit = await ethers.getContractFactory("DiamondInit");
  const diamondInit = await DiamondInit.deploy();
  await diamondInit.deployed();
  const FacetNames = [
    "DiamondLoupeFacet",
    "OwnershipFacet",
    "Authentication",
    "ElectionOrganizer",
    "ElectionFactory",
    "GetBallot",
    "GetResultCalculator",
  ];
  const cut = [];
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName);
    const facet = await Facet.deploy();
    await facet.deployed();
    cut.push({
      facetAddress: facet.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet),
    });
  }
  const diamondCut = await ethers.getContractAt("IDiamondCut", diamond.address);
  let tx;
  let receipt;
  // call to init function
  let functionCall = diamondInit.interface.encodeFunctionData("init");
  tx = await diamondCut.diamondCut(cut, diamondInit.address, functionCall);
  receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }
  const auth = await ethers.getContractAt("Authentication", diamond.address);
  await auth.init(diamond.address);
  console.log("success");

  try {
    const OrganizerInfo = {
      organizerID: 0,
      name: "Roshan",
      publicAddress: accounts[0].address,
    };
    await auth.createUser(OrganizerInfo);
    const electionOrg = await ethers.getContractAt(
      "ElectionOrganizer",
      diamond.address
    );
    const add = await electionOrg.getElectionStorage();
    console.log("address", add);
    const ElectionInfo = {
      electionID: 0,
      name: "Election1",
      description: "Test Election",
      startDate: 1769148606,
      endDate: 1785767499,
      electionType: 1,
    };

    const res = await electionOrg.createElection(ElectionInfo, 8, 8);

    const elections = await electionOrg.getOpenBasedElections();
    console.log("Success creating elections! ", elections);
    console.log("Elections : ", elections);

    const election1 = await ethers.getContractAt("Election", elections[0]);

    await election1.addCandidate([1, "Roshan", "Test1"]);
    await election1.addCandidate([2, "Ronnie", "Test2"]);
    await election1.addCandidate([3, "Roshani", "Test1"]);
    await election1.addCandidate([4, "Bada Lund", "Test2"]);

    console.log("Added candidates");

    await election1.vote(accounts[0].address, 0, 1, [1, 3, 4, 2]);
    await election1.vote(accounts[1].address, 0, 1, [2, 4, 3, 1]);
    await election1.vote(accounts[2].address, 0, 1, [1, 2, 3, 4]);

    const ballotAddress = await election1.getBallot();
    const ballot = await ethers.getContractAt("Ballot", ballotAddress);
    const votes0 = await ballot.getVoteCount(0, 1);
    const votes1 = await ballot.getVoteCount(1, 1);
    const votes2 = await ballot.getVoteCount(2, 1);
    const votes3 = await ballot.getVoteCount(3, 1);
    console.log(" ", votes0, " ", votes1, " ", votes2, " ", votes3);

    await election1.getResult();
    const results = await election1.getWinners();
    console.log("Results : ", results);
  } catch (error) {
    console.log("Error", error);
  }
  return diamond.address;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  contractTest()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

exports.contractTest = contractTest;
