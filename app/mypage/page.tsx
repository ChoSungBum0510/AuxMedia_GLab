import type { Metadata } from "next";
import Link from "next/link";
import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from "../chatgpt-auth";
import { listApplicationsForEmail, listCourses } from "../../db/repository";
import { LMS_URL, regionMap, type RegionSlug } from "../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "나의 학습" };

const statusLabels: Record<string, string> = { received: "접수 완료", reviewing: "검토 중", accepted: "선발 완료", rejected: "미선발", cancelled: "취소" };

export default async function MyPage() {
  const user = await getChatGPTUser();
  if (!user) return <section className="auth-gate"><div><span className="brand__word">G<span>:</span>Lab</span><h1>로그인하고<br />나의 학습을 이어가세요.</h1><p>신청내역, 선발 상태와 온라인 수강 정보를 확인할 수 있습니다.</p><Link className="button button--wide" href={chatGPTSignInPath("/mypage")}>ChatGPT 계정으로 로그인</Link><small>로그인은 안전한 플랫폼 인증 화면에서 진행됩니다.</small></div></section>;

  const [applications, courses] = await Promise.all([listApplicationsForEmail(user.email).catch(() => []), listCourses().catch(() => [])]);
  return (
    <section className="mypage"><div className="shell"><header className="mypage-header"><div><span className="eyebrow">MY LEARNING</span><h1>{user.displayName}님,<br />배움을 이어가세요.</h1><p>{user.email}</p></div><div><a className="button" href={LMS_URL} target="_blank" rel="noreferrer">통합 LMS 열기 ↗</a><Link href={chatGPTSignOutPath("/")} className="text-link">로그아웃</Link></div></header><div className="mypage-grid"><section><div className="section-mini-heading"><h2>나의 신청내역</h2><span>{applications.length}건</span></div>{applications.length ? <div className="my-application-list">{applications.map((application) => { const course = courses.find((item) => item.slug === application.courseSlug); const region = regionMap[application.region as RegionSlug]; return <article key={application.id}><div><span style={{ color: region?.color }}>{region?.koreanName ?? application.region} GLab</span><h3>{course?.title ?? application.courseSlug}</h3><p>{application.createdAt.slice(0, 10)} 신청</p></div><strong className={`application-status application-status--${application.status}`}>{statusLabels[application.status] ?? application.status}</strong></article>; })}</div> : <div className="empty-state"><strong>아직 신청한 교육이 없습니다.</strong><p>지역에서 열리는 새로운 교육을 찾아보세요.</p><Link href="/courses" className="button">교육과정 찾기</Link></div>}</section><aside><div className="lms-card"><span>LMS</span><h2>온라인 학습공간</h2><p>선발된 교육의 강의자료, 진도, 과제와 수료 정보를 확인합니다.</p><a href={LMS_URL} target="_blank" rel="noreferrer">학습하러 가기 →</a></div><div className="help-card"><strong>도움이 필요하신가요?</strong><p>교육 관련 문의는 지역 GLab 담당자에게 연락해 주세요.</p><Link href="/regions">지역 연락처 보기 →</Link></div></aside></div></div></section>
  );
}
