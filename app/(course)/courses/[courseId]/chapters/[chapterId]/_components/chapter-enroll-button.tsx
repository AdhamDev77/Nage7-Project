"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, CreditCard, Tag } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useRouter } from "next/navigation";

type Props = {
  chapterId: string;
  price: number;
  setIsLocked: (isLocked: boolean) => void; // Updates the lock state
  fetchChapterData: () => void; // Function to fetch chapter data
};



const ChapterEnrollButton: React.FC<Props> = ({ chapterId, price, setIsLocked, fetchChapterData }) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isOpen, setIsOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [coupon, setCoupon] = useState("");
  const cardRef = useRef<HTMLDivElement>(null); // Set the correct type for the ref

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      setDisabled(true);
      const response = await axios.post(`/api/coupon/chapters/${chapterId}/use`, { code: coupon });
      console.log(response.data);
      toast.success("تم الحصول علي الحصة");
      handleToggle();
      confetti.onOpen();
      setIsLocked(false); // Update the isLocked state
      fetchChapterData(); // Fetch the updated chapter data
    } catch (error) {
      console.error("Error submitting coupon:", error);
      toast.error("كود الكوبون خطأ أو غير صالح");
    } finally {
      setDisabled(false);
    }
  };

  return (
    <>
      <Button size="sm" className="w-full md:w-auto" onClick={handleToggle}>
        أحصل علي الحصة
      </Button>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-900/70">
          <div ref={cardRef}>
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>شاهد الحصة</CardTitle>
                <CardDescription>أختر طريقة للحصول علي الحصة</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="pt-2">
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5 gap-y-2">
                      <div className="flex gap-x-2 items-center">
                        <CreditCard className="w-5 h-5" />
                        <Label className="text-md" htmlFor="name">دفع أونلاين</Label>
                      </div>
                      <div className="flex items-center justify-center w-full h-20 rounded-lg bg-gray-100 text-2xl text-gray-500">
                        قريبا ...
                      </div>
                    </div>
                  </div>
                </form>
                <Separator className="my-4" />
                <form>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5 gap-y-2">
                      <div className="flex gap-x-2 items-center">
                        <Tag className="w-5 h-5" />
                        <Label className="text-md" htmlFor="coupon">كوبون</Label>
                      </div>
                      <h1 className="text-sm">هل لديك كوبون خاص بالحصة؟</h1>
                      <Input 
                        id="coupon" 
                        placeholder="مثال : D4ghZx46J9" 
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button disabled={disabled} className="flex gap-x-2" variant="outline" onClick={handleToggle}>
                  <ArrowRight className="w-4 h-4" /> رجوع
                </Button>
                <Button disabled={disabled} onClick={handleSubmit}>أحصل</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default ChapterEnrollButton;
