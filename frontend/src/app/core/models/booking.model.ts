export interface Passenger {
  firstName: string;
  lastName: string;
  passportNumber: string;
  dateOfBirth: string;
  nationality: string;
}

export interface CreateBookingRequest {
  flightId: number;
  passengers: Passenger[];
  seatNumbers: string[];
  paymentMethod: string;
}

export interface Booking {
  id: number;
  status: string;
  totalPrice: number;
  bookingDate: string;
  seatNumbers: string;
  flightNumber: string;
  airlineName: string;
  airlineLogo: string;
  departureCity: string;
  departureIATA: string;
  arrivalCity: string;
  arrivalIATA: string;
  departureTime: string;
  arrivalTime: string;
  class: string;
  passengers: Passenger[];
}
