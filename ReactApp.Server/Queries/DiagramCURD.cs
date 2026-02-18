using Microsoft.Data.SqlClient;
using ReactApp.Server.Data;
using ReactApp.Server.IncomingModels;
using ReactApp.Server.OutgoingModels;

namespace ReactApp.Server.Queries
{
    public class DiagramCURD(DataContext context)
  {
        private readonly string connectionString = context.GetConnectionString();

        public async Task<IEnumerable<DiagramImageModel>> GetDiagramImage(int ProcessID)
        {
            string query = @"declare @ActualProcessID int=coalesce((select case when ReferencedTo > 0 then ReferencedTo else id end from process where id=@ProcessID),0)
                            select DiagramImage,@ActualProcessID ActualProcessID from Diagram where ProcessID = @ActualProcessID";
            using SqlConnection con = new(connectionString);
            await con.OpenAsync();
            using var cmd = new SqlCommand(query, con);

            try
            {
                var results = new List<DiagramImageModel>();
                cmd.Parameters.AddWithValue("@ProcessID", ProcessID);
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        if (reader["DiagramImage"].ToString() != null)
                        {
                            var result = new DiagramImageModel
                            {
                                DigramImage = reader["DiagramImage"].ToString(),
                                ActualProcessID = reader.GetInt32(reader.GetOrdinal("ActualProcessID"))
                            };
                            results.Add(result);
                        }
                    }
                }
                ;
                return results;
            }
            catch
            {
                throw;
            }
            finally
            {
                con?.Dispose();
            }
        }

        public async Task<IEnumerable<DiagramContentModel>> GetDiagramContent(int ProcessID)
        {
            string query = @"declare @ActualProcessID int=coalesce((select case when ReferencedTo > 0 then ReferencedTo else id end from process where id=@ProcessID), 0)
                            select DiagramContent,@ActualProcessID ActualProcessID from Diagram where ProcessID = @ActualProcessID";
            using SqlConnection con = new(connectionString);
            await con.OpenAsync();
            using var cmd = new SqlCommand(query, con);

            try
            {
                var results = new List<DiagramContentModel>();
                cmd.Parameters.AddWithValue("@ProcessID", ProcessID);
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        if (reader["DiagramContent"].ToString() != null)
                        {
                            var result = new DiagramContentModel
                            {
                                DiagramContent = reader["DiagramContent"].ToString(),
                                ActualProcessID = reader.GetInt32(reader.GetOrdinal("ActualProcessID"))
                            };
                            results.Add(result);
                        }
                    }
                };
                return results;
            }
            catch
            {
                throw;
            }
            finally
            {
                con?.Dispose();
            }
        }
        public async Task<bool> UpdDiagram(UpdDiagramContentModel reqModel)
        {
            bool result = false;
            if (reqModel.ProcessID > 0)
            {
                string query = @"update Diagram set DiagramContent=@Content, DiagramImage=@Image where ProcessID = @ProcessID";
                using SqlConnection con = new(connectionString);
                using var cmd = new SqlCommand(query, con);
                try
                {
                    cmd.Parameters.AddWithValue("@ProcessID", reqModel.ProcessID);
                    cmd.Parameters.AddWithValue("@Content", reqModel.DiagramContent);
                    cmd.Parameters.AddWithValue("@Image", reqModel.DiagramImage);
                    await con.OpenAsync();
                    var affectedRows = await cmd.ExecuteNonQueryAsync();
                    if (affectedRows > 0)
                    {
                        result = true;
                    }
                }
                catch
                {
                    throw;
                }
                finally
                {
                    con?.Dispose();
                }
            }
            return result;
        }

        public async Task<IEnumerable<ProcessDetailModel>> GetProcessDetails(ProcessIDModel reqModal)
        {
            string query = @"select p.ID,p.ParentID,p.ProcessName,p.LastModifiedDate,p.Status,
                            p.Description,pp.ProcessName ParentName,(select ProcessName from process where id=p.ReferencedTO) ReferencedTo
                            from Process p
                            left join Process pp on pp.ID=p.ParentID
                            where p.ID = @ProcessID";
            using SqlConnection con = new(connectionString);
            await con.OpenAsync();
            using var cmd = new SqlCommand(query, con);

            try
            {
                var results = new List<ProcessDetailModel>();
                cmd.Parameters.AddWithValue("@ProcessID", reqModal.ProcessID);
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var result = new ProcessDetailModel
                        {
                            ID = reader.GetInt32(reader.GetOrdinal("ID")),
                            ParentID = reader.GetInt32(reader.GetOrdinal("ParentID")),
                            ProcessName = reader["ProcessName"]?.ToString()
                        };
                        int lmdOrd = reader.GetOrdinal("LastModifiedDate");
                        result.LastModifiedDate = reader.IsDBNull(lmdOrd) ? default : reader.GetDateTime(lmdOrd);
                        result.Status = reader["Status"]?.ToString();
                        result.Description = reader["Description"]?.ToString();
                        result.ParentName = reader["ParentName"]?.ToString();
                        result.ReferencedTo = reader["ReferencedTo"]?.ToString();
                        if (result != null)
                        {
                            results.Add(result);
                        }

                    }
                }
                ;
                return results;
            }
            catch
            {
                throw;
            }
            finally
            {
                con?.Dispose();
            }
        }

        public async Task<int> UpdProcessDetail(UpdProcessModel reqModel)
        {
            int result = 0;
            string query = "";
            if (reqModel.ProcessID > 0)
            {
                query = @"update Process 
                                set ProcessName=@ProcessName,LastModifiedDate=@LastModifiedDate,Status=@Status,Description=@Description
                          where id=@ProcessID;
                          select @ProcessID ProcessID;";
            }
            if (reqModel.ProcessID == 0)
            {
                query = @"declare @NewProcessID int;
                        insert into Process (ProcessName, LastModifiedDate, Status, Description,ParentID)
                          values (@ProcessName, @LastModifiedDate, @Status, @Description,0);
                          select @NewProcessID=scope_identity();
                        insert into Diagram
                          select @NewProcessID,(select DiagramContent from Diagram where ProcessID=0),(select DiagramImage from Diagram where ProcessID=0);
                          select @NewProcessID as ProcessID;
                          ";
            }
            using SqlConnection con = new(connectionString);
            await con.OpenAsync();
            using var cmd = new SqlCommand(query, con);

            try
            {
                cmd.Parameters.AddWithValue("@ProcessID", reqModel.ProcessID);
                cmd.Parameters.AddWithValue("@ProcessName", reqModel.ProcessName);
                cmd.Parameters.AddWithValue("@LastModifiedDate", reqModel.LastModifiedDate);
                cmd.Parameters.AddWithValue("@Status", reqModel.Status);
                cmd.Parameters.AddWithValue("@Description", reqModel.Description);

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        result = reader["ProcessID"] != DBNull.Value ? Convert.ToInt32(reader["ProcessID"]) : 0;
                    }
                }
                ;
            }
            catch
            {
                throw;
            }
            finally
            {
                con?.Dispose();
            }

            return result;
        }
        public async Task<bool> PromoteSubProcesses(PromoteSubProcessModel reqModel)
        {
            bool result = false;
            if (reqModel.ProcessID > 0)
            {
                string query = @"if exists(select 1 from process where ParentID=@ProcessID and LogicallyDeleted=1 and ProcessName=@ProcessName)
                    begin  
                        declare @ErrorMessage varchar(500);
                        SET XACT_ABORT ON;
                        begin try 
                            begin transaction
                            update Process set ParentID=0, LogicallyDeleted=0 where ParentID=@ProcessID and LogicallyDeleted=1 and ProcessName=@ProcessName;
                            if @@ROWCOUNT>0 begin
                                update diagram set DiagramContent=@DiagramContent, DiagramImage=@DiagramImage where processID=@ProcessID;
                            end;
                            Commit transaction
                        end try
                        begin catch
                            if @@tranCount>0
                            begin
                                Rollback transaction
                            end;
                            select @ErrorMessage='An error occurred during promoting Subprocess'+@ProcessName+' in transaction block.'
                            RAISERROR(@ErrorMessage, 16, 1); 
                        end catch;
                        SET XACT_ABORT OFF
                    end";
                using SqlConnection con = new(connectionString);
                using var cmd = new SqlCommand(query, con);
                try
                {
                    cmd.Parameters.AddWithValue("@ProcessID", reqModel.ProcessID);
                    cmd.Parameters.AddWithValue("@ProcessName", reqModel.ProcessName);
                    cmd.Parameters.AddWithValue("@DiagramContent", reqModel.DiagramContent);
                    cmd.Parameters.AddWithValue("@DiagramImage", reqModel.DiagramImage);
                    await con.OpenAsync();
                    var affectedRows = await cmd.ExecuteNonQueryAsync();
                    if (affectedRows > 0)
                    {
                        result = true;
                    }
                }
                catch
                {
                    throw;
                }
                finally
                {
                    con?.Dispose();
                }
            }
            return result;
        }

        public async Task<bool> DemoteProcesses(DemoteProcessModel reqModel)
        {
            bool result = false;
            if (reqModel.ProcessID > 0)
            {
                string query = @"if exists(select 1 from process where ID=@DemotingProcessID and parentID=0 and LogicallyDeleted=0) or @DemotingProcessID=0
                    begin  
                        declare @ProcessUpdate int=0;
                        SET XACT_ABORT ON;
                        begin try 
                            begin transaction
                            declare @SubProcessID int=(select ID from process where ProcessName=@OldSubProcessName 
                                and LogicallyDeleted=0 and parentID=@ProcessID)
                            update process set ProcessName=@DemotingName, LastModifiedDate=getdate() where ID=@SubProcessID and LogicallyDeleted=0;
                            select @ProcessUpdate=@@ROWCOUNT
                            if @ProcessUpdate>0 and @DemotingProcessID>0 begin
                                update process set parentID=@SubProcessID where ParentID=@DemotingProcessID
                                declare @Status varchar(max)=(select Status from process where ID=@DemotingProcessID and LogicallyDeleted=0)
                                declare @Description varchar(max)=(select Description from process where ID=@DemotingProcessID and LogicallyDeleted=0)
                                update Process set ParentID=@ProcessID, LastModifiedDate=getdate(), Status=@Status, Description=@Description
                                where id=@SubProcessID and LogicallyDeleted=0;
                            end
                            if @@ROWCOUNT>0  and @DemotingProcessID>0begin
                                update Process set LogicallyDeleted=1, ProcessName=ProcessName+' Demoted', LastModifiedDate=getdate() where id=@DemotingProcessID and LogicallyDeleted=0;
                            end

                            if @@ROWCOUNT>0  or (@ProcessUpdate>0 and @DemotingProcessID=0) begin
                                update diagram set DiagramContent=@DiagramContent, DiagramImage=@DiagramImage where processID=@ProcessID;
                            end;
                            Commit transaction
                        end try
                        begin catch
                            if @@tranCount>0
                            begin
                                Rollback transaction
                            end;
                            Declare @ErrorMessage varchar(500)='An error occurred during demoting process'+@DemotingName+' in transaction block.'
                            RAISERROR(@ErrorMessage, 16, 1);
                        end catch;
                        SET XACT_ABORT OFF
                    end";
                using SqlConnection con = new(connectionString);
                using var cmd = new SqlCommand(query, con);
                try
                {
                    cmd.Parameters.AddWithValue("@ProcessID", reqModel.ProcessID);
                    cmd.Parameters.AddWithValue("@DemotingProcessID", reqModel.DemotingProcessID);
                    cmd.Parameters.AddWithValue("@OldSubProcessName", reqModel.OldName);
                    cmd.Parameters.AddWithValue("@DemotingName", reqModel.DemotingName);
                    cmd.Parameters.AddWithValue("@DiagramContent", reqModel.DiagramContent);
                    cmd.Parameters.AddWithValue("@DiagramImage", reqModel.DiagramImage);
                    await con.OpenAsync();
                    var affectedRows = await cmd.ExecuteNonQueryAsync();
                    if (affectedRows > 0)
                    {
                        result = true;
                    }
                }
                catch
                {
                    throw;
                }
                finally
                {
                    con?.Dispose();
                }
            }
            return result;
        }
        public async Task<bool> ReferenceSubProcesses(ReferencedSubProcessModel reqModel)
        {
            bool result = false;
            if (reqModel.ProcessID > 0)
            {
                string query = @"if exists(select 1 from process where ID=@ReferencedProcessID and LogicallyDeleted=0)
                    begin  
                        SET XACT_ABORT ON;
                        begin try 
                            begin transaction
                            update Process set ReferencedTo=@ReferencedProcessID where ParentID=@ProcessID and LogicallyDeleted=0 and ProcessName=@SelectedSubProcessName;
                            if @@ROWCOUNT>0 begin
                                update diagram set DiagramContent=@DiagramContent, DiagramImage=@DiagramImage where processID=@ProcessID;
                            end;
                            Commit transaction
                        end try
                        begin catch
                            if @@tranCount>0
                            begin
                                Rollback transaction
                            end;
                            Declare @ErrorMessage varchar(500)='An error occurred during Update name of the Subprocess'+@ReferencedProcessID+' in transaction block.'
                            RAISERROR(@ErrorMessage, 16, 1); 
                        end catch;
                        SET XACT_ABORT OFF
                    end";
                using SqlConnection con = new(connectionString);
                using var cmd = new SqlCommand(query, con);
                try
                {
                    cmd.Parameters.AddWithValue("@ProcessID", reqModel.ProcessID);
                    cmd.Parameters.AddWithValue("@ReferencedProcessID", reqModel.ReferencedProcessID);
                    cmd.Parameters.AddWithValue("@SelectedSubProcessName", reqModel.SelectedSubProcessName);
                    cmd.Parameters.AddWithValue("@DiagramContent", reqModel.DiagramContent);
                    cmd.Parameters.AddWithValue("@DiagramImage", reqModel.DiagramImage);
                    await con.OpenAsync();
                    var affectedRows = await cmd.ExecuteNonQueryAsync();
                    if (affectedRows > 0)
                    {
                        result = true;
                    }
                }
                catch
                {
                    throw;
                }
                finally
                {
                    con?.Dispose();
                }
            }
            return result;
        }
        public async Task<bool> CreateSubProcess(CreateSubProcessModel reqModel)
        {
            bool result = false;
            if (reqModel.ParentID > 0)
            {
                string query = @"
                if exists(select 1 from process where id=@ParentId and ReferencedTo=0) 
                begin
                    if not exists(select 1 from process where ProcessName=@ProcessName)
                    begin                    
                        SET XACT_ABORT ON;
                        begin try 
                            begin transaction
                            Declare @InsertedIDs Table (ID INT);
                            Declare @ProcID int;
                            INSERT INTO process (ParentID,ReferencedTo,ProcessName,LastModifiedDate,Status,Description,LogicallyDeleted)
                            OUTPUT INSERTED.ID INTO @InsertedIDs
                            VALUES (@ParentID, @ReferencedTo, @ProcessName, getdate(), 'Incomplete', @ProcessName, 0)
                            SELECT @ProcID=ID FROM @InsertedIDs;
                            insert into Diagram
                            select @ProcID,(select DiagramContent from Diagram where ProcessID=0),(select DiagramImage from Diagram where ProcessID=0)
                            update diagram set DiagramContent=@DiagramContent, DiagramImage=@DiagramImage where processID=@ParentID;
                            Commit transaction
                        end try
                        begin catch
                            if @@tranCount>0
                            begin
                                rollback transaction
                            end;
                            Declare @ErrorMessage varchar(500)='An error occurred during the insertion of the process'+@ProcessName+' in transaction block.'
                            RAISERROR(@ErrorMessage, 16, 1); 
                        end catch;
                        SET XACT_ABORT OFF
                    end
                end";

                using SqlConnection con = new(connectionString);
                using var cmd = new SqlCommand(query, con);
                try
                {
                    cmd.Parameters.AddWithValue("@ParentID", reqModel.ParentID);
                    cmd.Parameters.AddWithValue("@ReferencedTo", reqModel.ReferencedTo);
                    cmd.Parameters.AddWithValue("@ProcessName", reqModel.ProcessName);
                    cmd.Parameters.AddWithValue("@DiagramContent", reqModel.DiagramContent);
                    cmd.Parameters.AddWithValue("@DiagramImage", reqModel.DiagramImage);
                    await con.OpenAsync();
                    var affectedRows = await cmd.ExecuteNonQueryAsync();
                    if (affectedRows > 0)
                    {
                        result = true;
                    }
                }
                catch
                {
                    throw;
                }
                finally
                {
                    con?.Dispose();
                }
            }
            return result;
        }
        public async Task<bool> UpdtProcName(UpdSubProcModel reqModel)
        {
            bool result = false;
            if (reqModel.ProcessID > 0)
            {
                string query = @"SET XACT_ABORT ON;
                    begin try 
                        begin transaction
                        update process set ProcessName=@NewSubProcessName, LastModifiedDate=getdate() where ID=(select top 1 ID from Process where ProcessName=@OldSubProcessName and Parentid=@ProcessID) and LogicallyDeleted=0;
                        if @@ROWCOUNT>0 begin
                            update diagram set DiagramContent=@DiagramContent, DiagramImage=@DiagramImage where processID=@ProcessID;
                        end;
                        Commit transaction
                    end try
                    begin catch
                        if @@tranCount>0
                        begin
                            Rollback transaction
                        end;
                        Declare @ErrorMessage varchar(500)='An error occurred during Update name of the Subprocess'+@NewSubProcessName+' in transaction block.'
                        RAISERROR(@ErrorMessage, 16, 1); 
                    end catch;
                    SET XACT_ABORT OFF";
                using SqlConnection con = new(connectionString);
                using var cmd = new SqlCommand(query, con);
                try
                {
                    cmd.Parameters.AddWithValue("@ProcessID", reqModel.ProcessID);
                    cmd.Parameters.AddWithValue("@OldSubProcessName", reqModel.OldName);
                    cmd.Parameters.AddWithValue("@NewSubProcessName", reqModel.NewName);
                    cmd.Parameters.AddWithValue("@DiagramContent", reqModel.DiagramContent);
                    cmd.Parameters.AddWithValue("@DiagramImage", reqModel.DiagramImage);
                    await con.OpenAsync();
                    var affectedRows = await cmd.ExecuteNonQueryAsync();
                    if (affectedRows > 0)
                    {
                        result = true;
                    }
                }
                catch
                {
                    throw;
                }
                finally
                {
                    con?.Dispose();
                }
            }
            return result;
        }

        public async Task<bool> DeleteSubProcess(DeleteSubProcessModel reqModel)
        {
            bool result = false;
            if (reqModel.ProcessID > 0)
            {
                string query = @"
                    declare @SubProcID int=coalesce((select top 1 ID from Process where ProcessName=@SubProcessName and Parentid=@ProcessID and LogicallyDeleted=0), 0);
                    declare @existanceError varchar(max)='';
                    if @SubProcID=0  
                    begin
                        select @existanceError='Subprocess '''+@SubProcessName+''' does not exists, deletion failed.';
                        RAISERROR(@existanceError, 16, 1);
                    end else 
                    if exists(select 1 from Process where ReferencedTo=@SubProcID)
                    begin
                        select @existanceError='Subprocess '''+@SubProcessName+''' is referenced by other processes, deletion failed.';
                        RAISERROR(@existanceError, 16, 1);
                    end else
                    begin
                        SET XACT_ABORT ON;
                        begin try 
                            begin transaction
                            update process set logicallyDeleted=case when @Promote=0 then 1 else 0 end, ParentID=case when @Promote=0 then ParentID else 0 end, LastModifiedDate=getdate()
                            where ID=@SubProcID 
                                and logicallyDeleted=0;
                            if @@ROWCOUNT>0 begin
                                update diagram set DiagramContent=@DiagramContent, DiagramImage=@DiagramImage where processID=@ProcessID;
                            end;
                            Commit transaction
                        end try
                        begin catch
                            if @@tranCount>0
                            begin
                                Rollback transaction
                            end;
                            Declare @ErrorMessage varchar(500)='An error occurred during deletion of the Subprocess'+@SubProcessName+' in transaction block.'
                            RAISERROR(@ErrorMessage, 16, 1); 
                        end catch;
                        SET XACT_ABORT OFF
                    end";
                using SqlConnection con = new(connectionString);
                using var cmd = new SqlCommand(query, con);
                try
                {
                    cmd.Parameters.AddWithValue("@Promote", reqModel.Promote);
                    cmd.Parameters.AddWithValue("@ProcessID", reqModel.ProcessID);
                    cmd.Parameters.AddWithValue("@SubProcessName", reqModel.SubProcessName);
                    cmd.Parameters.AddWithValue("@DiagramContent", reqModel.DiagramContent);
                    cmd.Parameters.AddWithValue("@DiagramImage", reqModel.DiagramImage);
                    await con.OpenAsync();
                    var affectedRows = await cmd.ExecuteNonQueryAsync();
                    if (affectedRows > 0)
                    {
                        result = true;
                    }
                }
                catch
                {
                    throw;
                }
                finally
                {
                    con?.Dispose();
                }
            }
            return result;
        }
        public async Task<IEnumerable<string>> GetProcessTree(ProcessWithExclusionModel reqModel)
        {
            //for security purpose, we need to get the list of processes that the logged in person has access to them
            //then we need a join between process and person table, because this is not an actual one I did not do that.
            string query = @"Exec GetProcessTree @PersonID, @ExcludedProcessID, @ExcludeSubProcessName, @OnlyThisProcessID";
            using SqlConnection con = new(connectionString);
            await con.OpenAsync();
            using var cmd = new SqlCommand(query, con);

            try
            {
                var results = new List<string>();
                cmd.Parameters.AddWithValue("@PersonID", reqModel.PersonID);
                cmd.Parameters.AddWithValue("@ExcludedProcessID", reqModel.ExcludedProcessID);
                cmd.Parameters.AddWithValue("@ExcludeSubProcessName", reqModel.ExcludeSubProcessName);
                cmd.Parameters.AddWithValue("@OnlyThisProcessID", reqModel.OnlyThisProcessID);
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var result = reader["ProcessTree"].ToString();
                        if (result != null)
                        {
                            results.Add(result);
                        }
                    }
                }
                ;
                return results;
            }
            catch
            {
                throw;
            }
            finally
            {
                con?.Dispose();
            }
        }
        public async Task<IEnumerable<MyProcessModel>> GetMyProcesses(ProcessWithExclusionModel reqModel)
        {
            string query = @"select ProcessName,ID ProcessID 
                            from process p
                            where ParentID=0
                                and LogicallyDeleted=0
                                and ReferencedTo=0
                                and ID<>@ProcessID
                                and ID<>(select Id from process where ProcessName=@ProcessName)";
            //I have used this sub query to exclude only the parent of the give sub process, 
            //there is a possibilty of having the same name on different processes
            using SqlConnection con = new(connectionString);
            await con.OpenAsync();
            using var cmd = new SqlCommand(query, con);

            try
            {
                var results = new List<MyProcessModel>();
                cmd.Parameters.AddWithValue("@ProcessName", reqModel.ExcludeSubProcessName);
                cmd.Parameters.AddWithValue("@ProcessID", reqModel.ExcludedProcessID);
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        if (reader["ProcessName"].ToString() != null)
                        {
                            var result = new MyProcessModel
                            {
                                ProcessName = reader["ProcessName"].ToString(),
                                ProcessID = reader.GetInt32(reader.GetOrdinal("ProcessID"))
                            };
                            results.Add(result);
                        }
                    }
                };
                return results;
            }
            catch
            {
                throw;
            }
            finally
            {
                con?.Dispose();
            }
        }


    }
}
