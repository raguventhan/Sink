export default defineAppConfig({
  title: 'Miniklub',
  description: 'Miniklub URL shortner',
  image: 'https://miniklub.in/media/logo/default/logo-dt-2.png',
  previewTTL: 24 * 3600, // 24h
  slugRegex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
  reserveSlug: [
    'dashboard',
  ],
})
