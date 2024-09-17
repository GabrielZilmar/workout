"use client";

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isUsernameAvailable } from "~/data/is-username-available";
import { WorkoutUser } from "~/types/user";
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

const formSchema = z.object({
  username: z.string().min(4).optional(),
  age: z.coerce.number().min(12).max(100).optional(),
  weight: z.coerce.number().min(36).optional(),
  height: z.coerce.number().min(140).optional(),
});
type FormSchema = z.infer<typeof formSchema>;

type UserSettingsFormProps = {
  user: WorkoutUser;
  onSubmit: (data: FormSchema) => void;
  onCancel?: () => void;
  hideCancelLabel?: boolean;
};

const UserSettingForm: React.FC<UserSettingsFormProps> = ({
  user,
  onSubmit,
  onCancel,
  hideCancelLabel = false,
}) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username,
      age: user.age ?? undefined,
      weight: user.weight ?? undefined,
      height: user.height ?? undefined,
    },
  });
  const { errors: formErrors } = form.formState;

  const checkUsernameAvailability = async (username: string) => {
    try {
      const { data: isAvail } = await isUsernameAvailable(username);
      return isAvail;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit: SubmitHandler<FormSchema> = async (data) => {
    if (data.username && data.username !== user.username) {
      const isAvailable = await checkUsernameAvailability(data.username);
      if (!isAvailable) {
        form.setError("username", {
          type: "manual",
          message: "Username is not available",
        });
        return;
      }
    }

    onSubmit(data);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Form {...form}>
      <form
        className="w-fit space-y-2"
        method="POST"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div>
          <Label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-white-900"
          >
            Email
          </Label>
          <Input disabled value={user.email} />
        </div>
        <div>
          <Label
            htmlFor="username"
            className="block text-sm font-medium leading-6 text-white-900"
          >
            Username
          </Label>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="text" required />
                </FormControl>
                <FormMessage>
                  <>{formErrors.username}</>
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="flex space-x-2">
          <div>
            <Label
              htmlFor="age"
              className="block text-sm font-medium leading-6 text-white-900"
            >
              Age
            </Label>
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage>
                    <>{formErrors.age}</>
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
          <div>
            <Label
              htmlFor="weight"
              className="block text-sm font-medium leading-6 text-white-900"
            >
              Weight
            </Label>
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage>
                    <>{formErrors.weight}</>
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
          <div>
            <Label
              htmlFor="height"
              className="block text-sm font-medium leading-6 text-white-900"
            >
              Height
            </Label>
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage>
                    <>{formErrors.height}</>
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit">Save</Button>
        {!hideCancelLabel && (
          <Button type="button" onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </form>
    </Form>
  );
};

export default UserSettingForm;
