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
  totalSeats?: number;
  class: string;
  // Connection fields
  isConnecting?: boolean;
  connectionIATA?: string;
  connectionCity?: string;
  layoverMinutes?: number;
  leg2FlightId?: number;
  leg2FlightNumber?: string;
  leg2AirlineName?: string;
  leg2DepartureTime?: string;
  leg2ArrivalTime?: string;
}

export interface FlightSearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
  class: string;
}
