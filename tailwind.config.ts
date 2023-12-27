import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        green: {
          50: '#EFFDF5',
          100: '#D9FBE8',
          200: '#B3F5D1',
          300: '#75EDAE',
          400: '#00DC82',
          500: '#00C16A',
          600: '#00A155',
          700: '#007F45',
          800: '#016538',
          900: '#0A5331',
          950: '#052e16'
        },
        brown: {
          50: '#F5F5DC',
          100: '#EBCBA4',
          200: '#CFB57C',
          300: '#B88649',
          400: '#A06A24',
          500: '#8B4513',
          600: '#733307',
          700: '#5A2300',
          800: '#401100',
          900: '#2A0700',
          950: '#180300'
        }
      }
    }
  }
}