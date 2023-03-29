import { pairAbi } from "@/abis/Pair";
import { PAIR_ADDRESS, vUSDC_ADDRESS, vUSDT_ADDRESS } from "@/lib/addresses";
import { useEffect, useState } from "react";
import { createPublicClient, fallback, getAbiItem, http } from "viem";
import { arbitrumGoerli } from "viem/chains";
import { erc20ABI } from "wagmi";

interface AmmData {
  beforeBalance0: bigint;
  balance0: bigint;
  beforeBalance1: bigint;
  balance1: bigint;
  beforeReserve0: bigint;
  reserve0: bigint;
  beforeReserve1: bigint;
  reserve1: bigint;
  beforeReserve0Cumulative: bigint;
  reserve0Cumulative: bigint;
  beforeReserve1Cumulative: bigint;
  reserve1Cumulative: bigint;
  beforeVoucher0: bigint;
  voucher0: bigint;
  beforeVoucher1: bigint;
  voucher1: bigint;
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
          beforeReserve0Cumulative,
          reserve0Cumulative,
          beforeReserve1Cumulative,
          reserve1Cumulative,
          beforeVoucher0,
          voucher0,
          beforeVoucher1,
          voucher1,
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
          L2Client.readContract({
            address: PAIR_ADDRESS[arbitrumGoerli.id] as `0x${string}`,
            abi: pairAbi,
            functionName: "reserve0CumulativeLast",
            blockNumber: logBlockNumber - 1n,
          }),
          L2Client.readContract({
            address: PAIR_ADDRESS[arbitrumGoerli.id] as `0x${string}`,
            abi: pairAbi,
            functionName: "reserve0CumulativeLast",
            blockNumber: logBlockNumber,
          }),
          L2Client.readContract({
            address: PAIR_ADDRESS[arbitrumGoerli.id] as `0x${string}`,
            abi: pairAbi,
            functionName: "reserve1CumulativeLast",
            blockNumber: logBlockNumber - 1n,
          }),
          L2Client.readContract({
            address: PAIR_ADDRESS[arbitrumGoerli.id] as `0x${string}`,
            abi: pairAbi,
            functionName: "reserve1CumulativeLast",
            blockNumber: logBlockNumber,
          }),
          L2Client.readContract({
            address: vUSDT_ADDRESS[arbitrumGoerli.id] as `0x${string}`,
            abi: erc20ABI,
            functionName: "balanceOf",
            args: [log.args.sender],
            blockNumber: logBlockNumber - 1n,
          }),
          L2Client.readContract({
            address: vUSDT_ADDRESS[arbitrumGoerli.id] as `0x${string}`,
            abi: erc20ABI,
            functionName: "balanceOf",
            args: [log.args.sender],
            blockNumber: logBlockNumber,
          }),
          L2Client.readContract({
            address: vUSDC_ADDRESS[arbitrumGoerli.id] as `0x${string}`,
            abi: erc20ABI,
            functionName: "balanceOf",
            args: [log.args.to],
            blockNumber: logBlockNumber - 1n,
          }),
          L2Client.readContract({
            address: vUSDC_ADDRESS[arbitrumGoerli.id] as `0x${string}`,
            abi: erc20ABI,
            functionName: "balanceOf",
            args: [log.args.to],
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
            beforeVoucher0,
            voucher0,
            beforeVoucher1,
            voucher1,
            beforeReserve0Cumulative,
            reserve0Cumulative,
            beforeReserve1Cumulative,
            reserve1Cumulative,
          },
        ]);
      });
    }

    getAmmData();
  }, []);

  return ammData;
}
