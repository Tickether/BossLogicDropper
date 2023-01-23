
import './App.css';
import bossLogic from './BossLogicAddress.json';
import bossLogicDrop from './BossLogicDropper.json';
import { ethers } from "ethers";
import { useState } from 'react';
import Web3Modal from "web3modal";
//import WalletConnectProvider from "@walletconnect/web3-provider";
//import {CoinbaseWalletSDK} from "@coinbase/wallet-sdk";

const providerOptions = {
  /*
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: "8231230ce0b44ec29c8682c1e47319f9" // required
    }
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK, // required
    options: {
      infuraId: "8231230ce0b44ec29c8682c1e47319f9" // required
    }
  }
  */
};

const bossLogicAddress = '0x3E4a79DA833bA1b844A90A352810437AEA0c49A6'; //  Boss Logic ETH MAINNET
const bossLogicDropper = '0x4dC38Afe2ddBD44fAC2e560CD0DC606377d1FDFA'; //  Boss Logic Dropper ETH MAINNET

let droplist = require ('./droplist');
let dropList = droplist.dropListAddresses().sort(function () {
  return Math.random() - 0.5;
});


console.log(dropList)



function ForAll() {
  let numbers = [];
  for (let i = 1877; i <= 3753; i++) {
    numbers.push(i);
  }
return numbers;
}

let tokenList = ForAll().sort(function () {
  return Math.random() - 0.5;
});
console.log(tokenList)


function App() {
  
  const [web3Provider, setWeb3Provider] = useState(null)
  
  const connectAccount = async () => { 
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions // required
      });
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      console.log(provider)
      const signer = provider.getSigner();
      const address = (await signer.getAddress()).toLowerCase();
      console.log(address)
      if(provider) {
        setWeb3Provider(provider)
      }      
    } catch (error) {
      console.error(error)
    }
  }


  async function setApprovalForAll() {

    const provider = web3Provider;
    const signer = provider.getSigner();
    const address = (await signer.getAddress()).toString();
    const bossLogicContract = new ethers.Contract(
      bossLogicAddress,
      bossLogic.output.abi,
      signer
    );
    console.log(bossLogicContract)
    try {
      let res = await bossLogicContract.isApprovedForAll(address, bossLogicDropper);
      console.log('res: ', res)
      if (res === false ){
        let response = await bossLogicContract.setApprovalForAll(bossLogicDropper, true);
        console.log('response: ', response)
        const transactionHash = response['hash']
        const txReceipt = []
        do {
        let txr = await web3Provider.getTransactionReceipt(transactionHash)
        txReceipt[0]=txr
        console.log('confirming...')
        } while (txReceipt[0] == null) ;
        
        console.log(txReceipt[0])
      } else {
        console.log('Approved for Transfer')
      }
    } 
    catch (err) {
      console.log('error', err )
    }
  }

  async function handleAirdrop() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const bossLogicDropperContract = new ethers.Contract(
        bossLogicDropper,
        bossLogicDrop.output.abi,
        signer
      );
      
      try {
        // set approval for airdrop contract to move tokens from connected wallet
        await setApprovalForAll();
        // shuffle token array for airdrop randomness
        let tokenRandom = tokenList.sort(function () {
          return Math.random() - 0.5;
        });
        console.log(tokenRandom)
        const response = await bossLogicDropperContract.BossLogicDrop((dropList), (tokenRandom));
        console.log('response: ', response) 
      } 
      catch (err) {
        console.log('error', err )
      }
    }
  }


  return (
    <div className="App">
      {web3Provider === null ? (

          <div className='connectDiv'>
            <div className='btnDiv'>
              <button onClick={connectAccount}>
                Connect
              </button>
            </div>
          </div>
          
        ) : (

          <div className='connectedDiv'>
            <span className='welcome'> 
              Welcome Boss Logic! You're Connected!!!
            </span>
            <p> 
            <span>{tokenList.length}</span> Boss Logic Immortals Ready for Airdrop!
            </p>
            <div className='btnDiv'>
              <button onClick={handleAirdrop}>Airdrop</button>
            </div>
          </div>
        
        )
      }
    </div>
  );
}

export default App;
