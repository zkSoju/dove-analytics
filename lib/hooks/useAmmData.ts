import { pairAbi } from "@/abis/Pair";
import { PAIR_ADDRESS } from "@/lib/addresses";
import { useEffect, useState } from "react";
import { createPublicClient, fallback, getAbiItem, http } from "viem";
import { arbitrumGoerli } from "viem/chains";

interface AmmData {
  beforeBalance0: bigint;
  balance0: bigint;
  beforeBalance1: bigint;
  balance1: bigint;
  beforeReserve0: bigint;
  reserve0: bigint;
  beforeReserve1: bigint;
  reserve1: bigint;
}

export default function useAmmData(): AmmData[] {
  const [ammData, setAmmData] = useState<AmmData[]>([]);

  useEffect(() => {
    async function getAmmData() {
      const L2Client = createPublicClient({
        chain: arbitrumGoerli,
        transport: fallback([
          http(
            "https://arb-goerli.g.alchemy.com/v2/zz_ZcLUMojqJWzdZGtTVwV6x3FB7IKk8"
          ),
          http(),
        ]),
      });

      const event = getAbiItem({
        abi: pairAbi,
        name: "Swap",
      });

      const blockNumber = await L2Client.getBlockNumber();

      const logs = await L2Client.getLogs({
        event: event,
        address: PAIR_ADDRESS[arbitrumGoerli.id] as `0x${string}`,
        fromBlock: 13794787n,
        toBlock: 13869411n,
      });

      console.log(logs);

      logs.forEach(async (log) => {
        const logBlockNumber = log.blockNumber ?? 0n;

        const [
          beforeBalance0,
          balance0,
          beforeBalance1,
          balance1,
          beforeReserve0,
          reserve0,
          beforeReserve1,
          reserve1,
        ] = await Promise.all([
          L2Client.readContract({
            address: PAIR_ADDRESS[arbitrumGoerli.id] as `0x${string}`,
            abi: pairAbi,
            functionName: "balance0",
            blockNumber: logBlockNumber - 1n,
          }),
          L2Client.readContract({
            address: PAIR_ADDRESS[arbitrumGoerli.id] as `0x${string}`,
            abi: pairAbi,
            functionName: "balance0",
            blockNumber: logBlockNumber,
          }),
          L2Client.readContract({
            address: PAIR_ADDRESS[arbitrumGoerli.id] as `0x${string}`,
            abi: pairAbi,
            functionName: "balance1",
            blockNumber: logBlockNumber - 1n,
          }),
          L2Client.readContract({
            address: PAIR_ADDRESS[arbitrumGoerli.id] as `0x${string}`,
            abi: pairAbi,
            functionName: "balance1",
            blockNumber: logBlockNumber,
          }),
          L2Client.readContract({
            address: PAIR_ADDRESS[arbitrumGoerli.id] as `0x${string}`,
            abi: pairAbi,
            functionName: "reserve0",
            blockNumber: logBlockNumber - 1n,
          }),
          L2Client.readContract({
            address: PAIR_ADDRESS[arbitrumGoerli.id] as `0x${string}`,
            abi: pairAbi,
            functionName: "reserve0",
            blockNumber: logBlockNumber,
          }),
          L2Client.readContract({
            address: PAIR_ADDRESS[arbitrumGoerli.id] as `0x${string}`,
            abi: pairAbi,
            functionName: "reserve1",
            blockNumber: logBlockNumber - 1n,
          }),
          L2Client.readContract({
            address: PAIR_ADDRESS[arbitrumGoerli.id] as `0x${string}`,
            abi: pairAbi,
            functionName: "reserve1",
            blockNumber: logBlockNumber,
          }),
        ]);

        setAmmData((prev) => [
          ...prev,
          {
            beforeBalance0,
            balance0,
            beforeBalance1,
            balance1,
            beforeReserve0,
            reserve0,
            beforeReserve1,
            reserve1,
          },
        ]);
      });
    }

    getAmmData();
  }, []);

  return ammData;
}
