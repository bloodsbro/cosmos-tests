import {MsgTransferEncodeObject, SigningStargateClient} from "@cosmjs/stargate";
import {DirectSecp256k1HdWallet} from "@cosmjs/proto-signing";
import type {MsgTransfer} from "cosmjs-types/ibc/applications/transfer/v1/tx";
import type {Fee} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {TxRaw} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {GasPrice} from "@cosmjs/stargate/build/fee";

export const sendIBCTransaction = async (
  sourceAddress: string,
  destinationAddress: string,
  amount: string,
  rpcEndpoint: string,
  chainId: string,
  useMnemonic: boolean = false
) => {
  try {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      useRuntimeConfig().public.testMnemonic,
      { prefix: "cosmos" }
    );

    const gasPrice = new GasPrice(2671, 'uatom');

    const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, {
      gasPrice,
    });

    const memo = '';

    const msgTransfer: MsgTransferEncodeObject = {
      typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
      value: {
        sourcePort: "transfer",
        sourceChannel: "channel-141",
        token: {
          denom: "uatom",
          amount: amount.toString(),
        },
        sender: sourceAddress,
        receiver: destinationAddress,
        timeoutHeight: undefined,
        timeoutTimestamp: (Date.now() + 60000) * 1e6,
      },
    };

    const sourceAccount = await client.getAccount(sourceAddress);
    if (!sourceAccount) {
      throw new Error("sourceAddress account not found");
    }

    const gasEstimation = await client.simulate(sourceAddress, [msgTransfer]);
    console.log("Оценка газа:", gasEstimation);

    const wallet2 = await window.getOfflineSigner(chainId);
    const client2 = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet2);

    const signer = useMnemonic ? client : client2;

    return await signer.signAndBroadcast(sourceAddress, [msgTransfer], {
        amount: [{ denom: "uatom", amount: "2000" }],
        gas: "200000",
      }
    );
  } catch (error) {
    console.error("Ошибка IBC транзакции:", error);
    throw new Error(error);
  }
};
