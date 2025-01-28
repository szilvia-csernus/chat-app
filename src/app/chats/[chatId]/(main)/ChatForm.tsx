"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { messageSchema, MessageSchema } from "@/lib/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@heroui/react";
import { HiPaperAirplane } from "react-icons/hi2";
import { useParams, useRouter } from "next/navigation";
import {
  createMessage,
} from "@/app/actions/messageActions";
import { handleFormServerErrors } from "@/lib/utils";


type Props = {
  chatPartnerId: string;
};

export default function ChatForm({ chatPartnerId }: Props) {
  const router = useRouter();
  const params = useParams<{ chatId: string }>();
  const chatId = params.chatId;
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { isSubmitting, isValid, errors },
  } = useForm<MessageSchema>({ resolver: zodResolver(messageSchema) });

  // const updateUnreadCount = useMessageStore((state) => state.updateUnreadCount);

  useEffect(() => {
    setFocus("content");
  }, [setFocus]);

  const onSubmit = async (data: MessageSchema) => {
    const result = await createMessage(chatId, chatPartnerId, data);
    if (result.status === "error") {
      handleFormServerErrors(result, setError);
    } else {
      reset();
      setTimeout(() => setFocus("content"), 50);

      // const updatedMessages = await getMessageThread(chatPartnerId);
      // setMessages(updatedMessages);

      // getUnreadMessageCount().then((count) => {
      //   updateUnreadCount(count);
      // });

      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <Input
          fullWidth
          radius="lg"
          placeholder="Type your message here..."
          {...register("content")}
          isInvalid={!!errors.content}
          errorMessage={errors.content?.message}
        />
        <Button
          type="submit"
          isIconOnly
          color="secondary"
          radius="full"
          isLoading={isSubmitting}
          isDisabled={!isValid || isSubmitting}
          className="text-white"
        >
          <HiPaperAirplane size={18}  />
        </Button>
      </div>
      <div className="flex flex-col">
        {errors.root?.serverError && (
          <p className="text-danger text-sm">
            {errors.root.serverError.message}
          </p>
        )}
      </div>
    </form>
  );
}
