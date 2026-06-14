namespace FlightBooking.API.DTOs.Cars;

public class CarResultDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Brand { get; set; } = "";
    public string Category { get; set; } = "";
    public string Emoji { get; set; } = "";
    public int Seats { get; set; }
    public int Bags { get; set; }
    public string Transmission { get; set; } = "";
    public string Fuel { get; set; } = "";
    public decimal PricePerDay { get; set; }
    public decimal Rating { get; set; }
    public int Reviews { get; set; }
    public List<string> Features { get; set; } = [];
    public string Color { get; set; } = "";
    public bool Available { get; set; }
}

public class DriverDetailDto
{
    public string Title { get; set; } = "Mr";
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string Email { get; set; } = "";
    public string Mobile { get; set; } = "";
    public string LicenseNumber { get; set; } = "";
    public string DateOfBirth { get; set; } = "";
    public string Nationality { get; set; } = "";
}

public class CreateCarRentalDto
{
    public int CarId { get; set; }
    public string PickupLocation { get; set; } = "";
    public string DropoffLocation { get; set; } = "";
    public DateTime PickupDate { get; set; }
    public DateTime ReturnDate { get; set; }
    public DriverDetailDto Driver { get; set; } = new();
    public List<string> AddOns { get; set; } = [];
    public decimal TotalPrice { get; set; }
    public string CarName { get; set; } = "";
    public string CarCategory { get; set; } = "";
    public decimal CarPricePerDay { get; set; }
    public string CarEmoji { get; set; } = "🚗";
}

public class CarRentalResponseDto
{
    public int Id { get; set; }
    public string CarName { get; set; } = "";
    public string CarCategory { get; set; } = "";
    public string CarEmoji { get; set; } = "🚗";
    public string PickupLocation { get; set; } = "";
    public string DropoffLocation { get; set; } = "";
    public DateTime PickupDate { get; set; }
    public DateTime ReturnDate { get; set; }
    public int TotalDays { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = "";
    public DateTime BookingDate { get; set; }
}
