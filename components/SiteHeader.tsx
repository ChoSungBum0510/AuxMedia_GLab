import Link from "next/link";
import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from "../app/chatgpt-auth";
import { isAdminEmail } from "../lib/auth";

const navigation = [
  { href: "/regions", label: "지역 GLab" },
  { href: "/courses", label: "교육과정" },
  { href: "/reviews", label: "수강후기" },
  { href: "/notices", label: "알림마당" },
];

export async function SiteHeader() {
  const user = await getChatGPTUser();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href="/" aria-label="GLab 통합 지원 홈">
          <span className="brand__word">G<span>:</span>Lab</span>
          <small>지역교육 통합지원</small>
        </Link>
        <nav className="desktop-nav" aria-label="주요 메뉴">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          {user ? (
            <>
              <Link href="/mypage" className="header-account">내 학습</Link>
              {isAdminEmail(user.email) && <Link href="/admin">관리자</Link>}
              <Link href={chatGPTSignOutPath("/")} className="header-login">로그아웃</Link>
            </>
          ) : (
            <Link href={chatGPTSignInPath("/mypage")} className="header-login">로그인</Link>
          )}
          <details className="mobile-menu">
            <summary aria-label="전체 메뉴 열기"><span /><span /><span /></summary>
            <div className="mobile-menu__panel">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>{item.label}</Link>
              ))}
              <Link href={user ? "/mypage" : chatGPTSignInPath("/mypage")}>{user ? "내 학습" : "로그인"}</Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
