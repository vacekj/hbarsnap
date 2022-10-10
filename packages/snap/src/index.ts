import { Wallet, MetamaskHBARRpcRequest } from "./interface";
import { getExtendedPublicKey, signTx } from "./rpc";

declare let wallet: Wallet;

type rpcReqeust = {
  origin: string;
  request: MetamaskHBARRpcRequest;
};

export const onRpcRequest = async ({ request }: rpcReqeust) => {
  switch (request.method) {
    case "hbar_getPublicExtendedKey":
      return getExtendedPublicKey(wallet);
    case "hbar_signTx":
      return signTx(wallet, request.params.recipient, request.params.amount);
    default:
      throw new Error("Method not found.");
  }
};
