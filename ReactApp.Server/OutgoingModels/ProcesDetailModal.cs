using System;

namespace ReactApp.Server.OutgoingModels
{
    public class ProcessDetailModel
    {
        public int? ID { get; set; }
        public int? ParentID { get; set; }
        public string? ProcessName { get; set; }
        public DateTime? LastModifiedDate { get; set; }
        public string? Status { get; set; }
        public string? Description { get; set; }
        public string? ParentName { get; set; }
        public string? ReferencedTo { get; set; }
    }
}
