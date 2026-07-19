"use client";

import { useState, type FormEvent } from "react";
import type { ApplicationRecord, CourseRecord, ReviewRecord } from "../db/schema";
import { courseStatusLabel, regionMap, type RegionSlug } from "../lib/content";

const applicationLabels: Record<string, string> = {
  received: "접수",
  reviewing: "검토중",
  accepted: "선발",
  rejected: "미선발",
  cancelled: "취소",
};

export function AdminDashboard({
  initialApplications,
  initialCourses,
  initialReviews,
}: {
  initialApplications: ApplicationRecord[];
  initialCourses: CourseRecord[];
  initialReviews: ReviewRecord[];
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [courses, setCourses] = useState(initialCourses);
  const [reviews, setReviews] = useState(initialReviews);
  const [tab, setTab] = useState<"applications" | "courses" | "reviews">("applications");
  const [message, setMessage] = useState("");

  async function updateApplication(id: number, status: string) {
    const response = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      setApplications((current) => current.map((item) => item.id === id ? { ...item, status } : item));
      setMessage("신청 상태를 저장했습니다.");
    }
  }

  async function toggleCourse(course: CourseRecord) {
    const response = await fetch(`/api/admin/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !course.published }),
    });
    if (response.ok) {
      setCourses((current) => current.map((item) => item.id === course.id ? { ...item, published: !item.published } : item));
      setMessage("과정 공개 상태를 변경했습니다.");
    }
  }

  async function toggleReview(review: ReviewRecord) {
    const response = await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !review.published }),
    });
    if (response.ok) {
      setReviews((current) => current.map((item) => item.id === review.id ? { ...item, published: !item.published } : item));
      setMessage("후기 공개 상태를 변경했습니다.");
    }
  }

  async function addCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());
    const response = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as { course?: CourseRecord; error?: string };
    if (response.ok && result.course) {
      setCourses((current) => [result.course!, ...current]);
      formElement.reset();
      setMessage("새 교육과정을 등록했습니다.");
    } else {
      setMessage(result.error ?? "과정을 등록하지 못했습니다.");
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-stats">
        <div><span>전체 신청</span><strong>{applications.length}</strong><small>누적 접수</small></div>
        <div><span>모집 중 과정</span><strong>{courses.filter((course) => course.status === "open" && course.published).length}</strong><small>현재 공개</small></div>
        <div><span>검토할 후기</span><strong>{reviews.filter((review) => !review.published).length}</strong><small>승인 대기</small></div>
        <div><span>운영 지역</span><strong>3</strong><small>정선 · 동해 · 인제</small></div>
      </div>
      <div className="admin-tabs" role="tablist" aria-label="관리 영역">
        <button className={tab === "applications" ? "active" : ""} onClick={() => setTab("applications")}>신청 관리</button>
        <button className={tab === "courses" ? "active" : ""} onClick={() => setTab("courses")}>과정 관리</button>
        <button className={tab === "reviews" ? "active" : ""} onClick={() => setTab("reviews")}>후기 관리</button>
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
                  <td>
                    <select value={application.status} onChange={(event) => updateApplication(application.id, event.target.value)} aria-label={`${application.name} 신청 상태`}>
                      {Object.entries(applicationLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!applications.length && <div className="empty-state">아직 접수된 신청이 없습니다.</div>}
        </div>
      )}
      {tab === "courses" && (
        <div className="admin-course-layout">
          <form className="admin-course-form" onSubmit={addCourse}>
            <h2>새 과정 등록</h2>
            <label><span>과정명</span><input name="title" required /></label>
            <div className="form-grid">
              <label><span>지역</span><select name="region" defaultValue="jeongseon"><option value="jeongseon">정선</option><option value="donghae">동해</option><option value="inje">인제</option></select></label>
              <label><span>상태</span><select name="status" defaultValue="planned"><option value="open">모집중</option><option value="planned">모집예정</option><option value="closed">마감</option></select></label>
              <label><span>분야</span><input name="category" required placeholder="AI 실무" /></label>
              <label><span>운영 방식</span><input name="format" required placeholder="오프라인 + LMS" /></label>
              <label><span>접수 시작</span><input type="date" name="applicationStart" required /></label>
              <label><span>접수 마감</span><input type="date" name="applicationEnd" required /></label>
              <label><span>교육 시작</span><input type="date" name="courseStart" required /></label>
              <label><span>교육 종료</span><input type="date" name="courseEnd" required /></label>
              <label><span>정원</span><input type="number" name="capacity" min="1" max="500" defaultValue="20" required /></label>
              <label><span>대상</span><input name="audience" required /></label>
              <label className="form-grid__full"><span>장소</span><input name="location" required /></label>
              <label className="form-grid__full"><span>과정 소개</span><textarea name="summary" rows={4} required /></label>
            </div>
            <button className="button">과정 등록하기</button>
          </form>
          <div className="admin-course-list">
            {courses.map((course) => (
              <article key={course.id}>
                <div><span>{regionMap[course.region as RegionSlug]?.koreanName} · {course.category}</span><h3>{course.title}</h3><p>{course.summary}</p></div>
                <div><span className={`status status--${course.status}`}>{courseStatusLabel(course.status)}</span><button onClick={() => toggleCourse(course)}>{course.published ? "공개 중" : "비공개"}</button></div>
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
              <footer><span>{review.author} · {review.role}</span><button onClick={() => toggleReview(review)}>{review.published ? "공개 중" : "승인 대기"}</button></footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
