using System.Security.Claims;
using FlightBooking.API.DTOs.Bookings;
using FlightBooking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlightBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? throw new InvalidOperationException("User ID claim not found."));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingDto dto)
    {
        try
        {
            var booking = await _bookingService.CreateBookingAsync(dto, GetUserId());
            return Ok(booking);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyBookings()
    {
        var bookings = await _bookingService.GetUserBookingsAsync(GetUserId());
        return Ok(bookings);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Cancel(int id)
    {
        var success = await _bookingService.CancelBookingAsync(id, GetUserId());
        if (!success) return NotFound(new { message = "Booking not found or already cancelled." });
        return Ok(new { message = "Booking cancelled successfully." });
    }
}
