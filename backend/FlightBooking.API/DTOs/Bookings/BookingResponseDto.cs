namespace FlightBooking.API.DTOs.Bookings;

public class BookingResponseDto
{
    public int Id { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal TotalPrice { get; set; }
    public DateTime BookingDate { get; set; }
    public string SeatNumbers { get; set; } = string.Empty;
    public string FlightNumber { get; set; } = string.Empty;
    public string AirlineName { get; set; } = string.Empty;
    public string AirlineLogo { get; set; } = string.Empty;
    public string DepartureCity { get; set; } = string.Empty;
    public string DepartureIATA { get; set; } = string.Empty;
    public string ArrivalCity { get; set; } = string.Empty;
    public string ArrivalIATA { get; set; } = string.Empty;
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
    public string Class { get; set; } = string.Empty;
    public List<PassengerDetailDto> Passengers { get; set; } = new();
}
