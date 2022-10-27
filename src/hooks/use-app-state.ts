import create from "zustand";

type AppState = {
  isPresenting: boolean;
  setIsPresenting: (isPresenting: boolean) => void;
  hovering: boolean;
  setHovering: (hovering: boolean) => void;
};

export const appState = create<AppState>((set) => {
  return {
    isPresenting: false,
    setIsPresenting(isPresenting) {
      set({ isPresenting });
    },
    hovering: false,
    setHovering(hovering) {
      set({ hovering });
    },
  };
});

export default appState;
