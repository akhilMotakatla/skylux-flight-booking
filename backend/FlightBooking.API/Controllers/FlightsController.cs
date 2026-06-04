using FlightBooking.API.DTOs.Flights;
using FlightBooking.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace FlightBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FlightsController : ControllerBase
{
    private readonly IFlightService _flightService;

    public FlightsController(IFlightService flightService)
    {
        _flightService = flightService;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] FlightSearchDto dto)
    {
        if (string.IsNullOrEmpty(dto.From) || string.IsNullOrEmpty(dto.To))
            return BadRequest(new { message = "From and To airports are required." });

        var results = await _flightService.SearchFlightsAsync(dto);
        return Ok(results);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var flight = await _flightService.GetFlightByIdAsync(id);
        if (flight == null) return NotFound(new { message = "Flight not found." });
        return Ok(flight);
    }
}
