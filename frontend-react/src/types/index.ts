export interface Airport {
  id: number;
  iata: string;
  name: string;
  city: string;
  country: string;
}

export interface Flight {
  id: number;
  flightNumber: string;
  airlineName: string;
  airlineLogo: string;
  airlineCode: string;
  departureCity: string;
  departureCountry: string;
  departureIATA: string;
  arrivalCity: string;
  arrivalCountry: string;
  arrivalIATA: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  price: number;
  availableSeats: number;
  class: string;
  isConnecting?: boolean;
  connectionIATA?: string;
  connectionCity?: string;
  layoverMinutes?: number;
  leg2FlightNumber?: string;
  leg2AirlineName?: string;
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
  class: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
