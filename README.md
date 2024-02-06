# BuidlGuidl Grants

Grant platform for the BuidlGuidl community.

⚙️ Built using 🏗 [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2) crane emoji

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Development Quickstart

To get started follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/BuidlGuidl/grants.buidlguidl.com.git
cd grants.buidlguidl.com
yarn install
```

2. Set up your environment variables (and optionally, a local Firebase instance):
   Copy the `packages/nextjs/.env.example` file to `packages/nextjs/.env.local` and fill in the required environment variables.

(Optional) Start the firebase emulators (vs set up a live Firebase instance). You will need to install the [firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli) and run the following command:

```bash
# You might need to add a real "--project <projectName>" (run firebase projects:list)
firebase emulators:start
```

3. To seed data in your local Firebase instance, run the following command:

```bash
yarn seed
```

To seed it to empty live firestore instance you can use `yarn seed --force-prod`. If there is data in the live instance, it will not seed it again to bypass it use `yarn seed --reset --force-prod`

4. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

5. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

6. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `/debug` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.
