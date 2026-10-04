v1.7.1 - 2026-10-04 - Help review: gaps and wording fixed, new Export topic; regression and browser test suites added

- Added tests/regression.js (77 checks in jsdom) and tests/ui_smoke.py (25 checks in real Chrome). audit_deploy.js still reads the source; these two run the app. The regression suite covers: every head and pattern, closed-form arch values, bar and frame widths against independent measurement, glazing ratio against an independent shoelace area, the Modulor fit, the Mondrian rules over hundreds of seeds, Shuffle and Back, the section cut, DXF structure and size, and the help text against the code. Proved sensitive by breaking the app nine ways (wrong formula, flipped DXF axis, missing SEQEND, a changed constant, a missing help row); every break failed a check.
- Help review, found by reading every entry against the code and by the new coverage checks: the Hub radius shown for wheel windows was not explained; the Start page did not mention Shuffle, Back or Export; the lattice limit was described as about 420 tiles when the code limits window area to about 420 pitch-squares (a star-and-diamond lattice has about two tiles per pitch-square, so the tile count can be near double); Blue was described as double Red when it is roughly double (53 against 2 × 27 = 54); the Units topic did not say DXF follows the unit setting.
- New Help topic, Exporting: SVG and DXF, at the three levels, with a live count of what the 2D file would hold. It states the R12 format, the layers, the axis conversion and the units caveat.
- Help text that quotes a number (the foil enlargement, the lattice limit, the 4° arc step, the Back depth, the chamfer limit, the glass slab formula) is now checked against the constant in the code, so changing one without the other fails a test.
- No defects were found in the app's own behaviour: every geometry, shuffle, section and DXF check passed on the first complete run once the test expectations themselves were corrected. The only product changes are the documentation fixes above.

v1.7.0 - 2026-10-04 - DXF export: 2D elevation and 3D model

- The SVG button becomes an Export menu with SVG, DXF 2D elevation and DXF 3D model.
- DXF 2D: five layers. OPENING holds the opening outline, WALL the wall surround with the opening cut out, TRACERY the stone profile (opening with the lights cut out, ready for CNC or laser cutting), GLASS the light outlines and CONSTRUCTION the compass circles, radii and centres on a dashed linetype. Construction circles are true CIRCLE entities, not polylines. Everything else is closed polylines of the short straight segments the app already uses (about 4° of arc).
- DXF 3D: the wall, tracery and glass as triangle meshes (3DFACE) on layers WALL, TRACERY and GLASS, with the same chamfers and depths as the 3D view. Axes are converted from the viewer's (Y up, Z toward you) to CAD's Z up: X across, Y into the wall from the front face, Z up, a pure rotation, so the faces keep their outward direction. The file always holds the whole model, ignoring the section cut and exploded layers.
- Format is AutoCAD R12 (AC1009) ASCII, chosen because almost every CAD, CAM and BIM tool reads it. R12 has no units setting, so the units are stated in a comment line and in the file name (-mm or -in). Files follow the Metric/Imperial toggle and are written in millimetres or inches.
- solid() now builds its geometry through a shared solidGeo(), so the 3D view and the DXF use exactly the same extrusion and chamfer code.
- Help and Limits updated. The Limits tab states that individual glass colours are not carried into the DXF.

v1.6.0 - 2026-10-04 - Shuffle, Shuffle all and Back replace Reseed

- Removed Reseed. It only set the grid pattern's seed, which matters when Organic warp is above 0 or polychromy is on, and on every other pattern it did nothing but show a message. It also never touched the Mondrian pattern's separate Composition seed, although the Help text said it did.
- New Shuffle button: a new variation of the current head and pattern. It changes the head proportions, the pattern's own settings (lights, circles and foils, petals, grid size and division schemes, warp, Mondrian splits, lattice cell and pitch), the bar and frame widths, and any seeds. Span, height, units, 3D settings, colour fills and wall depths are not touched.
- New Shuffle all: also picks a new head and a new pattern, and varies the height by up to about 10%.
- Shuffles are filtered. A candidate is thrown away if the geometry reports a warning (a head with no valid curve, bars wider than the cells), has no lights or more than 260, or is under 15% or over 92% glass. Up to 14 candidates are tried and, if none passes, the design is left as it was and a message says so. The ranges per head were chosen from combinations that draw cleanly, so most shuffles pass first time.
- New Back button steps back through the last 20 designs a shuffle replaced, since a shuffle overwrites the current design. Presets and hand edits are not recorded in that history.
- Shuffle uses Math.random, but only to choose values that are then written into the ordinary settings and seeds. Anything it makes can be reproduced by those settings, so the seeded-generator rule still holds for the output.
- Help text updated.

v1.5.0 - 2026-10-04 - Compare view removed

- Removed the Compare view, its top-bar and Help buttons, its metrics, overlay and generated commentary, and the Compare topic in Help. It put a Modulor grid and a Mondrian composition on a plain rectangle and measured them. It ignored the window's head, bars and 3D form, so its numbers described a side study and not the window being designed. Its Mondrian side was also this tool's own generator, so several of its contrasts, such as no crossing lines, followed from how that generator cuts and not from Mondrian's work.
- Kept: the Modulor Red and Blue series as division schemes, the Corbusier polychromy option on the grid pattern, and the Mondrian pattern. All three work on the real window, arch included, which is where they apply.
- Removed with it: the Compare settings from saved state and the dimension menu that only Compare used. Older saved states that still hold those values are harmless and are ignored.
- Help text no longer refers to Compare. Escape now closes Help only. The Modulor topic suggests series-value opening sizes directly, since the Compare menu that listed them is gone.

v1.4.1 - 2026-10-04 - Reset view button in the 3D pane

- New Reset view button beside Front, Oblique and Section. It returns the camera to the oblique view and turns off the section cut, wireframe and layer explosion, resetting the cut position to the centreline. Before this, getting back from a section meant undoing three separate controls by hand.
- It deliberately leaves everything that defines the window alone: head, pattern, bars, wall depths, colours and sun. The top-bar Reset still restores every setting to its default after confirmation.
- Help text for the 3D view updated.

v1.4.0 - 2026-10-04 - Section now cuts the model and fills the cut faces; new Section cut and Cut position controls

- Fixed: the Section button did nothing useful. Root cause: it only moved the camera to the side of the model. The wall is a closed slab, so from the side you saw its outer face, a plain grey rectangle with none of the window visible. Nothing was cut.
- Section now enables a clipping plane on the stone, glass and edge lines, keeping everything on one side of a vertical plane, and views the cut from the side. The cut faces are filled in solid colour (ochre for stone, blue for glass) so wall thickness, tracery setback and bar depth read directly.
- The fills are built from the geometry, not from the mesh. A clipping plane only hides triangles and leaves the inside open. For each layer the Clipper polygon set is intersected with a 1 mm strip at the cut position to get the stone and glass intervals along that line, and each interval is drawn as a profile across the layer's depth, with the chamfer corners the solid has.
- New controls under 3D form: Section cut (on or off) and Cut position, in the current units, 0 at the centreline. Front and Oblique turn the cut off so those views show the whole window. Explode layers moves the cut faces with their layers.
- Clipped materials also set clipShadows, otherwise the shadow pass would still draw the removed half.
- Help text updated for the new controls and the section method.

v1.3.0 - 2026-10-04 - Help guide with a three-level explanation of the math, live worked examples and context-sensitive links

- New Help overlay with six tabs: Start here, Controls, How the math works, Reading the numbers, Glossary and Limits. It has a search box and a Student, Designer or Professional level switch for the math tab, remembered between visits. Twenty topics cover each head type, bar offsetting, division schemes, the Modulor fit, circle packing, foils, rose geometry, the Mondrian generator, lattices, the 3D build, glazing ratio, the Compare measures and units.
- Every topic ends with a box that plugs the current window into the formulas, so the explanation uses the numbers on screen. When the active head or pattern does not apply the box says which one to choose, instead of showing wrong numbers.
- The Student level avoids symbols. The Designer level names the controls. The Professional level gives equations, clamps, tolerances and algorithm costs taken from the code. Limits lists what the tool does not model so results are not over-read.
- A small ? beside each control group opens the topic for the current head, pattern, bars or 3D settings. The click is stopped from reaching the section header, otherwise it would also collapse the group. Compare has its own Help button, and Escape closes Help or Compare.
- Help sits above the phone block screen, which now offers "Read the guide". The guide is usable on a phone even though the tool itself needs a wider screen, and its tabs become a horizontal strip below 760px.
- Search fields use a 16px font so iOS does not zoom on focus.

v1.2.0 - 2026-10-04 - Imperial units: feet-inches display throughout, with a Metric/Imperial toggle

- Every length shown on screen can be switched between millimetres and feet-inches: slider readouts, 2D dimension lines, the analysis strip, pattern notes, and the Compare view's dimension menus, division labels and series terms. Modulor series terms show in inches (the Red and Blue series are defined in centimetres, so imperial shows cm ÷ 2.54 to one decimal).
- All geometry stays in millimetres internally and sliders keep their millimetre step, so switching units never changes a window. Only the formatting changes. SVG export stays in millimetres because it is a fabrication format.
- Feet-inches rounds to the nearest 1/16 in below 24 in and 1/8 in above, with fractions reduced (5/16", not 10/32") and exact feet written without inches (10', not 10' 0").
- The unit choice is stored under its own localStorage key, not inside the parameter state. Presets, Reset and the Compare "use in window" buttons all rebuild that state from defaults and would have silently flipped the units back to metric.
- Pattern notes and head details are formatted when the geometry is computed, so toggling units recomputes the window instead of only relabelling the screen.

v1.1.0 - 2026-10-04 - Mondrian composition pattern, true Modulor Red and Blue series, and a Compare view for Mondrian against Modulor geometry

- Modulor schemes now use the printed Red and Blue series (4, 6, 10, 16, 27 … and 8, 13, 20, 33, 53 … cm) instead of a blended list. For an n-division the series window whose total is closest to the opening is chosen and the whole run is scaled to fit, and the scale factor is reported (for example ×1.066) so the departure from true Modulor dimensions is visible rather than hidden. The old single "Modulor" scheme is migrated to Blue when saved state is loaded.
- New Mondrian pattern: a seeded guillotine subdivision at simple fractions (1/4, 1/3, 2/5, 3/5, 2/3, 3/4, never 1/2), weighted toward large fields, with a minimum field size so no sliver survives. Red is placed on a large field, blue and yellow on smaller ones, black occasionally, the rest white. Bars render black in 2D and 3D. This is a generated study in Mondrian's manner and is labelled as such, not a reproduction of a painting.
- Grid pattern gains Corbusier polychromy (ivory, brick red, Prussian blue, ochre) assigned per cell from a seeded draw. Light colours are matched to cells by testing each light's centroid against the cell outlines, with a vertex fallback, because Clipper returns lights in tree order rather than cell order.
- Compare view: Modulor grid, line overlay and Mondrian composition side by side on the same opening (default 113 × 183 cm, Red-series values in a 1 : φ rectangle). Ten measures: distinct lengths, neighbour ratio and deviation from φ, additive a + b = c lengths, cells at φᵏ against simple rational aspect, mirror-symmetric lines, lines at golden sections, crosses against T-junctions, and colour coverage with centroid offset. The overlay reports how many Mondrian segments fall within 2% of a Modulor line. Modulor aspect ratios are measured on the nominal series values because the fit scale differs per axis and would otherwise swamp the φ relationship. The narrative text is built from the computed numbers, so it changes with the controls.
- Compare layout fix: the metrics table is written before the canvases are sized. Sizing first measured the stage at its pre-table height, and the canvases then overflowed into the table when it filled in.
v1.0.0 - 2026-10-04 - First public release: 2D construction and 3D form views for architectural window geometry

- Twelve head types struck from real construction geometry: semicircular, segmental, horseshoe, pointed (drop, equilateral, lancet via a single radius-to-span control), four-centred Tudor, ogee, multifoil, semi-elliptical, parabolic, catenary, flat lintel and circular. Four-centred and ogee heads are solved in closed form from corner radius, junction angle and rise; parameter combinations with no valid solution fall back to an equilateral arch and say so in the analysis strip rather than drawing a broken curve.
- Six tracery patterns: plain, mullioned, geometric (sub-lights with circles packed into the free spandrel by a distance-field search), rose (plate circles or wheel spokes), grid (uniform, golden, Fibonacci or Modulor divisions with optional organic warp) and lattice (square, hexagon, 4.8.8 octagon, star and diamond).
- Cells are defined on bar centrelines and inset by half the bar width, so bars stay the same width wherever two cells meet. Each cell is offset on its own: offsetting the union would merge neighbours and erase the bars between them.
- 3D view extrudes the surround, tracery and glass as separate layers with chamfer, setback, explode, stained tints, sun direction and shadows. Edge lines are drawn from the 2D outlines because EdgesGeometry reported spurious edges across coplanar faces where earcut produced zero-area triangles.
- 2D view has pan and zoom, dimension lines, compass-circle construction layer and SVG export. Analysis strip reports rise-to-span, radii as multiples of span, apex angle, glazing ratio and pattern-specific ratios.
- Thirteen presets from Romanesque twin lights to a Modulor grid. State and theme persist in localStorage. Below 760px a block screen replaces the app.
