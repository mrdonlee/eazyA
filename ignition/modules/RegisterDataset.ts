import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

module.exports = buildModule("RegisterDatasetModule", (m) => {
  const deployer = m.getAccount(0);

  const register_dataset = m.contract("RegisterDataset", [], {
    from: deployer,
  });

  return { register_dataset };
});