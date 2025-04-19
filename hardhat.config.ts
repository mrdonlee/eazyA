import { HardhatUserConfig } from 'hardhat/config';
/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-ethers');
require('@nomicfoundation/hardhat-ignition-ethers');

require('dotenv').config();

const config: HardhatUserConfig = {
    solidity: '0.8.28',
    networks: {
        moonbase: {
            url: 'https://rpc.testnet.moonbeam.network',
            accounts: [process.env.PRIVATE_KEY!],
            chainId: 1287,
        },
    },
};

export default config;
