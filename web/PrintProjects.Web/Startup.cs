using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using PrintProjects.Core.Interfaces;
using PrintProjects.Mongo;

namespace PrintProjects.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var settings = new Settings();
            new ConfigureFromConfigurationOptions<Settings>(Configuration.GetSection("3D2P"))
                .Configure(settings);

            services.AddSingleton(settings);
            services.AddSingleton<IDatabase>(new MongoDatabase(settings.ConnectionString, settings.Database));

            services.AddRazorPages(); 
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "3D Print Project API", Version = "v1" });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseStatusCodePagesWithReExecute("/Error", "?code={0}");
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapControllers();
            });
        }

        public IConfiguration Configuration { get; }
    }
}
