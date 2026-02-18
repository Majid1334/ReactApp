namespace ReactApp.Server.IncomingModels
{
    public class PromoteSubProcessModel
    {
        public required int ProcessID { get; set; }
        public required string ProcessName { get; set; }
        public required string DiagramContent { get; set; }
        public required string DiagramImage { get; set; }
    }

}