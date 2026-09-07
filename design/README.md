# Design record

Source material for the "Field Notes" redesign. Nothing here is used at
runtime; it is kept so the design decisions behind the site are recoverable.

## `Directions.dc.html`

The Claude Design canvas the redesign came from: three directions for
hejoric.com as hero mockups in light and dark, plus a full screen set for the
one that was chosen.

It is a canvas document, not a standalone page. It loads `./support.js`, which
is not in this repo, so opening the file directly renders nothing useful. Open
it through Claude Design.

## `screenshots/`

Captured 2026-07-02, right after the redesign shipped. They are a record of
that release, not a picture of the current site. Since then the site has
diverged in at least four visible ways:

- The homepage "Lately" strip is gone. The `LatelyItem` model was dropped in
  the 2026-09-02 real-data pass, because its rows were hand-seeded placeholders
  (the grey `thumbnail` / `art` / `cover` boxes visible in `home-*.png`).
- `Blog` is no longer in the nav. It is hidden until a real post exists.
- The Ledger drew all five categories. Categories with no logged data now
  render nothing, and Code reads the live GitHub contribution calendar rather
  than seeded rows.
- Selected Work shows different projects. The featured pair is now Loudoun
  Nature Conservation Project and Retail ERP Deployment.

Re-capture before using any of these to represent the site as it stands.
