import { useState  } from "react";

export default function useDialog(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return { isOpen, openDialog, closeDialog };
}
