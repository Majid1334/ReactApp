namespace ReactApp.Server.IncomingModels
{
    public class UpdSubProcModel
    {
        public required int ProcessID { get; set; }
        public required string OldName { get; set; }
        public required string NewName { get; set; }
        public required string DiagramContent { get; set; }
        public required string DiagramImage { get; set; }
    }
}