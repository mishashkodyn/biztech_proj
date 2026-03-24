using API.Common;
using API.Core.DTOs.PsychologistApplication;
using API.Infrastructure.Data;
using AutoMapper;
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

        public ApplicationsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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
    }
}
