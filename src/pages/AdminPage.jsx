import React from 'react';
import { ethers } from 'ethers'
import RICE from '../artifacts/contracts/Token.sol/RICE.json'
import WMATIC from '../artifacts/contracts/WMatic.sol/WMATIC.json'
import PoolFactory from '../artifacts/contracts/PoolFactory.sol/PoolFactory.json'

import '../assets/SwapPage.css';

const AdminPage = () => {
  const tokenAddress = 'address'
  const poolFactoryAddress = 'address'
  const wMaticAddress ='address'

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchPool(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
      console.log({ provider })
      const contract = new ethers.Contract(poolFactoryAddress, PoolFactory.abi, provider)
      try {
        const data = await contract.getTotalAmountInPool(e.target[0].value,e.target[1].value)

        console.log('Total: ',data[0],data[1])
      } catch (err) {
        console.log("Error: ", err)
      }
    }  
  }


  async function createPool(e){
    e.preventDefault();
    console.log("going to create pool with token0 address ",e.target[0].value," and token1 address ", e.target[1].value)
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({ provider })
        const signer = provider.getSigner()
     
      const rice = new ethers.Contract(tokenAddress, RICE.abi, signer)
      await rice.approve(poolFactoryAddress, '10000000000000000000')

      const wMatic = new ethers.Contract(wMaticAddress, WMATIC.abi, signer)
      await wMatic.approve(poolFactoryAddress, '10000000000000000')

      setTimeout(function () {
        const contract = new ethers.Contract(poolFactoryAddress, PoolFactory.abi, signer)
        const transaction = contract.createNewPool(
              e.target[0].value, //rice
              e.target[1].value, // matic
              '10000000000000000000',
              '10000000000000000')
      }, 20000);
    }
  }

  return (
    <div className='admin'>
      ADMIN's THING
      <form onSubmit={createPool}>
        create pool<br/>
        <input placeholder='address token0'></input><br/>
        <input placeholder='address token1'></input><br/>

        <button>submit</button>
      </form>
      <form onSubmit={fetchPool}>
          fetch pool<br/>
          <input placeholder='address token0'></input><br/>
          <input placeholder='address token1'></input><br/>

          <button>submit</button>
        </form>
    </div>
  );
}
export default AdminPage;