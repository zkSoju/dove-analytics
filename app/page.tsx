"use client";

import useAmmData from "@/lib/hooks/useAmmData";

export default function Home() {
  const data = useAmmData();

  return (
    <div>
      <div className="relative z-10 flex h-screen w-full items-center justify-center">
        <div className="flex w-full max-w-7xl flex-col items-start p-4">
          <h1 className="text-2xl text-white">AMM Data</h1>
          <table className="w-full table-auto text-white">
            <thead>
              <tr className="text-left">
                <th>Balance 0 Before</th>
                <th>Balance 0 After</th>
                <th>Balance 1 Before</th>
                <th>Balance 1 After</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, id) => (
                <tr key={id}>
                  <td>{item.beforeBalance0.toString()}</td>
                  <td>{item.balance0.toString()}</td>
                  <td>{item.beforeBalance1.toString()}</td>
                  <td>{item.balance1.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
