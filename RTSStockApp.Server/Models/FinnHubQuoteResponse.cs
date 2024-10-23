namespace RTSStockApp.Server.Models;

public class FinnHubQuoteResponse
{
    /// <summary>
    /// Current price
    /// </summary>
    public decimal C { get; set; }

    /// <summary>
    /// Change
    /// </summary>
    public decimal? D { get; set; }

    /// <summary>
    /// Percent change
    /// </summary>
    public decimal? Dp { get; set; }

    /// <summary>
    /// High price of the day
    /// </summary>
    public decimal H { get; set; }

    /// <summary>
    /// Low price of the day
    /// </summary>
    public decimal L { get; set; }

    /// <summary>
    /// Open price of the day
    /// </summary>
    public decimal O { get; set; }

    /// <summary>
    /// Previous close price
    /// </summary>
    public decimal Pc { get; set; }

    /// <summary>
    /// Timestamp
    /// </summary>
    public long T { get; set; }
}
