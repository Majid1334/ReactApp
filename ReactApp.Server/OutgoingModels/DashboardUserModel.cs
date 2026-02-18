namespace ReactApp.Server.OutgoingModels
{
    public class DashboardUserModel
    {
        public string? ID { get; set; }
        public int SizeX { get; set; }
        public int SizeY { get; set; }
        public int Row { get; set; }
        public int Col { get; set; }
        public string? Content { get; set; }
        public string? Header { get; set; }

    }
}
