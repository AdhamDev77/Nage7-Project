'use client';

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Define the schema
const signupSchema = z
  .object({
    firstName: z.string().min(1, "الاسم الأول مطلوب"),
    lastName: z.string().min(1, "الاسم الأخير مطلوب"),
    email: z.string().email("عنوان البريد الإلكتروني غير صالح"),
    password: z.string().min(6, "يجب أن يكون طول كلمة المرور 6 أحرف على الأقل"),
    confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
    phone: z.string().min(10, "رقم الهاتف غير صالح"),
    role: z.enum(["student", "teacher"]),
    stage: z.string().optional(),
    stage_2: z.string().optional(),
    parentsPhoneNumber: z.string().optional(),
    subject: z.string().optional(),
    profile_picture: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Adjusted to null for no initial value

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const stageOptions: Record<string, string[]> = {
    "ابتدائي": ["ثالثة ابتدائي", "رابعة ابتدائي", "خامسة ابتدائي", "سادسة ابتدائي"],
    "اعدادي": ["أولي", "تانية", "ثالثة"],
    "ثانوي": ["أولي", "ثانية", "ثالثة"],
    "أخر": [],
  };

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phone,
        email: data.email,
        password: data.password,
        role: data.role,
        stage: data.stage,
        stage_2: data.stage_2,
        parents_phone_number: data.parentsPhoneNumber,
        subject: data.subject,
        profile_picture: imageUrl, // Ensure this is correctly handled in your API
      };

      console.log("البيانات المرسلة:", payload);

      const response = await axios.post('/api/register', payload);

      if (response.status === 201) {
        setSuccess('تم إنشاء الحساب بنجاح!');
        router.push('/signin');
      } else {
        setError(response.data?.error || 'فشل في إنشاء الحساب.');
      }
    } catch (err: any) {
      let errorMessage;
      if (err?.response?.data?.error) {
        const errorData = err.response.data.error;
        if (errorData.code === 'P2002' && errorData.meta?.target?.includes('User_phone_key')) {
          errorMessage = 'رقم الهاتف موجود بالفعل. يرجى استخدام رقم هاتف مختلف.';
        } else {
          errorMessage = typeof errorData === 'string'
            ? errorData
            : JSON.stringify(errorData);
        }
      } else {
        errorMessage = err?.message || 'حدث خطأ.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({
    id,
    label,
    placeholder,
    type = "text",
    register,
    errors
  }: {
    id: string;
    label: string;
    placeholder: string;
    type?: string;
    register: any;
    errors: any;
  }) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(id)}
        className="p-3 border border-gray-300 rounded-lg shadow-sm"
      />
      {errors[id] && (
        <span className="text-red-600 text-sm">{errors[id]?.message}</span>
      )}
    </div>
  );

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <div className="w-full md:w-1/2">
        <Card className="bg-white shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">التسجيل</CardTitle>
            <CardDescription className="text-gray-600">
              أدخل معلوماتك لإنشاء حساب
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField id="firstName" label="الاسم الأول" placeholder="ماكس" register={register} errors={errors} />
                <InputField id="lastName" label="الاسم الأخير" placeholder="روبينسون" register={register} errors={errors} />
              </div>
              <InputField id="email" label="البريد الإلكتروني" placeholder="m@example.com" type="email" register={register} errors={errors} />
              <InputField id="password" label="كلمة المرور" type="password" register={register} errors={errors} placeholder="" />
              <InputField id="confirmPassword" label="تأكيد كلمة المرور" type="password" register={register} errors={errors} placeholder="" />
              <InputField id="phone" label="رقم الهاتف" register={register} errors={errors} placeholder="" />

              <div className="flex flex-col gap-2">
                <Label htmlFor="role">الدور</Label>
                <select
                  id="role"
                  {...register("role")}
                  onChange={(e) => setRole(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg shadow-sm"
                >
                  <option value="">اختر الدور</option>
                  <option value="student">طالب</option>
                  <option value="teacher">معلم</option>
                </select>
                {errors.role && (
                  <span className="text-red-600 text-sm">{errors.role?.message}</span>
                )}
              </div>

              {role === "student" && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="stage">المرحلة</Label>
                    <select
                      id="stage"
                      {...register("stage")}
                      onChange={(e) => setSelectedStage(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg shadow-sm"
                    >
                      <option value="">اختر المرحلة</option>
                      <option value="ابتدائي">ابتدائي</option>
                      <option value="اعدادي">اعدادي</option>
                      <option value="ثانوي">ثانوي</option>
                      <option value="أخر">أخر</option>
                    </select>
                    {errors.stage && (
                      <span className="text-red-600 text-sm">{errors.stage?.message}</span>
                    )}
                  </div>

                  {selectedStage && selectedStage !== "أخر" && (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="stage_2">المرحلة 2</Label>
                      <select
                        id="stage_2"
                        {...register("stage_2")}
                        className="p-3 border border-gray-300 rounded-lg shadow-sm"
                      >
                        <option value="">اختر المرحلة 2</option>
                        {stageOptions[selectedStage].map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.stage_2 && (
                        <span className="text-red-600 text-sm">{errors.stage_2?.message}</span>
                      )}
                    </div>
                  )}
                </>
              )}

              {role === "teacher" && (
                <InputField id="subject" label="المادة" placeholder="الرياضيات" register={register} errors={errors} />
              )}

              <InputField id="parentsPhoneNumber" label="رقم هاتف ولي الأمر" placeholder="" register={register} errors={errors} />

              <div className="flex flex-col gap-2">
                <Label htmlFor="profile_picture">صورة الملف الشخصي</Label>
                <input
                  type="file"
                  id="profile_picture"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onloadend = () => setImageUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="p-3 border border-gray-300 rounded-lg shadow-sm"
                />
                {imageUrl && (
                  <div className="mt-2">
                    <img src={imageUrl} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full" />
                  </div>
                )}
              </div>

              {error && <div className="text-red-600">{error}</div>}
              {success && <div className="text-green-600">{success}</div>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "جاري التسجيل..." : "تسجيل"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="mt-4 text-center">
          <p>لديك حساب بالفعل؟ <Link href="/signin" className="text-blue-600">تسجيل الدخول</Link></p>
        </div>
      </div>
    </div>
  );
}
