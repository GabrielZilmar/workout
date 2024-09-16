"use client";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Label,
  PasswordInput,
} from "@workout/ui";
import { Lock } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Validator from "~/shared/validator";
import { useRecoverPassword } from "~/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "~/components/loading";
import Link from "next/link";
import { ALL_ROUTES } from "~/routes";
import { useEffect } from "react";
import { enqueueSnackbar } from "notistack";

const formSchema = z
  .object({
    password: z.string().min(8).regex(Validator.regexPasswordValidation, {
      message: "Password does not meet complexity requirements",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type FormSchema = z.infer<typeof formSchema>;

const RecoverPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const { errors: formErrors } = form.formState;

  const { recoverPasswordMutation, isSuccess, isPending } =
    useRecoverPassword();
  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    if (!token) {
      enqueueSnackbar("Missing recover password token", { variant: "error" });
      return;
    }

    recoverPasswordMutation({
      newPassword: data.password,
      token,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      router.push(ALL_ROUTES.signIn);
    }
  }, [isSuccess, router]);

  return (
    <div>
      <Form {...form}>
        <form
          className="space-y-6"
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white-900"
              >
                Password
              </Label>
            </div>
            <div className="mt-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="Password"
                        id="password"
                        autoComplete="current-password"
                        displayRuleChecker
                        required
                        startIcon={<Lock />}
                      />
                    </FormControl>
                    <FormMessage>
                      <>{formErrors.password}</>
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="confirmPassword"
                className="block text-sm font-medium leading-6 text-white-900"
              >
                Confirm Password
              </Label>
            </div>
            <div className="mt-2">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="Confirm Password"
                        id="confirmPassword"
                        autoComplete="current-password"
                        required
                        startIcon={<Lock />}
                      />
                    </FormControl>
                    <FormMessage>
                      <>{formErrors.confirmPassword}</>
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            {isPending ? (
              <Loading className="h-fit" />
            ) : (
              <Button fullWidth type="submit">
                Recover password
              </Button>
            )}
          </div>
        </form>
      </Form>

      <p className="mt-10 text-center text-sm text-gray-500">
        <Link
          href={ALL_ROUTES.signIn}
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Return to login
        </Link>
      </p>
    </div>
  );
};

export default RecoverPasswordForm;
