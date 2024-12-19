import {MsgTransferEncodeObject, SigningStargateClient} from "@cosmjs/stargate";
import {DirectSecp256k1HdWallet} from "@cosmjs/proto-signing";
import {GasPrice} from "@cosmjs/stargate/build/fee";
import {useRuntimeConfig} from "#app";

export const getWallet = async (
  useMnemonic: boolean = false,
  mnemonic: string | null = null,
  chainId: string = 'cosmoshub-4'
) => {
  if (useMnemonic && typeof mnemonic !== 'string') {
    throw new Error('invalid mnemonic')
  }

  return useMnemonic ? await DirectSecp256k1HdWallet.fromMnemonic(
    mnemonic,
    {prefix: "cosmos"}
  ) : window.getOfflineSigner(chainId)
}

export const getClient = async (
  useMnemonic: boolean = false,
  mnemonic: string | null = null,
  chainId: string = 'cosmoshub-4'
) => {
  const rpcEndpoint = useRuntimeConfig().public.rpcEndpoint

  const wallet = await getWallet(useMnemonic, mnemonic, chainId);

  const gasPrice = new GasPrice(2671, 'uatom');

  return await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, {
    gasPrice,
  });
}

export const simulateIBCTransaction = async (
  sourceAddress: string,
  destinationAddress: string,
  amount: string,
  chainId: string,
  useMnemonic: boolean = false,
  mnemonic: string = useRuntimeConfig().public.testMnemonic,
  memo: string = ''
) => {
  try {
    const client = await getClient(useMnemonic, mnemonic, chainId)

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

    return await client.simulate(sourceAddress, [msgTransfer], memo);
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error("Помилка IBC транзакції:", error);
    }

    throw new Error(error);
  }
}

export const sendIBCTransaction = async (
  sourceAddress: string,
  destinationAddress: string,
  amount: string,
  chainId: string,
  useMnemonic: boolean = false,
  mnemonic: string = useRuntimeConfig().public.testMnemonic,
  memo: string = ''
) => {
  try {
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

    const client = await getClient(useMnemonic, mnemonic, chainId);

    if (useMnemonic) {
      const sourceAccount = await client.getAccount(sourceAddress);
      if (!sourceAccount) {
        throw new Error("sourceAddress account not found");
      }
    }

    const gasEstimation = await simulateIBCTransaction(sourceAddress, destinationAddress, amount, chainId, useMnemonic, mnemonic, memo);

    return await client.signAndBroadcast(sourceAddress, [msgTransfer], {
        amount: [{ denom: "uatom", amount: "2671" }],
        gas: (gasEstimation * 1.25).toString(),
      }, memo
    );
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error("Помилка IBC транзакції:", error);
    }

    throw new Error(error);
  }
};
