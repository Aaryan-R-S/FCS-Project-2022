var CryptoJS = require('crypto-js');
const Expert = require('../models/Expert');

//create a JavaScript class to represent a Block
class Block{
  constructor(index, timestamp, data, previousHash){
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.generateHash();
  }

  generateHash(){
    return CryptoJS.SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)).toString()
  }
}

class Blockchain{
    constructor(){
        this.blockchain = [this.createGenesisBlock()];
    }
    createGenesisBlock(){
        return new Block(0, (new Date()).toString(), {signature:"first block on the chain"}, "0");
    }
    getTheLatestBlock(){
        return this.blockchain[this.blockchain.length - 1];
    }
    addNewBlock(newBlock){
        newBlock.previousHash = this.getTheLatestBlock().hash;
        newBlock.hash = newBlock.generateHash();
        this.blockchain.push(newBlock);
    }

    // testing the integrity of the chain
    validateChainIntegrity(){
        for(let i = 1; i<this.blockchain.length; i++){
            const currentBlock = this.blockchain[i];
            const previousBlock = this.blockchain[i-1];
            if(currentBlock.hash !== currentBlock.generateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
            return true;

        }
    }
    addToBlockChain(signature){
        // console.log("Mining block in progress...");
        this.addNewBlock(
            new Block(this.blockchain.length, (new Date()).toString(), {
                signature,
            })
        );
        // console.log("Block mined successfully.");
    }
    async init(){
        let experts = await Expert.find();
        for (let index = 0; index < experts.length; index++) {
            const ex = experts[index];
            for (let j = 0; j < ex.signatures.length; j++) {
                const sign = ex.signatures[j];
                this.addToBlockChain(sign);
            }
        }

    }
    verify(signature){
        for (let index = 0; index < this.blockchain.length; index++) {
            const e = this.blockchain[index];
            if(e.data.signature == signature){
                return true;
            }
        }
        return false;
    }
} 

module.exports = Blockchain;