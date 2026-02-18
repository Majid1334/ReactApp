namespace ReactApp.Server.IncomingModels
{
    public class DeleteSubProcessModel
    {
        public required int Promote { get; set; }
        public required int ProcessID { get; set; }
        public required string SubProcessName { get; set; }
        public required string DiagramContent { get; set; }
        public required string DiagramImage { get; set; }
    }
}
