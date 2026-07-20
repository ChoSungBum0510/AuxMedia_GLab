import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedNotice } from "../../../db/repository";
import { fallbackNotices } from "../../../lib/content";

export const dynamic = "force-dynamic";

async function noticeFor(id: number) {
  return getPublishedNotice(id).catch(() => fallbackNotices.find((notice) => notice.id === id) ?? null);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const notice = await noticeFor(Number(id));
  return notice ? { title: notice.title, description: notice.content.slice(0, 150) } : { title: "공지사항" };
}

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) notFound();
  const notice = await noticeFor(numericId);
  if (!notice) notFound();

  const date = notice.createdAt.slice(0, 10).replaceAll("-", ".");
  return (
    <section className="notice-detail-page">
      <div className="shell notice-detail">
        <Link href="/notices" className="text-link">← 알림마당 목록</Link>
        <header>
          <span>{notice.category}</span>
          <h1>{notice.title}</h1>
          <time dateTime={notice.createdAt.slice(0, 10)}>{date}</time>
        </header>
        <article>{notice.content}</article>
        <footer>
          <Link href="/notices" className="button button--ghost">목록으로 돌아가기</Link>
          <Link href="/courses" className="button">교육과정 확인하기 →</Link>
        </footer>
      </div>
    </section>
  );
}
