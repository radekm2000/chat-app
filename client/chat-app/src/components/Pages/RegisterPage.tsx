import { FormEvent, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, Input, InputLabel, Link } from "@mui/material";
import { Avatar, Box, Container, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useMutation } from "@tanstack/react-query";
import { signUpUser } from "../../api/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
const USERNAME_REGEX = /^.{5,}$/;
const PWD_REGEX = /^.{8,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const Register = () => {
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  console.log(username);
  const [password, setPassword] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  console.log("is mail valid");
  console.log(validEmail);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [usernameErrorMsg, SetUsernameErrorMsg] = useState("");
  const [pwdErrorMsg, SetPwdErrorMsg] = useState("");

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = USERNAME_REGEX.test(username);
    setValidUsername(result);
  }, [username]);

  useEffect(() => {
    if (!validEmail && email.length > 0) {
      setEmailErrorMsg("Email must be in proper format.");
    }
  }, [email, validEmail]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPwd(result);
  }, [password]);

  useEffect(() => {
    if (!validUsername && username.length > 0) {
      SetUsernameErrorMsg("Username must contain at least 5 characters");
    }
  }, [username, validUsername]);

  useEffect(() => {
    if (!validPwd && password.length > 0) {
      SetPwdErrorMsg("Password must contain at least 8 characters");
    }
  }, [password, validPwd]);

  const mutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: () => {
      toast.success("User created");
      setEmail("");
      setPassword("");
      setUsername("");
    },
    onError(error: AxiosError) {
      toast.error(error?.response?.data?.message);
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { isLoading, isError, mutate, error } = mutation;
    mutate({ username, password, email });
    if (isLoading) {
      return <h1>isLoading...</h1>;
    } else if (isError) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Container maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginTop: 8,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">Sign up</Typography>
          <TextField
            autoComplete="true"
            error={Boolean(email) && !validEmail}
            id="outlined-error"
            helperText={!validEmail && email ? emailErrorMsg : null}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="text"
            sx={{ mt: 4 }}
            required
            fullWidth
            label="Email"
            name="email"
          ></TextField>
          <TextField
            autoComplete="true"
            error={Boolean(username) && !validUsername}
            id="outlined-error-helper-text"
            helperText={!validUsername && username ? usernameErrorMsg : null}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
            sx={{ mt: 3, mb: 1 }}
            name="username"
            required
            fullWidth
            label="Username"
          ></TextField>
          <TextField
            autoComplete="true"
            error={Boolean(password) && !validPwd}
            id="outlined-error"
            helperText={!validPwd && password ? pwdErrorMsg : null}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            sx={{ mt: 2, mb: 1 }}
            name="password"
            required
            fullWidth
            label="Password"
          ></TextField>

          <Button
            onClick={handleSubmit}
            type="submit"
            fullWidth
            variant="contained"
          >
            Sign up
          </Button>
          <Link
            variant="body2"
            href="/login"
            style={{ paddingLeft: "150px", paddingTop: "20px" }}
          >
            Already have an account? Sign in
          </Link>
        </Box>
      </Container>
    </form>
  );
};
