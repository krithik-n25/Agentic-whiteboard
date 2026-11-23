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

Codebase mein jo bana hua hai (code se verify kiya hua):
- Next.js setup, Clerk auth, Drizzle DB with users, Projects, WhiteBoardContent schemas
- Dashboard layout (sidebar, header, welcome banner)
- Dashboard page with project list aur empty state
- Create New Workspace dialog with API route
- Workspace page with WhiteBoard/Docs tab switching. Whiteboard `next/dynamic` se `ssr: false` ke saath load hota hai (Excalidraw import pe `window` use karta hai).
- Whiteboard with Excalidraw aur custom toolbar (CSS, tool buttons)
- Whiteboard autosave: 10 second debounce ke saath chal raha hai (kabhi comment nahi tha). AI placeholder save nahi hota.
- Whiteboard API route for saving canvas data
- AI helper: `components/custom/workspace/AIFloatingSidebar.tsx` (bottom-right AI button, 5 tools, canvas placeholder, diagram render), `lib/aiTools.ts` (tools aur unke prompts, server pe hi use hote hain), `app/api/ai/route.ts`
- AI diagram ke arrows code se route hote hain (`routeArrow`): seedha, L-shape, ya right side se ghoom ke. Boxes ki position model deta hai, use badla nahi jaata.
- Extras: `components/custom/workspace/ExtrasPanel.tsx`, toolbar mein Note, Emoji aur Icons (lucide SVG image ki tarah)
- Export as Image: workspace header mein Export button. Whiteboard `onApiReady` prop se Excalidraw API page ko deta hai (unmount pe null). Page `exportToBlob` se PNG download karta hai, AI placeholder filter hota hai. Docs tab pe button disabled.

Abhi adhuri / known cheezein:
- Docs tab (`SmartDocx.tsx`) sirf placeholder hai, koi content nahi. Kisi pending chapter mein nahi hai.
- Workspace header ka Save aur Share button kuch nahi karta. Header mein naam "Workspace Name" hardcoded hai (Fetch Whiteboard Data chapter mein aayega).
- `/api/whiteboard` project ownership check nahi karta.
- Login se pehle `POST /api/user` 404 deta hai (purana code).
- `testCase_img/` local AI test screenshots hain, .gitignore mein hai.

## Pending chapters, is order mein
| Order | Transcript file | Video chapter | Start |
|---|---|---|---|
| 3 | 04-fetch-whiteboard-data.md | Fetch Whiteboard Data | 4:51:54 |
| 4 | 05-display-project-list.md | Display Project List | 5:06:47 |
| 5 | 06-credits-update.md | Credits Update | 5:39:02 |
| 6 | 01-floating-element-properties.md | Floating Element Properties | 3:09:52 |

Dependency Claude ko code dekh ke confirm karni hai. Agar kisi chapter ko order se pehle chahiye ho to batao.

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
- Credits Update: POST /api/projects mein pehle credits check, phir create hone pe ek credit minus. Sidebar mein credits user detail context se. Video mein ek bug tha: credits ka check number mein convert karke karo (Number(credits) <= 0). Insufficient credits pe dialog mein loading band karo aur navigate mat karo.
- Floating Element Properties: selected element state, floating position calculation, property change handlers, delete, duplicate, bring to front aur send to back (filter se, find se nahi), lock.

## Database
- Jab schema badle (naya column ya table), Drizzle ka push script chalao. Video mein npm run db push aur npm run db studio use hua tha. package.json mein actual script naam dekho.
- Credits aur Display Project List chapters mein schema badlega. Un chapters se pehle mujhse git commit karwao.

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
