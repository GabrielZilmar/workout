"use client";

import UserSettingForm from "~/components/forms/user/settings";
import Loading from "~/components/loading";
import { useUpdateUser, useUser } from "~/hooks";
import GlobalLayout from "~/layouts/global.layout";

type HandleSubmitParams = {
  username?: string;
  age?: number;
  weight?: number;
  height?: number;
};

const UserSettingsPage = () => {
  const { user, isLoading } = useUser();
  const { updateUserMutation } = useUpdateUser();

  const handleSubmit = (data: HandleSubmitParams) => {
    if (!user) return;

    updateUserMutation({
      ...data,
      id: user.id,
    });
  };

  if (!user && !isLoading) {
    <h1 className="text-4xl text-red-600">User not found</h1>;
  }

  return (
    <GlobalLayout>
      {!user ? (
        <Loading />
      ) : (
        <div className="h-full">
          <h1 className="text-4xl">Account</h1>
          <div className="mt-2 px-2">
            <UserSettingForm
              user={user}
              onSubmit={handleSubmit}
              hideCancelLabel
            />
          </div>
        </div>
      )}
    </GlobalLayout>
  );
};

export default UserSettingsPage;
