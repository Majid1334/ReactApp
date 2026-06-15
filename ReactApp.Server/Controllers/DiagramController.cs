using Microsoft.AspNetCore.Mvc;
using ReactApp.Server.Data;
using ReactApp.Server.IncomingModels;

namespace ReactApp.Server.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class DiagramController : Controller
    {
        private readonly DataContext _context;

        public DiagramController(DataContext context)
        {
            _context = context;
        }

        [HttpPost]
        [ActionName("UpdateProcessesDetails")]
        public async Task<IActionResult> UpdateProcessesDetails([FromBody] UpdProcessModel reqModel)
        {
            var Diagram = new ReactApp.Server.Queries.DiagramCURD(_context);
            var processDetails = await Diagram.UpdProcessDetail(reqModel);
            return Ok(processDetails);
        }

        [HttpPost]
        [ActionName("GetProcessesDetails")]
        public async Task<IActionResult> GetProcessesDetails([FromBody] ProcessIDModel reqModel)
        {
            var Diagram = new ReactApp.Server.Queries.DiagramCURD(_context);
            var processDetails = await Diagram.GetProcessDetails(reqModel);
            return Ok(processDetails);
        }

        [HttpPost]
        [ActionName("GetDiagramImage")]
        public async Task<IActionResult> GetDiagramImage([FromBody] ProcessIDModel reqModel)
        {
            var Diagram = new ReactApp.Server.Queries.DiagramCURD(_context);
            var result = await Diagram.GetDiagramImage(reqModel.ProcessID);
            return Ok(result);
        }

        [HttpPost]
        [ActionName("GetDiagramContent")]
        public async Task<IActionResult> GetDiagramContent([FromBody] ProcessIDModel reqModel)
        {
            var Diagram = new ReactApp.Server.Queries.DiagramCURD(_context);
            var result = await Diagram.GetDiagramContent(reqModel.ProcessID);
            return Ok(result);
        }
        [HttpPost]
        [ActionName("UpdtDiagram")]
        public async Task<IActionResult> UpdtDiagram([FromBody] UpdDiagramContentModel reqModel)
        {
            var Diagram = new ReactApp.Server.Queries.DiagramCURD(_context);
            var result = await Diagram.UpdDiagram(reqModel);
            return Ok(result);
        }
        [HttpPost]
        [ActionName("PromoteSubProcesses")]
        public async Task<IActionResult> PromoteSubProcesses([FromBody] PromoteSubProcessModel reqModel)
        {
            var Diagram = new ReactApp.Server.Queries.DiagramCURD(_context);
            var promoteSubOroc = await Diagram.PromoteSubProcesses(reqModel);
            return Ok(promoteSubOroc);
        }
        [HttpPost]
        [ActionName("DemoteProcesses")]
        public async Task<IActionResult> DemoteProcesses([FromBody] DemoteProcessModel reqModel)
        {
            var Diagram = new ReactApp.Server.Queries.DiagramCURD(_context);
            var demoteProcess = await Diagram.DemoteProcesses(reqModel);
            return Ok(demoteProcess);
        }
        [HttpPost]
        [ActionName("ReferencedSubProcesses")]
        public async Task<IActionResult> ReferencedSubProcesses([FromBody] ReferencedSubProcessModel reqModel)
        {
            var Diagram = new ReactApp.Server.Queries.DiagramCURD(_context);
            var ReferenceSubOroc = await Diagram.ReferenceSubProcesses(reqModel);
            return Ok(ReferenceSubOroc);
        }
        [HttpPost]
        [ActionName("UpdtProcName")]
        public async Task<IActionResult> UpdtProcName([FromBody] UpdSubProcModel reqModel)
        {
            var Diagram = new ReactApp.Server.Queries.DiagramCURD(_context);
            var result = await Diagram.UpdtProcName(reqModel);
            return Ok(result);
        }
        [HttpPost]
        [ActionName("CreateSubProcess")]
        public async Task<IActionResult> CreateSubProcess([FromBody] CreateSubProcessModel reqModel)
        {
            var Diagram = new ReactApp.Server.Queries.DiagramCURD(_context);
            var result = await Diagram.CreateSubProcess(reqModel);
            return Ok(result);
        }

        [HttpPost]
        [ActionName("DeleteSubProcess")]
        public async Task<IActionResult> DeleteSubProcess([FromBody] DeleteSubProcessModel reqModel)
        {
            var Diagram = new ReactApp.Server.Queries.DiagramCURD(_context);
            var result = await Diagram.DeleteSubProcess(reqModel);
            return Ok(result);
        }
        [HttpPost]
        [ActionName("GetProcessTree")]
        public async Task<IActionResult> GetProcessTree([FromBody] ProcessWithExclusionModel reqModel)
        {
            var Diagram = new ReactApp.Server.Queries.DiagramCURD(_context);
            var result = await Diagram.GetProcessTree(reqModel);
            return Ok(result);
        }
        [HttpPost]
        [ActionName("GetMyProcesses")]
        public async Task<IActionResult> GetMyProcesses([FromBody] ProcessWithExclusionModel reqModel)
        {
            var Diagram = new ReactApp.Server.Queries.DiagramCURD(_context);
            var result = await Diagram.GetMyProcesses(reqModel);
            return Ok(result);
        }

    }
}


