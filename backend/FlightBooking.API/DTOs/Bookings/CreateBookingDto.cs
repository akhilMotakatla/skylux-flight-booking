namespace FlightBooking.API.DTOs.Bookings;

public class CreateBookingDto
{
    public int FlightId { get; set; }
    public List<PassengerDetailDto> Passengers { get; set; } = new();
    public List<string> SeatNumbers { get; set; } = new();
    public string PaymentMethod { get; set; } = "mock";
}
