import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useToast } from "@/hooks/use-toast";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export default function SolPayerComponent() {
    const [publicKey, setPublicKey] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const {toast} = useToast();
    const {connection} = useConnection();
    const wallet = useWallet();
    const handleTransfer = async () => {
        try {
            if(!wallet || !wallet.publicKey) {
                toast({title: "Connect your wallet"});
                return;
            }
            if(!publicKey || !amount) {
                toast({title: "Invalid inputs", description: "Give valid public key and a valid amount of sol"});
                return;
            }
            const receiverPK = new PublicKey(publicKey);
            if(!receiverPK) {
                toast({title: "Invalid inputs", description: "Give valid public key and a valid amount of sol", variant: "destructive"})
                return;
            }
            const solToBeSent = Number.parseFloat(amount);
            if(!solToBeSent) {
                toast({title: "Invalid inputs", description: "Give valid public key and a valid amount of sol" , variant: "destructive"})
                return;
            }
            const transaction = new Transaction();
            transaction.add(SystemProgram.transfer({
                toPubkey: receiverPK,
                fromPubkey: wallet.publicKey,
                lamports: solToBeSent * LAMPORTS_PER_SOL
            }));
            const sent = await wallet.sendTransaction(transaction, connection);
            console.log({transactionSignature: sent});
            toast({title: "Sent the sol successfully"});
        } catch(err) {
            toast({title: "Issue sending SOL", description: "Recheck public key and amount and also check if wallet is connected", variant: "destructive"})
        } finally {
            setAmount("");
            setPublicKey("");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-96 space-y-6">
            <WalletMultiButton />
            <WalletDisconnectButton />
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">SOL Transfer</h1>
            <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="publicKey" className="text-sm font-medium text-gray-700">
                Recipient's Public Key
                </Label>
                <Input
                id="publicKey"
                placeholder="Enter public key"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                Amount (SOL)
                </Label>
                <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            </div>
            <Button
            onClick={handleTransfer}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
            Transfer SOL
            </Button>
        </div>
        </div>
    )
}
