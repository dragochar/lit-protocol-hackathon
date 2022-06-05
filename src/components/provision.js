import React, { useState, useEffect } from 'react';
import LitJsSdk from 'lit-js-sdk'
import jwt_decode from "jwt-decode";


const accessControlConditions = [
  {
    method: "getBalance",
    params: [":userAddress"],
    chain: 'solana',
    returnValueTest: {
      key: "",
      comparator: ">=",
      value: "100000000", // equals 0.1 SOL
    },
  },
];
const resourceId = {
  baseUrl: 'http://localhost:3000',
  path: '/dan',
  orgId: "",
  role: "",
  extraData: ""
}
async function fetchToken() {

    const litNodeClient = new LitJsSdk.LitNodeClient();


    const solAuthSig = await LitJsSdk.checkAndSignAuthMessage({ chain: 'solana' });

    const chain = 'solana';
    const permanent = false;

    const signingArgs = {
      solRpcConditions: accessControlConditions,
      chain,
      authSig: solAuthSig,
      resourceId
    }

    await litNodeClient.connect();
    let jwt;
    try {
      console.log('>>>>>> attempting to fetch signed token! <<<<<<')
      jwt = await litNodeClient.getSignedToken(signingArgs)
    } catch(err) {
      console.log('error fetching jwt', err);
    }

    if (jwt) {
      console.log('signing token found', { jwt })
      return jwt;
    }
}

const Provision = () => {
  const [jwt, setJwt] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [authSig, setAuthSig] = useState('');
  const [networkLoading, setNetworkLoading] = useState(true);


  
  async function setToken() {
    let maybeJwt = await fetchToken()
    if (maybeJwt) {
      setJwt(maybeJwt)
    }
  }


  async function provisionAccess() {

    const litNodeClient = new LitJsSdk.LitNodeClient();
    const solAuthSig = await LitJsSdk.checkAndSignAuthMessage({ chain: 'solana' });


    const chain = 'solana';
    const permanent = false;

    const signingArgs = {
      solRpcConditions: accessControlConditions,
      chain,
      authSig: solAuthSig,
      resourceId
    }

    await litNodeClient.connect();
    console.log('>>>>>>>>>> creating signing condition')
    await litNodeClient.saveSigningCondition({
      ...signingArgs, permanent: false
    });

  }


  return (
    <div
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '75%'
        }}
    >
      <h1>yo</h1>
      <button onClick={provisionAccess}>Create Signing Token</button>
      <button onClick={setToken}>Fetch Signing Token</button>
      {jwt && <div>

        Token: { JSON.stringify(jwt_decode(jwt), null, 2) }
      </div>
      }
    </div>
  );
}

export default Provision;