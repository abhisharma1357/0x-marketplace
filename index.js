const abi = require("./test/ExchangeABI");
const ethers = require('ethers');
let privateKey = "44778F6DF03D73F72CBEBE74AD880503F3AEC7ED8A526AD2977BBD0DFE0616FD";
let wallet = new ethers.Wallet(privateKey);
let provider = ethers.getDefaultProvider('rinkeby');
let walletWithProvider = new ethers.Wallet(privateKey, provider);

//exchange contract
let ExchangeAbi = abi.abiObject;
let ExchnageContractAddress = "0x5d8b148f8003733add728af4fb6c50af63f9c550";
let Exchnagecontract = new ethers.Contract(ExchnageContractAddress, ExchangeAbi, walletWithProvider);

const {assetDataUtils,BigNumber,ContractWrappers,generatePseudoRandomSalt,Order,orderHashUtils,signatureUtils} = require('0x.js');
const { RPCSubprovider, Web3ProviderEngine } = require('0x.js');
const providerEngine = new Web3ProviderEngine();

providerEngine.addProvider(new RPCSubprovider('https://rinkeby.infura.io/v3/4291b68da2a349ada4711a0a8290ebc2'));
//console.log(providerEngine);
const  { Web3Wrapper } = require('@0x/web3-wrapper');
const { getContractAddressesForNetworkOrThrow } = require('@0x/contract-addresses');
const contractWrappers = new ContractWrappers(providerEngine, { networkId:4});//ganache
async function callContract() {

  let owner = await Exchnagecontract.owner();
  console.log(owner,'Exchange Contract');  

}

async function setERC20Proxy() {

  const tx = await Exchnagecontract.transferOwnership('0x0906af095470f7dbf6eb0ff698f9f576afa961ba');
   console.log(tx); 

}


//fillOrder();
//callContracts();
setERC20Proxy();
//callContract();
async function fillOrder(){

  const DECIMALS = 18;
  const makerAssetData = assetDataUtils.encodeERC20AssetData('0x8f91a1c45facaeeaad52e58fe20c5e0b2f1f56cf');
  const takerAssetData = assetDataUtils.encodeERC20AssetData('0x7e74b661db12c3be16d36c81563132101bda8e85');
  const web3Wrapper = new Web3Wrapper(providerEngine);
  const maker = '0x0906af095470f7dbf6eb0ff698f9f576afa961ba';
  const taker = '0x0906af095470f7dbf6eb0ff698f9f576afa961ba';
  const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(5), DECIMALS);
  const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(10), DECIMALS);
  const randomExpiration = new BigNumber(Date.now() + 1000*60*10);
  const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
  const ZERO = new BigNumber(0);

const order = {
exchangeAddress: ExchnageContractAddress,
makerAddress: maker,
takerAddress: taker,
senderAddress: taker,
feeRecipientAddress: NULL_ADDRESS,
expirationTimeSeconds: randomExpiration,
salt: generatePseudoRandomSalt(),
makerAssetAmount,
takerAssetAmount,
makerAssetData,
takerAssetData,
makerFee: ZERO,
takerFee: ZERO,
};
const orderHashHex = '0x0c5fc26236886f8ffb530d66a302812c123517f54e681074abd17fc157758920';
//const orderHashHex = orderHashUtils.getOrderHashHex(order);
console.log(orderHashHex,'order hash');
//const signature = await signatureUtils.ecSignHashAsync(providerEngine, orderHashHex, maker);
//console.log(signature,'Signature');
const signature = '0xce6d9c51dc475c153185736bfd60571810ca6ed5a948b957f3e92fa55f90af745d634b55755680693686f3ef90f8082e32fd98befe6eb00dc7994c687b32003f1b';
console.log(signature);
const signedOrder = { ...order, signature };
let tx11 = await Exchnagecontract.fillOrder(orderHashHex,takerAssetAmount,signature);
console.log(tx11);

};

async function callContracts(){

    const DECIMALS = 18;
    const makerAssetData = assetDataUtils.encodeERC20AssetData('0x8f91a1c45facaeeaad52e58fe20c5e0b2f1f56cf');
    const takerAssetData = assetDataUtils.encodeERC20AssetData('0x7e74b661db12c3be16d36c81563132101bda8e85');
    const web3Wrapper = new Web3Wrapper(providerEngine);
    const maker = '0x0906af095470f7dbf6eb0ff698f9f576afa961ba';
    const taker = '0x0906af095470f7dbf6eb0ff698f9f576afa961ba';
    const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(5), DECIMALS);
    const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(10), DECIMALS);
    const randomExpiration = new BigNumber(Date.now() + 1000*60*10);
    const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
    const ZERO = new BigNumber(0);

    const order = {
  exchangeAddress: ExchnageContractAddress,
  makerAddress: maker,
  takerAddress: taker,
  senderAddress: taker,
  feeRecipientAddress: NULL_ADDRESS,
  expirationTimeSeconds: randomExpiration,
  salt: generatePseudoRandomSalt(),
  makerAssetAmount,
  takerAssetAmount,
  makerAssetData,
  takerAssetData,
  makerFee: ZERO,
  takerFee: ZERO,
   };
//console.log(order);
const orderHashHex = '0x0c5fc26236886f8ffb530d66a302812c123517f54e681074abd17fc157758920';
//const orderHashHex = orderHashUtils.getOrderHashHex(order);
console.log(orderHashHex);
//const signature = '0xce6d9c51dc475c153185736bfd60571810ca6ed5a948b957f3e92fa55f90af745d634b55755680693686f3ef90f8082e32fd98befe6eb00dc7994c687b32003f1b';
const signature = await signatureUtils.ecSignHashAsync(providerEngine, orderHashHex,maker);
const signedOrder = { ...order, signature };
//var check = await contractWrappers.exchange.validateFillOrderThrowIfInvalidAsync(signedOrder, takerAssetAmount, taker);
//console.log(check,'transaction async');
const txHash = await contractWrappers.exchange.fillOrderAsync(signedOrder, takerAssetAmount, taker);
console.log(txHash,'transaction');

var transaction = await web3Wrapper.awaitTransactionSuccessAsync(txHash);
console.log(transaction,'transaction hash transaction');

;
};

