using Microsoft.Data.SqlClient;
using ReactApp.Server.Data;
using ReactApp.Server.IncomingModels;
using ReactApp.Server.OutgoingModels;
using System.Text;

namespace ReactApp.Server.Queries
{
    public class DashboardCURD(DataContext context)
    {
        private readonly string connectionString = context.GetConnectionString();

        public async Task<IEnumerable<DashboardUserModel>> GetDashboardPanel(int PersonID)
        {
            string query = @"select ID,sizeX,sizeY,row,col,content,header from DashboardUsers where UserID=@PersonID";
            string querytemplate = @"select ID,sizeX,sizeY,row,col,content,header from DashboardTemplate where DefaultSelection=1";
            using SqlConnection con = new(connectionString);
            await con.OpenAsync();
            var cmd = new SqlCommand(query, con);
            try
            {
                var results = new List<DashboardUserModel>();
                var param = new SqlParameter("@PersonID", PersonID);
                cmd.Parameters.Add(param);
                var reader = await cmd.ExecuteReaderAsync();
                if (!reader.HasRows)
                {
                    reader.Close();
                    cmd = new SqlCommand(querytemplate, con);
                    reader = await cmd.ExecuteReaderAsync();
                }

                while (await reader.ReadAsync())
                {
                    var result = new DashboardUserModel
                    {
                        ID = reader["ID"].ToString(),
                        SizeX = reader.GetByte(reader.GetOrdinal("sizeX")),
                        SizeY = reader.GetByte(reader.GetOrdinal("sizeY")),
                        Row = reader.GetByte(reader.GetOrdinal("Row")),
                        Col = reader.GetByte(reader.GetOrdinal("Col")),
                        Content = reader["Content"].ToString(),
                        Header = reader["Header"].ToString()
                    };
                    if (result != null)
                    {
                        results.Add(result);
                    }
                }
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
        public async Task<bool> UpdateUserDashboard(DashboardUpdateModel reqModel)
        {
            StringBuilder stringBuilder = new();
            bool result = false;
            if (reqModel.UserPanelList != null)
            {

                stringBuilder.Append("SET XACT_ABORT ON; ~~");
                stringBuilder.Append("begin transaction ~~");
                stringBuilder.Append("begin try ~~");
                stringBuilder.Append("delete from DashboardUsers where UserID=" + reqModel.UserID + "~~");
                foreach (DashboardPanel panel in reqModel.UserPanelList)
                {
                    stringBuilder.Append("insert into DashboardUsers ~~");
                    stringBuilder.Append("select " + reqModel.UserID.ToString() + ", '" +
                        panel.ID + "', " + panel.SizeX.ToString() + ", " + panel.SizeY.ToString() + ", " + panel.Row.ToString() + ", " +
                        panel.Col.ToString() + ", '" + panel.Content.Replace("'", "''") + "', '" + panel.Header.Replace("'", "''") + "'~~");
                }
                stringBuilder.Append("  commit transaction ~~");
                stringBuilder.Append("end try~~");
                stringBuilder.Append("begin catch~~");
                stringBuilder.Append("  rollback transaction ~~");
                stringBuilder.Append("  insert into DashboardErrors (ErrorMessage) select 'Database Rolled back' + coalesce(convert(varchar, ERROR_NUMBER()),'') + coalesce(ERROR_MESSAGE(),'') ~~");
                stringBuilder.Append("end catch~~");
                string query = stringBuilder.ToString().Replace("~~", "\n");

                using SqlConnection con = new(connectionString);
                {
                    await con.OpenAsync();
                    using var tran = con.BeginTransaction();
                    using var cmd = new SqlCommand(query, con, tran);
                    try
                    {
                        var affectedRows = await cmd.ExecuteNonQueryAsync();
                        if (affectedRows > 0)
                        {
                            result = true;
                        }
                        tran.Commit();
                    }
                    catch
                    {
                        tran.Rollback();
                        throw;
                    }
                    finally
                    {
                        con?.Dispose();
                    }
                }
            }
            return result;
        }

    }

}

