"use client";

import signImg from "./signImg.jpg";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function SignForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/search");
      }
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">تسجيل الدخول</h1>
          <p className="text-muted-foreground text-sm">
            أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-600 text-xs">
                {errors.email?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">كلمة المرور</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-500 hover:underline"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-red-600 text-xs">
                {errors.password?.message}
              </span>
            )}
          </div>
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          لا تملك حسابًا؟{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            إنشاء حساب
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignForm;
