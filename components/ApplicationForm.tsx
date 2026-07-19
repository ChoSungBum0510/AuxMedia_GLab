"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type CourseSummary = { slug: string; title: string; region: string };

export function ApplicationForm({ course }: { course: CourseSummary }) {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("submitting");
    setMessage("");
    const form = new FormData(formElement);
    const payload = {
      courseSlug: course.slug,
      region: course.region,
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      motivation: String(form.get("motivation") ?? ""),
      website: String(form.get("website") ?? ""),
      consent: form.get("consent") === "on",
    };

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "신청을 접수하지 못했습니다.");
      setState("success");
      formElement.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "잠시 후 다시 시도해 주세요.");
    }
  }

  if (state === "success") {
    return (
      <div className="form-success" role="status">
        <span aria-hidden="true">✓</span>
        <h2>교육 신청이 접수되었습니다.</h2>
        <p>담당자가 내용을 확인한 뒤 입력하신 이메일 또는 연락처로 안내드리겠습니다.</p>
        <div>
          <Link className="button" href="/courses">다른 과정 보기</Link>
          <Link className="button button--ghost" href="/mypage">내 신청 확인</Link>
        </div>
      </div>
    );
  }

  return (
    <form className="application-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          <span>이름 <b>*</b></span>
          <input name="name" autoComplete="name" required maxLength={40} placeholder="신청자 이름" />
        </label>
        <label>
          <span>이메일 <b>*</b></span>
          <input name="email" type="email" autoComplete="email" required maxLength={120} placeholder="name@example.com" />
        </label>
        <label className="form-grid__full">
          <span>연락처 <b>*</b></span>
          <input name="phone" type="tel" autoComplete="tel" required maxLength={30} placeholder="010-0000-0000" />
        </label>
        <label className="form-grid__full">
          <span>참여 동기</span>
          <textarea name="motivation" rows={6} maxLength={1000} placeholder="이 교육을 신청한 이유와 기대하는 점을 알려주세요." />
          <small>최대 1,000자</small>
        </label>
        <label className="form-honeypot" aria-hidden="true">
          <span>웹사이트</span><input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent-field">
        <input name="consent" type="checkbox" required />
        <span>교육 신청과 안내를 위한 개인정보 수집·이용에 동의합니다. <b>(필수)</b></span>
      </label>
      {state === "error" && <p className="form-error" role="alert">{message}</p>}
      <button className="button button--wide" disabled={state === "submitting"}>
        {state === "submitting" ? "접수 중…" : "교육 신청 완료하기"}
      </button>
    </form>
  );
}
