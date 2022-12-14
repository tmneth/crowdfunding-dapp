import React, { useState, useEffect } from "react";
import PoolContract from "../../contracts/Pool.json";
import Web3 from "web3";
import Card from "../../components/Card";
import * as S from "./styles.jsx";
import Loader from "../../components/Loader";
import { sleep } from "../../utils";

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [totalCampaigns, setTotalCampaigns] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      setIsLoading(true);

      const web3 = new Web3(Web3.givenProvider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PoolContract.networks[networkId];
      const instance = new web3.eth.Contract(
        PoolContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      const campaigns = await instance.methods.getAllCampaigns().call();
      const totalCampaigns = await instance.methods.campaignsCount().call();

      setTotalCampaigns(totalCampaigns);
      setCampaigns(campaigns);

      await sleep(1500);

      setIsLoading(false);
    } catch (error) {
      console.log(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };
  return (
    <S.Wrapper>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <S.Title>All Fundraisers ({totalCampaigns})</S.Title>
          {totalCampaigns > 0 ? (
            <S.CardBox>
              {[...campaigns].reverse().map((item, key) => (
                <Card key={key} fundraiser={item} />
              ))}
            </S.CardBox>
          ) : (
            "Nothing here yet, feel free to start a new fundraising campaign!"
          )}
        </>
      )}
    </S.Wrapper>
  );
};

export default Home;
