# Team AI Prompt & Audit Log

**Project Name:** Nappy - Well-being habits  
**Team Members:** Néstor Ramírez and Álvaro Pérez  
**SDG Goal Target:** SDG 3 - Good Health and Well-being

---

## Week 2 Log Entry

### 1. High-Level Goal

This week, we worked on the first coded deliverable of Nappy. Our goal was to turn the SDG 3 proposal into a clear, responsive one-page website where students can review their well-being, record a daily check-in, see weekly information, choose small missions, find resources, and manage privacy options. We also organized the proposal as an HTML page so the project idea and the prototype could be presented together.

### 2. The Interaction Log

We used AI as a coding support tool. We asked for suggestions, examples, and reviews, then selected and adapted the parts that fit our project.

| AI Tool Used | Exact Initial Prompt | What the AI Generated (Summary/Snippet) |
| :--- | :--- | :--- |

| ChatGPT | “Help us plan the HTML structure for a simple one-page website about student well-being. We need sections for a dashboard, a daily check-in, weekly insights, missions, resources, and a profile/privacy area. Please suggest a clear order and simple section IDs that we can adapt.” | Suggested a single-page structure with a navigation menu and anchor links for each main section. |

| ChatGPT | “Show us how to use Bootstrap 5 to make a navbar responsive, with a brand name and links to sections on the same page. Explain which classes and attributes we need so we can adapt the code.” | Explained the use of `navbar-expand-lg`, `navbar-toggler`, `collapse`, `navbar-collapse`, and `data-bs-target`. |

| ChatGPT | “Give us layout ideas using Bootstrap rows and columns for a dashboard with a welcome message, a well-being score, and four small cards for sleep, water, movement, and mood. Keep the example easy to adapt to our own HTML.” | Provided a responsive row-and-column layout and card examples that we adapted for the dashboard in `index.html`. |

| ChatGPT | “Help us check the Bootstrap form elements for a daily check-in. We need inputs for hours of sleep, glasses of water, minutes of movement, and a mood selector, plus a save button. Please focus on labels, IDs, and simple responsive columns.” | Suggested labeled number inputs, a select element, Bootstrap form classes, and a responsive two-column form layout. |

| ChatGPT | “Suggest a simple way to organize repeated content cards in HTML for weekly insights, small missions, and health resources. We want each card to be easy to read and consistent without adding a framework beyond Bootstrap.” | Recommended repeated Bootstrap card blocks inside responsive columns, with headings, short descriptions, and actions. |

| ChatGPT | “Help us create a custom CSS style direction for a student well-being website using dark blue, muted green, light backgrounds, rounded cards, and readable spacing. Include responsive adjustments for smaller screens, but keep the CSS understandable.” | Suggested a small color palette, spacing, typography, card styles, and a mobile media query. We adapted these ideas in `css/styles.css`. |

| ChatGPT | “Review this static Bootstrap page structure and point out simple improvements for mobile layout and accessibility. Do not rewrite the whole page; mention specific things we should verify, such as heading order, form labels, anchor links, and the navbar button.” | Returned a short review checklist that helped us verify the section IDs, labels, button types, responsive classes, and Bootstrap JavaScript reference. |

| ChatGPT | “Help us organize the HTML and CSS for a visual project proposal page for Nappy. We need a cover, SDG 3 explanation, problem, idea and scope, technology, benefits, and conclusion. Please give structure and styling suggestions that we can implement and edit ourselves.” | Suggested a section-based proposal layout with a cover, content cards, a simple app mockup, an interaction flow, and print/mobile media rules. We edited the content and styling in `Proposal.html`. |

### 3. The Human Audit & Modifications

The AI examples were generic, so we changed the text, section names, colors, and content to match Nappy and our SDG 3 proposal. We connected the navigation and buttons to our own section IDs (`#dashboard`, `#check-in`, `#insights`, `#missions`, `#resources`, and `#profile`) and placed the custom rules in `css/styles.css` instead of relying only on Bootstrap. We also checked the generated suggestions manually and kept the implementation static for this first deliverable: the form and mission buttons are prepared for future behavior, but they do not save data yet.

**What we changed/added:**

- Built the main page structure in `index.html` with a responsive Bootstrap navbar and six content sections.
- Added the dashboard score card and four habit summary cards for sleep, water, movement, and mood.
- Added the daily check-in form with labels, number inputs, a mood selector, and a save button.
- Added sections for weekly insights, missions, resources, and profile/privacy information.
- Created the custom visual system in `css/styles.css`, including colors, spacing, cards, typography, and a mobile media query.
- Added `Proposal.html` with the project explanation, SDG 3 rationale, scope, technology, expected benefits, and a simple interface mockup.
- Removed explanatory HTML comments from the final `index.html` so the delivered markup stays clean and focused on the structure.

### 4. Integration & Learnings

The code is a static front-end prototype: `index.html` contains the content and Bootstrap classes, while `css/styles.css` contains the project's visual adjustments. The navigation uses same-page anchor links, and Bootstrap's bundle provides the JavaScript behavior for opening and closing the mobile menu. We learned that responsive behavior can be created by combining Bootstrap breakpoints such as `col-md-*` and `navbar-expand-lg` with our own `@media` rules, while keeping the page usable on smaller screens.

We also learned that AI suggestions need to be checked against the real project. The first examples used generic content and styling, so we had to adapt names, links, colors, text, and the level of functionality. The first deliverable is therefore a visual and structural prototype; data storage, real charts, and working form actions are future improvements.

### 5. Oral Defense Self-Check

- [x] We can explain every single line of this code.
- [x] We understand how the Bootstrap classes, anchor links, media query, and navbar script affect other components.
- [x] We know the files and main line locations: `index.html` (navbar lines 13-32, page sections 35-162, Bootstrap script line 165), `css/styles.css` (main styles lines 1-153 and mobile rules lines 155-163), and `Proposal.html` (proposal structure lines 28-71 and page styles lines 8-24).
