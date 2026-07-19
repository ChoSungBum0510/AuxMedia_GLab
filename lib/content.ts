export const LMS_URL =
  process.env.NEXT_PUBLIC_LMS_URL ??
  "https://aux-lead-lms.mini293920.workers.dev";

export type RegionSlug = "jeongseon" | "donghae" | "inje";

export type RegionInfo = {
  slug: RegionSlug;
  name: string;
  koreanName: string;
  shortCode: string;
  eyebrow: string;
  headline: string;
  description: string;
  address: string;
  contact: string;
  color: string;
  paleColor: string;
  focus: string[];
  stats: { value: string; label: string }[];
  image: string;
  imagePosition: string;
};

export const regions: RegionInfo[] = [
  {
    slug: "jeongseon",
    name: "Jeongseon GLab",
    koreanName: "정선",
    shortCode: "JS",
    eyebrow: "MOUNTAIN · LOCAL · DIGITAL",
    headline: "산과 마을을 연결하는 디지털 배움",
    description:
      "정선의 사람과 자원을 디지털 콘텐츠로 발견하고, 지역 안에서 새로운 일을 만드는 실전형 교육을 운영합니다.",
    address: "정선군 정선읍 지역학습거점",
    contact: "033-000-2101",
    color: "#147D77",
    paleColor: "#EAF8F5",
    focus: ["로컬 콘텐츠", "AI 생활문제 해결", "디지털 창업"],
    stats: [
      { value: "6", label: "운영 과정" },
      { value: "148", label: "누적 학습자" },
      { value: "12", label: "지역 프로젝트" },
    ],
    image: "/images/glab-hero.png",
    imagePosition: "center",
  },
  {
    slug: "donghae",
    name: "Donghae GLab",
    koreanName: "동해",
    shortCode: "DH",
    eyebrow: "OCEAN · AI · CONTENT",
    headline: "바다와 산업을 잇는 미래 실무 교육",
    description:
      "동해의 해양·관광·산업 현장을 기반으로 AI 도구와 디지털 미디어를 실제 업무에 적용하는 과정을 만듭니다.",
    address: "동해시 천곡동 디지털학습거점",
    contact: "033-000-2201",
    color: "#0A73B7",
    paleColor: "#EAF5FC",
    focus: ["AI 실무", "해양관광 콘텐츠", "데이터 리터러시"],
    stats: [
      { value: "8", label: "운영 과정" },
      { value: "216", label: "누적 학습자" },
      { value: "18", label: "협력 기관" },
    ],
    image: "/images/glab-digital-lab.jpg",
    imagePosition: "center",
  },
  {
    slug: "inje",
    name: "Inje GLab",
    koreanName: "인제",
    shortCode: "IJ",
    eyebrow: "FOREST · YOUTH · MAKER",
    headline: "자연에서 시작하는 창의·기술 프로젝트",
    description:
      "인제의 자연환경과 지역 이야기를 바탕으로 청소년부터 주민까지 함께 만드는 메이커·미디어 교육을 운영합니다.",
    address: "인제군 인제읍 미래학습거점",
    contact: "033-000-2301",
    color: "#507A3F",
    paleColor: "#EFF7EA",
    focus: ["로컬 브랜드", "청소년 미래기술", "지속가능 프로젝트"],
    stats: [
      { value: "5", label: "운영 과정" },
      { value: "132", label: "누적 학습자" },
      { value: "9", label: "지역 프로젝트" },
    ],
    image: "/images/glab-hero.png",
    imagePosition: "60% center",
  },
];

export const regionMap = Object.fromEntries(
  regions.map((region) => [region.slug, region]),
) as Record<RegionSlug, RegionInfo>;

export type SeedCourse = {
  slug: string;
  region: RegionSlug;
  title: string;
  summary: string;
  category: string;
  audience: string;
  format: string;
  status: "open" | "planned" | "closed";
  applicationStart: string;
  applicationEnd: string;
  courseStart: string;
  courseEnd: string;
  capacity: number;
  location: string;
  curriculum: string[];
  outcomes: string[];
  published: boolean;
};

export const seedCourses: SeedCourse[] = [
  {
    slug: "jeongseon-local-creator",
    region: "jeongseon",
    title: "정선 로컬 콘텐츠 크리에이터",
    summary:
      "정선의 사람·장소·이야기를 발견해 짧은 영상과 온라인 콘텐츠로 완성하는 8주 프로젝트 과정입니다.",
    category: "디지털 콘텐츠",
    audience: "정선 주민·청년·소상공인",
    format: "오프라인 + LMS",
    status: "open",
    applicationStart: "2026-07-20",
    applicationEnd: "2026-08-04",
    courseStart: "2026-08-10",
    courseEnd: "2026-09-28",
    capacity: 24,
    location: "정선 GLab 지역학습거점",
    curriculum: [
      "지역 자원 탐색과 콘텐츠 기획",
      "스마트폰 촬영과 인터뷰 실습",
      "AI를 활용한 편집·카피라이팅",
      "팀별 로컬 콘텐츠 제작",
      "상영회와 포트폴리오 완성",
    ],
    outcomes: ["지역 콘텐츠 1편", "개인 포트폴리오", "GLab 수료 인증"],
    published: true,
  },
  {
    slug: "jeongseon-ai-living-lab",
    region: "jeongseon",
    title: "정선 AI 생활문제 해결랩",
    summary:
      "생활 속 불편을 찾고 생성형 AI와 노코드 도구로 작동하는 해결안을 만드는 주민 참여형 랩입니다.",
    category: "AI·문제해결",
    audience: "정선군민 누구나",
    format: "오프라인",
    status: "planned",
    applicationStart: "2026-09-01",
    applicationEnd: "2026-09-18",
    courseStart: "2026-09-26",
    courseEnd: "2026-10-31",
    capacity: 20,
    location: "정선 GLab 지역학습거점",
    curriculum: ["문제 발견", "AI 도구 기초", "아이디어 검증", "프로토타입", "성과 공유"],
    outcomes: ["생활문제 해결 프로토타입", "팀 프로젝트 경험"],
    published: true,
  },
  {
    slug: "donghae-ai-digital-camp",
    region: "donghae",
    title: "동해 AI·디지털 실무 캠프",
    summary:
      "문서, 홍보, 데이터 정리까지 현업에서 반복되는 일을 AI로 개선하는 집중 실무 과정입니다.",
    category: "AI 실무",
    audience: "동해 지역 재직자·구직자",
    format: "하이브리드",
    status: "open",
    applicationStart: "2026-07-15",
    applicationEnd: "2026-08-08",
    courseStart: "2026-08-17",
    courseEnd: "2026-09-21",
    capacity: 30,
    location: "동해 GLab 디지털학습거점",
    curriculum: [
      "생성형 AI 안전하게 시작하기",
      "문서·기획 업무 자동화",
      "홍보 콘텐츠 제작",
      "데이터 정리와 시각화",
      "개인 업무 개선 프로젝트",
    ],
    outcomes: ["업무 자동화 시나리오", "실무 프롬프트북", "온라인 복습 과정"],
    published: true,
  },
  {
    slug: "donghae-ocean-content",
    region: "donghae",
    title: "동해 해양관광 콘텐츠 스튜디오",
    summary:
      "동해의 해양 자원을 여행 콘텐츠와 지역 브랜드로 연결하는 팀 프로젝트형 스튜디오입니다.",
    category: "로컬 브랜딩",
    audience: "관광 종사자·예비 창업자",
    format: "오프라인 + 현장실습",
    status: "planned",
    applicationStart: "2026-09-14",
    applicationEnd: "2026-10-02",
    courseStart: "2026-10-10",
    courseEnd: "2026-11-21",
    capacity: 18,
    location: "동해 GLab·묵호 일대",
    curriculum: ["지역 리서치", "브랜드 콘셉트", "콘텐츠 제작", "현장 테스트", "쇼케이스"],
    outcomes: ["해양관광 콘텐츠", "지역 협업 네트워크"],
    published: true,
  },
  {
    slug: "inje-local-brand-makers",
    region: "inje",
    title: "인제 로컬브랜드 메이커스",
    summary:
      "인제의 자연과 생활문화에서 아이디어를 찾아 작은 브랜드와 제품 콘텐츠로 구현합니다.",
    category: "메이커·창업",
    audience: "인제 주민·예비 창업자",
    format: "오프라인 + LMS",
    status: "open",
    applicationStart: "2026-07-22",
    applicationEnd: "2026-08-12",
    courseStart: "2026-08-24",
    courseEnd: "2026-10-19",
    capacity: 20,
    location: "인제 GLab 미래학습거점",
    curriculum: [
      "인제 자원과 고객 탐색",
      "브랜드 콘셉트와 이름",
      "제품·서비스 프로토타입",
      "사진과 판매 콘텐츠",
      "마켓 테스트와 발표",
    ],
    outcomes: ["브랜드 프로토타입", "판매 콘텐츠", "전문가 피드백"],
    published: true,
  },
  {
    slug: "inje-youth-future-tech",
    region: "inje",
    title: "인제 청소년 미래기술 교실",
    summary:
      "청소년이 AI, 센서, 미디어 도구를 경험하고 우리 마을을 위한 작품을 만드는 주말 과정입니다.",
    category: "청소년·미래기술",
    audience: "인제 중·고등학생",
    format: "주말 오프라인",
    status: "planned",
    applicationStart: "2026-08-24",
    applicationEnd: "2026-09-11",
    courseStart: "2026-09-19",
    courseEnd: "2026-10-24",
    capacity: 24,
    location: "인제 GLab 미래학습거점",
    curriculum: ["AI 리터러시", "센서와 코딩", "디지털 미디어", "팀 메이킹", "성과 발표"],
    outcomes: ["팀별 기술 작품", "진로 멘토링", "GLab 수료 인증"],
    published: true,
  },
];

export const fallbackCourseRecords = seedCourses.map((course, index) => ({
  ...course,
  id: index + 1,
  curriculum: JSON.stringify(course.curriculum),
  outcomes: JSON.stringify(course.outcomes),
  createdAt: "2026-07-01 09:00:00",
  updatedAt: "2026-07-01 09:00:00",
}));

export const fallbackReviews = [
  {
    id: 1,
    courseSlug: "donghae-ai-digital-camp",
    region: "donghae",
    author: "김민지",
    role: "지역 소상공인",
    rating: 5,
    title: "배우고 바로 써먹을 수 있었어요",
    content:
      "홍보 문구 작성과 반복 문서 정리를 실제 제 업무에 적용했습니다. 온라인 복습 자료가 있어 수업 뒤에도 이어갈 수 있었어요.",
    published: true,
    createdAt: "2026-06-18 09:00:00",
  },
  {
    id: 2,
    courseSlug: "jeongseon-local-creator",
    region: "jeongseon",
    author: "박준호",
    role: "청년 수강생",
    rating: 5,
    title: "우리 동네를 새롭게 보게 된 과정",
    content:
      "평소 지나치던 장소를 인터뷰하고 영상으로 만들면서 정선을 보는 시선이 달라졌습니다. 팀 프로젝트도 큰 도움이 됐습니다.",
    published: true,
    createdAt: "2026-05-29 14:00:00",
  },
  {
    id: 3,
    courseSlug: "inje-local-brand-makers",
    region: "inje",
    author: "이서윤",
    role: "예비 창업자",
    rating: 5,
    title: "막연했던 아이디어가 형태가 됐어요",
    content:
      "고객을 정하고 작은 시제품을 만들어보는 순서가 좋았습니다. 전문가 피드백을 받아 다음 단계가 선명해졌어요.",
    published: true,
    createdAt: "2026-04-12 11:30:00",
  },
];

export const notices = [
  { date: "2026.07.18", category: "모집", title: "정선·동해·인제 8월 교육과정 통합 모집 안내" },
  { date: "2026.07.12", category: "공지", title: "GLab 통합 지원 사이트 이용 방법" },
  { date: "2026.07.05", category: "LMS", title: "온라인 수강을 위한 통합 LMS 접속 안내" },
];

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(new Date(`${value}T00:00:00+09:00`));
}

export function courseStatusLabel(status: string) {
  if (status === "open") return "모집중";
  if (status === "closed") return "모집마감";
  return "모집예정";
}

export function parseStringArray(value: string | string[]) {
  if (Array.isArray(value)) return value;
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string")
      ? parsed
      : [];
  } catch {
    return [];
  }
}
