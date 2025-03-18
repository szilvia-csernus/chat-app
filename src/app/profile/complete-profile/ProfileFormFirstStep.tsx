import { Input, Select, SelectItem } from "@heroui/react";
import { Session } from "next-auth";
import React from "react";
import { useFormContext } from "react-hook-form";

type ProfileFormFirstStepProps = {
  session: Session | null;
};

export default function ProfileFormFirstStep({
  session,
}: ProfileFormFirstStepProps) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const genderList = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "LGBT+", value: "lgbt+" },
    { label: "Prefer not to say", value: "prefer-not-to-say" },
  ];

  return (
    <div className="space-y-4">
      <Input
        label="First Name"
        isRequired
        autoComplete="given-name"
        variant="bordered"
        defaultValue={session?.user.name}
        {...register("name")}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message as string}
        classNames={{
          inputWrapper: "bg-gray-50 dark:bg-background",
          input: "text-foreground",
        }}
      />
      <Input
        label="Country of residence"
        isRequired
        autoComplete="country-name"
        variant="bordered"
        {...register("country")}
        isInvalid={!!errors.country}
        errorMessage={errors.country?.message as string}
        classNames={{
          inputWrapper: "bg-gray-50 dark:bg-background",
          input: "text-foreground",
        }}
      />
      <Select
        label="Gender"
        isRequired
        variant="bordered"
        {...register("gender")}
        isInvalid={!!errors.gender}
        errorMessage={errors.gender?.message as string}
        onChange={(e) => setValue("gender", e.target.value)}
        classNames={{
          mainWrapper: "bg-[#f7f7f7] dark:bg-background",
        }}
      >
        {genderList.map((item) => (
          <SelectItem key={item.value} data-value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </Select>

      <Input
        label="Date of Birth"
        type="date"
        isRequired
        variant="bordered"
        autoComplete="bday"
        isInvalid={!!errors.dateOfBirth}
        {...register("dateOfBirth")}
        errorMessage={errors.dateOfBirth?.message as string}
        classNames={{
          inputWrapper: "bg-gray-50 dark:bg-background",
          input: "text-foreground",
        }}
      />
    </div>
  );
}
