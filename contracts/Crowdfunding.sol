// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract Crowdfunding {
    struct Campaign {
        uint256 id;
        address payable owner;
        string title;
        string description;
        uint256 target;
        uint256 timeLimit;
        uint256 collected;
        string image;
        address[] backers;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    function createCampaign(address payable _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        campaign.id = numberOfCampaigns;
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.timeLimit = _deadline;
        campaign.collected = 0;
        campaign.image = _image;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function totalCompaigns() view public returns (uint256) {
        return numberOfCampaigns;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.backers.push(msg.sender);
        campaign.donations.push(amount);

        campaign.owner.transfer(amount);

        campaign.collected += amount;
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].backers, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }
}