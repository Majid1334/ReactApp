using ReactApp.Server.Data;

HostApplicationBuilder hostbuilder = Host.CreateApplicationBuilder(args);
IConfiguration config = new ConfigurationBuilder()
                .AddUserSecrets<Program>()
                .Build();
string? aiKey = config["SecretKeys:AI_KEY"];
string? aiURI = config["secretKeys:AI_URI"];
if (string.IsNullOrEmpty(aiKey))
{
    aiKey="";
}
if (string.IsNullOrEmpty(aiURI))
{
    aiURI = "";
}
 
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddKeyedSingleton<string>("AiKey", aiKey);
builder.Services.AddKeyedSingleton<string>("AiURI", aiURI);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(
    p =>
        p.AddPolicy(
            "CorsPolicy",
            builder =>
            {
                builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            }
        )
);

builder.Services.AddTransient<DataContext, DataContext>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
