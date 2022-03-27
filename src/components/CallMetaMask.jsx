import React, { useEffect, useState } from 'react';

import checkMetaMask from '../utils/CheckMetaMask';

import '../assets/CallMetaMask.css';

const MetaMask = () => {
  let [status, setStatus] = useState(checkMetaMask())
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(checkMetaMask())
      if (checkMetaMask() === "Connected") {
        clearInterval(interval);
      }
    }, 3000);
  }, []);

	async function callMetaMask() {
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		console.log("MetaMask account",accounts)
    return accounts
	}

  function handleSelect(status) {
    if (status === "Connect MetaMask") {
      console.log("thiss")
      callMetaMask().then(()=>{window.location.reload()})
    } else if (status === "Install MetaMask") {
      window.open(`https://metamask.io/`, `_blank`);
    }
  }

  return (
    <div>
      <button className={status === "Connected" ? "metamask-button-con":"metamask-button-dis"} 
        onClick={() => handleSelect(status)}>{status}</button>
    </div>
  );
}
export default MetaMask;