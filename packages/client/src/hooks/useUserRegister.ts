import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { HttpStatus } from "~/constants/httpStatus";
import {
  RegisterUserPayload,
  RegisterUserResult,
  registerUser,
} from "~/data/register";

export const useRegisterUser = () => {
  const navigate = useNavigate();

  const { mutate: registerUserMutation } = useMutation<
    RegisterUserResult,
    AxiosError,
    RegisterUserPayload
  >({
    mutationFn: (payload) => registerUser(payload),
    onSuccess: () => {
      navigate("/login");
      enqueueSnackbar("User created!", {
        variant: "success",
      });
    },
    onError: (error) => {
      if (error.response?.status === HttpStatus.CONFLICT) {
        console.log("🚀 ~ useRegisterUser ~ error:", error.response.data);
        return enqueueSnackbar("Ops.. User already exists!", {
          variant: "error",
        });
      }

      return enqueueSnackbar("Ops.. Error on register user. Try again!", {
        variant: "error",
      });
    },
  });

  return { registerUserMutation };
};

export default useRegisterUser;
