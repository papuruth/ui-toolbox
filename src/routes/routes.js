import Home from "pages/Home";
import Operations from "pages/Operations";
import BlogIndex from "pages/Blog";
import BlogPost from "pages/Blog/BlogPost";

export default [
    {
        path: "/",
        component: Home,
        exact: true,
        key: "HOMECOMPONENT"
    },
    {
        path: "/blog",
        component: BlogIndex,
        exact: true,
        key: "BLOG"
    },
    {
        path: "/blog/:slug",
        component: BlogPost,
        exact: true,
        key: "BLOGPOST"
    },
    {
        path: "/base64-image",
        component: Operations,
        exact: true,
        key: "BASE64IMAGE"
    },
    {
        path: "/qr-generator",
        component: Operations,
        exact: true,
        key: "QRGENERATOR"
    },
    {
        path: "/image-resizer",
        component: Operations,
        exact: true,
        key: "IMAGERESIZER"
    },
    {
        path: "/aspect-ratio-calculator",
        component: Operations,
        exact: true,
        key: "ASPECTRATIOCALCULATOR"
    },
    {
        path: "/base64-text",
        component: Operations,
        exact: true,
        key: "BASE64TEXT"
    },
    {
        path: "/url-validator",
        component: Operations,
        exact: true,
        key: "URLVALIDATOR"
    },
    {
        path: "/url-shortener",
        component: Operations,
        exact: true,
        key: "URLSHORTENER"
    },
    {
        path: "/json-viewer",
        component: Operations,
        exact: true,
        key: "JSONVIEWER"
    },
    {
        path: "/password-tools",
        component: Operations,
        exact: true,
        key: "PASSWORDTOOLS"
    },
    {
        path: "/color-converter",
        component: Operations,
        exact: true,
        key: "COLORCONVERTER"
    },
    {
        path: "/text-case",
        component: Operations,
        exact: true,
        key: "TEXTCASE"
    },
    {
        path: "/hash-generator",
        component: Operations,
        exact: true,
        key: "HASHGENERATOR"
    },
    {
        path: "/regex-tester",
        component: Operations,
        exact: true,
        key: "REGEXTESTER"
    },
    {
        path: "/jwt-decoder",
        component: Operations,
        exact: true,
        key: "JWTDECODER"
    },
    {
        path: "/uuid-generator",
        component: Operations,
        exact: true,
        key: "UUIDGENERATOR"
    },
    {
        path: "/timestamp",
        component: Operations,
        exact: true,
        key: "TIMESTAMP"
    },
    {
        path: "/number-base",
        component: Operations,
        exact: true,
        key: "NUMBERBASE"
    },
    {
        path: "/yaml-json",
        component: Operations,
        exact: true,
        key: "YAMLJSON"
    },
    {
        path: "/text-diff",
        component: Operations,
        exact: true,
        key: "TEXTDIFF"
    },
    {
        path: "/lorem-ipsum",
        component: Operations,
        exact: true,
        key: "LOREMIPSUM"
    },
    {
        path: "/word-counter",
        component: Operations,
        exact: true,
        key: "WORDCOUNTER"
    },
    {
        path: "/csv-json",
        component: Operations,
        exact: true,
        key: "CSVJSON"
    }
];
