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
    <div className="flex flex-col flex-nowrap flex-grow p-4">
      <div className="w-full flex justify-start">
        <img
          src="../../assets/zap-logo.png"
          alt="Logo"
          className="w-auto h-8"
        />
      </div>
      <h1 className="text-xl text-lightcolor mt-4">Requests</h1>
      <div className="flex-grow overflow-y-auto mt-2">
        <table className="border border-primary border-collapse table-fixed w-full bg-black/15 backdrop-blur-md shadow-xl">
          <thead className="bg-primary">
            <tr>
              <th className="border border-primary py-1 px-2 w-2/12">Met</th>
              <th className="border border-primary py-1 px-2 w-3/12">Type</th>
              <th className="border border-primary py-1 px-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r, index) => {
              let url;

              console.log("r.url", r.url);

              try {
                url = new URL(r.url);
              } catch (e) {}

              return (
                <tr
                  key={index}
                  onClick={() => navigate("/requests")}
                  className="cursor-pointer hover:bg-gray-600"
                >
                  <td className="border border-primary align-top py-1 px-2 whitespace-nowrap w-2/12 truncate">
                    {r.method}
                  </td>
                  <td className="border border-primary align-top py-1 px-2 whitespace-nowrap w-3/12 truncate">
                    {r.type}
                  </td>
                  <td className="border border-primary py-1 px-2 break-all truncate">
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
