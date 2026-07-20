import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { AdminDashboard } from "../../components/AdminDashboard";
import { getCurrentUser, signInPath } from "../auth";
import { getDb } from "../../db";
import { ensureDatabase, listAllApplications, listAllNotices, listCourses } from "../../db/repository";
import { reviews } from "../../db/schema";
import { isAdminEmail } from "../../lib/auth";
import { BrandLogo } from "../../components/BrandLogo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "관리자" };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) return <section className="auth-gate auth-gate--admin"><div><BrandLogo className="official-brand--auth" /><h1>담당자 로그인</h1><p>공지, 교육과정, 신청자와 수강후기를 담당자 권한으로 관리합니다.</p><Link className="button button--wide" href={signInPath("/admin", "admin")}>담당자 계정으로 로그인</Link></div></section>;
  if (user.role !== "admin" || !isAdminEmail(user.email)) return <section className="auth-gate auth-gate--admin"><div><span className="eyebrow">ACCESS DENIED</span><h1>관리자 권한이 없습니다.</h1><p>사이트 소유자에게 관리자 계정 등록을 요청해 주세요.</p><Link href="/" className="button">홈으로 돌아가기</Link></div></section>;

  await ensureDatabase();
  const [applications, courses, noticeRows, reviewRows] = await Promise.all([listAllApplications(), listCourses({ includeHidden: true }), listAllNotices(), getDb().select().from(reviews).orderBy(desc(reviews.createdAt)).limit(200)]);
  return <section className="admin-page"><div className="shell"><header className="admin-header"><div><span className="eyebrow">GLAB CONTROL CENTER</span><h1>담당자 운영 대시보드</h1><p>공지 게시, 교육과정 편집, 신청자와 수강후기 승인을 담당자 권한으로 관리합니다.</p></div><div><span>담당자 계정</span><strong>{user.displayName}</strong><small>{user.email}</small></div></header><AdminDashboard initialApplications={applications} initialCourses={courses} initialNotices={noticeRows} initialReviews={reviewRows} /></div></section>;
}
