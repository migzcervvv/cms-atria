Yes, it’s possible. Here’s a short but clear Codex-ready prompt:

````markdown id="gbuhad"
# Add Article Preview Page

## Project Context

This is a React JavaScript CMS/news article project using:

- React JavaScript
- BlockNote editor
- Cloudflare R2 for uploaded images/videos

Do **not** convert anything to TypeScript.

The create/edit article page already has:

- Article title
- Category
- Cover image from the article setup modal
- BlockNote article body
- Sidebar navigation
- Publish / save flow

---

## Task

Add an article preview feature.

In the create/edit post page, add a **Preview** button.

When clicked:

- The button should enter a loading state to prevent repeated clicks/spam.
- The current article data should be passed to a preview page.
- The preview page should render the article in a centered blog/news article layout.
- The sidebar should remain visible on the preview page.
- The preview page should include a header action or breadcrumb so the user can go back to editing.

---

## Preview Page Layout

Use the attached image as the visual reference.

The preview page should be centered and article-like.

Render the content in this order:

1. Article title
2. Category badge/label
3. Cover image
4. Date
5. Estimated reading time
6. Article body

Example structure:

```text
[Title]

[Category]

[Cover Image]

[Date]    [3 mins read]

--------------------------------

[Article body]
```
````

---

## Design Requirements

- Use **Inter Display** font if available in the project.
- Keep the article content centered.
- Use a readable max-width.
- Make it look like a professional article/news/blog preview.
- Keep spacing clean and intentional.
- Do not add unrelated UI elements.
- Do not remove the sidebar.
- Match the reference image’s general article structure, not necessarily the exact colors.

---

## Reading Time Requirement

Automatically calculate estimated reading time from the article body.

Rules:

- Count words from the rendered/plain text article body.
- Use a standard reading speed, around 200 words per minute.
- Minimum display should be `1 min read`.
- Example output:

```text
3 mins read
```

---

## Navigation Requirement

Add a way to return to the editor from the preview page.

Use either:

- A breadcrumb, such as `Articles / Edit / Preview`
- Or a button/link, such as `Back to editor`

The back action should return the user to the article editor without losing the current article data.

---

## Implementation Notes

- Reuse existing article state/data patterns if available.
- If the article is already saved as a draft, preview can load from saved draft data.
- If the article is not yet saved, pass preview data safely using the simplest existing project pattern.
- Do not implement public publishing changes.
- This preview page is for admin/editor review only.

---

## Acceptance Criteria

Done when:

- A **Preview** button appears in the create/edit article page.
- Clicking **Preview** shows a loading state.
- User is taken to a preview page.
- Preview page keeps the sidebar visible.
- Preview page shows title, category, cover image, date, automatic reading time, and article body.
- Article layout is centered and professional like a news/blog article.
- User can return to the editor from the preview page.
- Current article data is not lost when previewing.
- Reading time is calculated automatically.

```

```
