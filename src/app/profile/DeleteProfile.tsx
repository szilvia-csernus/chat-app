"use client";

import { Button } from "@heroui/react";
import React from "react";

export default function DeleteProfile() {
  return (
    <div className="max-w-96 mx-auto sm:col-span-2 md:col-span-1 flex flex-col justify-between items-center gap-4">
      <div className="md:hidden">*</div>
      <h3 className="text-xl font-bold mb-4 text-center">
        Have you had enough?{" "}
      </h3>
      <p className="ml-2">
        When you delete your account, all the data you have provided, including
        your messages, email, image, and personal details, will be permanently
        removed from our servers.
      </p>
      {/* <p className="text-sm ml-2">
        Please note that as this is an experimental project, your account will
        be automatically deleted two weeks after subscribing.
      </p> */}
      <div className="mt-4">
        <Button
          type="submit"
          size="md"
          // variant="ghost"
          // color="danger"
          className="btn btn-secondary text-danger border-1 border-danger bg-transparent"
        >
          Delete Account Now
        </Button>
      </div>
      <div className="md:hidden mt-4">*</div>
    </div>
  );
}
