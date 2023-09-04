"use client";

import { ButtonHTMLAttributes, FC, useState } from "react";
import Button from "./ui/Button";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { Loader, LogOut } from "lucide-react";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
  const [isSigninOut, setIsSigninOut] = useState<boolean>(false);

  return (
    <Button
      {...props}
      variant="ghost"
      onClick={async () => {
        setIsSigninOut(true);
        try {
          await signOut();
        } catch (error) {
          toast.error("There was a problem siging out");
        } finally {
          setIsSigninOut(false);
        }
      }}
    >
      {isSigninOut ? <Loader className="animate-spin h-4 w-4" /> : <LogOut />}
    </Button>
  );
};

export default SignOutButton;
