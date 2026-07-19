import type { Metadata } from "next";
import { ReviewForm } from "../../components/ReviewForm";
import { listCourses, listPublishedReviews } from "../../db/repository";
import { fallbackCourseRecords, fallbackReviews, regionMap, type RegionSlug } from "../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "수강후기", description: "GLab 교육을 경험한 지역 학습자들의 이야기를 확인하세요." };

export default async function ReviewsPage() {
  const [reviews, courses] = await Promise.all([listPublishedReviews().catch(() => fallbackReviews), listCourses().catch(() => fallbackCourseRecords)]);
  return (
    <><section className="page-hero page-hero--reviews"><div className="shell"><span className="eyebrow eyebrow--light">LEARNER STORIES</span><h1>배운 뒤 달라진 것들,<br />지역에서 이어지는 이야기.</h1><p>학습자들이 직접 전하는 GLab 교육의 경험과 변화를 만나보세요.</p></div></section>
      <section className="section"><div className="shell"><div className="review-wall">{reviews.map((review, index) => { const region = regionMap[review.region as RegionSlug]; return <article key={review.id} className={index === 0 ? "review-story review-story--large" : "review-story"} style={{ "--region-color": region.color } as React.CSSProperties}><header><span>{region.koreanName} GLab</span><div className="review-stars">{"★".repeat(review.rating)}</div></header><h2>{review.title}</h2><blockquote>“{review.content}”</blockquote><footer><span className="avatar">{review.author.slice(0, 1)}</span><div><strong>{review.author}</strong><small>{review.role}</small></div></footer></article>; })}</div></div></section>
      <section className="section section--pale"><div className="shell review-form-shell"><ReviewForm courses={courses} /></div></section></>
  );
}
