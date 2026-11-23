# Whiteboard project (AI agentic whiteboard)

Ye project ek YouTube tutorial ke concepts pe bana hai. Copy paste nahi hai, kai jagah apna tareeka hai.
Video: https://www.youtube.com/watch?v=mXSt_YSlp-U

## Stack
- Next.js (App Router), React, TypeScript, Tailwind, shadcn/ui
- Clerk (auth), Drizzle ORM with Neon Postgres
- Excalidraw (whiteboard canvas), Axios (API calls)
- AI: Gemini free tier

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

Video ke chapters jo done hain (3:09:52 tak):
1. 00:00:00 Introduction
2. 00:11:38 Project Setup using Boilerplate
3. 00:25:12 AI Review using CodeRabbit Setup
4. 00:29:56 DB and Authentication Setup
5. 00:59:45 Dashboard Layout
6. 01:30:07 Dashboard Page
7. 01:44:55 Create New Workspace
8. 02:16:58 Whiteboard Layout
9. 02:53:10 Customize Toolbar

Codebase mein jo bana hua hai (Antigravity ke hisaab se):
- Next.js setup, Clerk auth, Drizzle DB with users, Projects, WhiteBoardContent schemas
- Dashboard layout (sidebar, header, welcome banner)
- Dashboard page with project list aur empty state
- Create New Workspace dialog with API route
- Workspace page with WhiteBoard/Docs tab switching
- Whiteboard with Excalidraw aur custom toolbar (CSS, tool buttons, save API)
- Whiteboard API route for saving canvas data

Verify karne wali cheezein: Docs tab sirf switch hota hai ya uska content bhi bana hai. Whiteboard ka autosave comment kiya hua hai ya chal raha hai.

## Pending chapters, is order mein
| Order | Transcript file | Video chapter | Start |
|---|---|---|---|
| 1 | 02-ai-features-diagrams.md | AI Features (Diagrams) + AI Extras | 3:45:12, 4:50:00 |
| 2 | 03-export-as-image.md | Export as Image | 4:39:23 |
| 3 | 04-fetch-whiteboard-data.md | Fetch Whiteboard Data | 4:51:54 |
| 4 | 05-display-project-list.md | Display Project List | 5:06:47 |
| 5 | 06-credits-update.md | Credits Update | 5:39:02 |
| 6 | 01-floating-element-properties.md | Floating Element Properties | 3:09:52 |

Dependency Claude ko code dekh ke confirm karni hai. Agar kisi chapter ko order se pehle chahiye ho to batao.

## AI provider
Gemini free tier, @google/genai package.
- .env mein GOOGLE_API_KEY aur GEMINI_MODEL. Model ka naam code mein hardcode mat karo.
- Video ka model naam purana ho sakta hai. Current naam AI Studio se confirm karo. Free tier mein abhi ye models hain: Gemini 3.8 Flash, 3.6 Flash, 3.5 Flash-Lite, 3.1 Flash-Lite, Gemma 4. Pro free nahi hai. Purane 2.5 models naye projects ko nahi mil rahe.
- isme jo callback hoga, callback ka jo AI provider hoga, wo hoga apna Grok ka hai. usme tu hai na, ChatGPT ka ek model hai(openai/gpt-oss-120b).
- Free tier ki limits Google ne docs mein publish nahi ki. Wo AI Studio ke rate limit page pe project ke hisaab se dikhti hain. Quota midnight Pacific time pe reset hota hai.
- Ek diagram generate karna ek request hai. Response lamba JSON hota hai, isliye loading placeholder zaroor rakho.

Error handling:
- 429 aaye to toast mein saaf message dikhao, jaise abhi limit khatam, thodi der baad try karo.
- Generate button loading ke dauran disable rakho.
- Request fail ho to loading state band karo aur canvas se placeholder hatao.

Fallback (ye baad mein, jab AI feature ek model se chal jaye):
- GEMINI_MODEL primary aur GEMINI_FALLBACK_MODEL fallback, dono .env se.
- Primary 429, 500 ya 503 de to ek baar fallback pe try karo. Phir bhi fail ho to toast dikhao.
- Server console mein log karo ki kaunsa model chala.
- Task ke hisaab se model routing abhi mat banao. Pehle dono models pe same prompt chala ke quality ka farak dekhenge.

Agar diagram ka layout kharab aaye (boxes overlap ho rahe hon): model se sirf Mermaid text ya nodes aur edges maango aur layout code se banao. Excalidraw ka mermaid-to-excalidraw package is kaam ke liye hai. Pehle uske docs verify karo, phir mujhse poochho.

## Chapter ke khaas dhyan wale points
- AI Features: AI floating sidebar component, canvas pe skeleton placeholder, /api/ai route, structured JSON response schema, placeholder hatana, diagram render. Gemini ke liye prompt aur response schema transcript ke hisaab se.
- AI Extras: notes, emoji aur icons wale features. Whiteboard ka autosave (10 second debounce wala save) jo testing ke liye comment kiya tha, use uncomment karna hai.
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
