"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { messageSchema, MessageSchema } from "@/lib/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Textarea } from "@heroui/react";
import { HiPaperAirplane } from "react-icons/hi2";
import { useParams } from "next/navigation";
import { createMessage } from "@/app/actions/messageActions";
import { handleFormServerErrors } from "@/lib/utils";

export default function ChatForm() {
  const params = useParams<{ chatId: string }>();
  const chatId = params.chatId;
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { isSubmitting, isValid, errors },
  } = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    setFocus("content");
  }, [setFocus]);

  const onSubmit = async (data: MessageSchema) => {
    const result = await createMessage(chatId, data);
    if (result.status === "error") {
      handleFormServerErrors(result, setError);
    } else {
      reset();
      setTimeout(() => setFocus("content"), 50);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="none"
      className="flex flex-col mb-0 mx-1"
    >
      <div className="flex items-center gap-2 w-full">
        <Textarea
          minRows={1}
          maxRows={10}
          radius="lg"
          placeholder="Type your message here..."
          {...register("content")}
          isInvalid={!!errors.content}
          errorMessage={errors.content?.message}
          className="whitespace-pre-line"
        />
        {isValid && (
          <Button
            type="submit"
            isIconOnly
            color="secondary"
            radius="full"
            isLoading={isSubmitting}
            isDisabled={!isValid && !isSubmitting}
            className="text-white"
          >
            <HiPaperAirplane size={18} />
          </Button>
        )}
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
