import type { AppProps } from 'next/app';

import { globalStyles } from '@/styles/global';

globalStyles();

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
/*
Utilizando nosso Design System, vamos criar uma aplicação completa até o deploy. 
Abordaremos rotas autenticadas no Next.js, integração com Google Calendar, validações e muito mais!
*/
