import { createCn } from "cn/config"

// Teach the merger our type tokens, so `text-display-lg` (size) and `text-ink` (colour) never cancel each other.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display-xl", "display-lg", "display-md", "title-lg", "title-md", "body-md", "body-sm", "caption", "button", "nav"] },
      ],
    },
  },
})
