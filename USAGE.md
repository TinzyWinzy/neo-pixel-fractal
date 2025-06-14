# Neo-Pixel Fractal System Usage

## 1. CLI Post Creation
- Run: `node scripts/new-post.js`
- Prompts for title, tags, description, and body (one-liner or multi-line)
- Saves new markdown post to `src/posts/`
- Posts are auto-slugged and timestamped
- Future: Use `--deepseek` flag to generate/expand posts with AI

## 2. Web Admin Interface (`/admin`)
- Visit `/admin` in your browser
- Login with your credentials (basic auth)
- Create new posts via a form (title, tags, description, body)
- Upload or paste markdown for posts created elsewhere
- Only authenticated users can access admin features

## 3. Authentication
- Only the owner (you) can log in to `/admin`
- Basic password authentication (credentials set in environment or config)
- Do not share your password; no registration or password reset by default

## 4. Mobile Access
- The `/admin` route is mobile-friendly
- You can create, edit, or upload posts from your phone
- No terminal required for post management

## 5. Future Enhancements
- Deepseek AI integration for post generation/expansion
- Richer admin UI (preview, edit, delete)
- Optional: Git-based CMS or headless CMS integration

---
*For questions or issues, contact White Half Moon.* 