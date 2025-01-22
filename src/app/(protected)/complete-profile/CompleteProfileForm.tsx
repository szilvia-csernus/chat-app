"use client";

import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import React, { useState } from "react";
import { FiLock } from "react-icons/fi";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import {
  CompleteProfileSchema,
  profileSchema,
  photoSchema,
} from "@/lib/schemas/completeProfileSchema";
import ProfileFormFirstStep from "./ProfileFormFirstStep";
import ProfileFormSecondStep from "./ProfileFormSecondStep";
import { completeProfile } from "@/app/actions/profileActions";
import { Session } from "next-auth";

const stepSchemas = [profileSchema, photoSchema];

type CompleteProfileFormProps = {
  session: Session | null;
};

export default function CompleteProfileForm({
  session,
}: CompleteProfileFormProps) {
  const [activeStep, setActiveStep] = useState(0);
  const currentValidationSchema = stepSchemas[activeStep];
  const router = useRouter();

  const methods = useForm<CompleteProfileSchema>({
    resolver: zodResolver(currentValidationSchema), // Commenting out this line will turn off client-side validation (to test server-side validation)
    mode: "onTouched",
  });

  const {
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = methods;

  const onSubmit = async () => {
    const result = await completeProfile(getValues());

    if (result.status === "success") {
      router.replace("/profile");
    } else {
      // Handle server errors by Zod
      if (Array.isArray(result.error)) {
        result.error.forEach((e) => {
          const fieldName = e.path.join(".") as
            | "name"
            | "country"
            | "gender"
            | "dateOfBirth"
            | "imageUrl"
            | "cloudinaryImageId";
          setError(fieldName, { message: e.message });
        });
      } else {
        setError("root.serverError", { message: result.error });
      }
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ProfileFormFirstStep session={session} />;
      case 1:
        return <ProfileFormSecondStep session={session} />;
      default:
        return <p>Unknown step</p>;
    }
  };

  const onBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onNext = async () => {
    if (activeStep === stepSchemas.length - 1) {
      await onSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  return (
    <Card className="min-w-80 w-full max-w-md mx-auto p-5 bg-background shadow shadow-foreground gap-4">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-4 items-center ">
          <div className="flex flex-row items-center gap-3">
            <FiLock size={25} className="text-accent" />
            <h1 className="text-2xl font-title">Complete Your Profile</h1>
          </div>
          <p className="text-sm">
            Tell us a bit more about yourself to complete your registration.
          </p>
        </div>
      </CardHeader>
      <hr className="border-t-0 border-b-1 border-gray-400" />
      <CardBody>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onNext)}>
            <div className="space-y-4">
              {getStepContent(activeStep)}

              <hr className="border-t-0 border-b-1 pt-4 border-gray-400" />
              {errors.root?.serverError && (
                <p className="text-danger text-sm">
                  {errors.root.serverError.message}
                </p>
              )}
              <div className="flex flex-row items-center gap-6">
                {activeStep !== 0 && (
                  <Button
                    onClick={onBack}
                    fullWidth
                    size="lg"
                    className="bg-slate-500 text-white rounded-lg"
                  >
                    Back
                  </Button>
                )}
                <Button
                  isLoading={isSubmitting}
                  isDisabled={!isValid}
                  fullWidth
                  size="lg"
                  color="secondary"
                  className="text-white rounded-lg"
                  type="submit"
                >
                  {activeStep === stepSchemas.length - 1
                    ? "Submit"
                    : "Continue"}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </CardBody>
    </Card>
  );
}
