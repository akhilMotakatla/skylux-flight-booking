using System.Text.RegularExpressions;
using FlightBooking.API.Data;
using FlightBooking.API.DTOs.Chat;
using FlightBooking.API.DTOs.Flights;
using FlightBooking.API.Models;

namespace FlightBooking.API.Services;

public class ChatService : IChatService
{
    private readonly AppDbContext _db;
    private readonly IFlightService _flightService;

    public ChatService(AppDbContext db, IFlightService flightService)
    {
        _db = db;
        _flightService = flightService;
    }

    public async Task<ChatResponseDto> ProcessMessageAsync(ChatMessageDto dto, int? userId)
    {
        var msg = dto.Message.ToLowerInvariant().Trim();

        await SaveMessage(dto.Message, false, userId, dto.SessionId);

        ChatResponseDto response;

        if (Regex.IsMatch(msg, @"\b(hello|hi|hey|good morning|good evening|good afternoon|howdy)\b"))
        {
            response = new ChatResponseDto
            {
                Message = "Welcome to SkyLux! I'm SkyAssist, your personal travel companion. I can help you search flights, manage bookings, and answer travel questions. What would you like to do?",
                QuickReplies = new() { "Search Flights", "My Bookings", "Cancellation Policy", "Baggage Info" }
            };
        }
        else if (Regex.IsMatch(msg, @"\b(search|find|flight from|fly from|book a flight|show.*flight)\b") || Regex.IsMatch(msg, @"from\s+\w+\s+to\s+\w+"))
        {
            var flightMatch = Regex.Match(msg, @"(?:from|departing?)\s+([a-z]{3}|[\w\s]+?)\s+(?:to|arriving?)\s+([a-z]{3}|[\w\s]+?)(?:\s+on|\s+date|\s+\d|$)", RegexOptions.IgnoreCase);
            if (flightMatch.Success)
            {
                var fromRaw = flightMatch.Groups[1].Value.Trim().ToUpperInvariant();
                var toRaw = flightMatch.Groups[2].Value.Trim().ToUpperInvariant();
                // Search across next 14 days to find available flights
                List<FlightResultDto> flights = new();
                for (int offset = 1; offset <= 14 && !flights.Any(); offset++) {
                    var searchDto = new FlightSearchDto { From = fromRaw, To = toRaw, Date = DateTime.UtcNow.AddDays(offset), Passengers = 1 };
                    flights = await _flightService.SearchFlightsAsync(searchDto);
                }
                if (flights.Any())
                {
                    var top3 = flights.Take(3);
                    var flightList = string.Join("\n", top3.Select(f =>
                        $"✈ {f.FlightNumber} | {f.AirlineName} | {f.DepartureIATA}→{f.ArrivalIATA} | ${f.Price:N0} | {f.DepartureTime:HH:mm}-{f.ArrivalTime:HH:mm}"));
                    response = new ChatResponseDto
                    {
                        Message = $"Here are available flights from {fromRaw} to {toRaw}:\n\n{flightList}\n\nClick 'Search Flights' above for more options and to book!",
                        Type = "flights",
                        FlightResults = flights.Take(3).Select(f => (object)f).ToList(),
                        QuickReplies = new() { "Search All Flights", "Different Dates", "Round Trip" }
                    };
                }
                else
                {
                    response = new ChatResponseDto
                    {
                        Message = $"I couldn't find flights from {fromRaw} to {toRaw} for tomorrow. Try searching on our flight search page for flexible dates!",
                        QuickReplies = new() { "Search Flights", "Different Route", "Help" }
                    };
                }
            }
            else
            {
                response = new ChatResponseDto
                {
                    Message = "I'd love to help you find a flight! Please tell me your departure city/airport code, destination, and date. For example: 'flights from JFK to LHR on June 15'",
                    QuickReplies = new() { "Search All Flights", "Popular Routes", "Help" }
                };
            }
        }
        else if (Regex.IsMatch(msg, @"\b(cancel|refund|cancellation|money back)\b"))
        {
            response = new ChatResponseDto
            {
                Message = "Our cancellation policy:\n\n• 24+ hours before departure: Full refund\n• 2-24 hours before departure: 50% credit to wallet\n• Less than 2 hours: Non-refundable\n• No-shows: Non-refundable\n\nYou can cancel your booking in My Dashboard. Need help?",
                QuickReplies = new() { "Go to My Bookings", "Contact Support", "Help" }
            };
        }
        else if (Regex.IsMatch(msg, @"\b(baggage|luggage|bag|suitcase|carry.?on)\b"))
        {
            response = new ChatResponseDto
            {
                Message = "Baggage allowances:\n\n✈ Economy: 1×23kg checked + 7kg cabin\n✈ Business: 2×32kg checked + 12kg cabin\n✈ First Class: 3×32kg checked + 14kg cabin\n\nExcess baggage fees apply per kg over the limit. Fees vary by airline and route.",
                QuickReplies = new() { "Search Flights", "Booking Policy", "Help" }
            };
        }
        else if (Regex.IsMatch(msg, @"\b(check.?in|checkin|boarding pass|gate|terminal)\b"))
        {
            response = new ChatResponseDto
            {
                Message = "Online check-in:\n\n• Opens 48 hours before departure\n• Closes 2 hours before departure\n• You'll receive a boarding pass via email\n• For airport check-in: arrive 3h early for international, 2h for domestic\n\nNeed anything else?",
                QuickReplies = new() { "My Bookings", "Baggage Info", "Help" }
            };
        }
        else if (Regex.IsMatch(msg, @"\b(my booking|my flight|reservation|booking status|ticket)\b"))
        {
            response = new ChatResponseDto
            {
                Message = userId.HasValue
                    ? "You can view all your bookings in the My Bookings section of your dashboard. Would you like me to redirect you there?"
                    : "Please log in to view your bookings. Once logged in, visit My Dashboard to see all your reservations.",
                QuickReplies = new() { "Go to Dashboard", "Search Flights", "Help" }
            };
        }
        else if (Regex.IsMatch(msg, @"\b(price|cost|cheap|affordable|deal|fare|expensive)\b"))
        {
            response = new ChatResponseDto
            {
                Message = "We offer competitive fares worldwide:\n\n• Economy from $199\n• Business Class from $899\n• First Class from $1,999\n\nPrices vary by route, date, and airline. Search now to find the best deals for your journey!",
                QuickReplies = new() { "Search Flights", "Popular Routes", "Help" }
            };
        }
        else if (Regex.IsMatch(msg, @"\b(wifi|meal|food|entertainment|seat upgrade|amenities)\b"))
        {
            response = new ChatResponseDto
            {
                Message = "In-flight amenities vary by class and airline:\n\n✈ Economy: Complimentary meals on long-haul, entertainment system, standard seat\n✈ Business: Premium dining, lie-flat beds (long-haul), priority boarding, lounge access\n✈ First Class: Gourmet dining, private suites, personal concierge, exclusive lounge\n\nSpecific amenities are shown on each flight listing.",
                QuickReplies = new() { "Search Flights", "Help" }
            };
        }
        else if (Regex.IsMatch(msg, @"\b(contact|support|help|human|agent|problem|issue)\b"))
        {
            response = new ChatResponseDto
            {
                Message = "Need more help? Our support team is available 24/7:\n\n📧 Email: support@skylux.com\n📞 Phone: +1-800-SKY-LUXE\n💬 Live Chat: Available in the Help Center\n\nAverage response time: under 2 hours.",
                QuickReplies = new() { "Search Flights", "My Bookings", "FAQs" }
            };
        }
        else if (Regex.IsMatch(msg, @"\b(popular|destination|where.*go|recommend|best)\b"))
        {
            response = new ChatResponseDto
            {
                Message = "Top destinations our travelers love:\n\n🗼 New York (JFK) ↔ London (LHR)\n🏙️ Dubai (DXB) ↔ Singapore (SIN)\n🗾 Los Angeles (LAX) ↔ Tokyo (NRT)\n🌏 London (LHR) ↔ Sydney (SYD)\n🌴 Paris (CDG) ↔ Bali via Singapore\n\nWhere would you like to fly?",
                QuickReplies = new() { "Search JFK to LHR", "Search DXB to SIN", "Search All Flights" }
            };
        }
        else
        {
            response = new ChatResponseDto
            {
                Message = "I'm here to help with your travel needs! Here's what I can assist with:",
                QuickReplies = new() { "Search Flights", "Cancellation Policy", "Baggage Info", "Contact Support" }
            };
        }

        await SaveMessage(response.Message, true, null, dto.SessionId);
        return response;
    }

    private async Task SaveMessage(string message, bool isBot, int? userId, string? sessionId)
    {
        _db.ChatMessages.Add(new ChatMessage
        {
            Message = message,
            IsBot = isBot,
            UserId = userId,
            SessionId = sessionId,
            Timestamp = DateTime.UtcNow
        });
        await _db.SaveChangesAsync();
    }
}
