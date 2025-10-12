import {j as e, L as s, m as r} from "./index-Da6hjyVK.js";
import {u as l} from "./useProductStore-IvwzBo2I.js";

const n = ({category: t}) => e.jsx("div", {
    className: "relative overflow-hidden h-96 w-full rounded-lg group",
    children: e.jsx(s, {
        to: "/category" + t.href,
        children: e.jsxs("div", {
            className: "w-full h-full cursor-pointer",
            children: [e.jsx("div", {
                className: "absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10"
            }), e.jsx("img", {
                src: t.imageUrl,
                alt: t.name,
                className: "w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110",
                loading: "lazy"
            }), e.jsxs("div", {
                className: "absolute bottom-0 left-0 right-0 p-4 z-20",
                children: [e.jsx("h3", {
                    className: "text-white text-2xl font-bold mb-2",
                    children: t.name
                }), e.jsxs("p", {
                    className: "text-gray-200 text-sm",
                    children: ["Explore ", t.name]
                })]
            })]
        })
    })
});

const c = [{
    href: "/Extract",
    name: "Extract",
    category_id: "1",
    imageUrl: "/ross.WEBP"
}, {
    href: "/Static",
    name: "Static-Sift",
    category_id: "2",
    imageUrl: "/static.jpg"
}, {
    href: "/Frozen",
    name: "Frozen-Sift",
    category_id: "3",
    imageUrl: "/frozen.jpg"
}, {
    href: "/Dry",
    name: "Dry-Sift",
    category_id: "4",
    imageUrl: "/dry-hash.jpg"
}, {
    href: "/Weed",
    name: "Weed",
    category_id: "5",
    imageUrl: "/fleur.jpg"
}];

const g = () => {
    const {fetchProductsByCategory: t} = l();
    const i = a => {
        t(a);
    };
    
    return e.jsx("div", {
        className: "min-h-screen text-white",
        children: e.jsxs("div", {
            className: "container mx-auto px-4 py-12",
            children: [e.jsx(r.h1, {
                className: "text-4xl fo md:text-5xl lg:text-6xl font-extrabold text-center mb-5 bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-pink-300 font-custom",
                initial: {
                    opacity: 0,
                    y: -30
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                transition: {
                    duration: 1,
                    ease: "easeOut"
                },
                children: "Explorez Nos Catégories"
            }), e.jsx(r.div, {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                transition: {
                    duration: .8,
                    delay: .4
                },
                children: c.map((a, o) => e.jsx(r.div, {
                    className: "bg-gray-700 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300",
                    initial: {
                        opacity: 0,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    transition: {
                        delay: o * .1,
                        duration: .5
                    },
                    whileHover: {
                        y: -5
                    },
                    whileTap: {
                        scale: .95
                    },
                    children: e.jsx(n, {
                        category: a,
                        onClick: () => i(a.category_id)
                    })
                }, a.category_id))
            })]
        })
    });
};

export {g as default};
