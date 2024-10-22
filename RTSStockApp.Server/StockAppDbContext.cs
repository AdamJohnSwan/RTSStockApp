using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace RTSStockApp.Server;

public class StockAppDbContext : IdentityDbContext<IdentityUser>
{
    public StockAppDbContext(DbContextOptions<StockAppDbContext> options) :
        base(options)
    { }
}
