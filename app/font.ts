import localFont from 'next/font/local';

export const aeonik = localFont({
  src: [
    {
      path: '../public/font/Aeonik-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/font/Aeonik-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/font/Aeonik-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/font/Aeonik-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/font/Aeonik-Bold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/font/Aeonik-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-aeonik',
});
