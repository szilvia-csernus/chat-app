"use client";

import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React from "react";
import { FiLock } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import { registerUser } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema), // Commenting out this line will turn off Client-side validation (to test server-side validation)
    mode:"onBlur",
  });

  const router = useRouter();

  const onSubmit = async (data: RegisterSchema) => {
    const result = await registerUser(data);
    
    
    if (result.status === "success") {
      console.log("User registered successfully");
      router.push("/profile");
      router.refresh();
    } else {
      // Handle server errors by Zod
      if (Array.isArray(result.error)) {
        result.error.forEach((e) => {
          const fieldName = e.path.join('.') as 'email' | 'password' | 'name';
          setError(fieldName, { message: e.message })
        })
      } else {
        setError('root.serverError', { message: result.error });
      }
    }
  };

  return (
    <Card className="w-3/5 mx-auto p-5">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center text-secondary">
          <div className="flex flex-row items-center gap-3">
            <FiLock size={25} className="text-orange-300" />
            <h1 className="text-2xl font-title">Register</h1>
          </div>
          <p className="text-neutral-600 text-sm">
            Already registered?{" "}
            <a href="/login" className="text-primary">
              Log in here
            </a>
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Name"
              variant="bordered"
              {...register("name")}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
            <Input
              label="Email"
              variant="bordered"
              {...register("email")}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
            <Input
              label="Password"
              variant="bordered"
              type="password"
              {...register("password")}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />
            {errors.root?.serverError && (
              <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
            )}
            <Button
              isLoading={isSubmitting}
              isDisabled={!isValid}
              fullWidth
              color="secondary"
              className="text-white"
              type="submit"
            >
              Register
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
