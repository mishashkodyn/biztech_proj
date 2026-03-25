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
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            var response = _mapper.Map<List<PsychologistApplicationResponseDto>>(applications);

            return Ok(Response<List<PsychologistApplicationResponseDto>>.Success(response, "GET SUCCESS"));
        }

        [HttpPost("approve-application/{applicationId}")]
        public async Task<IActionResult> ApproveApplication(Guid applicationId)
        {
            var reviewerId = User.GetUserId();

            var app = await _context.PsychologistApplications.FindAsync(applicationId);

            app.Status = ApplicationStatus.Approved;
            app.ReviewedAt = DateTime.UtcNow;
            app.ReviewedById = reviewerId;

            await _context.SaveChangesAsync();

            var user = await _userManager.FindByIdAsync(app.UserId.ToString());
            if (user != null)
            {
                if (!await _userManager.IsInRoleAsync(user, "Psychologist"))
                {
                    await _userManager.AddToRoleAsync(user, "Psychologist");
                }
            }

            await _notificationService.SendNotificationAsync(new CreateNotificationDto
            {
                UserId = app.UserId,
                Title = "Application Approved",
                Message = "Congratulations! Your application to become a psychologist has been approved.",
                Type = NotificationType.Application,
                RelatedEntityId = app.Id
            });

            return Ok();
        }
    }
}
