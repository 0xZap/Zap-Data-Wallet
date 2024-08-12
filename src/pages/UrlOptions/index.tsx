import React, { useState, useEffect } from "react";
import ZapToggle from "../../components/ZapToggle";
import { setList, getList, URL_PATTERNS_LS_KEY } from "../../utils/storage";

interface Label {
  name: string;
  url: string;
}

const labels: Label[] = [
  { name: "Twitter", url: "https://x.com/i/api/\\S+" },
  { name: "Instagram", url: "https://instagram.com/\\S+" },
  { name: "Discord", url: "https://discord.com/api/\\S+" },
  { name: "Chatgpt", url: "https://chatgpt.com/backend-api/conversation/\\S+" },
  { name: "OnlyDust", url: "https://api.onlydust.com/api/v1/\\S+" },
];

const UrlOptions = () => {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    // Carregar URLs do storage
    getList(URL_PATTERNS_LS_KEY).then((storedUrls) => {
      setUrls(storedUrls);
    });
  }, []);

  const handleToggle = (label: Label, isOn: boolean) => {
    let updatedUrls = [...urls];
    if (isOn) {
      if (!updatedUrls.includes(label.url)) {
        updatedUrls.push(label.url);
      }
    } else {
      updatedUrls = updatedUrls.filter((url) => url !== label.url);
    }
    setUrls(updatedUrls);
    setList(URL_PATTERNS_LS_KEY, updatedUrls);
    console.log("Updated URLs", updatedUrls);
  };

  return (
    <div className="p-4 w-full flex flex-col flex-nowrap justify-center">
      <div className="w-full flex justify-start">
        <img
          src="../../assets/zap-logo.png"
          alt="Logo"
          className="w-auto h-8"
        />
      </div>
      <h1 className="text-xl text-lightcolor mt-4">Auto Enabler</h1>
      <div className="flex flex-col gap-2 flex-nowrap overflow-y-auto px-20 py-4 mt-2 shadow-xl bg-black/10 backdrop-blur-md rounded-md">
        {labels.map((label, index) => (
          <div key={index} className="flex flex-row space-x-4 items-center">
            <ZapToggle
              isOn={urls.includes(label.url)}
              onToggle={(isOn) => handleToggle(label, isOn)}
            />
            <p className="text-lightcolor font-bold">{label.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UrlOptions;
