namespace FlightBooking.API.DTOs.Chat;

public class ChatMessageDto
{
    public string Message { get; set; } = string.Empty;
    public string? SessionId { get; set; }
}
