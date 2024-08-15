<img src="src/assets/icon-128.png" width="64"/>

# Chrome Extension (MV3) for Zap

> [!IMPORTANT]
> ⚠️ When running the extension against a [notary server](https://github.com/tlsnotary/tlsn/tree/dev/notary-server), please ensure that the server's version is the same as the version of this extension

## Content

Zap is a extension that currently uses TLSN ([see documentation](https://docs.tlsnotary.org/) to attest web2 data. TLS requests from Prover to Server can be witnessed by the Notary, and then can be transformed in signed proofs, which can be sent to webpages and used as attestations.

Zap has two types of proofs and exploration market to use them:
- **Dynamic proofs**: Generated by the SidePanel, these can be called by API from other webpages and attest specific data (like a google account ownership or a revolut transaction data)
- **Static proofs**: Auto generated by the Popup extension, these can be created by manual option in the extension and stored to use then, earning Zap points (like social account ownership)
- **Exploration market**: Solutions provided by Zap team which request data proofs generated by our extension.

The folder structure of Zap:

```
extension/
├── src/
│   ├── assets/
│   ├── components/
│   ├── entries/
│   │   ├── Background/                  # The extension itself, page routes are located here
│   │   │   ├── cache.ts                 # Responsible for separate requests by tab
│   │   │   ├── db.ts                    # Index storage responsible to store larger data like the requests and history
│   │   │   ├── handlers.ts              # Aggregate the cache in a defined structure to add requests log in the database
│   │   │   ├── index.ts                 # Calls the rpc and other listeners
│   │   │   ├── mutex.tsx                
│   │   │   └── rpc.tsx                  # Most important file: RPC with all actions that can be executed in the background
│   │   ├── Content/                     # Content is used when webpages interact with our extension
│   │   │   ├── content.ts               # Separated bundle responsible for the ZAP Class Provider API
│   │   │   ├── index.tsx                # RPC Server that sends the actions to the Background execute
│   │   │   └── rpc.tsx                  # RPC Client and types defined here
│   │   ├── Popup/                       # The extension itself, page routes are located here
│   │   └── SidePanel/                   # Responsible for dynamic proofs
│   ├── pages/
│   ├── reducers/                        # [React Redux](https://react-redux.js.org/)
│   │   ├── authSlice.tsx                # Manage Auth state of extension
│   │   ├── history.tsx                  # Manage history (proofs) states and actions
│   │   ├── index.tsx                    
│   │   └── requests.tsx                 # Manage requests (TLS) states and actions               
│   ├── utils/
│   │   ├── constants.tsx                # Notary proxy and API defined here    
│   │   └── storage.tsx                  # Local storage, getters and setters defined here with keys to access data    
│   ├── firebaseConfig.ts                # Firebase config for google authentication
│   └── manifest.json                    # Manifest version 3 
├── utils/
│   ├── env.js 
│   └── build.js                         # Set development or production state
├── .gitignore
├── package.json
└── README.md
```

## Flow Chart

_need to finish_

## Installing and Running

### Procedures:

1. Check if your [Node.js](https://nodejs.org/) version is >= **18**.
2. Clone this repository.
3. Run `npm install` to install the dependencies.
4. Run `npm start`, it will generate a `build` folder.
5. Load your extension on Chrome following:
   1. Access `chrome://extensions/`
   2. Check `Developer mode`
   3. Click on `Load unpacked extension`
   4. Select the `build` folder.
6. Now use Zap.

## Packing

After the development, run the command

```
$ NODE_ENV=production npm run build
```

Now, the content of `build` folder will be the extension ready to be submitted to the Chrome Web Store. 

Just take a look at the [official guide](https://developer.chrome.com/webstore/publish) to more infos about publishing.

## Resources:
