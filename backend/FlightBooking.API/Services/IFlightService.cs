using FlightBooking.API.DTOs.Flights;

namespace FlightBooking.API.Services;

public interface IFlightService
{
    Task<List<FlightResultDto>> SearchFlightsAsync(FlightSearchDto dto);
    Task<FlightResultDto?> GetFlightByIdAsync(int id);
}
