import { Space_Grotesk, Archivo, Noto_Sans_TC, JetBrains_Mono } from 'next/font/google';

export const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-space-grotesk' });
export const archivo = Archivo({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-archivo' });
export const notoTC = Noto_Sans_TC({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-noto-tc' });
export const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains' });

export const fontClasses = [spaceGrotesk.variable, archivo.variable, notoTC.variable, jetbrains.variable].join(' ');
