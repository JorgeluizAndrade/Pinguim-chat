"use client";

import { FC, useState } from "react";
import Button from "./Button";
import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddFriendButtonProps {}

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const { register, handleSubmit, setError, formState:{errors} } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validateEmail = addFriendValidator.parse({ email });

      await axios.post("/api/friends/add", {
        email: validateEmail,
      });

      setShowSuccessState(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError('email', {
          message: error.message
        })
        return;
      }

      if (error instanceof AxiosError) {
        setError('email', {
          message: error.response?.data
        })
        return;
      }
      setError('email', {message:"Something went wrong!"})
    }
  };

  const onSubmit = (data: FormData) =>{
    addFriend(data.email)
  }
  return (
    <form  onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-blue-950"
      >
        Add friend by Email
      </label>
      <div className="mt-2 flex gap-4">
        <input
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-blue-900 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-700  sm:text-sm sm:leading-6"
          placeholder="you@exemple.com"
          {...register("email")}
        />
        <Button>Add</Button>
      </div>
      <p className="mt-1 text-red-700 ">
        {errors.email?.message}
      </p>
      {showSuccessState ? (
        <p className="mt-1 text-green-600">Friend request send</p>
      ) : null}
    </form>
  );
};

export default AddFriendButton;
