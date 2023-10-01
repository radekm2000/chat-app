/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Box,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Button, Link } from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signInUser } from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { Redirect } from "wouter";
import { useSocket } from "../../hooks/useSocket";
export const Login = () => {
  const { setAuth } = useAuth();
  const [username, setUsername] = useState("");
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const socket = useSocket();
  const mutation = useMutation({
    mutationFn: signInUser,
    onSuccess: () => {
      toast.success("User signed in sucesfully", { position: "top-right" });
    },
    onSettled(data) {
      setAuth!({ accessToken: data });
      localStorage.setItem('token', data)
      setSuccess(true);
      console.log(socket)
      socket.timeout(2000).connect()
      console.log(`socket connected: ${socket.connected} `)
    },
    onError: (error: any) => {
      if (Array.isArray((error as any).response.data.error)) {
        (error as any).response.data.error.forEach((el: any) =>
          toast.error(el.message, {
          })
        );
      } else {
        toast.error('Error occurred')
      }
      toast.error('An Error occurred')
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { mutate, isLoading, isError } = mutation;
    mutate({ username, password });
    if (isLoading) {
      return <h1>is Loading...</h1>;
    }
    if (isError) {
      return <h1>Unexpected error</h1>;
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {success && <Redirect to="/conversations/" />}
      <Container maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            mt: 8,
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" sx={{ mt: 1 }}>
            Sign in
          </Typography>
          <TextField
            value={username}
            required
            label="Username"
            sx={{ mt: 5 }}
            fullWidth
            onChange={(e) => setUsername(e.target.value)}
          ></TextField>
          <TextField
            value={password}
            type="password"
            required
            label="Password"
            sx={{ mt: 2, mb: 2 }}
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
          ></TextField>
          <Button
            onClick={handleSubmit}
            type="submit"
            fullWidth
            variant="contained"
          >
            Sign in
          </Button>
          <Grid container sx={{ mt: 2 }}>
            <Grid item xs>
              <Link href="/" variant="body2">
                Forgot password?{" "}
              </Link>
            </Grid>
            <Grid item>
              <Link variant="body2" href="/">
                Don't have an account? Sign up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </form>
  );
};
