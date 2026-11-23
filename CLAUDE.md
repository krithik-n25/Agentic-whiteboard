# Whiteboard project (AI agentic whiteboard)

Ye project ek YouTube tutorial ke concepts pe bana hai. Copy paste nahi hai, kai jagah apna tareeka hai.
Video: https://www.youtube.com/watch?v=mXSt_YSlp-U

## Stack
- Next.js (App Router), React, TypeScript, Tailwind, shadcn/ui
- Clerk (auth), Drizzle ORM with Neon Postgres
- Excalidraw (whiteboard canvas), Axios (API calls)
- AI: Groq (primary) + Gemini free tier (fallback)

## Rules (hamesha follow karo)
- Jo kaam complete hai usko mat chhedna. Sirf pending chapter pe kaam karo.
- Ek baar mein sirf ek chapter. Chapter khatam hone pe ruk jao.
- Pehle plan batao, meri haan ke baad hi code likho.
- Transcripts auto captions hain. Sirf concept aur steps ke liye use karo. Variable names, spelling aur syntax galat ho sakte hain. Code mere existing project ke style mein likho, copy mat karo.
- Libraries ke current docs dekho. Video ka code ya model naam purana ho sakta hai.
- API keys sirf .env mein. Code mein, logs mein ya chat mein kabhi nahi. .env ko commit mat karo.
- git commit tabhi karo jab main bolun.
- docs/transcripts/ ki files edit mat karo.
- Har chapter ke end mein chhota summary do: kya complete hua, kya bacha. Phir is file ka Status section update karne ka suggestion do.

## Transcripts
Folder: docs/transcripts/ (README.md mein index hai). Har file ek chapter ka transcript hai, paragraph ke shuru mein H:MM:SS marker hai.

## Status
Antigravity ne video ke chapters aur codebase ka summary banaya tha. Ye AI ka likha hua hai, isliye pehle actual code se verify karo. Jo cheez done likhi hai par code mein adhuri hai, mujhe batao.

Video ke chapters jo done hain:
1. 00:00:00 Introduction
2. 00:11:38 Project Setup using Boilerplate
3. 00:25:12 AI Review using CodeRabbit Setup
4. 00:29:56 DB and Authentication Setup
5. 00:59:45 Dashboard Layout
6. 01:30:07 Dashboard Page
7. 01:44:55 Create New Workspace
8. 02:16:58 Whiteboard Layout
9. 02:53:10 Customize Toolbar
10. 03:45:12 AI Features (Diagrams) + 04:50:00 AI Extras (Claude ne banaya, user ne test karke commit kiya)
11. 04:39:23 Export as Image
12. 04:51:54 Fetch Whiteboard Data
13. 05:06:47 Display Project List (Archive page bhi bana, jo tutorial ka homework tha)
14. 05:39:02 Credits Update (apna tareeka: sirf monthly AI credits, board ki koi limit nahi)
15. 03:09:52 Floating Element Properties (saath mein drag, tool lock, aur Docs ki jagah Code tab)

Saare video chapters done hain. Ab jo bhi banega wo apna feature hai.

Codebase mein jo bana hua hai (code se verify kiya hua):
- Next.js setup, Clerk auth, Drizzle DB with users, Projects, WhiteBoardContent schemas
- Dashboard layout (sidebar, header, welcome banner)
- Dashboard page with project list aur empty state (list ki details neeche Display Project List mein)
- Create New Workspace dialog with API route
- Workspace page with WhiteBoard/Code tab switching (tabs controlled: page `activeTab` header ko deta hai). Whiteboard `next/dynamic` se `ssr: false` ke saath load hota hai (Excalidraw import pe `window` use karta hai).
- Whiteboard with Excalidraw aur custom toolbar (CSS, tool buttons)
- Whiteboard autosave: 10 second debounce ke saath chal raha hai (kabhi comment nahi tha). AI placeholder save nahi hota.
- Whiteboard API route for saving canvas data
- AI helper: `components/custom/workspace/AIFloatingSidebar.tsx` (bottom-right AI button, 5 tools, canvas placeholder, diagram render), `lib/aiTools.ts` (tools aur unke prompts, server pe hi use hote hain), `app/api/ai/route.ts`. Groq/Gemini call aur fallback `lib/aiProviders.ts` mein (schema leta hai, dono AI routes use karte hain).
- AI diagram ke arrows code se route hote hain (`routeArrow`): seedha, L-shape, ya right side se ghoom ke. Boxes ki position model deta hai, use badla nahi jaata.
- Extras: `components/custom/workspace/ExtrasPanel.tsx`, canvas ke neeche beech mein dock (`.extras-dock`): Note, Emoji aur Icons (lucide SVG image ki tarah). Popups aur tooltip upar khulte hain. Left toolbar mein ab nahi hai.
- Export as Image: workspace header mein Export button. Whiteboard `onApiReady` prop se Excalidraw API page ko deta hai (unmount pe null). Page `exportToBlob` se PNG download karta hai, AI placeholder filter hota hai. Code tab pe button disabled.
- Fetch Whiteboard Data: `GET /api/projects?projectId=` pehle ownership check karta hai (projectId + user email, warna 404), phir projectName, elements, appState, files deta hai (naye project pe khaali). Page data `restoreElements`/`restoreAppState` se `updateScene` + `addFiles` karta hai (undo history mein nahi). `appState.collaborators` load se pehle hataya jaata hai, kyunki JSON mein wo `{}` save hota hai aur Excalidraw crash karta hai. Load hone tak autosave band (`isLoaded` prop). Header mein asli project naam.
- Code tab pe Whiteboard unmount nahi hota, sirf `hidden` hota hai (unsaved changes aur API bachi rehti hai). Wapas aane pe `api.refresh()`. Code tab bhi hidden hi hota hai, unmount nahi. (`Whiteboard.tsx` mein ek purana comment abhi bhi "unmounts" bolta hai, code sahi hai.)
- Display Project List:
  - Schema: `WhiteBoardContent.previewImage` (`preview_image`, text, nullable) aur `Projects.isDeleted` (`is_deleted`, boolean, default false). DB push ho chuka hai.
  - Preview: har autosave pe `Whiteboard.tsx` `exportToBlob` se JPEG banata hai (`maxWidthOrHeight: 400`, quality 0.5), base64 data URL `/api/whiteboard` ko jaata hai. Khaali canvas pe null. Preview fail ho to bhi canvas save hota hai.
  - `GET /api/projects` bina `projectId`: user ke non-archived projects, `WhiteBoardContent` ke saath leftJoin. "Edited" time = whiteboard ka `updatedAt`, warna project ka `createdAt` (`.mapWith` se, timezone sahi rehta hai). Naye se purane order.
  - `GET /api/projects?archived=true` archived list deta hai.
  - `PATCH /api/projects` body `{ projectId, archived: true/false }` = archive ya restore. `DELETE /api/projects` = hamesha ke liye delete (pehle whiteboard row, phir project, `db.batch` mein). Dono mein ownership check (projectId + email, warna 404).
  - `ProjectList.tsx`: loading skeleton, "Your Boards" grid (2/3/4 column), card pe preview (plain `<img>`, na ho to icon), naam, `date-fns` se "Edited ... ago". Card click se `router.push` workspace.
  - Card pe Archive button (bina dialog, seedha archive, toast, hover pe light blue) aur Trash button (confirm dialog, phir permanent delete, toast).
  - Archive page `app/dashboard/archive/page.tsx` = `<ProjectList archived />`. Wahan Archive ki jagah Restore button (bina dialog, toast) aur Trash (permanent delete). Khaali ho to "No archived boards".
  - Sidebar: "All File" `/dashboard` aur "Archived" `/dashboard/archive` ke links (`render={<Link />}`). "All File" sirf exact `/dashboard` pe highlight. Shared, AI-Assistents, Settings abhi kahin nahi jaate.
- Credits Update (video se alag, user ka faisla):
  - Boards ki koi limit nahi. Limit sirf AI ki: `lib/plans.ts` mein `FREE_AI_CREDITS = 10` har mahine, har mahine ki 1 tareekh (UTC) ko refill. Limit badalni ho to sirf yahi file.
  - Schema: `users.credits` = AI credits (default `FREE_AI_CREDITS`), `users.credits_reset_at` (null matlab agle check pe refill). DB push ho chuka hai.
  - `lib/credits.ts` (server): `spendAICredit` ek hi UPDATE query mein naye mahine ka refill + check + 1 minus karta hai (credits minus mein nahi jaate), `refundAICredit` (AI fail pe +1), `refillCreditsIfNewMonth`.
  - `POST /api/ai`: AI call se pehle 1 credit kat-ta hai. 0 ho to 403 (`NO_AI_CREDITS`), AI call nahi hoti. Saare providers fail hon to refund. Har response mein bache `credits`.
  - `POST /api/user`: pehle refill check, phir user row deta hai.
  - Context ab `{ userDetails, setUserDetails }` deta hai (`app/provider.tsx`).
  - Sidebar mein "AI credits left X / 10" progress bar aur "Resets on 1 ...". AI sidebar mein credits dikhte hain. 0 pe Generate disabled, laal reason, aur 403 pe "AI credits finished" toast. Generate ke baad credits bina refresh update.
- Floating Element Properties (`components/custom/workspace/FloatingProperties.tsx`):
  - `Whiteboard.tsx` ka `onChange` (`TrackSelection`) selected elements aur toolbar ki jagah nikalta hai, state tabhi badalti hai jab selection / version / zoom / scroll badle. Draw, drag, resize, rotate, text edit, AI placeholder pe toolbar chhupta hai. Locked aur shape ke andar ka label selection mein nahi gine jaate.
  - Position: `getCommonBounds` + `sceneCoordsToViewportCoords`, `position: fixed`, element ke upar beech mein, jagah na ho to neeche, screen ke andar clamp.
  - Toolbar: stroke color, background (shapes), "⋯" Popover mein type ke hisaab se options (width, style, sloppiness, fill, edges, arrowheads, font, size, align, opacity), phir Duplicate, Front, Back, Lock, Delete. Kai elements ek saath bhi.
  - Badlav `newElementWith` se, `CaptureUpdateAction.IMMEDIATELY` (undo chalta hai). Font/size/align pe poore scene ka `restoreElements(..., { refreshDimensions: true })` se sirf text ka naya size liya jaata hai (akele text ko restore karne se arrow bindings toot-ti hain).
  - Color/opacity shape ke label (bound text) pe bhi. Edges: rectangle `ADAPTIVE_RADIUS`, diamond `PROPORTIONAL_RADIUS`.
  - Delete: label ke saath, arrows ki binding aur shapes ke `boundElements` saaf. Duplicate: naye id/seed, +20px, label bhi, naye group ids, sirf copy hue elements ki binding, copy select hoti hai. Front/back: array order (filter), `syncInvalidIndices` index theek karta hai. Lock ke baad selection hatta hai, unlock right-click > Unlock all.
  - Grip (⋮⋮) se drag hota hai (pointer capture). Naye selection pe `key` badalta hai to drag offset 0.
- Left toolbar ka Lock button = Excalidraw ka tool lock ("keep selected tool active after drawing", `Q`). `onChange` se `activeTool` aur `locked` sync hote hain, isliye toolbar ka highlight Excalidraw ke asli tool se match karta hai.
- Code tab (Docs ki jagah, `components/custom/workspace/CodeFlow.tsx`):
  - Code paste karo, AI se flowchart. Code save nahi hota (user ka faisla), photo support nahi.
  - Limits `lib/codeFlow.ts`: 200 lines / 6000 characters. Language dropdown.
  - `POST /api/ai/code`: 1 AI credit. Model Mermaid `flowchart TD` + `steps` deta hai. Code nahi hai to 422 + refund. Providers fail hon ya Mermaid na mile to refund.
  - Browser mein `@excalidraw/mermaid-to-excalidraw` (2.2.2) se elements, `regenerateIds: true`, rang: ellipse hara (start/end), rectangle neela, diamond peela. Purani drawing ke right mein. Phir WhiteBoard tab aur `scrollToContent`.
  - Steps pe click se code ki lines select. "Show on whiteboard". Mermaid draw na ho to toast, credit wapas nahi (browser check pe refund nahi diya).
- `docs/TESTING.md`: user ki personal testing guide (app chalana, checklist, Studio/SQL se credits reset). `.gitignore` mein hai, commit nahi hoti.

Abhi adhuri / known cheezein:
- Workspace header ka Save aur Share button kuch nahi karta.
- `/api/whiteboard` project ownership check nahi karta.
- Login se pehle `POST /api/user` 404 deta hai (purana code).
- `testCase_img/` local AI test screenshots hain, .gitignore mein hai.
- Archive kiya hua board seedhe link se (ya Archive page pe card click se) ab bhi khul jaata hai.

## Pending chapters, is order mein
Koi pending chapter nahi. Saare chapters done.

## AI provider (ban gaya hai)
- **Primary: Groq** (console.groq.com, Elon wala Grok nahi). Model `openai/gpt-oss-120b`. Plain `fetch` se OpenAI-compatible `/chat/completions`, `response_format: json_schema` with `strict: true`. Strict mode mein saare fields required hain, optional fields nullable.
- **Fallback: Gemini**, `@google/genai` package, `responseJsonSchema` ke saath. Abhi `gemini-3.6-flash`. `gemini-3.8-flash` 503 (high demand) de raha tha.
- .env mein: `GROQ_API_KEY`, `GROQ_MODEL`, `GOOGLE_API_KEY`, `GEMINI_MODEL`. Model ka naam code mein hardcode mat karo. Jis provider ki key ya model missing ho, wo skip hota hai.
- `GEMINI_MODEL` mein API ka ID chahiye (jaise `gemini-3.6-flash`), display naam ("Gemini 3.8 Flash") nahi.
- Primary 429, 500 ya 503 de to ek baar fallback pe try hota hai. Server console mein log hota hai kaunsa provider chala.
- Toast: 429 pe "AI limit reached", 503 pe "AI busy". Fail hone pe placeholder hatta hai aur loading band hoti hai.
- Gemini free tier ki limits AI Studio ke rate limit page pe dikhti hain. Quota midnight Pacific time pe reset hota hai.
- Task ke hisaab se model routing abhi mat banao.

Agar diagram ka layout kharab aaye (boxes overlap ho rahe hon): model se sirf Mermaid text ya nodes aur edges maango aur layout code se banao. Excalidraw ka mermaid-to-excalidraw package is kaam ke liye hai. Pehle uske docs verify karo, phir mujhse poochho. (Abhi zaroorat nahi padi. Arrow routing code se theek ho gaya.)

## Chapter ke khaas dhyan wale points
- Export as Image: Excalidraw ka default top menu CSS se hide karna, workspace header mein Export button, API ready callback parent ko dena, PNG blob download.
- Fetch Whiteboard Data: GET endpoint project ID ke saath. Check karo ki project usi user ka hai (user email se). Page pe data fetch karke canvas update karna aur header mein project ka naam dikhana.
- Display Project List: preview image base64 mein, chhoti size aur kam quality (400 x 225, quality lagbhag 50%). whiteboard_data mein naya preview_image column. Projects mein is_deleted column (default false) soft delete ke liye. Dashboard pe grid of cards, date ke liye moment. Archive page tutorial ne homework chhoda hai.
- Credits Update: (done, video se alag) credits board banane pe nahi, AI generation pe katte hain. Details Status mein.
- Floating Element Properties: selected element state, floating position calculation, property change handlers, delete, duplicate, bring to front aur send to back (filter se, find se nahi), lock.

## Database
- Jab schema badle (naya column ya table), Drizzle ka push script chalao. Video mein npm run db push aur npm run db studio use hua tha. package.json mein actual script naam dekho.
- Jis bhi chapter mein schema badle, usse pehle mujhse git commit karwao.

## Workflow
1. Naya session: is file ko padho, Status verify karo.
2. Plan mode mein chapter ka transcript padho aur plan batao. Code mat likho.
3. Meri haan ke baad implement karo. Main chalake check karunga.
4. Sab theek ho to main commit karunga, phir /clear, phir agla chapter.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
