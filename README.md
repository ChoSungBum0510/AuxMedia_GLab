# GLab 지역교육 통합지원

정선·동해·인제에서 운영하는 GLab 교육을 한곳에서 찾고, 비교하고, 신청할 수 있는 통합 플랫폼입니다. 지역별 소개와 교육과정, 신청, 후기, 공지, 마이페이지, 관리자 운영 기능을 포함합니다.

## 주요 기능

- 지도에서 정선·동해·인제를 선택해 지역별 교육 페이지로 이동
- 교육과정 검색·필터·상세 정보 및 온라인 신청
- ChatGPT 계정 기반 로그인, 나의 신청 내역
- 과정·신청 상태·후기를 관리하는 관리자 화면
- Cloudflare D1 기반 과정·신청·후기·공지 데이터 관리
- 기존 통합 LMS 바로가기 및 온라인 학습 연계

## 로컬 실행

Node.js 22.13 이상이 필요합니다.

```bash
npm install
npm run dev
```

품질 검증 명령은 다음과 같습니다.

```bash
npm run lint
npx tsc --noEmit
npm test
```

## 환경 변수

`.env.example`을 참고해 로컬 `.env`를 구성합니다.

- `ADMIN_EMAILS`: 관리자 권한을 허용할 이메일 목록(쉼표 구분)
- `NEXT_PUBLIC_LMS_URL`: 푸터와 교육 흐름에서 연결할 통합 LMS 주소

운영 환경에서는 Cloudflare Sites 환경 변수로 같은 값을 관리합니다.

## 데이터베이스

스키마는 `db/schema.ts`, 초기 데이터와 D1 접근 코드는 `db/repository.ts`, 생성된 마이그레이션은 `drizzle/`에 있습니다.

```bash
npm run db:generate
```

로컬 개발에서는 vinext가 D1 바인딩을 제공하며, 배포 환경에서는 `.openai/hosting.json`의 `DB` 바인딩을 사용합니다.
