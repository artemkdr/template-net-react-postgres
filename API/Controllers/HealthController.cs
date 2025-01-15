using Microsoft.AspNetCore.Mvc;
using NLog;

namespace API.Controllers;

[ApiController]
public class HealthController : ControllerBase
{
    protected readonly IConfiguration _configuration;
    private readonly Logger _logger;
    
    public HealthController(IConfiguration configuration)
    {    
        _configuration = configuration;
        _logger = NLog.LogManager.GetCurrentClassLogger();
    }

    [Route("health")]    
    [HttpGet]
    [ProducesResponseType(typeof(SuccessDTO), StatusCodes.Status200OK)]
    public IActionResult Get()
    {
        return Ok(new SuccessDTO() { Success = true });
    }
}