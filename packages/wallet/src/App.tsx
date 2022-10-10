declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

const snapId = "npm:hbarsnap";

function App() {
  return (
    <div>
      <button
        onClick={async () => {
          await window.ethereum.request({
            method: "wallet_enable",
            params: [
              {
                wallet_snap: {
                  [snapId]: {
                    version: "0.4.0"
                  }
                }
              }
            ]
          });
        }}
      >
        Connect
      </button>
    </div>
  );
}

export default App;
