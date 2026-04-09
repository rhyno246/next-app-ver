import { Author } from "@/types/type";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface UserStore {
    user : Author | null;
    setUser : (data : Author) => void;
    logOut : () => void;
}

export const useUserStore = create<UserStore>()(
    devtools(
        subscribeWithSelector(
            immer((set) => ({
                user : null,
                setUser : (data) => {
                    set((state) => {
                        state.user = data
                    })
                },
                logOut : () => {
                    set((state) => {
                        state.user = null
                    })
                }
            }))
        )
    ),
)