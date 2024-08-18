'use client'
import { IconBadge } from '@/components/icon-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Tag } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { db } from '@/lib/db';

type Props = {
    chapterId: string;
    chapterTitle: string;
};

const CouponsGenerateButton = ({chapterId,chapterTitle}: Props) => {
  const [couponCount, setCouponCount] = useState<number | ''>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCount(e.target.value ? parseInt(e.target.value) : '');
  };

  const handleButtonClick = async () => {
    if (couponCount) {
      try {
        const response = await axios.post(`/api/coupon/chapters/${chapterId}/generate`, { numOfCoupons: couponCount });
        toast.success("تم انشاء الكوبونات بنجاح")
      } catch (error) {
        console.error('Error creating coupons:', error);
        toast.error("حدث خطأ")
      }
    }
  };



  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-x-4 items-center">
        <IconBadge icon={Tag} />
        <h1 className="font-semibold text-lg">انشاء كوبونات ({chapterTitle})</h1>
      </div>
      <div className="flex gap-x-2 max-w-[300px]">
        <Input
          placeholder="كم كوبون تريد الانشاء لهذة الحصة؟"
          type="number"
          value={couponCount}
          onChange={handleInputChange}
        />
        <Button onClick={handleButtonClick}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CouponsGenerateButton;
