"use client";

import useAmmData from "@/lib/hooks/useAmmData";
import { BiArrowToBottom } from "react-icons/bi";

export default function Home() {
  const data = useAmmData();

  return (
    <div>
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center">
        <div className="flex w-full max-w-6xl flex-col items-start pt-16">
          <h1 className="mb-16 text-2xl text-white">AMM Data</h1>
          <table className="w-full table-auto text-sm text-white">
            <thead>
              <tr className="text-left">
                <th className="border-b border-slate-600 p-4 pt-0 pb-3 text-left font-medium text-slate-200">
                  Type
                </th>
                <th className="border-b border-slate-600 p-4 pt-0 pb-3 text-left font-medium text-slate-200">
                  Balance 0
                </th>
                <th className="border-b border-slate-600 p-4 pt-0 pb-3 text-left font-medium text-slate-200">
                  Balance 1
                </th>
                <th className="border-b border-slate-600 p-4 pt-0 pb-3 text-left font-medium text-slate-200">
                  Reserve 0
                </th>
                <th className="border-b border-slate-600 p-4 pt-0 pb-3 text-left font-medium text-slate-200">
                  Reserve 1
                </th>
                <th className="border-b border-slate-600 p-4 pt-0 pb-3 text-left font-medium text-slate-200">
                  Voucher 0
                </th>
                <th className="border-b border-slate-600 p-4 pt-0 pb-3 text-left font-medium text-slate-200">
                  Voucher 1
                </th>
                <th className="border-b border-slate-600 p-4 pt-0 pb-3 text-left font-medium text-slate-200"></th>
              </tr>
            </thead>
            <tbody className="bg-white/10">
              {data.map((item, id) => (
                <tr key={id}>
                  <td className="border-b border-slate-800 p-4 text-slate-400">
                    <div className="flex w-12 items-center justify-center rounded-sm bg-yellow-400 py-1 text-xs uppercase tracking-wider text-black">
                      Swap
                    </div>
                  </td>
                  <td className="border-b border-slate-800 p-4 text-slate-400">
                    {item.balance0.toString()}
                  </td>
                  <td className="border-b border-slate-800 p-4 text-slate-400">
                    {item.balance1.toString()}
                  </td>
                  <td className="border-b border-slate-800 p-4 text-slate-400">
                    {item.reserve0.toString()}
                  </td>
                  <td className="border-b border-slate-800 p-4 text-slate-400">
                    {item.reserve1.toString()}
                  </td>
                  <td className="border-b border-slate-800 p-4 text-slate-400">
                    {item.voucher0.toString()}
                  </td>
                  <td className="border-b border-slate-800 p-4 text-slate-400">
                    {item.voucher1.toString()}
                  </td>
                  <td className="border-b border-slate-800 p-4 text-slate-400">
                    <BiArrowToBottom className="text-white" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
