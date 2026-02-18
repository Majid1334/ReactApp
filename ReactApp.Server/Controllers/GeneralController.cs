using Microsoft.AspNetCore.Mvc;
using ReactApp.Server.Data;
using ReactApp.Server.IncomingModels;
namespace ReactApp.Server.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class GeneralController(DataContext context) : ControllerBase
    {
        private readonly DataContext _context = context;

        [HttpPost]
        public async Task<IActionResult> GetDashboardPanels([FromBody] PersonIDModel reqModel)
        {
            var Dashboard = new ReactApp.Server.Queries.DashboardCURD(_context);
            var DashboardPanels = await Dashboard.GetDashboardPanel(reqModel.PersonID);
            return Ok(DashboardPanels);
        }

        [HttpPost]
        public async Task<ActionResult> UpdateUsersDashboard([FromBody] DashboardUpdateModel reqModel)
        {
            var Dashboard = new ReactApp.Server.Queries.DashboardCURD(_context);
            var TrueFalse = await Dashboard.UpdateUserDashboard(reqModel);
            return Ok(TrueFalse);
        }

    }
}
