import { defineConfig } from "unocss";

export default defineConfig({
  shortcuts: {
    // custom the default background
    "bg-main": "bg-white text-[#181818] dark:(bg-[#121212] text-[#ddd])",
    "fade-in": "op-0 transition-all duration-400 ease-in-out hover:op-100",
    "slide-in":
      "transform transition-all duration-500 ease-in-out translate-x-[-100%] hover:translate-x-0",

    "info-block":
      "border-2 border-blue-400 rounded-lg bg-blue-50 dark:bg-blue-900/20",
    "important-block":
      "border-2 border-purple-400 rounded-lg bg-purple-50 dark:bg-purple-900/20",
    "tip-block":
      "border-2 border-green-400 rounded-lg bg-green-50 dark:bg-green-900/20",
    "warning-block":
      "border-2 border-yellow-400 rounded-lg bg-yellow-50 dark:bg-yellow-900/20",
    "warning2-block":
      "border-2 border-orange-400 rounded-lg bg-orange-50 dark:bg-orange-900/20",
    "detail-block":
      "border-2 border-gray-400 rounded-lg bg-gray-50 dark:bg-gray-900/20",

    // rounded vs rounded-lg
    "info-quote":
      "bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400",
    "imp-quote":
      "bg-purple-50 dark:bg-purple-900/20 rounded border-l-4 border-purple-400",
    "tip-quote":
      "bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400",
    "warning-quote":
      "bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400",
    "danger-quote":
      "bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-400",
    "detail-quote":
      "bg-gray-50 dark:bg-gray-900/20 rounded border-l-4 border-gray-400",
  },
  // ...
});
