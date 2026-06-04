using FlightBooking.API.Data;
using FlightBooking.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlightBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("flights")]
    public async Task<IActionResult> GetFlights([FromQuery] int page = 1, [FromQuery] int size = 20)
    {
        var total = await _db.Flights.CountAsync();
        var flights = await _db.Flights
            .Include(f => f.Airline)
            .Include(f => f.DepartureAirport)
            .Include(f => f.ArrivalAirport)
            .OrderByDescending(f => f.DepartureTime)
            .Skip((page - 1) * size)
            .Take(size)
            .Select(f => new
            {
                f.Id, f.FlightNumber, Airline = f.Airline.Name,
                From = f.DepartureAirport.IATA, To = f.ArrivalAirport.IATA,
                f.DepartureTime, f.ArrivalTime, f.Price, f.AvailableSeats, f.TotalSeats, f.Class
            })
            .ToListAsync();

        return Ok(new { total, page, size, data = flights });
    }

    [HttpPost("flights")]
    public async Task<IActionResult> CreateFlight([FromBody] Flight flight)
    {
        _db.Flights.Add(flight);
        await _db.SaveChangesAsync();
        return Ok(flight);
    }

    [HttpPut("flights/{id:int}")]
    public async Task<IActionResult> UpdateFlight(int id, [FromBody] Flight updated)
    {
        var flight = await _db.Flights.FindAsync(id);
        if (flight == null) return NotFound();
        flight.Price = updated.Price;
        flight.AvailableSeats = updated.AvailableSeats;
        flight.DepartureTime = updated.DepartureTime;
        flight.ArrivalTime = updated.ArrivalTime;
        await _db.SaveChangesAsync();
        return Ok(flight);
    }

    [HttpDelete("flights/{id:int}")]
    public async Task<IActionResult> DeleteFlight(int id)
    {
        var flight = await _db.Flights.FindAsync(id);
        if (flight == null) return NotFound();
        _db.Flights.Remove(flight);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Deleted." });
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _db.Users
            .Select(u => new { u.Id, u.Name, u.Email, u.Role, u.CreatedAt, BookingCount = u.Bookings.Count })
            .ToListAsync();
        return Ok(users);
    }

    [HttpGet("bookings")]
    public async Task<IActionResult> GetAllBookings([FromQuery] int page = 1, [FromQuery] int size = 20)
    {
        var total = await _db.Bookings.CountAsync();
        var bookings = await _db.Bookings
            .Include(b => b.User)
            .Include(b => b.Flight).ThenInclude(f => f.DepartureAirport)
            .Include(b => b.Flight).ThenInclude(f => f.ArrivalAirport)
            .OrderByDescending(b => b.BookingDate)
            .Skip((page - 1) * size)
            .Take(size)
            .Select(b => new
            {
                b.Id, UserName = b.User.Name, UserEmail = b.User.Email,
                b.Status, b.TotalPrice, b.BookingDate,
                Route = $"{b.Flight.DepartureAirport.IATA}→{b.Flight.ArrivalAirport.IATA}",
                b.Flight.DepartureTime
            })
            .ToListAsync();
        return Ok(new { total, page, size, data = bookings });
    }
}
