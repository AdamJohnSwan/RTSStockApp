using Microsoft.AspNetCore.Mvc;
using Moq;
using RTSStockApp.Server.Controllers;
using RTSStockApp.Server.Models;
using RTSStockApp.Server.Services;

namespace RTSStockApp.Server.Test;
public class StockControllerTest
{
    [Fact]
    public async Task EnsureGetStockPrice()
    {
        // Arrange
        Mock<IStockService> mockStockService = new();
        decimal expectedPrice = 123.45m;
        mockStockService.Setup(x => x.GetStockPrice(It.IsAny<string>())).ReturnsAsync(expectedPrice);
        StockController controller = new(mockStockService.Object);

        // Act
        IActionResult result = await controller.GetStock("AAPL");

        // Assert
        OkObjectResult okResult = Assert.IsType<OkObjectResult>(result);
        StockResponse stockResponse = Assert.IsType<StockResponse>(okResult.Value);
        Assert.Equal(expectedPrice, stockResponse.Current);
    }

    [Fact]
    public async Task EnsureGetStockPrice_InvalidSymbol_ReturnsNotFound()
    {
        // Arrange
        Mock<IStockService> mockStockService = new();
        mockStockService.Setup(x => x.GetStockPrice(It.IsAny<string>())).ReturnsAsync((decimal?)null);
        StockController controller = new(mockStockService.Object);

        // Act
        IActionResult result = await controller.GetStock("INVALID");

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }
}
