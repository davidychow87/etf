import { ENV } from './env';

export const isProduction = ENV === 'production';
export const isDebug = ENV === 'development';
export const isClient = typeof window !== 'undefined';

export const apiEndpoint = isDebug ? 'http://localhost:3000' : 'https://demo-reactgo.herokuapp.com';
// Replace with 'UA-########-#' or similar to enable tracking
export const trackingID = null;

export const alphaVantageKey = 'W35Q3X2UJWCYLUAN';

export const alphaVantageUrl = 'https://www.alphavantage.co/query';

export const maxPoints = 300;

export const minuteIncrement = 60;
