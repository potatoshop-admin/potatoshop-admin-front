# POTATO SHOP ADMIN

옷 쇼핑몰의 **상품 / 주문 / CS(문의)** 를 관리할 수 있는 어드민 웹입니다.
**TanStack Table(React Table)** 기반으로 목록을 구성해, 많은 데이터를 **상태별로 빠르게 파악**할 수 있도록 만드는 것이 목표였습니다.

--------------------------------------------------------------

### Tech Stack

- Next.js 15 / React / TypeScript
- React Query / TanStack Table(React Table)
- Zustand
- shadcn/ui / Tailwind CSS
- cookies / axios / jwt-decode
- 배포: EC2, Nginx

---------------------------------------------------------------

### Pages

###### App Router 구조를 (beforeLogin), (afterLogin) 으로 분리해 인증 전/후 화면을 명확히 구분했습니다.

#### Auth

- 로그인
- 스토어 유저 로그인
- 인증 성공 시 대시보드로 이동

#### Store

- 스토어 생성
- 관리할 스토어 생성
- 스토어 유저 생성
- 생성된 스토어에 속한 유저 생성

#### Dashboard

- 30초마다 refetch로 주요 지표 갱신
- Lazy loading 적용으로 초기 로딩 번들 축소 (115kb → 3.07kb)

#### Products

- 제품 목록
- 전체 / 현 시즌 / 전 시즌
- 제품 관리
- 제품 등록 / 수정

#### Orders

- 주문 목록(상태별 필터)
- 전체, 결제 완료, 제품 준비중, 배송중, 배송 완료
- 취소 요청/완료, 교환 요청/완료, 반품 요청/완료

#### CS / Review / Users

- CS 문의 관리
- 리뷰 관리
- 유저 관리
- 스토어 유저 관리
  -권한: MASTER / MANAGER / STAFF
- MASTER 권한은 메뉴바 프로필 → Manage User에서 접근 가능

----------------------------------------------------------------

#### 반응형 레이아웃: 사이드바 & 메뉴 탭

화면 크기에 따라 사이드바가 축소/확장되고, 모바일에서는 메뉴 탭 형태로 전환됩니다.
<p align="center">
<img src="/public/readmeImage/Screenshot%202025-12-16%20at%2012.06.49%E2%80%AFAM.png" width="700" alt="sidebar" />
<img src="/public/readmeImage/Screenshot%202025-12-16%20at%2012.07.00%E2%80%AFAM.png" width="700" alt="sidebar-close" />
<img src="/public/readmeImage/Screenshot%202025-12-16%20at%2012.07.23%E2%80%AFAM.png" width="300" alt="menu-tab-fold" />
<img src="/public/readmeImage/Screenshot%202025-12-16%20at%2012.07.29%E2%80%AFAM.png" width="300" alt="menu-tab-unfold" />
</p>

-------------------------------------------------------------------

#### 대시보드 화면 및 React-table이 사용된 상품 화면

<p align="center">
<img src="/public/readmeImage/Screenshot%202025-12-16%20at%201.25.24%E2%80%AFAM.png" width="350" alt="sidebar" />
<img src="/public/readmeImage/Screenshot%202025-12-16%20at%201.25.47%E2%80%AFAM.png" width="350" alt="sidebar-close" />
<img src="/public/readmeImage/Screenshot%202025-12-16%20at%201.26.52%E2%80%AFAM.png" width="350" alt="menu-tab-fold" />
<img src="/public/readmeImage/Screenshot%202025-12-16%20at%201.27.00%E2%80%AFAM.png" width="350" alt="menu-tab-unfold" />
</p>
