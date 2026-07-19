import type { Metadata } from "next";
import Link from "next/link";
import { notices } from "../../lib/content";

export const metadata: Metadata = { title: "알림마당", description: "GLab 교육 모집과 운영 소식을 확인하세요." };

export default function NoticesPage() {
  return (
    <><section className="page-hero page-hero--notices"><div className="shell"><span className="eyebrow eyebrow--light">GLAB NEWS</span><h1>배움의 기회를<br />놓치지 마세요.</h1><p>교육 모집, 개강, 통합 LMS와 운영 관련 소식을 안내합니다.</p></div></section><section className="section"><div className="shell notice-page-layout"><aside><span className="eyebrow">NOTICE BOARD</span><h2>알림마당</h2><nav><button className="active">전체</button><button>모집</button><button>운영</button><button>LMS</button></nav></aside><div className="notice-board"><div className="notice-board__head"><strong>전체 공지</strong><label><span className="sr-only">공지 검색</span><input placeholder="검색어를 입력하세요" /><b>⌕</b></label></div>{notices.map((notice, index) => <article key={notice.title}><span className="notice-number">{String(notices.length - index).padStart(2, "0")}</span><div><span>{notice.category}</span><h3>{notice.title}</h3></div><time>{notice.date}</time><b>→</b></article>)}<div className="notice-help"><strong>찾는 안내가 없나요?</strong><p>지역별 교육 문의는 각 GLab 상세 페이지에서 담당 연락처를 확인해 주세요.</p><Link href="/regions">지역 GLab 보기 →</Link></div></div></div></section></>
  );
}
