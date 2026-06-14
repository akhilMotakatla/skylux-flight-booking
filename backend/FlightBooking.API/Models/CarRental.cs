namespace FlightBooking.API.Models;

public class CarRental
{
    public int Id { get; set; }
    public int? CarId { get; set; }
    public Car? Car { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string PickupLocation { get; set; } = "";
    public string DropoffLocation { get; set; } = "";
    public DateTime PickupDate { get; set; }
    public DateTime ReturnDate { get; set; }
    public int TotalDays { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = "Confirmed";
    public DateTime BookingDate { get; set; } = DateTime.UtcNow;
    public string DriverDetailsJson { get; set; } = "{}";
    public string AddOnsJson { get; set; } = "[]";
    public string CarName { get; set; } = "";
    public string CarCategory { get; set; } = "";
    public decimal CarPricePerDay { get; set; }
    public string CarEmoji { get; set; } = "🚗";
}
