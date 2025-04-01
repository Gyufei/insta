import localFont from 'next/font/local'

export const montserrat = localFont({
  src: [
    {
      path: '../public/font/montserrat-latin-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/font/montserrat-latin-500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/font/montserrat-latin-600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/font/montserrat-latin-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-montserrat',
}) 