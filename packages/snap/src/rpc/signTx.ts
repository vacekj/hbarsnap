import { Wallet } from "../interface";
import { extractAccoutPrivateKey } from "./getExtendedPublicKey";
import { hethers } from "@hashgraph/hethers";

const provider = hethers.providers.getDefaultProvider("testnet");

export async function signTx(
  wallet: Wallet,
  recipient: string,
  amount: number
): Promise<string> {
  const result = await wallet.request({
    method: "snap_confirm",
    params: [
      {
        prompt: "Sign Bitcion Transaction?",
        description: "Please verify this ongoing Transaction Detail",
        textAreaContent: `${amount} HBAR to ${recipient}`
      }
    ]
  });

  if (result) {
    const accountPrivateKey = await extractAccoutPrivateKey(wallet);
    const signer = new hethers.Wallet(accountPrivateKey.privateKey, provider);
    const txRequest = {
      from: signer.publicKey,
      to: recipient,
      amount
    };
    return signer.signTransaction(txRequest);
  } else {
    throw new Error("user reject the sign request");
  }
}
