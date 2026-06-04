using FlightBooking.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlightBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AirportsController : ControllerBase
{
    private readonly AppDbContext _db;
    public AirportsController(AppDbContext db) { _db = db; }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q) || q.Length < 2)
            return Ok(new List<object>());

        var upper = q.ToUpperInvariant();

        // Priority 1: exact IATA match or starts-with
        var exactIata = await _db.Airports
            .Where(a => a.IATA == upper || a.IATA.StartsWith(upper))
            .OrderBy(a => a.IATA)
            .Take(5)
            .Select(a => new { a.Id, a.IATA, a.Name, a.City, a.Country })
            .ToListAsync();

        // Priority 2: city / country / name contains
        var cityMatch = await _db.Airports
            .Where(a =>
                !a.IATA.StartsWith(upper) &&
                (EF.Functions.Like(a.City.ToUpper(),    $"%{upper}%") ||
                 EF.Functions.Like(a.Country.ToUpper(), $"%{upper}%") ||
                 EF.Functions.Like(a.Name.ToUpper(),    $"%{upper}%")))
            .OrderBy(a => a.City)
            .Take(10)
            .Select(a => new { a.Id, a.IATA, a.Name, a.City, a.Country })
            .ToListAsync();

        var combined = exactIata.Cast<object>()
            .Concat(cityMatch.Cast<object>())
            .DistinctBy(x => ((dynamic)x).IATA)
            .Take(10)
            .ToList();

        return Ok(combined);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var airports = await _db.Airports
            .Select(a => new { a.Id, a.IATA, a.City, a.Country })
            .OrderBy(a => a.City)
            .ToListAsync();
        return Ok(airports);
    }
}
