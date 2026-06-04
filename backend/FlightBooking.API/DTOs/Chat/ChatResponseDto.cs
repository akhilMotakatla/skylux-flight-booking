namespace FlightBooking.API.DTOs.Chat;

public class ChatResponseDto
{
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "text";
    public List<object>? FlightResults { get; set; }
    public List<string>? QuickReplies { get; set; }
}
