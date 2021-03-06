using System.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using DatingApp.API.Helpers;
using AutoMapper;

namespace DatingApp.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

             //faille xss
            services.AddCors();
           // AutoMapper est un outil permettant de définir une stratégie de mapping objet-objet.
            services.AddAutoMapper(typeof(DatingRepository).Assembly);
             //initialisationdes controllers
            services.AddControllers().AddNewtonsoftJson(opt => 
            {
                opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });

            services.AddTransient<Seed>();
     

            
                  services.AddAuthentication( opt => {
                 opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                 opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })

            .AddJwtBearer(options => {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters 
                {
                    ValidateIssuerSigningKey = true,
                     IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    
                };
            });
            //L’inscription ajuste la durée de vie du service à la durée de vie d’une requête unique. 
            services.AddScoped<IauthRepository, AuthRepository>();
            services.AddScoped< IDatingRepository, DatingRepository>();
           
            services.AddDbContext<DataContext>( connect => connect.UseSqlite
            (Configuration.GetConnectionString("DefaultConnection")));
            services.AddControllers().AddNewtonsoftJson();
           
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }else
    {
        app.UseExceptionHandler(builder => {

            builder.Run(async context => {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                var error = context.Features.Get<IExceptionHandlerFeature>();

                if(error != null)
                {
                    context.Response.AddApplicationError(error.Error.Message);
                    await context.Response.WriteAsync(error.Error.Message);
                }
            });
        });
        //app.UseHsts();
    }
        
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseHttpsRedirection();
 
            app.UseRouting();
            app.UseAuthentication(); 
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
