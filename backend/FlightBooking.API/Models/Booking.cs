namespace FlightBooking.API.Models;

public class Booking
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int FlightId { get; set; }
    public Flight Flight { get; set; } = null!;
    public string Status { get; set; } = "Confirmed";
    public decimal TotalPrice { get; set; }
    public DateTime BookingDate { get; set; } = DateTime.UtcNow;
    public string PassengerDetailsJson { get; set; } = "[]";
    public string SeatNumbers { get; set; } = string.Empty;
}
