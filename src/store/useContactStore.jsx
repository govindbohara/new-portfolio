import { create } from "zustand";

const useContactStore = create((set) => ({
  openContactModal: true,
  setOpenContactModal: (open) => set({ openContactModal: open }),
}));

export default useContactStore;
