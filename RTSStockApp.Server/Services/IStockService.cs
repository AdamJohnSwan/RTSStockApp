namespace RTSStockApp.Server.Services;

public interface IStockService
{
    Task<decimal?> GetStockPrice(string stockSymbol);
}