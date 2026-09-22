import * as z from "zod"; 

export const userSchema = z.object({
    name:z.string().trim().toLowerCase().min(3, "The name must be at least 3 characters!").max(32, "The name can not be more than 32 characters!"),
    email: z.email("Please enter a valid email").trim().toLowerCase(),
    password: z.string().min(6, "Password must be at least 6 characters").trim(),
    confirm: z.string().min(8).trim().optional(),
})
export const userPatchSchema = userSchema.partial()