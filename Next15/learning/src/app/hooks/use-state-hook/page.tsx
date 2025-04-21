"use client";
import { useState, FormEvent, ChangeEvent } from "react";

export default function Page() {
  const [answer, setAnswer] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<"typing" | "submitting" | "success">(
    "typing"
  );

  if (status === "success") {
    return <h1>That&apos;s right!</h1>;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await submitForm(answer);
      setStatus("success");
    } catch (err) {
      setStatus("typing");
      setError(err as Error);
    }
  }

  function handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setAnswer(e.target.value);
  }

  function submitForm(answer: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const shouldError = answer.toLowerCase() !== "lima";
        if (shouldError) {
          reject(new Error("Good guess but a wrong answer. Try again!"));
        } else {
          resolve();
        }
      }, 1500);
    });
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === "submitting"}
          className="w-full p-2 border rounded-md"
        />
        <br />
        <button
          disabled={answer.length === 0 || status === "submitting"}
          className="bg-cyan-950 text-white px-4 py-1 rounded-md"
        >
          Submit
        </button>
        {error !== null && (
          <p className="Error text-red-700">{error.message}</p>
        )}
      </form>
    </>
  );
}
