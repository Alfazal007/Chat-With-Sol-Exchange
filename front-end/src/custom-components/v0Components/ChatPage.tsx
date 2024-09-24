import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ChatPage() {
    const [username, setUsername] = useState('')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        console.log(`Searching for user: ${username}`)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg"
        >
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Chat Search</h1>
            <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
                <Input
                type="text"
                placeholder="Enter the username you want to chat with"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                required
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button 
                type="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                Search
                </Button>
            </motion.div>
            </form>
        </motion.div>
        </div>
      )
}
