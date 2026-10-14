# Kitchen Buddy isolated mobile layout test

This directory is a **separate test copy** of the unmerged Kitchen Buddy recipe-library draft (PR #2), copied from feature branch commit 8d403b6633afd404129d1d00c223786c3c9aaeba.

- The regular app at `../preview-1-2/` has not been overwritten.
- Recipe data uses `kitchenBuddy_layoutTest_2026`, and preferences/timer settings have their own separate keys. A new/fresh empty test state is expected.
- Background timer notifications use a separate service worker scoped to `layout-test/`.
- **Four new Explore recipes** have matching, source-published food photos bundled locally under `layout-test/assets/verified/`. Their original recipe pages are credited in Profile → Photo Credits; the public-domain recipe project publishes its submissions under Unlicense. **The original 17 recipe cards still use clearly marked placeholders**, not suspicious stock art, while we check permissions for their exact cooking-source photographs. Unverified recipe cards link from cooking view to their actual recipe-source page.
- Don't import a live-app backup into this test copy. User-uploaded pictures and lists in the live app remain separate.
- The GitHub Pages site is public; avoid entering personal/sensitive information in test content.

## Phone test checklist

1. Swipe horizontally within a category row; look for two cards and a peek of the next.
2. Add/remove Favorites and test Favorites row at the top.
3. Search for "chicken", select categories, and use "See all".
4. Add the same recipe twice to the plan and confirm grocery quantities are properly aggregated.
5. Change servings, open guided cooking, and test timer and step navigation.
6. Open a new Explore recipe to verify its real bundled cooking photograph displays and enlarges, then open an older recipe to check the placeholder and linked original cooking page.
7. Report any unusual Android Back, scrolling or tap behavior.

When satisfied, we can update the separate review branch, finish rights-cleared photography, and only then discuss a full release.
