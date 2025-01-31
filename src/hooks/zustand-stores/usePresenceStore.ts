import { create } from "zustand";
import { devtools } from "zustand/middleware"; // this is a middleware for zustand that allows us to use the Redux DevTools Extension

type PresenceState = {
  membersOnline: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
};

const usePresenceStore = create<PresenceState>()(
  devtools(
    (set) => ({
      membersOnline: [],
      add: (id) => {
        console.log("Adding member to online list:", id);
        set((state) => ({ membersOnline: [...state.membersOnline, id] }));
      },
      remove: (id) => {
        console.log("Removing member from online list:", id);
        set((state) => ({
          membersOnline: state.membersOnline.filter((member) => member !== id)
        }))
      },
      set: (ids) => {
        console.log("Setting members online list:", ids);
        set({ membersOnline: ids })
      }
    }),
    { name: "PresenceStore" } // this is the name of the store that will appear in the Redux DevTools Extension
  )
);

export default usePresenceStore;
