"use client";

import { useState, type FormEvent } from "react";
import type { CourseRecord } from "../db/schema";

export function ReviewForm({ courses }: { courses: CourseRecord[] }) {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("submitting");
    const form = new FormData(formElement);
    const selectedCourse = courses.find((course) => course.slug === form.get("courseSlug"));
    if (!selectedCourse) {
      setState("error");
      setMessage("교육과정을 선택해 주세요.");
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug: selectedCourse.slug,
          region: selectedCourse.region,
          author: String(form.get("author") ?? ""),
          role: String(form.get("role") ?? "수강생"),
          rating: Number(form.get("rating") ?? 5),
          title: String(form.get("title") ?? ""),
          content: String(form.get("content") ?? ""),
          website: String(form.get("website") ?? ""),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "후기를 등록하지 못했습니다.");
      setState("success");
      formElement.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <form className="review-form" onSubmit={submit}>
      <div className="review-form__heading">
        <span className="eyebrow">SHARE YOUR STORY</span>
        <h2>나의 GLab 경험을 들려주세요.</h2>
        <p>작성한 후기는 운영자 확인 후 공개됩니다.</p>
      </div>
      {state === "success" ? (
        <div className="inline-success" role="status">후기가 등록되었습니다. 소중한 경험을 나눠주셔서 감사합니다.</div>
      ) : (
        <>
          <div className="form-grid">
            <label className="form-grid__full">
              <span>수강 과정 <b>*</b></span>
              <select name="courseSlug" required defaultValue="">
                <option value="" disabled>과정을 선택하세요</option>
                {courses.map((course) => <option key={course.slug} value={course.slug}>{course.title}</option>)}
              </select>
            </label>
            <label><span>이름 <b>*</b></span><input name="author" required maxLength={40} /></label>
            <label><span>당시 역할</span><input name="role" maxLength={50} placeholder="예: 지역 소상공인" /></label>
            <label><span>만족도</span><select name="rating" defaultValue="5"><option value="5">★★★★★ 5점</option><option value="4">★★★★☆ 4점</option><option value="3">★★★☆☆ 3점</option></select></label>
            <label><span>후기 제목 <b>*</b></span><input name="title" required maxLength={100} /></label>
            <label className="form-grid__full"><span>후기 내용 <b>*</b></span><textarea name="content" rows={5} required maxLength={1500} /></label>
            <label className="form-honeypot" aria-hidden="true"><span>웹사이트</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>
          {state === "error" && <p className="form-error" role="alert">{message}</p>}
          <button className="button" disabled={state === "submitting"}>{state === "submitting" ? "등록 중…" : "후기 등록하기"}</button>
        </>
      )}
    </form>
  );
}
