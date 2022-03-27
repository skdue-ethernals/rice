import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers'


import axios from 'axios';

import UserSearch from '../components/UserSearch'
import ShowUser from '../components/ShowUser'
import VotePopup from '../components/VotePopup'

import '../assets/VotePage.css';
import getSessionAddress from '../utils/FetchVoteSession';
import voteFactory from '../artifacts/contracts/vote/VoteFactory.sol/VoteFactory.json'
import voteSession from '../artifacts/contracts/vote/VoteSession.sol/VoteSession.json'

const factoryAddress = "0x434Cbdedc7A8069C5F2426C617C3858Bc88014d3"

const Vote = () => {
	const bearerToken = process.env.REACT_APP_TWITTER_API_KEY

	let [candidateIDs, setCandidateID] = useState(["."]) //list of candidate id
	let [newCandidateList, setNewCandidateList] = useState([]) //list of new candidate id
	let [candidateList, setCandidateList] = useState([]) // list candidate details(id, name, screen name, followers, profile image)
	let [select, setSelect] = useState({}) // a candidate that user selected
	let [voteAmount, setVoteAmount] = useState("0") 
	let [winner,setWinner] = useState()
	let [award, setAward] = useState()

  useEffect(() => {
		// create candidate details list from candidate id
		getCandidateList()
		onfetchVote()

		onfetchStatus()
		

		

  }, []);



//   async function findWinner(){
// 	  let winner = 0;
// 	  let maxVote = 0;
// 	await candidateIDs.forEach((id)=>{
// 		fetchVoteCandidate(id).then((temp_vote)=>{
// 			if (temp_vote > maxVote){
// 				 winner = id;
// 				 maxVote = temp_vote
// 				 setWinner(winner)
// 			}
// 		})	
// 	})
//   }

//   async function fetchVoteCandidate(id){
// 	if (typeof window.ethereum !== 'undefined') {
// 		const provider = new ethers.providers.Web3Provider(window.ethereum)
// 		console.log({ provider })
// 		const signer = provider.getSigner();
// 		const sessionAddress = getSessionAddress(factoryAddress)
// 		  const contractVote = new ethers.Contract( sessionAddress, voteSession.abi, provider)
// 		  try{
// 			  const data = await contractVote.candidate(id)
// 			  return parseInt(data._hex,16)
// 		  }catch (err) {
// 		  console.log("Error: ", err)
// 	  }
// 	}
//   }

  async function findAward(){
	if (typeof window.ethereum !== 'undefined') {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner();
		const sessionAddress = getSessionAddress(factoryAddress)
		  const contractVote = new ethers.Contract( sessionAddress, voteSession.abi, provider)
		  try{
			  const aw = await contractVote.award()
			  setAward(aw)
			  const win = await contractVote.winner()
			  setWinner(win)
		  }catch (err) {
		  console.log("Error: ", err)
	  }
	}
  }

  async function getCandidateList(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
      const sessionAddress = getSessionAddress(factoryAddress)
      const contract = new ethers.Contract(factoryAddress, voteFactory.abi, provider)
        const contractVote = new ethers.Contract( sessionAddress, voteSession.abi, provider)
        try{
            await contractVote.getCandidateName().then((data)=>{
				setCandidateID(data)
				getAccountProfile(data)
			})
            
        }catch (err) {
        console.log("Error: ", err)
    }
}  

  }

  async function onfetchStatus(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const sessionAddress = getSessionAddress(factoryAddress)
        const contractVote = new ethers.Contract( sessionAddress, voteSession.abi, provider)
        try{
            const data = await contractVote.status()
			if (data == 1){
					findAward()
				// setTimeout(function () {
				// 	findWinner()
				// }, 10000);		 
			}
        }catch (err) {
        console.log("Error: ", err)
    }
  }
}  


  async function onfetchVote(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const sessionAddress = getSessionAddress(factoryAddress)
        const contractVote = new ethers.Contract( sessionAddress, voteSession.abi, provider)
        try{
            const data = await contractVote.remainingVote(signer.getAddress())
			// fix this to decimal
            setVoteAmount(parseInt(data._hex,16))
        }catch (err) {
        console.log("Error: ", err)
    }
  }
}  

async function testTwitter(e) {
	e.preventDefault()
	console.log(e.target[0].value)
	 await axios.get(`https://api.twitter.com/1.1/users/lookup.json?user_id=${e.target[0].value}`, {
		"headers": {
			'Authorization': `Bearer ${bearerToken}`
		}
	})
	.then(response => {
		console.log(response.data)
		// setCandidateList(response.data)
	})
	.catch(error => {
		window.alert(error)
		console.log(error)
	})
}


	async function getAccountProfile(IDs) {
		console.log(IDs)
 		await axios.get(`/1.1/users/lookup.json?user_id=${IDs}`, {
			"headers": {
				'Authorization': `Bearer ${bearerToken}`
			}
		})
		.then(response => {
			// console.log(response.data)
			setCandidateList(response.data)
		})
		.catch(error => {
			window.alert(error)
			// console.log(error)
		})
  }

	function addCandidate(account) {
		// console.log(account)
		if (candidateIDs.includes(account.id_str)) {
			window.alert(`${account.name}(@${account.screen_name}) is already existed in candidate list`)
		} else {
			// add accountID into database
			let temp = candidateIDs.concat(account.id_str)
			setCandidateID(temp)
			// add Candidate's account profile into NewCandidateList
			temp = newCandidateList.concat(account)
			setNewCandidateList(temp)
		}
	}

  return (
		<div className='vote'>

			<form onSubmit={testTwitter}>
				<input type="text" />
				<button>Submit</button>
			</form>

			{!award && "RICE: "+ voteAmount}{award && "Session is ended!!"}<br/>
			{!award && "Session is on going"}{award && "Winner is: "+ winner}<br/>
			
			{award && "Award is: "+ award}<br/>
			<div style={{padding: "20px", fontSize: "30px"}}>Vote</div>
			<div className='vote-div'>
				<table className='vote-table'>
					
					{/* <tbody>
						{candidateList.length!==0 &&  candidateList.map((candidate, index) => {
							const profile_image = candidate.profile_image_url_https.replace("_normal", "")
							return (
								<tr key={index} className={candidate.id_str === select.id_str ? "select" : "table"}>
									<td className='vote-td'><img src={profile_image} alt="Account Profile" style={{borderRadius: "100%", width: "50px"}} 
										onClick={() => setSelect(candidate)} className='vote-select-button'/></td>
									<td className='vote-td' ><button className='vote-select-button' value={candidate} 
										onClick={() => setSelect(candidate)}>{candidate.name}</button>
									<ShowUser accountProfile={[candidate.id_str, candidate.name, candidate.screen_name, candidate.followers_count, profile_image]} /></td>
								</tr>
							);
						})}
						
					</tbody> */}
				</table>
			</div>
			<div style={{padding: "20px", fontSize: "20px"}}>Add Your New Candidate</div>
			<div className='vote-div'>
				<table className='vote-table'>
					{/* <tbody>
						{
							newCandidateList.map((candidate, index) => {
							const profile_image = candidate.profile_image_url_https.replace("_normal", "")
							return (
								<tr key={index} className={candidate.id_str === select.id_str ? "select" : "table"}>
									<td className='vote-td'><img src={profile_image} alt="Account Profile" style={{borderRadius: "100%", width: "50px"}} 
										onClick={() => setSelect(candidate)} className='vote-select-button'/></td>
									<td className='vote-td' ><button className='vote-select-button' value={candidate} 
										onClick={() => setSelect(candidate)}>{candidate.name}</button>
									<ShowUser accountProfile={[candidate.id_str, candidate.name, candidate.screen_name, candidate.followers_count, profile_image]} /></td>
								</tr>
							);
						})}
					</tbody> */}
				</table>
				<div style={{paddingTop: newCandidateList.length > 0 ? "20px": "0"}}>
					<UserSearch sendData={addCandidate} />
				</div>
			</div>
			<VotePopup voteAccount={select}/>
		</div>
  );
}
export default Vote;