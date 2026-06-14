namespace FlightBooking.API.Models;

public class Car
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Brand { get; set; } = "";
    public string Category { get; set; } = "";
    public string Emoji { get; set; } = "🚗";
    public int Seats { get; set; }
    public int Bags { get; set; }
    public string Transmission { get; set; } = "Auto";
    public string Fuel { get; set; } = "Petrol";
    public decimal PricePerDay { get; set; }
    public decimal Rating { get; set; }
    public int Reviews { get; set; }
    public string FeaturesJson { get; set; } = "[]";
    public string Color { get; set; } = "";
    public bool Available { get; set; } = true;
}
