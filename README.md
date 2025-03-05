# next-scribble
## 📌 Introduction
- 관리자와 유저가 사용하는 쇼핑몰 사이트입니다.<br>A shopping mall platform for both users and administrators.</br>
- Next.js, TypeScript, 데이터베이스는 drizzle-orm을 사용해 만들었습니다. <br/>Built with <b>Next.js, TypeScript, and drizzle-orm</b> for the database.</br>
- 카트 상태 관리를 위해 zustand를 사용했고, 카드 결제의 경우 stripe api를 사용했습니다(현 시점에서 결제는 테스트 모드에서만 가능합니다).<br>Used <b>Zustand</b> for cart state management and <b>Stripe API</b> for payments (currently available in test mode only).</br>
- shadcn ui를 사용하여 디자인했습니다. <br>Designed with <b>shadcn-ui</b>.</br>

## 📌 About
- 회원가입은 직접 가입, 구글 및 깃허브 계정 연동으로 가능합니다.<br>Users can sign up manually or log in using their Google or GitHub accounts.</br>
- 관리자들만 쇼핑몰 판매 물품을 작성, 삭제, 수정할 수 있습니다.<br>Only administrators can create, update, and delete products in the store.</br>
- 사용자들은 카드에 물건을 담아 결제 또는 삭제할 수 있으며, 각 아이템에 리뷰를 작성할 수 있습니다. <br>Users can add items to their cart, complete purchases, or remove items. They can also write reviews for products.</br>
- 메인 화면 검색창에는 Algolia Search를 연동하였습니다.<br>Integrated <b>Algolia Search</b> for the main page search bar.</br>

## 📌 Deploy
https://next-scribble.store

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
