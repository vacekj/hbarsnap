import * as bip32 from "bip32";

import { BIP32Interface } from "bip32";
import { Wallet, BIP44CoinTypeNode } from "../interface";

const HIGHEST_BIT = 0x80000000;

export async function extractAccoutPrivateKey(
  wallet: Wallet
): Promise<BIP32Interface> {
  let coinType: number = 3030; /* https://github.com/satoshilabs/slips/blob/master/slip-0044.md */

  const methodName = `snap_getBip44Entropy_${coinType}`;
  const hedera44node = (await wallet.request({
    method: methodName
  })) as BIP44CoinTypeNode;
  const privateKeyBuffer = Buffer.from(hedera44node.privateKey, "hex");
  const chainCodeBuffer = Buffer.from(hedera44node.chainCode, "hex");
  let node: BIP32Interface = bip32.fromPrivateKey(
    privateKeyBuffer,
    chainCodeBuffer
  );
  //@ts-ignore
  // ignore checking since no function to set depth for node
  node.__DEPTH = 2;
  //@ts-ignore
  // ignore checking since no function to set index for node
  node.__INDEX = HIGHEST_BIT + 0;
  return node.deriveHardened(0);
}

export async function getExtendedPublicKey(wallet: Wallet): Promise<string> {
  const result = await wallet.request({
    method: "snap_confirm",
    params: [
      {
        prompt: "Access your extended public key?",
        description:
          "Do you want to allow this app to access your extended public key?"
      }
    ]
  });

  if (result) {
    let accountNode = await extractAccoutPrivateKey(wallet);
    let accountPublicKey = accountNode.neutered();
    return accountPublicKey.toBase58();
  } else {
    throw new Error("User reject to access the key");
  }
}
