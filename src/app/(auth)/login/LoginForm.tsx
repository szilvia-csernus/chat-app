"use client";

import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { FiLock } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginSchema } from "@/lib/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInUser } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginSchema) => {
    const result = await signInUser(data);
    if (result.status === "success") {
      router.push("/profile");
      router.refresh();
    } else {
      toast.error(result.error as string);
    }
  };

  return (
    <Card className="w-3/5 mx-auto p-5 rounded-md">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center text-secondary">
          <div className="flex flex-row items-center gap-3">
            <FiLock size={25} className="text-orange-300" />
            <h1 className="text-2xl font-title">Log in</h1>
          </div>
          <p className="text-neutral-600 text-sm">
            Not registered yet?{" "}
            <a href="/register" className="text-primary font-bold">
              Register here
            </a>
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 text-foreground">
            <Input
              label="Email"
              variant="bordered"
              autoComplete="username"
              {...register("email")}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
            <Input
              label="Password"
              variant="bordered"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />
            <Button
              isLoading={isSubmitting}
              isDisabled={!isValid}
              fullWidth
              color="secondary"
              className="text-background"
              type="submit"
            >
              Login
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
