"use client";
import React, { useState } from "react";
import { TextField, Button, Avatar, Chip, IconButton, InputAdornment } from "@mui/material";
import { CloudUpload, Save, Visibility, VisibilityOff } from "@mui/icons-material";

export default function ProfilePage() {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profile & Pharmacy Details</h1>
        <p className="text-sm text-slate-500">Apni personal aur pharmacy ki details update karein</p>
      </div>

      {/* SECTION 1: Personal Profile */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Personal Information</h2>
          <Chip label="Super Admin" color="primary" size="small" />
        </div>

        {/* Avatar Upload */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar sx={{ width: 64, height: 64 }} src="/avatar.png" />
          <div>
            <Button variant="outlined" component="label" size="small" startIcon={<CloudUpload />}>
              Change Photo
              <input type="file" hidden accept="image/*" />
            </Button>
            <p className="text-xs text-slate-400 mt-1">JPG or PNG, Max 2MB</p>
          </div>
        </div>

        {/* Tailwind Grid + MUI TextFields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Full Name" size="small" fullWidth defaultValue="Faisal BARKATI" />
          <TextField label="Username" size="small" fullWidth defaultValue="admin_pharmacy" />
          <TextField label="Email Address" type="email" size="small" fullWidth defaultValue="admin@pharmacy.com" />
          <TextField label="Mobile Number" size="small" fullWidth defaultValue="0301-2345678" />
        </div>
      </div>

      {/* SECTION 2: Pharmacy Business Profile (For Invoices) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Pharmacy Business Profile (Invoice Header)
        </h2>

        {/* Logo Upload */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-white rounded-lg border flex items-center justify-center text-xs text-slate-400">
            Logo
          </div>
          <div>
            <Button variant="contained" component="label" size="small" startIcon={<CloudUpload />}>
              Upload Pharmacy Logo
              <input type="file" hidden accept="image/*" />
            </Button>
            <p className="text-xs text-slate-500 mt-1">Yeh logo har printed aur PDF invoice par show hoga.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Pharmacy Name" size="small" fullWidth required />
          <TextField label="Tagline / Slogan" size="small" fullWidth />
          <TextField label="TRN / Tax Number" size="small" fullWidth />
          <TextField label="Pharmacy / Drug License No." size="small" fullWidth />
          <TextField label="Business Phone" size="small" fullWidth />
          <TextField label="WhatsApp Number (Digital Delivery)" size="small" fullWidth />
          <TextField label="Business Email" type="email" size="small" fullWidth />
          <TextField label="City & Country" size="small" fullWidth defaultValue="Pakistan, karachi" />
          <div className="md:col-span-2">
            <TextField label="Full Shop Address" size="small" fullWidth multiline rows={2} />
          </div>
          <div className="md:col-span-2">
            <TextField
              label="Invoice Footer Note"
              size="small"
              fullWidth
              multiline
              rows={2}
              placeholder="e.g., Medicines once sold cannot be returned without bill."
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Security / Password */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Change Password</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField label="Current Password" type="password" size="small" fullWidth />
          <TextField
            label="New Password"
            type={showPass ? "text" : "password"}
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small">
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField label="Confirm New Password" type="password" size="small" fullWidth />
        </div>
      </div>

      {/* Save & Reset Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outlined" color="inherit">Reset</Button>
        <Button variant="contained" startIcon={<Save />} className="bg-blue-600">
          Save Changes
        </Button>
      </div>
    </div>
  );
}