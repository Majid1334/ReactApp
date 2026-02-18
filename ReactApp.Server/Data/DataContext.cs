using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System.Data.Common;

namespace ReactApp.Server.Data
{
    public class DataContext(IConfiguration config) : DbContext
    {
        private readonly string connectionId = "TestDB";
        private readonly IConfiguration _config = config;

    public string GetConnectionString()
        {
            string? constr = _config.GetSection("ConnectionStrings")[connectionId];
            if (constr != null)
            {
                return new SqlConnectionStringBuilder(constr).ConnectionString;
            }
            else return "";
        }
    }
}
