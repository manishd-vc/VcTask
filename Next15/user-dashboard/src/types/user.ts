import { roleType } from "@/lib/session";
import { userFormSchema } from "@/schema/user";
import { z } from "zod";

export interface User {
  _id: string;
  email: string;
  companyId: string;
  departmentId: string;
  companyUserId: string;
  department: {
    name: string;
  };
  name: string;
  profile: string;
  address: string;
  mobileNumber: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  role: roleType;
}

export interface UserResponse {
  total: number;
  list: User[];
}
export interface UserDetailsResponse {
  ok: boolean;
  data: User;
}

export type UserFormData = z.infer<typeof userFormSchema>;
