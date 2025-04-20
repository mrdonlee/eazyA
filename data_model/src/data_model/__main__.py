"""
Complete Example - Dataset Access Library Usage Demonstration
"""

import os
from web3 import Web3
from dotenv import load_dotenv
from client import Client
from utils.abi_loader import read_abi

# Load environment variables from .env file
load_dotenv()


def main():
    # Get configuration from environment variables or set defaults
    contract_address = os.getenv("CONTRACT_ADDRESS")
    if not contract_address:
        print("Error: CONTRACT_ADDRESS environment variable not set")
        return

    private_key = os.getenv("PRIVATE_KEY")
    if not private_key:
        print("Warning: PRIVATE_KEY environment variable not set, read-only access only")

    abi = read_abi(
        filepath="src/data_model/abi/contract_abi.json"
    )

    # Initialize the client
    client = Client(private_key, abi, contract_address)

    client.getAccess('dataset1')
    client.hasAccess('dataset1')
    # client.uploadDataset(
    #     dataset_id="dataset1",
    #     storage_url="https://example.com/dataset_123",
    #     price=1
    # )
    print(client.downloadDataset(
        dataset_id="dataset1",
    ))


if __name__ == "__main__":
    main()
