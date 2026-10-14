import { createContext, useContext, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useMessaging } from "@/hooks/useMessaging";

type MessagingContextType = ReturnType<typeof useMessaging>;

const MessagingContext = createContext<MessagingContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const MessagingProvider = ({ children }: Props) => {
  const userId = useSelector((state: RootState) => state.user._id);
  console.log("USER IDD IDDID DIDD : ",userId)

  const messaging = useMessaging(userId);

  return (
    <MessagingContext.Provider value={messaging}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessagingContext = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error("useMessagingContext must be used inside MessagingProvider");
  }
  return context;
};