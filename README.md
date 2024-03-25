## TipJar

A simple app for accepting tips.

Built with Next.JS, ConnectKit, Wagmi and Viem.

The TipMe app will have the following functionality:

- Users can deposit ETH to tip the creator who owns the app.
- Users can see how much ETH is in their wallet.
- Users can see how much ETH is in the TipJar.

# Components Layout
![Screenshot of the app layout](/layout.png)

This example is composed of 8 components:
- MainBlock: contains and sets the layout style for the entire app
- ConnectBlock: contains and styles the ConnectButton
- TitleBlock: contains and styles the title and subtitle
- TipBlock: contains BalanceBlock and TipModal
- BalanceBlock: contains the BalanceCard components that display the user's and contract's ETH balance
- TipModal: executes the tip transaction

# How to run it
Don't forget to init the env variable by creating the `.env.local` file:
```
ALCHEMY_API_KEY=xxxx
WALLETCONNECT_PROJECT_ID=xxxx
```

Start locally
```
npm install
npm run dev
```
