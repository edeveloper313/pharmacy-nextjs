"use client";
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import CustomTextField from '@/app/(DashboardLayout)/dashboard/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';


interface registerType {
    title?: string;
    subtitle?: React.ReactNode;
    subtext?: React.ReactNode;
}

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
       const router=useRouter();
  const handleSubmit=(e:any)=>{
    e.preventDefault();
    router.push('/dashboard');
  }
    return (
    <>
        {title ? (
            <Typography fontWeight="700" variant="h2" mb={1}>
                {title}
            </Typography>
        ) : null}

        {subtext}

        <Box>
            <Stack mb={3}>
                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='name' mb="5px">Name</Typography>
                <CustomTextField id="name" variant="outlined" fullWidth placeholder="Ahmed raza" />

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='email' mb="5px" mt="25px">Email Address</Typography>
                <CustomTextField id="email" variant="outlined" fullWidth placeholder="ahmed@gmail.com"/>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px">Password</Typography>
                <CustomTextField id="password" variant="outlined" fullWidth  placeholder="password"/>
            </Stack>
            <Button color="primary" variant="contained" size="large" fullWidth component={Link}     onClick={handleSubmit}
 href="/authentication/sign-in">
                Send Request
            </Button>
        </Box>
        {subtitle}
    </>
    )
}

export default AuthRegister;
