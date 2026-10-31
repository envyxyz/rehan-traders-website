import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

// Design-system enforcement (CLAUDE.md hard rules 1 and 2). Each array is spread into every
// block that sets no-restricted-syntax, because flat config replaces that array instead of merging it.

const NO_RAW_COLOUR = [
  ["Literal[value=/#[0-9a-fA-F]{3,8}\\b/]", "Raw hex colour. Use a token from globals.css (bg-ink, text-steel, ...)."],
  ["TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b/]", "Raw hex colour in a template. Use a token from globals.css."],
  ["Literal[value=/\\b(?:rgba?|hsla?|oklch)\\(/]", "Raw colour function. Use a token from globals.css."],
  ["TemplateElement[value.raw=/\\b(?:rgba?|hsla?|oklch)\\(/]", "Raw colour function in a template. Use a token from globals.css."],
]

// An arbitrary value is `utility-[...]` NOT followed by `:` (that would be an arbitrary variant like data-[state=open]:).
const ARBITRARY = "(?:^|[\\s:!])-?[a-z][a-z0-9-]*-\\[[^\\]\\s]+\\](?!:)"
// Any string, not only className and cn()/cva() arguments: class strings kept in a const slipped past before.
const NO_ARBITRARY_VALUE = [
  [`Literal[value=/${ARBITRARY}/]`, "Arbitrary Tailwind value. Add a token to globals.css @theme, then use it."],
  [`TemplateElement[value.raw=/${ARBITRARY}/]`, "Arbitrary Tailwind value. Add a token to globals.css @theme, then use it."],
]

// Default Tailwind steps that the @theme reset in globals.css removed: they compile to nothing, so the element silently
// loses the style (rounded-2xl once left the job card panel square). Our steps: rounded-xs..xl/pill, text-display-*, ...
const RESET = "(?:^|[\\s:!])-?(?:rounded(?:-[a-z]{1,2})?-[2-4]xl|text-(?:xs|sm|base|lg|[2-9]?xl)|shadow-(?:2xs|xs|sm|md|lg|xl|2xl)|font-(?:mono|serif))(?![\\w-])"
const NO_RESET_SCALE = [
  [`Literal[value=/${RESET}/]`, "Tailwind default step that our @theme reset removed: it renders nothing. Use a token from globals.css."],
  [`TemplateElement[value.raw=/${RESET}/]`, "Tailwind default step that our @theme reset removed: it renders nothing. Use a token from globals.css."],
]

const COPY = "Copy belongs in src/content.ts. Import it or take it as a prop."
const COPY_ATTR = "JSXAttribute[name.name=/^(aria-label|aria-description|alt|title|placeholder)$/]"
const NO_LITERAL_COPY = [
  ["JSXText[value=/[A-Za-z]/]", COPY],
  [":matches(JSXElement, JSXFragment) > JSXExpressionContainer > Literal[value=/[A-Za-z]/]", COPY],
  [":matches(JSXElement, JSXFragment) > JSXExpressionContainer > TemplateLiteral > TemplateElement[value.raw=/[A-Za-z]/]", COPY],
  [`${COPY_ATTR} > Literal`, COPY],
  [`${COPY_ATTR} > JSXExpressionContainer > :matches(Literal, TemplateLiteral)`, COPY],
]

const rules = (...sets) => sets.flat().map(([selector, message]) => ({ selector, message }))

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/components/**/*.{ts,tsx}", "src/app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": ["error", ...rules(NO_RAW_COLOUR, NO_ARBITRARY_VALUE, NO_RESET_SCALE, NO_LITERAL_COPY)],
    },
  },
  globalIgnores([".next/**", "out/**", ".wrangler/**", "build/**", "next-env.d.ts", "design/**", "src/lib/cn-tables.ts", ".claude/**"]),
])
