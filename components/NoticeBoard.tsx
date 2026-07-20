"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { NoticeRecord } from "../db/schema";

const categories = ["전체", "모집", "운영", "LMS"] as const;

function noticeDate(value: string) {
  return value.slice(0, 10).replaceAll("-", ".");
}

export function NoticeBoard({ notices }: { notices: NoticeRecord[] }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("전체");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("ko-KR");
    return notices.filter((notice) => {
      const categoryMatches = category === "전체" || notice.category === category;
      const queryMatches = !keyword || `${notice.title} ${notice.content}`.toLocaleLowerCase("ko-KR").includes(keyword);
      return categoryMatches && queryMatches;
    });
  }, [category, notices, query]);

  return (
    <div className="notice-page-layout">
      <aside>
        <span className="eyebrow">NOTICE BOARD</span>
        <h2>알림마당</h2>
        <nav aria-label="공지 분류">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? "active" : ""}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>
      <div className="notice-board">
        <div className="notice-board__head">
          <strong>{category === "전체" ? "전체 공지" : `${category} 안내`} <small>{filtered.length}건</small></strong>
          <label>
            <span className="sr-only">공지 검색</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="검색어를 입력하세요" />
            <b aria-hidden="true">⌕</b>
          </label>
        </div>
        <div className="notice-board__list" aria-live="polite">
          {filtered.map((notice, index) => (
            <Link href={`/notices/${notice.id}`} key={notice.id} className="notice-board__row">
              <span className="notice-number">{String(filtered.length - index).padStart(2, "0")}</span>
              <div><span>{notice.category}</span><h3>{notice.title}</h3></div>
              <time dateTime={notice.createdAt.slice(0, 10)}>{noticeDate(notice.createdAt)}</time>
              <b aria-hidden="true">→</b>
            </Link>
          ))}
          {!filtered.length && (
            <div className="notice-board__empty">
              <strong>조건에 맞는 공지가 없습니다.</strong>
              <p>다른 분류나 검색어로 다시 확인해 주세요.</p>
              <button type="button" onClick={() => { setCategory("전체"); setQuery(""); }}>전체 공지 보기</button>
            </div>
          )}
        </div>
        <div className="notice-help">
          <strong>찾는 안내가 없나요?</strong>
          <p>지역별 교육 문의는 각 G-Lab 상세 페이지에서 담당 연락처를 확인해 주세요.</p>
          <Link href="/regions">지역 G-Lab 보기 →</Link>
        </div>
      </div>
    </div>
  );
}
