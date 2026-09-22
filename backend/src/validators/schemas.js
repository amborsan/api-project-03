import { z } from 'zod';



/* export const checkoutSchema = z.object({
  userId: z.number().int().positive(),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    line1: z.string().min(5),
    line2: z.string().optional(),
    city: z.string().min(2),
    postalCode: z.string().min(2),
    country: z.string().length(2, "Country must be a 2-letter ISO code")
  })
}); */

export const checkoutSchema = z.object({
  userId: z.number().int().positive()
  // shippingAddress removed
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  parentId: z.number().int().positive().optional()
});
export const userSchema = z.object({
    name:z.string().trim().toLowerCase().min(3, "The name must be at least 3 characters!").max(32, "The name can not be more than 32 characters!"),
    email: z.email("Please enter a valid email").trim().toLowerCase(),
    password: z.string().min(6, "Password must be at least 6 characters").trim(),
    confirm: z.string().min(8).trim().optional(),
    role: z.string().trim().min(3, "The role must be at least 3 characters!").max(32, "The role can not be more than 32 characters!").optional(),
})
export const userPatchSchema = userSchema.partial();

export const brandSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters")
});
export const addToCartSchema = z.object({
  userId: z.number().int().positive(),
  productId: z.number().int().positive(),
  quantity: z.number().int().positive()
});