const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Amazon", () => {
  let amazon ;
  let deployer , buyer ;

  beforeEach(async()=>{
    // setup accounts
    [deployer,buyer] = await ethers.getSigners() ;

    // deploy contract
    const Amazon = await ethers.getContractFactory("Amazon") ;
    amazon = await Amazon.deploy() ;
  })

  describe("Deployment",()=>{
    it("set the owner",async()=>{
      const owner = await amazon.owner() ;
      expect(owner).to.equal(deployer.address) ;
    })

    it("has a name",async()=>{
      const name = await amazon.name() ;
      expect(name).to.equal("Amazon") ;
    })
  })

  describe("Listing",()=>{
    let transaction ;
    beforeEach(async()=>{
      transaction = await amazon.connect(deployer).list(1,"shoes","clothing","image",1,4,5) ;
      await transaction.wait() ;
    })

    it("Returns item attributes",async()=>{
      const item = await amazon.items(1) ;
      expect(item.id).to.equal(1) ;
    })
  })

  describe("Buying",()=>{
    let transaction ;
    beforeEach(async()=>{
      transaction = await amazon.connect(deployer).list(1,"shoes","clothing","image",1,4,5) ;
      await transaction.wait() ;

      transaction = await amazon.connect(buyer).buy(1 ,{value: tokens(1)}) ;
    })


    it("updates contract balance",async()=>{
      const balance = await ethers.provider.getBalance(amazon.address) ;
      expect(balance).to.equal(tokens(1)) ;
    })
  })
  

})
