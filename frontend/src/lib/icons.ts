/**
 * The app's icon registry: inline SVG path data, no icon-font or CDN
 * dependency (system-first, same reasoning as the font stack - see
 * STYLE_GUIDE.md §3). Icons are grouped into namespaced sets and addressed
 * as `'set.name'` (e.g. `'md.download'`), which `IconName` turns into a
 * full autocompleting union for `<Icon icon="...">`.
 *
 * Sets:
 * - `md.*`     Material Design icons (Apache-2.0), all 24x24.
 * - `fa.*`     Font Awesome Free solid (CC BY 4.0), per-icon viewBox.
 * - `custom.*` App-specific icons drawn by hand, 24x24.
 *
 * Adding an icon is additive: paste its path data into the right set and
 * every `IconName` consumer picks it up with type hints - no other file to
 * touch. Multi-shape icons work too: SVG path data may contain several `M`
 * subpaths in one string.
 */
export interface IconDefinition {
  viewBox: string;
  path: string;
}

const md = (path: string): IconDefinition => ({ viewBox: '0 0 24 24', path });

const ICON_SETS = {
  md: {
    add: md('M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'),
    'arrow-back': md('M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'),
    check: md('M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'),
    'chevron-down': md('M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z'),
    'chevron-left': md('M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'),
    'chevron-right': md('M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'),
    'chevron-up': md('M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z'),
    close: md('M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'),
    delete: md('M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'),
    download: md('M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z'),
    home: md('M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'),
    'ios-share': md('M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V10c0-1.1.9-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .9 2 2z'),
    logout: md('M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z'),
    menu: md('M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z'),
    'more-vert': md('M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'),
    pencil: md('M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'),
    person: md('M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'),
    refresh: md('M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 13h7V6l-2.35 2.35z'),
    search: md('M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'),
    share: md('M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z'),
  },
  fa: {
    download: {
      viewBox: '0 0 512 512',
      path: 'M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z',
    },
    heart: {
      viewBox: '0 0 512 512',
      path: 'M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z',
    },
    star: {
      viewBox: '0 0 576 512',
      path: 'M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z',
    },
  },
  custom: {
    // Simple flat barbell: two plate pairs and a connecting bar.
    barbell: md('M3 9h2v6H3zM6 7h2v10H6zM16 7h2v10h-2zM19 9h2v6h-2zM8 11h8v2H8z'),
  },
} satisfies Record<string, Record<string, IconDefinition>>;

type IconSets = typeof ICON_SETS;

/** Every valid icon name, e.g. 'md.pencil' | 'fa.download' | 'custom.barbell'. */
export type IconName = {
  [Set in keyof IconSets]: `${Set & string}.${keyof IconSets[Set] & string}`;
}[keyof IconSets];

export function resolveIcon(name: IconName): IconDefinition {
  const dot = name.indexOf('.');
  const set = ICON_SETS[name.slice(0, dot) as keyof IconSets];
  // A valid IconName always resolves - the index signature just can't see it.
  return (set as Record<string, IconDefinition>)[name.slice(dot + 1)]!;
}
