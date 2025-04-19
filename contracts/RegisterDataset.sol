// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract RegisterDataset {

    struct Dataset {
        address owner;
        string storage_url;
        uint256 price;
    }

    mapping(string => Dataset) private datasets;
    mapping(string => bool) private datasetExists;
    mapping(string => mapping(address => bool)) private datasetPurchased;

    event DatasetRegistered(string indexed datasetId, address indexed owner, string storage_url, uint256 price);
    event DatasetPurchased(string indexed datasetId, address indexed buyer);


    function uploadDataset(string memory datasetId, string memory storage_url, uint256 price) public {
        require(!datasetExists[datasetId], "Dataset already exists");
        require(price > 0, "Price must be greater than zero");

        datasets[datasetId] = Dataset(msg.sender, storage_url, price);
        datasetExists[datasetId] = true;

        emit DatasetRegistered(datasetId, msg.sender, storage_url, price);
    }

    function purchaseAccess(string memory datasetId) public payable {
        require(datasetExists[datasetId], "Dataset does not exist");
        require(!datasetPurchased[datasetId][msg.sender], "You already purchased this dataset");
        require(msg.value == datasets[datasetId].price, "Incorrect price sent");

        datasetPurchased[datasetId][msg.sender] = true;
        payable(datasets[datasetId].owner).transfer(msg.value);

        emit DatasetPurchased(datasetId, msg.sender);
    }

    function getAccess(string memory datasetId) public view returns (string memory) {
        require(datasetPurchased[datasetId][msg.sender], "You have not purchased this dataset");
        return datasets[datasetId].storage_url;
    }

    function hasAccess(string memory datasetId) public view returns (bool) {
        return datasetPurchased[datasetId][msg.sender];
    }
}