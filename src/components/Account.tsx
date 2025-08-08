import {
  useAccount,
  useBalance,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const balance = useBalance({
    address,
  });
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <div className="flex items-center bg-blue-800 p-5 text-white space-x-4">
      <div className="border p-1 rounded-lg">
        {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
        {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
        Your balance - {balance.data?.value} WEI
      </div>

      <button
        className="bg-red-800 p-1 rounded cursor-pointer hover:bg-red-700"
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
}
