using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NLog;

namespace API.Controllers;

[ApiController]
public class TokenController : ControllerBase
{
    protected readonly IConfiguration _configuration;
    private readonly Logger _logger;

    public TokenController(IConfiguration configuration)
    {
        _logger = NLog.LogManager.GetCurrentClassLogger();
        _configuration = configuration;
    }

    [Route("touch")]
    [Authorize]
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SuccessDTO), StatusCodes.Status200OK)]
    public IActionResult Get()
    {
        return Ok(new SuccessDTO() { Success = true });
    }
}