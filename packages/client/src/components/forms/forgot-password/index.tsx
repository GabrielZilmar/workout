"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Label,
} from "@workout/ui";
import Link from "next/link";
import { ALL_ROUTES } from "~/routes";
import { useRouter } from "next/navigation";
import { useSendRecoverPasswordEmail } from "~/hooks";
import { useEffect } from "react";
import Loading from "~/components/loading";

const formSchema = z.object({
  email: z.string().max(255).email(),
});
type FormSchema = z.infer<typeof formSchema>;

const ForgotPasswordForm = () => {
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const { errors: formErrors } = form.formState;

  const { sendRecoverPasswordEmailMutation, isSuccess, isPending } =
    useSendRecoverPasswordEmail();
  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    sendRecoverPasswordEmailMutation(data);
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
            <Label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-white-900"
            >
              Email
            </Label>
            <div className="mt-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="test@example.com"
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        startIcon={<Mail />}
                      />
                    </FormControl>
                    <FormMessage>
                      <>{formErrors.email}</>
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

export default ForgotPasswordForm;
