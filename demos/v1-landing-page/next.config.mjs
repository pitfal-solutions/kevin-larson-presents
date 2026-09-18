/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static chunk filenames are not content-hashed in this Next version, yet
  // /_next/static is served with `immutable` caching — so a CSS fix can be
  // deployed and browsers keep the old file. (Bit us on 2026-09-18: a
  // broken stylesheet stayed cached after the fix shipped.) A per-deploy
  // id appends `?dpl=<id>` to every asset URL, which busts the cache on
  // each deploy. Vercel sets VERCEL_DEPLOYMENT_ID at build time; the
  // fallbacks cover other hosts and local builds.
  deploymentId:
    process.env.VERCEL_DEPLOYMENT_ID ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.NEXT_DEPLOYMENT_ID ||
    undefined,
};

export default nextConfig;
