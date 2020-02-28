const Exchange = artifacts.require('Exchange.sol');
const TokenA = artifacts.require('TokenA.sol');
const TokenB = artifacts.require('TokenB.sol');
const abi = require("../test/ExchangeABI");
const abiTokenA = require("../test/TokenAABI");
const abiTokenB = require("../test/TokenBABI");

const provider = new web3.providers.HttpProvider('https://rinkeby.infura.io/v3/4291b68da2a349ada4711a0a8290ebc2');
const ethers = require('ethers');

let privateKey = "44778F6DF03D73F72CBEBE74AD880503F3AEC7ED8A526AD2977BBD0DFE0616FD";
let wallet = new ethers.Wallet(privateKey);
let provider = ethers.getDefaultProvider('rinkeby');
let walletWithProvider = new ethers.Wallet(privateKey, provider);

const {assetDataUtils,BigNumber,ContractWrappers,generatePseudoRandomSalt,Order,orderHashUtils,signatureUtils} = require('0x.js');
const { RPCSubprovider, Web3ProviderEngine } = require('0x.js');
const providerEngine = new Web3ProviderEngine();
//exchange contract
let ExchangeAbi = abi.abiObject;
let ExchnageContractAddress = "0xe759ea6b1438f46480e6b1dc4bc8500c26b2bb22";
let Exchnagecontract = new ethers.Contract(ExchnageContractAddress, ExchangeAbi, walletWithProvider);
providerEngine.addProvider(new RPCSubprovider('https://rinkeby.infura.io/v3/4291b68da2a349ada4711a0a8290ebc2'));
//console.log(providerEngine);

providerEngine.start();
const  { Web3Wrapper } = require('@0x/web3-wrapper');
const { getContractAddressesForNetworkOrThrow } = require('@0x/contract-addresses');

contract('0x Smart contracts', async (accounts) => {

  it('Should correctly Deploy Exchange Contract', async () => {

    let owner = await Exchnagecontract.owner();
    console.log(owner,'Exchange Contract owner');  
    const DECIMALS = 18;
    const contractWrappers = new ContractWrappers(providerEngine, { networkId:4});//ganache
    const makerAssetData = assetDataUtils.encodeERC20AssetData('0x8f91a1c45facaeeaad52e58fe20c5e0b2f1f56cf');
    const takerAssetData = assetDataUtils.encodeERC20AssetData('0x7e74b661db12c3be16d36c81563132101bda8e85');
    const web3Wrapper = new Web3Wrapper(providerEngine);
//    const maker = '0x0906af095470f7dbf6eb0ff698f9f576afa961ba';
    const maker = accounts[1];
    const taker = '0x0906af095470f7dbf6eb0ff698f9f576afa961ba';
    const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(5), DECIMALS);
    const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.1), DECIMALS);
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
const exchangeAddressNow = this.exchange.address;
console.log(providerEngine,'provider engine');
console.log(order,'order');
console.log(maker),'maker address';

const orderHashHex = orderHashUtils.getOrderHashHex(order);
console.log(orderHashHex,'orderHashHex');
const signature = await signatureUtils.ecSignHashAsync(providerEngine, orderHashHex, maker);
const signedOrder = { ...order, signature };
console.log(signature,'signature');
const txHash = await contractWrappers.exchange.fillOrderAsync(signedOrder, takerAssetAmount, taker);
var transaction = await web3Wrapper.awaitTransactionSuccessAsync(txHash);
var check = await contractWrappers.exchange.validateFillOrderThrowIfInvalidAsync(signedOrder, takerAssetAmount, taker);
//console.log(txHash,'transaction hash');
console.log(check,'transaction async');
});

})
