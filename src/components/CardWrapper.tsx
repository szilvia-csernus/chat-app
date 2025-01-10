"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";
import React, { ReactNode } from "react";
import { IconType } from "react-icons";

type CardWrapperProps = {
  body?: ReactNode;
  headerIcon?: IconType;
  headerText: string;
  subHeader?: string | ReactNode;
  action?: () => void;
  actionLabel?: string;
  footer?: ReactNode;
};

export default function CardWrapper({
  body,
  headerIcon: Icon,
  headerText,
  subHeader,
  action,
  actionLabel,
  footer,
}: CardWrapperProps) {
  return (
    <Card className="min-w-80 w-full max-w-md mx-auto mt-10 p-5 bg-background border-1 border-gray-400 shadow shadow-gray-400 gap-4 flex flex-col items-center justify-center">
      <CardHeader className="flex flex-col items-center justify-center mt-2">
        <div className="flex flex-col gap-5 items-center">
          <div className="flex flex-row items-center gap-3">
            {Icon && <Icon size={25} className="text-accent" />}
            <h1 className="text-2xl font-title">{headerText}</h1>
          </div>
          {subHeader && <div className="text-sm">{subHeader}</div>}
        </div>
      </CardHeader>
      {body && <CardBody>{body}</CardBody>}
      <CardFooter className="w-auto">
        {action && (
          <Button
            onClick={action}
            fullWidth
            size="lg"
            color="secondary"
            className="btn btn-secondary w-full text-white"
          >
            {actionLabel}
          </Button>
        )}
        {footer && <>{footer}</>}
      </CardFooter>
    </Card>
  );
}
