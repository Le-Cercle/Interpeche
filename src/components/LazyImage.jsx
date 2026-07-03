import { useState } from 'react'

/**
 * LazyImage — shows an ocean-themed skeleton while the image loads,
 * then fades the real image in smoothly.
 *
 * Props:
 * - src: main image URL
 * - srcSet: responsive image URLs (e.g., "img-sm.jpg 640w, img-lg.jpg 1280w")
 * - sizes: media query sizes (e.g., "(max-width: 640px) 100vw, 50vw")
 * - alt: alt text
 * - fallbackSeed: number for picsum fallback
 * - className, style: standard props
 */
export default function LazyImage({
  src,
  srcSet,
  sizes,
  alt,
  className = '',
  fallbackSeed,
  style,
  loading = 'lazy',
  fetchpriority,
  ...rest
}) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  const fallback = fallbackSeed
    ? `https://picsum.photos/seed/${fallbackSeed}/800/500`
    : undefined

  return (
    <div className="relative w-full h-full">
      {/* Skeleton shown until image loads */}
      {!loaded && (
        <div
          className="absolute inset-0 skeleton"
          style={{ borderRadius: 'inherit' }}
        />
      )}

      {/* Real image with responsive support */}
      <img
        src={errored && fallback ? fallback : src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchpriority={fetchpriority}
        className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={style}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!errored && fallback) {
            setErrored(true)
          }
        }}
        {...rest}
      />
    </div>
  )
}
