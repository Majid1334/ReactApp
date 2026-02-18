namespace ReactApp.Server.IncomingModels
{
    public class DemoteProcessModel
    {
        public required int ProcessID { get; set; }
        public required int DemotingProcessID { get; set; }
        public required string OldName { get; set; }
        public required string DemotingName { get; set; }
        public required string DiagramContent { get; set; }
        public required string DiagramImage { get; set; }
    }
}
