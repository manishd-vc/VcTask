import { z } from "zod";

// Define form schema
export const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  department: z.string().optional(),
  profilePicture: z.string().optional(),
  mobileNumber: z.string().optional(),
  profilePictureFile: z.instanceof(File).optional(),
  profilePictureName: z.string().optional(),
  address: z.string().optional(),
});
