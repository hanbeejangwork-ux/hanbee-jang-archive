이 폴더(public/images/)는 배포된 사이트에서 "/images/..." 경로로 그대로 서빙됩니다.

src/App.jsx 안의 siteInfo.homeTypographyImage 값이 현재
  "/images/home-typography.png"
로 설정되어 있습니다. 실제 타이포그래피 PNG 파일을 이 폴더 안에
"home-typography.png"라는 이름으로 넣으면 배포 후 바로 반영됩니다.

프로젝트 썸네일 / Hero 이미지, About / Connect 이미지 등은 현재
src/App.jsx 안에서 SVG data URI placeholder(ph(), graphicPlaceholder(),
signaturePlaceholder() 함수)로 자동 생성되고 있어 별도 파일이 없어도
정상적으로 렌더링됩니다. 실제 이미지로 교체하고 싶다면:

  1) 이미지 파일을 이 public/images/ 폴더 안에 넣고
  2) src/App.jsx 안의 해당 값(thumbnail, heroImage, aboutImage,
     connectImage, siteInfo.signatureImage 등)을
     "/images/파일명.jpg" 형태의 문자열로 바꿔주면 됩니다.
