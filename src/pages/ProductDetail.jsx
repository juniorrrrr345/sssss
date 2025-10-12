import {h as Q, s as A, i as U, k as q, c as J, f as K, l as Z, u as ee, r as o, j as e, m as r, O as te, S as ae, A as se, n as L} from "./index-Da6hjyVK.js";
import {u as ie} from "./useProductStore-IvwzBo2I.js";
import {a as re} from "./index-Cz1RZAAB.js";
import {u as ne} from "./useLinksStore-DNFEHnNp.js";
import {T as oe} from "./tag-BqOTbYF2.js";
import {C as le, a as ce} from "./chevron-right-BbUC7ez7.js";
import {P as V} from "./play-Cn2WeZQb.js";
import "./iconBase-B_2JjKJ7.js";

function de(s) {
    s.values.forEach(n => n.stop());
}

function k(s, n) {
    [...n].reverse().forEach(t => {
        const m = s.getVariant(t);
        m && A(s, m);
        s.variantChildren && s.variantChildren.forEach(h => {
            k(h, n);
        });
    });
}

function ue(s, n) {
    if (Array.isArray(n))
        return k(s, n);
    if (typeof n == "string")
        return k(s, [n]);
    A(s, n);
}

function me() {
    const s = new Set;
    const n = {
        subscribe(l) {
            return s.add(l),
            () => void s.delete(l);
        },
        start(l, t) {
            const m = [];
            return s.forEach(h => {
                m.push(Q(h, l, {
                    transitionOverride: t
                }));
            }),
            Promise.all(m);
        },
        set(l) {
            return s.forEach(t => {
                ue(t, l);
            });
        },
        stop() {
            s.forEach(l => {
                de(l);
            });
        },
        mount() {
            return () => {
                n.stop();
            };
        }
    };
    return n;
}

function he() {
    const s = U(me);
    return q(s.mount, []),
    s;
}

const R = he;

/**
 * @license lucide-react v0.435.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $ = J("Info", [["circle", {
    cx: "12",
    cy: "12",
    r: "10",
    key: "1mglay"
}], ["path", {
    d: "M12 16v-4",
    key: "1dtifu"
}], ["path", {
    d: "M12 8h.01",
    key: "e9boi3"
}]]);

const pe = s => {
    const n = o.useRef(null);
    const l = o.useRef(null);
    const t = o.useRef(null);
    const m = 50;
    const h = 50;
    
    return {
        onTouchStart: c => {
            l.current = null;
            n.current = c.targetTouches[0].clientX;
            t.current = c.targetTouches[0].clientY;
        },
        onTouchMove: c => {
            l.current = c.targetTouches[0].clientX;
            n.current && Math.abs(c.targetTouches[0].clientY - t.current) > h && (l.current = null);
        },
        onTouchEnd: () => {
            if (!n.current || !l.current)
                return;
            const c = n.current - l.current;
            const f = c > m;
            const T = c < -50;
            (f || T) && ("vibrate" in navigator && navigator.vibrate(30),
            s(f ? "next" : "prev"));
        }
    };
};

const Pe = () => {
    var I;
    const {id: s} = K();
    const n = Z();
    ee();
    const {fetchProductById: l} = ie();
    const [t,m] = o.useState(((I = n.state) == null ? void 0 : I.product) || null);
    const [h,b] = o.useState(!t);
    const [y,S] = o.useState(null);
    const [c,f] = o.useState(0);
    const [T,M] = o.useState(null);
    const [v,P] = o.useState(null);
    const [fe,B] = o.useState(!1);
    const [xe,ge] = o.useState(!0);
    const [be,D] = o.useState(0);
    const [C,F] = o.useState(!1);
    const {links: j, fetchLinks: E} = ne();
    const w = R();
    R();
    const H = o.useRef(null);
    const g = o.useRef(null);
    
    o.useEffect(() => {
        E();
        w.start({
            opacity: 1,
            y: 0
        });
        const i = () => {
            if (!g.current)
                return;
            const d = g.current.scrollTop;
            D(d);
            F(d > 100);
        };
        const a = g.current;
        if (a)
            return a.addEventListener("scroll", i),
            () => a.removeEventListener("scroll", i);
    }, [E, w]);
    
    o.useEffect(() => {
        t || (async () => {
            try {
                b(!0);
                const a = await l(s);
                m(a);
            } catch {
                S("Failed to load product. Please try again later.");
            } finally {
                b(!1);
            }
        })();
    }, [s, t, l]);
    
    const z = o.useCallback(async i => {
        try {
            const a = document.createElement("video");
            a.crossOrigin = "anonymous";
            a.muted = !0;
            a.playsInline = !0;
            a.preload = "metadata";
            await new Promise((p, G) => {
                a.onloadedmetadata = p;
                a.onerror = G;
                a.src = i;
            });
            a.currentTime = 1;
            await new Promise(p => {
                a.onseeked = p;
            });
            const d = document.createElement("canvas");
            d.width = 160;
            d.height = 90;
            d.getContext("2d").drawImage(a, 0, 0, d.width, d.height);
            const x = d.toDataURL("image/jpeg", .7);
            P(x);
            B(!0);
        } catch (a) {
            console.error("Thumbnail generation failed:", a);
            P(null);
        }
    }, []);
    
    o.useEffect(() => {
        t != null && t.video && z(t.video);
    }, [t, z]);
    
    const N = o.useCallback(i => {
        if (!t)
            return;
        "vibrate" in navigator && navigator.vibrate(30);
        const a = [t.image1, t.image2, t.image3, t.image4, t.image5].filter(Boolean);
        const d = !!t.video;
        const u = a.length + (d ? 1 : 0);
        f(x => i === "next" ? (x + 1) % u : (x - 1 + u) % u);
    }, [t]);
    
    const O = () => {
        if (!t)
            return null;
        const i = [t.image1, t.image2, t.image3, t.image4, t.image5].filter(Boolean);
        const a = !!t.video;
        const d = i.length + (a ? 1 : 0);
        const u = pe(N);
        
        return e.jsxs(r.div, {
            className: "relative overflow-hidden rounded-2xl shadow-lg h-[40vh] sm:h-auto",
            initial: {
                opacity: 0,
                scale: .95
            },
            animate: {
                opacity: 1,
                scale: 1
            },
            transition: {
                duration: .3
            },
            ...u,
            children: [e.jsx("div", {
                className: "absolute top-3 left-0 right-0 z-20 flex justify-center",
                children: e.jsx("div", {
                    className: "flex gap-1.5 px-3 py-1.5 bg-black/30 backdrop-blur-md rounded-full",
                    children: Array.from({
                        length: d
                    }).map((x, p) => e.jsx(r.div, {
                        className: `h-1 rounded-full ${p === c ? "w-6 bg-pink-400" : "w-2 bg-white/40"}`,
                        initial: {
                            opacity: 0,
                            scale: .5
                        },
                        animate: {
                            opacity: 1,
                            scale: 1
                        },
                        transition: {
                            delay: p * .05
                        }
                    }, `indicator-${p}`))
                })
            }), e.jsx("div", {
                className: "w-full h-full",
                children: e.jsx(se, {
                    mode: "wait",
                    children: c < i.length ? e.jsxs(r.div, {
                        className: "w-full h-full",
                        initial: {
                            opacity: 0,
                            scale: 1.1
                        },
                        animate: {
                            opacity: 1,
                            scale: 1
                        },
                        exit: {
                            opacity: 0,
                            scale: .9
                        },
                        transition: {
                            duration: .3
                        },
                        children: [e.jsx("img", {
                            src: i[c],
                            alt: `${t.name} - image ${c + 1}`,
                            className: "w-full h-full object-cover touch-none select-none",
                            onClick: () => M(i[c]),
                            loading: "lazy"
                        }), e.jsx("div", {
                            className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"
                        })]
                    }, `img-${c}`) : a && c === d - 1 ? e.jsxs(r.div, {
                        className: "relative w-full h-full",
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
                        },
                        children: [e.jsxs("video", {
                            ref: H,
                            controls: !0,
                            playsInline: !0,
                            poster: v,
                            className: "w-full h-full object-cover",
                            onError: () => L.error("Erreur de lecture vidéo"),
                            children: [e.jsx("source", {
                                src: t.video,
                                type: "video/mp4"
                            }), "Your browser does not support the video tag."]
                        }), e.jsx("div", {
                            className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"
                        })]
                    }, "video") : null
                })
            }), e.jsx(r.button, {
                className: "absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 active:bg-black/70 rounded-full p-3 backdrop-blur-sm transition-all duration-200 text-white/90 shadow-lg",
                onClick: () => N("prev"),
                whileTap: {
                    scale: .9
                },
                children: e.jsx(le, {
                    size: 20
                })
            }), e.jsx(r.button, {
                className: "absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 active:bg-black/70 rounded-full p-3 backdrop-blur-sm transition-all duration-200 text-white/90 shadow-lg",
                onClick: () => N("next"),
                whileTap: {
                    scale: .9
                },
                children: e.jsx(ce, {
                    size: 20
                })
            }), Y()]
        });
    };
    
    const Y = () => {
        if (!t)
            return null;
        const i = [t.image1, t.image2, t.image3, t.image4, t.image5].filter(Boolean);
        const a = !!t.video;
        
        return e.jsx(r.div, {
            className: "absolute -bottom-3 left-0 right-0 flex justify-center px-4",
            initial: {
                opacity: 0,
                y: 20
            },
            animate: {
                opacity: 1,
                y: 0
            },
            transition: {
                delay: .2,
                duration: .3
            },
            children: e.jsxs("div", {
                className: "flex gap-2 py-2 mb-6 px-3 backdrop-blur-md rounded-full overflow-x-auto max-w-full no-scrollbar shadow-lg border border-white/10",
                children: [i.map((d, u) => e.jsx(r.button, {
                    onClick: () => {
                        f(u);
                        "vibrate" in navigator && navigator.vibrate(30);
                    },
                    whileTap: {
                        scale: .95
                    },
                    className: `w-12 h-12 flex-shrink-0 rounded-full overflow-hidden ${c === u ? "ring-2 ring-pink-400 ring-offset-1 ring-offset-black/50" : "ring-1 ring-white/20"}`,
                    children: e.jsx("img", {
                        src: d,
                        alt: `Thumbnail ${u + 1}`,
                        className: "object-cover w-full h-full",
                        loading: "lazy"
                    })
                }, `thumb-${u}`)), a && e.jsx(r.button, {
                    onClick: () => {
                        f(i.length);
                        "vibrate" in navigator && navigator.vibrate(30);
                    },
                    whileTap: {
                        scale: .95
                    },
                    className: `w-12 h-12 flex-shrink-0 rounded-full overflow-hidden ${c === i.length ? "ring-2 ring-pink-400 ring-offset-1 ring-offset-black/50" : "ring-1 ring-white/20"}`,
                    children: v ? e.jsxs("div", {
                        className: "relative w-full h-full",
                        children: [e.jsx("img", {
                            src: v,
                            alt: "Video thumbnail",
                            className: "object-cover w-full h-full"
                        }), e.jsx("div", {
                            className: "absolute inset-0 bg-black/30 flex items-center justify-center",
                            children: e.jsx(V, {
                                size: 14,
                                className: "text-pink-400"
                            })
                        })]
                    }) : e.jsx("div", {
                        className: "w-full h-full flex items-center justify-center bg-gray-800",
                        children: e.jsx(V, {
                            size: 14,
                            className: "text-pink-400"
                        })
                    })
                })]
            })
        });
    };
    
    const _ = () => t != null && t.prices ? e.jsx(r.div, {
        className: "flex flex-wrap gap-2.5",
        initial: {
            opacity: 0,
            y: 20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            delay: .4,
            duration: .3
        },
        children: t.prices.sort((i, a) => i.price - a.price).map((i, a) => e.jsxs(r.button, {
            whileTap: {
                scale: .95
            },
            className: "bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-pink-500/30 rounded-full px-4 py-2.5 active:bg-gray-800 shadow-lg shadow-pink-500/5",
            initial: {
                opacity: 0,
                y: 20
            },
            animate: {
                opacity: 1,
                y: 0
            },
            transition: {
                delay: .1 * a,
                duration: .3
            },
            onClick: () => {
                "vibrate" in navigator && navigator.vibrate(30);
                L.success(`${i.gram} sélectionné`);
            },
            children: [e.jsx("span", {
                className: "text-gray-300 font-medium text-sm",
                children: i.gram.replace(/g$/i, "G")
            }), e.jsxs("span", {
                className: "text-pink-400 font-bold text-base ml-2",
                children: [i.price, "€"]
            })]
        }, i._id))
    }) : null;
    
    const W = () => t ? e.jsx(r.div, {
        className: "fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-white/10 shadow-lg",
        initial: {
            opacity: 0,
            y: -100
        },
        animate: {
            opacity: C ? 1 : 0,
            y: C ? 0 : -100
        },
        transition: {
            duration: .3
        },
        children: e.jsx("div", {
            className: "flex items-center justify-between px-4 py-3",
            children: e.jsx("div", {
                className: "flex items-center",
                children: e.jsx("h2", {
                    className: "text-white font-bold text-lg truncate max-w-[200px]",
                    children: t.name
                })
            })
        })
    }) : null;
    
    const X = () => e.jsx("div", {
        className: "min-h-screen  text-white py-4 px-4",
        children: e.jsx("div", {
            className: "max-w-4xl mx-auto",
            children: e.jsxs("div", {
                className: "bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700",
                children: [e.jsx("div", {
                    className: "h-[40vh] bg-gray-800 animate-pulse relative rounded-t-2xl overflow-hidden",
                    children: e.jsx("div", {
                        className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"
                    })
                }), e.jsxs("div", {
                    className: "p-5 space-y-4",
                    children: [e.jsx("div", {
                        className: "h-7 bg-gray-800 rounded-lg w-3/4 animate-pulse"
                    }), e.jsxs("div", {
                        className: "flex gap-2",
                        children: [e.jsx("div", {
                            className: "h-6 bg-gray-800 rounded-full w-24 animate-pulse"
                        }), e.jsx("div", {
                            className: "h-6 bg-gray-800 rounded-full w-20 animate-pulse"
                        })]
                    }), e.jsx("div", {
                        className: "h-20 bg-gray-800 rounded-lg w-full animate-pulse"
                    }), e.jsxs("div", {
                        className: "flex gap-2",
                        children: [e.jsx("div", {
                            className: "h-10 bg-gray-800 rounded-full w-20 animate-pulse"
                        }), e.jsx("div", {
                            className: "h-10 bg-gray-800 rounded-full w-24 animate-pulse"
                        }), e.jsx("div", {
                            className: "h-10 bg-gray-800 rounded-full w-16 animate-pulse"
                        })]
                    }), e.jsx("div", {
                        className: "h-12 bg-gray-800 rounded-xl w-full animate-pulse"
                    })]
                })]
            })
        })
    });
    
    return h ? X() : y || !t ? e.jsx("div", {
        className: "flex justify-center items-center min-h-screen bg-gray-900 px-4",
        children: e.jsx(r.div, {
            className: "text-center text-gray-400",
            initial: {
                opacity: 0,
                y: -20
            },
            animate: {
                opacity: 1,
                y: 0
            },
            children: y || "Produit non trouvé"
        })
    }) : e.jsxs(e.Fragment, {
        children: [e.jsx(te, {
            position: "bottom-center",
            toastOptions: {
                duration: 2e3,
                style: {
                    background: "#333",
                    color: "#fff",
                    fontSize: "14px",
                    borderRadius: "10px",
                    maxWidth: "90vw",
                    margin: "0 auto 20px",
                    padding: "10px 15px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                }
            }
        }), W(), e.jsx(r.div, {
            ref: g,
            className: "min-h-screen text-white py-4 px-4 sm:py-6 sm:px-6  bg-opacity-95 overflow-y-auto",
            initial: {
                opacity: 0
            },
            animate: {
                opacity: 1
            },
            transition: {
                duration: .3
            },
            children: e.jsx("div", {
                className: "max-w-4xl mx-auto pb-20",
                children: e.jsxs(r.div, {
                    className: "bg-gradient-to-b from-gray-800/90 to-gray-900/95 rounded-2xl shadow-2xl overflow-hidden border border-gray-700/80 backdrop-blur-sm",
                    initial: {
                        opacity: 0,
                        y: 20
                    },
                    animate: w,
                    transition: {
                        duration: .3
                    },
                    children: [O(), e.jsxs("div", {
                        className: "p-5 sm:p-6 space-y-5 mt-4",
                        children: [e.jsxs(r.div, {
                            className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3",
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: .2,
                                duration: .3
                            },
                            children: [e.jsxs("div", {
                                className: "flex flex-col gap-2",
                                children: [e.jsx("h2", {
                                    className: "text-xl sm:text-2xl font-bold text-white",
                                    children: t.name
                                }), t.farm && e.jsxs(r.span, {
                                    className: "text-sm font-medium px-3 py-1.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center self-start shadow-sm",
                                    whileTap: {
                                        scale: .95
                                    },
                                    children: [e.jsx($, {
                                        size: 14,
                                        className: "mr-1.5"
                                    }), "Farm: ", t.farm]
                                })]
                            }), e.jsxs("div", {
                                className: "flex flex-wrap gap-2",
                                children: [t.category && e.jsxs(r.span, {
                                    className: "text-xs font-medium px-3 py-1.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center shadow-sm",
                                    whileTap: {
                                        scale: .95
                                    },
                                    children: [e.jsx(oe, {
                                        size: 12,
                                        className: "mr-1"
                                    }), t.category]
                                }), t.thc && e.jsxs(r.span, {
                                    className: "text-xs font-medium px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center shadow-sm",
                                    whileTap: {
                                        scale: .95
                                    },
                                    children: [e.jsx("span", {
                                        className: "mr-1",
                                        children: "🍁"
                                    }), "THC: ", t.thc, "%"]
                                })]
                            })]
                        }), e.jsx(r.div, {
                            className: "bg-gray-800/50 rounded-xl p-4 border border-gray-700/50",
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: .3,
                                duration: .3
                            },
                            children: e.jsxs("p", {
                                className: "text-gray-300 text-sm sm:text-base leading-relaxed",
                                children: [e.jsx($, {
                                    size: 18,
                                    className: "inline-block mr-2 text-pink-400 mb-1"
                                }), t.description]
                            })
                        }), e.jsxs(r.div, {
                            className: "pt-2",
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: .35,
                                duration: .3
                            },
                            children: [e.jsxs("h3", {
                                className: "text-lg font-semibold text-white mb-3 flex items-center",
                                children: [e.jsx(ae, {
                                    size: 16,
                                    className: "mr-2 text-pink-400"
                                }), "Sélectionner la Quantité"]
                            }), _()]
                        }), e.jsx(r.div, {
                            className: "flex gap-4 pt-2",
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: .5,
                                duration: .3
                            },
                            children: e.jsxs(r.a, {
                                href: j == null ? void 0 : j.contact,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                whileTap: {
                                    scale: .98
                                },
                                onClick: () => {
                                    "vibrate" in navigator && navigator.vibrate(50);
                                },
                                className: "flex-1 flex items-center justify-center bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3.5 px-4 rounded-xl shadow-lg transition-all duration-300 font-medium hover:from-pink-600 hover:to-pink-700 active:from-pink-700 active:to-pink-800 text-base",
                                children: [e.jsx(re, {
                                    size: 18,
                                    className: "mr-2"
                                }), e.jsx("span", {
                                    children: "Commander Maintenant"
                                })]
                            })
                        })]
                    })]
                })
            })
        })]
    });
};

export {Pe as default};
