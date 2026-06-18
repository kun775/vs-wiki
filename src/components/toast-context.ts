import { createContext, useContext } from 'react';

type ShowToastFn = (message: string) => void;

export const ToastContext = createContext<ShowToastFn>(() => {});

export const useToast = (): ShowToastFn => useContext(ToastContext);
