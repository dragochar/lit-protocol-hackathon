import React, { useState, useEffect } from 'react';
import LitJsSdk from 'lit-js-sdk'


const Testing = () => {
    const [jwt, setJwt] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');
    const [authSig, setAuthSig] = useState('');
    const [networkLoading, setNetworkLoading] = useState(true);



     async function provisionAccess() {

        const litNodeClient = new LitJsSdk.LitNodeClient();
        await litNodeClient.connect();

        var accessControlConditions = [
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

        const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: 'solana'});

        const resourceId = {
            baseUrl: 'http://localhost:3000',
            path: '/zac',
            orgId: "",
            role: "",
            extraData: ""
          }
        const chain = 'solana';
        const permanent = false;

        await litNodeClient.saveSigningCondition({ accessControlConditions, chain, authSig, resourceId });

    }


    return (
        <div>
            <h1>yo</h1>
            <button onClick={provisionAccess}>Provision Access</button>
        </div>
    );
}

export default Testing;