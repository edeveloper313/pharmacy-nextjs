"use client";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from "@mui/material";
import Link from "next/link";

import CustomTextField from "@/app/(DashboardLayout)/dashboard/components/forms/theme-elements/CustomTextField";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface Login {
  title?: string;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
}

const Login = ({ title, subtitle, subtext }: Login) => {
   const [username, setUsername] = useState<string>( "Admin");

const [password, setPassword] = useState("123456");
         const router=useRouter();
 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
if(username.trim() === "" || password.trim() === "") {
      alert("Please enter both username and password.");
      return;
    }
    if(username !== "Admin" || password !== "123456") {
console.log("Username:", username);
    console.log("Password:", password);
      alert("Invalid username or password.");
      return;
    }
    if(username === "Admin" && password === "123456") {
      console.log("Username:", username);
    console.log("Password:", password);
      router.push("/dashboard");
    }
    

};
  return(
  <>
    {title ? (
      <Typography fontWeight="700" variant="h2" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}
<form>
    <Stack>
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="username"
          
          mb="5px"
        >
          Username
        </Typography>
        <CustomTextField
    id="username"
    variant="outlined"
    fullWidth
    value={username}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setUsername(e.target.value)
    }
/>
      </Box>
      <Box mt="25px">
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="password"
          mb="5px"
        >
          Password
        </Typography>
       <CustomTextField
    id="password"
    type="password"
    variant="outlined"
    fullWidth
    value={password}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setPassword(e.target.value)
    }
/>
      </Box>
      <Stack
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        my={2}
      >
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Remeber this Device"
          />
        </FormGroup>
        <Typography
          component={Link}
          href="/"
          fontWeight="500"
          sx={{
            textDecoration: "none",
            color: "primary.main",
          }}
        >
          Forgot Password ?
        </Typography>
      </Stack>
       <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        component={Link}
        href="/"
        type="submit"
        onClick={handleSubmit}
      >
        Sign In
      </Button>
    </Stack>
 </form>
    {subtitle}
  </>
  )
}

export default Login;
