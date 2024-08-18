"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@nextui-org/react";
import { useAuth } from "@clerk/nextjs";
import MarksShow from "./_components/MarksShow";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Props = {
  params: { courseId: string; chapterId: string };
};

const ExamPage: React.FC<Props> = ({ params }) => {
  const [examData, setExamData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submissionStatus, setSubmissionStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [resultData, setResultData] = useState<any | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await axios.get(
          `/api/courses/${params.courseId}/chapters/${params.chapterId}/exam`
        );
        if (!response.data) {
          setError("Exam not found.");
        } else {
          setExamData(response.data);
        }
      } catch (error) {
        console.error("Error fetching exam data:", error);
        setError("Error loading exam.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [params.chapterId, params.courseId]);

  const handleNextStep = () => {
    if (currentStep < (examData?.exam?.questions.length ?? 0) - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const handleAnswerChange = (questionId: string, choiceId: string) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: choiceId }));
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    setSubmissionStatus("pending");
    try {
      const formattedChoices = Object.entries(answers).map(
        ([questionId, choiceId]) => ({
          questionId,
          choiceId,
        })
      );

      const response = await axios.post(
        `/api/courses/${params.courseId}/chapters/${params.chapterId}/exam/${examData.exam.id}/result`,
        {
          choices: formattedChoices,
        }
      );

      console.log("Submission successful:", response.data);
      setSubmissionStatus("success");
      setResultData(response.data); // Save the result data
    } catch (error) {
      console.error("Error submitting answers:", error);
      setSubmissionStatus("error");
      setError("Error submitting answers.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress
          value={50} // Example value to show progress
          size="lg"
          color="primary"
          showValueLabel={true}
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }
  if ((submissionStatus === "success" || examData?.existingResult) && !examData?.exam.chapter.isLocked) {
    return (
      <div className="flex items-start pt-6 justify-center min-h-screen bg-gradient-to-r from-green-200 via-blue-200 to-purple-200">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center flex flex-col items-center">
          <div className="flex items-center justify-center mb-4">
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">محلول</h2>
          <p className="text-gray-600 mb-4">تم إرسال نتائج امتحانك بنجاح</p>

          <div className="w-full flex flex-col items-center justify-center">
            <div className="p-4 rounded-lg ">
              <pre className="text-3xl font-bold text-blue-600">
                {examData.existingResult ? (
                  <MarksShow
                    marks={Math.ceil(
                      (examData?.existingResult.marks /
                        examData?.exam.questions.length) *
                        100
                    )}
                  />
                ) : (
                  <MarksShow
                    marks={Math.ceil(
                      (resultData.marks / examData?.exam.questions.length) * 100
                    )}
                  />
                )}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!examData) {
    return <div className="text-center mt-4">No exam available.</div>;
  }

  const question = examData.exam.questions[currentStep];
  const isLastStep = currentStep === examData.exam.questions.length - 1;

  return (
    <>
        {examData?.exam.chapter.isLocked == false ? (
          <>
      <div className="flex px-6 mx-auto p-4">
      {/* Sidebar */}
      <div className="w-1/4 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">الاسئلة</h2>
        <ul className="space-y-2">
          {examData.exam.questions.map((question: any, index: number) => (
            <li key={index}>
              <button
                onClick={() => handleStepChange(index)}
                className={`w-full py-2 px-4 rounded-lg text-center ${
                  answers[question.id]
                    ? "bg-blue-500 text-white"
                    : currentStep === index
                    ? "bg-gray-400 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Exam Content */}
      <div className="w-3/4 pl-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          امتحان {examData.title}
        </h1>
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">
            {currentStep + 1}. {question.text}
          </h3>
          <ul className="grid sm:grid-cols-2 grid-cols-1 gap-4">
            {question.choices.map((choice: any) => (
              <li key={choice.id}>
                <label
                  className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-150 ${
                    answers[question.id] === choice.id
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={choice.id}
                    checked={answers[question.id] === choice.id}
                    onChange={() => handleAnswerChange(question.id, choice.id)}
                    className="hidden"
                  />
                  {choice.text}
                </label>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <button
                onClick={handlePrevStep}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-150"
              >
                السابق
              </button>
            )}
            <button
              onClick={isLastStep ? handleSubmit : handleNextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
            >
              {isLastStep ? "تسليم" : "التالي"}
            </button>
          </div>
        </div>
      </div>
    </div>
      </>
    ):(<>    <div className="flex items-center justify-center min-h-screen bg-red-100">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
      <h2 className="text-2xl font-semibold text-red-600 mb-4">هذا الفصل مغلق</h2>
      <p className="text-gray-700 mb-6">عليك شراء ومشاهدة الفصل قبل أن تتمكن من الوصول إلى الامتحان.</p>
      <Link href="/path-to-purchase-page">
        <a className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-150">
          شراء الفصل
        </a>
      </Link>
    </div>
  </div></>)}
    </>



  );
};

export default ExamPage;
