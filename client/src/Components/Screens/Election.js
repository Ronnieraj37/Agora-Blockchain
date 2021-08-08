import { useTimer } from 'react-timer-hook';
import { useState, useEffect, useMemo } from 'react';
import { useLocation } from "react-router-dom";
import '../styles/Election.scss';
import '../styles/Layout.scss';
import VoteModal from './modals/VoteModal';
import DeleteModal from './modals/DeleteModal';
import AddCandidateModal from './modals/AddCandidateModal';
import Candidate from './modals/Candidate'
import Navbar from './Navbar';
import TimerStyled from './TimerStyled';
import { useCallContext } from "../../drizzle/calls";
import { AVATARS } from '../constants'
import { ImageComponent } from './Image';

function Election() {
    const [isAdmin, setAdmin] = useState(true);
    const [isActive, setActive] = useState(true);
	const [isPending, setPending] = useState(true);

	const search = useLocation().search;
	const contractAddress = new URLSearchParams(search).get('contractAddress');

	const { getCurrentElection, CurrentElection, currentElectionDetails, userInfo, account } = useCallContext();

	getCurrentElection(contractAddress);

	console.log(currentElectionDetails)

	return useMemo(() => {
		const CardItem = ({headerValue, descriptor, imgUrl, imgBackground = "#f7f7f7"}) => {
			return (
				<div className="shadow cardItem">
					<div className="centered">
						<div className="cardImageHolder" style={{backgroundColor: imgBackground}}>
							<div className="centered">
								<ImageComponent src={imgUrl} className="cardImage" />
								{/* <img src={imgUrl} className="cardImage" alt="profile-pic"/> */}
							</div>
						</div>

						<font size = "2" className="cardText">
							<font size="2">{headerValue}</font>
							<span className="text-muted">{descriptor}</span>
						</font>
					</div>
				</div>
			)
		}

		const MyTimer = ({ sdate, edate }) => {
			sdate *= 1000;
			edate *= 1000;
			let expiryTimestamp = 0;
			// console.log(Date.now(), " vs ", sdate, " vs ", edate);
			if(Date.now() < sdate) {
				expiryTimestamp = sdate;
			} else {
				// console.log("here")
				expiryTimestamp = edate;
			}
			const {
				seconds,
				minutes,
				hours,
				days,
				start
			} = useTimer({ expiryTimestamp, onExpire: () => {expiryTimestamp = edate}, autostart: "false"});
			useEffect(() => {
				console.log("hi")
			    start();
			}, [expiryTimestamp])
			return (
				<TimerStyled seconds={seconds} minutes={minutes} hours={hours} days={days} />
			);
		}      

		return (
			<div style={{backgroundColor: "#f7f7f7", minHeight: "100%"}}>
				<Navbar header={userInfo?.name} infoText={userInfo?.contractAddress} pictureUrl="/assets/avatar.png"/>
				<div style={{padding: "30px"}}>
					<div style={{width: "100%"}}>
						<div style={{float: "left"}}>
							<h5 style={{marginBottom: "0px"}}>{currentElectionDetails?.info?.name}</h5>
							<font className="text-muted" size="2">Ayush Tiwari</font><br/>
							{/* <font size="1" className="text-muted" style={{marginTop: "0px"}}>0xF30F9801df6c722C552Fd60E8E201A4c0524BFAb</font> */}
						</div>


						<div style={{float: "right", display: "flex"}}>
							<MyTimer sdate={currentElectionDetails?.info?.sdate} edate={currentElectionDetails?.info?.edate}/>
							{/* <DeleteModal Candidate={Candidate} isAdmin={isAdmin} isPending={isPending}/> */}
							<VoteModal account={account} Candidate={Candidate} CurrentElection={CurrentElection} currentElectionDetails={currentElectionDetails} isActive={isActive} isPending={isPending}/>
						</div>
					</div>

					<br/><br/><br/>

					<div className="cardContainer row">
						<CardItem headerValue={currentElectionDetails?.info?.algorithm} descriptor="Algorithm" imgUrl="/assets/totalElections.png"/>

						<CardItem headerValue={(new Date(currentElectionDetails?.info?.sdate * 1000)).toLocaleString()} descriptor="Start date" imgUrl="/assets/activeElections.png" imgBackground="#eaffe8"/>

						<CardItem headerValue={(new Date(currentElectionDetails?.info?.edate * 1000)).toLocaleString()} descriptor="End date" imgUrl="/assets/endedElections.png" imgBackground="#ffe8e8"/>

						<CardItem headerValue="137" descriptor="Total voters" imgUrl="/assets/pendingElections.png" imgBackground="#fffbd1"/>
					</div>

					<div className="layoutBody row">
						<div className="lhsLayout" style={{overflowY: "scroll"}}>
							<div className="lhsHeader" style={{marginTop: "10px"}}>
								<h5>Election Details</h5>
							</div>
							
							<div className="lhsBody" style={{textAlign: "justify"}}>
								<font size="2" className="text-muted">
									<p>{currentElectionDetails?.info?.description}</p>
								</font>

								<br/>

								<h5>About {currentElectionDetails?.info?.algorithm} Algorithm</h5>
								<font size="2" className="text-muted">
									The Boyer-Moore voting algorithm is one of the popular optimal algorithms which is used to find the majority element among the given elements that have more than N/ 2 occurrences. This works perfectly fine for finding the majority element which takes 2 traversals over the given elements, which works in O(N) time complexity and O(1) space complexity.   
								</font>
							</div>
						</div>

						<div className="rhsLayout" style={{overflowY: "scroll"}}>
							<div className="lhsHeader" style={{marginTop: "10px", display: 'flex', justifyContent: 'space-between'}}>
								<h5 style={{width: "60%"}}>Candidates ({currentElectionDetails?.candidate?.length || 0})</h5>
								<AddCandidateModal CurrentElection={CurrentElection} account={account}/>
							</div>

							<br/>

							{
								currentElectionDetails?.candidate?.map((candidate) => (
									<Candidate name={candidate?.name} id={candidate?.id} about={candidate?.about} voteCount={candidate?.voteCount} imageUrl={AVATARS[candidate?.id % AVATARS?.length] || '/assets/avatar.png'} modalEnabled="true"/> 
								))
							}


							{/* <Candidate name="Ayush" id="2" imageUrl="/assets/avatar2.png" modalEnabled="true"/>

							<Candidate name="Thuva" id="3" imageUrl="/assets/avatar4.png" modalEnabled="true"/>

							<Candidate name="Bruno" id="4" imageUrl="/assets/avatar3.png" modalEnabled="true"/> */}
						</div>
					</div>

					<br/>
				</div>
			</div>
		)
	}, [CurrentElection, userInfo, currentElectionDetails])
}

export default Election;