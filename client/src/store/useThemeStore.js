import {create} from "zustand";

export const useThemeStore = create((set)=>({
    theme: localStorage.getItem("rimofy-theme") ||"coffee",
    setTheme: (newTheme)=> {
      localStorage.setItem("rimofy-theme", newTheme);
      set({theme: newTheme});
    },
})) 