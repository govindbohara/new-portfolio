import { create } from "zustand";

const useContactStore = create((set) => ({
  openContactModal: false,
  setOpenContactModal: (open) => set({ openContactModal: open }),
}));

export default useContactStore;
