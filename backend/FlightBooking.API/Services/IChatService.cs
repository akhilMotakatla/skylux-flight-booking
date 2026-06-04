using FlightBooking.API.DTOs.Chat;

namespace FlightBooking.API.Services;

public interface IChatService
{
    Task<ChatResponseDto> ProcessMessageAsync(ChatMessageDto dto, int? userId);
}
