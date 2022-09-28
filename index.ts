import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { ScProvider, WellKnownChain } from "@polkadot/rpc-provider/substrate-connect";
import '@polkadot/api-augment';

// Construct
const wsProvider = new WsProvider("ws://localhost:9944");
const api = await ApiPromise.create({ provider: wsProvider });
const keyring = new Keyring({ type: "sr25519" });


await api.isReady;

// Good to go
console.log(api.genesisHash.toHex());
console.log(api.consts.balances.existentialDeposit.toHuman());

//
const ADDR = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

const now = await api.query.timestamp.now();

// const {nonce, consumers, privders, sufficients, data} = await api.query.system.account(ADDR);
const accountQuery = await api.query.system.account(ADDR);
const {nonce, data} = await api.query.system.account(ADDR);

console.log(`${now}: balance of ${data.free} and a nonce of ${nonce}`);
console.log(`Balance is ${accountQuery}, type is ${typeof accountQuery}`);
console.log(`Balance is ${accountQuery.data.free}`);

// console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`);

// Retrieve the chain name
const chain = await api.rpc.system.chain();

// Retrieve the latest header
const lastHeader = await api.rpc.chain.getHeader();

// Log the information

console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
// const BOB = keyring.addFromUri('//Bob', { name: 'Bob default' });
const alice = keyring.addFromUri('//Alice', { name: 'Alice default' });
const bob = keyring.addFromAddress('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', { name: 'Bob' });

console.log('====================================');
const txHash = await new Promise((resolve, reject) => {
  api.tx.balances
    .transfer(bob.address, 12345)
    .signAndSend(alice, ({ status }) => {
      if (status.isInBlock) {
        resolve(console.log(`inblock ` + status.asInBlock.toHex()));
      } else if (status.isFinalized) {
        resolve(console.log(`finalize ` + status.asFinalized.toHex()));
      }
    })
    .catch(reject);
});

// Show the hash
// console.log(`Submitted with hash ${txHash}`);
// console.log('====================================');
// const unsub = await api.tx.balances
//   .transfer(bob.address, 12345)
//   .signAndSend(alice, (result) => {
//     console.log(`Current status is ${result.status}`);

//     if (result.status.isInBlock) {
//       console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
//     } else if (result.status.isFinalized) {
//       console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);

//       unsub();
//     }
//   });


const resC = await api.tx.dao.callBallances(alice).signAndSend(alice);
console.log('====================================');
console.log("restC: " + resC);
console.log('====================================');
