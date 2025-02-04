import React, { Key, useEffect, useState } from "react";
import axios from "axios";
import { Base_URL } from "../../credentials";
import { toast } from "sonner";
import userAxiosInstance from "../../config/axiosInstance.ts/userInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface IWallet {
  id: string;
  balance: number;
  transactions: Itransactions[];
}

interface Itransactions {
  _id: Key | null | undefined;
  amount: number;
  transactionType: "credit" | "debit";
  date: string;
  transactionId: string;
}

const Wallet = () => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const name = userInfo?.name;
  const email = userInfo?.email;
  const phone = userInfo?.phone;
  const userId = userInfo?.userId;
  const [wallet, setWallet] = useState<IWallet | any>(null);
  const [amount, setAmount] = useState<string>("");

  console.log(wallet);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(userInfo, "user");
        const res = await userAxiosInstance.get(`/getTransactions/${userId}`);
        console.log(res);
        setWallet(res.data);
      } catch (error) {
        console.error("Error fetching wallet data", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleAddMoney = async () => {
    const numericAmount = Number(amount);

    if (!/^\d+$/.test(amount)) {
      return toast.error("Please enter only numeric characters.");
    }

    if (numericAmount <= 0) {
      return toast.error("Enter a valid positive amount.");
    }

    const options = {
      amount: numericAmount * 100,
      currency: "INR",
      name: "Learn Sphere",
      description: "Add money to wallet",
      prefill: {
        name: { name },
        email: { email },
        contact: { phone },
      },
      handler: async function (response: any) {
        const transactionData = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          amount: numericAmount,
        };

        await userAxiosInstance.post(`/walletAdd/${userId}`, transactionData);

        setWallet((prevWallet: { balance: number; transactions: any }) =>
          prevWallet
            ? {
                ...prevWallet,
                balance: prevWallet.balance + numericAmount,
                transactions: [
                  ...prevWallet.transactions,
                  {
                    id: Date.now().toString(),
                    amount: numericAmount,
                    transactionType: "credit",
                    date: new Date().toISOString(),
                  },
                ],
              }
            : null
        );

        setAmount("");
        toast.success("Amount added");
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  // Function to format the transaction date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Use false for 24-hour format
    });
  };

  return (
    <div className="h-96 col-span-7 m-3 rounded-2xl font-poppins flex px-10">
      <section className="w-1/2">
        <h1 className="font-bold text-xl">My Wallet</h1>
        <div className="w-full h-52 bg-gradient-to-r from-green-100 to-green-300 rounded-md my-3">
          <div className="w-full flex justify-center pt-14">
            <h1 className="text-3xl font-extrabold">
              {" "}
              $ {wallet?.balance.toFixed(2) || 0}
            </h1>
          </div>
          <div className="flex items-center pl-10 my-8">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="h-10 w-1/2 rounded-md bg-gradient-to-r from-lime-50 to-lime-100 outline-none pl-5"
            />
            <button
              onClick={handleAddMoney}
              className="h-10 ml-3 w-20 bg-black text-white rounded-md"
            >
              Add
            </button>
          </div>
        </div>
      </section>

      <section className="w-1/2 ml-5">
        <h2 className="font-bold text-xl mb-3">Transactions</h2>
        <div className="h-72 overflow-y-scroll border border-gray-200 rounded-md p-3 bg-white">
          {wallet?.transactions.length === 0 ? (
            <p>No transactions</p>
          ) : (
            wallet?.transactions.map(
              (transaction: {
                id: React.Key | null | undefined;
                transactionType:
                  | string
                  | number
                  | boolean
                  | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | null
                  | undefined;
                date: string;
                amount: number;
              }) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center mb-2 p-2 border-b border-gray-100"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {transaction?.transactionType}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      transaction.amount < 0 ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {transaction.amount < 0 ? "- $" : "+ $"}
                    {Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              )
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default Wallet;
