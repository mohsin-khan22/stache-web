/** @type {import('next').NextConfig} */
const nextConfig = {
  // The site has no server logic — the contact form is client-side only — so a
  // static export is the closest match to what Netlify publishes today.
  output: 'export',

  // Keeps /work serving as work.html, the same clean URLs netlify.toml rewrites
  // to today, with no redirect hop.
  trailingSlash: false,

  // next/image's optimiser needs a server. Images are referenced by plain <img>
  // and background-image exactly as the bundle did, so nothing needs it.
  images: { unoptimized: true },
};

export default nextConfig;
