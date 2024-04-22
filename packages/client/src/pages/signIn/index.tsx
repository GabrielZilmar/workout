import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { StyledOutlineButton } from "~/components/buttons";
import { StyledOutlineInput } from "~/components/input";
import { AnimatedTooltip } from "~/components/tooltip/animated";
import { SignInPayload } from "~/data/signIn";
import { useLogin } from "~/hooks";

type SignInFormInput = SignInPayload;

export default function SignIn() {
  const navigate = useNavigate();

  const { signInMutation } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInput>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignInFormInput> = (data) => {
    signInMutation(data);
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="h-screen">
      <div className="flex min-h-full flex-1 flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto"
            src="/logo.svg"
            width={200}
            height={100}
            alt="Workout Logo"
          />
          <h2 className="mt-10 text-center text-2xl font-bold text-white-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <StyledOutlineInput
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  register={register}
                  registerOptions={{
                    required: "This field is required",
                  }}
                  errors={errors.email}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white-900"
                >
                  Password
                </label>
                <AnimatedTooltip message="Not implemented yet 😔">
                  <div className="text-sm">
                    <a
                      href="#"
                      className="
                      font-semibold text-indigo-600
                      hover:text-indigo-500
                      opacity-50
                      cursor-not-allowed"
                    >
                      Forgot password?
                    </a>
                  </div>
                </AnimatedTooltip>
              </div>
              <div className="mt-2">
                <StyledOutlineInput
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  register={register}
                  registerOptions={{
                    required: "This field is required",
                  }}
                  errors={errors.password}
                />
              </div>
            </div>

            <div>
              <StyledOutlineButton
                className="flex w-full justify-center"
                type="submit"
              >
                Sign in
              </StyledOutlineButton>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not have an account?{" "}
            <button
              onClick={handleRegisterClick}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Create now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
