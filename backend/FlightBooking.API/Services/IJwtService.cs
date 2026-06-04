using FlightBooking.API.Models;

namespace FlightBooking.API.Services;

public interface IJwtService
{
    string GenerateToken(User user);
    int? ValidateToken(string token);
}
