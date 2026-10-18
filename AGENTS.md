# Expo Native AI Development Blueprint

## About Blueprint

This is a reusable blueprint for AI-assisted **Expo native** development. Target iOS and Android by default.

Use it to develop one approved phase at a time. Do not assume the app name, app purpose, routing, design direction, fonts, icons, dependencies, or source structure before the user approves them.

Before changing project setup, inspect the relevant template files:

- `package.json`, lockfile, scripts, dependencies, and version;
- `app.json` or `app.config.*`;
- entry point, source tree, TypeScript config, and current Git status.

Rules:

- Prefer Expo and React Native capabilities. Use `npx expo install <package>` for Expo-compatible packages when needed.
- Treat only dependencies declared in `package.json` as part of the project; `node_modules` may contain leftovers.
- When adding, removing, or changing dependencies, update the repository’s declared package manifest and lockfile using the project’s package manager. Do not hand-edit lockfiles unless the package manager cannot complete the update.
- Do not edit generated directories such as `node_modules/`, `.expo/`, build output, or generated native folders unless explicitly required.
- Leave any declared scratchpad, private-notes file, or excluded area untouched unless the user explicitly asks otherwise.
- Keep app metadata and version values synchronized wherever the approved project stores them.
- On an explicit version-bump request, update `src/constants/about.ts` first, including the user-visible version and changelog, then set the same version in every app `package.json` manifest in the repository. Inspect manifests outside generated directories before editing and validate that all declared app package versions match the metadata constant.
- For features that handle identity, credentials, sessions, payments, health data, or other sensitive data, explicitly state local storage, expiration, logout, error-handling, privacy, and production-backend boundaries during Advice. Never store secrets, raw credentials, OTP values, or unapproved sensitive data in source control or unsecured device storage.
- A local, mock, or dummy sensitive-data flow must be labeled as non-production and must not imply that real identity, payment, OTP delivery, or backend security guarantees exist.
- When a prescribed API, configuration key, or platform behavior conflicts with the installed Expo or React Native version, inspect official documentation and return to Advice before substituting an alternative.

## About Working Contract

Use one active work item at a time. During foundation work, use a named phase; after Phase 5 is approved, use a named feature slice.

```text
Phase: <name>
Status: Advice | In progress | Awaiting review | Approved
Scope: <one-sentence boundary>
```

### `start development`

Treat **start development** as an Advice call, not permission to edit.

1. Inspect the blank template and current working tree.
2. Start **Phase 1 — App Metadata and Native Foundation**.
3. Ask only for:
   - app name;
   - app about.
4. Based on those answers, propose Phase 1 and wait for **proceed**.

### `advice`

- Do not change files, configuration, dependencies, lockfiles, or this guide.
- Inspect relevant files when needed.
- Recommend the next phase: goal, scope, likely files, dependencies/configuration, validation, and acceptance criteria.
- State assumptions or ask one focused question if an answer materially changes the implementation.
- Wait for **proceed**.

### `proceed`

- Implement only the immediately preceding approved scope.
- Do not add unrelated features, refactors, upgrades, cleanup, or dependencies.
- If a material decision or blocker appears, return to Advice rather than choosing silently.
- Validate the work and report **Awaiting review**.

### `review changes`

- Do not make changes.
- List every active-phase change by file and user-visible behavior.
- Include dependency/configuration changes, validation results, limitations, and deferred work.
- Identify pre-existing or out-of-scope changes separately.
- Wait for revisions plus **proceed**, or **approve changes**.

### `approve changes`

- Update this file with durable approved project decisions only.
- Do not add temporary task notes, secrets, or private content.
- State what was added or revised in this guide, validate the update, and mark the phase **Approved**.
- Return to Advice for the next phase.

## Development Phases

### Phase 1 — App Metadata and Native Foundation

**Goal:** turn the Expo blank template into an approved native app foundation.

#### Phase 1 Advice

After receiving app name and app about, suggest:

- app slug;
- deep-link scheme;
- URL/package-identifier direction when useful;
- design direction;
- a branded font and icon pairing for the initial foundation;
- the required Expo-compatible font and icon dependencies to install;
- initial version `0.0.0` and version source of truth;
- Expo Router setup using the required Phase 1 file structure;
- metadata constants, landing screen, and root safe-area ownership;
- exact dependency, configuration, asset, file, and validation changes.

Native cleanup is part of Phase 1. When present, plan to remove:

- web scripts from `package.json`;
- web configuration from Expo config;
- favicon and web-only assets.

Phase 1 must establish a branded typography and icon system. Do not recommend system fonts as the default foundation. Select an Expo-compatible font package and include its installation and setup in the proposal. Use `@expo/vector-icons` as the default icon system; if it is not declared in `package.json`, install it with Expo tooling. Do not use text or emoji glyphs as product icons unless the user explicitly approves an exception.

Do not edit or install anything until the user says **proceed**.

#### Required Phase 1 Structure

Phase 1 uses Expo Router and must create this structure:

```text
app/
├── _layout.tsx
└── index.tsx # LandingScreen
src/
└── constants/
    └── about.ts
```

Responsibilities:

- `app/_layout.tsx`: root app shell, root providers, approved font loading, root safe-area ownership, and Expo Router navigation configuration.
- `app/index.tsx`: `LandingScreen`; displays app name, app about, and version from `src/constants/about.ts` without duplicating metadata.
- `src/constants/about.ts`: approved app name, app about, slug, scheme, version, design direction, and changelog; it is the user-visible metadata source of truth.

Configure the package entry for Expo Router. Remove legacy blank-template entry files only after the Router structure is in place.

#### Phase 1 Proceed

Implement only the approved Phase 1 proposal. Set the initial app version to `0.0.0` unless the user explicitly approves another value. Keep `package.json`, Expo config, and `src/constants/about.ts` aligned to the approved version. Install and configure the approved font and icon dependencies. Load the approved font in `app/_layout.tsx` and use the approved icon system in `app/index.tsx`; do not substitute system fonts or text/emoji glyphs unless the user explicitly approves an exception. Configure Expo Router completely rather than leaving a partial migration. Use `app/_layout.tsx` as the default safe-area owner; do not add `SafeAreaView` to `app/index.tsx` unless an explicit edge-to-edge exception is approved. Display the approved app name, app about, and initial version from the metadata source rather than duplicating strings.

#### Phase 1 Review and Approval

On **review changes**, list all Phase 1 work without editing. On **approve changes**, record the approved slug, scheme, version policy, native-only boundary, routing decision, typography/icon choices, design direction, safe-area ownership, dependencies, and validation requirements in the section below.

### Phase 2 — Theme Module

**Goal:** establish a token-driven light/dark theme foundation after Phase 1 is approved.

#### Phase 2 Advice

Propose a camelCase theme module using this structure:

```text
src/
├── components/
│   └── theme/
│       └── themeToggle.tsx
├── constants/
│   └── theme.ts
├── contexts/
│   └── themeContext.tsx
├── helpers/
│   └── animate.ts
└── hooks/
    └── useTheme.ts
```

Include:

- semantic color tokens for background, surfaces, borders, primary/accent actions, text hierarchy, and focus treatment; plus spacing, typography, font-family, opacity, radius, and platform-appropriate shadow/elevation tokens;
- light/dark theme behavior through a typed theme context that resolves the initial mode from the device color scheme, keeps manual selection in memory for the current session only, exposes the resolved token object plus a toggle action, and causes `useTheme()` to throw a clear error outside the provider;
- session-only theme state unless persistence is explicitly approved;
- root safe-area, background, and status-bar integration: mount one `SafeAreaProvider` and one root `SafeAreaView` in `app/_layout.tsx`; the root safe-area wrapper must use `edges={['top']}` only. Do not add `SafeAreaView` to themed screens by default. Bottom insets remain the responsibility of the route or shared floating-control component that needs them;
- a reusable icon-only theme toggle using the approved icon system, a minimum 48-point target, switch accessibility role/state, an accessibility label and next-mode hint, and native-driver press-scale feedback;
- token-driven inline styles instead of `StyleSheet.create` for themed UI;
- a scrollable LandingScreen visual reference for app constants and every active token group: all semantic colors, typography styles, font-family variants, spacing values, radius values, opacity states, shadow/elevation samples, and focus-ring treatment. Render actual token specimens and their token names/values; do not reduce the reference to a summary line;
- exact dependency, file, validation, and manual-test changes.

Do not edit files or add dependencies until the user says **proceed**.

#### Phase 2 Proceed

Implement only the approved Phase 2 scope. Create the theme tokens, provider, hook, animation helper, and reusable toggle. Keep theme state session-only: a manual toggle may override the device-derived initial mode during the current session, but must not persist across restarts unless persistence is explicitly approved.

In `app/_layout.tsx`, mount `SafeAreaProvider`, then the theme provider, then one themed root `SafeAreaView` with `edges={['top']}`. Apply the active theme background and Expo status-bar style within that root shell. Do not add `SafeAreaView` to `app/index.tsx` or other themed screens unless an explicit edge-to-edge exception is approved. Route-level or shared floating controls must consume bottom insets directly when required.

Use token-driven inline styles for themed UI and do not use `StyleSheet.create` for themed screens. Make the LandingScreen a scrollable visual reference for app constants and every active token group: all semantic colors, typography styles, font families, spacing, radii, opacity states, shadow/elevation, and focus-ring treatment. Each specimen must use active tokens and show its token name and meaningful value where applicable.

Validate with `npx tsc --noEmit`, `npx expo export --platform ios --output-dir <temporary-directory-outside-repository>`, `npx expo export --platform android --output-dir <temporary-directory-outside-repository>`, and `git diff --check`. Manually verify light and dark modes on iOS and Android: device-derived initial appearance, session-only toggle behavior, status-bar readability, root top-safe-area spacing, no duplicated screen-level safe-area padding, all token specimens updating after a mode switch, and LandingScreen scroll reachability at small viewport and large-text settings.

#### Phase 2 Review and Approval

On **review changes**, list all Phase 2 work without editing. On **approve changes**, record the approved theme-token conventions, persistence decision, dependencies, and validation requirements in the section below.

### Phase 3 — Theme-Aware Global Overlay System

**Goal:** establish a reusable, global, typed overlay system after Phase 2 is approved.

#### Phase 3 Advice

Propose an overlay system with this separation of responsibilities:

```text
src/
├── components/
│   └── overlay/
│       └── overlayHost.tsx
├── constants/
│   └── overlay.ts
├── contexts/
│   ├── overlayContext.ts
│   └── overlayProvider.tsx
└── hooks/
    └── useOverlay.ts
```

Include:

- typed APIs through `OverlayProvider` and `useOverlay` for alert, confirm, destructive confirm, custom modal, bottom sheet, blocking loader, and toast;
- a context contract separate from provider and rendering implementation to prevent import cycles;
- a single `OverlayHost` rendered from the root shell beneath the approved theme and safe-area providers but outside the route-only root `SafeAreaView`, so native modal backdrops can cover the full window, including the top safe-area and status-bar region. `OverlayProvider` owns typed state, timers, and dismissal lifecycle; `OverlayHost` consumes that state for rendering;
- semantic overlay theme tokens, including `overlayBackdrop` and `success`, `danger`, `warning`, and `info` colors with soft-background counterparts in both modes;
- Android edge-to-edge configuration: enable `edgeToEdgeEnabled: true` in Expo config when overlays must visually cover system-bar regions. Treat this as native configuration requiring a rebuilt Android development build or binary for manual verification;
- root status-bar integration: expose overlay-active state so the root shell can select a readable status-bar icon style while a blocking modal, dialog, sheet, or loader is visible, then restore theme-derived styling after dismissal;
- backdrop dismissal for alerts, confirmations, custom modals, and bottom sheets, with confirmation dismissal using the cancel callback path;
- centered alert, confirmation, destructive-confirmation, and custom-modal surfaces with a fixed preferred dialog width, capped at the available viewport width after theme spacing. Keep bottom sheets full width;
- a loader that remains blocking, can only close through the typed API, and optionally supports provider-owned duration cleanup;
- direct toast rendering above root content rather than inside a native `Modal`, with top safe-area placement, tap/timeout dismissal, visible exit animation before state removal, and safe replacement/cleanup of prior timers;
- React Native `Animated` and `PanResponder` bottom-sheet interactions with no new gesture dependency;
- a full-width bottom sheet with a dedicated 44-point handle-only drag target. Attach `PanResponder` only to that target—not sheet content—with start/move capture behavior, Android-safe native view retention where needed, non-negative translation, active-animation interruption on drag grant, termination spring-back, and dismissal at 18% of measured sheet height or velocity above `0.7`;
- bottom-sheet safe-area behavior: the sheet surface extends to the physical bottom edge, while its content reserves `useSafeAreaInsets().bottom` plus token spacing so gesture-navigation and three-button-navigation areas do not obscure controls;
- entry/exit transitions that retain overlay or toast content until animation completion. Route all confirmation, backdrop, hardware-back, button, and sheet-drag terminal paths through one idempotent exit lifecycle; clear state and invoke exactly one completion callback only after exit motion completes;
- accessible action hierarchy: use a semantic foreground token for filled primary and destructive actions, a distinct secondary cancel treatment, 44-point minimum action heights, and token-driven pressed feedback;
- exact file, dependency, configuration, validation, and manual-test changes.

Do not edit files or add dependencies until the user says **proceed**.

#### Phase 3 Proceed

Implement only the approved Phase 3 scope. Keep the overlay context contract separate from provider and host implementation. `OverlayProvider` owns typed overlay state, timers, and idempotent completion lifecycle. Mount one `OverlayHost` from the root shell beneath the approved theme and safe-area providers but outside the route-only root `SafeAreaView`, so native modal content can cover the entire window. Use only semantic theme tokens for overlay visuals and do not hard-code host backdrop colors.

When Android overlays must cover system-bar regions, enable `edgeToEdgeEnabled: true` in Expo config and verify in a rebuilt Android app. Expose overlay-active state so the root shell uses readable status-bar icons while blocking overlays are visible.

Use React Native `Modal`, `Animated`, and `PanResponder` for modal and bottom-sheet interactions unless a dependency is explicitly approved. Centered dialogs use the shared fixed preferred width within horizontal viewport padding. Bottom sheets are full width, use top corner radii only, extend their surface to the bottom edge, and reserve bottom inset only for content. Render the backdrop below an interactive full-width sheet layer. Disable backdrop interaction during sheet exit so backdrop presses and drag dismissal cannot race. Keep loader overlays blocking and close them only through the typed API or provider-owned duration cleanup. Render toasts directly over root content, respect the top safe-area inset, replace/clear timers safely, and retain toast content until exit animation completes.

Use the bottom-sheet handle as a 44-point handle-only drag target; do not attach drag handling to sheet content. Use start/move capture behavior, Android-safe native view retention where needed, non-negative translation, and active-animation interruption on drag grant. Spring back after insufficient or terminated downward drags; dismiss when downward movement reaches at least 18% of measured sheet height or vertical velocity exceeds `0.7`.

Retain overlays through exit motion. Ensure backdrop dismissal, hardware-back behavior, button actions, loader timing, sheet-drag dismissal, callbacks, and toast timers cannot invoke completion behavior more than once. Use semantic action foreground tokens for filled primary/danger buttons and a distinct secondary cancel treatment.

Validate with `npx tsc --noEmit`, `npx expo export --platform ios --output-dir <temporary-directory-outside-repository>`, `npx expo export --platform android --output-dir <temporary-directory-outside-repository>`, `npx expo config --type public --json`, and `git diff --check`. Manually test iOS and Android alert, confirmation, destructive confirmation, custom-modal, loader, toast, and bottom-sheet behavior: full-window backdrop coverage including the top safe area/status bar; readable status-bar icons while overlays are active; Android edge-to-edge behavior in a rebuilt native app; fixed dialog width at normal and narrow viewport sizes; full-width sheet surface; sheet content clearance above gesture and three-button navigation; handle-only drag behavior; drag spring-back; distance/velocity dismissal; backdrop/hardware-back dismissal; toast replacement and animated exit; and repeated open/close callback idempotence.

#### Phase 3 Review and Approval

On **review changes**, list all Phase 3 work without editing. Include provider/context/host boundaries, theme-token additions, dependencies, validation results, manual-test status, limitations, and deferred work. Identify pre-existing or out-of-scope changes separately. On **approve changes**, record only app-specific durable overlay decisions in the approved project decisions section.

### Phase 4 — Tabs Module

**Goal:** establish primary Home and Settings experiences with a reusable floating tab bar after Phase 3 is approved.

#### Phase 4 Advice

Propose an Expo Router tab structure with a root LandingScreen, Home and Settings root routes, and generic nested placeholder routes:

```text
app/
├── _layout.tsx
├── index.tsx # LandingScreen
└── (tabs)/
    ├── _layout.tsx
    ├── home/
    │   ├── _layout.tsx
    │   ├── index.tsx
    │   └── demo/
    │       └── index.tsx
    └── settings/
        ├── _layout.tsx
        ├── index.tsx
        └── demo/
            └── index.tsx
src/
└── components/
    └── tabs/
        └── bottomBar.tsx
```

Include:

- a root `LandingScreen` at `app/index.tsx` and an Expo Router `(tabs)` route group for the primary experiences;
- disabled native headers and route animations with `headerShown: false` and `animation: 'none'` at root, tab, and nested stack levels;
- the standard Expo Router tab bar hidden in favor of a shared floating pill `bottomBar.tsx` for Home and Settings root routes;
- theme-token-driven bottom-bar styling using the approved icon system, safe-area-aware placement, 48-point accessible targets, selected state, and press-scale feedback;
- no navigation dispatch when the user presses an already active tab, with replacement navigation for inactive-tab switches;
- full-screen nested routes that do not show the bottom bar;
- generic `demo/` directories that remain temporary until a future module renames them, for example to `attendance/`;
- a Home pressable that returns to the LandingScreen and a LandingScreen action that returns to Home;
- exact dependency, configuration, validation, and manual-test changes.

Do not edit files or add dependencies until the user says **proceed**.

#### Phase 4 Proceed

Implement only the approved Phase 4 scope. Preserve the root LandingScreen at `app/index.tsx`; configure the root, tab, and nested stacks with `headerShown: false` and `animation: 'none'`. Use Expo Router `Tabs` with the system tab bar hidden, and render the shared `src/components/tabs/bottomBar.tsx` only on the Home and Settings root routes.

Use approved theme tokens and the approved icon system for the floating bar. Respect bottom safe-area insets and provide accessible touch targets of at least 48 points. Do not dispatch navigation for an already active tab. Use replacement navigation for inactive tab switches so repeated active-tab presses do not refresh Android screens.

Keep nested routes such as `home/demo` and `settings/demo` full-screen without the bottom bar. Keep `demo/` generic until a future module renames it. Link Home to the root LandingScreen and route the LandingScreen action back to Home with replacement navigation.

Validate with `npx tsc --noEmit`, `npx expo export --platform ios --output-dir <temporary-directory>`, and `git diff --check`. Manually test iOS and Android active-tab behavior, nested-route bar visibility, safe-area spacing, disabled route animation, and navigation between LandingScreen and Home.

#### Phase 4 Review and Approval

On **review changes**, list all Phase 4 work without editing. Include route hierarchy, floating-bar visibility rules, active-tab navigation behavior, dependencies/configuration, validation results, manual-test status, limitations, and deferred module work. Identify pre-existing or out-of-scope changes separately. On **approve changes**, record only app-specific durable navigation decisions in the approved project decisions section.

### Phase 5 — Shared Module

**Goal:** establish reusable screen, picker, and floating-control foundations after Phase 4 is approved.

#### Phase 5 Advice

Propose a shared module using this structure:

```text
src/
├── components/
│   └── shared/
│       ├── appScreen.tsx
│       ├── emptyState.tsx
│       ├── longList.tsx
│       └── optionPicker.tsx
├── constants/
│   └── layout.ts
├── contexts/
│   └── barContext.tsx
└── hooks/
    └── useBar.ts
```

Include:

- a reusable `AppScreen` that owns scroll layout, optional back/title/subtitle/right-slot header content, pull-to-refresh wiring, focused scroll registration, and component-level screen presence motion;
- shared `EmptyState`, `LongList`, and `OptionPicker` components, with radio semantics for preference choices and button/action semantics for navigation choices; preference persistence remains session-only unless explicitly approved;
- direct use of `useOverlay()` for overlay work; do not add thin `useModal()` or `useSheet()` wrapper hooks unless they provide durable behavior beyond renaming the typed overlay API; use `dismiss(onComplete?)` for selection-triggered follow-up work that must occur after overlay exit animation completion, while backdrop and hardware-back dismissal use plain `dismiss()` and never trigger selection behavior;
- a Home right-slot action that opens an action-mode `OptionPicker` in a custom modal and completes navigation only after the modal’s single-invocation-safe dismissal lifecycle;
- a Settings preference action that opens `OptionPicker` in the approved bottom sheet and dismisses after selection;
- `BarProvider` and `useBar()` for global floating-control state, with each focused `AppScreen` registering its own scroll controller so inactive routes cannot affect the active screen;
- scroll-direction hysteresis for floating-control visibility: root `/home` and `/settings` routes show a full-width floating tab-bar pill at rest, then fade it out in favor of a separate centered 56-point circular scroll-to-top action after scrolling; nested `/home/*` and `/settings/*` routes never show the tab bar but may show the scroll-to-top action after scrolling; keep both controls on the same safe-bottom placement anchor while preserving their distinct size and layout; use a fixed shared stage, fade-only handoff, and non-interactive fading controls without layout-position animation;
- bottom-inset-aware placement with platform-specific visual minimum offsets and sufficient root-screen content clearance;
- no route-animation change: keep Expo Router route transitions configured with `animation: 'none'` and use component-owned motion for shared screen presentation;
- exact dependency, file, validation, and iOS/Android manual-test changes.

Do not edit files or add dependencies until the user says **proceed**.

#### Phase 5 Proceed

Implement only the approved Phase 5 scope. Use `AppScreen` for the approved root and nested screen foundations. Root Home and Settings screens must reserve the shared floating-control content clearance; nested routes must not reserve it.

Use `useOverlay()` directly. Ensure custom-modal and bottom-sheet exit callbacks, backdrop dismissal, hardware-back dismissal, sheet drag dismissal, and selection actions invoke their completion behavior no more than once. Use `dismiss(onComplete?)` when Home option selection must wait for modal exit before navigating; use plain `dismiss()` for backdrop and hardware-back paths so they cannot trigger selection navigation. Keep dismissal state safe for callbacks captured in custom modal content. Settings preference selection must dismiss its sheet after updating the selected value.

Mount `BarProvider` in the approved root provider hierarchy. Register and activate only the focused route’s scroll controller. On root `/home` and `/settings`, show the full-width tab-bar pill at rest and fade to a separate centered 56-point circular scroll-to-top action after direction hysteresis. On nested `/home/*` and `/settings/*` routes, never render the tab bar; render only the scroll-to-top action after scrolling. Position both controls from the same safe-bottom anchor while preserving their separate dimensions and layout. Apply a fixed-height absolute control stage, fade-only visibility handoff, and disabled pointer events while controls fade out. Keep floating controls bottom-inset-aware and ensure root content remains reachable above them.

Validate with `npx tsc --noEmit`, `npx expo export --platform ios --output-dir <temporary-directory-outside-repository>`, `npx expo export --platform android --output-dir <temporary-directory-outside-repository>`, and `git diff --check`. Manually test picker selection and dismissal, post-exit Home navigation, backdrop and hardware-back cancellation without navigation, tab switching, active-screen scroll ownership, root and nested floating-control visibility, scroll-to-top behavior, fade-handoff non-interactivity, compact-header readability at narrow widths and large-text settings, and iOS/Android gesture and three-button-navigation placement.

#### Phase 5 Review and Approval

On **review changes**, list all Phase 5 work without editing. Include shared-component boundaries, overlay callback lifecycle behavior, floating-control ownership and visibility rules, dependencies/configuration, validation results, manual-test status, limitations, and deferred module work. Identify pre-existing or out-of-scope changes separately. On **approve changes**, record only app-specific durable shared-module decisions in the approved project decisions section.

### Idea to Feature

After Phase 5 is approved, develop product work as one unnumbered feature slice at a time. Do not define additional numbered phases unless the project explicitly returns to foundation work.

Do not use this workflow until Phase 5 has been explicitly approved. Before then, continue the active foundation-phase workflow.

Use one named feature at a time:

```text
Feature: <feature name>
Status: Advice | In progress | Awaiting review | Approved
Scope: <one-sentence boundary>
```

#### `idea to feature`

Treat an idea or feature proposal as an Advice call, not permission to edit.

1. Inspect the current app foundation, route structure, active providers/hooks, metadata and design direction, declared dependencies, current working tree, and relevant existing modules.
2. Translate the request into one bounded feature proposal.
3. State:
   - user goal and user flow;
   - scope and explicit non-goals;
   - likely routes, files, contexts, hooks, constants, components, dependencies, and configuration;
   - data ownership, persistence behavior, and migration needs;
   - accessibility, safe-area, navigation, overlay, theme, and platform implications;
   - security, privacy, backend-contract, and failure-state implications when relevant;
   - validation, iOS/Android manual tests, acceptance criteria, limitations, and deferred work.
4. Do not assume backend contracts, API availability, credentials, storage duration, privacy policy, analytics, external services, or production security behavior without explicit approval.
5. Ask one focused question only when its answer materially changes the proposal.
6. Wait for `proceed`.

#### Feature `proceed`

Implement only the immediately preceding approved feature scope.

- Preserve approved foundation boundaries and use existing shared modules before adding new abstractions.
- Do not add unrelated features, refactors, dependency upgrades, cleanup, or configuration changes.
- If a material product, UX, security, persistence, privacy, API, or backend decision appears, return to Advice rather than choosing silently.
- Validate the work and report `Awaiting review`.

#### Feature `review changes`

Do not make changes.

- List every active-feature change by file and user-visible behavior.
- Include dependencies and configuration changes; state, persistence, migration, privacy, and security behavior; validation results; manual-test status; limitations; deferred backend or product work; and pre-existing or out-of-scope changes.
- Wait for revisions plus `proceed`, or `approve changes`.

#### Feature `approve changes`

- Update `Approved Project Decisions` with durable product-specific decisions only.
- Do not add temporary task notes, test credentials, secrets, personal data, or private content.
- State what was added or revised in this guide, validate the update, and mark the feature `Approved`.
- Return to `Idea to Feature` Advice for the next request.

## Approved Project Decisions

### Phase 1 — App Metadata and Native Foundation

- **App metadata:** Faith — “HRMS in your pocket”; slug `faith-hrms`; deep-link scheme `faith`.
- **Version policy:** The current version is `0.2.0`. `src/constants/about.ts` is the user-visible metadata source, and its version must match the root `package.json` and Expo config version.
- **Native-only boundary:** Target iOS and Android. The web npm script, web Expo configuration, and web-only favicon asset were removed. Leave any declared scratchpad or excluded file untouched unless explicitly requested.
- **Routing:** Expo Router is the app entry point. The root route structure begins with `app/_layout.tsx` and `app/index.tsx`; the root stack has hidden headers and disabled route animation.
- **Typography and icons:** Use the Manrope font family through `@expo-google-fonts/manrope` and `expo-font`. Use `@expo/vector-icons` with Ionicons as the approved product icon system; do not substitute emoji or text glyphs as product icons without explicit approval.
- **Design direction:** Modern purple, calm, and trustworthy workplace companion. The primary color is `#6D28D9` with deep indigo and soft lavender supporting tones.
- **Safe-area ownership:** `app/_layout.tsx` mounts one `SafeAreaProvider` and owns the root `SafeAreaView` with `edges={['top']}`. The LandingScreen does not add another safe-area wrapper.
- **Approved dependencies:** `expo-router`, `expo-font`, `react-native-safe-area-context`, `@expo/vector-icons`, and `@expo-google-fonts/manrope`.
- **Validation baseline:** Run `npx tsc --noEmit`, `npx expo config --type public --json`, native iOS and Android exports to temporary directories outside the repository, and `git diff --check` after implementation work.

### Phase 2 — Theme Module

- **Theme model:** Use typed, semantic light/dark tokens from `src/constants/theme.ts`. Tokens cover colors, spacing, typography, Manrope font families, opacity, radii, focus treatment, and platform-aware shadow/elevation.
- **Color direction:** Preserve modern purple as the primary identity: light primary `#6D28D9`, with a light lavender supporting surface; dark mode uses accessible lavender-purple equivalents on deep indigo surfaces.
- **Persistence:** Resolve the initial mode from the device appearance. A manual toggle is in-memory and session-only; it must not persist across restarts without explicit approval.
- **Provider contract:** `ThemeProvider` exposes the resolved mode, optional session selection, active typed theme, and `toggleTheme()`. `useTheme()` must throw clearly outside the provider.
- **Root integration:** Keep provider order as `SafeAreaProvider` → `ThemeProvider` → one themed root `SafeAreaView` with `edges={['top']}`. Root background and Expo status-bar style follow the resolved theme; themed routes do not own another default safe-area wrapper.
- **Themed UI:** Use token-driven inline styles for themed UI rather than `StyleSheet.create`.
- **Theme toggle:** Use the reusable Ionicons-based `ThemeToggle` with 48-point minimum dimensions, switch accessibility semantics, next-mode label/hint, and native-driver press-scale feedback.
- **Reference screen:** The LandingScreen remains scrollable and renders active specimens for every approved theme token group so mode changes are visibly verifiable.
- **Dependencies and validation:** No Phase 2 dependency or Expo configuration change was required. Validate TypeScript, iOS/Android exports outside the repository, `git diff --check`, and manual light/dark behavior, safe-area, accessibility, and compact/large-text reachability.

### Phase 3 — Theme-Aware Global Overlay System

- **Overlay boundaries:** Keep `overlayContext.ts` as the typed API contract, `OverlayProvider` as state/timer/callback lifecycle owner, and `OverlayHost` as the rendering and visual-motion owner. `useOverlay()` exposes alert, confirm, destructive confirmation, custom modal, bottom sheet, blocking loader, toast, and dismiss APIs.
- **Root placement:** Mount `OverlayProvider` beneath the theme provider. Render `OverlayHost` from the root shell outside the route-only root `SafeAreaView`, allowing overlays to cover the visual window while routes retain top safe-area ownership.
- **Overlay semantics:** Alerts, confirmations, destructive confirmations, custom modals, sheets, loaders, and toasts use typed APIs. Confirmation backdrop and hardware-back dismissal use the cancellation path. Blocking loaders cannot be dismissed by backdrop or hardware back.
- **Lifecycle:** Provider timers and callbacks use synchronized current-overlay state, clear timers safely, and invoke terminal callbacks once. Host retains visual content through entry/exit motion; drag-dismissed sheets signal provider completion only after their host-owned visual exit has completed.
- **Theme tokens:** Use semantic `overlayBackdrop` and soft status-tone tokens (`successSoft`, `warningSoft`, `dangerSoft`, `infoSoft`) in both themes. Android overlay surfaces use token-driven borders/surface contrast instead of visible elevation boxes; iOS retains platform shadows.
- **Dialogs and actions:** Centered dialog surfaces use a preferred capped width, token-driven borders, 44-point minimum actions, distinct secondary cancel treatment, and semantic primary/destructive actions.
- **Toasts:** Render directly above root content, not inside `Modal`; respect top inset, support tone variants, tap/timeout dismissal, replacement/timer cleanup, and retained exit animation.
- **Bottom sheets:** Use React Native `Animated` and `PanResponder` without a gesture dependency. Sheet entry waits for measured height, drag is limited to a dedicated 44-point handle target, content is not draggable, downward translation is clamped/resisted, short drags spring back, and threshold/velocity drags dismiss fully beyond the physical bottom before provider completion. Keep sheet content clear of bottom navigation through safe-area inset plus token spacing.
- **Animation:** Centralize overlay fade, dialog, toast, sheet, and press-scale recipes in `src/helpers/animate.ts`.
- **Android configuration:** `android.edgeToEdgeEnabled` is enabled. Full system-bar coverage and sheet placement require manual verification in a rebuilt Android development build or binary.
- **Validation:** Validate TypeScript, Expo public config, iOS/Android exports outside the repository, `git diff --check`, and manual overlay behavior including callback idempotence, system-bar readability, bottom-sheet gesture behavior, and toast/loader timing.

### Phase 4 — Tabs Module

- **Route hierarchy:** Preserve the LandingScreen at `/`. Primary experiences live in the Expo Router `(tabs)` group as `/home` and `/settings`, each with a nested stack and a temporary full-screen `demo/` route. Root, tab, and nested stack configurations use `headerShown: false` and `animation: 'none'`.
- **Tab navigator:** Explicitly declare `home` and `settings` with `Tabs.Screen`; hide the native tab bar and use the shared custom navigation control instead.
- **Floating navigation:** Render `src/components/tabs/bottomBar.tsx` only on the Home and Settings root routes. It uses themed Ionicons, 48-point minimum tab targets, selected accessibility state, press-scale feedback, and a safe-bottom anchor raised by one medium spacing token.
- **Navigation behavior:** Pressing the active tab is a no-op. Inactive tab switches use replacement navigation. Landing-to-Home and Home-to-Landing actions also use replacement navigation. Nested demo routes return to their owning root route and do not render the floating bar.
- **Settings integration:** Settings includes the approved reusable session-only `ThemeToggle` and presents current theme/session information.
- **Dependencies and validation:** Phase 4 added no dependencies or Expo configuration. Validate TypeScript, Expo public config, iOS/Android exports outside the repository, and `git diff --check`; manually verify tab behavior, nested-route bar visibility, safe-area placement, and navigation on iOS and Android.

### Phase 5 — Shared Module

- **Shared screen foundation:** Reusable shared components provide screen layout and presence motion, empty states, long-list behavior, and accessible option pickers. Root Home and Settings routes reserve clearance for floating controls; nested routes do not.
- **Floating-control ownership:** `BarProvider` coordinates only the focused screen's registered scroll controller. Root Home and Settings routes hand off between the floating tab pill at rest and a centered scroll-to-top action after scroll-direction hysteresis; nested routes never show the tab pill and may show only scroll-to-top.
- **Picker and overlay behavior:** Home action choices use the typed custom-modal overlay and navigate only after the single-safe dismissal completion. Settings preferences use the typed bottom sheet, remain session-only, and dismiss after a selection. Backdrop and hardware-back dismissal do not trigger selection actions.
- **Navigation and platform behavior:** Shared controls remain bottom-inset-aware, use a fixed fade-only control stage, prevent interaction while fading out, and preserve the approved no-route-animation policy.
- **Feature readiness:** Phase 5 is approved. Faith is ready to use the one-at-a-time `Idea to Feature` workflow for product feature slices.

### Feature — Auth Module

- **Auth boundary:** Faith uses a local-only, non-production username/password flow for the current feature slice. It is not a real identity provider, backend login, token system, role system, or production authorization boundary.
- **Session persistence:** Persist only versioned session metadata, username, issued time, and expiry time in `expo-secure-store`; never persist or log raw passwords. Valid sessions expire after 24 hours. Corrupt or expired secure-store data is cleared and resolves to login.
- **Global contract:** `AuthProvider` and `useAuth()` own typed auth state and secure-session lifecycle. Interactive sign-in, restored sessions, and sign-out each use prepared state followed by a completion step so authentication state changes only after the approved loader exit lifecycle.
- **Access control:** The authenticated `(tabs)` group redirects unauthenticated access to `/`. Settings provides a destructive-confirmation logout that removes secure session data before completing the in-memory sign-out.
- **Login experience:** The root route is Faith's keyboard-safe, token-driven login screen with accessible username/password fields, password visibility control, toast feedback for incomplete or invalid sign-in, and a one-second blocking loader for sign-in, secure-session restoration, and logout. Route replacement occurs only after the loader dismissal callback.
- **Dependencies and configuration:** `expo-secure-store` is an approved dependency and Expo config plugin. Validate TypeScript, Expo public config, iOS/Android exports outside the repository, `git diff --check`, and manual login/session-expiry/logout lifecycle behavior on iOS and Android.
