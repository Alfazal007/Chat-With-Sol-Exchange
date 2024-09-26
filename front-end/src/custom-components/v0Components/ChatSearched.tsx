import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"

export interface UserData {
    found: boolean;
    username?: string;
    setIsVisibler: () => void
}

export interface ChatSearchResultProps {
    userData: UserData | null;
}

export default function ChatSearchResult({ userData, openSearchedChat }: {userData: ChatSearchResultProps, openSearchedChat: ()=> void}) {
    return (
        <div>
            {userData && (
                <div className="overflow-hidden">
                    <div className="relative">
                        {userData.userData?.found ? (
                            <div className="flex items-center p-2 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100">
                                <span className="font-medium text-blue-800 pl-3" onClick={openSearchedChat}>{userData.userData?.username}</span>
                            </div>
                        ) : (
                            <div className="flex items-center p-2 bg-red-50 rounded-lg">
                                <span className="text-red-800">User not found</span>
                            </div>
                        )}
                        <div onClick={userData.userData?.setIsVisibler}>
                            <Button
                                className="absolute top-1 right-1 p-1 bg-transparent hover:bg-gray-200 rounded-full"
                                aria-label="Clear search result"
                            >
                                <X size={18} className={`text-${userData.userData?.found ? "blue" : "red"}-800`} />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

