using FlightBooking.API.Data;
using FlightBooking.API.DTOs.Flights;
using FlightBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FlightBooking.API.Services;

public class FlightService : IFlightService
{
    private readonly AppDbContext _db;

    // Global connection hubs used for 1-stop itineraries
    private static readonly string[] Hubs = {
        "DXB","LHR","JFK","CDG","AMS","FRA","IST","SIN","HKG","NRT",
        "DOH","AUH","ATL","ORD","LAX","DFW","ICN","BKK","KUL","SYD",
        "MIA","YYZ","GRU","JNB","DEL","BOM","ZRH","MAD","FCO","ARN"
    };

    public FlightService(AppDbContext db) { _db = db; }

    public async Task<List<FlightResultDto>> SearchFlightsAsync(FlightSearchDto dto)
    {
        var direct = await SearchDirectAsync(dto);

        List<FlightResultDto> connecting = new();
        if (direct.Count < 8)
            connecting = await SearchConnectingAsync(dto);

        return direct.Concat(connecting)
                     .OrderBy(f => (double)f.Price)
                     .Take(60)
                     .ToList();
    }

    private async Task<List<FlightResultDto>> SearchDirectAsync(FlightSearchDto dto)
    {
        var fromIata = dto.From.Trim().ToUpperInvariant();
        var toIata   = dto.To.Trim().ToUpperInvariant();
        var dateStart = dto.Date.Date;
        var dateEnd   = dateStart.AddDays(1);

        var query = _db.Flights
            .Include(f => f.Airline)
            .Include(f => f.DepartureAirport)
            .Include(f => f.ArrivalAirport)
            .Where(f =>
                f.DepartureAirport.IATA == fromIata &&
                f.ArrivalAirport.IATA   == toIata   &&
                f.DepartureTime >= dateStart &&
                f.DepartureTime <  dateEnd   &&
                f.AvailableSeats >= dto.Passengers);

        if (!string.IsNullOrEmpty(dto.Class) && dto.Class != "Any")
            query = query.Where(f => f.Class == dto.Class);

        var flights = await query.OrderBy(f => (double)f.Price).Take(60).ToListAsync();
        return flights.Select(f => Map(f)).ToList();
    }

    private async Task<List<FlightResultDto>> SearchConnectingAsync(FlightSearchDto dto)
    {
        var fromIata  = dto.From.Trim().ToUpperInvariant();
        var toIata    = dto.To.Trim().ToUpperInvariant();
        var results   = new List<FlightResultDto>();

        foreach (var hub in Hubs)
        {
            if (hub == fromIata || hub == toIata) continue;

            // Leg 1: From → Hub
            var leg1List = await SearchDirectAsync(new FlightSearchDto
                { From = fromIata, To = hub, Date = dto.Date, Passengers = dto.Passengers, Class = dto.Class });
            if (!leg1List.Any()) continue;

            // Leg 2: Hub → To (same day or +1)
            var leg2List = await SearchDirectAsync(new FlightSearchDto
                { From = hub, To = toIata, Date = dto.Date, Passengers = dto.Passengers, Class = dto.Class });
            if (!leg2List.Any())
                leg2List = await SearchDirectAsync(new FlightSearchDto
                    { From = hub, To = toIata, Date = dto.Date.AddDays(1), Passengers = dto.Passengers, Class = dto.Class });
            if (!leg2List.Any()) continue;

            // Pair legs with valid layover (60 – 600 min)
            foreach (var l1 in leg1List.Take(3))
            {
                foreach (var l2 in leg2List.Take(3))
                {
                    var layover = (int)(l2.DepartureTime - l1.ArrivalTime).TotalMinutes;
                    if (layover < 60 || layover > 600) continue;

                    var hubAirport = await _db.Airports.FirstOrDefaultAsync(a => a.IATA == hub);

                    results.Add(new FlightResultDto
                    {
                        Id              = l1.Id,
                        FlightNumber    = $"{l1.FlightNumber} / {l2.FlightNumber}",
                        AirlineName     = l1.AirlineName,
                        AirlineLogo     = l1.AirlineLogo,
                        AirlineCode     = l1.AirlineCode,
                        DepartureCity   = l1.DepartureCity,
                        DepartureCountry= l1.DepartureCountry,
                        DepartureIATA   = l1.DepartureIATA,
                        ArrivalCity     = l2.ArrivalCity,
                        ArrivalCountry  = l2.ArrivalCountry,
                        ArrivalIATA     = l2.ArrivalIATA,
                        DepartureTime   = l1.DepartureTime,
                        ArrivalTime     = l2.ArrivalTime,
                        DurationMinutes = (int)(l2.ArrivalTime - l1.DepartureTime).TotalMinutes,
                        Price           = l1.Price + l2.Price,
                        AvailableSeats  = Math.Min(l1.AvailableSeats, l2.AvailableSeats),
                        Class           = l1.Class,
                        // Connection meta
                        IsConnecting    = true,
                        ConnectionIATA  = hub,
                        ConnectionCity  = hubAirport?.City ?? hub,
                        LayoverMinutes  = layover,
                        Leg2FlightId    = l2.Id,
                        Leg2FlightNumber= l2.FlightNumber,
                        Leg2AirlineName = l2.AirlineName,
                        Leg2DepartureTime = l2.DepartureTime,
                        Leg2ArrivalTime   = l2.ArrivalTime
                    });

                    if (results.Count >= 12) goto Done;
                }
            }
        }
        Done:
        return results;
    }

    public async Task<FlightResultDto?> GetFlightByIdAsync(int id)
    {
        var f = await _db.Flights
            .Include(f => f.Airline)
            .Include(f => f.DepartureAirport)
            .Include(f => f.ArrivalAirport)
            .FirstOrDefaultAsync(f => f.Id == id);
        return f == null ? null : Map(f);
    }

    private static FlightResultDto Map(Flight f) => new()
    {
        Id               = f.Id,
        FlightNumber     = f.FlightNumber,
        AirlineName      = f.Airline.Name,
        AirlineLogo      = f.Airline.Logo,
        AirlineCode      = f.Airline.Code,
        DepartureCity    = f.DepartureAirport.City,
        DepartureCountry = f.DepartureAirport.Country,
        DepartureIATA    = f.DepartureAirport.IATA,
        ArrivalCity      = f.ArrivalAirport.City,
        ArrivalCountry   = f.ArrivalAirport.Country,
        ArrivalIATA      = f.ArrivalAirport.IATA,
        DepartureTime    = f.DepartureTime,
        ArrivalTime      = f.ArrivalTime,
        DurationMinutes  = (int)(f.ArrivalTime - f.DepartureTime).TotalMinutes,
        Price            = f.Price,
        AvailableSeats   = f.AvailableSeats,
        Class            = f.Class
    };
}
