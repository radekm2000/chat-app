import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { ChangePasswordProp } from "../../types/types";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { changePasswordCredentials } from "../../api/axios";
import { Redirect } from "wouter";

export const ChangePassword: React.FC<ChangePasswordProp> = ({ params }) => {
  const { token, userId } = params;
  const userIdToNum = parseInt(userId);
  const PWD_REGEX = /^.{8,}$/;
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const { mutate } = mutation;
    mutate({ password, confirmPassword, token, userId: userIdToNum });
    setConfirmPassword("");
    setPassword("");
  };

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setIsPasswordValid(result);
  }, [password]);

  useEffect(() => {
    if (!isPasswordValid && password.length > 0) {
      setPasswordErrorMsg("Password must contain at least 8 characters");
    }
  }, [password, isPasswordValid]);
  useEffect(() => {
    if (confirmPassword.length > 0 && password !== confirmPassword) {
      setConfirmPasswordErrorMsg("Confirm password must match the password");
      setIsConfirmPasswordValid(false);
    } else {
      setIsConfirmPasswordValid(true);
    }
  }, [confirmPassword, password]);

  const mutation = useMutation({
    mutationKey: ["user/changePassword"],
    mutationFn: changePasswordCredentials,
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
      setSuccess(true);
    },
    onError: (error) => {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || 'Unknown error');
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "200px",
      }}
    >
      {success ? (
        <Redirect to="/login" />
      ) : (
        <>
          <TextField
            sx={{ margin: "25px 0px", width: "250px" }}
            required
            label="Password"
            value={password}
            error={Boolean(password) && !isPasswordValid}
            id="outlined-error"
            helperText={!isPasswordValid && password ? passwordErrorMsg : null}
            onChange={(e) => setPassword(e.target.value)}
          ></TextField>
          <TextField
            sx={{ width: "250px" }}
            label="Confirm password"
            value={confirmPassword}
            error={Boolean(confirmPassword) && !isConfirmPasswordValid}
            id="outlined-error"
            helperText={
              !isConfirmPasswordValid && confirmPassword
                ? confirmPasswordErrorMsg
                : null
            }
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></TextField>
          <Button
            sx={{ width: "250px", marginTop: "10px" }}
            variant="contained"
            onClick={(e) => handleSubmit(e)}
          >
            Change password
          </Button>
        </>
      )}
    </Box>
  );
};
