namespace ReactApp.Server.IncomingModels
{
    public class UpdProcessModel
    {
        public required int ProcessID { get; set; }
        public required string ProcessName { get; set; }
        public required DateTime LastModifiedDate { get; set; }
        public required string Status { get; set; }
        public required string Description { get; set; }
    }
}
