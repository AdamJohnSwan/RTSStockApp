using Microsoft.Extensions.Options;
using RTSStockApp.Server.Configuration;
using RTSStockApp.Server.Models;

namespace RTSStockApp.Server.Services;

public class StockService : IStockService
{
    private readonly IOptions<FinnHubSettings> _finnHubSettings;
    private readonly HttpClient _finnHubClient;

    public StockService(
        HttpClient finnHubClient,
        IOptions<FinnHubSettings> finnHubSettings)
    {
        _finnHubSettings = finnHubSettings;
        _finnHubClient = finnHubClient;
    }

    public async Task<decimal?> GetStockPrice(string stockSymbol)
    {
        FinnHubQuoteResponse result =
            await _finnHubClient.GetFromJsonAsync<FinnHubQuoteResponse>($"quote?symbol={stockSymbol}&token={_finnHubSettings.Value.ApiKey}")
            ?? throw new ArgumentException($"Invalid stock symbol");

        // Finnhub doesn't throw an error when the symbol is invalid. It just returns 0 or null for everything.
        // Since timestamp should never be 0, we can use that to check if the symbol is valid
        if (result.T == 0)
        {
            return null;
        }

        return result.C;
    }
}
