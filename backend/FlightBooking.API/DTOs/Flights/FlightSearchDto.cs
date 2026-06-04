namespace FlightBooking.API.DTOs.Flights;

public class FlightSearchDto
{
    public string From { get; set; } = string.Empty;
    public string To { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public int Passengers { get; set; } = 1;
    public string Class { get; set; } = "Economy";
}
