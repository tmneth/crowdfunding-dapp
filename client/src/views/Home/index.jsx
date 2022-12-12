import React, { useState, useEffect } from "react";
import CrowdfundingContract from "../../contracts/Crowdfunding.json";
import Web3 from "web3";
import Card from "../../components/Card";
import * as S from "./styles.jsx";

const Home = () => {
  const [funds, setFunds] = useState([]);
  const [totalCompaigns, setTotalCompaigns] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const web3 = new Web3("http://localhost:7545");

      const networkId = await web3.eth.net.getId();
      const accounts = await web3.eth.getAccounts();
      const deployedNetwork = CrowdfundingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        CrowdfundingContract.abi,
        deployedNetwork.address
      );

      setContract(instance);
      setAccounts(accounts);

      async function getResult() {
        const funds = await instance.methods.getCampaigns().call();
        const totalCompaigns = await instance.methods.getNumOfComaigns().call();
        setTotalCompaigns(totalCompaigns);
        console.log(funds);
        setFunds(funds);
      }
      await getResult();
    } catch (error) {
      console.log(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };
  return (
    <>
      <S.Title>Compaigns ({totalCompaigns})</S.Title>
      <S.CardBox>
        {[...funds].reverse().map((item, key) => (
          <Card key={key} fundraiser={item} />
        ))}
      </S.CardBox>
    </>
  );
};

export default Home;