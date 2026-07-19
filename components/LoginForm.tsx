"use client";

import { useState, type FormEvent } from "react";

type LoginMode = "learner" | "admin";

export function LoginForm({ initialMode, returnTo }: { initialMode: LoginMode; returnTo: string }) {
  const [mode, setMode] = useState<LoginMode>(initialMode);
  const [state, setState] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = mode === "admin"
      ? { email: String(form.get("email") ?? ""), password: String(form.get("password") ?? "") }
      : { email: String(form.get("email") ?? ""), phone: String(form.get("phone") ?? "") };

    try {
      const response = await fetch(`/api/auth/login/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "로그인하지 못했습니다.");
      window.location.assign(returnTo);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <div className="login-panel">
      <div className="login-tabs" role="tablist" aria-label="로그인 유형">
        <button type="button" role="tab" aria-selected={mode === "learner"} className={mode === "learner" ? "active" : ""} onClick={() => { setMode("learner"); setMessage(""); }}>수강생</button>
        <button type="button" role="tab" aria-selected={mode === "admin"} className={mode === "admin" ? "active" : ""} onClick={() => { setMode("admin"); setMessage(""); }}>관리자</button>
      </div>
      <form className="login-form" onSubmit={submit}>
        <div className="login-form__intro">
          <strong>{mode === "admin" ? "운영 관리자 로그인" : "나의 신청내역 확인"}</strong>
          <p>{mode === "admin" ? "등록된 관리자 이메일과 비밀번호를 입력하세요." : "교육 신청 시 입력한 이메일과 연락처를 입력하세요."}</p>
        </div>
        <label>
          <span>이메일</span>
          <input name="email" type="email" autoComplete="email" required maxLength={120} placeholder="name@example.com" />
        </label>
        {mode === "admin" ? (
          <label>
            <span>비밀번호</span>
            <input name="password" type="password" autoComplete="current-password" required minLength={12} maxLength={200} />
          </label>
        ) : (
          <label>
            <span>연락처</span>
            <input name="phone" type="tel" autoComplete="tel" inputMode="tel" required maxLength={30} placeholder="010-0000-0000" />
          </label>
        )}
        {state === "error" && <p className="form-error" role="alert">{message}</p>}
        <button className="button button--wide" disabled={state === "submitting"}>
          {state === "submitting" ? "확인 중…" : "로그인"}
        </button>
      </form>
    </div>
  );
}

