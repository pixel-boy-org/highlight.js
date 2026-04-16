# highlight.js Fork Release Checklist

This repo is a Pixel Boy-maintained fork of `highlightjs/highlight.js`.

Use this document together with the upstream maintainer guide in `MAINTAINERS_GUIDE.md`.

## Versioning

- Keep upstream provenance visible in the release version.
- Use upstream-based fork versions and tags: `<upstream-version>-pb.<n>`
- Examples:
  - first Pixel Boy fork release on upstream `11.11.1`: `11.11.1-pb.1`
  - second fork-only release still based on upstream `11.11.1`: `11.11.1-pb.2`
  - first fork release after merging upstream `11.11.2`: `11.11.2-pb.1`
- Avoid plain upstream versions on the fork.

## Checklist

1. Confirm the working tree is clean: `git status --short`
2. Confirm remotes:
   - `origin` should be `pixel-boy-org/highlight.js`
   - `upstream` should be `highlightjs/highlight.js`
3. Fetch everything: `git fetch origin --tags` and `git fetch upstream --tags`
4. Pull in upstream fixes first when needed:
   - merge or rebase the upstream branch/tag you want to ship
   - reapply or keep only the Pixel Boy-specific delta
5. Decide the new fork version from the upstream base plus the next `-pb.<n>` suffix.
6. Follow the upstream release-file updates in `MAINTAINERS_GUIDE.md`, but use the fork version:
   - `CHANGES.md`
   - `package.json`
   - `package-lock.json`
   - any other version references required by upstream
7. Validate the fork:
   - `npm install`
   - `npm run build_and_test`
8. If you need a vendorable browser bundle for Highlightr, build it: `npm run build-cdn`
9. Commit the release prep: `git commit -am "chore: release <version>"`
10. Create an annotated tag: `git tag -a <version> -m "<version>"`
11. Push the branch and tag: `git push origin HEAD` and `git push origin <version>`
12. If this release should ship in Apple apps, follow through immediately:
   - copy `build/highlight.min.js` into `Highlightr/src/assets/highlighter/highlight.min.js`
   - cut a new Highlightr fork release
   - then update `pixel-boy-editor` to that Highlightr release

## Upstream Sync Notes

- Prefer upstreaming general-purpose fixes so the fork stays small.
- Track upstream security fixes and runtime compatibility fixes quickly, especially anything that affects JavaScript parsing or browser bundles.
- The vendorable browser asset used by Highlightr is `build/highlight.min.js`.
