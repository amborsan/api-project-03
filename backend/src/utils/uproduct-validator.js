import * as z from "zod"; 

export const productSchema = z.object({
    brandId:z.int().optional(),
    name:z.string().trim().toLowerCase().min(3, "The name must be at least 3 characters!").max(32, "The name can not be more than 32 characters!"),
    slug : z.string().optional(),
    shortDescription: z.string().trim().optional(),
    description: z.string().trim(),
    isActive: z.boolean().default(true),
    price: z.number()
  .nonnegative("Preis darf nicht negativ sein")
  .multipleOf(0.01, "Maximal zwei Nachkommastellen erlaubt"),
  stock: z.nonnegative(),
 
})
export const productPatchSchema = productSchema.partial();
export const categorySchema = z.object({
   
    name:z.string().trim().toLowerCase().min(3, "The name must be at least 3 characters!").max(32, "The name can not be more than 32 characters!"),
    slug : z.string().optional(),
   
    description: z.string().trim(),

  slug: z.string().optional(),
 
})