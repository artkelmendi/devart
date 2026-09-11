---
name: DEVART
description: Software engineering expressed through precise typography and a quiet binary environment.
colors:
  near-black: '#0c0d0f'
  panel: '#131517'
  silver-white: '#eeefed'
  muted-silver: '#989b9f'
  warm-orange: '#eb8956'
  hairline: '#ffffff1c'
typography:
  identity:
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace"
    fontWeight: 400
    letterSpacing: '-0.065em'
  display:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: 'clamp(108px, 14.7vw, 236px)'
    fontWeight: 400
    lineHeight: 1.13
    letterSpacing: '-0.04em'
  headline:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: 'clamp(36px, 4.1vw, 62px)'
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: '-0.035em'
  title:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: 'clamp(31px, 3vw, 46px)'
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: '-0.035em'
  body:
    fontFamily: 'Geist, Arial, sans-serif'
    fontSize: '16px'
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: 'Geist, Arial, sans-serif'
    fontSize: '12px'
    fontWeight: 400
spacing:
  gutter: 'clamp(24px, 5.55vw, 100px)'
components:
  button-primary:
    backgroundColor: '{colors.silver-white}'
    textColor: '#111315'
    padding: '17px 23px'
  button-primary-hover:
    backgroundColor: '#ffffff'
  text-link:
    textColor: '{colors.silver-white}'
  copy-button:
    backgroundColor: 'transparent'
    textColor: '{colors.silver-white}'
    height: '44px'
    width: '44px'
---

# Design System: devart.

## Overview

**Creative North Star: "Engineering at the core. Craft in every detail."**

devart. is Art Kelmendi’s software engineering identity. The implementation uses a near-black canvas, silver typography, restrained warm orange accents, and an orbiting field of binary digits. Large identity typography introduces the engineer; concrete systems, testing, telecom, and frontend work provide the evidence.

The primary mark is lowercase **devart.**, set in a system terminal monospace with **dev at 400**, **art at 700**, and a warm-orange terminal period. The period is optically pulled toward the final `t` by `-0.1em`, reducing the empty side-bearing of a monospace punctuation cell while preserving a clear gap. The same construction appears in the hero, navigation, footer, project pages, and the stacked About mark.

**Key Characteristics:**

- Software engineer first, grounded in C, C++, test engineering, and hands-on 5G radio and baseband validation, with frontend and interaction craft as complementary strengths.
- Spacious, flat composition defined by typography and fine rules.
- A quiet, dimensional binary field with readable foreground content.
- Real website imagery and engineering narratives.

This document records the implemented system in `app/globals.css`, `app/page.tsx`, `components/BinaryField.tsx`, `app/layout.tsx`, and the shared project pages and dataset. It is an implementation reference, not a visual QA verdict.

## Colors

### Primary

Warm orange marks selected words, punctuation, category labels, directional details, keyboard focus, and feedback. Silver-white supplies the main action fill; orange remains selective.

### Neutral

Near-black is the page and reading-surface background. Silver-white is the main foreground; muted silver supports descriptions and metadata. Hairline white separates content without heavy frames. The panel token is available through the theme; project previews use a slightly lighter local surface (`#17191c`). The contact background is translucent near-black (`#0c0d0fcd`), allowing a faint field behind it without blur.

Binary glyphs use cool silver (`#afb7bd`), brighter silver (`#e0e6e5`), and sparse muted amber (`#b89569`). These atmospheric colors do not replace the interface accent.

## Typography

The identity uses a terminal monospace stack headed by SFMono-Regular and Consolas, while Manrope continues to shape major headings. Geist carries body copy, navigation, controls, and labels. Manrope and Geist are served as local TTF assets with `font-display: swap`; the wordmark uses the platform stack with compatible fallbacks and no additional download. Manrope has actual 400 and 700 files; Geist has 400 and a 500 asset mapped to the 500–600 range. The binary canvas uses the same system monospace family.

The hero combines the lowercase display mark and terminal period with a spaced uppercase “SOFTWARE ENGINEER” label (`18–29px`, tracking `.15em`) and a small solid orange square. The label resolves as one measured typographic unit instead of imitating a terminal typing effect. Hero description copy is `18px/1.65`; normal supporting prose is generally `14–18px/1.7–1.8`. Project summary measure is capped at `360px`; About prose at `465px`; case-study prose at `710px`.

Contact headlines grow from `60px` to `120px`, using Manrope 400 and tight tracking. Case-study headlines present the project name at `clamp(40px, 5.6vw, 82px)`. A separate muted summary below uses `clamp(17px, 1.6vw, 23px)`, `1.7` line height, and a `780px` maximum measure. Preserve the dev/art weight contrast and orange period rather than making the full name bold.

## Layout

The main shell caps at `1680px`, centered with the fluid gutter token. The desktop header is `104px` high and participates in normal document flow. The opening section uses the remaining viewport height, bounded by a `696px` minimum and `1040px` maximum. The large identity occupies the left; the binary volume centers toward the right.

Section rules and generous vertical padding organize the page: identity, selected work, engineering practice, About, contact, footer. Project rows pair copy and imagery in a `.78fr / 1.22fr` grid with a `7%` gap. Engineering practice uses three text columns; About uses two balanced columns. There is no universal spacing scale beyond the fluid gutter: preserve the existing section-specific rhythm.

At `1100px`, navigation gaps and editorial grids tighten. At `760px` and below, the header becomes `84px`, desktop navigation becomes a disclosure menu, project and practice rows stack, and About becomes one column. The hero uses a `17.2vw` wordmark and smaller supporting copy. The field annotation and secondary About mark disappear; the background becomes quieter. Contact and footer reorganize for narrow widths. At `390px`, copy, heading sizes, and action gaps tighten further. The hero mark caps at `236px` on wide screens.

Case metadata changes from three columns to two, with technologies spanning the final row. Case sections and decisions stack; the implementation flow becomes vertical, with its arrows rotated downward.

## Elevation & Depth

The interface uses flat surfaces and hairline borders. It does not use drop shadows, glass panels, or backdrop blur. Depth belongs to the decorative Canvas 2D field: a deterministic set of 1,020 zeroes and ones forms a deformed torus, two lateral streams, and sparse foreground fragments. Glyphs are depth-sorted, softly faded, and attenuated over the reading column and viewport edges. This is an orbiting sculpture, never vertical Matrix-style rain.

Motion is time-based. Fine pointer movement produces damped depth offsets. Over the hero circle, the volume turns gently toward the pointer while nearby digits separate and brighten. Leaving the field returns it to its resting orbit. Touch movement does not drive parallax. Scroll supplies a small depth shift and progressively reduces contrast beyond the opening viewport. Opaque reading surfaces keep long-form content calm.

A completed click or tap in the circle sends a brief displacement wave through its glyphs, with a restrained warm accent at the wavefront. The wave fades over 1.35 seconds; at most three can coexist. Text, links, and other controls are excluded, and a moved or cancelled pointer gesture does not create a pulse. No interaction captures the pointer or cancels native scrolling.

The circle periodically unfolds into **ENGINEER**, resolves into **</>**, and returns to its continuously moving orbit. All three forms use the same 800 binary particles. The 22-second choreography includes smooth assembly and return curves, small particle timing offsets, and readable holds; pointer pressure and pulses diminish as lettering forms. Text masks are sampled only during initialization and font readiness. At widths below 1000px, shapes occupy a measured gap between the hero actions and bottom controls; larger layouts use the free right column. Shapes fade back to the ambient field when leaving the hero.

The keyboard-accessible **Transform** control starts the sequence immediately. It is disabled during a transformation, while paused, or when reduced motion is active. Pausing freezes the exact morph position; resuming continues from that position. A reduced-motion preference restores the static circle and skips morphing.

The field pre-rasterizes its six glyph/color combinations, limits device pixel ratio and total raster pixels, lowers small-screen density, targets 30 frames per second on coarse pointers and 60 otherwise, and can reduce density when painting becomes expensive. Hidden documents and offscreen field sections stop the animation loop and discard transient interaction state. A user pause freezes the current frame and resumes it smoothly. Animation state stays inside the canvas controller without per-frame React updates or layout reads.

## Shapes

Controls, previews, and content surfaces use square corners. Circular shapes are limited to the three tiny browser-preview dots. Thin horizontal rules establish structure; project metadata uses inline text and separators rather than filled pills. Directional Lucide arrows connect action labels to their destinations.

## Components

- **Navigation:** Work, Engineering, About, and Contact are anchor links. The visible section updates `aria-current="location"`; active and hovered desktop links expose an orange underline. Mobile navigation reports its expanded state, closes after selection, closes on Escape while returning focus to its toggle, and closes when resizing above the mobile breakpoint.
- **Actions:** The primary hero link has a silver fill, a `2px` hover lift, and a down arrow that moves `3px`. Text and project links move their diagonal arrow `3px` up and right. The shared easing is `cubic-bezier(.16, 1, .3, 1)`; most interface transitions last `0.2–0.4s`. Keyboard focus uses a `2px` orange outline with a `6px` offset. The focus-revealed skip link targets the main content.
- **Project row:** Linked project name, category beneath it, summary, up to four visible technology labels, and a case-study link accompany a real homepage preview. The preview is top-cropped at a `1.52` aspect ratio, under a small browser-style URL strip. Hover restores full saturation, scales the image to `1.035`, and reveals a square arrow action. Keyboard focus reveals that action; touch layouts show it persistently and avoid the muted image filter. Homepage images load lazily.
- **Engineering practice:** The opening statement establishes C and C++ foundations, telecom systems, test automation, and hands-on 5G validation. Four technical rows cover systems software, Ericsson Networks radio and baseband environments, Jenkins-backed unit and block testing, and frontend application engineering. Hairlines trace left-to-right before each row resolves, reinforcing the idea of a system being assembled.
- **Case study:** A compact header links to all work, home, and the live website; a skip link targets the case-study main content. The project name is the sole h1, followed by its plain-language summary, then contribution, context, and technologies. A full-width project image leads to the project, challenge, three unnumbered engineering decisions, ordered implementation flow, result, and live/source links. Source links appear only when present in the dataset. A next-project link cycles through the work. Unknown project slugs use the not-found route. Keep technical claims grounded in the actual project.
- **Contact:** The section opens directly with a large two-line invitation, followed by a `mailto:` email link and a separate `44px` copy button. Copy success shows a check and “Email copied”; failure instructs the visitor to select the email. A live status region announces feedback, which resets after `3.5s`.
- **Entrance and reveal system:** The hero is visible immediately, with no blocking splash screen. Each terminal letter briefly displays its eight-bit ASCII value, then assembles from four horizontally clipped copies with alternating offsets. The six fixed-width letter cells preserve layout throughout the 2.2-second sequence. The orange period resolves from a slender cursor into punctuation and sends one subtle pulse through the binary circle. The real heading carries an accessible name; decorative slices and bytes are hidden from assistive technology. Header, role, copy, and actions arrive in a shorter overlapping sequence. The desktop hero footer connects C/C++, 5G systems, and web applications. Existing scroll reveals retain their traced rules and image masks.
- **Motion controls:** A small replay button beside the hero wordmark runs its assembly again and is disabled while playing, paused, or under reduced motion. The main pause button freezes both the binary field and an active wordmark sequence and exposes its state with `aria-pressed`. Its label alternates between “Motion on” and “Motion paused.” Hidden tabs suspend active letter animation; leaving the hero finishes it silently, so returning finds a readable identity. Timelines and listeners are cleaned up on unmount. The scroll cue loops over `2.7s`.
- **Reduced motion:** Live system-preference listeners restore the static wordmark and binary circle, reset pointer and scroll offsets, and stop active timelines. The motion button becomes disabled and reads “Reduced motion.” CSS hides decorative slices and bytes, removes transitions, uses immediate anchor scrolling, and removes hover scale/lift effects. GSAP scroll enhancement is reverted when reduced motion is enabled. Decorative canvas content never captures pointer events.

## Do's and Don'ts

- Keep **devart.** lowercase in the primary identity, preserving the terminal monospace skeleton, dev 400 / art 700 contrast, and the closely spaced orange period.
- Lead with software engineering and support it with C/C++, test engineering, telecom validation, and real project details.
- Keep body copy readable over a quiet background and preserve keyboard-visible actions.
- Use warm orange sparingly for orientation, emphasis, and feedback.
- Retain useful responsive composition and reduced-motion behavior when extending the site.
- Do not introduce Matrix rain, neon green, glow effects, glass cards, or decorative dashboards.
- Do not turn this into a frontend-only identity, fill the page with generic cards, or invent project metrics and capabilities.
