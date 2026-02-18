namespace ReactApp.Server.IncomingModels
{
    public class ReferencedSubProcessModel
    {
        public required int ProcessID { get; set; }
        public required int ReferencedProcessID { get; set; }
        public required string ReferencedName { get; set; }
        public required string SelectedSubProcessName { get; set; }
        public required string DiagramContent { get; set; }
        public required string DiagramImage { get; set; }
    }
}
