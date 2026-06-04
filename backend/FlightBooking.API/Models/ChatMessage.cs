namespace FlightBooking.API.Models;

public class ChatMessage
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public User? User { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool IsBot { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string? SessionId { get; set; }
}
