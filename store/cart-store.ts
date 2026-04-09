import { Products } from "@/types/type";
import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
interface CartItems extends Products {
    quantity: number;
}

interface CartStore {
    cartItems: CartItems[];
    addToCart: (product: Products) => void;
    removeItemCart: (productId: string) => void;
    getTotalPrice: () => number;
    updateQuantityItem: (productId: string, quantity: number) => void;
    increaseQuantityItem: (productId: string) => void;
    decrementQuantityItem: (productId: string) => void;
    removeAllItemCart: () => void;
}
export const useCartStore = create<CartStore>()(
    persist(
        devtools(
            subscribeWithSelector(
                immer((set , get) => ({
                    cartItems: [],
                    addToCart : (product : Products) => {
                        set((state) => {
                            const isItemsExist = get().cartItems.find(item => item.id === product.id);
                            if(isItemsExist){
                                state.cartItems = state.cartItems.map(item => {
                                    if(item.id === product.id){
                                        return {...item, quantity: item.quantity + (product.quantity ?? 1)};
                                    }
                                    return item;
                                })
                            } else {
                                state.cartItems.push({...product, quantity: product.quantity ?? 1});
                            }
                        })
                    },
                    removeItemCart : (productId: string) => {
                        set((state) => {
                            state.cartItems = state.cartItems.filter(item => item.id !== productId);
                        })
                    },
                    updateQuantityItem : (productId: string, quantity: number) => {
                        set((state) => {
                            state.cartItems = state.cartItems.map(item => {
                                if(item.id === productId){
                                    return {...item, quantity};
                                }
                                return item;
                            })
                        })
                    },
                    increaseQuantityItem : (productId: string) => {
                        set((state) => {
                            state.cartItems = state.cartItems.map(item => { 
                                if(item.id === productId){
                                    return {...item, quantity: item.quantity + 1};
                                }   
                                return item;
                            })
                        })
                    },
                    decrementQuantityItem : (productId: string) => {
                        set((state) => {
                            state.cartItems = state.cartItems.map(item => {
                                if(item.id === productId && item.quantity > 1){
                                    return {...item, quantity: item.quantity - 1};
                                }   
                                return item;
                            })
                        })
                    },
                    getTotalPrice : () => {
                        return get().cartItems.reduce((total , item) => total + item.price * item.quantity , 0);
                    },
                    removeAllItemCart : () => {
                        set((state) => {
                            state.cartItems = [];
                        })
                    }
                }))
            )
        ),
        {
            name: "cart-storage",
            skipHydration: true,
            partialize: (state) => ({ cartItems: state.cartItems })
        }
    )
)
