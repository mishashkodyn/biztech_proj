using API.Common;
using API.Core.DTOs.Notifications;
using API.Core.DTOs.PsychologistApplication;
using API.Core.Entities;
using API.Extentions;
using API.Infrastructure.Data;
using API.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;
        private readonly UserManager<ApplicationUser> _userManager;

        public ApplicationsController(ApplicationDbContext context, IMapper mapper, INotificationService notificationService,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _mapper = mapper;
            _notificationService = notificationService;
            _userManager = userManager;
        }

        [HttpGet("admin/applications")]
        public async Task<IActionResult> GetAdminApplications()
        {
            var applications = await _context.PsychologistApplications
                .Include(a => a.User)
                .Include(a => a.Specializations)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            var response = _mapper.Map<List<PsychologistApplicationResponseDto>>(applications);

            return Ok(Response<List<PsychologistApplicationResponseDto>>.Success(response, "GET SUCCESS"));

        }

        [HttpPost("review-application/{applicationId}")]
        public async Task<IActionResult> ReviewApplication(Guid applicationId, [FromQuery] bool isApproved)
        {
            var reviewerId = User.GetUserId();
            var app = await _context.PsychologistApplications
                .Include(a => a.Specializations)
                .FirstOrDefaultAsync(a => a.Id == applicationId);

            if (app == null)
            {
                return NotFound();
            }

            app.Status = isApproved ? ApplicationStatus.Approved : ApplicationStatus.Rejected;
            app.ReviewedAt = DateTime.UtcNow;
            app.ReviewedById = reviewerId;

            await _context.SaveChangesAsync();

            if (isApproved)
            {
                var user = await _userManager.FindByIdAsync(app.UserId.ToString());
                if (user != null && !await _userManager.IsInRoleAsync(user, "Psychologist"))
                {
                    await _userManager.AddToRoleAsync(user, "Psychologist");

                    var existingProfile = await _context.Psychologists.FirstOrDefaultAsync(p => p.UserId == app.UserId);

                    if (existingProfile == null)
                    {
                        var newProfile = new Psychologist
                        {
                            UserId = app.UserId,
                            IsPublished = false,
                            Education = app.Education,
                            ExperienceYears = app.ExperienceYears,
                            Specializations = app.Specializations.ToList(),
                            ContactPhone = app.Phone,
                        };
                        _context.Psychologists.Add(newProfile);
                    }
                }
            }

            var notificationTitle = isApproved ? "Application Approved" : "Application Rejected";
            var notificationMessage = isApproved
                ? "Congratulations! Your application to become a psychologist has been approved."
                : "Unfortunately, your application to become a psychologist was rejected. You can review your information and submit again.";

            await _notificationService.SendNotificationAsync(new CreateNotificationDto
            {
                UserId = app.UserId,
                Title = notificationTitle,
                Message = notificationMessage,
                Type = NotificationType.Application,
                RelatedEntityId = app.Id
            });

            return Ok();
        }
    }
}
