import {r as c, j as e, m as t, A as p, H as h} from "./index-Da6hjyVK.js";
import {S as g} from "./star-Cqr3G_Td.js";
import {T as u} from "./tag-BqOTbYF2.js";

const v = ({product: s, onClick: x}) => {
    var o, m;
    const [l,r] = c.useState(!1);
    const n = c.useMemo(() => s.prices && Array.isArray(s.prices) ? [...s.prices].sort((a, f) => a.price - f.price) : [], [s.prices]);
    
    const d = a => typeof a == "number" ? `${a % 1 === 0 ? a.toFixed(0) : a.toFixed(1)}€` : "-";
    const i = n.length > 0 ? n[0] : null;
    
    return e.jsxs(t.div, {
        whileHover: {
            scale: 1.02,
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
        },
        whileTap: {
            scale: .98
        },
        onClick: x,
        className: "cursor-pointer flex flex-col w-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg border border-gray-700 transition-all duration-300 ease-in-out h-full",
        children: [e.jsxs("div", {
            className: "relative aspect-square overflow-hidden",
            onMouseEnter: () => r(!0),
            onMouseLeave: () => r(!1),
            children: [e.jsx(p, {
                children: e.jsx(t.img, {
                    src: l && ((o = s.images) != null && o[1]) ? s.images[1] : ((m = s.images) == null ? void 0 : m[0]) || s.image1,
                    alt: s.name,
                    className: "object-cover w-full h-full",
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    transition: {
                        duration: .3
                    }
                }, l ? "hovered" : "default")
            }), e.jsx("div", {
                className: "absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
            }), s.isFeatured && e.jsxs(t.span, {
                initial: {
                    opacity: 0,
                    x: -50
                },
                animate: {
                    opacity: 1,
                    x: 0
                },
                className: "absolute top-3 left-3 rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm flex items-center",
                children: [e.jsx(g, {
                    size: 12,
                    className: "mr-1.5"
                }), "Featured"]
            }), e.jsx(t.div, {
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                className: "absolute bottom-3 left-3 right-3 flex justify-between items-end",
                children: e.jsxs("span", {
                    className: "rounded-full bg-black/50 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white shadow-lg flex items-center gap-1.5",
                    children: [e.jsx(u, {
                        size: 12
                    }), s.category]
                })
            })]
        }), e.jsxs("div", {
            className: "p-4 flex flex-col justify-between flex-grow",
            children: [e.jsxs("div", {
                className: "space-y-2",
                children: [e.jsx("h5", {
                    className: "text-lg font-bold tracking-tight text-white line-clamp-2",
                    children: s.name
                }), e.jsxs("span", {
                    className: "text-xs font-medium text-pink-400 flex items-center",
                    children: [e.jsx(h, {
                        size: 12,
                        className: "mr-1.5"
                    }), s.farm || "Unknown"]
                })]
            }), i && e.jsxs("div", {
                className: "flex items-baseline mt-auto pt-2",
                children: [e.jsx("span", {
                    className: "text-2xl font-bold text-pink-400",
                    children: d(i.price)
                }), e.jsxs("span", {
                    className: "text-sm font-medium text-gray-400 ml-1",
                    children: ["/ ", i.gram]
                })]
            })]
        })]
    });
};

export {v as P};
