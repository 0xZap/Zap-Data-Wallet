import React, { ReactElement, useEffect } from "react";
import { useNavigate } from "react-router";
import { useRequests } from "../../reducers/requests";

export default function RequestTable(): ReactElement {
  const requests = useRequests();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("requests", requests);
  }, [requests]);

  return (
    <div className="flex flex-col flex-nowrap flex-grow p-2 ">
      <div className="flex-grow overflow-y-auto">
        <table className="border border-slate-300 border-collapse table-fixed w-full">
          <thead className="bg-slate-200">
            <tr>
              <th className="border border-slate-300 py-1 px-2 w-2/12">Met</th>
              <th className="border border-slate-300 py-1 px-2 w-3/12">Type</th>
              <th className="border border-slate-300 py-1 px-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => {
              let url;

              console.log("r.url", r.url);

              try {
                url = new URL(r.url);
              } catch (e) {}

              return (
                <tr
                  key={r.requestId}
                  onClick={() => navigate("/requests")}
                  className="cursor-pointer hover:bg-slate-100"
                >
                  <td className="border border-slate-200 align-top py-1 px-2 whitespace-nowrap w-2/12 truncate">
                    {r.method}
                  </td>
                  <td className="border border-slate-200 align-top py-1 px-2 whitespace-nowrap w-3/12 truncate">
                    {r.type}
                  </td>
                  <td className="border border-slate-200 py-1 px-2 break-all truncate">
                    {url?.pathname}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
