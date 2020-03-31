using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
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
            Settings = new Settings();
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            new ConfigureFromConfigurationOptions<Settings>(Configuration.GetSection("3D2P"))
                .Configure(Settings);

            services.AddSingleton(Settings);
            services.AddSingleton<IDatabase>(new MongoDatabase(Settings.ConnectionString, Settings.Database));

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

            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Settings.ProjectTargetPath),
                RequestPath = "/ProjectFiles"
            });
            app.UseStatusCodePagesWithReExecute("/Error", "?code={0}");
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "3D2P API V1");
            });
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapControllers();
            });
        }

        public Settings Settings { get; }
        public IConfiguration Configuration { get;}
    }
}
