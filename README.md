# HANBEE JANG — Portfolio (Vite + React)

Claude Artifact로 만들었던 포트폴리오를 그대로 옮긴, Vercel에 바로 배포 가능한
Vite + React 프로젝트입니다. 디자인·인터랙션·프로젝트 데이터·About/Career/Contact·
Vimeo block system 등은 전혀 수정하지 않았고, `src/App.jsx`는 원본 `portfolio.jsx`와
완전히 동일한 코드입니다.

## 폴더 구조

```text
.
├── index.html          # Vite 엔트리 HTML (Pretendard 폰트 CDN 링크 포함)
├── package.json
├── vite.config.js
├── public/
│   └── images/          # "/images/..." 경로로 서빙되는 정적 이미지 폴더
│       └── README.txt   # 실제 이미지 넣는 방법 안내
└── src/
    ├── main.jsx          # React 진입점 (ReactDOM.createRoot)
    └── App.jsx           # 사이트 전체 코드 (원본 portfolio.jsx와 동일)
```

## 로컬에서 실행하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`을 열면 됩니다.

## 프로덕션 빌드

```bash
npm run build
npm run preview   # 빌드 결과를 로컬에서 미리 확인
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

## Vercel에 배포하기

### 방법 1 — Vercel 대시보드에서 GitHub 연동

1. 이 프로젝트를 GitHub 저장소로 push합니다.
2. [vercel.com](https://vercel.com)에서 New Project → 해당 저장소 선택
3. Framework Preset은 **Vite**로 자동 감지됩니다 (Build Command: `vite build`,
   Output Directory: `dist`) — 별도 설정 없이 Deploy만 누르면 됩니다.

### 방법 2 — Vercel CLI로 바로 배포

```bash
npm install -g vercel
vercel
```

프로젝트 루트에서 위 명령을 실행하면 안내에 따라 몇 가지 질문에 답한 뒤
바로 배포됩니다(`vercel --prod`로 실행하면 production 배포).

## 실제 이미지로 교체하기

- `siteInfo.homeTypographyImage`(하단 대형 타이포그래피 PNG)는 이미
  `/images/home-typography.png` 경로로 설정되어 있습니다.
  `public/images/home-typography.png` 자리에 실제 파일을 넣으면 바로 반영됩니다.
- 프로젝트 썸네일 / Hero 이미지, About / Connect 이미지 등은 현재
  SVG placeholder(`ph()`, `graphicPlaceholder()`, `signaturePlaceholder()`)로
  자동 생성되고 있습니다. 실제 이미지를 쓰려면 `public/images/`에 파일을 넣고
  `src/App.jsx`의 해당 값을 `"/images/파일명.jpg"` 문자열로 바꿔주세요.
  자세한 설명은 `src/App.jsx` 상단의 `EDIT HERE` 주석과
  `public/images/README.txt`를 참고하세요.

## Vimeo 임베드

프로젝트 상세 페이지의 Vimeo 블록(`{ type: "vimeo", videoId: "...", ratio: "16:9" }`)이
실제로 재생되려면, 해당 Vimeo 영상의 Privacy → Embed 설정에서 외부 도메인 embed를
허용해야 합니다.
