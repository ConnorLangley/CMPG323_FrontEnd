using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Azure.Storage.Blobs;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddControllers(); // Register controllers for API endpoints
builder.Services.AddHttpClient();
builder.Services.AddSingleton(x => new BlobServiceClient(builder.Configuration.GetSection("AzureStorage")["ConnectionString"])); // Correct BlobServiceClient registration

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Correctly register Swagger services

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Global exception handler middleware for catching unexpected exceptions and returning JSON
app.Use(async (context, next) =>
{
    try
    {
        await next.Invoke();
    }
    catch (Exception ex)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;

        var errorMessage = new { Status = $"An unexpected server error occurred: {ex.Message}" };
        var errorJson = System.Text.Json.JsonSerializer.Serialize(errorMessage);

        await context.Response.WriteAsync(errorJson);
    }
});

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

// Swagger middleware setup
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
});

// Configure the endpoints
app.UseEndpoints(endpoints =>
{
    // Map Razor Pages
    endpoints.MapRazorPages();

    // Map API controllers
    endpoints.MapControllers();

    // Optionally map MVC routes if using them
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");
});

app.Run();