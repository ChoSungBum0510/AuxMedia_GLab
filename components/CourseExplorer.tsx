"use client";

import { useMemo, useState } from "react";
import type { CourseRecord } from "../db/schema";
import { CourseCard } from "./CourseCard";

export function CourseExplorer({ courses, initialRegion = "all" }: { courses: CourseRecord[]; initialRegion?: string }) {
  const [region, setRegion] = useState(initialRegion);
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesRegion = region === "all" || course.region === region;
      const matchesStatus = status === "all" || course.status === status;
      const matchesQuery = !needle || `${course.title} ${course.summary} ${course.category}`.toLowerCase().includes(needle);
      return matchesRegion && matchesStatus && matchesQuery;
    });
  }, [courses, query, region, status]);

  return (
    <div className="course-explorer">
      <div className="filter-bar" aria-label="교육과정 검색 필터">
        <label className="search-field">
          <span className="sr-only">교육과정 검색</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="교육과정 또는 관심 분야를 검색하세요" />
          <b aria-hidden="true">⌕</b>
        </label>
        <label>
          <span className="sr-only">지역 선택</span>
          <select value={region} onChange={(event) => setRegion(event.target.value)}>
            <option value="all">전체 지역</option>
            <option value="jeongseon">정선</option>
            <option value="donghae">동해</option>
            <option value="inje">인제</option>
          </select>
        </label>
        <label>
          <span className="sr-only">모집 상태 선택</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">전체 상태</option>
            <option value="open">모집중</option>
            <option value="planned">모집예정</option>
            <option value="closed">모집마감</option>
          </select>
        </label>
      </div>
      <div className="result-count"><strong>{filtered.length}</strong>개의 교육과정</div>
      {filtered.length ? (
        <div className="course-grid">
          {filtered.map((course) => <CourseCard key={course.slug} course={course} />)}
        </div>
      ) : (
        <div className="empty-state"><strong>조건에 맞는 과정이 없습니다.</strong><p>지역이나 모집 상태를 바꿔 다시 찾아보세요.</p></div>
      )}
    </div>
  );
}
