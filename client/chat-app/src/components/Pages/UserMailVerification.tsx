import { Box, Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { sendEmailAndFindUserToResetPassword } from "../../api/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const UserMailVerification = () => {
  const [emailValue, setEmailValue] = useState("");

  const mutation = useMutation({
    mutationKey: ["users/sendResetPassword"],
    mutationFn: sendEmailAndFindUserToResetPassword,
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError(error: AxiosError) {
      if (error instanceof AxiosError) {
        const mapErrorsToMessage = (errors) => {
          const mappedErrors = errors.map((error) => {
            switch (error) {
              case "email must be an email":
                return "Email must be an email";
              case "email should not be empty":
                return "Email should not be empty";
              default:
                return error;
            }
          });

          return mappedErrors.join(" and ");
        };
        if (
          error.response &&
          error.response.data &&
          Array.isArray(error.response.data?.message)
        ) {
          const errorMessage = mapErrorsToMessage(
            error?.response?.data?.message
          );
          toast.error(errorMessage);
        }
      }
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const { isLoading, mutate } = mutation;
    mutate(emailValue);
    if (isLoading) {
      return <div>isLoading...</div>;
    }
    setEmailValue("");
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "200px",
      }}
    >
      <TextField
        sx={{ gap: "24px" }}
        value={emailValue}
        label="Enter your email address"
        onChange={(e) => setEmailValue(e.target.value)}
      ></TextField>
      <Button
        sx={{ width: "250px", marginTop: "10px" }}
        variant="contained"
        onClick={(e) => handleSubmit(e)}
      >
        Reset password
      </Button>
    </Box>
  );
};
