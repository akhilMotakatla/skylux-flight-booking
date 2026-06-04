namespace FlightBooking.API.DTOs.Flights;

public class FlightResultDto
{
    public int Id { get; set; }
    public string FlightNumber { get; set; } = string.Empty;
    public string AirlineName { get; set; } = string.Empty;
    public string AirlineLogo { get; set; } = string.Empty;
    public string AirlineCode { get; set; } = string.Empty;
    public string DepartureCity { get; set; } = string.Empty;
    public string DepartureCountry { get; set; } = string.Empty;
    public string DepartureIATA { get; set; } = string.Empty;
    public string ArrivalCity { get; set; } = string.Empty;
    public string ArrivalCountry { get; set; } = string.Empty;
    public string ArrivalIATA { get; set; } = string.Empty;
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
    public int AvailableSeats { get; set; }
    public string Class { get; set; } = string.Empty;

    // Connection fields
    public bool IsConnecting { get; set; } = false;
    public string? ConnectionIATA { get; set; }
    public string? ConnectionCity { get; set; }
    public int? LayoverMinutes { get; set; }
    public int? Leg2FlightId { get; set; }
    public string? Leg2FlightNumber { get; set; }
    public string? Leg2AirlineName { get; set; }
    public DateTime? Leg2DepartureTime { get; set; }
    public DateTime? Leg2ArrivalTime { get; set; }
}
