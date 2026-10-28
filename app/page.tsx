"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Award,
  Bath,
  CheckCircle2,
  Clock,
  Droplets,
  Flower2,
  MapPin,
  Mail,
  Menu as MenuIcon,
  MessageCircle,
  Minus,
  ParkingCircle,
  Phone,
  Plus,
  ShieldCheck,
  Snowflake,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wine,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Local data. Everything below is hardcoded on purpose (no backend). */
/* Room names, menu items and copy are sample content: edit freely.   */
/* ------------------------------------------------------------------ */

const display = "font-[family-name:var(--font-display)]";

const NAV = [
  { id: "rooms", label: "Rooms" },
  { id: "amenities", label: "Amenities" },
  { id: "heritage", label: "Heritage" },
  { id: "inquiry", label: "Contact" },
];

const ROOM_FEATURES: { icon: LucideIcon; label: string }[] = [
  { icon: Zap, label: "24-hour stable power" },
  { icon: Droplets, label: "Hot and cold water" },
  { icon: Snowflake, label: "Air conditioning" },
  { icon: Bath, label: "Private bathroom" },
];

type Room = {
  id: string;
  name: string;
  blurb: string;
  sleeps: string;
  image: string;
  alt: string;
};

const ROOMS: Room[] = [
  {
    id: "standard",
    name: "Standard Room",
    blurb: "Double bed, deep blue drapes and a bright window. Simple, clean and quiet.",
    sleeps: "2 guests",
    image: "/images/room-blue.jpg",
    alt: "Double bed with a floral blue cover and blue curtains",
  },
  {
    id: "comfort",
    name: "Comfort Room",
    blurb: "A double bed dressed with towel swans, patterned curtains and plenty of daylight.",
    sleeps: "2 guests",
    image: "/images/room-swans.jpg",
    alt: "Bed with two towel swans and Country Lodge pillows",
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    blurb: "Corner windows with sheer curtains, a patchwork quilt and a bedside cabinet.",
    sleeps: "2 guests",
    image: "/images/room-patchwork.jpg",
    alt: "Room with a patchwork quilt and two large windows",
  },
  {
    id: "executive",
    name: "Executive Room",
    blurb: "Extra floor space with a writing desk and mirror, good for a working stay.",
    sleeps: "2 guests",
    image: "/images/room-executive.jpg",
    alt: "Room with a patchwork bed, desk and framed mirror",
  },
];

const MENU: Record<string, { name: string; note: string }[]> = {
  Ghanaian: [
    { name: "Jollof rice with grilled chicken", note: "Smoky party-style rice, salad and fried plantain" },
    { name: "Banku with grilled tilapia", note: "Fresh tilapia, pepper sauce, onions and tomato" },
    { name: "Fufu with light soup", note: "Goat or chicken, slow-cooked with local spices" },
    { name: "Fried yam and kelewele", note: "Spiced plantain on the side" },
  ],
  International: [
    { name: "Szechuan chicken", note: "Tender chicken in a hot, savoury Szechuan sauce" },
    { name: "Chicken fried rice", note: "Wok-fried with vegetables and egg" },
    { name: "Club sandwich and chips", note: "Toasted, layered and served hot" },
    { name: "Chicken and chips", note: "Crisp-fried with pepper dip" },
  ],
  Drinks: [
    { name: "Cold beer and stout", note: "Served at the Wood Bar" },
    { name: "Soft drinks and water", note: "Chilled, by the bottle" },
    { name: "Fresh fruit juice", note: "Pineapple, orange or watermelon" },
    { name: "Wine and spirits", note: "Ask the bar for what is in stock" },
  ],
};

const TIMELINE = [
  {
    tag: "The place",
    title: "A calm stop off the main road",
    text: "Country Lodge sits on Avaga Road in Nsawam, just outside the busy town centre and less than an hour from Accra.",
  },
  {
    tag: "The guests",
    title: "Host to dignitaries",
    text: "Valentine Strasser, former head of state of Sierra Leone, is among the well-known guests the lodge has welcomed.",
  },
  {
    tag: "The community",
    title: "The Wood Bar becomes a meeting point",
    text: "Under timber and thatch, neighbours gather to watch the match, share a drink and make connections.",
  },
  {
    tag: "2024",
    title: "Best 1-Star Hotel, Eastern Region",
    text: "Named Best 1-Star Hotel at the 2024 Eastern Regional Tourism Awards.",
  },
];

const CONTACT = {
  phoneDisplay: "+233 24 466 3125",
  phoneTel: "+233244663125",
  whatsapp: "https://wa.me/233206424760",
  whatsappDisplay: "+233 20 642 4760",
  email: "countrylodgensawam@gmail.com",
  addressLines: ["Avaga Road, off the Kumasi-Accra Road", "Nsawam, Eastern Region, Ghana"],
  hours: "Open daily, from morning until late night",
  hoursDetail: "Typically 8:00 AM to 11:30 PM on weekdays, and later on busy weekends for the VIP Lounge and pool events.",
};

const HERO_BARS = [38, 52, 44, 68, 56, 80, 62, 90, 74, 58, 84, 66, 48, 60, 42, 34];

/* ------------------------------------------------------------------ */
/* Smooth scroll helper (Lenis instance lives at module level)        */
/* ------------------------------------------------------------------ */

let lenis: Lenis | null = null;

function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/* ------------------------------------------------------------------ */
/* Small shared components                                            */
/* ------------------------------------------------------------------ */

function SpotCard({
  children,
  className = "",
  glow = "rgba(217,119,6,0.16)",
}: {
  children: ReactNode;
  className?: string;
  glow?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={onMove} className={`group relative overflow-hidden ${className}`}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(360px circle at var(--x, 50%) var(--y, 50%), ${glow}, transparent 65%)`,
        }}
      />
    </div>
  );
}

function Modal({
  open,
  onClose,
  label,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-[#052e16]/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        data-lenis-prevent
        className={`modal-in relative max-h-[92vh] w-full ${maxWidth} overflow-y-auto rounded-t-3xl bg-[#faf6ec] shadow-2xl sm:rounded-2xl`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#14532d] shadow transition hover:bg-white"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

function AmberButton({
  children,
  onClick,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full bg-[#d97706] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-900/20 transition hover:bg-[#b45309] active:scale-[0.98] ${className}`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Navigation (limelight style)                                       */
/* ------------------------------------------------------------------ */

function Nav({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const [beam, setBeam] = useState({ left: 0, width: 0, show: false });
  const listRef = useRef<HTMLUListElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const place = () => {
      const list = listRef.current;
      const el = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
      if (list && el) setBeam({ left: el.offsetLeft, width: el.offsetWidth, show: true });
      else setBeam((b) => ({ ...b, show: false }));
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    goTo(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-[#14532d]/95 shadow-lg backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            go("top");
          }}
          aria-label="Country Lodge, back to top"
        >
          <Image
            src="/images/logo.jpg"
            alt="Country Lodge, relax naturally"
            width={442}
            height={333}
            className="h-12 w-auto mix-blend-screen"
          />
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul ref={listRef} className="relative flex items-center">
            {NAV.map((item) => (
              <li key={item.id} data-id={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.id);
                  }}
                  className={`flex h-16 items-center px-5 text-sm font-medium transition-colors hover:bg-white/5 hover:text-white ${
                    active === item.id ? "text-white" : "text-green-100/80"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 h-full"
              style={{
                width: beam.width,
                transform: `translateX(${beam.left}px)`,
                opacity: beam.show ? 1 : 0,
                transition: "transform .45s cubic-bezier(.4,0,.2,1), width .45s, opacity .3s",
              }}
            >
              <span className="absolute left-3 right-3 top-0 h-[3px] rounded-b-full bg-[#f59e0b] shadow-[0_0_14px_3px_rgba(245,158,11,0.7)]" />
              <span
                className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-[#f59e0b]/30 to-transparent"
                style={{ clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)" }}
              />
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <AmberButton onClick={() => go("inquiry")} className="hidden px-5 py-2.5 sm:inline-flex">
            Book a Room
          </AmberButton>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-white md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="drawer-in border-t border-white/10 bg-[#14532d] px-4 pb-5 pt-2 md:hidden">
          <ul>
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.id);
                  }}
                  className={`block border-b border-white/10 py-3.5 text-base ${
                    active === item.id ? "text-[#fbbf24]" : "text-green-50"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <AmberButton onClick={() => go("inquiry")} className="mt-4 w-full">
            Book a Room
          </AmberButton>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero (gradient bar layout)                                         */
/* ------------------------------------------------------------------ */

function Hero({ onMenu }: { onMenu: () => void }) {
  const root = useRef<HTMLElement>(null);
  const bars = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-bar", { scaleY: 0, transformOrigin: "bottom", duration: 1.1, stagger: 0.05 })
        .from(".hero-word", { yPercent: 110, duration: 0.8, stagger: 0.035 }, "-=0.7")
        .from(".hero-fade", { opacity: 0, y: 14, duration: 0.6, stagger: 0.1 }, "-=0.4");

      gsap.to(bars.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const slogan = "A peaceful retreat where warm Ghanaian hospitality meets quiet countryside calm.";

  return (
    <section ref={root} id="top" className="relative isolate min-h-[100svh] overflow-hidden bg-[#052e16]">
      <Image
        src="/images/lodge-exterior.jpg"
        alt="Country Lodge building beside its swimming pool"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#052e16] via-[#14532d]/85 to-[#14532d]/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#052e16] via-transparent to-[#052e16]/50" />

      <div ref={bars} aria-hidden className="absolute inset-x-0 bottom-0 flex h-[46%] items-end gap-1 px-1 sm:gap-2 sm:px-2">
        {HERO_BARS.map((h, i) => (
          <div
            key={i}
            className="hero-bar flex-1 rounded-t-md bg-gradient-to-t from-[#14532d]/0 via-[#d97706]/25 to-[#f59e0b]/80"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 pb-24 pt-28 sm:px-6">
        <p className="hero-fade mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/40 bg-black/25 px-4 py-1.5 text-xs font-medium text-amber-200 backdrop-blur sm:text-sm">
          <Award className="h-4 w-4" />
          Best 1-Star Hotel, 2024 Eastern Regional Tourism Awards
        </p>

        <h1 className={`${display} max-w-3xl text-[2.35rem] font-medium leading-[1.08] text-white sm:text-5xl lg:text-[3.6rem]`}>
          {slogan.split(" ").map((w, i) => (
            <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              <span className="hero-word inline-block">{w}</span>
            </span>
          ))}
        </h1>

        <p className="hero-fade mt-5 max-w-xl text-base text-green-50/90 sm:text-lg">
          Rooms, a pool, the Wood Bar and a kitchen, on Avaga Road in Nsawam. Relax naturally.
        </p>

        <div className="hero-fade mt-8 flex flex-col gap-3 sm:flex-row">
          <AmberButton onClick={() => goTo("rooms")} className="px-7 py-3.5">
            Explore Accommodations
          </AmberButton>
          <button
            type="button"
            onClick={onMenu}
            className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
          >
            View Dining Menu
          </button>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section aria-label="Why guests trust us" className="border-b border-[#14532d]/10 bg-[#f3ecd9]">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 md:grid-cols-3">
        <div className="flex items-start gap-3">
          <Award className="mt-0.5 h-6 w-6 shrink-0 text-[#d97706]" />
          <div>
            <p className="font-semibold text-[#14532d]">Best 1-Star Hotel, 2024</p>
            <p className="text-sm text-[#44403c]">Eastern Regional Tourism Awards</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-[#d97706]" />
          <div>
            <p className="font-semibold text-[#14532d]">1-Star Licensed Hotel</p>
            <p className="text-sm text-[#44403c]">Officially classified and licensed</p>
          </div>
        </div>
        <a
          href={CONTACT.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 transition hover:opacity-80"
        >
          <MessageCircle className="mt-0.5 h-6 w-6 shrink-0 text-[#d97706]" />
          <div>
            <p className="font-semibold text-[#14532d]">Book on WhatsApp</p>
            <p className="text-sm text-[#44403c]">{CONTACT.whatsappDisplay}</p>
          </div>
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Amenities (bento grid)                                             */
/* ------------------------------------------------------------------ */

const PRACTICALITIES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Wifi, title: "Free Wi-Fi", text: "Stay connected while you rest or work." },
  { icon: ParkingCircle, title: "Private parking", text: "A spacious lot for guests and event traffic." },
  { icon: ShieldCheck, title: "24-hour security", text: "Perimeter security around the clock." },
];

function Amenities({ onMenu }: { onMenu: () => void }) {
  return (
    <section id="amenities" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="max-w-2xl">
        <h2 className={`${display} text-3xl font-medium text-[#14532d] sm:text-4xl`}>
          Everything you need is on the grounds
        </h2>
        <p className="mt-3 text-[#44403c]">
          Swim, eat, unwind or watch the game without leaving the lodge.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:auto-rows-[minmax(200px,auto)] md:grid-cols-6">
        <SpotCard className="min-h-[360px] rounded-3xl bg-[#14532d] text-white md:col-span-3 md:row-span-2">
          <Image
            src="/images/pool-aerial.jpg"
            alt="Swimming pool lit up at night with a wooden deck"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#052e16] via-[#052e16]/40 to-transparent" />
          <div className="relative z-20 flex h-full min-h-[360px] flex-col justify-end p-6 sm:p-8">
            <Waves className="mb-3 h-8 w-8 text-[#fbbf24]" />
            <h3 className={`${display} text-2xl font-medium`}>Central swimming pool</h3>
            <p className="mt-2 max-w-sm text-green-50/90">
              Cool off on weekends, host an event or join a pool party. The deck stays lit after dark.
            </p>
          </div>
        </SpotCard>

        <SpotCard className="min-h-[240px] rounded-3xl bg-[#451a03] text-amber-50 md:col-span-3" glow="rgba(251,191,36,0.2)">
          <Image
            src="/images/wood-staircase.jpg"
            alt="Curved timber staircase with steel handrail"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover opacity-60 transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#451a03] via-[#451a03]/80 to-transparent" />
          <div className="relative z-20 flex h-full min-h-[240px] flex-col justify-end p-6 sm:p-8">
            <Wine className="mb-3 h-7 w-7 text-[#fbbf24]" />
            <h3 className={`${display} text-xl font-medium sm:text-2xl`}>The Wood Bar and VIP Lounge</h3>
            <p className="mt-2 max-w-md text-amber-100/90">
              Watch the match, meet people from the community and network over a drink.
            </p>
          </div>
        </SpotCard>

        <SpotCard className="rounded-3xl border border-[#14532d]/10 bg-white md:col-span-3">
          <div className="relative z-20 flex h-full flex-col justify-between gap-5 p-6 sm:p-8">
            <div>
              <UtensilsCrossed className="mb-3 h-7 w-7 text-[#d97706]" />
              <h3 className={`${display} text-xl font-medium text-[#14532d] sm:text-2xl`}>On-site dining</h3>
              <p className="mt-2 text-[#44403c]">
                Fresh local ingredients in Ghanaian dishes, plus international favourites like Szechuan chicken.
              </p>
            </div>
            <button
              type="button"
              onClick={onMenu}
              className="w-fit rounded-full border border-[#14532d]/30 px-5 py-2 text-sm font-semibold text-[#14532d] transition hover:bg-[#14532d] hover:text-white"
            >
              View dining menu
            </button>
          </div>
        </SpotCard>

        <SpotCard className="rounded-3xl bg-[#dfe9d6] md:col-span-2" glow="rgba(20,83,45,0.14)">
          <div className="relative z-20 p-6 sm:p-8">
            <Flower2 className="mb-3 h-7 w-7 text-[#14532d]" />
            <h3 className={`${display} text-xl font-medium text-[#14532d]`}>Wellness massage parlor</h3>
            <p className="mt-2 text-[#365314]">A dedicated space where guests can relax their body after a long day.</p>
          </div>
        </SpotCard>

        <SpotCard className="rounded-3xl border border-[#14532d]/10 bg-[#f3ecd9] md:col-span-4">
          <div className="relative z-20 grid gap-6 p-6 sm:grid-cols-3 sm:p-8">
            {PRACTICALITIES.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon className="mb-3 h-6 w-6 text-[#d97706]" />
                <h3 className="font-semibold text-[#14532d]">{title}</h3>
                <p className="mt-1 text-sm text-[#44403c]">{text}</p>
              </div>
            ))}
          </div>
        </SpotCard>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Accommodations (spotlight card grid)                               */
/* ------------------------------------------------------------------ */

function Rooms({ onInquire }: { onInquire: (r: Room) => void }) {
  return (
    <section id="rooms" className="bg-[#f3ecd9] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className={`${display} text-3xl font-medium text-[#14532d] sm:text-4xl`}>Rooms for a restful night</h2>
          <p className="mt-3 text-[#44403c]">
            Every room comes with the same essentials, so you can choose by look and space.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {ROOMS.map((room) => (
            <SpotCard
              key={room.id}
              className="flex flex-col rounded-3xl border border-[#14532d]/10 bg-white shadow-sm transition-shadow duration-300 hover:border-[#d97706]/50 hover:shadow-xl"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.alt}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="relative z-20 flex flex-1 flex-col p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className={`${display} text-xl font-medium text-[#14532d]`}>{room.name}</h3>
                  <span className="text-xs text-[#78716c]">{room.sleeps}</span>
                </div>
                <p className="mt-2 text-sm text-[#44403c]">{room.blurb}</p>
                <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-[#292524]">
                  {ROOM_FEATURES.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-1.5">
                      <Icon className="h-4 w-4 shrink-0 text-[#d97706]" />
                      {label}
                    </li>
                  ))}
                </ul>
                <AmberButton onClick={() => onInquire(room)} className="mt-5 w-full">
                  Inquire Rates
                </AmberButton>
              </div>
            </SpotCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Heritage timeline                                                  */
/* ------------------------------------------------------------------ */

function Heritage() {
  const track = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tl-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: { trigger: track.current, start: "top 65%", end: "bottom 65%", scrub: true },
        },
      );
    }, track);
    return () => ctx.revert();
  }, []);

  return (
    <section id="heritage" className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-16">
      <div>
        <h2 className={`${display} text-3xl font-medium text-[#14532d] sm:text-4xl`}>A lodge with a story</h2>
        <p className="mt-3 max-w-lg text-[#44403c]">
          From famous guests to an award in 2024, Country Lodge has built its name one stay at a time.
        </p>

        <ol ref={track} className="relative mt-10">
          <span aria-hidden className="absolute bottom-2 left-[11px] top-2 w-[2px] bg-[#14532d]/15" />
          <span aria-hidden className="tl-fill absolute bottom-2 left-[11px] top-2 w-[2px] bg-[#d97706]" />
          {TIMELINE.map((t) => (
            <li key={t.title} className="relative pb-10 pl-10 last:pb-0">
              <span className="absolute left-0 top-1 grid h-6 w-6 place-items-center rounded-full border-2 border-[#d97706] bg-[#faf6ec]">
                <span className="h-2 w-2 rounded-full bg-[#14532d]" />
              </span>
              <p className="text-sm font-semibold text-[#d97706]">{t.tag}</p>
              <h3 className={`${display} mt-0.5 text-xl font-medium text-[#14532d]`}>{t.title}</h3>
              <p className="mt-1.5 max-w-md text-[#44403c]">{t.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="relative min-h-[360px] overflow-hidden rounded-3xl lg:sticky lg:top-24 lg:h-[560px] lg:self-start">
        <Image
          src="/images/courtyard.jpg"
          alt="Lodge courtyard with a checkered lawn, a gazebo and green hills behind"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Booking inquiry form                                               */
/* ------------------------------------------------------------------ */

type FormState = {
  name: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  whatsapp: string;
  phone: string;
  email: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  checkIn: "",
  checkOut: "",
  guests: 2,
  whatsapp: "",
  phone: "",
  email: "",
  notes: "",
};

const inputCls =
  "w-full rounded-xl border border-[#14532d]/20 bg-white px-4 py-3 text-base text-[#1c1917] placeholder:text-[#a8a29e] transition focus:border-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#d97706]/30";

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#14532d]">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-700">{error}</span>}
    </label>
  );
}

function Inquiry({
  roomType,
  setRoomType,
  onSubmitted,
}: {
  roomType: string;
  setRoomType: (v: string) => void;
  onSubmitted: (summary: { name: string; room: string; checkIn: string; checkOut: string }) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
  }, []);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!form.checkIn) next.checkIn = "Choose a check-in date.";
    if (!form.checkOut) next.checkOut = "Choose a check-out date.";
    else if (form.checkIn && form.checkOut <= form.checkIn) next.checkOut = "Check-out must be after check-in.";
    if (!form.whatsapp.trim() && !form.phone.trim() && !form.email.trim())
      next.phone = "Add a WhatsApp number, phone number or email.";
    setErrors(next);
    if (Object.keys(next).length) return;

    // Simulated submission: swap this block for a real request later.
    onSubmitted({
      name: form.name.trim(),
      room: roomType || "Any room",
      checkIn: form.checkIn,
      checkOut: form.checkOut,
    });
    setForm(EMPTY_FORM);
    setRoomType("");
    setErrors({});
  };

  return (
    <section id="inquiry" className="bg-[#14532d] py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:gap-14">
        <div className="relative min-h-[280px] overflow-hidden rounded-3xl lg:col-span-2 lg:min-h-0">
          <Image
            src="/images/pool-night-bar.jpg"
            alt="Pool and thatched Wood Bar lit up in the evening"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#052e16] via-[#052e16]/30 to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-6 text-white sm:p-8">
            <h2 className={`${display} text-3xl font-medium sm:text-4xl`}>Tell us when you are coming</h2>
            <p className="mt-3 text-green-50/90">
              Send your dates and the lodge will reply with room availability and rates.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur transition hover:bg-white/25">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a href={`tel:${CONTACT.phoneTel}`} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur transition hover:bg-white/25">
                <Phone className="h-4 w-4" /> {CONTACT.phoneDisplay}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur transition hover:bg-white/25">
                <Mail className="h-4 w-4" /> Email
              </a>
            </div>
          </div>
        </div>

        <form
          onSubmit={submit}
          noValidate
          className="rounded-3xl bg-[#faf6ec] p-6 shadow-2xl sm:p-8 lg:col-span-3"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Full name" error={errors.name}>
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Ama Mensah"
                  autoComplete="name"
                />
              </Field>
            </div>

            <Field label="Check-in" error={errors.checkIn}>
              <input
                type="date"
                min={today}
                className={inputCls}
                value={form.checkIn}
                onChange={(e) => set("checkIn", e.target.value)}
              />
            </Field>
            <Field label="Check-out" error={errors.checkOut}>
              <input
                type="date"
                min={form.checkIn || today}
                className={inputCls}
                value={form.checkOut}
                onChange={(e) => set("checkOut", e.target.value)}
              />
            </Field>

            <Field label="Room type">
              <select className={inputCls} value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                <option value="">Any room</option>
                {ROOMS.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </Field>

            <div>
              <span className="mb-1.5 block text-sm font-medium text-[#14532d]">Number of guests</span>
              <div className="flex items-center justify-between rounded-xl border border-[#14532d]/20 bg-white px-2 py-1.5">
                <button
                  type="button"
                  aria-label="Fewer guests"
                  disabled={form.guests <= 1}
                  onClick={() => set("guests", Math.max(1, form.guests - 1))}
                  className="grid h-10 w-10 place-items-center rounded-lg text-[#14532d] transition hover:bg-[#14532d]/10 disabled:opacity-30"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-base font-medium" aria-live="polite">
                  {form.guests}
                </span>
                <button
                  type="button"
                  aria-label="More guests"
                  disabled={form.guests >= 10}
                  onClick={() => set("guests", Math.min(10, form.guests + 1))}
                  className="grid h-10 w-10 place-items-center rounded-lg text-[#14532d] transition hover:bg-[#14532d]/10 disabled:opacity-30"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Field label="WhatsApp">
              <div className="relative">
                <MessageCircle className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78716c]" />
                <input
                  type="tel"
                  className={`${inputCls} pl-10`}
                  value={form.whatsapp}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  placeholder="024 000 0000"
                  autoComplete="tel"
                />
              </div>
            </Field>
            <Field label="Phone">
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78716c]" />
                <input
                  type="tel"
                  className={`${inputCls} pl-10`}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="020 000 0000"
                />
              </div>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Email" error={errors.phone}>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78716c]" />
                  <input
                    type="email"
                    className={`${inputCls} pl-10`}
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </Field>
              <p className="mt-1 text-xs text-[#78716c]">Fill in at least one: WhatsApp, phone or email.</p>
            </div>
            <div className="sm:col-span-2">
              <Field label="Notes (optional)">
                <textarea
                  rows={3}
                  className={inputCls}
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Arrival time, an event, anything we should know"
                />
              </Field>
            </div>
          </div>

          <AmberButton type="submit" className="mt-6 w-full py-3.5 text-base">
            Send inquiry
          </AmberButton>
        </form>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="bg-[#052e16] text-green-100/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Image
            src="/images/logo.jpg"
            alt="Country Lodge, relax naturally"
            width={442}
            height={333}
            className="h-20 w-auto mix-blend-screen"
          />
          <p className="mt-3 text-sm">1-Star Licensed Hotel. Winner, Best 1-Star Hotel, 2024 Eastern Regional Tourism Awards.</p>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-white">
            <Clock className="h-4 w-4 text-[#fbbf24]" />
            Hours
          </h3>
          <p className="text-sm font-medium text-white">{CONTACT.hours}</p>
          <p className="mt-1 text-sm">{CONTACT.hoursDetail}</p>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-white">
            <MapPin className="h-4 w-4 text-[#fbbf24]" />
            Find us
          </h3>
          <address className="text-sm not-italic leading-relaxed">
            Country Lodge
            <br />
            {CONTACT.addressLines[0]}
            <br />
            {CONTACT.addressLines[1]}
          </address>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <a href={`tel:${CONTACT.phoneTel}`} className="transition hover:text-white">{CONTACT.phoneDisplay}</a>
            </li>
            <li>
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">WhatsApp us</a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="break-all transition hover:text-white">{CONTACT.email}</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-white">Explore</h3>
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(n.id);
                  }}
                  className="transition hover:text-white"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 text-xs sm:flex-row sm:justify-between sm:px-6">
          <p>© 2026 Country Lodge in Nsawam. All rights reserved.</p>
          <p>Website by Great Light Group</p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function Page() {
  const [active, setActive] = useState("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [roomType, setRoomType] = useState("");
  const [menuTab, setMenuTab] = useState<keyof typeof MENU>("Ghanaian");
  const [success, setSuccess] = useState<null | { name: string; room: string; checkIn: string; checkOut: string }>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeRoom = useCallback(() => setActiveRoom(null), []);
  const closeSuccess = useCallback(() => setSuccess(null), []);

  // Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays in sync.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis?.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // Track which section is in view for the limelight nav.
  useEffect(() => {
    const ids = ["top", ...NAV.map((n) => n.id)];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const askAboutRoom = (room: Room) => {
    setRoomType(room.name);
    setActiveRoom(null);
    setTimeout(() => goTo("inquiry"), 60);
  };

  const fmt = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <main>
      <Nav active={active} />
      <Hero onMenu={() => setMenuOpen(true)} />
      <TrustBar />
      <Amenities onMenu={() => setMenuOpen(true)} />
      <Rooms onInquire={setActiveRoom} />
      <Heritage />
      <Inquiry roomType={roomType} setRoomType={setRoomType} onSubmitted={setSuccess} />
      <Footer />

      {/* Room rates modal */}
      <Modal open={!!activeRoom} onClose={closeRoom} label={activeRoom ? `${activeRoom.name} rates` : "Room rates"}>
        {activeRoom && (
          <div>
            <div className="relative aspect-[3/2] w-full">
              <Image src={activeRoom.image} alt={activeRoom.alt} fill sizes="512px" className="object-cover" />
            </div>
            <div className="p-6">
              <h3 className={`${display} text-2xl font-medium text-[#14532d]`}>{activeRoom.name}</h3>
              <p className="mt-2 text-[#44403c]">{activeRoom.blurb}</p>
              <ul className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {ROOM_FEATURES.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#d97706]" />
                    {label}
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-xl bg-[#f3ecd9] p-4 text-sm text-[#44403c]">
                Rates depend on your dates. Send an inquiry and the lodge will reply with the price for your stay.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <AmberButton onClick={() => askAboutRoom(activeRoom)} className="flex-1">
                  Ask about this room
                </AmberButton>
                <button
                  type="button"
                  onClick={closeRoom}
                  className="flex-1 rounded-full border border-[#14532d]/30 px-6 py-3 text-sm font-semibold text-[#14532d] transition hover:bg-[#14532d]/5"
                >
                  Keep browsing
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Dining menu modal */}
      <Modal open={menuOpen} onClose={closeMenu} label="Dining menu" maxWidth="max-w-xl">
        <div className="p-6 sm:p-8">
          <h3 className={`${display} pr-10 text-2xl font-medium text-[#14532d]`}>Dining menu</h3>
          <p className="mt-1 text-sm text-[#44403c]">A taste of what the kitchen and bar serve. Ask staff for today&apos;s prices.</p>
          <div role="tablist" className="mt-5 flex gap-2">
            {Object.keys(MENU).map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={menuTab === c}
                onClick={() => setMenuTab(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  menuTab === c ? "bg-[#14532d] text-white" : "bg-[#14532d]/10 text-[#14532d] hover:bg-[#14532d]/20"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <ul className="mt-5 divide-y divide-[#14532d]/10">
            {MENU[menuTab].map((item) => (
              <li key={item.name} className="py-3.5">
                <p className="font-semibold text-[#1c1917]">{item.name}</p>
                <p className="text-sm text-[#57534e]">{item.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </Modal>

      {/* Success modal */}
      <Modal open={!!success} onClose={closeSuccess} label="Inquiry received">
        {success && (
          <div className="p-8 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-[#14532d]" />
            <h3 className={`${display} mt-4 text-2xl font-medium text-[#14532d]`}>Inquiry Received Successfully!</h3>
            <p className="mt-2 text-[#44403c]">
              Thank you, {success.name}. The Country Lodge team will reply using the contact details you gave.
            </p>
            <dl className="mt-5 rounded-xl bg-[#f3ecd9] p-4 text-left text-sm">
              <div className="flex justify-between gap-4 py-1">
                <dt className="text-[#78716c]">Room</dt>
                <dd className="font-medium">{success.room}</dd>
              </div>
              <div className="flex justify-between gap-4 py-1">
                <dt className="text-[#78716c]">Check-in</dt>
                <dd className="font-medium">{fmt(success.checkIn)}</dd>
              </div>
              <div className="flex justify-between gap-4 py-1">
                <dt className="text-[#78716c]">Check-out</dt>
                <dd className="font-medium">{fmt(success.checkOut)}</dd>
              </div>
            </dl>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-[#14532d]/30 px-6 py-3 text-sm font-semibold text-[#14532d] transition hover:bg-[#14532d]/5"
            >
              <MessageCircle className="h-4 w-4" /> Message us on WhatsApp now
            </a>
            <AmberButton onClick={closeSuccess} className="mt-3 w-full">
              Done
            </AmberButton>
          </div>
        )}
      </Modal>
    </main>
  );
}
