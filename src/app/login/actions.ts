
"use server";

import { z } from "zod";

interface AuthState {
  error?: string;
  message?: string;
  otpSent?: boolean;
}

const EmailSchema = z.string().email({ message: "Please enter a valid email address." });
const PhoneSchema = z.string().min(10, { message: "Please enter a valid 10-digit mobile number." }).regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number."});
const OTPSchema = z.string().min(6, { message: "Please enter the 6-digit OTP." }).length(6, { message: "OTP must be 6 digits."});


export async function sendLoginLink(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validatedFields = EmailSchema.safeParse(formData.get("email"));

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors._errors[0],
    };
  }
  
  const email = validatedFields.data;

  // In a real application, you would use a service like Firebase Auth
  // to send a sign-in link to the user's email.
  // For this prototype, we'll simulate success.
  console.log(`Login link would be sent to: ${email}`);

  return {
    message: "If an account with this email exists, a magic link has been sent to your inbox.",
  };
}


export async function sendOtp(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validatedFields = PhoneSchema.safeParse(formData.get("phone"));
  
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors._errors[0],
    };
  }

  const phone = validatedFields.data;
  
  // In a real application, this would send an OTP via SMS.
  // For this prototype, we'll simulate success.
  console.log(`OTP would be sent to: ${phone}`);

  return {
    otpSent: true,
    message: "An OTP has been sent to your mobile number.",
  };
}

export async function verifyOtp(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
   const validatedFields = OTPSchema.safeParse(formData.get("otp"));

  if (!validatedFields.success) {
    return {
      otpSent: true, // Keep showing the OTP field
      error: validatedFields.error.flatten().fieldErrors._errors[0],
    };
  }
  
  const otp = validatedFields.data;

  // In a real application, this would verify the OTP.
  // For this prototype, we'll simulate success if OTP is '123456'.
  console.log(`Verifying OTP: ${otp}`);

  if (otp === '123456') {
    return {
      message: "Login successful!",
    };
  } else {
     return {
      otpSent: true,
      error: "Invalid OTP. Please try again.",
    };
  }
}
