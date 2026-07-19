import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BrandLogo } from "../../components/BrandLogo";
import { LoginForm } from "../../components/LoginForm";
import { getCurrentUser, safeReturnPath } from "../auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ returnTo?: string; mode?: string }> }) {
  const params = await searchParams;
  const returnTo = safeReturnPath(params.returnTo);
  const user = await getCurrentUser();
  if (user) redirect(returnTo);
  const initialMode = params.mode === "admin" ? "admin" : "learner";

  return (
    <section className="login-page">
      <div className="login-shell">
        <div className="login-brand">
          <BrandLogo className="official-brand--login" />
          <span className="eyebrow">ONE GLAB ACCOUNT</span>
          <h1>지역의 배움과<br />나의 학습을 연결합니다.</h1>
          <p>정선·동해·인제 교육 신청내역과 운영 정보를 하나의 안전한 로그인으로 확인하세요.</p>
        </div>
        <LoginForm initialMode={initialMode} returnTo={returnTo} />
      </div>
    </section>
  );
}

