"""
DatasetAccess Library - Python interface for interacting with the RegisterDataset smart contract
"""

from typing import Optional
from web3 import Web3
 
web3 = Web3(Web3.HTTPProvider("https://moonbase-alpha.public.blastapi.io"))

class Client():
    def __init__(self, pk, abi, contract_address):
        self.pk = pk
        self.account = web3.eth.account.from_key(pk)
        self.abi = abi
        self.contract = web3.eth.contract(address=contract_address, abi=abi)
        self.balance = web3.eth.get_balance(self.account.address)
        print(f"Account balance: {web3.from_wei(self.balance, 'ether')} DEV")
        
    def hasAccess(self, dataset_id):
        return self.contract.functions.hasAccess(dataset_id).call({'from': self.account.address})
    
    def getAccess(self, dataset_id):
        return self.contract.functions.getAccess(dataset_id).call({'from': self.account.address})

    def uploadDataset(self, dataset_id: str, storage_url: str, price: int):
        """
        Upload a dataset to the contract.
        
        :param dataset_id: The ID of the dataset.
        :param storage_url: The URL where the dataset is stored.
        :param price: The price of the dataset in Wei.
        """
        # Ensure the price is in Wei
        if not isinstance(price, int):
            raise ValueError("Price must be an integer representing Wei.")
        
        # Prepare the upload transaction
        tx = self.contract.functions.uploadDataset(dataset_id, storage_url, price).build_transaction({
            'chainId': 1287,
            'gas': 2000000,
            'gasPrice': web3.to_wei('50', 'gwei'),
            'nonce': web3.eth.get_transaction_count(self.account.address),
        })
        
        # Sign the transaction
        signed_tx = web3.eth.account.sign_transaction(tx, self.pk)
        
        # Send the upload transaction
        tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
        
        # Wait for the transaction receipt
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Dataset upload transaction hash: {tx_hash.hex()}")

        # Create a new transaction for purchase with an incremented nonce
        purchase_tx = self.contract.functions.purchaseAccess(dataset_id).build_transaction({
            'chainId': 1287,
            'gas': 2000000,
            'gasPrice': web3.to_wei('50', 'gwei'),
            'nonce': web3.eth.get_transaction_count(self.account.address),  # This gets a fresh nonce
            'value': price  # Send the price as value for the purchase
        })
        
        # Sign the purchase transaction
        signed_purchase_tx = web3.eth.account.sign_transaction(purchase_tx, self.pk)
        
        # Send the purchase transaction
        purchase_hash = web3.eth.send_raw_transaction(signed_purchase_tx.raw_transaction)
        print(f"Purchase transaction hash: {purchase_hash.hex()}")
        
        # Wait for purchase to complete
        purchase_receipt = web3.eth.wait_for_transaction_receipt(purchase_hash)
        print(f"Purchase complete! Block: {purchase_receipt['blockNumber']}")
        
        # Verify access
        has_access = self.contract.functions.hasAccess(dataset_id).call({'from': self.account.address})
        print(f"Access granted: {has_access}")
        
        return has_access

    def downloadDataset(self, dataset_id: str, filename: Optional[str] = None) -> Optional[str]:
        """
        Download a dataset if the user has purchased access.
        
        :param dataset_id: The ID of the dataset to download.
        :param filename: The name to save the file as (if None, derived from URL).
        """
        # Check if user has access
        if not self.hasAccess(dataset_id):
            print(f"No access to dataset {dataset_id}. Purchase access first.")
            return None

        # Get access URL
        storage_url = self.getAccess(dataset_id)

        return storage_url