using FlightBooking.API.DTOs.Bookings;

namespace FlightBooking.API.Services;

public interface IBookingService
{
    Task<BookingResponseDto> CreateBookingAsync(CreateBookingDto dto, int userId);
    Task<List<BookingResponseDto>> GetUserBookingsAsync(int userId);
    Task<bool> CancelBookingAsync(int bookingId, int userId);
}
