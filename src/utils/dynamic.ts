export type StepConfig = {
  title: string;
  description?: string;
  cta: string;
  action: string;
  url?: string;
};

export type DynamicProofMetadata = {
  icon: string;
  name: string;
  url: string;
  proofRegex: string;
  description: string;
  steps: StepConfig[];
};

type metadataListType = {
  [key: string]: DynamicProofMetadata;
};

export const metadataList: metadataListType = {
  revolut: {
    icon: "",
    name: "Revolut Transaction",
    url: "https://app.revolut.com/start",
    proofRegex: "https://app.revolut.com/api/retail/transaction/\\S+",
    description: "This is a revolut transaction proof",
    steps: [
      {
        title: "Access Revolut Account",
        description: "Login with your credentials",
        cta: "Check Revolut Access",
        action: "Link",
        url: "^https://app\\.revolut\\.com/home$",
      },
      {
        title: "Access Transaction Info",
        description: "Go to your transaction details",
        cta: "Check Transaction Info",
        action: "Link",
        url: "^https://app\\.revolut\\.com/transactions/[a-z0-9-]+\\?legId=[a-z0-9-]+&accountId=[a-z0-9-]+$",
      },
      // {
      //   title: "Step 3",
      //   description: "Description 3",
      //   cta: "Notarize Request",
      //   action: "Notarize",
      // },
      {
        title: "Verify Proof",
        description: "Verify the notarized data received",
        cta: "Verify",
        action: "Verify",
      },
    ],
  },
  luma: {
    icon: "",
    name: "Luma Event",
    url: "https://lu.ma/home",
    proofRegex: "https://api.lu.ma/user/ping",
    description: "This is a luma event proof",
    steps: [
      {
        title: "Access Luma Account",
        description: "Login with your credentials",
        cta: "Check Luma Access",
        action: "Ping",
        url: "https://api.lu.ma/user/ping",
      },
      {
        title: "Proof Event Participation",
        description: "Go to your event details",
        cta: "Check Event Info",
        action: "NotarizeLuma",
        url: "^https://lu\\.ma/home$",
      },
      // {
      //   title: "Step 3",
      //   description: "Description 3",
      //   cta: "Notarize Request",
      //   action: "Notarize",
      // },
      // {
      //   title: "Verify Proof",
      //   description: "Verify the notarized data received",
      //   cta: "Verify",
      //   action: "VerifyLuma",
      // },
    ],
  },
  twitter: {
    icon: "",
    name: "Twitter Post",
    url: "https://x.com/home",
    proofRegex: "https://x.com/i/api/1.1/jot/client_event.json",
    description: "This is a twitter follower proof",
    steps: [
      {
        title: "Access Twitter Account",
        description: "Login with your credentials",
        cta: "Check Twitter Access",
        action: "Link",
        url: "https://x.com/home",
      },
      {
        title: "Check Twitter Feed",
        description: "Go to your feed",
        cta: "Check Feed",
        action: "CheckTwitter",
        url: "^https://x.com/i/api/1.1/jot/client_event.json$",
      },
    ],
  },
};
