using FlightBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FlightBooking.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Airport> Airports => Set<Airport>();
    public DbSet<Airline> Airlines => Set<Airline>();
    public DbSet<Flight> Flights => Set<Flight>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    public DbSet<Car> Cars => Set<Car>();
    public DbSet<CarRental> CarRentals => Set<CarRental>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<Airport>().HasIndex(a => a.IATA).IsUnique();
        modelBuilder.Entity<Airline>().HasIndex(a => a.Code).IsUnique();
        modelBuilder.Entity<Flight>().HasIndex(f => f.FlightNumber);
        modelBuilder.Entity<Flight>()
            .HasIndex(f => new { f.DepartureAirportId, f.ArrivalAirportId, f.DepartureTime });

        modelBuilder.Entity<Flight>()
            .Property(f => f.Price)
            .HasColumnType("REAL");

        modelBuilder.Entity<Booking>()
            .Property(b => b.TotalPrice)
            .HasColumnType("REAL");

        modelBuilder.Entity<Car>()
            .Property(c => c.PricePerDay)
            .HasColumnType("REAL");

        modelBuilder.Entity<Car>()
            .Property(c => c.Rating)
            .HasColumnType("REAL");

        modelBuilder.Entity<CarRental>()
            .Property(r => r.TotalPrice)
            .HasColumnType("REAL");

        modelBuilder.Entity<CarRental>()
            .Property(r => r.CarPricePerDay)
            .HasColumnType("REAL");
    }
}
