"use client";

import { useState, type FormEvent } from "react";
import type { ApplicationRecord, CourseRecord, NoticeRecord, ReviewRecord } from "../db/schema";
import { courseStatusLabel, regionMap, type RegionSlug } from "../lib/content";

const applicationLabels: Record<string, string> = {
  received: "접수",
  reviewing: "검토중",
  accepted: "선발",
  rejected: "미선발",
  cancelled: "취소",
};

type AdminTab = "applications" | "courses" | "notices" | "reviews";

async function resultJson<T>(response: Response): Promise<T & { error?: string }> {
  return response.json() as Promise<T & { error?: string }>;
}

export function AdminDashboard({
  initialApplications,
  initialCourses,
  initialNotices,
  initialReviews,
}: {
  initialApplications: ApplicationRecord[];
  initialCourses: CourseRecord[];
  initialNotices: NoticeRecord[];
  initialReviews: ReviewRecord[];
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [courses, setCourses] = useState(initialCourses);
  const [notices, setNotices] = useState(initialNotices);
  const [reviews, setReviews] = useState(initialReviews);
  const [tab, setTab] = useState<AdminTab>("applications");
  const [editingCourse, setEditingCourse] = useState<CourseRecord | null>(null);
  const [editingNotice, setEditingNotice] = useState<NoticeRecord | null>(null);
  const [message, setMessage] = useState("");

  function showTab(nextTab: AdminTab) {
    setTab(nextTab);
    setMessage("");
  }

  async function updateApplication(id: number, status: string) {
    const response = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await resultJson<{ ok?: boolean }>(response);
    if (!response.ok) return setMessage(result.error ?? "신청 상태를 저장하지 못했습니다.");
    setApplications((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    setMessage("신청 상태를 저장했습니다.");
  }

  async function toggleCourse(course: CourseRecord) {
    const response = await fetch(`/api/admin/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !course.published }),
    });
    const result = await resultJson<{ course?: CourseRecord }>(response);
    if (!response.ok || !result.course) return setMessage(result.error ?? "과정 공개 상태를 변경하지 못했습니다.");
    setCourses((current) => current.map((item) => item.id === course.id ? result.course! : item));
    setMessage("과정 공개 상태를 변경했습니다.");
  }

  async function toggleNotice(notice: NoticeRecord) {
    const response = await fetch(`/api/admin/notices/${notice.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !notice.published }),
    });
    const result = await resultJson<{ notice?: NoticeRecord }>(response);
    if (!response.ok || !result.notice) return setMessage(result.error ?? "공지 공개 상태를 변경하지 못했습니다.");
    setNotices((current) => current.map((item) => item.id === notice.id ? result.notice! : item));
    setMessage("공지 공개 상태를 변경했습니다.");
  }

  async function toggleReview(review: ReviewRecord) {
    const response = await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !review.published }),
    });
    const result = await resultJson<{ ok?: boolean }>(response);
    if (!response.ok) return setMessage(result.error ?? "후기 공개 상태를 변경하지 못했습니다.");
    setReviews((current) => current.map((item) => item.id === review.id ? { ...item, published: !item.published } : item));
    setMessage("후기 공개 상태를 변경했습니다.");
  }

  async function saveCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const payload = Object.fromEntries(new FormData(formElement).entries());
    const response = await fetch(editingCourse ? `/api/admin/courses/${editingCourse.id}` : "/api/admin/courses", {
      method: editingCourse ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await resultJson<{ course?: CourseRecord }>(response);
    if (!response.ok || !result.course) return setMessage(result.error ?? "과정을 저장하지 못했습니다.");
    if (editingCourse) {
      setCourses((current) => current.map((item) => item.id === result.course!.id ? result.course! : item));
      setMessage("교육과정 변경사항을 저장했습니다.");
    } else {
      setCourses((current) => [result.course!, ...current]);
      setMessage("새 교육과정을 등록했습니다.");
    }
    setEditingCourse(null);
    formElement.reset();
  }

  async function saveNotice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const payload = Object.fromEntries(new FormData(formElement).entries());
    const response = await fetch(editingNotice ? `/api/admin/notices/${editingNotice.id}` : "/api/admin/notices", {
      method: editingNotice ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await resultJson<{ notice?: NoticeRecord }>(response);
    if (!response.ok || !result.notice) return setMessage(result.error ?? "공지를 저장하지 못했습니다.");
    if (editingNotice) {
      setNotices((current) => current.map((item) => item.id === result.notice!.id ? result.notice! : item));
      setMessage("공지 변경사항을 저장했습니다.");
    } else {
      setNotices((current) => [result.notice!, ...current]);
      setMessage("새 공지를 게시했습니다.");
    }
    setEditingNotice(null);
    formElement.reset();
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-stats">
        <div><span>전체 신청</span><strong>{applications.length}</strong><small>누적 접수</small></div>
        <div><span>공개 교육과정</span><strong>{courses.filter((course) => course.published).length}</strong><small>등록·수정 가능</small></div>
        <div><span>게시 중 공지</span><strong>{notices.filter((notice) => notice.published).length}</strong><small>등록·수정 가능</small></div>
        <div><span>검토할 후기</span><strong>{reviews.filter((review) => !review.published).length}</strong><small>승인 대기</small></div>
      </div>
      <div className="admin-tabs" role="tablist" aria-label="관리 영역">
        <button type="button" role="tab" aria-selected={tab === "applications"} className={tab === "applications" ? "active" : ""} onClick={() => showTab("applications")}>신청 관리</button>
        <button type="button" role="tab" aria-selected={tab === "courses"} className={tab === "courses" ? "active" : ""} onClick={() => showTab("courses")}>교육과정 관리</button>
        <button type="button" role="tab" aria-selected={tab === "notices"} className={tab === "notices" ? "active" : ""} onClick={() => showTab("notices")}>공지 관리</button>
        <button type="button" role="tab" aria-selected={tab === "reviews"} className={tab === "reviews" ? "active" : ""} onClick={() => showTab("reviews")}>후기 관리</button>
      </div>
      {message && <div className="admin-message" role="status">{message}</div>}

      {tab === "applications" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>신청자</th><th>과정</th><th>지역</th><th>연락처</th><th>신청일</th><th>상태</th></tr></thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td><strong>{application.name}</strong><small>{application.email}</small></td>
                  <td>{courses.find((course) => course.slug === application.courseSlug)?.title ?? application.courseSlug}</td>
                  <td>{regionMap[application.region as RegionSlug]?.koreanName ?? application.region}</td>
                  <td>{application.phone}</td>
                  <td>{application.createdAt.slice(0, 10)}</td>
                  <td><select value={application.status} onChange={(event) => updateApplication(application.id, event.target.value)} aria-label={`${application.name} 신청 상태`}>{Object.entries(applicationLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!applications.length && <div className="empty-state">아직 접수된 신청이 없습니다.</div>}
        </div>
      )}

      {tab === "courses" && (
        <div className="admin-course-layout">
          <form key={editingCourse?.id ?? "new-course"} className="admin-course-form" onSubmit={saveCourse}>
            <div className="admin-form-heading"><div><span>{editingCourse ? "EDIT PROGRAM" : "NEW PROGRAM"}</span><h2>{editingCourse ? "교육과정 수정" : "새 과정 등록"}</h2></div>{editingCourse && <button type="button" onClick={() => setEditingCourse(null)}>수정 취소</button>}</div>
            <label><span>과정명</span><input name="title" required defaultValue={editingCourse?.title} /></label>
            <div className="form-grid">
              <label><span>지역</span><select name="region" defaultValue={editingCourse?.region ?? "jeongseon"}><option value="jeongseon">정선</option><option value="donghae">동해</option><option value="inje">인제</option></select></label>
              <label><span>상태</span><select name="status" defaultValue={editingCourse?.status ?? "planned"}><option value="open">모집중</option><option value="planned">모집예정</option><option value="closed">마감</option></select></label>
              <label><span>분야</span><input name="category" required placeholder="AI 실무" defaultValue={editingCourse?.category} /></label>
              <label><span>운영 방식</span><input name="format" required placeholder="오프라인 + LMS" defaultValue={editingCourse?.format} /></label>
              <label><span>접수 시작</span><input type="date" name="applicationStart" required defaultValue={editingCourse?.applicationStart} /></label>
              <label><span>접수 마감</span><input type="date" name="applicationEnd" required defaultValue={editingCourse?.applicationEnd} /></label>
              <label><span>교육 시작</span><input type="date" name="courseStart" required defaultValue={editingCourse?.courseStart} /></label>
              <label><span>교육 종료</span><input type="date" name="courseEnd" required defaultValue={editingCourse?.courseEnd} /></label>
              <label><span>정원</span><input type="number" name="capacity" min="1" max="500" defaultValue={editingCourse?.capacity ?? 20} required /></label>
              <label><span>대상</span><input name="audience" required defaultValue={editingCourse?.audience} /></label>
              <label className="form-grid__full"><span>장소</span><input name="location" required defaultValue={editingCourse?.location} /></label>
              <label className="form-grid__full"><span>과정 소개</span><textarea name="summary" rows={5} required defaultValue={editingCourse?.summary} /></label>
            </div>
            <button className="button">{editingCourse ? "변경사항 저장" : "과정 등록하기"}</button>
          </form>
          <div className="admin-course-list">
            {courses.map((course) => (
              <article key={course.id}>
                <div><span>{regionMap[course.region as RegionSlug]?.koreanName} · {course.category}</span><h3>{course.title}</h3><p>{course.summary}</p></div>
                <div className="admin-item-actions"><span className={`status status--${course.status}`}>{courseStatusLabel(course.status)}</span><button type="button" onClick={() => { setEditingCourse(course); setMessage("수정할 과정 정보를 불러왔습니다."); }}>수정</button><button type="button" onClick={() => toggleCourse(course)}>{course.published ? "공개 중" : "비공개"}</button></div>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === "notices" && (
        <div className="admin-notice-layout">
          <form key={editingNotice?.id ?? "new-notice"} className="admin-notice-form" onSubmit={saveNotice}>
            <div className="admin-form-heading"><div><span>{editingNotice ? "EDIT NOTICE" : "NEW NOTICE"}</span><h2>{editingNotice ? "공지 수정" : "새 공지 게시"}</h2></div>{editingNotice && <button type="button" onClick={() => setEditingNotice(null)}>수정 취소</button>}</div>
            <label><span>분류</span><select name="category" defaultValue={editingNotice?.category ?? "공지"}><option value="공지">공지</option><option value="모집">모집</option><option value="운영">운영</option><option value="LMS">LMS</option></select></label>
            <label><span>제목</span><input name="title" required maxLength={140} defaultValue={editingNotice?.title} /></label>
            <label><span>내용</span><textarea name="content" rows={12} required minLength={10} maxLength={8000} defaultValue={editingNotice?.content} /></label>
            <button className="button">{editingNotice ? "변경사항 저장" : "공지 게시하기"}</button>
          </form>
          <div className="admin-notice-list">
            {notices.map((notice) => (
              <article key={notice.id}>
                <div><span>{notice.category} · {notice.createdAt.slice(0, 10)}</span><h3>{notice.title}</h3><p>{notice.content}</p></div>
                <div className="admin-item-actions"><span className={`admin-publish-state ${notice.published ? "is-public" : ""}`}>{notice.published ? "게시 중" : "비공개"}</span><button type="button" onClick={() => { setEditingNotice(notice); setMessage("수정할 공지를 불러왔습니다."); }}>수정</button><button type="button" onClick={() => toggleNotice(notice)}>{notice.published ? "비공개 전환" : "공개 전환"}</button></div>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === "reviews" && (
        <div className="admin-review-list">
          {reviews.map((review) => (
            <article key={review.id}>
              <div className="review-stars" aria-label={`${review.rating}점`}>{"★".repeat(review.rating)}</div>
              <h3>{review.title}</h3><p>{review.content}</p>
              <footer><span>{review.author} · {review.role}</span><button type="button" onClick={() => toggleReview(review)}>{review.published ? "공개 중" : "승인 대기"}</button></footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
