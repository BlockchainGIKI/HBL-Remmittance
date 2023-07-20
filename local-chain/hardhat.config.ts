import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "HTTP://10.1.33.168:8545",
      accounts: [`0xf178b9d02430e120c3540627ea10c4104e05d9a6cbab9a0e103c0a2de794043c`],
    }
  },
};

export default config;
