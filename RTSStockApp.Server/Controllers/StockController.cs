using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RTSStockApp.Server.Models;
using RTSStockApp.Server.Services;

namespace RTSStockApp.Server.Controllers;

[ApiController]
[Route("api/v1/stock")]
[Authorize]
public class StockController(IStockService stockService) : ControllerBase
{
    private readonly IStockService _stockService = stockService;

    [HttpGet("{stock}")]
    [ProducesResponseType(typeof(decimal), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetStock([FromRoute] string stock)
    {
        decimal? stockPrice = await _stockService.GetStockPrice(stock);
        if (stockPrice == null)
        {
            return NotFound();
        }
        return Ok(new StockResponse(stockPrice.Value));
    }
}
