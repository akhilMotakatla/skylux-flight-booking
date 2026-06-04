using System.Text.Json;
using FlightBooking.API.Data;
using FlightBooking.API.DTOs.Bookings;
using FlightBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FlightBooking.API.Services;

public class BookingService : IBookingService
{
    private readonly AppDbContext _db;

    public BookingService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<BookingResponseDto> CreateBookingAsync(CreateBookingDto dto, int userId)
    {
        await using var transaction = await _db.Database.BeginTransactionAsync();

        var flight = await _db.Flights
            .Include(f => f.Airline)
            .Include(f => f.DepartureAirport)
            .Include(f => f.ArrivalAirport)
            .FirstOrDefaultAsync(f => f.Id == dto.FlightId)
            ?? throw new InvalidOperationException("Flight not found.");

        if (flight.AvailableSeats < dto.Passengers.Count)
            throw new InvalidOperationException("Not enough seats available.");

        flight.AvailableSeats -= dto.Passengers.Count;

        var booking = new Booking
        {
            UserId = userId,
            FlightId = flight.Id,
            Status = "Confirmed",
            TotalPrice = flight.Price * dto.Passengers.Count,
            SeatNumbers = string.Join(",", dto.SeatNumbers),
            PassengerDetailsJson = JsonSerializer.Serialize(dto.Passengers)
        };

        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync();
        await transaction.CommitAsync();

        return MapBookingToDto(booking, flight);
    }

    public async Task<List<BookingResponseDto>> GetUserBookingsAsync(int userId)
    {
        var bookings = await _db.Bookings
            .Include(b => b.Flight).ThenInclude(f => f.Airline)
            .Include(b => b.Flight).ThenInclude(f => f.DepartureAirport)
            .Include(b => b.Flight).ThenInclude(f => f.ArrivalAirport)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.BookingDate)
            .ToListAsync();

        return bookings.Select(b => MapBookingToDto(b, b.Flight)).ToList();
    }

    public async Task<bool> CancelBookingAsync(int bookingId, int userId)
    {
        var booking = await _db.Bookings
            .Include(b => b.Flight)
            .FirstOrDefaultAsync(b => b.Id == bookingId && b.UserId == userId);

        if (booking == null) return false;
        if (booking.Status == "Cancelled") return false;

        booking.Status = "Cancelled";
        var passengerCount = JsonSerializer.Deserialize<List<PassengerDetailDto>>(booking.PassengerDetailsJson)?.Count ?? 1;
        booking.Flight.AvailableSeats += passengerCount;

        await _db.SaveChangesAsync();
        return true;
    }

    private static BookingResponseDto MapBookingToDto(Booking booking, Models.Flight flight)
    {
        var passengers = new List<PassengerDetailDto>();
        try
        {
            passengers = JsonSerializer.Deserialize<List<PassengerDetailDto>>(booking.PassengerDetailsJson) ?? new();
        }
        catch { }

        return new BookingResponseDto
        {
            Id = booking.Id,
            Status = booking.Status,
            TotalPrice = booking.TotalPrice,
            BookingDate = booking.BookingDate,
            SeatNumbers = booking.SeatNumbers,
            FlightNumber = flight.FlightNumber,
            AirlineName = flight.Airline?.Name ?? "",
            AirlineLogo = flight.Airline?.Logo ?? "",
            DepartureCity = flight.DepartureAirport?.City ?? "",
            DepartureIATA = flight.DepartureAirport?.IATA ?? "",
            ArrivalCity = flight.ArrivalAirport?.City ?? "",
            ArrivalIATA = flight.ArrivalAirport?.IATA ?? "",
            DepartureTime = flight.DepartureTime,
            ArrivalTime = flight.ArrivalTime,
            Class = flight.Class,
            Passengers = passengers
        };
    }
}
