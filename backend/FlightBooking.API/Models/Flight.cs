namespace FlightBooking.API.Models;

public class Flight
{
    public int Id { get; set; }
    public string FlightNumber { get; set; } = string.Empty;
    public int AirlineId { get; set; }
    public Airline Airline { get; set; } = null!;
    public int DepartureAirportId { get; set; }
    public Airport DepartureAirport { get; set; } = null!;
    public int ArrivalAirportId { get; set; }
    public Airport ArrivalAirport { get; set; } = null!;
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
    public decimal Price { get; set; }
    public int TotalSeats { get; set; }
    public int AvailableSeats { get; set; }
    public string Class { get; set; } = "Economy";
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
