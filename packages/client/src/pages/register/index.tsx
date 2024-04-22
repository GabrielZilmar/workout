import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { StyledOutlineButton } from "~/components/buttons";
import { StyledOutlineInput } from "~/components/input";
import { RegisterUserPayload } from "~/data/register";

type RegisterFormInput = RegisterUserPayload & { confirmPassword: string };

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterFormInput> = (data) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
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
          <h2 className="xs:mt-10 text-center text-2xl font-bold text-white-900 mt-5">
            Create your account
          </h2>
        </div>

        <div className="xs:mt-10 xs:mx-auto xs:w-full xs:max-w-sm max-w-72 mx-auto mt-5">
          <form
            className="xs:space-y-6 space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label className="block text-sm font-medium leading-6 text-white-900">
                Username
              </label>
              <div className="mt-2">
                <StyledOutlineInput
                  name="username"
                  autoComplete="off"
                  required
                  register={register}
                  registerOptions={{
                    required: "This field is required",
                    minLength: { value: 4, message: "At least 4 characters" },
                  }}
                  errors={errors.username}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-white-900">
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
              <label className="block text-sm font-medium leading-6 text-white-900">
                Password
              </label>
              <div className="mt-2">
                <StyledOutlineInput
                  name="password"
                  type="password"
                  required
                  register={register}
                  registerOptions={{
                    required: "This field is required",
                    minLength: {
                      value: 6,
                      message: "At least 6 characters",
                    },
                  }}
                  errors={errors.password}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-white-900">
                Confirm Password
              </label>
              <div className="mt-2">
                <StyledOutlineInput
                  name="confirmPassword"
                  type="password"
                  required
                  register={register}
                  registerOptions={{
                    required: "This field is required",
                    validate: (value, formValues) => {
                      if (value !== formValues.password) {
                        return "Passwords must match";
                      }
                    },
                  }}
                  errors={errors.confirmPassword}
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
