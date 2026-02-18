namespace ReactApp.Server.IncomingModels
{
    public class DashboardUpdateModel
    {
        public int UserID { get; set; }
        public List<DashboardPanel>? UserPanelList { get; set; }  
    }
    public class DashboardPanel
    {
        public required string ID { get; set; }
        public required int SizeX { get; set; }
        public required int SizeY { get; set; }
        public required int Row { get; set; }
        public required int Col { get; set; }
        public required string Content { get; set; }
        public required string Header { get; set; }
    }
}
