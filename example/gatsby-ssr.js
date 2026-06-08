/** Site-level SSR hooks for global analytics head tags. */
import React from 'react';

const CLOUDFLARE_WEB_ANALYTICS_TOKEN = '14effe4522bb49b08a55213c9a58229c';

/** Inject Cloudflare Web Analytics into every statically rendered page head. */
export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    React.createElement('script', {
      key: 'cloudflare-web-analytics',
      defer: true,
      src: 'https://static.cloudflareinsights.com/beacon.min.js',
      'data-cf-beacon': JSON.stringify({ token: CLOUDFLARE_WEB_ANALYTICS_TOKEN }),
    }),
  ]);
};
