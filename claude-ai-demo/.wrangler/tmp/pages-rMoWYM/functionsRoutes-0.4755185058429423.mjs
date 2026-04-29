import { onRequestOptions as __api_ask_cv_js_onRequestOptions } from "/Users/arunakamakshi/IdeaProjects/intern-react-concepts/claude-ai-demo/functions/api/ask-cv.js"
import { onRequestPost as __api_ask_cv_js_onRequestPost } from "/Users/arunakamakshi/IdeaProjects/intern-react-concepts/claude-ai-demo/functions/api/ask-cv.js"
import { onRequestOptions as __api_generate_jd_js_onRequestOptions } from "/Users/arunakamakshi/IdeaProjects/intern-react-concepts/claude-ai-demo/functions/api/generate-jd.js"
import { onRequestPost as __api_generate_jd_js_onRequestPost } from "/Users/arunakamakshi/IdeaProjects/intern-react-concepts/claude-ai-demo/functions/api/generate-jd.js"
import { onRequestOptions as __api_upload_cv_js_onRequestOptions } from "/Users/arunakamakshi/IdeaProjects/intern-react-concepts/claude-ai-demo/functions/api/upload-cv.js"
import { onRequestPost as __api_upload_cv_js_onRequestPost } from "/Users/arunakamakshi/IdeaProjects/intern-react-concepts/claude-ai-demo/functions/api/upload-cv.js"

export const routes = [
    {
      routePath: "/api/ask-cv",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_ask_cv_js_onRequestOptions],
    },
  {
      routePath: "/api/ask-cv",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_ask_cv_js_onRequestPost],
    },
  {
      routePath: "/api/generate-jd",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_generate_jd_js_onRequestOptions],
    },
  {
      routePath: "/api/generate-jd",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_generate_jd_js_onRequestPost],
    },
  {
      routePath: "/api/upload-cv",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_upload_cv_js_onRequestOptions],
    },
  {
      routePath: "/api/upload-cv",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_upload_cv_js_onRequestPost],
    },
  ]