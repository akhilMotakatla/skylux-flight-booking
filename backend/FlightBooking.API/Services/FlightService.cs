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

        var combined = direct.Concat(connecting).ToList();

        // Safety-net: if DB has no flights for this route/date, generate synthetic results
        if (!combined.Any())
            combined = await GenerateSyntheticResultsAsync(dto);

        return combined.OrderBy(f => (double)f.Price).Take(60).ToList();
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

    private async Task<List<FlightResultDto>> GenerateSyntheticResultsAsync(FlightSearchDto dto)
    {
        var fromIata = dto.From.Trim().ToUpperInvariant();
        var toIata   = dto.To.Trim().ToUpperInvariant();

        var from = await _db.Airports.FirstOrDefaultAsync(a => a.IATA == fromIata);
        var to   = await _db.Airports.FirstOrDefaultAsync(a => a.IATA == toIata);
        if (from == null || to == null) return new();

        var airlines = await _db.Airlines.ToListAsync();
        if (!airlines.Any()) return new();

        // Seeded by route so searches on the same day/route are deterministic
        var rng = new Random(Math.Abs(fromIata.GetHashCode() ^ toIata.GetHashCode() ^ dto.Date.DayOfYear));

        var results = new List<FlightResultDto>();

        // Connection hubs ordered by likely geographic relevance
        var hubCandidates = new[] { "DXB","LHR","SIN","DOH","JFK","FRA","AMS","IST","DEL","BOM","KUL","BKK","CDG","HKG","ATL" };

        int addedHubs = 0;
        foreach (var hub in hubCandidates)
        {
            if (hub == fromIata || hub == toIata) continue;
            if (addedHubs >= 4) break;

            var hubAirport = await _db.Airports.FirstOrDefaultAsync(a => a.IATA == hub);
            if (hubAirport == null) continue;

            double d1 = Haversine(from.Latitude, from.Longitude, hubAirport.Latitude, hubAirport.Longitude);
            double d2 = Haversine(hubAirport.Latitude, hubAirport.Longitude, to.Latitude, to.Longitude);

            int mins1 = Math.Max(60, (int)(d1 / 820 * 60) + 55);
            int mins2 = Math.Max(60, (int)(d2 / 820 * 60) + 55);

            decimal price1 = (decimal)(d1 * 0.06 + 90);
            decimal price2 = (decimal)(d2 * 0.06 + 90);

            string cls = string.IsNullOrEmpty(dto.Class) || dto.Class == "Any" ? "Economy" : dto.Class;
            decimal classMul = cls == "First" ? 5.5m : cls == "Business" ? 3.2m : 1m;

            // Two departure slots per hub
            int[] depHours = { 6, 14 };
            for (int slot = 0; slot < 2; slot++)
            {
                var a1 = airlines[Math.Abs((fromIata.GetHashCode() + slot) % airlines.Count)];
                var a2 = airlines[Math.Abs((toIata.GetHashCode()   + slot + 1) % airlines.Count)];

                var dep  = dto.Date.Date.AddHours(depHours[slot]).AddMinutes(rng.Next(0, 12) * 5);
                var arr1 = dep.AddMinutes(mins1);
                int lay  = 90 + rng.Next(0, 4) * 30;
                var dep2 = arr1.AddMinutes(lay);
                var arr2 = dep2.AddMinutes(mins2);

                decimal priceMul = 0.80m + (decimal)(rng.NextDouble() * 0.40);
                string fn1 = $"{a1.Code}{rng.Next(100, 9999)}";
                string fn2 = $"{a2.Code}{rng.Next(100, 9999)}";

                results.Add(new FlightResultDto
                {
                    Id               = -(results.Count + 1),
                    FlightNumber     = $"{fn1} / {fn2}",
                    AirlineName      = a1.Name,
                    AirlineLogo      = a1.Logo,
                    AirlineCode      = a1.Code,
                    DepartureCity    = from.City,
                    DepartureCountry = from.Country,
                    DepartureIATA    = from.IATA,
                    ArrivalCity      = to.City,
                    ArrivalCountry   = to.Country,
                    ArrivalIATA      = to.IATA,
                    DepartureTime    = dep,
                    ArrivalTime      = arr2,
                    DurationMinutes  = (int)(arr2 - dep).TotalMinutes,
                    Price            = Math.Round((price1 + price2) * classMul * priceMul, 2),
                    AvailableSeats   = 30 + rng.Next(0, 80),
                    Class            = cls,
                    IsConnecting     = true,
                    ConnectionIATA   = hub,
                    ConnectionCity   = hubAirport.City,
                    LayoverMinutes   = lay,
                    Leg2FlightId     = -(results.Count + 2),
                    Leg2FlightNumber = fn2,
                    Leg2AirlineName  = a2.Name,
                    Leg2DepartureTime = dep2,
                    Leg2ArrivalTime   = arr2
                });
            }
            addedHubs++;
        }

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

    private static double Haversine(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2)
              + Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180)
              * Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        return R * 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
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
