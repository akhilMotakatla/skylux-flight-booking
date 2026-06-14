using System.Security.Claims;
using System.Text.Json;
using FlightBooking.API.Data;
using FlightBooking.API.DTOs.Cars;
using FlightBooking.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlightBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CarsController : ControllerBase
{
    private readonly AppDbContext _db;

    public CarsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetCars([FromQuery] string? category)
    {
        var query = _db.Cars.AsQueryable();

        if (!string.IsNullOrWhiteSpace(category) && category != "All")
            query = query.Where(c => c.Category == category);

        var cars = await query.OrderBy(c => c.PricePerDay).ToListAsync();

        var result = cars.Select(c => new CarResultDto
        {
            Id           = c.Id,
            Name         = c.Name,
            Brand        = c.Brand,
            Category     = c.Category,
            Emoji        = c.Emoji,
            Seats        = c.Seats,
            Bags         = c.Bags,
            Transmission = c.Transmission,
            Fuel         = c.Fuel,
            PricePerDay  = c.PricePerDay,
            Rating       = c.Rating,
            Reviews      = c.Reviews,
            Features     = JsonSerializer.Deserialize<List<string>>(c.FeaturesJson) ?? [],
            Color        = c.Color,
            Available    = c.Available
        });

        return Ok(result);
    }

    [HttpPost("rentals")]
    [Authorize]
    public async Task<IActionResult> CreateRental([FromBody] CreateCarRentalDto dto)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out var userId))
            return Unauthorized();

        var days = (int)Math.Ceiling((dto.ReturnDate.Date - dto.PickupDate.Date).TotalDays);
        if (days < 1) days = 1;

        var rental = new CarRental
        {
            CarId             = dto.CarId > 0 ? dto.CarId : null,
            UserId            = userId,
            PickupLocation    = dto.PickupLocation,
            DropoffLocation   = dto.DropoffLocation,
            PickupDate        = dto.PickupDate.Date,
            ReturnDate        = dto.ReturnDate.Date,
            TotalDays         = days,
            TotalPrice        = dto.TotalPrice,
            Status            = "Confirmed",
            BookingDate       = DateTime.UtcNow,
            DriverDetailsJson = JsonSerializer.Serialize(dto.Driver),
            AddOnsJson        = JsonSerializer.Serialize(dto.AddOns),
            CarName           = dto.CarName,
            CarCategory       = dto.CarCategory,
            CarPricePerDay    = dto.CarPricePerDay,
            CarEmoji          = dto.CarEmoji
        };

        _db.CarRentals.Add(rental);
        await _db.SaveChangesAsync();

        return Ok(new CarRentalResponseDto
        {
            Id             = rental.Id,
            CarName        = rental.CarName,
            CarCategory    = rental.CarCategory,
            CarEmoji       = rental.CarEmoji,
            PickupLocation = rental.PickupLocation,
            DropoffLocation = rental.DropoffLocation,
            PickupDate     = rental.PickupDate,
            ReturnDate     = rental.ReturnDate,
            TotalDays      = rental.TotalDays,
            TotalPrice     = rental.TotalPrice,
            Status         = rental.Status,
            BookingDate    = rental.BookingDate
        });
    }

    [HttpGet("rentals/my")]
    [Authorize]
    public async Task<IActionResult> GetMyRentals()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out var userId))
            return Unauthorized();

        var rentals = await _db.CarRentals
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.BookingDate)
            .ToListAsync();

        var result = rentals.Select(r => new CarRentalResponseDto
        {
            Id              = r.Id,
            CarName         = r.CarName,
            CarCategory     = r.CarCategory,
            CarEmoji        = r.CarEmoji,
            PickupLocation  = r.PickupLocation,
            DropoffLocation = r.DropoffLocation,
            PickupDate      = r.PickupDate,
            ReturnDate      = r.ReturnDate,
            TotalDays       = r.TotalDays,
            TotalPrice      = r.TotalPrice,
            Status          = r.Status,
            BookingDate     = r.BookingDate
        });

        return Ok(result);
    }
}
