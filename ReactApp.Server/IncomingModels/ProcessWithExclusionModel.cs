    namespace ReactApp.Server.IncomingModels
{
    public class ProcessWithExclusionModel
    {
        public required int PersonID { get; set; }
        public required int ExcludedProcessID { get; set; }
        public required string ExcludeSubProcessName { get; set; }
        public required int OnlyThisProcessID { get; set; }
    }
}