"use client";
import { login } from "@/actions/login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await login({
        request: "auth/login",
        payload: JSON.stringify(values),
      });
      if (response.ok) {
        router.push("/users"); // Redirect to dashboard after successful login
        toast.success("Login successful");
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <Card className="md:py-10 py-6 md:gap-10 gap-6">
      <CardHeader className="space-y-1 md:px-10 px-6 gap-0">
        <CardTitle className="md:text-3xl text-2xl text-primary font-bold">
          Login
        </CardTitle>
      </CardHeader>
      <CardContent className="md:px-10 px-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="md:space-y-5 space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="link"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full cursor-pointer">
              LOGIN
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
