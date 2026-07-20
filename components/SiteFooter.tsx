import Link from "next/link";
import { LMS_URL, regions } from "../lib/content";
import { BrandLogo } from "./BrandLogo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-cta shell">
        <div>
          <span className="eyebrow eyebrow--light">RELATED PLATFORM</span>
          <h2>수강 중인 교육은 통합 LMS에서 이어가세요.</h2>
          <p>온라인 강의, 학습 진도, 과제와 수료 현황을 한곳에서 확인할 수 있습니다.</p>
        </div>
        <a href={LMS_URL} className="button button--white" target="_blank" rel="noreferrer">
          통합 LMS 바로가기 <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="footer-main shell">
        <div className="footer-brand">
          <Link className="brand brand--footer" href="/" aria-label="한림 G Lab 통합 지원 홈">
            <BrandLogo />
          </Link>
          <p>지역 위기를 기회로 전환하는 지역혁신 플랫폼.</p>
        </div>
        <div className="footer-links">
          <div>
            <strong>지역 GLab</strong>
            <Link href="/about">GLab 소개 · 홍보영상</Link>
            {regions.map((region) => (
              <Link key={region.slug} href={`/regions/${region.slug}`}>{region.koreanName}</Link>
            ))}
          </div>
          <div>
            <strong>교육 지원</strong>
            <Link href="/courses">전체 교육과정</Link>
            <Link href="/reviews">수강후기</Link>
            <Link href="/mypage">나의 신청내역</Link>
          </div>
          <div>
            <strong>운영</strong>
            <Link href="/notices">공지사항</Link>
            <Link href="/admin">관리자 페이지</Link>
            <Link href="/notices">운영·문의 안내</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom shell">
        <span>© 2026 GLab Regional Learning Platform</span>
        <span>Hallym University · 대학과 지역이 함께 만드는 미래</span>
      </div>
    </footer>
  );
}
