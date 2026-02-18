namespace ReactApp.Server.IncomingModels
{
    public class CreateSubProcessModel
    {
        public required int ParentID { get; set; }
        public required int ReferencedTo { get; set; }
        public required string ProcessName { get; set; }
        public required string DiagramContent { get; set; }
        public required string DiagramImage { get; set; }

    }
}
