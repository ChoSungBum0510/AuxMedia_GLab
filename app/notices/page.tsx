import type { Metadata } from "next";
import { NoticeBoard } from "../../components/NoticeBoard";
import { listPublishedNotices } from "../../db/repository";
import { fallbackNotices } from "../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "알림마당", description: "G-Lab 교육 모집, 운영 성과와 행사 소식을 확인하세요." };

export default async function NoticesPage() {
  const notices = await listPublishedNotices().catch(() => fallbackNotices);

  return (
    <>
      <section className="page-hero page-hero--notices">
        <div className="shell">
          <span className="eyebrow eyebrow--light">GLAB NEWS</span>
          <h1>필요한 교육 소식을<br />한곳에서 확인하세요.</h1>
          <p>교육 모집과 운영 일정, 공식 자료로 확인한 지역별 성과와 G-Lab 운영 소식을 안내합니다.</p>
        </div>
      </section>
      <section className="section">
        <div className="shell"><NoticeBoard notices={notices} /></div>
      </section>
    </>
  );
}
