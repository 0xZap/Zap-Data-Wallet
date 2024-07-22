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
    <div className="flex flex-col gap-2 flex-nowrap overflow-y-auto py-4 px-24 text-white">
      {labels.map((label, index) => (
        <div key={index} className="flex flex-row space-x-4 items-center">
          <ZapToggle
            isOn={urls.includes(label.url)}
            onToggle={(isOn) => handleToggle(label, isOn)}
          />
          <p className="text-lg text-darkcolor">{label.name}</p>
        </div>
      ))}
    </div>
  );
};

export default UrlOptions;
