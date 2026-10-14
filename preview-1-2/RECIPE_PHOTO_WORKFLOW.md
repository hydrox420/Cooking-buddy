# Kitchen Buddy: recipe and food-photo workflow

For each **new recipe batch**, follow these steps in order:

**Photo authenticity gate:** A stock-photo listing, a named uploader, a plausible caption, an EXIF field, or an open license does **not** prove an image was captured by a camera. Pexels disallows generative-AI submissions, but explicitly does not guarantee all content is human-produced. Mark images `photographicAuthenticity: unverified` and `photoApprovalStatus: pending_human_review` until there is adequate evidence and the cook approves the appearance. Do not label illustrations as 'real photography' solely because they are sourced. Prefer documented original-recipe images when licensed/permissioned; use visual review and provenance clues (source context, genuine creator's work, original image history) before approval; if authenticity remains unclear, say so. Never mislabel AI art as a photo.


1. **Establish where the instructions came from.** If we write the recipe ourselves for Kitchen Buddy, mark `recipeOrigin: "no_external_source_recorded"` and leave `recipeSourceUrl: null`. Do not invent a "source recipe." If adapting a recipe from a website, record the actual, verified `recipeSourceUrl`, author, and any conditions for reproducing its text.
2. **Prefer that exact recipe's photograph only when reuse is permitted.** Check the page's explicit licensing or get permission. A recipe being publicly readable or free-to-view **does not** make its photograph free to redistribute. Save the photo's *real* image URL, *real* credit/source page, full license and required attribution.
3. **Verify provenance and match the food.** Check whether the image is a genuine photograph rather than AI-generated or altered art, to the extent evidence allows. A food site's own image still needs rights clearance and authenticity review. **Match the food, not merely the cuisine.** Compare the recipe's main protein, vegetables, sides, cooking method and finished plating to the image. Reject obvious mismatches (e.g., shrimp without visible shrimp; sausage dish without sausage). For photos of a similar but nonidentical dish, record a concise `photoMatchNote` and leave `photoReviewed: false` until the user approves.
4. **If the original photo cannot be reused**, search licensed reusable images (Wikimedia Commons/verified Pexels) for the same finished dish, verifying source links and license. Do not invent URL slugs or photographer details. If none accurately represent the recipe, **generate a realistic image of the exact finished dish**, including all defining ingredients; flag it as generated and do not attribute it to a real photographer.
5. **Bundle approved photos** as local, optimized 800×600 WebP in `preview-1-2/assets/recipes/`. Use `preview-1-2/photo-sources.json` for hosted sources and the photo-pack GitHub Action to download/crop images. External downloads must succeed without failures; avoid publishing placeholders as if they were verified.
6. **Keep cards uncluttered.** Show photo, title, time and small diet flags. Put photographer, original photo URL, reuse license and any authentic source recipe link behind **Profile → Photo Credits**.
7. **Never replace the user's own image choice** during a content update. Preserve app's localStorage, favorite selections, shopping list, planned servings and existing Instacart workflow.
8. **Review before release.** Test image fidelity, mobile 4:3 crops, image loading, offline behavior, source/license pages, recipe steps, favorites, categories and Cart; merge/deploy only on explicit user approval.

## Source status of the first 17 recipes

These recipes were already present or written for Kitchen Buddy without a traceable single source-recipe URL in the current code. Their photo references are therefore **licensed illustrative dish photos**, not "the photo from the original recipe." They should not be described as originating from a specific external recipe.

For any future import, save `recipeSourceUrl` on the recipe if known; keep photo permissions separately in `photo-sources.json` or the equivalent photo metadata. Recipe source and image source are not necessarily the same.

## Image-license considerations

- Wikimedia Commons: read each file's individual license; for CC BY-SA, credit the creator, link the exact license, indicate changes (e.g. "cropped to 4:3"), and follow share-alike requirements for the adapted photo.
- Pexels: follow its current terms and link back to the actual verified photo listing; credit when possible.
- Copyrighted recipe-site photos: **do not** silently scrape, download and redistribute without permission.
- Generated photo: tag as generated, and do not add an invented photographer/source link.

## Current status

**All 17 bundled images are still candidates, not approved**. Their photographic authenticity has not been established and multiple visuals were rejected as misleading. The fact that the CI image downloader passed means only that image files could be retrieved and converted. It is not a quality, identity, provenance, or licensing audit. Do not merge this draft into main until the owner has reviewed accurate final food images. Existing user photo overrides should stay preserved.
