import { useNavigate } from "react-router-dom";
import { StyledOutlineButton } from "~/components/buttons";
import { StyledOutlineInput } from "~/components/input";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log("Register form submitted");
  };

  const handleSignInClick = () => {
    navigate("/sign-in");
  };

  return (
    <div className="h-screen">
      <div className="flex min-h-full flex-1 flex-col justify-center">
        <div className="xs:mx-auto xs:w-full xs:max-w-sm max-w-72 mx-auto">
          <img
            className="mx-auto"
            src="/logo.svg"
            width={200}
            height={100}
            alt="Workout Logo"
          />
          <h2 className="mt-10 text-center text-2xl font-bold text-white-900">
            Create your account
          </h2>
        </div>

        <div className="mt-10 xs:mx-auto xs:w-full xs:max-w-sm max-w-72 mx-auto">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-white-900"
              >
                Username
              </label>
              <div className="mt-2">
                <StyledOutlineInput name="username" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-white-900">
                Email address
              </label>
              <div className="mt-2">
                <StyledOutlineInput
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-white-900">
                Password
              </label>
              <div className="mt-2">
                <StyledOutlineInput name="password" type="password" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-white-900">
                Confirm Password
              </label>
              <div className="mt-2">
                <StyledOutlineInput
                  name="confirm-password"
                  type="password"
                  required
                />
              </div>
            </div>

            <div className="mt-10 flex justify-between">
              <p className="self-center text-center text-sm text-gray-500">
                Already have an account?{" "}
                <button
                  onClick={handleSignInClick}
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Sign In
                </button>
              </p>

              <StyledOutlineButton type="submit">Register</StyledOutlineButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
