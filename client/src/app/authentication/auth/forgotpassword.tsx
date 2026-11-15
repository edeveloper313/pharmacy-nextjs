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

const Forgotpassword = ({ title, subtitle, subtext }: Login) => {
   const [email, setEmail] = useState<string>( "");

const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
         const router=useRouter();

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
          htmlFor="email"
          mb="5px"
        >
          Email
        </Typography>
        <CustomTextField
    id="email"
    variant="outlined"
    fullWidth
    value={email} 
    placeholder="Enter your email"
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setEmail(e.target.value)
    }
/>
      </Box>
      <Box mt="25px">
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          placeholder="Enter your password"
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
    placeholder="Enter your password"
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setPassword(e.target.value)
    }
/>
      </Box>
      <Box mt="25px">
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="confirmPassword"
    placeholder="Enter your email"

          mb="5px"
        >
          Confirm Password
        </Typography>
        <CustomTextField
          id="confirmPassword"
          type="password"
          variant="outlined"
          fullWidth
    placeholder="Confirm password"

          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setConfirmPassword(e.target.value)
          }
        />
      </Box>
      <Stack
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        my={2}
      >
    
      </Stack>

       <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        component={Link}
        href="/authentication/forgotpassword"
        type="submit"
        
      >
        Send request
      </Button>
    </Stack>
 </form>
    {subtitle}
  </>
  )
}

export default Forgotpassword;
