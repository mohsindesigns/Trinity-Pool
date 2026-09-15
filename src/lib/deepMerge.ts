/**
 * Recursively merges `source` over `target`, field by field, instead of a shallow
 * top-level spread. A shallow `{...target, ...source}` lets one colliding key on
 * `source` silently replace an entire object subtree on `target` even when the two
 * shapes don't match (e.g. a page's own `{badge, headline, description}` blob wiping
 * out the global catalogue's `{..., services: [...], items: [...]}` under the same
 * key name) — deep-merging preserves whichever side actually has each leaf field.
 *
 * Guards against an empty array in `source` clobbering real data already in `target`.
 * That's the right call when `source` is a fresh-but-possibly-incomplete fetch layered
 * over a known-good snapshot (ContentContext's client refetch) — but wrong when `source`
 * is a page's own deliberate content, where an explicit `[]` means "hide this section"
 * and must be allowed to win. Use `mergePageContent` for that case instead.
 */
export function deepMerge(target: any, source: any): any {
  return merge(target, source, true);
}

/**
 * Same recursive merge, but `source` (a page's own content) always wins for every leaf
 * it sets, including an intentionally empty array — global data only fills in keys the
 * page doesn't set at all. Use this to merge a Page document's `content`/`data` over the
 * global site content on the server.
 */
export function mergePageContent(globalData: any, pageContent: any): any {
  return merge(globalData, pageContent, false);
}

function merge(target: any, source: any, keepNonEmptyTargetArrays: boolean): any {
  if (!source) return target;
  if (!target) return source;

  const output = { ...target };
  Object.keys(source).forEach((key) => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!(key in target)) {
        output[key] = source[key];
      } else {
        output[key] = merge(target[key], source[key], keepNonEmptyTargetArrays);
      }
    } else {
      if (
        keepNonEmptyTargetArrays &&
        Array.isArray(source[key]) && source[key].length === 0 &&
        Array.isArray(target[key]) && target[key].length > 0
      ) {
        output[key] = target[key];
      } else {
        output[key] = source[key];
      }
    }
  });
  return output;
}
