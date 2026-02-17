using API.Common;
using API.Core.DTOs.AI;
using API.Services;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AiController : ControllerBase
    {
        private readonly IAiService _aiService;

        public AiController (IAiService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] AiChatRequestDto request)
        {
            if (request is null || !request.Messages.Any())
                return BadRequest("Response cannot be empty");

            try
            {
                var result = await _aiService.ChatAsync(request);
                return Ok(Response<string>.Success(result, "AI response received successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, Response<string>.Failure($"AI Error: {ex.Message}"));
            }

        }
    }
}
