'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Plus, Save, Trash, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Choice {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  imageUrl?: string;
  choices: Choice[];
}

interface Exam {
  id: string;
  questions: Question[];
}

const EditExamPage = ({
  params,
}: {
  params: { courseId: string; chapterId: string; examId: string; };
}) => {
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([
    { text: '', choices: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }] }
  ]);

  useEffect(() => {
    if (params.examId) {
      // جلب بيانات الامتحان
      axios.get(`/api/courses/${params.courseId}/chapters/${params.chapterId}/exam/${params.examId}`)
        .then(response => {
          const examData = response.data;
          console.log(examData.exam)
          if (examData.exam && Array.isArray(examData.exam.questions)) {
            setExam(examData);
            setQuestions(examData.exam.questions.map((question: any) => ({
              ...question,
              choices: question.choices ? question.choices.map((choice: any) => ({
                text: choice.text,
                isCorrect: choice.isCorrect
              })) : []
            })));
          } else {
            console.error('بيانات الأسئلة غير متوفرة أو ليست مصفوفة');
            setQuestions([{ text: '', choices: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }] }]);
          }
        })
        .catch(error => {
          console.error('خطأ في جلب بيانات الامتحان:', error);
          alert('حدث خطأ في جلب بيانات الامتحان');
        });
    }
  }, [params.examId]);

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleChoiceChange = (qIndex: number, cIndex: number, field: keyof Choice, value: any) => {
    const newQuestions = [...questions];
    const updatedChoices = newQuestions[qIndex].choices.map((choice, index) => 
      index === cIndex ? { ...choice, [field]: value } : choice
    );
    newQuestions[qIndex].choices = updatedChoices;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', choices: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }] }]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!params.examId || !params.chapterId || !params.courseId) {
      alert('توجد معلمات مفقودة');
      return;
    }
  
    // Validate the format of questions and choices
    const formattedQuestions = questions.map((question) => ({
      text: question.text.trim(),
      choices: question.choices.map((choice) => ({
        text: choice.text.trim(),
        isCorrect: choice.isCorrect
      }))
    }));
  
    try {
      const response = await axios.post(`/api/courses/${params.courseId}/chapters/${params.chapterId}/exam/${params.examId}`, {
        examId: params.examId,
        questions: formattedQuestions
      });
      if (response.status === 200) {
        alert('تم تحديث الامتحان بنجاح');
      } else {
        alert('خطأ في تحديث الامتحان');
      }
    } catch (error) {
      console.error('خطأ في تحديث الامتحان:', error);
      alert('خطأ في تحديث الامتحان');
    }
  };
  

  return (
    <div className="p-6 my-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">تعديل الامتحان</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.length === 0 ? (
          <p className="text-gray-500">لا يوجد أسئلة لعرضها. يمكنك إضافة أسئلة جديدة.</p>
        ) : (
          questions.map((question, qIndex) => (
            <div key={qIndex} className="border p-4 rounded-lg mb-4 bg-gray-50">
              <div className='w-full flex justify-between items-center mb-4'>

              <h2 className="text-xl font-semibold mb-2">سؤال {qIndex + 1}</h2>
              <Button
                onClick={() => handleRemoveQuestion(qIndex)}
                className="bg-gray-200 text-gray-800 p-2 rounded-md hover:bg-red-600 hover:text-white transition-colors"
              >
                <Trash className='w-5 h-5' />
              </Button>
              </div>
              <input
                type="text"
                placeholder="نص السؤال"
                value={question.text}
                onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                className="w-full p-2 border rounded-md mb-4"
              />
              {question.choices.map((choice, cIndex) => (
                <div key={cIndex} className="flex items-center mb-2 gap-4">
                  <input
                    type="text"
                    placeholder={`اختيار ${cIndex + 1} نص`}
                    value={choice.text}
                    onChange={(e) => handleChoiceChange(qIndex, cIndex, 'text', e.target.value)}
                    className="w-3/4 p-2 border rounded-md mr-2"
                  />
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={choice.isCorrect}
                      onChange={() => {
                        const updatedChoices = question.choices.map((c, index) => ({
                          ...c,
                          isCorrect: index === cIndex
                        }));
                        handleChoiceChange(qIndex, cIndex, 'isCorrect', true);
                        setQuestions(questions.map((q, index) => index === qIndex ? { ...q, choices: updatedChoices } : q));
                      }}
                      className="ml-1"
                    />
                    صحيح
                  </label>
                </div>
              ))}
            </div>
          ))
        )}
        <div className='flex gap-x-2'>
        <Button
                onClick={handleAddQuestion}
                className="p-2 rounded-md"
              >
                <Plus className='w-4 h-4' /> سؤال جديد
              </Button>
        <button
          type="submit"
          className="flex items-center gap-x-2 bg-emerald-600 text-white p-2 rounded-md"
        >
          <Save className='w-4 h-4' /> حفظ الامتحان 
        </button>
        </div>

      </form>
    </div>
  );
};

export default EditExamPage;
