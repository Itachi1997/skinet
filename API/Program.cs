using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            // As we are in program.cs file Asp.net Cannot controll the scope of instances so we control it by putting it in USING.
            using (var scope = host.Services.CreateScope())
            {
                var Services = scope.ServiceProvider;
                //Get Logger Service as it is no available in Program.cs 
                var loggerFactory = Services.GetRequiredService<ILoggerFactory>();
                // We Dont have Exception handling provided by ASP.Net in Program File So we put it in Try Catch and catch exceptions ourself
                try
                {
                    // getting context
                    var context = Services.GetRequiredService<StoreContext>();
                    // MigrateAsync Method will apply pending migration and create Database if it doesnt exsist
                    await context.Database.MigrateAsync();
                    // Seed Data to work with something
                    await StoreContextSeed.SeedAsync(context,loggerFactory);
                }
                catch (Exception ex)
                {
                    var logger = loggerFactory.CreateLogger<Program>();
                    logger.LogError(ex, "An error occured during migration");
                }
            }

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
