namespace ReactApp.Server.IncomingModels
{
    public class UpdDiagramContentModel
    {   
        public required int ProcessID { get; set; }
        public required string DiagramContent { get; set; }
        public required string DiagramImage { get; set; }
    }
}
