import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";

/* =========================================================================
   PORTFOLIO SITE — Selected Works (Orbit HOME)
   -------------------------------------------------------------------------
   이 파일은 Claude Artifact(React)에서 바로 실행되도록 만들어졌습니다.
   react-dom, react-router 등 외부 라이브러리를 import 하지 않고
   React 기본 hook(useState/useEffect/useRef)과 순수 CSS만 사용합니다.
   ========================================================================= */

/* =====================================
   ✏️ EDIT HERE — SITE TEXT (사이트 텍스트 / 링크 수정)
   여기 값만 바꾸면 사이트 전체 텍스트와 링크가 자동으로 반영됩니다.
   ===================================== */
const siteInfo = {
  // 좌상단에 표시되는 이름 / 로고 텍스트
  name: "HANBEE JANG",

  // About 섹션 제목 (작은 라벨)
  aboutTitle: "About",

  // About 섹션의 크고 굵은 메인 타이틀 — 줄바꿈은 \n 으로 표시
  aboutHeadline: "I CREATE VISUAL EXPERIENCES\nTHROUGH MOTION AND DESIGN.",

  // About 섹션 본문(작은 소개 문장) — 줄바꿈은 \n 으로 표시
  aboutBody:
    "삐이.\n" +
    "삐이이이,\n" +
    "삐루룽",

  // About 하단에 흐르는 Software / Tool marquee 목록 — 필요한 만큼 추가/삭제하세요
  tools: [
    "CINEMA 4D",
    "AFTER EFFECTS",
    "PREMIERE PRO",
    "ILLUSTRATOR",
    "PHOTOSHOP",
    "FIGMA",
    "MIDJOURNEY",
    "HIGGSFIELD",
  ],

  // Career / Experience 섹션 — 필요한 만큼 항목을 추가/삭제하세요
  career: [
    { period: "2024 — Present", role: "Motion Designer", place: "Studio Object" },
    { period: "2022 — 2024", role: "Graphic Designer", place: "Atelier Form" },
    { period: "2021 — 2022", role: "Junior Designer", place: "Studio Plain" },
  ],

  // Contact 섹션에 표시되는 이메일 — 상단 Header의 "SEND ME A MESSAGE"는 이제 mailto가 아니라
  // 이 Contact 섹션(#contact)으로 smooth scroll 이동하는 버튼입니다
  email: "hello@hanbeejang.com",

  // ✏️ Instagram 링크 — 사용하지 않으면 빈 문자열("")로 두세요
  instagram: "https://instagram.com/",
  // ✏️ Behance 링크 — 사용하지 않으면 빈 문자열("")로 두세요
  behance: "https://behance.net/",

  // ✏️ 시그니처 PNG 이미지 경로 (현재 HOME에서는 렌더링되지 않지만, 데이터는 그대로 유지되어 있습니다.
  // 대형 Typography PNG(homeTypographyImage)와의 composition을 확인한 뒤 필요하면 다시 배치할 수 있습니다)
  // 예: signatureImage: "https://your-domain.com/signature.png"
  signatureImage: signaturePlaceholder(),

  // ✏️ ABOUT 오른쪽에 들어갈 투명 PNG 이미지
  // 이미지 파일이 준비되면 이 값만 실제 경로 문자열로 교체하세요.
  // 예: aboutImage: "/images/about-image.png"
  aboutImage: graphicPlaceholder("ABOUT IMAGE"),

  // ✏️ CONNECT 왼쪽에 들어갈 투명 PNG 이미지
  // 예: connectImage: "/images/connect-image.png"
  connectImage: graphicPlaceholder("CONNECT IMAGE"),

  // ✏️ HOME 하단 대형 타이포그래피 PNG
  // Illustrator / Photoshop 등에서 만든 투명 PNG 이미지 경로를 넣으세요.
  // 비워두면("") 아무 것도 렌더링하지 않습니다 — placeholder box 없이, 실제 PNG 파일을
  // 넣었을 때만 그 자리에 나타나는 순수한 구조입니다.
  homeTypographyImage: "/images/home-typography.png",

  // ✏️ WORKS 화면 상단 왼쪽의 크고 단순한 Main Title 텍스트 (예: "Other °"의 "Other °" 자리)
  worksHeadline: "WORKS",

  // ✏️ WORKS 페이지 상단, Main Title 오른쪽에 표시되는 짧은 소개 문장
  worksDescription:
    "Motion, 3D and visual design projects exploring form, image and movement.",
};

/* =====================================
   ✏️ EDIT HERE — PROJECTS (프로젝트 추가 / 수정 / 삭제)
   -------------------------------------------------------------------------
   이 배열(projects)이 사이트의 유일한 프로젝트 데이터입니다.
   여기에 객체 하나를 추가/삭제/순서변경 하면 아래 3곳에 전부 자동으로 반영됩니다.
     1) SELECTED WORKS의 원형 Orbit (개수에 맞춰 각도가 자동으로 균등 분배됩니다)
     2) WORKS의 그리드 뷰
     3) 해당 프로젝트를 클릭했을 때 열리는 Project Detail 페이지
   즉 프로젝트마다 별도의 컴포넌트를 만들 필요가 전혀 없습니다.

   [ 기본 정보 ]
   - id            : "01", "02" ... 처럼 겹치지 않는 고유 값이면 됩니다.
   - title         : 프로젝트 제목
   - year          : 연도
   - category      : 카테고리 (Motion / Branding / 3D 등)
   - role          : 담당 역할
   - thumbnail     : ✏️ HOME(Orbit)과 WORKS 그리드에 쓰이는 작은 썸네일 이미지 경로
   - heroImage     : ✏️ 클릭했을 때 확대되며 이어지는 Detail 상단 큰 이미지(Hero) 경로
   - description   : Detail 상단에 들어가는 짧은 소개 문장

   [ Detail 페이지 레이아웃 — content 배열 ]
   Detail 페이지의 본문은 더 이상 고정된 이미지 나열이 아니라,
   아래 5가지 "블록"을 원하는 순서로 자유롭게 조립하는 방식입니다.
   content 배열 안의 순서 = 실제 Detail 페이지에 보이는 순서 입니다.
   즉 블록을 추가/삭제/순서변경 하면 Detail 페이지 레이아웃도 그대로 바뀝니다.

   1) 이미지 한 장
      { type: "image", src: "이미지경로", layout: "full" | "medium" | "small" }
      - full   : 본문 너비 전체를 채우는 큰 이미지 (대표 이미지에 적합)
      - medium : 화면 중앙에 적당히 큰 크기로 배치
      - small  : 화면 중앙에 작게 배치 (세로 이미지 등에 적합)

   2) 이미지 두 장을 나란히
      { type: "imagePair", images: ["이미지경로1", "이미지경로2"] }
      - Desktop: 좌우 2단으로 나란히 배치
      - Mobile : 자동으로 세로로 쌓입니다

   3) Vimeo 영상
      { type: "vimeo", videoId: "Vimeo 영상 ID", ratio: "16:9" }
      - videoId 자리에는 Vimeo 영상 URL의 숫자 ID만 넣으면 됩니다.
        예) https://vimeo.com/123456789  →  videoId: "123456789"
      - ratio는 생략하면 기본값 16:9가 사용되고, 세로 영상이면 "9:16"처럼 지정할 수 있습니다.
      - ⚠️ 중요: 해당 Vimeo 영상 자체에서 "이 도메인/외부 사이트에 embed(퍼가기) 허용" 설정이
        켜져 있어야 실제 사이트에서 재생됩니다. Vimeo 영상 관리 페이지의
        Privacy → Embed 설정에서 허용 여부를 확인해주세요.

   4) 설명 텍스트
      { type: "text", title: "PROCESS", text: "설명 문장..." }
      - title은 선택 사항입니다. 필요 없으면 그냥 생략하세요.

   5) 빈 여백 (Spacer)
      { type: "spacer", size: "small" | "medium" | "large" }
      - 의도적으로 큰 여백을 주고 싶을 때 사용합니다.

   지금은 실제 이미지가 없으므로 ph() 함수로 색상 placeholder를 자동 생성해서 넣어뒀습니다.
   실제 이미지 URL이 준비되면 ph(...) 부분을 "이미지 경로 문자열"로 그대로 바꿔주면 됩니다.
   예) src: ph(1400, 900, "#111", "#fff", "예시")  →  src: "/images/project01-01.jpg"
   ===================================== */

// 예시용 placeholder 이미지를 만들어주는 함수입니다.
// 실제 이미지 URL이 준비되면 이 함수 대신 이미지 경로를 직접 넣으면 됩니다.
function ph(w, h, bg, fg, label) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>` +
    `<rect width='100%' height='100%' fill='${bg}'/>` +
    `<text x='50%' y='50%' font-family='sans-serif' font-size='${Math.round(
      Math.min(w, h) / 10
    )}' fill='${fg}' text-anchor='middle' dominant-baseline='middle' letter-spacing='2'>${label}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// orbit 중앙 시그니처용 예시 placeholder (투명 배경).
// 실제 서명 PNG가 준비되면 siteInfo.signatureImage 값만 교체하면 됩니다.
function signaturePlaceholder() {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='150' viewBox='0 0 300 150'>` +
    `<text x='50%' y='54%' font-family='sans-serif' font-size='52' font-weight='600' fill='#262420' text-anchor='middle' dominant-baseline='middle' letter-spacing='2'>HJ</text>` +
    `<line x1='75' y1='100' x2='225' y2='100' stroke='#262420' stroke-width='2'/>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// ABOUT / CONNECT 오른쪽·왼쪽에 들어가는 큰 그래픽 PNG용 예시 placeholder (투명 배경).
// 실제 PNG가 준비되면 siteInfo.aboutImage / siteInfo.connectImage 값만 교체하면 됩니다.
function graphicPlaceholder(label) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='900' viewBox='0 0 800 900'>` +
    `<rect width='100%' height='100%' fill='transparent'/>` +
    `<circle cx='400' cy='420' r='260' fill='none' stroke='#3a3a3a' stroke-width='2'/>` +
    `<line x1='220' y1='420' x2='580' y2='420' stroke='#3a3a3a' stroke-width='2'/>` +
    `<text x='50%' y='860' font-family='sans-serif' font-size='22' fill='#6b6b6b' text-anchor='middle' letter-spacing='2'>${label}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}


const palette = [
  ["#c9c2b4", "#4a4640"],
  ["#a9a99d", "#3d3d36"],
  ["#8f978c", "#33372f"],
  ["#b8a89a", "#463b31"],
  ["#9aa3ab", "#333a41"],
  ["#c3b19a", "#453a29"],
  ["#8b8f96", "#2f3236"],
  ["#af9f8d", "#3f342a"],
  // ✏️ 09~12번 테스트용 프로젝트에서 사용하는 팔레트 — 필요하면 계속 이어서 추가하세요
  ["#b0b6a8", "#3a3f34"],
  ["#c7ab8f", "#42342a"],
  ["#9c9fa8", "#33353d"],
  ["#bfa9a0", "#40312c"],
];

const projects = [
  {
    id: "01",
    title: "MOTION STUDY",
    year: "2026",
    category: "Motion",
    role: "3D / Motion Design",
    // ✏️ 썸네일 교체 위치 (Orbit / WORKS 그리드에 쓰이는 작은 이미지)
    thumbnail: ph(600, 750, palette[0][0], palette[0][1], "01"),
    // ✏️ Hero 이미지 교체 위치 (Detail 상단 큰 이미지)
    heroImage: ph(1600, 1000, palette[0][0], palette[0][1], "MOTION STUDY"),
    description:
      "형태와 시간의 관계를 다루는 개인 모션 스터디 시리즈입니다. 정지된 오브젝트가 움직임을 통해 새로운 의미를 획득하는 과정을 실험했습니다.",
    // ✏️ Detail 페이지 레이아웃 예시 — 이 순서 그대로 화면에 렌더링됩니다.
    content: [
      // 대표 이미지 (전체 너비)
      { type: "image", layout: "full", src: ph(1600, 1000, palette[0][0], palette[0][1], "Full Image") },

      // Vimeo 영상 — videoId 자리에 실제 Vimeo 영상 ID를 넣어주세요
      { type: "vimeo", videoId: "76979871", ratio: "16:9" },

      // 이미지 두 장 나란히
      {
        type: "imagePair",
        images: [
          ph(1000, 1250, palette[0][0], palette[0][1], "Pair 01"),
          ph(1000, 1250, palette[0][0], palette[0][1], "Pair 02"),
        ],
      },

      // 설명 텍스트 (title은 선택 사항)
      {
        type: "text",
        title: "PROCESS",
        text: "프로젝트 제작 과정에 대한 설명입니다. 리서치부터 최종 완성까지의 흐름을 자유롭게 적어주세요.",
      },

      // 중간 크기 이미지 (화면 중앙에 배치)
      { type: "image", layout: "medium", src: ph(1100, 850, palette[0][0], palette[0][1], "Medium Image") },

      // 큰 여백
      { type: "spacer", size: "large" },

      // 마무리 대표 이미지
      { type: "image", layout: "full", src: ph(1600, 1000, palette[0][0], palette[0][1], "Closing Image") },
    ],
  },
  {
    id: "02",
    title: "IDENTITY SYSTEM",
    year: "2025",
    category: "Branding",
    role: "Visual Identity",
    thumbnail: ph(600, 750, palette[1][0], palette[1][1], "02"),
    heroImage: ph(1600, 1000, palette[1][0], palette[1][1], "IDENTITY SYSTEM"),
    description:
      "가변적인 그리드 시스템을 기반으로 한 브랜드 아이덴티티 작업입니다. 로고, 컬러, 타이포그래피가 상황에 따라 유동적으로 재구성됩니다.",
    content: [
      { type: "image", layout: "full", src: ph(1400, 900, palette[1][0], palette[1][1], "Detail 01") },
      {
        type: "imagePair",
        images: [
          ph(1000, 1250, palette[1][0], palette[1][1], "Pair 01"),
          ph(1000, 1250, palette[1][0], palette[1][1], "Pair 02"),
        ],
      },
      { type: "text", title: "PROCESS", text: "그리드 시스템을 정의하고 다양한 매체에 적용한 과정입니다." },
      { type: "image", layout: "full", src: ph(1400, 900, palette[1][0], palette[1][1], "Detail 02") },
    ],
  },
  {
    id: "03",
    title: "FIELD RECORDING",
    year: "2025",
    category: "Motion",
    role: "Direction / Edit",
    thumbnail: ph(600, 750, palette[2][0], palette[2][1], "03"),
    heroImage: ph(1600, 1000, palette[2][0], palette[2][1], "FIELD RECORDING"),
    description:
      "도시의 소리와 이미지를 채집하여 재구성한 실험적 영상 작업입니다. 편집을 통해 일상의 리듬을 다시 배열했습니다.",
    content: [
      { type: "image", layout: "full", src: ph(1400, 900, palette[2][0], palette[2][1], "Detail 01") },
      { type: "vimeo", videoId: "76979871", ratio: "16:9" },
      { type: "spacer", size: "medium" },
      { type: "image", layout: "small", src: ph(900, 1500, palette[2][0], palette[2][1], "Detail 02") },
    ],
  },
  {
    id: "04",
    title: "PACKAGING SERIES",
    year: "2024",
    category: "Product",
    role: "Package Design",
    thumbnail: ph(600, 750, palette[3][0], palette[3][1], "04"),
    heroImage: ph(1600, 1000, palette[3][0], palette[3][1], "PACKAGING SERIES"),
    description:
      "미니멀한 조형언어로 제품의 본질을 전달하는 패키지 디자인 시리즈입니다. 색과 형태만으로 브랜드를 구분할 수 있도록 설계했습니다.",
    content: [
      { type: "image", layout: "full", src: ph(1400, 900, palette[3][0], palette[3][1], "Detail 01") },
      {
        type: "imagePair",
        images: [
          ph(1000, 1250, palette[3][0], palette[3][1], "Pair 01"),
          ph(1000, 1250, palette[3][0], palette[3][1], "Pair 02"),
        ],
      },
      { type: "image", layout: "medium", src: ph(1100, 850, palette[3][0], palette[3][1], "Detail 02") },
    ],
  },
  {
    id: "05",
    title: "TYPE EXPERIMENT",
    year: "2024",
    category: "Type",
    role: "Typography",
    thumbnail: ph(600, 750, palette[4][0], palette[4][1], "05"),
    heroImage: ph(1600, 1000, palette[4][0], palette[4][1], "TYPE EXPERIMENT"),
    description:
      "글자의 구조를 해체하고 재조립하는 실험적 타이포그래피 프로젝트입니다. 가독성과 조형성 사이의 균형을 탐구했습니다.",
    content: [
      { type: "image", layout: "full", src: ph(1400, 900, palette[4][0], palette[4][1], "Detail 01") },
      { type: "text", title: "PROCESS", text: "글자의 골격을 해체하고 다시 조합하는 실험 과정을 기록했습니다." },
      { type: "image", layout: "small", src: ph(900, 1500, palette[4][0], palette[4][1], "Detail 02") },
    ],
  },
  {
    id: "06",
    title: "SPATIAL LAYERS",
    year: "2024",
    category: "3D",
    role: "3D Visualization",
    thumbnail: ph(600, 750, palette[5][0], palette[5][1], "06"),
    heroImage: ph(1600, 1000, palette[5][0], palette[5][1], "SPATIAL LAYERS"),
    description:
      "물성과 레이어의 관계를 다룬 3D 비주얼라이제이션 작업입니다. 빛과 그림자가 만드는 깊이를 실험했습니다.",
    content: [
      { type: "image", layout: "full", src: ph(1400, 900, palette[5][0], palette[5][1], "Detail 01") },
      { type: "vimeo", videoId: "76979871", ratio: "16:9" },
      {
        type: "imagePair",
        images: [
          ph(1000, 1250, palette[5][0], palette[5][1], "Pair 01"),
          ph(1000, 1250, palette[5][0], palette[5][1], "Pair 02"),
        ],
      },
    ],
  },
  {
    id: "07",
    title: "EDITORIAL LAYOUT",
    year: "2023",
    category: "Editorial",
    role: "Art Direction",
    thumbnail: ph(600, 750, palette[6][0], palette[6][1], "07"),
    heroImage: ph(1600, 1000, palette[6][0], palette[6][1], "EDITORIAL LAYOUT"),
    description:
      "여백과 이미지의 리듬으로 이야기를 전달하는 에디토리얼 레이아웃 작업입니다.",
    content: [
      { type: "image", layout: "full", src: ph(1400, 900, palette[6][0], palette[6][1], "Detail 01") },
      { type: "spacer", size: "small" },
      { type: "image", layout: "medium", src: ph(1100, 850, palette[6][0], palette[6][1], "Detail 02") },
      { type: "text", title: "LAYOUT", text: "그리드와 여백의 비율을 조정해 시선의 흐름을 설계했습니다." },
    ],
  },
  {
    id: "08",
    title: "OBJECT STUDY",
    year: "2023",
    category: "Product",
    role: "3D / Rendering",
    thumbnail: ph(600, 750, palette[7][0], palette[7][1], "08"),
    heroImage: ph(1600, 1000, palette[7][0], palette[7][1], "OBJECT STUDY"),
    description:
      "일상적인 오브젝트를 낯설게 재해석한 3D 렌더링 스터디입니다.",
    content: [
      { type: "image", layout: "full", src: ph(1400, 900, palette[7][0], palette[7][1], "Detail 01") },
      {
        type: "imagePair",
        images: [
          ph(1000, 1250, palette[7][0], palette[7][1], "Pair 01"),
          ph(1000, 1250, palette[7][0], palette[7][1], "Pair 02"),
        ],
      },
      { type: "image", layout: "small", src: ph(900, 1500, palette[7][0], palette[7][1], "Detail 02") },
    ],
  },
  // ✏️ 09~12번 — Gallery의 horizontal overflow / mouse-edge pan 동작을 테스트하기 위해 추가한
  // 임시 프로젝트입니다. 다른 프로젝트와 완전히 동일한 구조이므로, 실제 프로젝트로 교체하거나
  // 이 아래에 13번, 14번을 계속 이어서 추가해도 SELECTED WORKS / WORKS / Detail 전부 자동으로 반영됩니다.
  {
    id: "09",
    title: "COLOR STUDY",
    year: "2026",
    category: "Branding",
    role: "Color / Visual Identity",
    thumbnail: ph(600, 750, palette[8][0], palette[8][1], "09"),
    heroImage: ph(1600, 1000, palette[8][0], palette[8][1], "COLOR STUDY"),
    description:
      "한정된 색채 팔레트만으로 브랜드의 톤을 구분하는 실험적 컬러 스터디입니다. 색의 조합이 만드는 인상의 차이를 기록했습니다.",
    content: [
      { type: "image", layout: "full", src: ph(1400, 900, palette[8][0], palette[8][1], "Detail 01") },
      {
        type: "imagePair",
        images: [
          ph(1000, 1250, palette[8][0], palette[8][1], "Pair 01"),
          ph(1000, 1250, palette[8][0], palette[8][1], "Pair 02"),
        ],
      },
      { type: "text", title: "PROCESS", text: "동일한 레이아웃에 팔레트만 바꿔가며 인상의 변화를 비교한 과정입니다." },
    ],
  },
  {
    id: "10",
    title: "SOUND PATTERN",
    year: "2025",
    category: "Motion",
    role: "Motion / Sound Design",
    thumbnail: ph(600, 750, palette[9][0], palette[9][1], "10"),
    heroImage: ph(1600, 1000, palette[9][0], palette[9][1], "SOUND PATTERN"),
    description:
      "사운드의 파형을 시각적 리듬으로 변환한 모션 그래픽 작업입니다. 소리와 움직임이 같은 박자로 호흡하도록 설계했습니다.",
    content: [
      { type: "image", layout: "full", src: ph(1400, 900, palette[9][0], palette[9][1], "Detail 01") },
      { type: "vimeo", videoId: "76979871", ratio: "16:9" },
      { type: "spacer", size: "medium" },
      { type: "image", layout: "small", src: ph(900, 1500, palette[9][0], palette[9][1], "Detail 02") },
    ],
  },
  {
    id: "11",
    title: "SURFACE TEXTURE",
    year: "2025",
    category: "3D",
    role: "3D / Material Study",
    thumbnail: ph(600, 750, palette[10][0], palette[10][1], "11"),
    heroImage: ph(1600, 1000, palette[10][0], palette[10][1], "SURFACE TEXTURE"),
    description:
      "빛에 반응하는 다양한 표면 질감을 3D로 재현한 머티리얼 스터디입니다. 같은 형태라도 표면에 따라 완전히 다른 인상을 갖습니다.",
    content: [
      { type: "image", layout: "full", src: ph(1400, 900, palette[10][0], palette[10][1], "Detail 01") },
      {
        type: "imagePair",
        images: [
          ph(1000, 1250, palette[10][0], palette[10][1], "Pair 01"),
          ph(1000, 1250, palette[10][0], palette[10][1], "Pair 02"),
        ],
      },
      { type: "image", layout: "medium", src: ph(1100, 850, palette[10][0], palette[10][1], "Detail 02") },
    ],
  },
  {
    id: "12",
    title: "GRID SYSTEM",
    year: "2024",
    category: "Editorial",
    role: "Layout / Art Direction",
    thumbnail: ph(600, 750, palette[11][0], palette[11][1], "12"),
    heroImage: ph(1600, 1000, palette[11][0], palette[11][1], "GRID SYSTEM"),
    description:
      "가변 그리드를 기반으로 콘텐츠의 밀도에 따라 유동적으로 재배열되는 에디토리얼 시스템입니다.",
    content: [
      { type: "image", layout: "full", src: ph(1400, 900, palette[11][0], palette[11][1], "Detail 01") },
      { type: "text", title: "LAYOUT", text: "그리드의 열 수와 여백 비율을 콘텐츠 유형별로 다르게 설계했습니다." },
      { type: "image", layout: "small", src: ph(900, 1500, palette[11][0], palette[11][1], "Detail 02") },
      { type: "spacer", size: "small" },
      { type: "image", layout: "medium", src: ph(1100, 850, palette[11][0], palette[11][1], "Detail 03") },
    ],
  },
];

/* =========================================================================
   여기서부터는 사이트 동작을 담당하는 코드입니다.
   코딩에 익숙하지 않다면 이 아래 부분은 수정하지 않는 것을 권장합니다.
   ========================================================================= */

const GLOBAL_CSS = `
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');

  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }

  .pf-root {
    /* 사이트 전체에서 공유하는 좌우/상단 여백 시스템 — 헤더, 섹션, 상세페이지가 모두 이 값을 기준으로 정렬됩니다 */
    --page-pad-x: clamp(28px, 4vw, 72px);
    --page-pad-top: clamp(24px, 3.2vw, 44px);

    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif;
    background: #ffffff;
    color: #262420;
    -webkit-font-smoothing: antialiased;
    font-weight: 400;
    width: 100%;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }

  .pf-root, .pf-root * { font-style: normal !important; }

  .pf-noscroll { overflow: hidden; height: 100vh; }

  /* ---------- HOME ---------- */
  .pf-home-view { width: 100%; }

  .pf-hero {
    position: relative;
    width: 100%;
    /* SELECTED WORKS 첫 화면 안에서 프로젝트 스트립 + 대형 Typography를 함께 보이게 유지합니다. */
    height: 100vh;
    min-height: 760px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* WORKS 그리드 뷰가 선택되면 hero 영역이 100vh에 갇히지 않고 그리드 내용만큼 자연스럽게 늘어납니다 */
  .pf-hero.pf-hero-works {
    height: auto;
    min-height: 100vh;
    padding-bottom: 96px;
  }

  /* 탭 전환 시 짧고 부드러운 fade + 살짝 위로 올라오는 진입 모션 (0.32초) */
  @keyframes pf-view-fade {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .pf-view-fade-in { animation: pf-view-fade 0.32s ease both; }

  /* Gallery(.pf-gallery-wrap)는 opacity를 project open/close 전환에서 별도로 제어하므로,
     탭 전환 진입 모션은 opacity와 충돌하지 않도록 transform만 애니메이션합니다 */
  @keyframes pf-view-slide {
    from { transform: translateY(8px); }
    to { transform: translateY(0); }
  }
  .pf-view-slide-in { animation: pf-view-slide 0.32s ease both; }

  /* 상단 Header — 왼쪽(로고) / 가운데(탭) / 오른쪽(메일 링크) 3개 영역을 각각 독립적으로 정렬하는
     CSS grid입니다. space-between으로 "우연히" 가운데처럼 보이게 하는 대신, 가운데 컬럼을 auto로
     두고 좌우를 동일한 1fr로 맞춰 탭 그룹이 실제 viewport(정확히는 페이지 좌우 여백을 뺀 콘텐츠
     영역)의 진짜 수평 중앙에 오도록 합니다. 레퍼런스처럼 버튼/네비게이션 바가 아니라 작은
     editorial index text 한 줄이 배경 위에 바로 놓인 느낌을 위해 background/border/box-shadow가
     전혀 없습니다 */
  .pf-header {
    position: absolute;
    top: var(--page-pad-top);
    /* 좌우 상단 텍스트를 기존보다 살짝 안쪽으로 — 양쪽 동일하게 18px 추가해 가운데 탭 중심은 그대로 유지 */
    left: calc(var(--page-pad-x) + 18px);
    right: calc(var(--page-pad-x) + 18px);
    z-index: 20;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    column-gap: 16px;
  }

  /* 왼쪽 이름 라벨 — 버튼/pill이 아닌, 배경 위에 바로 놓인 아주 작은 editorial 텍스트입니다.
     border/background/border-radius 전부 없고, padding도 거의 없이 텍스트 그 자체만 존재합니다 */
  .pf-logo {
    justify-self: start;
    display: inline-flex;
    align-items: center;
    line-height: 1;
    background: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    margin: 0;
    font-family: inherit;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: #000000;
    white-space: nowrap;
  }

  /* 오른쪽 "SEND ME A MESSAGE" — 외부로 나가는 mailto: 링크가 아니라, 클릭하면 같은 페이지 안의
     Contact 섹션(#contact)으로 smooth scroll 이동하는 버튼입니다. underline은 기본 상태/hover
     상태 어디에도 전혀 없고, 순수하게 검정 텍스트만 보입니다(border/background/pill도 없음) */
  .pf-header-contact {
    justify-self: end;
    display: inline-flex;
    align-items: center;
    line-height: 1;
    background: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: #000000;
    text-decoration: none;
    white-space: nowrap;
  }

  /* 오른쪽 상단: SEND ME A MESSAGE 아래에 SNS를 세로로 붙인 작은 editorial stack */
  .pf-header-right {
    justify-self: end;
    display: flex;
    flex-direction: column;
    /* SEND ME A MESSAGE의 왼쪽 edge를 기준으로 SNS도 왼쪽 정렬 */
    align-items: flex-start;
    gap: 8px;
  }

  .pf-header-right .pf-header-contact {
    justify-self: auto;
  }

  .pf-header-social {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: 4px;
  }

  .pf-header-social a {
    font-family: inherit;
    font-size: 9px;
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: 0.02em;
    color: #000000;
    text-decoration: none;
    white-space: nowrap;
    transition: opacity 0.2s ease;
  }

  .pf-header-social a:hover { opacity: 0.5; }

  /* HOME 왼쪽 하단 Instagram / Behance 링크 — 버튼/pill이 아닌 단순한 텍스트 링크 목록.
     이제 더 이상 페이지 여백(--page-pad-x) 기준의 독립된 fixed 위치가 아니라, 아래 .pf-home-bottom-graphic
     wrapper 안에서 Typography PNG의 왼쪽 바로 위쪽에 작게 붙습니다(같은 wrapper에 묶여 있으므로
     Typography PNG 위치가 반응형으로 바뀌면 SNS도 항상 함께 움직입니다) — position/left/bottom은
     .pf-home-bottom-graphic 규칙에서 정의됩니다 */
  .pf-home-social {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .pf-home-social-item {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    text-decoration: none;
    background: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    transition: transform 0.25s ease;
  }

  .pf-home-social-item:hover {
    transform: translateX(3px);
  }

  /* "01", "02" 인덱스 — 플랫폼명보다 작고 옅은, 단순한 순번 느낌 */
  .pf-home-social-index {
    font-family: inherit;
    font-size: 10px;
    font-weight: 400;
    color: #9a958b;
    letter-spacing: 0.02em;
  }

  /* 플랫폼명 — 인덱스보다 크고 조금 더 진하지만(semibold), 버튼/pill 없이 조밀한 텍스트 링크 그대로 */
  .pf-home-social-name {
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    color: #111111;
    letter-spacing: 0.01em;
    text-transform: uppercase;
  }

  /* 가운데 SELECTED WORKS / WORKS 탭 그룹 — 버튼/pill UI가 아니라 "SELECTED WORKS, WORKS"처럼 한 줄로
     이어지는 작은 editorial 텍스트 링크입니다. 쉼표(.pf-tab-sep)는 순수 구분자 텍스트일 뿐 클릭
     대상이 아닙니다. .pf-header의 가운데(auto) grid column에 놓여 실제 콘텐츠 영역의 수평 중앙에
     정렬됩니다(space-between으로 우연히 가운데처럼 보이는 방식이 아닙니다) */
  .pf-tab-group {
    justify-self: center;
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .pf-tab-link {
    display: inline-flex;
    align-items: center;
    line-height: 1;
    background: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 11px;
    letter-spacing: 0.02em;
    white-space: nowrap;
    /* inactive 상태: gray + regular — HOME에서 회색이 허용되는 유일한 자리입니다 */
    color: #999999;
    font-weight: 400;
    transition: color 0.25s ease, font-weight 0.25s ease;
  }

  /* active 상태는 검정 배경 캡슐이 아니라, 색과 굵기만으로 아주 미묘하게 구분합니다 */
  .pf-tab-link.pf-tab-active {
    color: #000000;
    font-weight: 600;
  }

  .pf-tab-sep {
    font-family: inherit;
    font-size: 11px;
    color: #999999;
    letter-spacing: 0.02em;
  }

  /* ---------- Expanding / Accordion Gallery (구 Orbit 자리) ----------
     레퍼런스처럼 기본 상태는 낮고 가로로 이어진 image strip이고, hover한 프로젝트만
     width와 height가 동시에 커지며 아래쪽으로 돌출됩니다. Gallery의 top은 항상 고정되어 있어서
     (justify-content:flex-end나 center를 쓰지 않음) 확장은 오직 "아래 방향"으로만 일어납니다.
     Typography PNG는 Gallery와 별개로 wrap 하단에 고정 배치되어, hover로 아래로 자란 이미지가
     그 위를 자연스럽게 덮는 composition을 만듭니다. */
  .pf-gallery-wrap {
    /* IMPORTANT: keep this wrapper OUT of the positioning context for the bottom graphic.
       The typography/SNS layer must be anchored to .pf-hero (100vh), not to the gallery's
       changing content height. This prevents it from dropping down when a project expands. */
    position: static;
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    /* HOME 중간~하단에 위치하도록 상단에 넉넉한 여백을 두되, 이 top 기준점은 hover 여부와 무관하게
       항상 고정됩니다 — 그래야 hover 확장이 위로도 같이 움직이지 않고 순수하게 아래로만 자랍니다 */
    padding-top: clamp(145px, 21vh, 245px);
    /* 하단 SNS(INSTAGRAM/BEHANCE) + 대형 Typography PNG가 함께 들어갈 공간을 미리 넉넉히 확보합니다.
       이 값이 너무 작으면 PNG가 커질수록 위쪽 project image strip과 겹칠 수 있으므로, 아래
       --home-type-* 값들과 세트로 맞춰 조정하세요(자세한 계산은 .pf-home-bottom-graphic 주석 참고) */
    padding-bottom: 0;

    /* ✏️ 대형 Typography PNG(+ 바로 위 SNS) 위치/크기 조정 — 이 값들만 바꾸면 됩니다.
       (이 wrap의 높이는 hover와 무관하게 고정이므로, Typography 위치도 함께 흔들리지 않습니다)
       Desktop 기준 viewport 가로폭의 대부분을 차지하도록 96vw까지 크게 키우되, 원본 비율이 찌그러지지
       않도록 width만 지정하고 height는 이미지 쪽에서 auto로 둡니다. --home-type-bottom은 진짜 화면
       맨 아래(hero bottom)로부터의 작은 여백이고, --home-type-max-height는 PNG가 아무리 세로로 긴
       비율이어도 위 project image strip과 절대 겹치지 않도록 하는 안전장치입니다(비율은 유지된 채
       필요할 때만 폭도 함께 줄어듭니다) */
    /* Full-bleed typography: use the entire viewport width with no desktop max-width cap. */
    --home-type-width: 100vw;
    --home-type-left: 50%;
    --home-type-bottom: 0px;
    --home-type-max-height: none;
    --home-type-opacity: 1;

    /* ✏️ Gallery 기본 thumbnail 폭 — .pf-gallery-item에서 이 값 하나만 참조합니다. Gallery가 이제
       viewport 전체 폭(100vw)에 걸친 full-bleed strip이므로, 이 값의 vw 비율 자체가 "한 화면에 몇
       개가 보이는지"를 결정합니다 — 14vw는 100vw ÷ 14vw ≈ 7.1, 즉 화면 크기와 무관하게 항상 대략
       7개가 자연스럽게 보이도록 계산된 비율입니다(정확히 7개를 강제하는 것은 아닙니다) */
    --pf-gallery-item-w: clamp(140px, 14vw, 230px);
    /* ✏️ 프로젝트 카드 사이의 gap — 완전히 0으로 두어, 썸네일들이 서로 정확히 맞닿아 하나의
       연속된 horizontal image strip처럼 보이게 합니다(레퍼런스와 동일). "카드 사이 여백"이 아니라
       "Gallery 앞뒤의 넉넉한 vertical whitespace"로 레퍼런스의 여백감을 표현합니다 — 이 gap을
       늘려서 여백을 만들지 않습니다 */
    --pf-gallery-gap: 0px;
  }

  /* ✏️ Full-bleed: Gallery는 어떤 max-width 컨테이너에도 갇히지 않고 viewport 양쪽 끝에 정확히
     닿아야 합니다(레퍼런스와 동일). .pf-gallery-wrap이나 상위 .pf-hero는 좌우 padding이 전혀 없어
     이미 100% 폭이지만, 혹시 모를 상위 constraint에도 안전하도록 position:relative + left:50% +
     width:100vw + translateX(-50%) breakout 기법을 그대로 적용합니다. 이 100vw가 스크롤바 폭만큼
     실제 가시 영역보다 살짝 넓어져도, 상위 .pf-hero의 overflow:hidden이 그 초과분을 좌우 대칭으로
     깔끔하게 잘라내므로 페이지 레벨 가로 스크롤이 생기지 않습니다.
     프로젝트가 몇 개든 thumbnail 크기(--pf-gallery-item-w)는 항상 고정이며, 12개를 전부 욱여넣지
     않고 화면을 넘는 나머지는 이 full-bleed strip의 오른쪽 바깥에 그대로 존재하며 hover-follow /
     mouse-pan으로 탐색합니다(01, 12번은 viewport 끝에서 일부 잘려 보일 수 있습니다) */
  .pf-gallery-viewport {
    position: relative;
    left: 50%;
    width: 100vw;
    transform: translateX(-50%);
    z-index: 3;
    /* height를 고정하지 않고 내용(row)에 맞춰 자연스럽게 늘어나므로, hover로 이미지가 아래로
       확장되어도 세로 방향으로는 잘리지 않습니다. 가로 스크롤만 필요합니다 */
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .pf-gallery-viewport::-webkit-scrollbar { display: none; height: 0; }

  /* width:max-content로 컨텐츠 실제 폭만큼 늘어나고, 대부분의 경우(12개 프로젝트) viewport보다
     넓어져 자연스럽게 왼쪽부터 가로 스크롤됩니다(첫 프로젝트가 왼쪽 끝에 닿고, 남는 프로젝트는
     오른쪽 화면 밖으로 이어짐 — 레퍼런스처럼 첫/마지막 프로젝트가 viewport 끝에서 잘려 보일 수
     있습니다). align-items:flex-start로 모든 프로젝트의 정보/이미지 상단을 동일 라인에 맞추고,
     hover한 프로젝트만 이 라인에서부터 아래로 자라나게 합니다.
     gap은 --pf-gallery-gap(hairline)만 둬서, 레퍼런스처럼 기본 썸네일들이 거의 붙어 하나의
     horizontal image strip처럼 보이게 합니다 */
  .pf-gallery-row {
    position: relative;
    z-index: 3;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: var(--pf-gallery-gap);
    width: max-content;
    min-width: 100%;
    margin: 0 auto;
  }

  /* 기본 상태: 고정된 비율/최소 크기를 가진 horizontal strip. viewport가 좁아져도 이 크기 아래로는
     줄어들지 않고(flex-shrink:0), 대신 Gallery 전체가 horizontal overflow로 처리됩니다 —
     "viewport가 작아짐 → 세로로 찌그러짐"이 아니라 "viewport가 작아짐 → 일부가 화면 밖으로" 구조입니다.
     hover(desktop)/tap(mobile) 시 width(flex-basis)가 커지고, height는 아래 .pf-gallery-media의
     aspect-ratio에 의해 폭에 비례해서만 커지므로 항상 같은 비율을 유지합니다 */
  .pf-gallery-item {
    position: relative;
    flex: 0 0 var(--pf-gallery-item-w);
    flex-shrink: 0;
    /* flex item의 기본 min-width는 auto(= 내부 콘텐츠의 min-content)라서, 긴 텍스트가 있으면
       flex-basis를 무시하고 컬럼이 제멋대로 넓어집니다. 0으로 리셋해 flex-basis가 항상 그대로 적용되게 합니다 */
    min-width: 0;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: flex-basis 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* hover된 프로젝트는 기본(--pf-gallery-item-w) 대비 정확히 약 2배로 커집니다 — vw 계수(28vw =
     14vw×2)와 clamp 상/하한(base×2)을 그대로 2배로 맞춰서, 화면 크기가 바뀌어도 확대 비율이 항상
     일정하게 유지됩니다. 화면의 절반 이상을 차지하거나 아래 Typography/SNS 영역을 크게 덮지 않는
     정도의 확대입니다 */
  .pf-gallery-item.pf-gallery-active {
    flex-basis: clamp(280px, 28vw, 460px);
  }

  /* "01.  /  PROJECT TITLE  /  [CATEGORY]" — 각 컬럼 이미지의 왼쪽 edge에 맞춰 세로로 쌓입니다.
     min-height로 1줄/2줄 타이틀 길이와 무관하게 모든 이미지의 상단이 동일한 라인에 정렬되게 합니다 */
  .pf-gallery-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: 6px;
    margin-bottom: 14px;
    /* 제목이 2줄로 넘어가도 모든 컬럼의 info 영역 높이가 같아지도록 넉넉한 최소 높이를 둡니다 —
       그래야 바로 아래의 이미지 상단이 항상 동일한 라인에 정렬됩니다 */
    min-height: clamp(64px, 7.5vw, 84px);
  }

  /* ✏️ Project Gallery 텍스트(번호/제목/카테고리)는 셋 다 예외 없이 완전한 검정 #000000입니다 —
     이 영역에는 gray/beige/muted 톤을 사용하지 않습니다(회색이 허용되는 곳은 상단 중앙 navigation의
     선택되지 않은 카테고리 하나뿐입니다) */
  .pf-gallery-index {
    font-size: 11px;
    font-weight: 400;
    color: #000000;
    letter-spacing: 0.02em;
    margin-bottom: 2px;
  }

  .pf-gallery-title {
    font-size: 13px;
    font-weight: 600;
    color: #000000;
    letter-spacing: 0.01em;
    line-height: 1.3;
    white-space: normal;
    word-break: keep-all;
    overflow-wrap: break-word;
  }

  .pf-gallery-category {
    font-size: 10px;
    font-weight: 400;
    color: #000000;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  /* height를 별도로 지정하지 않고 aspect-ratio로 width에 비례해서만 정해지도록 합니다.
     그래야 항상 같은 사각형 비율을 유지하면서, width(flex-basis) transition만으로 height도
     자연스럽게 함께 커지고 작아집니다 — viewport가 좁아져도 세로로 긴 strip이 되지 않는 핵심 장치입니다.
     이미지 비율은 object-fit:cover로 유지되며(찌그러짐 없음), container 크기 변화에 맞춰
     자연스럽게 crop/reveal 됩니다 */
  .pf-gallery-media {
    position: relative;
    overflow: hidden;
    background: #e7e1d5;
    width: 100%;
    aspect-ratio: 0.8 / 1;
  }

  .pf-gallery-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    -webkit-user-drag: none;
    user-select: none;
  }

  .pf-gallery-media.pf-clicked-hide { opacity: 0 !important; }

  /* ✏️ HOME 하단 대형 타이포그래피 PNG + 그 바로 위 왼쪽의 SNS 링크를 하나로 묶는 graphic layer —
     Gallery와 별개의 독립 layer로 wrap 하단에 고정 배치됩니다(Gallery의 hover 확장에 영향받지 않는
     좌표계). z-index를 Gallery(3)보다 낮게 두어, hover로 아래로 자란 프로젝트 이미지가 이 위로
     자연스럽게 겹쳐 보이도록 합니다. wrapper 자체는 pointer-events:none이라 PNG의 투명한/빈 영역을
     클릭해도 아무 반응이 없고, 아래 .pf-home-social만 다시 pointer-events:auto로 되살려 실제 SNS
     링크는 항상 클릭 가능합니다 */
  .pf-home-bottom-graphic {
    /* 첫 화면 안에서 프로젝트 스트립 바로 아래부터 viewport bottom까지를 Typography 전용 영역으로 사용합니다.
       Gallery hover와는 독립된 absolute layer라 프로젝트가 커져도 위치가 내려가지 않습니다. */
    position: absolute;
    left: 0;
    right: 0;
    top: 55vh;
    bottom: 0;
    width: 100vw;
    max-width: none;
    transform: none;
    opacity: var(--home-type-opacity);
    pointer-events: none;
    z-index: 1;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow: hidden;
  }

  /* SNS는 wrapper 왼쪽 끝(Typography PNG의 왼쪽 edge)에 맞춰, PNG 바로 위쪽에 아주 작은 간격만
     두고 붙습니다 — 별도의 footer처럼 떨어져 보이지 않도록 같은 wrapper 좌표계를 그대로 사용합니다.
     z-index:2로 PNG(z-index 없음=기본값)보다는 위, Gallery(z-index:3)보다는 아래에 위치합니다 */
  .pf-home-bottom-graphic .pf-home-social {
    position: absolute;
    left: 0;
    bottom: 100%;
    margin-bottom: 10px;
    pointer-events: auto;
    z-index: 2;
  }

  /* ✏️ 실제 Typography PNG 이미지 — placeholder box/텍스트/배경/border 없이, siteInfo.homeTypographyImage가
     비어있지 않을 때만 이 <img> 자체가 렌더링됩니다. 원본 비율이 찌그러지지 않도록 width만 100%로
     채우고 height는 auto로 두되, max-height를 안전장치로 함께 둡니다 — PNG가 가로로 넓고 낮은 비율이면
     width(96vw)가 그대로 적용되고, 혹시 세로로 긴 비율의 PNG를 넣더라도 max-height에서 막히면서
     비율을 유지한 채 폭도 함께 자동으로 줄어들어(브라우저의 대체 요소 aspect-ratio 처리 방식) 위
     project image strip과 절대 겹치지 않습니다 */
  .pf-home-typography-image {
    display: block;
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    margin: 0;
    padding: 0;
    object-fit: contain;
    object-position: center bottom;
    pointer-events: none;
  }

  /* ---------- WORKS grid view (compact editorial archive) ---------- */
  /* 화면 전체를 쓰는 SELECTED WORKS의 full-bleed Gallery와 달리, WORKS는 좌우로
     var(--page-pad-x) 여백을 유지하는 넓은(desktop 기준 약 90~94vw) canvas입니다 */
  .pf-works-wrap {
    width: 100%;
    padding: 0 var(--page-pad-x);
    padding-top: clamp(120px, 15vw, 190px);
  }

  /* 상단 인트로 영역 — 레퍼런스처럼 왼쪽(큰 Main Title) / 가운데(짧은 소개 문장) /
     오른쪽(SNS 링크) 3개 컬럼으로 나뉩니다. 소개 문장/SNS가 비어 있어도 grid 자체는
     깨지지 않고, 해당 셀만 비어 보입니다 */
  .pf-works-intro {
    display: grid;
    grid-template-columns: 1.5fr 1fr 0.7fr;
    align-items: start;
    column-gap: 24px;
    margin-bottom: clamp(40px, 5vw, 72px);
  }

  /* 왼쪽 컬럼 — 크고 단순한 Main Title. 초대형 hero typography가 아니라, 프로젝트 정보보다는
     확실히 크지만 화면을 덮지 않는 절제된 크기입니다 */
  .pf-works-maintitle {
    font-size: clamp(40px, 6vw, 88px);
    font-weight: 700;
    color: #000000;
    letter-spacing: -0.02em;
    line-height: 1;
    margin: 0;
  }

  /* 가운데 컬럼 — 레퍼런스의 "Other is a creative agency..."에 해당하는 짧은 소개 문장.
     siteInfo.worksDescription(EDIT AREA)에서 관리합니다 */
  .pf-works-intro-desc {
    padding-top: clamp(8px, 1vw, 14px);
    font-size: 12px;
    font-weight: 400;
    color: #000000;
    line-height: 1.7;
    max-width: 320px;
    letter-spacing: 0.01em;
  }

  /* 오른쪽 컬럼 — 아주 작고 조용한 SNS 텍스트 링크. HOME의 SNS 디자인과는 별개입니다 */
  .pf-works-intro-sns {
    display: flex;
    align-items: baseline;
    gap: 16px;
    justify-self: end;
    padding-top: clamp(8px, 1vw, 14px);
  }
  .pf-works-intro-sns a {
    font-family: inherit;
    font-size: 11px;
    font-weight: 500;
    color: #000000;
    text-decoration: none;
    letter-spacing: 0.02em;
    white-space: nowrap;
    transition: opacity 0.2s ease;
  }
  .pf-works-intro-sns a:hover { opacity: 0.55; }

  /* "SELECTED WORKS (N)" 카운트 + LATEST/OLDEST 정렬 selector가 나란히 놓이는 행 —
     인트로 바로 아래, 큰 공백 없이 이어집니다 */
  .pf-works-subrow {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    flex-wrap: wrap;
    row-gap: 12px;
    column-gap: 20px;
    margin-bottom: clamp(20px, 2.6vw, 36px);
  }

  .pf-works-count {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.01em;
    color: #000000;
  }

  /* 프로젝트 개수는 항상 projects.length 값을 그대로 표시합니다 — 절대 하드코딩하지 않습니다 */
  .pf-works-count-num {
    font-weight: 500;
    color: #000000;
    margin-left: 2px;
  }

  .pf-works-sortselector {
    display: flex;
    align-items: baseline;
    gap: 18px;
  }

  /* LATEST/OLDEST — 텍스트만 있는 정렬 selector. background/pill/border 없음 */
  .pf-works-sort-btn {
    background: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 12px;
    letter-spacing: 0.04em;
    /* 선택되지 않은 항목은 light gray + regular */
    color: #cfcfcf;
    font-weight: 400;
    transition: color 0.2s ease, font-weight 0.2s ease;
  }
  .pf-works-sort-btn.pf-works-sort-active {
    /* 선택된 항목은 black + semibold */
    color: #000000;
    font-weight: 600;
  }

  /* 3열의 조밀한 이미지 grid — 카드/그림자/border 없이 이미지끼리 거의 붙어 있습니다.
     프로젝트가 늘어나도 3개씩 자동으로 다음 행으로 넘어갑니다(projects.map() 그대로 사용) */
  .pf-works-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
  }

  .pf-works-item {
    cursor: pointer;
  }

  .pf-works-thumb {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: #eeeeee;
  }

  .pf-works-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
  }

  .pf-works-item:hover .pf-works-thumb img { transform: scale(1.035); }

  /* hover 시에만 나타나는 아주 옅은 하단 scrim — 이미지 전체를 덮는 무거운 오버레이가 아니라
     이미지 하단 일부에만 살짝 걸리는 gradient로, 그 위의 작은 텍스트가 읽히도록 돕는 용도입니다 */
  .pf-works-thumb::after {
    content: "";
    position: absolute;
    left: 0; right: 0; bottom: 0;
    height: 46%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0));
    opacity: 0;
    transition: opacity 0.25s ease;
    pointer-events: none;
  }
  .pf-works-item:hover .pf-works-thumb::after { opacity: 1; }

  /* hover 시 이미지 위에 아주 작게 뜨는 프로젝트 정보 — 큰 title 애니메이션이나 카드 UI가 아니라
     이미지 자체가 계속 주인공이 되도록 최소한의 라벨만 보여줍니다 */
  .pf-works-hover-info {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 10px;
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 0.25s ease, transform 0.25s ease;
    pointer-events: none;
    z-index: 2;
  }
  .pf-works-item:hover .pf-works-hover-info { opacity: 1; transform: translateY(0); }

  .pf-works-hover-title {
    font-size: 11px;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 0.01em;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pf-works-hover-sub {
    font-size: 9px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.86);
    letter-spacing: 0.03em;
  }

  /* ---------- Sections below the fold ---------- */
  .pf-section {
    width: 100%;
    padding: 140px var(--page-pad-x);
    border-top: 1px solid #e2e2e2;
  }

  /* ABOUT부터 Footer까지를 감싸는 하나의 이어진 Black 섹션. HOME(#F6F6F6)은 그대로 유지되고
     이 컨테이너 안에서만 배경이 검정으로, 텍스트/구분선 색이 밝은 톤으로 자동 전환됩니다. */
  .pf-dark-section {
    background: #000000;
    color: #ffffff;
  }

  .pf-dark-section .pf-section { border-top-color: rgba(255, 255, 255, 0.18); }
  .pf-dark-section .pf-section-label { color: #afafaf; }
  .pf-dark-section .pf-about-headline { color: #ffffff; }
  .pf-dark-section .pf-about-body { color: #c0c0c0; }

  .pf-dark-section .pf-career-row { border-bottom-color: rgba(255, 255, 255, 0.18); }
  .pf-dark-section .pf-career-period { color: #afafaf; }
  .pf-dark-section .pf-career-role { color: #ffffff; }
  .pf-dark-section .pf-career-place { color: #afafaf; }

  .pf-dark-section .pf-contact-email { color: #ffffff; }
  .pf-dark-section .pf-contact-email:hover { border-color: #ffffff; }
  .pf-dark-section .pf-social-list a { color: #c0c0c0; border-bottom-color: rgba(255, 255, 255, 0.35); }
  .pf-dark-section .pf-social-list a:hover { color: #ffffff; border-color: #ffffff; }
  .pf-dark-section .pf-copy-btn { color: #afafaf; border-color: rgba(255, 255, 255, 0.35); }
  .pf-dark-section .pf-copy-btn:hover { color: #ffffff; border-color: #ffffff; }

  .pf-dark-section .pf-footer { color: #afafaf; }

  .pf-section-label {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: -0.01em;
    color: #8a857b;
    margin-bottom: 40px;
  }

  /* ---------- ABOUT: 텍스트(좌) + PNG 이미지(우) 2-column 레이아웃 ---------- */
  .pf-about-layout {
    display: flex;
    align-items: center;
    gap: 64px;
  }

  .pf-about-text { flex: 1 1 56%; min-width: 260px; }

  .pf-about-image-wrap {
    flex: 1 1 40%;
    min-width: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pf-about-image-wrap img {
    width: 100%;
    height: auto;
    max-height: clamp(280px, 30vw, 480px);
    object-fit: contain;
    display: block;
    background: none;
    border: none;
    box-shadow: none;
  }

  /* About의 크고 굵은 메인 타이틀 — 본문보다 확실히 크지만 화면 전체를 덮는 hero 타이포는 아닙니다 */
  .pf-about-headline {
    font-size: clamp(26px, 3.4vw, 44px);
    font-weight: 700;
    line-height: 1.28;
    letter-spacing: -0.01em;
    white-space: pre-line;
    color: #171614;
    max-width: 820px;
    margin-bottom: 32px;
  }

  .pf-about-body {
    font-size: 15px;
    line-height: 1.6;
    font-weight: 400;
    max-width: 520px;
    white-space: pre-line;
    color: #55524b;
  }

  /* ---------- Software / Tool marquee ---------- */
  .pf-marquee {
    margin-top: 56px;
    width: 100%;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to right, transparent, #000 48px, #000 calc(100% - 48px), transparent);
    mask-image: linear-gradient(to right, transparent, #000 48px, #000 calc(100% - 48px), transparent);
  }

  .pf-marquee-track {
    display: flex;
    width: max-content;
    animation: pf-marquee-scroll 28s linear infinite;
  }

  .pf-marquee:hover .pf-marquee-track {
    animation-play-state: paused;
  }

  .pf-marquee-group {
    display: flex;
    flex-shrink: 0;
    gap: 12px;
    padding-right: 12px;
  }

  @keyframes pf-marquee-scroll {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  .pf-marquee-pill {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    background: #ffffff;
    border: 1px solid #d6d6d6;
    border-radius: 999px;
    box-shadow: none;
    background-image: none;
    padding: 8px 18px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.02em;
    color: #222222;
  }

  .pf-career-list { max-width: 780px; }

  .pf-career-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 18px 0;
    border-bottom: 1px solid #ddd6c7;
    gap: 24px;
  }

  /* Year/Meta: 11~13px, Position: 14~16px medium, Company: 12~14px regular — 프로젝트 작업물보다 시각적으로 강하지 않게 */
  .pf-career-period { font-size: 12px; color: #8a857b; width: 150px; flex-shrink: 0; font-weight: 400; }
  .pf-career-role { font-size: 14px; font-weight: 500; flex: 1; line-height: 1.5; }
  .pf-career-place { font-size: 13px; color: #8a857b; font-weight: 400; }

  /* ---------- CONNECT: PNG 이미지(좌) + 텍스트(우) 2-column 레이아웃 — ABOUT과 좌우가 반대입니다 ---------- */
  .pf-connect-layout {
    display: flex;
    align-items: center;
    gap: 64px;
  }

  .pf-connect-image-wrap {
    flex: 1 1 44%;
    min-width: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pf-connect-image-wrap img {
    width: 100%;
    height: auto;
    max-height: clamp(260px, 28vw, 420px);
    object-fit: contain;
    display: block;
    background: none;
    border: none;
    box-shadow: none;
  }

  .pf-connect-text { flex: 1 1 52%; min-width: 260px; }

  .pf-contact-row { display: flex; align-items: baseline; flex-wrap: wrap; gap: 18px; }

  .pf-contact-email {
    font-size: 34px;
    font-weight: 500;
    text-decoration: none;
    color: #262420;
    display: inline-block;
    border-bottom: 1px solid transparent;
    transition: border-color 0.25s ease;
  }
  .pf-contact-email:hover { border-color: #262420; }

  /* 이메일 옆의 작고 절제된 COPY 버튼 — 클릭하면 clipboard로 복사되고 하단 toast가 뜹니다 */
  .pf-copy-btn {
    font-family: inherit;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.1em;
    background: none;
    border: 1px solid #c9c2b4;
    border-radius: 999px;
    cursor: pointer;
    color: #8a857b;
    padding: 6px 14px;
    transition: color 0.2s ease, border-color 0.2s ease;
  }
  .pf-copy-btn:hover { color: #262420; border-color: #262420; }

  /* COPY 클릭 시 화면 하단 중앙에 잠깐 나타나는 작은 toast 알림 */
  .pf-toast {
    position: fixed;
    left: 50%;
    bottom: 40px;
    transform: translateX(-50%) translateY(10px);
    background: #ffffff;
    color: #171614;
    font-family: inherit;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    padding: 11px 22px;
    border-radius: 999px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.22);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease, transform 0.25s ease;
    z-index: 900;
  }
  .pf-toast-visible { opacity: 1; transform: translateX(-50%) translateY(0); }

  .pf-social-list { margin-top: 48px; display: flex; gap: 32px; }
  .pf-social-list a {
    font-size: 13px;
    letter-spacing: 0.04em;
    color: #4a453d;
    text-decoration: none;
    border-bottom: 1px solid #b8b2a4;
    padding-bottom: 3px;
    transition: color 0.25s ease, border-color 0.25s ease;
  }
  .pf-social-list a:hover { color: #262420; border-color: #262420; }

  .pf-footer {
    padding: 40px var(--page-pad-x) 60px;
    font-size: 11px;
    color: #8a857b;
    letter-spacing: 0.04em;
  }

  /* ---------- FLIP overlay ---------- */
  .pf-flip-overlay {
    position: fixed;
    overflow: hidden;
    z-index: 500;
    background: #e7e1d5;
    will-change: top, left, width, height;
  }
  .pf-flip-overlay img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* ---------- DETAIL ---------- */
  .pf-detail {
    position: fixed;
    inset: 0;
    z-index: 400;
    background: #f6f6f6;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .pf-detail-topbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--page-pad-x);
    z-index: 30;
    background: linear-gradient(to bottom, rgba(246,246,246,0.92), rgba(246,246,246,0));
  }

  .pf-back-btn {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.02em;
    background: none;
    border: none;
    cursor: pointer;
    color: #262420;
    padding: 8px 0;
    font-family: inherit;
  }

  .pf-detail-counter {
    font-size: 12px;
    color: #8a857b;
    letter-spacing: 0.06em;
  }

  .pf-detail-hero-space { width: 100%; height: 78vh; overflow: hidden; background: #e7e1d5; }
  .pf-detail-hero-space img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .pf-detail-body { padding: 56px var(--page-pad-x) 140px; }

  .pf-detail-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 48px;
    margin-bottom: 64px;
    padding-bottom: 40px;
    border-bottom: 1px solid #ddd6c7;
  }

  .pf-detail-title {
    font-size: 30px;
    font-weight: 600;
    letter-spacing: -0.01em;
    margin: 0 0 8px 0;
  }

  .pf-meta-block { min-width: 90px; }
  .pf-meta-label { font-size: 10px; letter-spacing: 0.1em; color: #8a857b; margin-bottom: 6px; font-weight: 500; }
  .pf-meta-value { font-size: 14px; font-weight: 500; }

  .pf-detail-desc {
    max-width: 640px;
    font-size: 18px;
    line-height: 1.75;
    font-weight: 400;
    margin-bottom: 100px;
  }

  /* ---------- Project Detail — content block system ---------- */
  .pf-content-block {
    margin-bottom: 56px;
  }

  .pf-block-image {
    background: #e7e1d5;
    overflow: hidden;
  }
  .pf-block-image img { width: 100%; display: block; object-fit: cover; }

  .pf-block-full { width: 100%; }
  .pf-block-medium { max-width: 760px; margin-left: auto; margin-right: auto; }
  .pf-block-small { max-width: 460px; margin-left: auto; margin-right: auto; }

  .pf-block-image-pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }
  .pf-block-image-pair-item { background: #e7e1d5; overflow: hidden; }
  .pf-block-image-pair-item img { width: 100%; display: block; object-fit: cover; }

  .pf-block-vimeo {
    position: relative;
    width: 100%;
    background: #000000;
    overflow: hidden;
  }
  .pf-block-vimeo iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
  }

  .pf-block-text { max-width: 640px; }
  .pf-block-text-title {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    color: #8a857b;
    margin-bottom: 14px;
  }
  .pf-block-text-body {
    font-size: 16px;
    line-height: 1.75;
    font-weight: 400;
    color: #262420;
  }

  .pf-block-spacer { margin-bottom: 0; }

  .pf-next-project {
    margin-top: 140px;
    padding-top: 48px;
    border-top: 1px solid #ddd6c7;
    cursor: pointer;
  }
  .pf-next-label { font-size: 11px; letter-spacing: 0.1em; color: #8a857b; margin-bottom: 18px; font-weight: 500; }
  .pf-next-title { font-size: 32px; font-weight: 600; letter-spacing: -0.01em; }

  .pf-detail-fade {
    transition: opacity 0.4s ease;
  }

  /* ---------- Responsive ---------- */
  /* WORKS grid: desktop/large laptop은 항상 3열이고, tablet(≤760px)에서만 2열로,
     작은 mobile(≤420px)에서 1열로 줄어듭니다. 화면(또는 Artifact 미리보기 패널)의
     실제 렌더링 너비가 넓은 desktop이어도 좁게 표시될 수 있으므로, 3열 유지 구간을
     최대한 넓게 잡아 "desktop인데 열이 줄어 보이는" 문제가 재발하지 않도록 합니다 */
  @media (max-width: 760px) {
    .pf-about-headline { margin-bottom: 24px; }
    .pf-about-body { font-size: 14px; }
    .pf-section { padding: 90px var(--page-pad-x); }

    /* ABOUT/CONNECT 좌우 2-column을 억지로 유지하지 않고 세로로 자연스럽게 쌓습니다.
       ABOUT은 텍스트 → PNG 순서, CONNECT는 PNG → 텍스트 순서(마크업 순서 그대로)를 따릅니다. */
    .pf-about-layout, .pf-connect-layout {
      flex-direction: column;
      align-items: stretch;
      gap: 36px;
    }
    .pf-about-text, .pf-about-image-wrap, .pf-connect-text, .pf-connect-image-wrap {
      flex: none;
      width: 100%;
      min-width: 0;
    }
    .pf-about-image-wrap img, .pf-connect-image-wrap img { max-height: 240px; }

    .pf-career-row { flex-direction: column; gap: 4px; }
    .pf-career-period { width: auto; }
    .pf-contact-row { gap: 12px; }
    .pf-contact-email { font-size: 24px; }
    .pf-detail-title { font-size: 22px; }
    .pf-detail-desc { font-size: 16px; }
    .pf-detail-hero-space { height: 52vh; }
    .pf-detail-body { padding: 40px var(--page-pad-x) 100px; }
    .pf-works-wrap { padding-top: 108px; }
    .pf-works-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; }
    /* 3-column intro(Title / 소개문장 / SNS)를 세로 스택으로 자연스럽게 쌓습니다 */
    .pf-works-intro {
      grid-template-columns: 1fr;
      row-gap: 16px;
      margin-bottom: 40px;
    }
    .pf-works-intro-desc { max-width: none; }
    .pf-works-intro-sns { justify-self: start; padding-top: 0; }
    .pf-works-subrow { margin-bottom: 16px; }
    .pf-works-sortselector { gap: 14px; }
    .pf-works-hover-title { font-size: 10px; }
    .pf-works-hover-sub { font-size: 8px; }

    /* imagePair 블록은 모바일에서 자연스럽게 세로로 쌓입니다 */
    .pf-block-image-pair { grid-template-columns: 1fr; gap: 20px; }
    .pf-content-block { margin-bottom: 40px; }

    /* 좁은 화면에서는 왼쪽(이름)+오른쪽(메일 링크)을 1행, 가운데 탭 그룹을 그 아래 2행으로
       줄바꿈합니다 — 3개 영역이 한 줄에 다 들어가기엔 좁으므로, 좌우는 그대로 두고 가운데만
       아래로 내려서 여전히 수평 중앙 정렬을 유지합니다 */
    .pf-header {
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        "logo contact"
        "tabs tabs";
      row-gap: 10px;
    }
    .pf-logo { grid-area: logo; }
    .pf-header-right { grid-area: contact; }
    .pf-tab-group { grid-area: tabs; }

    /* 좁은 화면에서 텍스트들이 겹치지 않도록 살짝 더 작게 */
    .pf-logo, .pf-tab-link, .pf-tab-sep, .pf-header-contact {
      font-size: 10px;
    }
    .pf-header-social a { font-size: 8px; }
    .pf-home-social { gap: 4px; }
    .pf-home-bottom-graphic .pf-home-social { margin-bottom: 8px; }
    .pf-home-social-name { font-size: 11px; }

    /* 모바일에서도 PNG의 실제 비율을 유지한 채 잘리지 않도록 추가 세로 공간을 확보합니다. */
    .pf-hero:not(.pf-hero-works) {
      height: 100svh;
      min-height: 680px;
      overflow: hidden;
    }

    /* 모바일: hover가 없으므로 tap으로 확장 — 기본은 낮은 strip, tap한 항목만 아래로 확장됩니다 */
    /* MOBILE HOME: gallery를 flex 흐름에 맡기지 않고 hero 안의 확정 좌표에 고정합니다.
       이렇게 하면 iOS Safari의 dynamic viewport / 초기 React render 타이밍과 무관하게
       프로젝트 스트립이 반드시 첫 화면에 나타납니다. */
    .pf-gallery-wrap {
      position: absolute;
      left: 0;
      right: 0;
      top: clamp(185px, 24svh, 230px);
      width: 100%;
      height: auto;
      padding: 0;
      flex: none;
      z-index: 4;
      --home-type-width: 100vw;
      --home-type-bottom: 0px;
      --home-type-max-height: none;
    }

    /* 모바일에서는 desktop의 full-bleed breakout(left:50% + translate)을 완전히 해제합니다. */
    .pf-gallery-viewport {
      position: relative;
      left: 0;
      transform: none;
      width: 100%;
      max-width: 100%;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      overflow-x: auto;
      overflow-y: visible;
      scroll-snap-type: x proximity;
      -webkit-overflow-scrolling: touch;
    }

    .pf-gallery-row {
      justify-content: flex-start;
      min-width: max-content;
      width: max-content;
      margin: 0;
    }

    /* 타이포는 갤러리보다 아래쪽에서 시작하고 hero 바닥까지 사용합니다. */
    .pf-home-bottom-graphic {
      top: clamp(470px, 56svh, 560px);
      bottom: 0;
      z-index: 1;
    }
    .pf-home-typography-image {
      width: 100vw;
      height: 100%;
      object-fit: contain;
      object-position: center bottom;
    }
    /* 크기/비율은 desktop과 동일하게 aspect-ratio로 유지되고, 최소 width만 모바일에 맞게 조정합니다 —
       viewport가 좁다고 세로로 찌그러지지 않고, 대신 horizontal swipe로 넘겨봅니다 */
    .pf-gallery-item { flex-basis: clamp(84px, 20vw, 110px); scroll-snap-align: start; }
    .pf-gallery-item.pf-gallery-active { flex-basis: clamp(160px, 42vw, 220px); }
    .pf-gallery-title { font-size: 11px; }
  }

  @media (max-width: 420px) {
    .pf-header { left: 16px; right: 16px; }
    .pf-logo, .pf-tab-link, .pf-tab-sep, .pf-header-contact {
      font-size: 9px;
      letter-spacing: 0.01em;
    }
    .pf-works-grid { grid-template-columns: 1fr; gap: 1px; }
  }
`;

const N = projects.length;

function computeHeroRect() {
  const isMobile = window.innerWidth < 760;
  const barH = isMobile ? 56 : 64;
  const heroH = window.innerHeight * (isMobile ? 0.52 : 0.78);
  return { top: barH, left: 0, width: window.innerWidth, height: heroH };
}

// Expanding / Accordion Gallery — 구 원형 Orbit을 대체합니다.
// desktop: hover로 flex-basis가 실제로 커지며 주변 컬럼이 자연스럽게 밀려납니다 (transform:scale() 아님).
// mobile: hover가 없으므로 첫 tap은 확장(선택), 이미 확장된 항목을 한 번 더 tap하면 Project Detail로 이동합니다.
// 화면에 실제로 그릴 때 몇 벌(copy)의 projects를 이어붙일지 — desktop은 "seamless infinite loop"를
// 위해 A/B/C 세 벌을 나란히 이어붙이고, mobile은 기존과 동일하게 한 벌(B)만 그립니다.
const DESKTOP_GALLERY_COPIES = ["A", "B", "C"];
const MOBILE_GALLERY_COPIES = ["B"];

function AccordionGallery({ onOpenProject, thumbRefs, phase, hiddenId, homeOpacity, className }) {
  const [activeId, setActiveId] = useState(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 760);
  const viewportRef = useRef(null);
  const rowRef = useRef(null); // 세 벌(A/B/C)이 이어붙여진 실제 row — scrollWidth/3으로 "한 바퀴" 폭을 매 프레임 측정합니다
  // 현재 마우스의 화면 x좌표(Gallery 영역 안에 있을 때만 값이 채워지고, 벗어나면 null) —
  // rAF 루프가 이 값을 읽어서 마우스 위치에 따른 속도 보정을 매 프레임 계산합니다
  const mouseXRef = useRef(null);
  const panVelocityRef = useRef(0);
  const panLastTimeRef = useRef(null);
  // scrollLeft는 브라우저가 항상 정수 픽셀로 반올림해서 저장/반환합니다. hover 중이거나(속도 0.3배)
  // 마우스가 왼쪽 감속 구간에 있을 때는 한 프레임에 옮겨야 할 양이 1px보다 작아지는 경우가 흔한데,
  // 매 프레임 "vp.scrollLeft += 작은값" 처럼 DOM에서 직접 읽고 쓰면 그 소수점이 매번 반올림되어
  // 사라지고 결과적으로 전혀 움직이지 않는 것처럼 보이는 문제가 있었습니다. 그래서 실제 위치는
  // 이 ref(소수점 유지)에 누적하고, 매 프레임 끝에 한 번만 vp.scrollLeft에 반영합니다.
  const scrollPosRef = useRef(0);
  // hover된 프로젝트 "인스턴스"의 고유 key(예: "B-03")를 즉시(리렌더 없이) 읽기 위한 ref — 아래 rAF
  // 루프는 React 렌더 사이클 밖에서 매 프레임 돌기 때문에 state보다 ref가 항상 최신값을 즉시
  // 반영합니다. 이 ref는 "이 프로젝트가 잘리지 않게 Gallery를 따라오게 하는" hover-follow 보정의
  // 대상을 매 프레임 알려주는 용도입니다(더 이상 자동 이동을 멈추는 용도가 아닙니다)
  const activeIdRef = useRef(null);
  function setActiveBoth(id) {
    activeIdRef.current = id;
    setActiveId(id);
  }

  // HOME 하단 SNS 텍스트 링크 — siteInfo.instagram/behance가 비어있으면("") 그 항목은 자동으로
  // 빠지고, 번호(01/02...)는 실제로 보여지는 링크 기준으로 다시 매겨집니다. Typography PNG와 같은
  // wrapper(.pf-home-bottom-graphic) 안에서 함께 렌더링됩니다
  const homeSocialLinks = [
    { label: "INSTAGRAM", url: siteInfo.instagram },
    { label: "BEHANCE", url: siteInfo.behance },
  ].filter((link) => link.url);

  useEffect(() => {
    function update() {
      setIsMobile(window.innerWidth < 760);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ---- 처음 렌더된 직후, scrollLeft를 "한 바퀴 폭(oneCycleWidth)"만큼 오른쪽으로 옮겨서 A/B/C 중
  // 가운데 벌(B)의 시작 지점에서 출발하게 합니다 — 그래야 이후 auto-slide가 왼쪽(A 방향)이나
  // 오른쪽(C 방향) 어느 쪽으로 흘러도 한동안 진짜 끝(A의 시작/C의 끝)에 닿지 않고 여유가 있습니다.
  // useLayoutEffect로 화면에 처음 그려지기 전에 위치를 잡아 눈에 보이는 점프가 없게 합니다 ----
  useLayoutEffect(() => {
    const vp = viewportRef.current;
    const row = rowRef.current;
    if (!vp || !row) return;

    // IMPORTANT: the component first renders once with isMobile=false, then the resize effect
    // resolves the real viewport. Desktop initialization can therefore leave a large scrollLeft
    // behind. When the layout switches to the single-copy mobile gallery, that old scrollLeft
    // points past the end of the row and the entire gallery looks blank. Always reset mobile to 0.
    if (isMobile) {
      vp.scrollLeft = 0;
      scrollPosRef.current = 0;
      panVelocityRef.current = 0;
      panLastTimeRef.current = null;
      return;
    }

    const oneCycleWidth = row.scrollWidth / 3;
    if (oneCycleWidth > 10) {
      vp.scrollLeft = oneCycleWidth;
      scrollPosRef.current = oneCycleWidth;
    }
  }, [isMobile]);

  // ---- Desktop 전용 Gallery 자동 스크롤. 두 가지 동작이 항상 동시에 적용됩니다:
  //
  // 1) Continuous auto-slide — 사용자가 아무 것도 하지 않아도 Gallery가 항상 아주 천천히 오른쪽
  //    방향(뒤쪽 프로젝트 방향)으로 흐릅니다. 마우스가 Gallery 오른쪽 영역에 있으면 이 속도가 조금
  //    빨라지고, 왼쪽 영역에 있으면 느려지거나 반대 방향으로 자연스럽게 바뀝니다(중앙에서는 기본
  //    속도 그대로). 목표 속도(target)를 매 프레임 계산한 뒤 실제 속도(panVelocityRef)는 그 목표를
  //    EASE 비율만큼만 따라가므로, 방향/속도가 급격히 튀지 않고 항상 부드럽게 전환됩니다.
  //
  // 2) 프로젝트를 hover 중일 때 — hover-follow 보정을 "추가로" 더합니다(auto-slide를 멈추지 않음).
  //    hover된 프로젝트의 실제 DOM 위치(width/height 확장 애니메이션이 진행 중이면 그 진행 상태
  //    그대로)를 매 프레임 다시 측정해서, 그 프로젝트가 viewport 양쪽 가장자리에 잘리지 않을 만큼만
  //    최소한으로 scrollLeft를 보정합니다. 이와 별개로 auto-slide 자체는 속도만 줄어든 채(완전히
  //    멈추지 않고) 계속 진행되어, hover 중에도 Gallery의 흐름이 이어집니다.
  //
  // 3) Seamless infinite loop — A/B/C 세 벌 중 가운데(B) 폭(oneCycleWidth)을 매 프레임 측정해서,
  //    scrollLeft가 그 범위를 벗어나려는 순간 정확히 한 바퀴 폭만큼 반대로 조정합니다. A/B/C는
  //    픽셀 단위로 동일한 내용이므로 이 보정은 화면에 어떤 시각적 끊김도 남기지 않습니다 —
  //    사용자는 루프의 경계가 어디인지 알 수 없습니다.
  //
  // Mobile은 손가락 swipe로 직접 스크롤하므로 이 로직 전체를 사용하지 않습니다(기존과 동일) ----
  useEffect(() => {
    if (isMobile) return;
    let raf;
    const EDGE_ZONE_RATIO = 0.25;
    const EASE = 0.05;
    const HOVER_FOLLOW_EASE = 0.1; // hover-follow 보정이 매 프레임 따라잡는 비율 — 확장 트랜지션과 비슷한 속도로 수렴
    const HOVER_FOLLOW_MARGIN = 14; // 가장자리에 딱 붙지 않도록 약간의 여백을 둡니다
    const LOOP_SECONDS = 35; // ✏️ "한 바퀴"(12개 프로젝트) 도는 데 걸리는 시간 — 25~45초 권장 범위의 중간값
    const RIGHT_BOOST = 2.5; // 마우스가 오른쪽 끝에 있을 때 기본 속도 대비 배율
    const LEFT_MULT = -1.2; // 마우스가 왼쪽 끝에 있을 때 기본 속도 대비 배율(음수 = 역방향)
    const HOVER_SLIDE_FACTOR = 0.3; // hover 중에는 auto-slide 속도를 이 비율로 줄입니다(0으로 만들지 않음)

    function tick(t) {
      if (panLastTimeRef.current == null) panLastTimeRef.current = t;
      const dt = Math.min(48, t - panLastTimeRef.current);
      panLastTimeRef.current = t;

      const vp = viewportRef.current;
      const row = rowRef.current;
      if (!vp || !row) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const oneCycleWidth = row.scrollWidth / 3;
      if (oneCycleWidth > 10) {
        // 사용자가 트랙패드/휠 등으로 직접 스크롤해서 실제 DOM scrollLeft가 우리가 추적하던 소수점
        // 위치(scrollPosRef)와 크게 어긋났다면(2px 초과), 그 수동 조작을 새 기준점으로 받아들입니다.
        if (Math.abs(vp.scrollLeft - scrollPosRef.current) > 2) {
          scrollPosRef.current = vp.scrollLeft;
        }

        const BASE_SPEED = oneCycleWidth / LOOP_SECONDS; // px/sec — 화면 크기와 무관하게 항상 "한 바퀴 = LOOP_SECONDS초"

        // 마우스 x좌표 기준으로 "일반 목표 속도"를 먼저 계산합니다 — hover 여부와 무관하게
        // 항상 이 값을 기준으로 삼아, hover 중에도 마우스가 오른쪽/왼쪽 어디 있는지에 따라
        // 방향과 정도가 계속 반영되도록 합니다(가운데 50%는 기본 속도, 좌우 25%는 가속/감속/역방향).
        let zoneTarget = BASE_SPEED;
        if (mouseXRef.current != null) {
          const rect = vp.getBoundingClientRect();
          const relX = mouseXRef.current - rect.left;
          const zone = rect.width * EDGE_ZONE_RATIO;
          if (relX > rect.width - zone) {
            const tRamp = Math.min(1, (relX - (rect.width - zone)) / zone);
            zoneTarget = BASE_SPEED + tRamp * (BASE_SPEED * (RIGHT_BOOST - 1));
          } else if (relX < zone) {
            const tRamp = Math.min(1, (zone - relX) / zone);
            zoneTarget = BASE_SPEED + tRamp * (BASE_SPEED * (LEFT_MULT - 1));
          }
        }

        const hoveredId = activeIdRef.current;
        if (hoveredId) {
          // hover-follow: 확대되고 있는(또는 이미 확대된) 프로젝트가 잘리지 않도록 최소한으로만 보정
          const media = thumbRefs.current[hoveredId];
          if (media) {
            const rect = media.getBoundingClientRect();
            const vpRect = vp.getBoundingClientRect();
            let deltaNeeded = 0;
            if (rect.left < vpRect.left + HOVER_FOLLOW_MARGIN) {
              deltaNeeded = rect.left - (vpRect.left + HOVER_FOLLOW_MARGIN);
            } else if (rect.right > vpRect.right - HOVER_FOLLOW_MARGIN) {
              deltaNeeded = rect.right - (vpRect.right - HOVER_FOLLOW_MARGIN);
            }
            if (Math.abs(deltaNeeded) > 0.5) {
              scrollPosRef.current += deltaNeeded * HOVER_FOLLOW_EASE;
            }
          }
          // auto-slide는 hover 중에도 절대 멈추거나 역방향으로 뒤집히지 않아야 하므로(요구사항: "must
          // never be fully paused"), 오른쪽 구간의 가속은 hover 중에도 그대로 반영하되, 왼쪽 구간처럼
          // zoneTarget이 느려지거나 역방향이 되는 경우에는 "최소 정방향 속도"(BASE_SPEED의 절반)를
          // 하한선으로 둡니다 — 그 위로는 여전히 마우스 위치에 따라 더 빨라질 수 있습니다.
          const hoverZoneTarget = Math.max(zoneTarget, BASE_SPEED * 0.5);
          panVelocityRef.current += (hoverZoneTarget - panVelocityRef.current) * EASE;
          scrollPosRef.current += (panVelocityRef.current * HOVER_SLIDE_FACTOR * dt) / 1000;
        } else {
          // 일반 상태: 기본은 항상 BASE_SPEED로 서서히 흐르고, 마우스가 좌우 25% 구간에 있으면
          // 그 방향/정도에 비례해 속도가 빨라지거나(오른쪽) 느려지거나 역방향(왼쪽)으로 보정됩니다.
          // 가운데 50% 구간에서는 기본 속도 그대로 유지됩니다.
          panVelocityRef.current += (zoneTarget - panVelocityRef.current) * EASE;
          scrollPosRef.current += (panVelocityRef.current * dt) / 1000;
        }

        // seamless loop: A/B/C 세 벌은 픽셀 단위로 동일하므로, 정확히 한 바퀴 폭만큼만 되돌리면
        // 화면상으로는 아무 일도 일어나지 않은 것처럼 보입니다(진짜 끝에 닿기 훨씬 전에 미리 보정)
        if (scrollPosRef.current > oneCycleWidth * 1.5) {
          scrollPosRef.current -= oneCycleWidth;
        } else if (scrollPosRef.current < oneCycleWidth * 0.5) {
          scrollPosRef.current += oneCycleWidth;
        }

        // 소수점까지 누적된 실제 위치를 이번 프레임에 딱 한 번만 DOM에 반영합니다(브라우저가
        // 내부적으로 정수로 반올림하더라도, 다음 프레임 계산은 항상 scrollPosRef의 소수점
        // 값에서 이어가므로 손실 없이 계속 누적됩니다)
        vp.scrollLeft = scrollPosRef.current;
      }

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isMobile, thumbRefs]);

  function handleGalleryMouseMove(e) {
    if (!isMobile) mouseXRef.current = e.clientX;
  }
  function handleGalleryMouseLeave() {
    mouseXRef.current = null;
  }

  // instanceKey: mobile은 한 벌만 그리므로 기존과 동일하게 project id 그대로 사용하고, desktop은
  // "A-01"처럼 벌(copy) 접두사를 붙여 A/B/C 세 개의 시각적 인스턴스를 서로 구분합니다 — 이렇게
  // 해야 한쪽 인스턴스를 hover했을 때 다른 두 벌의 같은 프로젝트가 함께 확대되지 않습니다.
  // 실제 Project Detail로 이동할 때는 항상 원본 project(p)만 사용하므로 데이터가 중복되지 않습니다.
  function handleItemClick(p, instanceKey, sourceEl) {
    if (isMobile) {
      if (activeId === instanceKey) {
        onOpenProject(p, sourceEl);
      } else {
        setActiveBoth(instanceKey);
      }
    } else {
      // Drag로 스크롤하는 기능은 없고 순수 클릭이므로 click과 충돌하지 않습니다 —
      // auto-slide/보정은 모두 scrollLeft를 프로그래밍적으로 움직일 뿐, 클릭 이벤트를 가로채지 않습니다
      onOpenProject(p, sourceEl);
    }
  }

  const copies = isMobile ? MOBILE_GALLERY_COPIES : DESKTOP_GALLERY_COPIES;

  return (
    <div
      className={"pf-gallery-wrap" + (className ? " " + className : "")}
      style={{
        opacity: homeOpacity,
        transition: "opacity 0.5s ease",
        pointerEvents: phase === "home" ? "auto" : "none",
      }}
    >
      <div
        className="pf-gallery-viewport"
        ref={viewportRef}
        onMouseMove={handleGalleryMouseMove}
        onMouseLeave={handleGalleryMouseLeave}
      >
        <div className="pf-gallery-row" ref={rowRef}>
          {copies.map((copyLabel) =>
            projects.map((p) => {
              const instanceKey = isMobile ? p.id : `${copyLabel}-${p.id}`;
              const isActive = activeId === instanceKey;
              return (
                <div
                  key={instanceKey}
                  className={"pf-gallery-item" + (isActive ? " pf-gallery-active" : "")}
                  onMouseEnter={!isMobile ? () => setActiveBoth(instanceKey) : undefined}
                  onMouseLeave={
                    !isMobile
                      ? () => {
                          if (activeIdRef.current === instanceKey) activeIdRef.current = null;
                          setActiveId((cur) => (cur === instanceKey ? null : cur));
                        }
                      : undefined
                  }
                  onClick={() => handleItemClick(p, instanceKey, thumbRefs.current[instanceKey])}
                >
                  <div className="pf-gallery-meta">
                    <span className="pf-gallery-index">{p.id}.</span>
                    <span className="pf-gallery-title">{p.title}</span>
                    <span className="pf-gallery-category">[{p.category}]</span>
                  </div>
                  <div
                    ref={(el) => {
                      thumbRefs.current[instanceKey] = el;
                      // "B" 벌(또는 mobile의 유일한 벌)을 프로젝트의 대표 썸네일로도 등록해둬서,
                      // App()의 close-transition이 project id만으로 살아있는 DOM을 찾을 수 있게 합니다
                      if (copyLabel === "B") thumbRefs.current[p.id] = el;
                    }}
                    className={"pf-gallery-media" + (hiddenId === p.id ? " pf-clicked-hide" : "")}
                  >
                    <img src={p.thumbnail} alt={p.title} draggable={false} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ✏️ HOME 하단 대형 타이포그래피 PNG + 그 바로 위 왼쪽의 SNS 링크(INSTAGRAM/BEHANCE) — 하나의
          "pf-home-bottom-graphic" wrapper로 함께 묶여 있어서, 이 레이어의 위치/크기가 반응형으로
          바뀌어도 SNS는 항상 PNG 왼쪽 바로 위에 붙어서 함께 움직입니다(서로 떨어진 별도 footer처럼
          보이지 않습니다).
          Typography PNG는 siteInfo.homeTypographyImage에 Illustrator/Photoshop 등에서 만든 투명 PNG
          이미지 경로를 넣으면 실제 <img> 요소로 그대로 렌더링됩니다. 이 값이 비어있으면("") 아무 것도
          렌더링하지 않습니다 — 점선 placeholder box나 "TYPOGRAPHY PNG" 안내 텍스트, 배경 박스, border
          없이, 오직 실제 PNG 파일을 넣었을 때만 그 이미지 자체만 나타나는 순수한 구조입니다.
          Gallery와는 독립된 layer로 wrap 하단에 고정 배치되며, wrapper의 z-index가 Gallery(z-index:3)
          보다 낮으므로(z-index:1) hover로 아래로 확장된 프로젝트 이미지가 이 위로 자연스럽게 겹쳐
          보입니다. Layer 순서는 항상 [프로젝트 메타/확장된 이미지(Gallery, 맨 앞)] → [SNS 링크] →
          [Typography PNG(맨 뒤)] 입니다 — wrapper 자체는 pointer-events:none이라 PNG의 빈 영역이
          프로젝트 hover/click을 막지 않고, SNS 링크만 pointer-events:auto로 되살려 있어 항상 클릭
          가능합니다.
          위치/크기는 .pf-gallery-wrap의 --home-type-* CSS 변수에서 한 곳에 모아 조정합니다.
          (구 Orbit 시그니처는 HOME에서 더 이상 렌더링하지 않습니다 — siteInfo.signatureImage 데이터는 그대로
           유지되어 있으니 필요하면 다시 배치할 수 있습니다) */}
      <div className="pf-home-bottom-graphic">
        {siteInfo.homeTypographyImage && (
          <img
            className="pf-home-typography-image"
            src={siteInfo.homeTypographyImage}
            alt=""
            draggable={false}
          />
        )}
      </div>
    </div>
  );
}

// WORKS — compact editorial archive 뷰. Orbit(SELECTED WORKS)과 완전히 동일한 projects
// 데이터를 그대로 공유합니다(별도의 WORKS 전용 데이터 배열을 두지 않습니다). 카드 UI /
// box-shadow / 흰색 카드 배경 없이, 조밀하게 붙은 이미지 grid 자체가 레이아웃을 구성합니다.
const WORKS_SORT_OPTIONS = ["LATEST", "OLDEST"];

function WorksGrid({ onOpenProject, itemRefs, sortOrder, setSortOrder }) {
  // ⚠️ 원본 projects 배열은 절대 변형(reverse/sort in-place)하지 않습니다 — HOME(Orbit)이나
  // 다른 화면의 순서에 영향을 주지 않도록, 항상 얕은 복사본을 만든 뒤에만 정렬/역순 처리합니다.
  // LATEST = 최신 프로젝트 → 오래된 프로젝트(배열의 마지막 항목부터), OLDEST = 01번부터 순서대로.
  const displayedProjects =
    sortOrder === "latest" ? [...projects].reverse() : [...projects];

  return (
    <div className="pf-works-wrap pf-view-fade-in">
      {/* 상단 인트로 — 왼쪽(큰 Main Title) / 가운데(짧은 소개 문장) / 오른쪽(SNS 링크)
          3개 컬럼. 제목은 EDIT AREA(siteInfo.worksHeadline), 소개 문장은
          siteInfo.worksDescription, SNS는 HOME과 동일한 siteInfo.instagram /
          siteInfo.behance 값을 그대로 사용합니다 */}
      <div className="pf-works-intro">
        <div className="pf-works-maintitle">{siteInfo.worksHeadline}</div>

        {siteInfo.worksDescription && (
          <p className="pf-works-intro-desc">{siteInfo.worksDescription}</p>
        )}

        <div className="pf-works-intro-sns">
          {siteInfo.instagram && (
            <a href={siteInfo.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          )}
          {siteInfo.behance && (
            <a href={siteInfo.behance} target="_blank" rel="noreferrer">
              Behance
            </a>
          )}
        </div>
      </div>

      <div className="pf-works-subrow">
        {/* 프로젝트 개수는 절대 하드코딩하지 않고 projects.length를 그대로 사용합니다 —
            projects 배열에 항목을 추가/삭제하면 이 숫자도 자동으로 바뀝니다 */}
        <div className="pf-works-count">
          SELECTED WORKS <span className="pf-works-count-num">({projects.length})</span>
        </div>

        {/* LATEST / OLDEST — 텍스트만 있는 정렬 selector(pill/border 없음). 클릭하면
            projects 원본은 그대로 두고, 아래 grid에 렌더링되는 순서(displayedProjects)만
            바뀝니다 */}
        <div className="pf-works-sortselector">
          {WORKS_SORT_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className={
                "pf-works-sort-btn" +
                (sortOrder === s.toLowerCase() ? " pf-works-sort-active" : "")
              }
              onClick={() => setSortOrder(s.toLowerCase())}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="pf-works-grid">
        {displayedProjects.map((p) => (
          <div
            key={p.id}
            className="pf-works-item"
            onClick={() => onOpenProject(p, itemRefs.current[p.id])}
          >
            <div
              className="pf-works-thumb"
              ref={(el) => (itemRefs.current[p.id] = el)}
            >
              <img src={p.thumbnail} alt={p.title} draggable={false} />

              {/* hover 시에만 나타나는 아주 작은 프로젝트 정보 — 이미지 자체가 계속 주인공입니다 */}
              <div className="pf-works-hover-info">
                <div className="pf-works-hover-title">{p.title}</div>
                <div className="pf-works-hover-sub">
                  {p.year} / {p.category}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// navigator.clipboard API를 지원하지 않는 환경을 위한 간단한 fallback 복사 함수입니다.
function fallbackCopyText(text) {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-1000px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return true;
  } catch (e) {
    return false;
  }
}

// "16:9" 같은 문자열을 CSS aspect-ratio 값("16 / 9")으로 변환합니다.
function ratioToCss(ratio) {
  if (!ratio) return "16 / 9";
  const parts = String(ratio).split(":");
  if (parts.length === 2) return `${parts[0].trim()} / ${parts[1].trim()}`;
  return ratio;
}

// Project Detail의 content 블록 하나를 실제 화면 요소로 그려주는 재사용 컴포넌트입니다.
// project.content 배열에 어떤 블록이 몇 개, 어떤 순서로 들어오든 이 컴포넌트 하나가 전부 처리하므로
// 새 프로젝트를 추가할 때 이 컴포넌트나 ProjectDetail을 따로 수정할 필요가 없습니다.
function ContentBlock({ block, projectTitle }) {
  if (block.type === "image") {
    const layout = block.layout === "medium" ? "pf-block-medium" : block.layout === "small" ? "pf-block-small" : "pf-block-full";
    return (
      <div className={"pf-content-block pf-block-image " + layout}>
        <img src={block.src} alt={block.alt || projectTitle} draggable={false} />
      </div>
    );
  }

  if (block.type === "imagePair") {
    return (
      <div className="pf-content-block pf-block-image-pair">
        {block.images.map((src, i) => (
          <div className="pf-block-image-pair-item" key={i}>
            <img src={src} alt={`${projectTitle} ${i + 1}`} draggable={false} />
          </div>
        ))}
      </div>
    );
  }

  if (block.type === "vimeo") {
    // ⚠️ 이 영상이 재생되려면 Vimeo 관리 페이지에서 외부 사이트 embed(퍼가기)가 허용되어 있어야 합니다.
    return (
      <div className="pf-content-block">
        <div className="pf-block-vimeo" style={{ aspectRatio: ratioToCss(block.ratio) }}>
          <iframe
            src={`https://player.vimeo.com/video/${block.videoId}`}
            title={`${projectTitle} — Vimeo video`}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (block.type === "text") {
    return (
      <div className="pf-content-block pf-block-text">
        {block.title && <div className="pf-block-text-title">{block.title}</div>}
        <p className="pf-block-text-body">{block.text}</p>
      </div>
    );
  }

  if (block.type === "spacer") {
    const height = block.size === "large" ? 140 : block.size === "small" ? 40 : 80;
    return <div className="pf-content-block pf-block-spacer" style={{ height }} aria-hidden="true" />;
  }

  return null;
}

function ProjectDetail({ project, onBack, onNext, fading, hideHero, scrollRef }) {
  const idx = projects.findIndex((p) => p.id === project.id);
  const next = projects[(idx + 1) % N];

  return (
    <div className="pf-detail" ref={scrollRef}>
      <div className="pf-detail-topbar">
        <button className="pf-back-btn" onClick={onBack}>
          ← Back to Works
        </button>
        <span className="pf-detail-counter">
          {project.id} / {String(N).padStart(2, "0")}
        </span>
      </div>

      {/* hero 이미지 영역 — FLIP 오버레이가 여기로 이동해 온 뒤, 전환이 끝나면 이 실제 이미지가 같은 자리에 남아 자연스럽게 이어집니다.
          닫힐 때(hideHero)는 오버레이가 같은 이미지를 들고 움직이므로 이 쪽은 즉시 숨깁니다. */}
      <div className="pf-detail-hero-space" style={{ opacity: hideHero ? 0 : 1 }}>
        <img src={project.heroImage} alt={project.title} draggable={false} />
      </div>

      <div
        className="pf-detail-body pf-detail-fade"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <div className="pf-detail-meta">
          <div style={{ flex: "1 1 260px", minWidth: 220 }}>
            <h1 className="pf-detail-title">{project.title}</h1>
          </div>
          <div className="pf-meta-block">
            <div className="pf-meta-label">YEAR</div>
            <div className="pf-meta-value">{project.year}</div>
          </div>
          <div className="pf-meta-block">
            <div className="pf-meta-label">CATEGORY</div>
            <div className="pf-meta-value">{project.category}</div>
          </div>
          <div className="pf-meta-block">
            <div className="pf-meta-label">ROLE</div>
            <div className="pf-meta-value">{project.role}</div>
          </div>
        </div>

        <p className="pf-detail-desc">{project.description}</p>

        {project.content &&
          project.content.map((block, i) => (
            <ContentBlock block={block} projectTitle={project.title} key={i} />
          ))}

        <div className="pf-next-project" onClick={onNext}>
          <div className="pf-next-label">NEXT PROJECT</div>
          <div className="pf-next-title">
            {next.id} — {next.title}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState("home"); // 'home' | 'opening' | 'detail' | 'closing'
  const [selected, setSelected] = useState(null);
  const [flip, setFlip] = useState(null); // { project, from, to, stage, mode }
  const [detailFading, setDetailFading] = useState(false);

  // "selected" = 원형 Orbit gallery, "works" = 정형화된 그리드. 초기값은 항상 Orbit입니다.
  const [workView, setWorkView] = useState("selected");

  // WORKS 화면 안의 LATEST/OLDEST 정렬 selector 상태. 기본값은 "latest"입니다
  // (projects 원본 배열은 건드리지 않고, WorksGrid 내부에서 복사본만 정렬해 보여줍니다).
  const [worksSortOrder, setWorksSortOrder] = useState("latest");

  // COPY 버튼 클릭 시 잠깐 나타났다 사라지는 toast("EMAIL COPIED") 표시 여부
  const [emailCopied, setEmailCopied] = useState(false);
  const copyToastTimeoutRef = useRef(null);

  const thumbRefs = useRef({});
  const worksThumbRefs = useRef({}); // WORKS 그리드 썸네일 DOM 참조 (Gallery의 thumbRefs와 별개)
  const scrollRef = useRef(null);
  const originRef = useRef(null); // 프로젝트를 열 때 클릭한 썸네일의 시작 위치를 기억해뒀다가 닫을 때 그대로 재사용

  // ---- COPY 버튼: 이메일 주소를 clipboard로 복사하고 짧은 toast를 띄웁니다 ----
  const handleCopyEmail = useCallback(() => {
    const text = siteInfo.email;

    function showCopiedToast() {
      setEmailCopied(true);
      if (copyToastTimeoutRef.current) clearTimeout(copyToastTimeoutRef.current);
      copyToastTimeoutRef.current = setTimeout(() => setEmailCopied(false), 1800);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(showCopiedToast)
        .catch(() => {
          fallbackCopyText(text);
          showCopiedToast();
        });
    } else {
      // Clipboard API를 지원하지 않는 환경(예: 구형 브라우저, 비-https 컨텍스트)을 위한 fallback
      fallbackCopyText(text);
      showCopiedToast();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (copyToastTimeoutRef.current) clearTimeout(copyToastTimeoutRef.current);
    };
  }, []);

  // ---- open project: thumbnail -> hero shared-element transition ----
  // sourceEl이 주어지면(WORKS 그리드 클릭) 그 요소를, 없으면(Orbit 클릭) 기존처럼 thumbRefs를 사용합니다.
  // Orbit 쪽 호출(onClick={() => onOpenProject(p)})은 그대로이므로 Orbit 동작은 전혀 바뀌지 않습니다.
  const openProject = useCallback((project, sourceEl) => {
    const el = sourceEl || thumbRefs.current[project.id];
    if (!el) return;
    const from = el.getBoundingClientRect();
    const to = computeHeroRect();

    // 회전은 phase가 "home"을 벗어나는 순간 멈추므로, 닫을 때도 이 시작 위치가 그대로 유효합니다.
    originRef.current = { id: project.id, rect: from };

    setSelected(project);
    setFlip({ project, from, to, stage: "start", mode: "open" });
    setPhase("opening");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFlip((f) => (f ? { ...f, stage: "end" } : f));
      });
    });

    setTimeout(() => {
      setPhase("detail");
      setFlip(null);
    }, 760);
  }, []);

  // ---- back to works: hero -> thumbnail shared-element transition (reverses in place) ----
  const closeProject = useCallback(() => {
    if (!selected) return;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;

    setDetailFading(true);

    const from = computeHeroRect();
    // 열 때 기억해둔 시작 위치를 우선 사용하고(Orbit/WORKS 모두 정확),
    // 혹시 없다면 현재 마운트되어 있는 썸네일 DOM에서 실시간으로 찾아 사용합니다.
    const cachedOrigin =
      originRef.current && originRef.current.id === selected.id ? originRef.current.rect : null;
    const liveEl = thumbRefs.current[selected.id] || worksThumbRefs.current[selected.id];
    const to = cachedOrigin || (liveEl ? liveEl.getBoundingClientRect() : from);

    setFlip({ project: selected, from, to, stage: "start", mode: "close" });
    setPhase("closing");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFlip((f) => (f ? { ...f, stage: "end" } : f));
      });
    });

    setTimeout(() => {
      setPhase("home");
      setFlip(null);
      setSelected(null);
      setDetailFading(false);
    }, 760);
  }, [selected]);

  // ---- next project: simple crossfade to the next project's detail ----
  const goNext = useCallback(() => {
    if (!selected) return;
    const idx = projects.findIndex((p) => p.id === selected.id);
    const next = projects[(idx + 1) % N];
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setDetailFading(true);
    setTimeout(() => {
      setSelected(next);
      setDetailFading(false);
    }, 260);
  }, [selected]);

  const showHome = phase === "home" || phase === "opening" || phase === "closing";
  const showDetail = phase === "detail" || phase === "closing";
  const homeOpacity =
    phase === "home" ? 1 : phase === "closing" && flip && flip.stage === "end" ? 1 : phase === "closing" ? 0 : 0;

  const hiddenThumbId = selected ? selected.id : null;

  return (
    <div className={"pf-root" + (showDetail ? " pf-noscroll" : "")}>
      <style>{GLOBAL_CSS}</style>

      {showHome && (
        <div className="pf-home-view">
          <div className={"pf-hero" + (workView === "works" ? " pf-hero-works" : "")}>
            {/* 상단 Header — 왼쪽(이름) / 가운데(탭) / 오른쪽(메일 링크) 3개 영역을 grid로 각각
                독립적으로 정렬합니다(justify-self: start / center / end) */}
            <div className="pf-header">
              <div className="pf-logo">{siteInfo.name}</div>

              {/* SELECTED WORKS / WORKS 전환 탭 — 버튼/pill UI가 아니라 "SELECTED WORKS, WORKS"처럼
                  한 줄로 이어지는 작은 텍스트 링크입니다. 클릭/탭 전환 기능은 기존과 완전히 동일하고,
                  시각적으로만 검정 배경 캡슐 대신 색/굵기로 active 상태를 미묘하게 구분합니다.
                  쉼표는 순수 구분자 텍스트일 뿐 클릭 대상이 아닙니다(동일한 projects 데이터를
                  Orbit과 그리드 양쪽에서 공유합니다) */}
              <div className="pf-tab-group">
                <button
                  type="button"
                  className={"pf-tab-link" + (workView === "selected" ? " pf-tab-active" : "")}
                  onClick={() => setWorkView("selected")}
                >
                  SELECTED WORKS
                </button>
                <span className="pf-tab-sep">,</span>
                <button
                  type="button"
                  className={"pf-tab-link" + (workView === "works" ? " pf-tab-active" : "")}
                  onClick={() => setWorkView("works")}
                >
                  WORKS
                </button>
              </div>

              {/* ✏️ 오른쪽 "SEND ME A MESSAGE" — 클릭하면 같은 페이지의 Contact 섹션(id="contact")
                  으로 smooth scroll 이동합니다(mailto: 링크 아님) */}
              <div className="pf-header-right">
                <button
                  type="button"
                  className="pf-header-contact"
                  onClick={() => {
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  SEND ME A MESSAGE
                </button>
                <div className="pf-header-social">
                  {siteInfo.instagram && (
                    <a href={siteInfo.instagram} target="_blank" rel="noreferrer">INSTAGRAM</a>
                  )}
                  {siteInfo.behance && (
                    <a href={siteInfo.behance} target="_blank" rel="noreferrer">BEHANCE</a>
                  )}
                </div>
              </div>
            </div>

            {/* HOME의 Instagram / Behance 링크는 오른쪽 상단 SEND ME A MESSAGE 바로 아래에 세로로 렌더링됩니다.
                Typography PNG와는 분리되어 있으므로 PNG 크기/위치가 바뀌어도 SNS 위치는 영향을 받지 않습니다 */}
            {workView === "selected" ? (
              <AccordionGallery
                className="pf-view-slide-in"
                onOpenProject={openProject}
                thumbRefs={thumbRefs}
                phase={phase}
                hiddenId={phase === "home" ? null : hiddenThumbId}
                homeOpacity={homeOpacity}
              />
            ) : (
              <WorksGrid
                onOpenProject={openProject}
                itemRefs={worksThumbRefs}
                sortOrder={worksSortOrder}
                setSortOrder={setWorksSortOrder}
              />
            )}
          </div>

          {/* ABOUT부터 Footer까지는 하나의 이어진 Black 섹션입니다 (HOME/Orbit/WORKS는 계속 #F6F6F6 유지) */}
          <div className="pf-dark-section">
            <div className="pf-section">
              <div className="pf-section-label">{siteInfo.aboutTitle}</div>

              {/* ABOUT: 텍스트(좌) + PNG 이미지(우) 2-column. 모바일에서는 텍스트 → 이미지 순서로 세로로 쌓입니다 */}
              <div className="pf-about-layout">
                <div className="pf-about-text">
                  <h2 className="pf-about-headline">{siteInfo.aboutHeadline}</h2>
                  <p className="pf-about-body">{siteInfo.aboutBody}</p>

                  {/* 사용 툴 marquee — 오른쪽에서 왼쪽으로 끊김 없이 무한 반복됩니다 (pill은 검정 배경에서도 항상 흰색 유지) */}
                  <div className="pf-marquee" aria-hidden="true">
                    <div className="pf-marquee-track">
                      <div className="pf-marquee-group">
                        {siteInfo.tools.map((t, i) => (
                          <span className="pf-marquee-pill" key={"t1-" + i}>
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="pf-marquee-group">
                        {siteInfo.tools.map((t, i) => (
                          <span className="pf-marquee-pill" key={"t2-" + i}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✏️ ABOUT 오른쪽에 들어갈 투명 PNG 이미지 — siteInfo.aboutImage 값만 교체하면 됩니다 */}
                <div className="pf-about-image-wrap">
                  <img src={siteInfo.aboutImage} alt="" draggable={false} />
                </div>
              </div>
            </div>

            <div className="pf-section">
              <div className="pf-section-label">Career / Experience</div>
              <div className="pf-career-list">
                {siteInfo.career.map((c, i) => (
                  <div className="pf-career-row" key={i}>
                    <div className="pf-career-period">{c.period}</div>
                    <div className="pf-career-role">{c.role}</div>
                    <div className="pf-career-place">{c.place}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* id="contact" — 상단 Header의 "SEND ME A MESSAGE" 버튼이 클릭 시 이 지점으로 smooth scroll 이동합니다 */}
            <div className="pf-section" id="contact">
              <div className="pf-section-label">Contact</div>

              {/* CONNECT: PNG 이미지(좌) + 텍스트(우) 2-column — ABOUT과 반대 방향. 모바일에서는 이미지 → 텍스트 순서로 세로로 쌓입니다 */}
              <div className="pf-connect-layout">
                {/* ✏️ CONNECT 왼쪽에 들어갈 투명 PNG 이미지 — siteInfo.connectImage 값만 교체하면 됩니다 */}
                <div className="pf-connect-image-wrap">
                  <img src={siteInfo.connectImage} alt="" draggable={false} />
                </div>

                <div className="pf-connect-text">
                  <div className="pf-contact-row">
                    {/* 이메일 클릭 → 기본 메일 프로그램의 새 작성 창이 열리고 받는사람에 자동 입력됩니다 */}
                    <a className="pf-contact-email" href={`mailto:${siteInfo.email}`}>
                      {siteInfo.email}
                    </a>
                    {/* COPY 클릭 → clipboard로 이메일 주소 복사 + 하단 toast 표시 */}
                    <button type="button" className="pf-copy-btn" onClick={handleCopyEmail}>
                      COPY
                    </button>
                  </div>
                  <div className="pf-social-list">
                    {siteInfo.instagram && (
                      <a href={siteInfo.instagram} target="_blank" rel="noreferrer">
                        Instagram
                      </a>
                    )}
                    {siteInfo.behance && (
                      <a href={siteInfo.behance} target="_blank" rel="noreferrer">
                        Behance
                      </a>
                    )}
                    <a href={`mailto:${siteInfo.email}`}>Email</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pf-footer">
              © {new Date().getFullYear()} {siteInfo.name}. All rights reserved.
            </div>
          </div>
        </div>
      )}

      {/* COPY 클릭 시 잠깐 나타나는 작은 toast — alert()나 큰 modal 없이 화면 하단 중앙에 표시됩니다 */}
      <div
        className={"pf-toast" + (emailCopied ? " pf-toast-visible" : "")}
        role="status"
        aria-live="polite"
      >
        EMAIL COPIED
      </div>

      {showDetail && selected && (
        <ProjectDetail
          project={selected}
          onBack={closeProject}
          onNext={goNext}
          fading={detailFading}
          hideHero={phase === "closing"}
          scrollRef={scrollRef}
        />
      )}

      {flip && (
        <div
          className="pf-flip-overlay"
          style={{
            top: (flip.stage === "start" ? flip.from.top : flip.to.top) + "px",
            left: (flip.stage === "start" ? flip.from.left : flip.to.left) + "px",
            width: (flip.stage === "start" ? flip.from.width : flip.to.width) + "px",
            height: (flip.stage === "start" ? flip.from.height : flip.to.height) + "px",
            transition:
              "top 0.72s cubic-bezier(0.22,0.61,0.36,1), left 0.72s cubic-bezier(0.22,0.61,0.36,1), width 0.72s cubic-bezier(0.22,0.61,0.36,1), height 0.72s cubic-bezier(0.22,0.61,0.36,1)",
          }}
        >
          <img src={flip.project.heroImage} alt={flip.project.title} />
        </div>
      )}
    </div>
  );
}
