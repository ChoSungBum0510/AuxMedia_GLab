import Link from "next/link";

export default function NotFound() {
  return <section className="auth-gate"><div><span className="eyebrow">404</span><h1>페이지를 찾을 수 없습니다.</h1><p>주소를 다시 확인하거나 GLab 홈에서 필요한 교육을 찾아보세요.</p><Link className="button" href="/">홈으로 돌아가기</Link></div></section>;
}
