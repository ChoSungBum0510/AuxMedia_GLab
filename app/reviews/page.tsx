import type { Metadata } from "next";
import { ReviewForm } from "../../components/ReviewForm";
import { listCourses, listPublishedReviews } from "../../db/repository";
import { fallbackCourseRecords, fallbackReviews, regionMap, type RegionSlug } from "../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "수강후기", description: "GLab 교육 현장의 피드백과 학습자 후기를 확인하세요." };

export default async function ReviewsPage() {
  const [reviews, courses] = await Promise.all([listPublishedReviews().catch(() => fallbackReviews), listCourses().catch(() => fallbackCourseRecords)]);
  return (
    <><section className="page-hero page-hero--reviews"><div className="shell"><span className="eyebrow eyebrow--light">FIELD FEEDBACK</span><h1>배움의 성과와 과제를<br />다음 교육으로 잇습니다.</h1><p>교육 현장의 참여자 의견과 운영 성과, 학습자가 직접 남긴 후기를 함께 확인하세요.</p></div></section>
      <section className="section"><div className="shell"><div className="review-wall">{reviews.map((review, index) => { const region = regionMap[review.region as RegionSlug]; return <article key={review.id} className={index === 0 ? "review-story review-story--large" : "review-story"} style={{ "--region-color": region.color } as React.CSSProperties}><header><span>{region.displayName}</span><div className={review.rating > 0 ? "review-stars" : "review-source"}>{review.rating > 0 ? "★".repeat(review.rating) : "현장 피드백"}</div></header><h2>{review.title}</h2><blockquote>{review.rating > 0 ? `“${review.content}”` : review.content}</blockquote><footer><span className="avatar">{review.author.slice(0, 1)}</span><div><strong>{review.author}</strong><small>{review.role}</small></div></footer></article>; })}</div></div></section>
      <section className="section section--pale"><div className="shell review-form-shell"><ReviewForm courses={courses} /></div></section></>
  );
}
