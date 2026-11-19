"use client";

/*
  Contact section with an animated wireframe globe.
  Based on the shadcn-style "contact-with-globe" component, adapted for aldy.ae:
  - Aldy's real contact details (passed in as props from lib/site.ts) – no placeholder content
  - the form has no server (static site): "Send on WhatsApp" opens WhatsApp with the message filled in,
    and "Send by email" opens the visitor's mail app
  - world map served from /geo/countries-110m.json (our own static file, not a third-party CDN)
  - light "desert sunrise" theme colours, no dark-mode classes; Dubai marker on the globe
  - respects prefers-reduced-motion
*/

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig, motion } from "motion/react";
import { ArrowRight, Mail, type LucideIcon } from "lucide-react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as d3 from "d3";
import { feature } from "topojson-client";
import type { GeometryCollection, GeometryObject, Topology } from "topojson-specification";
import type { GeoPermissibleObjects } from "d3";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

/* ------------------------------------------------------------------ */
/* Globe                                                               */
/* ------------------------------------------------------------------ */

interface GlobeMarker {
  /** [latitude, longitude] */
  coordinates: [number, number];
  label?: string;
}

interface GlobeWireframeProps {
  width?: number;
  height?: number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  graticuleColor?: string;
  graticuleOpacity?: number;
  sphereOutlineColor?: string;
  sphereOutlineWidth?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  rotateToLocation?: string | [number, number];
  rotateCities?: string[];
  rotationSpeed?: number;
  initialRotation?: [number, number];
  enableInteraction?: boolean;
  showGraticule?: boolean;
  startAsGlobe?: boolean;
  countryFillColor?: string;
  countryHoverColor?: string;
  variant?: "wireframe" | "wireframesolid" | "solid";
  scale?: number;
  backgroundColor?: string;
  /** URL of a world-atlas TopoJSON file */
  mapUrl?: string;
  markers?: GlobeMarker[];
  markerColor?: string;
}

interface GeoFeature {
  type: string;
  geometry: GeometryObject;
  properties: Record<string, unknown>;
}

interface WorldAtlasTopology extends Topology {
  objects: { countries: GeometryCollection };
}

interface CustomProjection extends d3.GeoProjection {
  alpha(value: number): CustomProjection;
  alpha(): number;
}

const cityCoordinates: Record<string, [number, number]> = {
  "san francisco": [37.7749, -122.4194],
  "new york": [40.7128, -74.006],
  london: [51.5074, -0.1278],
  tokyo: [35.6762, 139.6503],
  paris: [48.8566, 2.3522],
  moscow: [55.7558, 37.6176],
  dubai: [25.2048, 55.2708],
  singapore: [1.3521, 103.8198],
  sydney: [-33.8688, 151.2093],
  mumbai: [19.076, 72.8777],
  "los angeles": [34.0522, -118.2437],
  chicago: [41.8781, -87.6298],
};

function orthographicRaw(x: number, y: number): [number, number] {
  const cosy = Math.cos(y);
  return [cosy * Math.sin(x), Math.sin(y)];
}

function equirectangularRaw(lambda: number, phi: number): [number, number] {
  return [lambda, phi];
}

function interpolateProjection(
  raw0: (lambda: number, phi: number) => [number, number],
  raw1: (lambda: number, phi: number) => [number, number],
): CustomProjection {
  let t = 0;
  const createRawProjection =
    (alpha: number) =>
    (lambda: number, phi: number): [number, number] => {
      const [x0, y0] = raw0(lambda, phi);
      const [x1, y1] = raw1(lambda, phi);
      return [x0 + alpha * (x1 - x0), y0 + alpha * (y1 - y0)];
    };

  const projection = d3.geoProjection(createRawProjection(t)) as unknown as CustomProjection;

  const alphaMethod = ((value?: number): CustomProjection | number => {
    if (value !== undefined) {
      t = +value;
      const next = d3.geoProjection(createRawProjection(t)) as unknown as CustomProjection;
      if (projection.scale()) next.scale(projection.scale());
      if (projection.translate()) next.translate(projection.translate());
      if (projection.rotate()) next.rotate(projection.rotate());
      if (projection.precision()) next.precision(projection.precision());
      next.alpha = alphaMethod as CustomProjection["alpha"];
      return next;
    }
    return t;
  }) as CustomProjection["alpha"];

  projection.alpha = alphaMethod;
  return projection;
}

/** [lon, lat] rotation that centres the globe on a city name or [lat, lng] pair */
function rotationFor(location: string | [number, number] | undefined, fallback: [number, number]): [number, number] {
  if (!location) return fallback;
  const c = typeof location === "string" ? cityCoordinates[location.toLowerCase()] : location;
  return c ? [-c[1], -c[0]] : fallback;
}

export function GlobeWireframe({
  width,
  height,
  className = "aspect-square w-full max-w-150",
  strokeColor = "currentColor",
  strokeWidth = 1.0,
  graticuleColor = "currentColor",
  graticuleOpacity = 0.2,
  sphereOutlineColor = "currentColor",
  sphereOutlineWidth = 1,
  autoRotate = true,
  autoRotateSpeed = 0.5,
  rotateToLocation,
  rotateCities = [],
  rotationSpeed = 3000,
  initialRotation = [0, 0],
  enableInteraction = true,
  showGraticule = true,
  startAsGlobe = true,
  countryFillColor,
  countryHoverColor,
  variant = "wireframe",
  scale = 1,
  backgroundColor,
  mapUrl = "/geo/countries-110m.json",
  markers = [],
  markerColor = "var(--color-accent-500)",
}: GlobeWireframeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress] = useState(startAsGlobe ? 0 : 100);
  const [worldData, setWorldData] = useState<GeoFeature[]>([]);
  const [rotation, setRotation] = useState<[number, number]>(() => rotationFor(rotateToLocation, initialRotation));
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState([0, 0]);
  const [isVisible, setIsVisible] = useState(false);
  const rotationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const rotationAnimFrame = useRef<number | null>(null);
  const rotationStartTime = useRef<number | null>(null);
  const rotationFrom = useRef<[number, number]>([0, 0]);
  const rotationTo = useRef<[number, number]>([0, 0]);
  const animationFrame = useRef<number | null>(null);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const rotationRef = useRef(rotation);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  const useResponsive = !width && !height;
  const finalWidth = useResponsive ? dimensions.width : width || 800;
  const finalHeight = useResponsive ? dimensions.height : height || 500;

  const defaultCountryFillColor = countryFillColor || (variant === "solid" ? "currentColor" : "none");
  const defaultBackgroundColor = backgroundColor || "transparent";

  // size + visibility (only animate while on screen)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let resizeObserver: ResizeObserver | null = null;
    if (useResponsive) {
      resizeObserver = new ResizeObserver(([entry]) => {
        const w = Math.round(entry.contentRect.width) || 300;
        setDimensions({ width: w, height: w });
      });
      resizeObserver.observe(container);
    }

    const io = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    io.observe(container);

    return () => {
      resizeObserver?.disconnect();
      io.disconnect();
    };
  }, [useResponsive]);

  // world map – loaded once the globe scrolls into view
  useEffect(() => {
    if (!isVisible || worldData.length) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(mapUrl);
        const world = (await response.json()) as WorldAtlasTopology;
        const countries = feature(world, world.objects.countries).features as unknown as GeoFeature[];
        if (!cancelled) setWorldData(countries);
      } catch (err) {
        console.error("Globe: could not load world map", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isVisible, mapUrl, worldData.length]);

  // continuous rotation (disabled for visitors who prefer reduced motion)
  useEffect(() => {
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!autoRotate || reduced || !isVisible || isDragging || rotateCities.length > 0) return;

    const rotate = () => {
      setRotation((prev) => [(prev[0] + autoRotateSpeed) % 360, prev[1]]);
      animationFrame.current = requestAnimationFrame(rotate);
    };
    animationFrame.current = requestAnimationFrame(rotate);
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [autoRotate, autoRotateSpeed, isVisible, isDragging, rotateCities.length]);

  const animateRotationTo = useCallback((target: [number, number], duration = 1200) => {
    if (rotationAnimFrame.current) cancelAnimationFrame(rotationAnimFrame.current);
    rotationFrom.current = rotationRef.current;
    rotationTo.current = target;
    rotationStartTime.current = performance.now();

    const animate = (time: number) => {
      const t = Math.min((time - (rotationStartTime.current || 0)) / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setRotation([
        rotationFrom.current[0] + (rotationTo.current[0] - rotationFrom.current[0]) * eased,
        rotationFrom.current[1] + (rotationTo.current[1] - rotationFrom.current[1]) * eased,
      ]);
      if (t < 1) rotationAnimFrame.current = requestAnimationFrame(animate);
    };
    rotationAnimFrame.current = requestAnimationFrame(animate);
  }, []);

  // optional city tour
  useEffect(() => {
    if (rotateCities.length === 0 || !isVisible) return;
    const goTo = (index: number) => {
      const c = cityCoordinates[rotateCities[index].toLowerCase()];
      if (c) animateRotationTo([-c[1], -c[0]], rotationSpeed * 0.6);
    };
    goTo(currentCityIndex);
    rotationInterval.current = setInterval(() => {
      const next = (currentCityIndex + 1) % rotateCities.length;
      goTo(next);
      setCurrentCityIndex(next);
    }, rotationSpeed);
    return () => {
      if (rotationInterval.current) clearInterval(rotationInterval.current);
    };
  }, [rotateCities, currentCityIndex, rotationSpeed, isVisible, animateRotationTo]);

  const pointerPos = (event: React.PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    return rect ? [event.clientX - rect.left, event.clientY - rect.top] : null;
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    if (!enableInteraction) return;
    const p = pointerPos(event);
    if (!p) return;
    setIsDragging(true);
    setLastMouse(p);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!isDragging || !enableInteraction) return;
    const p = pointerPos(event);
    if (!p) return;
    const dx = p[0] - lastMouse[0];
    const dy = p[1] - lastMouse[1];
    const sensitivity = variant === "wireframe" && progress / 100 >= 0.5 ? 0.25 : 0.5;
    setRotation((prev) => [prev[0] + dx * sensitivity, Math.max(-90, Math.min(90, prev[1] - dy * sensitivity))]);
    setLastMouse(p);
  };

  const stopDragging = () => setIsDragging(false);

  // draw
  useEffect(() => {
    if (!svgRef.current || worldData.length === 0 || !isVisible) return;
    if (useResponsive && dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    let finalCountryFill = "none";
    let finalStrokeWidth = strokeWidth;
    let finalOpacity = 1.0;
    let renderGraticule = showGraticule;
    let finalGraticuleOpacity = graticuleOpacity;
    let finalSphereOutlineWidth = sphereOutlineWidth;

    if (variant === "wireframesolid") {
      renderGraticule = false;
      finalGraticuleOpacity = 0;
      finalSphereOutlineWidth = 1.5;
    } else if (variant === "solid") {
      finalCountryFill = defaultCountryFillColor;
      finalStrokeWidth = strokeWidth * 0.5;
      finalOpacity = 0.3;
      renderGraticule = false;
      finalGraticuleOpacity = 0;
      finalSphereOutlineWidth = 1.5;
    }

    if (defaultBackgroundColor !== "transparent") {
      svg
        .append("circle")
        .attr("cx", finalWidth / 2)
        .attr("cy", finalHeight / 2)
        .attr("r", (Math.min(finalWidth, finalHeight) / 2) * scale * 0.9)
        .attr("fill", defaultBackgroundColor);
    }

    let projection: d3.GeoProjection | CustomProjection;
    const path = d3.geoPath();

    if (variant === "wireframe") {
      const alpha = Math.pow(progress / 100, 0.5);
      const baseScale = Math.min(finalWidth, finalHeight) / 2;
      const scaleRange = d3.scaleLinear().domain([0, 1]).range([baseScale * 0.9 * scale, baseScale * 0.54 * scale]);
      projection = interpolateProjection(orthographicRaw, equirectangularRaw)
        .scale(scaleRange(alpha))
        .translate([finalWidth / 2, finalHeight / 2])
        .rotate([rotation[0], rotation[1]])
        .precision(0.1);
      (projection as CustomProjection).alpha(alpha);
    } else {
      projection = d3
        .geoOrthographic()
        .scale((Math.min(finalWidth, finalHeight) / 2) * scale * 0.9)
        .translate([finalWidth / 2, finalHeight / 2])
        .rotate([rotation[0], rotation[1]])
        .precision(0.1);
    }
    path.projection(projection);

    if (renderGraticule && finalGraticuleOpacity > 0) {
      const graticule = d3.geoGraticule();
      const d = path(graticule());
      if (d)
        svg
          .append("path")
          .attr("d", d)
          .attr("fill", "none")
          .attr("stroke", graticuleColor)
          .attr("stroke-width", 1)
          .attr("opacity", finalGraticuleOpacity);
    }

    svg
      .selectAll(".country")
      .data(worldData)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", (d: GeoFeature) => {
        try {
          const p = path(d as unknown as GeoPermissibleObjects);
          return p && !p.includes("NaN") && !p.includes("Infinity") ? p : "";
        } catch {
          return "";
        }
      })
      .attr("fill", finalCountryFill)
      .attr("stroke", strokeColor)
      .attr("stroke-width", finalStrokeWidth)
      .attr("opacity", finalOpacity)
      .on("mouseenter", function (this: SVGPathElement) {
        if (countryHoverColor && variant === "solid") d3.select(this).attr("fill", countryHoverColor);
      })
      .on("mouseleave", function (this: SVGPathElement) {
        if (variant === "solid") d3.select(this).attr("fill", finalCountryFill);
      });

    const sphere = path({ type: "Sphere" });
    if (sphere)
      svg
        .append("path")
        .attr("d", sphere)
        .attr("fill", "none")
        .attr("stroke", sphereOutlineColor)
        .attr("stroke-width", finalSphereOutlineWidth)
        .attr("opacity", variant === "wireframe" ? 1.0 : 0.8);

    // markers – only drawn on the visible hemisphere
    const centre: [number, number] = [-rotation[0], -rotation[1]];
    for (const m of markers) {
      const lngLat: [number, number] = [m.coordinates[1], m.coordinates[0]];
      if (d3.geoDistance(lngLat, centre) > Math.PI / 2 - 0.05) continue;
      const xy = projection(lngLat);
      if (!xy) continue;
      const g = svg.append("g").attr("transform", `translate(${xy[0]},${xy[1]})`);
      g.append("circle").attr("r", 11).attr("fill", markerColor).attr("opacity", 0.18);
      g.append("circle").attr("r", 5).attr("fill", markerColor).attr("stroke", "#fff").attr("stroke-width", 2);
      if (m.label)
        g.append("text")
          .text(m.label)
          .attr("x", 12)
          .attr("y", 4)
          .attr("font-size", 12)
          .attr("font-weight", 600)
          .attr("fill", "var(--color-ink)");
    }
  }, [
    worldData,
    progress,
    rotation,
    isVisible,
    finalWidth,
    finalHeight,
    strokeColor,
    strokeWidth,
    graticuleColor,
    graticuleOpacity,
    sphereOutlineColor,
    sphereOutlineWidth,
    showGraticule,
    defaultCountryFillColor,
    countryHoverColor,
    variant,
    scale,
    defaultBackgroundColor,
    useResponsive,
    dimensions.width,
    markers,
    markerColor,
  ]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <svg
        ref={svgRef}
        width={finalWidth}
        height={finalHeight}
        aria-hidden
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerLeave={stopDragging}
        className={cn("touch-pan-y", useResponsive && "h-full w-full transition-opacity duration-1000")}
        style={{
          cursor: enableInteraction ? (isDragging ? "grabbing" : "grab") : "default",
          opacity: useResponsive ? (dimensions.width > 0 ? 1 : 0) : 1,
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dotted separator                                                    */
/* ------------------------------------------------------------------ */

const FormDots = React.forwardRef<React.ComponentRef<typeof SeparatorPrimitive.Root>, React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
    const isHorizontal = orientation === "horizontal";
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn("flex shrink-0 items-center justify-center overflow-hidden", isHorizontal ? "w-full" : "h-full", className)}
        {...props}
      >
        <div className={cn("relative", isHorizontal ? "h-4 w-full" : "h-full w-4")}>
          <div
            className="absolute inset-0 bg-repeat text-brand-200"
            style={{
              backgroundImage: "radial-gradient(circle, currentColor 0.8px, transparent 0.8px)",
              backgroundSize: isHorizontal ? "6px 100%" : "100% 6px",
              maskImage: isHorizontal
                ? "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)"
                : "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          />
        </div>
      </SeparatorPrimitive.Root>
    );
  },
);
FormDots.displayName = "FormDots";

/* ------------------------------------------------------------------ */
/* Contact section                                                     */
/* ------------------------------------------------------------------ */

export interface ContactLink {
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  external?: boolean;
}

interface ContactWithGlobeProps {
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
  /** contact channels shown next to the globe */
  links?: ContactLink[];
  /** WhatsApp number in international format without "+" (e.g. 971506771216) – enables "Send on WhatsApp" */
  whatsappNumber?: string;
  /** e-mail address for "Send by email" */
  email?: string;
  /** page URL appended to the message so the team knows where it came from */
  pageUrl?: string;
  markers?: GlobeMarker[];
}

const fieldCls =
  "w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none transition-all duration-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100";
const labelCls = "text-xs font-semibold tracking-widest text-muted uppercase";

export default function ContactWithGlobe({
  title = "Contact us",
  subtitle = "Contact",
  description = "Questions about a car, prices or delivery? Send us a message and our team will get back to you.",
  className,
  links = [],
  whatsappNumber,
  email,
  pageUrl,
  markers = [{ coordinates: [25.2048, 55.2708], label: "Dubai" }],
}: ContactWithGlobeProps) {
  const id = React.useId();
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [error, setError] = useState("");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setError("");
  };

  const body = [
    "Hello Aldy Rent A Car,",
    form.message.trim(),
    "",
    `Name: ${form.name.trim() || "____"}`,
    ...(form.phone.trim() ? [`Phone: ${form.phone.trim()}`] : []),
    ...(form.email.trim() ? [`Email: ${form.email.trim()}`] : []),
    ...(pageUrl ? [`Sent from: ${pageUrl}`] : []),
  ].join("\n");

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.message.trim()) return "Please write a short message.";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Please check your email address.";
    return "";
  };

  const sendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);
    if (whatsappNumber) window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(body)}`, "_blank", "noopener");
  };

  const sendEmail = () => {
    const v = validate();
    if (v) return setError(v);
    if (email) window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Enquiry from ${form.name.trim()}`)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <MotionConfig reducedMotion="user">
      <section className={cn("relative w-full overflow-hidden py-20", className)}>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 flex flex-col items-center gap-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5"
            >
              <span className="text-sm font-medium text-brand-700">{subtitle}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
              className="text-4xl font-bold tracking-tight text-ink md:text-5xl"
            >
              {title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3, ease: smoothEase }}
              className="max-w-md text-base text-muted"
            >
              {description}
            </motion.p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.2, ease: smoothEase }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold text-ink">Talk to our team</h3>
                <p className="max-w-xs text-sm leading-relaxed text-muted">WhatsApp, call or email – whichever suits you. We deliver cars across Dubai and Sharjah.</p>
              </div>

              <div className="flex flex-col gap-3">
                {links.map(({ icon: Icon, label, href, external }, i) => (
                  <motion.a
                    key={label + href}
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener" } : {})}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: smoothEase }}
                    className="group flex w-fit items-center gap-3 text-sm font-medium text-ink/80 transition-colors duration-200 hover:text-brand-700"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-line bg-white transition-all duration-200 group-hover:border-brand-200 group-hover:bg-brand-50">
                      <Icon className="size-4 text-brand-600" />
                    </span>
                    {label}
                  </motion.a>
                ))}
              </div>

              <div className="relative h-56 overflow-hidden text-brand-500">
                <GlobeWireframe
                  className="absolute top-0 left-0 aspect-square w-full max-w-full"
                  variant="wireframesolid"
                  // centre slightly south of Dubai so the Dubai pin sits in the visible upper half of the globe
                  rotateToLocation={[-12, 55.27]}
                  autoRotate
                  autoRotateSpeed={0.08}
                  strokeWidth={0.6}
                  graticuleOpacity={0.12}
                  markers={markers}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-canvas to-transparent" />
              </div>
            </motion.div>

            <motion.form
              onSubmit={sendWhatsApp}
              noValidate
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.35, ease: smoothEase }}
              className="flex flex-col gap-5 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8"
              aria-label="Send a message"
            >
              <div>
                <h3 className="mb-0.5 text-lg font-semibold text-ink">Send a message</h3>
                <p className="text-sm text-muted">Your message opens in WhatsApp (or your email app) ready to send – nothing is stored on this website.</p>
              </div>

              <FormDots />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor={`${id}-name`} className={labelCls}>
                    Full name
                  </label>
                  <input id={`${id}-name`} type="text" autoComplete="name" required value={form.name} onChange={set("name")} placeholder="Your name" className={fieldCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor={`${id}-phone`} className={labelCls}>
                    Phone <span className="normal-case tracking-normal">(optional)</span>
                  </label>
                  <input id={`${id}-phone`} type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} placeholder="+971 5X XXX XXXX" className={fieldCls} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={`${id}-email`} className={labelCls}>
                  Email <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <input id={`${id}-email`} type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className={fieldCls} />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={`${id}-message`} className={labelCls}>
                  Message
                </label>
                <textarea
                  id={`${id}-message`}
                  required
                  rows={4}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Which car, which dates, and where should we deliver it?"
                  className={cn(fieldCls, "resize-none py-3")}
                />
              </div>

              <div aria-live="polite">{error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}</div>

              <div className="flex flex-wrap items-center gap-3">
                {whatsappNumber && (
                  <Button type="submit" className="group h-11 rounded-full bg-wa px-6 text-sm font-semibold text-white hover:bg-wa-dark">
                    Send on WhatsApp
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                )}
                {email && (
                  <Button type="button" variant="outline" onClick={sendEmail} className="h-11 rounded-full px-6 text-sm font-semibold">
                    <Mail className="size-4" /> Send by email
                  </Button>
                )}
              </div>
            </motion.form>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

