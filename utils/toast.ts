import { toast, Bounce } from "react-toastify";

const config = {
  position: "top-right" as const,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  theme: "light" as const,
  transition: Bounce,
};

export const Toast = {
  success: (message: string) => toast.success(message, config),

  error: (message: string) => toast.error(message, config),

  warn: (message: string) => toast.warn(message, config),

  info: (message: string) => toast.info(message, config),
};