import {Tx} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {toHex} from "@cosmjs/encoding";
import {sha256} from "@cosmjs/crypto";
import {useRuntimeConfig} from "#app";
import {StargateClient} from "@cosmjs/stargate";

export const getClient = async () => {
  const config = useRuntimeConfig();
  return StargateClient.connect(config.public.rpcEndpoint);
}

export const parseTransaction = (tx: Uint8Array) => {
  const decodedTx = Tx.decode(tx);
  const body = decodedTx.body;

  const txHash = toHex(sha256(tx))

  const messages = body.messages.map(msg => msg.typeUrl);

  return {
    messages,
    hash: txHash,
  };
};

export const getTransactionData = async (tx: string) => {
  return await (await getClient()).getTx(tx);
};
