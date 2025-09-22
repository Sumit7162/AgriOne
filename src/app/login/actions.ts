
"use server";

import { z } from "zod";

interface LoginState {
  error?: string;
  message?: string;
}

const EmailSchema = z.string().email({ message: "Please enter a valid email address." });

export async function sendLoginLink(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
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
