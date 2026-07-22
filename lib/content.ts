export const LMS_URL =
  process.env.NEXT_PUBLIC_LMS_URL ??
  "https://aux-lead-lms.mini293920.workers.dev";

export type RegionSlug = "jeongseon" | "donghae" | "inje" | "gangneung";

export type RegionInfo = {
  slug: RegionSlug;
  name: string;
  koreanName: string;
  displayName: string;
  hubType: "GLab" | "M Campus";
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
  logo: string;
  logoDark?: string;
  logoWidth?: number;
  logoHeight?: number;
};

const regionDisplayOrder: RegionSlug[] = ["donghae", "inje", "jeongseon", "gangneung"];

export const regions: RegionInfo[] = [
  {
    slug: "jeongseon",
    name: "Jeongseon GLab",
    koreanName: "정선",
    displayName: "정선 GLab",
    hubType: "GLab",
    shortCode: "JS",
    eyebrow: "TOURISM · FESTIVAL · LOCAL VALUE",
    headline: "관광·축제 산업을 통해 정주가치·특화가치·번영가치를 만듭니다",
    description:
      "‘오고 싶은 정선, 살고 싶은 정선’을 목표로 청소년 드론·미디어 교육과 지역 콘텐츠 제작을 지·산·학·민 협력으로 연결합니다.",
    address: "신동청소년아동장학복지센터 등 지역 연계 교육공간",
    contact: "모집·운영 일정은 알림마당에서 안내",
    color: "#147D77",
    paleColor: "#EAF8F5",
    focus: ["드론 메이커스", "항공촬영·미디어", "관광·축제 콘텐츠"],
    stats: [
      { value: "7회", label: "2025 청소년 드론교육" },
      { value: "42시간", label: "총 교육시간" },
      { value: "7명", label: "드론 4종 이수" },
    ],
    image: "/images/glab-hero.png",
    imagePosition: "center",
    logo: "/brand/glab-jeongseon.png",
    logoDark: "/brand/glab-jeongseon-dark.png",
  },
  {
    slug: "donghae",
    name: "Donghae GLab",
    koreanName: "동해",
    displayName: "동해 GLab",
    hubType: "GLab",
    shortCode: "DH",
    eyebrow: "AI TRANSFORMATION · PRACTICAL MEDIA",
    headline: "GLab 플랫폼 기반 동해시 AI 전환 생태계를 조성합니다",
    description:
      "지역 AI 역량 강화를 통한 스마트 도시 구축을 목표로 공공행정기관·산업체·소상공인이 현업에 적용하는 AI 시각화·미디어 교육을 운영합니다.",
    address: "동해시 지역 연계 교육공간",
    contact: "모집·운영 일정은 알림마당에서 안내",
    color: "#0A73B7",
    paleColor: "#EAF5FC",
    focus: ["AI 시각화", "AI 미디어 실무", "청소년 드론캠프"],
    stats: [
      { value: "8차시", label: "2026 AI 미디어 교육" },
      { value: "28시간", label: "총 교육시간" },
      { value: "83.1%", label: "접수 대비 참석률" },
    ],
    image: "/images/glab-digital-lab.jpg",
    imagePosition: "center",
    logo: "/brand/glab-donghae.png",
    logoDark: "/brand/glab-donghae-dark.png",
  },
  {
    slug: "inje",
    name: "Inje GLab",
    koreanName: "인제",
    displayName: "인제 GLab",
    hubType: "GLab",
    shortCode: "IJ",
    eyebrow: "HEALTH · LIFECARE · COMMUNITY",
    headline: "인제 맞춤형 헬스 라이프케어로 지역 정주생태계를 조성합니다",
    description:
      "자연과 건강, 활력이 조화로운 정주환경을 위해 맞춤형 커뮤니티케어 모델과 헬스앤라이프케어 기반 통합 돌봄체계 구축을 추진합니다.",
    address: "인제군 지역 연계 거점",
    contact: "세부 사업·모집 일정은 알림마당에서 안내",
    color: "#507A3F",
    paleColor: "#EFF7EA",
    focus: ["맞춤형 커뮤니티케어", "헬스앤라이프케어", "통합 돌봄체계"],
    stats: [
      { value: "2025", label: "GLab 프로젝트 시작" },
      { value: "맞춤형", label: "커뮤니티케어 모델" },
      { value: "통합", label: "돌봄체계 구축 방향" },
    ],
    image: "/images/glab-hero.png",
    imagePosition: "60% center",
    logo: "/brand/glab-inje.png",
    logoDark: "/brand/glab-inje-dark.png",
  },
  {
    slug: "gangneung",
    name: "Gangneung M Campus",
    koreanName: "강릉",
    displayName: "강릉 M Campus",
    hubType: "M Campus",
    shortCode: "GN",
    eyebrow: "REGIONAL CONNECTION · EDUCATION · COLLABORATION",
    headline: "지역과 대학을 연결하는 강릉 교육 거점을 만들어갑니다",
    description:
      "한림 M Campus@강릉은 지역의 교육 수요와 한림대학교의 역량을 연결하는 지역 연계 거점입니다. 교육과 협력 프로그램의 세부 일정은 확정되는 대로 안내합니다.",
    address: "강릉시 지역 연계 교육공간",
    contact: "세부 사업·모집 일정은 알림마당에서 안내",
    color: "#075DAA",
    paleColor: "#EAF4FC",
    focus: ["지역 연계 교육", "대학·지역 협력", "교육 프로그램 운영"],
    stats: [
      { value: "강릉", label: "지역 교육 거점" },
      { value: "연계", label: "대학·지역 협력" },
      { value: "예정", label: "세부 교육 안내" },
    ],
    image: "/images/glab-hero.png",
    imagePosition: "center",
    logo: "/brand/m-campus-gangneung.png",
    logoWidth: 334,
    logoHeight: 90,
  },
].sort(
  (a, b) => regionDisplayOrder.indexOf(a.slug) - regionDisplayOrder.indexOf(b.slug),
);

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
  platformUrl?: string;
  curriculum: string[];
  outcomes: string[];
  published: boolean;
};

export const seedCourses: SeedCourse[] = [
  {
    slug: "donghae-ai-media-2026",
    region: "donghae",
    title: "동해 AI 미디어 기본·실습 과정",
    summary:
      "생성형 AI 결과를 Figma 시각자료와 영상 콘텐츠로 확장해 행정·기업 홍보에 활용하는 지역 실무자 대상 교육입니다.",
    category: "AI·미디어 실무",
    audience: "동해시 공무원·산업체·소상공인 등 지역 실무자",
    format: "오프라인 · 오전/오후 투트랙",
    status: "closed",
    applicationStart: "2026-04-01",
    applicationEnd: "2026-07-31",
    courseStart: "2026-04-01",
    courseEnd: "2026-07-31",
    capacity: 77,
    location: "동해시 지역 연계 교육공간",
    curriculum: [
      "생성형 AI LLM을 활용한 시각화 기획",
      "SVG 코드·Figma를 활용한 벡터 이미지 제작",
      "포스터·PPT·목업 등 업무용 시각자료 완성",
      "Freepik·Magnific를 활용한 AI 결과물 영상화",
      "DaVinci Resolve 편집과 광고·숏폼 시안 제작",
    ],
    outcomes: [
      "8차시·28시간 운영",
      "접수 연인원 77명·참석 연인원 64명",
      "AI 시각화 만족도 85.8~98.6%",
      "AI 미디어 실습 만족도 91.0~100.0%",
    ],
    published: true,
  },
  {
    slug: "donghae-youth-drone-camp-2026",
    region: "donghae",
    title: "동해시 청소년센터 드론 캠프",
    summary:
      "FPV 드론 조립과 슈퍼볼 활동을 다루는 드론 스포츠, 촬영과 DaVinci Resolve 편집을 잇는 드론 미디어 투트랙 캠프입니다.",
    category: "청소년·드론",
    audience: "동해시 청소년센터 참여 청소년",
    format: "5일 오프라인 · 투트랙 실습",
    status: "planned",
    applicationStart: "2026-07-21",
    applicationEnd: "2026-08-03",
    courseStart: "2026-08-04",
    courseEnd: "2026-08-08",
    capacity: 30,
    location: "동해시 청소년센터",
    platformUrl: "https://aux-media-dh-web.mini293920.workers.dev/",
    curriculum: [
      "드론 기초 안전과 조작 원리",
      "슈퍼볼 활동을 통한 드론 스포츠 실습",
      "FPV 드론 조립과 기초 운용",
      "드론 영상 촬영 실습",
      "DaVinci Resolve 편집과 결과물 제작",
    ],
    outcomes: ["드론 조작·구조 이해", "직접 조립한 FPV 드론 경험", "촬영부터 편집까지 완성한 미디어 결과물"],
    published: true,
  },
  {
    slug: "jeongseon-drone-makers-2025",
    region: "jeongseon",
    title: "정선 청소년 드론 메이커스",
    summary:
      "3D 모델링과 3D 프린팅으로 드론을 직접 설계·제작하고 조종 실습과 진로 탐색까지 연결한 STEAM 융합 과정입니다.",
    category: "드론·메이커",
    audience: "정선 신동읍 초등학교 6학년~중학생",
    format: "오프라인 · 3회",
    status: "closed",
    applicationStart: "2025-09-01",
    applicationEnd: "2025-09-21",
    courseStart: "2025-09-22",
    courseEnd: "2025-10-13",
    capacity: 10,
    location: "정선군 신동청소년아동장학복지센터",
    curriculum: [
      "드론 규정·조종자 준수사항·안전교육",
      "3D 모델링과 3D 프린팅",
      "드론 조립·제작",
      "조종·비행 실습",
      "성과 공유와 드론 진로 탐색",
    ],
    outcomes: ["3회·18시간 운영", "드론 제작·비행 기초 역량", "STEAM 기반 진로 탐색"],
    published: true,
  },
  {
    slug: "jeongseon-drone-aerial-media-2025",
    region: "jeongseon",
    title: "정선 드론 항공촬영·미디어",
    summary:
      "항공촬영과 2D·3D 매핑, RAW 촬영, 영상 편집과 AI 처리를 연결해 지역의 모습을 관광 콘텐츠로 제작한 과정입니다.",
    category: "드론·로컬 미디어",
    audience: "정선 지역 중·고등학생",
    format: "오프라인·현장실습 · 4회",
    status: "closed",
    applicationStart: "2025-10-01",
    applicationEnd: "2025-10-18",
    courseStart: "2025-10-19",
    courseEnd: "2025-11-09",
    capacity: 10,
    location: "정선 예미·함백·신동면 일대",
    curriculum: [
      "드론 항공촬영과 비행 실습",
      "드론산업 2D·3D 매핑",
      "RAW 촬영과 색보정",
      "DaVinci Resolve 영상 편집",
      "AI 프로세싱과 로컬 관광 콘텐츠 제작",
    ],
    outcomes: ["4회·24시간 운영", "8명 과정 수료", "지역 소재 항공촬영·미디어 결과물"],
    published: true,
  },
  {
    slug: "jeongseon-drone-make-shot-2026",
    region: "jeongseon",
    title: "2026 정선 드론 교육 프로그램: 드론 메이크 샷",
    summary:
      "2025년 드론 교육 성과를 기초반·항공촬영 심화반·AI 미디어 제작으로 이어가는 단계형 후속 교육입니다.",
    category: "드론·AI 미디어",
    audience: "정선 지역 청소년",
    format: "단계형 오프라인 · 2026년 7월/9월",
    status: "planned",
    applicationStart: "2026-07-01",
    applicationEnd: "2026-09-30",
    courseStart: "2026-07-01",
    courseEnd: "2026-09-30",
    capacity: 15,
    location: "정선군 신동청소년아동장학복지센터 연계",
    curriculum: [
      "드론 메이커스 기초반: 조립·비행 입문",
      "드론 항공촬영·미디어 심화반",
      "촬영 실습과 결과물 제작",
      "AI·Figma 기반 시각화",
      "영상 편집을 포함한 AI 미디어 실무",
    ],
    outcomes: ["기초에서 심화로 이어지는 연속 학습", "항공촬영·미디어 결과물", "AI 미디어 실무 교육 연계"],
    published: true,
  },
];

export type CourseDisplayInfo = {
  application: string;
  schedule: string;
  participation: string;
  scheduleBadge: string;
};

export const courseDisplayInfo: Record<string, CourseDisplayInfo> = {
  "donghae-ai-media-2026": {
    application: "운영 종료",
    schedule: "2026년 4~7월 · 8차시, 28시간",
    participation: "접수 77명 · 참석 64명",
    scheduleBadge: "04—07",
  },
  "donghae-youth-drone-camp-2026": {
    application: "모집 일정은 알림마당에서 안내",
    schedule: "2026년 8월 4~8일 · 5일",
    participation: "30명 참여 예정",
    scheduleBadge: "08.04",
  },
  "jeongseon-drone-makers-2025": {
    application: "운영 종료",
    schedule: "2025년 9월 22일~10월 13일 · 3회, 18시간",
    participation: "10명 수료",
    scheduleBadge: "09.22",
  },
  "jeongseon-drone-aerial-media-2025": {
    application: "운영 종료",
    schedule: "2025년 10월 19일~11월 9일 · 4회, 24시간",
    participation: "8명 수료",
    scheduleBadge: "10.19",
  },
  "jeongseon-drone-make-shot-2026": {
    application: "세부 모집 일정은 알림마당에서 안내",
    schedule: "2026년 7월·9월 단계형 운영 예정",
    participation: "AI 미디어 연계 15명 참여 예정",
    scheduleBadge: "07·09",
  },
};

export function getCourseDisplayInfo(course: {
  slug: string;
  applicationStart: string;
  applicationEnd: string;
  courseStart: string;
  courseEnd: string;
  capacity: number;
  status: string;
}): CourseDisplayInfo {
  return courseDisplayInfo[course.slug] ?? {
    application: `${formatDate(course.applicationStart)} — ${formatDate(course.applicationEnd)}`,
    schedule: `${formatDate(course.courseStart)} — ${formatDate(course.courseEnd)}`,
    participation: `정원 ${course.capacity}명`,
    scheduleBadge: course.courseStart.slice(5).replace("-", "."),
  };
}

export const fallbackCourseRecords = seedCourses.map((course, index) => ({
  ...course,
  id: index + 1,
  platformUrl: course.platformUrl ?? "",
  curriculum: JSON.stringify(course.curriculum),
  outcomes: JSON.stringify(course.outcomes),
  createdAt: "2026-07-21 09:00:00",
  updatedAt: "2026-07-21 09:00:00",
}));

export const fallbackReviews = [
  {
    id: 1,
    courseSlug: "donghae-ai-media-2026",
    region: "donghae",
    author: "동해 AI 미디어 참여자",
    role: "2026 교육 피드백",
    rating: 0,
    title: "새로운 AI 활용 방식은 유익했어요",
    content:
      "지금까지 AI를 쓰던 방식과 완전히 달라 유익했으나 바로 사업과 실무에 적용을 어떻게 할지 모르겠다.",
    published: true,
    createdAt: "2026-07-21 09:00:00",
  },
  {
    id: 2,
    courseSlug: "donghae-ai-media-2026",
    region: "donghae",
    author: "동해 AI 미디어 참여자",
    role: "2026 교육 피드백",
    rating: 0,
    title: "좋은 구성만큼 충분한 실습시간이 필요해요",
    content: "강의 구성은 좋으나 시간이 부족했다.",
    published: true,
    createdAt: "2026-07-21 08:50:00",
  },
  {
    id: 3,
    courseSlug: "jeongseon-drone-aerial-media-2025",
    region: "jeongseon",
    author: "정선 프로그램 운영 결과",
    role: "2025 현장 피드백 종합",
    rating: 0,
    title: "드론 경험이 촬영·편집과 자격 이수로 이어졌습니다",
    content:
      "드론 체험과 비행, 색 보정·영상 편집, 드론 4종 자격 이수가 긍정적으로 평가됐으며 비행·편집 난이도와 긴 수업 시간은 개선 과제로 확인됐습니다.",
    published: true,
    createdAt: "2026-07-21 08:40:00",
  },
];

export const fallbackNotices = [
  {
    id: 1,
    category: "운영",
    title: "2026 한림 G-Lab@동해 지역 연계 협업 지·산·학 간담회 안내",
    content:
      "2026 한림 G-Lab@동해 지역 연계 협업 지·산·학 간담회를 개최합니다.\n\n주제: 2025~2026 교육 성과를 기반으로 한 지역 연계 실무 교육 발전 방안\n일시: 2026년 7월 22일(수) 15:00\n장소: 동해시 북평산업단지 복합문화센터 2층 회의실\n참석 대상: 한림대학교 교원·직원, 동해시·강릉시·정선군 관계자, 관련 산업체 등 20명 내외\n\n15시부터 기관별 주요 사업을 소개하고, 16시부터 지역 산업체 수요와 앵커 사업 연계 협업 모델을 논의합니다.",
    published: true,
    createdAt: "2026-07-21 10:00:00",
  },
  {
    id: 2,
    category: "성과",
    title: "동해 AI 미디어 기본·실습 과정 4~7월 운영 성과",
    content:
      "2026년 4월부터 7월까지 동해 지역 실무자를 대상으로 AI 미디어 활용 기본·실습 과정 8개 세션, 총 28시간을 운영했습니다.\n\n접수 연인원 77명 중 64명이 참석해 참석률 83.1%를 기록했습니다. 오전 AI 시각화 기본과정은 생성형 AI·SVG·Figma를 연결해 포스터·PPT·목업을 제작했고, 오후 AI 미디어 실습과정은 Freepik·Magnific·DaVinci Resolve로 스토리보드·광고·숏폼 시안을 완성했습니다.\n\n기본과정 만족도는 월별 85.8~98.6%, 실습과정은 91.0~100.0%였습니다. 향후 학기제와 기본·심화 투트랙, 프로젝트·피드백 과정으로 연결할 계획입니다.",
    published: true,
    createdAt: "2026-07-21 09:40:00",
  },
  {
    id: 3,
    category: "모집",
    title: "2026 동해시 청소년센터 드론 캠프 운영 예정 안내",
    content:
      "동해시 청소년센터에서 2026년 8월 4일부터 8일까지 5일간 청소년 드론 캠프를 운영할 예정입니다. 참여 규모는 30명이며 드론 스포츠와 드론 미디어 투트랙으로 구성됩니다.\n\n드론 스포츠 트랙은 슈퍼볼 활동과 FPV 드론 조립을 통해 조작 감각과 구조 이해를 높입니다. 드론 미디어 트랙은 영상 촬영부터 DaVinci Resolve 편집까지 하나의 결과물로 연결합니다.\n\n세부 모집 방식과 참여 안내는 운영 기관과 협의한 뒤 알림마당에 게시합니다.",
    published: true,
    createdAt: "2026-07-21 09:20:00",
  },
  {
    id: 4,
    category: "성과",
    title: "정선 청소년 드론·미디어 교육 운영 성과와 2026 연계 계획",
    content:
      "2025년 정선군 신동청소년아동장학복지센터에서 드론 메이커스 3회·18시간과 드론 항공촬영 및 미디어 4회·24시간 등 총 7회·42시간을 운영했습니다. 참여 기반은 25명이었고 주요 과정 수료자는 18명입니다. 촬영·미디어 과정은 8명이 수료했으며, 7명이 드론 4종 이수를 완료했습니다.\n\n2026년에는 드론 메이커스 기초반과 항공촬영·미디어 심화반을 거쳐 AI·Figma·영상 편집까지 확장하는 ‘드론 메이크 샷’ 단계형 교육으로 연결할 예정입니다. 세부 일정은 확정 후 안내합니다.",
    published: true,
    createdAt: "2026-07-21 09:00:00",
  },
  {
    id: 5,
    category: "운영",
    title: "G-Lab 통합 지원 플랫폼 이용 안내",
    content:
      "G-Lab 통합 지원 플랫폼은 정선·동해·인제 G-Lab과 강릉 M Campus의 과정 안내, 모집·신청, 일정, 운영 성과와 수강후기를 한곳에서 확인하기 위해 구축했습니다.\n\n지역 지도와 교육과정 메뉴에서 공개된 프로그램을 확인할 수 있습니다. 실제 모집이 시작된 과정만 신청 버튼이 활성화되며, 세부 일정이 확정되지 않은 과정은 알림마당에서 먼저 안내합니다. 선발 이후 온라인 학습과 자료·과제·수료 현황은 통합 LMS에서 이어집니다.",
    published: true,
    createdAt: "2026-07-21 08:40:00",
  },
];

export const legacyCourseSlugs = [
  "jeongseon-local-creator",
  "jeongseon-ai-living-lab",
  "donghae-ai-digital-camp",
  "donghae-ocean-content",
  "inje-local-brand-makers",
  "inje-youth-future-tech",
];

export const legacyNoticeTitles = [
  "정선·동해·인제 8월 교육과정 통합 모집 안내",
  "G-Lab 통합 지원 사이트 이용 방법",
  "온라인 수강을 위한 통합 LMS 접속 안내",
  "2026 동해시 청소년센터 드론캠프 운영 예정 안내",
];

export const legacyReviewTitles = [
  "배우고 바로 써먹을 수 있었어요",
  "우리 동네를 새롭게 보게 된 과정",
  "막연했던 아이디어가 형태가 됐어요",
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
  if (status === "closed") return "운영완료";
  return "운영예정";
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
