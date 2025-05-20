"use client";
import { useUser } from "@/context/AuthProvider";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ExamPage() {
  const { user } = useUser();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  const handleGiveExam = () => {
    if (isChecked) {
      const newWindow = window.open(
        "/exam/start",
        "_blank",
        "width=1200,height=800,top=100,left=100,scrollbars=yes"
      );

      if (newWindow) {
        newWindow.opener = null;
        newWindow.focus();
        newWindow.document.documentElement.requestFullscreen();
      }
    } else {
      toast.error("Please accept the exam rules before proceeding.");
    }
  };

  return (
    <>
      {user?.currentlyAllowed ? (
        <div className="bg-base-200 p-6 rounded-lg shadow-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4 uppercase text-primary text-center">
            You are allowed to give the exam!
          </h2>

          {/* Displaying Exam Rules */}
          <div className="text-left mb-4 mx-auto max-w-3xl">
            <h3 className="text-lg font-semibold mb-4">Exam Rules:</h3>
            <ul className="list-disc pl-6 mt-2 text-base-content/60 space-y-2">
              <li>
                Do not switch tabs or minimize the browser during the exam.
              </li>
              <li>
                If you refresh the page, your exam will be automatically
                submitted.
              </li>
              <li>
                Ensure you have a stable internet connection throughout the
                exam.
              </li>
              <li>
                Once the exam starts, you cannot leave the exam page until it is
                completed.
              </li>
              <li>Attempt all the questions within the allotted time.</li>
              <li>
                You are not allowed to use external resources, such as books,
                websites, or notes, unless otherwise specified.
              </li>
              <li>
                Cheating, including any form of collaboration with others, will
                result in immediate disqualification from the exam.
              </li>
              <li>
                You must remain visible on the camera (if required) for the
                entire duration of the exam.
              </li>
              <li>
                Keep your microphone on (if required) and ensure there is no
                noise or disturbance in your environment.
              </li>
              <li>
                The use of multiple devices to access the exam is strictly
                prohibited.
              </li>
              <li>
                Make sure you are seated in a quiet, well-lit environment with
                no distractions.
              </li>
              <li>
                If you experience any technical difficulties during the exam,
                notify the administrator immediately.
              </li>
              <li>
                Do not communicate with anyone (other than the exam proctor or
                admin) during the exam unless otherwise directed.
              </li>
              <li>
                Ensure that your camera and microphone (if required) are
                functioning before starting the exam.
              </li>
              <li>
                Any attempt to hack, manipulate, or bypass the exam software or
                systems will result in permanent disqualification from the
                platform.
              </li>
              <li>
                You are required to finish the exam within the given time limit.
                Any delay beyond the allowed time will result in automatic
                submission of your exam.
              </li>
              <li>
                Any violation of these rules will be taken seriously, and
                disciplinary actions may be taken, including invalidation of
                your exam and account suspension.
              </li>
            </ul>
          </div>

          {/* Checkbox to accept terms */}
          <div className="flex items-center justify-center mb-4">
            <input
              type="checkbox"
              id="acceptRules"
              className="checkbox checkbox-primary"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <label
              htmlFor="acceptRules"
              className="ml-2 text-sm text-base-content/60"
            >
              I have read and accept the exam rules.
            </label>
          </div>

          {/* Give Exam Button */}
          <button
            onClick={handleGiveExam}
            className={`btn btn-primary ${
              isChecked ? "" : "btn-disabled"
            } w-full mt-4`}
            disabled={!isChecked}
          >
            Give Exam
          </button>
        </div>
      ) : (
        <div className="bg-base-200 p-6 rounded-lg shadow-md mx-auto min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center">
          <h2 className="text-5xl font-semibold mb-4 text-error">
            You are not allowed to give the exam.
          </h2>
          <p className="text-xl text-base-content/60">
            Please contact the admin if you believe this is a mistake.
          </p>
        </div>
      )}
    </>
  );
}
