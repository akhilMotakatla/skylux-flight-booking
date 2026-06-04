using System.Security.Claims;
using FlightBooking.API.DTOs.Chat;
using FlightBooking.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace FlightBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;

    public ChatController(IChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpPost("message")]
    public async Task<IActionResult> SendMessage([FromBody] ChatMessageDto dto)
    {
        int? userId = null;
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (sub != null && int.TryParse(sub, out var id)) userId = id;

        var response = await _chatService.ProcessMessageAsync(dto, userId);
        return Ok(response);
    }
}
