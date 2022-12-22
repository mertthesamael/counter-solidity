import './App.css';
import { Flex, Text } from '@chakra-ui/layout';
import abi from "./utils/abi.json"
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import { Button, ChakraProvider } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react'
function App() {
  const toast = useToast()
  const [number, setNumber] = useState()
  const [logged,setLogged] = useState(false)

  //Function for fetching smart contract
  const fetchCa =  async() => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract2 = new ethers.Contract("0x7DA2c7cbfA69347bAb8bD403DD313aB174E695F9", abi.abi, provider)

    const num = await contract2.num()
    
    return  setNumber(num.toNumber())
    
  }

  //Function for checkig events status on smart contract
  const checkEvents = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract("0x7DA2c7cbfA69347bAb8bD403DD313aB174E695F9", abi.abi, provider)
    contract.on("Change", (num) => {
        setNumber(num.toNumber())
      
    })
}

  //Increasing the value on blockchain
  const inc = async () => {
    try{
    const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const contract = new ethers.Contract("0x7DA2c7cbfA69347bAb8bD403DD313aB174E695F9", abi.abi, signer)
      await contract.increase().then(res=> console.log(res.value.toNumber()))
      const num = await contract.num()
      await setNumber(num.toNumber())
      checkEvents()
      
    }catch(err){
      console.log(err)
      toast({
        title: `You need to login with MetaMask wallet`,
        status: 'error',
        isClosable: true,
      })

    }
  }

  //Decreasing the value on blockchain

  const dec = async () => {
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const contract = new ethers.Contract("0x7DA2c7cbfA69347bAb8bD403DD313aB174E695F9", abi.abi, signer)   
      await contract.decrease().then(res=> console.log(res.value.toNumber()))
      const num = await contract.num()
      await setNumber(num.toNumber())
      checkEvents()
      
    }catch(err){
      console.log(err)
      toast({
        title: `You need to login with MetaMask wallet`,
        status: 'error',
        isClosable: true,
      })
    }
  }

  //Metamask connect function
  const login = async () => {
    try{

      await window.ethereum.request({method: 'eth_requestAccounts'})
      setLogged(true)
    }catch(err){
      setLogged(false)
      toast({
        title: `There is no injected wallet in your browser :/`,
        status: 'error',
        isClosable: true,
      })
    }
    
  }
useEffect(() => {
  
  fetchCa()
},[])
  return (
    <ChakraProvider>
    <Flex gap='2rem' justifyContent='center' flexDir='column' alignItems='center' h='100vh' w='100%' backgroundImage='linear-gradient( 94.3deg,  rgba(26,33,64,1) 10.9%, rgba(81,84,115,1) 87.1% )'>
      <Text color='white' fontSize='15rem'>{number}</Text>
      <Text color='white' textAlign='center' fontSize='2rem'>You need to be on the Mumbai-Testnet to interact with the contract</Text>
      <Flex gap='2rem'>
      <Button p='2rem' onClick={inc} color='white' colorScheme='green'>Increase</Button>
      <Button p='2rem' onClick={dec} color='white' colorScheme='red'>Decrease</Button>
      </Flex>
      {logged==false&&<Button onClick={login}>Login</Button>}
    </Flex>
    </ChakraProvider>
  );
}

export default App;
