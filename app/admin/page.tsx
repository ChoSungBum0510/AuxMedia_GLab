import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { AdminDashboard } from "../../components/AdminDashboard";
import { chatGPTSignInPath, getChatGPTUser } from "../chatgpt-auth";
import { getDb } from "../../db";
import { ensureDatabase, listAllApplications, listCourses } from "../../db/repository";
import { reviews } from "../../db/schema";
import { isAdminEmail } from "../../lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "관리자" };

export default async function AdminPage() {
  const user = await getChatGPTUser();
  if (!user) return <section className="auth-gate auth-gate--admin"><div><span className="brand__word">G<span>:</span>Lab</span><h1>관리자 로그인</h1><p>교육과정, 신청자와 수강후기를 통합 관리합니다.</p><Link className="button button--wide" href={chatGPTSignInPath("/admin")}>관리자 계정으로 로그인</Link></div></section>;
  if (!isAdminEmail(user.email)) return <section className="auth-gate auth-gate--admin"><div><span className="eyebrow">ACCESS DENIED</span><h1>관리자 권한이 없습니다.</h1><p>사이트 소유자에게 관리자 계정 등록을 요청해 주세요.</p><Link href="/" className="button">홈으로 돌아가기</Link></div></section>;

  await ensureDatabase();
  const [applications, courses, reviewRows] = await Promise.all([listAllApplications(), listCourses({ includeHidden: true }), getDb().select().from(reviews).orderBy(desc(reviews.createdAt)).limit(200)]);
  return <section className="admin-page"><div className="shell"><header className="admin-header"><div><span className="eyebrow">GLAB CONTROL CENTER</span><h1>통합 운영 대시보드</h1><p>정선·동해·인제의 교육과정과 신청 현황을 한곳에서 관리합니다.</p></div><div><span>관리자</span><strong>{user.displayName}</strong><small>{user.email}</small></div></header><AdminDashboard initialApplications={applications} initialCourses={courses} initialReviews={reviewRows} /></div></section>;
}
