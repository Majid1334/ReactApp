using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp.Server.Data;
using ReactApp.Server.IncomingModels;

namespace ReactApp.Server.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class AiController : ControllerBase
    {
        private readonly string _aiKey;
        public AiController([FromKeyedServices("AiKey")] string aiKey)
        {
            _aiKey = aiKey;
         }
        [HttpPost]
        [ActionName("GetProcessDiagram")]
        public async Task<IActionResult> GetProcessDiagram([FromBody] AiProcessNameModel reqModel)
        {
            var ai = new ReactApp.Server.Queries.AIClass();
            var result = await ai.GetProcessDiagram(reqModel.ProcessName, _aiKey);
            return Ok(result);
        }
        
    }
}
