import React, { ReactElement } from "react";

interface ProofSchema {
  name: string;
  description: string;
  points: number;
  url: string;
  bool: boolean;
  proof: string;
}

interface ProofType {
  name: string;
  icon: string;
  url: string;
  schemas: ProofSchema[];
}

const proofTypes: ProofType[] = [
  {
    name: "Google",
    icon: "../../assets/icons/google.png",
    url: "https://google.com",
    schemas: [
      {
        name: "Google Account",
        description: "Proof of your gmail account",
        points: 10,
        url: "https://app.revolut.com/api/retail/transaction/\\S+",
        bool: false,
        proof: "",
      },
    ],
  },
  {
    name: "ChatGPT",
    icon: "../../assets/icons/chatgpt.png",
    url: "https://chatgpt.com",
    schemas: [
      {
        name: "Chat Simple",
        description: "Proof of a chat interation",
        points: 10,
        url: "https://api.lu.ma/user/ping",
        bool: false,
        proof: "",
      },
      {
        name: "Chat Advanced",
        description: "Proof of a long chat interation",
        points: 20,
        url: "https://api.lu.ma/user/ping",
        bool: false,
        proof: "",
      },
    ],
  },
  {
    name: "Twitter",
    icon: "../../assets/icons/twitter.png",
    url: "https://x.com/home",
    schemas: [
      {
        name: "Post",
        description: "This is a twitter follower proof",
        points: 10,
        url: "https://x.com/i/api/1.1/jot/client_event.json",
        bool: false,
        proof: "",
      },
    ],
  },
];

export default function StaticHistory(): ReactElement {
  return (
    <div className="flex flex-col flex-nowrap flex-grow p-4">
      <div className="w-full flex justify-start">
        <img
          src="../../assets/zap-logo.png"
          alt="Logo"
          className="w-auto h-8"
        />
      </div>
      <h1 className="text-xl text-lightcolor mt-4">Static Proofs</h1>
      <div className="flex flex-col gap-4 flex-nowrap overflow-y-auto mt-4">
        {proofTypes.map((type, index) => (
          <div
            key={index}
            className="group w-full p-4 flex flex-col space-y-2 items-start shadow-xl bg-black/10 backdrop-blur-md rounded-md text-primary hover:bg-secondary transition-all duration-500 ease-in-out cursor-pointer overflow-hidden"
          >
            <div className="w-full flex flex-row items-center justify-start">
              <img
                src={type.icon}
                className="h-4 mr-2 rounded-full"
                alt="logo"
              />
              <p className="font-bold text-md text-lightcolor group-hover:text-primary">
                {type.name}
              </p>
            </div>
            <div className="bg-primary hidden group-hover:block h-[1px] w-full rounded-full"></div>
            <div className="w-full hidden group-hover:flex flex-col space-y-4 transition-all duration-500 ease-in-out cursor-pointer">
              {type.schemas.map((schema, index) => (
                <div
                  key={index}
                  className="w-full p-4 flex flex-row justify-between items-center shadow-xl bg-black/10 backdrop-blur-md rounded-md hover:text-primary hover:bg-secondary transition-all duration-500 ease-in-out cursor-pointer"
                >
                  <div className="flex flex-col items-start">
                    <p className="font-bold text-md">{schema.name}</p>
                    <p className="mt-1 text-xs text-primary">
                      {schema.description}
                    </p>
                    <div className="mt-3 text-xs font-bold text-secondary py-1 px-4 bg-primary backdrop-blur-md rounded-md">
                      Earn +{schema.points} Zaps
                    </div>
                  </div>
                  <div
                    className={`py-1 px-4 rounded-md font-bold border-2 border-primary text-xs transition-all duration-500 ease-in-out cursor-pointer ${
                      schema.bool
                        ? "bg-primary text-secondary hover:bg-secondary hover:text-primary"
                        : "bg-secondary text-primary hover:bg-primary hover:text-secondary"
                    }`}
                  >
                    {schema.bool ? <p>View Proof</p> : <p>Complete</p>}
                  </div>
                  {/* <div className="rounded-full py-1 px-3 bg-primary text-lightcolor text-sm">
                    View Proof
                  </div> */}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
